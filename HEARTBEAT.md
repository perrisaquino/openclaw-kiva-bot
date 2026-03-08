# HEARTBEAT.md — Simplified System

## Single Source of Truth: Todoist
**ALL tasks live in Todoist. Period.** No markdown task hubs, no scattered to-do lists. If it's not in Todoist, it doesn't exist as a task.

## On Every Heartbeat (Priority Order)
Pick 1-2 items that haven't been touched recently.

### 🔄 Quick Capture Processing
When new reflections come in (Telegram or Obsidian Daily Note braindump):
1. Process into Quick Capture note in `Journal/Daily/Quick Captures/`
2. Add to 📝 QUICK CAPTURES.md feed
3. **Extract actionable tasks → push directly to Todoist inbox** (no middle layer)
4. Begin proactive work on Kiva-delegated tasks
5. Report summary if significant

**Todoist task rules:**
- Tag extracted tasks with `@quick_capture` label
- Perris-added tasks = automatically high priority
- Kiva can add tasks she'll handle herself, tagged `@kiva`

### 📋 Obsidian Daily Note Fallback
If Telegram/OpenClaw was down, check today's daily note braindump:
1. Read: `/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily/YYYY-MM-DD.md`
2. Check `## Braindump` section for new content
3. Process into Quick Capture notes
4. Push tasks to Todoist

**State tracking:** `memory/heartbeat-state.json` → `lastDailyNoteScan` timestamp

### 🎯 Todoist Priority Intelligence (5 PM Cron)
**Cron Job:** `evening-todoist-checkin` runs daily at 5:00 PM PST
1. Scan ALL Todoist tasks across projects
2. Identify tasks Perris added directly (HIGH PRIORITY)
3. Select TOP 3 needle-moving priorities for tomorrow
4. Reschedule overdue/incomplete tasks intelligently
5. Check daily note for unprocessed braindumps
6. Report to Quick Capture / Daily Reflection Telegram group

**Rules:**
- Max 3 priority tasks per day (respects ADHD, prevents overwhelm)
- Overdue 3+ days = flagged for review, not just rolled forward
- Priority criteria: CyphrCam launch > revenue > time-sensitive > user growth

### 📅 Weekly Content Pipeline (Sundays Only)
- **Sunday 8 PM**: Extract content ideas from week's reflections → Notion pipeline
- Daily heartbeats focus on tasks only, not content extraction

## Quick Capture System (What It Is)
**Quick Captures = reflections, not tasks.** They're Perris's processed braindumps stored in Obsidian:
- Location: `Journal/Daily/Quick Captures/`
- Feed: `📝 QUICK CAPTURES.md` (links to all notes, browsable on mobile)
- Each note has: headline, TL;DR, raw reflection, lessons, ideas, idea compass, content potential, vault connections
- Checkboxes in lessons/ideas = "this resonated" markers, NOT task items
- Actual tasks get extracted and sent to Todoist

## Rules
- **Todoist = only task system.** No markdown to-do hubs.
- **RELATED NOTES RULE:** Search vault FIRST for existing connections before adding potential new notes. Never make up note titles. See RELATED-NOTES-RULE.md
- Don't repeat completed work, check memory files first
- Spawn sub-agents for independent tasks
- Announce significant work to Perris

## Outstanding Items

### Community Strategy ⏳ ON HOLD
- Skool pivot: shifting to simple feedback board (UserJot/Canny style)
- Previous Skool templates created but community approach is being simplified
- **Next:** Build feedback board when ready for App Store launch

## COMPLETED ARCHIVE (Don't Repeat These)

### ✅ BOOTSTRAP.md Cleanup (Feb 25)
### ✅ Todoist Integration & Cleanup (Feb 26)
### ✅ TODO Backlog (Feb 25)
### ✅ Memory & Systems Architecture (Feb 25)
### ✅ Brand Alignment Package (Feb 26)
### ✅ Content Pipeline Enhancement (Feb 26)
### ✅ Master To-Do Hub (March 8) - DELETED. Replaced by Todoist as single source of truth.
