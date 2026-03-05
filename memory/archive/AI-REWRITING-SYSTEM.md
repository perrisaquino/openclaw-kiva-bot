# AI-Powered Rewriting System for Mission Control

## Overview

A comprehensive AI-powered rewriting system integrated into the Mission Control content editor that transforms text using Perris's authentic voice patterns and writing frameworks. The system provides real-time text enhancement with model selection, preview capabilities, and cost tracking.

## ✨ Features

### Core Functionality
- **Text Selection Tools** - Highlight any paragraph or section in the editor
- **Right-Click Context Menu** - Quick access to rewrite options
- **Floating Toolbar** - Full-featured rewriting interface with advanced options
- **Real-Time Preview** - See AI suggestions before accepting changes
- **Track Changes** - Compare original vs. rewritten text
- **Undo/Redo** - Full history management for AI edits
- **Cost Tracking** - Monitor API usage and costs across models

### Model Selection
- **Claude Opus** (Deep Thinking) - Highest quality, complex reasoning
- **Claude Sonnet** (Speed) - Fast, balanced performance  
- **Claude Code** (Technical) - Precise, technical writing
- **Gemini Pro** (Creative) - Imaginative, creative approach

### Rewrite Options
- **🔥 Make Engaging** - Add hooks, stakes, and emotional resonance
- **🎯 Simplify** - Break down complexity while keeping depth
- **🔧 Add Technical Depth** - Explain technical concepts clearly
- **💬 More Conversational** - Natural, friendly tone
- **✂️ Shorten** - Condense while maintaining core message
- **📈 Expand** - Add examples, insights, and deeper exploration
- **Custom Prompt** - Specify exact rewriting instructions

## 🎯 Voice Integration

The system uses Perris's comprehensive voice analysis patterns from the content strategy files:

### Core Voice Characteristics
- **Fellow Seeker Positioning**: "I'm figuring this out too..."
- **Vulnerability & Learning-in-Public**: Shows confusion and growth process
- **Synthesis Thinking**: Connects ideas across disciplines
- **Intellectual Humility**: "Help me understand if I'm missing something..."
- **Community Building**: "What patterns are you seeing?"

### Language Patterns
- **Natural Connectors**: "And here's what's interesting..."
- **Authentic Reactions**: "holy shit", "that's wild", "fucking me up"
- **Real-Time Processing**: "I'm literally figuring this out as I write..."
- **Cultural Grounding**: Filipino-American perspective integration

### Strict Avoidances
- ❌ Guru positioning or "you should" statements
- ❌ Academic jargon without explanation
- ❌ Performative activism or virtue signaling
- ❌ Overly polished or hiding learning process
- ❌ Corporate speak or marketing language

## 🛠️ Technical Architecture

### File Structure
```
ai-rewriting-system.js       # Main rewriting interface and logic
openclaw-integration.js      # OpenClaw model routing integration
ai-rewrite-demo-functions.js # Demo functions and content enhancement
mission-control.html         # Integrated dashboard interface
```

### Integration Points

#### OpenClaw Model Routing
- Connects to OpenClaw Gateway at `http://localhost:8899`
- Supports multiple AI providers (Anthropic, Google, etc.)
- Automatic failover and cost optimization
- Real-time usage tracking and analytics

#### Voice Pattern Analysis
- Loads voice frameworks from `content-strategy/` directory
- Applies Perris's brand voice guidelines dynamically
- Uses article writing system templates
- Incorporates forbidden language patterns

#### Cost Management
- Per-request cost estimation
- Daily/monthly usage tracking
- Token consumption monitoring
- Model-specific cost analysis

## 🎮 Usage

### Quick Start
1. **Text Selection** - Highlight any text in the editor
2. **Access Options**:
   - Right-click for quick context menu
   - Press `Ctrl/Cmd + R` for instant "Make Engaging"
   - Press `Ctrl/Cmd + Shift + R` for full toolbar
3. **Choose Enhancement** - Select rewrite type and model
4. **Preview & Accept** - Review changes before applying
5. **Track Changes** - See before/after comparison

### Keyboard Shortcuts
- `Ctrl/Cmd + R` - Quick rewrite (Make Engaging)
- `Ctrl/Cmd + Shift + R` - Open full AI toolbar
- `Ctrl/Cmd + Z` - Undo AI changes
- `Ctrl/Cmd + Shift + Z` - Redo AI changes

### Advanced Features

#### Custom Prompting
```javascript
// Example custom prompt
"Rewrite this in Perris's voice, adding personal stakes and connecting to broader themes about tools and community building"
```

#### Batch Processing
- Select multiple text sections
- Apply consistent voice transformations
- Maintain narrative flow across sections

#### Content Pipeline Integration
- AI enhance article titles and descriptions
- Generate outlines using Perris's structure templates
- Full content enhancement packages

## 📊 Analytics & Tracking

### Usage Metrics
- Total requests and success rates
- Tokens consumed per model
- Cost breakdown by provider
- Session-based usage tracking

### Performance Insights
- Most effective rewrite types
- Model performance comparison
- Cost efficiency analysis
- User adoption patterns

### Export Capabilities
- Session summaries with full history
- Cost reports for budgeting
- Usage analytics for optimization

## 🔧 Configuration

### Model Settings
```javascript
models: {
    'claude-sonnet-4': {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        costPer1kTokens: 3.0,
        description: 'Fast, balanced performance'
    },
    // ... other models
}
```

### Voice Patterns
The system loads voice analysis from:
- `perris-voice-analysis-8-brand-voice-guidelines.md`
- `perris-voice-analysis-2-article-writing.md`
- `perris-voice-analysis-3-cognitive-profile.md`
- Plus additional voice framework files

### OpenClaw Integration
- Gateway URL configuration
- Authentication token management
- Request timeout and retry logic
- Fallback response generation

## 🎪 Demo Features

### Interactive Demo
- **Live Rewriting Examples** - See voice transformations in action
- **Before/After Comparisons** - Visual diff of rewriting results
- **Voice Pattern Analysis** - Shows which techniques were applied

### Content Enhancement
- **Article Outline Generation** - Creates Perris-style article structures
- **Title Enhancement** - Applies hook frameworks and voice patterns
- **Description Expansion** - Adds depth and authentic voice elements

## 🔒 Privacy & Security

### Data Handling
- No persistent storage of content on external servers
- Local processing with optional cloud AI enhancement
- User consent for AI processing
- Audit trail for all rewriting activities

### Cost Protection
- Usage limits and warnings
- Budget tracking and alerts
- Model selection optimization
- Request deduplication

## 🚀 Installation & Setup

### Requirements
- Modern web browser with JavaScript enabled
- OpenClaw Gateway (optional, has fallback)
- Content strategy voice analysis files

### Quick Setup
1. Include all JavaScript files in your HTML
2. Ensure content strategy files are accessible
3. Configure OpenClaw Gateway URL if available
4. Initialize on any textarea or content editor

### Development Setup
```bash
# Serve files locally
python -m http.server 8000
# or
npx serve .

# Access at http://localhost:8000/mission-control.html
```

## 🎯 Integration Examples

### Basic Integration
```javascript
// Initialize on any editor
const editor = document.querySelector('#myEditor');
const aiRewriter = new AIRewritingSystem(editor);
```

### Advanced Configuration
```javascript
const aiRewriter = new AIRewritingSystem(editor, {
    models: customModelConfig,
    voicePatterns: customVoiceConfig,
    costLimits: { daily: 5.00, monthly: 50.00 }
});
```

### Content Pipeline Integration
```javascript
// Enhance content items programmatically
aiRewriter.enhanceContent({
    text: contentText,
    type: 'engaging',
    model: 'claude-opus-3'
});
```

## 🔮 Future Enhancements

### Planned Features
- **Collaborative Editing** - Multi-user rewriting sessions
- **Voice Learning** - Adaptive improvement from user feedback
- **Template Library** - Pre-built content structures
- **A/B Testing** - Compare rewrite variations
- **Voice Consistency** - Maintain tone across long documents

### AI Capabilities
- **Context Awareness** - Understanding document structure
- **Style Transfer** - Apply voice to any content type
- **Sentiment Analysis** - Emotional tone optimization
- **Readability Scoring** - Automatic clarity assessment

## 📞 Support & Feedback

This AI rewriting system is designed to authentically capture Perris's voice while providing powerful content enhancement capabilities. The system learns and improves through usage, making each rewrite more aligned with the established voice patterns.

For technical issues or enhancement requests, the system provides detailed logging and analytics to support continuous improvement of the AI rewriting experience.

---

**✨ Transform any text into Perris's authentic voice with the power of AI-driven rewriting that understands community, vulnerability, and the art of learning in public.**