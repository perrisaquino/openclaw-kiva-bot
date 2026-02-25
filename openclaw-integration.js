#!/usr/bin/env node

// OpenClaw Integration Script
// Automatically starts API interceptor when OpenClaw starts

const { startAPIInterception } = require('./api-interceptor');
const path = require('path');
const fs = require('fs');

class OpenClawIntegration {
    constructor() {
        this.openclawPaths = [
            '/usr/local/bin/openclaw',
            '/usr/bin/openclaw',
            path.join(process.env.HOME, '.npm-global/bin/openclaw'),
            path.join(process.env.HOME, '.local/bin/openclaw'),
            'openclaw' // In PATH
        ];
        this.missionControlUrl = 'http://localhost:8899';
    }

    // Find OpenClaw installation
    findOpenClawPath() {
        for (const openclawPath of this.openclawPaths) {
            try {
                if (fs.existsSync(openclawPath)) {
                    return openclawPath;
                }
            } catch (error) {
                // Continue searching
            }
        }
        return null;
    }

    // Check if OpenClaw is running
    isOpenClawRunning() {
        return new Promise((resolve) => {
            const { spawn } = require('child_process');
            const ps = spawn('ps', ['aux']);
            let output = '';

            ps.stdout.on('data', (data) => {
                output += data.toString();
            });

            ps.on('close', () => {
                const isRunning = output.includes('openclaw') && 
                                output.includes('gateway') || 
                                output.includes('node') && output.includes('openclaw');
                resolve(isRunning);
            });
        });
    }

    // Start API interception if OpenClaw is running
    async startInterceptionIfNeeded() {
        try {
            console.log('🔍 Checking if OpenClaw is running...');
            
            const isRunning = await this.isOpenClawRunning();
            
            if (isRunning) {
                console.log('✅ OpenClaw detected - starting API interception...');
                startAPIInterception(this.missionControlUrl);
                console.log('🔌 API interception active for OpenClaw');
                return true;
            } else {
                console.log('⚠️  OpenClaw not detected - API interception not started');
                console.log('   Start OpenClaw first, then run this script');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error checking OpenClaw status:', error);
            return false;
        }
    }

    // Create startup script
    createStartupScript() {
        const scriptPath = path.join(__dirname, 'start-with-openclaw.sh');
        const scriptContent = `#!/bin/bash

# OpenClaw + Mission Control Auto-Start Script
# Starts OpenClaw gateway and API interceptor together

set -e

echo "🚀 Starting OpenClaw with Mission Control API Tracking..."

# Check if Mission Control server is running
if ! curl -s http://localhost:8899/mc/status > /dev/null 2>&1; then
    echo "📡 Starting Mission Control server..."
    node "${__dirname}/server.js" &
    MISSION_CONTROL_PID=$!
    
    # Wait for server to start
    sleep 3
    
    if ! curl -s http://localhost:8899/mc/status > /dev/null 2>&1; then
        echo "❌ Failed to start Mission Control server"
        exit 1
    fi
    
    echo "✅ Mission Control server started (PID: $MISSION_CONTROL_PID)"
fi

# Start OpenClaw gateway
echo "🔌 Starting OpenClaw gateway..."
openclaw gateway start

# Wait a moment for OpenClaw to start
sleep 5

# Start API interception
echo "🔌 Starting API interception..."
node "${__dirname}/openclaw-integration.js" &
API_INTERCEPTOR_PID=$!

echo "✅ Setup complete!"
echo "📊 Mission Control: http://localhost:8899"
echo "🔌 API interception: Active"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle shutdown
trap 'echo "🛑 Shutting down..."; kill $MISSION_CONTROL_PID $API_INTERCEPTOR_PID 2>/dev/null; openclaw gateway stop; exit 0' INT TERM

# Keep script running
wait
`;

        fs.writeFileSync(scriptPath, scriptContent);
        fs.chmodSync(scriptPath, '755');
        
        console.log(`📝 Created startup script: ${scriptPath}`);
        console.log('   Run with: ./start-with-openclaw.sh');
        
        return scriptPath;
    }

    // Monitor OpenClaw and restart interception if needed
    async monitorAndRestart() {
        console.log('👁️  Monitoring OpenClaw status...');
        
        setInterval(async () => {
            const isRunning = await this.isOpenClawRunning();
            
            if (isRunning && !global.apiInterceptorRunning) {
                console.log('🔄 OpenClaw detected - restarting API interception...');
                startAPIInterception(this.missionControlUrl);
            } else if (!isRunning && global.apiInterceptorRunning) {
                console.log('⚠️  OpenClaw stopped - API interception may no longer be effective');
            }
        }, 30000); // Check every 30 seconds
    }
}

// Auto-run if executed directly
if (require.main === module) {
    const integration = new OpenClawIntegration();
    
    console.log('🔌 OpenClaw + Mission Control Integration');
    console.log('==========================================');
    
    // Check command line arguments
    const command = process.argv[2];
    
    if (command === 'create-startup') {
        integration.createStartupScript();
        process.exit(0);
    } else if (command === 'monitor') {
        integration.monitorAndRestart();
    } else {
        // Default: start interception if OpenClaw is running
        integration.startInterceptionIfNeeded().then((started) => {
            if (started) {
                integration.monitorAndRestart();
                
                // Keep process alive
                process.on('SIGTERM', () => {
                    console.log('📴 Stopping OpenClaw integration...');
                    process.exit(0);
                });
                
                process.on('SIGINT', () => {
                    console.log('\n📴 Stopping OpenClaw integration...');
                    process.exit(0);
                });
            } else {
                process.exit(1);
            }
        });
    }
}

module.exports = OpenClawIntegration;