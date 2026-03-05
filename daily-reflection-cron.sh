#!/bin/bash

# Daily Reflection Automation for CyphrCam Content Mining
# Runs at 9 PM PST daily to scan Obsidian notes and trigger reflection questions

# Set timezone
export TZ=America/Los_Angeles

# Get today's date for file paths
TODAY=$(date +%Y-%m-%d)
OBSIDIAN_PATH="/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily"
DAILY_NOTE="$OBSIDIAN_PATH/$TODAY.md"

# Log execution
echo "[$(date)] Starting daily reflection for $TODAY" >> /tmp/daily-reflection.log

# Check if daily note exists, create if needed
if [ ! -f "$DAILY_NOTE" ]; then
    echo "[$(date)] Creating daily note for $TODAY" >> /tmp/daily-reflection.log
    
    # Create directory if it doesn't exist
    mkdir -p "$OBSIDIAN_PATH"
    
    # Create daily note with template
    cat > "$DAILY_NOTE" << EOF
# $TODAY Daily Note

## Content Seeds 🌱
- 

## CyphrCam Development
- 

## Movement & Practice
- 

## Integration Insights
- 

## Daily Reflection (Auto-Generated)
*Questions asked: $(date +"%I:%M %p")*

## Story Threads 🧵
*Auto-extracted by Kiva for content creation*
- 

EOF
fi

# Execute the daily reflection workflow via OpenClaw
/usr/local/bin/openclaw --workspace "/Users/iamperris/.openclaw/workspace" session new --label "Daily Reflection $(date +%Y-%m-%d)" --task "Execute daily reflection workflow: 1) Scan today's Obsidian daily note at $DAILY_NOTE 2) Extract key themes about CyphrCam development, movement practice, and integration insights 3) Generate 3-5 strategic reflection questions based on Perris's day and context 4) Send questions via Telegram for response 5) Save responses back to Obsidian daily note 6) Generate content ideas for tomorrow" --model opus --cleanup delete 2>> /tmp/daily-reflection.log

echo "[$(date)] Daily reflection workflow completed" >> /tmp/daily-reflection.log