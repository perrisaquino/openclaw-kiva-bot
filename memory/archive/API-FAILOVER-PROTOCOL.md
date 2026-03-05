# 🔄 API Failover Protocol Guide

**Intelligent model switching when rate limits hit - seamless AI usage with OpenClaw**

## 🎯 What It Does

**No more "rate limit exceeded" errors stopping your workflow!**

When you hit usage limits, the system **automatically steps down** through fallback models:

```
❌ Anthropic Opus 4.6 rate limited
    ↓
✅ Switch to Anthropic Sonnet (same provider, lower tier)
    ↓
❌ Anthropic Sonnet rate limited  
    ↓
✅ Switch to OpenAI GPT-4 Turbo (different provider)
    ↓
❌ OpenAI rate limited
    ↓ 
✅ Switch to GPT-3.5 Turbo (last resort)
```

**When limits reset → automatically reverts back to preferred models!**

## 🚀 Setup (2 minutes)

### **Step 1: Start Mission Control**
```bash
node server.js
```

### **Step 2: Initialize Failover**
1. Open http://localhost:8899
2. Go to **Usage & Costs** tab (☰ menu)
3. Click **"🔄 Initialize"** in the API Failover Manager section
4. **Done!** - Now monitoring all AI providers for rate limits

### **Step 3: Test It Works**
1. Click **"🧪 Test"** button
2. Choose provider to simulate (e.g., "anthropic")
3. Watch the dashboard show failover in action
4. See automatic recovery after 1 minute

## 📋 Model Hierarchy

### **Tier 1: Preferred Strategic Models**
- **Claude Opus 4.6** - Complex reasoning, strategic analysis
- **Cost**: High ($0.000015 input / $0.000075 output)
- **Use**: Advisory Council, complex business decisions

### **Tier 2: Anthropic Fallbacks** 
- **Claude Sonnet** - Balanced performance/cost
- **Cost**: Medium ($0.000003 input / $0.000015 output)
- **Use**: General tasks, content generation

- **Claude Haiku** - Fast responses
- **Cost**: Low ($0.000001 input / $0.000005 output)
- **Use**: Quick queries, simple processing

### **Tier 3: OpenAI Fallbacks**
- **GPT-4 Turbo** - Strategic alternative
- **Cost**: High ($0.00001 input / $0.00003 output)
- **Use**: When Anthropic unavailable

- **GPT-3.5 Turbo** - Last resort
- **Cost**: Very Low ($0.0000005 input / $0.0000015 output)
- **Use**: Keep working when everything else limited

## 🧠 Smart Task Routing

**The system intelligently chooses models based on task complexity:**

### **Strategic Tasks** → Tier 1 Models (Opus, GPT-4)
- Strategic analysis
- Business advisory
- Competitive research
- Security assessments
- Complex reasoning

### **Balanced Tasks** → Tier 2 Models (Sonnet)
- Content generation
- Data processing
- Code review
- Research and analysis
- Planning

### **Fast Tasks** → Tier 3 Models (Haiku, GPT-3.5)
- Simple queries
- Formatting
- Basic processing
- Status checks
- Routine operations

## ⚡ Real-Time Monitoring

### **Dashboard Status Indicators**

**🟢 MONITORING** - All systems normal, preferred models available

**🟡 ACTIVE FAILOVER** - Some providers limited, using fallback models

**🔴 DISABLED** - Failover manager not running

### **Current Model Display**
```
Strategic Tasks: anthropic/claude-opus-4-6 (Tier 1)
Balanced Tasks: anthropic/claude-sonnet (Tier 2)  
Fast Tasks: anthropic/claude-haiku (Tier 3)
```

**During Failover:**
```
Strategic Tasks: openai/gpt-4-turbo (Tier 4) ⚠️
Balanced Tasks: openai/gpt-4-turbo (Tier 4) ⚠️
Fast Tasks: openai/gpt-3.5-turbo (Tier 6) ⚠️
```

### **Failover Event Log**
- **Real-time logging** of all rate limit hits
- **Recovery notifications** when providers come back online
- **Task-specific recommendations** for each fallback

## 🔧 How It Works Technically

### **Rate Limit Detection**
```javascript
// Monitors API responses for rate limit errors
HTTP 429: Too Many Requests → Trigger failover
Error: "rate limit exceeded" → Switch models  
Error: "quota exceeded" → Use next tier
```

### **Automatic Recovery**
```javascript
// Tracks rate limit reset times
Provider rate limited at: 2:15 PM
Estimated reset time: 2:16 PM (1 minute)
Auto-check every 30 seconds
At 2:16 PM: ✅ Test API call → Success → Revert to preferred
```

### **Integration with OpenClaw**
- **Transparent to your workflow** - you keep chatting with Kiva
- **No interruption** - seamless model switching behind the scenes
- **Preserves context** - same conversation, different engine
- **Cost optimization** - always uses cheapest available model for task type

## 📊 Usage Examples

### **Example 1: Strategic Analysis**
```
You: "Analyze CyphrCam's competitive positioning"

Normal: Claude Opus 4.6 handles strategic analysis
Rate Limited: GPT-4 Turbo takes over automatically  
Recovery: Back to Opus when limit resets

Result: Uninterrupted strategic advice
```

### **Example 2: Content Generation**
```
You: "Write Instagram post about dance creativity"

Normal: Claude Sonnet handles content creation
Rate Limited: GPT-4 Turbo or GPT-3.5 takes over
Recovery: Back to Sonnet when available

Result: Continuous content creation
```

### **Example 3: Quick Questions**
```
You: "What's my next calendar event?"

Normal: Claude Haiku for fast responses  
Rate Limited: GPT-3.5 Turbo (cheapest option)
Recovery: Back to Haiku

Result: Always get quick answers
```

## 🎮 Testing & Validation

### **Test Failover (Safe Testing)**
1. **Click "🧪 Test"** in dashboard
2. **Choose provider** to simulate rate limit
3. **Watch real-time changes**:
   - Status changes to "ACTIVE FAILOVER"
   - Model selections update to next tier
   - Event log shows failover recommendation
4. **Wait 1 minute** for auto-recovery
5. **Verify revert** to preferred models

### **Real Usage Monitoring**
```bash
# Console logs show real failover events
🚨 Rate limit hit for anthropic/claude-opus-4-6
🔄 Failover recommendation for strategic_analysis: openai/gpt-4-turbo
✅ anthropic limits cleared - reverted to preferred models
```

## 🛡️ Safeguards & Limits

### **Quota Monitoring**
- **Daily request limits** tracked per provider
- **Token usage monitoring** prevents overspend  
- **Consecutive failure detection** prevents endless retries

### **Cost Protection**
- **Always chooses cheapest available model** for task type
- **Avoids expensive models** for simple tasks during failover
- **Tracks total costs** across all providers

### **Graceful Degradation**
- **Never completely fails** - always has a fallback model
- **Maintains conversation flow** even with lowest-tier models
- **Preserves context** across model switches

## 📈 Benefits

### **Uninterrupted Workflow**
- **No more rate limit errors** stopping your work
- **Seamless OpenClaw usage** regardless of provider limits
- **24/7 AI availability** across multiple providers

### **Cost Optimization** 
- **Automatic best-price selection** for each task type
- **Fallback to cheaper models** when preferred unavailable
- **Intelligent routing** prevents overspend

### **Strategic Reliability**
- **Business continuity** during high-usage periods
- **Provider redundancy** - never dependent on single API
- **Smart recovery** back to preferred models

## 🚀 Ready to Never Hit Rate Limits Again?

### **Quick Start:**
1. `node server.js` → Start Mission Control
2. Usage & Costs tab → "🔄 Initialize" failover
3. **Start working** - failover happens automatically
4. **Test it** - simulate rate limits to see it work

### **Verification:**
- Make AI requests through OpenClaw
- Check dashboard shows model selections  
- Status should show "MONITORING"
- Test failover to see intelligent switching

---

**🎉 Your AI workflow is now bulletproof! Rate limits can't stop you anymore - the system automatically finds the best available model and seamlessly switches back when your preferred providers recover!**

**Never interrupt your creative flow again! 🚀**