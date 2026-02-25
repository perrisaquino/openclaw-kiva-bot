#!/usr/bin/env node

// AI API Failover Manager
// Automatically switches models/providers when usage limits are hit
// Reverts to preferred models when limits reset

class APIFailoverManager {
    constructor() {
        // Model hierarchy - preferred to fallback
        this.modelHierarchy = [
            // Tier 1: Preferred strategic models
            { provider: 'anthropic', model: 'claude-opus-4-6', tier: 1, cost: 'high', capability: 'strategic' },
            
            // Tier 2: Anthropic fallbacks
            { provider: 'anthropic', model: 'claude-sonnet-4-20250514', tier: 2, cost: 'medium', capability: 'balanced' },
            { provider: 'anthropic', model: 'claude-haiku', tier: 3, cost: 'low', capability: 'fast' },
            
            // Tier 3: OpenAI fallbacks
            { provider: 'openai', model: 'gpt-4-turbo', tier: 4, cost: 'high', capability: 'strategic' },
            { provider: 'openai', model: 'gpt-4', tier: 5, cost: 'very-high', capability: 'strategic' },
            { provider: 'openai', model: 'gpt-3.5-turbo', tier: 6, cost: 'low', capability: 'fast' },
            
            // Tier 4: Other providers
            { provider: 'google', model: 'gemini-pro', tier: 7, cost: 'very-low', capability: 'experimental' },
            { provider: 'xai', model: 'grok-beta', tier: 8, cost: 'medium', capability: 'experimental' }
        ];
        
        // Current model selections by task type
        this.currentModels = {
            strategic: this.modelHierarchy[0], // Start with Opus 4.6
            balanced: this.modelHierarchy[1],  // Start with Sonnet
            fast: this.modelHierarchy[2]       // Start with Haiku
        };
        
        // Rate limit tracking
        this.rateLimits = {
            anthropic: {
                isLimited: false,
                limitResetTime: null,
                dailyUsage: 0,
                monthlyUsage: 0,
                lastLimitHit: null,
                consecutiveFailures: 0
            },
            openai: {
                isLimited: false,
                limitResetTime: null,
                dailyUsage: 0,
                monthlyUsage: 0,
                lastLimitHit: null,
                consecutiveFailures: 0
            },
            google: {
                isLimited: false,
                limitResetTime: null,
                dailyUsage: 0,
                monthlyUsage: 0,
                lastLimitHit: null,
                consecutiveFailures: 0
            },
            xai: {
                isLimited: false,
                limitResetTime: null,
                dailyUsage: 0,
                monthlyUsage: 0,
                lastLimitHit: null,
                consecutiveFailures: 0
            }
        };
        
        // Usage quotas (configurable based on your plan)
        this.quotas = {
            anthropic: {
                dailyRequests: 1000,
                monthlyTokens: 100000,
                dailyTokens: 10000
            },
            openai: {
                dailyRequests: 3000,
                monthlyTokens: 150000,
                dailyTokens: 15000
            },
            google: {
                dailyRequests: 1500,
                monthlyTokens: 50000,
                dailyTokens: 5000
            },
            xai: {
                dailyRequests: 500,
                monthlyTokens: 25000,
                dailyTokens: 2500
            }
        };
        
        this.missionControlUrl = 'http://localhost:8899';
        
        // Start monitoring and auto-recovery
        this.startLimitMonitoring();
    }

    // Get the best available model for a task type
    getBestAvailableModel(taskType) {
        const capability = this.mapTaskToCapability(taskType);
        
        // Find best available model for this capability
        for (const model of this.modelHierarchy) {
            if (this.isModelAvailable(model) && this.isCapabilitySuitable(model.capability, capability)) {
                return model;
            }
        }
        
        // If no models available, return lowest tier as last resort
        return this.modelHierarchy[this.modelHierarchy.length - 1];
    }

    // Map task types to capability requirements
    mapTaskToCapability(taskType) {
        const strategicTasks = [
            'strategic_analysis', 'business_advisory', 'competitive_research', 
            'security_assessment', 'complex_reasoning', 'advisory_council'
        ];
        
        const balancedTasks = [
            'content_generation', 'data_processing', 'code_review',
            'research', 'analysis', 'planning'
        ];
        
        const fastTasks = [
            'simple_query', 'formatting', 'basic_processing', 
            'quick_response', 'status_check', 'routine'
        ];
        
        if (strategicTasks.includes(taskType)) return 'strategic';
        if (balancedTasks.includes(taskType)) return 'balanced';
        if (fastTasks.includes(taskType)) return 'fast';
        
        // Default to balanced for unknown tasks
        return 'balanced';
    }

    // Check if capability is suitable for task
    isCapabilitySuitable(modelCapability, requiredCapability) {
        const capabilityRank = {
            'strategic': 4,
            'balanced': 3,
            'fast': 2,
            'experimental': 1
        };
        
        // Model can handle task if its capability rank is >= required rank
        return capabilityRank[modelCapability] >= capabilityRank[requiredCapability];
    }

    // Check if model is available (not rate limited)
    isModelAvailable(model) {
        const providerLimits = this.rateLimits[model.provider];
        
        if (!providerLimits.isLimited) {
            return true;
        }
        
        // Check if limit has expired
        if (providerLimits.limitResetTime && Date.now() > providerLimits.limitResetTime) {
            this.clearRateLimit(model.provider);
            return true;
        }
        
        return false;
    }

    // Handle rate limit detection from API response
    handleAPIResponse(provider, model, response, error) {
        const providerLimits = this.rateLimits[provider];
        
        if (error || (response && response.status === 429)) {
            // Rate limit hit
            console.log(`🚨 Rate limit hit for ${provider}/${model}`);
            
            providerLimits.isLimited = true;
            providerLimits.lastLimitHit = Date.now();
            providerLimits.consecutiveFailures++;
            
            // Estimate reset time based on provider
            const resetTime = this.estimateResetTime(provider, error);
            providerLimits.limitResetTime = resetTime;
            
            this.logFailover(provider, model, resetTime);
            
            // Update current models to use next tier
            this.updateCurrentModels();
            
            return false; // Indicates failure
        } else if (response && response.status === 200) {
            // Successful response - reset failure count
            providerLimits.consecutiveFailures = 0;
            
            // Update usage tracking
            this.updateUsageTracking(provider, response);
            
            return true; // Indicates success
        }
        
        return true; // Default to success if unclear
    }

    // Estimate when rate limit will reset
    estimateResetTime(provider, error) {
        const now = Date.now();
        let resetMs = 0;
        
        // Try to extract reset time from error message/headers
        if (error && error.headers && error.headers['retry-after']) {
            resetMs = parseInt(error.headers['retry-after']) * 1000;
        } else if (error && error.message) {
            // Parse common rate limit messages
            if (error.message.includes('minute')) {
                resetMs = 60 * 1000; // 1 minute
            } else if (error.message.includes('hour')) {
                resetMs = 60 * 60 * 1000; // 1 hour
            } else if (error.message.includes('day')) {
                resetMs = 24 * 60 * 60 * 1000; // 24 hours
            }
        }
        
        // Default estimates by provider if no specific info
        if (resetMs === 0) {
            const defaults = {
                anthropic: 60 * 1000, // 1 minute typical
                openai: 60 * 1000,    // 1 minute typical
                google: 60 * 1000,    // 1 minute typical
                xai: 300 * 1000       // 5 minutes typical
            };
            resetMs = defaults[provider] || 60 * 1000;
        }
        
        return now + resetMs;
    }

    // Update usage tracking
    updateUsageTracking(provider, response) {
        const providerLimits = this.rateLimits[provider];
        
        // Update daily usage
        const today = new Date().toDateString();
        if (this.lastTrackingDate !== today) {
            this.lastTrackingDate = today;
            // Reset daily counters
            Object.keys(this.rateLimits).forEach(p => {
                this.rateLimits[p].dailyUsage = 0;
            });
        }
        
        providerLimits.dailyUsage++;
        
        // Extract token usage from response if available
        if (response && response.usage) {
            const tokens = (response.usage.input_tokens || response.usage.prompt_tokens || 0) +
                          (response.usage.output_tokens || response.usage.completion_tokens || 0);
            
            providerLimits.dailyTokens = (providerLimits.dailyTokens || 0) + tokens;
            providerLimits.monthlyTokens = (providerLimits.monthlyTokens || 0) + tokens;
        }
    }

    // Clear rate limit when it expires
    clearRateLimit(provider) {
        console.log(`✅ Rate limit cleared for ${provider} - reverting to preferred models`);
        
        this.rateLimits[provider].isLimited = false;
        this.rateLimits[provider].limitResetTime = null;
        this.rateLimits[provider].consecutiveFailures = 0;
        
        // Update current models to use best available
        this.updateCurrentModels();
        
        this.logRecovery(provider);
    }

    // Update current model selections based on availability
    updateCurrentModels() {
        this.currentModels.strategic = this.getBestAvailableModel('strategic_analysis');
        this.currentModels.balanced = this.getBestAvailableModel('data_processing');
        this.currentModels.fast = this.getBestAvailableModel('simple_query');
        
        console.log('🔄 Updated model selections:');
        console.log(`   Strategic: ${this.currentModels.strategic.provider}/${this.currentModels.strategic.model}`);
        console.log(`   Balanced: ${this.currentModels.balanced.provider}/${this.currentModels.balanced.model}`);
        console.log(`   Fast: ${this.currentModels.fast.provider}/${this.currentModels.fast.model}`);
    }

    // Get recommended model for a specific task
    getModelForTask(taskType) {
        const capability = this.mapTaskToCapability(taskType);
        const model = this.currentModels[capability] || this.getBestAvailableModel(taskType);
        
        console.log(`🧠 Model selection for ${taskType}: ${model.provider}/${model.model} (${capability})`);
        
        return {
            provider: model.provider,
            model: model.model,
            tier: model.tier,
            reasoning: `${capability} task using tier ${model.tier} model`
        };
    }

    // Start monitoring for limit recovery
    startLimitMonitoring() {
        console.log('👁️ Starting rate limit monitoring and auto-recovery...');
        
        // Check every 30 seconds for limit recovery
        setInterval(() => {
            Object.keys(this.rateLimits).forEach(provider => {
                const limits = this.rateLimits[provider];
                
                if (limits.isLimited && limits.limitResetTime && Date.now() > limits.limitResetTime) {
                    this.clearRateLimit(provider);
                }
            });
        }, 30000);
        
        // Reset daily usage at midnight
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                Object.keys(this.rateLimits).forEach(provider => {
                    this.rateLimits[provider].dailyUsage = 0;
                    this.rateLimits[provider].dailyTokens = 0;
                });
                console.log('🌅 Daily usage counters reset');
            }
        }, 60000); // Check every minute
    }

    // Log failover event
    async logFailover(provider, model, resetTime) {
        const resetDate = new Date(resetTime);
        console.log(`📉 FAILOVER: ${provider}/${model} → switching to next tier`);
        console.log(`   Reset expected: ${resetDate.toLocaleTimeString()}`);
        
        try {
            await this.logToMissionControl('failover', {
                provider,
                model,
                resetTime,
                newModels: this.currentModels,
                message: `Rate limit hit for ${provider}/${model} - failed over to lower tier`
            });
        } catch (error) {
            console.error('Failed to log failover to Mission Control:', error);
        }
    }

    // Log recovery event
    async logRecovery(provider) {
        console.log(`📈 RECOVERY: ${provider} limits cleared - reverted to preferred models`);
        
        try {
            await this.logToMissionControl('recovery', {
                provider,
                newModels: this.currentModels,
                message: `${provider} rate limits cleared - reverted to preferred models`
            });
        } catch (error) {
            console.error('Failed to log recovery to Mission Control:', error);
        }
    }

    // Log to Mission Control
    async logToMissionControl(type, data) {
        const activity = type === 'failover' ? 
            `🚨 API Failover: ${data.provider} rate limited - using fallback models` :
            `✅ API Recovery: ${data.provider} limits cleared - reverted to preferred models`;
        
        try {
            const response = await fetch(`${this.missionControlUrl}/mc/activity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: activity,
                    type: 'failover'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to log to Mission Control');
            }
        } catch (error) {
            console.error('Mission Control logging failed:', error);
        }
    }

    // Get current status
    getStatus() {
        const status = {
            currentModels: this.currentModels,
            rateLimits: this.rateLimits,
            hierarchy: this.modelHierarchy,
            isAnyLimited: Object.values(this.rateLimits).some(l => l.isLimited),
            preferredAvailable: !this.rateLimits.anthropic.isLimited
        };
        
        return status;
    }

    // Manually trigger failover (for testing)
    simulateRateLimit(provider, durationMs = 300000) {
        console.log(`🧪 TESTING: Simulating rate limit for ${provider} (${durationMs/1000}s)`);
        
        this.rateLimits[provider].isLimited = true;
        this.rateLimits[provider].limitResetTime = Date.now() + durationMs;
        this.rateLimits[provider].lastLimitHit = Date.now();
        
        this.updateCurrentModels();
        this.logFailover(provider, 'simulated', Date.now() + durationMs);
    }
}

// Global instance
let globalFailoverManager = null;

// Initialize failover manager
function initializeFailoverManager() {
    if (globalFailoverManager) return globalFailoverManager;
    
    globalFailoverManager = new APIFailoverManager();
    console.log('🔄 API Failover Manager initialized');
    return globalFailoverManager;
}

// Get failover manager instance
function getFailoverManager() {
    return globalFailoverManager || initializeFailoverManager();
}

// Auto-initialize if running directly
if (require.main === module) {
    const manager = initializeFailoverManager();
    
    console.log('🔄 API Failover Manager running...');
    console.log('📋 Current model hierarchy:');
    manager.modelHierarchy.forEach((model, index) => {
        console.log(`   ${index + 1}. ${model.provider}/${model.model} (${model.capability})`);
    });
    
    // Test failover (uncomment to test)
    // setTimeout(() => manager.simulateRateLimit('anthropic', 60000), 5000);
    
    // Keep process alive
    process.on('SIGTERM', () => {
        console.log('📴 Stopping API Failover Manager...');
        process.exit(0);
    });
    
    process.on('SIGINT', () => {
        console.log('\n📴 Stopping API Failover Manager...');
        process.exit(0);
    });
}

module.exports = {
    APIFailoverManager,
    initializeFailoverManager,
    getFailoverManager
};