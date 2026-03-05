# Todoist Inbox Cleanup Plan

**Status:** ⚠️ API Access Needed - Current token appears outdated  
**Created:** Feb 25, 2026 (Morning heartbeat)

## Current Problem
- 72+ stale tasks from 2024-2025 sitting in inbox  
- Dead projects never archived: Blog Growth Engine, Hybrid Human, Second Brain Lead Magnet
- API token in TOOLS.md appears outdated (getting deprecation errors)

## API Access Fix Required

### Step 1: Get Updated Todoist API Access
Current token: `a13fd5cea56ee59ca1fad08d82f44b44055b4b58` (failing)

**Options:**
1. **Personal Access Token** (recommended)
   - Go to Todoist Settings → Integrations → Developer tab
   - Generate new API token
   - Update TOOLS.md with new token

2. **OAuth App** (for advanced automation)
   - Create Todoist app if building workflows
   - More complex but better for production automation

### Step 2: Verify API Access
```bash
# Test new token
curl -s -H "Authorization: Bearer NEW_TOKEN_HERE" \
  https://api.todoist.com/rest/v2/projects | jq '.[] | {id: .id, name: .name}'
```

## Cleanup Strategy (Once API Access Fixed)

### Phase 1: Project Audit & Archive
**Dead projects to archive:**
- Blog Growth Engine
- Hybrid Human  
- Second Brain Lead Magnet
- Any other 2024 projects no longer relevant

**Keep active:**
- CyphrCam
- Personal tasks
- Current business projects

### Phase 2: Task Triage
**Bulk close stale tasks (2024-2025):**
- Review tasks older than 3 months
- Close anything no longer relevant
- Migrate important items to current projects

**Organize remaining:**
- Assign to proper projects
- Add due dates where appropriate
- Priority labels (P1-P4)

### Phase 3: Maintenance System
**Daily inbox zero workflow:**
1. Process new tasks immediately
2. Assign to projects or schedule
3. Set context labels (@computer, @calls, @errands)
4. Weekly review of overdue items

## Manual Cleanup (Immediate Option)

If API fix takes time, Perris can manually:

1. **Open Todoist app/web**
2. **Archive dead projects:**
   - Blog Growth Engine → Settings → Archive
   - Hybrid Human → Settings → Archive  
   - Second Brain Lead Magnet → Settings → Archive

3. **Bulk select old tasks:**
   - Filter by date: "created before: 2026-01-01"
   - Select all irrelevant items
   - Bulk delete or complete

4. **Reorganize remaining:**
   - Move CyphrCam tasks to CyphrCam project
   - Set due dates for time-sensitive items
   - Add context labels

## Automated Cleanup Script (Post-API Fix)

```bash
#!/bin/bash
# todoist-cleanup.sh - Run after API access restored

TOKEN="NEW_TOKEN_HERE"
API_BASE="https://api.todoist.com/rest/v2"

# 1. Get all projects
projects=$(curl -s -H "Authorization: Bearer $TOKEN" $API_BASE/projects)

# 2. Archive dead projects
echo "Archiving dead projects..."
dead_projects=("Blog Growth Engine" "Hybrid Human" "Second Brain Lead Magnet")

for project_name in "${dead_projects[@]}"; do
    project_id=$(echo "$projects" | jq -r ".[] | select(.name == \"$project_name\") | .id")
    if [ "$project_id" != "null" ]; then
        curl -s -X POST -H "Authorization: Bearer $TOKEN" \
             -H "Content-Type: application/json" \
             "$API_BASE/projects/$project_id/close"
        echo "Archived: $project_name"
    fi
done

# 3. Get stale tasks (older than 3 months)
cutoff_date=$(date -v-3m "+%Y-%m-%d")
stale_tasks=$(curl -s -H "Authorization: Bearer $TOKEN" \
              "$API_BASE/tasks?created_before=$cutoff_date")

# 4. Bulk close irrelevant tasks
echo "$stale_tasks" | jq -r '.[] | .id' | while read task_id; do
    curl -s -X POST -H "Authorization: Bearer $TOKEN" \
         "$API_BASE/tasks/$task_id/close"
done

echo "Cleanup complete!"
```

## Success Metrics
- **Inbox zero** - No overdue/stale tasks
- **Active projects only** - Archive completed/cancelled projects  
- **Organized tasks** - Everything properly categorized
- **Maintenance rhythm** - Daily processing workflow

## Integration with Kiva Workflow
Once cleaned up, integrate Todoist with:
- **Heartbeat checks** - Monitor overdue tasks
- **Calendar integration** - Sync deadlines with Apple Calendar  
- **Content planning** - Task creation from content ideas
- **CyphrCam milestones** - Track development progress

## Next Steps
1. **Perris:** Generate new Todoist API token
2. **Kiva:** Update TOOLS.md with new token  
3. **Execute:** Run automated cleanup script
4. **Maintain:** Add Todoist check to heartbeat rotation

---
*This cleanup will restore Perris's Todoist to an actionable state aligned with current 2026 priorities, supporting the CyphrCam launch and autonomous engine goals.*