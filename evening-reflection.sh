#!/bin/bash

# Evening Reflection Automation for CyphrCam Content Creation  
# Runs at 9 PM PST daily - Insight extraction & content generation

# Set timezone
export TZ=America/Los_Angeles

# Get today's date
TODAY=$(date +%Y-%m-%d)
OBSIDIAN_PATH="/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily"
DAILY_NOTE="$OBSIDIAN_PATH/$TODAY.md"

# Log execution
echo "[$(date)] Starting evening reflection for $TODAY" >> /tmp/evening-reflection.log

# Check if daily note exists
if [ ! -f "$DAILY_NOTE" ]; then
    echo "[$(date)] WARNING: Daily note not found at $DAILY_NOTE" >> /tmp/evening-reflection.log
    
    # Create basic daily note
    mkdir -p "$OBSIDIAN_PATH"
    cat > "$DAILY_NOTE" << EOF
# $TODAY Daily Note

## Evening Reflection 🌙
*Questions asked: $(date +"%I:%M %p")*

## Story Threads 🧵
*Auto-extracted for content creation:*
- 

## Tomorrow's Content Ideas 💡
*Generated from today's insights:*
- 

EOF
fi

# Execute evening reflection workflow via OpenClaw with Sonnet
/usr/local/bin/openclaw sessions_spawn \
    mode=run \
    task="Evening reflection for $TODAY: 1) Read today's Obsidian daily note at $DAILY_NOTE and analyze content for themes about CyphrCam development, movement practice, integration insights 2) Generate 3-5 strategic reflection questions based on what Perris experienced today + his context as movement artist building for dancers 3) Send questions via private reflection channel 4) After responses, extract content ideas and story threads 5) Save responses to 'Evening Reflection' section and content ideas to 'Tomorrow's Content Ideas' section 6) Focus on authentic builder journey content that positions him as artist building for artists using movement philosophy for business decisions" \
    model=anthropic/claude-sonnet-4-20250514 \
    cleanup=delete \
    2>> /tmp/evening-reflection.log

echo "[$(date)] Evening reflection workflow completed" >> /tmp/evening-reflection.log