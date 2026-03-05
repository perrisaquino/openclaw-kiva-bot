#!/bin/bash

# Apple Calendar Configuration for Perris
# Customize these settings based on preferences

# Calendar Groups
export WORK_CALENDARS="Work,perris@5dgrowth.com,EPIC Investor Event"
export PERSONAL_CALENDARS="Calendar,Family,Home"
export EXTERNAL_CALENDARS="Google Calendar,Todoist"
export ALL_MAIN_CALENDARS="Work,Calendar,perris@5dgrowth.com,Google Calendar"

# Time Formatting
export TIME_FORMAT="%H:%M"          # 24-hour format
export DATE_FORMAT="%a %m/%d"       # Day MM/DD format
export FULL_DATE_FORMAT="%A, %B %d, %Y"

# Notification Settings
export NOTIFY_BEFORE_MINUTES=30     # Alert X minutes before events
export DAILY_SUMMARY_TIME="08:00"   # When to send daily summary

# Default Calendar for New Events
export DEFAULT_CALENDAR="Work"

# Integration Settings
export INCLUDE_ALL_DAY_EVENTS=false
export INCLUDE_DECLINED_EVENTS=false
export MAX_EVENTS_DISPLAY=10

# Automation Preferences
export AUTO_HEARTBEAT_CHECK=true
export HEARTBEAT_CALENDARS="$WORK_CALENDARS"