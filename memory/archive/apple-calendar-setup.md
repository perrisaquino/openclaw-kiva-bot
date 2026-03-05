# Apple Calendar Integration for OpenClaw

## Executive Summary

After testing multiple approaches, here's the recommended setup for Apple Calendar access in OpenClaw:

1. **Primary Method**: icalBuddy CLI tool (installed ✅)
2. **Secondary Method**: Shortcuts for complex workflows
3. **Fallback Method**: AppleScript for basic operations

## Privacy Permissions Setup

⚠️ **IMPORTANT**: All calendar access methods require explicit macOS privacy permissions.

### Step 1: Grant Calendar Access Permissions

1. Open **System Preferences** → **Privacy & Security** → **Calendar**
2. Add and enable the following applications:
   - **Terminal** (for icalBuddy commands)
   - **OpenClaw** (if running as app)
   - **Script Editor** (for AppleScript testing)

### Step 2: Grant Automation Permissions (if needed)

1. **System Preferences** → **Privacy & Security** → **Automation**
2. Enable access for Terminal/OpenClaw to control Calendar app

## Method 1: icalBuddy CLI (Recommended)

### Installation
```bash
brew install ical-buddy
```

### Basic Usage Examples
```bash
# List all calendars
icalBuddy calendars

# Get today's events
icalBuddy eventsToday

# Get this week's events
icalBuddy eventsToday+7

# Get events from specific calendar
icalBuddy -ic "Work" eventsToday+7

# Get events with custom formatting
icalBuddy -f -tf "%H:%M" -df "%Y-%m-%d" eventsToday+3

# Get upcoming events (next 24 hours)
icalBuddy -ic "Work,Calendar" -tf "%H:%M" -df "%a %m/%d" eventsToday+1
```

### Advanced Features
```bash
# Include completed tasks
icalBuddy -c tasksDueBefore:today+1

# Exclude all-day events
icalBuddy -eep location,notes eventsToday

# Custom separators and formatting
icalBuddy -ps "| |" -po "title,datetime" eventsToday
```

## Method 2: Shortcuts Integration

### Create Calendar Shortcuts

1. Open **Shortcuts** app
2. Create new shortcuts for common operations:

**Get Today's Events**
```
Input: None
Actions: 
- Find Events (Calendar = All, Date = Today)
- Text (Format events)
Output: Text
```

**Add Calendar Event**
```
Input: Text (Event details)
Actions:
- Add New Event
- Ask for Input (Title, Date, Time)
Output: Event created
```

### Command Line Usage
```bash
# Run existing shortcut
shortcuts run "Start My Next Meeting"

# Run with input
echo "Meeting with team" | shortcuts run "Add Quick Event"
```

## Method 3: AppleScript Fallback

### Basic AppleScript Commands
```applescript
# Get calendar names
osascript -e 'tell application "Calendar" to get name of every calendar'

# Create new event (requires user approval)
osascript -e 'tell application "Calendar"
    tell calendar "Work"
        make new event with properties {summary:"Test Event", start date:(current date)}
    end tell
end tell'
```

## OpenClaw Skill Implementation

### Create Calendar Skill Directory
```bash
mkdir -p ~/.openclaw/skills/calendar
cd ~/.openclaw/skills/calendar
```

### Basic Calendar Wrapper Script
```bash
#!/bin/bash
# calendar-wrapper.sh

case "$1" in
    "list-calendars")
        icalBuddy calendars
        ;;
    "today")
        icalBuddy -tf "%H:%M" -df "%a %m/%d" eventsToday
        ;;
    "tomorrow") 
        icalBuddy -tf "%H:%M" -df "%a %m/%d" eventsToday+1
        ;;
    "week")
        icalBuddy -tf "%H:%M" -df "%a %m/%d" eventsToday+7
        ;;
    "work-today")
        icalBuddy -ic "Work" -tf "%H:%M" eventsToday
        ;;
    *)
        echo "Usage: calendar-wrapper.sh [list-calendars|today|tomorrow|week|work-today]"
        ;;
esac
```

## Troubleshooting

### Common Issues

1. **"Calendar got an error: Can't get every event"**
   - Solution: Grant Calendar privacy permissions in System Preferences

2. **icalBuddy hangs or doesn't respond**
   - Solution: Check privacy permissions for Terminal
   - Run: `icalBuddy -h` to verify installation

3. **Shortcuts not found**
   - Solution: Create shortcuts manually in Shortcuts app first

### Testing Commands
```bash
# Test basic access
icalBuddy -V

# Test calendar listing (should not hang with proper permissions)
timeout 10 icalBuddy calendars

# Test AppleScript access
osascript -e 'tell application "Calendar" to get name of every calendar'
```

## Recommended Automation Workflows

### Daily Schedule Check
```bash
#!/bin/bash
# daily-schedule.sh

echo "=== TODAY'S SCHEDULE ==="
icalBuddy -tf "%H:%M" -df "%a %m/%d" eventsToday

echo -e "\n=== TOMORROW'S SCHEDULE ==="
icalBuddy -tf "%H:%M" -df "%a %m/%d" eventsFrom:tomorrow to:tomorrow
```

### Work Calendar Focus
```bash
#!/bin/bash
# work-focus.sh

echo "=== WORK EVENTS TODAY ==="
icalBuddy -ic "Work,perris@5dgrowth.com" -tf "%H:%M" eventsToday

echo -e "\n=== UPCOMING WORK EVENTS ==="
icalBuddy -ic "Work,perris@5dgrowth.com" -tf "%H:%M" -df "%m/%d" eventsToday+3
```

## Next Steps

1. **Test Privacy Permissions**: Run the testing commands above
2. **Create OpenClaw Skill**: Implement the wrapper scripts
3. **Build Automation**: Integrate with Perris's scheduling needs
4. **Test Workflows**: Validate calendar access and event creation

## Available Calendars for Perris

Based on the detected calendar setup:
- **Primary**: Work, Calendar (default)
- **Personal**: Family, Home
- **External**: Google Calendar, perris@5dgrowth.com
- **Automated**: Todoist, Scheduled Reminders
- **Reference**: US Holidays, Birthdays, Siri Suggestions

The system is ready for calendar automation once privacy permissions are configured.