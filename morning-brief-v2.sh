#!/bin/bash
# Morning Brief — Perris's daily briefing via OpenClaw
# Runs at 8 AM PST daily
# Sends to Morning Brief group: telegram:-5284108035

export TZ=America/Los_Angeles
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export NODE_PATH="/opt/homebrew/lib/node_modules"

TODAY=$(date +%Y-%m-%d)

# Create the morning brief content
~/.npm-global/bin/openclaw sessions_spawn \
  mode=run \
  task="You are Kiva. Create Perris's morning brief for $TODAY using morning-brief-sources-v2.md for news sources. Follow this EXACT structure:

# 📱 MORNING BRIEF - $TODAY

## 🌤️ Weather
Las Vegas current conditions + forecast

## 📰 News & Trends
Scan these priority topics with WHY context:
- AI MODELS: OpenAI, Anthropic, other model releases/updates
- FASCISM WATCH: Arts defunding, civil rights rollbacks, travel restrictions 
- DANCE CULTURE: Nikel Udot Substack, The Capsule London podcast
Include 2-3 headlines with direct links + WHY each matters to Perris

## ✅ TOP 3 PRIORITIES TODAY  
Extract from Master To-Do Hub + current context:
1. **Most important task** - **WHY:** clear reason
2. **Second priority** - **WHY:** clear reason  
3. **Third priority** - **WHY:** clear reason

## ⚡ Energy Reminder
Human Design guidance connected to recent reflections, not generic

After creating the content, send it to Morning Brief group using:
message(action=send, channel=telegram, target=telegram:-5284108035, message=[BRIEF_CONTENT])
" \
  model=anthropic/claude-sonnet-4-20250514 \
  cleanup=delete \
  2>> /tmp/morning-brief.log

echo "[$(date)] Morning brief sent to Morning Brief group" >> /tmp/morning-brief.log