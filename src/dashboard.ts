import { Api, RawApi } from 'grammy';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { serve } from '@hono/node-server';
import { oracleChat, oracleChatStream, oracleSTT, oracleTTS, resetOracleHistory } from './oracle.js';

import fs from 'fs';
import path from 'path';
import { AGENT_ID, ALLOWED_CHAT_ID, DASHBOARD_PORT, DASHBOARD_URL, DASHBOARD_TOKEN, DASHBOARD_PASSWORD_HASH, DASHBOARD_TOTP_SECRET, PROJECT_ROOT, STORE_DIR, WHATSAPP_ENABLED, SLACK_USER_TOKEN, CONTEXT_LIMIT, agentDefaultModel, STRIPE_SECRET_KEY, HUBSPOT_ACCESS_TOKEN, WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, GRANOLA_CLIENT_ID, GRANOLA_REFRESH_TOKEN, GRANOLA_TOKEN_URL, GRANOLA_MCP_URL, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOPIFY_STORE_DOMAIN } from './config.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import {
  getAllScheduledTasks,
  deleteScheduledTask,
  pauseScheduledTask,
  resumeScheduledTask,
  getConversationPage,
  getDashboardMemoryStats,
  getDashboardPinnedMemories,
  getDashboardLowSalienceMemories,
  getDashboardTopAccessedMemories,
  getDashboardMemoryTimeline,
  getDashboardConsolidations,
  getDashboardMemoriesList,
  getKnowledgeGraphData,
  getPersonalPulseCache,
  setPersonalPulseCache,
  getDashboardTokenStats,
  getDashboardCostTimeline,
  getDashboardRecentTokenUsage,
  getSession,
  getSessionTokenUsage,
  getHiveMindEntries,
  getAgentTokenStats,
  getAgentRecentConversation,
  getMissionTasks,
  getMissionTask,
  createMissionTask,
  cancelMissionTask,
  deleteMissionTask,
  reassignMissionTask,
  assignMissionTask,
  getUnassignedMissionTasks,
  getMissionTaskHistory,
  getAuditLog,
  getAuditLogCount,
  getRecentBlockedActions,
  getDbTables,
  getDbTableNames,
  getDbTableRows,
  runReadOnlyQuery,
  decryptField,
  getAllAgentStatuses,
  insertAuditLog,
  createBuilderProject,
  listBuilderProjects,
  getBuilderProject,
  deleteBuilderProject,
  getBuilderFiles,
  saveBuilderFiles,
  saveBuilderFile,
  getBuilderMessages,
  saveBuilderMessage,
  createBuilderVersion,
  listBuilderVersions,
  restoreBuilderVersion,
  listDevProjects,
  getDevProject,
  createDevProject,
  updateDevProject,
  deleteDevProject,
  addDevProjectUpdate,
  getDevProjectUpdates,
  getRecentDevActivity,
} from './db.js';
import { generateContent, generateText, parseJsonResponse } from './gemini.js';
import { getSecurityStatus } from './security.js';
import { listAgentIds, loadAgentConfig, setAgentModel } from './agent-config.js';
import {
  listTemplates,
  validateAgentId,
  validateBotToken,
  createAgent,
  activateAgent,
  deactivateAgent,
  deleteAgent,
  suggestBotNames,
  isAgentRunning,
} from './agent-create.js';
import { readEnvFile } from './env.js';
import { processMessageFromDashboard } from './bot.js';
import { getDashboardHtml } from './dashboard-html.js';
import { logger } from './logger.js';
import { getTelegramConnected, getBotInfo, chatEvents, getIsProcessing, abortActiveQuery, ChatEvent } from './state.js';

async function classifyTaskAgent(prompt: string): Promise<string | null> {
  try {
    const agentIds = listAgentIds();
    const agentDescriptions = agentIds.map((id) => {
      try {
        const config = loadAgentConfig(id);
        return `- ${id}: ${config.description}`;
      } catch { return `- ${id}: (no description)`; }
    });

    const classificationPrompt = `Given these agents and their roles:
- main: Primary assistant, general tasks, anything that doesn't clearly fit another agent
${agentDescriptions.join('\n')}

Which ONE agent is best suited for this task?
Task: "${prompt.slice(0, 500)}"

Reply with JSON: {"agent": "agent_id"}`;

    const response = await generateContent(classificationPrompt);
    const parsed = parseJsonResponse<{ agent: string }>(response);
    if (parsed?.agent) {
      const validAgents = ['main', ...agentIds];
      if (validAgents.includes(parsed.agent)) return parsed.agent;
    }
    return 'main'; // fallback
  } catch (err) {
    logger.error({ err }, 'Auto-assign classification failed');
    return null;
  }
}

export function startDashboard(botApi?: Api<RawApi>): void {
  if (!DASHBOARD_TOKEN) {
    logger.info('DASHBOARD_TOKEN not set, dashboard disabled');
    return;
  }

  const app = new Hono();

  // In-memory session store with activity tracking
  interface DashboardSession {
    authed: boolean;
    created: number;
    lastActivity: number;
  }
  const sessions = new Map<string, DashboardSession>();

  // Rate limiting state (keyed by IP)
  interface RateLimitEntry {
    failCount: number;
    lockedUntil: number; // epoch ms; 0 = not locked
  }
  const loginAttempts = new Map<string, RateLimitEntry>();

  // Pending 2FA sessions: password verified, TOTP not yet entered
  const pending2FA = new Map<string, { created: number; ip: string }>();

  // Granola token state (in-memory, refreshed on demand)
  let granolaAccessToken: string | null = null;
  let granolaTokenExpiresAt = 0;

  async function getGranolaToken(): Promise<string> {
    if (granolaAccessToken && granolaTokenExpiresAt > Math.floor(Date.now() / 1000) + 300) {
      return granolaAccessToken;
    }
    const cachedTokens = getPersonalPulseCache('granola_tokens');
    const refreshToken = cachedTokens ? JSON.parse(cachedTokens.data).refresh_token : GRANOLA_REFRESH_TOKEN;
    const res = await fetch(GRANOLA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: GRANOLA_CLIENT_ID,
      }),
    });
    const data = await res.json() as any;
    if (!data.access_token) throw new Error('Granola token refresh failed');
    granolaAccessToken = data.access_token;
    granolaTokenExpiresAt = Math.floor(Date.now() / 1000) + (data.expires_in || 21600);
    setPersonalPulseCache('granola_tokens', JSON.stringify({
      refresh_token: data.refresh_token || refreshToken,
      access_token: data.access_token,
      expires_at: granolaTokenExpiresAt,
    }));
    return granolaAccessToken!;
  }

  async function callGranolaMcp(toolName: string, args: Record<string, any>, timeoutMs = 15000): Promise<any> {
    const token = await getGranolaToken();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(GRANOLA_MCP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: crypto.randomBytes(4).toString('hex'),
          method: 'tools/call',
          params: { name: toolName, arguments: args },
        }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        granolaAccessToken = null;
        granolaTokenExpiresAt = 0;
        throw new Error('Granola auth expired');
      }
      // Response is SSE format - parse the data line
      const text = await res.text();
      const dataLine = text.split('\n').find(l => l.startsWith('data: '));
      if (!dataLine) throw new Error('Invalid Granola MCP response');
      const result = JSON.parse(dataLine.replace('data: ', ''));
      if (result.error) throw new Error(`Granola MCP error: ${JSON.stringify(result.error)}`);
      return result.result;
    } finally {
      clearTimeout(timer);
    }
  }

  function generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  function parseCookies(header: string | undefined): Record<string, string> {
    if (!header) return {};
    return Object.fromEntries(header.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    }));
  }

  function isAuthenticated(c: any): boolean {
    const cookies = parseCookies(c.req.header('cookie'));
    const sid = cookies['linkos_session'];
    if (!sid) return false;
    const session = sessions.get(sid);
    if (!session || !session.authed) return false;
    // 4-hour session TTL
    if (Date.now() - session.created > 4 * 60 * 60 * 1000) {
      sessions.delete(sid);
      return false;
    }
    // 30-minute idle timeout
    if (Date.now() - session.lastActivity > 30 * 60 * 1000) {
      sessions.delete(sid);
      return false;
    }
    // Bump last activity
    session.lastActivity = Date.now();
    return true;
  }

  function getClientIp(c: any): string {
    return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('cf-connecting-ip')
      || 'unknown';
  }

  function completeLogin(c: any, ip: string, ua: string) {
    // Single active session: clear all previous sessions
    sessions.clear();
    const sid = generateSessionId();
    const now = Date.now();
    sessions.set(sid, { authed: true, created: now, lastActivity: now });
    c.header('Set-Cookie', `linkos_session=${sid}; Path=/; HttpOnly; SameSite=Strict; Max-Age=14400`);
    // Reset rate limiter on success
    loginAttempts.delete(ip);
    insertAuditLog('dashboard', '', 'login_success', `IP=${ip} UA=${ua.slice(0, 200)}`, false);
    return c.json({ ok: true });
  }

  // CORS + security headers
  app.use('*', async (c, next) => {
    c.header('Access-Control-Allow-Origin', c.req.header('origin') || '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type');
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('Referrer-Policy', 'no-referrer');
    if (c.req.method === 'OPTIONS') return c.body(null, 204);
    await next();
  });

  // Global error handler — prevents unhandled throws from killing the server
  app.onError((err, c) => {
    logger.error({ err: err.message }, 'Dashboard request error');
    return c.json({ error: 'Internal server error' }, 500);
  });

  // ── Public demo pages (no auth required) ─────────────────────────────
  app.get('/demo/:filename', async (c) => {
    const filename = c.req.param('filename');
    if (!filename || /[^a-zA-Z0-9._-]/.test(filename) || filename.includes('..')) {
      return c.text('Not found', 404);
    }
    const filePath = path.join(PROJECT_ROOT, filename);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return c.html(content);
    } catch {
      return c.text('Not found', 404);
    }
  });

  // ── Login endpoint (no auth required) ──────────────────────────────────
  app.post('/api/login', async (c) => {
    const ip = getClientIp(c);
    const ua = c.req.header('user-agent') || 'unknown';

    // Rate limit check
    const rl = loginAttempts.get(ip);
    if (rl && rl.lockedUntil > Date.now()) {
      const remainSec = Math.ceil((rl.lockedUntil - Date.now()) / 1000);
      insertAuditLog('dashboard', '', 'login_blocked', `IP=${ip} UA=${ua.slice(0, 200)} locked_for=${remainSec}s`, true);
      return c.json({ error: `Too many attempts. Try again in ${Math.ceil(remainSec / 60)} minutes.` }, 429);
    }

    const body = await c.req.json<{ password?: string }>().catch(() => ({ password: '' }));
    const password = (body as any)?.password?.trim() || '';

    // Bcrypt comparison (fallback to plaintext for migration)
    let passwordValid = false;
    if (DASHBOARD_PASSWORD_HASH) {
      passwordValid = await bcrypt.compare(password, DASHBOARD_PASSWORD_HASH);
    } else {
      passwordValid = !!password && password === DASHBOARD_TOKEN;
    }

    if (!passwordValid) {
      const entry = loginAttempts.get(ip) || { failCount: 0, lockedUntil: 0 };
      entry.failCount++;
      if (entry.failCount >= 5) {
        entry.lockedUntil = Date.now() + 15 * 60 * 1000;
        entry.failCount = 0;
      }
      loginAttempts.set(ip, entry);
      insertAuditLog('dashboard', '', 'login_failed', `IP=${ip} UA=${ua.slice(0, 200)} reason=bad_password`, false);
      return c.json({ error: 'Invalid password' }, 401);
    }

    // Password OK. Check if TOTP is configured
    if (DASHBOARD_TOTP_SECRET) {
      const pendingId = crypto.randomBytes(32).toString('hex');
      pending2FA.set(pendingId, { created: Date.now(), ip });
      setTimeout(() => pending2FA.delete(pendingId), 5 * 60 * 1000);
      return c.json({ requires_2fa: true, pending_token: pendingId });
    }

    // No TOTP -- single-factor login
    return completeLogin(c, ip, ua);
  });

  // ── TOTP verification endpoint ────────────────────────────────────────
  app.post('/api/login/verify-totp', async (c) => {
    const ip = getClientIp(c);
    const ua = c.req.header('user-agent') || 'unknown';

    const rl = loginAttempts.get(ip);
    if (rl && rl.lockedUntil > Date.now()) {
      return c.json({ error: 'Too many attempts. Try again later.' }, 429);
    }

    const body = await c.req.json<{ pending_token?: string; totp_code?: string }>().catch(() => ({}));
    const pendingToken = (body as any)?.pending_token || '';
    const totpCode = (body as any)?.totp_code?.trim() || '';

    const pending = pending2FA.get(pendingToken);
    if (!pending || pending.ip !== ip) {
      insertAuditLog('dashboard', '', 'login_failed', `IP=${ip} UA=${ua.slice(0, 200)} reason=invalid_pending_token`, false);
      return c.json({ error: 'Session expired. Please log in again.' }, 401);
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'LinkOS',
      label: 'Dashboard',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(DASHBOARD_TOTP_SECRET),
    });

    const delta = totp.validate({ token: totpCode, window: 1 });
    if (delta === null) {
      const entry = loginAttempts.get(ip) || { failCount: 0, lockedUntil: 0 };
      entry.failCount++;
      if (entry.failCount >= 5) {
        entry.lockedUntil = Date.now() + 15 * 60 * 1000;
        entry.failCount = 0;
      }
      loginAttempts.set(ip, entry);
      insertAuditLog('dashboard', '', 'login_failed', `IP=${ip} UA=${ua.slice(0, 200)} reason=bad_totp`, false);
      return c.json({ error: 'Invalid code' }, 401);
    }

    pending2FA.delete(pendingToken);
    return completeLogin(c, ip, ua);
  });

  // ── TOTP setup (requires existing auth) ───────────────────────────────
  app.post('/api/totp/setup', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: 'LinkOS',
      label: 'Dashboard',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    const uri = totp.toString();
    const qrDataUrl = await QRCode.toDataURL(uri);
    return c.json({ secret: secret.base32, qr_data_url: qrDataUrl, uri });
  });

  app.post('/api/totp/verify-setup', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json<{ secret?: string; code?: string }>().catch(() => ({}));
    const secretB32 = (body as any)?.secret || '';
    const code = (body as any)?.code?.trim() || '';
    const totp = new OTPAuth.TOTP({
      issuer: 'LinkOS',
      label: 'Dashboard',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretB32),
    });
    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) return c.json({ error: 'Invalid code. Try again.' }, 400);
    return c.json({ ok: true, message: 'TOTP verified. Add to .env: DASHBOARD_TOTP_SECRET=' + secretB32 });
  });

  // ── Logout endpoint ────────────────────────────────────────────────────
  app.post('/api/logout', (c) => {
    const cookies = parseCookies(c.req.header('cookie'));
    const sid = cookies['linkos_session'];
    if (sid) sessions.delete(sid);
    c.header('Set-Cookie', 'linkos_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return c.json({ ok: true });
  });

  // ── Auth check endpoint (no auth required) ─────────────────────────────
  app.get('/api/auth-check', (c) => {
    return c.json({ authenticated: isAuthenticated(c) });
  });

  // ── WHOOP OAuth callback (must be before auth middleware) ──────────
  app.get('/api/whoop/callback', async (c) => {
    const code = c.req.query('code');
    if (!code) return c.text('Missing authorization code', 400);
    if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) return c.text('WHOOP not configured', 500);

    const dashboardUrl = DASHBOARD_URL || `http://localhost:${DASHBOARD_PORT}`;
    const redirectUri = `${dashboardUrl}/api/whoop/callback`;

    try {
      const tokenRes = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: WHOOP_CLIENT_ID,
          client_secret: WHOOP_CLIENT_SECRET,
          redirect_uri: redirectUri,
        }),
      });
      const tokenData = await tokenRes.json() as any;

      if (!tokenData.access_token) {
        logger.error({ tokenData }, 'WHOOP token exchange failed');
        return c.text('Token exchange failed: ' + JSON.stringify(tokenData), 500);
      }

      // Store tokens in personal_pulse_cache for persistence
      setPersonalPulseCache('whoop_tokens', JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
        scope: tokenData.scope,
      }));

      logger.info('WHOOP OAuth tokens stored successfully');

      // Redirect back to dashboard CEO tab
      return c.redirect('/?tab=ceo#whoop-connected');
    } catch (e: any) {
      logger.error({ error: e.message }, 'WHOOP OAuth callback error');
      return c.text('OAuth error: ' + e.message, 500);
    }
  });

  // ── Permissions headers — allow camera, microphone, autoplay ──────────
  app.use('*', async (c, next) => {
    c.header('Permissions-Policy', 'camera=*, microphone=*, autoplay=*');
    c.header('Access-Control-Allow-Headers', 'Content-Type');
    await next();
  });

  // ── Auth middleware — everything below requires session cookie ──────────
  app.use('*', async (c, next) => {
    const path = c.req.path;
    // Public routes (no auth)
    if (path === '/api/login' || path === '/api/login/verify-totp' || path === '/api/logout' || path === '/api/auth-check' || path === '/health') {
      return next();
    }
    // Static assets (music, images) -- public so Audio elements load before login
    if (path.startsWith('/static/')) {
      return next();
    }
    // Serve dashboard page (includes login screen) -- always accessible
    if (path === '/' && c.req.method === 'GET') {
      return next();
    }
    // Check session cookie
    if (!isAuthenticated(c)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
  });

  // Serve static audio/media files from project static/ directory
  app.get('/static/:filename', async (c) => {
    const filename = c.req.param('filename');
    if (!filename || /[^a-zA-Z0-9._-]/.test(filename) || filename.includes('..')) {
      return c.text('Not found', 404);
    }
    const filePath = path.join(PROJECT_ROOT, 'static', filename);
    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4', '.webm': 'audio/webm',
        '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      return new Response(content, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' } });
    } catch {
      return c.text('Not found', 404);
    }
  });

  // Serve dashboard HTML (no token passed to HTML anymore)
  app.get('/', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    return c.html(getDashboardHtml('', chatId));
  });

  // Scheduled tasks
  app.get('/api/tasks', (c) => {
    const tasks = getAllScheduledTasks();
    return c.json({ tasks });
  });

  // Delete a scheduled task
  app.delete('/api/tasks/:id', (c) => {
    const id = c.req.param('id');
    deleteScheduledTask(id);
    return c.json({ ok: true });
  });

  // Pause a scheduled task
  app.post('/api/tasks/:id/pause', (c) => {
    const id = c.req.param('id');
    pauseScheduledTask(id);
    return c.json({ ok: true });
  });

  // Resume a scheduled task
  app.post('/api/tasks/:id/resume', (c) => {
    const id = c.req.param('id');
    resumeScheduledTask(id);
    return c.json({ ok: true });
  });

  // ── Agent Activity Feed ───────────────────────────────────────────────
  app.get('/api/agents/activity', (c) => {
    try {
      const limit = Math.min(parseInt(c.req.query('limit') || '50'), 200);

      // Pull hive_mind entries — clean summaries of what agents actually did
      const hiveMind = runReadOnlyQuery(`
        SELECT agent_id, action, substr(summary, 1, 120) as summary, created_at
        FROM hive_mind
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);

      // Pull mission tasks (all statuses)
      const missions = runReadOnlyQuery(`
        SELECT id, title, status, assigned_agent, priority,
               created_at, completed_at
        FROM mission_tasks
        ORDER BY created_at DESC
        LIMIT 50
      `);

      // Fallback: count recent messages per agent from audit_log
      // (for agents that haven't logged to hive_mind yet)
      const messageCounts = runReadOnlyQuery(`
        SELECT agent_id, COUNT(*) as msg_count,
               MAX(created_at) as last_active
        FROM audit_log
        WHERE action = 'message'
          AND created_at > strftime('%s', 'now', '-7 days')
        GROUP BY agent_id
      `);

      // Build per-agent activity
      const agentActivity: Record<string, any[]> = {};

      // Add hive_mind summaries (primary source — clean action summaries)
      for (const row of hiveMind.rows) {
        const aid = row.agent_id as string;
        if (!agentActivity[aid]) agentActivity[aid] = [];
        agentActivity[aid].push({
          type: 'summary',
          action: row.action,
          summary: row.summary,
          created_at: row.created_at,
        });
      }

      // Add mission tasks
      for (const row of missions.rows) {
        const aid = (row.assigned_agent || 'unassigned') as string;
        if (!agentActivity[aid]) agentActivity[aid] = [];
        agentActivity[aid].push({
          type: 'mission',
          id: row.id,
          title: row.title,
          status: row.status,
          priority: row.priority,
          created_at: row.created_at,
          completed_at: row.completed_at,
        });
      }

      // For agents with no hive_mind entries, add a message count summary
      for (const row of messageCounts.rows) {
        const aid = row.agent_id as string;
        const hasSummaries = (agentActivity[aid] || []).some((i: any) => i.type === 'summary');
        if (!hasSummaries && (row.msg_count as number) > 0) {
          if (!agentActivity[aid]) agentActivity[aid] = [];
          agentActivity[aid].push({
            type: 'stats',
            msg_count: row.msg_count,
            last_active: row.last_active,
          });
        }
      }

      // Sort each agent's activity by time descending, cap at 12
      for (const aid of Object.keys(agentActivity)) {
        agentActivity[aid].sort((a: any, b: any) => (b.created_at || b.last_active || 0) - (a.created_at || a.last_active || 0));
        agentActivity[aid] = agentActivity[aid].slice(0, 12);
      }

      return c.json({ activity: agentActivity });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });

  // ── Mission Control endpoints ────────────────────────────────────────

  app.get('/api/mission/tasks', (c) => {
    const agentId = c.req.query('agent') || undefined;
    const status = c.req.query('status') || undefined;
    const tasks = getMissionTasks(agentId, status);
    return c.json({ tasks });
  });

  app.get('/api/mission/tasks/:id', (c) => {
    const id = c.req.param('id');
    const task = getMissionTask(id);
    if (!task) return c.json({ error: 'Not found' }, 404);
    return c.json({ task });
  });

  app.post('/api/mission/tasks', async (c) => {
    const body = await c.req.json<{
      title?: string;
      prompt?: string;
      assigned_agent?: string;
      priority?: number;
    }>();

    const title = body?.title?.trim();
    const prompt = body?.prompt?.trim();
    const assignedAgent = body?.assigned_agent?.trim() || null;
    const priority = Math.max(0, Math.min(10, body?.priority ?? 0));

    if (!title || title.length > 200) return c.json({ error: 'title required (max 200 chars)' }, 400);
    if (!prompt || prompt.length > 10000) return c.json({ error: 'prompt required (max 10000 chars)' }, 400);

    // Validate agent if provided
    if (assignedAgent) {
      const validAgents = ['main', ...listAgentIds()];
      if (!validAgents.includes(assignedAgent)) {
        return c.json({ error: `Unknown agent: ${assignedAgent}. Valid: ${validAgents.join(', ')}` }, 400);
      }
    }

    const id = crypto.randomBytes(4).toString('hex');
    createMissionTask(id, title, prompt, assignedAgent, 'dashboard', priority);

    const task = getMissionTask(id);
    return c.json({ task }, 201);
  });

  app.post('/api/mission/tasks/:id/cancel', (c) => {
    const id = c.req.param('id');
    const ok = cancelMissionTask(id);
    return c.json({ ok });
  });

  // Auto-assign a single task via Gemini classification
  app.post('/api/mission/tasks/:id/auto-assign', async (c) => {
    const id = c.req.param('id');
    const task = getMissionTask(id);
    if (!task) return c.json({ error: 'Not found' }, 404);
    if (task.assigned_agent) return c.json({ error: 'Already assigned' }, 400);

    const agent = await classifyTaskAgent(task.prompt);
    if (!agent) return c.json({ error: 'Classification failed' }, 500);

    assignMissionTask(id, agent);
    return c.json({ ok: true, assigned_agent: agent });
  });

  // Auto-assign all unassigned tasks
  app.post('/api/mission/tasks/auto-assign-all', async (c) => {
    const tasks = getUnassignedMissionTasks();
    if (tasks.length === 0) return c.json({ assigned: 0 });

    const results: Array<{ id: string; agent: string }> = [];
    for (const task of tasks) {
      const agent = await classifyTaskAgent(task.prompt);
      if (agent && assignMissionTask(task.id, agent)) {
        results.push({ id: task.id, agent });
      }
    }
    return c.json({ assigned: results.length, results });
  });

  app.patch('/api/mission/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<{ assigned_agent?: string }>();
    const newAgent = body?.assigned_agent?.trim();
    if (!newAgent) return c.json({ error: 'assigned_agent required' }, 400);
    const validAgents = ['main', ...listAgentIds()];
    if (!validAgents.includes(newAgent)) return c.json({ error: 'Unknown agent' }, 400);
    const ok = reassignMissionTask(id, newAgent);
    return c.json({ ok });
  });

  app.delete('/api/mission/tasks/:id', (c) => {
    const id = c.req.param('id');
    const ok = deleteMissionTask(id);
    return c.json({ ok });
  });

  app.get('/api/mission/history', (c) => {
    const limit = parseInt(c.req.query('limit') || '30', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    return c.json(getMissionTaskHistory(limit, offset));
  });

  // Memory stats
  app.get('/api/memories', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const stats = getDashboardMemoryStats(chatId);
    const fading = getDashboardLowSalienceMemories(chatId, 10);
    const topAccessed = getDashboardTopAccessedMemories(chatId, 5);
    const timeline = getDashboardMemoryTimeline(chatId, 30);
    const consolidations = getDashboardConsolidations(chatId, 5);
    return c.json({ stats, fading, topAccessed, timeline, consolidations });
  });

  // Memory list (for drill-down drawer)
  app.get('/api/memories/pinned', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const memories = getDashboardPinnedMemories(chatId);
    return c.json({ memories });
  });

  app.get('/api/memories/list', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const sortBy = (c.req.query('sort') || 'importance') as 'importance' | 'salience' | 'recent';
    const result = getDashboardMemoriesList(chatId, limit, offset, sortBy);
    return c.json(result);
  });

  // Knowledge graph data
  app.get('/api/knowledge-graph', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const data = getKnowledgeGraphData(chatId);
    return c.json(data);
  });

  // System health
  app.get('/api/health', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const sessionId = getSession(chatId);
    let contextPct = 0;
    let turns = 0;
    let compactions = 0;
    let sessionAge = '-';

    if (sessionId) {
      const summary = getSessionTokenUsage(sessionId);
      if (summary) {
        turns = summary.turns;
        compactions = summary.compactions;
        const contextTokens = (summary.lastContextTokens || 0) + (summary.lastCacheRead || 0);
        contextPct = contextTokens > 0 ? Math.round((contextTokens / CONTEXT_LIMIT) * 100) : 0;
        const ageSec = Math.floor(Date.now() / 1000) - summary.firstTurnAt;
        if (ageSec < 3600) sessionAge = Math.floor(ageSec / 60) + 'm';
        else if (ageSec < 86400) sessionAge = Math.floor(ageSec / 3600) + 'h';
        else sessionAge = Math.floor(ageSec / 86400) + 'd';
      }
    }

    return c.json({
      contextPct,
      turns,
      compactions,
      sessionAge,
      model: agentDefaultModel || 'sonnet-4-6',
      telegramConnected: getTelegramConnected(),
      waConnected: WHATSAPP_ENABLED,
      slackConnected: !!SLACK_USER_TOKEN,
    });
  });

  // Token / cost stats
  app.get('/api/tokens', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const stats = getDashboardTokenStats(chatId);
    const costTimeline = getDashboardCostTimeline(chatId, 30);
    const recentUsage = getDashboardRecentTokenUsage(chatId, 20);
    return c.json({ stats, costTimeline, recentUsage });
  });

  // Bot info (name, PID, chatId) — reads dynamically from state
  app.get('/api/info', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const info = getBotInfo();
    return c.json({
      botName: info.name || 'LinkOS',
      botUsername: info.username || '',
      pid: process.pid,
      chatId: chatId || null,
    });
  });

  // ── Agent endpoints ──────────────────────────────────────────────────

  // List all configured agents with status
  app.get('/api/agents', (c) => {
    // Build a lookup of live Telegram connections from the shared DB
    const HEARTBEAT_STALE_SEC = 90; // consider dead if no heartbeat for 90s
    const now = Math.floor(Date.now() / 1000);
    const statusRows = getAllAgentStatuses();
    const statusMap = new Map(statusRows.map((r) => [r.agent_id, r]));

    const isLive = (agentId: string): { running: boolean; botUsername: string | null } => {
      const s = statusMap.get(agentId);
      if (s && s.telegram_connected && (now - s.last_heartbeat) < HEARTBEAT_STALE_SEC) {
        // Verify the PID is still alive as a sanity check
        try { process.kill(s.pid!, 0); return { running: true, botUsername: s.bot_username }; } catch { /* stale row */ }
      }
      // Fallback: PID file check (for agents that haven't written status yet)
      const pidFile = path.join(STORE_DIR, agentId === 'main' ? 'linkos.pid' : `agent-${agentId}.pid`);
      if (fs.existsSync(pidFile)) {
        try {
          const pid = parseInt(fs.readFileSync(pidFile, 'utf-8').trim(), 10);
          process.kill(pid, 0);
          return { running: true, botUsername: s?.bot_username ?? null };
        } catch { /* not running */ }
      }
      return { running: false, botUsername: s?.bot_username ?? null };
    };

    const agentIds = listAgentIds();
    const agents = agentIds.map((id) => {
      try {
        const config = loadAgentConfig(id);
        const live = isLive(id);
        const stats = getAgentTokenStats(id);
        return {
          id,
          name: config.name,
          description: config.description,
          model: config.model ?? 'claude-opus-4-6',
          running: live.running,
          botUsername: live.botUsername,
          todayTurns: stats.todayTurns,
          todayCost: stats.todayCost,
        };
      } catch {
        return { id, name: id, description: '', model: 'unknown', running: false, botUsername: null, todayTurns: 0, todayCost: 0 };
      }
    });

    // Include main bot too
    const mainLive = isLive('main');
    const mainStats = getAgentTokenStats('main');
    const allAgents = [
      { id: 'main', name: 'Link', description: 'Primary LinkOS bot', model: 'claude-opus-4-6', running: mainLive.running, botUsername: mainLive.botUsername, todayTurns: mainStats.todayTurns, todayCost: mainStats.todayCost },
      ...agents,
    ];

    return c.json({ agents: allAgents });
  });

  // Agent-specific recent conversation
  app.get('/api/agents/:id/conversation', (c) => {
    const agentId = c.req.param('id');
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    const limit = parseInt(c.req.query('limit') || '4', 10);
    const turns = getAgentRecentConversation(agentId, chatId, limit);
    return c.json({ turns });
  });

  // Agent-specific tasks
  app.get('/api/agents/:id/tasks', (c) => {
    const agentId = c.req.param('id');
    const tasks = getAllScheduledTasks(agentId);
    return c.json({ tasks });
  });

  // Agent-specific token stats
  app.get('/api/agents/:id/tokens', (c) => {
    const agentId = c.req.param('id');
    const stats = getAgentTokenStats(agentId);
    return c.json(stats);
  });

  // Update agent model
  app.patch('/api/agents/:id/model', async (c) => {
    const agentId = c.req.param('id');
    const body = await c.req.json<{ model?: string }>();
    const model = body?.model?.trim();
    if (!model) return c.json({ error: 'model required' }, 400);

    const validModels = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-haiku-4-5'];
    if (!validModels.includes(model)) return c.json({ error: `Invalid model. Valid: ${validModels.join(', ')}` }, 400);

    try {
      if (agentId === 'main') {
        // Main agent uses in-memory override (same as /model command)
        const { setMainModelOverride } = await import('./bot.js');
        setMainModelOverride(model);
      } else {
        setAgentModel(agentId, model);
      }
      return c.json({ ok: true, agent: agentId, model });
    } catch (err) {
      return c.json({ error: 'Failed to update model' }, 500);
    }
  });

  // Update ALL agent models at once
  app.patch('/api/agents/model', async (c) => {
    const body = await c.req.json<{ model?: string }>();
    const model = body?.model?.trim();
    if (!model) return c.json({ error: 'model required' }, 400);

    const validModels = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-haiku-4-5'];
    if (!validModels.includes(model)) return c.json({ error: `Invalid model` }, 400);

    const agentIds = listAgentIds();
    const updated: string[] = [];
    for (const id of agentIds) {
      try { setAgentModel(id, model); updated.push(id); } catch {}
    }
    return c.json({ ok: true, model, updated });
  });

  // ── Agent Creation & Management ──────────────────────────────────────

  // List available agent templates
  app.get('/api/agents/templates', (c) => {
    return c.json({ templates: listTemplates() });
  });

  // Validate an agent ID (before creation)
  app.get('/api/agents/validate-id', (c) => {
    const id = c.req.query('id') || '';
    const result = validateAgentId(id);
    const suggestions = id ? suggestBotNames(id) : null;
    return c.json({ ...result, suggestions });
  });

  // Validate a bot token
  app.post('/api/agents/validate-token', async (c) => {
    const body = await c.req.json<{ token?: string }>();
    const token = body?.token?.trim();
    if (!token) return c.json({ ok: false, error: 'token required' }, 400);
    const result = await validateBotToken(token);
    return c.json(result);
  });

  // Create a new agent
  app.post('/api/agents/create', async (c) => {
    const body = await c.req.json<{
      id?: string;
      name?: string;
      description?: string;
      model?: string;
      template?: string;
      botToken?: string;
    }>();

    const id = body?.id?.trim();
    const name = body?.name?.trim();
    const description = body?.description?.trim();
    const botToken = body?.botToken?.trim();

    if (!id) return c.json({ error: 'id required' }, 400);
    if (!name) return c.json({ error: 'name required' }, 400);
    if (!description) return c.json({ error: 'description required' }, 400);
    if (!botToken) return c.json({ error: 'botToken required' }, 400);

    try {
      const result = await createAgent({
        id,
        name,
        description,
        model: body?.model?.trim() || undefined,
        template: body?.template?.trim() || undefined,
        botToken,
      });
      return c.json({ ok: true, ...result }, 201);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ error: msg }, 400);
    }
  });

  // Activate an agent (install service + start)
  app.post('/api/agents/:id/activate', (c) => {
    const agentId = c.req.param('id');
    if (agentId === 'main') return c.json({ error: 'Cannot activate main via this endpoint' }, 400);
    const result = activateAgent(agentId);
    return c.json(result);
  });

  // Deactivate an agent (stop + uninstall service)
  app.post('/api/agents/:id/deactivate', (c) => {
    const agentId = c.req.param('id');
    if (agentId === 'main') return c.json({ error: 'Cannot deactivate main via this endpoint' }, 400);
    const result = deactivateAgent(agentId);
    return c.json(result);
  });

  // Delete an agent entirely
  app.delete('/api/agents/:id/full', (c) => {
    const agentId = c.req.param('id');
    if (agentId === 'main') return c.json({ error: 'Cannot delete main' }, 400);
    const result = deleteAgent(agentId);
    if (result.ok) {
      return c.json({ ok: true });
    }
    return c.json({ error: result.error }, 500);
  });

  // Check if a specific agent is running
  app.get('/api/agents/:id/status', (c) => {
    const agentId = c.req.param('id');
    return c.json({ running: isAgentRunning(agentId) });
  });

  // ── Security & Audit ─────────────────────────────────────────────────

  app.get('/api/security/status', (c) => {
    return c.json(getSecurityStatus());
  });

  app.get('/api/audit', (c) => {
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const agentId = c.req.query('agent') || undefined;
    const entries = getAuditLog(limit, offset, agentId);
    const total = getAuditLogCount(agentId);
    return c.json({ entries, total });
  });

  app.get('/api/audit/blocked', (c) => {
    const limit = parseInt(c.req.query('limit') || '10', 10);
    return c.json({ entries: getRecentBlockedActions(limit) });
  });

  // Hive mind feed
  app.get('/api/hive-mind', (c) => {
    const agentId = c.req.query('agent');
    const limit = parseInt(c.req.query('limit') || '20', 10);
    const entries = getHiveMindEntries(limit, agentId || undefined);
    return c.json({ entries });
  });

  // ── Database Explorer endpoints ────────────────────────────────────

  // List all tables with row counts and column info
  app.get('/api/db/tables', (c) => {
    const tables = getDbTables();
    return c.json({ tables });
  });

  // Get paginated rows from a table
  app.get('/api/db/tables/:name', (c) => {
    const tableName = c.req.param('name');
    // Validate table name against actual tables to prevent SQL injection
    const validTables = getDbTableNames();
    if (!validTables.includes(tableName)) {
      return c.json({ error: 'Unknown table' }, 400);
    }

    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '50', 10)));
    const sort = c.req.query('sort') || undefined;
    const order = (c.req.query('order') || 'asc') as 'asc' | 'desc';

    const result = getDbTableRows(tableName, page, limit, sort, order);

    // Attempt decryption on encrypted fields
    const encryptedFields: Record<string, string[]> = {
      wa_messages: ['body'],
      slack_messages: ['body'],
    };
    const fieldsToDecrypt = encryptedFields[tableName];
    if (fieldsToDecrypt) {
      result.rows = result.rows.map((row) => {
        const decrypted = { ...row };
        for (const field of fieldsToDecrypt) {
          if (typeof decrypted[field] === 'string') {
            try {
              decrypted[field] = decryptField(decrypted[field] as string);
            } catch { /* leave as-is */ }
          }
        }
        return decrypted;
      });
    }

    return c.json(result);
  });

  // Run a read-only SQL query
  app.get('/api/db/query', (c) => {
    const sql = (c.req.query('sql') || '').trim();
    if (!sql) return c.json({ error: 'sql parameter required' }, 400);

    // Only allow SELECT statements
    if (!/^select\b/i.test(sql)) {
      return c.json({ error: 'Only SELECT queries are allowed' }, 400);
    }

    // Block dangerous patterns
    if (/;\s*(drop|delete|update|insert|alter|create|attach|detach|pragma)/i.test(sql)) {
      return c.json({ error: 'Only single SELECT queries are allowed' }, 400);
    }

    try {
      const result = runReadOnlyQuery(sql + (sql.toLowerCase().includes(' limit ') ? '' : ' LIMIT 1000'));
      if (result.rowCount > 1000) {
        result.rows = result.rows.slice(0, 1000);
        result.rowCount = 1000;
      }
      return c.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ error: msg }, 400);
    }
  });

  // ── Supabase Explorer endpoints ──────────────────────────────────────

  // List all Supabase tables
  app.get('/api/supabase/tables', async (c) => {
    const { supabaseEnabled, SUPABASE_URL, SUPABASE_SERVICE_KEY } = await import('./supabase.js');
    if (!supabaseEnabled) return c.json({ error: 'Supabase not configured' }, 400);

    try {
      // The PostgREST root returns an OpenAPI spec -- parse paths for table names
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY || '',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY || ''}`,
        },
      });
      if (!resp.ok) return c.json({ error: 'Failed to list tables' }, 500);
      const spec = await resp.json() as { paths?: Record<string, unknown> };
      const paths = spec.paths || {};
      const tables = Object.keys(paths)
        .filter(p => !p.startsWith('/rpc/'))
        .map(p => p.replace(/^\//, ''))
        .filter(Boolean)
        .map(name => ({ name, type: 'supabase' }));
      return c.json({ tables });
    } catch (e) {
      return c.json({ error: String(e) }, 500);
    }
  });

  // Get rows from a Supabase table
  app.get('/api/supabase/tables/:name', async (c) => {
    const { supabaseEnabled, getSupabaseClient } = await import('./supabase.js');
    if (!supabaseEnabled) return c.json({ error: 'Supabase not configured' }, 400);
    const client = getSupabaseClient();
    if (!client) return c.json({ error: 'Supabase client not available' }, 500);

    const tableName = c.req.param('name');
    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '50', 10)));
    const offset = (page - 1) * limit;
    const sort = c.req.query('sort');
    const order = c.req.query('order') === 'desc' ? 'desc' : 'asc';

    const query = `select=*&limit=${limit}&offset=${offset}` +
      (sort ? `&order=${sort}.${order}` : '') +
      '&' ; // trailing & is harmless

    const result = await client.select(tableName, query, { count: true });
    if (result.error) return c.json({ error: result.error.message }, 500);

    const rows = result.data || [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return c.json({
      columns,
      rows,
      rowCount: result.count || rows.length,
      page,
      limit,
      totalPages: Math.ceil((result.count || rows.length) / limit),
    });
  });

  // Insert a row into a Supabase table
  app.post('/api/supabase/tables/:name', async (c) => {
    const { supabaseEnabled, getSupabaseClient } = await import('./supabase.js');
    if (!supabaseEnabled) return c.json({ error: 'Supabase not configured' }, 400);
    const client = getSupabaseClient();
    if (!client) return c.json({ error: 'Supabase client not available' }, 500);

    const tableName = c.req.param('name');
    const body = await c.req.json();
    const result = await client.insert(tableName, body);
    if (result.error) return c.json({ error: result.error.message }, 500);
    return c.json({ success: true, data: result.data });
  });

  // ── Stripe Sales endpoints ─────────────────────────────────────────

  app.get('/api/stripe/sales', async (c) => {
    if (!STRIPE_SECRET_KEY) return c.json({ error: 'Stripe not configured' }, 503);
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY);
      const now = new Date();
      const day = now.getDate();
      const curYear = now.getFullYear();
      const curMonth = now.getMonth();

      // Sum balance transactions returning both gross and net volume (matches Stripe dashboard)
      // Includes both 'charge' (card) and 'payment' (ACH/bank) types for complete volume
      async function sumVolumeByType(start: Date, end: Date, type: string): Promise<{ gross: number; net: number; fees: number; count: number }> {
        let gross = 0, net = 0, fees = 0, count = 0;
        let hasMore = true;
        let startingAfter: string | undefined;
        const gte = Math.floor(start.getTime() / 1000);
        const lt = Math.floor(end.getTime() / 1000);
        while (hasMore) {
          const params: any = {
            created: { gte, lt },
            limit: 100,
            type,
          };
          if (startingAfter) params.starting_after = startingAfter;
          const page = await stripe.balanceTransactions.list(params);
          for (const txn of page.data) {
            gross += txn.amount;
            net += txn.net;
            fees += txn.fee;
            count++;
          }
          hasMore = page.has_more;
          if (page.data.length > 0) startingAfter = page.data[page.data.length - 1].id;
        }
        return { gross, net, fees, count };
      }

      async function sumVolume(start: Date, end: Date): Promise<{ gross: number; net: number; fees: number; count: number }> {
        const [charges, payments] = await Promise.all([
          sumVolumeByType(start, end, 'charge'),
          sumVolumeByType(start, end, 'payment'),
        ]);
        return {
          gross: charges.gross + payments.gross,
          net: charges.net + payments.net,
          fees: charges.fees + payments.fees,
          count: charges.count + payments.count,
        };
      }

      const curStart = new Date(curYear, curMonth, 1);
      const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
      const prevMonthYear = curMonth === 0 ? curYear - 1 : curYear;
      const lastMonthStart = new Date(prevMonthYear, prevMonth, 1);
      const lastMonthEnd = new Date(prevMonthYear, prevMonth, day);
      const lastYearStart = new Date(curYear - 1, curMonth, 1);
      const lastYearEnd = new Date(curYear - 1, curMonth, day);

      const [current, lastMonth, lastYear] = await Promise.all([
        sumVolume(curStart, now),
        sumVolume(lastMonthStart, lastMonthEnd),
        sumVolume(lastYearStart, lastYearEnd),
      ]);

      return c.json({
        mtd_current: current.gross,
        mtd_current_net: current.net,
        mtd_current_fees: current.fees,
        mtd_current_count: current.count,
        mtd_last_month: lastMonth.gross,
        mtd_last_month_net: lastMonth.net,
        mtd_last_month_fees: lastMonth.fees,
        mtd_last_month_count: lastMonth.count,
        mtd_last_year: lastYear.gross,
        mtd_last_year_net: lastYear.net,
        mtd_last_year_fees: lastYear.fees,
        mtd_last_year_count: lastYear.count,
        as_of: now.toISOString(),
      });
    } catch (e: any) {
      return c.json({ error: e.message || 'Stripe error' }, 500);
    }
  });

  app.get('/api/stripe/payments', async (c) => {
    if (!STRIPE_SECRET_KEY) return c.json({ error: 'Stripe not configured' }, 503);
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY);
      const limit = Math.min(parseInt(c.req.query('limit') || '50', 10), 100);

      const charges = await stripe.charges.list({ limit, expand: ['data.customer'] });
      const payments = charges.data
        .filter(ch => ch.status === 'succeeded')
        .map(ch => {
          const cust = ch.customer as any;
          // Detect new customer: created within last 7 days
          const isNew = cust?.created ? (Date.now() / 1000 - cust.created) < 7 * 86400 : false;
          return {
            amount: ch.amount,
            created: ch.created,
            customer_name: cust?.name || ch.billing_details?.name || null,
            customer_email: cust?.email || ch.billing_details?.email || null,
            description: ch.description,
            new_customer: isNew,
          };
        });
      return c.json({ payments });
    } catch (e: any) {
      return c.json({ error: e.message || 'Stripe error' }, 500);
    }
  });

  // ── CEO Dashboard: New Deal Cash Collected ────────────────────────
  // First-time payments from new subscriptions this month
  app.get('/api/stripe/new-deal-cash', async (c) => {
    if (!STRIPE_SECRET_KEY) return c.json({ error: 'Stripe not configured' }, 503);
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const gte = Math.floor(monthStart.getTime() / 1000);
      const lt = Math.floor(now.getTime() / 1000);

      const NEW_DEAL_CASH_TARGET = Number(process.env.DEAL_CASH_TARGET || '10000000'); // Monthly target in cents (default $100K)

      // Sum all "Subscription creation" balance transactions this month
      // These are first payments from new deals (both charge + payment types)
      let totalCash = 0;
      let totalNet = 0;
      let dealCount = 0;

      for (const type of ['charge', 'payment'] as const) {
        let hasMore = true;
        let startingAfter: string | undefined;
        while (hasMore) {
          const params: any = { created: { gte, lt }, limit: 100, type };
          if (startingAfter) params.starting_after = startingAfter;
          const page = await stripe.balanceTransactions.list(params);
          for (const txn of page.data) {
            if (txn.description === 'Subscription creation') {
              totalCash += txn.amount;
              totalNet += txn.net;
              dealCount++;
            }
          }
          hasMore = page.has_more;
          if (page.data.length > 0) startingAfter = page.data[page.data.length - 1].id;
        }
      }

      // Get new subscription details for the top deals list
      const newSubs: any[] = [];
      let sHasMore = true;
      let sAfter: string | undefined;
      while (sHasMore) {
        const params: any = { created: { gte }, limit: 100, expand: ['data.customer', 'data.items.data.price'] };
        if (sAfter) params.starting_after = sAfter;
        const page = await stripe.subscriptions.list(params);
        newSubs.push(...page.data);
        sHasMore = page.has_more;
        if (page.data.length > 0) sAfter = page.data[page.data.length - 1].id;
      }

      // Build top deals list from new subscriptions
      const topDeals = newSubs.map((sub: any) => {
        let mrr = 0;
        for (const item of sub.items.data) {
          const amount = (item.price.unit_amount || 0) * (item.quantity || 1);
          const interval = item.price.recurring?.interval;
          if (interval === 'year') mrr += amount / 12;
          else if (interval === 'month') mrr += amount;
          else mrr += amount;
        }
        const cust = sub.customer as any;
        return {
          name: cust?.name || cust?.email || 'Unknown',
          amount: mrr, // monthly value in cents
        };
      }).sort((a: any, b: any) => b.amount - a.amount);

      return c.json({
        cash_collected: totalCash,
        cash_collected_net: totalNet,
        new_deal_count: dealCount,
        new_sub_count: newSubs.length,
        target: NEW_DEAL_CASH_TARGET,
        top_new_deals: topDeals.slice(0, 10),
        as_of: now.toISOString(),
      });
    } catch (e: any) {
      return c.json({ error: e.message || 'Stripe new-deal-cash error' }, 500);
    }
  });

  // ── HubSpot Sales Team endpoint ───────────────────────────────────

  app.get('/api/hubspot/team-performance', async (c) => {
    if (!HUBSPOT_ACCESS_TOKEN) return c.json({ error: 'HubSpot not configured' }, 503);
    try {
      const baseUrl = 'https://api.hubapi.com';
      const headers = { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' };

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Get owners (sales reps) via CRM users search (owners endpoint requires extra scope)
      const usersRes = await fetch(`${baseUrl}/crm/v3/objects/users/search`, {
        method: 'POST', headers,
        body: JSON.stringify({
          filterGroups: [],
          properties: ['hs_given_name', 'hs_family_name', 'hs_email', 'hubspot_owner_id'],
          limit: 100,
        }),
      });
      const usersData = await usersRes.json() as any;
      const owners = (usersData.results || []).filter((u: any) => !u.archived && u.properties.hubspot_owner_id);

      // HubSpot Pipeline stage IDs — replace with your own stage IDs
      // Find these in HubSpot > Settings > Objects > Deals > Pipelines
      const PIPELINE_ID = process.env.HUBSPOT_PIPELINE_ID || 'default';
      const WON_STAGES = (process.env.HUBSPOT_WON_STAGES || 'closedwon').split(',');
      const LOST_STAGES = (process.env.HUBSPOT_LOST_STAGES || 'closedlost').split(',');
      const CLOSED_STAGES = [...WON_STAGES, ...LOST_STAGES];

      // Get deals with rate-limit safety (HubSpot allows ~100 req/10s)
      async function searchDeals(filterGroups: any[], paginate = false) {
        const allResults: any[] = [];
        let after: string | undefined;
        do {
          const body: any = {
            filterGroups,
            properties: ['dealname', 'amount', 'dealstage', 'closedate', 'hubspot_owner_id', 'pipeline', 'hs_lastmodifieddate', 'hs_date_entered_closedwon', 'hs_date_entered_closedlost'],
            limit: 100,
          };
          if (after) body.after = after;
          const res = await fetch(`${baseUrl}/crm/v3/objects/deals/search`, {
            method: 'POST', headers,
            body: JSON.stringify(body),
          });
          if (res.status === 429) {
            // Rate limited - wait and retry once
            await new Promise(r => setTimeout(r, 1500));
            const retry = await fetch(`${baseUrl}/crm/v3/objects/deals/search`, {
              method: 'POST', headers,
              body: JSON.stringify(body),
            });
            const retryData = await retry.json() as any;
            allResults.push(...(retryData.results || []));
            after = retryData.paging?.next?.after;
          } else {
            const data = await res.json() as any;
            allResults.push(...(data.results || []));
            after = data.paging?.next?.after;
          }
          if (!paginate) break;
        } while (after && allResults.length < 5000);
        return allResults;
      }

      const pipelineFilter = { propertyName: 'pipeline', operator: 'EQ', value: PIPELINE_ID };

      // Batch 1: Won + Lost deals this month (4 API calls)
      const [wonDeals, lostDeals] = await Promise.all([
        Promise.all(WON_STAGES.map(stage => searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'EQ', value: stage },
          { propertyName: 'closedate', operator: 'GTE', value: monthStart.toISOString() },
        ]}]))).then(results => results.flat()),
        Promise.all(LOST_STAGES.map(stage => searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'EQ', value: stage },
          { propertyName: 'closedate', operator: 'GTE', value: monthStart.toISOString() },
        ]}]))).then(results => results.flat()),
      ]);

      // Batch 2: Open deals + last month (4 API calls, staggered to avoid rate limits)
      const [openDealsWithAmount, openDealsAll, lastMonthWonDeals] = await Promise.all([
        searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'NOT_IN', values: CLOSED_STAGES },
          { propertyName: 'amount', operator: 'GT', value: '0' },
        ]}]),
        searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'NOT_IN', values: CLOSED_STAGES },
        ]}]),
        Promise.all(WON_STAGES.map(stage => searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'EQ', value: stage },
          { propertyName: 'closedate', operator: 'GTE', value: lastMonthStart.toISOString() },
          { propertyName: 'closedate', operator: 'LTE', value: lastMonthEnd.toISOString() },
        ]}]))).then(results => results.flat()),
      ]);

      // Merge: use amount-bearing deals as primary for pipeline value, supplement with all deals for counts
      const openDeals = openDealsWithAmount;

      // Org chart role mapping (name -> role + department)
      // Populate this with your team members. Format: 'full name' (lowercase)
      // Roles: closer, setter, manager, account_manager, media_buyer, support, operations, executive
      const ORG_ROLES: Record<string, { role: string; department: string; title: string }> = {
        // Example entries (replace with your team):
        // 'jane smith':    { role: 'manager',   department: 'sales',           title: 'Sales Manager' },
        // 'john doe':      { role: 'closer',    department: 'sales',           title: 'Account Executive' },
        // 'alice chen':    { role: 'account_manager', department: 'client_services', title: 'Account Manager' },
        // 'bob wilson':    { role: 'media_buyer',     department: 'client_services', title: 'Media Buyer' },
        // 'you':           { role: 'executive',       department: 'executive',       title: 'CEO' },
      };

      function lookupOrgRole(name: string) {
        const key = name.toLowerCase().trim();
        if (ORG_ROLES[key]) return ORG_ROLES[key];
        // Fuzzy: try last name match
        for (const [k, v] of Object.entries(ORG_ROLES)) {
          const lastName = k.split(' ').pop() || '';
          if (key.includes(lastName) && lastName.length > 3) return v;
        }
        return { role: 'unknown', department: 'unknown', title: '' };
      }

      // Build per-rep stats (keyed by hubspot_owner_id from user properties)
      const repMap: Record<string, any> = {};
      for (const u of owners) {
        const oid = u.properties.hubspot_owner_id;
        const name = `${u.properties.hs_given_name || ''} ${u.properties.hs_family_name || ''}`.trim() || u.properties.hs_email || oid;
        const org = lookupOrgRole(name);
        repMap[oid] = {
          id: oid, name,
          role: org.role, department: org.department, title: org.title,
          dealsWon: 0, revenueWon: 0, dealsLost: 0, revenueLost: 0,
          openDeals: 0, openPipelineValue: 0, newLeads: 0,
          callsWeek: 0, callsMonth: 0, talkTimeWeek: 0, talkTimeMonth: 0,
          meetingsWeek: 0, meetingsMonth: 0, lastMonthRevenue: 0,
        };
      }

      for (const d of wonDeals) {
        const oid = d.properties.hubspot_owner_id;
        if (repMap[oid]) {
          repMap[oid].dealsWon++;
          repMap[oid].revenueWon += parseFloat(d.properties.amount || '0');
        }
      }
      for (const d of lostDeals) {
        const oid = d.properties.hubspot_owner_id;
        if (repMap[oid]) {
          repMap[oid].dealsLost++;
          repMap[oid].revenueLost += parseFloat(d.properties.amount || '0');
        }
      }
      for (const d of openDeals) {
        const oid = d.properties.hubspot_owner_id;
        if (repMap[oid]) {
          repMap[oid].openDeals++;
          repMap[oid].openPipelineValue += parseFloat(d.properties.amount || '0');
        }
      }
      for (const d of lastMonthWonDeals) {
        const oid = d.properties.hubspot_owner_id;
        if (repMap[oid]) repMap[oid].lastMonthRevenue += parseFloat(d.properties.amount || '0');
      }

      // Also count open deals from the broader set (openDealsAll) for deal counts
      for (const d of openDealsAll) {
        const oid = d.properties.hubspot_owner_id;
        if (repMap[oid] && !repMap[oid]._countedDealIds?.has(d.id)) {
          // Only count deals not already counted from openDealsWithAmount
          if (!openDeals.some((od: any) => od.id === d.id)) {
            repMap[oid].openDeals++;
          }
        }
      }

      // Batch 3: Fetch calls and meetings from HubSpot engagements
      async function searchEngagements(objectType: string, filters: any[], properties: string[]) {
        const allResults: any[] = [];
        let after: string | undefined;
        do {
          const body: any = {
            filterGroups: [{ filters }],
            properties,
            limit: 100,
          };
          if (after) body.after = after;
          let res = await fetch(`${baseUrl}/crm/v3/objects/${objectType}/search`, {
            method: 'POST', headers,
            body: JSON.stringify(body),
          });
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, 1500));
            res = await fetch(`${baseUrl}/crm/v3/objects/${objectType}/search`, {
              method: 'POST', headers,
              body: JSON.stringify(body),
            });
          }
          const data = await res.json() as any;
          allResults.push(...(data.results || []));
          after = data.paging?.next?.after;
        } while (after && allResults.length < 2000);
        return allResults;
      }

      const [callsThisMonth, callsThisWeek, meetingsThisMonth, meetingsThisWeek] = await Promise.all([
        searchEngagements('calls', [
          { propertyName: 'hs_timestamp', operator: 'GTE', value: monthStart.getTime().toString() },
        ], ['hs_timestamp', 'hubspot_owner_id', 'hs_call_duration', 'hs_call_status']),
        searchEngagements('calls', [
          { propertyName: 'hs_timestamp', operator: 'GTE', value: weekStart.getTime().toString() },
        ], ['hs_timestamp', 'hubspot_owner_id', 'hs_call_duration', 'hs_call_status']),
        searchEngagements('meetings', [
          { propertyName: 'hs_timestamp', operator: 'GTE', value: monthStart.getTime().toString() },
        ], ['hs_timestamp', 'hubspot_owner_id', 'hs_meeting_outcome']),
        searchEngagements('meetings', [
          { propertyName: 'hs_timestamp', operator: 'GTE', value: weekStart.getTime().toString() },
        ], ['hs_timestamp', 'hubspot_owner_id', 'hs_meeting_outcome']),
      ]);

      // Tally calls per rep (hs_call_duration is in ms, convert to seconds)
      for (const call of callsThisMonth) {
        const oid = call.properties.hubspot_owner_id;
        if (repMap[oid]) {
          repMap[oid].callsMonth++;
          repMap[oid].talkTimeMonth += Math.round(parseInt(call.properties.hs_call_duration || '0', 10) / 1000);
        }
      }
      for (const call of callsThisWeek) {
        const oid = call.properties.hubspot_owner_id;
        if (repMap[oid]) {
          repMap[oid].callsWeek++;
          repMap[oid].talkTimeWeek += Math.round(parseInt(call.properties.hs_call_duration || '0', 10) / 1000);
        }
      }
      // Tally meetings per rep
      for (const mtg of meetingsThisMonth) {
        const oid = mtg.properties.hubspot_owner_id;
        if (repMap[oid]) repMap[oid].meetingsMonth++;
      }
      for (const mtg of meetingsThisWeek) {
        const oid = mtg.properties.hubspot_owner_id;
        if (repMap[oid]) repMap[oid].meetingsWeek++;
      }

      const reps = Object.values(repMap).filter((r: any) => r.dealsWon || r.dealsLost || r.openDeals || r.callsMonth || r.meetingsMonth);

      // Count ALL deals for team totals (including unassigned)
      const sumAmount = (deals: any[]) => deals.reduce((s: number, d: any) => s + parseFloat(d.properties.amount || '0'), 0);
      const totalClosed = wonDeals.length + lostDeals.length;
      const winRate = totalClosed > 0 ? (wonDeals.length / totalClosed) * 100 : 0;

      // Sum team-wide engagement stats
      let teamCallsWeek = 0, teamCallsMonth = 0, teamTalkWeek = 0, teamTalkMonth = 0;
      let teamMtgsWeek = 0, teamMtgsMonth = 0;
      for (const r of Object.values(repMap) as any[]) {
        teamCallsWeek += r.callsWeek; teamCallsMonth += r.callsMonth;
        teamTalkWeek += r.talkTimeWeek; teamTalkMonth += r.talkTimeMonth;
        teamMtgsWeek += r.meetingsWeek; teamMtgsMonth += r.meetingsMonth;
      }

      const teamTotals = {
        dealsWon: wonDeals.length,
        revenueWon: sumAmount(wonDeals),
        dealsLost: lostDeals.length,
        revenueLost: sumAmount(lostDeals),
        openDeals: openDealsWithAmount.length,
        openPipelineValue: sumAmount(openDealsWithAmount),
        lastMonthRevenue: sumAmount(lastMonthWonDeals),
        winRate,
        newLeads: 0, unassignedLeads: 0,
        callsWeek: teamCallsWeek, callsMonth: teamCallsMonth,
        talkTimeWeek: teamTalkWeek, talkTimeMonth: teamTalkMonth,
        meetingsWeek: teamMtgsWeek, meetingsMonth: teamMtgsMonth,
      };

      // Stale deals: open deals with amounts not modified in 14+ days
      const allOpenForStale = [...openDealsWithAmount, ...openDealsAll.filter((d: any) => !openDealsWithAmount.some((od: any) => od.id === d.id))];
      const staleDeals = allOpenForStale
        .filter((d: any) => {
          const lastMod = new Date(d.properties.hs_lastmodifieddate);
          return (now.getTime() - lastMod.getTime()) > 14 * 86400000;
        })
        .map((d: any) => ({
          name: d.properties.dealname,
          amount: parseFloat(d.properties.amount || '0'),
          daysSinceUpdate: Math.floor((now.getTime() - new Date(d.properties.hs_lastmodifieddate).getTime()) / 86400000),
          owner: repMap[d.properties.hubspot_owner_id]?.name || 'Unassigned',
        }))
        .sort((a: any, b: any) => b.amount - a.amount)
        .slice(0, 20);

      // Overdue deals: open deals with closedate in the past
      const overdueDeals = allOpenForStale
        .filter((d: any) => d.properties.closedate && new Date(d.properties.closedate) < now)
        .map((d: any) => ({
          name: d.properties.dealname,
          amount: parseFloat(d.properties.amount || '0'),
          daysOverdue: Math.floor((now.getTime() - new Date(d.properties.closedate).getTime()) / 86400000),
          owner: repMap[d.properties.hubspot_owner_id]?.name || 'Unassigned',
        }));

      // Recently lost deals
      const recentlyLost = lostDeals.map((d: any) => ({
        name: d.properties.dealname,
        amount: parseFloat(d.properties.amount || '0'),
        closedate: d.properties.closedate,
        owner: repMap[d.properties.hubspot_owner_id]?.name || 'Unassigned',
      }));

      return c.json({ team: teamTotals, reps, staleDeals, overdueDeals, recentLost: recentlyLost });
    } catch (e: any) {
      return c.json({ error: e.message || 'HubSpot error' }, 500);
    }
  });

  // ── CEO Dashboard: Personal Pulse (Calendar + Email) ──────────────
  app.get('/api/personal-pulse', (c) => {
    const calendar = getPersonalPulseCache('calendar');
    const email = getPersonalPulseCache('email');
    return c.json({
      calendar: calendar ? JSON.parse(calendar.data) : null,
      calendar_updated: calendar?.updated_at || null,
      email: email ? JSON.parse(email.data) : null,
      email_updated: email?.updated_at || null,
    });
  });

  // ── WHOOP: Auth URL generator ─────────────────────────────────────
  app.get('/api/whoop/auth-url', (c) => {
    if (!WHOOP_CLIENT_ID) return c.json({ error: 'WHOOP not configured' }, 503);
    const dashboardUrl = DASHBOARD_URL || `http://localhost:${DASHBOARD_PORT}`;
    const redirectUri = `${dashboardUrl}/api/whoop/callback`;
    const scopes = 'offline read:profile read:recovery read:sleep read:cycles read:workout read:body_measurement';
    const state = crypto.randomBytes(16).toString('hex');
    const url = `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${WHOOP_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`;
    return c.json({ url, connected: !!getPersonalPulseCache('whoop_tokens') });
  });

  // ── WHOOP: Health data endpoint ──────────────────────────────────
  app.get('/api/whoop/data', async (c) => {
    const cached = getPersonalPulseCache('whoop_tokens');
    if (!cached) return c.json({ error: 'WHOOP not connected', needs_auth: true }, 401);

    let tokens = JSON.parse(cached.data);

    // Refresh token if expired (or within 5 min of expiry)
    if (tokens.expires_at < Math.floor(Date.now() / 1000) + 300) {
      try {
        const refreshRes = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
            client_id: WHOOP_CLIENT_ID,
            client_secret: WHOOP_CLIENT_SECRET,
            scope: 'offline',
          }),
        });
        const refreshData = await refreshRes.json() as any;
        if (refreshData.access_token) {
          tokens = {
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token || tokens.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + (refreshData.expires_in || 3600),
            scope: refreshData.scope || tokens.scope,
          };
          setPersonalPulseCache('whoop_tokens', JSON.stringify(tokens));
        } else {
          logger.warn({ refreshData }, 'WHOOP token refresh failed');
          return c.json({ error: 'Token refresh failed', needs_auth: true }, 401);
        }
      } catch (e: any) {
        logger.error({ error: e.message }, 'WHOOP token refresh error');
        return c.json({ error: 'Token refresh error', needs_auth: true }, 401);
      }
    }

    const headers = { Authorization: `Bearer ${tokens.access_token}` };
    const whoopApi = 'https://api.prod.whoop.com';

    try {
      // Fetch recovery, sleep, cycle data in parallel
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      const params = `start=${weekAgo.toISOString()}&end=${now.toISOString()}&limit=7`;

      const [recoveryRes, sleepRes, cycleRes, profileRes] = await Promise.all([
        fetch(`${whoopApi}/developer/v2/recovery?${params}`, { headers }),
        fetch(`${whoopApi}/developer/v2/activity/sleep?${params}`, { headers }),
        fetch(`${whoopApi}/developer/v2/cycle?${params}`, { headers }),
        fetch(`${whoopApi}/developer/v2/user/profile/basic`, { headers }),
      ]);

      if (recoveryRes.status === 401) {
        // Token is invalid, clear it
        return c.json({ error: 'WHOOP session expired', needs_auth: true }, 401);
      }

      const [recoveryData, sleepData, cycleData, profileData] = await Promise.all([
        recoveryRes.json() as any,
        sleepRes.json() as any,
        cycleRes.json() as any,
        profileRes.json() as any,
      ]);

      const recoveries = recoveryData.records || [];
      const sleeps = sleepData.records || [];
      const cycles = cycleData.records || [];

      // Latest recovery
      const latestRecovery = recoveries[0]?.score || null;
      // Latest sleep
      const latestSleep = sleeps[0]?.score || null;
      // Latest cycle (strain)
      const latestCycle = cycles[0]?.score || null;

      // Build 7-day trend arrays
      const recoveryTrend = recoveries.slice(0, 7).reverse().map((r: any) => ({
        date: r.created_at || r.updated_at,
        score: r.score?.recovery_score ?? null,
        hrv: r.score?.hrv_rmssd_milli ?? null,
        rhr: r.score?.resting_heart_rate ?? null,
      }));

      const sleepTrend = sleeps.slice(0, 7).reverse().map((s: any) => ({
        date: s.created_at || s.start,
        performance: s.score?.sleep_performance_percentage ?? null,
        efficiency: s.score?.sleep_efficiency_percentage ?? null,
        hours: s.score ? ((s.score.stage_summary?.total_light_sleep_time_milli || 0) +
                         (s.score.stage_summary?.total_slow_wave_sleep_time_milli || 0) +
                         (s.score.stage_summary?.total_rem_sleep_time_milli || 0)) / 3600000 : null,
        respiratory_rate: s.score?.respiratory_rate ?? null,
      }));

      const strainTrend = cycles.slice(0, 7).reverse().map((cy: any) => ({
        date: cy.created_at || cy.start,
        strain: cy.score?.strain ?? null,
        avg_hr: cy.score?.average_heart_rate ?? null,
        max_hr: cy.score?.max_heart_rate ?? null,
        calories: cy.score?.kilojoule ? Math.round(cy.score.kilojoule * 0.239006) : null,
      }));

      // Cache the result
      const whoopData = {
        profile: {
          first_name: profileData.first_name || null,
          last_name: profileData.last_name || null,
        },
        today: {
          recovery_score: latestRecovery?.recovery_score ?? null,
          hrv: latestRecovery?.hrv_rmssd_milli ?? null,
          resting_hr: latestRecovery?.resting_heart_rate ?? null,
          spo2: latestRecovery?.spo2_percentage ?? null,
          skin_temp: latestRecovery?.skin_temp_celsius ?? null,
          sleep_performance: latestSleep?.sleep_performance_percentage ?? null,
          sleep_hours: latestSleep ? ((latestSleep.stage_summary?.total_light_sleep_time_milli || 0) +
                                     (latestSleep.stage_summary?.total_slow_wave_sleep_time_milli || 0) +
                                     (latestSleep.stage_summary?.total_rem_sleep_time_milli || 0)) / 3600000 : null,
          strain: latestCycle?.strain ?? null,
          calories: latestCycle?.kilojoule ? Math.round(latestCycle.kilojoule * 0.239006) : null,
          sleep_efficiency: latestSleep?.sleep_efficiency_percentage ?? null,
          respiratory_rate: latestSleep?.respiratory_rate ?? null,
          light_sleep_mins: latestSleep?.stage_summary ? Math.round(latestSleep.stage_summary.total_light_sleep_time_milli / 60000) : null,
          deep_sleep_mins: latestSleep?.stage_summary ? Math.round(latestSleep.stage_summary.total_slow_wave_sleep_time_milli / 60000) : null,
          rem_sleep_mins: latestSleep?.stage_summary ? Math.round(latestSleep.stage_summary.total_rem_sleep_time_milli / 60000) : null,
          avg_hr: latestCycle?.average_heart_rate ?? null,
          max_hr: latestCycle?.max_heart_rate ?? null,
        },
        trends: { recovery: recoveryTrend, sleep: sleepTrend, strain: strainTrend },
      };

      setPersonalPulseCache('whoop', JSON.stringify(whoopData));

      return c.json(whoopData);
    } catch (e: any) {
      logger.error({ error: e.message }, 'WHOOP data fetch error');
      return c.json({ error: e.message || 'WHOOP API error' }, 500);
    }
  });

  // ── Granola: Meeting notes ──────────────────────────────────────────
  app.get('/api/granola/meetings', async (c) => {
    if (!GRANOLA_CLIENT_ID || !GRANOLA_REFRESH_TOKEN) {
      return c.json({ error: 'Granola not configured' }, 503);
    }

    // Serve cached data immediately if fresh (< 10 min old)
    const cached = getPersonalPulseCache('granola_meetings');
    const cacheAge = cached ? Math.floor(Date.now() / 1000) - cached.updated_at : Infinity;
    if (cached && cacheAge < 600) {
      const data = JSON.parse(cached.data);
      data._cached = true;
      data._cache_age = cacheAge;
      return c.json(data);
    }

    // Fetch fresh data with independent error handling per call
    try {
      const [meetingsSettled, actionsSettled] = await Promise.allSettled([
        callGranolaMcp('list_meetings', { time_range: 'this_week' }, 15000),
        callGranolaMcp('query_granola_meetings', { query: 'What are all action items, follow-ups, and next steps from meetings this week? List each one.' }, 20000),
      ]);
      const meetingsText = meetingsSettled.status === 'fulfilled' ? (meetingsSettled.value?.content?.[0]?.text || '') : '';
      const actionsText = actionsSettled.status === 'fulfilled' ? (actionsSettled.value?.content?.[0]?.text || '') : '';

      if (meetingsSettled.status === 'rejected') logger.warn({ error: (meetingsSettled.reason as Error).message }, 'Granola list_meetings failed');
      if (actionsSettled.status === 'rejected') logger.warn({ error: (actionsSettled.reason as Error).message }, 'Granola query_granola_meetings failed');

      // Merge: keep cached actions if fresh fetch returned empty
      const prevData = cached ? JSON.parse(cached.data) : {};
      const responseData = {
        meetings_raw: meetingsText || prevData.meetings_raw || '',
        actions_raw: actionsText || prevData.actions_raw || '',
        as_of: new Date().toISOString(),
      };
      setPersonalPulseCache('granola_meetings', JSON.stringify(responseData));
      return c.json(responseData);
    } catch (e: any) {
      logger.error({ error: e.message }, 'Granola meetings fetch error');
      if (cached) {
        const data = JSON.parse(cached.data);
        data._cached = true;
        data._cache_age = cacheAge;
        return c.json(data);
      }
      return c.json({ error: e.message || 'Granola API error' }, 500);
    }
  });

  app.get('/api/granola/meeting/:id', async (c) => {
    if (!GRANOLA_CLIENT_ID || !GRANOLA_REFRESH_TOKEN) {
      return c.json({ error: 'Granola not configured' }, 503);
    }
    const meetingId = c.req.param('id');
    try {
      const result = await callGranolaMcp('get_meetings', { meeting_ids: [meetingId] });
      const text = result?.content?.[0]?.text || '{}';
      return c.json({ meeting: text });
    } catch (e: any) {
      logger.error({ error: e.message }, 'Granola meeting detail error');
      return c.json({ error: e.message || 'Granola API error' }, 500);
    }
  });

  // ── CEO Dashboard: Stripe MRR ─────────────────────────────────────
  app.get('/api/stripe/mrr', async (c) => {
    if (!STRIPE_SECRET_KEY) return c.json({ error: 'Stripe not configured' }, 503);
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      const now = new Date();
      const thisMonthStart = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);

      // Fetch subs that count toward MRR: active, trialing, and past_due
      // (Stripe dashboard includes all three in MRR calculations)
      const activeSubs: any[] = [];
      for (const status of ['active', 'trialing', 'past_due'] as const) {
        let hasMore = true;
        let startingAfter: string | undefined;
        while (hasMore) {
          const params: any = { status, limit: 100, expand: ['data.items.data.price'] };
          if (startingAfter) params.starting_after = startingAfter;
          const page = await stripe.subscriptions.list(params);
          activeSubs.push(...page.data);
          hasMore = page.has_more;
          if (page.data.length > 0) startingAfter = page.data[page.data.length - 1].id;
        }
      }

      // Calculate MRR
      let mrr = 0;
      for (const sub of activeSubs) {
        for (const item of sub.items.data) {
          const amount = (item.price.unit_amount || 0) * (item.quantity || 1);
          const interval = item.price.recurring?.interval;
          if (interval === 'year') mrr += amount / 12;
          else if (interval === 'month') mrr += amount;
          else if (interval === 'week') mrr += amount * 4.33;
          else mrr += amount;
        }
      }
      mrr = mrr / 100;

      // New subs this month
      const newThisMonth = activeSubs.filter(s => s.created >= thisMonthStart).length;

      // Churned this month - single page, filtered by created date for speed
      let churnedThisMonth = 0;
      const cancelPage = await stripe.subscriptions.list({
        status: 'canceled', limit: 100,
        created: { gte: thisMonthStart - 90 * 86400 } as any, // recent subs only
      });
      for (const sub of cancelPage.data) {
        if (sub.canceled_at && sub.canceled_at >= thisMonthStart) churnedThisMonth++;
      }

      // Estimate last month MRR: current MRR minus new subs' MRR, plus churned
      // This is an approximation that avoids another full iteration
      let newSubsMrr = 0;
      for (const sub of activeSubs.filter(s => s.created >= thisMonthStart)) {
        for (const item of sub.items.data) {
          const amount = (item.price.unit_amount || 0) * (item.quantity || 1);
          const interval = item.price.recurring?.interval;
          if (interval === 'year') newSubsMrr += amount / 12;
          else if (interval === 'month') newSubsMrr += amount;
          else newSubsMrr += amount;
        }
      }
      newSubsMrr = newSubsMrr / 100;
      const mrrLastMonth = mrr - newSubsMrr; // rough approximation

      const growthPct = mrrLastMonth > 0 ? ((mrr - mrrLastMonth) / mrrLastMonth) * 100 : (mrr > 0 ? 100 : 0);

      return c.json({
        mrr: Math.round(mrr * 100) / 100,
        mrr_last_month: Math.round(mrrLastMonth * 100) / 100,
        growth_pct: Math.round(growthPct * 10) / 10,
        active_subs: activeSubs.length,
        churned_this_month: churnedThisMonth,
        new_this_month: newThisMonth,
      });
    } catch (e: any) {
      return c.json({ error: e.message || 'Stripe MRR error' }, 500);
    }
  });

  // ── CEO Dashboard: Stripe Churn ──────────────────────────────────
  app.get('/api/stripe/churn', async (c) => {
    if (!STRIPE_SECRET_KEY) return c.json({ error: 'Stripe not configured' }, 503);
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY);

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Count subs that count toward MRR (active + trialing + past_due)
      let activeCount = 0;
      for (const status of ['active', 'trialing', 'past_due'] as const) {
        for await (const _sub of stripe.subscriptions.list({ status, limit: 100 })) {
          activeCount++;
          if (activeCount >= 500) break;
        }
      }

      // Canceled this month only - use created filter to limit scope
      const canceledThisMonth: any[] = [];
      for await (const sub of stripe.subscriptions.list({
        status: 'canceled',
        limit: 100,
        created: { gte: Math.floor(lastMonthStart.getTime() / 1000) },
        expand: ['data.customer', 'data.items.data.price'],
      })) {
        if (sub.canceled_at && sub.canceled_at >= Math.floor(thisMonthStart.getTime() / 1000)) {
          canceledThisMonth.push(sub);
        }
        if (canceledThisMonth.length >= 50) break; // cap
      }

      let churnedRevenue = 0;
      const atRisk: any[] = [];
      for (const sub of canceledThisMonth) {
        let subMrr = 0;
        for (const item of (sub.items?.data || [])) {
          const amount = (item.price?.unit_amount || 0) * (item.quantity || 1);
          const interval = item.price?.recurring?.interval || 'month';
          if (interval === 'year') subMrr += amount / 12;
          else subMrr += amount;
        }
        subMrr = subMrr / 100;
        churnedRevenue += subMrr;

        const cust = sub.customer as any;
        const monthsActive = sub.start_date ? Math.round((sub.canceled_at! - sub.start_date) / (30 * 86400)) : 0;
        atRisk.push({
          name: cust?.name || cust?.email || 'Unknown',
          email: cust?.email || '',
          months_active: monthsActive,
          mrr: Math.round(subMrr * 100) / 100,
        });
      }

      const totalForRate = activeCount + canceledThisMonth.length;
      const churnRate = totalForRate > 0 ? (canceledThisMonth.length / totalForRate) * 100 : 0;

      return c.json({
        churned_count: canceledThisMonth.length,
        churned_revenue: Math.round(churnedRevenue * 100) / 100,
        churn_rate_pct: Math.round(churnRate * 10) / 10,
        at_risk: atRisk,
      });
    } catch (e: any) {
      return c.json({ error: e.message || 'Stripe churn error' }, 500);
    }
  });

  // ── CEO Dashboard: HubSpot Pipeline Analytics ────────────────────
  app.get('/api/hubspot/pipeline-analytics', async (c) => {
    if (!HUBSPOT_ACCESS_TOKEN) return c.json({ error: 'HubSpot not configured' }, 503);
    try {
      const baseUrl = 'https://api.hubapi.com';
      const headers = { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' };

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const PIPELINE_ID = 'default';
      const WON_STAGES = ['893814', '157800492'];
      const LOST_STAGES = ['closedlost', '10193805'];
      const CLOSED_STAGES = [...WON_STAGES, ...LOST_STAGES];

      async function searchDeals(filterGroups: any[], paginate = false) {
        const allResults: any[] = [];
        let after: string | undefined;
        do {
          const body: any = {
            filterGroups,
            properties: ['dealname', 'amount', 'dealstage', 'closedate', 'createdate', 'hubspot_owner_id', 'pipeline'],
            limit: 100,
          };
          if (after) body.after = after;
          let res = await fetch(`${baseUrl}/crm/v3/objects/deals/search`, {
            method: 'POST', headers,
            body: JSON.stringify(body),
          });
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, 1500));
            res = await fetch(`${baseUrl}/crm/v3/objects/deals/search`, {
              method: 'POST', headers,
              body: JSON.stringify(body),
            });
          }
          const data = await res.json() as any;
          const results = data.results || [];
          allResults.push(...results);
          after = data.paging?.next?.after;
          if (!paginate) break;
        } while (after && allResults.length < 5000);
        return allResults;
      }

      const pipelineFilter = { propertyName: 'pipeline', operator: 'EQ', value: PIPELINE_ID };

      // Get pipeline stages definition
      const stagesRes = await fetch(`${baseUrl}/crm/v3/pipelines/deals/${PIPELINE_ID}/stages`, { headers });
      const stagesData = await stagesRes.json() as any;
      const stageMap = new Map<string, string>();
      for (const stage of (stagesData.results || [])) {
        stageMap.set(stage.id, stage.label);
      }

      const [wonDealsThisMonth, openDeals, allWonDeals] = await Promise.all([
        // Won this month
        Promise.all(WON_STAGES.map(stage => searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'EQ', value: stage },
          { propertyName: 'closedate', operator: 'GTE', value: monthStart.toISOString() },
        ]}]))).then(results => results.flat()),
        // Open deals with amounts (for accurate pipeline value by stage)
        searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'NOT_IN', values: CLOSED_STAGES },
          { propertyName: 'amount', operator: 'GT', value: '0' },
        ]}]),
        // All won deals (for avg days to close)
        Promise.all(WON_STAGES.map(stage => searchDeals([{ filters: [
          pipelineFilter,
          { propertyName: 'dealstage', operator: 'EQ', value: stage },
        ]}]))).then(results => results.flat()),
      ]);

      // Avg days to close (from won deals this month)
      let totalDaysToClose = 0;
      let closedCount = 0;
      for (const deal of wonDealsThisMonth) {
        if (deal.properties.closedate && deal.properties.createdate) {
          const close = new Date(deal.properties.closedate).getTime();
          const create = new Date(deal.properties.createdate).getTime();
          const days = (close - create) / 86400000;
          if (days >= 0) {
            totalDaysToClose += days;
            closedCount++;
          }
        }
      }
      const avgDaysToClose = closedCount > 0 ? Math.round(totalDaysToClose / closedCount) : 0;

      // Pipeline coverage: open pipeline value / monthly target (estimate from won deals avg)
      const openPipelineValue = openDeals.reduce((s: number, d: any) => s + parseFloat(d.properties.amount || '0'), 0);
      const wonRevenue = wonDealsThisMonth.reduce((s: number, d: any) => s + parseFloat(d.properties.amount || '0'), 0);
      const monthlyTarget = wonRevenue > 0 ? wonRevenue * 1.2 : openPipelineValue; // rough estimate
      const pipelineCoverage = monthlyTarget > 0 ? openPipelineValue / monthlyTarget : 0;

      // Stage breakdown
      const stageCounts = new Map<string, { count: number; value: number }>();
      for (const deal of openDeals) {
        const stage = deal.properties.dealstage;
        const existing = stageCounts.get(stage) || { count: 0, value: 0 };
        existing.count++;
        existing.value += parseFloat(deal.properties.amount || '0');
        stageCounts.set(stage, existing);
      }

      const stages = Array.from(stageCounts.entries()).map(([id, data]) => ({
        name: stageMap.get(id) || id,
        count: data.count,
        value: data.value,
      }));

      // Conversion rate: won this month / (won + lost this month)
      const lostThisMonth = await Promise.all(LOST_STAGES.map(stage => searchDeals([{ filters: [
        pipelineFilter,
        { propertyName: 'dealstage', operator: 'EQ', value: stage },
        { propertyName: 'closedate', operator: 'GTE', value: monthStart.toISOString() },
      ]}]))).then(results => results.flat());

      const totalClosed = wonDealsThisMonth.length + lostThisMonth.length;
      const meetingToClose = totalClosed > 0 ? (wonDealsThisMonth.length / totalClosed) * 100 : 0;

      return c.json({
        avg_days_to_close: avgDaysToClose,
        pipeline_coverage: Math.round(pipelineCoverage * 100) / 100,
        stages,
        conversion_rates: {
          meeting_to_close: Math.round(meetingToClose * 10) / 10,
        },
        open_pipeline_value: openPipelineValue,
        won_revenue_mtd: wonRevenue,
      });
    } catch (e: any) {
      return c.json({ error: e.message || 'HubSpot pipeline error' }, 500);
    }
  });

  // ── CEO Dashboard: Agent Operations ──────────────────────────────
  app.get('/api/agent-ops', (c) => {
    try {
      const agentIds = ['main', ...listAgentIds()];
      const agents = agentIds.map(id => {
        const stats = getAgentTokenStats(id);
        // Memory count for this agent
        const memRow = runReadOnlyQuery(
          `SELECT COUNT(*) as cnt FROM memories WHERE agent_id = '${id.replace(/'/g, "''")}'`
        );
        const memoryCount = memRow.rows.length > 0 ? (memRow.rows[0].cnt as number) : 0;

        // Average output tokens per turn today
        const avgRow = runReadOnlyQuery(
          `SELECT COALESCE(AVG(output_tokens), 0) as avg_out FROM token_usage WHERE agent_id = '${id.replace(/'/g, "''")}' AND created_at >= unixepoch('now', 'start of day')`
        );
        const avgResponseTokens = avgRow.rows.length > 0 ? Math.round(avgRow.rows[0].avg_out as number) : 0;

        // All time tokens
        const allTimeRow = runReadOnlyQuery(
          `SELECT COALESCE(SUM(input_tokens + output_tokens), 0) as total_tokens, COALESCE(SUM(cost_usd), 0) as total_cost, COUNT(*) as total_turns FROM token_usage WHERE agent_id = '${id.replace(/'/g, "''")}'`
        );
        const allTime = allTimeRow.rows.length > 0 ? allTimeRow.rows[0] : { total_tokens: 0, total_cost: 0, total_turns: 0 };

        // Today tokens
        const todayRow = runReadOnlyQuery(
          `SELECT COALESCE(SUM(input_tokens + output_tokens), 0) as tokens_today FROM token_usage WHERE agent_id = '${id.replace(/'/g, "''")}' AND created_at >= unixepoch('now', 'start of day')`
        );
        const tokensToday = todayRow.rows.length > 0 ? (todayRow.rows[0].tokens_today as number) : 0;

        return {
          id,
          tokens_today: tokensToday,
          cost_today: Math.round(stats.todayCost * 100) / 100,
          turns_today: stats.todayTurns,
          total_tokens: allTime.total_tokens as number,
          total_cost: Math.round((allTime.total_cost as number) * 100) / 100,
          total_turns: allTime.total_turns as number,
          memory_count: memoryCount,
          avg_response_tokens: avgResponseTokens,
        };
      });

      return c.json({ agents });
    } catch (e: any) {
      return c.json({ error: e.message || 'Agent ops error' }, 500);
    }
  });

  // ── Chat endpoints ─────────────────────────────────────────────────

  // SSE stream for real-time chat updates
  app.get('/api/chat/stream', (c) => {
    return streamSSE(c, async (stream) => {
      // Send initial processing state
      const state = getIsProcessing();
      await stream.writeSSE({
        event: 'processing',
        data: JSON.stringify({ processing: state.processing, chatId: state.chatId }),
      });

      // Forward chat events to SSE client
      const handler = async (event: ChatEvent) => {
        try {
          await stream.writeSSE({
            event: event.type,
            data: JSON.stringify(event),
          });
        } catch {
          // Client disconnected
        }
      };

      chatEvents.on('chat', handler);

      // Keepalive ping every 30s
      const pingInterval = setInterval(async () => {
        try {
          await stream.writeSSE({ event: 'ping', data: '' });
        } catch {
          clearInterval(pingInterval);
        }
      }, 30_000);

      // Wait until the client disconnects
      try {
        await new Promise<void>((_, reject) => {
          stream.onAbort(() => reject(new Error('aborted')));
        });
      } catch {
        // Expected: client disconnected
      } finally {
        clearInterval(pingInterval);
        chatEvents.off('chat', handler);
      }
    });
  });

  // Chat history (paginated)
  app.get('/api/chat/history', (c) => {
    const chatId = c.req.query('chatId') || ALLOWED_CHAT_ID || '';
    if (!chatId) return c.json({ error: 'chatId required' }, 400);
    const limit = parseInt(c.req.query('limit') || '40', 10);
    const beforeId = c.req.query('beforeId');
    const turns = getConversationPage(chatId, limit, beforeId ? parseInt(beforeId, 10) : undefined);
    return c.json({ turns });
  });

  // Send message from dashboard
  app.post('/api/chat/send', async (c) => {
    if (!botApi) return c.json({ error: 'Bot API not available' }, 503);
    const body = await c.req.json<{ message?: string }>();
    const message = body?.message?.trim();
    if (!message) return c.json({ error: 'message required' }, 400);

    // Fire-and-forget: response comes via SSE
    void processMessageFromDashboard(botApi, message);
    return c.json({ ok: true });
  });

  // Abort current processing
  app.post('/api/chat/abort', (c) => {
    const { chatId } = getIsProcessing();
    if (!chatId) return c.json({ ok: false, reason: 'not_processing' });
    const aborted = abortActiveQuery(chatId);
    return c.json({ ok: aborted });
  });

  // ── v2 Endpoints: Health, Budget, Heartbeat, Audit, Plugins ────────

  // Health check endpoint (no auth required)
  app.get('/health', async (c) => {
    const { getHealthStatus } = await import('./health.js');
    const health = await getHealthStatus();
    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
    return c.json(health, statusCode);
  });

  // Heartbeat runs
  app.get('/api/heartbeat/runs', async (c) => {
    const { getRecentRuns } = await import('./heartbeat.js');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const agentId = c.req.query('agentId');
    const runs = getRecentRuns(limit, agentId || undefined);
    return c.json({ runs });
  });

  app.get('/api/heartbeat/stats', async (c) => {
    const agentId = c.req.query('agentId') || AGENT_ID;
    const { getAgentStats } = await import('./heartbeat.js');
    const stats = getAgentStats(agentId);
    return c.json(stats);
  });

  app.get('/api/heartbeat/active', async (c) => {
    const { getActiveRuns } = await import('./heartbeat.js');
    return c.json({ runs: getActiveRuns() });
  });

  // Budget endpoints
  app.get('/api/budget/policies', async (c) => {
    const { getAllPolicies } = await import('./budget.js');
    return c.json({ policies: getAllPolicies() });
  });

  app.post('/api/budget/policies', async (c) => {
    const { createBudgetPolicy } = await import('./budget.js');
    const body = await c.req.json<{
      scope: 'agent' | 'company';
      scope_id: string;
      window: 'daily' | 'monthly' | 'lifetime';
      limit_usd: number;
      warning_threshold?: number;
      auto_pause?: boolean;
    }>();
    if (!body.scope || !body.scope_id || !body.window || !body.limit_usd) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    const policy = createBudgetPolicy(body.scope, body.scope_id, body.window, body.limit_usd, {
      warningThreshold: body.warning_threshold,
      autoPause: body.auto_pause,
    });
    return c.json({ policy });
  });

  app.delete('/api/budget/policies/:id', async (c) => {
    const { deleteBudgetPolicy } = await import('./budget.js');
    const deleted = deleteBudgetPolicy(c.req.param('id'));
    return c.json({ ok: deleted });
  });

  app.get('/api/budget/summary/:agentId', async (c) => {
    const { getAgentBudgetSummary } = await import('./budget.js');
    const summary = getAgentBudgetSummary(c.req.param('agentId'));
    return c.json(summary);
  });

  app.get('/api/budget/incidents', async (c) => {
    const { getRecentIncidents } = await import('./budget.js');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    return c.json({ incidents: getRecentIncidents(limit) });
  });

  app.post('/api/budget/pause/:agentId', async (c) => {
    const { pauseAgent } = await import('./budget.js');
    pauseAgent(c.req.param('agentId'));
    return c.json({ ok: true });
  });

  app.post('/api/budget/resume/:agentId', async (c) => {
    const { resumeAgent } = await import('./budget.js');
    resumeAgent(c.req.param('agentId'));
    return c.json({ ok: true });
  });

  // Activity audit log
  app.get('/api/activity', async (c) => {
    const { getRecentActivity } = await import('./audit.js');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    return c.json({ entries: getRecentActivity(limit, offset) });
  });

  app.get('/api/activity/entity/:type', async (c) => {
    const { getActivityByEntity } = await import('./audit.js');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    return c.json({ entries: getActivityByEntity(c.req.param('type'), limit) });
  });

  // Session compaction status
  app.get('/api/sessions/health', async (c) => {
    const { getSessionHealthSummary } = await import('./session-compaction.js');
    return c.json({ sessions: getSessionHealthSummary() });
  });

  app.get('/api/sessions/config', async (c) => {
    const { getCompactionConfig } = await import('./session-compaction.js');
    return c.json(getCompactionConfig());
  });

  // Plugins
  app.get('/api/plugins', async (c) => {
    const { getPlugins } = await import('./plugins.js');
    return c.json({ plugins: getPlugins() });
  });

  app.get('/api/plugins/tools', async (c) => {
    const { getPluginTools } = await import('./plugins.js');
    return c.json({ tools: getPluginTools() });
  });

  // Discord adapter info
  app.get('/api/discord/status', async (c) => {
    const { discordEnabled, DISCORD_WEBHOOK_URL } = await import('./discord.js');
    return c.json({
      enabled: discordEnabled,
      webhook_configured: !!DISCORD_WEBHOOK_URL,
    });
  });

  // Supabase status
  app.get('/api/supabase/status', async (c) => {
    const { supabaseEnabled, getSupabaseClient } = await import('./supabase.js');
    let connected = false;
    if (supabaseEnabled) {
      const client = getSupabaseClient();
      if (client) {
        connected = await client.healthCheck();
      }
    }
    return c.json({ enabled: supabaseEnabled, connected });
  });

  // ── Shopify ─────────────────────────────────────────────────────

  // Helper: get a fresh Shopify Admin API token via client credentials
  async function getShopifyToken(): Promise<string> {
    const cached = getPersonalPulseCache('shopify_token');
    if (cached) {
      try {
        const parsed = JSON.parse(cached.data);
        if (parsed.expires_at && Date.now() < parsed.expires_at) return parsed.access_token;
      } catch {}
    }
    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SHOPIFY_CLIENT_ID,
        client_secret: SHOPIFY_CLIENT_SECRET,
      }),
    });
    const data = await res.json() as any;
    if (!data.access_token) throw new Error(data.error || 'Shopify token exchange failed');
    setPersonalPulseCache('shopify_token', JSON.stringify({
      access_token: data.access_token,
      expires_at: Date.now() + ((data.expires_in || 86000) - 300) * 1000,
    }));
    return data.access_token;
  }

  async function shopifyGet(endpoint: string): Promise<any> {
    const token = await getShopifyToken();
    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01${endpoint}`, {
      headers: { 'X-Shopify-Access-Token': token },
    });
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000));
      const retry = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01${endpoint}`, {
        headers: { 'X-Shopify-Access-Token': token },
      });
      return retry.json();
    }
    return res.json();
  }

  // Shopify overview: products, orders summary, customers, inventory
  app.get('/api/shopify/overview', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    if (!SHOPIFY_CLIENT_ID) return c.json({ error: 'Shopify not configured' }, 503);
    try {
      const [products, orders, customers, ordersCount, inventory] = await Promise.all([
        shopifyGet('/products.json?limit=10'),
        shopifyGet('/orders.json?limit=10&status=any'),
        shopifyGet('/customers.json?limit=10'),
        shopifyGet('/orders/count.json?status=any'),
        shopifyGet('/inventory_levels.json?location_ids=72945926197&limit=50'),
      ]);
      return c.json({
        products: products.products || [],
        orders: orders.orders || [],
        customers: customers.customers || [],
        orders_count: ordersCount?.count || 0,
        inventory: inventory.inventory_levels || [],
      });
    } catch (e: any) {
      logger.error({ err: e.message }, 'Shopify overview failed');
      return c.json({ error: e.message || 'Shopify error' }, 500);
    }
  });

  // Shopify sales metrics: MTD revenue, order counts, AOV
  app.get('/api/shopify/sales', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    if (!SHOPIFY_CLIENT_ID) return c.json({ error: 'Shopify not configured' }, 503);
    try {
      const now = new Date();
      const curYear = now.getFullYear();
      const curMonth = now.getMonth();
      const mtdStart = new Date(curYear, curMonth, 1).toISOString();

      // Get all orders this month (paginate if needed)
      let allOrders: any[] = [];
      let url = `/orders.json?status=any&created_at_min=${mtdStart}&limit=250`;
      const data = await shopifyGet(url);
      allOrders = data.orders || [];

      // Previous month same period
      const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
      const prevYear = curMonth === 0 ? curYear - 1 : curYear;
      const prevStart = new Date(prevYear, prevMonth, 1).toISOString();
      const prevEnd = new Date(prevYear, prevMonth, now.getDate()).toISOString();
      const prevData = await shopifyGet(`/orders.json?status=any&created_at_min=${prevStart}&created_at_max=${prevEnd}&limit=250`);
      const prevOrders = prevData.orders || [];

      function calcMetrics(orders: any[]) {
        const paid = orders.filter((o: any) => o.financial_status === 'paid' || o.financial_status === 'partially_refunded');
        const revenue = paid.reduce((sum: number, o: any) => sum + parseFloat(o.total_price || '0'), 0);
        const refunds = paid.reduce((sum: number, o: any) => {
          return sum + (o.refunds || []).reduce((rs: number, r: any) => {
            return rs + (r.transactions || []).reduce((ts: number, t: any) => ts + parseFloat(t.amount || '0'), 0);
          }, 0);
        }, 0);
        return {
          total_orders: orders.length,
          paid_orders: paid.length,
          gross_revenue: revenue,
          refunds,
          net_revenue: revenue - refunds,
          aov: paid.length > 0 ? revenue / paid.length : 0,
        };
      }

      const current = calcMetrics(allOrders);
      const previous = calcMetrics(prevOrders);

      return c.json({
        current,
        previous,
        as_of: now.toISOString(),
      });
    } catch (e: any) {
      logger.error({ err: e.message }, 'Shopify sales failed');
      return c.json({ error: e.message || 'Shopify error' }, 500);
    }
  });

  // Recent orders
  app.get('/api/shopify/orders', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    if (!SHOPIFY_CLIENT_ID) return c.json({ error: 'Shopify not configured' }, 503);
    try {
      const limit = c.req.query('limit') || '20';
      const data = await shopifyGet(`/orders.json?limit=${limit}&status=any`);
      return c.json({ orders: data.orders || [] });
    } catch (e: any) {
      return c.json({ error: e.message || 'Shopify error' }, 500);
    }
  });

  // Customer list
  app.get('/api/shopify/customers', async (c) => {
    if (!isAuthenticated(c)) return c.json({ error: 'Unauthorized' }, 401);
    if (!SHOPIFY_CLIENT_ID) return c.json({ error: 'Shopify not configured' }, 503);
    try {
      const limit = c.req.query('limit') || '50';
      const data = await shopifyGet(`/customers.json?limit=${limit}`);
      return c.json({ customers: data.customers || [] });
    } catch (e: any) {
      return c.json({ error: e.message || 'Shopify error' }, 500);
    }
  });

  // ── Builder (Lovable clone) ────────────────────────────────────────

  const BUILDER_SYSTEM_PROMPT = `You are an expert web developer. You build polished, production-quality single-page web applications.

RULES:
- Return complete, self-contained files. Every file must be a fenced code block with the filename after the language:  \`\`\`html:index.html
- Always include an index.html as the entry point
- Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use vanilla JavaScript for interactivity (no frameworks required, but you can use Alpine.js via CDN if helpful)
- Make apps visually polished, responsive, and modern
- Default to dark themes with clean typography
- Include ALL code in the files - no placeholders, no "add your code here"
- For multi-file projects, inline CSS/JS via <style> and <script> tags inside index.html, OR use separate files referenced properly
- When iterating on an existing project, return ALL files with their COMPLETE contents (not just the changed parts)
- If the user asks to change something specific, keep everything else intact

FORMAT:
Always structure your response as:
1. A brief explanation of what you built/changed (2-3 sentences max)
2. The complete file contents in fenced code blocks

Example:
Built a todo app with local storage persistence and smooth animations.

\`\`\`html:index.html
<!DOCTYPE html>
<html>...
\`\`\`

\`\`\`js:app.js
// app logic
\`\`\``;

  function parseBuilderFiles(response: string): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];
    const regex = /```(\w+):([^\n]+)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(response)) !== null) {
      files.push({ path: match[2].trim(), content: match[3].trimEnd() });
    }
    return files;
  }

  function extractBuilderExplanation(response: string): string {
    const firstBlock = response.indexOf('```');
    if (firstBlock === -1) return response.trim();
    return response.slice(0, firstBlock).trim();
  }

  // List projects
  app.get('/api/builder/projects', (c) => {
    return c.json({ projects: listBuilderProjects() });
  });

  // Create project
  app.post('/api/builder/projects', async (c) => {
    const body = await c.req.json<{ name?: string; description?: string }>();
    const name = body?.name?.trim();
    if (!name) return c.json({ error: 'name required' }, 400);
    const id = crypto.randomBytes(8).toString('hex');
    const project = createBuilderProject(id, name, body?.description?.trim() || '');
    return c.json({ project }, 201);
  });

  // Get project with files + messages
  app.get('/api/builder/projects/:id', (c) => {
    const id = c.req.param('id');
    const project = getBuilderProject(id);
    if (!project) return c.json({ error: 'not found' }, 404);
    const files = getBuilderFiles(id);
    const messages = getBuilderMessages(id);
    return c.json({ project, files, messages });
  });

  // Delete project
  app.delete('/api/builder/projects/:id', (c) => {
    const id = c.req.param('id');
    const ok = deleteBuilderProject(id);
    return c.json({ ok });
  });

  // Generate code
  app.post('/api/builder/projects/:id/generate', async (c) => {
    const projectId = c.req.param('id');
    const project = getBuilderProject(projectId);
    if (!project) return c.json({ error: 'project not found' }, 404);

    const body = await c.req.json<{ prompt?: string }>();
    const prompt = body?.prompt?.trim();
    if (!prompt) return c.json({ error: 'prompt required' }, 400);

    // Save user message
    saveBuilderMessage(projectId, 'user', prompt);

    // Build conversation context
    const existingFiles = getBuilderFiles(projectId);
    const history = getBuilderMessages(projectId, 20);

    const conversationMsgs: Array<{ role: 'user' | 'model'; content: string }> = [];

    // Add file context
    if (existingFiles.length > 0) {
      const filesContext = existingFiles.map((f) =>
        '```' + (f.file_path.endsWith('.html') ? 'html' : f.file_path.endsWith('.css') ? 'css' : f.file_path.endsWith('.js') ? 'js' : '') + ':' + f.file_path + '\n' + f.content + '\n```'
      ).join('\n\n');
      conversationMsgs.push({
        role: 'user',
        content: `Here are the current project files:\n\n${filesContext}\n\nPlease keep these in mind for context.`,
      });
      conversationMsgs.push({ role: 'model', content: 'Got it, I have the current project files. What would you like me to do?' });
    }

    // Add conversation history
    for (const m of history) {
      conversationMsgs.push({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content });
    }

    try {
      let fullResponse: string;

      // Try Anthropic first if key is available, otherwise use Gemini
      const secrets = readEnvFile(['ANTHROPIC_API_KEY']);
      const anthropicKey = secrets.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

      logger.info({ provider: anthropicKey ? 'anthropic' : 'gemini', msgCount: conversationMsgs.length }, 'Builder: starting generation');

      if (anthropicKey) {
        // Use Anthropic
        const anthropicMsgs = conversationMsgs.map((m) => ({
          role: m.role === 'model' ? 'assistant' as const : 'user' as const,
          content: m.content,
        }));

        const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16384,
            system: BUILDER_SYSTEM_PROMPT,
            messages: anthropicMsgs,
          }),
        });

        if (!apiResponse.ok) {
          const errText = await apiResponse.text();
          logger.error({ status: apiResponse.status, body: errText }, 'Builder: Anthropic API error, falling back to Gemini');
          fullResponse = await generateText(BUILDER_SYSTEM_PROMPT, conversationMsgs, 'gemini-2.5-flash');
        } else {
          const result = await apiResponse.json() as { content: Array<{ type: string; text: string }> };
          fullResponse = result.content.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('');
        }
      } else {
        // Use Gemini
        fullResponse = await generateText(BUILDER_SYSTEM_PROMPT, conversationMsgs, 'gemini-2.5-flash');
      }

      logger.info({ responseLen: fullResponse.length }, 'Builder: AI response received');

      // Parse files from response
      const files = parseBuilderFiles(fullResponse);
      const explanation = extractBuilderExplanation(fullResponse);

      logger.info({ filesCount: files.length, filePaths: files.map(f => f.path), explanationLen: explanation.length }, 'Builder: parsed response');

      // Save files
      if (files.length > 0) {
        saveBuilderFiles(projectId, files);
      } else {
        logger.warn({ responseStart: fullResponse.slice(0, 300) }, 'Builder: no files parsed from response');
      }

      // Save assistant message
      saveBuilderMessage(projectId, 'assistant', fullResponse);

      // Auto-create version
      createBuilderVersion(projectId, explanation.slice(0, 200));

      const allFiles = getBuilderFiles(projectId);
      logger.info({ allFilesCount: allFiles.length }, 'Builder: returning response');

      return c.json({
        explanation,
        files,
        fullResponse,
        allFiles,
      });
    } catch (err: unknown) {
      logger.error({ err }, 'Builder: generation failed');
      const errMsg = err instanceof Error ? err.message : 'Generation failed';
      return c.json({ error: errMsg }, 500);
    }
  });

  // Manual file edit
  app.put('/api/builder/projects/:id/files/:path{.+}', async (c) => {
    const projectId = c.req.param('id');
    const filePath = c.req.param('path');
    const body = await c.req.json<{ content?: string }>();
    if (body?.content === undefined) return c.json({ error: 'content required' }, 400);
    saveBuilderFile(projectId, filePath, body.content);
    return c.json({ ok: true });
  });

  // Versions
  app.get('/api/builder/projects/:id/versions', (c) => {
    const projectId = c.req.param('id');
    return c.json({ versions: listBuilderVersions(projectId) });
  });

  app.post('/api/builder/projects/:id/versions', async (c) => {
    const projectId = c.req.param('id');
    const body = await c.req.json<{ message?: string }>().catch(() => ({}));
    const ver = createBuilderVersion(projectId, (body as { message?: string })?.message || '');
    return c.json({ version: ver });
  });

  app.post('/api/builder/projects/:id/versions/:vid/restore', (c) => {
    const projectId = c.req.param('id');
    const vid = c.req.param('vid');
    const ok = restoreBuilderVersion(projectId, vid);
    if (!ok) return c.json({ error: 'version not found' }, 404);
    return c.json({ ok: true, files: getBuilderFiles(projectId) });
  });

  // ── Oracle API endpoints ───────────────────────────────────────────

  // Chat with the Oracle (text or text + vision)
  app.post('/api/oracle/chat', async (c) => {
    try {
      const body = await c.req.json<{ message: string; image?: string }>();
      if (!body?.message) return c.json({ error: 'message required' }, 400);
      const response = await oracleChat(body.message, body.image);
      return c.json({ response });
    } catch (e: any) {
      logger.error({ error: e.message }, 'Oracle chat error');
      return c.json({ error: e.message || 'Oracle chat failed' }, 500);
    }
  });

  // Streaming chat with the Oracle (SSE)
  app.post('/api/oracle/chat-stream', async (c) => {
    try {
      const body = await c.req.json<{ message: string; image?: string }>();
      if (!body?.message) return c.json({ error: 'message required' }, 400);

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of oracleChatStream(body.message, body.image)) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (e: any) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (e: any) {
      logger.error({ error: e.message }, 'Oracle stream error');
      return c.json({ error: e.message || 'Stream failed' }, 500);
    }
  });

  // Speech-to-text
  app.post('/api/oracle/stt', async (c) => {
    try {
      const arrayBuffer = await c.req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length === 0) return c.json({ error: 'empty audio' }, 400);
      const text = await oracleSTT(buffer);
      return c.json({ text });
    } catch (e: any) {
      logger.error({ error: e.message }, 'Oracle STT error');
      return c.json({ error: e.message || 'STT failed' }, 500);
    }
  });

  // Text-to-speech
  app.post('/api/oracle/tts', async (c) => {
    try {
      const body = await c.req.json<{ text: string }>();
      if (!body?.text) return c.json({ error: 'text required' }, 400);
      const audioBuffer = await oracleTTS(body.text);
      return new Response(audioBuffer, {
        headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-cache' },
      });
    } catch (e: any) {
      logger.error({ error: e.message }, 'Oracle TTS error');
      return c.json({ error: e.message || 'TTS failed' }, 500);
    }
  });

  // Reset conversation
  app.post('/api/oracle/reset', (c) => {
    resetOracleHistory();
    return c.json({ ok: true });
  });

  // ── Dev Projects API ───────────────────────────────────────────────

  app.get('/api/projects', (c) => {
    return c.json({ projects: listDevProjects() });
  });

  app.post('/api/projects', async (c) => {
    const body = await c.req.json<{
      name?: string; description?: string; repo?: string; status?: string;
      environment?: string; vercel_url?: string; prod_url?: string;
      branch?: string; tags?: string[]; notes?: string;
    }>();
    const name = body?.name?.trim();
    if (!name) return c.json({ error: 'name required' }, 400);
    const id = (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || crypto.randomBytes(4).toString('hex');
    const project = createDevProject({ id, name, ...body });
    return c.json({ project }, 201);
  });

  // Static routes MUST come before parameterized routes
  app.get('/api/projects/activity/recent', (c) => {
    return c.json({ activity: getRecentDevActivity(50) });
  });

  app.get('/api/projects/:id', (c) => {
    const id = c.req.param('id');
    const project = getDevProject(id);
    if (!project) return c.json({ error: 'not found' }, 404);
    const updates = getDevProjectUpdates(id, 100);
    return c.json({ project, updates });
  });

  app.put('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const project = updateDevProject(id, body);
    if (!project) return c.json({ error: 'not found' }, 404);
    return c.json({ project });
  });

  app.delete('/api/projects/:id', (c) => {
    const id = c.req.param('id');
    const ok = deleteDevProject(id);
    return c.json({ ok });
  });

  app.post('/api/projects/:id/updates', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<{ type?: string; content?: string; agent_id?: string; metadata?: Record<string, unknown> }>();
    if (!body?.content?.trim()) return c.json({ error: 'content required' }, 400);
    addDevProjectUpdate(id, body.agent_id || 'main', body.type || 'note', body.content.trim(), body.metadata || {});
    return c.json({ ok: true });
  });

  // GitHub integration: fetch PRs for a repo
  app.get('/api/projects/:id/github', async (c) => {
    const id = c.req.param('id');
    const project = getDevProject(id);
    if (!project) return c.json({ error: 'not found' }, 404);
    if (!project.repo) return c.json({ prs: [], deployments: [], error: 'no repo configured' });

    try {
      const { execSync } = await import('child_process');
      const repo = project.repo; // e.g. "your-org/your-repo"

      // Fetch recent PRs
      const prsRaw = execSync(
        `gh pr list --repo ${repo} --state all --limit 15 --json number,title,state,url,headRefName,createdAt,mergedAt,author`,
        { timeout: 15000, encoding: 'utf-8' },
      );
      const prs = JSON.parse(prsRaw || '[]');

      // Fetch recent deployments (Vercel)
      let deployments: unknown[] = [];
      try {
        const deploymentsRaw = execSync(
          `gh api repos/${repo}/deployments --jq '[.[:10] | .[] | {id: .id, environment: .environment, ref: .ref, created_at: .created_at, description: .description, creator: .creator.login}]'`,
          { timeout: 15000, encoding: 'utf-8' },
        );
        deployments = JSON.parse(deploymentsRaw || '[]');
      } catch { /* no deployments or no access */ }

      // Fetch recent commits on branch
      let commits: unknown[] = [];
      const branch = project.branch || 'main';
      try {
        const commitsRaw = execSync(
          `gh api repos/${repo}/commits?sha=${branch}&per_page=10 --jq '[.[] | {sha: .sha[:7], message: .commit.message, date: .commit.author.date, author: .commit.author.name}]'`,
          { timeout: 15000, encoding: 'utf-8' },
        );
        commits = JSON.parse(commitsRaw || '[]');
      } catch { /* */ }

      return c.json({ prs, deployments, commits });
    } catch (err) {
      return c.json({ prs: [], deployments: [], commits: [], error: String(err) });
    }
  });

  const server = serve({ fetch: app.fetch, port: DASHBOARD_PORT }, () => {
    logger.info({ port: DASHBOARD_PORT }, 'Dashboard server running');
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn({ port: DASHBOARD_PORT }, 'Dashboard port already in use -- skipping dashboard (kill the other process or change DASHBOARD_PORT in .env)');
    } else {
      logger.error({ err }, 'Dashboard server error');
    }
  });
}
