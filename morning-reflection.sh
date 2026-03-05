#!/bin/bash

# Morning Reflection Automation for CyphrCam Content Creation
# Runs at 8 AM PST daily - Intention setting & content seeding

# Set timezone
export TZ=America/Los_Angeles

# Get today's date
TODAY=$(date +%Y-%m-%d)
OBSIDIAN_PATH="/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily"
DAILY_NOTE="$OBSIDIAN_PATH/$TODAY.md"

# Log execution
echo "[$(date)] Starting morning reflection for $TODAY" >> /tmp/morning-reflection.log

# Ensure daily note exists with template
if [ ! -f "$DAILY_NOTE" ]; then
    echo "[$(date)] Creating daily note for $TODAY" >> /tmp/morning-reflection.log
    
    # Create directory if it doesn't exist
    mkdir -p "$OBSIDIAN_PATH"
    
    # Create daily note with template
    cat > "$DAILY_NOTE" << EOF
# $TODAY Daily Note

## Morning Reflection 🌅
*Questions asked: $(date +"%I:%M %p")*

## Content Seeds 🌱
- 

## CyphrCam Development
- 

## Movement & Practice
- 

## Integration Insights
- 

## Evening Reflection 🌙
*Questions asked: [pending]*

## Story Threads 🧵
*Auto-extracted for content creation:*
- 

## Tomorrow's Content Ideas 💡
*Generated from today's insights:*
- 

EOF
fi

# Execute morning reflection workflow via OpenClaw with Sonnet
/usr/local/bin/openclaw sessions_spawn \
    mode=run \
    task="Morning reflection for $TODAY: Send 3-4 strategic morning questions to Perris via private reflection channel. Focus on: 1) Intention setting for day's CyphrCam development 2) Energy/body awareness before building 3) How artist/entrepreneur sides want to show up today 4) What story threads are emerging from building journey. Questions should feel conversational and help set positive, aligned intention for the day. After responses, save to Obsidian daily note under 'Morning Reflection' section at: $DAILY_NOTE" \
    model=anthropic/claude-sonnet-4-20250514 \
    cleanup=delete \
    2>> /tmp/morning-reflection.log

echo "[$(date)] Morning reflection workflow completed" >> /tmp/morning-reflection.log