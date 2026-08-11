/**
 * Auth watchdog.
 *
 * Every linkos process (main + each agent) shares one Claude OAuth credential
 * (via `claude login`, unless ANTHROPIC_API_KEY is set). OAuth access tokens
 * are short-lived and rotate on refresh. With several long-lived processes
 * sharing one credential, a refresh in one process can rotate the token out
 * from under the others, leaving them holding a stale token in memory. From
 * then on every agent call fails with a 401 "Invalid authentication
 * credentials" and the agent goes silent -- it never self-heals, because the
 * dead token stays cached for the life of the process.
 *
 * The fix: when an agent call fails with an auth error, exit the process so
 * launchd (KeepAlive=true) respawns it and it re-reads the current, valid token
 * from the keychain. A persistent restart budget prevents a tight crash-loop
 * when the credential is genuinely dead (revoked / logged out) -- in that case
 * a restart can't help, so we stop restarting and tell the user to re-auth.
 */

import fs from 'node:fs';
import path from 'node:path';

import { STORE_DIR, AGENT_ID } from './config.js';
import { logger } from './logger.js';

/** Auth errors we should recover from by restarting. */
export function isAuthError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return (
    /authentication_error/i.test(msg) ||
    /Failed to authenticate/i.test(msg) ||
    /Invalid authentication credentials/i.test(msg) ||
    /\b401\b[^]*auth/i.test(msg) ||
    /OAuth token (?:has )?expired|token expired/i.test(msg)
  );
}

// Restart budget: if a restart doesn't fix auth this many times inside the
// window, the credential is genuinely dead -- stop looping and ask for re-auth.
const MAX_RESTARTS = 3;
const WINDOW_MS = 10 * 60_000;
const STATE_FILE = path.join(STORE_DIR, `auth-watchdog-${AGENT_ID}.json`);

interface WatchdogState {
  restarts: number[]; // epoch-ms of recent auto-restarts
}

function loadState(): WatchdogState {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) as WatchdogState;
    if (Array.isArray(raw.restarts)) return raw;
  } catch {
    /* no state yet */
  }
  return { restarts: [] };
}

function saveState(state: WatchdogState): void {
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch (err) {
    logger.warn({ err }, 'auth-watchdog: failed to persist state');
  }
}

/** A successful agent turn means the current token works -- clear the budget. */
export function recordAuthSuccess(): void {
  const state = loadState();
  if (state.restarts.length) saveState({ restarts: [] });
}

/**
 * Call from an agent error handler. If `err` is an auth error, either restart
 * the process (to pick up a fresh token) or -- if the restart budget is spent
 * -- report that the credential needs manual re-auth. Returns true if the error
 * was an auth error and was handled here (caller should not send its own
 * generic error message); false otherwise.
 *
 * `notify` is an optional best-effort callback to message the user before exit.
 */
export async function handleAuthError(
  err: unknown,
  notify?: (msg: string) => Promise<void>,
): Promise<boolean> {
  if (!isAuthError(err)) return false;

  const now = Date.now();
  const state = loadState();
  const recent = state.restarts.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_RESTARTS) {
    // Restarting hasn't fixed it -> the credential is dead. Don't loop.
    logger.error(
      { agentId: AGENT_ID, restartsInWindow: recent.length },
      'auth-watchdog: auth still failing after repeated restarts -- credential needs re-auth (run `claude login`)',
    );
    if (notify) {
      await notify(
        "I can't reach Claude -- the login credential looks expired or revoked. " +
          'Restarting has not fixed it. Please run `claude login` on the host, then message me again.',
      ).catch(() => {});
    }
    return true; // handled: suppress the raw error, but stay up
  }

  // Within budget: record and restart so we re-read the keychain token.
  recent.push(now);
  saveState({ restarts: recent });
  logger.warn(
    { agentId: AGENT_ID, restartsInWindow: recent.length },
    'auth-watchdog: auth error detected -- restarting to refresh Claude credentials',
  );
  if (notify) {
    await notify('Hit a stale-auth blip with Claude. Reconnecting now -- resend your message in about 15 seconds.').catch(
      () => {},
    );
  }
  // Give the notify/log a moment to flush, then exit so launchd respawns us.
  setTimeout(() => process.exit(1), 1500);
  return true;
}
