import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import { readEnvFile } from './env.js';

const envConfig = readEnvFile([
  'TELEGRAM_BOT_TOKEN',
  'ALLOWED_CHAT_ID',
  'GROQ_API_KEY',
  'ELEVENLABS_API_KEY',
  'ELEVENLABS_VOICE_ID',
  'WHATSAPP_ENABLED',
  'SLACK_USER_TOKEN',
  'SLACK_BOT_TOKEN',
  'SLACK_APP_TOKEN',
  'SLACK_SIGNING_SECRET',
  'CONTEXT_LIMIT',
  'DASHBOARD_PORT',
  'DASHBOARD_TOKEN',
  'DASHBOARD_URL',
  'LINKOS_CONFIG',
  'DB_ENCRYPTION_KEY',
  'GOOGLE_API_KEY',
  'AGENT_TIMEOUT_MS',
  'SECURITY_PIN_HASH',
  'IDLE_LOCK_MINUTES',
  'EMERGENCY_KILL_PHRASE',
  'STRIPE_SECRET_KEY',
  'HUBSPOT_ACCESS_TOKEN',
  'WHOOP_CLIENT_ID',
  'WHOOP_CLIENT_SECRET',
  'GRANOLA_CLIENT_ID',
  'GRANOLA_REFRESH_TOKEN',
  'GRANOLA_TOKEN_URL',
  'GRANOLA_MCP_URL',
  'DASHBOARD_PASSWORD_HASH',
  'DASHBOARD_TOTP_SECRET',
  'SHOPIFY_CLIENT_ID',
  'SHOPIFY_CLIENT_SECRET',
  'SHOPIFY_STORE_DOMAIN',
  'SHOPIFY_STOREFRONT_TOKEN',
]);

// ── Multi-agent support ──────────────────────────────────────────────
// These are mutable and overridden by index.ts when --agent is passed.
export let AGENT_ID = 'main';
export let activeBotToken =
  process.env.TELEGRAM_BOT_TOKEN || envConfig.TELEGRAM_BOT_TOKEN || '';
export let agentCwd: string | undefined; // undefined = use PROJECT_ROOT
export let agentDefaultModel: string | undefined; // from agent.yaml
export let agentObsidianConfig: { vault: string; folders: string[]; readOnly?: string[] } | undefined;
export let agentSystemPrompt: string | undefined; // loaded from agents/{id}/CLAUDE.md

export function setAgentOverrides(opts: {
  agentId: string;
  botToken: string;
  cwd: string;
  model?: string;
  obsidian?: { vault: string; folders: string[]; readOnly?: string[] };
  systemPrompt?: string;
}): void {
  AGENT_ID = opts.agentId;
  activeBotToken = opts.botToken;
  agentCwd = opts.cwd;
  agentDefaultModel = opts.model;
  agentObsidianConfig = opts.obsidian;
  agentSystemPrompt = opts.systemPrompt;
}

export const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || envConfig.TELEGRAM_BOT_TOKEN || '';

// Only respond to this Telegram chat ID. Set this after getting your ID via /chatid.
export const ALLOWED_CHAT_ID =
  process.env.ALLOWED_CHAT_ID || envConfig.ALLOWED_CHAT_ID || '';

export const WHATSAPP_ENABLED =
  (process.env.WHATSAPP_ENABLED || envConfig.WHATSAPP_ENABLED || '').toLowerCase() === 'true';

export const SLACK_USER_TOKEN =
  process.env.SLACK_USER_TOKEN || envConfig.SLACK_USER_TOKEN || '';

// Slack Bot (Socket Mode) — for receiving commands via Slack mentions/DMs
export const SLACK_BOT_TOKEN =
  process.env.SLACK_BOT_TOKEN || envConfig.SLACK_BOT_TOKEN || '';
export const SLACK_APP_TOKEN =
  process.env.SLACK_APP_TOKEN || envConfig.SLACK_APP_TOKEN || '';
export const SLACK_SIGNING_SECRET =
  process.env.SLACK_SIGNING_SECRET || envConfig.SLACK_SIGNING_SECRET || '';

// Voice — read via readEnvFile, not process.env
export const GROQ_API_KEY = envConfig.GROQ_API_KEY ?? '';
export const ELEVENLABS_API_KEY = envConfig.ELEVENLABS_API_KEY ?? '';
export const ELEVENLABS_VOICE_ID = envConfig.ELEVENLABS_VOICE_ID ?? '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PROJECT_ROOT is the linkos/ directory — where CLAUDE.md lives.
// The SDK uses this as cwd, which causes Claude Code to load our CLAUDE.md
// and all global skills from ~/.claude/skills/ via settingSources.
export const PROJECT_ROOT = path.resolve(__dirname, '..');
export const STORE_DIR = path.resolve(PROJECT_ROOT, 'store');

// ── External config directory ────────────────────────────────────────
// Personal config files (CLAUDE.md, agent.yaml, agent CLAUDE.md) can live
// outside the repo in LINKOS_CONFIG (default ~/.linkos) so they
// never get committed. The repo ships only .example template files.

/** Expand ~/... to an absolute path. */
export function expandHome(p: string): string {
  if (p.startsWith('~/') || p === '~') {
    return path.join(os.homedir(), p.slice(1));
  }
  return p;
}

const rawConfigDir =
  process.env.LINKOS_CONFIG || envConfig.LINKOS_CONFIG || '~/.linkos';

/**
 * Absolute path to the external config directory.
 * Defaults to ~/.linkos. Set LINKOS_CONFIG in .env or environment to override.
 */
export const LINKOS_CONFIG = expandHome(rawConfigDir);

// Telegram limits
export const MAX_MESSAGE_LENGTH = 4096;

// How often to refresh the typing indicator while Claude is thinking (ms).
// Telegram's typing action expires after ~5s, so 4s keeps it continuous.
export const TYPING_REFRESH_MS = 4000;

// Maximum time (ms) an agent query can run before being auto-aborted.
// Safety net for truly stuck commands (e.g. recursive `find /`).
// Default: 15 minutes. Use /stop in Telegram to manually kill a running query.
// Previously 5 min, which caused mid-execution timeouts on bulk API work
// (posting YouTube comments, sending multiple messages) leading to duplicate posts.
export const AGENT_TIMEOUT_MS = parseInt(
  process.env.AGENT_TIMEOUT_MS || envConfig.AGENT_TIMEOUT_MS || '900000',
  10,
);

// Context window limit for the model. Opus 4.6 (1M context) = 1,000,000.
// Override via CONTEXT_LIMIT in .env if using a different model variant.
export const CONTEXT_LIMIT = parseInt(
  process.env.CONTEXT_LIMIT || envConfig.CONTEXT_LIMIT || '1000000',
  10,
);

// Dashboard — web UI for monitoring LinkOS state
export const DASHBOARD_PORT = parseInt(
  process.env.DASHBOARD_PORT || envConfig.DASHBOARD_PORT || '3141',
  10,
);
export const DASHBOARD_TOKEN =
  process.env.DASHBOARD_TOKEN || envConfig.DASHBOARD_TOKEN || '';
export const DASHBOARD_URL =
  process.env.DASHBOARD_URL || envConfig.DASHBOARD_URL || '';
export const DASHBOARD_PASSWORD_HASH =
  process.env.DASHBOARD_PASSWORD_HASH || envConfig.DASHBOARD_PASSWORD_HASH || '';
export const DASHBOARD_TOTP_SECRET =
  process.env.DASHBOARD_TOTP_SECRET || envConfig.DASHBOARD_TOTP_SECRET || '';

// Database encryption key (SQLCipher). Required for encrypted database access.
export const DB_ENCRYPTION_KEY =
  process.env.DB_ENCRYPTION_KEY || envConfig.DB_ENCRYPTION_KEY || '';

// Google API key for Gemini (memory extraction + consolidation)
export const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY || envConfig.GOOGLE_API_KEY || '';

// Streaming strategy for progressive Telegram updates.
// 'global-throttle' (default): edits a placeholder message with streamed text,
//   rate-limited to ~24 edits/min per chat to respect Telegram limits.
// 'single-agent-only': streaming disabled when multiple agents are active on same chat.
// 'off': no streaming, wait for full response.
export type StreamStrategy = 'global-throttle' | 'single-agent-only' | 'off';
export const STREAM_STRATEGY: StreamStrategy =
  (process.env.STREAM_STRATEGY || 'off') as StreamStrategy;

// ── Security ─────────────────────────────────────────────────────────
// PIN lock: SHA-256 hash of your PIN. Generate: node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PIN').digest('hex'))"
export const SECURITY_PIN_HASH =
  process.env.SECURITY_PIN_HASH || envConfig.SECURITY_PIN_HASH || '';

// Auto-lock after N minutes of inactivity. 0 = disabled. Only active when PIN is set.
export const IDLE_LOCK_MINUTES = parseInt(
  process.env.IDLE_LOCK_MINUTES || envConfig.IDLE_LOCK_MINUTES || '0',
  10,
);

// Emergency kill phrase. Sending this to any bot immediately stops all agents and exits.
export const EMERGENCY_KILL_PHRASE =
  process.env.EMERGENCY_KILL_PHRASE || envConfig.EMERGENCY_KILL_PHRASE || '';

// Stripe — for sales tracking on the dashboard
export const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY || envConfig.STRIPE_SECRET_KEY || '';

// HubSpot — for sales team performance tracking on the dashboard
export const HUBSPOT_ACCESS_TOKEN =
  process.env.HUBSPOT_ACCESS_TOKEN || envConfig.HUBSPOT_ACCESS_TOKEN || '';

// WHOOP — health & recovery tracking on the CEO dashboard
export const WHOOP_CLIENT_ID =
  process.env.WHOOP_CLIENT_ID || envConfig.WHOOP_CLIENT_ID || '';
export const WHOOP_CLIENT_SECRET =
  process.env.WHOOP_CLIENT_SECRET || envConfig.WHOOP_CLIENT_SECRET || '';

// Shopify — store integration
export const SHOPIFY_CLIENT_ID =
  process.env.SHOPIFY_CLIENT_ID || envConfig.SHOPIFY_CLIENT_ID || '';
export const SHOPIFY_CLIENT_SECRET =
  process.env.SHOPIFY_CLIENT_SECRET || envConfig.SHOPIFY_CLIENT_SECRET || '';
export const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || envConfig.SHOPIFY_STORE_DOMAIN || '';
export const SHOPIFY_STOREFRONT_TOKEN =
  process.env.SHOPIFY_STOREFRONT_TOKEN || envConfig.SHOPIFY_STOREFRONT_TOKEN || '';

// Granola — meeting notes integration on the CEO dashboard
export const GRANOLA_CLIENT_ID =
  process.env.GRANOLA_CLIENT_ID || envConfig.GRANOLA_CLIENT_ID || '';
export const GRANOLA_REFRESH_TOKEN =
  process.env.GRANOLA_REFRESH_TOKEN || envConfig.GRANOLA_REFRESH_TOKEN || '';
export const GRANOLA_TOKEN_URL =
  process.env.GRANOLA_TOKEN_URL || envConfig.GRANOLA_TOKEN_URL || 'https://mcp-auth.granola.ai/oauth2/token';
export const GRANOLA_MCP_URL =
  process.env.GRANOLA_MCP_URL || envConfig.GRANOLA_MCP_URL || 'https://mcp.granola.ai/mcp';

