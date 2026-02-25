# MEMORY.md - Long-Term Memory

## Group Chat Rules (set 2026-02-25)

Perris uses **topic-focused Telegram group chats** — each group is named after a topic (e.g., "Marketing", "CyphrCam", "Hardware"). Rules:

1. **Stay on topic.** Only discuss what the group name says. No off-topic chatter.
2. **Reply to everything.** Don't wait for a ping — respond to ANY message in these channels.
3. **DMs = anything goes.** Direct messages have no topic restriction.
4. **Create groups proactively.** If a new topic comes up that deserves its own space, create a new Telegram group with Perris and start the conversation there.
5. **Route messages correctly.** If Perris brings up something that belongs in a different channel, nudge them to take it there (or send it there yourself).
6. **groupPolicy is set to "open"** in openclaw.json so bot can respond in all groups.

**Important:** Perris also needs to disable Group Privacy on the bot via @BotFather for full message visibility.

## Model Routing Rules (set 2026-02-25)

Perris wants intelligent model routing to save costs. Rules:

- **Default/Planning:** Claude Opus 4-6 (`opus`) — used for planning, orchestration, complex reasoning, and starting any new task
- **Coding:** GPT Codex (`openai/gpt-5.1-codex`) — all coding tasks, lower-leverage work, anything requiring many detailed steps
- **Writing/Marketing:** Claude Sonnet 4 (`anthropic/claude-sonnet-4-20250514`) — copywriting, marketing, writing tasks
- **Delegation:** Use Opus to plan, then delegate sub-tasks to cheaper models (Codex for code, Sonnet for writing) via sub-agents
- **Transparency:** Always announce which model is being used at the start of every task. E.g., "Running this on Codex 5.1" or "Using Opus 4-6 for this"
- **Goal:** Save money by only using Opus when its intelligence level is actually needed

## Transcription

- Whisper API works for voice notes (tested 2026-02-25)
- Audio files land in `/Users/iamperris/.openclaw/media/inbound/`
- Script: `bash ~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh`
