#!/bin/bash

echo "📱 Starting Mobile Mission Control..."

# Kill any existing server
pkill -f "node server.js" 2>/dev/null

# Start server with mobile endpoints
cd "/Users/iamperris/.openclaw/workspace"
node server.js &

SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Open mobile interface
echo "🌐 Opening mobile interface..."
open "http://localhost:8899/mission-control-mobile.html"

echo "📱 Mobile Mission Control started!"
echo "📊 Server PID: $SERVER_PID"
echo "🌐 Mobile URL: http://localhost:8899/mission-control-mobile.html"
echo "🖥️ Desktop URL: http://localhost:8899/mission-control.html"
echo ""
echo "💡 To stop: kill $SERVER_PID"