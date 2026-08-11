/**
 * Subprocess reaper.
 *
 * The Claude Agent SDK spawns the `claude` CLI as a child of this process,
 * and that CLI in turn spawns MCP servers (e.g. a Playwright browser). When a
 * query is aborted (manual /stop or the AGENT_TIMEOUT_MS auto-abort), the SDK
 * is *supposed* to kill its subprocess -- but in practice a wedged `claude`
 * (or a hung MCP browser) can survive the abort. When that happens the
 * `for await (query(...))` loop in agent.ts never unblocks, so runAgent never
 * returns and the per-chat message queue wedges: every later message just
 * reports "another is processing" and the agent goes silent.
 *
 * This module force-kills the leaked subprocess subtree at the OS level so the
 * SDK's stdio closes, runAgent unblocks, and the queue drains. It also runs a
 * periodic sweeper as a catch-all for any leak that slips past the abort path.
 *
 * macOS + Linux only (uses `ps`). No-ops safely if `ps` is unavailable.
 */

import { execFileSync } from 'node:child_process';

import { logger } from './logger.js';

interface ProcRow {
  pid: number;
  ppid: number;
  /** Elapsed wall-clock seconds since the process started (-1 if unknown). */
  etimes: number;
  /** Executable path/name as reported by `ps -o comm`. */
  comm: string;
}

/** Parse `ps` etime ([[dd-]hh:]mm:ss) into seconds. */
function parseEtime(raw: string): number {
  const s = raw.trim();
  if (!s) return -1;
  let days = 0;
  let rest = s;
  const dash = s.indexOf('-');
  if (dash !== -1) {
    days = parseInt(s.slice(0, dash), 10) || 0;
    rest = s.slice(dash + 1);
  }
  const parts = rest.split(':').map((p) => parseInt(p, 10) || 0);
  let hh = 0;
  let mm = 0;
  let ss = 0;
  if (parts.length === 3) [hh, mm, ss] = parts;
  else if (parts.length === 2) [mm, ss] = parts;
  else if (parts.length === 1) [ss] = parts;
  return days * 86400 + hh * 3600 + mm * 60 + ss;
}

/** Snapshot the full process table. Empty array if `ps` fails. */
function snapshot(): ProcRow[] {
  try {
    const out = execFileSync('ps', ['-axo', 'pid=,ppid=,etime=,comm='], {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
    const rows: ProcRow[] = [];
    for (const line of out.split('\n')) {
      // pid ppid etime comm...  (comm may contain spaces / a full path)
      const m = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+(.+?)\s*$/);
      if (!m) continue;
      rows.push({
        pid: parseInt(m[1], 10),
        ppid: parseInt(m[2], 10),
        etimes: parseEtime(m[3]),
        comm: m[4],
      });
    }
    return rows;
  } catch (err) {
    logger.warn({ err }, 'proc-reaper: ps snapshot failed');
    return [];
  }
}

/** Descendant PIDs of rootPid (excludes rootPid itself). */
function descendantsOf(rootPid: number, rows: ProcRow[]): number[] {
  const byParent = new Map<number, number[]>();
  for (const r of rows) {
    const arr = byParent.get(r.ppid);
    if (arr) arr.push(r.pid);
    else byParent.set(r.ppid, [r.pid]);
  }
  const out: number[] = [];
  const stack = [rootPid];
  while (stack.length) {
    const cur = stack.pop() as number;
    for (const child of byParent.get(cur) ?? []) {
      out.push(child);
      stack.push(child);
    }
  }
  return out;
}

function isClaudeCli(comm: string): boolean {
  // `ps -o comm` reports either "claude" or a full path ending in "/claude".
  const base = comm.split('/').pop() ?? comm;
  return base === 'claude';
}

/**
 * PIDs of `claude` CLI processes that are descendants of THIS process right now.
 * Used to snapshot a baseline before a query so we can later tell which
 * subprocess(es) belong to that query (and not to a concurrent chat).
 */
export function snapshotClaudeDescendants(): Set<number> {
  const rows = snapshot();
  const desc = new Set(descendantsOf(process.pid, rows));
  const out = new Set<number>();
  for (const r of rows) {
    if (desc.has(r.pid) && isClaudeCli(r.comm)) out.add(r.pid);
  }
  return out;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function signal(pid: number, sig: NodeJS.Signals): boolean {
  try {
    process.kill(pid, sig);
    return true;
  } catch {
    return false; // already gone, or not permitted
  }
}

/**
 * Kill a fixed set of PIDs: SIGTERM, grace period, then SIGKILL survivors.
 * The set is captured up front so reparented orphans (whose parent we just
 * killed) are still terminated rather than escaping the subtree walk.
 */
async function killSet(targets: number[], graceMs: number): Promise<number[]> {
  if (!targets.length) return [];
  for (const pid of targets) signal(pid, 'SIGTERM');
  await sleep(graceMs);
  const killed: number[] = [];
  for (const pid of targets) {
    // Is it still alive? kill(pid, 0) throws if not.
    try {
      process.kill(pid, 0);
    } catch {
      killed.push(pid); // gone after SIGTERM
      continue;
    }
    if (signal(pid, 'SIGKILL')) killed.push(pid);
  }
  return killed;
}

/**
 * Force-kill any `claude` subprocess subtree spawned since `baseline` was
 * captured. Call this from an abort/timeout path as a backstop for when the
 * SDK's own abort fails to reap the subprocess. Returns the PIDs it killed.
 */
export async function reapLeakedSubprocesses(
  baseline: Set<number>,
  opts: { graceMs?: number } = {},
): Promise<number[]> {
  const rows = snapshot();
  const desc = new Set(descendantsOf(process.pid, rows));
  const leakedRoots: number[] = [];
  for (const r of rows) {
    if (desc.has(r.pid) && isClaudeCli(r.comm) && !baseline.has(r.pid)) {
      leakedRoots.push(r.pid);
    }
  }
  if (!leakedRoots.length) return [];

  const targets = new Set<number>();
  for (const root of leakedRoots) {
    targets.add(root);
    for (const child of descendantsOf(root, rows)) targets.add(child);
  }
  const killed = await killSet([...targets], opts.graceMs ?? 3000);
  if (killed.length) {
    logger.warn({ leakedRoots, killed }, 'proc-reaper: force-killed leaked agent subprocess subtree');
  }
  return killed;
}

/**
 * Periodic catch-all sweeper. Kills any `claude` subprocess descended from this
 * process that has outlived the agent timeout by a safe margin -- i.e. a query
 * that should have been aborted long ago but wasn't. Covers every leak path
 * (timeout, /stop, crash) regardless of whether a baseline was captured, with
 * no risk to healthy queries (which never exceed the timeout).
 */
export function startSubprocessReaper(opts: { maxAgeMs: number; intervalMs?: number }): () => void {
  const maxAgeSec = Math.ceil(opts.maxAgeMs / 1000);
  const intervalMs = opts.intervalMs ?? 60_000;

  const tick = async () => {
    try {
      const rows = snapshot();
      const desc = new Set(descendantsOf(process.pid, rows));
      const overAge = rows.filter(
        (r) => desc.has(r.pid) && isClaudeCli(r.comm) && r.etimes >= 0 && r.etimes >= maxAgeSec,
      );
      if (!overAge.length) return;
      const targets = new Set<number>();
      for (const r of overAge) {
        targets.add(r.pid);
        for (const child of descendantsOf(r.pid, rows)) targets.add(child);
      }
      const killed = await killSet([...targets], 3000);
      logger.warn(
        { overAge: overAge.map((r) => ({ pid: r.pid, ageSec: r.etimes })), killed },
        'proc-reaper: swept stale agent subprocess(es) past max age',
      );
    } catch (err) {
      logger.warn({ err }, 'proc-reaper: sweep tick failed');
    }
  };

  const handle = setInterval(() => void tick(), intervalMs);
  if (typeof handle.unref === 'function') handle.unref();
  logger.info({ maxAgeSec, intervalMs }, 'Subprocess reaper started');
  return () => clearInterval(handle);
}
