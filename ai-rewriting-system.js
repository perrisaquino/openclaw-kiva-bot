/**
 * AI-Powered Rewriting System for Mission Control Content Editor
 * Integrates with OpenClaw's model routing and Perris's voice frameworks
 */

class AIRewritingSystem {
    constructor(editorElement) {
        this.editor = editorElement;
        this.selectedText = '';
        this.selectedRange = null;
        this.currentModel = 'claude-sonnet-4';
        this.rewriteHistory = [];
        this.undoStack = [];
        this.redoStack = [];
        this.costTracker = {
            totalCost: 0,
            sessionsToday: 0,
            tokensUsed: 0
        };
        
        this.init();
        this.loadVoiceFrameworks();
    }

    init() {
        this.createFloatingToolbar();
        this.setupTextSelection();
        this.setupKeyboardShortcuts();
        this.setupContextMenu();
        this.loadCostData();
    }

    // Load Perris's voice analysis patterns
    async loadVoiceFrameworks() {
        try {
            // Load voice patterns from content strategy files
            this.voicePatterns = {
                brandVoice: await this.fetchVoiceData('perris-voice-analysis-8-brand-voice-guidelines.md'),
                articleWriting: await this.fetchVoiceData('perris-voice-analysis-2-article-writing.md'),
                cognitiveProfile: await this.fetchVoiceData('perris-voice-analysis-3-cognitive-profile.md'),
                jargonPatterns: await this.fetchVoiceData('perris-voice-analysis-5-jargon-patterns.md'),
                forbiddenLanguage: await this.fetchVoiceData('perris-voice-analysis-6-forbidden-language.md'),
                hookFramework: await this.fetchVoiceData('perris-voice-analysis-7-hook-framework.md')
            };
            
            this.createVoicePrompts();
        } catch (error) {
            console.warn('Could not load voice frameworks, using fallback patterns:', error);
            this.setupFallbackVoice();
        }
    }

    async fetchVoiceData(filename) {
        const response = await fetch(`content-strategy/${filename}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return await response.text();
    }

    createVoicePrompts() {
        this.voicePrompts = {
            authentic: `
                Write in Perris's authentic voice. Key patterns:
                - Fellow seeker positioning: "I'm figuring this out too..." 
                - Vulnerability: Share confusion and learning process
                - Natural connectors: "And here's what's interesting..." "This connects to..."
                - Intellectual humility: "Help me understand if I'm missing something..."
                - Community building: "What patterns are you seeing?"
                - Avoid guru positioning, academic jargon, or "you should" statements
                - Use synthesis thinking - connect ideas across disciplines
                - Show real-time processing: "I'm literally figuring this out as I write..."
            `,
            conversational: `
                Make this sound like Perris talking to a friend:
                - Use natural speech patterns and contractions
                - Include authentic reactions: "holy shit", "that's wild"
                - Ask genuine questions from curiosity
                - Share personal stakes and vulnerability
                - Use "So I've been thinking..." or "Can we talk about..."
                - Keep the learning-in-public energy
            `,
            technical: `
                Explain technical concepts in Perris's accessible style:
                - Break down complexity without dumbing down
                - Use analogies from dance/movement when relevant
                - Acknowledge when something is difficult to understand
                - Connect technical details to human impact
                - "Here's what this actually means for us..."
                - Maintain curiosity and wonder about how things work
            `,
            engaging: `
                Increase engagement while staying authentic to Perris:
                - Start with personal hooks and emotional entry points
                - Use pattern recognition: "I started seeing this everywhere..."
                - Create "holy shit" moments with unexpected connections
                - Include stakes: why this matters now
                - End with genuine community questions
                - Balance urgency with care and self-compassion
            `
        };
    }

    setupFallbackVoice() {
        this.voicePrompts = {
            authentic: "Write in a genuine, vulnerable voice that shows the learning process.",
            conversational: "Make this sound natural and conversational, like talking to a friend.",
            technical: "Explain technical concepts clearly while maintaining human connection.",
            engaging: "Increase engagement through personal stories and genuine curiosity."
        };
    }

    createFloatingToolbar() {
        // Create the main floating toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'ai-rewrite-toolbar';
        this.toolbar.style.cssText = `
            position: absolute;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--border-radius);
            backdrop-filter: blur(20px);
            padding: var(--spacing-md);
            z-index: 10000;
            display: none;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            min-width: 320px;
        `;

        this.toolbar.innerHTML = `
            <div class="rewrite-toolbar-header">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <h4 style="margin: 0; color: var(--accent); font-size: 0.9rem;">✨ AI Rewriter</h4>
                    <div style="display: flex; gap: var(--spacing-xs);">
                        <button class="toolbar-btn" id="previewBtn" style="background: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">Preview</button>
                        <button class="toolbar-btn" id="closeToolbarBtn" style="background: none; border: none; color: var(--text-muted); font-size: 1rem;">×</button>
                    </div>
                </div>
                
                <div style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-md);">
                    <select id="modelSelect" style="flex: 1; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 4px; padding: 4px 8px; color: var(--text-primary); font-size: 0.8rem;">
                        <option value="claude-sonnet-4">Claude Sonnet (Speed)</option>
                        <option value="claude-opus-3">Claude Opus (Deep Thinking)</option>
                        <option value="claude-code-3">Claude Code (Technical)</option>
                        <option value="gemini-pro">Gemini Pro (Creative)</option>
                    </select>
                    <div id="costDisplay" style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; padding: 4px 8px;">
                        $0.00
                    </div>
                </div>
            </div>
            
            <div class="rewrite-options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xs); margin-bottom: var(--spacing-md);">
                <button class="rewrite-option-btn" data-prompt="engaging">🔥 More Engaging</button>
                <button class="rewrite-option-btn" data-prompt="simplify">🎯 Simplify</button>
                <button class="rewrite-option-btn" data-prompt="technical">🔧 Add Depth</button>
                <button class="rewrite-option-btn" data-prompt="conversational">💬 Conversational</button>
                <button class="rewrite-option-btn" data-prompt="shorten">✂️ Shorten</button>
                <button class="rewrite-option-btn" data-prompt="expand">📈 Expand</button>
            </div>
            
            <div class="custom-prompt-section" style="margin-bottom: var(--spacing-md);">
                <textarea id="customPrompt" placeholder="Custom rewrite instructions..." style="width: 100%; min-height: 60px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 4px; padding: var(--spacing-sm); color: var(--text-primary); font-size: 0.8rem; resize: vertical;"></textarea>
                <button id="customRewriteBtn" class="rewrite-option-btn" style="width: 100%; margin-top: var(--spacing-xs);">Custom Rewrite</button>
            </div>
            
            <div class="toolbar-footer" style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--spacing-sm); border-top: 1px solid var(--card-border); font-size: 0.75rem; color: var(--text-muted);">
                <span id="selectionInfo">No text selected</span>
                <div style="display: flex; gap: var(--spacing-xs);">
                    <button id="undoBtn" class="toolbar-btn" disabled>↶ Undo</button>
                    <button id="redoBtn" class="toolbar-btn" disabled>↷ Redo</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.toolbar);
        this.setupToolbarEvents();
    }

    setupToolbarEvents() {
        // Close toolbar
        document.getElementById('closeToolbarBtn').addEventListener('click', () => {
            this.hideToolbar();
        });

        // Model selection
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.updateCostDisplay();
        });

        // Rewrite option buttons
        document.querySelectorAll('.rewrite-option-btn').forEach(btn => {
            btn.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--card-border);
                border-radius: 6px;
                padding: var(--spacing-xs) var(--spacing-sm);
                color: var(--text-primary);
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'var(--accent)';
                btn.style.color = 'white';
                btn.style.borderColor = 'var(--accent)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.05)';
                btn.style.color = 'var(--text-primary)';
                btn.style.borderColor = 'var(--card-border)';
            });
            
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                if (prompt) {
                    this.executeRewrite(prompt);
                }
            });
        });

        // Custom rewrite
        document.getElementById('customRewriteBtn').addEventListener('click', () => {
            const customPrompt = document.getElementById('customPrompt').value.trim();
            if (customPrompt) {
                this.executeRewrite('custom', customPrompt);
            }
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.togglePreviewMode();
        });

        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
    }

    setupTextSelection() {
        this.editor.addEventListener('mouseup', (e) => {
            this.handleTextSelection(e);
        });

        this.editor.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.handleTextSelection(e);
            }
        });

        // Hide toolbar when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!this.toolbar.contains(e.target) && e.target !== this.editor) {
                this.hideToolbar();
            }
        });
    }

    handleTextSelection(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            this.selectedText = selectedText;
            this.selectedRange = selection.getRangeAt(0);
            this.showToolbar(e);
        } else {
            this.hideToolbar();
        }
    }

    showToolbar(e) {
        const rect = this.selectedRange.getBoundingClientRect();
        const toolbarRect = this.toolbar.getBoundingClientRect();
        
        // Position toolbar above selection
        let top = rect.top - toolbarRect.height - 10;
        let left = rect.left + (rect.width / 2) - (toolbarRect.width / 2);
        
        // Keep toolbar in viewport
        if (top < 10) {
            top = rect.bottom + 10;
        }
        if (left < 10) {
            left = 10;
        }
        if (left + toolbarRect.width > window.innerWidth - 10) {
            left = window.innerWidth - toolbarRect.width - 10;
        }
        
        this.toolbar.style.top = `${top}px`;
        this.toolbar.style.left = `${left}px`;
        this.toolbar.style.display = 'block';
        
        // Update selection info
        const wordCount = this.selectedText.split(/\s+/).length;
        document.getElementById('selectionInfo').textContent = 
            `${this.selectedText.length} chars, ${wordCount} words`;
    }

    hideToolbar() {
        this.toolbar.style.display = 'none';
    }

    setupContextMenu() {
        this.editor.addEventListener('contextmenu', (e) => {
            const selection = window.getSelection();
            if (selection.toString().trim().length > 0) {
                e.preventDefault();
                this.showQuickContextMenu(e);
            }
        });
    }

    showQuickContextMenu(e) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'ai-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            backdrop-filter: blur(20px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            min-width: 150px;
        `;

        contextMenu.innerHTML = `
            <div style="padding: var(--spacing-xs);">
                <button class="context-menu-item" data-action="engaging">🔥 Make Engaging</button>
                <button class="context-menu-item" data-action="simplify">🎯 Simplify</button>
                <button class="context-menu-item" data-action="expand">📈 Expand</button>
                <hr style="border: none; border-top: 1px solid var(--card-border); margin: var(--spacing-xs) 0;">
                <button class="context-menu-item" data-action="toolbar">⚙️ Full Toolbar</button>
            </div>
        `;

        document.body.appendChild(contextMenu);

        // Style context menu items
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.style.cssText = `
                width: 100%;
                background: none;
                border: none;
                text-align: left;
                padding: var(--spacing-xs) var(--spacing-sm);
                color: var(--text-primary);
                font-size: 0.8rem;
                cursor: pointer;
                border-radius: 4px;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--accent)';
                item.style.color = 'white';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'none';
                item.style.color = 'var(--text-primary)';
            });
            
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'toolbar') {
                    this.showToolbar(e);
                } else {
                    this.executeRewrite(action);
                }
                document.body.removeChild(contextMenu);
            });
        });

        // Remove context menu on click elsewhere
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }

    setupKeyboardShortcuts() {
        this.editor.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R for quick rewrite
            if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !e.shiftKey) {
                e.preventDefault();
                const selection = window.getSelection();
                if (selection.toString().trim()) {
                    this.executeRewrite('engaging');
                }
            }
            
            // Ctrl/Cmd + Shift + R for toolbar
            if ((e.ctrlKey || e.metaKey) && e.key === 'R') {
                e.preventDefault();
                const selection = window.getSelection();
                if (selection.toString().trim()) {
                    this.selectedText = selection.toString().trim();
                    this.selectedRange = selection.getRangeAt(0);
                    this.showToolbar(e);
                }
            }
            
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                if (this.undoStack.length > 0) {
                    e.preventDefault();
                    this.undo();
                }
            }
            
            // Ctrl/Cmd + Shift + Z for redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
                if (this.redoStack.length > 0) {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }

    async executeRewrite(promptType, customPrompt = '') {
        if (!this.selectedText || !this.selectedRange) {
            console.warn('No text selected for rewriting');
            return;
        }

        this.showLoadingState();
        
        try {
            const rewrittenText = await this.callOpenClawAPI(promptType, customPrompt);
            
            if (rewrittenText) {
                this.showPreview(rewrittenText, promptType);
                this.updateCostTracking();
            }
        } catch (error) {
            console.error('Rewrite failed:', error);
            this.showError('Rewrite failed. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    async callOpenClawAPI(promptType, customPrompt = '') {
        // Use OpenClaw integration for model routing
        if (window.openClawIntegration) {
            try {
                const result = await window.openClawIntegration.rewriteText({
                    text: this.selectedText,
                    promptType: promptType,
                    customPrompt: customPrompt,
                    modelId: this.currentModel,
                    voicePrompts: this.voicePrompts,
                    temperature: 0.7
                });

                // Update cost tracking with actual costs
                if (result.cost) {
                    this.costTracker.totalCost += result.cost;
                    this.costTracker.tokensUsed += result.usage?.total_tokens || 0;
                    this.saveCostData();
                }

                return result.text;
            } catch (error) {
                console.error('OpenClaw integration error:', error);
                return this.getMockRewrite(promptType);
            }
        } else {
            console.warn('OpenClaw integration not available, using mock response');
            return this.getMockRewrite(promptType);
        }
    }

    buildBasePrompt() {
        return `You are helping rewrite content in Perris's authentic voice. Key voice characteristics:

CORE VOICE DNA:
- Fellow seeker positioning (not expert/guru): "I'm figuring this out too..."
- Vulnerability and learning-in-public: "This is fucking me up because..."
- Synthesis thinking: connects ideas across disciplines
- Intellectual humility: "Help me understand if I'm missing something..."
- Community building: "What patterns are you seeing?"

LANGUAGE PATTERNS:
- Natural connectors: "And here's what's interesting..." "This connects to..."
- Authentic reactions: "holy shit", "that's wild"
- Real-time processing: "I'm literally figuring this out as I write..."
- Cultural bridges: uses Filipino-American perspective

AVOID:
- Guru positioning or "you should" statements
- Academic jargon without explanation  
- Performative activism or virtue signaling
- Being overly polished or hiding the learning process`;
    }

    calculateMaxTokens() {
        const inputTokens = Math.ceil(this.selectedText.length / 4);
        return Math.min(Math.max(inputTokens * 2, 150), 2000);
    }

    getMockRewrite(promptType) {
        // Fallback responses for demo purposes
        const mockRewrites = {
            engaging: `So here's something that's been fucking with my head lately: ${this.selectedText.toLowerCase()}. And the more I think about it, the more I realize this connects to something way bigger...`,
            simplify: `Here's what I'm learning: ${this.selectedText.split(' ').slice(0, 10).join(' ')}... Let me break this down.`,
            technical: `The technical side of this is wild. ${this.selectedText} Here's what's actually happening under the hood...`,
            conversational: `Can we talk about something? ${this.selectedText.replace(/\./g, '...')} I'm still figuring this out, but thought you might find it interesting.`,
            shorten: this.selectedText.split(' ').slice(0, Math.max(5, Math.floor(this.selectedText.split(' ').length / 2))).join(' ') + '...',
            expand: `${this.selectedText} Let me dig deeper into this because there's a pattern here I keep seeing everywhere...`
        };
        
        return mockRewrites[promptType] || this.selectedText;
    }

    showPreview(rewrittenText, promptType) {
        this.currentPreview = {
            original: this.selectedText,
            rewritten: rewrittenText,
            promptType: promptType,
            range: this.selectedRange
        };

        // Create preview modal
        const previewModal = this.createPreviewModal(rewrittenText, promptType);
        document.body.appendChild(previewModal);
    }

    createPreviewModal(rewrittenText, promptType) {
        const modal = document.createElement('div');
        modal.className = 'ai-preview-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const originalWords = this.selectedText.split(' ').length;
        const rewrittenWords = rewrittenText.split(' ').length;
        const wordDiff = rewrittenWords - originalWords;
        const wordDiffText = wordDiff > 0 ? `+${wordDiff}` : wordDiff.toString();

        modal.innerHTML = `
            <div style="background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--border-radius); width: 90%; max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <div style="padding: var(--spacing-lg); border-bottom: 1px solid var(--card-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <h3 style="margin: 0; color: var(--accent);">✨ AI Rewrite Preview</h3>
                        <div style="display: flex; gap: var(--spacing-sm);">
                            <span style="background: var(--accent); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${promptType}</span>
                            <button id="closePreviewBtn" style="background: none; border: none; color: var(--text-muted); font-size: 1.25rem; cursor: pointer;">×</button>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                        <div>
                            <h4 style="color: var(--text-secondary); margin-bottom: var(--spacing-sm); font-size: 0.9rem;">Original (${originalWords} words)</h4>
                            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">${this.selectedText}</div>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--success); margin-bottom: var(--spacing-sm); font-size: 0.9rem;">Rewritten (${rewrittenWords} words, ${wordDiffText})</h4>
                            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: var(--spacing-md); font-size: 0.9rem; line-height: 1.5;">${rewrittenText}</div>
                        </div>
                    </div>
                </div>
                
                <div style="padding: var(--spacing-lg); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <button id="acceptRewriteBtn" style="background: var(--accent); color: white; border: none; padding: var(--spacing-sm) var(--spacing-md); border-radius: 6px; font-weight: 500; cursor: pointer;">✓ Accept Changes</button>
                        <button id="rejectRewriteBtn" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; padding: var(--spacing-sm) var(--spacing-md); border-radius: 6px; font-weight: 500; cursor: pointer;">✗ Reject</button>
                        <button id="modifyRewriteBtn" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid #f59e0b; padding: var(--spacing-sm) var(--spacing-md); border-radius: 6px; font-weight: 500; cursor: pointer;">✎ Modify</button>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                        Cost: ~$${this.estimateCost(rewrittenText)} • Model: ${this.currentModel}
                    </div>
                </div>
            </div>
        `;

        // Setup modal events
        modal.querySelector('#closePreviewBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#acceptRewriteBtn').addEventListener('click', () => {
            this.acceptRewrite();
            document.body.removeChild(modal);
        });

        modal.querySelector('#rejectRewriteBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#modifyRewriteBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showModificationDialog();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        return modal;
    }

    acceptRewrite() {
        if (!this.currentPreview) return;

        // Save to undo stack
        this.undoStack.push({
            range: this.currentPreview.range.cloneRange(),
            text: this.currentPreview.original,
            timestamp: Date.now()
        });
        
        // Clear redo stack
        this.redoStack = [];

        // Replace text in editor
        this.currentPreview.range.deleteContents();
        this.currentPreview.range.insertNode(document.createTextNode(this.currentPreview.rewritten));

        // Update rewrite history
        this.rewriteHistory.push({
            original: this.currentPreview.original,
            rewritten: this.currentPreview.rewritten,
            promptType: this.currentPreview.promptType,
            timestamp: Date.now(),
            model: this.currentModel
        });

        // Update UI state
        this.updateUndoRedoButtons();
        this.hideToolbar();
        
        // Show success feedback
        this.showSuccessFeedback();

        // Clear current preview
        this.currentPreview = null;
    }

    undo() {
        if (this.undoStack.length === 0) return;

        const lastAction = this.undoStack.pop();
        
        // Save current state to redo stack
        const currentRange = lastAction.range.cloneRange();
        const currentText = currentRange.toString();
        this.redoStack.push({
            range: currentRange,
            text: currentText,
            timestamp: Date.now()
        });

        // Restore previous state
        lastAction.range.deleteContents();
        lastAction.range.insertNode(document.createTextNode(lastAction.text));

        this.updateUndoRedoButtons();
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const nextAction = this.redoStack.pop();
        
        // Save current state to undo stack
        const currentRange = nextAction.range.cloneRange();
        const currentText = currentRange.toString();
        this.undoStack.push({
            range: currentRange,
            text: currentText,
            timestamp: Date.now()
        });

        // Apply redo action
        nextAction.range.deleteContents();
        nextAction.range.insertNode(document.createTextNode(nextAction.text));

        this.updateUndoRedoButtons();
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) undoBtn.disabled = this.undoStack.length === 0;
        if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;
    }

    showModificationDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--border-radius);
            padding: var(--spacing-lg);
            z-index: 10003;
            min-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;

        dialog.innerHTML = `
            <h4 style="margin-bottom: var(--spacing-md); color: var(--accent);">✎ Modify Rewrite</h4>
            <textarea id="modifyText" style="width: 100%; min-height: 120px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 6px; padding: var(--spacing-md); color: var(--text-primary); font-size: 0.9rem; resize: vertical; margin-bottom: var(--spacing-md);">${this.currentPreview.rewritten}</textarea>
            <div style="display: flex; justify-content: space-between;">
                <button id="cancelModifyBtn" style="background: var(--card-border); color: var(--text-secondary); border: none; padding: var(--spacing-sm) var(--spacing-md); border-radius: 6px; cursor: pointer;">Cancel</button>
                <button id="saveModifyBtn" style="background: var(--accent); color: white; border: none; padding: var(--spacing-sm) var(--spacing-md); border-radius: 6px; cursor: pointer;">Save Changes</button>
            </div>
        `;

        document.body.appendChild(dialog);

        dialog.querySelector('#cancelModifyBtn').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        dialog.querySelector('#saveModifyBtn').addEventListener('click', () => {
            const modifiedText = dialog.querySelector('#modifyText').value;
            this.currentPreview.rewritten = modifiedText;
            this.acceptRewrite();
            document.body.removeChild(dialog);
        });
    }

    showLoadingState() {
        document.querySelectorAll('.rewrite-option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
        
        const loadingBtn = document.querySelector('.rewrite-option-btn[data-loading="true"]');
        if (loadingBtn) {
            loadingBtn.textContent = '⏳ Processing...';
        }
    }

    hideLoadingState() {
        document.querySelectorAll('.rewrite-option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }

    showSuccessFeedback() {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: var(--spacing-md);
            border-radius: 6px;
            z-index: 10004;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        feedback.textContent = '✓ Text rewritten successfully';
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.style.opacity = '1', 10);
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => document.body.removeChild(feedback), 300);
        }, 2000);
    }

    showError(message) {
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: var(--spacing-md);
            border-radius: 6px;
            z-index: 10004;
        `;
        error.textContent = `✗ ${message}`;
        
        document.body.appendChild(error);
        setTimeout(() => document.body.removeChild(error), 3000);
    }

    updateCostTracking() {
        this.costTracker.sessionsToday++;
        this.costTracker.tokensUsed += this.calculateMaxTokens();
        
        const estimatedCost = this.estimateCost(this.currentPreview?.rewritten || '');
        this.costTracker.totalCost += parseFloat(estimatedCost);
        
        this.updateCostDisplay();
        this.saveCostData();
    }

    updateCostDisplay() {
        const costDisplay = document.getElementById('costDisplay');
        if (costDisplay) {
            costDisplay.textContent = `$${this.costTracker.totalCost.toFixed(4)}`;
        }
    }

    estimateCost(text) {
        // Rough cost estimation based on model and text length
        const tokenCount = Math.ceil(text.length / 4);
        const costs = {
            'claude-sonnet-4': 0.003,
            'claude-opus-3': 0.015,
            'claude-code-3': 0.003,
            'gemini-pro': 0.0015
        };
        const costPerToken = (costs[this.currentModel] || 0.003) / 1000;
        return (tokenCount * costPerToken).toFixed(4);
    }

    loadCostData() {
        const saved = localStorage.getItem('ai-rewriter-costs');
        if (saved) {
            this.costTracker = { ...this.costTracker, ...JSON.parse(saved) };
        }
        this.updateCostDisplay();
    }

    saveCostData() {
        localStorage.setItem('ai-rewriter-costs', JSON.stringify(this.costTracker));
    }

    // Public API methods
    getRewriteHistory() {
        return this.rewriteHistory;
    }

    getCostSummary() {
        return this.costTracker;
    }

    exportRewriteSession() {
        return {
            history: this.rewriteHistory,
            costs: this.costTracker,
            timestamp: Date.now()
        };
    }

    clearHistory() {
        this.rewriteHistory = [];
        this.costTracker = { totalCost: 0, sessionsToday: 0, tokensUsed: 0 };
        this.saveCostData();
        this.updateCostDisplay();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with a content editor
    const contentEditor = document.querySelector('.notes-textarea, #notesTextarea, .intel-textarea, textarea[placeholder*="content"], textarea[placeholder*="article"]');
    
    if (contentEditor) {
        console.log('Initializing AI Rewriting System...');
        window.aiRewriter = new AIRewritingSystem(contentEditor);
        
        // Add visual indicator that AI rewriting is active
        contentEditor.style.borderLeft = '3px solid var(--accent)';
        contentEditor.setAttribute('title', 'AI Rewriting enabled - Select text and right-click or press Ctrl+R');
        
        console.log('AI Rewriting System ready! Select text and:');
        console.log('- Right-click for quick options');
        console.log('- Ctrl/Cmd + R for quick rewrite');
        console.log('- Ctrl/Cmd + Shift + R for full toolbar');
    }
});