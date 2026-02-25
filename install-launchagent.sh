#!/bin/bash

# Mission Control Server LaunchAgent Installer
# This script installs the auto-start service for macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Mission Control Server LaunchAgent Installer${NC}"
echo ""

# Get current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLIST_NAME="com.missioncontrol.server.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_TEMPLATE="$CURRENT_DIR/$PLIST_NAME"
PLIST_DESTINATION="$LAUNCH_AGENTS_DIR/$PLIST_NAME"

echo -e "📂 Server directory: ${YELLOW}$CURRENT_DIR${NC}"
echo -e "📄 LaunchAgent will be installed to: ${YELLOW}$PLIST_DESTINATION${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

NODE_PATH=$(which node)
echo -e "✅ Found Node.js at: ${GREEN}$NODE_PATH${NC}"

# Check if server.js exists
if [ ! -f "$CURRENT_DIR/server.js" ]; then
    echo -e "${RED}❌ Error: server.js not found in current directory${NC}"
    exit 1
fi

echo -e "✅ Found server.js"

# Create LaunchAgents directory if it doesn't exist
if [ ! -d "$LAUNCH_AGENTS_DIR" ]; then
    echo -e "${YELLOW}📁 Creating LaunchAgents directory...${NC}"
    mkdir -p "$LAUNCH_AGENTS_DIR"
fi

# Stop existing service if running
if launchctl list | grep -q "com.missioncontrol.server"; then
    echo -e "${YELLOW}🛑 Stopping existing Mission Control Server service...${NC}"
    launchctl unload "$PLIST_DESTINATION" 2>/dev/null || true
fi

# Create the plist file with correct paths
echo -e "${BLUE}📝 Creating LaunchAgent plist file...${NC}"
sed "s|__SERVER_PATH__|$CURRENT_DIR|g; s|/usr/local/bin/node|$NODE_PATH|g" "$PLIST_TEMPLATE" > "$PLIST_DESTINATION"

# Set correct permissions
chmod 644 "$PLIST_DESTINATION"

# Load the service
echo -e "${BLUE}🔄 Loading Mission Control Server service...${NC}"
launchctl load "$PLIST_DESTINATION"

# Check if service started successfully
sleep 2
if launchctl list | grep -q "com.missioncontrol.server"; then
    echo -e "${GREEN}✅ Mission Control Server service installed and started successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Service Details:${NC}"
    echo -e "   • Service name: com.missioncontrol.server"
    echo -e "   • Auto-start: ✅ Yes (on login)"
    echo -e "   • Auto-restart: ✅ Yes (if crashed)"
    echo -e "   • Dashboard URL: http://localhost:8899"
    echo -e "   • Logs: $CURRENT_DIR/mission-control-server.log"
    echo -e "   • Error logs: $CURRENT_DIR/mission-control-server-error.log"
    echo ""
    echo -e "${GREEN}🎉 Setup complete! Your Mission Control Server will start automatically on login.${NC}"
    echo ""
    echo -e "${BLUE}📋 Management Commands:${NC}"
    echo -e "   • Stop service:    ${YELLOW}launchctl unload $PLIST_DESTINATION${NC}"
    echo -e "   • Start service:   ${YELLOW}launchctl load $PLIST_DESTINATION${NC}"
    echo -e "   • Check status:    ${YELLOW}launchctl list | grep missioncontrol${NC}"
    echo -e "   • View logs:       ${YELLOW}tail -f $CURRENT_DIR/mission-control-server.log${NC}"
    echo ""
    echo -e "🌐 Opening Mission Control Dashboard in 3 seconds..."
    sleep 3
    open "http://localhost:8899"
else
    echo -e "${RED}❌ Error: Service failed to start${NC}"
    echo "Check the logs for details:"
    echo "  tail $CURRENT_DIR/mission-control-server-error.log"
    exit 1
fi