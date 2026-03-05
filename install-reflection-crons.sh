#!/bin/bash

# Install Morning and Evening Reflection Cron Jobs
echo "Installing daily reflection cron jobs..."

# Define the workspace path
WORKSPACE="/Users/iamperris/.openclaw/workspace"

# Create cron entries
MORNING_CRON="0 8 * * * $WORKSPACE/morning-reflection.sh >/dev/null 2>&1"
EVENING_CRON="0 21 * * * $WORKSPACE/evening-reflection.sh >/dev/null 2>&1"

# Get existing crontab or create empty one
crontab -l 2>/dev/null > /tmp/current_crontab || touch /tmp/current_crontab

# Remove any existing reflection cron jobs (in case we're updating)
grep -v "reflection.sh" /tmp/current_crontab > /tmp/new_crontab

# Add new cron jobs
echo "$MORNING_CRON" >> /tmp/new_crontab
echo "$EVENING_CRON" >> /tmp/new_crontab

# Install the new crontab
crontab /tmp/new_crontab

# Clean up temporary files
rm /tmp/current_crontab /tmp/new_crontab

echo "✅ Cron jobs installed successfully:"
echo "   Morning Reflection: 8:00 AM PST daily"
echo "   Evening Reflection: 9:00 PM PST daily"
echo ""
echo "Checking current crontab:"
crontab -l