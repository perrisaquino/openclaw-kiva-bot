#!/bin/bash

# Mission Control Server Starter Script
# Simple way to start the server with proper setup

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Mission Control Server...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install it from: https://nodejs.org/${NC}"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start the server
echo -e "${GREEN}✅ Starting Mission Control Server on port 8899...${NC}"
echo -e "${BLUE}🌐 Dashboard will be available at: http://localhost:8899${NC}"
echo -e "${BLUE}🛑 Press Ctrl+C to stop the server${NC}"
echo ""

node server.js