/**
 * OpenClaw Model Routing Integration for AI Rewriting System
 * Handles communication with OpenClaw's model routing and cost tracking
 */

class OpenClawIntegration {
    constructor() {
        this.baseUrl = 'http://localhost:8899'; // OpenClaw Gateway default
        this.sessionId = this.generateSessionId();
        this.models = {
            'claude-sonnet-4': {
                provider: 'anthropic',
                model: 'claude-sonnet-4-20250514',
                costPer1kTokens: 3.0,
                description: 'Fast, balanced performance'
            },
            'claude-opus-3': {
                provider: 'anthropic', 
                model: 'claude-opus-3-20240320',
                costPer1kTokens: 15.0,
                description: 'Deep thinking, highest quality'
            },
            'claude-code-3': {
                provider: 'anthropic',
                model: 'claude-code-3-20240320',
                costPer1kTokens: 3.0,
                description: 'Technical and precise'
            },
            'gemini-pro': {
                provider: 'google',
                model: 'gemini-pro',
                costPer1kTokens: 1.5,
                description: 'Creative and imaginative'
            }
        };
        
        this.requestHistory = [];
        this.init();
    }

    init() {
        this.checkConnection();
    }

    generateSessionId() {
        return `rewriter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/status`);
            if (response.ok) {
                console.log('✅ Connected to OpenClaw Gateway');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ OpenClaw Gateway not available, using mock responses');
        }
        return false;
    }

    async rewriteText(options) {
        const {
            text,
            promptType,
            customPrompt,
            modelId,
            voicePrompts,
            temperature = 0.7
        } = options;

        const model = this.models[modelId] || this.models['claude-sonnet-4'];
        const systemPrompt = this.buildSystemPrompt(voicePrompts);
        const userPrompt = this.buildUserPrompt(text, promptType, customPrompt, voicePrompts);

        const requestPayload = {
            model: model.model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            max_tokens: this.calculateMaxTokens(text),
            temperature: temperature,
            metadata: {
                sessionId: this.sessionId,
                promptType: promptType,
                originalLength: text.length
            }
        };

        try {
            // Try OpenClaw Gateway first
            const result = await this.callOpenClawGateway(requestPayload);
            this.logRequest(requestPayload, result, model);
            return result;
        } catch (error) {
            console.warn('OpenClaw request failed, using mock response:', error);
            return this.generateMockResponse(text, promptType, voicePrompts);
        }
    }

    async callOpenClawGateway(payload) {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`,
                'X-Session-ID': this.sessionId
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`OpenClaw API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`API error: ${data.error.message}`);
        }

        return {
            text: data.choices[0].message.content.trim(),
            usage: data.usage,
            model: data.model,
            cost: this.calculateActualCost(data.usage, payload.model)
        };
    }

    getAuthToken() {
        // In a real implementation, this would be a proper auth token
        return localStorage.getItem('openclaw_auth_token') || 'demo_token';
    }

    buildSystemPrompt(voicePrompts) {
        const baseSystemPrompt = `You are an expert editor helping to rewrite content in Perris Aquino's authentic voice and style.

CORE VOICE CHARACTERISTICS:
- Fellow seeker positioning (not expert/guru): "I'm figuring this out too..."
- Vulnerable learning-in-public: "This is fucking me up because..."
- Synthesis thinking: connects ideas across disciplines
- Intellectual humility: "Help me understand if I'm missing something..."
- Community building: "What patterns are you seeing?"
- Cultural grounding: Filipino-American perspective
- Real-time processing: "I'm literally figuring this out as I write..."

LANGUAGE PATTERNS:
- Natural connectors: "And here's what's interesting..." "This connects to..."
- Authentic reactions: "holy shit", "that's wild", "fucking me up"
- Genuine curiosity: asks questions from real wonder
- Synthesis phrases: "When you read X alongside Y, something interesting happens..."

STRICT AVOIDANCES:
- Guru positioning or "you should" statements
- Academic jargon without explanation
- Performative activism or virtue signaling
- Overly polished or hiding learning process
- Corporate speak or marketing language

Return ONLY the rewritten text. No explanations, quotes, or meta-commentary.`;

        return baseSystemPrompt;
    }

    buildUserPrompt(text, promptType, customPrompt, voicePrompts) {
        let specificInstruction = '';

        switch (promptType) {
            case 'engaging':
                specificInstruction = `Make this text more engaging while maintaining Perris's authentic voice. Use his natural enthusiasm, pattern recognition, and personal stakes. Create "holy shit" moments with unexpected connections. Start with emotional hooks and include genuine curiosity.`;
                break;
            
            case 'simplify':
                specificInstruction = `Simplify this text while keeping Perris's natural voice patterns. Break down complexity without dumbing down. Use analogies and real-world examples. Maintain the learning-in-public energy and intellectual humility.`;
                break;
            
            case 'technical':
                specificInstruction = `Add technical depth while maintaining Perris's accessibility. Explain technical concepts clearly, acknowledge complexity, and connect to human impact. Use "Here's what this actually means for us..." framing.`;
                break;
            
            case 'conversational':
                specificInstruction = `Make this more conversational in Perris's style. Use natural speech patterns, contractions, and authentic reactions. Include vulnerability and ask genuine questions. Sound like talking to a close friend about something fascinating.`;
                break;
            
            case 'shorten':
                specificInstruction = `Shorten this text while keeping the core message and Perris's voice. Maintain the most impactful insights and his natural synthesis thinking. Keep emotional resonance and community-building elements.`;
                break;
            
            case 'expand':
                specificInstruction = `Expand this text with examples and deeper insights in Perris's voice. Add personal stories, cultural perspectives, and cross-disciplinary connections. Include his pattern recognition and synthesis abilities.`;
                break;
            
            case 'custom':
                specificInstruction = customPrompt || 'Rewrite this text in Perris\'s authentic voice.';
                break;
            
            default:
                specificInstruction = 'Rewrite this text in Perris\'s authentic voice while improving clarity and engagement.';
        }

        return `${specificInstruction}

Original text to rewrite:
"${text}"`;
    }

    generateMockResponse(text, promptType, voicePrompts) {
        // Mock responses that demonstrate Perris's voice patterns
        const responses = {
            engaging: this.generateEngagingMock(text),
            simplify: this.generateSimplifyMock(text),
            technical: this.generateTechnicalMock(text),
            conversational: this.generateConversationalMock(text),
            shorten: this.generateShortenMock(text),
            expand: this.generateExpandMock(text)
        };

        const mockText = responses[promptType] || this.generateGenericMock(text);
        
        return {
            text: mockText,
            usage: { prompt_tokens: 150, completion_tokens: 100, total_tokens: 250 },
            model: 'mock-model',
            cost: 0.001
        };
    }

    generateEngagingMock(text) {
        const hooks = [
            "So here's something that's been fucking with my head lately:",
            "Can we talk about something that's been on my mind?",
            "I've been learning some things that are changing everything I thought I knew:",
            "This might sound weird, but I keep thinking about"
        ];
        
        const connectors = [
            "And here's what's wild about this:",
            "The more I dig into this, the more I see",
            "What's really getting me is",
            "This connects to something bigger:"
        ];
        
        const endings = [
            "What patterns are you seeing?",
            "I'm still figuring this out, but thought someone else might find it interesting.",
            "Help me understand if I'm missing something here.",
            "I'd love to hear your perspective on this."
        ];

        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        const connector = connectors[Math.floor(Math.random() * connectors.length)];
        const ending = endings[Math.floor(Math.random() * endings.length)];
        
        const simplifiedText = text.split(' ').slice(0, 15).join(' ') + '...';
        
        return `${hook} ${simplifiedText} ${connector} [insight about broader pattern or connection]. ${ending}`;
    }

    generateSimplifyMock(text) {
        const words = text.split(' ');
        const simplified = words.slice(0, Math.max(10, Math.floor(words.length * 0.7))).join(' ');
        
        return `Here's what I'm learning: ${simplified}. Let me break this down because it's actually pretty straightforward once you see the pattern...`;
    }

    generateTechnicalMock(text) {
        return `The technical side of this is wild. ${text} Here's what's actually happening under the hood and why it matters for us...`;
    }

    generateConversationalMock(text) {
        return `So I've been thinking about this: ${text.replace(/\./g, '...')} I'm still figuring it out, but it's been on my mind and I thought you might find it interesting too.`;
    }

    generateShortenMock(text) {
        const words = text.split(' ');
        return words.slice(0, Math.max(5, Math.floor(words.length / 2))).join(' ') + '...';
    }

    generateExpandMock(text) {
        return `${text} Let me dig deeper into this because there's a pattern here I keep seeing everywhere. When you read [relevant source] alongside [another perspective], something interesting happens: [synthesis insight]. This connects to [broader theme] in a way that's been fucking with my worldview lately...`;
    }

    generateGenericMock(text) {
        return `I've been sitting with this idea: ${text} And the more I think about it, the more I realize this connects to something way bigger that we need to talk about...`;
    }

    calculateMaxTokens(text) {
        const inputTokens = Math.ceil(text.length / 4);
        const expansionFactor = 1.5; // Allow for expansion
        return Math.min(Math.max(inputTokens * expansionFactor, 150), 2000);
    }

    calculateActualCost(usage, modelName) {
        if (!usage) return 0;
        
        const model = Object.values(this.models).find(m => m.model === modelName) || this.models['claude-sonnet-4'];
        return (usage.total_tokens / 1000) * model.costPer1kTokens / 100;
    }

    logRequest(payload, result, model) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            model: model.model,
            promptType: payload.metadata?.promptType,
            originalLength: payload.metadata?.originalLength,
            generatedLength: result.text?.length || 0,
            tokens: result.usage?.total_tokens || 0,
            cost: result.cost || 0,
            success: !!result.text
        };

        this.requestHistory.push(logEntry);
        
        // Keep only last 100 requests
        if (this.requestHistory.length > 100) {
            this.requestHistory.shift();
        }

        // Save to localStorage for persistence
        localStorage.setItem('ai_rewriter_history', JSON.stringify(this.requestHistory.slice(-50)));
        
        console.log('🤖 AI Rewrite Request:', logEntry);
    }

    // Public API methods for integration
    getRequestHistory() {
        return this.requestHistory;
    }

    getTotalCost() {
        return this.requestHistory.reduce((total, req) => total + (req.cost || 0), 0);
    }

    getUsageStats() {
        const total = this.requestHistory.length;
        const successful = this.requestHistory.filter(req => req.success).length;
        const totalTokens = this.requestHistory.reduce((total, req) => total + (req.tokens || 0), 0);
        const totalCost = this.getTotalCost();

        return {
            totalRequests: total,
            successfulRequests: successful,
            successRate: total > 0 ? (successful / total * 100).toFixed(1) + '%' : '0%',
            totalTokens: totalTokens,
            totalCost: totalCost.toFixed(4),
            averageCostPerRequest: total > 0 ? (totalCost / total).toFixed(4) : '0'
        };
    }

    getModelUsage() {
        const usage = {};
        this.requestHistory.forEach(req => {
            if (!usage[req.model]) {
                usage[req.model] = { requests: 0, tokens: 0, cost: 0 };
            }
            usage[req.model].requests++;
            usage[req.model].tokens += req.tokens || 0;
            usage[req.model].cost += req.cost || 0;
        });
        return usage;
    }

    exportSession() {
        return {
            sessionId: this.sessionId,
            startTime: this.requestHistory[0]?.timestamp,
            endTime: this.requestHistory[this.requestHistory.length - 1]?.timestamp,
            stats: this.getUsageStats(),
            modelUsage: this.getModelUsage(),
            history: this.requestHistory
        };
    }

    clearHistory() {
        this.requestHistory = [];
        localStorage.removeItem('ai_rewriter_history');
    }

    // Load persisted history on initialization
    loadPersistedHistory() {
        try {
            const saved = localStorage.getItem('ai_rewriter_history');
            if (saved) {
                this.requestHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load persisted history:', error);
        }
    }
}

// Initialize OpenClaw integration
if (typeof window !== 'undefined') {
    window.openClawIntegration = new OpenClawIntegration();
    window.openClawIntegration.loadPersistedHistory();
}

export default OpenClawIntegration;