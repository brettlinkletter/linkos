#!/bin/bash
# Send SMS via Twilio
# Usage: ./send-sms.sh "+1XXXXXXXXXX" "Your message here"

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load env
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -E '^(TWILIO_ACCOUNT_SID|TWILIO_AUTH_TOKEN|TWILIO_PHONE_NUMBER)=' "$PROJECT_ROOT/.env" | xargs)
fi

TO="$1"
BODY="$2"

if [ -z "$TO" ] || [ -z "$BODY" ]; then
  echo "Usage: send-sms.sh \"+1XXXXXXXXXX\" \"message\""
  exit 1
fi

if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_PHONE_NUMBER" ]; then
  echo "Error: Twilio credentials not set in .env"
  exit 1
fi

curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
  --data-urlencode "To=${TO}" \
  --data-urlencode "From=${TWILIO_PHONE_NUMBER}" \
  --data-urlencode "Body=${BODY}" \
  -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}"
