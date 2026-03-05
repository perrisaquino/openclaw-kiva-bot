# Todoist Heartbeat Integration
*Created: Feb 26, 2026 - Kiva*

## Overview
Automated overdue task monitoring integrated into OpenClaw heartbeat checks to help Perris stay on top of CyphrCam development milestones and personal tasks.

## Script Location
**File:** `scripts/todoist-overdue-check.sh`
**Permissions:** Executable (chmod +x)
**API Token:** Secured with current working token

## Script Functionality
- **Connects to Todoist API** using `/api/v1/` endpoint
- **Checks all active tasks** across all projects
- **Identifies overdue items** (due date < current date)
- **Returns color-coded output** with task names and due dates
- **Exit codes:**
  - `0` = No overdue tasks
  - `1` = API connection error
  - `2` = Overdue tasks found

## Current Status (Feb 26, 2026)
**🚨 26 overdue tasks found** (much more than expected)

**Breakdown by category:**
- **CyphrCam features:** 15+ tasks (Dec 2025 - Feb 2026)
- **CyphrCam marketing:** 4 tasks (Nov 2025 - Jan 2026)  
- **Personal tasks:** 7 tasks (various dates)

**Key overdue items needing attention:**
- Transfer Florida expenses (Due: Feb 23 - recent!)
- Tutorial reviews (Due: Jan 28)
- UI improvements (Due: Jan-Feb 2026)
- Feature development (multiple items)

## Heartbeat Integration Options

### Option A: Alert on Any Overdue (Immediate)
**Frequency:** Every heartbeat check (every ~30 min)
**Trigger:** Run script, if exit code = 2, alert Perris
**Pro:** Keeps overdue tasks visible
**Con:** Could be noisy with 26 current overdue items

### Option B: Alert on New/Recent Overdue (Smart)
**Frequency:** Every heartbeat check
**Logic:** Track overdue count, only alert when:
- Count increases (new overdue tasks)
- Tasks overdue by <7 days (urgent attention needed)
**Pro:** Focuses on actionable/recent items
**Con:** More complex logic needed

### Option C: Weekly Summary (Batch)
**Frequency:** Once per week (Sundays)
**Action:** Full overdue task report for weekly review
**Pro:** Less noisy, good for planning
**Con:** Less immediate awareness

## Recommended Approach

**Immediate (This week):** Option B - Smart alerting
- Alert only on newly overdue tasks
- Alert on tasks overdue <7 days
- Weekly summary of all overdue items

**Implementation:**
```bash
# Add to heartbeat rotation
if scripts/todoist-overdue-check.sh > /dev/null 2>&1; then
    # No overdue tasks - continue normal heartbeat
    echo "HEARTBEAT_OK"
else
    # Overdue tasks found - run smart filter
    scripts/todoist-smart-overdue-alert.sh
fi
```

## Action Items for Perris

### Immediate Triage (Next 24-48 hours)
1. **Review 26 overdue tasks** - which are still relevant vs. outdated?
2. **Close obsolete tasks** - features/ideas no longer aligned with launch priorities
3. **Reschedule active tasks** - realistic dates for current development phase
4. **Prioritize urgent items** - Florida expenses, tutorial fixes for App Store launch

### System Optimization
5. **Better task categorization** - separate "ideas" from "commitments"
6. **Realistic scheduling** - avoid over-ambitious due dates
7. **Weekly reviews** - prevent massive overdue backlogs

## Files Created
- `scripts/todoist-overdue-check.sh` - Main checking script ✅
- `todoist-heartbeat-integration.md` - This documentation ✅
- **Next:** `scripts/todoist-smart-overdue-alert.sh` - Smart filtering logic

## Next Steps
1. **Perris:** Triage the 26 overdue tasks (close outdated, reschedule active)
2. **Kiva:** Create smart filtering script for heartbeat integration
3. **Integration:** Add to heartbeat rotation once backlog is manageable
4. **Monitoring:** Track effectiveness and adjust frequency

---
*This integration transforms Todoist from a static task list into an active accountability system that works with Perris's workflow instead of against it.*