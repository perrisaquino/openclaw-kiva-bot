# OPS.md - Automated Systems & Operations

Single source of truth for all automated systems, cron jobs, and infrastructure.

---

## 🔄 Active Cron Jobs

### 1. GitHub Workspace Backup
- **Schedule:** Every 2 hours
- **Status:** ✅ Working
- **What it does:** `git add -A`, commit, push workspace to GitHub
- **Cron ID:** `5b47a441-6f86-4857-9ddd-f4ac5fa8a234`

### 2. Evening Todoist Check-in
- **Schedule:** Daily 5:00 PM PST
- **Status:** ✅ Working
- **What it does:** Scans all Todoist tasks, identifies Perris-added tasks (high priority), selects top 3 for tomorrow, reschedules overdue tasks, checks daily note for unprocessed braindumps, reports to Quick Capture / Daily Reflection group
- **Cron ID:** `594a5aed-3db4-4608-adac-ab3294acdb58`

### 3. Evening Reflection
- **Schedule:** Daily 10:00 PM PST
- **Status:** ✅ Working
- **Cron ID:** `6780f7bf-ca56-4ef7-aa29-b32a31e23ca7`

### 4. Morning Brief
- **Schedule:** Daily 8:00 AM PST
- **Status:** ⚠️ Error (last run failed)
- **Cron ID:** `21bc26b8-9ca7-472a-a5ce-2774ce4f9441`
- **TODO:** Debug and fix

### 5. Weekly Workspace Audit
- **Schedule:** Sundays 9:00 AM PST
- **Status:** ⚠️ Error (last run failed)
- **What it does:** Reads every workspace file, moves instructional/procedural content to skills, moves historical content to memory, cuts redundancy, compresses, then git add/commit/push
- **Cron ID:** `ed8c195f-674d-4e9c-b7e6-1fca3b19c5b2`
- **TODO:** Debug and fix

---

## 📊 API Usage & Cost Tracking

### Current State
Files exist in `memory/archive/` from previous setup (pre-Kiva "Mission Control"):
- `USAGE-TRACKING-SETUP.md` - Cost tracking across Anthropic, OpenAI, Google, xAI
- `REAL-API-TRACKING.md` - HTTP interception for real API call logging
- `API-FAILOVER-PROTOCOL.md` - Automatic model switching on rate limits
- `MODEL-CONFIG.md` - Task-based model routing (Opus for strategy, Sonnet for routine)
- `MODEL-STRATEGY.md` - Overall model strategy

### Scripts (still in workspace root)
- `server.js` - Mission Control dashboard server (localhost:8899)
- `api-interceptor.js` - HTTP request interception for AI providers
- `api-failover-manager.js` - Automatic failover on rate limits

### What It Tracked
- Every AI API call logged with provider, model, tokens, cost
- Daily/monthly expense tracking with provider breakdown
- Real-time cost calculation with accurate provider pricing
- Automatic model failover: Opus → Sonnet → GPT-4 → GPT-3.5

### TODO
- [ ] Verify Mission Control server still runs (`node server.js`)
- [ ] Determine if API interception is still functional with current OpenClaw version
- [ ] Reactivate cost tracking or build simpler alternative
- [ ] Set up cost alerts/reports

---

## 🏗️ Infrastructure

### Workspace
- **Location:** `/Users/iamperris/.openclaw/workspace/`
- **Repo:** Backed up to GitHub every 2 hours (auto-backup cron)
- **Core files:** AGENTS.md, SOUL.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, MEMORY.md, OPS.md

### OpenClaw Config
- **Config:** `~/.openclaw/openclaw.json`
- **Default model:** anthropic/claude-opus-4-6
- **Channel:** Telegram

### Todoist
- **API token:** In TOOLS.md
- **Single source of truth** for all tasks
- **Tags:** `@quick_capture` (extracted from reflections), `@kiva` (Kiva-handled tasks)

---

## 📋 Maintenance Checklist

### Weekly (Sunday audit)
- [ ] Workspace files reviewed for bloat
- [ ] Redundant content compressed or moved
- [ ] Git commit and push

### Daily (automated)
- [ ] GitHub backup runs every 2 hours
- [ ] Todoist check-in at 5 PM
- [ ] Evening reflection at 10 PM
- [ ] Morning brief at 8 AM

### As Needed
- [ ] Debug erroring cron jobs (morning-brief, weekly-workspace-audit)
- [ ] Review API costs if tracking is reactivated
- [ ] Update model routing strategy
