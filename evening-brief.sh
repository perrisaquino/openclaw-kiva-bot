#!/bin/bash
# Evening Brief ("Evening Breeze") — 9 PM PST daily
# Sends to Morning Brief group: telegram:-5284108035

export TZ=America/Los_Angeles
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export NODE_PATH="/opt/homebrew/lib/node_modules"

TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -v+1d +%Y-%m-%d)

~/.npm-global/bin/openclaw sessions_spawn \
  mode=run \
  task="You are Kiva. Create Perris's Evening Brief for $TODAY. Follow morning-brief-sources-v2.md for context rules.

BEFORE WRITING: Read ALL new Quick Capture files in '/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily/Quick Captures/' — sort by modification time, read everything from today. Also check today's daily note braindump.

# 🌙 EVENING BREEZE — $TODAY

## ✅ TOP 3 PRIORITIES FOR TOMORROW ($TOMORROW)
Extract from today's reflections, Quick Captures, Master To-Do Hub, and current context. Pick the 3 most needle-moving tasks. Format:
1. **Task** — WHY it matters
2. **Task** — WHY it matters
3. **Task** — WHY it matters

## 📋 WHAT GOT DONE TODAY
Quick recap of today's progress based on reflections and activity.

## ⚡ HD WIND-DOWN
Short Sacral check-in based on today's Quick Captures. What felt aligned (satisfaction), what felt off (frustration), what to carry forward vs. let go. End with: 'Rest well, Generator. Tomorrow responds to you.'

Send the brief using: message(action=send, channel=telegram, target=telegram:-5284108035, message=[BRIEF_CONTENT])
" \
  model=anthropic/claude-sonnet-4-20250514 \
  cleanup=delete \
  2>> /tmp/evening-brief.log

echo "[$(date)] Evening brief sent" >> /tmp/evening-brief.log
