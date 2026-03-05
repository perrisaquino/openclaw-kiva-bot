#!/bin/bash

# Apple Calendar Management Script for OpenClaw
# Requires: brew install ical-buddy
# Permissions: System Preferences → Privacy & Security → Calendar → Enable Terminal

set -e

# Configuration
WORK_CALENDARS="Work,perris@5dgrowth.com"
PERSONAL_CALENDARS="Calendar,Family,Home"
ALL_MAIN_CALENDARS="Work,Calendar,perris@5dgrowth.com,Google Calendar"

# Helper function to check if icalBuddy is available
check_icalbuddy() {
    if ! command -v icalBuddy &> /dev/null; then
        echo "Error: icalBuddy not found. Install with: brew install ical-buddy"
        exit 1
    fi
}

# Helper function to format events nicely
format_events() {
    icalBuddy -tf "%H:%M" -df "%a %m/%d" "$@" | sed 's/^• //' | sed '/^$/d'
}

# Main command dispatcher
case "$1" in
    "calendars")
        check_icalbuddy
        echo "=== Available Calendars ==="
        icalBuddy calendars
        ;;
    
    "today")
        check_icalbuddy
        echo "=== Today's Events ==="
        format_events -ic "$ALL_MAIN_CALENDARS" eventsToday
        ;;
    
    "tomorrow")
        check_icalbuddy
        echo "=== Tomorrow's Events ==="
        format_events -ic "$ALL_MAIN_CALENDARS" eventsFrom:tomorrow to:tomorrow
        ;;
    
    "week")
        check_icalbuddy
        echo "=== This Week's Events ==="
        format_events -ic "$ALL_MAIN_CALENDARS" eventsToday+7
        ;;
    
    "work-today")
        check_icalbuddy
        echo "=== Work Events Today ==="
        format_events -ic "$WORK_CALENDARS" eventsToday
        ;;
    
    "work-week")
        check_icalbuddy
        echo "=== Work Events This Week ==="
        format_events -ic "$WORK_CALENDARS" eventsToday+7
        ;;
    
    "next-event")
        check_icalbuddy
        echo "=== Next Upcoming Event ==="
        next_event=$(icalBuddy -ic "$ALL_MAIN_CALENDARS" -tf "%H:%M" -df "%a %m/%d" eventsToday+7 | head -1)
        if [ -n "$next_event" ]; then
            echo "$next_event"
        else
            echo "No upcoming events found"
        fi
        ;;
    
    "daily-summary")
        check_icalbuddy
        echo "=== Daily Schedule Summary ==="
        echo "📅 Today ($(date '+%A, %B %d')):"
        format_events -ic "$ALL_MAIN_CALENDARS" eventsToday
        echo ""
        echo "📋 Tomorrow ($(date -j -v+1d '+%A, %B %d')):"
        format_events -ic "$ALL_MAIN_CALENDARS" eventsFrom:tomorrow to:tomorrow
        ;;
    
    "check-availability")
        if [ -z "$2" ]; then
            echo "Usage: $0 check-availability 'YYYY-MM-DD HH:MM'"
            exit 1
        fi
        check_icalbuddy
        
        # Convert input to date format for checking
        check_date="$2"
        echo "=== Checking availability for $check_date ==="
        
        # Get events for that day
        day_events=$(icalBuddy -ic "$ALL_MAIN_CALENDARS" -tf "%H:%M" eventsOn:"$check_date" 2>/dev/null || echo "")
        
        if [ -z "$day_events" ]; then
            echo "✅ Available - No conflicts found"
        else
            echo "⚠️  Potential conflicts:"
            echo "$day_events"
        fi
        ;;
    
    "free-slots-today")
        check_icalbuddy
        echo "=== Finding Free Time Slots Today ==="
        
        # Get today's events with times
        events_today=$(icalBuddy -ic "$ALL_MAIN_CALENDARS" -tf "%H:%M" eventsToday 2>/dev/null || echo "")
        
        if [ -z "$events_today" ]; then
            echo "✅ Entire day is free!"
        else
            echo "📋 Scheduled events:"
            echo "$events_today"
            echo ""
            echo "💡 Consider scheduling around these times"
        fi
        ;;
    
    "create-quick")
        if [ $# -lt 3 ]; then
            echo "Usage: $0 create-quick 'Event Title' 'YYYY-MM-DD HH:MM' [calendar]"
            echo "Example: $0 create-quick 'Team Meeting' '2024-01-15 14:00' 'Work'"
            exit 1
        fi
        
        title="$2"
        datetime="$3" 
        calendar="${4:-Calendar}"
        
        # Use AppleScript to create event
        osascript << EOF
        tell application "Calendar"
            tell calendar "$calendar"
                set newEvent to make new event with properties {summary:"$title", start date:(date "$datetime")}
            end tell
        end tell
EOF
        echo "✅ Created event: '$title' on $datetime in calendar '$calendar'"
        ;;
    
    "test-permissions")
        echo "=== Testing Calendar Permissions ==="
        
        # Test icalBuddy
        echo "Testing icalBuddy access..."
        if timeout 5 icalBuddy calendars > /dev/null 2>&1; then
            echo "✅ icalBuddy: Working"
        else
            echo "❌ icalBuddy: Failed - Check privacy permissions"
        fi
        
        # Test AppleScript
        echo "Testing AppleScript access..."
        if osascript -e 'tell application "Calendar" to get name of every calendar' > /dev/null 2>&1; then
            echo "✅ AppleScript: Working"
        else
            echo "❌ AppleScript: Failed - Check automation permissions"
        fi
        
        # Test shortcuts
        echo "Testing Shortcuts access..."
        if command -v shortcuts &> /dev/null; then
            echo "✅ Shortcuts: Available"
        else
            echo "❌ Shortcuts: Not available"
        fi
        ;;
    
    "help"|"")
        echo "Apple Calendar Management for OpenClaw"
        echo ""
        echo "VIEWING:"
        echo "  calendars        List all available calendars"
        echo "  today           Show today's events"
        echo "  tomorrow        Show tomorrow's events"  
        echo "  week            Show this week's events"
        echo "  work-today      Show work events today"
        echo "  work-week       Show work events this week"
        echo "  next-event      Show next upcoming event"
        echo "  daily-summary   Complete daily schedule overview"
        echo ""
        echo "SCHEDULING:"
        echo "  check-availability 'YYYY-MM-DD HH:MM'  Check for conflicts"
        echo "  free-slots-today                       Find available time slots"
        echo ""
        echo "CREATING:"
        echo "  create-quick 'Title' 'YYYY-MM-DD HH:MM' [calendar]"
        echo ""
        echo "MAINTENANCE:"
        echo "  test-permissions  Check calendar access permissions"
        echo "  help             Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 today"
        echo "  $0 check-availability '2024-01-15 14:00'"
        echo "  $0 create-quick 'Team Meeting' '2024-01-15 14:00' 'Work'"
        ;;
    
    *)
        echo "Unknown command: $1"
        echo "Run '$0 help' for available commands"
        exit 1
        ;;
esac