# HEARTBEAT.md — System Maintenance & Task Extraction

## On Every Heartbeat (Priority Order)
Review this list. Pick 1-2 items that haven't been touched recently. Spawn sub-agents to parallelize.

### 🔄 Quick Capture Task Extraction (Daily Priority)
1. **Scan new reflections** from last 24 hours in `Journal/Daily/Quick Captures/`
2. **Extract unchecked tasks** from ✅ To-Do List sections  
3. **Update Master To-Do Hub** with new tasks, categorized by delegation
4. **Push Perris tasks** to Todoist with @quick_capture tag
5. **Begin proactive work** on Kiva-delegated tasks
6. **Report summary** of tasks extracted and actions taken

### 📋 Obsidian Daily Note Fallback Queue (Every Heartbeat)
**Purpose:** When Telegram/OpenClaw was down, Perris may have captured reflections directly in his Obsidian Daily Note. Parse and process them.

**Process:**
1. Read today's daily note: `/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily/YYYY-MM-DD.md`
2. Check `## Braindump` section for new content since last scan
3. If reflections found, segment them by natural breaks (timestamps, "---", paragraph gaps)
4. Process each segment into separate Quick Capture notes using standard template
5. Eye-catching headline for each (using copywriting skill)
6. Mark processed content in heartbeat state so it's not double-processed

**Fallback Sources (check in order):**
1. Obsidian Daily Note → `## Braindump` section (PRIMARY)
2. Todoist inbox → tasks tagged with reflection-related labels
3. Apple Notes → "Quick Capture" folder

**State tracking:** `memory/heartbeat-state.json` → `lastDailyNoteScan` timestamp

### 🎯 Todoist Priority Intelligence (5 PM Cron - Automated)
**Cron Job:** `evening-todoist-checkin` runs daily at 5:00 PM PST
**What it does:**
1. Scans ALL Todoist tasks across projects
2. Identifies tasks Perris added directly (HIGH PRIORITY signal)
3. Selects TOP 3 needle-moving priorities for tomorrow
4. Reschedules overdue/incomplete tasks intelligently
5. Scans daily note for brain dumps needing processing
6. Reports to Quick Capture / Daily Reflection Telegram group

**Rules:**
- Tasks Perris adds himself = automatically high priority
- Max 3 priority tasks per day (respects ADHD, prevents overwhelm)
- Overdue 3+ days = flagged for review, not just rolled forward
- All new tasks go to inbox first, then get prioritized
- Priority criteria: CyphrCam launch > revenue > time-sensitive > user growth

**LATEST EXTRACTION (March 1, 10:11 PM):**
- **Source:** `2026-03-01 - Solo Founder Setup Hell.md` (Quick Capture)
- **Tasks Found:** 7 total (5 Perris, 2 Kiva)
- **Perris Tasks:** Fix MacBook OpenClaw token, get USB-C hub for Surface Book, complete Surface Book setup, stop VPS instance, decide on Hetzner VPS
- **Kiva Tasks:** Create OpenClaw setup recovery guide, build automated user engagement system
- **Key Context:** 12-hour infrastructure setup day, locked out of Surface Book, corrupted MacBook config
- **Files Updated:** Master To-Do Hub with new tasks categorized by delegation
- **Next:** Begin proactive work on Kiva-delegated system building tasks

**PREVIOUS EXTRACTION (Feb 28, 8:33 AM):**
- **Source:** `content-engine-launch-checklist.md`  
- **Tasks Found:** 15 total (9 Perris, 6 Kiva)
- **Files Created:** `master-todo-extraction-2026-02-28.md`, 3 content templates

### 📅 Weekly Content Pipeline (Sundays Only)
**Note:** Content extraction happens weekly, not daily. See `weekly-content-pipeline.md` cron job.
- **Sunday 8 PM**: Extract content ideas from week's reflections → Notion pipeline
- **Daily heartbeats**: Focus on tasks only, not content extraction

**LATEST EXTRACTION (March 1, 9:34 PM):**
- **Source:** 8 Quick Capture files from Feb 27-28, 2026
- **Content Ideas:** 9 high-priority ideas extracted across 4 content pillars
- **Platform Distribution:** 3 Substack, 4 Threads, 2 Instagram, 2 LinkedIn
- **Top Priorities:** "Why I'll Never Call Myself a 'Struggling Artist'", "I Built the Tool I've Wanted Since I Was 16", "The Florida Gig Origin Story"
- **Files Created:** `weekly-content-extraction-march-1-2026.md` (workspace + Obsidian)
- **Content Pillar Balance:** Builder's Journey (44%), Dance Community (22%), Growth & Systems (22%), Community Building (11%)

## Outstanding Mistakes & Debt

### 1. ✅ COMPLETED - BOOTSTRAP.md Cleanup (Feb 25, 2026) - MOVED TO ARCHIVE

### 2. ✅ COMPLETED - Todoist System (Feb 26, 2026) - MOVED TO ARCHIVE

### 3. ✅ COMPLETED - TODO Backlog (Feb 25, 2026) - MOVED TO ARCHIVE

### 4. Community Strategy Implementation ⏳ WAITING ON PERRIS
- Templates created for DMs and Skool community engagement
- **Created:** `community-dm-templates.md`, `weekly-lab-prompt-1.md`
- **Next:** Perris to customize and send DMs, post lab prompt in Skool
- **Status:** Ready for execution, no further automation needed

### 5. ✅ COMPLETED - Memory & Systems Architecture (Feb 25, 2026) - MOVED TO ARCHIVE

## Rules
- **Mark tasks as COMPLETED with date** when fully done (✅ COMPLETED + date)
- **Never repeat completed work** — check this file first before starting anything
- **Update status in real-time** — if you work on something, document progress immediately
- **Archive completed sections** — move finished items to bottom "COMPLETED ARCHIVE" section
- Don't repeat work already done — check memory files first
- Announce what you're working on to Perris if it's significant
- Spawn sub-agents for independent tasks (coding on Codex, writing on Sonnet, research on Opus)
- **RELATED NOTES RULE:** For ALL reflection notes, search vault FIRST for existing connections before adding potential new notes. Stop making up note titles! See RELATED-NOTES-RULE.md

## COMPLETED ARCHIVE (Don't Repeat These)

### ✅ COMPLETED - BOOTSTRAP.md Cleanup (Feb 25, 2026)
- File deleted after initial setup
- **RESULT:** No longer exists, setup complete

### ✅ COMPLETED - Todoist Integration & Cleanup (Feb 26, 2026)
- API access restored and working
- Inbox cleanup completed (16 → 10 tasks after triage)
- Overdue task monitoring script created
- Heartbeat integration documented
- **FILES CREATED:** `scripts/todoist-overdue-check.sh`, `todoist-heartbeat-integration.md`, `todoist-actual-cleanup-report.md`
- **RESULT:** System operational, no further heartbeat action needed

### ✅ COMPLETED - TODO Backlog (Feb 25, 2026)
- CyphrCam V3 codebase analysis complete
- PostHog analytics audit complete (grade A+)
- Obsidian vault analysis complete
- Human Design calendar structure drafted
- Freemium strategy documented
- Apple Calendar integration complete
- **RESULT:** All identified backlog items addressed

### ✅ COMPLETED - Memory & Systems Architecture (Feb 25, 2026)
- USER.md and IDENTITY.md updated with comprehensive profile data
- Content automation roadmap created
- Instagram growth strategy documented
- Daily reflection automation system built
- **RESULT:** Core systems documented and operational

### ✅ COMPLETED - Brand Alignment Package (Feb 26, 2026)
- Platform bio copy created for all accounts (character limit compliant)
- Substack origin story drafted (2,800 words)
- Brand alignment action plan created
- Product insight documented (social vs. private toggle)
- **ALL FILES MOVED TO OBSIDIAN** per Perris direction
- **RESULT:** Brand positioning package complete, ready for implementation

### ✅ COMPLETED - Content Pipeline Enhancement (Feb 26, 2026)
- **3 agents deployed:** Responsive design, markdown editor, AI rewriting system  
- **Issue resolved:** Complex editor had integration problems, replaced with functional simple editor
- **Working features:**
  - Click "📝 Edit" → opens professional modal editor
  - Full responsive design for mobile/desktop/tablet
  - Working save functionality with word count tracking
  - Pre-loaded demo content for all planned articles
  - Test button for verification
  - Professional dark theme editing environment
- **FILES CREATED:** Enhanced `mission-control.html`, `simple-editor.js`
- **RESULT:** Fully functional content editing system integrated into Mission Control
