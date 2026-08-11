export function getDashboardHtml(token: string, chatId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>LinkOS // The Matrix</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23050a05'/%3E%3Cline x1='10' y1='2' x2='10' y2='20' stroke='%2300ff41' stroke-width='1' opacity='0.07'/%3E%3Cline x1='20' y1='0' x2='20' y2='12' stroke='%2300ff41' stroke-width='1' opacity='0.05'/%3E%3Cline x1='44' y1='52' x2='44' y2='64' stroke='%2300ff41' stroke-width='1' opacity='0.05'/%3E%3Cline x1='54' y1='44' x2='54' y2='62' stroke='%2300ff41' stroke-width='1' opacity='0.07'/%3E%3Cpath d='M4 32 Q32 8 60 32 Q32 56 4 32Z' fill='%23001500' stroke='%2300ff41' stroke-width='2.5'/%3E%3Ccircle cx='32' cy='32' r='11' fill='%23000d00' stroke='%2300ff41' stroke-width='1.5' opacity='0.6'/%3E%3Cline x1='27' y1='23' x2='27' y2='41' stroke='%2300ff41' stroke-width='1' opacity='0.2'/%3E%3Cline x1='32' y1='21' x2='32' y2='43' stroke='%2300ff41' stroke-width='1.2' opacity='0.3'/%3E%3Cline x1='37' y1='23' x2='37' y2='41' stroke='%2300ff41' stroke-width='1' opacity='0.2'/%3E%3Ccircle cx='32' cy='32' r='4.5' fill='%2300ff41' opacity='0.95'/%3E%3Ccircle cx='35' cy='29' r='1.5' fill='%23aaffaa' opacity='0.25'/%3E%3C/svg%3E" />
<link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='36' fill='%23050a05'/%3E%3Cline x1='25' y1='5' x2='25' y2='50' stroke='%2300ff41' stroke-width='1.5' opacity='0.06'/%3E%3Cline x1='45' y1='0' x2='45' y2='35' stroke='%2300ff41' stroke-width='1.5' opacity='0.05'/%3E%3Cline x1='135' y1='145' x2='135' y2='180' stroke='%2300ff41' stroke-width='1.5' opacity='0.05'/%3E%3Cline x1='155' y1='130' x2='155' y2='175' stroke='%2300ff41' stroke-width='1.5' opacity='0.06'/%3E%3Cpath d='M10 85 Q90 20 170 85 Q90 150 10 85Z' fill='%23001500' stroke='%2300ff41' stroke-width='4'/%3E%3Ccircle cx='90' cy='85' r='30' fill='%23000d00' stroke='%2300ff41' stroke-width='2.5' opacity='0.6'/%3E%3Cline x1='76' y1='58' x2='76' y2='112' stroke='%2300ff41' stroke-width='2' opacity='0.2'/%3E%3Cline x1='90' y1='55' x2='90' y2='115' stroke='%2300ff41' stroke-width='2.5' opacity='0.3'/%3E%3Cline x1='104' y1='58' x2='104' y2='112' stroke='%2300ff41' stroke-width='2' opacity='0.2'/%3E%3Ccircle cx='90' cy='85' r='12' fill='%2300ff41' opacity='0.95'/%3E%3Ccircle cx='98' cy='77' r='4' fill='%23aaffaa' opacity='0.25'/%3E%3Ctext x='90' y='174' font-family='monospace' font-size='16' font-weight='bold' fill='%2300ff41' text-anchor='middle' opacity='0.6'%3ETHE MATRIX%3C/text%3E%3C/svg%3E" />
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<style>
  /* -- Design tokens -- MATRIX THEME -- */
  :root {
    --bg-base: #000000;
    --bg-surface: rgba(0, 12, 0, 0.75);
    --bg-elevated: rgba(0, 18, 0, 0.8);
    --bg-overlay: rgba(0, 4, 0, 0.92);
    --border-subtle: rgba(0, 255, 65, 0.06);
    --border-default: rgba(0, 255, 65, 0.12);
    --border-hover: rgba(0, 255, 65, 0.25);
    --accent: #00ff41;
    --accent-glow: rgba(0, 255, 65, 0.25);
    --accent-green: #00ff41;
    --accent-green-glow: rgba(0, 255, 65, 0.2);
    --glass-blur: 16px;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --shadow-card: 0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4), 0 0 1px rgba(0,255,65,0.1);
    --shadow-card-hover: 0 2px 4px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,65,0.15);
    --shadow-glow-green: 0 0 20px rgba(0, 255, 65, 0.2), 0 0 40px rgba(0, 255, 65, 0.08);
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-med: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --matrix-green: #00ff41;
    --matrix-green-dim: #00cc33;
    --matrix-green-dark: #003300;
  }

  /* -- Global & Typography -- */
  * { box-sizing: border-box; }
  input, textarea, [contenteditable] { -webkit-user-select: text !important; user-select: text !important; }
  body {
    background: #000000 !important;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 60, 0, 0.5) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0, 40, 0, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 40% 40% at 10% 90%, rgba(0, 50, 0, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 30% 30% at 50% 50%, rgba(0, 20, 0, 0.3) 0%, transparent 70%) !important;
    color: #a0d8a0;
    font-family: 'Courier New', 'Fira Code', 'SF Mono', monospace;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 0.02em;
    line-height: 1.5;
  }

  /* Matrix rain canvas -- dramatic */
  #matrix-rain {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.24;
  }
  #matrix-rain-glow {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.12;
    filter: blur(4px);
  }
  #app-root { position: relative; z-index: 1; }

  /* Agent Smith avatar cards */
  .smith-card {
    background: linear-gradient(180deg, rgba(0,18,0,0.95) 0%, rgba(0,8,0,0.98) 100%);
    border: 1px solid rgba(0,255,65,0.12);
    border-radius: 14px;
    padding: 20px 16px 16px;
    width: 180px; flex: 0 0 180px;
    position: relative; overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .smith-card:hover {
    border-color: rgba(0,255,65,0.5);
    box-shadow: 0 0 30px rgba(0,255,65,0.15), 0 0 60px rgba(0,255,65,0.05);
    transform: translateY(-3px);
  }
  .smith-card.live {
    border-color: rgba(0,255,65,0.25);
    box-shadow: 0 0 20px rgba(0,255,65,0.08);
  }
  .smith-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,255,65,0.4), transparent);
  }
  .smith-card.live::before {
    background: linear-gradient(90deg, transparent, #00ff41, transparent);
    box-shadow: 0 0 8px rgba(0,255,65,0.3);
  }
  .smith-card::after {
    content: '';
    position: absolute; bottom: 0; right: 0;
    width: 100%; height: 100%;
    background: radial-gradient(ellipse at bottom right, rgba(0,255,65,0.03) 0%, transparent 70%);
    pointer-events: none;
  }
  .smith-avatar {
    width: 80px; height: 80px; margin: 0 auto 12px;
    position: relative;
  }
  .smith-avatar svg { width: 100%; height: 100%; filter: drop-shadow(0 0 3px rgba(0,255,65,0.1)); }
  .smith-card.live .smith-avatar svg { filter: drop-shadow(0 0 6px rgba(0,255,65,0.3)); }
  .smith-avatar .smith-glow {
    position: absolute; inset: -8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,65,0.08) 0%, transparent 70%);
    animation: smithPulse 4s ease-in-out infinite;
  }
  .smith-card.live .smith-avatar .smith-glow {
    background: radial-gradient(circle, rgba(0,255,65,0.25) 0%, transparent 70%);
    animation: smithPulse 2.5s ease-in-out infinite;
  }
  @keyframes smithPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  .smith-name {
    font-size: 13px; font-weight: 700; color: #00ff41;
    text-align: center; text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0 0 10px rgba(0,255,65,0.4);
  }
  .smith-status {
    font-size: 10px; text-align: center; margin-top: 5px;
    text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600;
  }
  .smith-status.live { color: #00ff41; text-shadow: 0 0 10px rgba(0,255,65,0.6); }
  .smith-status.off { color: #444; }
  .smith-meta {
    font-size: 11px; color: #3a6b3a; text-align: center; margin-top: 6px;
    font-family: 'Courier New', monospace;
  }
  .smith-scanline {
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px; background: rgba(0,255,65,0.08);
    animation: scanline 4s linear infinite;
    pointer-events: none; z-index: 1;
  }
  .smith-card.live .smith-scanline { background: rgba(0,255,65,0.15); }
  @keyframes scanline {
    0% { top: 0; }
    100% { top: 100%; }
  }

  /* Matrix music player */
  #matrix-music-btn.playing {
    border-color: rgba(0,255,65,0.4);
    color: #00ff41;
    box-shadow: 0 0 12px rgba(0,255,65,0.15);
    text-shadow: 0 0 8px rgba(0,255,65,0.4);
  }
  @keyframes eqBounce {
    0% { height: 3px; }
    100% { height: 14px; }
  }

  /* -- Custom scrollbar -- */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.12); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,65,0.25); }
  * { scrollbar-width: thin; scrollbar-color: rgba(0,255,65,0.12) transparent; }

  /* -- Card / glass surface -- */
  .card {
    background: var(--bg-surface);
    backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: var(--shadow-card);
    transition: transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-fast);
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* -- Pills / status badges -- */
  .pill { display: inline-block; padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  .pill-active { background: rgba(0, 40, 0, 0.7); color: #00ff41; box-shadow: 0 0 12px rgba(0, 255, 65, 0.15); }
  .pill-running { background: rgba(0, 30, 0, 0.8); color: #00ff41; animation: statusPulse 2.5s ease-in-out infinite; box-shadow: 0 0 16px rgba(0, 255, 65, 0.2); }
  .pill-paused { background: rgba(40, 40, 0, 0.6); color: #ccff00; box-shadow: 0 0 12px rgba(204, 255, 0, 0.1); }
  .last-success { color: #00ff41; }
  .last-failed { color: #ff3333; }
  .last-timeout { color: #ccff00; }
  @keyframes statusPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 16px rgba(0, 255, 65, 0.2); }
    50% { opacity: 0.7; box-shadow: 0 0 24px rgba(0, 255, 65, 0.35); }
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .pill-connected { background: rgba(0, 40, 0, 0.6); color: #00ff41; box-shadow: 0 0 12px rgba(0, 255, 65, 0.15); }
  .pill-disconnected { background: rgba(40, 0, 0, 0.6); color: #ff3333; box-shadow: 0 0 12px rgba(255, 51, 51, 0.15); }

  /* -- Sales section styles -- */
  .sales-metric-card {
    background: rgba(0, 15, 0, 0.8);
    border: 1px solid rgba(0, 255, 65, 0.15);
    border-radius: var(--radius-md);
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .sales-metric-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff41, transparent);
  }
  .sales-metric-val {
    font-size: 32px;
    font-weight: 700;
    color: #00ff41;
    text-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
    font-family: 'Courier New', monospace;
  }
  .sales-metric-label { font-size: 11px; color: #4a8a4a; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  .sales-metric-delta { font-size: 12px; margin-top: 6px; font-weight: 600; }
  .sales-metric-delta.up { color: #00ff41; }
  .sales-metric-delta.down { color: #ff3333; }
  .sales-metric-delta.flat { color: #4a8a4a; }
  .payment-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 12px;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 255, 65, 0.06);
    transition: background var(--transition-fast);
    font-size: 13px;
  }
  .payment-row:hover { background: rgba(0, 255, 65, 0.04); }
  .payment-row:last-child { border-bottom: none; }
  .payment-new-badge {
    display: inline-block;
    background: rgba(0, 255, 65, 0.15);
    color: #00ff41;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 6px;
    text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
  }
  .pill-unconfigured { background: rgba(31, 31, 31, 0.5); color: #6b7280; }

  /* -- HubSpot Sales Team styles -- */
  .hs-section-title {
    font-size: 13px; font-weight: 600; color: #00ff41;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .hs-section-title .hs-badge {
    font-size: 10px; background: rgba(0,255,65,0.12); color: #00ff41;
    padding: 2px 8px; border-radius: 10px; font-weight: 700;
  }
  .hs-kpi-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px; margin-bottom: 20px;
  }
  .hs-kpi-card {
    background: rgba(0, 15, 0, 0.7); border: 1px solid rgba(0,255,65,0.1);
    border-radius: 10px; padding: 14px; text-align: center;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .hs-kpi-card:hover { border-color: rgba(0,255,65,0.25); box-shadow: 0 0 12px rgba(0,255,65,0.08); }
  .hs-kpi-val { font-size: 26px; font-weight: 700; color: #00ff41; font-family: 'Courier New', monospace; text-shadow: 0 0 12px rgba(0,255,65,0.3); }
  .hs-kpi-label { font-size: 10px; color: #4a8a4a; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
  .hs-kpi-sub { font-size: 11px; color: #3a6b3a; margin-top: 2px; }
  .hs-toggle-bar {
    display: flex; gap: 0; margin-bottom: 16px; background: rgba(0,12,0,0.5);
    border-radius: 8px; border: 1px solid rgba(0,255,65,0.08); overflow: hidden; width: fit-content;
  }
  .hs-toggle-btn {
    padding: 6px 16px; font-size: 11px; font-weight: 600; color: #3a6b3a;
    background: none; border: none; cursor: pointer; font-family: 'Courier New', monospace;
    text-transform: uppercase; letter-spacing: 0.04em; transition: all var(--transition-fast);
  }
  .hs-toggle-btn.active { color: #00ff41; background: rgba(0,255,65,0.1); text-shadow: 0 0 8px rgba(0,255,65,0.3); }
  .hs-toggle-btn:hover:not(.active) { color: #00cc33; }
  .hs-leaderboard { width: 100%; border-collapse: collapse; }
  .hs-leaderboard th {
    text-align: left; padding: 8px 10px; font-size: 10px; color: #4a8a4a;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
    border-bottom: 1px solid rgba(0,255,65,0.1);
  }
  .hs-leaderboard th.num { text-align: right; }
  .hs-leaderboard td { padding: 10px 10px; font-size: 13px; border-bottom: 1px solid rgba(0,255,65,0.05); color: #a0d8a0; }
  .hs-leaderboard td.num { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; }
  .hs-leaderboard tr:hover { background: rgba(0,255,65,0.03); }
  .hs-rank { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; font-size: 11px; font-weight: 700; }
  .hs-rank-1 { background: rgba(255,215,0,0.15); color: #ffd700; text-shadow: 0 0 6px rgba(255,215,0,0.3); }
  .hs-rank-2 { background: rgba(192,192,192,0.12); color: #c0c0c0; }
  .hs-rank-3 { background: rgba(205,127,50,0.12); color: #cd7f32; }
  .hs-rank-other { background: rgba(0,255,65,0.06); color: #3a6b3a; }
  .hs-alert-row {
    display: grid; grid-template-columns: 1fr auto auto;
    gap: 10px; align-items: center; padding: 10px 14px;
    border-bottom: 1px solid rgba(0,255,65,0.05); font-size: 12px;
    transition: background var(--transition-fast);
  }
  .hs-alert-row:hover { background: rgba(0,255,65,0.03); }
  .hs-alert-row:last-child { border-bottom: none; }
  .hs-danger { color: #ff4444; }
  .hs-warn { color: #ffaa00; }
  .hs-muted { color: #3a6b3a; }
  .hs-tag {
    display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 6px;
    border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .hs-tag-danger { background: rgba(255,68,68,0.12); color: #ff4444; }
  .hs-tag-warn { background: rgba(255,170,0,0.12); color: #ffaa00; }
  .hs-tag-info { background: rgba(0,255,65,0.1); color: #00ff41; }
  .hs-progress-bar { height: 6px; border-radius: 3px; background: rgba(0,255,65,0.06); overflow: hidden; }
  .hs-progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .hs-win-rate-ring {
    width: 80px; height: 80px; position: relative; display: inline-block;
  }
  .hs-win-rate-text {
    position: absolute; inset: 0; display: flex; align-items: center;
    justify-content: center; font-size: 18px; font-weight: 700;
    color: #00ff41; font-family: 'Courier New', monospace;
  }

  /* -- Stats -- */
  .stat-val { font-size: 24px; font-weight: 700; color: #f0f0f5; letter-spacing: -0.02em; }
  .stat-label { font-size: 11px; color: rgba(156, 163, 175, 0.8); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }

  /* -- Model picker -- */
  .model-picker { position: relative; cursor: pointer; margin-top: 2px; }
  .model-current { font-size: 11px; color: var(--accent-green); transition: color var(--transition-fast); }
  .model-current:hover { color: #a78bfa; }
  .model-menu { position: absolute; top: 22px; left: 0; z-index: 30; background: var(--bg-elevated); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4); border: 1px solid var(--border-default); border-radius: var(--radius-sm); padding: 4px 0; min-width: 120px; box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04); }
  .model-opt { padding: 7px 14px; font-size: 12px; color: #9ca3af; cursor: pointer; transition: background var(--transition-fast), color var(--transition-fast); border-radius: 4px; margin: 1px 4px; }
  .model-opt:hover { background: rgba(255,255,255,0.06); color: #e0e0e0; }
  .model-active { color: var(--accent-green); }
  .model-active::before { content: ''; display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--accent-green); margin-right: 6px; vertical-align: middle; box-shadow: 0 0 6px var(--accent-green-glow); }
  details summary { cursor: pointer; list-style: none; }
  details summary::-webkit-details-marker { display: none; }
  .fade-text { color: #f87171; }
  .top-text { color: #6ee7b7; }
  .gauge-bg { fill: rgba(255,255,255,0.06); }
  .refresh-spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* -- Privacy blur -- */
  .privacy-blur { filter: blur(5px); cursor: pointer; transition: filter 0.2s; user-select: none; }
  .privacy-blur:hover { filter: blur(3px); }
  .privacy-toggle { background: none; border: none; cursor: pointer; color: rgba(136,136,136,0.7); font-size: 16px; padding: 2px 6px; margin-left: 8px; transition: color var(--transition-fast); vertical-align: middle; }
  .privacy-toggle:hover { color: #ccc; }

  /* -- Hive Mind table -- */
  .hive-table { width: 100%; border-collapse: collapse; }
  .hive-table th { text-align: left; padding: 6px 10px; font-size: 10px; color: rgba(107,114,128,0.8); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border-subtle); white-space: nowrap; }
  .hive-table td { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid var(--border-subtle); vertical-align: top; }
  .hive-table .col-time { white-space: nowrap; color: #9ca3af; }
  .hive-table .col-agent { white-space: nowrap; font-weight: 600; }
  .hive-table .col-action { white-space: nowrap; color: #9ca3af; }
  .hive-table .col-summary { color: #d4d4d8; word-break: break-word; line-height: 1.5; }
  .hive-table tr { transition: background var(--transition-fast); }
  .hive-table tr:hover { background: rgba(255,255,255,0.02); }
  .hive-scroll { max-height: 300px; overflow-y: auto; }

  /* -- Summary stats bar -- */
  .summary-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .summary-stat {
    background: var(--bg-surface);
    backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: 14px 18px;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: var(--shadow-card);
    transition: transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-fast);
    position: relative; overflow: hidden;
  }
  .summary-stat::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
  .summary-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-card-hover); border-color: var(--border-hover); }
  .summary-stat-val { font-size: 22px; font-weight: 700; color: #f0f0f5; line-height: 1.2; letter-spacing: -0.02em; }
  .summary-stat-label { font-size: 11px; color: rgba(107,114,128,0.8); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
  @media (max-width: 640px) { .summary-bar { grid-template-columns: repeat(2, 1fr); } }

  /* -- Memory expand -- */
  .mem-expand { cursor: pointer; transition: background var(--transition-fast); padding: 6px 8px; margin: 0 -8px; border-radius: var(--radius-sm); }
  .mem-expand:hover { background: rgba(255,255,255,0.03); }
  .mem-expand .mem-full { display: none; margin-top: 6px; color: #d4d4d8; white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.6; }
  .mem-expand.open .mem-full { display: block; }
  .mem-expand.open .mem-preview { display: none; }

  /* -- Task prompt & device badge -- */
  .task-prompt { transition: filter 0.2s; cursor: pointer; }
  .device-badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  .device-mobile { background: rgba(10,54,34,0.5); color: #34d399; }
  .device-desktop { background: rgba(4,47,26,0.5); color: #6ee7b7; }

  /* -- Drawer -- */
  .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 40; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
  .drawer-overlay.open { opacity: 1; pointer-events: auto; }
  .drawer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: var(--bg-overlay); backdrop-filter: blur(24px) saturate(1.4); -webkit-backdrop-filter: blur(24px) saturate(1.4); border-top: 1px solid var(--border-default); border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-height: 85vh; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; box-shadow: 0 -8px 40px rgba(0,0,0,0.4); }
  .drawer.open { transform: translateY(0); }
  .drawer-handle { width: 36px; height: 4px; background: rgba(255,255,255,0.12); border-radius: 2px; margin: 10px auto 0; flex-shrink: 0; }
  .drawer-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px; flex: 1; }
  .mem-item {
    background: var(--bg-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    padding: 14px; margin-bottom: 10px; cursor: pointer;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
    box-shadow: var(--shadow-card);
  }
  .mem-item:hover { border-color: var(--border-hover); transform: translateY(-1px); box-shadow: var(--shadow-card-hover); }
  .mem-item:active, .mem-item.expanded { border-color: rgba(255,255,255,0.14); }
  .mem-item .mem-content { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .mem-item.expanded .mem-content { display: block; -webkit-line-clamp: unset; }
  .salience-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; flex-shrink: 0; box-shadow: 0 0 6px currentColor; }
  .clickable-card { cursor: pointer; transition: transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-fast); }
  .clickable-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }
  .clickable-card:active { transform: translateY(0); }

  /* -- Info tooltips -- */
  .info-tip { position: relative; display: inline-block; vertical-align: middle; margin-left: 6px; }
  .info-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.06); color: rgba(136,136,136,0.7); font-size: 11px; cursor: pointer; user-select: none; line-height: 1; transition: background var(--transition-fast), color var(--transition-fast); }
  .info-icon:hover { background: rgba(255,255,255,0.1); color: #bbb; }
  .info-tooltip { position: absolute; left: 50%; transform: translateX(-50%); top: calc(100% + 8px); background: var(--bg-elevated); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4); border: 1px solid var(--border-default); color: #bbb; font-size: 12px; font-weight: 400; line-height: 1.5; padding: 12px 14px; border-radius: var(--radius-sm); max-width: 280px; min-width: 200px; z-index: 30; opacity: 0; pointer-events: none; transition: opacity var(--transition-fast); white-space: normal; text-transform: none; letter-spacing: normal; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .info-tooltip::before { content: ''; position: absolute; top: -6px; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid rgba(255,255,255,0.08); }
  .info-tooltip::after { content: ''; position: absolute; top: -5px; left: 50%; transform: translateX(-50%); border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid rgba(24,24,38,0.9); }
  .info-tip.active .info-tooltip { opacity: 1; pointer-events: auto; }

  /* -- Chat FAB -- */
  .chat-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 60;
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #014421 0%, #016b35 100%);
    color: #fff; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(1,68,33,0.35), 0 0 24px rgba(1,68,33,0.15), 0 1px 3px rgba(0,0,0,0.3);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }
  .chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(1,68,33,0.45), 0 0 32px rgba(1,68,33,0.2), 0 2px 4px rgba(0,0,0,0.3); }
  .chat-fab:active { transform: scale(0.95); }
  .chat-fab-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; border-radius: 50%; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; display: none; align-items: center; justify-content: center; border: 2px solid var(--bg-base); box-shadow: 0 0 8px rgba(239,68,68,0.3); }

  /* -- Chat slide-over -- */
  .chat-overlay {
    position: fixed; top: 0; right: 0; bottom: 0; width: 560px; max-width: 100vw; z-index: 70;
    background: var(--bg-overlay); backdrop-filter: blur(24px) saturate(1.3); -webkit-backdrop-filter: blur(24px) saturate(1.3);
    display: flex; flex-direction: column; transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -8px 0 40px rgba(0,0,0,0.5); border-left: 1px solid var(--border-default);
  }
  .chat-overlay.open { transform: translateX(0); }
  .chat-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(14,14,22,0.6); border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; }
  .chat-header-left { display: flex; align-items: center; gap: 10px; }
  .chat-header-title { font-size: 16px; font-weight: 700; color: #f0f0f5; letter-spacing: -0.01em; }
  .chat-status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px currentColor; }

  /* -- Agent tabs -- */
  .chat-agent-tabs { display: flex; gap: 0; background: rgba(14,14,22,0.5); border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; overflow-x: auto; padding: 0 14px; }
  .chat-agent-tab { padding: 10px 16px; font-size: 12px; font-weight: 600; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; display: flex; align-items: center; gap: 6px; }
  .chat-agent-tab:hover { color: #d4d4d8; }
  .chat-agent-tab.active { color: #6ee7b7; border-bottom-color: var(--accent-green); }
  .chat-agent-tab .agent-dot { width: 6px; height: 6px; border-radius: 50%; }
  .chat-agent-tab .agent-dot.live { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.4); }
  .chat-agent-tab .agent-dot.dead { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,0.3); }

  /* -- Session info bar -- */
  .chat-session-bar { display: flex; align-items: center; gap: 12px; padding: 7px 18px; background: rgba(14,14,22,0.4); border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; font-size: 11px; color: #6b7280; }
  .chat-session-bar .session-stat { display: flex; align-items: center; gap: 4px; }
  .chat-session-bar .session-stat-val { color: #6ee7b7; font-weight: 600; }
  .chat-session-bar .session-model { background: rgba(255,255,255,0.04); padding: 3px 10px; border-radius: 6px; color: #9ca3af; font-weight: 600; border: 1px solid var(--border-subtle); }

  /* -- Quick actions -- */
  .chat-quick-actions { display: flex; gap: 6px; padding: 8px 18px; background: rgba(14,14,22,0.4); border-bottom: 1px solid var(--border-subtle); flex-shrink: 0; overflow-x: auto; }
  .chat-quick-btn {
    padding: 5px 12px; font-size: 11px; font-weight: 600; color: #9ca3af;
    background: var(--bg-surface); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid var(--border-default); border-radius: var(--radius-sm);
    cursor: pointer; transition: all var(--transition-fast); white-space: nowrap;
  }
  .chat-quick-btn:hover { background: rgba(255,255,255,0.06); color: #e0e0e0; border-color: var(--border-hover); box-shadow: 0 0 12px rgba(255,255,255,0.03); }
  .chat-quick-btn.destructive:hover { border-color: rgba(220,38,38,0.4); color: #fca5a5; box-shadow: 0 0 12px rgba(220,38,38,0.1); }

  /* -- Chat messages -- */
  .chat-messages { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; padding: 18px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .chat-bubble { max-width: 90%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.65; word-wrap: break-word; overflow-wrap: anywhere; word-break: break-word; }
  .chat-bubble-user { background: linear-gradient(135deg, rgba(4,47,26,0.7) 0%, rgba(6,78,59,0.5) 100%); color: #d1fae5; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .chat-bubble-assistant { background: var(--bg-elevated); color: #d4d4d8; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid var(--border-default); min-width: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .chat-bubble-source { font-size: 10px; color: rgba(107,114,128,0.7); margin-top: 4px; }
  .chat-bubble code { background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; font-size: 13px; }
  .chat-bubble pre { background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: var(--radius-sm); overflow-x: auto; margin: 8px 0; font-size: 12px; border: 1px solid var(--border-subtle); }
  .chat-bubble pre code { background: none; padding: 0; }
  .chat-bubble table { border-collapse: collapse; width: 100%; font-size: 11px; margin: 8px 0; display: block; overflow-x: auto; }
  .chat-bubble th, .chat-bubble td { padding: 4px 8px; border-bottom: 1px solid var(--border-subtle); text-align: left; white-space: nowrap; }
  .chat-bubble th { color: #6ee7b7; font-weight: 600; }

  /* -- Chat progress bar -- */
  .chat-progress-bar { display: none; align-items: center; gap: 10px; padding: 12px 18px; background: rgba(14,14,22,0.6); border-top: 1px solid var(--border-subtle); flex-shrink: 0; position: relative; overflow: hidden; }
  .chat-progress-bar.active { display: flex; }
  .chat-progress-pulse { width: 10px; height: 10px; border-radius: 50%; background: var(--accent-green); flex-shrink: 0; animation: progressPulse 1.5s ease-in-out infinite; box-shadow: 0 0 10px var(--accent-green-glow); }
  @keyframes progressPulse { 0%,100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
  .chat-progress-label { font-size: 13px; color: #9ca3af; }
  .chat-stop-btn {
    margin-left: auto; background: transparent;
    border: 1px solid rgba(52,211,153,0.3); color: var(--accent-green);
    border-radius: var(--radius-sm); width: 28px; height: 28px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: all var(--transition-fast);
  }
  .chat-stop-btn:hover { background: rgba(52,211,153,0.1); border-color: var(--accent-green); box-shadow: 0 0 12px var(--accent-green-glow); color: #fff; }
  .chat-progress-shimmer { position: absolute; bottom: 0; left: 0; height: 2px; width: 100%; background: linear-gradient(90deg, transparent, var(--accent-green), transparent); animation: shimmer 2s ease-in-out infinite; }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

  /* -- Chat input -- */
  .chat-input-area { display: flex; gap: 8px; padding: 14px 18px; background: rgba(14,14,22,0.6); border-top: 1px solid var(--border-subtle); flex-shrink: 0; }
  .chat-textarea {
    flex: 1; background: var(--bg-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-default); border-radius: 14px;
    color: #e0e0e0; padding: 10px 16px; font-size: 14px;
    resize: none; outline: none; max-height: 120px; font-family: inherit;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .chat-textarea:focus { border-color: rgba(52,211,153,0.3); box-shadow: 0 0 16px rgba(52,211,153,0.08); }
  .chat-send-btn {
    background: linear-gradient(135deg, #014421 0%, #016b35 100%);
    color: #fff; border: none; border-radius: 14px; padding: 0 18px;
    cursor: pointer; font-size: 14px; font-weight: 600;
    transition: all var(--transition-fast); flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(1,68,33,0.25);
  }
  .chat-send-btn:hover { box-shadow: 0 4px 16px rgba(1,68,33,0.35), 0 0 20px rgba(1,68,33,0.15); }
  .chat-send-btn:disabled { background: rgba(255,255,255,0.04); color: #555; cursor: not-allowed; box-shadow: none; }

  /* -- Database Explorer -- */
  .db-nav-tabs {
    display: flex; gap: 0;
    background: var(--bg-surface); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default);
    margin-bottom: 18px; overflow-x: auto; border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
  }
  .db-nav-tab { padding: 12px 22px; font-size: 13px; font-weight: 600; color: #3a6b3a; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 0.05em; }
  .db-nav-tab:hover { color: #00ff41; text-shadow: 0 0 10px rgba(0, 255, 65, 0.3); }
  .db-nav-tab.active { color: #00ff41; border-bottom-color: #00ff41; text-shadow: 0 0 10px rgba(0, 255, 65, 0.4); }
  .db-layout { display: grid; grid-template-columns: 220px 1fr; gap: 18px; min-height: 500px; }
  @media (max-width: 768px) { .db-layout { grid-template-columns: 1fr; } }
  .db-sidebar {
    background: var(--bg-surface); backdrop-filter: blur(var(--glass-blur)) saturate(1.3); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    padding: 8px 0; max-height: 600px; overflow-y: auto; box-shadow: var(--shadow-card);
  }
  .db-sidebar-item { display: flex; justify-content: space-between; align-items: center; padding: 9px 16px; cursor: pointer; transition: background var(--transition-fast); font-size: 13px; color: #d4d4d8; }
  .db-sidebar-item:hover { background: rgba(255,255,255,0.04); }
  .db-sidebar-item.active { background: rgba(6,78,59,0.3); color: #6ee7b7; }
  .db-sidebar-count { font-size: 11px; color: #6b7280; background: rgba(255,255,255,0.04); padding: 2px 8px; border-radius: 6px; }
  .db-sidebar-item.active .db-sidebar-count { color: #6ee7b7; background: rgba(6,95,70,0.4); }
  .db-grid-wrapper {
    background: var(--bg-surface); backdrop-filter: blur(var(--glass-blur)) saturate(1.3); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.3);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--shadow-card);
  }
  .db-grid-scroll { overflow: auto; flex: 1; max-height: 500px; }
  .db-grid { width: 100%; border-collapse: collapse; font-size: 12px; }
  .db-grid th { position: sticky; top: 0; background: rgba(18,18,28,0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); text-align: left; padding: 10px 14px; font-size: 10px; color: rgba(107,114,128,0.8); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border-default); cursor: pointer; user-select: none; white-space: nowrap; }
  .db-grid th:hover { color: #d4d4d8; }
  .db-grid th .sort-arrow { font-size: 9px; margin-left: 4px; opacity: 0.3; }
  .db-grid th.sorted .sort-arrow { opacity: 1; color: #6ee7b7; }
  .db-grid td { padding: 8px 14px; border-bottom: 1px solid var(--border-subtle); color: #d4d4d8; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: top; }
  .db-grid tr { transition: background var(--transition-fast); }
  .db-grid tr:hover td { background: rgba(255,255,255,0.02); }
  .db-grid td.null-val { color: #555; font-style: italic; }
  .db-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid var(--border-subtle); font-size: 12px; color: #6b7280; }
  .db-page-btn {
    background: var(--bg-surface); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    color: #d4d4d8; border: 1px solid var(--border-default);
    border-radius: var(--radius-sm); padding: 5px 14px; cursor: pointer; font-size: 12px;
    transition: all var(--transition-fast);
  }
  .db-page-btn:hover { background: rgba(255,255,255,0.06); border-color: var(--border-hover); }
  .db-page-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .db-query-area { margin-top: 18px; }
  .db-query-textarea {
    width: 100%; background: var(--bg-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-default); border-radius: var(--radius-sm);
    color: #e0e0e0; padding: 12px 16px; font-size: 13px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'JetBrains Mono', monospace;
    resize: vertical; outline: none; box-sizing: border-box;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .db-query-textarea:focus { border-color: rgba(52,211,153,0.3); box-shadow: 0 0 16px rgba(52,211,153,0.08); }
  .db-query-bar { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
  .db-run-btn {
    background: linear-gradient(135deg, #014421 0%, #016b35 100%);
    color: #fff; border: none; border-radius: var(--radius-sm);
    padding: 9px 22px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all var(--transition-fast); box-shadow: 0 2px 8px rgba(1,68,33,0.25);
  }
  .db-run-btn:hover { box-shadow: 0 4px 16px rgba(1,68,33,0.35), 0 0 16px rgba(1,68,33,0.12); }
  .db-query-error { color: #f87171; font-size: 12px; margin-top: 8px; }
  .db-query-info { color: #6b7280; font-size: 12px; }

  /* Supabase grid enhancements */
  #sb-grid tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
  #sb-grid td.sb-clickable { cursor: pointer; transition: background var(--transition-fast); }
  #sb-grid td.sb-clickable:hover { background: rgba(59,130,246,0.08); }
  .sb-row-count { display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 999px; font-size: 10px; font-weight: 600; background: rgba(255,255,255,0.06); color: #6b7280; }
  .sb-add-row-btn {
    background: linear-gradient(135deg, #014421 0%, #016b35 100%);
    color: #fff; border: none; border-radius: var(--radius-sm);
    padding: 9px 22px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all var(--transition-fast); box-shadow: 0 2px 8px rgba(1,68,33,0.25);
  }
  .sb-add-row-btn:hover { box-shadow: 0 4px 16px rgba(1,68,33,0.35), 0 0 16px rgba(1,68,33,0.12); }
  .sb-add-row-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .sb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
  .sb-form-field label { display: block; font-size: 11px; color: #6b7280; margin-bottom: 3px; font-weight: 500; }
  .sb-form-field input, .sb-form-field textarea {
    width: 100%; background: var(--bg-surface); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-default); border-radius: var(--radius-sm);
    color: #e0e0e0; padding: 8px 12px; font-size: 12px; outline: none; box-sizing: border-box;
    transition: border-color var(--transition-fast);
  }
  .sb-form-field input:focus, .sb-form-field textarea:focus { border-color: rgba(52,211,153,0.3); }
  .sb-insert-area { margin-top: 18px; }
  .sb-insert-status { font-size: 12px; margin-top: 8px; }

  /* ═══ Mobile Responsive ═══ */
  @media (max-width: 768px) {
    body.p-4 { padding: 10px !important; }

    /* Tab navigation */
    .db-nav-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .db-nav-tab { padding: 10px 14px !important; font-size: 11px !important; letter-spacing: 0.03em !important; }

    /* Cards */
    .card { padding: 14px !important; margin-bottom: 10px !important; }
    .sales-metric-card { padding: 14px 10px !important; }
    .sales-metric-val { font-size: 24px !important; }
    .sales-metric-label { font-size: 9px !important; letter-spacing: 0.06em !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
    .sales-metric-delta { font-size: 11px !important; }

    /* CEO: 4-col metrics → 2-col */
    .ceo-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    /* CEO & Sales: 2-col layouts → 1-col */
    .ceo-two-col { grid-template-columns: 1fr !important; }
    .ceo-sub-grid { grid-template-columns: 1fr !important; }
    /* Sales: 3-col MTD → 1-col */
    .sales-mtd-grid { grid-template-columns: 1fr !important; }
    /* Sales: pipeline sidebar + main → stack */
    .sales-pipeline-grid { grid-template-columns: 1fr !important; }
    /* Sales: alerts 2-col → 1-col */
    .sales-alerts-grid { grid-template-columns: 1fr !important; }

    /* HubSpot section header wrapping */
    .hs-sales-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .hs-sales-header-controls { flex-wrap: wrap; gap: 6px !important; }
    .hs-toggle-bar { flex-wrap: wrap; }
    .hs-toggle-btn { padding: 5px 10px !important; font-size: 10px !important; }

    /* KPI cards */
    .hs-kpi-val { font-size: 20px !important; }
    .hs-kpi-card { padding: 10px !important; }

    /* Leaderboard tables */
    .hs-leaderboard th { font-size: 9px !important; padding: 6px 5px !important; letter-spacing: 0.02em !important; }
    .hs-leaderboard td { font-size: 11px !important; padding: 8px 5px !important; }

    /* Chart containers */
    .chart-container-responsive { height: 160px !important; }

    /* Dashboard tab */
    .summary-stat { padding: 10px 14px !important; }
    .summary-stat-val { font-size: 18px !important; }

    /* Section titles */
    .hs-section-title { font-size: 12px !important; }

    /* Win rate ring */
    .hs-win-rate-ring { width: 64px !important; height: 64px !important; }
    .hs-win-rate-text { font-size: 15px !important; }

    /* Revenue command center title */
    .section-title-responsive { font-size: 13px !important; }

    /* Smith agent cards */
    .smith-card { width: 150px !important; flex: 0 0 150px !important; padding: 14px 12px 12px !important; }

    /* Database layout already handled */
    .sb-form-grid { grid-template-columns: 1fr !important; }

    /* Closers leaderboard sort bar */
    .closers-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
  }

  @media (max-width: 480px) {
    body.p-4 { padding: 8px !important; }
    /* CEO: metrics go full-width single col */
    .ceo-metrics-grid { grid-template-columns: 1fr !important; }
    .sales-metric-val { font-size: 22px !important; }
    .sales-metric-card { padding: 12px 8px !important; }
    .summary-stat-val { font-size: 16px !important; }
    .summary-stat { padding: 8px 10px !important; }
    .summary-bar { gap: 8px !important; }
    .db-nav-tab { padding: 8px 10px !important; font-size: 10px !important; }
    .card { padding: 12px !important; }
    .hs-kpi-val { font-size: 18px !important; }
    .hs-leaderboard td { font-size: 10px !important; padding: 6px 4px !important; }
    .hs-leaderboard th { font-size: 8px !important; padding: 5px 4px !important; }
    .smith-card { width: 130px !important; flex: 0 0 130px !important; }
  }

  /* ── Builder (Lovable clone) ─────────────────────────────────────── */
  .bldr-wrap { display:flex; flex-direction:column; height:calc(100vh - 120px); min-height:500px; position:relative; }
  .bldr-toolbar { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:10px; margin-bottom:8px; gap:8px; flex-wrap:wrap; }
  .bldr-toolbar-left, .bldr-toolbar-right { display:flex; align-items:center; gap:6px; }
  .bldr-toolbar-center { font-size:13px; font-weight:600; color:#e5e7eb; }
  .bldr-btn { background:var(--bg-elevated); border:1px solid var(--border-default); color:#d1d5db; padding:5px 12px; border-radius:6px; font-size:11px; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .bldr-btn:hover { border-color:#00ff41; color:#00ff41; }
  .bldr-btn.active { background:rgba(0,255,65,0.1); border-color:#00ff41; color:#00ff41; }
  .bldr-btn-primary { background:rgba(0,255,65,0.1); border-color:rgba(0,255,65,0.3); color:#00ff41; }
  .bldr-btn-primary:hover { background:rgba(0,255,65,0.2); }
  .bldr-btn-sm { background:none; border:1px solid var(--border-default); color:#9ca3af; width:26px; height:26px; border-radius:5px; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; padding:0; }
  .bldr-btn-sm:hover { border-color:#00ff41; color:#00ff41; }
  #bldr-project-select { background:var(--bg-elevated); border:1px solid var(--border-default); color:#d1d5db; padding:5px 10px; border-radius:6px; font-size:11px; min-width:160px; }
  .bldr-panels { display:grid; grid-template-columns:300px 1fr 1fr; gap:8px; flex:1; min-height:0; }
  .bldr-panel { display:flex; flex-direction:column; background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:10px; overflow:hidden; min-height:0; }
  .bldr-panel-header { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; font-size:11px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid var(--border-default); flex-shrink:0; }
  .bldr-chat { min-width:0; }
  .bldr-messages { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; }
  .bldr-welcome { text-align:center; padding:40px 16px; }
  .bldr-suggestions { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; }
  .bldr-suggestion { background:rgba(0,255,65,0.06); border:1px solid rgba(0,255,65,0.15); color:#a3e635; padding:6px 12px; border-radius:20px; font-size:11px; cursor:pointer; transition:all 0.15s; }
  .bldr-suggestion:hover { background:rgba(0,255,65,0.12); border-color:rgba(0,255,65,0.3); }
  .bldr-msg { max-width:95%; padding:10px 14px; border-radius:14px; font-size:13px; line-height:1.5; word-wrap:break-word; }
  .bldr-msg-user { background:linear-gradient(135deg,rgba(4,47,26,0.7),rgba(6,78,59,0.5)); color:#d1fae5; align-self:flex-end; border-bottom-right-radius:4px; }
  .bldr-msg-assistant { background:rgba(255,255,255,0.04); color:#d4d4d8; align-self:flex-start; border-bottom-left-radius:4px; border:1px solid var(--border-default); }
  .bldr-msg-assistant pre { background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; overflow-x:auto; font-size:11px; margin:6px 0; }
  .bldr-msg-assistant code { font-size:11px; }
  .bldr-input-wrap { display:flex; gap:6px; padding:10px 12px; border-top:1px solid var(--border-default); align-items:flex-end; }
  #bldr-input { flex:1; background:rgba(0,0,0,0.3); border:1px solid var(--border-default); color:#e5e7eb; padding:8px 12px; border-radius:10px; font-size:12px; resize:none; font-family:inherit; outline:none; line-height:1.5; }
  #bldr-input:focus { border-color:rgba(0,255,65,0.4); }
  .bldr-send { background:rgba(0,255,65,0.15); border:1px solid rgba(0,255,65,0.3); color:#00ff41; width:36px; height:36px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.15s; }
  .bldr-send:hover { background:rgba(0,255,65,0.25); }
  .bldr-send:disabled { opacity:0.4; cursor:not-allowed; }
  .bldr-generating { display:flex; align-items:center; gap:8px; padding:10px 14px; color:#00ff41; font-size:12px; }
  .bldr-generating-dot { width:6px; height:6px; border-radius:50%; background:#00ff41; animation:bldrPulse 1.2s infinite; }
  .bldr-generating-dot:nth-child(2) { animation-delay:0.2s; }
  .bldr-generating-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes bldrPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
  .bldr-file-tabs { display:flex; gap:2px; overflow-x:auto; margin-left:8px; }
  .bldr-file-tab { padding:3px 10px; font-size:10px; color:#9ca3af; cursor:pointer; border-radius:4px 4px 0 0; white-space:nowrap; border:1px solid transparent; border-bottom:none; }
  .bldr-file-tab:hover { color:#d1d5db; background:rgba(255,255,255,0.03); }
  .bldr-file-tab.active { color:#00ff41; background:rgba(0,255,65,0.08); border-color:var(--border-default); }
  .bldr-code-wrap { flex:1; min-height:0; position:relative; }
  .bldr-code-editor { width:100%; height:100%; background:rgba(0,0,0,0.4); color:#d4d4d8; border:none; padding:12px 14px; font-family:'JetBrains Mono',Menlo,Monaco,'Courier New',monospace; font-size:12px; line-height:1.6; resize:none; outline:none; tab-size:2; }
  .bldr-empty-state { display:flex; align-items:center; justify-content:center; height:100%; }
  .bldr-preview-frame-wrap { flex:1; position:relative; min-height:0; background:#fff; }
  .bldr-preview-frame { width:100%; height:100%; border:none; background:#fff; }
  .bldr-preview-empty { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--bg-elevated); }
  .bldr-versions-sidebar { position:absolute; right:0; top:42px; bottom:0; width:260px; background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:10px; z-index:20; display:flex; flex-direction:column; }
  .bldr-versions-list { flex:1; overflow-y:auto; padding:8px; }
  .bldr-version-item { padding:8px 10px; border-radius:6px; cursor:pointer; border:1px solid transparent; margin-bottom:4px; }
  .bldr-version-item:hover { background:rgba(0,255,65,0.05); border-color:var(--border-default); }
  .bldr-version-item .v-num { font-size:11px; font-weight:600; color:#00ff41; }
  .bldr-version-item .v-msg { font-size:10px; color:#9ca3af; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .bldr-version-item .v-time { font-size:9px; color:#6b7280; margin-top:2px; }
  @media (max-width: 900px) {
    .bldr-panels { grid-template-columns:1fr; }
    .bldr-chat { max-height:300px; }
  }
</style>
</head>
<body class="p-4">

<!-- Login Screen -->
<div id="login-screen" style="display:none;position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center">
  <canvas id="login-matrix-rain" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"></canvas>
  <script>
  (function(){
    var c=document.getElementById('login-matrix-rain'),ctx=c.getContext('2d');
    c.width=window.innerWidth;c.height=window.innerHeight;
    var kat='\\u30A0\\u30A2\\u30A4\\u30A6\\u30A8\\u30AA\\u30AB\\u30AD\\u30AF\\u30B1\\u30B3\\u30B5\\u30B7\\u30B9\\u30BB\\u30BD\\u30BF\\u30C1\\u30C4\\u30C6\\u30C8\\u30CA\\u30CC\\u30CE\\u30CF';
    var ch=kat+'0123456789ABCDEFZ<>/|{}';
    var pk=function(){return ch.charAt(Math.floor(Math.random()*ch.length));};
    var fs=16,cols=Math.floor(c.width/fs),dr=[],sp=[];
    for(var i=0;i<cols;i++){dr[i]=Math.random()*-60;sp[i]=0.2+Math.random()*1.2;}
    var id=setInterval(function(){
      if(document.getElementById('login-screen').style.display==='none'){clearInterval(id);ctx.clearRect(0,0,c.width,c.height);return;}
      ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,c.width,c.height);
      ctx.font='bold '+fs+'px monospace';
      for(var i=0;i<dr.length;i++){
        var y=dr[i]*fs;
        ctx.fillStyle='rgba(255,255,255,0.9)';ctx.shadowColor='#00ff41';ctx.shadowBlur=14;
        ctx.fillText(pk(),i*fs,y);
        ctx.fillStyle='rgba(0,255,65,0.6)';ctx.shadowBlur=6;
        ctx.fillText(pk(),i*fs,y-fs);
        ctx.shadowBlur=0;
        for(var t=2;t<12;t++){var ty=y-t*fs;if(ty<0)break;ctx.fillStyle='rgba(0,255,65,'+(Math.max(0,1-t/11)*0.35)+')';ctx.fillText(pk(),i*fs,ty);}
        if(dr[i]*fs>c.height&&Math.random()>0.975){dr[i]=Math.random()*-20;sp[i]=0.2+Math.random()*1.2;}
        dr[i]+=sp[i];
      }
    },40);
    window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;cols=Math.floor(c.width/fs);dr=[];sp=[];for(var i=0;i<cols;i++){dr[i]=Math.random()*-60;sp[i]=0.2+Math.random()*1.2;}});
  })();
  </script>
  <div style="text-align:center;max-width:320px;width:100%;padding:20px;position:relative;z-index:1">
    <div style="font-size:24px;font-weight:700;color:#00ff41;text-shadow:0 0 20px rgba(0,255,65,0.4);margin-bottom:8px;font-family:'Courier New',monospace;letter-spacing:0.1em">ENTER THE MATRIX</div>
    <div style="font-size:11px;color:#3a6b3a;margin-bottom:32px;letter-spacing:0.15em;text-transform:uppercase">Mission Control</div>
    <div id="password-step">
      <input id="login-password" type="password" placeholder="Enter password" autocomplete="current-password"
        style="width:100%;padding:12px 16px;background:rgba(0,12,0,0.8);border:1px solid rgba(0,255,65,0.2);border-radius:8px;color:#00ff41;font-family:'Courier New',monospace;font-size:14px;outline:none;margin-bottom:12px"
        onkeydown="if(event.key==='Enter')doLogin()"
      />
    </div>
    <div id="totp-step" style="display:none">
      <div style="font-size:10px;color:#00ff41;margin-bottom:8px;letter-spacing:0.1em;text-transform:uppercase">ENTER 2FA CODE</div>
      <input id="login-totp" type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code"
        style="width:100%;padding:12px 16px;background:rgba(0,12,0,0.8);border:1px solid rgba(0,255,65,0.2);border-radius:8px;color:#00ff41;font-family:'Courier New',monospace;font-size:20px;text-align:center;letter-spacing:0.4em;outline:none;margin-bottom:12px"
        onkeydown="if(event.key==='Enter')verifyTotp()"
      />
    </div>
    <button id="login-btn" onclick="doLogin()" style="width:100%;padding:10px;background:rgba(0,255,65,0.1);border:1px solid rgba(0,255,65,0.3);border-radius:8px;color:#00ff41;font-family:'Courier New',monospace;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:0.05em;transition:all 0.2s"
      onmouseover="this.style.background='rgba(0,255,65,0.2)';this.style.borderColor='rgba(0,255,65,0.5)'"
      onmouseout="this.style.background='rgba(0,255,65,0.1)';this.style.borderColor='rgba(0,255,65,0.3)'"
    >ACCESS</button>
    <div id="login-error" style="color:#f87171;font-size:12px;margin-top:12px;display:none"></div>
  </div>
</div>

<canvas id="matrix-rain"></canvas>
<canvas id="matrix-rain-glow"></canvas>
<div id="app-root" style="display:none">

<!-- Outer wrapper: single column on mobile, wide 2-col on desktop -->
<div class="max-w-lg lg:max-w-6xl mx-auto">

<!-- Top bar -->
<div class="flex items-center justify-between mb-1">
  <div class="flex items-center gap-3">
    <h1 class="text-xl font-bold text-white"><span style="font-size:13px;font-weight:400;color:#6b7280">Mission Control</span></h1>
    <span id="device-badge" class="device-badge"></span>
  </div>
  <div class="flex items-center gap-3">
    <span id="last-updated" class="text-xs text-gray-500"></span>
    <!-- Matrix Music Player -->
    <button id="matrix-music-btn" onclick="toggleMatrixMusic()" title="Clubbed to Death - Rob Dougan" style="background:none;border:1px solid rgba(0,255,65,0.15);border-radius:8px;padding:4px 10px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.3s ease;color:#3a6b3a;font-family:'Courier New',monospace;font-size:11px">
      <span id="matrix-music-icon" style="font-size:14px">&#9654;</span>
      <span id="matrix-music-label">MATRIX</span>
      <span id="matrix-music-eq" style="display:none;height:14px;gap:2px;align-items:flex-end">
        <span class="eq-bar" style="width:2px;background:#00ff41;animation:eqBounce 0.4s ease infinite alternate"></span>
        <span class="eq-bar" style="width:2px;background:#00ff41;animation:eqBounce 0.5s ease infinite alternate 0.1s"></span>
        <span class="eq-bar" style="width:2px;background:#00ff41;animation:eqBounce 0.3s ease infinite alternate 0.2s"></span>
        <span class="eq-bar" style="width:2px;background:#00ff41;animation:eqBounce 0.45s ease infinite alternate 0.15s"></span>
      </span>
    </button>
    <!-- Audio handled by HTML5 Audio element in JS, no iframe needed -->
    <button id="refresh-btn" onclick="refreshAll()" class="text-gray-400 hover:text-white transition">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    </button>
  </div>
</div>
<div id="bot-info" class="flex items-center gap-3 mb-4 text-xs text-gray-500" style="display:none"></div>

<!-- Main Navigation Tabs -->
<div class="db-nav-tabs" style="border-radius:10px;margin-bottom:16px">
  <button class="db-nav-tab active" onclick="switchMainTab('dashboard',this)">Dashboard</button>
  <button class="db-nav-tab" onclick="switchMainTab('ceo',this)">CEO</button>
  <button class="db-nav-tab" onclick="switchMainTab('sales',this)">Sales</button>
  <button class="db-nav-tab" onclick="switchMainTab('knowledge',this)">Knowledge</button>
  <button class="db-nav-tab" onclick="switchMainTab('database',this)">Local DB</button>
  <button class="db-nav-tab" onclick="switchMainTab('supabase',this)">Supabase</button>
  <button class="db-nav-tab" onclick="switchMainTab('projects',this)" style="background:linear-gradient(135deg,rgba(0,150,255,0.1),rgba(0,150,255,0.04));border:1px solid rgba(0,150,255,0.25)">&#128187; Projects</button>
  <button class="db-nav-tab" onclick="switchMainTab('shopify',this)" style="background:linear-gradient(135deg,rgba(180,140,80,0.1),rgba(220,180,100,0.06));border:1px solid rgba(180,140,80,0.25)">Shopify</button>
  <button class="db-nav-tab" onclick="switchMainTab('builder',this)" style="background:linear-gradient(135deg,rgba(0,255,65,0.08),rgba(0,180,255,0.06));border:1px solid rgba(0,255,65,0.2)">&#9889; Builder</button>
  <button class="db-nav-tab" onclick="switchMainTab('oracle',this)" style="background:linear-gradient(135deg,rgba(0,255,65,0.12),rgba(0,255,65,0.04));border:1px solid rgba(0,255,65,0.35);color:#00ff41">&#11044; Oracle</button>
  <button class="db-nav-tab" onclick="switchMainTab('portugues',this)" style="background:linear-gradient(135deg,rgba(0,180,80,0.1),rgba(255,204,0,0.06));border:1px solid rgba(0,180,80,0.25)">&#127463;&#127479; Portugu&ecirc;s</button>
</div>

<!-- Dashboard View -->
<div id="main-tab-dashboard">

<!-- Summary Stats Bar -->
<div id="summary-bar" class="summary-bar" style="display:none">
  <div class="summary-stat clickable-card" onclick="document.getElementById('hive-section').scrollIntoView({behavior:'smooth'})" style="cursor:pointer">
    <span class="summary-stat-val" id="sum-messages">-</span>
    <span class="summary-stat-label">Messages</span>
  </div>
  <div class="summary-stat clickable-card" onclick="document.getElementById('agents-section').scrollIntoView({behavior:'smooth'})" style="cursor:pointer">
    <span class="summary-stat-val" id="sum-agents">-</span>
    <span class="summary-stat-label">Agents</span>
  </div>
  <div class="summary-stat clickable-card" onclick="document.getElementById('tokens-section').scrollIntoView({behavior:'smooth'})" style="cursor:pointer">
    <span class="summary-stat-val" id="sum-cost">-</span>
    <span class="summary-stat-label">Tokens Today</span>
  </div>
  <div class="summary-stat clickable-card" onclick="openMemoryDrawer()" style="cursor:pointer">
    <span class="summary-stat-val" id="sum-memories">-</span>
    <span class="summary-stat-label">Memories</span>
  </div>
</div>

<!-- Agent Status Cards -->
<div id="agents-section" class="mb-5" style="display:none">
  <div class="flex items-center justify-between mb-2">
    <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Agents</h2>
    <div class="flex items-center gap-2">
      <button onclick="openCreateAgentWizard()" style="background:#014421;color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer">+ New Agent</button>
      <div class="model-picker" onclick="toggleModelPicker(this)" style="display:inline-block">
        <span class="model-current" style="color:#6b7280">Set all <span style="font-size:8px;opacity:0.5">&#9662;</span></span>
        <div class="model-menu" style="display:none;right:0;left:auto">
          <div class="model-opt" data-model="claude-opus-4-6" onclick="pickGlobalModel(this)">All Opus</div>
          <div class="model-opt" data-model="claude-sonnet-4-6" onclick="pickGlobalModel(this)">All Sonnet</div>
          <div class="model-opt" data-model="claude-haiku-4-5" onclick="pickGlobalModel(this)">All Haiku</div>
        </div>
      </div>
    </div>
  </div>
  <div id="agents-container" class="flex flex-wrap gap-3"></div>
</div>

<!-- Hive Mind Feed -->
<div id="hive-section" class="mb-5" style="display:none">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Hive Mind<button class="privacy-toggle" onclick="toggleSectionBlur('hive')" title="Toggle blur">&#128065;</button></h2>
  <div id="hive-container" class="card hive-scroll">
    <div class="text-gray-500 text-sm">Loading...</div>
  </div>
</div>

<!-- Tasks Inbox -->
<div id="tasks-inbox-section" class="mb-5" style="display:none">
  <div class="flex items-center justify-between mb-2">
    <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tasks</h2>
    <div class="flex gap-2">
      <button onclick="autoAssignAll()" id="auto-assign-all-btn" style="background:#1a1a1a;color:#a78bfa;border:1px solid #2a2a2a;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer;display:none">Auto-assign All</button>
      <button onclick="openMissionModal()" style="background:#014421;color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer">+ New Task</button>
    </div>
  </div>
  <div id="tasks-inbox" class="flex flex-wrap gap-3"></div>
</div>

<!-- Mission Control -->
<div id="mission-section" class="mb-5" style="display:none">
  <div class="flex items-center justify-between mb-2">
    <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mission Control</h2>
    <button onclick="openTaskHistory()" style="background:none;border:none;color:#6b7280;font-size:12px;cursor:pointer">History &rarr;</button>
  </div>
  <div id="mission-board" class="flex gap-3 overflow-x-auto pb-2" style="scroll-snap-type: x mandatory;">
  </div>
</div>

<!-- Mission Task Creation Modal -->
<div id="mission-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:40;opacity:0;pointer-events:none;transition:opacity 0.2s"></div>
<div id="mission-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);z-index:50;background:#0a0f0a;border:1px solid rgba(0,255,65,0.15);border-radius:12px;width:90%;max-width:440px;opacity:0;pointer-events:none;transition:transform 0.2s ease,opacity 0.2s ease">
  <div class="flex items-center justify-between px-4 pt-4 pb-2">
    <h3 class="text-sm font-bold text-white">New Task</h3>
    <button onclick="closeMissionModal()" class="text-gray-500 hover:text-white" style="background:none;border:none;cursor:pointer;font-size:16px">&times;</button>
  </div>
  <div style="padding:0 16px 16px">
    <input type="text" id="mission-title" placeholder="Title" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:13px;outline:none;margin-bottom:8px;box-sizing:border-box" maxlength="200">
    <textarea id="mission-prompt" rows="3" placeholder="What should the agent do?" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:13px;outline:none;resize:vertical;margin-bottom:8px;box-sizing:border-box" maxlength="10000"></textarea>
    <div class="flex gap-2 items-center">
      <select id="mission-priority" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:6px 10px;color:#e0e0e0;font-size:12px;outline:none">
        <option value="0">Low</option>
        <option value="5" selected>Medium</option>
        <option value="10">High</option>
      </select>
      <button onclick="createMissionTask()" style="flex:1;background:#014421;color:#fff;border:none;border-radius:8px;padding:8px;font-size:13px;font-weight:600;cursor:pointer">Create</button>
    </div>
    <div id="mission-error" class="text-red-400 text-xs mt-2" style="display:none"></div>
  </div>
</div>

<!-- Agent Detail Modal -->
<div id="agent-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:40;opacity:0;pointer-events:none;transition:opacity 0.2s"></div>
<div id="agent-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);z-index:50;background:#0a0f0a;border:1px solid rgba(0,255,65,0.15);border-radius:12px;width:90%;max-width:500px;max-height:80vh;opacity:0;pointer-events:none;transition:transform 0.2s ease,opacity 0.2s ease;display:flex;flex-direction:column">
  <div class="flex items-center justify-between px-4 pt-4 pb-2">
    <h3 class="text-sm font-bold text-white" id="agent-modal-title">Agent</h3>
    <button onclick="closeAgentModal()" class="text-gray-500 hover:text-white" style="background:none;border:none;cursor:pointer;font-size:16px">&times;</button>
  </div>
  <div id="agent-modal-body" style="overflow-y:auto;padding:0 16px 16px;flex:1"></div>
</div>

<!-- Create Agent Wizard Modal -->
<div id="create-agent-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:40;opacity:0;pointer-events:none;transition:opacity 0.2s"></div>
<div id="create-agent-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);z-index:50;background:#0a0f0a;border:1px solid rgba(0,255,65,0.15);border-radius:12px;width:90%;max-width:480px;max-height:85vh;opacity:0;pointer-events:none;transition:transform 0.2s ease,opacity 0.2s ease;display:flex;flex-direction:column">
  <div class="flex items-center justify-between px-4 pt-4 pb-2">
    <h3 class="text-sm font-bold text-white" id="create-agent-title">New Agent</h3>
    <button onclick="closeCreateAgentWizard()" class="text-gray-500 hover:text-white" style="background:none;border:none;cursor:pointer;font-size:16px">&times;</button>
  </div>
  <!-- Step indicators -->
  <div class="flex gap-2 px-4 mb-3">
    <div id="caw-step-1-dot" style="flex:1;height:3px;border-radius:2px;background:#014421;transition:background 0.2s"></div>
    <div id="caw-step-2-dot" style="flex:1;height:3px;border-radius:2px;background:#2a2a2a;transition:background 0.2s"></div>
    <div id="caw-step-3-dot" style="flex:1;height:3px;border-radius:2px;background:#2a2a2a;transition:background 0.2s"></div>
  </div>
  <div id="create-agent-body" style="overflow-y:auto;padding:0 16px 16px;flex:1">
    <!-- Step 1: Basics -->
    <div id="caw-step-1">
      <label class="text-xs text-gray-400 block mb-1">Agent ID <span class="text-gray-600">(lowercase, no spaces)</span></label>
      <input type="text" id="caw-id" placeholder="e.g. analytics" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:13px;outline:none;margin-bottom:4px;box-sizing:border-box" maxlength="30" oninput="cawIdChanged()">
      <div id="caw-id-status" class="text-xs mb-3" style="min-height:16px"></div>

      <label class="text-xs text-gray-400 block mb-1">Display Name</label>
      <input type="text" id="caw-name" placeholder="e.g. Analytics" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:13px;outline:none;margin-bottom:8px;box-sizing:border-box" maxlength="50" oninput="cawNameManuallyEdited=true">

      <label class="text-xs text-gray-400 block mb-1">Description</label>
      <input type="text" id="caw-desc" placeholder="What this agent does" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:13px;outline:none;margin-bottom:8px;box-sizing:border-box" maxlength="200">

      <div class="flex gap-2 mb-3">
        <div style="flex:1">
          <label class="text-xs text-gray-400 block mb-1">Model</label>
          <select id="caw-model" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 10px;color:#e0e0e0;font-size:12px;outline:none">
            <option value="claude-sonnet-4-6" selected>Sonnet 4.6</option>
            <option value="claude-opus-4-6">Opus 4.6</option>
            <option value="claude-haiku-4-5">Haiku 4.5</option>
          </select>
        </div>
        <div style="flex:1">
          <label class="text-xs text-gray-400 block mb-1">Template</label>
          <select id="caw-template" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 10px;color:#e0e0e0;font-size:12px;outline:none">
            <option value="_template">Blank</option>
          </select>
        </div>
      </div>

      <div id="caw-step1-error" class="text-red-400 text-xs mb-2" style="display:none"></div>
      <button onclick="cawGoStep2()" style="width:100%;background:#014421;color:#fff;border:none;border-radius:8px;padding:10px;font-size:13px;font-weight:600;cursor:pointer">Next: Set up Telegram bot</button>
    </div>

    <!-- Step 2: BotFather + Token -->
    <div id="caw-step-2" style="display:none">
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:14px;margin-bottom:12px">
        <div class="text-xs text-gray-400 font-semibold uppercase mb-2">Create a Telegram bot</div>
        <div class="text-xs text-gray-300 leading-relaxed">
          1. Open <a href="https://t.me/BotFather" target="_blank" rel="noopener" style="color:#34d399;text-decoration:none">@BotFather</a> in Telegram<br>
          2. Send <code style="background:#222;padding:1px 4px;border-radius:3px">/newbot</code><br>
          3. Name it: <span id="caw-suggested-name" style="color:#a78bfa;cursor:pointer" onclick="copyToClipboard(this.textContent)" title="Click to copy"></span><br>
          4. Username: <span id="caw-suggested-username" style="color:#a78bfa;cursor:pointer" onclick="copyToClipboard(this.textContent)" title="Click to copy"></span><br>
          5. Copy the token BotFather gives you
        </div>
      </div>

      <label class="text-xs text-gray-400 block mb-1">Bot Token</label>
      <div style="position:relative">
        <input type="text" id="caw-token" placeholder="Paste token from BotFather" style="width:100%;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;padding-right:70px;color:#e0e0e0;font-size:13px;outline:none;box-sizing:border-box;font-family:monospace" oninput="cawTokenChanged()">
        <div id="caw-token-status" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:11px"></div>
      </div>
      <div id="caw-token-info" class="text-xs mt-2" style="min-height:16px"></div>

      <div class="flex gap-2 mt-3">
        <button onclick="cawGoStep1()" style="flex:0 0 auto;background:#1a1a1a;color:#9ca3af;border:1px solid #2a2a2a;border-radius:8px;padding:10px 16px;font-size:13px;cursor:pointer">Back</button>
        <button id="caw-create-btn" onclick="cawCreate()" style="flex:1;background:#014421;color:#fff;border:none;border-radius:8px;padding:10px;font-size:13px;font-weight:600;cursor:pointer;opacity:0.5;pointer-events:none">Create Agent</button>
      </div>
      <div id="caw-step2-error" class="text-red-400 text-xs mt-2" style="display:none"></div>
    </div>

    <!-- Step 3: Confirmation + Activate -->
    <div id="caw-step-3" style="display:none">
      <div style="text-align:center;margin-bottom:16px">
        <div style="width:48px;height:48px;border-radius:50%;background:#064e3b;margin:0 auto 8px;display:flex;align-items:center;justify-content:center">
          <svg width="24" height="24" fill="none" stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="text-sm font-semibold text-white">Agent Created</div>
      </div>

      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:14px;margin-bottom:12px">
        <div id="caw-summary" class="text-xs text-gray-300 leading-relaxed"></div>
      </div>

      <div id="caw-activate-section">
        <button id="caw-activate-btn" onclick="cawActivate()" style="width:100%;background:#064e3b;color:#6ee7b7;border:1px solid #065f46;border-radius:8px;padding:10px;font-size:13px;font-weight:600;cursor:pointer">Activate (install service + start)</button>
        <div id="caw-activate-status" class="text-xs text-center mt-2" style="min-height:16px"></div>
      </div>

      <button onclick="closeCreateAgentWizard();loadAgents();loadMissionControl();" style="width:100%;background:#1a1a1a;color:#9ca3af;border:1px solid #2a2a2a;border-radius:8px;padding:8px;font-size:12px;cursor:pointer;margin-top:8px">Done</button>
    </div>
  </div>
</div>

<!-- Desktop: 2-column grid. Mobile: stacked. -->
<div class="lg:grid lg:grid-cols-2 lg:gap-6">

<!-- LEFT COLUMN -->
<div>

<!-- Scheduled Tasks -->
<div id="tasks-section">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Scheduled Tasks<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Automated tasks scheduled by the bot (e.g. reminders, checks). Shows the schedule, status, and time until next run.</span></span><button class="privacy-toggle" onclick="toggleSectionBlur('tasks')" title="Toggle blur">&#128065;</button></h2>
  <div id="tasks-container"><div class="card text-gray-500 text-sm">Loading...</div></div>
</div>

<!-- Memory Landscape -->
<div id="memory-section" class="mt-5">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Memory Landscape</h2>
  <div class="grid grid-cols-3 gap-3 mb-3">
    <div class="card clickable-card text-center" onclick="openMemoryDrawer()" style="cursor:pointer">
      <div class="stat-val" id="mem-total">-</div>
      <div class="stat-label">Memories</div>
      <div class="text-xs text-gray-600 mt-1">Tap to browse</div>
    </div>
    <div class="card clickable-card text-center" onclick="openInsightsDrawer()" style="cursor:pointer">
      <div class="stat-val" id="mem-consolidations">-</div>
      <div class="stat-label">Insights</div>
      <div class="text-xs text-gray-600 mt-1">Tap to browse</div>
    </div>
    <div class="card clickable-card text-center" onclick="openPinnedDrawer()" style="cursor:pointer">
      <div class="stat-val" id="mem-pinned" style="color:#34d399">-</div>
      <div class="stat-label">Pinned</div>
      <div class="text-xs text-gray-600 mt-1">Tap to browse</div>
    </div>
  </div>
  <div class="card">
    <div class="text-xs text-gray-400 mb-2">Importance Distribution<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Distribution of memories by LLM-assigned importance (0-1). Higher = more critical to remember long-term.</span></span></div>
    <canvas id="importance-chart" height="120"></canvas>
  </div>
  <div class="card">
    <div class="flex items-center justify-between mb-1">
      <div class="text-xs text-gray-400">Fading Soon <span class="text-gray-600">(salience &lt; 0.5)</span><span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Memories losing salience. High-importance ones decay slower; low-importance ones fade fast.</span></span></div>
      <button class="text-xs text-gray-600 hover:text-gray-400 transition" onclick="openMemoryDrawer()">Browse all &rarr;</button>
    </div>
    <div id="fading-list" class="text-sm"></div>
  </div>
  <div class="card">
    <div class="flex items-center justify-between mb-1">
      <div class="text-xs text-gray-400">Recently Retrieved<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">High-importance memories recently used in conversations.</span></span></div>
      <button class="text-xs text-gray-600 hover:text-gray-400 transition" onclick="openMemoryDrawer()">Browse all &rarr;</button>
    </div>
    <div id="top-accessed-list" class="text-sm"></div>
  </div>
  <div class="card">
    <div class="flex items-center justify-between mb-1">
      <div class="text-xs text-gray-400">Recent Insights<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Patterns and connections discovered across memories by the consolidation engine.</span></span></div>
    </div>
    <div id="insights-list" class="text-sm"></div>
  </div>
  <div class="card">
    <div class="text-xs text-gray-400 mb-2">Memory Creation (30d)<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Number of new memories created per day over the last 30 days. Only meaningful exchanges get stored.</span></span></div>
    <canvas id="memory-timeline-chart" height="140"></canvas>
  </div>
</div>

</div><!-- end LEFT COLUMN -->

<!-- RIGHT COLUMN -->
<div>

<!-- System Health -->
<div id="health-section" class="mt-5 lg:mt-0">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">System Health</h2>
  <div class="card flex items-center gap-4">
    <div class="relative">
      <svg id="context-gauge" width="90" height="90" viewBox="0 0 90 90"></svg>
      <span class="info-tip" style="position:absolute;top:0;right:-4px;"><span class="info-icon">\u24D8</span><span class="info-tooltip">Percentage of the context window in use. The higher it is, the closer the bot is to its working memory limit.</span></span>
    </div>
    <div class="flex-1">
      <div class="grid grid-cols-3 gap-2 text-center">
        <div>
          <div class="stat-val text-base" id="health-turns">-</div>
          <div class="stat-label">Turns</div>
        </div>
        <div>
          <div class="stat-val text-base" id="health-age">-</div>
          <div class="stat-label">Age</div>
        </div>
        <div>
          <div class="stat-val text-base" id="health-compactions">-</div>
          <div class="stat-label">Compactions</div>
        </div>
      </div>
      <div class="text-center mt-1"><span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Turns = number of exchanges in the session. Age = session duration. Compactions = how many times context was compressed to free up space.</span></span></div>
    </div>
  </div>
  <div class="flex gap-3 mt-1 flex-wrap">
    <span class="pill" id="tg-pill">Telegram</span>
    <span class="pill" id="wa-pill">WhatsApp</span>
    <span class="pill" id="slack-pill">Slack</span>
    <span class="pill pill-unconfigured" id="supabase-pill">Supabase</span>
    <span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Connection status for messaging platforms and cloud sync. Green = connected, Red = disconnected, Gray = not configured.</span></span>
  </div>
</div>

<!-- Token / Cost -->
<div id="token-section" class="mt-5 mb-8">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2" id="tokens-section">Token Usage<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Token consumption (text units processed by the AI). Today's totals and all-time cumulative. Included in your Max subscription.</span></span></h2>
  <div class="card">
    <div class="flex justify-between items-baseline">
      <div>
        <div class="stat-val" id="token-today-cost">-</div>
        <div class="stat-label">Tokens Today</div>
      </div>
      <div class="text-right">
        <div class="stat-val text-base" id="token-today-turns">-</div>
        <div class="stat-label">Turns today</div>
      </div>
    </div>
    <div class="mt-2 text-xs text-gray-500">All-time: <span id="token-alltime-cost">-</span> tokens across <span id="token-alltime-turns">-</span> turns</div>
  </div>
  <div class="card">
    <div class="text-xs text-gray-400 mb-2">Usage Timeline (30d)<span class="info-tip"><span class="info-icon">\u24D8</span><span class="info-tooltip">Daily token usage over the last 30 days.</span></span></div>
    <canvas id="cost-chart" height="140"></canvas>
  </div>

</div>

</div><!-- end RIGHT COLUMN -->

</div><!-- end grid -->

</div><!-- end main-tab-dashboard -->

<!-- Knowledge Graph View -->
<div id="main-tab-knowledge" style="display:none">
<div class="mb-4">
  <!-- Sub-tab navigation -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
    <button class="db-nav-tab active" id="kg-subtab-graph" onclick="switchKgSubTab('graph',this)" style="font-size:12px;padding:5px 14px">Knowledge Graph</button>
    <button class="db-nav-tab" id="kg-subtab-integrations" onclick="switchKgSubTab('integrations',this)" style="font-size:12px;padding:5px 14px">Integrations &amp; MCPs</button>
  </div>

  <!-- Sub-tab: Knowledge Graph -->
  <div id="kg-view-graph">

  <!-- Controls Bar -->
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      <input type="text" id="kg-search" placeholder="Search nodes..." style="background:rgba(0,20,0,0.6);border:1px solid rgba(0,255,65,0.15);border-radius:6px;padding:4px 10px;color:#a0d8a0;font-size:12px;font-family:inherit;width:180px;outline:none" oninput="filterKnowledgeGraph(this.value)">
      <select id="kg-filter-agent" style="background:rgba(0,20,0,0.6);border:1px solid rgba(0,255,65,0.15);border-radius:6px;padding:4px 8px;color:#a0d8a0;font-size:12px;font-family:inherit;outline:none" onchange="filterKnowledgeGraph()">
        <option value="">All Agents</option>
      </select>
      <select id="kg-filter-type" style="background:rgba(0,20,0,0.6);border:1px solid rgba(0,255,65,0.15);border-radius:6px;padding:4px 8px;color:#a0d8a0;font-size:12px;font-family:inherit;outline:none" onchange="filterKnowledgeGraph()">
        <option value="">All Types</option>
        <option value="memory">Memories</option>
        <option value="entity">Entities</option>
        <option value="topic">Topics</option>
      </select>
      <div style="display:flex;align-items:center;gap:6px;margin-left:auto">
        <span style="font-size:11px;color:#6b7280">Spread</span>
        <input type="range" id="kg-force-slider" min="30" max="300" value="120" style="width:100px;accent-color:#00ff41" oninput="updateKgForce(this.value)">
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:11px;color:#6b7280">Repulsion</span>
        <input type="range" id="kg-repulsion-slider" min="-800" max="-50" value="-300" style="width:100px;accent-color:#00ff41" oninput="updateKgRepulsion(this.value)">
      </div>
    </div>
  </div>

  <!-- Graph + Detail Panel -->
  <div style="display:flex;gap:12px;height:600px">
    <!-- SVG Graph Container -->
    <div class="card" id="kg-graph-container" style="flex:1;position:relative;overflow:hidden;padding:0;min-width:0">
      <div id="kg-loading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:13px">Loading graph...</div>
      <svg id="kg-svg" style="width:100%;height:100%"></svg>
    </div>

    <!-- Detail Side Panel -->
    <div id="kg-detail-panel" class="card" style="width:280px;flex-shrink:0;overflow-y:auto;display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px" id="kg-detail-type">Memory</span>
        <button onclick="closeKgDetail()" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:16px;padding:0">&times;</button>
      </div>
      <div id="kg-detail-title" style="color:#00ff41;font-size:14px;font-weight:600;margin-bottom:8px"></div>
      <div id="kg-detail-body" style="font-size:12px;color:#a0d8a0;line-height:1.5"></div>
      <div id="kg-detail-meta" style="margin-top:12px;font-size:11px;color:#6b7280"></div>
      <div id="kg-detail-connections" style="margin-top:12px"></div>
    </div>
  </div>

  <!-- Legend -->
  <div style="display:flex;gap:16px;margin-top:8px;padding:4px 8px;font-size:11px;color:#6b7280;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:#00ff41;display:inline-block;box-shadow:0 0 6px rgba(0,255,65,0.5)"></span> Memory (Link)</div>
    <div style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:#00bbff;display:inline-block;box-shadow:0 0 6px rgba(0,187,255,0.5)"></span> Memory (Steve)</div>
    <div style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:#ff6600;display:inline-block;box-shadow:0 0 6px rgba(255,102,0,0.5)"></span> Memory (Neo)</div>
    <div style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:#ff00ff;display:inline-block;box-shadow:0 0 6px rgba(255,0,255,0.5)"></span> Memory (Smith)</div>
    <div style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#66ff99;display:inline-block"></span> Entity</div>
    <div style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:3px;background:rgba(0,255,65,0.15);border:1px solid rgba(0,255,65,0.3);display:inline-block"></span> Topic</div>
  </div>
  </div><!-- end kg-view-graph -->

  <!-- Sub-tab: Integrations & MCPs -->
  <div id="kg-view-integrations" style="display:none">

    <!-- Summary Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:14px" id="intg-stats-row"></div>

    <!-- Claude.ai Web Integrations (MCP Servers) -->
    <div class="card" style="padding:14px;margin-bottom:12px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Claude.ai MCP Integrations</div>
      <div id="intg-mcp-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px"></div>
    </div>

    <!-- API Keys & Services -->
    <div class="card" style="padding:14px;margin-bottom:12px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">API Keys &amp; Service Integrations</div>
      <div id="intg-api-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px"></div>
    </div>

    <!-- Agent Connections -->
    <div class="card" style="padding:14px;margin-bottom:12px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Agent Network (Telegram Bots)</div>
      <div id="intg-agents-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px"></div>
    </div>

    <!-- Claude Code Skills -->
    <div class="card" style="padding:14px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Claude Code Skills</div>
      <div id="intg-skills-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px"></div>
    </div>

  </div><!-- end kg-view-integrations -->

</div>
</div><!-- end main-tab-knowledge -->

<!-- Português Learning Tab -->
<div id="main-tab-portugues" style="display:none">
<div class="mb-4">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3" style="display:flex;align-items:center;gap:8px">
    <span style="font-size:18px">&#127463;&#127479;</span> Portugu&ecirc;s - Learning Journey
    <span id="pt-level-badge" style="margin-left:auto;padding:3px 10px;border-radius:6px;font-size:11px;background:rgba(0,180,80,0.15);border:1px solid rgba(0,180,80,0.3);color:#00cc66;letter-spacing:1px"></span>
  </h2>

  <!-- Overview Stats Row -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px" id="pt-stats-row"></div>

  <!-- Two Column: Skills Radar + Grammar Mastery -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
    <!-- Skills Radar -->
    <div class="card" style="padding:14px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Skills Breakdown</div>
      <div style="position:relative;height:260px;display:flex;align-items:center;justify-content:center">
        <canvas id="pt-radar-chart" width="280" height="260"></canvas>
      </div>
    </div>
    <!-- Grammar Mastery -->
    <div class="card" style="padding:14px;overflow-y:auto;max-height:320px">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Grammar Mastery</div>
      <div id="pt-grammar-list"></div>
    </div>
  </div>

  <!-- Vocabulary Breakdown -->
  <div class="card" style="padding:14px;margin-bottom:14px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Vocabulary by Category</div>
    <div id="pt-vocab-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px"></div>
  </div>

  <!-- Irregular Verbs Grid -->
  <div class="card" style="padding:14px;margin-bottom:14px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Irregular Verbs Studied (14 verbs, all moods)</div>
    <div id="pt-irreg-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px"></div>
  </div>

  <!-- Strengths & Weaknesses -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
    <div class="card" style="padding:14px">
      <div style="font-size:12px;color:#10b981;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">&#9733; Strengths</div>
      <div id="pt-strengths"></div>
    </div>
    <div class="card" style="padding:14px">
      <div style="font-size:12px;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">&#9888; Focus Areas</div>
      <div id="pt-weaknesses"></div>
    </div>
  </div>

  <!-- Learning Timeline -->
  <div class="card" style="padding:14px;margin-bottom:14px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Learning Timeline</div>
    <div id="pt-timeline" style="position:relative;padding-left:20px"></div>
  </div>

  <!-- Key Resources -->
  <div class="card" style="padding:14px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Recommended Resources</div>
    <div id="pt-resources" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px"></div>
  </div>

</div>
</div><!-- end main-tab-portugues -->

<!-- CEO View -->
<div id="main-tab-ceo" style="display:none">

<!-- ROW 1: Revenue Command Center -->
<div style="margin-bottom:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div class="section-title-responsive" style="font-size:15px;font-weight:700;color:#00ff41;text-transform:uppercase;letter-spacing:0.06em;text-shadow:0 0 12px rgba(0,255,65,0.3)">
      REVENUE COMMAND CENTER
    </div>
    <button onclick="loadCeoData()" style="background:rgba(0,255,65,0.1);border:1px solid rgba(0,255,65,0.2);color:#00ff41;padding:4px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:'Courier New',monospace">REFRESH</button>
  </div>
  <div class="ceo-metrics-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
    <div class="sales-metric-card">
      <div class="sales-metric-label">MRR</div>
      <div class="sales-metric-val" id="ceo-mrr">...</div>
      <div class="sales-metric-delta" id="ceo-mrr-delta"></div>
    </div>
    <div class="sales-metric-card">
      <div class="sales-metric-label">Active Subs</div>
      <div class="sales-metric-val" id="ceo-active-subs">...</div>
      <div class="sales-metric-delta flat" id="ceo-active-subs-sub"></div>
    </div>
    <div class="sales-metric-card">
      <div class="sales-metric-label">New Clients</div>
      <div class="sales-metric-val" id="ceo-new-clients">...</div>
      <div class="sales-metric-delta" id="ceo-new-clients-sub"></div>
    </div>
    <div class="sales-metric-card">
      <div class="sales-metric-label">Churn Rate</div>
      <div class="sales-metric-val" id="ceo-churn-rate">...</div>
      <div class="sales-metric-delta" id="ceo-churn-sub"></div>
    </div>
  </div>
  <!-- MRR Trend Chart -->
  <div class="card">
    <div style="font-size:13px;font-weight:600;color:#00ff41;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em">MRR Trend</div>
    <div class="chart-container-responsive" style="height:200px"><canvas id="ceo-mrr-chart"></canvas></div>
  </div>
</div>

<!-- ROW 2: Pipeline Health + Revenue Breakdown -->
<div class="ceo-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
  <!-- LEFT: Sales Pipeline Health -->
  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="hs-section-title">Sales Pipeline Health</div>
      <div class="chart-container-responsive" style="height:200px"><canvas id="ceo-pipeline-chart"></canvas></div>
    </div>
    <div class="ceo-sub-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="sales-metric-card">
        <div class="sales-metric-label">Avg Days to Close</div>
        <div class="sales-metric-val" id="ceo-days-to-close" style="font-size:28px">...</div>
      </div>
      <div class="sales-metric-card">
        <div class="sales-metric-label">Pipeline Coverage</div>
        <div class="sales-metric-val" id="ceo-pipeline-coverage" style="font-size:28px">...</div>
        <div class="sales-metric-delta" id="ceo-coverage-sub"></div>
      </div>
    </div>
    <div style="margin-top:12px">
      <div class="sales-metric-card">
        <div class="sales-metric-label">Win Rate This Month</div>
        <div class="sales-metric-val" id="ceo-win-rate" style="font-size:28px">...</div>
      </div>
    </div>
  </div>

  <!-- RIGHT: Revenue Breakdown -->
  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="hs-section-title">Revenue Per Rep</div>
      <div id="ceo-rev-per-rep-wrap" class="chart-container-responsive" style="height:200px"><canvas id="ceo-rev-per-rep-chart"></canvas></div>
    </div>
    <div class="card">
      <div class="hs-section-title">New Deal Cash vs Monthly Goal</div>
      <div id="ceo-cash-target" style="padding:8px 0">
        <div style="color:#3a6b3a;font-size:12px">Loading...</div>
      </div>
    </div>
  </div>
</div>

<!-- ROW 3: Team Performance + Agent Operations -->
<div class="ceo-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
  <!-- LEFT: Team Performance -->
  <div class="card">
    <div class="hs-section-title">Team Performance</div>
    <div style="background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.1);border-radius:8px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;color:#00ff41;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">ClickUp Integration</div>
      <div style="font-size:12px;color:#3a6b3a">Coming soon - task tracking, sprint velocity, and team workload will appear here.</div>
    </div>
    <div class="ceo-sub-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" id="ceo-overdue-tasks">-</div>
        <div class="hs-kpi-label">Overdue Deals</div>
        <div class="hs-kpi-sub" style="color:#ffaa00">From HubSpot</div>
      </div>
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" style="color:#3a6b3a">-</div>
        <div class="hs-kpi-label">Bug Backlog</div>
        <div class="hs-kpi-sub">ClickUp pending</div>
      </div>
    </div>
  </div>

  <!-- RIGHT: Agent Operations -->
  <div class="card">
    <div class="hs-section-title">Agent Operations</div>
    <div style="overflow-x:auto">
      <table class="hs-leaderboard">
        <thead>
          <tr>
            <th>Agent</th>
            <th class="num">Tokens Today</th>
            <th class="num">Cost Today</th>
            <th class="num">Turns</th>
            <th class="num">Memories</th>
          </tr>
        </thead>
        <tbody id="ceo-agent-ops-body">
          <tr><td colspan="5" style="text-align:center;color:#3a6b3a;padding:20px">Loading...</td></tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:rgba(0,255,65,0.04);border-radius:8px">
      <span style="font-size:11px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.06em">Total Cost Today</span>
      <span style="font-size:16px;font-weight:700;color:#00ff41;font-family:'Courier New',monospace" id="ceo-total-cost-today">$0.00</span>
    </div>
    <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:rgba(0,255,65,0.04);border-radius:8px">
      <span style="font-size:11px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.06em">Total Memories</span>
      <span style="font-size:16px;font-weight:700;color:#00ff41;font-family:'Courier New',monospace" id="ceo-total-memories">0</span>
    </div>
  </div>
</div>

<!-- ROW 4: Personal Pulse + Content Pipeline -->
<div class="ceo-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
  <!-- LEFT: Personal Pulse -->
  <div class="card">
    <div class="hs-section-title">Personal Pulse</div>

    <!-- WHOOP Health Section -->
    <div id="ceo-whoop-section" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px">WHOOP Recovery</div>
        <div id="ceo-whoop-status" style="font-size:10px;color:#3a6b3a"></div>
      </div>

      <!-- WHOOP KPI Row -->
      <div id="ceo-whoop-kpis" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div class="hs-kpi-card" style="text-align:center;padding:8px 4px">
          <div class="hs-kpi-val" id="ceo-whoop-recovery" style="font-size:22px;color:#3a6b3a">--</div>
          <div class="hs-kpi-label" style="font-size:9px">Recovery</div>
        </div>
        <div class="hs-kpi-card" style="text-align:center;padding:8px 4px">
          <div class="hs-kpi-val" id="ceo-whoop-hrv" style="font-size:22px;color:#3a6b3a">--</div>
          <div class="hs-kpi-label" style="font-size:9px">HRV (ms)</div>
        </div>
        <div class="hs-kpi-card" style="text-align:center;padding:8px 4px">
          <div class="hs-kpi-val" id="ceo-whoop-rhr" style="font-size:22px;color:#3a6b3a">--</div>
          <div class="hs-kpi-label" style="font-size:9px">Resting HR</div>
        </div>
      </div>

      <!-- WHOOP Secondary Stats -->
      <div id="ceo-whoop-secondary" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-sleep" style="font-size:16px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:9px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Sleep</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-strain" style="font-size:16px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:9px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Strain</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-calories" style="font-size:16px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:9px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Calories</div>
        </div>
      </div>

      <!-- Extended WHOOP Stats -->
      <div id="ceo-whoop-extended" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-spo2" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">SPO2</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-skintemp" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Skin Temp</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-sleepperf" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Sleep Perf</div>
        </div>
      </div>

      <!-- Extended WHOOP Stats Row 2 -->
      <div id="ceo-whoop-extended2" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-resprate" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Resp Rate</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-avghr" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Avg HR</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(0,255,65,0.03);border-radius:6px">
          <div id="ceo-whoop-maxhr" style="font-size:14px;font-weight:700;color:#3a6b3a;font-family:'Courier New',monospace">--</div>
          <div style="font-size:8px;color:#4a8a4a;text-transform:uppercase;letter-spacing:0.04em">Max HR</div>
        </div>
      </div>

      <!-- Sleep Stage Breakdown -->
      <div id="ceo-whoop-sleep-breakdown" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px">Sleep Stages</div>
          <div id="ceo-whoop-sleep-efficiency" style="font-size:9px;color:#4a8a4a"></div>
        </div>
        <div id="ceo-whoop-sleep-bar" style="height:18px;border-radius:4px;overflow:hidden;display:flex;background:rgba(0,255,65,0.05)"></div>
        <div id="ceo-whoop-sleep-legend" style="display:flex;gap:12px;margin-top:4px;font-size:8px;color:#4a8a4a"></div>
      </div>

      <!-- Multi-Trend Charts with Tabs -->
      <div id="ceo-whoop-trend" style="margin-bottom:8px">
        <div style="display:flex;gap:4px;margin-bottom:6px">
          <button class="whoop-trend-tab" data-trend="recovery" onclick="switchWhoopTrend('recovery')" style="font-size:8px;padding:3px 8px;border:1px solid rgba(0,255,65,0.2);background:rgba(0,255,65,0.15);color:#00ff41;border-radius:4px;cursor:pointer;font-family:'Courier New',monospace">Recovery</button>
          <button class="whoop-trend-tab" data-trend="hrv" onclick="switchWhoopTrend('hrv')" style="font-size:8px;padding:3px 8px;border:1px solid rgba(0,255,65,0.1);background:transparent;color:#4a8a4a;border-radius:4px;cursor:pointer;font-family:'Courier New',monospace">HRV</button>
          <button class="whoop-trend-tab" data-trend="sleep" onclick="switchWhoopTrend('sleep')" style="font-size:8px;padding:3px 8px;border:1px solid rgba(0,255,65,0.1);background:transparent;color:#4a8a4a;border-radius:4px;cursor:pointer;font-family:'Courier New',monospace">Sleep</button>
          <button class="whoop-trend-tab" data-trend="strain" onclick="switchWhoopTrend('strain')" style="font-size:8px;padding:3px 8px;border:1px solid rgba(0,255,65,0.1);background:transparent;color:#4a8a4a;border-radius:4px;cursor:pointer;font-family:'Courier New',monospace">Strain</button>
        </div>
        <div style="height:50px">
          <canvas id="ceo-whoop-chart" style="width:100%;height:50px"></canvas>
        </div>
      </div>

      <!-- AI Health Insights -->
      <div id="ceo-whoop-insights" style="margin-bottom:8px">
        <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Health Insights</div>
        <div id="ceo-whoop-insights-list" style="display:flex;flex-direction:column;gap:4px"></div>
      </div>

      <!-- Connect prompt (shown if not connected) -->
      <div id="ceo-whoop-connect" style="display:none;text-align:center;padding:12px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.1);border-radius:8px">
        <div style="font-size:12px;color:#4a8a4a;margin-bottom:8px">Connect your WHOOP to see recovery data</div>
        <button onclick="connectWhoop()" style="background:rgba(0,255,65,0.15);border:1px solid rgba(0,255,65,0.3);color:#00ff41;padding:6px 16px;border-radius:6px;font-size:11px;cursor:pointer;font-family:'Courier New',monospace">CONNECT WHOOP</button>
      </div>
    </div>

    <!-- Divider -->
    <div style="border-top:1px solid rgba(0,255,65,0.08);margin-bottom:14px"></div>

    <!-- Calendar + Email KPI Row -->
    <div class="ceo-sub-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" id="ceo-meetings-count" style="color:#00ff41">...</div>
        <div class="hs-kpi-label">Meetings This Week</div>
        <div class="hs-kpi-sub" id="ceo-meetings-week-label">Loading...</div>
      </div>
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" id="ceo-unread-count" style="color:#00ff41">...</div>
        <div class="hs-kpi-label">Unread Emails</div>
        <div class="hs-kpi-sub" id="ceo-unread-sub">Loading...</div>
      </div>
    </div>

    <!-- Upcoming Schedule -->
    <div style="margin-bottom:14px">
      <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Upcoming Schedule</div>
      <div id="ceo-upcoming-events" style="font-size:12px;color:#3a6b3a">Loading...</div>
    </div>

    <!-- Recent Unread Emails -->
    <div>
      <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Recent Unread</div>
      <div id="ceo-unread-list" style="font-size:12px;color:#3a6b3a">Loading...</div>
    </div>

    <!-- Divider -->
    <div style="border-top:1px solid rgba(0,255,65,0.08);margin:14px 0"></div>

    <!-- Granola Meeting Notes -->
    <div id="ceo-granola-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px">Meeting Notes (Granola)</div>
        <div id="ceo-granola-status" style="font-size:10px;color:#3a6b3a"></div>
      </div>
      <div id="ceo-granola-meetings" style="margin-bottom:12px">
        <div style="font-size:11px;color:#4a8a4a;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em">Today's Meetings</div>
        <div id="ceo-granola-meetings-list" style="font-size:12px;color:#3a6b3a">Loading...</div>
      </div>
      <div id="ceo-granola-actions">
        <div style="font-size:11px;color:#4a8a4a;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em">Action Items</div>
        <div id="ceo-granola-actions-list" style="font-size:12px;color:#3a6b3a">Loading...</div>
      </div>
      <div id="ceo-granola-unconfigured" style="display:none;text-align:center;padding:12px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.1);border-radius:8px">
        <div style="font-size:12px;color:#4a8a4a;margin-bottom:4px">Granola not configured</div>
        <div style="font-size:11px;color:#3a6b3a">Add GRANOLA_CLIENT_ID and GRANOLA_REFRESH_TOKEN to .env</div>
      </div>
    </div>

    <!-- Last updated -->
    <div id="ceo-pulse-updated" style="font-size:10px;color:#3a6b3a;margin-top:10px;text-align:right"></div>
  </div>

  <!-- RIGHT: Content Pipeline -->
  <div class="card">
    <div class="hs-section-title">Content Pipeline</div>
    <div style="background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.1);border-radius:8px;padding:12px;margin-bottom:16px">
      <div style="font-size:11px;color:#00ff41;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">ClickUp Content Tracking</div>
      <div style="font-size:12px;color:#3a6b3a">Coming soon - blog posts, social content, and video pipeline will appear here.</div>
    </div>
    <div class="ceo-sub-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" style="color:#3a6b3a">-</div>
        <div class="hs-kpi-label">Posts in Draft</div>
        <div class="hs-kpi-sub">ClickUp pending</div>
      </div>
      <div class="hs-kpi-card">
        <div class="hs-kpi-val" style="color:#3a6b3a">-</div>
        <div class="hs-kpi-label">Scheduled This Week</div>
        <div class="hs-kpi-sub">ClickUp pending</div>
      </div>
    </div>
  </div>
</div>

<!-- Org Charts Section -->
<div style="margin-top:20px">
  <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3" style="display:flex;align-items:center;gap:8px">
    Org Charts
  </h2>

  <!-- Human Team Org Chart -->
  <div class="card" style="padding:16px;margin-bottom:14px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px">Human Team</div>

    <!-- CEO -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin-bottom:16px">
      <div style="padding:10px 20px;background:linear-gradient(135deg,rgba(255,217,0,0.12),rgba(255,217,0,0.04));border:1px solid rgba(255,217,0,0.3);border-radius:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#ffd900">Your Name</div>
        <div style="font-size:10px;color:#6b7280">CEO / Co-Founder</div>
      </div>
      <div style="width:1px;height:16px;background:rgba(255,255,255,0.1)"></div>
    </div>

    <!-- Department Heads Row -->
    <div style="display:flex;justify-content:center;gap:0;margin-bottom:4px">
      <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);max-width:400px;margin-top:0"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:700px;margin:0 auto 16px">

      <!-- Sales Column -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="padding:8px 14px;background:rgba(0,187,255,0.08);border:1px solid rgba(0,187,255,0.25);border-radius:8px;text-align:center;width:100%">
          <div style="font-size:12px;font-weight:600;color:#00bbff">Sales Manager</div>
          <div style="font-size:9px;color:#6b7280">Team Lead</div>
        </div>
        <div style="width:1px;height:8px;background:rgba(0,187,255,0.15)"></div>
        <div style="display:flex;flex-direction:column;gap:4px;width:100%">
          <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;text-align:center;margin-bottom:2px">Closers</div>
          <div style="padding:6px 8px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:6px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:11px;color:#c0e8c0">Closer 1</span>
            <span style="font-size:8px;color:#10b981">&#9733; TOP</span>
          </div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
            <span style="font-size:11px;color:#c0c0c0">Closer 2</span>
          </div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
            <span style="font-size:11px;color:#c0c0c0">Closer 3</span>
          </div>
          <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;text-align:center;margin:4px 0 2px">Setters</div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
            <span style="font-size:11px;color:#a0a0a0">Setter 1</span>
          </div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
            <span style="font-size:11px;color:#a0a0a0">Setter 2</span>
          </div>
        </div>
      </div>

      <!-- Account Management Column -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="padding:8px 14px;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25);border-radius:8px;text-align:center;width:100%">
          <div style="font-size:12px;font-weight:600;color:#a855f7">Account Management</div>
          <div style="font-size:9px;color:#6b7280">Post-Sale</div>
        </div>
        <div style="width:1px;height:8px;background:rgba(168,85,247,0.15)"></div>
        <div style="display:flex;flex-direction:column;gap:4px;width:100%">
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 1</span></div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 2</span></div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 3</span></div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 4</span></div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 5</span></div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px"><span style="font-size:11px;color:#c0c0c0">AM 6</span></div>
        </div>
      </div>

      <!-- Engineering Column -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="padding:8px 14px;background:rgba(0,255,65,0.08);border:1px solid rgba(0,255,65,0.25);border-radius:8px;text-align:center;width:100%">
          <div style="font-size:12px;font-weight:600;color:#00ff41">Engineering</div>
          <div style="font-size:9px;color:#6b7280">Product &amp; Dev</div>
        </div>
        <div style="width:1px;height:8px;background:rgba(0,255,65,0.15)"></div>
        <div style="display:flex;flex-direction:column;gap:4px;width:100%">
          <div style="padding:6px 8px;background:rgba(0,255,65,0.04);border:1px solid rgba(0,255,65,0.12);border-radius:6px;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:11px;color:#c0e8c0">Eng Lead</span>
            <span style="font-size:8px;color:#00ff41">LEAD</span>
          </div>
          <div style="padding:6px 8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px">
            <span style="font-size:11px;color:#c0c0c0">Dev 1</span>
          </div>
          <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;text-align:center;margin:4px 0 2px">Strategy</div>
          <div style="padding:6px 8px;background:rgba(255,204,0,0.04);border:1px solid rgba(255,204,0,0.12);border-radius:6px">
            <div style="font-size:11px;color:#c0c0c0">Strategist</div>
            <div style="font-size:9px;color:#6b7280">Pipeline &amp; Lead Quality</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Roles -->
    <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:10px;margin-top:4px">
      <div style="font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Open Roles</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <div style="padding:5px 10px;border:1px dashed rgba(245,158,11,0.3);border-radius:6px;font-size:10px;color:#f59e0b">Open Role (Customize)</div>
      </div>
    </div>
  </div>

  <!-- AI Agent Org Chart -->
  <div class="card" style="padding:16px">
    <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px">AI Agent Network (LinkOS)</div>

    <!-- Oracle at top -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin-bottom:16px">
      <div style="padding:10px 20px;background:linear-gradient(135deg,rgba(0,191,255,0.12),rgba(0,191,255,0.04));border:1px solid rgba(0,191,255,0.3);border-radius:8px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:#00bfff">The Oracle</div>
        <div style="font-size:10px;color:#6b7280">Voice Interface / Hive Mind</div>
      </div>
      <div style="width:1px;height:12px;background:rgba(255,255,255,0.1)"></div>
    </div>

    <!-- Agent Grid -->
    <div id="org-agent-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px"></div>
  </div>
</div>

</div><!-- end main-tab-ceo -->

<!-- Sales View -->
<div id="main-tab-sales" style="display:none">

<!-- Sales MTD Cards -->
<div class="sales-mtd-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
  <div class="sales-metric-card">
    <div class="sales-metric-label" id="sales-label-current">April MTD</div>
    <div class="sales-metric-val" id="sales-mtd-current">...</div>
    <div style="font-size:13px;color:#4a8a4a;margin-top:2px">Net: <span id="sales-mtd-current-net" style="color:#00cc33">...</span></div>
    <div class="sales-metric-delta" id="sales-mtd-current-delta"></div>
    <div style="font-size:11px;color:#3a6b3a;margin-top:4px"><span id="sales-mtd-current-count">0</span> charges &middot; <span id="sales-mtd-current-fees" style="color:#6b7280">$0</span> fees</div>
  </div>
  <div class="sales-metric-card">
    <div class="sales-metric-label" id="sales-label-last-month">March 1-2 (comparison)</div>
    <div class="sales-metric-val" id="sales-mtd-last-month" style="color:#00cc33;text-shadow:none">...</div>
    <div style="font-size:13px;color:#4a8a4a;margin-top:2px">Net: <span id="sales-mtd-last-month-net" style="color:#00cc33">...</span></div>
    <div class="sales-metric-delta flat" id="sales-mtd-last-month-label">same day last month</div>
    <div style="font-size:11px;color:#3a6b3a;margin-top:4px"><span id="sales-mtd-last-month-count">0</span> charges &middot; <span id="sales-mtd-last-month-fees" style="color:#6b7280">$0</span> fees</div>
  </div>
  <div class="sales-metric-card">
    <div class="sales-metric-label" id="sales-label-last-year">April 2025 MTD</div>
    <div class="sales-metric-val" id="sales-mtd-last-year" style="color:#00cc33;text-shadow:none">...</div>
    <div style="font-size:13px;color:#4a8a4a;margin-top:2px">Net: <span id="sales-mtd-last-year-net" style="color:#00cc33">...</span></div>
    <div class="sales-metric-delta flat" id="sales-mtd-last-year-label">same day last year</div>
    <div style="font-size:11px;color:#3a6b3a;margin-top:4px"><span id="sales-mtd-last-year-count">0</span> charges &middot; <span id="sales-mtd-last-year-fees" style="color:#6b7280">$0</span> fees</div>
  </div>
</div>

<!-- Comparison Bars -->
<div class="card" style="margin-bottom:20px">
  <div style="font-size:13px;font-weight:600;color:#00ff41;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em">Gross Volume Comparison</div>
  <div id="sales-comparison-bars"></div>
</div>

<!-- Recent Payments Log -->
<div class="card">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div style="font-size:13px;font-weight:600;color:#00ff41;text-transform:uppercase;letter-spacing:0.05em">Recent Payments</div>
    <button onclick="loadSalesData()" style="background:rgba(0,255,65,0.1);border:1px solid rgba(0,255,65,0.2);color:#00ff41;padding:4px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:'Courier New',monospace">REFRESH</button>
  </div>
  <div id="payments-log" style="max-height:500px;overflow-y:auto">
    <div style="padding:20px;text-align:center;color:#3a6b3a;font-size:13px">Loading payment data...</div>
  </div>
</div>

<!-- ═══ HubSpot Sales Team Performance ═══ -->
<div id="hs-team-section" style="margin-top:28px">
  <div class="hs-sales-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div class="section-title-responsive" style="font-size:15px;font-weight:700;color:#00ff41;text-transform:uppercase;letter-spacing:0.06em;text-shadow:0 0 12px rgba(0,255,65,0.3)">
      SALES TEAM COMMAND CENTER
    </div>
    <div class="hs-sales-header-controls" style="display:flex;gap:8px;align-items:center">
      <div class="hs-toggle-bar">
        <button class="hs-toggle-btn active" onclick="hsSetPeriod('week',this)">This Week</button>
        <button class="hs-toggle-btn" onclick="hsSetPeriod('month',this)">This Month</button>
      </div>
      <button onclick="loadHubSpotData()" style="background:rgba(0,255,65,0.1);border:1px solid rgba(0,255,65,0.2);color:#00ff41;padding:4px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:'Courier New',monospace">REFRESH</button>
    </div>
  </div>

  <!-- Team KPI Summary -->
  <div id="hs-kpi-cards" class="hs-kpi-grid">
    <div class="hs-kpi-card"><div class="hs-kpi-val">-</div><div class="hs-kpi-label">Loading...</div></div>
  </div>

  <!-- Win Rate + Pipeline Health Row -->
  <div class="sales-pipeline-grid" style="display:grid;grid-template-columns:200px 1fr;gap:16px;margin-bottom:20px">
    <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px">
      <div class="hs-section-title" style="margin-bottom:10px">Win Rate</div>
      <div id="hs-win-rate-display" style="position:relative">
        <svg class="hs-win-rate-ring" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="rgba(0,255,65,0.08)" stroke-width="3"/>
          <path id="hs-win-rate-arc" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="#00ff41" stroke-width="3" stroke-dasharray="0, 100" stroke-linecap="round"
            style="filter:drop-shadow(0 0 4px rgba(0,255,65,0.4));transition:stroke-dasharray 0.8s ease"/>
        </svg>
        <div class="hs-win-rate-text" id="hs-win-rate-pct">--%</div>
      </div>
      <div id="hs-win-rate-sub" style="font-size:11px;color:#3a6b3a;margin-top:6px;text-align:center"></div>
    </div>
    <div class="card">
      <div class="hs-section-title">Pipeline Health</div>
      <div id="hs-pipeline-bars" style="padding:4px 0">
        <div style="color:#3a6b3a;font-size:12px;padding:10px">Loading pipeline data...</div>
      </div>
    </div>
  </div>

  <!-- Closers Leaderboard -->
  <div class="card" style="margin-bottom:20px">
    <div class="closers-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div class="hs-section-title" style="margin-bottom:0">CLOSERS</div>
      <div class="hs-toggle-bar" style="margin-bottom:0">
        <button class="hs-toggle-btn active" onclick="hsSetSort('revenue',this)">Revenue</button>
        <button class="hs-toggle-btn" onclick="hsSetSort('calls',this)">Calls</button>
        <button class="hs-toggle-btn" onclick="hsSetSort('meetings',this)">Meetings</button>
        <button class="hs-toggle-btn" onclick="hsSetSort('talktime',this)">Talk Time</button>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="hs-leaderboard">
        <thead>
          <tr>
            <th style="width:36px">#</th>
            <th>Rep</th>
            <th class="num">Calls</th>
            <th class="num">Talk Time</th>
            <th class="num">Meetings</th>
            <th class="num">Deals Won</th>
            <th class="num">Revenue</th>
            <th class="num">Deals Lost</th>
            <th class="num">Pipeline</th>
            <th class="num">New Leads</th>
          </tr>
        </thead>
        <tbody id="hs-closers-body">
          <tr><td colspan="10" style="text-align:center;color:#3a6b3a;padding:20px">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Setters Leaderboard -->
  <div class="card" style="margin-bottom:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div class="hs-section-title" style="margin-bottom:0">SETTERS</div>
    </div>
    <div style="overflow-x:auto">
      <table class="hs-leaderboard">
        <thead>
          <tr>
            <th style="width:36px">#</th>
            <th>Rep</th>
            <th class="num">Calls</th>
            <th class="num">Talk Time</th>
            <th class="num">Meetings</th>
            <th class="num">Deals Won</th>
            <th class="num">Revenue</th>
            <th class="num">Deals Lost</th>
            <th class="num">Pipeline</th>
            <th class="num">New Leads</th>
          </tr>
        </thead>
        <tbody id="hs-setters-body">
          <tr><td colspan="10" style="text-align:center;color:#3a6b3a;padding:20px">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Alerts Grid: Stale Deals, Overdue, Unassigned, Lost -->
  <div class="sales-alerts-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

    <!-- Stale Deals -->
    <div class="card">
      <div class="hs-section-title">
        Stale Deals <span class="hs-badge" id="hs-stale-count">0</span>
        <span style="font-size:10px;color:#3a6b3a;font-weight:400;text-transform:none;letter-spacing:0">No activity 7+ days</span>
      </div>
      <div id="hs-stale-deals" style="max-height:300px;overflow-y:auto">
        <div style="color:#3a6b3a;font-size:12px;padding:10px">Loading...</div>
      </div>
    </div>

    <!-- Overdue Deals -->
    <div class="card">
      <div class="hs-section-title">
        Overdue Deals <span class="hs-badge" id="hs-overdue-count" style="background:rgba(255,68,68,0.12);color:#ff4444">0</span>
        <span style="font-size:10px;color:#3a6b3a;font-weight:400;text-transform:none;letter-spacing:0">Past close date</span>
      </div>
      <div id="hs-overdue-deals" style="max-height:300px;overflow-y:auto">
        <div style="color:#3a6b3a;font-size:12px;padding:10px">Loading...</div>
      </div>
    </div>

    <!-- Unassigned Leads -->
    <div class="card">
      <div class="hs-section-title">
        Unassigned Leads <span class="hs-badge" id="hs-unassigned-count" style="background:rgba(255,170,0,0.12);color:#ffaa00">0</span>
        <span style="font-size:10px;color:#3a6b3a;font-weight:400;text-transform:none;letter-spacing:0">No owner assigned</span>
      </div>
      <div id="hs-unassigned-leads" style="max-height:300px;overflow-y:auto">
        <div style="color:#3a6b3a;font-size:12px;padding:10px">Loading...</div>
      </div>
    </div>

    <!-- Recently Lost Deals -->
    <div class="card">
      <div class="hs-section-title">
        Recently Lost <span class="hs-badge" id="hs-lost-count" style="background:rgba(255,68,68,0.12);color:#ff4444">0</span>
        <span style="font-size:10px;color:#3a6b3a;font-weight:400;text-transform:none;letter-spacing:0">Review & learn</span>
      </div>
      <div id="hs-lost-deals" style="max-height:300px;overflow-y:auto">
        <div style="color:#3a6b3a;font-size:12px;padding:10px">Loading...</div>
      </div>
    </div>

  </div>
</div><!-- end hs-team-section -->

</div><!-- end main-tab-sales -->

<!-- Database View -->
<div id="main-tab-database" style="display:none">
  <div class="db-layout">
    <div class="db-sidebar" id="db-sidebar">
      <div style="padding:8px 14px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Tables</div>
      <div id="db-table-list"><div style="padding:8px 14px;color:#555;font-size:12px">Loading...</div></div>
    </div>
    <div>
      <div class="db-grid-wrapper">
        <div class="db-grid-scroll" id="db-grid-scroll">
          <table class="db-grid" id="db-grid">
            <thead id="db-grid-head"></thead>
            <tbody id="db-grid-body"><tr><td style="padding:20px;color:#555">Select a table</td></tr></tbody>
          </table>
        </div>
        <div class="db-pagination" id="db-pagination" style="display:none">
          <span id="db-row-info"></span>
          <div class="flex items-center gap-2">
            <button class="db-page-btn" id="db-prev-btn" onclick="dbPrevPage()">&larr; Prev</button>
            <span id="db-page-info"></span>
            <button class="db-page-btn" id="db-next-btn" onclick="dbNextPage()">Next &rarr;</button>
          </div>
        </div>
      </div>
      <div class="db-query-area">
        <textarea class="db-query-textarea" id="db-query-input" rows="3" placeholder="SELECT * FROM scheduled_tasks WHERE status = 'active' LIMIT 20" onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();dbRunQuery()}"></textarea>
        <div class="db-query-bar">
          <button class="db-run-btn" onclick="dbRunQuery()">Run Query</button>
          <span id="db-query-status" class="db-query-info"></span>
        </div>
        <div id="db-query-error" class="db-query-error" style="display:none"></div>
      </div>
    </div>
  </div>
</div><!-- end main-tab-database -->

<!-- Supabase View -->
<div id="main-tab-supabase" style="display:none">
  <div class="db-layout">
    <div class="db-sidebar" id="sb-sidebar">
      <div style="padding:8px 14px;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Supabase Tables</div>
      <div id="sb-table-list"><div style="padding:8px 14px;color:#555;font-size:12px">Loading...</div></div>
    </div>
    <div>
      <div class="db-grid-wrapper">
        <div class="db-grid-scroll" id="sb-grid-scroll">
          <table class="db-grid" id="sb-grid">
            <thead id="sb-grid-head"></thead>
            <tbody id="sb-grid-body"><tr><td style="padding:20px;color:#555">Select a table</td></tr></tbody>
          </table>
        </div>
        <div class="db-pagination" id="sb-pagination" style="display:none">
          <span id="sb-row-info"></span>
          <div class="flex items-center gap-2">
            <button class="db-page-btn" id="sb-prev-btn" onclick="sbPrevPage()">&larr; Prev</button>
            <span id="sb-page-info"></span>
            <button class="db-page-btn" id="sb-next-btn" onclick="sbNextPage()">Next &rarr;</button>
          </div>
        </div>
      </div>
      <!-- Add Row section -->
      <div class="sb-insert-area" id="sb-insert-area" style="display:none">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <button class="sb-add-row-btn" id="sb-toggle-form-btn" onclick="sbToggleAddForm()">+ Add Row</button>
          <span id="sb-insert-status" class="sb-insert-status"></span>
        </div>
        <div id="sb-add-form" style="display:none">
          <div class="sb-form-grid" id="sb-form-fields"></div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:12px">
            <button class="sb-add-row-btn" id="sb-submit-row-btn" onclick="sbInsertRow()">Insert Row</button>
            <button class="db-page-btn" onclick="sbToggleAddForm()">Cancel</button>
          </div>
        </div>
      </div>
      <!-- JSON Insert area -->
      <div class="db-query-area" id="sb-json-area" style="display:none">
        <textarea class="db-query-textarea" id="sb-json-input" rows="3" placeholder='{"column_name": "value", "other_col": 123}' onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();sbInsertJson()}"></textarea>
        <div class="db-query-bar">
          <button class="db-run-btn" onclick="sbInsertJson()">Insert JSON</button>
          <span id="sb-json-status" class="db-query-info"></span>
        </div>
        <div id="sb-json-error" class="db-query-error" style="display:none"></div>
      </div>
    </div>
  </div>
</div><!-- end main-tab-supabase -->

<!-- ═══ Builder Tab ═══ -->
<div id="main-tab-builder" style="display:none">
  <div class="bldr-wrap">
    <!-- Top toolbar -->
    <div class="bldr-toolbar">
      <div class="bldr-toolbar-left">
        <select id="bldr-project-select" onchange="bldrSwitchProject(this.value)">
          <option value="">Select project...</option>
        </select>
        <button class="bldr-btn bldr-btn-primary" onclick="bldrNewProject()">+ New</button>
        <button class="bldr-btn" onclick="bldrDeleteProject()" title="Delete project" id="bldr-delete-btn" style="display:none">&#128465;</button>
      </div>
      <div class="bldr-toolbar-center" id="bldr-project-name" style="display:none">
        <span id="bldr-project-title"></span>
      </div>
      <div class="bldr-toolbar-right">
        <button class="bldr-btn" onclick="bldrToggleVersions()" id="bldr-versions-btn" style="display:none">&#128337; Versions</button>
        <button class="bldr-btn" onclick="bldrTogglePanel('chat')" id="bldr-toggle-chat">Chat</button>
        <button class="bldr-btn" onclick="bldrTogglePanel('code')" id="bldr-toggle-code">Code</button>
        <button class="bldr-btn" onclick="bldrTogglePanel('preview')" id="bldr-toggle-preview">Preview</button>
      </div>
    </div>

    <!-- Panels -->
    <div class="bldr-panels" id="bldr-panels">
      <!-- Chat Panel -->
      <div class="bldr-panel bldr-chat" id="bldr-chat-panel">
        <div class="bldr-panel-header">Chat</div>
        <div class="bldr-messages" id="bldr-messages">
          <div class="bldr-welcome" id="bldr-welcome">
            <div style="font-size:28px;margin-bottom:8px">&#9889;</div>
            <div style="font-size:14px;font-weight:600;color:#00ff41;margin-bottom:6px">What do you want to build?</div>
            <div style="font-size:12px;color:#6b7280;max-width:260px;margin:0 auto">Describe your app and I'll generate it. You can iterate from there.</div>
            <div class="bldr-suggestions" style="margin-top:16px">
              <button class="bldr-suggestion" onclick="bldrUseSuggestion('A sleek landing page for a SaaS product with pricing table, testimonials, and a hero section')">Landing page</button>
              <button class="bldr-suggestion" onclick="bldrUseSuggestion('A personal dashboard with weather widget, todo list, and daily quote')">Dashboard</button>
              <button class="bldr-suggestion" onclick="bldrUseSuggestion('An interactive data visualization with charts showing sales metrics')">Data viz</button>
              <button class="bldr-suggestion" onclick="bldrUseSuggestion('A beautiful portfolio website with project gallery, about section, and contact form')">Portfolio</button>
            </div>
          </div>
        </div>
        <div class="bldr-input-wrap" id="bldr-input-wrap" style="display:none">
          <textarea id="bldr-input" placeholder="Describe what you want to build or change..." rows="3" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();bldrSend()}"></textarea>
          <button class="bldr-send" onclick="bldrSend()" id="bldr-send-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>

      <!-- Code Panel -->
      <div class="bldr-panel bldr-editor" id="bldr-editor-panel">
        <div class="bldr-panel-header">
          <span>Code</span>
          <div class="bldr-file-tabs" id="bldr-file-tabs"></div>
        </div>
        <div class="bldr-code-wrap" id="bldr-code-wrap">
          <div class="bldr-empty-state" id="bldr-code-empty">
            <div style="color:#6b7280;font-size:12px">Generated code will appear here</div>
          </div>
          <textarea id="bldr-code-editor" class="bldr-code-editor" spellcheck="false" style="display:none" oninput="bldrCodeChanged()"></textarea>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="bldr-panel bldr-preview" id="bldr-preview-panel">
        <div class="bldr-panel-header">
          <span>Preview</span>
          <div style="display:flex;gap:6px;align-items:center">
            <button class="bldr-btn-sm" onclick="bldrRefreshPreview()" title="Refresh">&#8635;</button>
            <button class="bldr-btn-sm" onclick="bldrOpenPreviewTab()" title="Open in new tab">&#8599;</button>
          </div>
        </div>
        <div class="bldr-preview-frame-wrap">
          <iframe id="bldr-preview-frame" class="bldr-preview-frame" sandbox="allow-scripts allow-forms allow-popups allow-same-origin"></iframe>
          <div class="bldr-preview-empty" id="bldr-preview-empty">
            <div style="color:#6b7280;font-size:12px">Live preview will render here</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Versions Sidebar (hidden by default) -->
    <div class="bldr-versions-sidebar" id="bldr-versions-sidebar" style="display:none">
      <div class="bldr-panel-header">
        <span>Version History</span>
        <button class="bldr-btn-sm" onclick="bldrToggleVersions()">&#10005;</button>
      </div>
      <div class="bldr-versions-list" id="bldr-versions-list"></div>
      <button class="bldr-btn bldr-btn-primary" onclick="bldrSaveVersion()" style="margin:8px;width:calc(100% - 16px)">&#128190; Save Snapshot</button>
    </div>
  </div>
</div><!-- end main-tab-builder -->

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- PROJECTS TAB                                                       -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
<div id="main-tab-projects" style="display:none">

<style>
  .prj-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
  .prj-title { font-size:22px; font-weight:700; color:#0096ff; text-transform:uppercase; letter-spacing:0.08em; text-shadow:0 0 20px rgba(0,150,255,0.3); }
  .prj-subtitle { font-size:12px; color:#6b7280; }
  .prj-btn { background:rgba(0,150,255,0.1); border:1px solid rgba(0,150,255,0.25); color:#0096ff; padding:6px 16px; border-radius:8px; font-size:12px; cursor:pointer; font-family:'Courier New',monospace; letter-spacing:0.05em; transition:all 0.2s; }
  .prj-btn:hover { background:rgba(0,150,255,0.2); border-color:rgba(0,150,255,0.5); }
  .prj-btn-sm { padding:4px 10px; font-size:11px; }
  .prj-btn-red { background:rgba(255,60,60,0.1); border-color:rgba(255,60,60,0.25); color:#ff4444; }
  .prj-btn-red:hover { background:rgba(255,60,60,0.2); }
  .prj-btn-green { background:rgba(0,255,65,0.1); border-color:rgba(0,255,65,0.25); color:#00ff41; }

  .prj-status-counts { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .prj-status-pill { display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; font-family:'Courier New',monospace; cursor:pointer; transition:all 0.2s; border:1px solid transparent; }
  .prj-status-pill:hover { transform:translateY(-1px); }
  .prj-status-pill.active { border-color:rgba(255,255,255,0.2); box-shadow:0 0 12px rgba(0,150,255,0.2); }
  .prj-pill-dot { width:8px; height:8px; border-radius:50%; }

  .prj-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:14px; margin-bottom:20px; }
  .prj-card { background:linear-gradient(180deg, rgba(0,18,0,0.95) 0%, rgba(0,8,0,0.98) 100%); border:1px solid var(--border-default); border-radius:14px; padding:16px; cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden; }
  .prj-card:hover { border-color:rgba(0,150,255,0.4); box-shadow:0 0 24px rgba(0,150,255,0.1); transform:translateY(-2px); }
  .prj-card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .prj-card-name { font-size:15px; font-weight:700; color:#e0e0e0; }
  .prj-card-desc { font-size:12px; color:#6b7280; margin-bottom:10px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .prj-card-meta { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .prj-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; }
  .prj-badge-status { color:#000; }
  .prj-badge-env { background:rgba(0,150,255,0.12); color:#0096ff; border:1px solid rgba(0,150,255,0.2); }
  .prj-badge-tag { background:rgba(0,255,65,0.08); color:#00cc33; border:1px solid rgba(0,255,65,0.15); }
  .prj-card-links { display:flex; gap:6px; margin-top:10px; }
  .prj-link { font-size:11px; color:#0096ff; text-decoration:none; padding:2px 8px; border:1px solid rgba(0,150,255,0.2); border-radius:6px; transition:all 0.15s; }
  .prj-link:hover { background:rgba(0,150,255,0.15); }
  .prj-card-updated { font-size:10px; color:#4a5568; margin-top:8px; }

  .prj-detail { display:none; }
  .prj-detail.open { display:block; }
  .prj-detail-back { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#0096ff; cursor:pointer; margin-bottom:16px; padding:4px 0; }
  .prj-detail-back:hover { text-decoration:underline; }
  .prj-detail-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
  .prj-detail-title { font-size:20px; font-weight:700; color:#e0e0e0; }
  .prj-detail-actions { display:flex; gap:8px; flex-wrap:wrap; }
  .prj-info-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin-bottom:20px; }
  .prj-info-item { background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:10px; padding:12px; }
  .prj-info-label { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
  .prj-info-value { font-size:14px; color:#c0c0c0; word-break:break-all; }

  .prj-section { background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:12px; padding:16px; margin-bottom:16px; }
  .prj-section-title { font-size:12px; font-weight:600; color:#0096ff; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px; display:flex; align-items:center; gap:8px; }

  .prj-pr-row { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; transition:background 0.15s; font-size:12px; }
  .prj-pr-row:hover { background:rgba(0,150,255,0.06); }
  .prj-pr-num { color:#0096ff; font-weight:600; min-width:50px; }
  .prj-pr-title { flex:1; color:#c0c0c0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .prj-pr-state { padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600; text-transform:uppercase; }
  .prj-pr-merged { background:rgba(130,80,223,0.15); color:#a371f7; }
  .prj-pr-open { background:rgba(0,255,65,0.1); color:#00ff41; }
  .prj-pr-closed { background:rgba(255,60,60,0.1); color:#ff4444; }
  .prj-pr-date { color:#4a5568; font-size:11px; min-width:80px; text-align:right; }
  .prj-pr-branch { color:#3a6b3a; font-size:10px; font-family:'Courier New',monospace; }

  .prj-commit-row { display:flex; align-items:baseline; gap:10px; padding:6px 10px; font-size:12px; }
  .prj-commit-sha { color:#0096ff; font-family:'Courier New',monospace; font-size:11px; min-width:60px; }
  .prj-commit-msg { color:#c0c0c0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .prj-commit-date { color:#4a5568; font-size:11px; min-width:80px; text-align:right; }

  .prj-update-row { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-subtle); }
  .prj-update-row:last-child { border-bottom:none; }
  .prj-update-dot { width:8px; height:8px; border-radius:50%; background:#0096ff; margin-top:5px; flex-shrink:0; }
  .prj-update-content { flex:1; }
  .prj-update-text { font-size:12px; color:#c0c0c0; line-height:1.5; }
  .prj-update-meta { font-size:10px; color:#4a5568; margin-top:4px; }

  .prj-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
  .prj-modal { background:linear-gradient(180deg,rgba(0,18,0,0.98),rgba(0,6,0,0.99)); border:1px solid rgba(0,150,255,0.25); border-radius:16px; padding:24px; width:90%; max-width:560px; max-height:90vh; overflow-y:auto; }
  .prj-modal h3 { font-size:16px; font-weight:700; color:#0096ff; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em; }
  .prj-modal label { display:block; font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; margin-top:12px; }
  .prj-modal input, .prj-modal textarea, .prj-modal select { width:100%; background:var(--bg-surface); border:1px solid var(--border-default); border-radius:8px; padding:8px 12px; color:#c0c0c0; font-size:13px; font-family:'Courier New',monospace; outline:none; }
  .prj-modal input:focus, .prj-modal textarea:focus, .prj-modal select:focus { border-color:rgba(0,150,255,0.5); }
  .prj-modal textarea { resize:vertical; min-height:60px; }
  .prj-modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }

  @media (max-width: 768px) {
    .prj-grid { grid-template-columns:1fr; }
    .prj-info-grid { grid-template-columns:1fr 1fr; }
    .prj-detail-header { flex-direction:column; }
  }
</style>

<!-- Projects List View -->
<div id="prj-list-view">
  <div class="prj-header">
    <div>
      <div class="prj-title">DEV PROJECTS</div>
      <div class="prj-subtitle">Track development progress across all your projects</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="prj-btn" onclick="prjRefresh()">REFRESH</button>
      <button class="prj-btn" onclick="prjShowCreateModal()">+ NEW PROJECT</button>
    </div>
  </div>

  <!-- Status filter pills -->
  <div class="prj-status-counts" id="prj-status-pills"></div>

  <!-- Project cards grid -->
  <div class="prj-grid" id="prj-cards-grid">
    <div style="padding:32px;text-align:center;color:#3a6b3a;font-size:13px;grid-column:1/-1">Loading projects...</div>
  </div>

  <!-- Recent Activity -->
  <div class="prj-section" id="prj-activity-section" style="display:none">
    <div class="prj-section-title">Recent Activity</div>
    <div id="prj-recent-activity"></div>
  </div>
</div>

<!-- Project Detail View -->
<div id="prj-detail-view" class="prj-detail">
  <div class="prj-detail-back" onclick="prjBackToList()">&#8592; Back to projects</div>
  <div id="prj-detail-content"></div>
</div>

</div><!-- end main-tab-projects -->

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- SHOPIFY TAB                                                        -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
<div id="main-tab-shopify" style="display:none">

<!-- Shopify Header -->
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
  <div style="display:flex;align-items:center;gap:12px">
    <div style="font-size:22px;font-weight:700;color:#c8a84e;text-transform:uppercase;letter-spacing:0.08em;text-shadow:0 0 20px rgba(200,168,78,0.3)">SHOPIFY</div>
    <div style="font-size:12px;color:#6b7280;padding:3px 10px;background:rgba(200,168,78,0.08);border:1px solid rgba(200,168,78,0.15);border-radius:6px">your-store.myshopify.com</div>
  </div>
  <button onclick="loadShopifyData()" style="background:rgba(200,168,78,0.1);border:1px solid rgba(200,168,78,0.25);color:#c8a84e;padding:6px 16px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'Courier New',monospace;letter-spacing:0.05em">REFRESH</button>
</div>

<!-- Sales MTD Cards -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
  <div class="card" style="text-align:center;border-color:rgba(200,168,78,0.15)">
    <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">MTD Revenue</div>
    <div id="mrw-mtd-revenue" style="font-size:24px;font-weight:700;color:#c8a84e;text-shadow:0 0 12px rgba(200,168,78,0.3)">...</div>
    <div id="mrw-mtd-delta" style="font-size:11px;color:#3a6b3a;margin-top:4px"></div>
  </div>
  <div class="card" style="text-align:center;border-color:rgba(200,168,78,0.15)">
    <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Orders</div>
    <div id="mrw-mtd-orders" style="font-size:24px;font-weight:700;color:#c8a84e">...</div>
    <div id="mrw-mtd-orders-delta" style="font-size:11px;color:#3a6b3a;margin-top:4px"></div>
  </div>
  <div class="card" style="text-align:center;border-color:rgba(200,168,78,0.15)">
    <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">AOV</div>
    <div id="mrw-aov" style="font-size:24px;font-weight:700;color:#c8a84e">...</div>
    <div id="mrw-aov-delta" style="font-size:11px;color:#3a6b3a;margin-top:4px"></div>
  </div>
  <div class="card" style="text-align:center;border-color:rgba(200,168,78,0.15)">
    <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Inventory</div>
    <div id="mrw-inventory" style="font-size:24px;font-weight:700;color:#c8a84e">...</div>
    <div style="font-size:11px;color:#6b7280;margin-top:4px">units in stock</div>
  </div>
</div>

<!-- Products Section -->
<div class="card" style="margin-bottom:20px;border-color:rgba(200,168,78,0.12)">
  <div style="font-size:13px;font-weight:600;color:#c8a84e;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em">Products</div>
  <div id="mrw-products">
    <div style="padding:16px;text-align:center;color:#3a6b3a;font-size:13px">Loading products...</div>
  </div>
</div>

<!-- Recent Orders -->
<div class="card" style="margin-bottom:20px;border-color:rgba(200,168,78,0.12)">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div style="font-size:13px;font-weight:600;color:#c8a84e;text-transform:uppercase;letter-spacing:0.05em">Recent Orders</div>
    <div id="mrw-total-orders" style="font-size:11px;color:#6b7280"></div>
  </div>
  <div id="mrw-orders" style="max-height:500px;overflow-y:auto">
    <div style="padding:16px;text-align:center;color:#3a6b3a;font-size:13px">Loading orders...</div>
  </div>
</div>

<!-- Customer List -->
<div class="card" style="border-color:rgba(200,168,78,0.12)">
  <div style="font-size:13px;font-weight:600;color:#c8a84e;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.05em">Recent Customers</div>
  <div id="mrw-customers" style="max-height:400px;overflow-y:auto">
    <div style="padding:16px;text-align:center;color:#3a6b3a;font-size:13px">Loading customers...</div>
  </div>
</div>

</div><!-- end main-tab-shopify -->

<!-- ═══════ Oracle Tab ═══════ -->
<div id="main-tab-oracle" style="display:none">
  <style>
    .oracle-container { display:flex; flex-direction:column; align-items:center; min-height:80vh; position:relative; }
    .oracle-canvas-wrap { position:relative; width:400px; height:480px; margin:8px auto 0; overflow:hidden; border-radius:16px; background:#000; }
    #oracle-face-canvas { width:100%; height:100%; display:block; }
    /* Glow border that reacts to state */
    .oracle-glow-ring {
      position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2; border-radius:12px;
      box-shadow: inset 0 0 30px rgba(0,191,255,0.05);
      transition: box-shadow 0.4s ease;
    }
    .oracle-canvas-wrap.state-speaking .oracle-glow-ring { box-shadow: inset 0 0 40px rgba(0,191,255,0.15), 0 0 20px rgba(0,191,255,0.1); }
    .oracle-canvas-wrap.state-thinking .oracle-glow-ring { box-shadow: inset 0 0 35px rgba(255,221,0,0.1), 0 0 15px rgba(255,221,0,0.06); }
    .oracle-canvas-wrap.state-listening .oracle-glow-ring { box-shadow: inset 0 0 30px rgba(0,191,255,0.1), 0 0 12px rgba(0,191,255,0.06); }
    /* Audio pulse ring overlay */
    .oracle-pulse-ring {
      position:absolute; top:50%; left:50%; width:0; height:0; pointer-events:none; z-index:1;
      border-radius:50%; border:1px solid rgba(0,191,255,0.15);
      transform:translate(-50%,-50%); opacity:0;
    }
    @keyframes oraclePulse {
      0% { width:100px; height:100px; opacity:0.3; }
      100% { width:400px; height:400px; opacity:0; }
    }
    .oracle-canvas-wrap.state-speaking .oracle-pulse-ring { animation: oraclePulse 2s ease-out infinite; }
    /* Scanline overlay */
    .oracle-scanlines {
      position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:3; border-radius:12px;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);
      mix-blend-mode: multiply;
    }
    .oracle-scanlines::after {
      content:''; position:absolute; top:0; left:0; width:100%; height:100%;
      background: linear-gradient(transparent 50%, rgba(0,191,255,0.01) 50%);
      background-size: 100% 4px;
      animation: oracleScanMove 8s linear infinite;
    }
    @keyframes oracleScanMove { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }
    /* Glitch flicker */
    @keyframes oracleGlitch {
      0%,92%,100% { transform:translate(0,0); filter:none; }
      93% { transform:translate(-3px,0); filter: hue-rotate(90deg); }
      94% { transform:translate(3px,1px); filter: hue-rotate(-90deg) saturate(2); }
      95% { transform:translate(-1px,-1px); filter: none; }
      96% { transform:translate(2px,0); filter: hue-rotate(45deg); }
    }
    .oracle-canvas-wrap { animation: oracleGlitch 12s ease-in-out infinite; }
    /* Hex border ring */
    .oracle-hex-ring {
      position:absolute; top:50%; left:50%; width:340px; height:340px; transform:translate(-50%,-54%); pointer-events:none; z-index:1; opacity:0.4;
    }
    .oracle-camera-mini { position:absolute; bottom:8px; right:8px; width:64px; height:48px; border-radius:8px; overflow:hidden; border:1px solid rgba(0,191,255,0.2); opacity:0.7; z-index:3; }
    .oracle-camera-mini video { width:100%; height:100%; object-fit:cover; }
    .oracle-status { text-align:center; margin:4px 0; font-family:'Courier New',monospace; font-size:11px; color:#3a6b3a; letter-spacing:3px; text-transform:uppercase; min-height:16px; transition:color 0.3s; }
    .oracle-status.active { color:#00ff41; text-shadow:0 0 8px rgba(0,255,65,0.4); }
    /* Audio level bar */
    .oracle-audio-bar-wrap { width:120px; height:3px; background:rgba(0,255,65,0.08); border-radius:2px; margin:2px auto 4px; overflow:hidden; }
    .oracle-audio-bar { height:100%; width:0%; background:linear-gradient(90deg,#00ff41,#00ccff); border-radius:2px; transition:width 0.06s linear; }
    .oracle-transcript { width:100%; max-width:600px; flex:1; overflow-y:auto; padding:0 16px; margin:8px 0; max-height:35vh; }
    .oracle-msg { margin:6px 0; padding:8px 14px; border-radius:10px; font-size:13px; line-height:1.5; max-width:85%; word-wrap:break-word; }
    .oracle-msg.user { background:rgba(0,255,65,0.08); border:1px solid rgba(0,255,65,0.15); color:#b0ffb0; margin-left:auto; text-align:right; }
    .oracle-msg.assistant { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); color:#e0e0e0; }
    .oracle-msg.system { text-align:center; color:#3a6b3a; font-size:11px; border:none; background:none; font-style:italic; }
    .oracle-input-row { display:flex; gap:8px; width:100%; max-width:600px; padding:0 16px 12px; }
    .oracle-text-input { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(0,255,65,0.15); border-radius:12px; padding:10px 14px; color:#e0e0e0; font-size:14px; font-family:inherit; outline:none; transition:border-color 0.3s; }
    .oracle-text-input:focus { border-color:rgba(0,255,65,0.4); }
    .oracle-text-input::placeholder { color:rgba(255,255,255,0.15); }
    .oracle-send-btn { width:44px; height:44px; border-radius:50%; border:1px solid rgba(0,255,65,0.2); background:rgba(0,255,65,0.08); color:#00ff41; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s; flex-shrink:0; }
    .oracle-send-btn:hover { background:rgba(0,255,65,0.15); }
    .oracle-vad-indicator { width:8px; height:8px; border-radius:50%; background:#333; margin:0 auto 4px; transition:all 0.2s; }
    .oracle-vad-indicator.active { background:#00ff41; box-shadow:0 0 8px rgba(0,255,65,0.5); }
    .oracle-vad-indicator.recording { background:#ff4444; box-shadow:0 0 8px rgba(255,68,68,0.5); }
  </style>

  <div class="oracle-container">
    <!-- Avatar Image -->
    <div class="oracle-canvas-wrap state-dormant" id="oracle-avatar-wrap">
      <canvas id="oracle-face-canvas" width="400" height="480"></canvas>
      <div class="oracle-glow-ring"></div>
      <div class="oracle-pulse-ring"></div>
      <div class="oracle-scanlines"></div>
      <div class="oracle-camera-mini" id="oracle-camera-mini" style="display:none">
        <video id="oracle-camera-feed" autoplay muted playsinline></video>
      </div>
    </div>

    <!-- VAD indicator + Status + Audio level -->
    <div class="oracle-vad-indicator" id="oracle-vad-dot"></div>
    <div class="oracle-status" id="oracle-status">DORMANT</div>
    <div class="oracle-audio-bar-wrap"><div class="oracle-audio-bar" id="oracle-audio-bar"></div></div>

    <!-- Chat transcript -->
    <div class="oracle-transcript" id="oracle-chat">
      <div class="oracle-msg system">Speak freely. I'm listening.</div>
    </div>

    <!-- Text fallback input -->
    <div class="oracle-input-row">
      <input type="text" class="oracle-text-input" id="oracle-input" placeholder="Or type here..." onkeydown="if(event.key==='Enter')sendOracleMessage()" />
      <button class="oracle-send-btn" onclick="sendOracleMessage()" title="Send">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </div>
  </div>
</div>

</div><!-- end outer wrapper -->

<!-- Memory drill-down drawer -->
<div id="drawer-overlay" class="drawer-overlay" onclick="closeDrawer()"></div>
<div id="drawer" class="drawer">
  <div class="drawer-handle"></div>
  <div class="flex items-center justify-between px-4 pt-3 pb-1">
    <h3 class="text-base font-bold text-white" id="drawer-title">Memories</h3>
    <button onclick="closeDrawer()" class="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
  </div>
  <div class="px-4 pb-2 flex items-center gap-2">
    <span class="text-xs text-gray-500" id="drawer-count"></span>
    <span class="text-xs text-gray-600">|</span>
    <span class="text-xs text-gray-500" id="drawer-avg-salience"></span>
  </div>
  <div class="drawer-body" id="drawer-body"></div>
  <div id="drawer-load-more" class="px-4 pb-4 hidden">
    <button onclick="loadMoreMemories()" class="w-full py-2 text-sm text-gray-400 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-white transition">Load more</button>
  </div>
</div>

<!-- Task History Drawer -->
<div id="history-overlay" class="drawer-overlay" onclick="closeTaskHistory()"></div>
<div id="history-drawer" class="drawer">
  <div class="drawer-handle"></div>
  <div class="flex items-center justify-between px-4 pt-3 pb-1">
    <h3 class="text-base font-bold text-white">Task History</h3>
    <button onclick="closeTaskHistory()" class="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
  </div>
  <div class="px-4 pb-2"><span class="text-xs text-gray-500" id="history-count"></span></div>
  <div class="drawer-body" id="history-body"></div>
  <div id="history-load-more" class="px-4 pb-4 hidden">
    <button onclick="loadMoreHistory()" class="w-full py-2 text-sm text-gray-400 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:text-white transition">Load more</button>
  </div>
</div>

<script>
const TOKEN = ${JSON.stringify(token)};
const CHAT_ID = ${JSON.stringify(chatId)};
const BASE = location.origin;

// ── Auth gate ──────────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-root').style.display = 'none';
  // Reset login form to password step
  document.getElementById('password-step').style.display = '';
  document.getElementById('totp-step').style.display = 'none';
  var btn = document.getElementById('login-btn');
  if (btn) { btn.setAttribute('onclick', 'doLogin()'); btn.textContent = 'ACCESS'; }
  pendingToken = null;
  // Reset all lazy-load flags so tabs reload after re-login
  projectsLoaded = false;
  salesLoaded = false;
  hsLoaded = false;
  ceoLoaded = false;
  knowledgeLoaded = false;
  shopifyLoaded = false;
  ptLoaded = false;
  if (typeof bldrLoaded !== 'undefined') bldrLoaded = false;
  if (typeof dbTablesLoaded !== 'undefined') dbTablesLoaded = false;
  if (typeof sbTablesLoaded !== 'undefined') sbTablesLoaded = false;
  setTimeout(function() { document.getElementById('login-password').focus(); }, 100);
}
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-root').style.display = '';
}
var pendingToken = null;
async function doLogin() {
  var pw = document.getElementById('login-password').value.trim();
  var errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  try {
    var res = await fetch(BASE + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
      credentials: 'same-origin',
    });
    var data = await res.json();
    if (data.ok) {
      showApp();
      refreshAll();
    } else if (data.requires_2fa) {
      pendingToken = data.pending_token;
      document.getElementById('password-step').style.display = 'none';
      document.getElementById('totp-step').style.display = '';
      var btn = document.getElementById('login-btn');
      btn.setAttribute('onclick', 'verifyTotp()');
      btn.textContent = 'VERIFY';
      setTimeout(function() { document.getElementById('login-totp').focus(); }, 100);
    } else {
      errEl.textContent = data.error || 'Access denied';
      errEl.style.display = '';
    }
  } catch(e) {
    errEl.textContent = 'Connection failed';
    errEl.style.display = '';
  }
}
async function verifyTotp() {
  var code = document.getElementById('login-totp').value.trim();
  var errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  try {
    var res = await fetch(BASE + '/api/login/verify-totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pending_token: pendingToken, totp_code: code }),
      credentials: 'same-origin',
    });
    var data = await res.json();
    if (data.ok) {
      showApp();
      refreshAll();
    } else {
      errEl.textContent = data.error || 'Invalid code';
      errEl.style.display = '';
      document.getElementById('login-totp').value = '';
      document.getElementById('login-totp').focus();
    }
  } catch(e) {
    errEl.textContent = 'Connection failed';
    errEl.style.display = '';
  }
}
async function checkAuth() {
  try {
    var res = await fetch(BASE + '/api/auth-check', { credentials: 'same-origin' });
    var data = await res.json();
    if (data.authenticated) {
      showApp();
      return true;
    }
  } catch(e) {}
  showLogin();
  return false;
}

// Device detection
function detectDevice() {
  const ua = navigator.userAgent;
  const badge = document.getElementById('device-badge');
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
  if (isMobile) {
    badge.textContent = 'MOBILE';
    badge.className = 'device-badge device-mobile';
  } else {
    badge.textContent = 'DESKTOP';
    badge.className = 'device-badge device-desktop';
  }
}
detectDevice();
window.addEventListener('resize', detectDevice);

// Memory drawer state
let drawerOffset = 0;
let drawerTotal = 0;
const DRAWER_PAGE = 30;

function salienceColor(s) {
  if (s >= 4) return '#10b981';
  if (s >= 3) return '#22c55e';
  if (s >= 2) return '#84cc16';
  if (s >= 1) return '#eab308';
  if (s >= 0.5) return '#f97316';
  return '#ef4444';
}

function formatDate(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMemoryItem(m) {
  let entities = [];
  let topics = [];
  let connections = [];
  try { entities = JSON.parse(m.entities); } catch {}
  try { topics = JSON.parse(m.topics); } catch {}
  try { connections = JSON.parse(m.connections); } catch {}
  const topicTags = topics.length > 0 ? '<div class="mt-1">' + topics.map(t => '<span style="background:#1e293b;padding:1px 6px;border-radius:4px;margin-right:3px;font-size:11px;color:#94a3b8">' + escapeHtml(t) + '</span>').join('') + '</div>' : '';
  const entityLine = entities.length > 0 ? '<div class="text-xs text-gray-600 mt-1">entities: ' + escapeHtml(entities.join(', ')) + '</div>' : '';
  const connLine = connections.length > 0 ? '<div class="text-xs text-gray-600 mt-1">linked to: ' + connections.map(c => '#' + c.linked_to + ' (' + escapeHtml(c.relationship || '') + ')').join(', ') + '</div>' : '';

  return '<div class="mem-item" onclick="this.classList.toggle(&quot;expanded&quot;)">' +
    '<div class="flex items-center gap-2 mb-1">' +
      '<span class="salience-dot" style="background:' + importanceColor(m.importance) + '"></span>' +
      '<span class="text-xs font-semibold" style="color:' + importanceColor(m.importance) + '">' + m.importance.toFixed(2) + '</span>' +
      '<span class="text-xs text-gray-700 ml-1">sal ' + m.salience.toFixed(2) + '</span>' +
      '<span class="text-xs text-gray-600 ml-auto">' + formatDate(m.created_at) + '</span>' +
    '</div>' +
    '<div class="text-sm text-gray-300 mem-content">' + escapeHtml(m.summary) + '</div>' +
    topicTags +
    entityLine +
    connLine +
  '</div>';
}

async function openMemoryDrawer() {
  drawerOffset = 0;
  document.getElementById('drawer-title').textContent = 'All Memories';
  document.getElementById('drawer-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">Loading...</div>';
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  await loadDrawerPage();
}

async function openPinnedDrawer() {
  document.getElementById('drawer-title').textContent = 'Pinned Memories';
  document.getElementById('drawer-count').textContent = '';
  document.getElementById('drawer-avg-salience').textContent = '';
  document.getElementById('drawer-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">Loading...</div>';
  document.getElementById('drawer-load-more').classList.add('hidden');
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  try {
    var data = await api('/api/memories/pinned?chatId=' + CHAT_ID);
    var mems = data.memories || [];
    document.getElementById('drawer-count').textContent = mems.length + ' pinned';
    if (mems.length === 0) {
      document.getElementById('drawer-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">No pinned memories. Use /pin to make important memories permanent.</div>';
      return;
    }
    document.getElementById('drawer-body').innerHTML = mems.map(renderMemoryItem).join('');
  } catch(e) {
    document.getElementById('drawer-body').innerHTML = '<div class="text-red-400 text-sm text-center py-8">Failed to load pinned memories</div>';
  }
}

async function openInsightsDrawer() {
  document.getElementById('drawer-title').textContent = 'Consolidation Insights';
  document.getElementById('drawer-count').textContent = '';
  document.getElementById('drawer-avg-salience').textContent = '';
  document.getElementById('drawer-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">Loading...</div>';
  document.getElementById('drawer-load-more').classList.add('hidden');
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  try {
    var data = await api('/api/memories?chatId=' + CHAT_ID);
    var insights = data.consolidations || [];
    document.getElementById('drawer-count').textContent = insights.length + ' insights';
    if (insights.length === 0) {
      document.getElementById('drawer-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">No insights yet. Consolidation runs every 30 minutes.</div>';
      return;
    }
    document.getElementById('drawer-body').innerHTML = insights.map(function(c) {
      var date = new Date(c.created_at * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return '<div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:12px;margin-bottom:8px">' +
        '<div class="text-xs text-green-400 mb-1">' + date + '</div>' +
        '<div class="text-sm text-white mb-2">' + escapeHtml(c.insight || c.summary) + '</div>' +
        (c.summary && c.insight ? '<div class="text-xs text-gray-500">' + escapeHtml(c.summary) + '</div>' : '') +
      '</div>';
    }).join('');
  } catch(e) {
    document.getElementById('drawer-body').innerHTML = '<div class="text-red-400 text-sm text-center py-8">Failed to load insights</div>';
  }
}

async function loadDrawerPage() {
  const data = await api('/api/memories/list?chatId=' + CHAT_ID + '&sort=importance&limit=' + DRAWER_PAGE + '&offset=' + drawerOffset);
  drawerTotal = data.total;
  const body = document.getElementById('drawer-body');
  if (drawerOffset === 0) body.innerHTML = '';
  body.innerHTML += data.memories.map(renderMemoryItem).join('');
  drawerOffset += data.memories.length;
  document.getElementById('drawer-count').textContent = drawerTotal + ' total';
  const avgImp = data.memories.length > 0
    ? (data.memories.reduce((s, m) => s + m.importance, 0) / data.memories.length).toFixed(2)
    : '0';
  document.getElementById('drawer-avg-salience').textContent = 'avg importance ' + avgImp;
  const btn = document.getElementById('drawer-load-more');
  if (drawerOffset < drawerTotal) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

async function loadMoreMemories() {
  await loadDrawerPage();
}

function closeDrawer() {
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function api(path, options) {
  const sep = path.includes('?') ? '&' : '?';
  const url = TOKEN ? BASE + path + sep + 'token=' + TOKEN : BASE + path;
  const fetchOpts = Object.assign({ credentials: 'same-origin' }, options || {});
  return fetch(url, fetchOpts).then(function(r) {
    if (r.status === 401) { showLogin(); throw new Error('Unauthorized'); }
    return r.json().then(function(data) {
      if (!r.ok) throw new Error(data.error || 'Request failed: ' + r.status);
      return data;
    });
  });
}

let salienceChart, memTimelineChart, costChart;

function cronToHuman(cron) {
  const parts = cron.split(' ');
  if (parts.length !== 5) return cron;
  const [min, hour, dom, mon, dow] = parts;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const time = (hour !== '*' ? hour.padStart(2,'0') : '*') + ':' + (min !== '*' ? min.padStart(2,'0') : '*');
  if (dow === '*' && dom === '*') return 'Daily at ' + time;
  if (dow !== '*' && dom === '*') {
    if (dow === '1-5') return 'Weekdays at ' + time;
    const d = dow.split(',').map(n => days[parseInt(n)] || n).join(', ');
    return d + ' at ' + time;
  }
  return cron;
}

function timeAgo(ts) {
  const diff = Math.floor(Date.now()/1000) - ts;
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

function countdown(ts) {
  const diff = ts - Math.floor(Date.now()/1000);
  if (diff <= 0) return 'now';
  if (diff < 60) return diff + 's';
  if (diff < 3600) return Math.floor(diff/60) + 'm';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ' + Math.floor((diff%3600)/60) + 'm';
  return Math.floor(diff/86400) + 'd';
}
function elapsed(ts) {
  const diff = Math.floor(Date.now()/1000) - ts;
  if (diff < 60) return diff + 's';
  if (diff < 3600) return Math.floor(diff/60) + 'm ' + (diff%60) + 's';
  return Math.floor(diff/3600) + 'h ' + Math.floor((diff%3600)/60) + 'm';
}

async function taskAction(id, action) {
  try {
    if (action === 'delete') {
      await fetch(BASE + '/api/tasks/' + id + '?token=' + TOKEN, { method: 'DELETE' });
    } else {
      await fetch(BASE + '/api/tasks/' + id + '/' + action + '?token=' + TOKEN, { method: 'POST' });
    }
    await loadTasks();
  } catch(e) { console.error('Task action failed:', e); }
}

async function loadTasks() {
  try {
    const data = await api('/api/tasks');
    const c = document.getElementById('tasks-container');
    if (!data.tasks || data.tasks.length === 0) {
      c.innerHTML = '<div class="card text-gray-500 text-sm">No scheduled tasks</div>';
      return;
    }
    c.innerHTML = data.tasks.map(t => {
      const statusCls = t.status === 'running' ? 'pill-running' : t.status === 'active' ? 'pill-active' : 'pill-paused';
      const agentBadge = t.agent_id && t.agent_id !== 'main' ? '<span class="text-xs text-gray-500 ml-2">[' + t.agent_id + ']</span>' : '';
      const lastStatusIcon = t.last_status === 'success' ? '<span class="last-success" title="Last run succeeded">&#10003;</span> ' : t.last_status === 'failed' ? '<span class="last-failed" title="Last run failed">&#10007;</span> ' : t.last_status === 'timeout' ? '<span class="last-timeout" title="Last run timed out">&#9200;</span> ' : '';
      const lastResult = t.last_result ? '<details class="mt-2"><summary class="text-xs text-gray-500">' + lastStatusIcon + 'Last result</summary><pre class="text-xs text-gray-400 mt-1 whitespace-pre-wrap break-words">' + escapeHtml(t.last_result) + '</pre></details>' : '';
      const runningInfo = t.status === 'running' && t.started_at ? '<span class="text-xs text-green-400 ml-2">running for ' + elapsed(t.started_at) + '</span>' : '';
      const pauseBtn = t.status === 'active'
        ? '<button data-task="' + t.id + '" data-action="pause" onclick="taskAction(this.dataset.task,this.dataset.action)" title="Pause" style="background:none;border:none;cursor:pointer;color:#fbbf24;font-size:14px;padding:2px 4px">&#9208;</button>'
        : t.status === 'paused' ? '<button data-task="' + t.id + '" data-action="resume" onclick="taskAction(this.dataset.task,this.dataset.action)" title="Resume" style="background:none;border:none;cursor:pointer;color:#6ee7b7;font-size:14px;padding:2px 4px">&#9654;</button>' : '';
      const deleteBtn = '<button data-task="' + t.id + '" data-action="delete" onclick="taskAction(this.dataset.task,this.dataset.action)" title="Delete" style="background:none;border:none;cursor:pointer;color:#f87171;font-size:14px;padding:2px 4px">&times;</button>';
      const taskBlurState = JSON.parse(localStorage.getItem('privacyBlur_tasks') || '{}');
      const tasksAllRevealed = localStorage.getItem('privacyBlur_tasks_all') === 'revealed';
      const taskBlurred = tasksAllRevealed ? false : (taskBlurState[t.id] !== false);
      const taskBlurClass = taskBlurred ? 'privacy-blur' : '';
      return '<div class="card"><div class="flex justify-between items-start"><div class="flex-1 mr-2"><div class="text-sm text-white task-prompt ' + taskBlurClass + '" data-section="tasks" data-idx="' + t.id + '" onclick="toggleItemBlur(this)">' + escapeHtml(t.prompt) + '</div>' + agentBadge + '<div class="text-xs text-gray-500 mt-1">' + cronToHuman(t.schedule) + ' &middot; next in <span class="countdown" data-ts="' + t.next_run + '">' + countdown(t.next_run) + '</span>' + runningInfo + '</div></div><div class="flex items-center gap-1">' + pauseBtn + deleteBtn + '<span class="pill ' + statusCls + '">' + t.status + '</span></div></div>' + lastResult + '</div>';
    }).join('');
  } catch(e) {
    document.getElementById('tasks-container').innerHTML = '<div class="card text-red-400 text-sm">Failed to load tasks</div>';
  }
}

function importanceColor(imp) {
  if (imp >= 0.8) return '#10b981';
  if (imp >= 0.6) return '#22c55e';
  if (imp >= 0.4) return '#eab308';
  if (imp >= 0.2) return '#f97316';
  return '#ef4444';
}

function renderTopics(topicsJson) {
  try {
    const topics = JSON.parse(topicsJson);
    if (!topics.length) return '';
    return '<div class="text-xs text-gray-600 mt-0.5">' + topics.map(t => '<span style="background:#1e293b;padding:1px 6px;border-radius:4px;margin-right:3px">' + escapeHtml(t) + '</span>').join('') + '</div>';
  } catch { return ''; }
}

async function loadMemories() {
  try {
    const data = await api('/api/memories?chatId=' + CHAT_ID);
    document.getElementById('mem-total').textContent = data.stats.total;
    document.getElementById('mem-consolidations').textContent = data.stats.consolidations;
    document.getElementById('mem-pinned').textContent = data.stats.pinned || '0';

    // Importance distribution chart
    const bucketLabels = ['0-0.2','0.2-0.4','0.4-0.6','0.6-0.8','0.8-1.0'];
    const bucketColors = ['#ef4444','#f97316','#eab308','#22c55e','#10b981'];
    const bucketData = bucketLabels.map(b => {
      const found = data.stats.importanceDistribution.find(d => d.bucket === b);
      return found ? found.count : 0;
    });
    if (salienceChart) salienceChart.destroy();
    salienceChart = new Chart(document.getElementById('importance-chart'), {
      type: 'bar',
      data: { labels: bucketLabels, datasets: [{ data: bucketData, backgroundColor: bucketColors, borderRadius: 4 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#666' }, grid: { color: '#222' } }, x: { ticks: { color: '#666' }, grid: { display: false } } } }
    });

    // Fading
    const fading = document.getElementById('fading-list');
    if (data.fading.length === 0) {
      fading.innerHTML = '<span class="text-gray-600">None fading</span>';
    } else {
      fading.innerHTML = data.fading.map(m => '<div class="fade-text py-0.5 mem-expand" onclick="this.classList.toggle(&quot;open&quot;)"><span class="mem-preview"><span style="color:' + importanceColor(m.importance) + '">[' + m.importance.toFixed(1) + ']</span> ' + escapeHtml(m.summary.slice(0,80)) + (m.summary.length > 80 ? '...' : '') + '</span><div class="mem-full">' + escapeHtml(m.summary) + renderTopics(m.topics) + '</div></div>').join('');
    }

    // Top accessed
    const top = document.getElementById('top-accessed-list');
    if (data.topAccessed.length === 0) {
      top.innerHTML = '<span class="text-gray-600">No memories yet</span>';
    } else {
      top.innerHTML = data.topAccessed.map(m => '<div class="top-text py-0.5 mem-expand" onclick="this.classList.toggle(&quot;open&quot;)"><span class="mem-preview"><span style="color:' + importanceColor(m.importance) + '">[' + m.importance.toFixed(1) + ']</span> ' + escapeHtml(m.summary.slice(0,80)) + (m.summary.length > 80 ? '...' : '') + '</span><div class="mem-full">' + escapeHtml(m.summary) + renderTopics(m.topics) + '</div></div>').join('');
    }

    // Insights
    const insights = document.getElementById('insights-list');
    if (!data.consolidations || data.consolidations.length === 0) {
      insights.innerHTML = '<span class="text-gray-600">No insights yet</span>';
    } else {
      insights.innerHTML = data.consolidations.map(c => '<div class="py-1 mem-expand" onclick="this.classList.toggle(&quot;open&quot;)"><span class="mem-preview" style="color:#a78bfa">' + escapeHtml(c.insight.slice(0,100)) + (c.insight.length > 100 ? '...' : '') + '</span><div class="mem-full" style="color:#d4d4d8">' + escapeHtml(c.summary) + '<div class="text-xs text-gray-600 mt-1">' + formatDate(c.created_at) + '</div></div></div>').join('');
    }

    // Timeline
    if (memTimelineChart) memTimelineChart.destroy();
    if (data.timeline.length > 0) {
      memTimelineChart = new Chart(document.getElementById('memory-timeline-chart'), {
        type: 'line',
        data: {
          labels: data.timeline.map(d => d.date.slice(5)),
          datasets: [
            { label: 'Memories', data: data.timeline.map(d => d.count), borderColor: '#028a45', backgroundColor: 'rgba(2,138,69,0.1)', fill: true, tension: 0.3 }
          ]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: '#888', boxWidth: 12 } } }, scales: { y: { ticks: { color: '#666' }, grid: { color: '#222' } }, x: { ticks: { color: '#666', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false } } } }
      });
    }
  } catch(e) {
    console.error('Memory load error', e);
  }
}

function drawGauge(pct) {
  const svg = document.getElementById('context-gauge');
  const r = 36, cx = 45, cy = 45, sw = 8;
  const circ = 2 * Math.PI * r;
  const clampedPct = Math.min(Math.max(pct, 0), 100);
  const dashOffset = circ - (circ * clampedPct / 100);
  let color = '#22c55e';
  if (clampedPct >= 75) color = '#ef4444';
  else if (clampedPct >= 50) color = '#f59e0b';
  svg.innerHTML =
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#2a2a2a" stroke-width="'+sw+'"/>' +
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+dashOffset+'" transform="rotate(-90 '+cx+' '+cy+')"/>' +
    '<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" fill="'+color+'" font-size="16" font-weight="700">'+clampedPct+'%</text>';
}

async function loadHealth() {
  try {
    const data = await api('/api/health?chatId=' + CHAT_ID);
    drawGauge(data.contextPct);
    document.getElementById('health-turns').textContent = data.turns;
    document.getElementById('health-compactions').textContent = data.compactions;
    document.getElementById('health-age').textContent = data.sessionAge;

    const tgPill = document.getElementById('tg-pill');
    tgPill.className = 'pill ' + (data.telegramConnected ? 'pill-connected' : 'pill-disconnected');
    const waPill = document.getElementById('wa-pill');
    waPill.className = 'pill ' + (data.waConnected ? 'pill-connected' : 'pill-disconnected');
    const slackPill = document.getElementById('slack-pill');
    slackPill.className = 'pill ' + (data.slackConnected ? 'pill-connected' : 'pill-disconnected');

    // Supabase status (async, non-blocking)
    loadSupabaseStatus();
  } catch(e) {
    drawGauge(0);
  }
}

async function loadSupabaseStatus() {
  var pill = document.getElementById('supabase-pill');
  try {
    var data = await api('/api/supabase/status');
    if (!data.enabled) {
      pill.className = 'pill pill-unconfigured';
      pill.textContent = 'Supabase: Not configured';
    } else if (data.connected) {
      pill.className = 'pill pill-connected';
      pill.textContent = 'Supabase: Connected';
    } else {
      pill.className = 'pill pill-disconnected';
      pill.textContent = 'Supabase: Connection failed';
    }
  } catch(e) {
    pill.className = 'pill pill-unconfigured';
    pill.textContent = 'Supabase: Unknown';
  }
}

async function loadTokens() {
  try {
    const data = await api('/api/tokens?chatId=' + CHAT_ID);
    var todayTok = (data.stats.todayInput || 0) + (data.stats.todayOutput || 0);
    document.getElementById('token-today-cost').textContent = todayTok > 1000 ? Math.round(todayTok / 1000).toLocaleString() + 'k' : todayTok.toString();
    document.getElementById('token-today-turns').textContent = data.stats.todayTurns;
    var allTok = (data.stats.allTimeInput || 0) + (data.stats.allTimeOutput || 0);
    document.getElementById('token-alltime-cost').textContent = allTok > 1000000 ? (allTok / 1000000).toFixed(1) + 'M' : allTok > 1000 ? Math.round(allTok / 1000) + 'k' : allTok.toString();
    document.getElementById('token-alltime-turns').textContent = data.stats.allTimeTurns;

    // Usage timeline (turns per day)
    if (costChart) costChart.destroy();
    if (data.costTimeline.length > 0) {
      costChart = new Chart(document.getElementById('cost-chart'), {
        type: 'line',
        data: {
          labels: data.costTimeline.map(d => d.date.slice(5)),
          datasets: [{ label: 'Turns', data: data.costTimeline.map(d => d.turns), borderColor: '#028a45', backgroundColor: 'rgba(2,138,69,0.1)', fill: true, tension: 0.3, pointRadius: 2 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#666' }, grid: { color: '#222' } }, x: { ticks: { color: '#666', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false } } } }
      });
    }

    // (cache chart removed)
  } catch(e) {
    console.error('Token load error', e);
  }
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function loadInfo() {
  try {
    const r = await fetch(BASE + '/api/info?chatId=' + CHAT_ID, { credentials: 'same-origin' });
    const d = await r.json();
    const el = document.getElementById('bot-info');
    const parts = [];
    if (d.botName) parts.push('<span class="font-semibold text-white">' + d.botName + '</span>');
    el.innerHTML = parts.join(' <span class="text-gray-700">|</span> ');
  } catch {}
}

// Tooltip open/close \u2014 capture phase to intercept before inline onclick handlers
document.addEventListener('click', function(e) {
  const icon = e.target.closest('.info-icon');
  if (icon) {
    e.stopPropagation();
    e.preventDefault();
    const tip = icon.parentElement;
    const wasActive = tip.classList.contains('active');
    document.querySelectorAll('.info-tip.active').forEach(t => t.classList.remove('active'));
    if (!wasActive) tip.classList.add('active');
    return;
  }
  const tooltip = e.target.closest('.info-tooltip');
  if (tooltip) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  document.querySelectorAll('.info-tip.active').forEach(t => t.classList.remove('active'));
}, true);

// ── Agent & Hive Mind ────────────────────────────────────────────────
const AGENT_COLORS = { main: '#00ff41', assistant: '#67e8f9', trinity: '#67e8f9', comms: '#0ea5e9', content: '#f59e0b', ops: '#10b981', research: '#028a45', smith: '#00ff41', steve: '#a78bfa', outreach: '#f97316', morpheus: '#c0a050' };

async function loadAgents() {
  try {
    const data = await api('/api/agents');
    const section = document.getElementById('agents-section');
    const container = document.getElementById('agents-container');
    section.style.display = '';
    if (!data.agents || data.agents.length === 0) {
      container.innerHTML = '<div class="text-xs text-gray-600 py-2">No agents configured yet. Click + New Agent to create one.</div>';
      return;
    }

    // Mr. Smith SVG avatar — Matrix-style agent in suit with sunglasses
    // Each agent gets a unique gradient ID to avoid SVG ID collisions
    var smithCounter = 0;
    var smithSvg = function(isLive, agentColor) {
      var uid = 'sm' + (smithCounter++);
      var green = isLive ? '#00ff41' : '#1a3a1a';
      var skinTone = isLive ? '#c8a882' : '#5a4a3a';
      var skinShadow = isLive ? '#b0906a' : '#4a3a2a';
      var suitColor = isLive ? '#0a0a0a' : '#080808';
      var shirtColor = isLive ? '#d4d0c8' : '#3a3a3a';
      var tieColor = agentColor || green;
      var glassStroke = isLive ? green : '#333';
      var glassOpacity = isLive ? '0.9' : '0.4';

      return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
        // Defs — unique IDs per card
        '<defs>' +
          '<radialGradient id="' + uid + 'bg" cx="50%" cy="35%" r="55%">' +
            '<stop offset="0%" stop-color="' + green + '" stop-opacity="' + (isLive ? '0.12' : '0.04') + '"/>' +
            '<stop offset="100%" stop-color="transparent"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'suit" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#1a1a1a"/>' +
            '<stop offset="100%" stop-color="' + suitColor + '"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + uid + 'tie" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="' + tieColor + '"/>' +
            '<stop offset="100%" stop-color="' + tieColor + '" stop-opacity="0.6"/>' +
          '</linearGradient>' +
        '</defs>' +
        // Background glow
        '<circle cx="40" cy="40" r="39" fill="url(#' + uid + 'bg)" stroke="' + green + '" stroke-width="0.5" stroke-opacity="' + (isLive ? '0.2' : '0.05') + '"/>' +
        // Shoulders / suit jacket body
        '<path d="M16 80 L20 54 Q20 46 40 44 Q60 46 60 54 L64 80Z" fill="url(#' + uid + 'suit)" stroke="#003300" stroke-width="0.5" stroke-opacity="0.4"/>' +
        // Suit lapels (V-shape)
        '<path d="M28 50 L36 60 L40 52Z" fill="none" stroke="#1a3a1a" stroke-width="0.8"/>' +
        '<path d="M52 50 L44 60 L40 52Z" fill="none" stroke="#1a3a1a" stroke-width="0.8"/>' +
        // White shirt visible in V
        '<path d="M33 48 L40 56 L47 48" fill="' + shirtColor + '" stroke="none" opacity="0.15"/>' +
        // Shirt collar
        '<path d="M33 47 L40 53 L47 47" fill="none" stroke="' + shirtColor + '" stroke-width="0.7" opacity="0.5"/>' +
        // Tie knot
        '<path d="M38.5 49 L40 52 L41.5 49Z" fill="url(#' + uid + 'tie)"/>' +
        // Tie body
        '<path d="M39 52 L40 72 L41 52Z" fill="url(#' + uid + 'tie)" opacity="0.9"/>' +
        // Pocket square
        '<rect x="23" y="56" width="4" height="2.5" rx="0.8" fill="' + shirtColor + '" opacity="0.2"/>' +
        // Neck
        '<rect x="37" y="40" width="6" height="5" rx="1" fill="' + skinShadow + '"/>' +
        // Head shape
        '<ellipse cx="40" cy="26" rx="13" ry="15" fill="' + skinTone + '"/>' +
        // Ears
        '<ellipse cx="27.5" cy="27" rx="2" ry="3" fill="' + skinShadow + '"/>' +
        '<ellipse cx="52.5" cy="27" rx="2" ry="3" fill="' + skinShadow + '"/>' +
        // Hair — slicked back, dark
        '<path d="M27 24 Q27 11 40 9 Q53 11 53 24 Q51 15 40 13 Q29 15 27 24Z" fill="#0a0a0a" stroke="#111" stroke-width="0.3"/>' +
        // Sideburns
        '<rect x="27" y="22" width="1.5" height="5" rx="0.5" fill="#0a0a0a"/>' +
        '<rect x="51.5" y="22" width="1.5" height="5" rx="0.5" fill="#0a0a0a"/>' +
        // Eyebrows (serious expression)
        '<path d="M31 21 L37 20" stroke="#2a2a2a" stroke-width="1" stroke-linecap="round"/>' +
        '<path d="M43 20 L49 21" stroke="#2a2a2a" stroke-width="1" stroke-linecap="round"/>' +
        // SUNGLASSES — the iconic element
        // Left lens
        '<rect x="29" y="22" width="9.5" height="6" rx="1.2" fill="#000" stroke="' + glassStroke + '" stroke-width="0.7" stroke-opacity="' + glassOpacity + '"/>' +
        // Right lens
        '<rect x="41.5" y="22" width="9.5" height="6" rx="1.2" fill="#000" stroke="' + glassStroke + '" stroke-width="0.7" stroke-opacity="' + glassOpacity + '"/>' +
        // Bridge
        '<path d="M38.5 25 L41.5 25" stroke="' + glassStroke + '" stroke-width="0.7" stroke-opacity="' + glassOpacity + '" fill="none"/>' +
        // Temple arms (going to ears)
        '<line x1="29" y1="24.5" x2="27" y2="23.5" stroke="' + glassStroke + '" stroke-width="0.6" stroke-opacity="' + glassOpacity + '"/>' +
        '<line x1="51" y1="24.5" x2="53" y2="23.5" stroke="' + glassStroke + '" stroke-width="0.6" stroke-opacity="' + glassOpacity + '"/>' +
        // Lens reflections (only when live — that menacing glint)
        (isLive ?
          '<line x1="30.5" y1="23" x2="33" y2="24" stroke="' + green + '" stroke-width="0.5" stroke-opacity="0.7"/>' +
          '<line x1="43" y1="23" x2="45.5" y2="24" stroke="' + green + '" stroke-width="0.5" stroke-opacity="0.7"/>' +
          '<rect x="30" y="23.5" width="2" height="0.5" rx="0.25" fill="' + green + '" opacity="0.3"/>' +
          '<rect x="43.5" y="23.5" width="2" height="0.5" rx="0.25" fill="' + green + '" opacity="0.3"/>'
        : '') +
        // Nose
        '<path d="M40 27 L39 31 L41 31Z" fill="' + skinShadow + '" opacity="0.4"/>' +
        // Mouth (stern, straight line)
        '<line x1="36" y1="34" x2="44" y2="34" stroke="#8a7060" stroke-width="0.8" stroke-linecap="round"/>' +
        // Chin shadow
        '<path d="M34 36 Q40 39 46 36" fill="none" stroke="' + skinShadow + '" stroke-width="0.4" opacity="0.3"/>' +
        // Suit button
        '<circle cx="40" cy="64" r="1" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.3"/>' +
      '</svg>';
    };

    var trinitySvg = function(isLive, agentColor) {
      var uid = 'tr' + (smithCounter++);
      var green = isLive ? '#00ff41' : '#1a3a1a';
      var skinTone = isLive ? '#e0d4c8' : '#5a4a3a';
      var skinShadow = isLive ? '#c4b0a0' : '#4a3a2a';
      var pvcColor = isLive ? '#111' : '#080808';
      var pvcShine = isLive ? '#2a2a2a' : '#151515';
      var glassStroke = isLive ? green : '#333';
      var glassOpacity = isLive ? '0.9' : '0.4';

      return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'bg" cx="50%" cy="35%" r="55%">' +
            '<stop offset="0%" stop-color="' + green + '" stop-opacity="' + (isLive ? '0.12' : '0.04') + '"/>' +
            '<stop offset="100%" stop-color="transparent"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'pvc" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="' + pvcShine + '"/>' +
            '<stop offset="30%" stop-color="' + pvcColor + '"/>' +
            '<stop offset="60%" stop-color="' + pvcShine + '"/>' +
            '<stop offset="100%" stop-color="' + pvcColor + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        // Background glow
        '<circle cx="40" cy="40" r="39" fill="url(#' + uid + 'bg)" stroke="' + green + '" stroke-width="0.5" stroke-opacity="' + (isLive ? '0.2' : '0.05') + '"/>' +
        // PVC catsuit body (high collar, fitted)
        '<path d="M17 80 L22 52 Q24 44 40 42 Q56 44 58 52 L63 80Z" fill="url(#' + uid + 'pvc)" stroke="#003300" stroke-width="0.5" stroke-opacity="0.3"/>' +
        // PVC shine highlights on shoulders
        '<path d="M24 56 Q26 50 30 48" fill="none" stroke="' + pvcShine + '" stroke-width="0.8" opacity="0.5"/>' +
        '<path d="M56 56 Q54 50 50 48" fill="none" stroke="' + pvcShine + '" stroke-width="0.8" opacity="0.5"/>' +
        // High collar (standing collar around neck)
        '<path d="M33 44 L33 38 Q33 36 36 36 L44 36 Q47 36 47 38 L47 44" fill="' + pvcColor + '" stroke="' + pvcShine + '" stroke-width="0.4"/>' +
        // Collar shine
        '<line x1="34" y1="37" x2="34" y2="43" stroke="' + pvcShine + '" stroke-width="0.5" opacity="0.4"/>' +
        '<line x1="46" y1="37" x2="46" y2="43" stroke="' + pvcShine + '" stroke-width="0.5" opacity="0.4"/>' +
        // Center zipper line
        '<line x1="40" y1="42" x2="40" y2="75" stroke="#333" stroke-width="0.8"/>' +
        '<line x1="40" y1="42" x2="40" y2="75" stroke="#444" stroke-width="0.3"/>' +
        // Zipper pull
        '<rect x="39" y="50" width="2" height="3" rx="0.5" fill="#555" stroke="#666" stroke-width="0.3"/>' +
        // Neck (slim, pale)
        '<rect x="37.5" y="35" width="5" height="4" rx="1" fill="' + skinShadow + '"/>' +
        // Head shape (angular, pale -- Trinity has sharp features)
        '<ellipse cx="40" cy="23" rx="12" ry="13.5" fill="' + skinTone + '"/>' +
        // Jawline (more angular/defined)
        '<path d="M28.5 26 Q32 36 40 38 Q48 36 51.5 26" fill="' + skinTone + '" stroke="none"/>' +
        // Hair -- slicked back, short, tight to head (center-parted)
        '<path d="M28 22 Q28 9 40 7 Q52 9 52 22 Q50 13 40 11 Q30 13 28 22Z" fill="#0a0a0a" stroke="#111" stroke-width="0.3"/>' +
        // Hair tucked behind ears -- short, not flowing
        '<path d="M28 22 Q27 25 27.5 30" fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M52 22 Q53 25 52.5 30" fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/>' +
        // Center part line
        '<line x1="40" y1="8" x2="40" y2="14" stroke="#1a1a1a" stroke-width="0.4"/>' +
        // Ears (small, visible with short hair)
        '<ellipse cx="28" cy="25" rx="1.5" ry="2.5" fill="' + skinShadow + '"/>' +
        '<ellipse cx="52" cy="25" rx="1.5" ry="2.5" fill="' + skinShadow + '"/>' +
        // Eyebrows (thin, arched, intense)
        '<path d="M31 19 L36.5 17.5" stroke="#3a3a3a" stroke-width="0.7" stroke-linecap="round"/>' +
        '<path d="M43.5 17.5 L49 19" stroke="#3a3a3a" stroke-width="0.7" stroke-linecap="round"/>' +
        // SUNGLASSES -- oval/rounded (Trinity style, not rectangular like Smith)
        '<ellipse cx="34" cy="22.5" rx="5.5" ry="3.2" fill="#000" stroke="' + glassStroke + '" stroke-width="0.6" stroke-opacity="' + glassOpacity + '"/>' +
        '<ellipse cx="46" cy="22.5" rx="5.5" ry="3.2" fill="#000" stroke="' + glassStroke + '" stroke-width="0.6" stroke-opacity="' + glassOpacity + '"/>' +
        // Bridge
        '<path d="M39 22.5 L41 22.5" stroke="' + glassStroke + '" stroke-width="0.5" stroke-opacity="' + glassOpacity + '" fill="none"/>' +
        // Temple arms
        '<line x1="28.5" y1="22" x2="27" y2="21.5" stroke="' + glassStroke + '" stroke-width="0.5" stroke-opacity="' + glassOpacity + '"/>' +
        '<line x1="51.5" y1="22" x2="53" y2="21.5" stroke="' + glassStroke + '" stroke-width="0.5" stroke-opacity="' + glassOpacity + '"/>' +
        // Lens reflections (when live)
        (isLive ?
          '<ellipse cx="32.5" cy="22" rx="1.5" ry="0.8" fill="' + green + '" opacity="0.15"/>' +
          '<ellipse cx="44.5" cy="22" rx="1.5" ry="0.8" fill="' + green + '" opacity="0.15"/>' +
          '<line x1="31" y1="21.5" x2="33.5" y2="22.5" stroke="' + green + '" stroke-width="0.4" stroke-opacity="0.6"/>' +
          '<line x1="43" y1="21.5" x2="45.5" y2="22.5" stroke="' + green + '" stroke-width="0.4" stroke-opacity="0.6"/>'
        : '') +
        // Nose (small, defined)
        '<path d="M40 25 L39.3 28.5 L40.7 28.5Z" fill="' + skinShadow + '" opacity="0.3"/>' +
        // Lips (defined, neutral expression -- not smiling)
        '<line x1="37" y1="31.5" x2="43" y2="31.5" stroke="#9a7a6a" stroke-width="0.7" stroke-linecap="round"/>' +
        '<path d="M37.5 31.3 Q40 30.5 42.5 31.3" fill="none" stroke="#9a7a6a" stroke-width="0.3" opacity="0.4"/>' +
        // Chin (angular)
        '<path d="M35 33 Q40 36 45 33" fill="none" stroke="' + skinShadow + '" stroke-width="0.3" opacity="0.2"/>' +
      '</svg>';
    };

    // Morpheus SVG avatar — dark skin, round pince-nez glasses, black leather trench coat
    var morpheusSvg = function(isLive, agentColor) {
      var uid = 'mo' + (smithCounter++);
      var green = isLive ? '#00ff41' : '#1a3a1a';
      var skinTone = isLive ? '#5c3a1e' : '#3a2a1a';
      var skinShadow = isLive ? '#4a2e16' : '#2a1e10';
      var skinHighlight = isLive ? '#6e4828' : '#4a3a2a';
      var coatColor = isLive ? '#0e0e0e' : '#080808';
      var coatShine = isLive ? '#1e1e1e' : '#111';
      var leatherShine = isLive ? '#2a2a2a' : '#151515';
      var glassColor = agentColor || (isLive ? '#c0a050' : '#4a3a20');
      var glassStroke = isLive ? glassColor : '#333';
      var glassOpacity = isLive ? '0.95' : '0.4';

      return '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<radialGradient id="' + uid + 'bg" cx="50%" cy="35%" r="55%">' +
            '<stop offset="0%" stop-color="' + green + '" stop-opacity="' + (isLive ? '0.10' : '0.04') + '"/>' +
            '<stop offset="100%" stop-color="transparent"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + uid + 'coat" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="' + coatShine + '"/>' +
            '<stop offset="25%" stop-color="' + coatColor + '"/>' +
            '<stop offset="50%" stop-color="' + leatherShine + '"/>' +
            '<stop offset="75%" stop-color="' + coatColor + '"/>' +
            '<stop offset="100%" stop-color="' + coatShine + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        // Background glow
        '<circle cx="40" cy="40" r="39" fill="url(#' + uid + 'bg)" stroke="' + green + '" stroke-width="0.5" stroke-opacity="' + (isLive ? '0.2' : '0.05') + '"/>' +
        // Leather trench coat body — wide collar, open front
        '<path d="M12 80 L18 52 Q20 44 40 42 Q60 44 62 52 L68 80Z" fill="url(#' + uid + 'coat)" stroke="#003300" stroke-width="0.5" stroke-opacity="0.3"/>' +
        // Coat leather shine highlights
        '<path d="M20 58 Q22 50 28 47" fill="none" stroke="' + leatherShine + '" stroke-width="1" opacity="0.5"/>' +
        '<path d="M60 58 Q58 50 52 47" fill="none" stroke="' + leatherShine + '" stroke-width="1" opacity="0.5"/>' +
        // Wide coat lapels (leather trench style)
        '<path d="M28 46 L34 56 L38 48Z" fill="' + coatShine + '" stroke="' + leatherShine + '" stroke-width="0.5" opacity="0.6"/>' +
        '<path d="M52 46 L46 56 L42 48Z" fill="' + coatShine + '" stroke="' + leatherShine + '" stroke-width="0.5" opacity="0.6"/>' +
        // Inner shirt/vest visible (dark charcoal)
        '<path d="M34 47 L40 55 L46 47" fill="#1a1a1a" stroke="none" opacity="0.4"/>' +
        // Center line of coat
        '<line x1="40" y1="55" x2="40" y2="78" stroke="#222" stroke-width="0.6"/>' +
        // Coat buttons
        '<circle cx="40" cy="60" r="1" fill="#1a1a1a" stroke="#333" stroke-width="0.3"/>' +
        '<circle cx="40" cy="66" r="1" fill="#1a1a1a" stroke="#333" stroke-width="0.3"/>' +
        // Neck
        '<rect x="37" y="38" width="6" height="5" rx="1" fill="' + skinShadow + '"/>' +
        // Head shape (broader, strong jaw)
        '<ellipse cx="40" cy="24" rx="13.5" ry="15" fill="' + skinTone + '"/>' +
        // Jawline definition
        '<path d="M27 28 Q32 38 40 40 Q48 38 53 28" fill="' + skinTone + '" stroke="none"/>' +
        // Ears
        '<ellipse cx="27" cy="25" rx="2" ry="3" fill="' + skinShadow + '"/>' +
        '<ellipse cx="53" cy="25" rx="2" ry="3" fill="' + skinShadow + '"/>' +
        // Bald head — clean scalp with subtle shine
        '<path d="M27 23 Q27 9 40 7 Q53 9 53 23" fill="' + skinHighlight + '" stroke="' + skinTone + '" stroke-width="0.3"/>' +
        // Scalp highlight/shine
        '<ellipse cx="40" cy="12" rx="6" ry="3" fill="' + skinHighlight + '" opacity="0.4"/>' +
        '<ellipse cx="40" cy="11" rx="3" ry="1.5" fill="' + skinHighlight + '" opacity="0.3"/>' +
        // Eyebrows (strong, defined)
        '<path d="M30 19 L36 18" stroke="' + skinShadow + '" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M44 18 L50 19" stroke="' + skinShadow + '" stroke-width="1.2" stroke-linecap="round"/>' +
        // SUNGLASSES — iconic round pince-nez (circle lenses, no ear arms)
        // Left lens (perfect circle)
        '<circle cx="34" cy="23" r="5" fill="#000" stroke="' + glassStroke + '" stroke-width="0.8" stroke-opacity="' + glassOpacity + '"/>' +
        // Right lens (perfect circle)
        '<circle cx="46" cy="23" r="5" fill="#000" stroke="' + glassStroke + '" stroke-width="0.8" stroke-opacity="' + glassOpacity + '"/>' +
        // Bridge (thin wire connecting the circles)
        '<path d="M39 23 Q40 21.5 41 23" stroke="' + glassStroke + '" stroke-width="0.6" stroke-opacity="' + glassOpacity + '" fill="none"/>' +
        // Lens reflections (golden tint when live)
        (isLive ?
          '<circle cx="32.5" cy="22" r="1.5" fill="' + glassColor + '" opacity="0.15"/>' +
          '<circle cx="44.5" cy="22" r="1.5" fill="' + glassColor + '" opacity="0.15"/>' +
          '<path d="M31 21 Q33 22.5 35 21.5" fill="none" stroke="' + glassColor + '" stroke-width="0.4" opacity="0.5"/>' +
          '<path d="M43 21 Q45 22.5 47 21.5" fill="none" stroke="' + glassColor + '" stroke-width="0.4" opacity="0.5"/>'
        : '') +
        // Nose (broad, defined)
        '<path d="M40 26 L38.5 30.5 L41.5 30.5Z" fill="' + skinShadow + '" opacity="0.5"/>' +
        // Goatee / facial hair area
        '<path d="M36 33 Q40 36 44 33" fill="' + skinShadow + '" stroke="none" opacity="0.35"/>' +
        '<rect x="39" y="33" width="2" height="3" rx="0.5" fill="' + skinShadow + '" opacity="0.25"/>' +
        // Mouth (knowing, slight curve — the Morpheus expression)
        '<path d="M36 32.5 Q40 34 44 32.5" fill="none" stroke="#5a3a20" stroke-width="0.8" stroke-linecap="round"/>' +
        // Chin shadow
        '<path d="M34 36 Q40 39 46 36" fill="none" stroke="' + skinShadow + '" stroke-width="0.4" opacity="0.3"/>' +
      '</svg>';
    };

    container.innerHTML = data.agents.map(function(a) {
      var color = AGENT_COLORS[a.id] || '#6b7280';
      var isLive = a.running;
      var modelOpts = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-haiku-4-5'];
      var modelShort = function(m) { return {'claude-opus-4-6':'Opus','claude-sonnet-4-6':'Sonnet','claude-sonnet-4-5':'Sonnet 4.5','claude-haiku-4-5':'Haiku'}[m] || m; };
      var currentModel = a.model || (a.id === 'main' ? 'claude-opus-4-6' : 'claude-sonnet-4-6');
      var modelLabel = modelShort(currentModel);
      var modelSelect = '<div class="model-picker" data-agent="' + a.id + '" onclick="event.stopPropagation();toggleModelPicker(this)" style="text-align:center;margin-top:6px">' +
        '<span class="model-current" style="font-size:10px">' + modelLabel + ' <span style="font-size:8px;opacity:0.5">&#9662;</span></span>' +
        '<div class="model-menu" style="display:none">' +
          modelOpts.map(function(m) { return '<div class="model-opt' + (currentModel === m ? ' model-active' : '') + '" data-model="' + m + '" onclick="pickModel(this)">' + modelShort(m) + '</div>'; }).join('') +
        '</div>' +
      '</div>';
      var botTag = a.botUsername ? '<div class="smith-meta" style="opacity:0.45;font-size:9px;margin-top:2px">@' + a.botUsername + '</div>' : '';
      return '<div class="smith-card' + (isLive ? ' live' : '') + '" data-agent="' + a.id + '" onclick="toggleAgentDetail(this.dataset.agent)">' +
        '<div class="smith-scanline"></div>' +
        '<div class="smith-avatar"><div class="smith-glow"></div>' + (a.id === 'morpheus' || (a.name && a.name.toLowerCase() === 'morpheus') ? morpheusSvg(isLive, color) : (a.id === 'assistant' || a.id === 'trinity' || (a.name && a.name.toLowerCase() === 'trinity') ? trinitySvg(isLive, color) : smithSvg(isLive, color))) + '</div>' +
        '<div class="smith-name" style="color:' + color + ';text-shadow:0 0 10px ' + color + '60">' + a.name + '</div>' +
        '<div class="smith-status ' + (isLive ? 'live' : 'off') + '">' + (isLive ? 'ACTIVE' : 'OFFLINE') + '</div>' +
        botTag +
        modelSelect +
        (isLive ? '<div class="smith-meta">' + a.todayTurns + ' turns today</div>' : '') +
      '</div>';
    }).join('');
  } catch(e) { console.error('loadAgents failed:', e); }
}

// Auto-refresh agent status every 15 seconds
setInterval(loadAgents, 15000);

function toggleModelPicker(el) {
  var menu = el.querySelector('.model-menu');
  var isOpen = menu.style.display !== 'none';
  // Close all other menus first
  document.querySelectorAll('.model-menu').forEach(function(m) { m.style.display = 'none'; });
  menu.style.display = isOpen ? 'none' : '';
}

async function pickModel(optEl) {
  var model = optEl.dataset.model;
  var picker = optEl.closest('.model-picker');
  var agentId = picker.dataset.agent;
  picker.querySelector('.model-menu').style.display = 'none';
  try {
    await fetch(BASE + '/api/agents/' + agentId + '/model?token=' + TOKEN, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: model }),
    });
    await loadAgents();
  } catch(e) { console.error('Model update failed:', e); }
}

async function pickGlobalModel(optEl) {
  var model = optEl.dataset.model;
  optEl.closest('.model-menu').style.display = 'none';
  try {
    await fetch(BASE + '/api/agents/model?token=' + TOKEN, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: model }),
    });
    await loadAgents();
  } catch(e) { console.error('Global model update failed:', e); }
}

// Close model menus when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.model-picker')) {
    document.querySelectorAll('.model-menu').forEach(function(m) { m.style.display = 'none'; });
  }
});

async function toggleAgentDetail(agentId) {
  var overlay = document.getElementById('agent-modal-overlay');
  var modal = document.getElementById('agent-modal');
  var title = document.getElementById('agent-modal-title');
  var body = document.getElementById('agent-modal-body');

  // Find agent info
  var agent = missionAgentsList.find(function(a) { return a.id === agentId; });
  var color = AGENT_COLORS[agentId] || '#6b7280';
  title.innerHTML = '<span style="color:' + color + '">' + (agent ? agent.name : agentId) + '</span>';
  body.innerHTML = '<div class="text-gray-500 text-sm text-center py-8">Loading...</div>';

  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  modal.style.transform = 'translate(-50%,-50%) scale(1)';

  try {
    var results = await Promise.all([
      api('/api/agents/' + agentId + '/tasks'),
      api('/api/hive-mind?agent=' + agentId + '&limit=8'),
      api('/api/agents/' + agentId + '/conversation?chatId=' + CHAT_ID + '&limit=6'),
    ]);
    var tasks = results[0], hive = results[1], convo = results[2];
    var html = '';

    // Last conversation
    if (convo.turns && convo.turns.length > 0) {
      html += '<div class="text-xs text-gray-400 font-semibold mb-2 uppercase">Recent conversation</div>';
      var sorted = convo.turns.slice().reverse();
      html += sorted.map(function(t) {
        var role = t.role === 'user' ? '<span style="color:#34d399">You</span>' : '<span style="color:#6ee7b7">Agent</span>';
        var text = t.content.length > 200 ? t.content.slice(0, 200) + '...' : t.content;
        return '<div style="background:#1a1a1a;border-radius:6px;padding:8px;margin-bottom:4px">' +
          '<div class="text-xs" style="margin-bottom:2px">' + role + '</div>' +
          '<div class="text-xs text-gray-400">' + escapeHtml(text) + '</div></div>';
      }).join('');
    }

    // Hive mind activity
    if (hive.entries && hive.entries.length > 0) {
      html += '<div class="text-xs text-gray-400 font-semibold mt-3 mb-2 uppercase">Hive Mind activity</div>';
      html += hive.entries.map(function(e) {
        var time = new Date(e.created_at * 1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        return '<div style="background:#1a1a1a;border-radius:6px;padding:8px;margin-bottom:4px">' +
          '<span class="text-xs text-gray-500">' + time + '</span> ' +
          '<span class="text-xs text-gray-400">' + escapeHtml(e.summary) + '</span></div>';
      }).join('');
    }

    // Scheduled tasks
    if (tasks.tasks && tasks.tasks.length > 0) {
      html += '<div class="text-xs text-gray-400 font-semibold mt-3 mb-2 uppercase">Scheduled tasks (' + tasks.tasks.length + ')</div>';
      html += tasks.tasks.slice(0, 5).map(function(t) {
        return '<div style="background:#1a1a1a;border-radius:6px;padding:8px;margin-bottom:4px">' +
          '<div class="text-xs text-gray-300">' + escapeHtml(t.prompt.slice(0, 100)) + '</div>' +
          '<div class="text-xs text-gray-600 mt-1">' + t.schedule + '</div></div>';
      }).join('');
    }

    // Agent management controls (not for main)
    if (agentId !== 'main') {
      html += '<div class="flex gap-2 mt-4 pt-3" style="border-top:1px solid #2a2a2a">';
      if (agent && agent.running) {
        html += '<button data-agent="' + agentId + '" data-act="stop" onclick="agentModalAction(this.dataset.agent,this.dataset.act)" style="flex:1;background:#1a1a1a;color:#f87171;border:1px solid #7f1d1d;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer">Stop</button>';
      } else {
        html += '<button data-agent="' + agentId + '" data-act="start" onclick="agentModalAction(this.dataset.agent,this.dataset.act)" style="flex:1;background:#064e3b;color:#6ee7b7;border:1px solid #065f46;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer">Start</button>';
      }
      html += '<button data-agent="' + agentId + '" data-act="delete" onclick="agentModalAction(this.dataset.agent,this.dataset.act)" style="background:#1a1a1a;color:#6b7280;border:1px solid #2a2a2a;border-radius:8px;padding:8px 14px;font-size:12px;cursor:pointer">Delete</button>';
      html += '</div>';
      html += '<div id="agent-action-status" class="text-xs text-center mt-2" style="min-height:16px"></div>';
    }

    if (!html) html = '<div class="text-gray-500 text-sm text-center py-8">No activity yet for this agent.</div>';
    body.innerHTML = html;
  } catch(e) { body.innerHTML = '<div class="text-red-400 text-sm text-center py-8">Failed to load agent details</div>'; }
}

async function agentModalAction(agentId, action) {
  var status = document.getElementById('agent-action-status');
  if (!status) return;

  if (action === 'delete') {
    if (!confirm('Delete agent "' + agentId + '"? This removes all config, the service, and the bot token from .env.')) return;
    status.innerHTML = '<span style="color:#fbbf24">Deleting...</span>';
    try {
      var res = await fetch(BASE + '/api/agents/' + agentId + '/full?token=' + TOKEN, { method: 'DELETE' });
      var data = await res.json();
      if (data.ok) {
        status.innerHTML = '<span style="color:#6ee7b7">Deleted</span>';
        setTimeout(function() { closeAgentModal(); loadAgents(); loadMissionControl(); }, 800);
      } else {
        status.innerHTML = '<span style="color:#f87171">' + escapeHtml(data.error || 'Delete failed') + '</span>';
      }
    } catch(e) { status.innerHTML = '<span style="color:#f87171">Network error</span>'; }
    return;
  }

  if (action === 'stop') {
    status.innerHTML = '<span style="color:#fbbf24">Stopping...</span>';
    try {
      await fetch(BASE + '/api/agents/' + agentId + '/deactivate?token=' + TOKEN, { method: 'POST' });
      status.innerHTML = '<span style="color:#6ee7b7">Stopped</span>';
      setTimeout(function() { closeAgentModal(); loadAgents(); }, 800);
    } catch(e) { status.innerHTML = '<span style="color:#f87171">Failed</span>'; }
    return;
  }

  if (action === 'start') {
    status.innerHTML = '<span style="color:#fbbf24">Starting...</span>';
    try {
      var res = await fetch(BASE + '/api/agents/' + agentId + '/activate?token=' + TOKEN, { method: 'POST' });
      var data = await res.json();
      if (data.ok) {
        status.innerHTML = '<span style="color:#6ee7b7">Started' + (data.pid ? ' (PID ' + data.pid + ')' : '') + '</span>';
        setTimeout(function() { closeAgentModal(); loadAgents(); }, 800);
      } else {
        status.innerHTML = '<span style="color:#f87171">' + escapeHtml(data.error || 'Start failed') + '</span>';
      }
    } catch(e) { status.innerHTML = '<span style="color:#f87171">Network error</span>'; }
  }
}

function closeAgentModal() {
  var overlay = document.getElementById('agent-modal-overlay');
  var modal = document.getElementById('agent-modal');
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
  modal.style.transform = 'translate(-50%,-50%) scale(0.95)';
}
document.getElementById('agent-modal-overlay').addEventListener('click', closeAgentModal);

// ── Create Agent Wizard ──────────────────────────────────────────────

let cawStep = 1;
let cawIdValid = false;
let cawTokenValid = false;
let cawBotInfo = null;
let cawCreatedId = null;
let cawIdDebounce = null;
let cawTokenDebounce = null;
let cawNameManuallyEdited = false;

function openCreateAgentWizard() {
  cawStep = 1;
  cawIdValid = false;
  cawTokenValid = false;
  cawBotInfo = null;
  cawCreatedId = null;
  cawNameManuallyEdited = false;
  document.getElementById('caw-id').value = '';
  document.getElementById('caw-name').value = '';
  document.getElementById('caw-desc').value = '';
  document.getElementById('caw-model').value = 'claude-sonnet-4-6';
  document.getElementById('caw-token').value = '';
  document.getElementById('caw-id-status').innerHTML = '';
  document.getElementById('caw-token-status').innerHTML = '';
  document.getElementById('caw-token-info').innerHTML = '';
  document.getElementById('caw-step1-error').style.display = 'none';
  document.getElementById('caw-step2-error').style.display = 'none';
  cawShowStep(1);
  loadCawTemplates();
  var o = document.getElementById('create-agent-overlay');
  var m = document.getElementById('create-agent-modal');
  o.style.opacity = '1'; o.style.pointerEvents = 'auto';
  m.style.opacity = '1'; m.style.pointerEvents = 'auto';
  m.style.transform = 'translate(-50%,-50%) scale(1)';
  setTimeout(function() { document.getElementById('caw-id').focus(); }, 200);
}

function closeCreateAgentWizard() {
  var o = document.getElementById('create-agent-overlay');
  var m = document.getElementById('create-agent-modal');
  o.style.opacity = '0'; o.style.pointerEvents = 'none';
  m.style.opacity = '0'; m.style.pointerEvents = 'none';
  m.style.transform = 'translate(-50%,-50%) scale(0.95)';
}
document.getElementById('create-agent-overlay').addEventListener('click', closeCreateAgentWizard);

function cawShowStep(n) {
  cawStep = n;
  document.getElementById('caw-step-1').style.display = n === 1 ? '' : 'none';
  document.getElementById('caw-step-2').style.display = n === 2 ? '' : 'none';
  document.getElementById('caw-step-3').style.display = n === 3 ? '' : 'none';
  for (var i = 1; i <= 3; i++) {
    document.getElementById('caw-step-' + i + '-dot').style.background = i <= n ? '#014421' : '#2a2a2a';
  }
  var titles = { 1: 'New Agent', 2: 'Connect Telegram', 3: 'Agent Created' };
  document.getElementById('create-agent-title').textContent = titles[n] || 'New Agent';
}

async function loadCawTemplates() {
  try {
    var data = await api('/api/agents/templates');
    var sel = document.getElementById('caw-template');
    sel.innerHTML = '';
    (data.templates || []).forEach(function(t) {
      var opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name + (t.id === '_template' ? '' : ' - ' + t.description.slice(0, 40));
      sel.appendChild(opt);
    });
  } catch(e) { console.error('Templates load error:', e); }
}

function cawIdChanged() {
  var id = document.getElementById('caw-id').value.trim().toLowerCase();
  document.getElementById('caw-id').value = id;
  var status = document.getElementById('caw-id-status');
  cawIdValid = false;

  if (!id) { status.innerHTML = ''; return; }

  // Auto-fill name from ID unless user has manually typed a name
  if (!cawNameManuallyEdited) {
    var nameInput = document.getElementById('caw-name');
    nameInput.value = id.replace(/[-_]/g, ' ').replace(/\\b\\w/g, function(c) { return c.toUpperCase(); });
  }

  clearTimeout(cawIdDebounce);
  status.innerHTML = '<span style="color:#6b7280">Checking...</span>';
  cawIdDebounce = setTimeout(async function() {
    try {
      var data = await api('/api/agents/validate-id?id=' + encodeURIComponent(id));
      if (data.ok) {
        cawIdValid = true;
        status.innerHTML = '<span style="color:#6ee7b7">Available</span>';
      } else {
        status.innerHTML = '<span style="color:#f87171">' + escapeHtml(data.error) + '</span>';
      }
    } catch(e) {
      status.innerHTML = '<span style="color:#f87171">Validation error</span>';
    }
  }, 400);
}

function cawGoStep1() { cawShowStep(1); }

function cawGoStep2() {
  var id = document.getElementById('caw-id').value.trim();
  var name = document.getElementById('caw-name').value.trim();
  var desc = document.getElementById('caw-desc').value.trim();
  var errEl = document.getElementById('caw-step1-error');

  if (!id) { errEl.textContent = 'Agent ID is required'; errEl.style.display = ''; return; }
  if (!cawIdValid) { errEl.textContent = 'Agent ID is not valid or already taken'; errEl.style.display = ''; return; }
  if (!name) { errEl.textContent = 'Display name is required'; errEl.style.display = ''; return; }
  if (!desc) { errEl.textContent = 'Description is required'; errEl.style.display = ''; return; }

  errEl.style.display = 'none';

  // Set suggested bot names
  var label = id.replace(/[-_]/g, ' ').replace(/\\b\\w/g, function(c) { return c.toUpperCase(); });
  document.getElementById('caw-suggested-name').textContent = 'LinkOS ' + label;
  document.getElementById('caw-suggested-username').textContent = 'linkos_' + id.replace(/-/g, '_') + '_bot';

  // Reset token state
  cawTokenValid = false;
  cawBotInfo = null;
  document.getElementById('caw-token').value = '';
  document.getElementById('caw-token-status').innerHTML = '';
  document.getElementById('caw-token-info').innerHTML = '';
  var btn = document.getElementById('caw-create-btn');
  btn.style.opacity = '0.5';
  btn.style.pointerEvents = 'none';

  cawShowStep(2);
  setTimeout(function() { document.getElementById('caw-token').focus(); }, 200);
}

function cawTokenChanged() {
  var token = document.getElementById('caw-token').value.trim();
  var status = document.getElementById('caw-token-status');
  var info = document.getElementById('caw-token-info');
  var btn = document.getElementById('caw-create-btn');
  cawTokenValid = false;
  cawBotInfo = null;
  btn.style.opacity = '0.5';
  btn.style.pointerEvents = 'none';

  if (!token || !token.includes(':')) {
    status.innerHTML = '';
    info.innerHTML = '';
    return;
  }

  clearTimeout(cawTokenDebounce);
  status.innerHTML = '<span style="color:#fbbf24">...</span>';
  info.innerHTML = '';

  cawTokenDebounce = setTimeout(async function() {
    try {
      var data = await fetch(BASE + '/api/agents/validate-token?token=' + TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token }),
      }).then(function(r) { return r.json(); });

      if (data.ok && data.botInfo) {
        cawTokenValid = true;
        cawBotInfo = data.botInfo;
        status.innerHTML = '<span style="color:#6ee7b7">&#10003;</span>';
        info.innerHTML = '<span style="color:#6ee7b7">Verified: @' + escapeHtml(data.botInfo.username) + '</span>';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        status.innerHTML = '<span style="color:#f87171">&#10007;</span>';
        info.innerHTML = '<span style="color:#f87171">' + escapeHtml(data.error || 'Invalid token') + '</span>';
      }
    } catch(e) {
      status.innerHTML = '<span style="color:#f87171">!</span>';
      info.innerHTML = '<span style="color:#f87171">Could not validate</span>';
    }
  }, 600);
}

async function cawCreate() {
  if (!cawTokenValid) return;

  var btn = document.getElementById('caw-create-btn');
  var errEl = document.getElementById('caw-step2-error');
  btn.textContent = 'Creating...';
  btn.style.pointerEvents = 'none';
  errEl.style.display = 'none';

  try {
    var res = await fetch(BASE + '/api/agents/create?token=' + TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: document.getElementById('caw-id').value.trim(),
        name: document.getElementById('caw-name').value.trim(),
        description: document.getElementById('caw-desc').value.trim(),
        model: document.getElementById('caw-model').value,
        template: document.getElementById('caw-template').value,
        botToken: document.getElementById('caw-token').value.trim(),
      }),
    });
    var data = await res.json();
    if (!res.ok || data.error) {
      errEl.textContent = data.error || 'Failed to create agent';
      errEl.style.display = '';
      btn.textContent = 'Create Agent';
      btn.style.pointerEvents = 'auto';
      return;
    }

    cawCreatedId = data.agentId;

    // Build summary
    var summary = '<div style="margin-bottom:6px"><span style="color:#6b7280">Agent ID:</span> <span class="text-white">' + escapeHtml(data.agentId) + '</span></div>' +
      '<div style="margin-bottom:6px"><span style="color:#6b7280">Bot:</span> <span style="color:#6ee7b7">@' + escapeHtml(data.botInfo.username) + '</span></div>' +
      '<div style="margin-bottom:6px"><span style="color:#6b7280">Directory:</span> <span style="color:#9ca3af;font-size:11px">' + escapeHtml(data.agentDir) + '</span></div>' +
      '<div><span style="color:#6b7280">Token stored as:</span> <span style="color:#9ca3af">' + escapeHtml(data.envKey) + '</span></div>';
    document.getElementById('caw-summary').innerHTML = summary;

    // Reset activate section
    var actBtn = document.getElementById('caw-activate-btn');
    actBtn.textContent = 'Activate (install service + start)';
    actBtn.style.opacity = '1';
    actBtn.style.pointerEvents = 'auto';
    actBtn.style.background = '#064e3b';
    actBtn.style.color = '#6ee7b7';
    actBtn.style.borderColor = '#065f46';
    document.getElementById('caw-activate-status').innerHTML = '';

    cawShowStep(3);
  } catch(e) {
    errEl.textContent = 'Network error';
    errEl.style.display = '';
    btn.textContent = 'Create Agent';
    btn.style.pointerEvents = 'auto';
  }
}

async function cawActivate() {
  if (!cawCreatedId) return;
  var btn = document.getElementById('caw-activate-btn');
  var status = document.getElementById('caw-activate-status');
  btn.textContent = 'Starting...';
  btn.style.pointerEvents = 'none';
  status.innerHTML = '<span style="color:#fbbf24">Installing service and starting agent...</span>';

  try {
    var res = await fetch(BASE + '/api/agents/' + cawCreatedId + '/activate?token=' + TOKEN, { method: 'POST' });
    var data = await res.json();
    if (data.ok) {
      btn.textContent = 'Running';
      btn.style.background = '#064e3b';
      btn.style.color = '#6ee7b7';
      status.innerHTML = '<span style="color:#6ee7b7">Agent is live' + (data.pid ? ' (PID ' + data.pid + ')' : '') + '. Send it a message in Telegram!</span>';
      // Refresh agents list in the background (agent needs a few seconds to connect to Telegram)
      setTimeout(loadAgents, 3000);
      setTimeout(loadAgents, 8000);
    } else {
      btn.textContent = 'Retry Activation';
      btn.style.pointerEvents = 'auto';
      status.innerHTML = '<span style="color:#f87171">' + escapeHtml(data.error || 'Activation failed') + '</span>';
    }
  } catch(e) {
    btn.textContent = 'Retry Activation';
    btn.style.pointerEvents = 'auto';
    status.innerHTML = '<span style="color:#f87171">Network error</span>';
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    // Brief visual feedback
    var el = event.target;
    var orig = el.style.color;
    el.style.color = '#6ee7b7';
    setTimeout(function() { el.style.color = orig; }, 800);
  }).catch(function() {});
}

async function loadHiveMind() {
  try {
    const data = await api('/api/hive-mind?limit=15');
    const section = document.getElementById('hive-section');
    const container = document.getElementById('hive-container');
    if (!data.entries || data.entries.length === 0) { section.style.display = 'none'; return; }
    section.style.display = '';
    const blurState = JSON.parse(localStorage.getItem('privacyBlur_hive') || '{}');
    const allRevealed = localStorage.getItem('privacyBlur_hive_all') === 'revealed';
    const rows = data.entries.map((e, i) => {
      const time = new Date(e.created_at * 1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      const color = AGENT_COLORS[e.agent_id] || '#6b7280';
      const isBlurred = allRevealed ? false : (blurState[i] !== false);
      const blurClass = isBlurred ? 'privacy-blur' : '';
      return '<tr>' +
        '<td class="col-time">' + time + '</td>' +
        '<td class="col-agent" style="color:' + color + '">' + ((missionAgentsList.find(function(a){return a.id===e.agent_id}) || {}).name || e.agent_id) + '</td>' +
        '<td class="col-action">' + escapeHtml(e.action) + '</td>' +
        '<td><div class="col-summary ' + blurClass + '" data-section="hive" data-idx="' + i + '" onclick="toggleItemBlur(this)">' + escapeHtml(e.summary) + '</div></td>' +
      '</tr>';
    }).join('');
    container.innerHTML = '<table class="hive-table"><thead><tr><th class="col-time">Time</th><th class="col-agent">Agent</th><th class="col-action">Action</th><th>Summary</th></tr></thead><tbody>' + rows + '</tbody></table>';
  } catch {}
}

// ── Privacy Blur ──────────────────────────────────────────────────────
function toggleItemBlur(el) {
  const section = el.dataset.section;
  const idx = el.dataset.idx;
  const key = 'privacyBlur_' + section;
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  const isCurrentlyBlurred = el.classList.contains('privacy-blur');
  if (isCurrentlyBlurred) {
    el.classList.remove('privacy-blur');
    state[idx] = false;
  } else {
    el.classList.add('privacy-blur');
    delete state[idx];
  }
  localStorage.setItem(key, JSON.stringify(state));
  // Clear the "all" override when individual items are toggled
  localStorage.removeItem('privacyBlur_' + section + '_all');
}

function toggleSectionBlur(section) {
  const selector = section === 'hive' ? '#hive-container .col-summary' : '#tasks-container .task-prompt';
  const items = document.querySelectorAll(selector);
  if (items.length === 0) return;
  // Check if majority are blurred to decide direction
  let blurredCount = 0;
  items.forEach(el => { if (el.classList.contains('privacy-blur')) blurredCount++; });
  const shouldReveal = blurredCount > 0;
  const key = 'privacyBlur_' + section;
  const state = {};
  items.forEach(el => {
    if (shouldReveal) {
      el.classList.remove('privacy-blur');
      state[el.dataset.idx] = false;
    } else {
      el.classList.add('privacy-blur');
    }
  });
  localStorage.setItem(key, JSON.stringify(shouldReveal ? state : {}));
  localStorage.setItem('privacyBlur_' + section + '_all', shouldReveal ? 'revealed' : 'blurred');
}

async function loadSummary() {
  try {
    const [tokens, agents, mems] = await Promise.all([
      api('/api/tokens?chatId=' + CHAT_ID),
      api('/api/agents'),
      api('/api/memories?chatId=' + CHAT_ID),
    ]);
    const bar = document.getElementById('summary-bar');
    bar.style.display = '';
    document.getElementById('sum-messages').textContent = tokens.stats.todayTurns || '0';
    const activeCount = agents.agents ? agents.agents.filter(a => a.running).length : 0;
    document.getElementById('sum-agents').textContent = activeCount + '/' + (agents.agents ? agents.agents.length : 0);
    var totalTokens = (tokens.stats.todayInput || 0) + (tokens.stats.todayOutput || 0);
    document.getElementById('sum-cost').textContent = totalTokens > 1000 ? Math.round(totalTokens / 1000) + 'k' : totalTokens.toString();
    document.getElementById('sum-memories').textContent = mems.stats.total || '0';
  } catch {}
}

// ── Mission Control ──────────────────────────────────────────────────

let missionAgentsList = [];

async function loadMissionControl() {
  try {
    const [taskData, agentData, activityData] = await Promise.all([
      api('/api/mission/tasks'),
      api('/api/agents'),
      api('/api/agents/activity'),
    ]);
    const tasks = taskData.tasks || [];
    missionAgentsList = agentData.agents || [];
    const agentActivity = activityData.activity || {};

    // Split: unassigned go to inbox, assigned go to agent columns
    const unassigned = tasks.filter(t => !t.assigned_agent && t.status === 'queued');
    const now = Math.floor(Date.now() / 1000);
    const DONE_VISIBLE_SECS = 30 * 60;
    const assigned = tasks.filter(t => {
      if (!t.assigned_agent) return false;
      if (t.status === 'completed' || t.status === 'failed' || t.status === 'cancelled') {
        return t.completed_at && (now - t.completed_at) < DONE_VISIBLE_SECS;
      }
      return true;
    });

    // Tasks Inbox
    const inboxSection = document.getElementById('tasks-inbox-section');
    const inboxEl = document.getElementById('tasks-inbox');
    const autoAllBtn = document.getElementById('auto-assign-all-btn');
    inboxSection.style.display = '';
    autoAllBtn.style.display = unassigned.length > 0 ? '' : 'none';
    if (unassigned.length > 0) {
      inboxEl.innerHTML = unassigned.map(renderInboxCard).join('');
    } else {
      inboxEl.innerHTML = '<div class="text-xs text-gray-600 py-2">No unassigned tasks. Click + New to create one.</div>';
    }

    // Always show Mission Control with agent activity
    document.getElementById('mission-section').style.display = '';
    const board = document.getElementById('mission-board');
    const agentIds = missionAgentsList.map(a => a.id);
    const cols = {};
    agentIds.forEach(id => { cols[id] = []; });
    assigned.forEach(t => {
      if (cols[t.assigned_agent]) cols[t.assigned_agent].push(t);
    });

    let html = '';
    agentIds.forEach(id => {
      const agent = missionAgentsList.find(a => a.id === id);
      const color = AGENT_COLORS[id] || '#6b7280';
      const displayName = id === 'main' ? 'Link' : (agent ? agent.name : id);
      const dot = agent && agent.running
        ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-right:4px"></span>'
        : '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;border:1px solid #555;margin-right:4px"></span>';
      const agentTasks = cols[id] || [];
      const activity = agentActivity[id] || [];

      // Build column content: active mission tasks first, then recent activity
      var colContent = '';

      // Active mission tasks (queued/running)
      if (agentTasks.length) {
        colContent += agentTasks.map(renderMissionCard).join('');
      }

      // Recent activity feed (compressed summaries)
      if (activity.length > 0) {
        colContent += '<div style="margin-top:' + (agentTasks.length ? '8' : '0') + 'px">';
        var shown = 0;
        activity.forEach(function(item) {
          if (shown >= 10) return;
          if (item.type === 'mission') {
            var statusIcon = item.status === 'completed' ? '\\u2705' : item.status === 'failed' ? '\\u274c' : item.status === 'running' ? '\\u26a1' : '\\u23f3';
            var titleText = escapeHtml(item.title || 'Untitled');
            colContent += '<div style="padding:4px 6px;border-bottom:1px solid #1a1a1a;font-size:11px">' +
              '<div style="display:flex;align-items:center;gap:4px">' +
              '<span>' + statusIcon + '</span>' +
              '<span style="color:#d1d5db;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + titleText + '</span>' +
              '<span style="color:#4b5563;font-size:10px;white-space:nowrap">' + elapsed(item.created_at) + '</span>' +
              '</div></div>';
            shown++;
          } else if (item.type === 'summary') {
            var actionLabel = escapeHtml(item.action || '');
            var summaryText = escapeHtml((item.summary || '').substring(0, 80));
            colContent += '<div style="padding:4px 6px;border-bottom:1px solid #1a1a1a;font-size:11px">' +
              '<div style="display:flex;align-items:center;gap:4px">' +
              '<span style="color:#6b7280;font-size:10px;text-transform:uppercase;flex-shrink:0">' + actionLabel + '</span>' +
              '<span style="color:#9ca3af;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + summaryText + '</span>' +
              '<span style="color:#4b5563;font-size:10px;white-space:nowrap">' + elapsed(item.created_at) + '</span>' +
              '</div></div>';
            shown++;
          } else if (item.type === 'stats') {
            colContent += '<div style="padding:6px;font-size:11px;color:#6b7280;text-align:center">' +
              item.msg_count + ' messages handled \\u00b7 last active ' + elapsed(item.last_active) +
              '</div>';
            shown++;
          }
        });
        colContent += '</div>';
      }

      if (!colContent) colContent = '<div class="text-xs text-gray-600 text-center py-4">No activity</div>';

      html += '<div class="flex-shrink-0" style="min-width:220px;scroll-snap-align:start;">' +
        '<div class="text-xs font-semibold mb-1 uppercase" style="color:' + color + '">' + dot + displayName + '</div>' +
        '<div data-drop-agent="' + id + '" ondragover="missionDragOver(event)" ondragleave="missionDragLeave(event)" ondrop="missionDrop(event)" style="border:1px solid #2a2a2a;border-radius:10px;padding:8px;min-height:120px;max-height:350px;overflow-y:auto;background:#141414;transition:border-color 0.2s,background 0.2s">' +
        colContent +
        '</div></div>';
    });

    board.innerHTML = html;
  } catch(e) {
    console.error('Mission load error:', e);
  }
}

function renderInboxCard(t) {
  const priorityDot = t.priority >= 8 ? '#ef4444' : t.priority >= 4 ? '#fbbf24' : '#6b7280';
  const timeAgo = elapsed(t.created_at);
  return '<div data-mid="' + t.id + '" draggable="true" ondragstart="missionDragStart(event)" ondragend="missionDragEnd(event)" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:12px;min-width:200px;max-width:280px;cursor:grab;transition:opacity 0.15s">' +
    '<div class="flex items-center justify-between mb-2">' +
      '<span class="text-sm font-semibold text-white" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHtml(t.title) + '</span>' +
      '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + priorityDot + ';margin-left:6px;flex-shrink:0"></span>' +
    '</div>' +
    '<div class="text-xs text-gray-500 mb-2" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHtml(t.prompt.slice(0, 60)) + '</div>' +
    '<div class="flex items-center justify-between">' +
      '<button data-mid="' + t.id + '" onclick="autoAssignOne(this.dataset.mid)" style="background:#1e1b4b;color:#a78bfa;border:1px solid #312e81;border-radius:6px;padding:2px 10px;font-size:11px;cursor:pointer">Auto-assign</button>' +
      '<div class="flex items-center gap-1">' +
        '<button data-mid="' + t.id + '" data-mact="cancel" onclick="missionAction(this.dataset.mid,this.dataset.mact)" title="Remove" style="background:none;border:none;cursor:pointer;color:#6b7280;font-size:12px">&times;</button>' +
        '<span class="text-xs text-gray-600">' + timeAgo + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderMissionCard(t) {
  const color = AGENT_COLORS[t.assigned_agent] || '#6b7280';
  const priorityDot = t.priority >= 8 ? '#ef4444' : t.priority >= 4 ? '#fbbf24' : '#6b7280';
  const statusMap = {
    queued: '<span class="pill pill-paused">queued</span>',
    running: '<span class="pill pill-running">running</span>',
    completed: '<span class="pill pill-active">done</span>',
    failed: '<span class="pill" style="background:#7f1d1d;color:#f87171">failed</span>',
    cancelled: '<span class="pill" style="background:#374151;color:#9ca3af">cancelled</span>',
  };
  const statusPill = statusMap[t.status] || '<span class="pill">' + t.status + '</span>';
  const agentName = (missionAgentsList.find(function(a){return a.id===t.assigned_agent}) || {}).name || t.assigned_agent;
  const agentBadge = t.status === 'queued' ? '<span class="text-xs" style="color:' + color + '">@' + agentName + '</span>' : '';
  const timeAgo = elapsed(t.created_at);
  let durationStr = '';
  if (t.completed_at && t.started_at) {
    const dur = t.completed_at - t.started_at;
    durationStr = dur < 60 ? ' in ' + dur + 's' : ' in ' + Math.floor(dur/60) + 'm ' + (dur%60) + 's';
  }

  let resultHtml = '';
  if (t.status === 'completed' && t.result) {
    resultHtml = '<details class="mt-2"><summary class="text-xs text-gray-500 cursor-pointer">View result' + durationStr + '</summary><pre class="text-xs text-gray-400 mt-1 whitespace-pre-wrap break-words" style="max-height:200px;overflow-y:auto">' + escapeHtml(t.result.slice(0, 2000)) + (t.result.length > 2000 ? '...' : '') + '</pre></details>';
  } else if (t.status === 'failed' && t.error) {
    resultHtml = '<div class="text-xs text-red-400 mt-1">' + escapeHtml(t.error.slice(0, 200)) + '</div>';
  }

  const cancelBtn = (t.status === 'queued' || t.status === 'running')
    ? '<button data-mid="' + t.id + '" data-mact="cancel" onclick="missionAction(this.dataset.mid,this.dataset.mact)" title="Cancel" style="background:none;border:none;cursor:pointer;color:#f87171;font-size:12px;padding:1px 3px">&times;</button>'
    : '';
  const deleteBtn = (t.status === 'completed' || t.status === 'cancelled' || t.status === 'failed')
    ? '<button data-mid="' + t.id + '" data-mact="delete" onclick="missionAction(this.dataset.mid,this.dataset.mact)" title="Remove" style="background:none;border:none;cursor:pointer;color:#6b7280;font-size:12px;padding:1px 3px">&times;</button>'
    : '';

  const draggable = t.status === 'queued' ? ' draggable="true" ondragstart="missionDragStart(event)" ondragend="missionDragEnd(event)"' : '';
  const grabStyle = t.status === 'queued' ? 'cursor:grab;' : '';
  return '<div data-mid="' + t.id + '"' + draggable + ' style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px;margin-bottom:8px;' + grabStyle + 'transition:opacity 0.15s">' +
    '<div class="flex items-center justify-between mb-1">' +
      '<span class="text-xs font-semibold text-white" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHtml(t.title) + '</span>' +
      '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + priorityDot + ';margin-left:6px;flex-shrink:0" title="Priority: ' + t.priority + '"></span>' +
    '</div>' +
    '<div class="flex items-center justify-between">' +
      '<div class="flex items-center gap-2">' + statusPill + agentBadge + '</div>' +
      '<div class="flex items-center gap-1">' + cancelBtn + deleteBtn + '<span class="text-xs text-gray-600">' + timeAgo + '</span></div>' +
    '</div>' +
    resultHtml +
  '</div>';
}

async function missionAction(id, action) {
  try {
    if (action === 'cancel') {
      await fetch(BASE + '/api/mission/tasks/' + id + '/cancel?token=' + TOKEN, { method: 'POST' });
    } else if (action === 'delete') {
      await fetch(BASE + '/api/mission/tasks/' + id + '?token=' + TOKEN, { method: 'DELETE' });
    }
    await loadMissionControl();
  } catch(e) { console.error('Mission action failed:', e); }
}

// ── Drag & Drop ──────────────────────────────────────────────────────

var missionDragId = null;

function missionDragStart(e) {
  missionDragId = e.currentTarget.dataset.mid;
  e.currentTarget.style.opacity = '0.4';
  e.dataTransfer.effectAllowed = 'move';
}

function missionDragEnd(e) {
  e.currentTarget.style.opacity = '1';
  missionDragId = null;
  document.querySelectorAll('[data-drop-agent]').forEach(function(el) {
    el.style.borderColor = '#2a2a2a';
    el.style.background = '#141414';
  });
}

function missionDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  var col = e.currentTarget.closest('[data-drop-agent]');
  if (col) {
    col.style.borderColor = '#014421';
    col.style.background = 'rgba(1,68,33,0.08)';
  }
}

function missionDragLeave(e) {
  var col = e.currentTarget.closest('[data-drop-agent]');
  if (col && !col.contains(e.relatedTarget)) {
    col.style.borderColor = '#2a2a2a';
    col.style.background = '#141414';
  }
}

async function missionDrop(e) {
  e.preventDefault();
  var col = e.currentTarget.closest('[data-drop-agent]');
  if (col) {
    col.style.borderColor = '#2a2a2a';
    col.style.background = '#141414';
  }
  if (!missionDragId || !col) return;
  var newAgent = col.dataset.dropAgent;
  try {
    await fetch(BASE + '/api/mission/tasks/' + missionDragId + '?token=' + TOKEN, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_agent: newAgent }),
    });
    await loadMissionControl();
  } catch(err) { console.error('Reassign failed:', err); }
  missionDragId = null;
}

async function autoAssignOne(id) {
  try {
    const res = await fetch(BASE + '/api/mission/tasks/' + id + '/auto-assign?token=' + TOKEN, { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      await loadMissionControl();
    } else {
      console.error('Auto-assign failed:', data.error);
    }
  } catch(e) { console.error('Auto-assign error:', e); }
}

async function autoAssignAll() {
  var btn = document.getElementById('auto-assign-all-btn');
  btn.textContent = 'Assigning...';
  btn.disabled = true;
  try {
    const res = await fetch(BASE + '/api/mission/tasks/auto-assign-all?token=' + TOKEN, { method: 'POST' });
    const data = await res.json();
    await loadMissionControl();
  } catch(e) { console.error('Auto-assign all error:', e); }
  btn.textContent = 'Auto-assign All';
  btn.disabled = false;
}

function openMissionModal() {
  document.getElementById('mission-error').style.display = 'none';
  document.getElementById('mission-overlay').style.opacity = '1';
  document.getElementById('mission-overlay').style.pointerEvents = 'auto';
  var m = document.getElementById('mission-modal');
  m.style.opacity = '1';
  m.style.pointerEvents = 'auto';
  m.style.transform = 'translate(-50%,-50%) scale(1)';
  setTimeout(function() { document.getElementById('mission-title').focus(); }, 200);
}

function closeMissionModal() {
  document.getElementById('mission-overlay').style.opacity = '0';
  document.getElementById('mission-overlay').style.pointerEvents = 'none';
  var m = document.getElementById('mission-modal');
  m.style.opacity = '0';
  m.style.pointerEvents = 'none';
  m.style.transform = 'translate(-50%,-50%) scale(0.95)';
  document.getElementById('mission-title').value = '';
  document.getElementById('mission-prompt').value = '';
  document.getElementById('mission-priority').value = '5';
  document.getElementById('mission-error').style.display = 'none';
}
document.getElementById('mission-overlay').addEventListener('click', closeMissionModal);

async function createMissionTask() {
  const title = document.getElementById('mission-title').value.trim();
  const prompt = document.getElementById('mission-prompt').value.trim();
  const priority = parseInt(document.getElementById('mission-priority').value, 10);
  const errEl = document.getElementById('mission-error');

  if (!title) { errEl.textContent = 'Title is required'; errEl.style.display = ''; return; }
  if (!prompt) { errEl.textContent = 'Prompt is required'; errEl.style.display = ''; return; }

  try {
    const res = await fetch(BASE + '/api/mission/tasks?token=' + TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, prompt: prompt, priority: priority }),
    });
    if (!res.ok) {
      const data = await res.json();
      errEl.textContent = data.error || 'Failed to create task';
      errEl.style.display = '';
      return;
    }
    closeMissionModal();
    await loadMissionControl();
  } catch(e) {
    errEl.textContent = 'Network error';
    errEl.style.display = '';
  }
}

// ── Task History Drawer ──────────────────────────────────────────────

var historyOffset = 0;
var historyTotal = 0;
var HISTORY_PAGE = 20;

async function openTaskHistory() {
  historyOffset = 0;
  document.getElementById('history-body').innerHTML = '<div class="text-gray-500 text-sm text-center py-8">Loading...</div>';
  document.getElementById('history-overlay').classList.add('open');
  document.getElementById('history-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  await loadHistoryPage();
}

async function loadHistoryPage() {
  var data = await api('/api/mission/history?limit=' + HISTORY_PAGE + '&offset=' + historyOffset);
  historyTotal = data.total;
  document.getElementById('history-count').textContent = historyTotal + ' completed task' + (historyTotal === 1 ? '' : 's');
  var body = document.getElementById('history-body');
  if (historyOffset === 0) body.innerHTML = '';
  if (data.tasks.length === 0 && historyOffset === 0) {
    body.innerHTML = '<div class="text-gray-500 text-sm text-center py-8">No task history yet.</div>';
  } else {
    body.innerHTML += data.tasks.map(function(t) {
      var color = AGENT_COLORS[t.assigned_agent] || '#6b7280';
      var statusCls = t.status === 'completed' ? 'pill-active' : t.status === 'failed' ? '' : '';
      var statusStyle = t.status === 'failed' ? 'background:#7f1d1d;color:#f87171' : t.status === 'cancelled' ? 'background:#374151;color:#9ca3af' : '';
      var dur = '';
      if (t.completed_at && t.started_at) {
        var d = t.completed_at - t.started_at;
        dur = d < 60 ? d + 's' : Math.floor(d/60) + 'm ' + (d%60) + 's';
      }
      var date = new Date(t.completed_at * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      var time = new Date(t.completed_at * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      var resultHtml = t.result ? '<details class="mt-2"><summary class="text-xs text-gray-500 cursor-pointer">View result</summary><pre class="text-xs text-gray-400 mt-1 whitespace-pre-wrap break-words" style="max-height:200px;overflow-y:auto">' + escapeHtml(t.result.slice(0, 2000)) + '</pre></details>' : '';
      var errorHtml = t.error ? '<div class="text-xs text-red-400 mt-1">' + escapeHtml(t.error.slice(0, 200)) + '</div>' : '';
      return '<div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:12px;margin-bottom:8px">' +
        '<div class="flex items-center justify-between mb-1">' +
          '<span class="text-sm font-semibold text-white">' + escapeHtml(t.title) + '</span>' +
          '<span class="pill ' + statusCls + '" style="' + statusStyle + '">' + t.status + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-2 text-xs text-gray-500">' +
          '<span style="color:' + color + '">@' + ((missionAgentsList.find(function(a){return a.id===t.assigned_agent}) || {}).name || t.assigned_agent || 'unassigned') + '</span>' +
          '<span>' + date + ' ' + time + '</span>' +
          (dur ? '<span>' + dur + '</span>' : '') +
        '</div>' +
        resultHtml + errorHtml +
      '</div>';
    }).join('');
  }
  historyOffset += data.tasks.length;
  var btn = document.getElementById('history-load-more');
  if (historyOffset < historyTotal) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

async function loadMoreHistory() { await loadHistoryPage(); }

function closeTaskHistory() {
  document.getElementById('history-overlay').classList.remove('open');
  document.getElementById('history-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// Poll mission tasks more frequently (every 15s) for responsiveness
setInterval(loadMissionControl, 15000);

async function refreshAll() {
  const btn = document.getElementById('refresh-btn').querySelector('svg');
  btn.classList.add('refresh-spin');
  await Promise.all([loadInfo(), loadTasks(), loadMemories(), loadHealth(), loadTokens(), loadAgents(), loadHiveMind(), loadSummary(), loadMissionControl()]);
  btn.classList.remove('refresh-spin');
  document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
}

// Live countdown tickers
setInterval(() => {
  document.querySelectorAll('.countdown').forEach(el => {
    const ts = parseInt(el.dataset.ts);
    if (ts) el.textContent = countdown(ts);
  });
}, 1000);

// Auto-refresh every 60s
setInterval(refreshAll, 60000);

// Initial load — check auth first
(async () => {
  const authed = await checkAuth();
  if (authed) refreshAll();
})();

// ── Main Tab Switching ──────────────────────────────────────────────
let salesLoaded = false;
let ceoLoaded = false;
let knowledgeLoaded = false;
let shopifyLoaded = false;
let ptLoaded = false;
let projectsLoaded = false;
function switchMainTab(tab, btn) {
  document.getElementById('main-tab-dashboard').style.display = tab === 'dashboard' ? '' : 'none';
  document.getElementById('main-tab-ceo').style.display = tab === 'ceo' ? '' : 'none';
  document.getElementById('main-tab-sales').style.display = tab === 'sales' ? '' : 'none';
  document.getElementById('main-tab-knowledge').style.display = tab === 'knowledge' ? '' : 'none';
  document.getElementById('main-tab-database').style.display = tab === 'database' ? '' : 'none';
  document.getElementById('main-tab-supabase').style.display = tab === 'supabase' ? '' : 'none';
  document.getElementById('main-tab-projects').style.display = tab === 'projects' ? '' : 'none';
  document.getElementById('main-tab-builder').style.display = tab === 'builder' ? '' : 'none';
  document.getElementById('main-tab-shopify').style.display = tab === 'shopify' ? '' : 'none';
  document.getElementById('main-tab-oracle').style.display = tab === 'oracle' ? '' : 'none';
  document.getElementById('main-tab-portugues').style.display = tab === 'portugues' ? '' : 'none';
  document.querySelectorAll('.db-nav-tab').forEach(function(t) { t.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (tab === 'database' && !dbTablesLoaded) loadDbTables();
  if (tab === 'supabase' && !sbTablesLoaded) loadSbTables();
  if (tab === 'sales' && !salesLoaded) { salesLoaded = true; loadSalesData(); }
  if (tab === 'sales' && !hsLoaded) { hsLoaded = true; loadHubSpotData(); }
  if (tab === 'ceo' && !ceoLoaded) { loadCeoData().then(function() { ceoLoaded = true; }).catch(function() {}); loadOrgAgentGrid(); }
  if (tab === 'knowledge' && !knowledgeLoaded) { loadKnowledgeGraph().then(function() { knowledgeLoaded = true; }).catch(function(e) { console.error('KG load failed', e); }); }
  if (tab === 'projects' && !projectsLoaded) { projectsLoaded = true; loadProjectsData(); }
  if (tab === 'builder' && !bldrLoaded) { bldrLoaded = true; bldrInit(); }
  if (tab === 'shopify' && !shopifyLoaded) { shopifyLoaded = true; loadShopifyData(); }
  if (tab === 'portugues' && !ptLoaded) { ptLoaded = true; loadPortugueseData(); }
  if (tab === 'oracle') {
    initOracle();
    document.getElementById('matrix-rain').style.opacity = '0.04';
    document.getElementById('matrix-rain-glow').style.opacity = '0.02';
  } else {
    cleanupOracle();
    document.getElementById('matrix-rain').style.opacity = '0.24';
    document.getElementById('matrix-rain-glow').style.opacity = '0.12';
  }
}

// ── Sales / Stripe ──────────────────────────────────────────────────

function fmtUsd(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pctChange(current, previous) {
  if (!previous) return current > 0 ? { text: 'NEW', cls: 'up' } : { text: '-', cls: 'flat' };
  var diff = ((current - previous) / previous) * 100;
  if (Math.abs(diff) < 0.5) return { text: '~0%', cls: 'flat' };
  var sign = diff > 0 ? '+' : '';
  return { text: sign + diff.toFixed(1) + '%', cls: diff > 0 ? 'up' : 'down' };
}

function renderComparisonBar(label, value, maxVal, color) {
  var pct = maxVal > 0 ? Math.max(2, (value / maxVal) * 100) : 2;
  return '<div style="margin-bottom:10px">' +
    '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">' +
    '<span style="color:#4a8a4a">' + label + '</span>' +
    '<span style="color:' + color + ';font-weight:600">' + fmtUsd(value) + '</span>' +
    '</div>' +
    '<div style="background:rgba(0,255,65,0.06);border-radius:4px;height:8px;overflow:hidden">' +
    '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:4px;transition:width 0.6s ease;box-shadow:0 0 8px ' + color + '40"></div>' +
    '</div></div>';
}

async function loadSalesData() {
  try {
    var [salesRes, paymentsRes] = await Promise.all([
      fetch(BASE + '/api/stripe/sales', { credentials: 'same-origin' }),
      fetch(BASE + '/api/stripe/payments?limit=50', { credentials: 'same-origin' })
    ]);
    if (salesRes.status === 401 || paymentsRes.status === 401) { showLogin(); return; }

    if (salesRes.ok) {
      var sales = await salesRes.json();
      var now = new Date(sales.as_of);
      var day = now.getDate();
      var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var curMonth = monthNames[now.getMonth()];
      var prevMonth = monthNames[(now.getMonth() + 11) % 12];
      var curYear = now.getFullYear();
      var prevYear = curYear - 1;

      // Dynamic labels
      document.getElementById('sales-label-current').textContent = curMonth + ' 1-' + day + ', ' + curYear;
      document.getElementById('sales-label-last-month').textContent = prevMonth + ' 1-' + day + ', ' + (now.getMonth() === 0 ? prevYear : curYear);
      document.getElementById('sales-label-last-year').textContent = curMonth + ' 1-' + day + ', ' + prevYear;

      // Gross volume (main number)
      document.getElementById('sales-mtd-current').textContent = fmtUsd(sales.mtd_current);
      document.getElementById('sales-mtd-last-month').textContent = fmtUsd(sales.mtd_last_month);
      document.getElementById('sales-mtd-last-year').textContent = fmtUsd(sales.mtd_last_year);

      // Net volume
      document.getElementById('sales-mtd-current-net').textContent = fmtUsd(sales.mtd_current_net);
      document.getElementById('sales-mtd-last-month-net').textContent = fmtUsd(sales.mtd_last_month_net);
      document.getElementById('sales-mtd-last-year-net').textContent = fmtUsd(sales.mtd_last_year_net);

      // Fees + charge counts
      document.getElementById('sales-mtd-current-fees').textContent = fmtUsd(sales.mtd_current_fees);
      document.getElementById('sales-mtd-current-count').textContent = sales.mtd_current_count || 0;
      document.getElementById('sales-mtd-last-month-fees').textContent = fmtUsd(sales.mtd_last_month_fees);
      document.getElementById('sales-mtd-last-month-count').textContent = sales.mtd_last_month_count || 0;
      document.getElementById('sales-mtd-last-year-fees').textContent = fmtUsd(sales.mtd_last_year_fees);
      document.getElementById('sales-mtd-last-year-count').textContent = sales.mtd_last_year_count || 0;

      var vsLastMonth = pctChange(sales.mtd_current, sales.mtd_last_month);
      var vsLastYear = pctChange(sales.mtd_current, sales.mtd_last_year);
      document.getElementById('sales-mtd-current-delta').className = 'sales-metric-delta ' + vsLastMonth.cls;
      document.getElementById('sales-mtd-current-delta').textContent = vsLastMonth.text + ' vs ' + prevMonth;
      document.getElementById('sales-mtd-last-year-label').textContent = vsLastYear.text + ' YoY';
      document.getElementById('sales-mtd-last-year-label').className = 'sales-metric-delta ' + vsLastYear.cls;

      // Comparison bars
      var maxVal = Math.max(sales.mtd_current, sales.mtd_last_month, sales.mtd_last_year, 1);
      document.getElementById('sales-comparison-bars').innerHTML =
        renderComparisonBar(curMonth + ' ' + curYear + ' (1-' + day + ')', sales.mtd_current, maxVal, '#00ff41') +
        renderComparisonBar(prevMonth + ' ' + (now.getMonth() === 0 ? prevYear : curYear) + ' (1-' + day + ')', sales.mtd_last_month, maxVal, '#00cc33') +
        renderComparisonBar(curMonth + ' ' + prevYear + ' (1-' + day + ')', sales.mtd_last_year, maxVal, '#006600');
    }

    if (paymentsRes.ok) {
      var data = await paymentsRes.json();
      var log = document.getElementById('payments-log');
      if (!data.payments || data.payments.length === 0) {
        log.innerHTML = '<div style="padding:20px;text-align:center;color:#3a6b3a;font-size:13px">No payments found</div>';
        return;
      }
      var html = '';
      data.payments.forEach(function(p) {
        var dt = new Date(p.created * 1000);
        var timeStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
          dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var badge = p.new_customer ? '<span class="payment-new-badge">new client</span>' : '';
        html += '<div class="payment-row">' +
          '<div>' +
            '<div style="color:#c0e8c0;font-weight:500">' + (p.customer_name || 'Unknown') + badge + '</div>' +
            '<div style="color:#3a6b3a;font-size:11px">' + (p.customer_email || p.description || '') + '</div>' +
          '</div>' +
          '<div style="color:#00ff41;font-weight:700;font-family:Courier New,monospace;text-shadow:0 0 8px rgba(0,255,65,0.3)">' + fmtUsd(p.amount) + '</div>' +
          '<div style="color:#3a6b3a;font-size:11px;text-align:right">' + timeStr + '</div>' +
        '</div>';
      });
      log.innerHTML = html;
    }
  } catch(e) {
    console.error('Sales load error:', e);
    document.getElementById('payments-log').innerHTML =
      '<div style="padding:20px;text-align:center;color:#ff3333;font-size:13px">Failed to load Stripe data</div>';
  }
}

// ── Shopify ─────────────────────────────────────────────────────────

function mrwFmtUsd(val) {
  return '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function mrwFmtUsdDecimal(val) {
  return '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mrwDelta(current, previous, suffix) {
  if (!previous || previous === 0) return '';
  var pct = ((current - previous) / previous * 100).toFixed(1);
  var color = pct >= 0 ? '#c8a84e' : '#ff4444';
  var arrow = pct >= 0 ? '&#9650;' : '&#9660;';
  return '<span style="color:' + color + '">' + arrow + ' ' + Math.abs(pct) + '% vs last month' + (suffix || '') + '</span>';
}

function mrwTimeAgo(dateStr) {
  var diff = Date.now() - new Date(dateStr).getTime();
  var mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  return days + 'd ago';
}

async function loadShopifyData() {
  try {
    var [salesRes, overviewRes] = await Promise.all([
      api('/api/shopify/sales'),
      api('/api/shopify/overview')
    ]);

    // Sales metrics
    if (salesRes && salesRes.current) {
      var c = salesRes.current;
      var p = salesRes.previous;
      document.getElementById('mrw-mtd-revenue').innerHTML = mrwFmtUsd(c.gross_revenue);
      document.getElementById('mrw-mtd-delta').innerHTML = mrwDelta(c.gross_revenue, p.gross_revenue);
      document.getElementById('mrw-mtd-orders').innerHTML = c.total_orders;
      document.getElementById('mrw-mtd-orders-delta').innerHTML = mrwDelta(c.total_orders, p.total_orders);
      document.getElementById('mrw-aov').innerHTML = mrwFmtUsdDecimal(c.aov);
      document.getElementById('mrw-aov-delta').innerHTML = mrwDelta(c.aov, p.aov);
    }

    // Inventory
    if (overviewRes && overviewRes.inventory) {
      var totalStock = overviewRes.inventory.reduce(function(s, i) { return s + (i.available || 0); }, 0);
      document.getElementById('mrw-inventory').innerHTML = totalStock.toLocaleString();
    }

    // Products
    if (overviewRes && overviewRes.products) {
      var prodHtml = '';
      overviewRes.products.forEach(function(p) {
        var price = p.variants && p.variants[0] ? p.variants[0].price : '0';
        var imgSrc = p.image && p.image.src ? p.image.src : '';
        var variantCount = p.variants ? p.variants.length : 0;
        var status = p.status === 'active'
          ? '<span style="color:#c8a84e;font-size:10px;background:rgba(200,168,78,0.1);padding:2px 8px;border-radius:4px">Active</span>'
          : '<span style="color:#6b7280;font-size:10px;background:rgba(107,114,128,0.1);padding:2px 8px;border-radius:4px">' + p.status + '</span>';
        prodHtml += '<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)">';
        if (imgSrc) {
          prodHtml += '<img src="' + imgSrc + '" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid rgba(200,168,78,0.15)" />';
        } else {
          prodHtml += '<div style="width:48px;height:48px;background:rgba(200,168,78,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#c8a84e;font-size:18px">&#9670;</div>';
        }
        prodHtml += '<div style="flex:1"><div style="color:#e0e0e0;font-weight:600;font-size:14px">' + p.title + '</div>';
        prodHtml += '<div style="color:#6b7280;font-size:11px;margin-top:2px">' + variantCount + ' variant' + (variantCount !== 1 ? 's' : '') + '</div></div>';
        prodHtml += '<div style="text-align:right"><div style="color:#c8a84e;font-weight:700;font-size:16px">$' + price + '</div>' + status + '</div>';
        prodHtml += '</div>';
      });
      document.getElementById('mrw-products').innerHTML = prodHtml || '<div style="color:#3a6b3a;font-size:12px;padding:10px">No products found</div>';
    }

    // Total orders
    if (overviewRes && overviewRes.orders_count !== undefined) {
      document.getElementById('mrw-total-orders').innerHTML = overviewRes.orders_count.toLocaleString() + ' total orders';
    }

    // Recent orders
    if (overviewRes && overviewRes.orders) {
      var ordHtml = '';
      overviewRes.orders.forEach(function(o) {
        var statusColor = '#c8a84e';
        var statusBg = 'rgba(200,168,78,0.1)';
        if (o.financial_status === 'refunded') { statusColor = '#ff4444'; statusBg = 'rgba(255,68,68,0.1)'; }
        else if (o.financial_status === 'pending') { statusColor = '#ffaa00'; statusBg = 'rgba(255,170,0,0.1)'; }

        var custName = 'Guest';
        if (o.customer) custName = (o.customer.first_name || '') + ' ' + (o.customer.last_name || '');
        custName = custName.trim() || 'Guest';

        ordHtml += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">';
        ordHtml += '<div style="min-width:60px;color:#c8a84e;font-weight:700;font-size:13px;font-family:monospace">' + (o.name || '#?') + '</div>';
        ordHtml += '<div style="flex:1"><div style="color:#e0e0e0;font-size:13px">' + custName + '</div>';
        ordHtml += '<div style="color:#4a5568;font-size:11px;margin-top:1px">' + mrwTimeAgo(o.created_at) + '</div></div>';
        ordHtml += '<div style="text-align:right"><div style="color:#e0e0e0;font-weight:600;font-size:14px">$' + o.total_price + '</div>';
        ordHtml += '<div style="font-size:10px;color:' + statusColor + ';background:' + statusBg + ';padding:2px 8px;border-radius:4px;display:inline-block;margin-top:2px">' + (o.financial_status || 'unknown') + '</div></div>';
        ordHtml += '</div>';
      });
      document.getElementById('mrw-orders').innerHTML = ordHtml || '<div style="color:#3a6b3a;font-size:12px;padding:10px">No orders found</div>';
    }

    // Customers
    if (overviewRes && overviewRes.customers) {
      var custHtml = '';
      overviewRes.customers.forEach(function(c) {
        var name = ((c.first_name || '') + ' ' + (c.last_name || '')).trim() || 'Anonymous';
        var orders = c.orders_count || 0;
        var spent = c.total_spent || '0.00';
        custHtml += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">';
        custHtml += '<div style="width:36px;height:36px;border-radius:50%;background:rgba(200,168,78,0.1);display:flex;align-items:center;justify-content:center;color:#c8a84e;font-weight:700;font-size:14px">' + name.charAt(0).toUpperCase() + '</div>';
        custHtml += '<div style="flex:1"><div style="color:#e0e0e0;font-size:13px">' + name + '</div>';
        custHtml += '<div style="color:#4a5568;font-size:11px;margin-top:1px">' + (c.email || 'No email') + '</div></div>';
        custHtml += '<div style="text-align:right"><div style="color:#c8a84e;font-weight:600;font-size:13px">$' + spent + '</div>';
        custHtml += '<div style="color:#6b7280;font-size:11px">' + orders + ' order' + (orders !== 1 ? 's' : '') + '</div></div>';
        custHtml += '</div>';
      });
      document.getElementById('mrw-customers').innerHTML = custHtml || '<div style="color:#3a6b3a;font-size:12px;padding:10px">No customers found</div>';
    }

  } catch(e) {
    console.error('Shopify load failed', e);
    document.getElementById('mrw-products').innerHTML = '<div style="color:#ff3333;font-size:12px;padding:10px">Failed to load Shopify data</div>';
  }
}

// ── HubSpot Sales Team ──────────────────────────────────────────────
var hsData = null;
var hsPeriod = 'week'; // 'week' or 'month'
var hsSort = 'revenue';
var hsLoaded = false;

function hsSetPeriod(period, btn) {
  hsPeriod = period;
  btn.parentElement.querySelectorAll('.hs-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  if (hsData) renderHubSpotData(hsData);
}

function hsSetSort(sort, btn) {
  hsSort = sort;
  btn.parentElement.querySelectorAll('.hs-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  if (hsData) renderHsLeaderboard(hsData.reps);
}

function hsFmtDuration(secs) {
  if (!secs || secs <= 0) return '0m';
  var h = Math.floor(secs / 3600);
  var m = Math.floor((secs % 3600) / 60);
  if (h > 0) return h + 'h ' + m + 'm';
  return m + 'm';
}

function hsFmtMoney(val) {
  if (!val) return '$0';
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function hsRankClass(i) {
  if (i === 0) return 'hs-rank-1';
  if (i === 1) return 'hs-rank-2';
  if (i === 2) return 'hs-rank-3';
  return 'hs-rank-other';
}

async function loadHubSpotData() {
  try {
    var [teamRes, pipeRes] = await Promise.all([
      fetch(BASE + '/api/hubspot/team-performance', { credentials: 'same-origin' }),
      fetch(BASE + '/api/hubspot/pipeline-analytics', { credentials: 'same-origin' }),
    ]);
    if (!teamRes.ok) {
      if (teamRes.status === 401) { showLogin(); return; }
      if (teamRes.status === 503) {
        document.getElementById('hs-kpi-cards').innerHTML =
          '<div style="grid-column:1/-1;text-align:center;color:#3a6b3a;padding:20px;font-size:13px">HubSpot not configured. Add HUBSPOT_ACCESS_TOKEN to .env</div>';
        return;
      }
      throw new Error('HTTP ' + teamRes.status);
    }
    hsData = await teamRes.json();
    var pipeData = pipeRes.ok ? await pipeRes.json() : null;
    renderHubSpotData(hsData, pipeData);
  } catch(e) {
    console.error('HubSpot load error:', e);
    document.getElementById('hs-kpi-cards').innerHTML =
      '<div style="grid-column:1/-1;text-align:center;color:#ff3333;padding:20px;font-size:13px">Failed to load HubSpot data</div>';
  }
}

function renderHubSpotData(data, pipeData) {
  var t = data.team;
  var isWeek = hsPeriod === 'week';

  // KPI Cards
  var calls = isWeek ? t.callsWeek : t.callsMonth;
  var talkTime = isWeek ? t.talkTimeWeek : t.talkTimeMonth;
  var meetings = isWeek ? t.meetingsWeek : t.meetingsMonth;
  var periodLabel = isWeek ? 'this week' : 'this month';

  var kpiHtml = '';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + calls + '</div><div class="hs-kpi-label">Calls ' + periodLabel + '</div></div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + hsFmtDuration(talkTime) + '</div><div class="hs-kpi-label">Talk Time ' + periodLabel + '</div></div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + meetings + '</div><div class="hs-kpi-label">Meetings ' + periodLabel + '</div></div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + t.dealsWon + '</div><div class="hs-kpi-label">Deals Won MTD</div></div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + hsFmtMoney(t.revenueWon) + '</div><div class="hs-kpi-label">Revenue Won MTD</div>';
  if (t.lastMonthRevenue > 0) {
    var revDelta = t.lastMonthRevenue > 0 ? ((t.revenueWon - t.lastMonthRevenue) / t.lastMonthRevenue * 100) : 0;
    var revCls = revDelta > 0 ? 'color:#00ff41' : revDelta < 0 ? 'color:#ff4444' : 'color:#3a6b3a';
    kpiHtml += '<div class="hs-kpi-sub" style="' + revCls + '">' + (revDelta > 0 ? '+' : '') + revDelta.toFixed(1) + '% vs last month</div>';
  }
  kpiHtml += '</div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + t.dealsLost + '</div><div class="hs-kpi-label">Deals Lost MTD</div><div class="hs-kpi-sub">' + hsFmtMoney(t.revenueLost) + ' lost</div></div>';
  var openPipeVal = t.openPipelineValue || (pipeData && pipeData.open_pipeline_value ? pipeData.open_pipeline_value : 0);
  var openStageCount = pipeData && pipeData.stages ? pipeData.stages.reduce(function(s, st) { return s + st.count; }, 0) : t.openDeals;
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + openStageCount + '</div><div class="hs-kpi-label">Open Pipeline</div><div class="hs-kpi-sub">' + hsFmtMoney(openPipeVal) + ' total</div></div>';
  kpiHtml += '<div class="hs-kpi-card"><div class="hs-kpi-val">' + t.newLeads + '</div><div class="hs-kpi-label">New Leads MTD</div>';
  if (t.unassignedLeads > 0) kpiHtml += '<div class="hs-kpi-sub" style="color:#ffaa00">' + t.unassignedLeads + ' unassigned!</div>';
  kpiHtml += '</div>';

  document.getElementById('hs-kpi-cards').innerHTML = kpiHtml;

  // Win Rate Ring
  var wr = t.winRate;
  document.getElementById('hs-win-rate-pct').textContent = wr.toFixed(0) + '%';
  document.getElementById('hs-win-rate-arc').setAttribute('stroke-dasharray', wr.toFixed(1) + ', 100');
  var arcColor = wr >= 40 ? '#00ff41' : wr >= 25 ? '#ffaa00' : '#ff4444';
  document.getElementById('hs-win-rate-arc').setAttribute('stroke', arcColor);
  document.getElementById('hs-win-rate-sub').textContent = t.dealsWon + 'W / ' + t.dealsLost + 'L this month';

  // Pipeline Health Bars - show sales team reps with pipeline, fall back to stages
  var reps = data.reps || [];
  var pipeHtml = '';
  // Closers only (filtered by org role)
  var sortedByPipeline = reps.filter(function(r) {
    return r.openPipelineValue > 0 && r.role === 'closer';
  }).sort(function(a,b) { return b.openPipelineValue - a.openPipelineValue; });

  if (sortedByPipeline.length > 0) {
    // Show per-rep pipeline bars with role badge
    var maxPipeline = sortedByPipeline[0].openPipelineValue;
    sortedByPipeline.forEach(function(rep) {
      var pct = maxPipeline > 0 ? Math.max(3, (rep.openPipelineValue / maxPipeline) * 100) : 3;
      var roleTag = rep.title ? ' <span style="color:#4a8a4a;font-size:10px">' + rep.title + '</span>' : '';
      pipeHtml += '<div style="margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">' +
        '<span style="color:#a0d8a0">' + rep.name + roleTag + ' <span style="color:#3a6b3a">(' + rep.openDeals + ' deals)</span></span>' +
        '<span style="color:#00ff41;font-weight:600;font-family:Courier New,monospace">' + hsFmtMoney(rep.openPipelineValue) + '</span>' +
        '</div>' +
        '<div class="hs-progress-bar"><div class="hs-progress-fill" style="width:' + pct + '%;background:linear-gradient(90deg,#006600,#00ff41);box-shadow:0 0 6px rgba(0,255,65,0.3)"></div></div>' +
        '</div>';
    });
  } else if (pipeData && pipeData.stages && pipeData.stages.length > 0) {
    // Fall back to pipeline stages breakdown
    var maxStageVal = Math.max.apply(null, pipeData.stages.map(function(s) { return s.value; }));
    pipeData.stages.sort(function(a, b) { return b.value - a.value; });
    pipeHtml += '<div style="font-size:10px;color:#4a8a4a;margin-bottom:6px;text-transform:uppercase">Pipeline by Stage</div>';
    pipeData.stages.forEach(function(stage) {
      var pct = maxStageVal > 0 ? Math.max(3, (stage.value / maxStageVal) * 100) : 3;
      pipeHtml += '<div style="margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">' +
        '<span style="color:#a0d8a0">' + stage.name + ' <span style="color:#3a6b3a">(' + stage.count + ' deals)</span></span>' +
        '<span style="color:#00ff41;font-weight:600;font-family:Courier New,monospace">' + hsFmtMoney(stage.value) + '</span>' +
        '</div>' +
        '<div class="hs-progress-bar"><div class="hs-progress-fill" style="width:' + pct + '%;background:linear-gradient(90deg,#006600,#00ff41);box-shadow:0 0 6px rgba(0,255,65,0.3)"></div></div>' +
        '</div>';
    });
    if (pipeData.open_pipeline_value) {
      pipeHtml += '<div style="text-align:right;font-size:13px;color:#00ff41;font-weight:600;font-family:Courier New,monospace;margin-top:4px">Total: ' + hsFmtMoney(pipeData.open_pipeline_value) + '</div>';
    }
  } else {
    pipeHtml = '<div style="color:#3a6b3a;font-size:12px">No open pipeline data</div>';
  }
  document.getElementById('hs-pipeline-bars').innerHTML = pipeHtml;

  // Leaderboard
  renderHsLeaderboard(reps);

  // Stale Deals
  var stale = data.staleDeals || [];
  document.getElementById('hs-stale-count').textContent = stale.length;
  var staleHtml = '';
  stale.forEach(function(d) {
    staleHtml += '<div class="hs-alert-row">' +
      '<div><div style="color:#a0d8a0;font-weight:500">' + d.name + '</div><div class="hs-muted">' + d.owner + '</div></div>' +
      '<div><span class="hs-tag hs-tag-warn">' + d.daysSinceUpdate + ' days idle</span></div>' +
      '<div style="text-align:right;font-family:Courier New,monospace;color:#ffaa00;font-weight:600">' + hsFmtMoney(d.amount) + '</div>' +
      '</div>';
  });
  if (!staleHtml) staleHtml = '<div style="color:#00ff41;font-size:12px;padding:10px;text-align:center">All deals active</div>';
  document.getElementById('hs-stale-deals').innerHTML = staleHtml;

  // Overdue Deals
  var overdue = data.overdueDeals || [];
  document.getElementById('hs-overdue-count').textContent = overdue.length;
  var overdueHtml = '';
  overdue.forEach(function(d) {
    overdueHtml += '<div class="hs-alert-row">' +
      '<div><div style="color:#a0d8a0;font-weight:500">' + d.name + '</div><div class="hs-muted">' + d.owner + '</div></div>' +
      '<div><span class="hs-tag hs-tag-danger">' + d.daysOverdue + ' days overdue</span></div>' +
      '<div style="text-align:right;font-family:Courier New,monospace;color:#ff4444;font-weight:600">' + hsFmtMoney(d.amount) + '</div>' +
      '</div>';
  });
  if (!overdueHtml) overdueHtml = '<div style="color:#00ff41;font-size:12px;padding:10px;text-align:center">No overdue deals</div>';
  document.getElementById('hs-overdue-deals').innerHTML = overdueHtml;

  // Unassigned Leads
  var unassigned = data.unassignedLeads || [];
  document.getElementById('hs-unassigned-count').textContent = unassigned.length;
  var unassignedHtml = '';
  unassigned.forEach(function(lead) {
    var created = new Date(lead.created);
    var timeStr = created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    unassignedHtml += '<div class="hs-alert-row">' +
      '<div><div style="color:#a0d8a0;font-weight:500">' + lead.name + '</div><div class="hs-muted">' + lead.email + '</div></div>' +
      '<div><span class="hs-tag hs-tag-warn">no owner</span></div>' +
      '<div style="text-align:right;color:#3a6b3a;font-size:11px">' + timeStr + '</div>' +
      '</div>';
  });
  if (!unassignedHtml) unassignedHtml = '<div style="color:#00ff41;font-size:12px;padding:10px;text-align:center">All leads assigned</div>';
  document.getElementById('hs-unassigned-leads').innerHTML = unassignedHtml;

  // Recently Lost
  var lost = data.recentLost || [];
  document.getElementById('hs-lost-count').textContent = lost.length;
  var lostHtml = '';
  lost.forEach(function(d) {
    lostHtml += '<div class="hs-alert-row">' +
      '<div><div style="color:#a0d8a0;font-weight:500">' + d.name + '</div><div class="hs-muted">' + d.owner + '</div></div>' +
      '<div><span class="hs-tag hs-tag-danger" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + d.reason + '">' + d.reason + '</span></div>' +
      '<div style="text-align:right;font-family:Courier New,monospace;color:#ff4444;font-weight:600">' + hsFmtMoney(d.amount) + '</div>' +
      '</div>';
  });
  if (!lostHtml) lostHtml = '<div style="color:#00ff41;font-size:12px;padding:10px;text-align:center">No deals lost this month</div>';
  document.getElementById('hs-lost-deals').innerHTML = lostHtml;
}

function hsRepSorter(a, b) {
  var isWeek = hsPeriod === 'week';
  if (hsSort === 'revenue') return b.revenueWon - a.revenueWon;
  if (hsSort === 'calls') return (isWeek ? b.callsWeek - a.callsWeek : b.callsMonth - a.callsMonth);
  if (hsSort === 'meetings') return (isWeek ? b.meetingsWeek - a.meetingsWeek : b.meetingsMonth - a.meetingsMonth);
  if (hsSort === 'talktime') return (isWeek ? b.talkTimeWeek - a.talkTimeWeek : b.talkTimeMonth - a.talkTimeMonth);
  return 0;
}

function hsRenderRows(reps) {
  var isWeek = hsPeriod === 'week';
  var html = '';
  reps.forEach(function(rep, i) {
    var calls = isWeek ? rep.callsWeek : rep.callsMonth;
    var talk = isWeek ? rep.talkTimeWeek : rep.talkTimeMonth;
    var mtgs = isWeek ? rep.meetingsWeek : rep.meetingsMonth;

    html += '<tr>' +
      '<td><span class="hs-rank ' + hsRankClass(i) + '">' + (i + 1) + '</span></td>' +
      '<td><span style="font-weight:600;color:#c0e8c0">' + rep.name + '</span>' + (rep.title ? '<br><span style="font-size:10px;color:#4a8a4a">' + rep.title + '</span>' : '') + '</td>' +
      '<td class="num">' + calls + '</td>' +
      '<td class="num">' + hsFmtDuration(talk) + '</td>' +
      '<td class="num">' + mtgs + '</td>' +
      '<td class="num" style="color:#00ff41">' + rep.dealsWon + '</td>' +
      '<td class="num" style="color:#00ff41;font-weight:700">' + hsFmtMoney(rep.revenueWon) + '</td>' +
      '<td class="num" style="color:' + (rep.dealsLost > 0 ? '#ff4444' : '#3a6b3a') + '">' + rep.dealsLost + '</td>' +
      '<td class="num">' + hsFmtMoney(rep.openPipelineValue) + ' <span style="color:#3a6b3a;font-size:10px">(' + rep.openDeals + ')</span></td>' +
      '<td class="num">' + rep.newLeads + '</td>' +
      '</tr>';
  });
  return html || '<tr><td colspan="10" style="text-align:center;color:#3a6b3a;padding:20px">No rep data</td></tr>';
}

function renderHsLeaderboard(reps) {
  var all = (reps || []).sort(hsRepSorter);
  var closers = all.filter(function(r) { return r.role === 'closer'; });
  var setters = all.filter(function(r) { return r.role === 'setter'; });
  // If no roles assigned, show all reps in closers table
  if (closers.length === 0 && setters.length === 0) closers = all;
  document.getElementById('hs-closers-body').innerHTML = hsRenderRows(closers);
  document.getElementById('hs-setters-body').innerHTML = hsRenderRows(setters);
}

// ── CEO Dashboard ──────────────────────────────────────────────────

let ceoMrrChart = null;
let ceoPipelineChart = null;
let ceoRevPerRepChart = null;
let ceoWhoopChart = null;
let ceoWhoopTrendData = {};
let ceoWhoopCurrentTrend = 'recovery';

function ceoFmtUsd(val) {
  return '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ceoFmtK(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return String(val);
}

async function connectWhoop() {
  try {
    var res = await fetch(BASE + '/api/whoop/auth-url', { credentials: 'same-origin' });
    var data = await res.json();
    if (data.url) window.open(data.url, '_blank');
  } catch(e) { console.error('WHOOP connect error:', e); }
}

function switchWhoopTrend(type) {
  ceoWhoopCurrentTrend = type;
  // Update tab styles
  document.querySelectorAll('.whoop-trend-tab').forEach(function(btn) {
    if (btn.getAttribute('data-trend') === type) {
      btn.style.background = 'rgba(0,255,65,0.15)';
      btn.style.borderColor = 'rgba(0,255,65,0.2)';
      btn.style.color = '#00ff41';
    } else {
      btn.style.background = 'transparent';
      btn.style.borderColor = 'rgba(0,255,65,0.1)';
      btn.style.color = '#4a8a4a';
    }
  });

  var canvas = document.getElementById('ceo-whoop-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  var ctx = canvas.getContext('2d');
  if (ceoWhoopChart) ceoWhoopChart.destroy();

  var trendArr = [];
  var chartConfig = {};

  if (type === 'recovery') {
    trendArr = ceoWhoopTrendData.recovery || [];
    var labels = trendArr.map(function(r) {
      if (!r.date) return '';
      var d = new Date(r.date);
      return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    });
    var scores = trendArr.map(function(r) { return r.score; });
    var colors = scores.map(function(s) {
      return s >= 67 ? 'rgba(0,255,65,0.7)' : s >= 34 ? 'rgba(255,170,0,0.7)' : 'rgba(255,51,51,0.7)';
    });
    chartConfig = {
      type: 'bar',
      data: { labels: labels, datasets: [{ data: scores, backgroundColor: colors, borderRadius: 3, barThickness: 12 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { return c.raw + '% recovery'; } } } },
        scales: { y: { display: false, min: 0, max: 100 }, x: { ticks: { color: '#3a6b3a', font: { family: 'Courier New', size: 9 } }, grid: { display: false } } }
      }
    };
  } else if (type === 'hrv') {
    trendArr = ceoWhoopTrendData.recovery || [];
    var labels = trendArr.map(function(r) {
      if (!r.date) return '';
      var d = new Date(r.date);
      return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    });
    var hrvVals = trendArr.map(function(r) { return r.hrv; });
    chartConfig = {
      type: 'line',
      data: { labels: labels, datasets: [{ data: hrvVals, borderColor: '#00ff41', backgroundColor: 'rgba(0,255,65,0.05)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#00ff41', tension: 0.3, fill: true }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { return c.raw + ' ms HRV'; } } } },
        scales: { y: { display: false }, x: { ticks: { color: '#3a6b3a', font: { family: 'Courier New', size: 9 } }, grid: { display: false } } }
      }
    };
  } else if (type === 'sleep') {
    trendArr = ceoWhoopTrendData.sleep || [];
    var labels = trendArr.map(function(r) {
      if (!r.date) return '';
      var d = new Date(r.date);
      return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    });
    var sleepVals = trendArr.map(function(r) { return r.hours != null ? Math.round(r.hours * 10) / 10 : null; });
    var sleepColors = sleepVals.map(function(h) {
      return h >= 7 ? 'rgba(0,255,65,0.7)' : h >= 6 ? 'rgba(255,170,0,0.7)' : 'rgba(255,51,51,0.7)';
    });
    chartConfig = {
      type: 'bar',
      data: { labels: labels, datasets: [{ data: sleepVals, backgroundColor: sleepColors, borderRadius: 3, barThickness: 12 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { return c.raw + 'h sleep'; } } } },
        scales: { y: { display: false, min: 0 }, x: { ticks: { color: '#3a6b3a', font: { family: 'Courier New', size: 9 } }, grid: { display: false } } }
      }
    };
  } else if (type === 'strain') {
    trendArr = ceoWhoopTrendData.strain || [];
    var labels = trendArr.map(function(r) {
      if (!r.date) return '';
      var d = new Date(r.date);
      return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    });
    var strainVals = trendArr.map(function(r) { return r.strain; });
    chartConfig = {
      type: 'line',
      data: { labels: labels, datasets: [{ data: strainVals, borderColor: '#ffaa00', backgroundColor: 'rgba(255,170,0,0.05)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#ffaa00', tension: 0.3, fill: true }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { return c.raw + ' strain'; } } } },
        scales: { y: { display: false, min: 0, max: 21 }, x: { ticks: { color: '#3a6b3a', font: { family: 'Courier New', size: 9 } }, grid: { display: false } } }
      }
    };
  }

  if (chartConfig.type) {
    ceoWhoopChart = new Chart(ctx, chartConfig);
  }
}

async function loadWhoopData() {
  try {
    var res = await fetch(BASE + '/api/whoop/data', { credentials: 'same-origin' });
    var data = await res.json();

    if (data.needs_auth || data.error) {
      // Show connect prompt
      document.getElementById('ceo-whoop-kpis').style.display = 'none';
      document.getElementById('ceo-whoop-secondary').style.display = 'none';
      document.getElementById('ceo-whoop-trend').style.display = 'none';
      if (document.getElementById('ceo-whoop-extended')) document.getElementById('ceo-whoop-extended').style.display = 'none';
      if (document.getElementById('ceo-whoop-extended2')) document.getElementById('ceo-whoop-extended2').style.display = 'none';
      if (document.getElementById('ceo-whoop-sleep-breakdown')) document.getElementById('ceo-whoop-sleep-breakdown').style.display = 'none';
      if (document.getElementById('ceo-whoop-insights')) document.getElementById('ceo-whoop-insights').style.display = 'none';
      document.getElementById('ceo-whoop-connect').style.display = 'block';
      document.getElementById('ceo-whoop-status').textContent = data.needs_auth ? 'Not connected' : data.error;
      return;
    }

    // Hide connect, show data
    document.getElementById('ceo-whoop-connect').style.display = 'none';
    document.getElementById('ceo-whoop-kpis').style.display = 'grid';
    document.getElementById('ceo-whoop-secondary').style.display = 'grid';
    document.getElementById('ceo-whoop-trend').style.display = 'block';
    if (document.getElementById('ceo-whoop-extended')) document.getElementById('ceo-whoop-extended').style.display = 'grid';
    if (document.getElementById('ceo-whoop-extended2')) document.getElementById('ceo-whoop-extended2').style.display = 'grid';
    if (document.getElementById('ceo-whoop-sleep-breakdown')) document.getElementById('ceo-whoop-sleep-breakdown').style.display = 'block';
    if (document.getElementById('ceo-whoop-insights')) document.getElementById('ceo-whoop-insights').style.display = 'block';

    var t = data.today || {};

    // Recovery score with color coding
    var recScore = t.recovery_score;
    var recEl = document.getElementById('ceo-whoop-recovery');
    if (recScore != null) {
      recEl.textContent = Math.round(recScore) + '%';
      recEl.style.color = recScore >= 67 ? '#00ff41' : recScore >= 34 ? '#ffaa00' : '#ff3333';
    }

    // HRV
    var hrvEl = document.getElementById('ceo-whoop-hrv');
    if (t.hrv != null) {
      hrvEl.textContent = Math.round(t.hrv);
      hrvEl.style.color = '#00ff41';
    }

    // Resting HR
    var rhrEl = document.getElementById('ceo-whoop-rhr');
    if (t.resting_hr != null) {
      rhrEl.textContent = Math.round(t.resting_hr);
      rhrEl.style.color = '#00ff41';
    }

    // Sleep hours
    var sleepEl = document.getElementById('ceo-whoop-sleep');
    if (t.sleep_hours != null) {
      var hrs = Math.floor(t.sleep_hours);
      var mins = Math.round((t.sleep_hours - hrs) * 60);
      sleepEl.textContent = hrs + 'h ' + mins + 'm';
      sleepEl.style.color = t.sleep_hours >= 7 ? '#00ff41' : t.sleep_hours >= 6 ? '#ffaa00' : '#ff3333';
    }

    // Strain
    var strainEl = document.getElementById('ceo-whoop-strain');
    if (t.strain != null) {
      strainEl.textContent = t.strain.toFixed(1);
      strainEl.style.color = '#00ff41';
    }

    // Calories
    var calEl = document.getElementById('ceo-whoop-calories');
    if (t.calories != null) {
      calEl.textContent = t.calories.toLocaleString();
      calEl.style.color = '#00ff41';
    }

    // Extended stats
    var spo2El = document.getElementById('ceo-whoop-spo2');
    if (spo2El && t.spo2 != null) {
      spo2El.textContent = t.spo2.toFixed(1) + '%';
      spo2El.style.color = t.spo2 >= 95 ? '#00ff41' : '#ff3333';
    }

    var skinEl = document.getElementById('ceo-whoop-skintemp');
    if (skinEl && t.skin_temp != null) {
      skinEl.textContent = t.skin_temp.toFixed(1) + '\u00b0';
      skinEl.style.color = '#00ff41';
    }

    var sleepPerfEl = document.getElementById('ceo-whoop-sleepperf');
    if (sleepPerfEl && t.sleep_performance != null) {
      sleepPerfEl.textContent = Math.round(t.sleep_performance) + '%';
      sleepPerfEl.style.color = t.sleep_performance >= 85 ? '#00ff41' : t.sleep_performance >= 70 ? '#ffaa00' : '#ff3333';
    }

    var respEl = document.getElementById('ceo-whoop-resprate');
    if (respEl && t.respiratory_rate != null) {
      respEl.textContent = t.respiratory_rate.toFixed(1);
      respEl.style.color = '#00ff41';
    }

    var avgHrEl = document.getElementById('ceo-whoop-avghr');
    if (avgHrEl && t.avg_hr != null) {
      avgHrEl.textContent = Math.round(t.avg_hr);
      avgHrEl.style.color = '#00ff41';
    }

    var maxHrEl = document.getElementById('ceo-whoop-maxhr');
    if (maxHrEl && t.max_hr != null) {
      maxHrEl.textContent = Math.round(t.max_hr);
      maxHrEl.style.color = '#00ff41';
    }

    // Sleep stage breakdown
    if (t.light_sleep_mins != null || t.deep_sleep_mins != null || t.rem_sleep_mins != null) {
      var light = t.light_sleep_mins || 0;
      var deep = t.deep_sleep_mins || 0;
      var rem = t.rem_sleep_mins || 0;
      var totalSleepMins = light + deep + rem;
      if (totalSleepMins > 0) {
        var bar = document.getElementById('ceo-whoop-sleep-bar');
        if (bar) {
          bar.innerHTML =
            '<div style="width:' + (light/totalSleepMins*100) + '%;background:#4a8a4a;transition:width 0.3s" title="Light: ' + light + 'min"></div>' +
            '<div style="width:' + (deep/totalSleepMins*100) + '%;background:#00ff41;transition:width 0.3s" title="Deep: ' + deep + 'min"></div>' +
            '<div style="width:' + (rem/totalSleepMins*100) + '%;background:#00cc33;transition:width 0.3s" title="REM: ' + rem + 'min"></div>';
        }
        var legend = document.getElementById('ceo-whoop-sleep-legend');
        if (legend) {
          legend.innerHTML =
            '<span><span style="display:inline-block;width:6px;height:6px;background:#4a8a4a;border-radius:50%;margin-right:3px"></span>Light ' + light + 'm</span>' +
            '<span><span style="display:inline-block;width:6px;height:6px;background:#00ff41;border-radius:50%;margin-right:3px"></span>Deep ' + deep + 'm</span>' +
            '<span><span style="display:inline-block;width:6px;height:6px;background:#00cc33;border-radius:50%;margin-right:3px"></span>REM ' + rem + 'm</span>';
        }
      }
    }

    var effEl = document.getElementById('ceo-whoop-sleep-efficiency');
    if (effEl && t.sleep_efficiency != null) {
      effEl.textContent = 'Efficiency: ' + Math.round(t.sleep_efficiency) + '%';
      effEl.style.color = t.sleep_efficiency >= 85 ? '#00ff41' : t.sleep_efficiency >= 70 ? '#ffaa00' : '#ff3333';
    }

    // Store trend data and render chart via tabs
    var trends = data.trends || {};
    ceoWhoopTrendData = trends;
    switchWhoopTrend('recovery');

    // AI Health Insights
    var insightsArr = [];
    var recTrendArr = trends.recovery || [];

    if (t.recovery_score != null) {
      if (t.recovery_score < 34) insightsArr.push({ level: 'red', text: 'Recovery is critically low. Rest day recommended. No intense training.' });
      else if (t.recovery_score <= 50) insightsArr.push({ level: 'amber', text: 'Below average recovery. Keep activity light today.' });
      else if (t.recovery_score > 85) insightsArr.push({ level: 'green', text: 'Peak recovery. Great day for high-intensity training.' });
    }

    if (recTrendArr.length >= 3) {
      var last3hrv = recTrendArr.slice(-3);
      if (last3hrv[0].hrv != null && last3hrv[1].hrv != null && last3hrv[2].hrv != null) {
        if (last3hrv[1].hrv < last3hrv[0].hrv && last3hrv[2].hrv < last3hrv[1].hrv) {
          insightsArr.push({ level: 'amber', text: 'HRV has been declining. Prioritize sleep quality and stress management.' });
        }
      }
    }

    if (t.sleep_hours != null) {
      if (t.sleep_hours < 6) insightsArr.push({ level: 'red', text: 'Significant sleep deficit. This impacts recovery and cognitive performance.' });
      else if (t.sleep_hours < 7) insightsArr.push({ level: 'amber', text: 'Under-sleeping. Aim for 7-8 hours tonight.' });
      else if (t.sleep_hours > 8) insightsArr.push({ level: 'green', text: 'Great sleep duration. Keep it up.' });
    }

    if (t.strain != null && t.recovery_score != null && t.strain > 18 && t.recovery_score < 50) {
      insightsArr.push({ level: 'red', text: 'High strain with low recovery. Overtraining risk. Scale back.' });
    }

    if (t.spo2 != null && t.spo2 < 95) {
      insightsArr.push({ level: 'red', text: 'Blood oxygen below normal. Monitor closely.' });
    }

    if (t.sleep_efficiency != null && t.sleep_efficiency < 85) {
      insightsArr.push({ level: 'amber', text: 'Poor sleep quality. Reduce screen time and caffeine before bed.' });
    }

    if (recTrendArr.length >= 3) {
      var last3rhr = recTrendArr.slice(-3);
      if (last3rhr[0].rhr != null && last3rhr[1].rhr != null && last3rhr[2].rhr != null) {
        if (last3rhr[1].rhr > last3rhr[0].rhr && last3rhr[2].rhr > last3rhr[1].rhr) {
          insightsArr.push({ level: 'amber', text: 'Resting heart rate rising. Could indicate fatigue or stress.' });
        }
      }
    }

    var insightsList = document.getElementById('ceo-whoop-insights-list');
    if (insightsList) {
      if (insightsArr.length === 0) {
        insightsList.innerHTML = '<div style="font-size:10px;color:#3a6b3a;padding:6px;text-align:center">All metrics look good</div>';
      } else {
        insightsList.innerHTML = insightsArr.map(function(ins) {
          var bgColor = ins.level === 'red' ? 'rgba(255,51,51,0.08)' : ins.level === 'amber' ? 'rgba(255,170,0,0.08)' : 'rgba(0,255,65,0.08)';
          var borderColor = ins.level === 'red' ? 'rgba(255,51,51,0.2)' : ins.level === 'amber' ? 'rgba(255,170,0,0.2)' : 'rgba(0,255,65,0.2)';
          var dotColor = ins.level === 'red' ? '#ff3333' : ins.level === 'amber' ? '#ffaa00' : '#00ff41';
          return '<div style="padding:5px 8px;background:' + bgColor + ';border:1px solid ' + borderColor + ';border-radius:5px;font-size:10px;color:#b0b0b0;display:flex;align-items:flex-start;gap:6px">' +
            '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:' + dotColor + ';margin-top:3px;flex-shrink:0"></span>' +
            '<span>' + ins.text + '</span></div>';
        }).join('');
      }
    }

    document.getElementById('ceo-whoop-status').textContent = 'Live';
    document.getElementById('ceo-whoop-status').style.color = '#00ff41';

  } catch(e) {
    console.error('WHOOP load error:', e);
    document.getElementById('ceo-whoop-connect').style.display = 'block';
    document.getElementById('ceo-whoop-kpis').style.display = 'none';
    document.getElementById('ceo-whoop-secondary').style.display = 'none';
    document.getElementById('ceo-whoop-trend').style.display = 'none';
    if (document.getElementById('ceo-whoop-extended')) document.getElementById('ceo-whoop-extended').style.display = 'none';
    if (document.getElementById('ceo-whoop-extended2')) document.getElementById('ceo-whoop-extended2').style.display = 'none';
    if (document.getElementById('ceo-whoop-sleep-breakdown')) document.getElementById('ceo-whoop-sleep-breakdown').style.display = 'none';
    if (document.getElementById('ceo-whoop-insights')) document.getElementById('ceo-whoop-insights').style.display = 'none';
  }
}

async function loadGranolaData() {
  try {
    var res = await fetch(BASE + '/api/granola/meetings', { credentials: 'same-origin' });
    var data = await res.json();
    if (data.error === 'Granola not configured') {
      document.getElementById('ceo-granola-meetings').style.display = 'none';
      document.getElementById('ceo-granola-actions').style.display = 'none';
      document.getElementById('ceo-granola-unconfigured').style.display = 'block';
      return;
    }
    if (data.error) throw new Error(data.error);
    document.getElementById('ceo-granola-unconfigured').style.display = 'none';

    // Parse meetings from XML-like format
    var meetingsEl = document.getElementById('ceo-granola-meetings-list');
    var raw = data.meetings_raw || '';
    var meetingMatches = raw.match(/<meeting[^>]*title="([^"]*)"[^>]*date="([^"]*)"[^>]*>/g) || [];
    var participantMatches = raw.match(/<meeting[^>]*>[\\s\\S]*?<known_participants>([\\s\\S]*?)<\\/known_participants>/g) || [];

    if (meetingMatches.length > 0) {
      var mHtml = '';
      meetingMatches.forEach(function(m, i) {
        var titleMatch = m.match(/title="([^"]*)"/);
        var dateMatch = m.match(/date="([^"]*)"/);
        var title = titleMatch ? titleMatch[1] : 'Untitled';
        var dateStr = dateMatch ? dateMatch[1] : '';
        var timeStr = '';
        if (dateStr) {
          var timePart = dateStr.match(/\\d+:\\d+\\s*[APap][Mm]/);
          if (timePart) timeStr = timePart[0];
        }
        mHtml += '<div style="padding:6px 0;border-bottom:1px solid rgba(0,255,65,0.06)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<span style="color:#a0d8a0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:65%">' + escapeHtml(title) + '</span>' +
          '<span style="color:#4a8a4a;font-size:11px;white-space:nowrap">' + escapeHtml(timeStr) + '</span>' +
          '</div></div>';
      });
      meetingsEl.innerHTML = mHtml;
    } else {
      meetingsEl.innerHTML = '<div style="color:#3a6b3a">No meetings this week</div>';
    }

    // Render action items (plain text from query)
    var actionsEl = document.getElementById('ceo-granola-actions-list');
    var actionsRaw = data.actions_raw || '';
    if (actionsRaw && actionsRaw.length > 10) {
      // Split by lines, filter out empty ones, take items that look like action items
      var lines = actionsRaw.split('\\n').filter(function(l) { return l.trim().length > 5; });
      var aHtml = '';
      var count = 0;
      lines.forEach(function(line) {
        line = line.trim();
        if (count >= 8) return;
        // Skip header-like lines
        if (line.startsWith('#') || line.startsWith('---') || line.startsWith('Based on')) return;
        if (line.startsWith('-') || line.startsWith('*') || line.match(/^\\d+\\./)) {
          line = line.replace(/^[-*]\\s*/, '').replace(/^\\d+\\.\\s*/, '');
          aHtml += '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid rgba(0,255,65,0.06)">' +
            '<div style="min-width:6px;height:6px;border-radius:50%;background:rgba(0,255,65,0.4);margin-top:5px"></div>' +
            '<div style="flex:1;color:#a0d8a0;font-size:12px">' + escapeHtml(line) + '</div>' +
            '</div>';
          count++;
        }
      });
      if (aHtml) {
        actionsEl.innerHTML = aHtml;
      } else {
        // Fallback: show raw text truncated
        actionsEl.innerHTML = '<div style="color:#a0d8a0;font-size:12px;white-space:pre-wrap;max-height:200px;overflow:auto">' + escapeHtml(actionsRaw.substring(0, 800)) + '</div>';
      }
    } else {
      actionsEl.innerHTML = '<div style="color:#3a6b3a">No recent action items</div>';
    }

    var statusEl = document.getElementById('ceo-granola-status');
    statusEl.textContent = data._cached ? 'Cached' : 'Live';
    statusEl.style.color = data._cached ? '#ffaa00' : '#00ff41';
  } catch(e) {
    console.error('Granola load error:', e);
    var ml = document.getElementById('ceo-granola-meetings-list');
    if (ml) ml.innerHTML = '<div style="color:#3a6b3a">Failed to load</div>';
    var al = document.getElementById('ceo-granola-actions-list');
    if (al) al.innerHTML = '';
  }
}

function loadOrgAgentGrid() {
  var agents = [
    { id: 'main', name: 'Link', role: 'General / Coordinator', bot: 'linkmaster13bot', color: '#00ff41' },
    { id: 'smith', name: 'Smith', role: 'Backend Dev', bot: 'Smithmanbot', color: '#ff00ff' },
    { id: 'neo', name: 'Neo', role: 'Frontend Dev / Klaviyo', bot: 'neo949bot', color: '#ff6600' },
    { id: 'assistant', name: 'Trinity', role: 'General Assistant', bot: 'trinity949bot', color: '#67e8f9' },
    { id: 'morpheus', name: 'Morpheus', role: 'Task Breakdown', bot: 'Morpheus208bot', color: '#c0a050' },
    { id: 'steve', name: 'Steve', role: 'Sales / Outbound', bot: 'SteveSalesBot', color: '#00bbff' }
  ];
  fetch(BASE + '/api/agents', { credentials: 'same-origin' }).then(function(r) {
    return r.ok ? r.json() : [];
  }).then(function(liveData) {
    var liveMap = {};
    (liveData || []).forEach(function(a) { liveMap[a.agent_id] = a; });
    var html = '';
    agents.forEach(function(ag) {
      var live = liveMap[ag.id];
      var online = live && live.telegram_connected;
      var statusDot = online ? '#10b981' : '#ef4444';
      var statusText = online ? 'Online' : 'Offline';
      var agoText = '';
      if (live && live.last_heartbeat) {
        var ago = Math.round((Date.now() / 1000 - live.last_heartbeat) / 3600);
        agoText = ago < 1 ? 'Active now' : ago + 'h ago';
      }
      html += '<div class="card" style="padding:10px;text-align:center;opacity:' + (online ? '1' : '0.5') + '">';
      html += '<div style="width:40px;height:40px;border-radius:50%;background:' + ag.color + '15;border:2px solid ' + ag.color + (online ? '' : '40') + ';display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:16px;font-weight:700;color:' + ag.color + '">' + ag.name.charAt(0) + '</div>';
      html += '<div style="font-size:13px;font-weight:600;color:' + ag.color + '">' + ag.name + '</div>';
      html += '<div style="font-size:10px;color:#6b7280;margin-bottom:4px">' + ag.role + '</div>';
      html += '<div style="display:flex;align-items:center;justify-content:center;gap:4px">';
      html += '<span style="width:6px;height:6px;border-radius:50%;background:' + statusDot + ';display:inline-block;box-shadow:0 0 4px ' + statusDot + '80"></span>';
      html += '<span style="font-size:9px;color:' + statusDot + '">' + statusText + '</span>';
      if (agoText) html += '<span style="font-size:9px;color:#6b7280;margin-left:2px">(' + agoText + ')</span>';
      html += '</div>';
      html += '<div style="font-size:8px;color:#4a4a4a;font-family:monospace;margin-top:3px">@' + ag.bot + '</div>';
      html += '</div>';
    });
    var el = document.getElementById('org-agent-grid');
    if (el) el.innerHTML = html;
  }).catch(function() {
    // Fallback: render without live status
    var html = '';
    agents.forEach(function(ag) {
      html += '<div class="card" style="padding:10px;text-align:center">';
      html += '<div style="width:40px;height:40px;border-radius:50%;background:' + ag.color + '15;border:2px solid ' + ag.color + ';display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:16px;font-weight:700;color:' + ag.color + '">' + ag.name.charAt(0) + '</div>';
      html += '<div style="font-size:13px;font-weight:600;color:' + ag.color + '">' + ag.name + '</div>';
      html += '<div style="font-size:10px;color:#6b7280">' + ag.role + '</div>';
      html += '</div>';
    });
    var el = document.getElementById('org-agent-grid');
    if (el) el.innerHTML = html;
  });
}

async function loadCeoData() {
  // Load all CEO data in parallel
  var results = await Promise.allSettled([
    fetch(BASE + '/api/stripe/mrr', { credentials: 'same-origin' }).then(function(r) {
      if (r.status === 401) { showLogin(); return null; }
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/stripe/churn', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/hubspot/pipeline-analytics', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/agent-ops', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/hubspot/team-performance', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/stripe/new-deal-cash', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
    fetch(BASE + '/api/personal-pulse', { credentials: 'same-origin' }).then(function(r) {
      if (!r.ok) return null;
      return r.json();
    }),
  ]);

  var mrrData = results[0].status === 'fulfilled' ? results[0].value : null;
  var churnData = results[1].status === 'fulfilled' ? results[1].value : null;
  var pipelineData = results[2].status === 'fulfilled' ? results[2].value : null;
  var agentOpsData = results[3].status === 'fulfilled' ? results[3].value : null;
  var hsTeamData = results[4].status === 'fulfilled' ? results[4].value : null;
  var newDealData = results[5].status === 'fulfilled' ? results[5].value : null;
  var pulseData = results[6].status === 'fulfilled' ? results[6].value : null;

  // --- ROW 1: Revenue metrics ---
  if (mrrData && !mrrData.error) {
    document.getElementById('ceo-mrr').textContent = ceoFmtUsd(mrrData.mrr);
    var growthCls = mrrData.growth_pct > 0 ? 'up' : mrrData.growth_pct < 0 ? 'down' : 'flat';
    var growthSign = mrrData.growth_pct > 0 ? '+' : '';
    document.getElementById('ceo-mrr-delta').className = 'sales-metric-delta ' + growthCls;
    document.getElementById('ceo-mrr-delta').textContent = growthSign + mrrData.growth_pct + '% vs last month';
    document.getElementById('ceo-active-subs').textContent = String(mrrData.active_subs);
    document.getElementById('ceo-active-subs-sub').textContent = mrrData.active_subs + ' active subscriptions';
    document.getElementById('ceo-new-clients').textContent = String(mrrData.new_this_month);
    document.getElementById('ceo-new-clients-sub').textContent = 'new this month';
    document.getElementById('ceo-new-clients-sub').className = 'sales-metric-delta ' + (mrrData.new_this_month > 0 ? 'up' : 'flat');
  } else {
    document.getElementById('ceo-mrr').textContent = '-';
    document.getElementById('ceo-mrr').style.fontSize = '18px';
    document.getElementById('ceo-mrr-delta').textContent = mrrData && mrrData.error ? mrrData.error : 'Stripe not configured';
    document.getElementById('ceo-mrr-delta').className = 'sales-metric-delta flat';
  }

  if (churnData && !churnData.error) {
    document.getElementById('ceo-churn-rate').textContent = churnData.churn_rate_pct + '%';
    var churnColor = churnData.churn_rate_pct > 5 ? 'down' : churnData.churn_rate_pct > 2 ? 'flat' : 'up';
    document.getElementById('ceo-churn-rate').style.color = churnData.churn_rate_pct > 5 ? '#ff3333' : churnData.churn_rate_pct > 2 ? '#ffaa00' : '#00ff41';
    document.getElementById('ceo-churn-sub').textContent = churnData.churned_count + ' churned (' + ceoFmtUsd(churnData.churned_revenue) + ')';
    document.getElementById('ceo-churn-sub').className = 'sales-metric-delta ' + churnColor;
  } else {
    document.getElementById('ceo-churn-rate').textContent = '-';
    document.getElementById('ceo-churn-sub').textContent = '';
  }

  // MRR Trend Chart (show current vs last month as simple comparison)
  if (mrrData && !mrrData.error) {
    var mrrCtx = document.getElementById('ceo-mrr-chart').getContext('2d');
    if (ceoMrrChart) ceoMrrChart.destroy();
    ceoMrrChart = new Chart(mrrCtx, {
      type: 'bar',
      data: {
        labels: ['Last Month', 'Current'],
        datasets: [{
          label: 'MRR',
          data: [mrrData.mrr_last_month, mrrData.mrr],
          backgroundColor: ['rgba(0,255,65,0.15)', 'rgba(0,255,65,0.4)'],
          borderColor: ['#00cc33', '#00ff41'],
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#3a6b3a', callback: function(v) { return '$' + v.toLocaleString(); }, font: { family: 'Courier New' } },
            grid: { color: 'rgba(0,255,65,0.06)' }
          },
          x: {
            ticks: { color: '#4a8a4a', font: { family: 'Courier New', size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // --- ROW 2: Pipeline Health ---
  if (pipelineData && !pipelineData.error) {
    document.getElementById('ceo-days-to-close').textContent = pipelineData.avg_days_to_close + 'd';
    var coverage = pipelineData.pipeline_coverage;
    document.getElementById('ceo-pipeline-coverage').textContent = coverage.toFixed(1) + 'x';
    var coverageColor = coverage >= 3 ? '#00ff41' : coverage >= 1.5 ? '#ffaa00' : '#ff3333';
    document.getElementById('ceo-pipeline-coverage').style.color = coverageColor;
    document.getElementById('ceo-coverage-sub').textContent = ceoFmtUsd(pipelineData.open_pipeline_value) + ' pipeline';
    document.getElementById('ceo-win-rate').textContent = pipelineData.conversion_rates.meeting_to_close + '%';

    // Pipeline bar chart by stage
    if (pipelineData.stages && pipelineData.stages.length > 0) {
      var pipeCtx = document.getElementById('ceo-pipeline-chart').getContext('2d');
      if (ceoPipelineChart) ceoPipelineChart.destroy();
      ceoPipelineChart = new Chart(pipeCtx, {
        type: 'bar',
        data: {
          labels: pipelineData.stages.map(function(s) { return s.name; }),
          datasets: [{
            label: 'Pipeline Value',
            data: pipelineData.stages.map(function(s) { return s.value; }),
            backgroundColor: 'rgba(0,255,65,0.25)',
            borderColor: '#00ff41',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: '#3a6b3a', callback: function(v) { return '$' + ceoFmtK(v); }, font: { family: 'Courier New', size: 10 } },
              grid: { color: 'rgba(0,255,65,0.06)' }
            },
            y: {
              ticks: { color: '#4a8a4a', font: { family: 'Courier New', size: 10 } },
              grid: { display: false }
            }
          }
        }
      });
    }
  } else {
    document.getElementById('ceo-days-to-close').textContent = '-';
    document.getElementById('ceo-pipeline-coverage').textContent = '-';
    document.getElementById('ceo-win-rate').textContent = '-';
  }

  // Revenue per rep chart (from HubSpot team data, falls back to pipeline stages)
  if (hsTeamData && !hsTeamData.error && hsTeamData.reps) {
    var repsWithRev = hsTeamData.reps.filter(function(r) { return r.revenueWon > 0; }).sort(function(a, b) { return b.revenueWon - a.revenueWon; });
    var repsWithPipeline = hsTeamData.reps.filter(function(r) { return r.openPipelineValue > 0; }).sort(function(a, b) { return b.openPipelineValue - a.openPipelineValue; });

    var chartLabels, chartValues, chartLabel;
    if (repsWithRev.length >= 1) {
      chartLabels = repsWithRev.map(function(r) { return r.name; });
      chartValues = repsWithRev.map(function(r) { return r.revenueWon; });
      chartLabel = 'Revenue Won';
    } else if (repsWithPipeline.length >= 1) {
      chartLabels = repsWithPipeline.map(function(r) { return r.name; });
      chartValues = repsWithPipeline.map(function(r) { return r.openPipelineValue; });
      chartLabel = 'Open Pipeline';
    } else if (pipelineData && pipelineData.stages && pipelineData.stages.length > 0) {
      // Fall back to pipeline stage breakdown when no per-rep data
      var sortedStages = pipelineData.stages.slice().sort(function(a, b) { return b.value - a.value; });
      chartLabels = sortedStages.map(function(s) { return s.name; });
      chartValues = sortedStages.map(function(s) { return s.value; });
      chartLabel = 'Pipeline by Stage';
    } else {
      chartLabels = null;
    }

    if (chartLabels && chartLabels.length > 0) {
      var repEl = document.getElementById('ceo-rev-per-rep-chart');
      if (!repEl) return;
      var repCtx = repEl.getContext('2d');
      if (ceoRevPerRepChart) ceoRevPerRepChart.destroy();
      ceoRevPerRepChart = new Chart(repCtx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: chartLabel,
            data: chartValues,
            backgroundColor: chartValues.map(function(v, i) { return i === 0 ? 'rgba(0,255,65,0.4)' : 'rgba(0,255,65,0.2)'; }),
            borderColor: '#00ff41',
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, title: { display: true, text: chartLabel, color: '#4a8a4a', font: { family: 'Courier New', size: 11 } } },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: '#3a6b3a', callback: function(v) { return '$' + ceoFmtK(v); }, font: { family: 'Courier New', size: 10 } },
              grid: { color: 'rgba(0,255,65,0.06)' }
            },
            y: {
              ticks: { color: '#4a8a4a', font: { family: 'Courier New', size: 10 } },
              grid: { display: false }
            }
          }
        }
      });
    } else {
      var repWrap = document.getElementById('ceo-rev-per-rep-wrap');
      if (repWrap) repWrap.innerHTML = '<div style="color:#3a6b3a;font-size:12px;padding:20px;text-align:center">No revenue data yet this month</div>';
    }

  } else {
    var repWrap2 = document.getElementById('ceo-rev-per-rep-wrap');
    if (repWrap2) repWrap2.innerHTML = '<div style="color:#3a6b3a;font-size:12px;padding:20px;text-align:center">HubSpot not configured</div>';
  }

  // Cash collected vs monthly target (from Stripe first-time payments)
  if (newDealData && !newDealData.error) {
    var cashCollected = newDealData.cash_collected || 0;
    var cashTarget = newDealData.target || 25000000;
    var pct = cashTarget > 0 ? Math.min(100, (cashCollected / cashTarget) * 100) : 0;
    var barColor = pct >= 80 ? '#00ff41' : pct >= 50 ? '#ffaa00' : '#ff3333';
    var newDealCount = newDealData.new_sub_count || 0;
    document.getElementById('ceo-cash-target').innerHTML =
      '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">' +
      '<span style="color:#a0d8a0">Collected: <span style="color:#00ff41;font-weight:600">' + ceoFmtUsd(cashCollected / 100) + '</span></span>' +
      '<span style="color:#4a8a4a">Goal: ' + ceoFmtUsd(cashTarget / 100) + '</span>' +
      '</div>' +
      '<div class="hs-progress-bar" style="height:10px;border-radius:5px">' +
      '<div class="hs-progress-fill" style="width:' + pct.toFixed(1) + '%;background:' + barColor + ';box-shadow:0 0 8px ' + barColor + '40;border-radius:5px"></div>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:11px;margin-top:4px">' +
      '<span style="color:#4a8a4a">' + newDealCount + ' new deal' + (newDealCount !== 1 ? 's' : '') + ' closed</span>' +
      '<span style="color:' + barColor + ';font-weight:600">' + pct.toFixed(0) + '% of goal</span>' +
      '</div>';

    // Show top new deals
    if (newDealData.top_new_deals && newDealData.top_new_deals.length > 0) {
      var dealsHtml = '<div style="margin-top:10px;border-top:1px solid rgba(0,255,65,0.08);padding-top:8px">';
      dealsHtml += '<div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Top New Deals (MRR)</div>';
      newDealData.top_new_deals.slice(0, 5).forEach(function(d) {
        dealsHtml += '<div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;border-bottom:1px solid rgba(0,255,65,0.04)">' +
          '<span style="color:#a0d8a0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%">' + (d.name || 'Unknown') + '</span>' +
          '<span style="color:#00ff41;font-weight:600">' + ceoFmtUsd(d.amount / 100) + '/mo</span>' +
          '</div>';
      });
      dealsHtml += '</div>';
      document.getElementById('ceo-cash-target').innerHTML += dealsHtml;
    }
  } else {
    var cashEl = document.getElementById('ceo-cash-target');
    if (cashEl) cashEl.innerHTML = '<div style="color:#3a6b3a;font-size:12px">Loading new deal data...</div>';
  }

  // --- ROW 3: Overdue tasks from HubSpot ---
  if (hsTeamData && !hsTeamData.error) {
    var overdueCount = (hsTeamData.overdueDeals || []).length;
    document.getElementById('ceo-overdue-tasks').textContent = String(overdueCount);
    if (overdueCount > 0) {
      document.getElementById('ceo-overdue-tasks').style.color = '#ff4444';
    }
  }

  // --- Personal Pulse ---
  if (pulseData) {
    var cal = pulseData.calendar;
    var email = pulseData.email;

    // Meeting count KPI
    if (cal) {
      document.getElementById('ceo-meetings-count').textContent = String(cal.meeting_count || 0);
    }

    // Unread email count KPI
    if (email) {
      document.getElementById('ceo-unread-count').textContent = String(email.unread_count || 0);
    }

    // Upcoming schedule
    var eventsEl = document.getElementById('ceo-upcoming-events');
    if (cal && cal.events && cal.events.length > 0) {
      var evHtml = '';
      cal.events.forEach(function(ev) {
        var startStr = '';
        if (ev.start) {
          try {
            var d = new Date(ev.start);
            var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            var hrs = d.getHours();
            var mins = d.getMinutes();
            var ampm = hrs >= 12 ? 'pm' : 'am';
            hrs = hrs % 12 || 12;
            var minStr = mins < 10 ? '0' + mins : String(mins);
            startStr = dayNames[d.getDay()] + ' ' + hrs + ':' + minStr + ampm;
          } catch(e) { startStr = ev.start; }
        }
        evHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(0,255,65,0.06)">' +
          '<span style="color:#a0d8a0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:65%">' + escapeHtml(ev.summary || ev.title || 'No title') + '</span>' +
          '<span style="color:#4a8a4a;font-size:11px;white-space:nowrap">' + escapeHtml(startStr) + '</span>' +
          '</div>';
      });
      eventsEl.innerHTML = evHtml;
    } else {
      eventsEl.innerHTML = '<div style="color:#3a6b3a">No upcoming meetings</div>';
    }

    // Recent unread emails
    var unreadEl = document.getElementById('ceo-unread-list');
    if (email && email.unread && email.unread.length > 0) {
      var emHtml = '';
      email.unread.forEach(function(m) {
        var fromName = m.from || 'Unknown';
        // Shorten "Name <email>" to just the name
        var ltIdx = fromName.indexOf('<');
        if (ltIdx > 0) fromName = fromName.substring(0, ltIdx).trim();
        if (fromName.length > 25) fromName = fromName.substring(0, 22) + '...';
        emHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(0,255,65,0.06)">' +
          '<div style="overflow:hidden;max-width:65%">' +
          '<div style="color:#a0d8a0;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(fromName) + '</div>' +
          '<div style="color:#3a6b3a;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(m.subject || '(no subject)') + '</div>' +
          '</div>' +
          '<span style="color:#2a4a2a;font-size:10px;white-space:nowrap">' + escapeHtml(m.time || '') + '</span>' +
          '</div>';
      });
      unreadEl.innerHTML = emHtml;
    } else {
      unreadEl.innerHTML = '<div style="color:#3a6b3a">Inbox zero</div>';
    }

    // Last updated timestamp (use the most recent of calendar or email update)
    var updatedEl = document.getElementById('ceo-pulse-updated');
    var lastUpdated = Math.max(pulseData.calendar_updated || 0, pulseData.email_updated || 0);
    if (lastUpdated > 0) {
      try {
        var upd = new Date(lastUpdated * 1000);
        var now = new Date();
        var diffMin = Math.round((now.getTime() - upd.getTime()) / 60000);
        var agoStr = diffMin < 1 ? 'just now' : diffMin < 60 ? diffMin + 'm ago' : Math.round(diffMin / 60) + 'h ago';
        updatedEl.textContent = 'Updated ' + agoStr;
      } catch(e) { updatedEl.textContent = ''; }
    }
  } else {
    var meetingsEl = document.getElementById('ceo-meetings-count');
    if (meetingsEl) meetingsEl.textContent = '-';
    var unreadCntEl = document.getElementById('ceo-unread-count');
    if (unreadCntEl) unreadCntEl.textContent = '-';
    var evEl = document.getElementById('ceo-upcoming-events');
    if (evEl) evEl.innerHTML = '<div style="color:#3a6b3a;font-size:12px">Pulse data not available</div>';
    var emEl = document.getElementById('ceo-unread-list');
    if (emEl) emEl.innerHTML = '<div style="color:#3a6b3a;font-size:12px">Pulse data not available</div>';
  }

  // --- WHOOP Health Data ---
  loadWhoopData();

  // --- Granola Meeting Notes ---
  loadGranolaData();

  // --- Agent Operations ---
  if (agentOpsData && !agentOpsData.error && agentOpsData.agents) {
    var agents = agentOpsData.agents;
    var totalCost = 0;
    var totalMem = 0;
    var bodyHtml = '';
    agents.forEach(function(a) {
      totalCost += a.cost_today;
      totalMem += a.memory_count;
      bodyHtml += '<tr>' +
        '<td style="font-weight:600;color:#00ff41">' + (a.id === 'main' ? 'Link' : a.id.charAt(0).toUpperCase() + a.id.slice(1)) + '</td>' +
        '<td class="num" style="font-family:Courier New,monospace">' + ceoFmtK(a.tokens_today) + '</td>' +
        '<td class="num" style="font-family:Courier New,monospace">' + ceoFmtUsd(a.cost_today) + '</td>' +
        '<td class="num">' + a.turns_today + '</td>' +
        '<td class="num">' + a.memory_count + '</td>' +
        '</tr>';
    });
    if (!bodyHtml) bodyHtml = '<tr><td colspan="5" style="text-align:center;color:#3a6b3a;padding:20px">No agent data</td></tr>';
    document.getElementById('ceo-agent-ops-body').innerHTML = bodyHtml;
    document.getElementById('ceo-total-cost-today').textContent = ceoFmtUsd(totalCost);
    document.getElementById('ceo-total-memories').textContent = String(totalMem);
  }
}

// ── Database Explorer ───────────────────────────────────────────────
let dbTablesLoaded = false;
let dbTables = [];
let dbActiveTable = '';
let dbCurrentPage = 1;
let dbTotalPages = 1;
let dbSortCol = '';
let dbSortOrder = 'asc';

async function loadDbTables() {
  try {
    const data = await api('/api/db/tables');
    dbTables = data.tables || [];
    dbTablesLoaded = true;
    const list = document.getElementById('db-table-list');
    if (dbTables.length === 0) {
      list.innerHTML = '<div style="padding:8px 14px;color:#555;font-size:12px">No tables found</div>';
      return;
    }
    list.innerHTML = dbTables.map(function(t) {
      return '<div class="db-sidebar-item" data-table="' + escapeHtml(t.name) + '" onclick="dbSelectTable(this.dataset.table)"><span>' + escapeHtml(t.name) + '</span><span class="db-sidebar-count">' + t.rowCount.toLocaleString() + '</span></div>';
    }).join('');
    // Auto-select first table
    dbSelectTable(dbTables[0].name);
  } catch (err) {
    document.getElementById('db-table-list').innerHTML = '<div style="padding:8px 14px;color:#f87171;font-size:12px">Error loading tables</div>';
  }
}

function dbSelectTable(name) {
  dbActiveTable = name;
  dbCurrentPage = 1;
  dbSortCol = '';
  dbSortOrder = 'asc';
  // Update sidebar active state
  document.querySelectorAll('.db-sidebar-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.table === name);
  });
  loadDbTableData();
}

async function loadDbTableData() {
  if (!dbActiveTable) return;
  var params = '?page=' + dbCurrentPage + '&limit=50';
  if (dbSortCol) params += '&sort=' + encodeURIComponent(dbSortCol) + '&order=' + dbSortOrder;
  try {
    const data = await api('/api/db/tables/' + encodeURIComponent(dbActiveTable) + params);
    dbTotalPages = data.pages || 1;
    dbCurrentPage = data.page || 1;
    renderDbGrid(data.columns, data.rows, true);
    // Update pagination
    var pag = document.getElementById('db-pagination');
    pag.style.display = '';
    document.getElementById('db-row-info').textContent = data.total.toLocaleString() + ' rows';
    document.getElementById('db-page-info').textContent = 'Page ' + dbCurrentPage + ' of ' + dbTotalPages;
    document.getElementById('db-prev-btn').disabled = dbCurrentPage <= 1;
    document.getElementById('db-next-btn').disabled = dbCurrentPage >= dbTotalPages;
  } catch (err) {
    document.getElementById('db-grid-body').innerHTML = '<tr><td style="padding:20px;color:#f87171">Error loading data</td></tr>';
  }
}

function renderDbGrid(columns, rows, sortable) {
  var head = document.getElementById('db-grid-head');
  var body = document.getElementById('db-grid-body');
  if (!columns || columns.length === 0) {
    head.innerHTML = '';
    body.innerHTML = '<tr><td style="padding:20px;color:#555">No data</td></tr>';
    return;
  }
  head.innerHTML = '<tr>' + columns.map(function(col) {
    var isSorted = sortable && dbSortCol === col;
    var arrow = isSorted ? (dbSortOrder === 'asc' ? '&#9650;' : '&#9660;') : '&#9650;';
    var cls = isSorted ? 'sorted' : '';
    var onclick = sortable ? ' data-col="' + escapeHtml(col) + '" onclick="dbToggleSort(this.dataset.col)"' : '';
    return '<th class="' + cls + '"' + onclick + '>' + escapeHtml(col) + '<span class="sort-arrow">' + arrow + '</span></th>';
  }).join('') + '</tr>';
  if (rows.length === 0) {
    body.innerHTML = '<tr><td colspan="' + columns.length + '" style="padding:20px;color:#555;text-align:center">Empty table</td></tr>';
    return;
  }
  body.innerHTML = rows.map(function(row) {
    return '<tr>' + columns.map(function(col) {
      var val = row[col];
      if (val === null || val === undefined) return '<td class="null-val">NULL</td>';
      var s = String(val);
      if (s.length > 200) s = s.substring(0, 200) + '...';
      return '<td title="' + escapeHtml(String(val)).replace(/"/g, '&quot;') + '">' + escapeHtml(s) + '</td>';
    }).join('') + '</tr>';
  }).join('');
}

function dbToggleSort(col) {
  if (dbSortCol === col) {
    dbSortOrder = dbSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    dbSortCol = col;
    dbSortOrder = 'asc';
  }
  dbCurrentPage = 1;
  loadDbTableData();
}

function dbPrevPage() {
  if (dbCurrentPage > 1) { dbCurrentPage--; loadDbTableData(); }
}

function dbNextPage() {
  if (dbCurrentPage < dbTotalPages) { dbCurrentPage++; loadDbTableData(); }
}

async function dbRunQuery() {
  var sql = document.getElementById('db-query-input').value.trim();
  if (!sql) return;
  var errEl = document.getElementById('db-query-error');
  var statusEl = document.getElementById('db-query-status');
  errEl.style.display = 'none';
  statusEl.textContent = 'Running...';
  try {
    var data = await api('/api/db/query?sql=' + encodeURIComponent(sql));
    if (data.error) {
      errEl.textContent = data.error;
      errEl.style.display = '';
      statusEl.textContent = '';
      return;
    }
    statusEl.textContent = data.rowCount + ' row' + (data.rowCount !== 1 ? 's' : '') + ' returned';
    document.getElementById('db-pagination').style.display = 'none';
    renderDbGrid(data.columns, data.rows, false);
  } catch (err) {
    errEl.textContent = 'Request failed';
    errEl.style.display = '';
    statusEl.textContent = '';
  }
}

// \u2500\u2500 Chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let chatOpen = false;
let chatSSE = null;
let chatHistoryLoaded = false;
let unreadCount = 0;
let chatAgents = [];
let activeAgentTab = 'all';

function openChat() {
  chatOpen = true;
  unreadCount = 0;
  updateFabBadge();
  document.getElementById('chat-overlay').classList.add('open');
  if (!chatHistoryLoaded) loadChatHistory();
  loadAgentTabs();
  loadSessionInfo();
  connectChatSSE();
  setTimeout(() => document.getElementById('chat-input').focus(), 350);
}

function closeChat() {
  chatOpen = false;
  document.getElementById('chat-overlay').classList.remove('open');
}

function updateFabBadge() {
  const badge = document.getElementById('chat-fab-badge');
  if (unreadCount > 0) {
    badge.style.display = 'flex';
    badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
  } else {
    badge.style.display = 'none';
  }
}

// Agent Tabs
async function loadAgentTabs() {
  try {
    const data = await api('/api/agents');
    chatAgents = data.agents || [];
    const container = document.getElementById('chat-agent-tabs');
    container.innerHTML = '';
    const allTab = document.createElement('button');
    allTab.className = 'chat-agent-tab' + (activeAgentTab === 'all' ? ' active' : '');
    allTab.textContent = 'All';
    allTab.onclick = function() { switchAgentTab('all', this); };
    container.appendChild(allTab);
    chatAgents.forEach(function(a) {
      const tab = document.createElement('button');
      tab.className = 'chat-agent-tab' + (activeAgentTab === a.id ? ' active' : '');
      const dot = document.createElement('span');
      dot.className = 'agent-dot ' + (a.running ? 'live' : 'dead');
      tab.appendChild(dot);
      tab.appendChild(document.createTextNode(a.id.charAt(0).toUpperCase() + a.id.slice(1)));
      tab.onclick = function() { switchAgentTab(a.id, this); };
      container.appendChild(tab);
    });
  } catch(e) { console.error('Agent tabs error', e); }
}

function switchAgentTab(agentId, el) {
  activeAgentTab = agentId;
  document.querySelectorAll('.chat-agent-tab').forEach(function(t) { t.classList.remove('active'); });
  if (el) el.classList.add('active');
  chatHistoryLoaded = false;
  loadChatHistory();
  loadSessionInfo();
}

// Session Info
async function loadSessionInfo() {
  try {
    const agentId = activeAgentTab === 'all' ? 'main' : activeAgentTab;
    const [health, tokens] = await Promise.all([
      api('/api/health?chatId=' + CHAT_ID),
      api('/api/agents/' + agentId + '/tokens'),
    ]);
    document.getElementById('sess-ctx').textContent = (health.contextPct || 0) + '%';
    document.getElementById('sess-turns').textContent = health.turns || tokens.todayTurns || '0';
    var sessTokens = (tokens.todayInput || 0) + (tokens.todayOutput || 0);
    document.getElementById('sess-cost').textContent = sessTokens > 1000 ? Math.round(sessTokens / 1000) + 'k' : sessTokens.toString();
    document.getElementById('sess-model').textContent = health.model || agentId;
  } catch(e) { console.error('Session info error', e); }
}

// Quick Actions
function sendQuickAction(cmd) {
  var input = document.getElementById('chat-input');
  input.value = cmd;
  sendChatMessage();
}

async function loadChatHistory() {
  if (!CHAT_ID) return;
  try {
    var url = '/api/chat/history?chatId=' + CHAT_ID + '&limit=40';
    if (activeAgentTab !== 'all') {
      url = '/api/agents/' + activeAgentTab + '/conversation?chatId=' + CHAT_ID + '&limit=40';
    }
    const data = await api(url);
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';
    if (data.turns && data.turns.length > 0) {
      // Reverse: API returns newest first, we want oldest first
      const turns = data.turns.slice().reverse();
      turns.forEach(t => appendChatBubble(t.role, t.content, t.source, false));
    }
    chatHistoryLoaded = true;
    scrollChatBottom();
  } catch(e) {
    console.error('Chat history load error', e);
  }
}

function connectChatSSE() {
  if (chatSSE) { chatSSE.close(); chatSSE = null; }
  const url = BASE + '/api/chat/stream?token=' + TOKEN;
  chatSSE = new EventSource(url);

  chatSSE.addEventListener('user_message', function(e) {
    const ev = JSON.parse(e.data);
    appendChatBubble('user', ev.content, ev.source, true);
    if (!chatOpen) { unreadCount++; updateFabBadge(); }
  });

  chatSSE.addEventListener('assistant_message', function(e) {
    const ev = JSON.parse(e.data);
    appendChatBubble('assistant', ev.content, ev.source, true);
    hideTyping();
    if (!chatOpen) { unreadCount++; updateFabBadge(); }
    if (chatOpen) loadSessionInfo();
  });

  chatSSE.addEventListener('processing', function(e) {
    const ev = JSON.parse(e.data);
    if (ev.processing) showTyping(); else hideTyping();
  });

  chatSSE.addEventListener('progress', function(e) {
    const ev = JSON.parse(e.data);
    showProgress(ev.description);
  });

  chatSSE.addEventListener('error', function(e) {
    // SSE error event
    try {
      const ev = JSON.parse(e.data);
      appendChatBubble('assistant', ev.content || 'Error', 'system', true);
    } catch {}
    hideTyping();
  });

  chatSSE.addEventListener('ping', function() { /* keepalive */ });

  chatSSE.onerror = function() {
    // Auto-reconnect handled by EventSource
    updateChatStatus(false);
    setTimeout(() => updateChatStatus(true), 3000);
  };

  chatSSE.onopen = function() { updateChatStatus(true); };
}

function updateChatStatus(connected) {
  const dot = document.getElementById('chat-status-dot');
  dot.style.background = connected ? '#22c55e' : '#ef4444';
}

function appendChatBubble(role, content, source, scroll) {
  const container = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant');
  bubble.innerHTML = role === 'assistant' ? renderMarkdown(content) : escapeHtml(content);
  if (source && source !== 'telegram' && source !== 'dashboard') {
    const srcBadge = document.createElement('div');
    srcBadge.className = 'chat-bubble-source';
    srcBadge.textContent = source.charAt(0).toUpperCase() + source.slice(1);
    bubble.appendChild(srcBadge);
  }
  container.appendChild(bubble);
  if (scroll) scrollChatBottom();
}

function showTyping() {
  const bar = document.getElementById('chat-progress-bar');
  const label = document.getElementById('chat-progress-label');
  if (bar) { bar.classList.add('active'); }
  if (label) { label.textContent = 'Thinking...'; }
  scrollChatBottom();
}

function hideTyping() {
  const bar = document.getElementById('chat-progress-bar');
  if (bar) { bar.classList.remove('active'); }
}

function showProgress(desc) {
  const bar = document.getElementById('chat-progress-bar');
  const label = document.getElementById('chat-progress-label');
  if (bar) { bar.classList.add('active'); }
  if (label) { label.textContent = desc; }
  scrollChatBottom();
}

function scrollChatBottom() {
  const container = document.getElementById('chat-messages');
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
}

function renderMarkdown(text) {
  if (!text) return '';
  var preserved = [];
  function preserve(html) { preserved.push(html); return '%%BLOCK' + (preserved.length - 1) + '%%'; }

  var s = text;

  // Code blocks: ` + '```' + `...` + '```' + `
  s = s.replace(/` + '`' + '`' + '`' + `(?:\\w*\\n)?([\\s\\S]*?)` + '`' + '`' + '`' + `/g, function(_, code) {
    return preserve('<pre><code>' + escapeHtml(code.trim()) + '<\\/code><\\/pre>');
  });

  // Tables: consecutive lines starting and ending with |
  var lines = s.split('\\n');
  var result = [];
  var tableLines = [];

  function flushTable() {
    if (tableLines.length < 2) {
      result.push.apply(result, tableLines);
      tableLines = [];
      return;
    }
    var html = '<table>';
    var headerDone = false;
    tableLines.forEach(function(row) {
      var trimmed = row.trim();
      if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) { result.push(row); return; }
      // Skip separator rows
      if (/^[\\|\\s\\-:]+$/.test(trimmed)) { headerDone = true; return; }
      var cells = trimmed.split('|').slice(1, -1);
      var tag = !headerDone ? 'th' : 'td';
      html += '<tr>';
      cells.forEach(function(c) { html += '<' + tag + '>' + escapeHtml(c.trim()) + '<\\/' + tag + '>'; });
      html += '<\\/tr>';
      if (!headerDone) headerDone = true;
    });
    html += '<\\/table>';
    result.push(preserve(html));
    tableLines = [];
  }

  lines.forEach(function(line) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      tableLines.push(line);
    } else {
      if (tableLines.length > 0) flushTable();
      result.push(line);
    }
  });
  if (tableLines.length > 0) flushTable();

  s = result.join('\\n');

  // Inline code (preserve before escaping)
  var codeBlocks = [];
  s = s.replace(/` + '`' + `([^` + '`' + `]+?)` + '`' + `/g, function(_, code) {
    codeBlocks.push('<code>' + escapeHtml(code) + '<\\/code>');
    return '%%CODE' + (codeBlocks.length - 1) + '%%';
  });
  // Bold (preserve before escaping)
  var bolds = [];
  s = s.replace(/\\*\\*([^*]+)\\*\\*/g, function(_, t) {
    bolds.push('<b>' + escapeHtml(t) + '<\\/b>');
    return '%%BOLD' + (bolds.length - 1) + '%%';
  });
  // Italic
  var italics = [];
  s = s.replace(/\\*([^*]+)\\*/g, function(_, t) {
    italics.push('<i>' + escapeHtml(t) + '<\\/i>');
    return '%%ITAL' + (italics.length - 1) + '%%';
  });
  // Escape remaining HTML
  s = escapeHtml(s);
  // Restore formatting
  s = s.replace(/%%CODE(\\d+)%%/g, function(_, i) { return codeBlocks[parseInt(i)]; });
  s = s.replace(/%%BOLD(\\d+)%%/g, function(_, i) { return bolds[parseInt(i)]; });
  s = s.replace(/%%ITAL(\\d+)%%/g, function(_, i) { return italics[parseInt(i)]; });
  // Line breaks
  s = s.replace(/\\n/g, '<br>');
  // Restore preserved blocks
  s = s.replace(/%%BLOCK(\\d+)%%/g, function(_, i) { return preserved[parseInt(i)]; });
  return s;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  autoResizeInput();
  // Disable send while processing
  document.getElementById('chat-send-btn').disabled = true;
  try {
    await fetch(BASE + '/api/chat/send?token=' + TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
  } catch(e) {
    console.error('Send error', e);
  }
  // Re-enable after a short delay (SSE will deliver the actual messages)
  setTimeout(() => { document.getElementById('chat-send-btn').disabled = false; }, 1000);
}

function autoResizeInput() {
  const el = document.getElementById('chat-input');
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

async function abortProcessing() {
  try {
    await fetch(BASE + '/api/chat/abort?token=' + TOKEN, { method: 'POST' });
  } catch(e) { console.error('Abort error', e); }
}

// ── Supabase Explorer ───────────────────────────────────────────────
var sbTablesLoaded = false;
var sbCurrentTable = '';
var sbCurrentPage = 1;
var sbTotalPages = 1;
var sbCurrentSort = '';
var sbCurrentOrder = 'asc';
var sbCurrentColumns = [];
var sbTableRowCounts = {};
var sbAddFormVisible = false;

async function loadSbTables() {
  try {
    var data = await api('/api/supabase/tables');
    if (data.error) {
      document.getElementById('sb-table-list').innerHTML = '<div style="padding:8px 14px;color:#f87171;font-size:12px">' + data.error + '</div>';
      return;
    }
    var tables = data.tables || [];
    // Fetch row counts in the background for each table
    tables.forEach(function(t) {
      api('/api/supabase/tables/' + encodeURIComponent(t.name) + '?page=1&limit=1').then(function(d) {
        if (d && typeof d.rowCount === 'number') {
          sbTableRowCounts[t.name] = d.rowCount;
          var badge = document.getElementById('sb-count-' + t.name.replace(/[^a-zA-Z0-9_]/g, '_'));
          if (badge) badge.textContent = d.rowCount;
        }
      }).catch(function(){});
    });
    var html = '';
    tables.forEach(function(t) {
      var safeId = t.name.replace(/[^a-zA-Z0-9_]/g, '_');
      html += '<div class="db-sidebar-item' + (t.name === sbCurrentTable ? ' active' : '') + '" onclick="loadSbTable(\\''+t.name+'\\')"><span>'+t.name+'</span><span class="sb-row-count" id="sb-count-'+safeId+'">&middot;</span></div>';
    });
    document.getElementById('sb-table-list').innerHTML = html || '<div style="padding:8px 14px;color:#555;font-size:12px">No tables found</div>';
    sbTablesLoaded = true;
  } catch(e) {
    document.getElementById('sb-table-list').innerHTML = '<div style="padding:8px 14px;color:#f87171;font-size:12px">Failed to connect to Supabase</div>';
  }
}

async function loadSbTable(name, page, sort, order) {
  sbCurrentTable = name;
  sbCurrentPage = page || 1;
  if (sort !== undefined) sbCurrentSort = sort;
  if (order !== undefined) sbCurrentOrder = order;

  // Highlight active table in sidebar
  document.querySelectorAll('#sb-sidebar .db-sidebar-item').forEach(function(el) {
    var elName = el.querySelector('span') ? el.querySelector('span').textContent.trim() : el.textContent.trim();
    el.classList.toggle('active', elName === name);
  });

  var qs = 'page=' + sbCurrentPage + '&limit=50';
  if (sbCurrentSort) qs += '&sort=' + sbCurrentSort + '&order=' + sbCurrentOrder;

  try {
    var data = await api('/api/supabase/tables/' + encodeURIComponent(name) + '?' + qs);
    if (data.error) {
      document.getElementById('sb-grid-body').innerHTML = '<tr><td style="padding:20px;color:#f87171">' + data.error + '</td></tr>';
      return;
    }

    // Store columns for add-row form
    var cols = data.columns || [];
    sbCurrentColumns = cols;

    // Render header
    var headHtml = '<tr>';
    cols.forEach(function(col) {
      var arrow = col === sbCurrentSort ? (sbCurrentOrder === 'asc' ? ' \\u2191' : ' \\u2193') : '';
      var sorted = col === sbCurrentSort ? ' sorted' : '';
      headHtml += '<th class="' + sorted + '" onclick="loadSbTable(\\''+name+'\\',1,\\''+col+'\\',\\''+(col===sbCurrentSort&&sbCurrentOrder==='asc'?'desc':'asc')+'\\')">'+col+'<span class="sort-arrow">'+arrow+'</span></th>';
    });
    headHtml += '</tr>';
    document.getElementById('sb-grid-head').innerHTML = headHtml;

    // Render rows with clickable cells
    var rows = data.rows || [];
    var bodyHtml = '';
    if (rows.length === 0) {
      bodyHtml = '<tr><td colspan="' + Math.max(cols.length, 1) + '" style="padding:20px;color:#555">No rows</td></tr>';
    } else {
      rows.forEach(function(row, rowIdx) {
        bodyHtml += '<tr>';
        cols.forEach(function(col) {
          var val = row[col];
          if (val === null || val === undefined) {
            bodyHtml += '<td class="null-val sb-clickable" onclick="sbShowCellDetail(\\''+col.replace(/'/g,"\\\\'")+'\\',' + rowIdx + ')">null</td>';
          } else if (typeof val === 'object') {
            var json = JSON.stringify(val);
            bodyHtml += '<td class="sb-clickable" onclick="sbShowCellDetail(\\''+col.replace(/'/g,"\\\\'")+'\\',' + rowIdx + ')">' + escHtml(json.substring(0, 200)) + (json.length > 200 ? '...' : '') + '</td>';
          } else {
            var s = String(val);
            var needsTrunc = s.length > 100;
            bodyHtml += '<td class="sb-clickable" title="' + escHtml(s) + '" onclick="sbShowCellDetail(\\''+col.replace(/'/g,"\\\\'")+'\\',' + rowIdx + ')">' + escHtml(needsTrunc ? s.substring(0, 100) + '...' : s) + '</td>';
          }
        });
        bodyHtml += '</tr>';
      });
    }
    document.getElementById('sb-grid-body').innerHTML = bodyHtml;

    // Store rows for cell detail drill-down
    window._sbRows = rows;

    // Show insert areas
    document.getElementById('sb-insert-area').style.display = '';
    document.getElementById('sb-json-area').style.display = '';

    // Update row count badge in sidebar
    if (typeof data.rowCount === 'number') {
      sbTableRowCounts[name] = data.rowCount;
      var safeId = name.replace(/[^a-zA-Z0-9_]/g, '_');
      var badge = document.getElementById('sb-count-' + safeId);
      if (badge) badge.textContent = data.rowCount;
    }

    // Pagination
    sbTotalPages = data.totalPages || 1;
    var pag = document.getElementById('sb-pagination');
    if (data.rowCount > 0) {
      pag.style.display = '';
      document.getElementById('sb-row-info').textContent = data.rowCount + ' rows';
      document.getElementById('sb-page-info').textContent = 'Page ' + sbCurrentPage + ' / ' + sbTotalPages;
      document.getElementById('sb-prev-btn').disabled = sbCurrentPage <= 1;
      document.getElementById('sb-next-btn').disabled = sbCurrentPage >= sbTotalPages;
    } else {
      pag.style.display = 'none';
    }
  } catch(e) {
    document.getElementById('sb-grid-body').innerHTML = '<tr><td style="padding:20px;color:#f87171">Error: ' + e.message + '</td></tr>';
  }
}

function sbPrevPage() { if (sbCurrentPage > 1) loadSbTable(sbCurrentTable, sbCurrentPage - 1); }
function sbNextPage() { if (sbCurrentPage < sbTotalPages) loadSbTable(sbCurrentTable, sbCurrentPage + 1); }

// Escape HTML for safe rendering
function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// Show full cell content in the drawer
function sbShowCellDetail(col, rowIdx) {
  var row = (window._sbRows || [])[rowIdx];
  if (!row) return;
  var val = row[col];
  var display = '';
  if (val === null || val === undefined) {
    display = '<span style="color:#6b7280;font-style:italic">null</span>';
  } else if (typeof val === 'object') {
    display = '<pre style="white-space:pre-wrap;word-break:break-all;font-size:12px;color:#e0e0e0;font-family:monospace;margin:0">' + escHtml(JSON.stringify(val, null, 2)) + '</pre>';
  } else {
    display = '<pre style="white-space:pre-wrap;word-break:break-all;font-size:13px;color:#e0e0e0;margin:0">' + escHtml(String(val)) + '</pre>';
  }
  document.getElementById('drawer-title').textContent = sbCurrentTable + '.' + col;
  document.getElementById('drawer-count').textContent = 'Row ' + (rowIdx + 1);
  document.getElementById('drawer-avg-salience').textContent = typeof val === 'string' ? val.length + ' chars' : typeof val;
  document.getElementById('drawer-body').innerHTML =
    '<div style="padding:4px 0">' +
    '<div style="font-size:11px;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Full Value</div>' +
    display +
    '</div>' +
    '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-subtle)">' +
    '<div style="font-size:11px;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">All Columns in This Row</div>' +
    sbCurrentColumns.map(function(c) {
      var v = row[c];
      var preview = v === null || v === undefined ? 'null' : typeof v === 'object' ? JSON.stringify(v).substring(0,120) : String(v).substring(0,120);
      return '<div style="margin-bottom:6px"><span style="color:#3b82f6;font-size:11px;font-weight:600">' + escHtml(c) + '</span><br><span style="color:#9ca3af;font-size:12px">' + escHtml(preview) + '</span></div>';
    }).join('') +
    '</div>';
  document.getElementById('drawer-load-more').classList.add('hidden');
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Toggle add-row form
function sbToggleAddForm() {
  sbAddFormVisible = !sbAddFormVisible;
  var form = document.getElementById('sb-add-form');
  form.style.display = sbAddFormVisible ? '' : 'none';
  if (sbAddFormVisible) {
    sbBuildAddForm();
  }
}

// Build form fields from current table columns
function sbBuildAddForm() {
  var container = document.getElementById('sb-form-fields');
  if (!sbCurrentColumns.length) {
    container.innerHTML = '<div style="color:#6b7280;font-size:12px;grid-column:1/-1">Load a table first</div>';
    return;
  }
  var html = '';
  sbCurrentColumns.forEach(function(col) {
    html += '<div class="sb-form-field"><label>' + escHtml(col) + '</label><input type="text" id="sb-field-' + col.replace(/[^a-zA-Z0-9_]/g, '_') + '" placeholder="' + escHtml(col) + '"></div>';
  });
  container.innerHTML = html;
}

// Insert row from the form fields
async function sbInsertRow() {
  if (!sbCurrentTable || !sbCurrentColumns.length) return;
  var row = {};
  var hasValue = false;
  sbCurrentColumns.forEach(function(col) {
    var input = document.getElementById('sb-field-' + col.replace(/[^a-zA-Z0-9_]/g, '_'));
    if (input && input.value.trim() !== '') {
      var v = input.value.trim();
      // Try to parse numbers and booleans
      if (v === 'true') v = true;
      else if (v === 'false') v = false;
      else if (v === 'null') v = null;
      else if (!isNaN(v) && v !== '') v = Number(v);
      row[col] = v;
      hasValue = true;
    }
  });
  if (!hasValue) {
    document.getElementById('sb-insert-status').innerHTML = '<span style="color:#fbbf24">Fill at least one field</span>';
    return;
  }
  document.getElementById('sb-submit-row-btn').disabled = true;
  document.getElementById('sb-insert-status').innerHTML = '<span style="color:#6b7280">Inserting...</span>';
  try {
    var resp = await fetch(BASE + '/api/supabase/tables/' + encodeURIComponent(sbCurrentTable) + '?token=' + TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    var data = await resp.json();
    if (data.error) {
      document.getElementById('sb-insert-status').innerHTML = '<span style="color:#f87171">' + escHtml(data.error) + '</span>';
    } else {
      document.getElementById('sb-insert-status').innerHTML = '<span style="color:#34d399">Row inserted</span>';
      sbToggleAddForm();
      loadSbTable(sbCurrentTable, sbCurrentPage);
    }
  } catch(e) {
    document.getElementById('sb-insert-status').innerHTML = '<span style="color:#f87171">' + escHtml(e.message) + '</span>';
  }
  document.getElementById('sb-submit-row-btn').disabled = false;
}

// Insert row from raw JSON textarea
async function sbInsertJson() {
  if (!sbCurrentTable) {
    document.getElementById('sb-json-error').style.display = '';
    document.getElementById('sb-json-error').textContent = 'Select a table first';
    return;
  }
  var raw = document.getElementById('sb-json-input').value.trim();
  if (!raw) return;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch(e) {
    document.getElementById('sb-json-error').style.display = '';
    document.getElementById('sb-json-error').textContent = 'Invalid JSON: ' + e.message;
    return;
  }
  document.getElementById('sb-json-error').style.display = 'none';
  document.getElementById('sb-json-status').textContent = 'Inserting...';
  try {
    var resp = await fetch(BASE + '/api/supabase/tables/' + encodeURIComponent(sbCurrentTable) + '?token=' + TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed)
    });
    var data = await resp.json();
    if (data.error) {
      document.getElementById('sb-json-error').style.display = '';
      document.getElementById('sb-json-error').textContent = data.error;
      document.getElementById('sb-json-status').textContent = '';
    } else {
      document.getElementById('sb-json-status').innerHTML = '<span style="color:#34d399">Row inserted</span>';
      document.getElementById('sb-json-input').value = '';
      loadSbTable(sbCurrentTable, sbCurrentPage);
      setTimeout(function() { document.getElementById('sb-json-status').textContent = ''; }, 3000);
    }
  } catch(e) {
    document.getElementById('sb-json-error').style.display = '';
    document.getElementById('sb-json-error').textContent = e.message;
    document.getElementById('sb-json-status').textContent = '';
  }
}
</script>

<!-- Chat FAB -->
<button class="chat-fab" id="chat-fab" onclick="openChat()">
  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
  <span class="chat-fab-badge" id="chat-fab-badge"></span>
</button>

<!-- Chat slide-over panel -->
<div class="chat-overlay" id="chat-overlay">
  <div class="chat-header">
    <div class="chat-header-left">
      <span class="chat-header-title">Chat</span>
      <span class="chat-status-dot" id="chat-status-dot" style="background:#6b7280"></span>
    </div>
    <button onclick="closeChat()" class="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
  </div>
  <div class="chat-agent-tabs" id="chat-agent-tabs"></div>
  <div class="chat-session-bar" id="chat-session-bar">
    <span class="session-stat"><span class="session-stat-val" id="sess-ctx">-</span> ctx</span>
    <span class="session-stat"><span class="session-stat-val" id="sess-turns">-</span> turns</span>
    <span class="session-stat"><span class="session-stat-val" id="sess-cost">-</span> tokens</span>
    <span class="session-model" id="sess-model">-</span>
  </div>
  <div class="chat-quick-actions">
    <button class="chat-quick-btn" onclick="sendQuickAction('/todo')">Todo</button>
    <button class="chat-quick-btn" onclick="sendQuickAction('/gmail')">Gmail</button>
    <button class="chat-quick-btn" onclick="sendQuickAction('/model opus')">Opus</button>
    <button class="chat-quick-btn" onclick="sendQuickAction('/model sonnet')">Sonnet</button>
    <button class="chat-quick-btn" onclick="sendQuickAction('/respin')">Respin</button>
    <button class="chat-quick-btn destructive" onclick="sendQuickAction('/newchat')">New Chat</button>
  </div>
  <div class="chat-messages" id="chat-messages"></div>
  <div class="chat-progress-bar" id="chat-progress-bar">
    <div class="chat-progress-pulse"></div>
    <span class="chat-progress-label" id="chat-progress-label">Thinking...</span>
    <button class="chat-stop-btn" id="chat-stop-btn" onclick="abortProcessing()" title="Stop">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect width="14" height="14" rx="2"/></svg>
    </button>
    <div class="chat-progress-shimmer"></div>
  </div>
  <div class="chat-input-area">
    <textarea class="chat-textarea" id="chat-input" rows="1" placeholder="Send a message..." oninput="autoResizeInput()" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage()}"></textarea>
    <button class="chat-send-btn" id="chat-send-btn" onclick="sendChatMessage()">Send</button>
  </div>
</div>

</div><!-- end app-root -->

<script>
// ══════════════════════════════════════════════════════════════════════
// ORACLE - The All-Seeing Eye (Particle Face + VAD + Auto-start)
// ══════════════════════════════════════════════════════════════════════

var oracleState = 'dormant'; // dormant | idle | listening | thinking | speaking
var oracleSpeaking = false;
var oracleProcessing = false;
var oracleMicStream = null;
var oracleCameraStream = null;
var oracleCameraActive = false;
var oracleVadActive = false;
var oracleMediaRecorder = null;
var oracleAudioChunks = [];
var oracleVadTimeout = null;
var oracleInitialized = false;
var oracleEyeGlow = 0.3; // animated glow intensity

// ── Face State ──
function setOracleState(state) {
  oracleState = state;
  var status = document.getElementById('oracle-status');
  var dot = document.getElementById('oracle-vad-dot');
  var wrap = document.getElementById('oracle-avatar-wrap');
  status.textContent = state === 'idle' ? 'LISTENING' : state === 'listening' ? 'HEARING YOU' : state === 'thinking' ? 'PROCESSING' : state === 'speaking' ? 'SPEAKING' : 'DORMANT';
  status.className = 'oracle-status' + (state !== 'dormant' ? ' active' : '');
  dot.className = 'oracle-vad-indicator' + (state === 'listening' ? ' recording' : state === 'idle' ? ' active' : '');
  if (wrap) {
    wrap.className = 'oracle-canvas-wrap state-' + state;
  }
}

function addOracleMsg(role, text) {
  var chat = document.getElementById('oracle-chat');
  var div = document.createElement('div');
  div.className = 'oracle-msg ' + role;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  // Keep transcript short
  while (chat.children.length > 30) chat.removeChild(chat.firstChild);
}

// ── Audio-Reactive State ──
var oracleAudioCtx = null;
var oracleTtsAnalyser = null;
var oracleTtsFreqData = null;
var oracleAudioLevel = 0;       // 0-1 smoothed amplitude from TTS playback
var oracleAudioLowBand = 0;     // low freq energy (jaw)
var oracleAudioMidBand = 0;     // mid freq energy (lips)
var oracleAudioHighBand = 0;    // high freq energy (eyes)
var oracleMouthOpenness = 0;    // smoothed 0-1 mouth aperture
var oracleFormantShape = 0;     // smoothed 0-1 lip width (wide vs narrow)
var oracleMouthPurse = 0;       // 0-1 lip pursing (O/U sounds)
var oracleMouthCompress = 0;    // 0-1 lip compression (M/B/P consonant closure)
var oracleJawDrop = 0;          // 0-1 jaw drop (separate from lip openness)
var oracleMouthCornerPull = 0;  // 0-1 corner retraction (EE/I sounds)
var oracleMouthTension = 0;     // 0-1 overall facial tension during speech
var oracleSpectralFlux = 0;     // 0-1 rate of spectral change (consonant transients)
var oraclePrevFreqData = null;  // previous frame frequency data for flux calc

// ── Streaming + Audio Queue State ──
var oracleTtsQueue = [];        // queue of { text, audioPromise }
var oracleCurrentSource = null; // current AudioBufferSourceNode
var oraclePlayingQueue = false;
var oracleSentenceBuffer = '';
var oracleLastFlushTime = 0;    // timestamp of last sentence flush (for time-based flush)
var ORACLE_MAX_BUFFER_MS = 550; // flush buffer after this many ms even without sentence boundary
var oracleStreamAbort = null;   // AbortController for streaming

function getOracleAudioCtx() {
  if (!oracleAudioCtx) oracleAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return oracleAudioCtx;
}

function updateOracleAudioReactive() {
  if (!oracleTtsAnalyser || !oracleTtsFreqData) {
    // Decay towards zero when not playing
    oracleAudioLevel *= 0.9;
    oracleAudioLowBand *= 0.9;
    oracleAudioMidBand *= 0.9;
    oracleAudioHighBand *= 0.9;
    oracleMouthOpenness += (0 - oracleMouthOpenness) * 0.12;
    oracleFormantShape += (0.5 - oracleFormantShape) * 0.08;
    oracleMouthPurse += (0 - oracleMouthPurse) * 0.10;
    oracleMouthCompress += (0 - oracleMouthCompress) * 0.15;
    oracleJawDrop += (0 - oracleJawDrop) * 0.10;
    oracleMouthCornerPull += (0 - oracleMouthCornerPull) * 0.08;
    oracleMouthTension += (0 - oracleMouthTension) * 0.06;
    oracleSpectralFlux *= 0.85;
    return;
  }
  oracleTtsAnalyser.getByteFrequencyData(oracleTtsFreqData);
  var bins = oracleTtsFreqData.length;

  // 5-band frequency split aligned to speech formant regions
  var subBassEnd = Math.floor(bins * 0.04);    // ~0-180Hz fundamental
  var bassEnd = Math.floor(bins * 0.12);       // ~180-530Hz F1 region
  var lowMidEnd = Math.floor(bins * 0.30);     // ~530-1300Hz F2 region
  var highMidEnd = Math.floor(bins * 0.55);    // ~1300-2400Hz F3 region
  var presenceEnd = Math.floor(bins * 0.75);   // ~2400-3300Hz sibilance

  var subBassSum = 0, bassSum = 0, lowMidSum = 0, highMidSum = 0, presenceSum = 0, totalSum = 0;
  var weightedFreqSum = 0; // for spectral centroid
  for (var i = 0; i < bins; i++) {
    var v = oracleTtsFreqData[i];
    totalSum += v;
    weightedFreqSum += v * i;
    if (i < subBassEnd) subBassSum += v;
    else if (i < bassEnd) bassSum += v;
    else if (i < lowMidEnd) lowMidSum += v;
    else if (i < highMidEnd) highMidSum += v;
    else if (i < presenceEnd) presenceSum += v;
  }

  var rawLevel = totalSum / (bins * 255);
  var rawSubBass = subBassSum / (Math.max(1, subBassEnd) * 255);
  var rawBass = bassSum / (Math.max(1, bassEnd - subBassEnd) * 255);
  var rawLowMid = lowMidSum / (Math.max(1, lowMidEnd - bassEnd) * 255);
  var rawHighMid = highMidSum / (Math.max(1, highMidEnd - lowMidEnd) * 255);
  var rawPresence = presenceSum / (Math.max(1, presenceEnd - highMidEnd) * 255);

  // Spectral centroid (normalized 0-1, where energy is concentrated)
  var spectralCentroid = totalSum > 0 ? (weightedFreqSum / totalSum) / bins : 0.5;

  // Spectral flux (rate of spectral change - consonant transient detection)
  var flux = 0;
  if (oraclePrevFreqData) {
    for (var fi = 0; fi < bins; fi++) {
      var diff = oracleTtsFreqData[fi] - oraclePrevFreqData[fi];
      if (diff > 0) flux += diff; // positive-only (onset detection)
    }
    flux = flux / (bins * 255);
  }
  if (!oraclePrevFreqData) oraclePrevFreqData = new Uint8Array(bins);
  oraclePrevFreqData.set(oracleTtsFreqData);

  // Smooth with asymmetric attack/release
  oracleAudioLevel += (rawLevel - oracleAudioLevel) * (rawLevel > oracleAudioLevel ? 0.3 : 0.1);
  oracleAudioLowBand += (rawBass - oracleAudioLowBand) * (rawBass > oracleAudioLowBand ? 0.35 : 0.12);
  oracleAudioMidBand += (rawLowMid - oracleAudioMidBand) * (rawLowMid > oracleAudioMidBand ? 0.3 : 0.1);
  oracleAudioHighBand += (rawPresence - oracleAudioHighBand) * (rawPresence > oracleAudioHighBand ? 0.25 : 0.08);
  oracleSpectralFlux += (flux - oracleSpectralFlux) * (flux > oracleSpectralFlux ? 0.5 : 0.15);

  // ── Derive viseme-like mouth shape parameters from spectral features ──

  // Jaw drop: vocal fundamental (sub-bass/bass) drives jaw opening
  var targetJaw = Math.min(1, rawSubBass * 1.8 + rawBass * 2.2 + rawLowMid * 0.4);
  oracleJawDrop += (targetJaw - oracleJawDrop) * (targetJaw > oracleJawDrop ? 0.28 : 0.14);

  // Mouth openness: composite of jaw drop and mid-frequency formant energy
  var targetOpen = Math.min(1, oracleJawDrop * 0.7 + rawLowMid * 1.2 + rawHighMid * 0.5);
  oracleMouthOpenness += (targetOpen - oracleMouthOpenness) * 0.18;

  // Formant shape (lip width): high centroid = wide "EE", low centroid = narrow "OO"
  var targetShape = Math.max(0, Math.min(1, spectralCentroid * 2.5));
  oracleFormantShape += (targetShape - oracleFormantShape) * 0.12;

  // Lip pursing: strong bass + weak high-mid = rounded vowels O/U
  var purseSignal = rawBass > 0.15 && rawHighMid < rawBass * 0.6
    ? Math.min(1, (rawBass - rawHighMid * 0.5) * 3) : 0;
  oracleMouthPurse += (purseSignal - oracleMouthPurse) * 0.14;

  // Lip compression: spectral flux spike + low total energy = M/B/P closure
  var compressSignal = oracleSpectralFlux > 0.08 && rawLevel < 0.2
    ? Math.min(1, oracleSpectralFlux * 5) : 0;
  oracleMouthCompress += (compressSignal - oracleMouthCompress) * (compressSignal > oracleMouthCompress ? 0.4 : 0.2);

  // Corner retraction: high spectral centroid + mid energy = EE/I spread
  var cornerSignal = spectralCentroid > 0.4
    ? Math.min(1, (spectralCentroid - 0.3) * rawLowMid * 6) : 0;
  oracleMouthCornerPull += (cornerSignal - oracleMouthCornerPull) * 0.1;

  // Facial tension: overall speech energy presence
  var targetTension = Math.min(1, rawLevel * 2.5);
  oracleMouthTension += (targetTension - oracleMouthTension) * 0.08;

  // Update the audio level bar in DOM
  var bar = document.getElementById('oracle-audio-bar');
  if (bar) bar.style.width = (oracleAudioLevel * 100).toFixed(1) + '%';
}

// ── Canvas-based animated Oracle face ──
var oracleAvatarAnim = null;
var oracleAudioBarSmoothed = 0;

// Persistent state for Oracle face mesh
var oracleFaceMesh = null;
var oracleScatterParts = [];
var oracleScatterInit = false;
var oracleEyeTrackX = 0;
var oracleEyeTrackY = 0;
var oracleBlinkTimer = 3 + Math.random() * 4;
var oracleBlinkState = 0;
var oracleThinkScanY = 0;

function drawOracleFace() {
  var canvas = document.getElementById('oracle-face-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  var cx = w / 2;
  var cy = h * 0.40;
  var t = Date.now() / 1000;

  // Neutral face silhouette (half-width at y)
  function faceW(y) {
    var ry = y - cy;
    var cps = [
      [-130, 0], [-115, 60], [-98, 78], [-80, 88], [-60, 94],
      [-42, 93], [-28, 92], [-10, 93], [4, 94], [16, 90],
      [30, 82], [44, 70], [56, 54], [68, 36], [80, 20], [92, 8], [102, 0]
    ];
    for (var i = 0; i < cps.length - 1; i++) {
      if (ry >= cps[i][0] && ry <= cps[i + 1][0]) {
        var fr = (ry - cps[i][0]) / (cps[i + 1][0] - cps[i][0]);
        fr = fr * fr * (3 - 2 * fr);
        return cps[i][1] + (cps[i + 1][1] - cps[i][1]) * fr;
      }
    }
    return 0;
  }

  // 3D depth map - simulates face curvature for brightness (enhanced realism)
  function faceDepth(px, py) {
    var rx = (px - cx) / 92;
    var ry2 = (py - cy) / 115;
    // Spherical base (center = forward)
    var d = Math.sqrt(Math.max(0, 1 - rx * rx * 0.8 - ry2 * ry2 * 0.3));
    // Nose ridge (most forward part - stronger)
    var nr = Math.abs(rx);
    if (nr < 0.16 && ry2 > -0.12 && ry2 < 0.28) {
      d += (1 - nr / 0.16) * 0.35 * (0.5 + 0.5 * Math.sin((ry2 + 0.12) / 0.4 * 3.14));
    }
    // Eye socket depression
    for (var ei = 0; ei < 2; ei++) {
      var ex = ei === 0 ? -0.42 : 0.42;
      var edx = (rx - ex) * 2;
      var edy = (ry2 + 0.19) * 3.5;
      var ed = edx * edx + edy * edy;
      if (ed < 0.12) d -= 0.1 * (1 - ed / 0.12);
    }
    // Brow bone
    if (ry2 > -0.43 && ry2 < -0.3 && Math.abs(rx) < 0.68) {
      d += 0.07 * Math.sin((ry2 + 0.43) / 0.13 * 3.14) * (1 - Math.abs(rx) / 0.68);
    }
    // Cheekbone
    var arx = Math.abs(rx);
    if (arx > 0.4 && arx < 0.85 && ry2 > -0.08 && ry2 < 0.2) {
      d += 0.09 * (1 - Math.abs(arx - 0.62) / 0.22) * (1 - Math.abs(ry2 - 0.06) / 0.14);
    }
    // Lips forward
    if (Math.abs(rx) < 0.32 && ry2 > 0.33 && ry2 < 0.5) {
      d += 0.07 * (1 - Math.abs(rx) / 0.32) * Math.sin((ry2 - 0.33) / 0.17 * 3.14);
    }
    // Chin protuberance
    if (Math.abs(rx) < 0.16 && ry2 > 0.6 && ry2 < 0.82) {
      d += 0.05 * (1 - Math.abs(rx) / 0.16) * Math.sin((ry2 - 0.6) / 0.22 * 3.14);
    }
    // Temple concavity
    if (arx > 0.7 && arx < 0.95 && ry2 > -0.5 && ry2 < -0.2) {
      d -= 0.06 * (1 - Math.abs(arx - 0.82) / 0.13) * (1 - Math.abs(ry2 + 0.35) / 0.15);
    }
    return Math.min(1, Math.max(0, d));
  }

  // Initialize face mesh once
  if (!oracleFaceMesh) {
    var points = [];
    var contourIndices = [];

    function addPt(x, y, sz, br, feat) {
      points.push({
        x: x, y: y, bx: x, by: y,
        sz: sz || 1.5, br: br || 0.4,
        feat: feat || 'fill',
        ph: Math.random() * 6.283,
        sp: 0.2 + Math.random() * 0.5,
        amp: 0.12 + Math.random() * 0.3
      });
      return points.length - 1;
    }

    // Face contour (dense outline)
    for (var fy = cy - 128; fy <= cy + 101; fy += 2.0) {
      var fw = faceW(fy);
      if (fw > 1) {
        var cd = faceDepth(cx - fw, fy);
        var ci1 = addPt(cx - fw, fy, 1.4, 0.3 + cd * 0.18, 'contour');
        var ci2 = addPt(cx + fw, fy, 1.4, 0.3 + cd * 0.18, 'contour');
        contourIndices.push(ci1, ci2);
      }
    }

    // Interior fill - balanced grid with depth-based sizing
    var gridSp = 6;
    for (var gy = cy - 122; gy <= cy + 98; gy += gridSp) {
      var gw = faceW(gy);
      if (gw < 4) continue;
      for (var gx = cx - gw * 0.9; gx <= cx + gw * 0.9; gx += gridSp) {
        var jx = gx + (Math.random() - 0.5) * gridSp * 0.5;
        var jy = gy + (Math.random() - 0.5) * gridSp * 0.5;
        var jfw = faceW(jy);
        if (jfw > 3 && Math.abs(jx - cx) < jfw * 0.88) {
          var dp = faceDepth(jx, jy);
          // Depth-based sizing: forward areas slightly bigger, but keep particles distinct
          var sz = 0.6 + dp * 0.8;
          var br = 0.08 + dp * 0.35;
          addPt(jx, jy, sz, br, 'fill');
        }
      }
    }

    // ===== DETAILED EYE ANATOMY =====
    var eyeY2 = cy - 22;
    var eyeXArr2 = [cx - 42, cx + 42];
    for (var ei2 = 0; ei2 < 2; ei2++) {
      var ecx = eyeXArr2[ei2];
      var eSide = ei2 === 0 ? -1 : 1;

      // Orbital bone ridge (above and around eye)
      for (var oa = 0; oa < 6.28; oa += 0.12) {
        var orx = 26 + Math.cos(oa) * 2;
        var ory = 16 + Math.sin(oa) * 2;
        var opx = ecx + Math.cos(oa) * orx;
        var opy = eyeY2 + Math.sin(oa) * ory;
        if (oa > 3.14 * 0.3 && oa < 3.14 * 1.7) {
          addPt(opx, opy, 1.2, 0.45, 'orbital');
        }
      }

      // Upper eyelid curve (follows eyeball curvature)
      for (var ut = -1; ut <= 1; ut += 0.04) {
        var ulx = ecx + ut * 22;
        var uly = eyeY2 - 10 * Math.sqrt(1 - ut * ut) - 2;
        addPt(ulx, uly, 1.5, 0.58, 'eyelid_upper');
      }
      // Eyelid crease (above upper lid)
      for (var ct = -0.85; ct <= 0.85; ct += 0.06) {
        var clx = ecx + ct * 21;
        var cly = eyeY2 - 13 * Math.sqrt(1 - ct * ct) - 4;
        addPt(clx, cly, 1.1, 0.42, 'eyelid_crease');
      }
      // Lower eyelid (flatter curve)
      for (var lt = -1; lt <= 1; lt += 0.05) {
        var llx = ecx + lt * 21;
        var lly = eyeY2 + 6 * Math.sqrt(1 - lt * lt) + 3;
        addPt(llx, lly, 1.3, 0.48, 'eyelid_lower');
      }
      // Tear duct (inner corner - denser)
      var tdx = ecx + eSide * (-18);
      addPt(tdx, eyeY2, 1.6, 0.55, 'tear_duct');
      addPt(tdx + eSide * (-2), eyeY2 - 1, 1.3, 0.5, 'tear_duct');
      addPt(tdx + eSide * (-2), eyeY2 + 1.5, 1.3, 0.5, 'tear_duct');
      // Outer corner
      var ocx = ecx + eSide * 22;
      addPt(ocx, eyeY2 - 1, 1.4, 0.52, 'eye_corner');
      addPt(ocx + eSide * 2, eyeY2 + 1, 1.2, 0.45, 'eye_corner');

      // Iris ring (the glowing ring around eye core)
      for (var ia = 0; ia < 6.28; ia += 0.22) {
        addPt(ecx + Math.cos(ia) * 10, eyeY2 + Math.sin(ia) * 6, 1.3, 0.72, 'iris');
      }
      // Inner iris
      for (var iia = 0; iia < 6.28; iia += 0.35) {
        addPt(ecx + Math.cos(iia) * 5, eyeY2 + Math.sin(iia) * 3.5, 1.1, 0.82, 'iris_inner');
      }
      // Eye core (bright center)
      for (var ecc = 0; ecc < 6; ecc++) {
        var eca2 = Math.random() * 6.28;
        var ecr = Math.random() * 3;
        addPt(ecx + Math.cos(eca2) * ecr, eyeY2 + Math.sin(eca2) * ecr * 0.6, 1.0, 0.9, 'eye_core');
      }
    }

    // ===== EYEBROWS - arched, tapered =====
    for (var bi2 = 0; bi2 < 2; bi2++) {
      var bDir = bi2 === 0 ? -1 : 1;
      // Main brow line (tapers thinner toward tail)
      for (var bt2 = 0; bt2 <= 1; bt2 += 0.025) {
        var bx2 = cx + bDir * (14 + bt2 * 46);
        var by2 = cy - 47 - Math.sin(bt2 * 3.14) * 14 + bt2 * 6;
        var bThick = 1.6 - bt2 * 0.6;
        addPt(bx2, by2, bThick, 0.5 + (1 - bt2) * 0.1, 'brow');
      }
      // Brow underside (creates thickness)
      for (var bu = 0; bu <= 0.85; bu += 0.04) {
        var bux = cx + bDir * (16 + bu * 40);
        var buy = cy - 44 - Math.sin(bu * 3.14) * 11 + bu * 5;
        addPt(bux, buy, 1.1, 0.42, 'brow_under');
      }
    }

    // ===== BROW BONE RIDGE =====
    for (var bbr = -0.9; bbr <= 0.9; bbr += 0.04) {
      var bbrx = cx + bbr * 78;
      var bbry = cy - 40 + Math.abs(bbr) * 5;
      var bbrd = faceDepth(bbrx, bbry);
      addPt(bbrx, bbry, 1.2, 0.35 + bbrd * 0.2, 'browbone');
    }

    // ===== NOSE - detailed anatomy =====
    // Glabella (between brows, top of nose)
    addPt(cx, cy - 30, 1.5, 0.55, 'nose');
    addPt(cx - 3, cy - 28, 1.3, 0.5, 'nose');
    addPt(cx + 3, cy - 28, 1.3, 0.5, 'nose');

    // Bridge (gets progressively wider)
    for (var nb = cy - 26; nb <= cy + 18; nb += 2) {
      var bridgeProg = (nb - (cy - 26)) / 44;
      var bridgeW = 3 + bridgeProg * 5;
      var bridgeD = faceDepth(cx, nb);
      // Bridge edges
      addPt(cx - bridgeW, nb, 1.3, 0.5 + bridgeD * 0.2, 'nose_bridge');
      addPt(cx + bridgeW, nb, 1.3, 0.5 + bridgeD * 0.2, 'nose_bridge');
      // Center ridge (bright - forward facing)
      addPt(cx, nb, 1.6, 0.55 + bridgeD * 0.3, 'nose_ridge');
    }

    // Nose tip (most forward - brightest area)
    for (var nta = 0; nta < 6.28; nta += 0.25) {
      var ntr = 5 + Math.cos(nta * 2) * 1.5;
      addPt(cx + Math.cos(nta) * ntr, cy + 22 + Math.sin(nta) * ntr * 0.6, 1.7, 0.8, 'nose_tip');
    }
    addPt(cx, cy + 22, 2.2, 0.88, 'nose_tip');

    // Nostrils / alar wings (wider at base)
    for (var nsa = 0; nsa < 2; nsa++) {
      var nsDir = nsa === 0 ? -1 : 1;
      // Alar wing curve
      for (var nwt = 0; nwt <= 1; nwt += 0.06) {
        var nwx = cx + nsDir * (6 + nwt * 7);
        var nwy = cy + 22 + nwt * 6;
        addPt(nwx, nwy, 1.3, 0.5, 'nostril');
      }
      // Alar crease (where nostril meets cheek)
      for (var act = 0; act <= 1; act += 0.1) {
        addPt(cx + nsDir * (12 + act * 3), cy + 22 + act * 8, 1.1, 0.4, 'alar_crease');
      }
    }
    // Columella (base between nostrils)
    addPt(cx, cy + 28, 1.5, 0.6, 'columella');
    addPt(cx - 3, cy + 29, 1.2, 0.5, 'columella');
    addPt(cx + 3, cy + 29, 1.2, 0.5, 'columella');

    // ===== PHILTRUM (nose-to-lip groove) =====
    for (var pht = 0; pht <= 1; pht += 0.08) {
      var phy = cy + 30 + pht * 12;
      // Two ridges
      addPt(cx - 4, phy, 1.2, 0.45, 'philtrum');
      addPt(cx + 4, phy, 1.2, 0.45, 'philtrum');
      // Center (slightly recessed)
      addPt(cx, phy, 0.9, 0.35, 'philtrum_groove');
    }

    // ===== LIPS - detailed vermillion border =====
    var lipY2 = cy + 45;

    // Upper lip vermillion border (sharp edge with cupid's bow)
    for (var uvt = -1; uvt <= 1; uvt += 0.025) {
      var uvx = uvt * 28;
      // Cupid's bow: two peaks with center dip
      var cupid = -3.5 * Math.cos(uvt * 3.14) + 3 * Math.cos(uvt * 6.28);
      var uvy = lipY2 + cupid;
      addPt(cx + uvx, uvy, 1.5, 0.55, 'lip_upper');
    }
    // Upper lip body (fill between border and center)
    for (var ubf = 0; ubf < 20; ubf++) {
      var ubx = cx + (Math.random() * 2 - 1) * 24;
      var uby = lipY2 + 1 + Math.random() * 4;
      addPt(ubx, uby, 1.0, 0.4, 'lip_fill');
    }
    // Lip opening line (darker center crease)
    for (var lot = -0.9; lot <= 0.9; lot += 0.035) {
      addPt(cx + lot * 25, lipY2 + 5, 1.1, 0.32, 'lip_line');
    }
    // Lower lip vermillion border (fuller curve)
    for (var lvt = -1; lvt <= 1; lvt += 0.025) {
      var lvx = lvt * 26;
      var lvy = lipY2 + 6 + 6 * Math.sin(Math.abs(lvt) * 3.14);
      addPt(cx + lvx, lvy, 1.5, 0.55, 'lip_lower');
    }
    // Lower lip body (plumper)
    for (var lbf = 0; lbf < 25; lbf++) {
      var lbx = cx + (Math.random() * 2 - 1) * 22;
      var lby = lipY2 + 6 + Math.random() * 5;
      var lbd = faceDepth(lbx, lby);
      addPt(lbx, lby, 1.0 + lbd * 0.4, 0.35 + lbd * 0.15, 'lip_fill');
    }
    // Lip corners (commissures)
    for (var lci = 0; lci < 2; lci++) {
      var lcDir = lci === 0 ? -1 : 1;
      addPt(cx + lcDir * 28, lipY2 + 4, 1.3, 0.42, 'lip_corner');
      addPt(cx + lcDir * 30, lipY2 + 5, 1.1, 0.35, 'lip_corner');
    }

    // ===== MENTOLABIAL SULCUS (crease below lower lip) =====
    for (var mst = -0.7; mst <= 0.7; mst += 0.05) {
      addPt(cx + mst * 22, cy + 58 + Math.abs(mst) * 2, 1.0, 0.3, 'mentolabial');
    }

    // ===== NASOLABIAL FOLDS =====
    for (var nlf = 0; nlf < 2; nlf++) {
      var nlDir = nlf === 0 ? -1 : 1;
      for (var nlt = 0; nlt <= 1; nlt += 0.04) {
        var nlx = cx + nlDir * (13 + nlt * 15);
        var nly = cy + 24 + nlt * 26;
        addPt(nlx, nly, 1.2, 0.38, 'nasolabial');
      }
    }

    // ===== CHEEKBONE RIDGES =====
    for (var chk = 0; chk < 2; chk++) {
      var chDir = chk === 0 ? -1 : 1;
      // Zygomatic arch (the ridge)
      for (var zat = 0; zat <= 1; zat += 0.03) {
        var zax = cx + chDir * (42 + zat * 45);
        var zay = cy - 8 + zat * 10 + Math.sin(zat * 3.14) * 4;
        var zad = faceDepth(zax, zay);
        addPt(zax, zay, 1.4, 0.4 + zad * 0.2, 'cheekbone');
      }
      // Cheek hollow (below cheekbone - slightly recessed)
      for (var cht = 0; cht < 8; cht++) {
        var chx = cx + chDir * (50 + Math.random() * 22);
        var chy = cy + 10 + Math.random() * 20;
        var chd = faceDepth(chx, chy);
        addPt(chx, chy, 1.0, 0.25 + chd * 0.2, 'cheek_hollow');
      }
    }

    // ===== JAWLINE - defined mandible =====
    for (var ji2 = 0; ji2 < 2; ji2++) {
      var jDir2 = ji2 === 0 ? -1 : 1;
      // Main jawline curve (wider, more defined)
      for (var jt2 = 0; jt2 <= 1; jt2 += 0.02) {
        var jAngle = jt2 * 1.4;
        var jx2 = cx + jDir2 * (10 + (1 - jt2) * 88);
        var jy2 = cy + 100 - (1 - jt2) * 52;
        addPt(jx2, jy2, 1.5, 0.42, 'jaw');
      }
      // Mandible angle (stronger)
      addPt(cx + jDir2 * 78, cy + 52, 1.6, 0.45, 'jaw_angle');
      addPt(cx + jDir2 * 74, cy + 56, 1.4, 0.4, 'jaw_angle');
    }

    // ===== CHIN CONTOUR (more defined) =====
    // Mental protuberance (chin bump - denser)
    for (var cta = 0; cta < 6.28; cta += 0.14) {
      var ctr = 9 + Math.cos(cta) * 2.5;
      var ctd = faceDepth(cx + Math.cos(cta) * ctr, cy + 88 + Math.sin(cta) * ctr * 0.5);
      addPt(cx + Math.cos(cta) * ctr, cy + 88 + Math.sin(cta) * ctr * 0.5, 1.2 + ctd * 0.4, 0.38 + ctd * 0.15, 'chin');
    }
    addPt(cx, cy + 95, 1.6, 0.48, 'chin_tip');
    addPt(cx - 4, cy + 93, 1.2, 0.4, 'chin');
    addPt(cx + 4, cy + 93, 1.2, 0.4, 'chin');
    // Chin dimple hint
    addPt(cx, cy + 85, 0.8, 0.3, 'chin_dimple');
    addPt(cx - 2, cy + 86, 0.7, 0.28, 'chin_dimple');
    addPt(cx + 2, cy + 86, 0.7, 0.28, 'chin_dimple');

    // ===== FOREHEAD STRUCTURE =====
    for (var fht = 0; fht < 15; fht++) {
      var fhx = cx + (Math.random() * 2 - 1) * 55;
      var fhy = cy - 90 + Math.random() * 35;
      var fhd = faceDepth(fhx, fhy);
      addPt(fhx, fhy, 0.9, 0.22 + fhd * 0.22, 'forehead');
    }

    // ===== TEMPLE AREA =====
    for (var ti = 0; ti < 2; ti++) {
      var tDir = ti === 0 ? -1 : 1;
      for (var tt = 0; tt < 8; tt++) {
        var tx = cx + tDir * (70 + Math.random() * 14);
        var ty = cy - 45 + Math.random() * 30;
        var td = faceDepth(tx, ty);
        addPt(tx, ty, 0.8, 0.18 + td * 0.18, 'temple');
      }
    }

    // ===== UNDER-EYE AREA =====
    for (var uei = 0; uei < 2; uei++) {
      var ueDir = uei === 0 ? -1 : 1;
      for (var uet = 0; uet <= 1; uet += 0.1) {
        var uex = cx + ueDir * (20 + uet * 20);
        var uey = cy - 12 + uet * 4;
        addPt(uex, uey, 0.8, 0.25, 'undereye');
      }
    }

    // ===== MID-CHEEK TISSUE =====
    for (var mci = 0; mci < 2; mci++) {
      var mcDir = mci === 0 ? -1 : 1;
      for (var mc = 0; mc < 6; mc++) {
        var mcx = cx + mcDir * (35 + Math.random() * 25);
        var mcy2 = cy + 5 + Math.random() * 20;
        var mcd = faceDepth(mcx, mcy2);
        addPt(mcx, mcy2, 0.7 + mcd * 0.4, 0.18 + mcd * 0.2, 'cheek_tissue');
      }
    }

    // ===== EAR HINTS (subtle) =====
    for (var eri = 0; eri < 2; eri++) {
      var eDir = eri === 0 ? -1 : 1;
      for (var ert = 0; ert <= 1; ert += 0.12) {
        addPt(cx + eDir * (88 + Math.sin(ert * 3.14) * 6), cy - 18 + ert * 40, 0.9, 0.2, 'ear');
      }
    }

    // ===== NECK / SHOULDERS =====
    for (var nk = 0; nk < 2; nk++) {
      var nDir = nk === 0 ? -1 : 1;
      // Neck column
      for (var nct = 0; nct <= 1; nct += 0.08) {
        addPt(cx + nDir * (18 + nct * 4), cy + 105 + nct * 25, 1.0 - nct * 0.3, 0.2 - nct * 0.05, 'neck');
      }
      // Shoulder slope
      for (var sht = 0; sht <= 1; sht += 0.08) {
        addPt(cx + nDir * (22 + sht * 80), cy + 130 + sht * 25, 0.8 - sht * 0.3, 0.14 - sht * 0.04, 'shoulder');
      }
    }
    addPt(cx, cy + 108, 1.0, 0.18, 'neck');
    addPt(cx, cy + 118, 0.8, 0.14, 'neck');

    // Build mesh edges (triangulated plexus - optimized for dense grid)
    var edges = [];
    var maxDist = 14;
    for (var mi = 0; mi < points.length; mi++) {
      var connCount = 0;
      for (var mj = mi + 1; mj < points.length; mj++) {
        var mdx = points[mi].bx - points[mj].bx;
        var mdy = points[mi].by - points[mj].by;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md > 1.2 && md < maxDist) {
          edges.push([mi, mj, md]);
          connCount++;
          if (connCount > 8) break; // cap connections per node for performance
        }
      }
    }

    oracleFaceMesh = { points: points, edges: edges, contourIndices: contourIndices };
  }

  // Initialize scatter particles (dense halo)
  if (!oracleScatterInit) {
    oracleScatterInit = true;
    oracleScatterParts = [];
    for (var si2 = 0; si2 < 450; si2++) {
      var sy4 = cy - 140 + Math.random() * 280;
      var sw3 = faceW(sy4);
      var sDist2 = sw3 > 5 ? sw3 * (0.82 + Math.random() * 0.6) : 40 + Math.random() * 100;
      var sDir = Math.random() > 0.5 ? 1 : -1;
      if (si2 < 70) {
        sy4 = cy - 135 - Math.random() * 70;
        sDist2 = Math.random() * 90;
      } else if (si2 < 120) {
        sy4 = cy + 108 + Math.random() * 70;
        sDist2 = Math.random() * 70;
      }
      oracleScatterParts.push({
        x: cx + sDir * sDist2, y: sy4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.18,
        sz: 0.3 + Math.random() * 2.8,
        alpha: 0.05 + Math.random() * 0.38,
        life: 60 + Math.random() * 280,
        ph: Math.random() * 6.28
      });
    }
  }

  // Background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // State parameters (cyan/blue palette)
  var intensity, glowColor, gR, gG, gB, secondaryColor, breathe;
  if (oracleState === 'speaking') {
    intensity = 0.95 + oracleAudioLevel * 0.05;
    glowColor = '#00bfff'; gR = 0; gG = 191; gB = 255;
    secondaryColor = '#00e5ff';
    breathe = oracleAudioLevel * 0.008;
  } else if (oracleState === 'thinking') {
    intensity = 0.85 + Math.sin(t * 3) * 0.1;
    glowColor = '#ffaa00'; gR = 255; gG = 170; gB = 0;
    secondaryColor = '#ff6600';
    breathe = Math.sin(t * 3) * 0.012;
  } else if (oracleState === 'listening') {
    intensity = 0.9 + Math.sin(t * 2) * 0.08;
    glowColor = '#00bfff'; gR = 0; gG = 191; gB = 255;
    secondaryColor = '#00e5ff';
    breathe = Math.sin(t * 1.5) * 0.006;
  } else if (oracleState === 'idle') {
    intensity = 0.8 + Math.sin(t * 1.2) * 0.08;
    glowColor = '#00bfff'; gR = 0; gG = 191; gB = 255;
    secondaryColor = '#0099dd';
    breathe = Math.sin(t * 1.0) * 0.005;
  } else {
    intensity = 0.45 + Math.sin(t * 0.4) * 0.08;
    glowColor = '#006699'; gR = 0; gG = 102; gB = 153;
    secondaryColor = '#003355';
    breathe = Math.sin(t * 0.3) * 0.003;
  }

  // Ambient face glow (subtle - don't wash out particles)
  var ambGrd = ctx.createRadialGradient(cx, cy - 10, 5, cx, cy, 220);
  ambGrd.addColorStop(0, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.05).toFixed(3) + ')');
  ambGrd.addColorStop(0.3, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.02).toFixed(3) + ')');
  ambGrd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ambGrd;
  ctx.fillRect(0, 0, w, h);

  // Nose glow (subtle forward-facing highlight)
  var noseGrd = ctx.createRadialGradient(cx, cy + 10, 2, cx, cy + 10, 50);
  noseGrd.addColorStop(0, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.035).toFixed(3) + ')');
  noseGrd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = noseGrd;
  ctx.fillRect(cx - 50, cy - 20, 100, 70);

  // Breathing scale
  var sc = 1 + breathe;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sc, sc);
  ctx.translate(-cx, -cy);

  var mesh = oracleFaceMesh;
  var mPts = mesh.points;
  var mEdges = mesh.edges;

  // Animate point positions
  for (var api = 0; api < mPts.length; api++) {
    var ap = mPts[api];
    var jit = Math.sin(t * ap.sp + ap.ph) * ap.amp;
    var jit2 = Math.cos(t * ap.sp * 0.7 + ap.ph + 1.5) * ap.amp * 0.45;
    ap.x = ap.bx + jit;
    ap.y = ap.by + jit2;
    if (oracleState === 'speaking' && (ap.feat === 'lip_upper' || ap.feat === 'lip_lower' || ap.feat === 'lip_fill' || ap.feat === 'lip_line')) {
      ap.x += Math.sin(t * 8 + api) * oracleAudioLevel * 2.5;
      ap.y += Math.cos(t * 6 + api * 0.5) * oracleAudioLevel * 2;
    }
  }

  // Draw mesh edges — batched into 3 alpha bands to reduce GPU state changes
  ctx.save();
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 0.8;
  var edgeBands = [[0.3, 1.0, 0.55], [0.15, 0.3, 0.35], [0.005, 0.15, 0.2]];
  for (var ebi = 0; ebi < edgeBands.length; ebi++) {
    var eLow = edgeBands[ebi][0], eHigh = edgeBands[ebi][1], eAlphaScale = edgeBands[ebi][2];
    ctx.globalAlpha = intensity * eAlphaScale;
    ctx.beginPath();
    for (var dei = 0; dei < mEdges.length; dei++) {
      var de = mEdges[dei];
      var dp1 = mPts[de[0]];
      var dp2 = mPts[de[1]];
      var avgBr = (dp1.br + dp2.br) * 0.5;
      var edgAlpha = (1 - de[2] / 16) * avgBr;
      if (edgAlpha < eLow || edgAlpha >= eHigh) continue;
      ctx.moveTo(dp1.x, dp1.y);
      ctx.lineTo(dp2.x, dp2.y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Draw all mesh nodes — batched into 4 alpha bands (single fill call per band)
  ctx.save();
  ctx.fillStyle = glowColor;
  var nodeBands = [[0.7, 1.0], [0.5, 0.7], [0.3, 0.5], [0.04, 0.3]];
  for (var nbi = 0; nbi < nodeBands.length; nbi++) {
    var nLow = nodeBands[nbi][0], nHigh = nodeBands[nbi][1];
    ctx.globalAlpha = (nLow + nHigh) * 0.5 * intensity;
    ctx.beginPath();
    for (var dpi = 0; dpi < mPts.length; dpi++) {
      var dpA = mPts[dpi];
      if (dpA.feat === 'eye_core' || dpA.feat === 'iris_inner') continue;
      var brV = dpA.br * (0.82 + Math.sin(t * 1.5 + dpA.ph) * 0.18);
      if (brV < nLow || brV >= nHigh) continue;
      ctx.arc(dpA.x, dpA.y, dpA.sz * 2.2, 0, 6.283);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.restore();

  // Draw glow halos — two passes with fixed shadowBlur (reduced for particle clarity)
  // Pass A: mid-brightness nodes (br 0.48-0.64) — subtle glow
  ctx.save();
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 6;
  for (var dpi2 = 0; dpi2 < mPts.length; dpi2++) {
    var dpB = mPts[dpi2];
    if (dpB.feat === 'eye_core' || dpB.feat === 'iris_inner') continue;
    if (dpB.br < 0.48 || dpB.br >= 0.65) continue;
    var dpAlpha2 = dpB.br * intensity * (0.6 + Math.sin(t * 1.5 + dpB.ph) * 0.15);
    if (dpAlpha2 < 0.04) continue;
    ctx.globalAlpha = dpAlpha2 * 0.5;
    ctx.beginPath();
    ctx.arc(dpB.x, dpB.y, dpB.sz * 1.8, 0, 6.283);
    ctx.fill();
  }
  // Pass B: high-brightness feature nodes (br >= 0.65) — moderate glow
  ctx.shadowBlur = 12;
  for (var dpi3 = 0; dpi3 < mPts.length; dpi3++) {
    var dpC = mPts[dpi3];
    if (dpC.feat === 'eye_core' || dpC.feat === 'iris_inner') continue;
    if (dpC.br < 0.65) continue;
    var dpAlpha3 = dpC.br * intensity * (0.7 + Math.sin(t * 1.5 + dpC.ph) * 0.1);
    if (dpAlpha3 < 0.04) continue;
    ctx.globalAlpha = dpAlpha3 * 0.5;
    ctx.beginPath();
    ctx.arc(dpC.x, dpC.y, dpC.sz * 2.0, 0, 6.283);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.restore();

  // ===== EYE GLOW =====
  var eyeYPos = cy - 22;
  var eyeXPos = [cx - 42, cx + 42];

  var trkX = 0, trkY = 0;
  if (oracleState === 'listening') { trkX = Math.sin(t * 0.3) * 2; trkY = 2; }
  else if (oracleState === 'speaking') { trkX = Math.sin(t * 0.5) * 3; trkY = Math.sin(t * 0.7); }
  else if (oracleState === 'thinking') { trkX = Math.sin(t * 1.5) * 6; trkY = Math.cos(t * 2) * 4; }
  else { trkX = Math.sin(t * 0.2) * 4; trkY = Math.cos(t * 0.15) * 2; }
  oracleEyeTrackX += (trkX - oracleEyeTrackX) * 0.06;
  oracleEyeTrackY += (trkY - oracleEyeTrackY) * 0.06;

  oracleBlinkTimer -= 0.016;
  if (oracleBlinkTimer <= 0 && oracleBlinkState === 0) { oracleBlinkState = 1; oracleBlinkTimer = 0.08; }
  else if (oracleBlinkState === 1 && oracleBlinkTimer <= 0) { oracleBlinkState = 2; oracleBlinkTimer = 0.05; }
  else if (oracleBlinkState === 2 && oracleBlinkTimer <= 0) { oracleBlinkState = 3; oracleBlinkTimer = 0.08; }
  else if (oracleBlinkState === 3 && oracleBlinkTimer <= 0) { oracleBlinkState = 0; oracleBlinkTimer = 3 + Math.random() * 4; }
  var blkF = 1;
  if (oracleBlinkState === 1) blkF = oracleBlinkTimer / 0.08;
  else if (oracleBlinkState === 2) blkF = 0.05;
  else if (oracleBlinkState === 3) blkF = 1 - oracleBlinkTimer / 0.08;

  for (var eyi = 0; eyi < 2; eyi++) {
    var eex = eyeXPos[eyi] + oracleEyeTrackX;
    var eey = eyeYPos + oracleEyeTrackY;

    if (blkF > 0.1) {
      ctx.save();
      // Wide bloom — illuminates surrounding mesh (reference: massive radiant eye orbs)
      var eyeGrd = ctx.createRadialGradient(eex, eey, 0, eex, eey, 95 * blkF);
      eyeGrd.addColorStop(0, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.98).toFixed(3) + ')');
      eyeGrd.addColorStop(0.06, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.85).toFixed(3) + ')');
      eyeGrd.addColorStop(0.18, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.45).toFixed(3) + ')');
      eyeGrd.addColorStop(0.45, 'rgba(' + gR + ',' + gG + ',' + gB + ',' + (intensity * 0.12).toFixed(3) + ')');
      eyeGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = eyeGrd;
      ctx.fillRect(eex - 95, eey - 95 * blkF, 190, 190 * blkF);

      // Bright cyan core
      ctx.globalAlpha = intensity;
      ctx.fillStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 160;
      ctx.beginPath();
      ctx.arc(eex, eey, 18 * blkF, 0, 6.283);
      ctx.fill();

      // White-hot center (reference: brilliant white-blue orb)
      ctx.globalAlpha = intensity * 0.92;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#e0f8ff';
      ctx.shadowBlur = 70;
      ctx.beginPath();
      ctx.arc(eex, eey, 9 * blkF, 0, 6.283);
      ctx.fill();

      // Pure white pinpoint
      ctx.globalAlpha = intensity;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(eex, eey, 4 * blkF, 0, 6.283);
      ctx.fill();

      // Specular highlight
      ctx.shadowBlur = 0;
      ctx.globalAlpha = intensity * 0.6;
      ctx.beginPath();
      ctx.arc(eex + 3, eey - 3, 2.2 * blkF, 0, 6.283);
      ctx.fill();
      ctx.restore();
    }
  }

  // THINKING SCAN LINE
  if (oracleState === 'thinking') {
    oracleThinkScanY = (oracleThinkScanY + 2.5) % 250;
    var tsYP = cy - 125 + oracleThinkScanY;
    var tsW = faceW(tsYP) * 1.12;
    if (tsW > 5) {
      ctx.save();
      var tsGrd = ctx.createLinearGradient(cx - tsW, tsYP, cx + tsW, tsYP);
      tsGrd.addColorStop(0, 'rgba(255,170,0,0)');
      tsGrd.addColorStop(0.3, 'rgba(255,170,0,0.25)');
      tsGrd.addColorStop(0.5, 'rgba(255,220,0,0.6)');
      tsGrd.addColorStop(0.7, 'rgba(255,170,0,0.25)');
      tsGrd.addColorStop(1, 'rgba(255,170,0,0)');
      ctx.strokeStyle = tsGrd;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(cx - tsW, tsYP);
      ctx.lineTo(cx + tsW, tsYP);
      ctx.stroke();
      ctx.restore();
    }
  }

  // LISTENING PULSE
  if (oracleState === 'listening') {
    ctx.save();
    var lsP = (t * 1.5) % 1;
    ctx.globalAlpha = intensity * 0.12 * (1 - lsP);
    ctx.strokeStyle = '#00bfff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 90 + lsP * 50, 0, 6.283);
    ctx.stroke();
    ctx.restore();
  }

  // SPEAKING - waveform at mouth
  var spMouthY = cy + 45;
  var spMouthOpen = oracleMouthOpenness * 20;
  if (oracleState === 'speaking' && spMouthOpen > 1.5) {
    ctx.save();
    var spMW = 20 + oracleFormantShape * 8;
    ctx.globalAlpha = intensity * 0.5;
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 8;
    var spBars = 10;
    for (var sbi = 0; sbi < spBars; sbi++) {
      var sbx = cx - spMW + (sbi / (spBars - 1)) * spMW * 2;
      var sbH = (Math.sin(t * 9 + sbi * 1.1) * 0.5 + 0.5) * spMouthOpen * 0.5 * oracleAudioLevel * 3;
      sbH = Math.min(sbH, spMouthOpen * 0.7);
      ctx.fillRect(sbx - 1, spMouthY - sbH * 0.5, 2, Math.max(0.5, sbH));
    }
    ctx.restore();
  }

  ctx.restore(); // breathing scale

  // SCATTER / DISSOLUTION PARTICLES
  ctx.save();
  var cIdx = mesh.contourIndices;
  for (var spi = 0; spi < oracleScatterParts.length; spi++) {
    var sp2 = oracleScatterParts[spi];
    sp2.x += sp2.vx + Math.sin(t * 0.5 + sp2.ph) * 0.1;
    sp2.y += sp2.vy + Math.cos(t * 0.35 + sp2.ph) * 0.07;
    sp2.life--;
    if (sp2.life <= 0) {
      var rsy = cy - 140 + Math.random() * 280;
      var rsw = faceW(rsy);
      var rsDist = rsw > 5 ? rsw * (0.82 + Math.random() * 0.6) : 40 + Math.random() * 100;
      sp2.x = cx + (Math.random() > 0.5 ? 1 : -1) * rsDist;
      sp2.y = rsy + (Math.random() - 0.5) * 15;
      sp2.life = 60 + Math.random() * 280;
      sp2.vx = (Math.random() - 0.5) * 0.25;
      sp2.vy = (Math.random() - 0.5) * 0.18;
    }
    var spA = sp2.alpha * intensity * (sp2.life > 25 ? 1 : sp2.life / 25);
    ctx.globalAlpha = spA;
    ctx.fillStyle = spi % 6 === 0 ? secondaryColor : glowColor;
    ctx.beginPath();
    ctx.arc(sp2.x, sp2.y, sp2.sz, 0, 6.283);
    ctx.fill();

    // Connect to nearby contour points (more frequent, wider reach)
    if (spi % 3 === 0 && spA > 0.02) {
      for (var nk2 = 0; nk2 < cIdx.length; nk2 += 2) {
        var cp = mPts[cIdx[nk2]];
        var ndx2 = sp2.x - cp.x;
        var ndy2 = sp2.y - cp.y;
        var nd2 = Math.sqrt(ndx2 * ndx2 + ndy2 * ndy2);
        if (nd2 < 42) {
          ctx.globalAlpha = spA * 0.28 * (1 - nd2 / 42);
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(sp2.x, sp2.y);
          ctx.lineTo(cp.x, cp.y);
          ctx.stroke();
          break;
        }
      }
    }
  }
  ctx.restore();

  // Subtle CRT scanlines
  ctx.save();
  ctx.globalAlpha = 0.015;
  ctx.fillStyle = '#000';
  for (var scy = 0; scy < h; scy += 3) {
    ctx.fillRect(0, scy, w, 1);
  }
  ctx.restore();

  // State indicator
  if (oracleState !== 'dormant') {
    ctx.save();
    ctx.font = '9px monospace';
    ctx.fillStyle = glowColor;
    ctx.globalAlpha = intensity * 0.25;
    ctx.fillText('SYS:' + oracleState.toUpperCase(), 8, h - 8);
    ctx.fillText(new Date().toLocaleTimeString(), w - 70, h - 8);
    ctx.restore();
  }
}

function startOracleFaceAnim() {
  if (oracleAvatarAnim) return;
  var canvas = document.getElementById('oracle-face-canvas');
  if (!canvas) return;

  function tick() {
    updateOracleAudioReactive();
    drawOracleFace();

    var barEl = document.getElementById('oracle-audio-bar');
    if (barEl) {
      oracleAudioBarSmoothed += (oracleAudioLevel - oracleAudioBarSmoothed) * 0.15;
      barEl.style.width = (oracleAudioBarSmoothed * 100) + '%';
    }

    oracleAvatarAnim = requestAnimationFrame(tick);
  }
  tick();
}

function stopOracleFaceAnim() {
  if (oracleAvatarAnim) { cancelAnimationFrame(oracleAvatarAnim); oracleAvatarAnim = null; }
}

// ── Chat + TTS ──
async function sendOracleMessage() {
  var input = document.getElementById('oracle-input');
  var msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  // Resume AudioContext on user gesture (button click / Enter key)
  try { var actx = getOracleAudioCtx(); if (actx.state === 'suspended') await actx.resume(); } catch(e) {}
  await processOracleInput(msg);
}

async function processOracleInput(msg) {
  if (oracleProcessing) return;
  oracleProcessing = true;
  addOracleMsg('user', msg);
  setOracleState('thinking');

  var imageData = null;
  if (oracleCameraActive) {
    try {
      var video = document.getElementById('oracle-camera-feed');
      var c = document.createElement('canvas'); c.width = 640; c.height = 480;
      c.getContext('2d').drawImage(video, 0, 0, 640, 480);
      imageData = c.toDataURL('image/jpeg', 0.7).split(',')[1];
    } catch(e) {}
  }

  oracleTtsQueue = [];
  oracleSentenceBuffer = '';
  oracleLastFlushTime = Date.now();
  var fullText = '';
  var msgDiv = null;

  try {
    oracleStreamAbort = new AbortController();
    var res = await fetch(BASE + '/api/oracle/chat-stream', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ message: msg, image: imageData }),
      signal: oracleStreamAbort.signal
    });
    if (res.status === 401) { showLogin(); oracleProcessing = false; return; }
    if (!res.ok) throw new Error('Stream failed: ' + res.status);

    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var sseBuffer = '';

    while (true) {
      var chunk = await reader.read();
      if (chunk.done) break;

      sseBuffer += decoder.decode(chunk.value, { stream: true });
      var lines = sseBuffer.split('\\n');
      sseBuffer = lines[lines.length - 1];

      for (var li = 0; li < lines.length - 1; li++) {
        var line = lines[li].trim();
        if (!line.startsWith('data: ')) continue;
        var data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          var parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (!parsed.text) continue;

          fullText += parsed.text;
          oracleSentenceBuffer += parsed.text;

          // Progressive text display
          var displayText = fullText.replace(/\`\`\`task[\\s\\S]*?\`\`\`/g, '[Task dispatched]').trim();
          if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'oracle-msg assistant';
            document.getElementById('oracle-chat').appendChild(msgDiv);
          }
          msgDiv.textContent = displayText;
          var chatEl = document.getElementById('oracle-chat');
          chatEl.scrollTop = chatEl.scrollHeight;

          // Flush complete sentences to TTS queue
          flushSentencesToTTS();
        } catch(pe) {
          if (pe.message && pe.message !== 'undefined') addOracleMsg('system', 'Error: ' + pe.message);
        }
      }
    }

    // Flush remaining text
    if (oracleSentenceBuffer.trim().length > 2) {
      queueOracleTTS(oracleSentenceBuffer.trim());
      oracleSentenceBuffer = '';
    }

  } catch(e) {
    if (e.name !== 'AbortError') {
      // Fallback to non-streaming endpoint
      try {
        var fbRes = await fetch(BASE + '/api/oracle/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ message: msg, image: imageData })
        });
        if (fbRes.status === 401) { showLogin(); oracleProcessing = false; return; }
        var fbData = await fbRes.json();
        if (fbData.error) throw new Error(fbData.error);
        fullText = fbData.response;
        var fbDisplay = fullText.replace(/\`\`\`task[\\s\\S]*?\`\`\`/g, '[Task dispatched]').trim();
        addOracleMsg('assistant', fbDisplay);
        queueOracleTTS(fbDisplay);
      } catch(fbErr) {
        addOracleMsg('system', 'Error: ' + (fbErr.message || e.message));
      }
    }
  }

  oracleProcessing = false;
  oracleStreamAbort = null;

  // Wait for audio queue to finish
  await waitForOracleAudioQueue();
  if (!oracleSpeaking) setOracleState('idle');
}

// ── Sentence Chunking + TTS Queue ──

function flushSentencesToTTS() {
  // Match sentence boundaries: punctuation followed by whitespace OR end-of-buffer
  var sentenceEnd = /([.!?])(\s+|$)/g;
  var lastIdx = 0;
  var match;
  while ((match = sentenceEnd.exec(oracleSentenceBuffer)) !== null) {
    var sentence = oracleSentenceBuffer.slice(lastIdx, match.index + 1).trim();
    lastIdx = match.index + match[0].length;
    if (sentence.length > 8 && !/^\`\`\`task/.test(sentence)) {
      queueOracleTTS(sentence);
      oracleLastFlushTime = Date.now();
    }
  }
  if (lastIdx > 0) {
    oracleSentenceBuffer = oracleSentenceBuffer.slice(lastIdx);
  }
  // Time-based flush: if buffer has substantial text and it's been too long since last flush
  // This catches long run-on responses that lack punctuation
  var now = Date.now();
  if (
    oracleSentenceBuffer.trim().length > 45 &&
    oracleLastFlushTime > 0 &&
    now - oracleLastFlushTime > ORACLE_MAX_BUFFER_MS
  ) {
    // Find the last natural break (comma, colon, semicolon) in the buffer
    var breakMatch = oracleSentenceBuffer.match(/^(.*[,;:])\s+(.*)$/);
    if (breakMatch && breakMatch[1].length > 15) {
      queueOracleTTS(breakMatch[1].trim());
      oracleSentenceBuffer = breakMatch[2];
    } else {
      queueOracleTTS(oracleSentenceBuffer.trim());
      oracleSentenceBuffer = '';
    }
    oracleLastFlushTime = now;
  }
}

function queueOracleTTS(text) {
  if (!text || text.length < 3) return;
  // Strip task blocks
  text = text.replace(/\`\`\`task[\\s\\S]*?\`\`\`/g, '').trim();
  if (!text || text.length < 3) return;

  var item = {
    text: text,
    audioPromise: fetchOracleTTSAudio(text)
  };
  oracleTtsQueue.push(item);

  // Start playback if not already playing
  if (!oraclePlayingQueue) {
    playNextOracleAudio();
  }
}

async function fetchOracleTTSAudio(text) {
  var res = await fetch(BASE + '/api/oracle/tts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ text: text })
  });
  if (!res.ok) {
    var errBody = '';
    try { errBody = await res.text(); } catch(x) {}
    throw new Error('TTS failed (' + res.status + '): ' + errBody.slice(0, 100));
  }
  return await res.arrayBuffer();
}

function ensureOracleAnalyser() {
  if (oracleTtsAnalyser) return;
  var actx = getOracleAudioCtx();
  oracleTtsAnalyser = actx.createAnalyser();
  oracleTtsAnalyser.fftSize = 256;
  oracleTtsAnalyser.smoothingTimeConstant = 0.6;
  oracleTtsFreqData = new Uint8Array(oracleTtsAnalyser.frequencyBinCount);
  oracleTtsAnalyser.connect(actx.destination);
}

async function playNextOracleAudio() {
  if (oracleTtsQueue.length === 0) {
    oraclePlayingQueue = false;
    oracleSpeaking = false;
    oracleCurrentSource = null;
    var bar = document.getElementById('oracle-audio-bar');
    if (bar) bar.style.width = '0%';
    if (!oracleProcessing) setOracleState('idle');
    return;
  }

  oraclePlayingQueue = true;
  oracleSpeaking = true;
  setOracleState('speaking');

  var item = oracleTtsQueue.shift();
  try {
    var arrayBuffer = await item.audioPromise;
    var actx = getOracleAudioCtx();
    if (actx.state === 'suspended') await actx.resume();

    var audioBuffer = await actx.decodeAudioData(arrayBuffer.slice(0));
    var source = actx.createBufferSource();
    source.buffer = audioBuffer;

    ensureOracleAnalyser();
    source.connect(oracleTtsAnalyser);
    oracleCurrentSource = source;

    await new Promise(function(resolve) {
      source.onended = function() {
        oracleCurrentSource = null;
        resolve();
      };
      source.start(0);
    });
  } catch(e) {
    console.warn('TTS queue playback error:', e);
    addOracleMsg('system', 'Voice error: ' + (e.message || 'audio playback failed'));
    oracleCurrentSource = null;
  }

  // Play next item in queue
  playNextOracleAudio();
}

function bargeIn() {
  // Stop current audio source
  if (oracleCurrentSource) {
    try { oracleCurrentSource.stop(); } catch(e) {}
    oracleCurrentSource = null;
  }
  // Clear queue
  oracleTtsQueue = [];
  oraclePlayingQueue = false;
  oracleSpeaking = false;
  // Cancel stream if in progress
  if (oracleStreamAbort) {
    oracleStreamAbort.abort();
    oracleStreamAbort = null;
  }
  oracleProcessing = false;
}

async function waitForOracleAudioQueue() {
  while (oraclePlayingQueue || oracleTtsQueue.length > 0) {
    await new Promise(function(r) { setTimeout(r, 100); });
  }
}

// Legacy fallback (kept for compat)
async function speakOracle(text) {
  queueOracleTTS(text);
  await waitForOracleAudioQueue();
}

// ── Voice Activity Detection (VAD) ──
// Auto-detects speech, records it, transcribes, sends to Oracle
var vadAnalyser = null;
var vadDataArray = null;
var vadSilenceStart = 0;
var vadRecording = false;
var VAD_THRESHOLD = 15; // volume threshold to detect speech
var VAD_BARGE_THRESHOLD = 40; // higher threshold during playback (echo rejection)
var VAD_SILENCE_MS = 750; // silence duration to stop recording — tight for natural turn-taking
var vadCheckInterval = null;

async function startVAD() {
  if (!navigator.mediaDevices) { addOracleMsg('system', 'Mic requires HTTPS. Use the Cloudflare tunnel URL.'); return; }
  try {
    oracleMicStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var audioCtx = new AudioContext();
    var source = audioCtx.createMediaStreamSource(oracleMicStream);
    vadAnalyser = audioCtx.createAnalyser();
    vadAnalyser.fftSize = 512;
    source.connect(vadAnalyser);
    vadDataArray = new Uint8Array(vadAnalyser.frequencyBinCount);

    oracleMediaRecorder = new MediaRecorder(oracleMicStream, { mimeType: 'audio/webm;codecs=opus' });
    oracleMediaRecorder.ondataavailable = function(e) { if (e.data.size > 0) oracleAudioChunks.push(e.data); };
    oracleMediaRecorder.onstop = handleVadRecordingDone;

    vadCheckInterval = setInterval(checkVAD, 80);
    oracleVadActive = true;
    setOracleState('idle');
  } catch(e) {
    addOracleMsg('system', 'Mic error: ' + e.message);
  }
}

function checkVAD() {
  if (!vadAnalyser || oracleProcessing) return;
  vadAnalyser.getByteFrequencyData(vadDataArray);
  var sum = 0;
  for (var i = 0; i < vadDataArray.length; i++) sum += vadDataArray[i];
  var avg = sum / vadDataArray.length;

  // Use higher threshold during playback to reject echo
  var threshold = oracleSpeaking ? VAD_BARGE_THRESHOLD : VAD_THRESHOLD;

  if (avg > threshold) {
    // Speech detected
    vadSilenceStart = 0;
    if (!vadRecording) {
      // Barge-in: interrupt Oracle if it's speaking
      if (oracleSpeaking) {
        bargeIn();
      }
      vadRecording = true;
      oracleAudioChunks = [];
      try { oracleMediaRecorder.start(); } catch(e) {}
      setOracleState('listening');
    }
  } else if (vadRecording) {
    // Silence while recording
    if (!vadSilenceStart) vadSilenceStart = Date.now();
    if (Date.now() - vadSilenceStart > VAD_SILENCE_MS) {
      // Silence long enough, stop recording
      vadRecording = false;
      vadSilenceStart = 0;
      try { oracleMediaRecorder.stop(); } catch(e) {}
    }
  }
}

async function handleVadRecordingDone() {
  if (oracleAudioChunks.length === 0) { setOracleState('idle'); return; }
  var blob = new Blob(oracleAudioChunks, { type: 'audio/webm' });
  if (blob.size < 2000) { setOracleState('idle'); return; } // too short, ignore
  oracleAudioChunks = [];
  setOracleState('thinking');

  try {
    var res = await fetch(BASE + '/api/oracle/stt', {
      method: 'POST', headers: { 'Content-Type': 'audio/webm' },
      credentials: 'same-origin', body: blob
    });
    if (res.status === 401) { showLogin(); return; }
    var data = await res.json();
    if (data.error) throw new Error(data.error);
    if (data.text && data.text.trim().length > 1) {
      await processOracleInput(data.text.trim());
    } else {
      setOracleState('idle');
    }
  } catch(e) {
    addOracleMsg('system', 'Transcription error: ' + e.message);
    setOracleState('idle');
  }
}

function stopVAD() {
  if (vadCheckInterval) { clearInterval(vadCheckInterval); vadCheckInterval = null; }
  if (oracleMicStream) { oracleMicStream.getTracks().forEach(function(t) { t.stop(); }); oracleMicStream = null; }
  oracleVadActive = false;
  vadRecording = false;
}

// ── Camera auto-start ──
async function startOracleCamera() {
  if (!navigator.mediaDevices) return;
  try {
    oracleCameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
    var video = document.getElementById('oracle-camera-feed');
    video.srcObject = oracleCameraStream;
    document.getElementById('oracle-camera-mini').style.display = '';
    oracleCameraActive = true;
  } catch(e) { /* camera optional, fail silently */ }
}

function stopOracleCamera() {
  if (oracleCameraStream) { oracleCameraStream.getTracks().forEach(function(t) { t.stop(); }); oracleCameraStream = null; }
  document.getElementById('oracle-camera-mini').style.display = 'none';
  oracleCameraActive = false;
}

// ── Oracle init/cleanup on tab switch ──
async function initOracle() {
  if (oracleInitialized) return;
  oracleInitialized = true;
  // Create AudioContext eagerly during user gesture (tab click)
  try { var actx = getOracleAudioCtx(); if (actx.state === 'suspended') actx.resume(); } catch(e) { console.warn('AudioContext init:', e); }
  startOracleFaceAnim();
  await startVAD();
  await startOracleCamera();
}

function cleanupOracle() {
  if (!oracleInitialized) return;
  oracleInitialized = false;
  stopOracleFaceAnim();
  stopVAD();
  stopOracleCamera();
  setOracleState('dormant');
}

// Matrix Music Player -- HTML5 Audio
// To use Clubbed to Death: drop the MP3 at static/matrix-music.mp3
var matrixMusicPlaying = false;
var matrixAudio = new Audio('/static/matrix-music.mp3');
matrixAudio.loop = true;
matrixAudio.volume = 0.7;

function toggleMatrixMusic() {
  var btn = document.getElementById('matrix-music-btn');
  var icon = document.getElementById('matrix-music-icon');
  var label = document.getElementById('matrix-music-label');
  var eq = document.getElementById('matrix-music-eq');

  if (!matrixMusicPlaying) {
    matrixAudio.play().then(function() {
      btn.classList.add('playing');
      icon.innerHTML = '&#9646;&#9646;';
      icon.style.fontSize = '10px';
      icon.style.letterSpacing = '1px';
      label.textContent = 'PLAYING';
      eq.style.display = 'flex';
      matrixMusicPlaying = true;
      document.getElementById('matrix-rain').style.opacity = '0.45';
      document.getElementById('matrix-rain-glow').style.opacity = '0.25';
    }).catch(function(err) {
      console.error('Audio play failed:', err);
      label.textContent = 'ERROR';
      setTimeout(function() { label.textContent = 'MATRIX'; }, 2000);
    });
  } else {
    matrixAudio.pause();
    btn.classList.remove('playing');
    icon.innerHTML = '&#9654;';
    icon.style.fontSize = '14px';
    icon.style.letterSpacing = '0';
    label.textContent = 'MATRIX';
    eq.style.display = 'none';
    matrixMusicPlaying = false;
    document.getElementById('matrix-rain').style.opacity = '0.28';
    document.getElementById('matrix-rain-glow').style.opacity = '0.14';
  }
}
</script>

<script>
// Dramatic Matrix rain -- dual-layer with glow, katakana, variable speed
(function() {
  // Katakana + Latin + digits + symbols for authentic Matrix look
  var katakana = '\u30A0\u30A1\u30A2\u30A3\u30A4\u30A5\u30A6\u30A7\u30A8\u30A9\u30AA\u30AB\u30AC\u30AD\u30AE\u30AF\u30B0\u30B1\u30B2\u30B3\u30B4\u30B5\u30B6\u30B7\u30B8\u30B9\u30BA\u30BB\u30BC\u30BD\u30BE\u30BF\u30C0\u30C1\u30C2\u30C3\u30C4\u30C5\u30C6\u30C7\u30C8\u30C9\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF';
  var chars = katakana + '0123456789ABCDEFZ@#$<>/\\|{}[]';
  var pick = function() { return chars.charAt(Math.floor(Math.random() * chars.length)); };

  function createLayer(canvasId, fontSize, speed, fadeAlpha, trailLen) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    var speeds = [];
    var chars_cache = []; // pre-pick chars per column for flicker
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
      speeds[i] = 0.3 + Math.random() * speed;
      chars_cache[i] = pick();
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold ' + fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var y = drops[i] * fontSize;
        // White-hot head character
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 18;
        var headChar = pick();
        ctx.fillText(headChar, i * fontSize, y);
        // Bright green sub-head
        ctx.fillStyle = '#00ff41';
        ctx.shadowBlur = 12;
        ctx.fillText(pick(), i * fontSize, y - fontSize);
        // Trail characters with long fade
        ctx.shadowBlur = 0;
        for (var t = 2; t < trailLen; t++) {
          var trailY = y - t * fontSize;
          if (trailY < 0) break;
          var alpha = Math.max(0, 1 - (t - 1) / (trailLen - 1));
          ctx.fillStyle = 'rgba(0, 255, 65, ' + (alpha * 0.7) + ')';
          if (Math.random() > 0.7) {
            chars_cache[i] = pick();
          }
          ctx.fillText(chars_cache[i], i * fontSize, trailY);
        }
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
          speeds[i] = 0.3 + Math.random() * speed;
        }
        drops[i] += speeds[i];
      }
    }

    return {
      draw: draw,
      resize: function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = []; speeds = []; chars_cache = [];
        for (var i = 0; i < columns; i++) {
          drops[i] = Math.random() * -50;
          speeds[i] = 0.3 + Math.random() * speed;
          chars_cache[i] = pick();
        }
      }
    };
  }

  // Primary rain: dense, medium chars, long trails
  var primary = createLayer('matrix-rain', 14, 1.8, 0.04, 18);
  // Glow layer: larger, slower, creates depth
  var glow = createLayer('matrix-rain-glow', 20, 1.0, 0.03, 12);

  setInterval(primary.draw, 33);
  setInterval(glow.draw, 50);

  window.addEventListener('resize', function() {
    primary.resize();
    glow.resize();
  });
})();

// ── Knowledge Sub-tab Switching + Integrations ───────────────────────
var intgLoaded = false;

function switchKgSubTab(sub, btn) {
  document.getElementById('kg-view-graph').style.display = sub === 'graph' ? '' : 'none';
  document.getElementById('kg-view-integrations').style.display = sub === 'integrations' ? '' : 'none';
  document.getElementById('kg-subtab-graph').classList.toggle('active', sub === 'graph');
  document.getElementById('kg-subtab-integrations').classList.toggle('active', sub === 'integrations');
  if (sub === 'integrations' && !intgLoaded) { intgLoaded = true; loadIntegrationsData(); }
}

function loadIntegrationsData() {
  var mcps = [
    { name: 'Canva', category: 'Design', tools: 28, icon: '\\ud83c\\udfa8', color: '#00c4cc' },
    { name: 'Clay', category: 'Sales Intelligence', tools: 14, icon: '\\ud83e\\uddf1', color: '#6366f1' },
    { name: 'ClickUp', category: 'Project Management', tools: 50, icon: '\\u2705', color: '#7b68ee' },
    { name: 'Custom MCP 1', category: 'Your Category', tools: 39, icon: '\\ud83d\\udd27', color: '#ffd700' },
    { name: 'Custom MCP 2', category: 'Your Category', tools: 44, icon: '\\ud83e\\uddea', color: '#f59e0b' },
    { name: 'Figma', category: 'Design', tools: 17, icon: '\\ud83d\\udd8c\\ufe0f', color: '#a259ff' },
    { name: 'Gmail', category: 'Communication', tools: 11, icon: '\\u2709\\ufe0f', color: '#ea4335' },
    { name: 'Google Calendar', category: 'Productivity', tools: 8, icon: '\\ud83d\\udcc5', color: '#4285f4' },
    { name: 'Higgsfield', category: 'AI Video', tools: 14, icon: '\\ud83c\\udfac', color: '#ec4899' },
    { name: 'HubSpot', category: 'CRM / Marketing', tools: 12, icon: '\\ud83e\\uddf2', color: '#ff7a59' },
    { name: 'Notion', category: 'Productivity', tools: 12, icon: '\\ud83d\\udcd3', color: '#ffffff' },
    { name: 'Slack', category: 'Communication', tools: 13, icon: '\\ud83d\\udcac', color: '#4a154b' },
    { name: 'Stripe', category: 'Payments', tools: 17, icon: '\\ud83d\\udcb3', color: '#635bff' },
    { name: 'Playwright', category: 'Browser Automation', tools: 21, icon: '\\ud83c\\udf10', color: '#2ead33' }
  ];

  var apis = [
    { name: 'Anthropic (Claude)', category: 'AI / LLM', status: 'active', color: '#d4a574' },
    { name: 'Groq (Whisper STT)', category: 'AI / Voice', status: 'active', color: '#f97316' },
    { name: 'ElevenLabs (TTS)', category: 'AI / Voice', status: 'active', color: '#00cc99' },
    { name: 'Google Gemini', category: 'AI / Vision', status: 'active', color: '#4285f4' },
    { name: 'Supabase', category: 'Database', status: 'active', color: '#3ecf8e' },
    { name: 'Twilio', category: 'SMS', status: 'active', color: '#f22f46' },
    { name: 'Shopify', category: 'E-commerce', status: 'active', color: '#96bf48' },
    { name: 'Stripe (Direct)', category: 'Payments', status: 'active', color: '#635bff' },
    { name: 'HubSpot (Direct)', category: 'CRM', status: 'active', color: '#ff7a59' },
    { name: 'Zoom', category: 'Video', status: 'active', color: '#2d8cff' },
    { name: 'WHOOP', category: 'Health / Fitness', status: 'active', color: '#00d1b2' },
    { name: 'Granola', category: 'Meeting Notes', status: 'active', color: '#a78bfa' },
    { name: 'Telegram', category: 'Communication', status: 'active', color: '#26a5e4' }
  ];

  var agents = [
    { name: 'Link (Main)', bot: 'linkmaster13bot', color: '#00ff41' },
    { name: 'Trinity', bot: 'trinity949bot', color: '#67e8f9' },
    { name: 'Steve', bot: 'SteveSalesBot', color: '#00bbff' },
    { name: 'Smith', bot: 'Smithmanbot', color: '#ff00ff' },
    { name: 'Neo', bot: 'neo949bot', color: '#ff6600' },
    { name: 'Morpheus', bot: 'Morpheus208bot', color: '#c0a050' }
  ];

  var skills = [
    { name: 'code-review', scope: 'Global', desc: 'PR review for React, Vue, Rust, TS, Python' },
    { name: 'fullstack-dev-skills', scope: 'Global', desc: 'Full-stack development patterns' },
    { name: 'add-migration', scope: 'Project', desc: 'Database migration generator' },
    { name: 'claude-api', scope: 'Global', desc: 'Anthropic SDK & Agent SDK' },
    { name: 'gmail', scope: 'Global', desc: 'Email management' },
    { name: 'google-calendar', scope: 'Global', desc: 'Schedule & meetings' },
    { name: 'todo', scope: 'Global', desc: 'Task tracking from Obsidian' },
    { name: 'agent-browser', scope: 'Global', desc: 'Playwright browser automation' },
    { name: 'maestro', scope: 'Global', desc: 'Parallel task orchestration' }
  ];

  var totalTools = mcps.reduce(function(s, m) { return s + m.tools; }, 0);

  // Stats
  var statsHtml = '';
  var stats = [
    { label: 'MCP Servers', value: mcps.length, color: '#00ff41' },
    { label: 'Total Tools', value: totalTools, color: '#00bbff' },
    { label: 'API Services', value: apis.length, color: '#ffcc00' },
    { label: 'Agents', value: agents.length, color: '#ff6600' },
    { label: 'Skills', value: skills.length, color: '#a78bfa' }
  ];
  stats.forEach(function(s) {
    statsHtml += '<div class="card" style="padding:12px;text-align:center">';
    statsHtml += '<div style="font-size:22px;font-weight:700;color:' + s.color + '">' + s.value + '</div>';
    statsHtml += '<div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-top:2px">' + s.label + '</div>';
    statsHtml += '</div>';
  });
  document.getElementById('intg-stats-row').innerHTML = statsHtml;

  // MCP grid
  var mcpHtml = '';
  mcps.forEach(function(m) {
    mcpHtml += '<div class="card" style="padding:10px">';
    mcpHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
    mcpHtml += '<span style="font-size:18px">' + m.icon + '</span>';
    mcpHtml += '<div>';
    mcpHtml += '<div style="font-size:13px;font-weight:600;color:#c0e8c0">' + m.name + '</div>';
    mcpHtml += '<div style="font-size:10px;color:#6b7280">' + m.category + '</div>';
    mcpHtml += '</div>';
    mcpHtml += '<div style="margin-left:auto;text-align:right">';
    mcpHtml += '<div style="font-size:14px;font-weight:700;color:' + m.color + '">' + m.tools + '</div>';
    mcpHtml += '<div style="font-size:9px;color:#6b7280">tools</div>';
    mcpHtml += '</div>';
    mcpHtml += '</div>';
    mcpHtml += '<div style="display:flex;align-items:center;gap:4px">';
    mcpHtml += '<span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 4px rgba(16,185,129,0.5)"></span>';
    mcpHtml += '<span style="font-size:9px;color:#10b981">Connected</span>';
    mcpHtml += '</div>';
    mcpHtml += '</div>';
  });
  document.getElementById('intg-mcp-grid').innerHTML = mcpHtml;

  // API grid
  var apiHtml = '';
  apis.forEach(function(a) {
    apiHtml += '<div class="card" style="padding:10px;display:flex;align-items:center;gap:8px">';
    apiHtml += '<div style="width:4px;height:32px;border-radius:2px;background:' + a.color + ';flex-shrink:0"></div>';
    apiHtml += '<div style="flex:1;min-width:0">';
    apiHtml += '<div style="font-size:12px;font-weight:600;color:#c0e8c0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.name + '</div>';
    apiHtml += '<div style="font-size:10px;color:#6b7280">' + a.category + '</div>';
    apiHtml += '</div>';
    var stColor = a.status === 'active' ? '#10b981' : '#6b7280';
    apiHtml += '<span style="width:6px;height:6px;border-radius:50%;background:' + stColor + ';display:inline-block;box-shadow:0 0 4px ' + stColor + '80;flex-shrink:0"></span>';
    apiHtml += '</div>';
  });
  document.getElementById('intg-api-grid').innerHTML = apiHtml;

  // Agents grid
  var agHtml = '';
  agents.forEach(function(a) {
    agHtml += '<div class="card" style="padding:10px;text-align:center">';
    agHtml += '<div style="width:36px;height:36px;border-radius:50%;background:' + a.color + '18;border:2px solid ' + a.color + '40;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:14px;font-weight:700;color:' + a.color + '">' + a.name.charAt(0) + '</div>';
    agHtml += '<div style="font-size:12px;font-weight:600;color:#c0e8c0">' + a.name + '</div>';
    agHtml += '<div style="font-size:9px;color:#6b7280;font-family:monospace">@' + a.bot + '</div>';
    agHtml += '</div>';
  });
  document.getElementById('intg-agents-grid').innerHTML = agHtml;

  // Skills grid
  var skHtml = '';
  skills.forEach(function(s) {
    var scopeColor = s.scope === 'Global' ? '#00bbff' : '#f59e0b';
    skHtml += '<div class="card" style="padding:10px">';
    skHtml += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">';
    skHtml += '<span style="font-size:12px;font-weight:600;color:#c0e8c0;font-family:monospace">' + s.name + '</span>';
    skHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + scopeColor + '15;color:' + scopeColor + '">' + s.scope + '</span>';
    skHtml += '</div>';
    skHtml += '<div style="font-size:10px;color:#6b7280">' + s.desc + '</div>';
    skHtml += '</div>';
  });
  document.getElementById('intg-skills-grid').innerHTML = skHtml;
}

// ── Português Learning Dashboard ──────────────────────────────────────
function loadPortugueseData() {
  var PT = {
    level: 'B2 - Upper Intermediate',
    startDate: 'March 2024',
    monthsLearning: 26,
    totalVocab: 340,
    masteredVocab: 195,
    classesCompleted: 18,
    writtenTexts: 12,
    irregularVerbsMastered: 14,
    skills: [
      { name: 'Reading', score: 82 },
      { name: 'Writing', score: 75 },
      { name: 'Speaking', score: 65 },
      { name: 'Listening', score: 55 },
      { name: 'Grammar', score: 82 },
      { name: 'Vocabulary', score: 80 }
    ],
    grammar: [
      { concept: 'Presente do Indicativo', status: 'mastered', pct: 95 },
      { concept: 'Pret\\u00e9rito Perfeito', status: 'mastered', pct: 95 },
      { concept: 'Pret\\u00e9rito Imperfeito', status: 'learning', pct: 65 },
      { concept: 'Futuro do Presente (ir + inf)', status: 'mastered', pct: 90 },
      { concept: 'Futuro do Presente (formal)', status: 'learning', pct: 60 },
      { concept: 'Condicional (Futuro do Pret\\u00e9rito)', status: 'learning', pct: 75 },
      { concept: 'Subjuntivo Presente', status: 'mastered', pct: 92 },
      { concept: 'Subjuntivo Pret. Perfeito (tenha + ado/ido)', status: 'learning', pct: 65 },
      { concept: 'Subjuntivo Imperfeito (-sse)', status: 'learning', pct: 70 },
      { concept: 'Subjuntivo Futuro', status: 'learning', pct: 50 },
      { concept: 'Tempos Compostos (ter + participle)', status: 'learning', pct: 60 },
      { concept: 'Imperativo', status: 'learning', pct: 65 },
      { concept: 'Voz Passiva (ser + participle + por)', status: 'introduced', pct: 45 },
      { concept: 'Ger\\u00fandio & Partic\\u00edpio', status: 'mastered', pct: 90 },
      { concept: 'Preposi\\u00e7\\u00f5es (por/para/a)', status: 'learning', pct: 70 },
      { concept: 'Compara\\u00e7\\u00f5es (que vs de)', status: 'learning', pct: 65 },
      { concept: 'Conectivos (13 tipos)', status: 'mastered', pct: 90 },
      { concept: 'Pronomes Objeto', status: 'introduced', pct: 30 },
      { concept: 'Acentua\\u00e7\\u00e3o', status: 'learning', pct: 50 },
      { concept: 'Concord\\u00e2ncia de G\\u00eanero', status: 'learning', pct: 55 },
      { concept: 'Irregular Verbs (14 fully conjugated)', status: 'learning', pct: 72 }
    ],
    irregularVerbs: [
      { verb: 'Ser', meaning: 'to be (permanent)', level: 'mastered' },
      { verb: 'Estar', meaning: 'to be (temporary)', level: 'mastered' },
      { verb: 'Ter', meaning: 'to have', level: 'mastered' },
      { verb: 'Ir', meaning: 'to go', level: 'mastered' },
      { verb: 'Fazer', meaning: 'to do/make', level: 'mastered' },
      { verb: 'Poder', meaning: 'can/to be able', level: 'learning' },
      { verb: 'Querer', meaning: 'to want', level: 'learning' },
      { verb: 'Saber', meaning: 'to know', level: 'learning' },
      { verb: 'Ver', meaning: 'to see', level: 'learning' },
      { verb: 'Ficar', meaning: 'to stay/keep/be', level: 'mastered' },
      { verb: 'Dar', meaning: 'to give', level: 'learning' },
      { verb: 'Vir', meaning: 'to come', level: 'learning' },
      { verb: 'Trazer', meaning: 'to bring', level: 'learning' },
      { verb: 'Conseguir', meaning: 'to get/obtain', level: 'learning' },
      { verb: 'Sair', meaning: 'to leave/go out', level: 'introduced' }
    ],
    vocab: [
      { category: 'Business / Finance', count: 55, mastered: 40, icon: '\\ud83d\\udcbc' },
      { category: 'Marketing', count: 22, mastered: 15, icon: '\\ud83d\\udce3' },
      { category: 'Food / Restaurant', count: 18, mastered: 14, icon: '\\ud83c\\udf7d\\ufe0f' },
      { category: 'Travel / Daily Life', count: 20, mastered: 12, icon: '\\u2708\\ufe0f' },
      { category: 'Workplace', count: 25, mastered: 18, icon: '\\ud83c\\udfe2' },
      { category: 'Verbs (Irregular)', count: 60, mastered: 38, icon: '\\ud83d\\udd04' },
      { category: 'Connectors', count: 35, mastered: 28, icon: '\\ud83d\\udd17' },
      { category: 'Prepositions', count: 18, mastered: 12, icon: '\\ud83d\\udccd' },
      { category: 'Common Slang', count: 15, mastered: 8, icon: '\\ud83d\\udde3\\ufe0f' },
      { category: 'Adjectives', count: 20, mastered: 12, icon: '\\ud83c\\udfa8' },
      { category: 'Quantifiers', count: 12, mastered: 8, icon: '\\ud83d\\udcca' },
      { category: 'Pronunciation', count: 25, mastered: 20, icon: '\\ud83c\\udf99\\ufe0f' },
      { category: 'Expressions (estar + de)', count: 15, mastered: 10, icon: '\\ud83d\\udcac' }
    ],
    strengths: [
      'Business/Professional vocabulary (50+ terms actively used)',
      'Pret\\u00e9rito Perfeito - 15/15 on irregular verb exercises',
      'Present Subjunctive - knows all trigger phrases (espero que, talvez, embora, mesmo que...)',
      '14 irregular verbs fully conjugated across all moods (Indicativo + Subjuntivo)',
      'Connectors & text cohesion (13 types mastered)',
      'Comprehensive conjugation reference doc created (self-study)',
      'Prepositions (por/para/a) with contractions (pelo/pela/pro/pra)',
      'Passive voice structure understood (ser + participle + por)',
      'Written production on complex topics (AI, entrepreneurship)',
      'All 8 pronunciation modules completed',
      'Cultural awareness: Brazilian past-tense-in-present usage, word shortening (voce->ce, estou->to)',
      'Wedding speech written and delivered in Portuguese'
    ],
    weaknesses: [
      { area: 'Accent marks & spelling', priority: 'HIGH' },
      { area: 'Noun gender agreement', priority: 'HIGH' },
      { area: 'Pret\\u00e9rito Imperfeito usage', priority: 'MEDIUM' },
      { area: 'Future Subjunctive automation', priority: 'MEDIUM' },
      { area: 'Compound tenses practice', priority: 'MEDIUM' },
      { area: 'Object pronouns (unstudied formally)', priority: 'MEDIUM' },
      { area: 'Listening comprehension', priority: 'MEDIUM' },
      { area: 'Vocabulary beyond business context', priority: 'LOW' }
    ],
    timeline: [
      { date: 'Mar 2024', topic: 'Introdu\\u00e7\\u00e3o ao Portugu\\u00eas', type: 'start' },
      { date: 'Apr 2024', topic: 'Os Sons do Portugu\\u00eas (8 pronunciation modules)', type: 'milestone' },
      { date: 'May 2024', topic: 'Conectivos (13 tipos) + Pret\\u00e9rito Perfeito', type: 'grammar' },
      { date: 'Jul 2024', topic: 'Vocabulary expansion + error corrections', type: 'vocab' },
      { date: 'Aug 2024', topic: 'Portugu\\u00eas no trabalho + Subjuntivo Presente', type: 'grammar' },
      { date: 'Dec 2024', topic: 'Complete verb tense table + written production', type: 'milestone' },
      { date: 'Jan 2025', topic: 'Irregular verbs - Subjuntivo + Futuro do Subjuntivo', type: 'grammar' },
      { date: 'Feb 2025', topic: 'Intensive subjunctive exercises + translation', type: 'grammar' },
      { date: 'Jun 2025', topic: 'Learning summary + custom exercises', type: 'milestone' },
      { date: 'Oct 2025', topic: 'Vocabul\\u00e1rio financeiro + Marketing book', type: 'vocab' },
      { date: 'Dec 2025', topic: 'Vocabulary self-test', type: 'test' },
      { date: 'Mar 2026', topic: 'Full learning analysis + 4-week improvement plan', type: 'milestone' },
      { date: 'Apr 2026', topic: 'Wedding speech in Portuguese (delivered!)', type: 'milestone' },
      { date: 'May 2026', topic: 'Flashcard database active, ongoing review', type: 'active' }
    ],
    resources: [
      { name: 'Caf\\u00e9 da Manh\\u00e3', type: 'Podcast', desc: 'Daily news in Brazilian Portuguese' },
      { name: 'Nerdcast', type: 'Podcast', desc: 'Pop culture discussions in PT-BR' },
      { name: 'Flow Podcast', type: 'Podcast', desc: 'Long-form interviews' },
      { name: 'Porta dos Fundos', type: 'YouTube', desc: 'Comedy sketches (slang, colloquial)' },
      { name: 'Manual do Mundo', type: 'YouTube', desc: 'Science/education content' },
      { name: '3%', type: 'Netflix', desc: 'Sci-fi thriller (Brazilian)' },
      { name: 'Sintonia', type: 'Netflix', desc: 'Youth drama from S\\u00e3o Paulo' },
      { name: 'Irmandade', type: 'Netflix', desc: 'Crime drama series' }
    ]
  };

  // Level badge
  document.getElementById('pt-level-badge').textContent = PT.level;

  // Stats row
  var statsHtml = '';
  var stats = [
    { label: 'Level', value: 'B2', color: '#00cc66' },
    { label: 'Months', value: PT.monthsLearning, color: '#00bbff' },
    { label: 'Vocabulary', value: PT.totalVocab + ' words', color: '#ffcc00' },
    { label: 'Mastered', value: Math.round(PT.masteredVocab / PT.totalVocab * 100) + '%', color: '#10b981' },
    { label: 'Irregular Verbs', value: PT.irregularVerbsMastered, color: '#f97316' },
    { label: 'Classes', value: PT.classesCompleted, color: '#a78bfa' },
    { label: 'Texts Written', value: PT.writtenTexts, color: '#f472b6' }
  ];
  stats.forEach(function(s) {
    statsHtml += '<div class="card" style="padding:12px;text-align:center">';
    statsHtml += '<div style="font-size:22px;font-weight:700;color:' + s.color + '">' + s.value + '</div>';
    statsHtml += '<div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-top:2px">' + s.label + '</div>';
    statsHtml += '</div>';
  });
  document.getElementById('pt-stats-row').innerHTML = statsHtml;

  // Skills Radar Chart
  var radarCanvas = document.getElementById('pt-radar-chart');
  if (radarCanvas) {
    var rctx = radarCanvas.getContext('2d');
    var rcx = 140, rcy = 130, rr = 100;
    var skills = PT.skills;
    var n = skills.length;
    var angleStep = (Math.PI * 2) / n;
    var startAngle = -Math.PI / 2;

    rctx.clearRect(0, 0, 280, 260);

    // Grid rings
    [0.25, 0.5, 0.75, 1.0].forEach(function(ring) {
      rctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = startAngle + i * angleStep;
        var px = rcx + Math.cos(a) * rr * ring;
        var py = rcy + Math.sin(a) * rr * ring;
        if (i === 0) rctx.moveTo(px, py); else rctx.lineTo(px, py);
      }
      rctx.strokeStyle = 'rgba(0,180,80,0.12)';
      rctx.lineWidth = 1;
      rctx.stroke();
    });

    // Axis lines
    for (var i = 0; i < n; i++) {
      var a = startAngle + i * angleStep;
      rctx.beginPath();
      rctx.moveTo(rcx, rcy);
      rctx.lineTo(rcx + Math.cos(a) * rr, rcy + Math.sin(a) * rr);
      rctx.strokeStyle = 'rgba(0,180,80,0.1)';
      rctx.lineWidth = 1;
      rctx.stroke();
    }

    // Data polygon
    rctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var idx = i % n;
      var a = startAngle + idx * angleStep;
      var val = skills[idx].score / 100;
      var px = rcx + Math.cos(a) * rr * val;
      var py = rcy + Math.sin(a) * rr * val;
      if (i === 0) rctx.moveTo(px, py); else rctx.lineTo(px, py);
    }
    rctx.fillStyle = 'rgba(0,204,102,0.15)';
    rctx.fill();
    rctx.strokeStyle = '#00cc66';
    rctx.lineWidth = 2;
    rctx.stroke();

    // Data points + labels
    for (var i = 0; i < n; i++) {
      var a = startAngle + i * angleStep;
      var val = skills[i].score / 100;
      var px = rcx + Math.cos(a) * rr * val;
      var py = rcy + Math.sin(a) * rr * val;

      rctx.beginPath();
      rctx.arc(px, py, 4, 0, Math.PI * 2);
      rctx.fillStyle = '#00cc66';
      rctx.fill();
      rctx.shadowColor = '#00cc66';
      rctx.shadowBlur = 8;
      rctx.fill();
      rctx.shadowBlur = 0;

      var lx = rcx + Math.cos(a) * (rr + 18);
      var ly = rcy + Math.sin(a) * (rr + 18);
      rctx.font = '11px system-ui, sans-serif';
      rctx.fillStyle = '#a0d8a0';
      rctx.textAlign = 'center';
      rctx.textBaseline = 'middle';
      rctx.fillText(skills[i].name, lx, ly);

      var sx = rcx + Math.cos(a) * (rr * val + 14);
      var sy = rcy + Math.sin(a) * (rr * val + 14);
      rctx.font = 'bold 10px system-ui, sans-serif';
      rctx.fillStyle = '#00cc66';
      rctx.fillText(skills[i].score + '%', sx, sy);
    }
  }

  // Grammar mastery
  var gramHtml = '';
  PT.grammar.forEach(function(g) {
    var color = g.status === 'mastered' ? '#10b981' : g.status === 'learning' ? '#f59e0b' : '#6b7280';
    var statusLabel = g.status === 'mastered' ? 'MASTERED' : g.status === 'learning' ? 'LEARNING' : 'INTRODUCED';
    var bgColor = g.status === 'mastered' ? 'rgba(16,185,129,0.1)' : g.status === 'learning' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)';
    gramHtml += '<div style="margin-bottom:10px">';
    gramHtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">';
    gramHtml += '<span style="font-size:12px;color:#c0e8c0">' + g.concept + '</span>';
    gramHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + bgColor + ';color:' + color + ';letter-spacing:0.5px">' + statusLabel + '</span>';
    gramHtml += '</div>';
    gramHtml += '<div style="height:6px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden">';
    gramHtml += '<div style="height:100%;width:' + g.pct + '%;background:' + color + ';border-radius:3px;transition:width 1s ease"></div>';
    gramHtml += '</div>';
    gramHtml += '</div>';
  });
  document.getElementById('pt-grammar-list').innerHTML = gramHtml;

  // Vocabulary grid
  var vocabHtml = '';
  PT.vocab.forEach(function(v) {
    var pct = Math.round(v.mastered / v.count * 100);
    vocabHtml += '<div class="card" style="padding:10px;text-align:center">';
    vocabHtml += '<div style="font-size:20px;margin-bottom:4px">' + v.icon + '</div>';
    vocabHtml += '<div style="font-size:11px;color:#c0e8c0;font-weight:600;margin-bottom:2px">' + v.category + '</div>';
    vocabHtml += '<div style="font-size:18px;font-weight:700;color:#00cc66">' + v.count + '</div>';
    vocabHtml += '<div style="font-size:9px;color:#6b7280">' + v.mastered + ' mastered (' + pct + '%)</div>';
    vocabHtml += '<div style="height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;margin-top:4px">';
    vocabHtml += '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#00cc66,#10b981);border-radius:2px"></div>';
    vocabHtml += '</div>';
    vocabHtml += '</div>';
  });
  document.getElementById('pt-vocab-grid').innerHTML = vocabHtml;

  // Irregular verbs grid
  var irrHtml = '';
  PT.irregularVerbs.forEach(function(v) {
    var color = v.level === 'mastered' ? '#10b981' : v.level === 'learning' ? '#f59e0b' : '#6b7280';
    var bg = v.level === 'mastered' ? 'rgba(16,185,129,0.08)' : v.level === 'learning' ? 'rgba(245,158,11,0.06)' : 'rgba(107,114,128,0.06)';
    var dot = v.level === 'mastered' ? '\\u2713' : v.level === 'learning' ? '\\u25cb' : '\\u00b7';
    irrHtml += '<div style="padding:8px 10px;background:' + bg + ';border:1px solid ' + color + '22;border-radius:6px;display:flex;flex-direction:column;gap:2px">';
    irrHtml += '<div style="display:flex;align-items:center;justify-content:space-between">';
    irrHtml += '<span style="font-size:13px;font-weight:600;color:' + color + '">' + v.verb + '</span>';
    irrHtml += '<span style="font-size:10px;color:' + color + '">' + dot + '</span>';
    irrHtml += '</div>';
    irrHtml += '<div style="font-size:10px;color:#6b7280">' + v.meaning + '</div>';
    irrHtml += '</div>';
  });
  document.getElementById('pt-irreg-grid').innerHTML = irrHtml;

  // Strengths
  var strHtml = '';
  PT.strengths.forEach(function(s) {
    strHtml += '<div style="padding:5px 0;font-size:12px;color:#a0d8a0;border-bottom:1px solid rgba(0,255,65,0.05);display:flex;align-items:flex-start;gap:6px">';
    strHtml += '<span style="color:#10b981;flex-shrink:0;margin-top:1px">\\u2713</span> ' + s;
    strHtml += '</div>';
  });
  document.getElementById('pt-strengths').innerHTML = strHtml;

  // Weaknesses
  var weakHtml = '';
  PT.weaknesses.forEach(function(w) {
    var pColor = w.priority === 'HIGH' ? '#ef4444' : w.priority === 'MEDIUM' ? '#f59e0b' : '#6b7280';
    var pBg = w.priority === 'HIGH' ? 'rgba(239,68,68,0.1)' : w.priority === 'MEDIUM' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)';
    weakHtml += '<div style="padding:5px 0;font-size:12px;color:#c0c0c0;border-bottom:1px solid rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:space-between">';
    weakHtml += '<span>' + w.area + '</span>';
    weakHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + pBg + ';color:' + pColor + '">' + w.priority + '</span>';
    weakHtml += '</div>';
  });
  document.getElementById('pt-weaknesses').innerHTML = weakHtml;

  // Timeline
  var tlHtml = '<div style="position:absolute;left:6px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,#00cc66,rgba(0,204,102,0.1))"></div>';
  PT.timeline.forEach(function(t, i) {
    var dotColor = t.type === 'milestone' ? '#00cc66' : t.type === 'grammar' ? '#f59e0b' : t.type === 'vocab' ? '#00bbff' : t.type === 'test' ? '#a78bfa' : t.type === 'start' ? '#ff6699' : '#10b981';
    var isLast = i === PT.timeline.length - 1;
    tlHtml += '<div style="position:relative;padding:0 0 16px 22px;' + (isLast ? 'padding-bottom:0' : '') + '">';
    tlHtml += '<div style="position:absolute;left:1px;top:4px;width:12px;height:12px;border-radius:50%;background:' + dotColor + ';box-shadow:0 0 8px ' + dotColor + '40"></div>';
    tlHtml += '<div style="font-size:10px;color:#6b7280;margin-bottom:1px">' + t.date + '</div>';
    tlHtml += '<div style="font-size:12px;color:#c0e8c0">' + t.topic + '</div>';
    tlHtml += '</div>';
  });
  document.getElementById('pt-timeline').innerHTML = tlHtml;

  // Resources
  var resHtml = '';
  PT.resources.forEach(function(r) {
    var typeColor = r.type === 'Podcast' ? '#00cc66' : r.type === 'YouTube' ? '#ef4444' : '#e50914';
    var typeIcon = r.type === 'Podcast' ? '\\ud83c\\udfa7' : r.type === 'YouTube' ? '\\u25b6\\ufe0f' : '\\ud83c\\udfa5';
    resHtml += '<div class="card" style="padding:10px">';
    resHtml += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
    resHtml += '<span style="font-size:14px">' + typeIcon + '</span>';
    resHtml += '<span style="font-size:12px;color:#c0e8c0;font-weight:600">' + r.name + '</span>';
    resHtml += '</div>';
    resHtml += '<div style="font-size:10px;color:#6b7280">' + r.desc + '</div>';
    resHtml += '<div style="margin-top:4px"><span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.05);color:' + typeColor + '">' + r.type + '</span></div>';
    resHtml += '</div>';
  });
  document.getElementById('pt-resources').innerHTML = resHtml;
}

// ── Knowledge Graph (D3.js Force Simulation) ─────────────────────────
var kgSim = null;
var kgAllNodes = [];
var kgAllLinks = [];
var kgFilteredNodes = [];
var kgFilteredLinks = [];
var kgSvg = null;
var kgG = null;
var kgZoom = null;
var kgNodeEls = null;
var kgLinkEls = null;
var kgLabelEls = null;
var kgSelectedNode = null;

var KG_AGENT_COLORS = {
  main: '#00ff41',
  assistant: '#67e8f9',
  trinity: '#67e8f9',
  steve: '#00bbff',
  neo: '#ff6600',
  smith: '#ff00ff',
  research: '#ffcc00',
  comms: '#00ffcc',
  content: '#ff6699',
  ops: '#9966ff',
  morpheus: '#c0a050'
};

var KG_AGENT_DISPLAY_NAMES = {
  main: 'Link',
  assistant: 'Trinity',
  trinity: 'Trinity',
  steve: 'Steve',
  neo: 'Neo',
  smith: 'Smith',
  research: 'Research',
  comms: 'Comms',
  content: 'Content',
  ops: 'Ops'
};

function kgAgentName(id) {
  return KG_AGENT_DISPLAY_NAMES[id] || id;
}

function kgColor(node) {
  if (node.type === 'entity') return '#66ff99';
  if (node.type === 'topic') return '#2a7a4a';
  return KG_AGENT_COLORS[node.agent] || '#00ff41';
}

// Connection count map - populated after data loads
var kgConnectionCounts = {};

function kgComputeConnectionCounts() {
  kgConnectionCounts = {};
  kgAllLinks.forEach(function(l) {
    var sid = l.source.id ? l.source.id : l.source;
    var tid = l.target.id ? l.target.id : l.target;
    kgConnectionCounts[sid] = (kgConnectionCounts[sid] || 0) + 1;
    kgConnectionCounts[tid] = (kgConnectionCounts[tid] || 0) + 1;
  });
}

function kgRadius(node) {
  var conns = kgConnectionCounts[node.id] || 1;
  // Scale by connection count like Obsidian - more connections = bigger node
  var base = 4 + Math.sqrt(conns) * 3.5;
  // Memories get a slight salience boost
  if (node.type === 'memory') base += (node.salience || 0.5) * 2;
  return Math.min(base, 30); // cap at 30
}

function kgLinkColor(link) {
  if (link.type === 'connection') return 'rgba(255,200,0,0.5)';
  if (link.type === 'shares_entity') return 'rgba(102,255,153,0.12)';
  if (link.type === 'shares_topic') return 'rgba(42,122,74,0.12)';
  if (link.type === 'has_entity') return 'rgba(102,255,153,0.2)';
  if (link.type === 'has_topic') return 'rgba(42,122,74,0.2)';
  return 'rgba(0,255,65,0.15)';
}

function kgLinkWidth(link) {
  if (link.type === 'connection') return 1.5;
  if (link.type === 'shares_entity' || link.type === 'shares_topic') return 0.5;
  return 0.8;
}

async function loadKnowledgeGraph() {
  var loadingEl = document.getElementById('kg-loading');
  try {
    var res = await fetch(BASE + '/api/knowledge-graph', { credentials: 'same-origin' });
    if (res.status === 401) { showLogin(); return; }
    if (!res.ok) throw new Error('Failed to load');
    var data = await res.json();
    kgAllNodes = data.nodes;
    kgAllLinks = data.links;
    kgComputeConnectionCounts();

    // Populate agent filter dropdown
    var agentSelect = document.getElementById('kg-filter-agent');
    agentSelect.innerHTML = '<option value="">All Agents</option>';
    data.agents.forEach(function(a) {
      var opt = document.createElement('option');
      opt.value = a;
      opt.textContent = kgAgentName(a);
      agentSelect.appendChild(opt);
    });

    if (loadingEl) loadingEl.style.display = 'none';
    initKnowledgeGraph();
  } catch (e) {
    if (loadingEl) loadingEl.innerHTML = '<span style="color:#ff4444">Failed to load knowledge graph</span>';
    throw e;
  }
}

function initKnowledgeGraph() {
  var container = document.getElementById('kg-graph-container');
  var width = container.clientWidth;
  var height = container.clientHeight;

  kgSvg = d3.select('#kg-svg');
  kgSvg.selectAll('*').remove();

  // Defs for glow effects
  var defs = kgSvg.append('defs');
  var glowFilter = defs.append('filter').attr('id', 'kg-glow');
  glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
  var feMerge = glowFilter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Zoom
  kgG = kgSvg.append('g');
  kgZoom = d3.zoom()
    .scaleExtent([0.1, 8])
    .on('zoom', function(event) {
      kgG.attr('transform', event.transform);
    });
  kgSvg.call(kgZoom);

  // Click background to deselect
  kgSvg.on('click', function(event) {
    if (event.target.tagName === 'svg' || event.target === kgSvg.node()) {
      if (kgSelectedNode) closeKgDetail();
    }
  });

  // Apply initial filter
  applyKgFilter();

  // Force simulation
  kgSim = d3.forceSimulation(kgFilteredNodes)
    .force('link', d3.forceLink(kgFilteredLinks).id(function(d) { return d.id; }).distance(function(l) {
      if (l.type === 'connection') return 80;
      if (l.type === 'shares_entity' || l.type === 'shares_topic') return 180;
      return 100;
    }).strength(function(l) {
      // Weaker links for shared connections, stronger for direct
      if (l.type === 'shares_entity' || l.type === 'shares_topic') return 0.1;
      if (l.type === 'connection') return 0.5;
      return 0.3;
    }))
    .force('charge', d3.forceManyBody().strength(-400).distanceMax(500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) { return kgRadius(d) + 8; }).strength(0.7))
    .force('x', d3.forceX(width / 2).strength(0.02))
    .force('y', d3.forceY(height / 2).strength(0.02))
    .alphaDecay(0.015)
    .on('tick', kgTick);

  renderKgElements();

  // Auto-zoom to fit after initial settle
  setTimeout(function() { kgZoomToFit(400); }, 1500);
}

function renderKgElements() {
  // Clear previous
  kgG.selectAll('.kg-link').remove();
  kgG.selectAll('.kg-node-group').remove();

  // Links
  kgLinkEls = kgG.selectAll('.kg-link')
    .data(kgFilteredLinks)
    .enter().append('line')
    .attr('class', 'kg-link')
    .attr('stroke', kgLinkColor)
    .attr('stroke-width', kgLinkWidth)
    .attr('stroke-dasharray', function(d) {
      return (d.type === 'shares_entity' || d.type === 'shares_topic') ? '3,3' : null;
    });

  // Node groups
  var nodeGroups = kgG.selectAll('.kg-node-group')
    .data(kgFilteredNodes)
    .enter().append('g')
    .attr('class', 'kg-node-group')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', kgDragStart)
      .on('drag', kgDragging)
      .on('end', kgDragEnd)
    )
    .on('click', function(event, d) {
      event.stopPropagation();
      kgSelectNode(d);
    })
    .on('mouseenter', function(event, d) {
      d3.select(this).select('circle, rect').attr('filter', 'url(#kg-glow)');
      // Highlight connected
      kgLinkEls.attr('stroke-opacity', function(l) {
        return (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.15;
      }).attr('stroke-width', function(l) {
        return (l.source.id === d.id || l.target.id === d.id) ? kgLinkWidth(l) * 2.5 : kgLinkWidth(l);
      });
      kgG.selectAll('.kg-node-group').attr('opacity', function(n) {
        if (n.id === d.id) return 1;
        var connected = kgFilteredLinks.some(function(l) {
          return (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id);
        });
        return connected ? 1 : 0.2;
      });
    })
    .on('mouseleave', function() {
      d3.select(this).select('circle, rect').attr('filter', null);
      kgLinkEls.attr('stroke-opacity', 1).attr('stroke-width', kgLinkWidth);
      kgG.selectAll('.kg-node-group').attr('opacity', 1);
    });

  // Memory nodes: circles
  nodeGroups.filter(function(d) { return d.type === 'memory'; })
    .append('circle')
    .attr('r', kgRadius)
    .attr('fill', kgColor)
    .attr('fill-opacity', function(d) { return 0.3 + (d.salience || 0.5) * 0.7; })
    .attr('stroke', kgColor)
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.7);

  // Entity nodes: small circles
  nodeGroups.filter(function(d) { return d.type === 'entity'; })
    .append('circle')
    .attr('r', kgRadius)
    .attr('fill', '#66ff99')
    .attr('fill-opacity', 0.5)
    .attr('stroke', '#66ff99')
    .attr('stroke-width', 1);

  // Topic nodes: rounded rects
  nodeGroups.filter(function(d) { return d.type === 'topic'; })
    .append('rect')
    .attr('width', 14).attr('height', 14)
    .attr('x', -7).attr('y', -7)
    .attr('rx', 3).attr('ry', 3)
    .attr('fill', 'rgba(0,255,65,0.1)')
    .attr('stroke', 'rgba(0,255,65,0.4)')
    .attr('stroke-width', 1);

  // Labels - shown on ALL nodes like Obsidian
  kgLabelEls = nodeGroups.append('text')
    .text(function(d) {
      var maxLen = d.type === 'memory' ? 30 : 22;
      var txt = d.label;
      return txt.length > maxLen ? txt.slice(0, maxLen - 2) + '..' : txt;
    })
    .attr('font-size', function(d) {
      if (d.type === 'memory') return '10px';
      if (d.type === 'topic') return '9px';
      return '8px';
    })
    .attr('fill', function(d) {
      if (d.type === 'memory') return '#c0e8c0';
      if (d.type === 'entity') return '#66ff99';
      return '#4a8a4a';
    })
    .attr('text-anchor', 'middle')
    .attr('dy', function(d) { return kgRadius(d) + 12; })
    .attr('font-family', 'inherit')
    .attr('pointer-events', 'none')
    .attr('opacity', 0.85);

  kgNodeEls = nodeGroups;
}

function kgTick() {
  if (kgLinkEls) {
    kgLinkEls
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
  }
  if (kgNodeEls) {
    kgNodeEls.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  }
}

function kgDragStart(event, d) {
  if (!event.active) kgSim.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function kgDragging(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function kgDragEnd(event, d) {
  if (!event.active) kgSim.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function kgSelectNode(d) {
  kgSelectedNode = d;
  var panel = document.getElementById('kg-detail-panel');
  panel.style.display = '';

  document.getElementById('kg-detail-type').textContent = d.type.toUpperCase();
  document.getElementById('kg-detail-title').textContent = d.label;
  document.getElementById('kg-detail-title').style.color = kgColor(d);

  var body = '';
  if (d.type === 'memory' && d.summary) {
    body = '<div style="margin-bottom:8px">' + d.summary.replace(/</g, '&lt;') + '</div>';
  }
  document.getElementById('kg-detail-body').innerHTML = body;

  var meta = '';
  if (d.agent) meta += '<div>Agent: <span style="color:' + kgColor(d) + '">' + kgAgentName(d.agent) + '</span></div>';
  if (d.salience != null) meta += '<div>Salience: ' + d.salience.toFixed(2) + '</div>';
  if (d.importance != null) meta += '<div>Importance: ' + d.importance.toFixed(2) + '</div>';
  if (d.created_at) {
    var dt = new Date(d.created_at * 1000);
    meta += '<div>Created: ' + dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString() + '</div>';
  }
  document.getElementById('kg-detail-meta').innerHTML = meta;

  // Show connections
  var connHtml = '';
  var connected = kgFilteredLinks.filter(function(l) {
    return l.source.id === d.id || l.target.id === d.id;
  });
  if (connected.length > 0) {
    connHtml += '<div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Connections (' + connected.length + ')</div>';
    connected.forEach(function(l) {
      var other = l.source.id === d.id ? l.target : l.source;
      var typeColor = other.type === 'entity' ? '#66ff99' : other.type === 'topic' ? '#4a8a4a' : kgColor(other);
      connHtml += '<div style="padding:3px 0;font-size:11px;cursor:pointer;border-bottom:1px solid rgba(0,255,65,0.06)" onclick="kgNavigateTo(\\'';
      connHtml += other.id;
      connHtml += '\\')">';
      connHtml += '<span style="color:' + typeColor + '">' + (other.label.length > 30 ? other.label.slice(0, 28) + '..' : other.label) + '</span>';
      connHtml += ' <span style="color:#3a6b3a;font-size:10px">' + other.type + '</span>';
      if (l.label) connHtml += '<div style="color:#3a6b3a;font-size:10px;margin-top:2px">' + l.label + '</div>';
      connHtml += '</div>';
    });
  }
  document.getElementById('kg-detail-connections').innerHTML = connHtml;

  // Highlight selected node in graph
  kgG.selectAll('.kg-node-group').attr('opacity', function(n) {
    if (n.id === d.id) return 1;
    var isConnected = connected.some(function(l) {
      return l.source.id === n.id || l.target.id === n.id;
    });
    return isConnected ? 0.9 : 0.15;
  });
  kgLinkEls.attr('stroke-opacity', function(l) {
    return (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.05;
  });
}

function kgNavigateTo(nodeId) {
  var node = kgFilteredNodes.find(function(n) { return n.id === nodeId; });
  if (node) {
    kgSelectNode(node);
    // Pan to node
    var container = document.getElementById('kg-graph-container');
    var w = container.clientWidth;
    var h = container.clientHeight;
    var transform = d3.zoomIdentity.translate(w/2 - node.x, h/2 - node.y);
    kgSvg.transition().duration(500).call(kgZoom.transform, transform);
  }
}

function closeKgDetail() {
  document.getElementById('kg-detail-panel').style.display = 'none';
  kgSelectedNode = null;
  // Reset highlight
  if (kgG) kgG.selectAll('.kg-node-group').attr('opacity', 1);
  if (kgLinkEls) kgLinkEls.attr('stroke-opacity', 1);
}

function applyKgFilter() {
  var search = (document.getElementById('kg-search').value || '').toLowerCase();
  var agentFilter = document.getElementById('kg-filter-agent').value;
  var typeFilter = document.getElementById('kg-filter-type').value;

  // Filter nodes
  kgFilteredNodes = kgAllNodes.filter(function(n) {
    if (typeFilter && n.type !== typeFilter) return false;
    if (agentFilter && n.type === 'memory' && n.agent !== agentFilter) return false;
    if (search && n.label.toLowerCase().indexOf(search) === -1 && (!n.summary || n.summary.toLowerCase().indexOf(search) === -1)) return false;
    return true;
  });

  // If filtering by agent, keep entities/topics only if connected to a visible memory
  if (agentFilter) {
    var visibleMemIds = new Set(kgFilteredNodes.filter(function(n) { return n.type === 'memory'; }).map(function(n) { return n.id; }));
    kgFilteredNodes = kgFilteredNodes.filter(function(n) {
      if (n.type === 'memory') return true;
      return kgAllLinks.some(function(l) {
        var sid = l.source.id ? l.source.id : l.source;
        var tid = l.target.id ? l.target.id : l.target;
        return (sid === n.id && visibleMemIds.has(tid)) || (tid === n.id && visibleMemIds.has(sid));
      });
    });
  }

  var visibleIds = new Set(kgFilteredNodes.map(function(n) { return n.id; }));

  // Filter links: both ends must be visible
  kgFilteredLinks = kgAllLinks.filter(function(l) {
    var sid = l.source.id ? l.source.id : l.source;
    var tid = l.target.id ? l.target.id : l.target;
    return visibleIds.has(sid) && visibleIds.has(tid);
  }).map(function(l) {
    return { source: l.source.id ? l.source.id : l.source, target: l.target.id ? l.target.id : l.target, type: l.type, label: l.label };
  });
}

function filterKnowledgeGraph() {
  if (!kgSim) return;
  applyKgFilter();

  // Update simulation
  kgSim.nodes(kgFilteredNodes);
  kgSim.force('link').links(kgFilteredLinks);

  renderKgElements();

  kgSim.alpha(0.8).restart();
  setTimeout(function() { kgZoomToFit(400); }, 800);
}

function updateKgForce(val) {
  if (!kgSim) return;
  kgSim.force('link').distance(Number(val));
  kgSim.alpha(0.5).restart();
}

function updateKgRepulsion(val) {
  if (!kgSim) return;
  kgSim.force('charge').strength(Number(val));
  kgSim.alpha(0.5).restart();
}

function kgZoomToFit(duration) {
  if (!kgFilteredNodes.length) return;
  var container = document.getElementById('kg-graph-container');
  var w = container.clientWidth;
  var h = container.clientHeight;
  var xMin = d3.min(kgFilteredNodes, function(d) { return d.x; }) || 0;
  var xMax = d3.max(kgFilteredNodes, function(d) { return d.x; }) || w;
  var yMin = d3.min(kgFilteredNodes, function(d) { return d.y; }) || 0;
  var yMax = d3.max(kgFilteredNodes, function(d) { return d.y; }) || h;
  var dx = xMax - xMin;
  var dy = yMax - yMin;
  var padding = 60;
  var scale = Math.min((w - padding * 2) / (dx || 1), (h - padding * 2) / (dy || 1), 2);
  scale = Math.max(scale, 0.2);
  var cx = (xMin + xMax) / 2;
  var cy = (yMin + yMax) / 2;
  var transform = d3.zoomIdentity.translate(w / 2, h / 2).scale(scale).translate(-cx, -cy);
  kgSvg.transition().duration(duration || 500).call(kgZoom.transform, transform);
}

// ── Builder (Lovable clone) ──────────────────────────────────────────

var bldrLoaded = false;
var bldrCurrentProject = null;
var bldrFiles = [];
var bldrActiveFile = null;
var bldrGenerating = false;
var bldrPanelState = { chat: true, code: true, preview: true };
var bldrCodeDirty = false;

async function bldrInit() {
  await bldrLoadProjects();
}

async function bldrLoadProjects() {
  try {
    var data = await api('/api/builder/projects');
    var select = document.getElementById('bldr-project-select');
    select.innerHTML = '<option value="">Select project...</option>';
    (data.projects || []).forEach(function(p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
    if (bldrCurrentProject) {
      select.value = bldrCurrentProject.id;
    }
  } catch(e) { console.error('Builder: load projects failed', e); }
}

async function bldrNewProject() {
  var name = prompt('Project name:');
  if (!name || !name.trim()) return;
  try {
    var data = await api('/api/builder/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() })
    });
    if (data.project) {
      await bldrLoadProjects();
      bldrSwitchProject(data.project.id);
      document.getElementById('bldr-project-select').value = data.project.id;
    }
  } catch(e) { console.error('Builder: create project failed', e); }
}

async function bldrSwitchProject(id) {
  if (!id) {
    bldrCurrentProject = null;
    bldrFiles = [];
    bldrActiveFile = null;
    bldrResetUI();
    return;
  }
  try {
    var data = await api('/api/builder/projects/' + id);
    bldrCurrentProject = data.project;
    bldrFiles = data.files || [];
    document.getElementById('bldr-project-title').textContent = data.project.name;
    document.getElementById('bldr-project-name').style.display = '';
    document.getElementById('bldr-delete-btn').style.display = '';
    document.getElementById('bldr-versions-btn').style.display = '';
    document.getElementById('bldr-input-wrap').style.display = '';

    // Render messages
    var msgs = document.getElementById('bldr-messages');
    msgs.innerHTML = '';
    if (data.messages && data.messages.length > 0) {
      data.messages.forEach(function(m) {
        bldrAppendMessage(m.role, m.role === 'assistant' ? bldrExtractExplanation(m.content) : m.content);
      });
    } else {
      bldrShowWelcome();
    }

    // Render files
    bldrRenderFileTabs();
    if (bldrFiles.length > 0) {
      bldrSelectFile(bldrFiles[0].file_path);
    } else {
      bldrActiveFile = null;
      document.getElementById('bldr-code-empty').style.display = '';
      document.getElementById('bldr-code-editor').style.display = 'none';
    }

    bldrUpdatePreview();
  } catch(e) { console.error('Builder: load project failed', e); }
}

function bldrResetUI() {
  document.getElementById('bldr-project-name').style.display = 'none';
  document.getElementById('bldr-delete-btn').style.display = 'none';
  document.getElementById('bldr-versions-btn').style.display = 'none';
  document.getElementById('bldr-input-wrap').style.display = 'none';
  document.getElementById('bldr-messages').innerHTML = '';
  document.getElementById('bldr-file-tabs').innerHTML = '';
  document.getElementById('bldr-code-empty').style.display = '';
  document.getElementById('bldr-code-editor').style.display = 'none';
  document.getElementById('bldr-preview-empty').style.display = '';
  document.getElementById('bldr-preview-frame').srcdoc = '';
}

async function bldrDeleteProject() {
  if (!bldrCurrentProject) return;
  if (!confirm('Delete "' + bldrCurrentProject.name + '"? This cannot be undone.')) return;
  try {
    await api('/api/builder/projects/' + bldrCurrentProject.id, { method: 'DELETE' });
    bldrCurrentProject = null;
    bldrFiles = [];
    bldrResetUI();
    await bldrLoadProjects();
    document.getElementById('bldr-project-select').value = '';
  } catch(e) { console.error('Builder: delete failed', e); }
}

function bldrExtractExplanation(content) {
  var marker = '\`\`\`';
  var idx = content.indexOf(marker);
  if (idx === -1) return content;
  return content.substring(0, idx).trim() || 'Code generated.';
}

function bldrShowWelcome() {
  var msgs = document.getElementById('bldr-messages');
  var welcome = document.createElement('div');
  welcome.className = 'bldr-welcome';
  welcome.id = 'bldr-welcome';
  var s1 = 'A sleek landing page for a SaaS product with pricing table, testimonials, and hero section';
  var s2 = 'A personal dashboard with weather widget, todo list, and daily quote';
  var s3 = 'An interactive data visualization with charts showing sales metrics';
  var s4 = 'A beautiful portfolio website with project gallery, about section, and contact form';
  welcome.innerHTML = '<div style="font-size:28px;margin-bottom:8px">&#9889;</div>' +
    '<div style="font-size:14px;font-weight:600;color:#00ff41;margin-bottom:6px">What do you want to build?</div>' +
    '<div style="font-size:12px;color:#6b7280;max-width:260px;margin:0 auto">Describe your app and I will generate it. You can iterate from there.</div>' +
    '<div class="bldr-suggestions" style="margin-top:16px"></div>';
  msgs.appendChild(welcome);
  var btns = welcome.querySelector('.bldr-suggestions');
  [[s1,'Landing page'],[s2,'Dashboard'],[s3,'Data viz'],[s4,'Portfolio']].forEach(function(pair) {
    var b = document.createElement('button');
    b.className = 'bldr-suggestion';
    b.textContent = pair[1];
    b.onclick = function() { bldrUseSuggestion(pair[0]); };
    btns.appendChild(b);
  });
}

function bldrAppendMessage(role, content) {
  var msgs = document.getElementById('bldr-messages');
  // Remove welcome screen if present
  var welcomeEl = document.getElementById('bldr-welcome');
  if (welcomeEl) welcomeEl.remove();

  var div = document.createElement('div');
  div.className = 'bldr-msg ' + (role === 'user' ? 'bldr-msg-user' : 'bldr-msg-assistant');
  div.textContent = content;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function bldrShowGenerating() {
  var msgs = document.getElementById('bldr-messages');
  var div = document.createElement('div');
  div.className = 'bldr-generating';
  div.id = 'bldr-generating-indicator';
  div.innerHTML = '<div class="bldr-generating-dot"></div><div class="bldr-generating-dot"></div><div class="bldr-generating-dot"></div><span>Generating...</span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function bldrHideGenerating() {
  var el = document.getElementById('bldr-generating-indicator');
  if (el) el.remove();
}

async function bldrSend() {
  if (bldrGenerating || !bldrCurrentProject) return;
  var input = document.getElementById('bldr-input');
  var prompt = input.value.trim();
  if (!prompt) return;

  // Save dirty code first
  if (bldrCodeDirty && bldrActiveFile) {
    await bldrSaveCurrentFile();
  }

  input.value = '';
  bldrAppendMessage('user', prompt);
  bldrGenerating = true;
  document.getElementById('bldr-send-btn').disabled = true;
  bldrShowGenerating();

  try {
    console.log('[Builder] Sending generate request...');
    var data = await api('/api/builder/projects/' + bldrCurrentProject.id + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });
    console.log('[Builder] Response:', { explanation: (data.explanation || '').slice(0, 80), filesCount: data.files ? data.files.length : 0, allFilesCount: data.allFiles ? data.allFiles.length : 0 });

    bldrHideGenerating();

    if (data.error) {
      bldrAppendMessage('assistant', 'Error: ' + data.error);
    } else {
      bldrAppendMessage('assistant', data.explanation || 'Code generated.');

      if (data.allFiles && data.allFiles.length > 0) {
        bldrFiles = data.allFiles;
        bldrRenderFileTabs();
        if (data.files && data.files.length > 0) {
          bldrSelectFile(data.files[0].path);
        } else if (bldrFiles.length > 0 && !bldrActiveFile) {
          bldrSelectFile(bldrFiles[0].file_path);
        } else if (bldrActiveFile) {
          bldrSelectFile(bldrActiveFile);
        }
      } else {
        console.warn('[Builder] No files in response. Full data:', data);
      }
    }

    bldrUpdatePreview();
  } catch(e) {
    console.error('[Builder] Generation error:', e);
    bldrHideGenerating();
    bldrAppendMessage('assistant', 'Error: ' + (e.message || 'Generation failed. Check console for details.'));
  } finally {
    bldrGenerating = false;
    document.getElementById('bldr-send-btn').disabled = false;
    document.getElementById('bldr-input').focus();
  }
}

async function bldrUseSuggestion(text) {
  if (!bldrCurrentProject) {
    // Auto-create a project
    try {
      var name = text.split(' ').slice(0, 4).join(' ');
      var data = await api('/api/builder/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
      });
      if (data.project) {
        await bldrLoadProjects();
        document.getElementById('bldr-project-select').value = data.project.id;
        await bldrSwitchProject(data.project.id);
        document.getElementById('bldr-input').value = text;
        bldrSend();
      }
    } catch(e) { console.error('Builder: suggestion auto-create failed', e); }
    return;
  }
  document.getElementById('bldr-input').value = text;
  bldrSend();
}

function bldrRenderFileTabs() {
  var tabs = document.getElementById('bldr-file-tabs');
  tabs.innerHTML = '';
  bldrFiles.forEach(function(f) {
    var tab = document.createElement('div');
    tab.className = 'bldr-file-tab' + (f.file_path === bldrActiveFile ? ' active' : '');
    tab.textContent = f.file_path;
    tab.onclick = function() { bldrSelectFile(f.file_path); };
    tabs.appendChild(tab);
  });
}

function bldrSelectFile(filePath) {
  // Save current file if dirty
  if (bldrCodeDirty && bldrActiveFile) {
    bldrSaveCurrentFile();
  }

  bldrActiveFile = filePath;
  var file = bldrFiles.find(function(f) { return f.file_path === filePath; });
  var editor = document.getElementById('bldr-code-editor');
  var empty = document.getElementById('bldr-code-empty');

  if (file) {
    editor.value = file.content;
    editor.style.display = '';
    empty.style.display = 'none';
  } else {
    editor.style.display = 'none';
    empty.style.display = '';
  }
  bldrCodeDirty = false;

  // Update active tab
  document.querySelectorAll('.bldr-file-tab').forEach(function(t) {
    t.classList.toggle('active', t.textContent === filePath);
  });
}

function bldrCodeChanged() {
  bldrCodeDirty = true;
}

async function bldrSaveCurrentFile() {
  if (!bldrCurrentProject || !bldrActiveFile) return;
  var editor = document.getElementById('bldr-code-editor');
  var content = editor.value;

  // Update local state
  var file = bldrFiles.find(function(f) { return f.file_path === bldrActiveFile; });
  if (file) file.content = content;

  try {
    await api('/api/builder/projects/' + bldrCurrentProject.id + '/files/' + encodeURIComponent(bldrActiveFile), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content })
    });
    bldrCodeDirty = false;
  } catch(e) { console.error('Builder: save file failed', e); }
}

function bldrUpdatePreview() {
  var frame = document.getElementById('bldr-preview-frame');
  var empty = document.getElementById('bldr-preview-empty');
  var indexFile = bldrFiles.find(function(f) { return f.file_path === 'index.html'; });

  if (!indexFile) {
    empty.style.display = '';
    frame.srcdoc = '';
    return;
  }

  empty.style.display = 'none';

  // Assemble: inline other files into the index.html
  var html = indexFile.content;

  // Inject CSS files
  bldrFiles.forEach(function(f) {
    if (f.file_path.endsWith('.css') && f.file_path !== 'index.html') {
      var linkTag = '<link rel="stylesheet" href="' + f.file_path + '">';
      var styleTag = '<style>/* ' + f.file_path + ' */\\n' + f.content + '</style>';
      if (html.indexOf(linkTag) !== -1) {
        html = html.replace(linkTag, styleTag);
      } else {
        html = html.replace('</head>', styleTag + '</head>');
      }
    }
  });

  // Inject JS files
  bldrFiles.forEach(function(f) {
    if (f.file_path.endsWith('.js') && f.file_path !== 'index.html') {
      var scriptSrc = '<scr' + 'ipt src="' + f.file_path + '"><\\/scr' + 'ipt>';
      var scriptInline = '<scr' + 'ipt>/* ' + f.file_path + ' */\\n' + f.content + '<\\/scr' + 'ipt>';
      if (html.indexOf(scriptSrc) !== -1) {
        html = html.replace(scriptSrc, scriptInline);
      } else {
        html = html.replace('</body>', scriptInline + '</body>');
      }
    }
  });

  frame.srcdoc = html;
}

function bldrRefreshPreview() {
  // Save dirty code first, then update
  if (bldrCodeDirty && bldrActiveFile) {
    bldrSaveCurrentFile().then(function() { bldrUpdatePreview(); });
  } else {
    bldrUpdatePreview();
  }
}

function bldrOpenPreviewTab() {
  var frame = document.getElementById('bldr-preview-frame');
  if (frame.srcdoc) {
    var win = window.open('', '_blank');
    win.document.write(frame.srcdoc);
    win.document.close();
  }
}

function bldrTogglePanel(panel) {
  bldrPanelState[panel] = !bldrPanelState[panel];
  var panelMap = { chat: 'bldr-chat-panel', code: 'bldr-editor-panel', preview: 'bldr-preview-panel' };
  var btnMap = { chat: 'bldr-toggle-chat', code: 'bldr-toggle-code', preview: 'bldr-toggle-preview' };
  document.getElementById(panelMap[panel]).style.display = bldrPanelState[panel] ? '' : 'none';
  document.getElementById(btnMap[panel]).classList.toggle('active', bldrPanelState[panel]);
  bldrRecalcGrid();
}

function bldrRecalcGrid() {
  var panels = document.getElementById('bldr-panels');
  var cols = [];
  if (bldrPanelState.chat) cols.push('300px');
  if (bldrPanelState.code) cols.push('1fr');
  if (bldrPanelState.preview) cols.push('1fr');
  panels.style.gridTemplateColumns = cols.join(' ') || '1fr';
}

async function bldrToggleVersions() {
  var sidebar = document.getElementById('bldr-versions-sidebar');
  if (sidebar.style.display === 'none') {
    sidebar.style.display = '';
    await bldrLoadVersions();
  } else {
    sidebar.style.display = 'none';
  }
}

async function bldrLoadVersions() {
  if (!bldrCurrentProject) return;
  try {
    var data = await api('/api/builder/projects/' + bldrCurrentProject.id + '/versions');
    var list = document.getElementById('bldr-versions-list');
    if (!data.versions || data.versions.length === 0) {
      list.innerHTML = '<div style="color:#6b7280;font-size:11px;text-align:center;padding:20px">No versions saved yet.</div>';
      return;
    }
    list.innerHTML = '';
    data.versions.forEach(function(v) {
      var time = new Date(v.created_at * 1000).toLocaleString();
      var item = document.createElement('div');
      item.className = 'bldr-version-item';
      item.onclick = function() { bldrRestoreVersion(v.id); };
      item.innerHTML = '<div class="v-num">v' + v.version + '</div>' +
        '<div class="v-msg">' + (v.message || 'Snapshot') + '</div>' +
        '<div class="v-time">' + time + '</div>';
      list.appendChild(item);
    });
  } catch(e) { console.error('Builder: load versions failed', e); }
}

async function bldrSaveVersion() {
  if (!bldrCurrentProject) return;
  var msg = prompt('Version note (optional):') || '';
  try {
    await api('/api/builder/projects/' + bldrCurrentProject.id + '/versions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    await bldrLoadVersions();
  } catch(e) { console.error('Builder: save version failed', e); }
}

async function bldrRestoreVersion(vid) {
  if (!bldrCurrentProject) return;
  if (!confirm('Restore this version? Current files will be replaced.')) return;
  try {
    var data = await api('/api/builder/projects/' + bldrCurrentProject.id + '/versions/' + vid + '/restore', { method: 'POST' });
    if (data.files) {
      bldrFiles = data.files;
      bldrRenderFileTabs();
      if (bldrFiles.length > 0) bldrSelectFile(bldrFiles[0].file_path);
      bldrUpdatePreview();
      bldrAppendMessage('assistant', 'Version restored.');
    }
  } catch(e) { console.error('Builder: restore failed', e); }
}

// ══════════════════════════════════════════════════════════════════════
// PROJECTS TAB LOGIC
// ══════════════════════════════════════════════════════════════════════

var prjData = [];
var prjFilter = 'all';
var prjGithubCache = {};

var PRJ_STATUSES = {
  planning:     { label: 'Planning',     color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  'in-progress':{ label: 'In Progress',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  'pre-prod':   { label: 'Pre-Prod',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  production:   { label: 'Production',   color: '#00ff41', bg: 'rgba(0,255,65,0.15)' },
  shipped:      { label: 'Shipped',      color: '#0096ff', bg: 'rgba(0,150,255,0.15)' },
  paused:       { label: 'Paused',       color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  archived:     { label: 'Archived',     color: '#4a5568', bg: 'rgba(74,85,104,0.15)' },
};

function prjStatusBadge(status) {
  var s = PRJ_STATUSES[status] || PRJ_STATUSES.planning;
  return '<span class="prj-badge prj-badge-status" style="background:' + s.bg + ';color:' + s.color + '">' + s.label + '</span>';
}

function prjTimeAgo(ts) {
  var diff = Math.floor(Date.now()/1000) - ts;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff/86400) + 'd ago';
  return new Date(ts * 1000).toLocaleDateString();
}

async function loadProjectsData() {
  var grid = document.getElementById('prj-cards-grid');
  if (grid) grid.innerHTML = '<div style="padding:32px;text-align:center;color:#3a6b3a;font-size:13px;grid-column:1/-1">Loading projects...</div>';
  try {
    var res = await api('/api/projects');
    prjData = res.projects || [];
    prjRenderList();
    prjLoadRecentActivity();
  } catch(e) {
    console.error('Projects load failed', e);
    // Reset so user can retry
    projectsLoaded = false;
    if (grid) grid.innerHTML = '<div style="color:#ff4444;text-align:center;padding:20px;grid-column:1/-1">Failed to load projects. <span style="color:#0096ff;cursor:pointer;text-decoration:underline" onclick="projectsLoaded=false;loadProjectsData()">Retry</span></div>';
  }
}

function prjRenderList() {
  // Status pills
  var counts = { all: prjData.length };
  prjData.forEach(function(p) { counts[p.status] = (counts[p.status] || 0) + 1; });
  var pillsHtml = '<div class="prj-status-pill ' + (prjFilter === 'all' ? 'active' : '') + '" onclick="prjSetFilter(\\\'all\\\')" style="background:rgba(0,150,255,0.08);color:#0096ff"><span class="prj-pill-dot" style="background:#0096ff"></span>All ' + counts.all + '</div>';
  Object.keys(PRJ_STATUSES).forEach(function(key) {
    var s = PRJ_STATUSES[key];
    var c = counts[key] || 0;
    if (c > 0 || key === 'in-progress' || key === 'pre-prod' || key === 'production') {
      pillsHtml += '<div class="prj-status-pill ' + (prjFilter === key ? 'active' : '') + '" onclick="prjSetFilter(\\\'' + key + '\\\')" style="background:' + s.bg + ';color:' + s.color + '"><span class="prj-pill-dot" style="background:' + s.color + '"></span>' + s.label + ' ' + c + '</div>';
    }
  });
  document.getElementById('prj-status-pills').innerHTML = pillsHtml;

  // Filter
  var filtered = prjFilter === 'all' ? prjData : prjData.filter(function(p) { return p.status === prjFilter; });

  if (filtered.length === 0) {
    document.getElementById('prj-cards-grid').innerHTML = '<div style="padding:40px;text-align:center;color:#3a6b3a;font-size:13px;grid-column:1/-1">' + (prjData.length === 0 ? 'No projects yet. Click "+ New Project" to get started.' : 'No projects with status "' + prjFilter + '"') + '</div>';
    return;
  }

  var html = '';
  filtered.forEach(function(p) {
    var tags = [];
    try { tags = JSON.parse(p.tags || '[]'); } catch(e) {}
    var tagsHtml = tags.map(function(t) { return '<span class="prj-badge prj-badge-tag">' + t + '</span>'; }).join('');

    var linksHtml = '';
    if (p.repo) linksHtml += '<a href="https://github.com/' + p.repo + '" target="_blank" class="prj-link" onclick="event.stopPropagation()">GitHub</a>';
    if (p.vercel_url) linksHtml += '<a href="' + p.vercel_url + '" target="_blank" class="prj-link" onclick="event.stopPropagation()">Preview</a>';
    if (p.prod_url) linksHtml += '<a href="' + p.prod_url + '" target="_blank" class="prj-link" onclick="event.stopPropagation()">Production</a>';

    html += '<div class="prj-card" onclick="prjOpenDetail(\\\'' + p.id + '\\\')">' +
      '<div class="prj-card-head">' +
        '<div class="prj-card-name">' + p.name + '</div>' +
        prjStatusBadge(p.status) +
      '</div>' +
      (p.description ? '<div class="prj-card-desc">' + p.description + '</div>' : '') +
      '<div class="prj-card-meta">' +
        (p.environment && p.environment !== 'local' ? '<span class="prj-badge prj-badge-env">' + p.environment + '</span>' : '') +
        (p.branch ? '<span class="prj-badge prj-badge-tag" style="font-family:\\\'Courier New\\\',monospace">' + p.branch + '</span>' : '') +
        tagsHtml +
      '</div>' +
      (linksHtml ? '<div class="prj-card-links">' + linksHtml + '</div>' : '') +
      '<div class="prj-card-updated">Updated ' + prjTimeAgo(p.updated_at) + '</div>' +
    '</div>';
  });
  document.getElementById('prj-cards-grid').innerHTML = html;
}

function prjSetFilter(f) {
  prjFilter = f;
  prjRenderList();
}

async function prjLoadRecentActivity() {
  try {
    var res = await api('/api/projects/activity/recent');
    var activity = res.activity || [];
    if (activity.length === 0) { document.getElementById('prj-activity-section').style.display = 'none'; return; }
    document.getElementById('prj-activity-section').style.display = '';
    var html = '';
    activity.slice(0, 20).forEach(function(a) {
      var typeColors = { note: '#0096ff', pr: '#a371f7', deploy: '#00ff41', commit: '#f59e0b', status_change: '#8b5cf6' };
      var dotColor = typeColors[a.type] || '#0096ff';
      html += '<div class="prj-update-row">' +
        '<div class="prj-update-dot" style="background:' + dotColor + '"></div>' +
        '<div class="prj-update-content">' +
          '<div class="prj-update-text">' + a.content + '</div>' +
          '<div class="prj-update-meta">' + a.project_name + ' &middot; ' + a.agent_id + ' &middot; ' + prjTimeAgo(a.created_at) + '</div>' +
        '</div>' +
      '</div>';
    });
    document.getElementById('prj-recent-activity').innerHTML = html;
  } catch(e) { console.error('Activity load failed', e); }
}

async function prjOpenDetail(id) {
  document.getElementById('prj-list-view').style.display = 'none';
  var detailView = document.getElementById('prj-detail-view');
  detailView.classList.add('open');
  detailView.style.display = '';
  document.getElementById('prj-detail-content').innerHTML = '<div style="text-align:center;padding:40px;color:#3a6b3a">Loading project...</div>';

  try {
    var res = await api('/api/projects/' + id);
    var p = res.project;
    var updates = res.updates || [];
    var tags = [];
    try { tags = JSON.parse(p.tags || '[]'); } catch(e) {}

    var html = '<div class="prj-detail-header">' +
      '<div>' +
        '<div class="prj-detail-title">' + p.name + '</div>' +
        '<div style="margin-top:4px">' + prjStatusBadge(p.status) +
        (p.environment ? ' <span class="prj-badge prj-badge-env">' + p.environment + '</span>' : '') +
        tags.map(function(t) { return ' <span class="prj-badge prj-badge-tag">' + t + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="prj-detail-actions">' +
        '<button class="prj-btn prj-btn-sm" onclick="prjEditProject(\\\'' + p.id + '\\\')">Edit</button>' +
        '<button class="prj-btn prj-btn-sm prj-btn-green" onclick="prjAddUpdate(\\\'' + p.id + '\\\')">+ Update</button>' +
        (p.repo ? '<button class="prj-btn prj-btn-sm" onclick="prjLoadGithub(\\\'' + p.id + '\\\')">Sync GitHub</button>' : '') +
        '<button class="prj-btn prj-btn-sm prj-btn-red" onclick="prjDeleteProject(\\\'' + p.id + '\\\')">Delete</button>' +
      '</div>' +
    '</div>';

    // Info grid
    html += '<div class="prj-info-grid">';
    if (p.repo) html += '<div class="prj-info-item"><div class="prj-info-label">Repository</div><div class="prj-info-value"><a href="https://github.com/' + p.repo + '" target="_blank" style="color:#0096ff">' + p.repo + '</a></div></div>';
    if (p.branch) html += '<div class="prj-info-item"><div class="prj-info-label">Branch</div><div class="prj-info-value" style="font-family:\\\'Courier New\\\',monospace">' + p.branch + '</div></div>';
    if (p.vercel_url) html += '<div class="prj-info-item"><div class="prj-info-label">Preview URL</div><div class="prj-info-value"><a href="' + p.vercel_url + '" target="_blank" style="color:#0096ff">' + p.vercel_url.replace('https://','') + '</a></div></div>';
    if (p.prod_url) html += '<div class="prj-info-item"><div class="prj-info-label">Production URL</div><div class="prj-info-value"><a href="' + p.prod_url + '" target="_blank" style="color:#0096ff">' + p.prod_url.replace('https://','') + '</a></div></div>';
    html += '<div class="prj-info-item"><div class="prj-info-label">Created</div><div class="prj-info-value">' + new Date(p.created_at * 1000).toLocaleDateString() + '</div></div>';
    html += '<div class="prj-info-item"><div class="prj-info-label">Last Updated</div><div class="prj-info-value">' + prjTimeAgo(p.updated_at) + '</div></div>';
    html += '</div>';

    // Notes
    if (p.notes) {
      html += '<div class="prj-section"><div class="prj-section-title">Notes</div><div style="font-size:13px;color:#c0c0c0;line-height:1.6;white-space:pre-wrap">' + p.notes + '</div></div>';
    }

    // GitHub section (PRs, commits)
    html += '<div class="prj-section" id="prj-github-section">' +
      '<div class="prj-section-title">Pull Requests <span id="prj-gh-status" style="font-size:10px;color:#4a5568;font-weight:400">' + (p.repo ? 'click "Sync GitHub" to load' : 'no repo configured') + '</span></div>' +
      '<div id="prj-gh-prs"></div>' +
    '</div>';

    html += '<div class="prj-section" id="prj-commits-section" style="display:none">' +
      '<div class="prj-section-title">Recent Commits</div>' +
      '<div id="prj-gh-commits"></div>' +
    '</div>';

    // Updates timeline
    html += '<div class="prj-section"><div class="prj-section-title">Activity Log</div>';
    if (updates.length === 0) {
      html += '<div style="font-size:12px;color:#4a5568;padding:12px 0">No updates yet</div>';
    } else {
      updates.forEach(function(u) {
        var typeColors = { note: '#0096ff', pr: '#a371f7', deploy: '#00ff41', commit: '#f59e0b', status_change: '#8b5cf6' };
        var dotColor = typeColors[u.type] || '#0096ff';
        html += '<div class="prj-update-row">' +
          '<div class="prj-update-dot" style="background:' + dotColor + '"></div>' +
          '<div class="prj-update-content">' +
            '<div class="prj-update-text">' + u.content + '</div>' +
            '<div class="prj-update-meta">' + u.agent_id + ' &middot; ' + u.type + ' &middot; ' + prjTimeAgo(u.created_at) + '</div>' +
          '</div>' +
        '</div>';
      });
    }
    html += '</div>';

    document.getElementById('prj-detail-content').innerHTML = html;

    // Auto-load github if cached
    if (prjGithubCache[id]) prjRenderGithub(prjGithubCache[id]);
    else if (p.repo) prjLoadGithub(id);

  } catch(e) {
    console.error('Project detail load failed', e);
    document.getElementById('prj-detail-content').innerHTML = '<div style="color:#ff4444;text-align:center;padding:20px">Failed to load project</div>';
  }
}

function prjBackToList() {
  document.getElementById('prj-detail-view').classList.remove('open');
  document.getElementById('prj-detail-view').style.display = 'none';
  document.getElementById('prj-list-view').style.display = '';
}

async function prjLoadGithub(id) {
  var statusEl = document.getElementById('prj-gh-status');
  if (statusEl) statusEl.textContent = 'loading...';
  try {
    var res = await api('/api/projects/' + id + '/github');
    prjGithubCache[id] = res;
    prjRenderGithub(res);
  } catch(e) {
    if (statusEl) statusEl.textContent = 'failed to load';
    console.error('GitHub load failed', e);
  }
}

function prjRenderGithub(data) {
  var prs = data.prs || [];
  var commits = data.commits || [];

  var statusEl = document.getElementById('prj-gh-status');
  if (statusEl) statusEl.textContent = prs.length + ' PRs found';

  var prsHtml = '';
  if (prs.length === 0) {
    prsHtml = '<div style="font-size:12px;color:#4a5568;padding:8px 0">No pull requests found</div>';
  } else {
    prs.forEach(function(pr) {
      var stateClass = pr.state === 'MERGED' ? 'prj-pr-merged' : pr.state === 'OPEN' ? 'prj-pr-open' : 'prj-pr-closed';
      var date = pr.mergedAt || pr.createdAt;
      prsHtml += '<a href="' + pr.url + '" target="_blank" style="text-decoration:none"><div class="prj-pr-row">' +
        '<span class="prj-pr-num">#' + pr.number + '</span>' +
        '<span class="prj-pr-title">' + pr.title + '</span>' +
        '<span class="prj-pr-branch">' + (pr.headRefName || '') + '</span>' +
        '<span class="prj-pr-state ' + stateClass + '">' + pr.state + '</span>' +
        '<span class="prj-pr-date">' + (date ? new Date(date).toLocaleDateString() : '') + '</span>' +
      '</div></a>';
    });
  }
  document.getElementById('prj-gh-prs').innerHTML = prsHtml;

  // Commits
  if (commits.length > 0) {
    document.getElementById('prj-commits-section').style.display = '';
    var commitsHtml = '';
    commits.forEach(function(c) {
      var msg = (c.message || '').split('\\n')[0];
      commitsHtml += '<div class="prj-commit-row">' +
        '<span class="prj-commit-sha">' + c.sha + '</span>' +
        '<span class="prj-commit-msg">' + msg + '</span>' +
        '<span class="prj-commit-date">' + (c.date ? new Date(c.date).toLocaleDateString() : '') + '</span>' +
      '</div>';
    });
    document.getElementById('prj-gh-commits').innerHTML = commitsHtml;
  }
}

function prjShowCreateModal() {
  var html = '<div class="prj-modal-overlay" id="prj-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="prj-modal">' +
      '<h3>New Project</h3>' +
      '<label>Project Name *</label>' +
      '<input id="prj-new-name" placeholder="e.g. My App CRM">' +
      '<label>Description</label>' +
      '<textarea id="prj-new-desc" placeholder="What is this project?"></textarea>' +
      '<label>GitHub Repo</label>' +
      '<input id="prj-new-repo" placeholder="e.g. your-org/your-repo">' +
      '<label>Status</label>' +
      '<select id="prj-new-status">' +
        '<option value="planning">Planning</option>' +
        '<option value="in-progress" selected>In Progress</option>' +
        '<option value="pre-prod">Pre-Prod</option>' +
        '<option value="production">Production</option>' +
        '<option value="shipped">Shipped</option>' +
        '<option value="paused">Paused</option>' +
      '</select>' +
      '<label>Environment</label>' +
      '<select id="prj-new-env">' +
        '<option value="local">Local</option>' +
        '<option value="vercel">Vercel</option>' +
        '<option value="cloudflare">Cloudflare</option>' +
        '<option value="aws">AWS</option>' +
        '<option value="other">Other</option>' +
      '</select>' +
      '<label>Preview / Vercel URL</label>' +
      '<input id="prj-new-vercel" placeholder="https://...">' +
      '<label>Production URL</label>' +
      '<input id="prj-new-prod" placeholder="https://...">' +
      '<label>Branch</label>' +
      '<input id="prj-new-branch" placeholder="e.g. main, dev, features-dev/reservations">' +
      '<label>Tags (comma separated)</label>' +
      '<input id="prj-new-tags" placeholder="e.g. nextjs, trpc, reservations">' +
      '<label>Notes</label>' +
      '<textarea id="prj-new-notes" placeholder="Additional context..."></textarea>' +
      '<div class="prj-modal-actions">' +
        '<button class="prj-btn" onclick="document.getElementById(\\\'prj-modal\\\').remove()">Cancel</button>' +
        '<button class="prj-btn prj-btn-green" onclick="prjCreateProject()">Create</button>' +
      '</div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('prj-new-name').focus();
}

async function prjCreateProject() {
  var name = document.getElementById('prj-new-name').value.trim();
  if (!name) { alert('Name is required'); return; }
  var tags = document.getElementById('prj-new-tags').value.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
  try {
    await api('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        description: document.getElementById('prj-new-desc').value.trim(),
        repo: document.getElementById('prj-new-repo').value.trim(),
        status: document.getElementById('prj-new-status').value,
        environment: document.getElementById('prj-new-env').value,
        vercel_url: document.getElementById('prj-new-vercel').value.trim(),
        prod_url: document.getElementById('prj-new-prod').value.trim(),
        branch: document.getElementById('prj-new-branch').value.trim(),
        tags: tags,
        notes: document.getElementById('prj-new-notes').value.trim(),
      })
    });
    document.getElementById('prj-modal').remove();
    await loadProjectsData();
  } catch(e) { alert('Failed to create project: ' + e); }
}

function prjEditProject(id) {
  var p = prjData.find(function(x) { return x.id === id; });
  if (!p) return;
  var tags = [];
  try { tags = JSON.parse(p.tags || '[]'); } catch(e) {}

  var html = '<div class="prj-modal-overlay" id="prj-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="prj-modal">' +
      '<h3>Edit Project</h3>' +
      '<label>Project Name</label>' +
      '<input id="prj-edit-name" value="' + (p.name || '').replace(/"/g, '&quot;') + '">' +
      '<label>Description</label>' +
      '<textarea id="prj-edit-desc">' + (p.description || '') + '</textarea>' +
      '<label>GitHub Repo</label>' +
      '<input id="prj-edit-repo" value="' + (p.repo || '') + '">' +
      '<label>Status</label>' +
      '<select id="prj-edit-status">' +
        Object.keys(PRJ_STATUSES).map(function(k) {
          return '<option value="' + k + '"' + (p.status === k ? ' selected' : '') + '>' + PRJ_STATUSES[k].label + '</option>';
        }).join('') +
      '</select>' +
      '<label>Environment</label>' +
      '<select id="prj-edit-env">' +
        ['local','vercel','cloudflare','aws','other'].map(function(e) {
          return '<option value="' + e + '"' + (p.environment === e ? ' selected' : '') + '>' + e + '</option>';
        }).join('') +
      '</select>' +
      '<label>Preview / Vercel URL</label>' +
      '<input id="prj-edit-vercel" value="' + (p.vercel_url || '') + '">' +
      '<label>Production URL</label>' +
      '<input id="prj-edit-prod" value="' + (p.prod_url || '') + '">' +
      '<label>Branch</label>' +
      '<input id="prj-edit-branch" value="' + (p.branch || '') + '">' +
      '<label>Tags (comma separated)</label>' +
      '<input id="prj-edit-tags" value="' + tags.join(', ') + '">' +
      '<label>Notes</label>' +
      '<textarea id="prj-edit-notes">' + (p.notes || '') + '</textarea>' +
      '<div class="prj-modal-actions">' +
        '<button class="prj-btn" onclick="document.getElementById(\\\'prj-modal\\\').remove()">Cancel</button>' +
        '<button class="prj-btn prj-btn-green" onclick="prjSaveEdit(\\\'' + id + '\\\')">Save</button>' +
      '</div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

async function prjSaveEdit(id) {
  var tags = document.getElementById('prj-edit-tags').value.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
  try {
    await api('/api/projects/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('prj-edit-name').value.trim(),
        description: document.getElementById('prj-edit-desc').value.trim(),
        repo: document.getElementById('prj-edit-repo').value.trim(),
        status: document.getElementById('prj-edit-status').value,
        environment: document.getElementById('prj-edit-env').value,
        vercel_url: document.getElementById('prj-edit-vercel').value.trim(),
        prod_url: document.getElementById('prj-edit-prod').value.trim(),
        branch: document.getElementById('prj-edit-branch').value.trim(),
        tags: JSON.stringify(tags),
        notes: document.getElementById('prj-edit-notes').value.trim(),
      })
    });
    document.getElementById('prj-modal').remove();
    await loadProjectsData();
    prjOpenDetail(id);
  } catch(e) { alert('Failed to save: ' + e); }
}

function prjAddUpdate(id) {
  var html = '<div class="prj-modal-overlay" id="prj-modal" onclick="if(event.target===this)this.remove()">' +
    '<div class="prj-modal">' +
      '<h3>Add Update</h3>' +
      '<label>Type</label>' +
      '<select id="prj-upd-type">' +
        '<option value="note">Note</option>' +
        '<option value="pr">Pull Request</option>' +
        '<option value="deploy">Deployment</option>' +
        '<option value="commit">Commit</option>' +
        '<option value="status_change">Status Change</option>' +
      '</select>' +
      '<label>Content</label>' +
      '<textarea id="prj-upd-content" placeholder="What happened?" style="min-height:80px"></textarea>' +
      '<div class="prj-modal-actions">' +
        '<button class="prj-btn" onclick="document.getElementById(\\\'prj-modal\\\').remove()">Cancel</button>' +
        '<button class="prj-btn prj-btn-green" onclick="prjSaveUpdate(\\\'' + id + '\\\')">Save</button>' +
      '</div>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('prj-upd-content').focus();
}

async function prjSaveUpdate(id) {
  var content = document.getElementById('prj-upd-content').value.trim();
  if (!content) { alert('Content required'); return; }
  try {
    await api('/api/projects/' + id + '/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: document.getElementById('prj-upd-type').value,
        content: content,
      })
    });
    document.getElementById('prj-modal').remove();
    prjOpenDetail(id);
  } catch(e) { alert('Failed to save: ' + e); }
}

async function prjDeleteProject(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  try {
    await api('/api/projects/' + id, { method: 'DELETE' });
    prjBackToList();
    await loadProjectsData();
  } catch(e) { alert('Failed to delete: ' + e); }
}

function prjRefresh() {
  prjGithubCache = {};
  loadProjectsData();
}

// Set initial panel toggle button states
(function() {
  setTimeout(function() {
    var btns = ['bldr-toggle-chat', 'bldr-toggle-code', 'bldr-toggle-preview'];
    btns.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
    });
  }, 100);
})();

</script>

</body>
</html>`;
}
