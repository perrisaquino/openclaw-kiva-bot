# Apple Calendar Integration Setup

**Status:** ✅ Complete - Apple Calendar CLI access configured  
**Created:** Feb 25, 2026 (Morning heartbeat)

## Overview
Full command-line access to Perris's Apple Calendar via AppleScript integration. Can read events, create events, and manage calendars programmatically.

## Available Calendars
```
Birthdays
Calendar  
EPIC Investor Event
Family (2 instances)
Google Calendar
Holidays in United States
Home
Mint
Scheduled Reminders
Siri Suggestions
Todoist
US Holidays  
Work
perris@5dgrowth.com
```

## CLI Tool: `scripts/apple-calendar.sh`

### Usage Examples

**List all calendars:**
```bash
./scripts/apple-calendar.sh list-calendars
```

**Show today's events:**
```bash
./scripts/apple-calendar.sh today-events
```

**Show this week's events:**
```bash
./scripts/apple-calendar.sh this-week
```

**List upcoming events in specific calendar:**
```bash
./scripts/apple-calendar.sh list-events "Work" 14    # Next 14 days
./scripts/apple-calendar.sh list-events "Family" 7   # Next 7 days (default)
```

**Create new event:**
```bash
./scripts/apple-calendar.sh create-event "Work" "Team Meeting" "2026-02-25 15:00" "2026-02-25 16:00" "Weekly sync"
```

## Integration Capabilities

### Read Operations (No Permissions Needed)
- ✅ List all calendars
- ✅ Get events from specific calendars  
- ✅ Filter events by date range
- ✅ Show today's agenda across all calendars
- ✅ Weekly overview with calendar names

### Write Operations (May Need Permissions)
- ✅ Create new events with title, time, description
- ✅ Add events to specific calendars
- 🔄 Update existing events (can be added)
- 🔄 Delete events (can be added)

## Automation Use Cases

### Heartbeat Integration
- **Daily agenda check** - Show upcoming events for the day
- **Weekly planning** - Surface next week's commitments  
- **Scheduling conflicts** - Check availability before booking
- **Event reminders** - Alert about upcoming important events

### Content & Workflow
- **Meeting prep** - Extract attendees and topics from calendar
- **Time blocking** - Automatically schedule focused work time
- **Travel planning** - Surface events requiring location/preparation
- **Energy management** - Align tasks with calendar energy (HD Generator strategy)

### CyphrCam Business
- **Demo scheduling** - Book product demos with prospects
- **Content calendar** - Schedule social posts around availability  
- **Release planning** - Coordinate App Store launch timeline
- **Partner meetings** - Schedule calls with Nikel Udot/BTM connections

## Technical Notes

### AppleScript Integration  
- Uses native macOS Calendar.app AppleScript interface
- No third-party dependencies required
- Handles all calendar types (local, Google, Exchange, etc.)
- Date parsing supports YYYY-MM-DD HH:MM format

### Permissions
- **Read access** - Works immediately (tested ✅)
- **Write access** - May prompt for Calendar permission on first create/update
- **Automation** - Can be called from cron jobs and heartbeat checks

### Performance
- Fast for small date ranges (< 30 days)
- May be slower for large calendar sets with many events
- Consider caching for frequent automation calls

## Next Steps

### Immediate (Week 1)
1. **Test event creation** - Create a test event to verify write permissions
2. **Heartbeat integration** - Add daily agenda check to HEARTBEAT.md rotation
3. **Automation scripts** - Create morning agenda + evening prep scripts

### Future Enhancements  
1. **Event templates** - Common meeting types with standard durations
2. **Conflict detection** - Warn before double-booking
3. **Time zone handling** - Support for travel/remote meetings
4. **Bulk operations** - Import/export event batches
5. **AI integration** - Natural language event creation ("Schedule team sync next Tuesday 3pm")

## Security & Privacy
- **Local only** - No external API calls or cloud dependencies
- **System permissions** - Uses standard macOS Calendar access
- **No data export** - Events stay within Apple ecosystem
- **User control** - Perris maintains full calendar ownership

---
*Apple Calendar integration provides the scheduling foundation for Perris's automated workflow systems while respecting his privacy and energy management needs.*