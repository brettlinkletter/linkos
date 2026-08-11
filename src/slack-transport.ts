/**
 * Slack Socket Mode transport for LinkOS.
 *
 * Listens for @mentions and DMs via Slack's Socket Mode (no public URL needed).
 * Routes incoming messages through the same runAgent pipeline as Telegram,
 * then posts responses back to the originating Slack channel/thread.
 */

import { App, LogLevel } from '@slack/bolt';

import { runAgent, AgentProgressEvent } from './agent.js';
import {
  AGENT_ID,
  AGENT_TIMEOUT_MS,
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  agentDefaultModel,
  agentSystemPrompt,
} from './config.js';
import { getSession, setSession, getRecentTaskOutputs, saveTokenUsage } from './db.js';
import { logger } from './logger.js';
import { buildMemoryContext, saveConversationTurn, evaluateMemoryRelevance } from './memory.js';
import { messageQueue } from './message-queue.js';
import { parseDelegation, delegateToAgent } from './orchestrator.js';
import { emitChatEvent, setProcessing, setActiveAbort } from './state.js';
import { snapshotClaudeDescendants, reapLeakedSubprocesses } from './proc-reaper.js';
import { handleAuthError, recordAuthSuccess } from './auth-watchdog.js';

let app: App | null = null;
let botUserId: string | null = null;

/**
 * Check whether Slack Socket Mode is configured (all three tokens present).
 */
export function isSlackTransportEnabled(): boolean {
  return !!(SLACK_BOT_TOKEN && SLACK_APP_TOKEN && SLACK_SIGNING_SECRET);
}

/**
 * Split a long message into Slack-safe chunks (~3900 chars to leave room for formatting).
 */
function splitSlackMessage(text: string, limit = 3900): string[] {
  if (text.length <= limit) return [text];
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > limit) {
    const chunk = remaining.slice(0, limit);
    const lastNewline = chunk.lastIndexOf('\n');
    const splitAt = lastNewline > limit / 2 ? lastNewline : limit;
    parts.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

/**
 * Strip the bot mention from the beginning of a message.
 * Slack sends mentions as `<@U12345> do something` in the text.
 */
function stripBotMention(text: string): string {
  if (!botUserId) return text;
  return text.replace(new RegExp(`^\\s*<@${botUserId}>\\s*`, 'i'), '').trim();
}

/**
 * Process a Slack message through the agent pipeline.
 * Mirrors the Telegram handleMessage flow.
 */
async function handleSlackMessage(
  channelId: string,
  threadTs: string | undefined,
  rawText: string,
  userId: string,
  say: (opts: { text: string; thread_ts?: string }) => Promise<unknown>,
): Promise<void> {
  const chatKey = `slack:${channelId}`;
  const text = stripBotMention(rawText);

  if (!text) return;

  logger.info({ channelId, userId, messageLen: text.length, source: 'slack' }, 'Processing Slack message');
  emitChatEvent({ type: 'user_message', chatId: chatKey, content: text, source: 'dashboard' });

  // Delegation detection
  const delegation = parseDelegation(text);
  if (delegation) {
    setProcessing(chatKey, true);
    try {
      const result = await delegateToAgent(
        delegation.agentId,
        delegation.prompt,
        chatKey,
        AGENT_ID,
        (progressMsg) => {
          emitChatEvent({ type: 'progress', chatId: chatKey, description: progressMsg });
        },
      );

      const response = result.text?.trim() || 'Agent completed with no output.';
      const header = `_[${result.agentId} - ${Math.round(result.durationMs / 1000)}s]_`;

      saveConversationTurn(chatKey, delegation.prompt, response, undefined, delegation.agentId);
      emitChatEvent({ type: 'assistant_message', chatId: chatKey, content: response, source: 'dashboard' });

      for (const part of splitSlackMessage(`${header}\n\n${response}`)) {
        await say({ text: part, thread_ts: threadTs });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error({ err, agentId: delegation.agentId }, 'Slack delegation failed');
      await say({ text: `Delegation to ${delegation.agentId} failed: ${errMsg}`, thread_ts: threadTs });
    } finally {
      setProcessing(chatKey, false);
    }
    return;
  }

  // Normal agent flow
  const sessionId = getSession(chatKey, AGENT_ID);

  const { contextText: memCtx, surfacedMemoryIds, surfacedMemorySummaries } = await buildMemoryContext(chatKey, text, AGENT_ID);
  const parts: string[] = [];
  if (agentSystemPrompt && !sessionId) parts.push(`[Agent role - follow these instructions]\n${agentSystemPrompt}\n[End agent role]`);
  if (memCtx) parts.push(memCtx);

  // Inject recent scheduled task outputs
  const recentTasks = getRecentTaskOutputs(AGENT_ID, 30);
  if (recentTasks.length > 0) {
    const taskLines = recentTasks.map((t) => {
      const ago = Math.round((Date.now() / 1000 - t.last_run) / 60);
      return `[Scheduled task ran ${ago}m ago]\nTask: ${t.prompt}\nOutput:\n${t.last_result}`;
    });
    parts.push(`[Recent scheduled task context]\n${taskLines.join('\n\n')}\n[End task context]`);
  }

  // Add source context so the agent knows commands come from Slack
  parts.push(`[Source: Slack channel ${channelId}, user <@${userId}>]`);
  parts.push(text);
  const fullMessage = parts.join('\n\n');

  setProcessing(chatKey, true);

  try {
    // Send initial "thinking" reaction
    // (can't use reactions API through say, but the typing indicator shows activity)

    const onProgress = (event: AgentProgressEvent) => {
      emitChatEvent({ type: 'progress', chatId: chatKey, description: event.description });
    };

    const abortCtrl = new AbortController();
    setActiveAbort(chatKey, abortCtrl);

    const claudeBaseline = snapshotClaudeDescendants();
    const timeoutId = setTimeout(() => {
      logger.warn({ chatId: chatKey, timeoutMs: AGENT_TIMEOUT_MS }, 'Slack agent query timed out');
      abortCtrl.abort();
      void reapLeakedSubprocesses(claudeBaseline, { graceMs: 5000 }).then((killed) => {
        if (killed.length) {
          logger.warn({ chatId: chatKey, killed }, 'Reaped stuck Slack agent subprocesses after timeout');
        }
      });
    }, AGENT_TIMEOUT_MS);

    const result = await runAgent(
      fullMessage,
      sessionId,
      () => {}, // no typing indicator for Slack
      onProgress,
      agentDefaultModel,
      abortCtrl,
    );

    clearTimeout(timeoutId);
    setActiveAbort(chatKey, null);

    if (result.aborted) {
      const msg = result.text === null
        ? `Timed out after ${Math.round(AGENT_TIMEOUT_MS / 1000)}s. Try breaking into smaller steps.`
        : 'Stopped.';
      emitChatEvent({ type: 'assistant_message', chatId: chatKey, content: msg, source: 'dashboard' });
      await say({ text: msg, thread_ts: threadTs });
      setProcessing(chatKey, false);
      return;
    }

    recordAuthSuccess();

    if (result.newSessionId) {
      setSession(chatKey, result.newSessionId, AGENT_ID);
    }

    const rawResponse = result.text?.trim() || 'Done.';

    saveConversationTurn(chatKey, text, rawResponse, result.newSessionId ?? sessionId, AGENT_ID);
    if (surfacedMemoryIds.length > 0) {
      void evaluateMemoryRelevance(surfacedMemoryIds, surfacedMemorySummaries, text, rawResponse).catch(() => {});
    }

    emitChatEvent({ type: 'assistant_message', chatId: chatKey, content: rawResponse, source: 'dashboard' });

    // Send response (split if needed)
    for (const part of splitSlackMessage(rawResponse)) {
      await say({ text: part, thread_ts: threadTs });
    }

    // Log token usage
    if (result.usage) {
      const activeSessionId = result.newSessionId ?? sessionId;
      try {
        saveTokenUsage(
          chatKey,
          activeSessionId,
          result.usage.inputTokens,
          result.usage.outputTokens,
          result.usage.lastCallCacheRead,
          result.usage.lastCallCacheRead + result.usage.lastCallInputTokens,
          result.usage.totalCostUsd,
          result.usage.didCompact,
          AGENT_ID,
        );
      } catch (dbErr) {
        logger.error({ err: dbErr }, 'Failed to save Slack token usage');
      }
    }
  } catch (err) {
    setActiveAbort(chatKey, null);
    logger.error({ err }, 'Slack agent error');
    if (await handleAuthError(err, async (m) => { await say({ text: m, thread_ts: threadTs }); })) {
      return;
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    const shortErr = errMsg.length > 300 ? errMsg.slice(0, 300) + '...' : errMsg;
    await say({ text: `Something went wrong:\n\n${shortErr}`, thread_ts: threadTs });
  } finally {
    setProcessing(chatKey, false);
  }
}

/**
 * Start the Slack Socket Mode transport.
 * Returns the Bolt App instance for later shutdown.
 */
export async function startSlackTransport(): Promise<void> {
  if (!isSlackTransportEnabled()) {
    logger.info('Slack Socket Mode not configured (missing SLACK_BOT_TOKEN/SLACK_APP_TOKEN/SLACK_SIGNING_SECRET)');
    return;
  }

  app = new App({
    token: SLACK_BOT_TOKEN,
    appToken: SLACK_APP_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    socketMode: true,
    logLevel: LogLevel.WARN,
  });

  // Resolve our own bot user ID so we can strip self-mentions
  try {
    const auth = await app.client.auth.test({ token: SLACK_BOT_TOKEN });
    botUserId = auth.user_id as string;
    logger.info({ botUserId }, 'Slack bot authenticated');
  } catch (err) {
    logger.error({ err }, 'Failed to authenticate Slack bot');
    return;
  }

  // Handle @mentions in channels
  app.event('app_mention', async ({ event, say }) => {
    const channelId = event.channel;
    const threadTs = event.thread_ts ?? event.ts;
    const userId = event.user ?? 'unknown';
    const text = event.text ?? '';

    messageQueue.enqueue(`slack:${channelId}`, () =>
      handleSlackMessage(channelId, threadTs, text, userId, say as unknown as (opts: { text: string; thread_ts?: string }) => Promise<unknown>),
    );
  });

  // Handle DMs (direct messages to the bot)
  app.event('message', async ({ event, say }) => {
    // Only handle DMs (channel_type: 'im'), skip channel messages (handled by app_mention)
    const ev = event as unknown as Record<string, unknown>;
    if (ev['channel_type'] !== 'im') return;

    // Skip bot messages, message_changed, etc.
    if (ev['subtype']) return;

    const channelId = ev['channel'] as string;
    const userId = ev['user'] as string;
    const text = (ev['text'] as string) ?? '';
    const threadTs = (ev['thread_ts'] as string) ?? undefined;

    if (!text || !userId) return;

    messageQueue.enqueue(`slack:${channelId}`, () =>
      handleSlackMessage(channelId, threadTs, text, userId, say as unknown as (opts: { text: string; thread_ts?: string }) => Promise<unknown>),
    );
  });

  await app.start();
  logger.info({ botUserId }, 'Slack Socket Mode transport running');
  console.log(`  Slack Socket Mode online: bot user ${botUserId}`);
  console.log(`  Mention @mr_smith in any channel to interact`);
}

/**
 * Stop the Slack Socket Mode transport gracefully.
 */
export async function stopSlackTransport(): Promise<void> {
  if (app) {
    try {
      await app.stop();
      logger.info('Slack Socket Mode transport stopped');
    } catch (err) {
      logger.error({ err }, 'Error stopping Slack transport');
    }
    app = null;
  }
}
