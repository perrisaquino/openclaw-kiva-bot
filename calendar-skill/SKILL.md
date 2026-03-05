# Apple Calendar Skill

Manage Apple Calendar events for scheduling automation via icalBuddy CLI and Shortcuts.

## Prerequisites

1. **Install icalBuddy**: `brew install ical-buddy`
2. **Privacy Permissions**: Grant Calendar access to Terminal in System Preferences → Privacy & Security → Calendar
3. **Optional**: Grant Automation permissions if using AppleScript features

## Available Commands

### List Calendars
```bash
./calendar.sh calendars
```

### View Events
```bash
# Today's events
./calendar.sh today

# Tomorrow's events  
./calendar.sh tomorrow

# Next 7 days
./calendar.sh week

# Work calendar only (today)
./calendar.sh work-today

# Custom date range
./calendar.sh events-from "2024-01-15" "2024-01-20"
```

### Create Events
```bash
# Quick event (uses Shortcuts)
./calendar.sh create "Team Meeting" "2024-01-15 14:00" "Work"

# Interactive event creation
./calendar.sh create-interactive
```

### Scheduling Helpers
```bash
# Check availability for a specific time
./calendar.sh check-availability "2024-01-15 14:00" 

# Find free time slots today
./calendar.sh free-slots-today

# Get next upcoming event
./calendar.sh next-event
```

## Integration Examples

### With OpenClaw Heartbeat
Add to `HEARTBEAT.md`:
```markdown
## Calendar Check
- Run `calendar.sh next-event` to check upcoming events
- Alert if event starting within 30 minutes
```

### With Cron Jobs  
```bash
# Daily schedule summary at 8 AM
0 8 * * * /path/to/calendar.sh daily-summary | mail -s "Daily Schedule" user@example.com
```

## Configuration

Edit `calendar-config.sh` to customize:
- Default calendars to check
- Time format preferences
- Notification settings

## Detected Calendars

For Perris's setup:
- **Work** - Primary work calendar
- **Calendar** - Default personal calendar
- **Google Calendar** - External calendar sync
- **perris@5dgrowth.com** - Business email calendar
- **Family, Home** - Personal life calendars
- **Todoist** - Task integration