# Mission Control Server Setup

A lightweight local server that powers your Mission Control dashboard with live data, weather, and persistent storage.

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Make sure you have Node.js installed (v16+)
node --version

# If not installed, get it from: https://nodejs.org/

# Install Express
npm install
```

### Step 2: Start the Server

```bash
# Start the server
npm start

# Or directly with Node
node server.js
```

You should see:
```
🚀 Mission Control Server Started
📡 Server running at: http://localhost:8899
📊 Dashboard: http://localhost:8899
🔌 API Base: http://localhost:8899/mc/
📂 Data files: mc-data.json, mc-activity.json
✨ Ready for Mission Control!
```

### Step 3: Open Mission Control

Open your browser to: **http://localhost:8899**

Your Mission Control dashboard will now be powered by live data!

---

## 🔄 Auto-Start on macOS (Optional)

To automatically start the server when you log in:

```bash
# Run the installer script
./install-launchagent.sh
```

This will:
- Install the service to start automatically on login
- Restart the server if it crashes
- Create log files for monitoring

### Manual LaunchAgent Commands

```bash
# Stop the service
launchctl unload ~/Library/LaunchAgents/com.missioncontrol.server.plist

# Start the service  
launchctl load ~/Library/LaunchAgents/com.missioncontrol.server.plist

# Check if running
launchctl list | grep missioncontrol

# View logs
tail -f mission-control-server.log
```

---

## 🛠 API Endpoints

Your Mission Control dashboard can now fetch live data:

### System Status
```bash
GET http://localhost:8899/mc/status
```
Returns server uptime, health, and connection status.

### Dashboard Data
```bash
# Get all dashboard data
GET http://localhost:8899/mc/data

# Save dashboard data (backup localStorage to server)
POST http://localhost:8899/mc/data
Content-Type: application/json

{
  "priorities": [...],
  "tasks": {...},
  "revenue": {...},
  "notes": "..."
}
```

### Weather Integration
```bash
GET http://localhost:8899/mc/weather?city=San%20Francisco
```
Returns current weather using wttr.in API (no API key required).

### Activity Log
```bash
# Get recent activities
GET http://localhost:8899/mc/activity?limit=50

# Add new activity
POST http://localhost:8899/mc/activity
Content-Type: application/json

{
  "title": "Completed CyphrCam feature",
  "type": "task"
}
```

---

## 📁 File Structure

```
mission-control-server/
├── server.js                          # Main server file
├── package.json                       # Node.js dependencies
├── mission-control.html               # Dashboard frontend
├── com.missioncontrol.server.plist   # LaunchAgent template
├── install-launchagent.sh            # Auto-start installer
├── mc-data.json                      # Dashboard data (auto-created)
├── mc-activity.json                  # Activity log (auto-created)
├── mission-control-server.log        # Server logs (when using LaunchAgent)
└── mission-control-server-error.log  # Error logs (when using LaunchAgent)
```

---

## 🐛 Troubleshooting

### Server Won't Start
- Check if Node.js is installed: `node --version`
- Check if port 8899 is available: `lsof -i :8899`
- Install dependencies: `npm install`

### Dashboard Not Loading
- Verify server is running: `curl http://localhost:8899/mc/status`
- Check browser console for errors
- Ensure `mission-control.html` is in the same directory as `server.js`

### LaunchAgent Issues
```bash
# Check service status
launchctl list | grep missioncontrol

# View service logs
tail -f mission-control-server-error.log

# Reload the service
launchctl unload ~/Library/LaunchAgents/com.missioncontrol.server.plist
launchctl load ~/Library/LaunchAgents/com.missioncontrol.server.plist
```

### Weather API Not Working
- The weather endpoint uses wttr.in (no API key needed)
- Check internet connection
- Try different city names
- Check server logs for API errors

---

## 🔧 Configuration

### Change Port
Edit `server.js` and change the `PORT` variable:
```javascript
const PORT = 8899; // Change to your preferred port
```

### Data Storage
All data is stored in JSON files:
- `mc-data.json` - Main dashboard data
- `mc-activity.json` - Activity log

These files are automatically created and can be manually edited if needed.

### Add Custom Endpoints
Add new API endpoints in `server.js`:
```javascript
app.get('/mc/custom', (req, res) => {
    res.json({ custom: 'data' });
});
```

---

## 🎯 What's Next?

Now your Mission Control dashboard has:
- ✅ **Live data persistence** - Changes save to server
- ✅ **System status monitoring** - Server health and uptime
- ✅ **Weather integration** - Real-time weather data
- ✅ **Activity logging** - Track all dashboard actions
- ✅ **Auto-start capability** - Runs automatically on login
- ✅ **RESTful API** - Extend with custom functionality

Your dashboard is now a proper local application instead of just a static HTML file!

---

## 📞 Support

If you run into issues:
1. Check the logs: `tail -f mission-control-server-error.log`
2. Verify all files are present and `server.js` is executable
3. Ensure Node.js version is 16 or higher
4. Check firewall settings aren't blocking localhost:8899

---

**🎉 Enjoy your powered-up Mission Control dashboard!**