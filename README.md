# Mission Control Server

🎯 **Lightweight local server that powers your Mission Control dashboard with live data**

## Quick Start

```bash
# Install dependencies
npm install

# Start server (easiest way)
./start.sh

# Or start manually
node server.js
```

**Dashboard:** http://localhost:8899

## Auto-Start on Login (macOS)

```bash
./install-launchagent.sh
```

Your Mission Control will start automatically when you log in and restart if it crashes.

## What You Get

- ✅ **Live Data Sync** - Dashboard changes persist to server
- ✅ **Weather Integration** - Real-time weather in dashboard  
- ✅ **Activity Logging** - Track all actions and changes
- ✅ **RESTful API** - `/mc/status`, `/mc/data`, `/mc/weather`, `/mc/activity`
- ✅ **Auto-Start** - Runs on login (optional)
- ✅ **No External Dependencies** - Everything runs locally

## API Endpoints

- `GET /mc/status` - Server health and uptime
- `GET /mc/data` - Load dashboard data
- `POST /mc/data` - Save dashboard data  
- `GET /mc/weather?city=...` - Current weather
- `GET /mc/activity` - Recent activity log
- `POST /mc/activity` - Add activity entry

## Files

- `server.js` - Main server (Node.js + Express)
- `mission-control.html` - Dashboard frontend
- `mc-data.json` - Persistent data storage (auto-created)
- `mc-activity.json` - Activity log (auto-created)

## Troubleshooting

- **Port 8899 in use?** Change `PORT` in `server.js`
- **Dashboard not loading?** Check `mission-control.html` is in same directory
- **Service won't auto-start?** Check LaunchAgent logs in server directory

Full setup guide: **[SETUP.md](SETUP.md)**

---

**🎉 Your Mission Control is now powered by live data instead of just localStorage!**