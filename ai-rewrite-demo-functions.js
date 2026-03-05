/**
 * Demo functions for AI Rewriting System in Mission Control
 */

// Demo function to show AI rewriting capabilities
function showAIRewriteDemo() {
    const demoText = `I've been building CyphrCam for dancers, and it's teaching me things I never expected. The technical challenges are wild, but what's really getting me is how much this connects to bigger questions about tools, community, and actually building what we need instead of waiting for someone else to do it.`;
    
    // Create demo modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10005;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--border-radius); width: 90%; max-width: 900px; max-height: 80vh; overflow-y: auto;">
            <div style="padding: var(--spacing-lg); border-bottom: 1px solid var(--card-border);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <h3 style="margin: 0; color: var(--accent);">✨ AI Rewriting Demo</h3>
                    <button onclick="this.closest('div').parentElement.parentElement.remove()" style="background: none; border: none; color: var(--text-muted); font-size: 1.25rem; cursor: pointer;">×</button>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 0;">Experience how the AI rewriting system transforms content using Perris's authentic voice patterns.</p>
            </div>
            
            <div style="padding: var(--spacing-lg);">
                <div style="margin-bottom: var(--spacing-lg);">
                    <h4 style="color: var(--text-secondary); margin-bottom: var(--spacing-sm);">Original Text:</h4>
                    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--card-border); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">${demoText}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                    <div>
                        <h4 style="color: var(--success); margin-bottom: var(--spacing-sm);">🔥 Make More Engaging</h4>
                        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">
                            So here's something that's been fucking with my head lately: I started building CyphrCam just to solve a problem for dancers, but it's teaching me things I never expected about how we actually create change. The technical stuff is wild - like, I'm literally learning Swift in real-time - but what's really getting me is how this connects to something way bigger. We keep waiting for the right tools to exist, but what if the act of building them ourselves is actually the point?
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--accent); margin-bottom: var(--spacing-sm);">🎯 Simplify</h4>
                        <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">
                            Here's what I'm learning: Building CyphrCam is teaching me way more than just how to make an app. Yeah, the coding is challenging as hell, but the real insights are about creating tools instead of waiting for them. There's something powerful about actually building what your community needs.
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-top: var(--spacing-lg);">
                    <div>
                        <h4 style="color: var(--warning); margin-bottom: var(--spacing-sm);">🔧 Add Technical Depth</h4>
                        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">
                            I've been building CyphrCam for dancers, and the technical architecture is teaching me unexpected lessons. We're dealing with real-time audio synchronization, video processing pipelines, and SwiftUI state management - but here's what's actually blowing my mind: every technical decision is also a philosophical one about how communities create their own tools. The AVFoundation challenges aren't just about code; they're about reimagining how artists access technology.
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-sm);">💬 More Conversational</h4>
                        <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid var(--card-border); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">
                            Can we talk about something? I started building this app for dancers - CyphrCam - thinking it would be pretty straightforward. But damn, it's been teaching me things I wasn't expecting. Like yeah, the technical stuff is intense, but what's really on my mind is how this connects to bigger questions about... I don't know, like actually building what we need instead of just complaining about what doesn't exist?
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-xl); text-align: center;">
                    <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 6px; padding: var(--spacing-md); margin-bottom: var(--spacing-md);">
                        <div style="color: var(--accent); font-weight: 600; margin-bottom: var(--spacing-xs);">Voice Pattern Analysis Applied:</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            ✓ Fellow seeker positioning ("I'm figuring this out...")
                            <br>✓ Vulnerability and learning-in-public 
                            <br>✓ Synthesis thinking (connects technical to philosophical)
                            <br>✓ Natural connectors ("And here's what's interesting...")
                            <br>✓ Community building questions
                        </div>
                    </div>
                    <button class="add-priority-btn" onclick="this.closest('div').parentElement.parentElement.parentElement.remove()">
                        Got it! Start Using AI Rewriter
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Function to enhance content items with AI
function enhanceWithAI(itemId, column) {
    // Get the content item
    const contentItems = getStoredData('contentItems', {});
    const item = contentItems[column]?.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Show enhancement options
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        z-index: 10003;
        min-width: 500px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
            <h4 style="margin: 0; color: var(--accent);">✨ AI Enhance: "${item.title}"</h4>
            <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; color: var(--text-muted); font-size: 1.25rem; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: var(--spacing-lg);">
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--spacing-md);">
                Choose how to enhance this content with AI:
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                <button class="enhancement-option" onclick="applyAIEnhancement('${itemId}', '${column}', 'title')">
                    <span style="font-size: 1.2rem; margin-bottom: 4px; display: block;">📝</span>
                    <strong>Enhance Title</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Make title more engaging using Perris's hook patterns</div>
                </button>
                
                <button class="enhancement-option" onclick="applyAIEnhancement('${itemId}', '${column}', 'description')">
                    <span style="font-size: 1.2rem; margin-bottom: 4px; display: block;">📄</span>
                    <strong>Enhance Description</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Add depth and Perris's voice to description</div>
                </button>
                
                <button class="enhancement-option" onclick="applyAIEnhancement('${itemId}', '${column}', 'outline')">
                    <span style="font-size: 1.2rem; margin-bottom: 4px; display: block;">📋</span>
                    <strong>Generate Outline</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Create article outline using Perris's structure templates</div>
                </button>
                
                <button class="enhancement-option" onclick="applyAIEnhancement('${itemId}', '${column}', 'full')">
                    <span style="font-size: 1.2rem; margin-bottom: 4px; display: block;">🚀</span>
                    <strong>Full Enhancement</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Complete AI enhancement package</div>
                </button>
            </div>
        </div>
        
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            Uses Perris's voice analysis patterns from content strategy files
        </div>
    `;

    // Style enhancement options
    modal.querySelectorAll('.enhancement-option').forEach(btn => {
        btn.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: var(--spacing-md);
            color: var(--text-primary);
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'var(--accent)';
            btn.style.borderColor = 'var(--accent)';
            btn.style.color = 'white';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
            btn.style.borderColor = 'var(--card-border)';
            btn.style.color = 'var(--text-primary)';
        });
    });

    document.body.appendChild(modal);
}

// Function to apply AI enhancement
function applyAIEnhancement(itemId, column, enhancementType) {
    // Get the content item
    const contentItems = getStoredData('contentItems', {});
    const item = contentItems[column]?.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Show processing state
    const processingModal = document.createElement('div');
    processingModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--border-radius);
        padding: var(--spacing-xl);
        z-index: 10004;
        text-align: center;
        min-width: 300px;
    `;

    processingModal.innerHTML = `
        <div style="color: var(--accent); font-size: 1.5rem; margin-bottom: var(--spacing-md);">✨</div>
        <h4 style="margin: 0 0 var(--spacing-md) 0;">Enhancing with AI...</h4>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
            Applying Perris's voice patterns and ${enhancementType} enhancement
        </div>
        <div style="margin-top: var(--spacing-lg);">
            <div style="width: 100%; height: 4px; background: var(--card-border); border-radius: 2px; overflow: hidden;">
                <div style="width: 0%; height: 100%; background: var(--accent); border-radius: 2px; transition: width 3s ease;" id="progressBar"></div>
            </div>
        </div>
    `;

    document.body.appendChild(processingModal);
    
    // Animate progress bar
    setTimeout(() => {
        document.getElementById('progressBar').style.width = '100%';
    }, 100);

    // Simulate AI processing and show results
    setTimeout(() => {
        document.body.removeChild(processingModal);
        
        // Mark item as AI enhanced
        item.aiEnhanced = true;
        
        // Apply enhancements based on type
        switch (enhancementType) {
            case 'title':
                item.title = enhanceTitle(item.title);
                break;
            case 'description':
                item.description = enhanceDescription(item.description);
                break;
            case 'outline':
                showGeneratedOutline(item);
                break;
            case 'full':
                item.title = enhanceTitle(item.title);
                item.description = enhanceDescription(item.description);
                item.wordCount = (item.wordCount || 0) + Math.floor(Math.random() * 500) + 200;
                break;
        }
        
        // Save changes
        storeData('contentItems', contentItems);
        
        // Re-render content pipeline
        renderContentPipeline(contentItems);
        
        // Close any open modals
        document.querySelectorAll('[style*="position: fixed"]').forEach(modal => {
            if (modal.style.zIndex === '10003') {
                modal.remove();
            }
        });
        
        // Show success message
        showSuccessMessage(`✨ "${item.title}" enhanced with AI using Perris's voice patterns!`);
        
    }, 3000);
}

// Helper functions for AI enhancements
function enhanceTitle(originalTitle) {
    const patterns = [
        "What {topic} taught me about {bigger_concept}",
        "I {action} and here's what broke (and what I learned)",
        "Why I'm {doing_thing} (and what it's teaching me about everything)",
        "The {unexpected_thing} I discovered while {main_activity}",
        "{specific_experience}: Here's what I learned about {universal_concept}"
    ];
    
    // For demo, just add Perris's style markers
    if (originalTitle.includes('tested')) {
        return "I tested my app on an 8-hour trip to Florida. Here's what broke (and what I learned about building in public).";
    } else if (originalTitle.includes('building')) {
        return `What ${originalTitle.toLowerCase()} taught me about community, tools, and actually creating change`;
    } else if (originalTitle.includes('Nickel')) {
        return "What Nickel taught me about making technology invisible (and why that changes everything)";
    } else {
        return `${originalTitle} (and what it's teaching me about everything)`;
    }
}

function enhanceDescription(originalDescription) {
    const voicePatterns = [
        "Here's what I'm learning:",
        "This connects to something bigger:",
        "What's really getting me is",
        "I'm still figuring this out, but"
    ];
    
    const pattern = voicePatterns[Math.floor(Math.random() * voicePatterns.length)];
    return `${pattern} ${originalDescription} This connects to broader questions about how we actually create the tools and communities we need.`;
}

function showGeneratedOutline(item) {
    const outlineModal = document.createElement('div');
    outlineModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        z-index: 10004;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    const outline = generatePerrisStyleOutline(item);

    outlineModal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
            <h4 style="margin: 0; color: var(--accent);">📋 AI-Generated Outline</h4>
            <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; color: var(--text-muted); font-size: 1.25rem; cursor: pointer;">×</button>
        </div>
        
        <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 6px; padding: var(--spacing-md); margin-bottom: var(--spacing-lg); font-size: 0.9rem;">
            <strong>Generated using Perris's "Walking With People" article structure:</strong>
            <br>Personal → Pattern → Principle → Practice
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 6px; padding: var(--spacing-md); font-family: monospace; font-size: 0.85rem; line-height: 1.6; white-space: pre-line;">${outline}</div>
        
        <div style="margin-top: var(--spacing-lg); display: flex; gap: var(--spacing-md); justify-content: center;">
            <button class="add-priority-btn" onclick="copyToClipboard('${outline.replace(/'/g, "\\'")}'); showSuccessMessage('Outline copied to clipboard!');">
                📋 Copy Outline
            </button>
            <button class="client-action-btn" onclick="this.closest('div').parentElement.remove();">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(outlineModal);
}

function generatePerrisStyleOutline(item) {
    return `# ${item.title}

## I. The Catalyst (400 words)
"So I've been diving into [${item.title.toLowerCase()}] because [personal reason/emotional trigger]. 
At first I thought [initial assumption], but then [mind-blown moment]..."

- Personal hook: Why this matters to me right now
- Initial assumptions vs. reality
- Emotional stakes and vulnerability
- Set up the learning journey

## II. The Excavation (1500 words)
"This is what I found: [specific discovery] and when you combine that with [related insight], 
you start seeing this pattern where [synthesis]..."

- Core discoveries and insights
- Cross-disciplinary connections
- Pattern recognition across multiple contexts
- Real-time connection-making process
- Include specific examples and sources

## III. The Integration (800 words)
"Here's what this means for us: [practical framework]. As someone who's [my specific background], 
I see how this applies to [broader context]..."

- Practical implications and applications
- How this connects to bigger themes
- Personal transformation and insights
- Broader systemic understanding

## IV. The Invitation (300 words)
"I'm still figuring this stuff out, and I thought someone else might find it interesting too. 
What patterns are you seeing? [genuine community questions]"

- Community building and dialogue
- Genuine curiosity about others' perspectives
- Resource sharing and next steps
- Maintain fellow-seeker positioning

## Voice Notes:
- Use natural connectors: "And here's what's interesting..."
- Include vulnerable moments: "This is fucking me up because..."
- Ask genuine questions from curiosity
- Show real-time processing: "I'm literally figuring this out as I write..."
- Connect to Filipino-American perspective where relevant
- End with community invitation, not expert positioning`;
}

// Utility functions
function showSuccessMessage(message) {
    const success = document.createElement('div');
    success.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: var(--spacing-md);
        border-radius: 6px;
        z-index: 10006;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 400px;
    `;
    success.textContent = message;
    
    document.body.appendChild(success);
    setTimeout(() => success.style.opacity = '1', 10);
    setTimeout(() => {
        success.style.opacity = '0';
        setTimeout(() => document.body.removeChild(success), 300);
    }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// Storage helper functions
function getStoredData(key, defaultValue = {}) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function storeData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}