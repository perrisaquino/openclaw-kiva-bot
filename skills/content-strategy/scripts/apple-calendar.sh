#!/bin/bash
# Apple Calendar CLI Interface
# Usage: ./apple-calendar.sh <command> [args...]

set -euo pipefail

function show_help() {
    cat << EOF
Apple Calendar CLI Interface

Commands:
  list-calendars                          List all available calendars
  list-events <calendar> [days-ahead]     List upcoming events (default: 7 days)
  create-event <calendar> <title> <start> <end> [description]
                                         Create a new event (times in YYYY-MM-DD HH:MM format)
  today-events                           Show today's events across all calendars
  this-week                             Show this week's events across all calendars

Examples:
  ./apple-calendar.sh list-calendars
  ./apple-calendar.sh list-events "Work" 14
  ./apple-calendar.sh create-event "Work" "Team Meeting" "2026-02-25 15:00" "2026-02-25 16:00" "Weekly sync"
  ./apple-calendar.sh today-events
  ./apple-calendar.sh this-week
EOF
}

function list_calendars() {
    osascript -e 'tell application "Calendar" to get name of calendars' | tr ',' '\n' | sed 's/^[[:space:]]*//' | sort
}

function list_events() {
    local calendar="$1"
    local days_ahead="${2:-7}"
    local end_date=$(date -v+"${days_ahead}d" "+%Y-%m-%d")
    
    osascript << EOF
tell application "Calendar"
    set targetCalendar to calendar "$calendar"
    set endDate to date "$end_date 23:59:59"
    set eventList to events of targetCalendar whose start date is greater than (current date) and start date is less than endDate
    
    set output to ""
    repeat with anEvent in eventList
        set eventStart to start date of anEvent
        set eventEnd to end date of anEvent
        set eventSummary to summary of anEvent
        set startStr to (eventStart as string)
        set endStr to (eventEnd as string)
        set output to output & eventSummary & " | " & startStr & " - " & endStr & "\n"
    end repeat
    
    return output
end tell
EOF
}

function create_event() {
    local calendar="$1"
    local title="$2"
    local start_time="$3"
    local end_time="$4"
    local description="${5:-}"
    
    # Convert YYYY-MM-DD HH:MM to AppleScript date format
    local start_date=$(date -j -f "%Y-%m-%d %H:%M" "$start_time" "+%m/%d/%Y %I:%M:%S %p")
    local end_date=$(date -j -f "%Y-%m-%d %H:%M" "$end_time" "+%m/%d/%Y %I:%M:%S %p")
    
    osascript << EOF
tell application "Calendar"
    tell calendar "$calendar"
        set newEvent to make new event at end with properties {summary:"$title", start date:date "$start_date", end date:date "$end_date", description:"$description"}
    end tell
    return "Event created: " & summary of newEvent
end tell
EOF
}

function today_events() {
    local today=$(date "+%Y-%m-%d")
    local tomorrow=$(date -v+1d "+%Y-%m-%d")
    
    osascript << EOF
tell application "Calendar"
    set todayStart to date "$today 00:00:00"
    set todayEnd to date "$tomorrow 00:00:00"
    
    set allEvents to {}
    repeat with cal in calendars
        set calEvents to events of cal whose start date is greater than or equal to todayStart and start date is less than todayEnd
        repeat with anEvent in calEvents
            set end of allEvents to anEvent
        end repeat
    end repeat
    
    set output to "TODAY'S EVENTS (" & (count of allEvents) & "):\n"
    repeat with anEvent in allEvents
        set eventStart to start date of anEvent
        set eventSummary to summary of anEvent
        set calName to name of calendar of anEvent
        set timeStr to time string of eventStart
        set output to output & timeStr & " - " & eventSummary & " (" & calName & ")\n"
    end repeat
    
    return output
end tell
EOF
}

function this_week() {
    local week_end=$(date -v+7d "+%Y-%m-%d")
    
    osascript << EOF
tell application "Calendar"
    set weekStart to current date
    set weekEnd to date "$week_end 23:59:59"
    
    set allEvents to {}
    repeat with cal in calendars
        set calEvents to events of cal whose start date is greater than or equal to weekStart and start date is less than or equal to weekEnd
        repeat with anEvent in calEvents
            set end of allEvents to anEvent
        end repeat
    end repeat
    
    set output to "THIS WEEK'S EVENTS (" & (count of allEvents) & "):\n\n"
    repeat with anEvent in allEvents
        set eventStart to start date of anEvent
        set eventSummary to summary of anEvent
        set calName to name of calendar of anEvent
        set dateStr to date string of eventStart
        set timeStr to time string of eventStart
        set output to output & dateStr & " " & timeStr & " - " & eventSummary & " (" & calName & ")\n"
    end repeat
    
    return output
end tell
EOF
}

# Main command handling
case "${1:-}" in
    list-calendars)
        list_calendars
        ;;
    list-events)
        if [ $# -lt 2 ]; then
            echo "Usage: list-events <calendar> [days-ahead]"
            exit 1
        fi
        list_events "$2" "${3:-7}"
        ;;
    create-event)
        if [ $# -lt 5 ]; then
            echo "Usage: create-event <calendar> <title> <start> <end> [description]"
            exit 1
        fi
        create_event "$2" "$3" "$4" "$5" "${6:-}"
        ;;
    today-events)
        today_events
        ;;
    this-week)
        this_week
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: ${1:-}"
        show_help
        exit 1
        ;;
esac