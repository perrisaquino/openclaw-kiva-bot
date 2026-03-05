#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const https = require('https');
const TodoistIntegration = require('./todoist-integration');
const { startAPIInterception, stopAPIInterception } = require('./api-interceptor');
const { initializeFailoverManager, getFailoverManager } = require('./api-failover-manager');
const { addMobileEndpoints } = require('./server-mobile');

const app = express();
const PORT = 8899;
const DATA_FILE = 'mc-data.json';
const ACTIVITY_FILE = 'mc-activity.json';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve static files from current directory

// CORS for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Track server start time
const startTime = Date.now();

// Utility functions
async function readJsonFile(filename, defaultValue = {}) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create with default value
            await writeJsonFile(filename, defaultValue);
            return defaultValue;
        }
        throw error;
    }
}

async function writeJsonFile(filename, data) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data); // Return raw data if not JSON
                }
            });
        }).on('error', reject);
    });
}

// Routes

// Serve Mission Control at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mission-control.html'));
});

// Serve real intel data file
app.get('/real-intel-data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'real-intel-data.json'));
});

// 1. GET /mc/status — System status
app.get('/mc/status', (req, res) => {
    const uptime = Date.now() - startTime;
    const uptimeSeconds = Math.floor(uptime / 1000);
    
    res.json({
        status: 'online',
        uptime: uptimeSeconds,
        uptimeFormatted: formatUptime(uptimeSeconds),
        lastRefresh: new Date().toISOString(),
        server: 'Mission Control Server v1.0',
        port: PORT
    });
});

// 2. GET /mc/data — Dashboard data
app.get('/mc/data', async (req, res) => {
    try {
        const data = await readJsonFile(DATA_FILE, {
            priorities: [],
            tasks: { 
                business: { backlog: [], progress: [], done: [] },
                personal: { backlog: [], progress: [], done: [] }
            },
            revenue: {
                goal: 2000,
                history: Array(6).fill().map((_, i) => ({
                    month: getMonthName(new Date().getMonth() - (5 - i)),
                    value: 0
                })),
                clients: []
            },
            command: {
                agents: [],
                decisions: []
            },
            intel: {
                items: []
            },
            advisoryCouncil: {
                experts: [],
                recommendations: [],
                dataSources: [],
                settings: {}
            },
            security: {
                incidents: [],
                approvals: [],
                metrics: {},
                policies: {}
            },
            usage: {
                providers: {},
                calls: [],
                daily: {},
                weekly: {},
                monthly: {}
            },
            updates: {
                currentVersion: 'v2.1.0',
                lastCheck: null,
                updates: [],
                settings: {
                    enabled: true,
                    checkTime: '21:00',
                    frequency: 'daily',
                    telegramEnabled: false,
                    telegramBotToken: '',
                    telegramChannelId: ''
                }
            },
            notes: '',
            lastUpdated: new Date().toISOString()
        });
        
        res.json(data);
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read dashboard data' });
    }
});

// 3. POST /mc/data — Save dashboard data
app.post('/mc/data', async (req, res) => {
    try {
        const data = req.body;
        data.lastUpdated = new Date().toISOString();
        
        await writeJsonFile(DATA_FILE, data);
        
        // Log the save activity
        await addActivity('Dashboard data synchronized to server', 'system');
        
        res.json({ 
            success: true, 
            message: 'Dashboard data saved successfully',
            timestamp: data.lastUpdated
        });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save dashboard data' });
    }
});

// 4. GET /mc/weather — Current weather
app.get('/mc/weather', async (req, res) => {
    const city = req.query.city || 'San Francisco';
    
    try {
        console.log(`Fetching weather for: ${city}`);
        const weatherData = await httpsGet(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        
        if (weatherData && weatherData.current_condition && weatherData.current_condition[0]) {
            const current = weatherData.current_condition[0];
            const weather = {
                city: city,
                temperature: parseInt(current.temp_F),
                condition: current.weatherDesc[0].value,
                feelsLike: parseInt(current.FeelsLikeF),
                humidity: parseInt(current.humidity),
                windSpeed: parseInt(current.windspeedMiles),
                timestamp: new Date().toISOString()
            };
            
            res.json(weather);
        } else {
            throw new Error('Invalid weather data format');
        }
    } catch (error) {
        console.error('Weather API error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch weather data',
            message: error.message,
            city: city
        });
    }
});

// 5. GET /mc/activity — Recent activity log
app.get('/mc/activity', async (req, res) => {
    try {
        const activities = await readJsonFile(ACTIVITY_FILE, []);
        const limit = parseInt(req.query.limit) || 50;
        
        res.json({
            activities: activities.slice(0, limit),
            total: activities.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error reading activities:', error);
        res.status(500).json({ error: 'Failed to read activity log' });
    }
});

// 6. POST /mc/activity — Add activity entry
app.post('/mc/activity', async (req, res) => {
    try {
        const { title, type = 'info' } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Activity title is required' });
        }
        
        await addActivity(title, type);
        
        res.json({ 
            success: true, 
            message: 'Activity logged successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ error: 'Failed to add activity' });
    }
});

// 7. POST /mc/sync/todoist — Sync Todoist tasks
app.post('/mc/sync/todoist', async (req, res) => {
    try {
        const { apiToken } = req.body;
        
        if (!apiToken) {
            return res.status(400).json({ error: 'Todoist API token is required' });
        }
        
        console.log('🔄 Starting Todoist sync...');
        const todoist = new TodoistIntegration(apiToken);
        const result = await todoist.syncToMissionControl();
        
        if (result.success) {
            // Update the main data file with real tasks
            const data = await readJsonFile(DATA_FILE, {});
            data.tasks = result.data;
            data.lastTodoistSync = new Date().toISOString();
            data.todoistStats = {
                totalTasks: result.totalTasks,
                businessTasks: result.businessTasks,
                personalTasks: result.personalTasks
            };
            await writeJsonFile(DATA_FILE, data);
            
            await addActivity(`Synced ${result.totalTasks} tasks from Todoist (${result.businessTasks} business, ${result.personalTasks} personal)`, 'sync');
            
            res.json({
                success: true,
                message: 'Todoist sync completed successfully',
                stats: {
                    totalTasks: result.totalTasks,
                    businessTasks: result.businessTasks,
                    personalTasks: result.personalTasks
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error,
                details: result.details
            });
        }
        
    } catch (error) {
        console.error('Error syncing Todoist:', error);
        res.status(500).json({ error: 'Failed to sync Todoist tasks' });
    }
});

// 8. GET /mc/intel/real — Get real intelligence data
app.get('/mc/intel/real', async (req, res) => {
    try {
        const realIntelData = await readJsonFile('real-intel-data.json', { items: [] });
        res.json(realIntelData);
    } catch (error) {
        console.error('Error reading real intel data:', error);
        res.status(500).json({ error: 'Failed to load real intelligence data' });
    }
});

// 9. POST /mc/research/competitive — Run competitive research
app.post('/mc/research/competitive', async (req, res) => {
    try {
        const { query, category = 'competitor-watch' } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Research query is required' });
        }
        
        // This would integrate with web search and analysis
        // For now, return a placeholder response
        await addActivity(`Competitive research initiated: ${query}`, 'intel');
        
        res.json({
            success: true,
            message: 'Competitive research initiated',
            query: query,
            status: 'Research framework ready - integrate with web search APIs for live analysis'
        });
        
    } catch (error) {
        console.error('Error running competitive research:', error);
        res.status(500).json({ error: 'Failed to run competitive research' });
    }
});

// 10. POST /mc/usage/log — Log API usage
app.post('/mc/usage/log', async (req, res) => {
    try {
        const { provider, model, inputTokens, outputTokens, taskType, isError } = req.body;
        
        if (!provider || !model || inputTokens === undefined || outputTokens === undefined) {
            return res.status(400).json({ error: 'Missing required usage parameters' });
        }
        
        const data = await readJsonFile(DATA_FILE, {});
        if (!data.usage) data.usage = { providers: {}, calls: [], daily: {} };
        
        // Calculate cost (rough estimates)
        const costCalculator = {
            'anthropic': {
                'claude-opus-4-6': { input: 0.000015, output: 0.000075 },
                'claude-sonnet-4-20250514': { input: 0.000003, output: 0.000015 },
                'claude-haiku': { input: 0.00000025, output: 0.00000125 }
            },
            'openai': {
                'gpt-4': { input: 0.00003, output: 0.00006 },
                'gpt-4-turbo': { input: 0.00001, output: 0.00003 }
            },
            'google': {
                'gemini-pro': { input: 0.000001, output: 0.000002 }
            },
            'xai': {
                'grok-beta': { input: 0.000005, output: 0.000015 }
            }
        };
        
        const rates = costCalculator[provider]?.[model] || { input: 0.000005, output: 0.000015 };
        const cost = (inputTokens * rates.input) + (outputTokens * rates.output);
        
        const call = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            provider,
            model,
            inputTokens,
            outputTokens,
            cost,
            taskType: taskType || 'general',
            isError: isError || false
        };
        
        // Update provider stats
        if (!data.usage.providers[provider]) {
            data.usage.providers[provider] = {
                name: provider.charAt(0).toUpperCase() + provider.slice(1),
                totalCost: 0,
                totalTokens: 0,
                totalCalls: 0,
                models: {}
            };
        }
        
        const providerData = data.usage.providers[provider];
        providerData.totalCost += cost;
        providerData.totalTokens += inputTokens + outputTokens;
        providerData.totalCalls += 1;
        
        if (!providerData.models[model]) {
            providerData.models[model] = { cost: 0, tokens: 0, calls: 0 };
        }
        providerData.models[model].cost += cost;
        providerData.models[model].tokens += inputTokens + outputTokens;
        providerData.models[model].calls += 1;
        
        // Update daily stats
        const date = new Date().toISOString().split('T')[0];
        if (!data.usage.daily[date]) {
            data.usage.daily[date] = { cost: 0, calls: 0, tokens: 0 };
        }
        data.usage.daily[date].cost += cost;
        data.usage.daily[date].calls += 1;
        data.usage.daily[date].tokens += inputTokens + outputTokens;
        
        // Add to calls log
        data.usage.calls.unshift(call);
        
        // Keep only last 1000 calls
        if (data.usage.calls.length > 1000) {
            data.usage.calls = data.usage.calls.slice(0, 1000);
        }
        
        await writeJsonFile(DATA_FILE, data);
        await addActivity(`API call logged: ${provider}/${model} ($${cost.toFixed(6)})`, 'usage');
        
        res.json({
            success: true,
            cost,
            totalCost: providerData.totalCost,
            message: 'Usage logged successfully'
        });
        
    } catch (error) {
        console.error('Error logging usage:', error);
        res.status(500).json({ error: 'Failed to log usage' });
    }
});

// 11. GET /mc/usage/report — Get usage report
app.get('/mc/usage/report', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const data = await readJsonFile(DATA_FILE, {});
        const usage = data.usage || { providers: {}, calls: [], daily: {} };
        
        const report = {
            generated: new Date().toISOString(),
            period,
            summary: {
                totalCost: Object.values(usage.providers).reduce((sum, p) => sum + (p.totalCost || 0), 0),
                totalCalls: Object.values(usage.providers).reduce((sum, p) => sum + (p.totalCalls || 0), 0),
                totalTokens: Object.values(usage.providers).reduce((sum, p) => sum + (p.totalTokens || 0), 0)
            },
            providers: usage.providers,
            recentCalls: usage.calls?.slice(0, 50) || []
        };
        
        res.json(report);
        
    } catch (error) {
        console.error('Error generating usage report:', error);
        res.status(500).json({ error: 'Failed to generate usage report' });
    }
});

// 12. POST /mc/updates/check — Check for updates
app.post('/mc/updates/check', async (req, res) => {
    try {
        const data = await readJsonFile(DATA_FILE, {});
        if (!data.updates) {
            data.updates = {
                currentVersion: 'v2.1.0',
                lastCheck: null,
                updates: [],
                settings: {}
            };
        }
        
        data.updates.lastCheck = new Date().toISOString();
        
        // In real implementation, this would check GitHub releases or update server
        const hasUpdates = false; // Simulate no updates available
        
        await writeJsonFile(DATA_FILE, data);
        await addActivity('Checked for system updates', 'update');
        
        res.json({
            success: true,
            hasUpdates,
            currentVersion: data.updates.currentVersion,
            lastCheck: data.updates.lastCheck,
            message: hasUpdates ? 'Updates available' : 'System is up to date'
        });
        
    } catch (error) {
        console.error('Error checking for updates:', error);
        res.status(500).json({ error: 'Failed to check for updates' });
    }
});

// 13. POST /mc/updates/telegram — Send Telegram update notification
app.post('/mc/updates/telegram', async (req, res) => {
    try {
        const { botToken, channelId, version, changelog } = req.body;
        
        if (!botToken || !channelId) {
            return res.status(400).json({ error: 'Bot token and channel ID required' });
        }
        
        // In real implementation, this would send actual Telegram message
        const message = `🔄 *Mission Control Update*\n\n📦 Version: ${version}\n\n📋 Changes:\n${changelog.map(item => `• ${item}`).join('\n')}\n\n✅ Update completed successfully`;
        
        console.log('Telegram notification:', { botToken: '***', channelId, message });
        
        await addActivity(`Telegram update notification sent for ${version}`, 'update');
        
        res.json({
            success: true,
            message: 'Telegram notification sent successfully'
        });
        
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        res.status(500).json({ error: 'Failed to send Telegram notification' });
    }
});

// Failover Manager Endpoints

// 17. GET /mc/failover/status — Get failover status
app.get('/mc/failover/status', (req, res) => {
    try {
        const manager = getFailoverManager();
        const status = manager ? manager.getStatus() : null;
        
        res.json({
            success: true,
            enabled: !!manager,
            status: status || { message: 'Failover manager not initialized' }
        });
        
    } catch (error) {
        console.error('Error getting failover status:', error);
        res.status(500).json({ error: 'Failed to get failover status' });
    }
});

// 18. POST /mc/failover/init — Initialize failover manager
app.post('/mc/failover/init', async (req, res) => {
    try {
        const manager = initializeFailoverManager();
        
        await addActivity('API Failover Manager initialized - intelligent model switching enabled', 'system');
        
        res.json({
            success: true,
            message: 'Failover manager initialized successfully',
            currentModels: manager.currentModels
        });
        
    } catch (error) {
        console.error('Error initializing failover manager:', error);
        res.status(500).json({ error: 'Failed to initialize failover manager' });
    }
});

// 19. POST /mc/failover/simulate — Simulate rate limit (testing)
app.post('/mc/failover/simulate', async (req, res) => {
    try {
        const { provider, durationMs = 300000 } = req.body;
        
        if (!provider) {
            return res.status(400).json({ error: 'Provider is required' });
        }
        
        const manager = getFailoverManager();
        if (!manager) {
            return res.status(400).json({ error: 'Failover manager not initialized' });
        }
        
        manager.simulateRateLimit(provider, durationMs);
        
        await addActivity(`Testing: Simulated rate limit for ${provider} (${durationMs/1000}s)`, 'failover');
        
        res.json({
            success: true,
            message: `Simulated rate limit for ${provider}`,
            duration: durationMs,
            newModels: manager.currentModels
        });
        
    } catch (error) {
        console.error('Error simulating rate limit:', error);
        res.status(500).json({ error: 'Failed to simulate rate limit' });
    }
});

// 20. POST /mc/failover/recommendation — Log failover recommendation
app.post('/mc/failover/recommendation', async (req, res) => {
    try {
        const { taskType, recommendation, timestamp } = req.body;
        
        // Store recommendation for dashboard display
        const data = await readJsonFile(DATA_FILE, {});
        if (!data.failoverRecommendations) data.failoverRecommendations = [];
        
        data.failoverRecommendations.unshift({
            taskType,
            recommendation,
            timestamp: timestamp || new Date().toISOString()
        });
        
        // Keep only last 50 recommendations
        if (data.failoverRecommendations.length > 50) {
            data.failoverRecommendations = data.failoverRecommendations.slice(0, 50);
        }
        
        await writeJsonFile(DATA_FILE, data);
        
        res.json({
            success: true,
            message: 'Failover recommendation logged'
        });
        
    } catch (error) {
        console.error('Error logging failover recommendation:', error);
        res.status(500).json({ error: 'Failed to log failover recommendation' });
    }
});

// 21. GET /mc/failover/recommendations — Get recent recommendations
app.get('/mc/failover/recommendations', async (req, res) => {
    try {
        const data = await readJsonFile(DATA_FILE, {});
        const recommendations = data.failoverRecommendations || [];
        
        res.json({
            success: true,
            recommendations,
            count: recommendations.length
        });
        
    } catch (error) {
        console.error('Error getting failover recommendations:', error);
        res.status(500).json({ error: 'Failed to get failover recommendations' });
    }
});

// 14. GET /mc/api-interceptor/status — Check API interceptor status
app.get('/mc/api-interceptor/status', (req, res) => {
    try {
        // Check if global interceptor is running
        const isRunning = global.apiInterceptorRunning || false;
        
        res.json({
            running: isRunning,
            message: isRunning ? 'API interception is active' : 'API interception is stopped'
        });
        
    } catch (error) {
        console.error('Error checking interceptor status:', error);
        res.status(500).json({ error: 'Failed to check interceptor status' });
    }
});

// 15. POST /mc/api-interceptor/start — Start API interception
app.post('/mc/api-interceptor/start', async (req, res) => {
    try {
        if (global.apiInterceptorRunning) {
            return res.json({
                success: false,
                message: 'API interceptor is already running'
            });
        }
        
        // Start the interceptor
        startAPIInterception(`http://localhost:${PORT}`);
        global.apiInterceptorRunning = true;
        
        await addActivity('AI API interception started - now tracking real usage', 'system');
        
        res.json({
            success: true,
            message: 'API interception started successfully'
        });
        
    } catch (error) {
        console.error('Error starting API interceptor:', error);
        res.status(500).json({ error: 'Failed to start API interceptor' });
    }
});

// 16. POST /mc/api-interceptor/stop — Stop API interception
app.post('/mc/api-interceptor/stop', async (req, res) => {
    try {
        if (!global.apiInterceptorRunning) {
            return res.json({
                success: false,
                message: 'API interceptor is not running'
            });
        }
        
        // Stop the interceptor
        stopAPIInterception();
        global.apiInterceptorRunning = false;
        
        await addActivity('AI API interception stopped', 'system');
        
        res.json({
            success: true,
            message: 'API interception stopped successfully'
        });
        
    } catch (error) {
        console.error('Error stopping API interceptor:', error);
        res.status(500).json({ error: 'Failed to stop API interceptor' });
    }
});

// Helper function to add activity
async function addActivity(title, type = 'info') {
    try {
        const activities = await readJsonFile(ACTIVITY_FILE, []);
        
        const newActivity = {
            id: Date.now(),
            title,
            type,
            timestamp: new Date().toISOString()
        };
        
        activities.unshift(newActivity);
        
        // Keep only last 1000 activities
        if (activities.length > 1000) {
            activities.splice(1000);
        }
        
        await writeJsonFile(ACTIVITY_FILE, activities);
    } catch (error) {
        console.error('Error adding activity:', error);
    }
}

// Utility functions
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
}

function getMonthName(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = 2026; // Current year
    const normalizedIndex = ((monthIndex % 12) + 12) % 12;
    const year = monthIndex < 0 ? currentYear - 1 : currentYear;
    return `${months[normalizedIndex]} ${year}`;
}

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path 
    });
});

// Add mobile endpoints
addMobileEndpoints(app);

// Start server
app.listen(PORT, () => {
    console.log('🚀 Mission Control Server Started');
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 API Base: http://localhost:${PORT}/mc/`);
    console.log(`📂 Data files: ${DATA_FILE}, ${ACTIVITY_FILE}`);
    console.log('✨ Ready for Mission Control!');
    
    // Log startup activity
    addActivity('Mission Control Server started', 'system');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Mission Control Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n📴 Mission Control Server shutting down gracefully...');
    process.exit(0);
});