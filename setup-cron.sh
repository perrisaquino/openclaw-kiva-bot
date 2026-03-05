#!/bin/bash

# Setup daily reflection cron job
echo "Setting up daily reflection cron job..."

# Create the cron job entry
CRON_JOB="0 21 * * * /Users/iamperris/.openclaw/workspace/daily-reflection-cron.sh"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "Cron job added: Daily reflection at 9 PM PST"
echo "Checking crontab..."
crontab -l