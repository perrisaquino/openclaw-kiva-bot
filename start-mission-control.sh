#!/bin/bash

# Mission Control Complete Startup Script
# Starts server, API tracking, and failover management together

set -e

echo "🚀 Starting Mission Control with Full AI Monitoring..."
echo "=================================================="

# Check if running in the right directory
if [[ ! -f "server.js" ]]; then
    echo "❌ Error: Please run this script from the Mission Control directory"
    echo "   (The directory containing server.js)"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "   Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔌 Features that will be available:"
echo "   • Mission Control Dashboard (http://localhost:8899)"
echo "   • Real AI API call interception and cost tracking"
echo "   • Intelligent failover when rate limits hit"
echo "   • Automatic recovery to preferred models"
echo "   • Business Advisory Council with 8 expert AIs"
echo "   • Revenue tracking, competitive intel, security monitoring"
echo ""

# Start the server
echo "🖥️  Starting Mission Control server..."
node server.js &
SERVER_PID=$!

# Give server time to start
sleep 3

# Check if server started successfully
if ! curl -s http://localhost:8899/mc/status > /dev/null 2>&1; then
    echo "❌ Failed to start Mission Control server"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Mission Control server started successfully!"
echo "📊 Dashboard: http://localhost:8899"

# Wait a moment, then open dashboard
sleep 2

echo ""
echo "🔥 NEXT STEPS:"
echo "=============="
echo "1. 🌐 Dashboard will open in your browser"
echo "2. 🔌 Go to Usage & Costs tab → click 'Start Real Tracking'"
echo "3. 🔄 Click 'Initialize' in the API Failover Manager"
echo "4. 🧪 Test failover with the 'Test' button"
echo ""
echo "🎯 FEATURES READY TO USE:"
echo "• Real AI cost tracking (no more demo data!)"
echo "• Automatic model failover (Opus → Sonnet → GPT)"
echo "• Business Advisory Council (8 expert AIs)"
echo "• Revenue tracking and competitive intelligence"
echo ""
echo "💡 Once initialized, you'll never hit rate limits again!"
echo "   The system automatically switches between AI providers"
echo "   and reverts to your preferred models when available."
echo ""

# Try to open in browser
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:8899
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8899
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:8899
else
    echo "🌐 Open your browser and go to: http://localhost:8899"
fi

echo ""
echo "📱 Mission Control is running!"
echo "   Server PID: $SERVER_PID"
echo "   Press Ctrl+C to stop all services"
echo ""

# Handle shutdown gracefully
trap 'echo "🛑 Shutting down Mission Control..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

# Keep script running
wait $SERVER_PID