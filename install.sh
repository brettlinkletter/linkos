#!/usr/bin/env bash
set -e

# ── LinkOS Installer ────────────────────────────────────────────────────
# curl -fsSL https://raw.githubusercontent.com/brettlinkletter/linkos/main/install.sh | bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

INSTALL_DIR="$HOME/linkos"

echo ""
echo -e "${BOLD}${CYAN}"
echo "  ██████╗  █████╗ ██╗    ██╗  ██████╗██╗      █████╗ ██╗    ██╗"
echo "  ██╔══██╗██╔══██╗██║    ██║ ██╔════╝██║     ██╔══██╗██║    ██║"
echo "  ██████╔╝███████║██║ █╗ ██║ ██║     ██║     ███████║██║ █╗ ██║"
echo "  ██╔══██╗██╔══██║██║███╗██║ ██║     ██║     ██╔══██║██║███╗██║"
echo "  ██║  ██║██║  ██║╚███╔███╔╝ ╚██████╗███████╗██║  ██║╚███╔███╔╝"
echo "  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝  ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝"
echo -e "${RESET}"
echo -e "  ${BOLD}Your AI department in a box${RESET} -- LinkOS"
echo ""

fail() { echo -e "  ${RED}✗${RESET}  $1"; exit 1; }
ok()   { echo -e "  ${GREEN}✓${RESET}  $1"; }
warn() { echo -e "  ${YELLOW}!${RESET}  $1"; }
info() { echo -e "  ${CYAN}>${RESET}  $1"; }

# ── Preflight checks ────────────────────────────────────────────────────────

info "Checking prerequisites..."
echo ""

# Xcode CLI tools (macOS only -- needed for git and build tools)
if [ "$(uname)" = "Darwin" ]; then
  if ! xcode-select -p &>/dev/null; then
    info "Installing Xcode Command Line Tools (this may take a few minutes)..."
    xcode-select --install 2>/dev/null || true
    # Wait for install to complete
    until xcode-select -p &>/dev/null; do
      sleep 5
    done
    ok "Xcode CLI tools installed"
  fi
fi

# Git
if command -v git &>/dev/null; then
  ok "Git $(git --version | awk '{print $3}')"
else
  fail "Git not found. Install it: https://git-scm.com"
fi

# Homebrew (macOS -- needed to install Node.js)
if [ "$(uname)" = "Darwin" ] && ! command -v brew &>/dev/null; then
  info "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" </dev/tty
  # Add brew to PATH for this session
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -f /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
  if command -v brew &>/dev/null; then
    ok "Homebrew installed"
  else
    warn "Homebrew install may need a terminal restart"
  fi
fi

# Node.js
if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    ok "Node.js v$NODE_VERSION"
  else
    info "Node.js v$NODE_VERSION is too old. Installing v22..."
    if command -v brew &>/dev/null; then
      brew install node@22 2>&1 | tail -1
      brew link --overwrite node@22 2>/dev/null || true
    else
      curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>&1 | tail -1
      apt-get install -y nodejs 2>&1 | tail -1
    fi
    ok "Node.js $(node --version)"
  fi
else
  info "Installing Node.js..."
  if [ "$(uname)" = "Darwin" ]; then
    if command -v brew &>/dev/null; then
      brew install node@22 2>&1 | tail -1
      brew link --overwrite node@22 2>/dev/null || true
    else
      fail "Cannot install Node.js without Homebrew. Install Homebrew first: https://brew.sh"
    fi
  else
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>&1 | tail -1
    apt-get install -y nodejs 2>&1 | tail -1
  fi
  if command -v node &>/dev/null; then
    ok "Node.js $(node --version)"
  else
    fail "Could not install Node.js. Install manually: https://nodejs.org"
  fi
fi

# Claude CLI
if command -v claude &>/dev/null; then
  ok "Claude CLI $(claude --version 2>/dev/null || echo '(installed)')"
else
  info "Installing Claude Code CLI..."
  npm install -g @anthropic-ai/claude-code 2>&1 | tail -1
  if command -v claude &>/dev/null; then
    ok "Claude CLI installed"
  else
    fail "Could not install Claude CLI. Run: npm install -g @anthropic-ai/claude-code"
  fi
fi

echo ""

# ── Tailscale ────────────────────────────────────────────────────────────────

if command -v tailscale &>/dev/null; then
  TS_IP=$(tailscale ip -4 2>/dev/null || echo "")
  if [ -n "$TS_IP" ]; then
    ok "Tailscale connected ($TS_IP)"
  else
    ok "Tailscale installed (run 'sudo tailscale up --ssh' to connect)"
  fi
else
  info "Installing Tailscale (for remote SSH access)..."
  curl -fsSL https://tailscale.com/install.sh | sh 2>&1 | tail -3
  if command -v tailscale &>/dev/null; then
    ok "Tailscale installed"
    info "Run 'sudo tailscale up --ssh' after setup to connect"
  else
    warn "Tailscale install failed -- install manually: https://tailscale.com/download"
  fi
fi

# ── Cloudflared (for dashboard tunnel) ───────────────────────────────────────

if command -v cloudflared &>/dev/null; then
  ok "Cloudflared $(cloudflared --version 2>/dev/null | head -1 | awk '{print $3}' || echo '(installed)')"
else
  info "Installing cloudflared (for dashboard tunnel)..."
  if [ "$(uname)" = "Darwin" ]; then
    if command -v brew &>/dev/null; then
      brew install cloudflare/cloudflare/cloudflared 2>&1 | tail -1
    else
      warn "Homebrew not found -- install cloudflared manually: brew install cloudflare/cloudflare/cloudflared"
    fi
  else
    curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /tmp/cloudflared && chmod +x /tmp/cloudflared && sudo mv /tmp/cloudflared /usr/local/bin/cloudflared
  fi
  if command -v cloudflared &>/dev/null; then
    ok "Cloudflared installed"
  else
    warn "Cloudflared install failed -- dashboard will only work on localhost"
  fi
fi

echo ""

# ── Clone ────────────────────────────────────────────────────────────────────

if [ -d "$INSTALL_DIR" ]; then
  warn "Directory $INSTALL_DIR already exists -- removing for fresh install"
  rm -rf "$INSTALL_DIR"
fi

info "Cloning LinkOS..."
git clone --depth 1 https://github.com/brettlinkletter/linkos.git "$INSTALL_DIR" 2>&1 | tail -1
ok "Cloned to $INSTALL_DIR"

# ── Install dependencies ────────────────────────────────────────────────────

cd "$INSTALL_DIR"
info "Installing dependencies..."
npm install --loglevel=error 2>&1
ok "Dependencies installed"

echo ""

# ── Claude login ─────────────────────────────────────────────────────────────

info "Checking Claude authentication..."
CLAUDE_AUTHED=false
if [ -d "$HOME/.claude" ]; then
  if ls "$HOME/.claude/" 2>/dev/null | grep -qE 'auth|credentials|oauth'; then
    CLAUDE_AUTHED=true
  fi
fi

if [ "$CLAUDE_AUTHED" = true ]; then
  ok "Claude already authenticated"
else
  echo ""
  echo -e "  ${BOLD}Claude login required.${RESET}"
  echo -e "  This opens a browser window. Log in with your Anthropic account."
  echo ""
  claude login </dev/tty
  ok "Claude authenticated"
fi

echo ""

# ── Done — launch setup wizard ──────────────────────────────────────────────

echo -e "  ${BOLD}${GREEN}Dependencies ready.${RESET} Launching setup wizard..."
echo ""

# Re-attach stdin to terminal so the interactive wizard works
exec npx tsx scripts/setup.ts </dev/tty
