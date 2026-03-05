#!/bin/bash

# Quick Capture Task Extraction and Todoist Sync
# Scans reflection files for tasks and syncs with Master To-Do Hub and Todoist

QUICK_CAPTURES_DIR="/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily/Quick Captures"
MASTER_HUB="$QUICK_CAPTURES_DIR/📋 MASTER TO-DO HUB.md"
TODOIST_API_TOKEN="a13fd5cea56ee59ca1fad08d82f44b44055b4b58"
TODOIST_PROJECT_NAME="Quick Captures"

echo "🔄 Extracting tasks from Quick Capture reflections..."

# Get reflection files from last 24 hours
find "$QUICK_CAPTURES_DIR" -name "2026-*.md" -mtime -1 | while read -r file; do
    if [[ "$file" == *"TEMPLATE"* ]] || [[ "$file" == *"📋"* ]] || [[ "$file" == *"📝"* ]]; then
        continue
    fi
    
    echo "📝 Processing: $(basename "$file")"
    
    # Extract unchecked tasks from ✅ To-Do List section
    awk '/^## ✅ To-Do List/,/^## / {
        if (/^- \[ \]/) {
            gsub(/^- \[ \] /, "")
            print $0
        }
    }' "$file" > /tmp/extracted_tasks.txt
    
    if [[ -s /tmp/extracted_tasks.txt ]]; then
        echo "Found new tasks:"
        cat /tmp/extracted_tasks.txt
        
        # Add tasks to Master Hub (this would need more sophisticated merging)
        echo "Adding to Master Hub..."
        
        # Push high-priority tasks to Todoist
        while read -r task; do
            if [[ "$task" =~ (urgent|critical|important|deadline) ]]; then
                echo "🔥 Pushing high-priority task to Todoist: $task"
                curl -X POST https://api.todoist.com/api/v1/tasks \
                    -H "Authorization: Bearer $TODOIST_API_TOKEN" \
                    -H "Content-Type: application/json" \
                    -d "{\"content\": \"$task\", \"labels\": [\"@quick_capture\"]}" \
                    2>/dev/null
            fi
        done < /tmp/extracted_tasks.txt
    fi
done

echo "✅ Task extraction complete"