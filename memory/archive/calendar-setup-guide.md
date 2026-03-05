# Apple Calendar Access Setup for OpenClaw

## Overview

This guide documents the best approaches for accessing and managing Apple Calendar events from OpenClaw for Perris's scheduling automation needs.

## Available Approaches

### 1. AppleScript (Recommended for Simple Operations)

**Pros:**
- Native macOS integration
- Direct access to Calendar app
- No additional installations needed
- Can read calendar names and basic info

**Cons:**
- Requires privacy permissions
- Limited by macOS security restrictions
- May need user approval for sensitive operations

**Current Status:** ✅ Working for basic calendar listing
**Permission Status:** ❌ Needs privacy permissions for event access

### 2. icalBuddy CLI Tool (Recommended for Full Access)

**Pros:**
- Powerful command-line interface for calendar operations
- Bypasses some macOS privacy restrictions
- Rich formatting and filtering options
- Can read/write events, tasks, and calendar metadata

**Cons:**
- Requires Homebrew installation
- Learning curve for command syntax

**Installation:** `brew install ical-buddy`
**Current Status:** 🔄 Installing

### 3. Shortcuts Automation

**Pros:**
- Apple's official automation platform
- Can integrate with other apps and services
- User-friendly for complex workflows

**Cons:**
- Requires creating shortcuts manually
- Less flexible for programmatic access

**Current Status:** ✅ Available (shortcuts command found)

### 4. EventKit Framework (Future Consideration)

**Pros:**
- Most comprehensive access to calendar data
- Native iOS/macOS framework

**Cons:**
- Would require Swift/Objective-C wrapper
- Complex implementation

## Current Calendar Setup

Detected calendars:
- Work
- Calendar (default)
- Family
- Home
- Google Calendar
- Mint
- EPIC Investor Event
- perris@5dgrowth.com
- Holidays in United States
- Todoist
- Scheduled Reminders
- Birthdays
- US Holidays
- Siri Suggestions

## Recommended Implementation Strategy

1. **Primary Method: icalBuddy**
   - Use for most calendar operations
   - Reliable command-line interface
   - Good for automation scripts

2. **Fallback Method: AppleScript**
   - Use for operations that require Calendar app interaction
   - Good for creating calendar events that need user interaction

3. **Enhanced Method: Shortcuts**
   - Use for complex workflows
   - Integration with other Apple services

## Next Steps

1. Complete icalBuddy installation
2. Test basic calendar operations
3. Handle privacy permissions
4. Create OpenClaw skill wrapper
5. Test automation workflows

## Privacy Permissions Required

- **Calendar Access**: Required for all methods
- **Automation Permissions**: May be needed for AppleScript
- **Accessibility Permissions**: Potentially needed for some operations
