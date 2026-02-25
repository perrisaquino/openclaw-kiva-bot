# 🧠 AI Model Configuration

## Strategic Brain: Claude Opus 4.6

**Mission Control now uses Claude Opus 4.6 for all high-level strategic reasoning tasks.**

### Why Opus 4.6?

- **Complex strategic analysis** - Advisory Council recommendations
- **Business planning** - Revenue projections, market analysis  
- **Competitive intelligence** - Deep market research and positioning
- **Risk assessment** - Security threats, political monitoring
- **System architecture** - Major feature design and integration

### Model Usage by Task Type:

| Task Type | Model | Reasoning |
|-----------|-------|-----------|
| **Strategic Planning** | Claude Opus 4.6 | Maximum reasoning for complex decisions |
| **Competitive Analysis** | Claude Opus 4.6 | Deep analytical capabilities needed |
| **Security Assessment** | Claude Opus 4.6 | Critical security decisions require best model |
| **Business Advisory** | Claude Opus 4.6 | Complex multi-factor business reasoning |
| **Data Processing** | Claude Sonnet 4 | Fast, efficient for routine operations |
| **Content Generation** | Claude Sonnet 4 | Good quality, cost-effective |
| **Simple Tasks** | Claude Haiku | Fast, cheap for basic operations |

### Cost Optimization Strategy:

1. **Strategic tasks** → Opus 4.6 (high value, worth the cost)
2. **Routine tasks** → Sonnet 4 (balanced performance/cost)  
3. **Simple operations** → Haiku (fast and cheap)

### Usage Tracking:

The new Usage & Costs tab tracks every API call:
- Model used for each task
- Input/output tokens
- Estimated cost per call
- Provider breakdown (Anthropic, OpenAI, Google, xAI)
- Daily/weekly/monthly cost analysis

### Implementation:

```javascript
// Strategic tasks use Opus 4.6
const strategicTasks = [
    'advisory_council',
    'competitive_analysis', 
    'security_assessment',
    'business_planning',
    'risk_analysis'
];

function getModelForTask(taskType) {
    if (strategicTasks.includes(taskType)) {
        return 'claude-opus-4-6';
    }
    return 'claude-sonnet-4-20250514'; // Default
}
```

### Cost Monitoring:

Mission Control automatically tracks:
- **Real-time cost tracking** across all providers
- **Model-specific usage patterns**
- **Task type cost analysis**  
- **Daily/monthly budget monitoring**
- **Cost optimization recommendations**

This ensures you get maximum strategic value from Opus 4.6 while optimizing costs for routine operations.