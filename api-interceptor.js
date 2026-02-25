#!/usr/bin/env node

// Real AI API Call Interceptor for OpenClaw
// Hooks into actual HTTP requests to track real usage and costs

const https = require('https');
const http = require('http');
const { getFailoverManager } = require('./api-failover-manager');

class AIAPIInterceptor {
    constructor(missionControlUrl = 'http://localhost:8899') {
        this.missionControlUrl = missionControlUrl;
        this.originalHttpsRequest = https.request;
        this.originalHttpRequest = http.request;
        this.isIntercepting = false;
        this.failoverManager = null;
        
        // Provider endpoints to intercept
        this.providerEndpoints = {
            'api.anthropic.com': 'anthropic',
            'api.openai.com': 'openai', 
            'generativelanguage.googleapis.com': 'google',
            'api.x.ai': 'xai'
        };
        
        // Model mapping for cost calculation
        this.modelMappings = {
            'claude-3-5-sonnet-20241022': 'claude-sonnet-4-20250514',
            'claude-3-opus-20240229': 'claude-opus-4-6',
            'claude-3-haiku-20240307': 'claude-haiku',
            'gpt-4-turbo': 'gpt-4-turbo',
            'gpt-4': 'gpt-4',
            'gpt-3.5-turbo': 'gpt-3.5-turbo',
            'gemini-1.5-pro': 'gemini-pro',
            'gemini-pro': 'gemini-pro',
            'grok-beta': 'grok-beta'
        };
    }

    // Start intercepting API calls
    startInterception() {
        if (this.isIntercepting) return;
        
        console.log('🔌 Starting AI API call interception...');
        
        // Initialize failover manager
        try {
            this.failoverManager = getFailoverManager();
            console.log('🔄 Failover manager integrated');
        } catch (error) {
            console.warn('⚠️ Could not initialize failover manager:', error.message);
        }
        
        const self = this;
        
        // Intercept HTTPS requests
        https.request = function(options, callback) {
            return self.interceptRequest('https', self.originalHttpsRequest, options, callback);
        };
        
        // Intercept HTTP requests  
        http.request = function(options, callback) {
            return self.interceptRequest('http', self.originalHttpRequest, options, callback);
        };
        
        this.isIntercepting = true;
        console.log('✅ AI API interception active');
    }

    // Stop intercepting
    stopInterception() {
        if (!this.isIntercepting) return;
        
        https.request = this.originalHttpsRequest;
        http.request = this.originalHttpRequest;
        this.isIntercepting = false;
        
        console.log('🔌 AI API interception stopped');
    }

    // Intercept and analyze requests
    interceptRequest(protocol, originalRequest, options, callback) {
        const hostname = typeof options === 'string' ? new URL(options).hostname : options.hostname;
        const path = typeof options === 'string' ? new URL(options).pathname : options.path;
        const method = typeof options === 'string' ? 'GET' : (options.method || 'GET');
        
        // Check if this is an AI API call
        const provider = this.providerEndpoints[hostname];
        if (!provider || method !== 'POST') {
            // Not an AI API call, pass through normally
            return originalRequest.call(protocol === 'https' ? https : http, options, callback);
        }

        console.log(`🤖 Intercepted AI API call to ${hostname}${path}`);

        // Wrap the original callback to capture response
        const wrappedCallback = (res) => {
            let responseBody = '';
            let requestBody = '';

            // Capture response data
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                try {
                    this.processAICall(provider, hostname, path, requestBody, responseBody);
                } catch (error) {
                    console.error('Error processing AI call:', error);
                }
            });

            // Call original callback
            if (callback) callback(res);
        };

        // Create the request with wrapped callback
        const req = originalRequest.call(protocol === 'https' ? https : http, options, wrappedCallback);

        // Intercept request data being written
        const originalWrite = req.write;
        const originalEnd = req.end;
        let requestData = '';

        req.write = function(chunk, encoding, callback) {
            if (chunk) {
                requestData += chunk.toString();
            }
            return originalWrite.call(this, chunk, encoding, callback);
        };

        req.end = function(chunk, encoding, callback) {
            if (chunk) {
                requestData += chunk.toString();
            }
            
            // Store request data for processing
            req._requestData = requestData;
            
            return originalEnd.call(this, chunk, encoding, callback);
        };

        return req;
    }

    // Process and log AI API call
    async processAICall(provider, hostname, path, requestBody, responseBody) {
        try {
            let model = 'unknown';
            let inputTokens = 0;
            let outputTokens = 0;
            let taskType = 'general';
            let isError = false;
            let response = null;

            // Try to parse response to detect errors
            try {
                response = JSON.parse(responseBody);
                if (response.error) {
                    isError = true;
                    console.log(`❌ API Error detected: ${response.error.message || 'Unknown error'}`);
                }
            } catch (e) {
                // Response body might not be JSON
                if (responseBody.includes('rate limit') || responseBody.includes('429')) {
                    isError = true;
                    console.log('❌ Rate limit detected in response');
                }
            }

            // Parse request and response based on provider
            if (provider === 'anthropic') {
                const { model: reqModel, inputTokens: reqInput, outputTokens: respOutput, taskType: reqTaskType } = this.parseAnthropicCall(requestBody, responseBody);
                model = reqModel;
                inputTokens = reqInput;
                outputTokens = respOutput;
                taskType = reqTaskType;
            } else if (provider === 'openai') {
                const { model: reqModel, inputTokens: reqInput, outputTokens: respOutput, taskType: reqTaskType } = this.parseOpenAICall(requestBody, responseBody);
                model = reqModel;
                inputTokens = reqInput;
                outputTokens = respOutput;
                taskType = reqTaskType;
            } else if (provider === 'google') {
                const { model: reqModel, inputTokens: reqInput, outputTokens: respOutput, taskType: reqTaskType } = this.parseGoogleCall(requestBody, responseBody);
                model = reqModel;
                inputTokens = reqInput;
                outputTokens = respOutput;
                taskType = reqTaskType;
            } else if (provider === 'xai') {
                const { model: reqModel, inputTokens: reqInput, outputTokens: respOutput, taskType: reqTaskType } = this.parseXAICall(requestBody, responseBody);
                model = reqModel;
                inputTokens = reqInput;
                outputTokens = respOutput;
                taskType = reqTaskType;
            }

            // Map model name to standard format
            const standardModel = this.modelMappings[model] || model;

            // Handle failover if manager is available
            if (this.failoverManager) {
                const success = this.failoverManager.handleAPIResponse(provider, standardModel, response, isError ? { message: responseBody } : null);
                
                if (!success) {
                    // Rate limit hit - get recommended model for next request
                    const recommendation = this.failoverManager.getModelForTask(taskType);
                    console.log(`🔄 Failover recommendation for ${taskType}: ${recommendation.provider}/${recommendation.model}`);
                    
                    // Log failover recommendation
                    await this.logFailoverRecommendation(taskType, recommendation);
                }
            }

            // Log to Mission Control (even if failed, to track attempts)
            await this.logToMissionControl(provider, standardModel, inputTokens, outputTokens, taskType, isError);

            console.log(`📊 Logged: ${provider}/${standardModel} - ${inputTokens + outputTokens} tokens - ${taskType}${isError ? ' (ERROR)' : ''}`);

        } catch (error) {
            console.error('Error processing AI call:', error);
        }
    }

    // Parse Anthropic API calls
    parseAnthropicCall(requestBody, responseBody) {
        try {
            const request = JSON.parse(requestBody);
            const response = JSON.parse(responseBody);

            const model = request.model || 'claude-unknown';
            const inputTokens = response.usage?.input_tokens || this.estimateTokens(JSON.stringify(request.messages || []));
            const outputTokens = response.usage?.output_tokens || this.estimateTokens(response.content?.[0]?.text || '');
            
            // Determine task type from message content
            const taskType = this.inferTaskType(request.messages);

            return { model, inputTokens, outputTokens, taskType };
        } catch (error) {
            console.error('Error parsing Anthropic call:', error);
            return { model: 'claude-unknown', inputTokens: 0, outputTokens: 0, taskType: 'unknown' };
        }
    }

    // Parse OpenAI API calls
    parseOpenAICall(requestBody, responseBody) {
        try {
            const request = JSON.parse(requestBody);
            const response = JSON.parse(responseBody);

            const model = request.model || 'gpt-unknown';
            const inputTokens = response.usage?.prompt_tokens || this.estimateTokens(JSON.stringify(request.messages || []));
            const outputTokens = response.usage?.completion_tokens || this.estimateTokens(response.choices?.[0]?.message?.content || '');
            
            const taskType = this.inferTaskType(request.messages);

            return { model, inputTokens, outputTokens, taskType };
        } catch (error) {
            console.error('Error parsing OpenAI call:', error);
            return { model: 'gpt-unknown', inputTokens: 0, outputTokens: 0, taskType: 'unknown' };
        }
    }

    // Parse Google API calls
    parseGoogleCall(requestBody, responseBody) {
        try {
            const request = JSON.parse(requestBody);
            const response = JSON.parse(responseBody);

            const model = 'gemini-pro'; // Default for Google
            const inputText = request.contents?.[0]?.parts?.[0]?.text || '';
            const outputText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            const inputTokens = response.usageMetadata?.promptTokenCount || this.estimateTokens(inputText);
            const outputTokens = response.usageMetadata?.candidatesTokenCount || this.estimateTokens(outputText);
            
            const taskType = this.inferTaskTypeFromText(inputText);

            return { model, inputTokens, outputTokens, taskType };
        } catch (error) {
            console.error('Error parsing Google call:', error);
            return { model: 'gemini-unknown', inputTokens: 0, outputTokens: 0, taskType: 'unknown' };
        }
    }

    // Parse xAI API calls
    parseXAICall(requestBody, responseBody) {
        try {
            const request = JSON.parse(requestBody);
            const response = JSON.parse(responseBody);

            const model = request.model || 'grok-beta';
            const inputTokens = response.usage?.prompt_tokens || this.estimateTokens(JSON.stringify(request.messages || []));
            const outputTokens = response.usage?.completion_tokens || this.estimateTokens(response.choices?.[0]?.message?.content || '');
            
            const taskType = this.inferTaskType(request.messages);

            return { model, inputTokens, outputTokens, taskType };
        } catch (error) {
            console.error('Error parsing xAI call:', error);
            return { model: 'grok-unknown', inputTokens: 0, outputTokens: 0, taskType: 'unknown' };
        }
    }

    // Infer task type from messages
    inferTaskType(messages) {
        if (!messages || !Array.isArray(messages)) return 'unknown';
        
        const content = messages.map(m => m.content || m.text || '').join(' ').toLowerCase();
        return this.inferTaskTypeFromText(content);
    }

    // Infer task type from text content
    inferTaskTypeFromText(text) {
        const content = text.toLowerCase();
        
        if (content.includes('strategic') || content.includes('planning') || content.includes('analysis')) {
            return 'strategic_analysis';
        }
        if (content.includes('competitive') || content.includes('competitor') || content.includes('market')) {
            return 'competitive_research';
        }
        if (content.includes('security') || content.includes('threat') || content.includes('risk')) {
            return 'security_assessment';
        }
        if (content.includes('advisory') || content.includes('recommend') || content.includes('business')) {
            return 'business_advisory';
        }
        if (content.includes('code') || content.includes('programming') || content.includes('function')) {
            return 'code_generation';
        }
        if (content.includes('write') || content.includes('content') || content.includes('blog')) {
            return 'content_generation';
        }
        if (content.includes('data') || content.includes('process') || content.includes('analyze')) {
            return 'data_processing';
        }
        
        return 'general';
    }

    // Estimate tokens from text (rough approximation)
    estimateTokens(text) {
        if (!text) return 0;
        // Rough approximation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }

    // Log to Mission Control server
    async logToMissionControl(provider, model, inputTokens, outputTokens, taskType, isError = false) {
        try {
            const response = await this.makeRequest(`${this.missionControlUrl}/mc/usage/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    provider,
                    model,
                    inputTokens,
                    outputTokens,
                    taskType,
                    isError
                })
            });

            if (!response.success) {
                console.error('Failed to log to Mission Control:', response.error);
            }
        } catch (error) {
            console.error('Error logging to Mission Control:', error);
        }
    }

    // Log failover recommendation
    async logFailoverRecommendation(taskType, recommendation) {
        try {
            await this.makeRequest(`${this.missionControlUrl}/mc/failover/recommendation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    taskType,
                    recommendation,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Error logging failover recommendation:', error);
        }
    }

    // Make HTTP request helper
    makeRequest(url, options) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname,
                method: options.method || 'GET',
                headers: options.headers || {}
            };

            const req = (urlObj.protocol === 'https:' ? https : http).request(requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        resolve({ error: 'Invalid JSON response' });
                    }
                });
            });

            req.on('error', reject);

            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }
}

// Global interceptor instance
let globalInterceptor = null;

// Start interception
function startAPIInterception(missionControlUrl) {
    if (globalInterceptor) return globalInterceptor;
    
    globalInterceptor = new AIAPIInterceptor(missionControlUrl);
    globalInterceptor.startInterception();
    return globalInterceptor;
}

// Stop interception
function stopAPIInterception() {
    if (globalInterceptor) {
        globalInterceptor.stopInterception();
        globalInterceptor = null;
    }
}

// Auto-start if running directly
if (require.main === module) {
    console.log('🔌 Starting AI API Interceptor...');
    startAPIInterception();
    
    // Keep process alive
    process.on('SIGTERM', () => {
        console.log('📴 Stopping AI API Interceptor...');
        stopAPIInterception();
        process.exit(0);
    });
    
    process.on('SIGINT', () => {
        console.log('\n📴 Stopping AI API Interceptor...');
        stopAPIInterception();
        process.exit(0);
    });
}

module.exports = {
    AIAPIInterceptor,
    startAPIInterception,
    stopAPIInterception
};