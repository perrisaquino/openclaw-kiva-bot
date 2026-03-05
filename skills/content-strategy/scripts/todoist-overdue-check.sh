#!/bin/bash
# Todoist Overdue Task Check for Heartbeat Integration
# Created: Feb 26, 2026 - Kiva

TOKEN="a13fd5cea56ee59ca1fad08d82f44b44055b4b58"
API_BASE="https://api.todoist.com/api/v1"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Get current date for comparison
current_date=$(date +%Y-%m-%d)

echo "🔍 Checking Todoist for overdue tasks..."

# Get all active tasks
tasks_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/tasks")

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to Todoist API"
    exit 1
fi

# Parse tasks and check for overdue items
overdue_tasks=$(echo "$tasks_response" | jq -r --arg current_date "$current_date" '
    .results[] | 
    select(.due != null and .due.date < $current_date and .checked == false) |
    "\(.content) (Due: \(.due.date))"
')

overdue_count=$(echo "$overdue_tasks" | grep -c . 2>/dev/null || echo "0")

if [ "$overdue_count" -gt 0 ]; then
    echo -e "${RED}⚠️  Found $overdue_count overdue task(s):${NC}"
    echo "$overdue_tasks" | while read -r task; do
        echo -e "${YELLOW}  • $task${NC}"
    done
    
    # Return non-zero to indicate overdue tasks found
    exit 2
else
    echo -e "${GREEN}✅ No overdue tasks found${NC}"
    exit 0
fi