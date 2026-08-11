#!/bin/bash
# Fetches a fresh Zoom S2S OAuth token and outputs it as JSON headers
# Used by Claude Code MCP headersHelper

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Source .env
set -a
source "$PROJECT_ROOT/.env" 2>/dev/null
set +a

ENCODED=$(echo -n "${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}" | base64 | tr -d '\n')

RESPONSE=$(curl -s -X POST "https://zoom.us/oauth/token" \
  -H "Authorization: Basic $ENCODED" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}")

TOKEN=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo '{}' >&2
  exit 1
fi

echo "{\"Authorization\": \"Bearer $TOKEN\"}"
