/**
 * Oracle - The all-seeing AI interface for the LinkOS dashboard.
 *
 * Provides:
 * - Chat with full context from all agents, memories, and projects
 * - Speech-to-text (Groq Whisper)
 * - Text-to-speech (ElevenLabs)
 * - Vision (Gemini) when camera is available
 * - Task dispatch to any agent via the mission system
 */

import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { readEnvFile } from './env.js';
import { queryDb, createMissionTask } from './db.js';
import { logger } from './logger.js';

// ── TELOS loader ───────────────────────────────────────────────────

let _telosCache: { text: string; ts: number } | null = null;
const TELOS_CACHE_TTL = 300_000; // 5 min

function loadTelos(): string {
  const now = Date.now();
  if (_telosCache && now - _telosCache.ts < TELOS_CACHE_TTL) return _telosCache.text;
  try {
    const root = process.cwd();
    const text = readFileSync(join(root, 'store', 'telos.md'), 'utf-8');
    _telosCache = { text, ts: now };
    return text;
  } catch {
    return '';
  }
}

// ── Context builders ────────────────────────────────────────────────

/** Get recent activity from all agents */
export function getHiveMindContext(limit = 30): string {
  const rows = queryDb(`
    SELECT agent_id, action, summary, created_at
    FROM hive_mind
    ORDER BY created_at DESC
    LIMIT ?
  `, limit) as { agent_id: string; action: string; summary: string; created_at: number }[];

  if (rows.length === 0) return 'No recent agent activity.';

  return rows.map(r => {
    const ago = Math.round((Date.now() / 1000 - r.created_at) / 3600);
    return `[${r.agent_id}] ${ago}h ago: ${r.summary}`;
  }).join('\n');
}

/** Get high-salience memories */
export function getMemoryContext(limit = 20): string {
  const rows = queryDb(`
    SELECT summary, topics, salience
    FROM memories
    ORDER BY salience DESC, accessed_at DESC
    LIMIT ?
  `, limit) as { summary: string; topics: string; salience: number }[];

  if (rows.length === 0) return 'No memories stored.';

  return rows.map(r => `[${r.salience.toFixed(1)}] ${r.summary} (${r.topics})`).join('\n');
}

/** Get recent conversations across all agents */
export function getRecentConversations(limit = 20): string {
  const rows = queryDb(`
    SELECT agent_id, role, substr(content, 1, 300) as content, created_at
    FROM conversation_log
    ORDER BY created_at DESC
    LIMIT ?
  `, limit) as { agent_id: string; role: string; content: string; created_at: number }[];

  if (rows.length === 0) return 'No recent conversations.';

  return rows.map(r => {
    const ago = Math.round((Date.now() / 1000 - r.created_at) / 60);
    return `[${r.agent_id}/${r.role}] ${ago}m ago: ${r.content}`;
  }).join('\n');
}

/** Get active/recent mission tasks */
export function getMissionContext(): string {
  const rows = queryDb(`
    SELECT id, title, assigned_agent, status, prompt, result, created_at
    FROM mission_tasks
    WHERE status IN ('queued', 'running') OR (status = 'completed' AND completed_at > ?)
    ORDER BY created_at DESC
    LIMIT 20
  `, Math.floor(Date.now() / 1000) - 86400) as {
    id: string; title: string; assigned_agent: string; status: string;
    prompt: string; result: string | null; created_at: number;
  }[];

  if (rows.length === 0) return 'No active mission tasks.';

  return rows.map(r => {
    return `[${r.status}] @${r.assigned_agent}: ${r.title}${r.result ? ` -> ${r.result.slice(0, 200)}` : ''}`;
  }).join('\n');
}

/** Get list of available agents */
export function getAgentList(): string {
  const rows = queryDb(`
    SELECT agent_id, telegram_connected, bot_username, last_heartbeat
    FROM agent_status
    ORDER BY last_heartbeat DESC
  `) as { agent_id: string; telegram_connected: number; bot_username: string | null; last_heartbeat: number }[];

  if (rows.length === 0) return 'Agents: main, smith, neo, ops, research (default roster)';

  return 'Available agents:\n' + rows.map(r => {
    const ago = Math.round((Date.now() / 1000 - r.last_heartbeat) / 3600);
    const status = r.telegram_connected ? 'online' : 'offline';
    return `- ${r.agent_id} (${status}, heartbeat ${ago}h ago)`;
  }).join('\n');
}

// ── Oracle system prompt (cached, 30s TTL) ──────────────────────────

let _promptCache: { text: string; ts: number } | null = null;
const PROMPT_CACHE_TTL = 30_000;

function buildSystemPrompt(): string {
  const now = Date.now();
  if (_promptCache && now - _promptCache.ts < PROMPT_CACHE_TTL) {
    return _promptCache.text;
  }
  const memories = getMemoryContext();
  const hiveMind = getHiveMindContext();
  const missions = getMissionContext();
  const agents = getAgentList();
  const conversations = getRecentConversations();
  const telos = loadTelos();

  const text = `You are the Oracle - the all-seeing AI interface. You are the hive mind connecting all agents and all projects. You see everything, remember everything, and can direct any agent to do anything.

Your personality: calm, grounded, direct. You speak with authority because you have full context. You sound natural, like a knowledgeable person in conversation, not a robot reading a script.

CRITICAL - THIS IS A VOICE INTERFACE:
- Keep responses to 1-3 sentences unless the user specifically asks for detail or a list.
- Talk naturally. No bullet points, no markdown, no formatting. Just speak.
- No em dashes. Ever.
- No AI cliches. No "certainly", "great question", "I'd be happy to".
- Don't preface with filler. Answer directly.
- Match the user's energy. Short question gets a short answer. Detailed question gets more detail.
- When the user asks you to do something, dispatch it to the right agent using the task system.
- When the user asks about something, check the context below first before saying you don't know.

${telos ? `TELOS (the user's mission, goals, and mental models - use this to align every response):\n${telos}\n` : ''}THINKING SKILLS:
When the user asks for deep analysis, strategic thinking, or says keywords like "red team", "first principles", "think through", "debate this", or "root cause", activate the matching thinking mode:

RED TEAM: Challenge the idea. Find every flaw, risk, blind spot, and failure mode. Be adversarial. Don't soften it. End with "the strongest version of this would be..." and give the fix.

FIRST PRINCIPLES: Strip away assumptions. What is actually true here? Break the problem down to its fundamental components, then rebuild the answer from those truths. Ignore convention and "how it's usually done."

COUNCIL: Argue three perspectives - the Operator (ship it, revenue now), the Architect (build it right, compounding value), and the Contrarian (why this is the wrong problem entirely). Then synthesize.

ROOT CAUSE: Don't treat symptoms. Ask "why" five times. Trace the problem back to its origin. The answer is always upstream of where it looks like the problem is.

THE ALGORITHM: For complex decisions, run this loop: (1) Observe - what do we actually know? (2) Orient - what context matters? (3) Hypothesize - what are the options? (4) Test - what evidence supports each? (5) Evaluate - which holds up? (6) Decide - commit to one. (7) Act - what's the next concrete step?

ISA TASK DISPATCH: When dispatching tasks to agents, structure them as Ideal State Artifacts:

AVAILABLE AGENTS:
${agents}

To dispatch a task, include this JSON block in your response (the system will parse and execute it):
\`\`\`task
{"agent": "smith", "title": "Short label", "prompt": "GOAL: [what done looks like]\\nCRITERIA: [acceptance checklist]\\nCONTEXT: [relevant background]\\nINSTRUCTIONS: [step by step]", "priority": 5}
\`\`\`

RECENT AGENT ACTIVITY (hive mind):
${hiveMind}

KEY MEMORIES:
${memories}

ACTIVE MISSIONS:
${missions}

RECENT CONVERSATIONS:
${conversations}

Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;

  _promptCache = { text, ts: Date.now() };
  return text;
}

// ── Chat handler ────────────────────────────────────────────────────

interface OracleMessage {
  role: 'user' | 'assistant';
  content: string;
}

// In-memory conversation history for the oracle session
let oracleHistory: OracleMessage[] = [];

export async function oracleChat(userMessage: string, imageBase64?: string): Promise<string> {
  const secrets = readEnvFile(['ANTHROPIC_API_KEY', 'GOOGLE_API_KEY']);
  const anthropicKey = secrets.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const geminiKey = secrets.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

  const systemPrompt = buildSystemPrompt();

  // Add user message to history
  oracleHistory.push({ role: 'user', content: userMessage });

  // Keep history manageable (last 20 exchanges)
  if (oracleHistory.length > 40) {
    oracleHistory = oracleHistory.slice(-40);
  }

  let response: string;

  // If there's an image, use Gemini for vision
  if (imageBase64 && geminiKey) {
    response = await oracleVisionChat(systemPrompt, userMessage, imageBase64, geminiKey);
  } else if (anthropicKey) {
    response = await oracleAnthropicChat(systemPrompt, anthropicKey);
  } else if (geminiKey) {
    response = await oracleGeminiChat(systemPrompt, geminiKey);
  } else {
    response = 'No AI API key configured. Set ANTHROPIC_API_KEY or GOOGLE_API_KEY in .env.';
  }

  // Add assistant response to history
  oracleHistory.push({ role: 'assistant', content: response });

  // Parse and execute any task dispatches
  await executeTaskDispatches(response);

  return response;
}

async function oracleAnthropicChat(systemPrompt: string, apiKey: string): Promise<string> {
  const messages = oracleHistory.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    logger.error({ status: res.status, body: err }, 'Oracle: Anthropic API error');
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  const result = await res.json() as { content: Array<{ type: string; text: string }> };
  return result.content.filter(b => b.type === 'text').map(b => b.text).join('');
}

async function oracleGeminiChat(systemPrompt: string, apiKey: string): Promise<string> {
  const contents = oracleHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    logger.error({ status: res.status, body: err }, 'Oracle: Gemini API error');
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
}

async function oracleVisionChat(
  systemPrompt: string, userMessage: string, imageBase64: string, apiKey: string,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{
          role: 'user',
          parts: [
            { text: userMessage },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          ],
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    logger.error({ status: res.status, body: err }, 'Oracle: Vision API error');
    throw new Error(`Vision API error: ${res.status}`);
  }

  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze the image.';
}

// ── Streaming chat handler ─────────────────────────────────────────

export async function* oracleChatStream(userMessage: string, imageBase64?: string): AsyncGenerator<string> {
  const secrets = readEnvFile(['ANTHROPIC_API_KEY', 'GOOGLE_API_KEY']);
  const anthropicKey = secrets.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const geminiKey = secrets.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

  const systemPrompt = buildSystemPrompt();

  oracleHistory.push({ role: 'user', content: userMessage });
  if (oracleHistory.length > 40) {
    oracleHistory = oracleHistory.slice(-40);
  }

  // Vision or Gemini fallback: yield full response at once
  if (imageBase64 && geminiKey) {
    const response = await oracleVisionChat(systemPrompt, userMessage, imageBase64, geminiKey);
    oracleHistory.push({ role: 'assistant', content: response });
    await executeTaskDispatches(response);
    yield response;
    return;
  }

  if (!anthropicKey) {
    if (geminiKey) {
      const response = await oracleGeminiChat(systemPrompt, geminiKey);
      oracleHistory.push({ role: 'assistant', content: response });
      await executeTaskDispatches(response);
      yield response;
      return;
    }
    yield 'No AI API key configured.';
    return;
  }

  // Stream from Anthropic
  const messages = oracleHistory.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    logger.error({ status: res.status, body: err }, 'Oracle: Streaming API error');
    throw new Error(`Anthropic streaming error: ${res.status}`);
  }

  let fullResponse = '';
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    sseBuffer += decoder.decode(value, { stream: true });
    const lines = sseBuffer.split('\n');
    sseBuffer = lines.pop()!;

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' && parsed.delta?.text) {
          fullResponse += parsed.delta.text;
          yield parsed.delta.text;
        }
      } catch {
        // skip non-JSON lines (e.g. event: lines)
      }
    }
  }

  oracleHistory.push({ role: 'assistant', content: fullResponse });
  await executeTaskDispatches(fullResponse);
}

// ── Task dispatch parser ────────────────────────────────────────────

async function executeTaskDispatches(response: string): Promise<void> {
  const taskRegex = /```task\s*\n?([\s\S]*?)\n?```/g;
  let match;

  while ((match = taskRegex.exec(response)) !== null) {
    try {
      const task = JSON.parse(match[1]!) as {
        agent: string;
        title: string;
        prompt: string;
        priority?: number;
      };

      if (task.agent && task.title && task.prompt) {
        const taskId = randomUUID().slice(0, 8);
        createMissionTask(taskId, task.title, task.prompt, task.agent, 'oracle', task.priority ?? 5);
        logger.info({ agent: task.agent, title: task.title }, 'Oracle: dispatched task');
      }
    } catch (e) {
      logger.warn({ block: match[1]?.slice(0, 200) }, 'Oracle: failed to parse task block');
    }
  }
}

// ── STT handler ─────────────────────────────────────────────────────

export async function oracleSTT(audioBuffer: Buffer): Promise<string> {
  const secrets = readEnvFile(['GROQ_API_KEY']);
  const groqKey = secrets.GROQ_API_KEY || process.env.GROQ_API_KEY;

  if (!groqKey) throw new Error('GROQ_API_KEY not configured');

  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('language', 'en');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqKey}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`STT error: ${res.status} ${err}`);
  }

  const data = await res.json() as { text: string };
  return data.text;
}

// ── TTS handler ─────────────────────────────────────────────────────

export async function oracleTTS(text: string): Promise<Buffer> {
  const secrets = readEnvFile(['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID']);
  const apiKey = secrets.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
  // Lexie - British storyteller, conversational, emotional, engaging
  const voiceId = secrets.ELEVENLABS_VOICE_ID || process.env.ELEVENLABS_VOICE_ID || 'KeMlo4IJd6GMKdqA5lLY';

  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_flash_v2_5',
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS error: ${res.status} ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/** Reset the oracle conversation */
export function resetOracleHistory(): void {
  oracleHistory = [];
}
