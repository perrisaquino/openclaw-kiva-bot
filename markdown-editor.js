// Integrated Markdown Editor for Mission Control Content Pipeline
// Replaces broken obsidian:// links with professional editing environment

class MarkdownEditor {
    constructor() {
        this.currentFile = null;
        this.editor = null;
        this.preview = null;
        this.isWysiwygMode = true;
        this.autoSaveInterval = null;
        this.observers = new Set();
        
        this.init();
    }
    
    init() {
        this.createEditorModal();
        this.setupEventListeners();
        this.initializeLibraries();
    }
    
    createEditorModal() {
        const modalHTML = `
            <div id="markdownEditorModal" class="markdown-editor-modal">
                <div class="markdown-editor-container">
                    <!-- Header -->
                    <div class="markdown-editor-header">
                        <div class="editor-title">
                            <h3 id="editorFileName">Untitled Document</h3>
                            <div class="file-path" id="editorFilePath"></div>
                        </div>
                        <div class="editor-controls">
                            <div class="view-toggle">
                                <button id="wysiwygModeBtn" class="view-btn active">📝 Rich Text</button>
                                <button id="markdownModeBtn" class="view-btn">⚡ Markdown</button>
                                <button id="splitModeBtn" class="view-btn">📊 Split View</button>
                            </div>
                            <div class="editor-actions">
                                <button id="saveBtn" class="action-btn primary">💾 Save</button>
                                <button id="aiRewriteBtn" class="action-btn">🤖 AI Rewrite</button>
                                <button id="closeEditorBtn" class="action-btn">✕ Close</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Editor Body -->
                    <div class="markdown-editor-body">
                        <!-- WYSIWYG Editor -->
                        <div id="wysiwygContainer" class="editor-container">
                            <div id="wysiwygToolbar" class="editor-toolbar">
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-command="bold" title="Bold (Ctrl+B)">
                                        <strong>B</strong>
                                    </button>
                                    <button class="toolbar-btn" data-command="italic" title="Italic (Ctrl+I)">
                                        <em>I</em>
                                    </button>
                                    <button class="toolbar-btn" data-command="strikethrough" title="Strikethrough">
                                        <s>S</s>
                                    </button>
                                </div>
                                <div class="toolbar-group">
                                    <select class="toolbar-select" data-command="formatBlock" title="Text Style">
                                        <option value="p">Paragraph</option>
                                        <option value="h1">Heading 1</option>
                                        <option value="h2">Heading 2</option>
                                        <option value="h3">Heading 3</option>
                                        <option value="h4">Heading 4</option>
                                        <option value="h5">Heading 5</option>
                                        <option value="h6">Heading 6</option>
                                    </select>
                                </div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">
                                        • List
                                    </button>
                                    <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">
                                        1. List
                                    </button>
                                    <button class="toolbar-btn" data-command="outdent" title="Decrease Indent">
                                        ←
                                    </button>
                                    <button class="toolbar-btn" data-command="indent" title="Increase Indent">
                                        →
                                    </button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-command="createLink" title="Insert Link">
                                        🔗 Link
                                    </button>
                                    <button class="toolbar-btn" data-command="insertHorizontalRule" title="Horizontal Line">
                                        ―
                                    </button>
                                    <button class="toolbar-btn" id="insertCodeBlock" title="Code Block">
                                        &lt;/&gt;
                                    </button>
                                </div>
                            </div>
                            <div id="wysiwygEditor" class="wysiwyg-editor" contenteditable="true"></div>
                        </div>
                        
                        <!-- Markdown Editor -->
                        <div id="markdownContainer" class="editor-container" style="display: none;">
                            <div id="markdownToolbar" class="editor-toolbar">
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-markdown="**text**" title="Bold">
                                        <strong>B</strong>
                                    </button>
                                    <button class="toolbar-btn" data-markdown="*text*" title="Italic">
                                        <em>I</em>
                                    </button>
                                    <button class="toolbar-btn" data-markdown="~~text~~" title="Strikethrough">
                                        <s>S</s>
                                    </button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-markdown="# " title="Heading 1">H1</button>
                                    <button class="toolbar-btn" data-markdown="## " title="Heading 2">H2</button>
                                    <button class="toolbar-btn" data-markdown="### " title="Heading 3">H3</button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-markdown="- " title="Bullet List">• List</button>
                                    <button class="toolbar-btn" data-markdown="1. " title="Numbered List">1. List</button>
                                    <button class="toolbar-btn" data-markdown="> " title="Quote">Quote</button>
                                </div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" data-markdown="[text](url)" title="Link">🔗 Link</button>
                                    <button class="toolbar-btn" data-markdown="\`code\`" title="Inline Code">Code</button>
                                    <button class="toolbar-btn" id="insertMarkdownCodeBlock" title="Code Block">&lt;/&gt;</button>
                                </div>
                            </div>
                            <div id="markdownEditor" class="markdown-source-editor"></div>
                        </div>
                        
                        <!-- Split View -->
                        <div id="splitContainer" class="split-view-container" style="display: none;">
                            <div class="split-left">
                                <div class="split-header">📝 Editor</div>
                                <div id="splitMarkdownEditor" class="split-markdown-editor"></div>
                            </div>
                            <div class="split-divider"></div>
                            <div class="split-right">
                                <div class="split-header">👁️ Preview</div>
                                <div id="splitPreview" class="split-preview"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="markdown-editor-footer">
                        <div class="editor-status">
                            <span id="editorStats">0 words, 0 characters</span>
                            <span id="autoSaveStatus">Auto-saved</span>
                            <span id="editorMode">Rich Text Mode</span>
                        </div>
                        <div class="section-editor">
                            <button id="sectionSelectBtn" class="action-btn secondary">📝 Select Section</button>
                            <button id="sectionRewriteBtn" class="action-btn secondary">🔄 Rewrite Section</button>
                        </div>
                    </div>
                    
                    <!-- AI Rewrite Panel -->
                    <div id="aiRewritePanel" class="ai-rewrite-panel" style="display: none;">
                        <div class="ai-panel-header">
                            <h4>🤖 AI Rewriting Assistant</h4>
                            <button id="closeAiPanel" class="close-btn">✕</button>
                        </div>
                        <div class="ai-panel-body">
                            <div class="model-selection">
                                <label>Model:</label>
                                <select id="aiModelSelect">
                                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Quality)</option>
                                    <option value="claude-3-opus">Claude 3 Opus (Premium)</option>
                                    <option value="claude-3-haiku">Claude 3 Haiku (Speed)</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                            <div class="rewrite-options">
                                <label>Rewrite Style:</label>
                                <div class="option-buttons">
                                    <button class="option-btn" data-style="improve">✨ Improve</button>
                                    <button class="option-btn" data-style="expand">📈 Expand</button>
                                    <button class="option-btn" data-style="simplify">🎯 Simplify</button>
                                    <button class="option-btn" data-style="professional">💼 Professional</button>
                                    <button class="option-btn" data-style="casual">😊 Casual</button>
                                    <button class="option-btn" data-style="creative">🎨 Creative</button>
                                </div>
                            </div>
                            <div class="custom-prompt">
                                <label>Custom Instructions:</label>
                                <textarea id="customPrompt" placeholder="Enter specific instructions for the AI rewrite..."></textarea>
                            </div>
                            <div class="ai-actions">
                                <button id="runRewriteBtn" class="action-btn primary">🚀 Rewrite</button>
                                <button id="cancelRewriteBtn" class="action-btn secondary">Cancel</button>
                            </div>
                        </div>
                        <div id="aiResults" class="ai-results" style="display: none;">
                            <h4>Rewritten Version:</h4>
                            <div id="aiRewriteOutput" class="ai-output"></div>
                            <div class="result-actions">
                                <button id="acceptRewriteBtn" class="action-btn primary">✅ Accept</button>
                                <button id="discardRewriteBtn" class="action-btn secondary">❌ Discard</button>
                                <button id="iterateRewriteBtn" class="action-btn secondary">🔄 Iterate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    async initializeLibraries() {
        // Load Monaco Editor for enhanced code editing
        await this.loadMonacoEditor();
        
        // Load Turndown for HTML to Markdown conversion
        await this.loadTurndown();
        
        // Load Marked for Markdown to HTML conversion
        await this.loadMarked();
        
        // Initialize editors
        this.initializeEditors();
    }
    
    async loadMonacoEditor() {
        if (window.monaco) return;
        
        // Load Monaco Editor from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                require.config({ 
                    paths: { 
                        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' 
                    } 
                });
                require(['vs/editor/editor.main'], resolve);
            };
        });
    }
    
    async loadTurndown() {
        if (window.TurndownService) return;
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js';
        document.head.appendChild(script);
        
        return new Promise(resolve => {
            script.onload = resolve;
        });
    }
    
    async loadMarked() {
        if (window.marked) return;
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
        document.head.appendChild(script);
        
        return new Promise(resolve => {
            script.onload = resolve;
        });
    }
    
    initializeEditors() {
        // Initialize Monaco Editor for markdown editing
        this.editor = monaco.editor.create(document.getElementById('markdownEditor'), {
            value: '',
            language: 'markdown',
            theme: 'vs-dark',
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            folding: true,
            renderLineHighlight: 'gutter',
            cursorStyle: 'line'
        });
        
        // Initialize split view editor
        this.splitEditor = monaco.editor.create(document.getElementById('splitMarkdownEditor'), {
            value: '',
            language: 'markdown',
            theme: 'vs-dark',
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on'
        });
        
        // Initialize Turndown service for HTML to Markdown conversion
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        
        // Setup auto-save on content changes
        this.editor.onDidChangeModelContent(() => {
            this.scheduleAutoSave();
            this.updateStats();
            this.updatePreview();
        });
        
        this.splitEditor.onDidChangeModelContent(() => {
            this.scheduleAutoSave();
            this.updateStats();
            this.updatePreview();
        });
        
        // Setup WYSIWYG editor events
        const wysiwygEditor = document.getElementById('wysiwygEditor');
        wysiwygEditor.addEventListener('input', () => {
            this.scheduleAutoSave();
            this.updateStats();
        });
    }
    
    setupEventListeners() {
        // View mode toggles
        document.getElementById('wysiwygModeBtn').addEventListener('click', () => this.switchMode('wysiwyg'));
        document.getElementById('markdownModeBtn').addEventListener('click', () => this.switchMode('markdown'));
        document.getElementById('splitModeBtn').addEventListener('click', () => this.switchMode('split'));
        
        // Editor actions
        document.getElementById('saveBtn').addEventListener('click', () => this.saveFile());
        document.getElementById('closeEditorBtn').addEventListener('click', () => this.closeEditor());
        document.getElementById('aiRewriteBtn').addEventListener('click', () => this.openAIRewrite());
        
        // AI Panel
        document.getElementById('closeAiPanel').addEventListener('click', () => this.closeAIPanel());
        document.getElementById('runRewriteBtn').addEventListener('click', () => this.runAIRewrite());
        document.getElementById('acceptRewriteBtn').addEventListener('click', () => this.acceptRewrite());
        document.getElementById('discardRewriteBtn').addEventListener('click', () => this.discardRewrite());
        
        // Section editing
        document.getElementById('sectionSelectBtn').addEventListener('click', () => this.enableSectionSelection());
        document.getElementById('sectionRewriteBtn').addEventListener('click', () => this.rewriteSelectedSection());
        
        // WYSIWYG Toolbar
        this.setupWysiwygToolbar();
        
        // Markdown Toolbar  
        this.setupMarkdownToolbar();
        
        // Modal close on outside click
        document.getElementById('markdownEditorModal').addEventListener('click', (e) => {
            if (e.target.id === 'markdownEditorModal') {
                this.closeEditor();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('markdownEditorModal').classList.contains('open')) return;
            
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveFile();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                this.closeEditor();
            }
        });
    }
    
    setupWysiwygToolbar() {
        const toolbar = document.getElementById('wysiwygToolbar');
        
        toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
                const command = e.target.dataset.command;
                if (command) {
                    document.execCommand(command, false, null);
                }
            }
        });
        
        toolbar.addEventListener('change', (e) => {
            if (e.target.classList.contains('toolbar-select')) {
                const command = e.target.dataset.command;
                const value = e.target.value;
                if (command && value) {
                    document.execCommand(command, false, value);
                }
            }
        });
        
        // Special handlers
        document.getElementById('insertCodeBlock').addEventListener('click', () => {
            const code = prompt('Enter code:');
            if (code) {
                document.execCommand('insertHTML', false, `<pre><code>${code}</code></pre>`);
            }
        });
    }
    
    setupMarkdownToolbar() {
        const toolbar = document.getElementById('markdownToolbar');
        
        toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
                const markdown = e.target.dataset.markdown;
                if (markdown) {
                    this.insertMarkdownSyntax(markdown);
                }
            }
        });
        
        document.getElementById('insertMarkdownCodeBlock').addEventListener('click', () => {
            this.insertMarkdownSyntax('```\ncode\n```');
        });
    }
    
    insertMarkdownSyntax(syntax) {
        const editor = this.getCurrentMarkdownEditor();
        if (!editor) return;
        
        const selection = editor.getSelection();
        const selectedText = editor.getModel().getValueInRange(selection);
        
        let newText = syntax;
        if (syntax.includes('text')) {
            newText = syntax.replace('text', selectedText || 'text');
        } else if (syntax.includes('url')) {
            const url = prompt('Enter URL:');
            if (url) {
                newText = syntax.replace('url', url).replace('text', selectedText || 'link text');
            } else {
                return;
            }
        } else if (selectedText) {
            newText = syntax + selectedText;
        }
        
        editor.executeEdits('insert-markdown', [{
            range: selection,
            text: newText
        }]);
        
        editor.focus();
    }
    
    getCurrentMarkdownEditor() {
        if (document.getElementById('splitContainer').style.display !== 'none') {
            return this.splitEditor;
        }
        return this.editor;
    }
    
    switchMode(mode) {
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        
        // Hide all containers
        document.getElementById('wysiwygContainer').style.display = 'none';
        document.getElementById('markdownContainer').style.display = 'none';
        document.getElementById('splitContainer').style.display = 'none';
        
        // Show selected container and update mode
        switch (mode) {
            case 'wysiwyg':
                document.getElementById('wysiwygContainer').style.display = 'block';
                document.getElementById('wysiwygModeBtn').classList.add('active');
                document.getElementById('editorMode').textContent = 'Rich Text Mode';
                this.isWysiwygMode = true;
                this.syncFromMarkdownToWysiwyg();
                break;
                
            case 'markdown':
                document.getElementById('markdownContainer').style.display = 'block';
                document.getElementById('markdownModeBtn').classList.add('active');
                document.getElementById('editorMode').textContent = 'Markdown Mode';
                this.isWysiwygMode = false;
                this.syncFromWysiwygToMarkdown();
                this.editor.layout();
                break;
                
            case 'split':
                document.getElementById('splitContainer').style.display = 'block';
                document.getElementById('splitModeBtn').classList.add('active');
                document.getElementById('editorMode').textContent = 'Split View Mode';
                this.isWysiwygMode = false;
                this.syncFromWysiwygToMarkdown();
                this.splitEditor.layout();
                this.updatePreview();
                break;
        }
    }
    
    syncFromWysiwygToMarkdown() {
        const wysiwygEditor = document.getElementById('wysiwygEditor');
        const html = wysiwygEditor.innerHTML;
        const markdown = this.turndownService.turndown(html);
        
        this.editor.setValue(markdown);
        this.splitEditor.setValue(markdown);
    }
    
    syncFromMarkdownToWysiwyg() {
        const markdown = this.getCurrentContent();
        const html = marked.parse(markdown);
        document.getElementById('wysiwygEditor').innerHTML = html;
    }
    
    updatePreview() {
        const markdown = this.splitEditor ? this.splitEditor.getValue() : '';
        const html = marked.parse(markdown);
        document.getElementById('splitPreview').innerHTML = html;
    }
    
    getCurrentContent() {
        if (this.isWysiwygMode) {
            const wysiwygEditor = document.getElementById('wysiwygEditor');
            return this.turndownService.turndown(wysiwygEditor.innerHTML);
        } else {
            return this.getCurrentMarkdownEditor().getValue();
        }
    }
    
    setContent(content) {
        // Set content in all editors
        this.editor.setValue(content);
        this.splitEditor.setValue(content);
        
        // Convert to HTML for WYSIWYG
        const html = marked.parse(content);
        document.getElementById('wysiwygEditor').innerHTML = html;
        
        this.updateStats();
        this.updatePreview();
    }
    
    updateStats() {
        const content = this.getCurrentContent();
        const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = content.length;
        
        document.getElementById('editorStats').textContent = `${words} words, ${chars} characters`;
    }
    
    scheduleAutoSave() {
        if (this.autoSaveInterval) {
            clearTimeout(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setTimeout(() => {
            this.autoSave();
        }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    async autoSave() {
        if (!this.currentFile) return;
        
        try {
            await this.saveFile(true);
            document.getElementById('autoSaveStatus').textContent = 'Auto-saved';
        } catch (error) {
            console.error('Auto-save failed:', error);
            document.getElementById('autoSaveStatus').textContent = 'Save failed';
        }
    }
    
    async saveFile(isAutoSave = false) {
        if (!this.currentFile) {
            this.showError('No file loaded');
            return;
        }
        
        const content = this.getCurrentContent();
        
        try {
            // Here you would implement the actual file saving logic
            // For now, we'll save to localStorage and update the content pipeline
            this.saveToLocalStorage(content);
            
            if (!isAutoSave) {
                document.getElementById('autoSaveStatus').textContent = 'Saved successfully';
                this.notifyObservers('fileSaved', { file: this.currentFile, content });
            }
        } catch (error) {
            console.error('Save failed:', error);
            this.showError('Failed to save file');
        }
    }
    
    saveToLocalStorage(content) {
        const key = `markdown_editor_${this.currentFile.replace(/[^a-zA-Z0-9]/g, '_')}`;
        localStorage.setItem(key, content);
    }
    
    loadFromLocalStorage() {
        const key = `markdown_editor_${this.currentFile.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return localStorage.getItem(key) || '';
    }
    
    async openFile(filePath, title = null) {
        this.currentFile = filePath;
        
        // Update UI
        document.getElementById('editorFileName').textContent = title || filePath.split('/').pop();
        document.getElementById('editorFilePath').textContent = filePath;
        
        // Load content (for now from localStorage, in real implementation from file system)
        let content = this.loadFromLocalStorage();
        
        // If no saved content, load demo content based on file type
        if (!content) {
            content = this.generateDemoContent(title || filePath);
        }
        
        this.setContent(content);
        
        // Show modal
        document.getElementById('markdownEditorModal').classList.add('open');
        
        // Focus on editor
        if (this.isWysiwygMode) {
            document.getElementById('wysiwygEditor').focus();
        } else {
            this.editor.focus();
        }
        
        this.notifyObservers('fileOpened', { file: filePath, title });
    }
    
    generateDemoContent(title) {
        // Check if this is a specific article and provide tailored content
        if (title.includes('Origin Story') || title.includes('Why I\'m Building')) {
            return this.getOriginStoryContent();
        }
        
        if (title.includes('Florida Testing') || title.includes('8-hour trip')) {
            return this.getFloridaTestingContent();
        }
        
        if (title.includes('Nickel') || title.includes('BTM') || title.includes('invisible')) {
            return this.getNickelLessonsContent();
        }
        
        if (title.includes('Non-Technical') || title.includes('can\'t code')) {
            return this.getNonTechnicalFounderContent();
        }
        
        // Default content for other files
        return `# ${title}

## Overview

This is a placeholder document for **${title}**. Start writing your content here.

## Key Points

- Point 1: Important insight about ${title.toLowerCase()}
- Point 2: Supporting details and examples  
- Point 3: Next steps and conclusions

## Ideas & Notes

> Write your thoughts and ideas here. This editor supports full markdown syntax with live preview and AI-powered rewriting.

## Content Structure

1. **Introduction** - Hook the reader with a compelling opening
2. **Problem/Context** - What specific challenge are you addressing?
3. **Solution/Insight** - Your unique perspective or approach
4. **Evidence/Examples** - Supporting details and real experiences
5. **Conclusion** - Next steps or clear call to action

## Writing Prompts

- What personal experience led to this insight?
- How does this connect to your broader mission with CyphrCam?
- What would make this valuable to your audience?
- What specific call to action fits naturally here?

## Section Notes

Use the **Select Section** button below to work on specific parts. The AI rewriter can help you:
- Improve clarity and flow
- Expand with more details
- Simplify complex concepts
- Adjust tone (professional, casual, creative)

---

*Last updated: ${new Date().toLocaleDateString()}*
*Word count will update automatically as you write*
`;
    }
    
    getOriginStoryContent() {
        return `# Why I'm Building an App for Dancers (And What It's Teaching Me About Everything)

## The Problem That Wouldn't Leave Me Alone

For years, I've been watching dancers practice in apartments at midnight with headphones on, moving silently to music only they can hear. There's something beautiful about it—and something profoundly limiting.

Every dancer knows this struggle: **you want to practice, but you can't always blast music.** Whether you're in a shared apartment, it's late at night, or you're in a public space, there are countless moments when you want to move but can't access your soundtrack.

I've been that dancer. Practicing in my bedroom at 2 AM, trying not to wake my roommates, moving to beats only I could hear. There had to be a better way.

## The Vision: CyphrCam

What if you could dance to any song, anywhere, without anyone else hearing it? What if you could record yourself dancing and automatically sync the music afterward, creating content that looks and feels like you had a full studio setup?

This is the vision behind **CyphrCam**—but it's become so much more than just solving a technical problem.

## Building for the Community I Know

I'm not building this in a vacuum. I'm a dancer myself, connected to the freestyle dance community, particularly through BTM (Beyond The Moves) and its founder Nikel Udot. I've tested every feature with real dancers, in real situations.

When I took CyphrCam on an 8-hour trip to Florida for a lion dance event, it wasn't just a road trip—it was a user research expedition. I discovered bugs I never would have found in my bedroom studio. I learned what works and what breaks when you're actually trying to create content in the wild.

## The Deeper Lessons

Building CyphrCam is teaching me things that go far beyond app development:

### 1. Build for Joy, Not Just Function

Dance is pure expression. Any tool for dancers has to honor that. It can't just work—it has to *feel* good to use. Every interaction should enhance the creative flow, not interrupt it.

The best feedback I've received isn't about features—it's about how the app makes people feel when they use it.

### 2. Community Over Market

I'm not building for "the fitness market" or "content creators." I'm building for dancers I know personally. This specificity is a feature, not a limitation.

When you build for a real community instead of an abstract market, every decision becomes clearer.

### 3. Technology Should Disappear

The best dance tools become invisible. When you're in flow, you shouldn't be thinking about the technology at all.

If dancers are thinking about the app instead of their movement, I've failed.

## What's Next

CyphrCam is heading to the App Store soon. But this is just the beginning. I see a world where every dancer has access to studio-quality tools, regardless of their circumstances.

This app represents something larger: **the tools we need won't build themselves.** Sometimes you have to stop waiting and start building.

The dance community deserves better tools. Tools built by dancers, for dancers. Tools that understand that this isn't just about fitness or content—it's about expression, creativity, and joy.

## The Business Reality

I'm building this to reach $2,000/month in revenue—enough to fund my relocation and continue developing. But the money isn't the point. The point is creating something sustainable enough to keep serving the community.

Too many great ideas die because their creators can't make them financially viable. I won't let CyphrCam be one of them.

---

*I'm documenting this journey as I build CyphrCam from an idea to a sustainable business. Follow along if you're interested in the intersection of artistry, technology, and entrepreneurship.*

**Current Status:** Preparing for App Store launch • Target: $2,000/month recurring revenue

*What questions do you have about building for creative communities? I'd love to hear from you.*`;
    }
    
    getFloridaTestingContent() {
        return `# I Tested My App on an 8-Hour Trip to Florida. Here's What Broke.

## The Setup

CyphrCam had been working perfectly in my bedroom for months. Every test passed. Every demo looked smooth. I thought I was ready.

Then I decided to take it on a real-world test: an 8-hour road trip to Florida for a lion dance performance. If CyphrCam was going to be a tool dancers actually used, it needed to work outside my controlled environment.

Spoiler alert: **a lot broke.**

## What I Thought Would Happen

My plan was simple:
- Record practice sessions during the drive breaks
- Test the app in different lighting conditions
- Maybe get some content for social media

I imagined seamless recordings, perfect sync, maybe even some artistic shots of me practicing in random parking lots across the Southeast.

## What Actually Happened

### The Audio Timing Disaster

The first major issue hit during our first rest stop in Georgia. CyphrCam's audio sync, which worked flawlessly on my home WiFi, started drifting on cellular data. The slight network latency was throwing off the timing algorithms.

**Lesson learned:** Never assume your controlled environment is representative of real use.

### The Storage Problem

By hour 4, I discovered that CyphrCam was creating massive temporary files during processing. My iPhone storage was nearly full, and the app started crashing during longer recordings.

I had never tested extended use. In my bedroom, I'd record for 30 seconds, check that it worked, and move on. Real dancers want to record full songs—3-4 minute sessions.

**Lesson learned:** Test for actual use patterns, not just feature validation.

### The Battery Vampire

Recording high-quality video while processing audio in real-time turned my phone into a hand warmer. The battery drain was brutal. During our lunch break in Gainesville, I watched CyphrCam eat through 40% battery in 15 minutes.

**Lesson learned:** Performance optimization isn't just about speed—it's about sustainability.

## The Breakthrough Moment

But something amazing happened during our final stop before Orlando. 

I was practicing in a gas station parking lot at sunset (yes, really). Despite all the technical issues, despite the crashes and the battery drain, despite the audio sync problems—**I was having fun.**

Other people started watching. A few asked what app I was using. One person said it looked "professional" even though I knew the sync was slightly off.

That's when I realized: **users don't judge against perfection. They judge against their alternatives.**

For most dancers, the alternative to CyphrCam isn't a perfect app—it's no app at all. It's practicing silently, or not practicing, or trying to hold their phone while dancing to music playing from another device.

## The Emergency Fixes

I spent the entire lion dance event debugging instead of performing (sorry to my teammates). But I fixed three critical issues:

1. **Offline processing:** Sync calculations now happen locally, no network required
2. **Streaming storage:** Large files get compressed and cleaned up immediately  
3. **Battery optimization:** Reduced processing intensity during recording

By the time we drove home, CyphrCam was more stable than it had ever been.

## What This Taught Me

### Real-World Testing Is Non-Negotiable

Your controlled environment will lie to you. Every successful app needs to survive contact with chaotic, real-world use cases.

I now do all my testing in random locations: coffee shops, parks, my car, anywhere except my bedroom.

### Users Are Forgiving If You're Solving a Real Problem

People tolerated CyphrCam's early bugs because it solved a problem they actually had. They wanted to dance with music, privately, and create content from it. The technical execution was secondary.

### Document Everything

Every bug, every crash, every user complaint is data. I started keeping a detailed log of issues and fixes. That log became the foundation for CyphrCam's stability.

## The Current State

CyphrCam now works reliably in real-world conditions. The Florida trip broke it, but breaking it made it better.

I still test every update on road trips. My friends think I'm obsessive, but I've never shipped another update with obvious real-world issues.

## For Other Builders

If you're building something people will actually use:

1. **Test in chaos, not just comfort.** Find the most inconvenient, unpredictable environment you can and test there.

2. **Optimize for real use patterns.** Don't just test features—test workflows.

3. **Ship broken things to people who love you.** My beta testers knew they were getting buggy software, but they wanted to help make it better.

The difference between a demo and a product is how it behaves when everything goes wrong.

---

*CyphrCam is launching on the App Store soon. Built for dancers, tested by chaos.*

**Next up:** What Nikel from BTM taught me about making technology invisible.`;
    }
    
    getNickelLessonsContent() {
        return `# What Nikel Taught Me About Making Technology Invisible

## Meeting the Expert

Nikel Udot runs BTM (Beyond The Moves), one of the most respected freestyle dance programs in the world. When he agreed to test CyphrCam, I thought I was getting feedback on features.

Instead, I got a masterclass in user experience philosophy.

## The First Demo

I was excited to show Nikel all of CyphrCam's capabilities. The automatic music sync, the editing tools, the export options. I walked him through every screen, explaining each feature in detail.

After 10 minutes, he stopped me.

"This is cool," he said, "but when do I start dancing?"

## The Invisible Technology Principle

Nikel explained something that changed how I think about building tools for creative people:

**"The best technology disappears. When someone is in flow, creating, expressing—they shouldn't be thinking about the tool at all."**

He was right. I had been building CyphrCam like a Swiss Army knife, proud of all its features. But dancers don't want features—they want to dance.

## The Flow State Problem

In the dance world, flow state is everything. It's that moment when movement becomes effortless, when you're not thinking about technique or steps—you're just *being* the music.

Any interruption breaks flow. Any friction stops creativity.

I realized CyphrCam was full of flow-breakers:
- Multiple setup screens before recording
- Complicated audio selection menus
- Export dialogs with 12 different options

Every choice I forced the user to make was pulling them out of their creative headspace.

## The Redesign

Nikel's feedback led to a complete UX overhaul:

### Before: Choose Your Adventure
1. Select music source
2. Configure audio settings  
3. Choose video quality
4. Set sync sensitivity
5. Pick export format
6. Start recording

### After: Just Dance
1. Hit record
2. Dance
3. Everything else happens automatically

The app now makes smart defaults for everything. Users can customize later if they want, but the default path is frictionless.

## The Muscle Memory Test

"Good dance tools become muscle memory," Nikel told me. "If someone has to think about how to use it, it's not ready."

This became my new test: Could a dancer use CyphrCam without looking at the screen?

The answer was no. So I redesigned the interface with:
- Large, obvious buttons
- Audio feedback for actions
- Gesture controls for common functions
- Minimal visual complexity

## The Professional Standard

Nikel also taught me about professional expectations. BTM dancers are serious artists. They need tools that match their level of dedication.

"This can't feel like a hobby app," he said. "It needs to feel like professional equipment."

That feedback influenced everything from the app icon (clean, minimal) to the export quality (studio-grade) to the way settings are organized (like professional video software).

## The Community Integration

Most importantly, Nikel helped me understand that CyphrCam isn't just a tool—it's part of a creative ecosystem.

Dancers share videos, collaborate on projects, and build off each other's work. The app needed to support that community aspect, not just individual creation.

We added:
- Easy sharing with preserved quality
- Collaboration features for group projects  
- Community challenges and themes
- Integration with existing platforms dancers already use

## The Ongoing Relationship

Nikel continues to test CyphrCam updates. He's not just a beta tester—he's a design partner. His perspective keeps me focused on what actually matters to serious dancers.

Every feature now passes the "Nikel test": Does this help dancers dance better, or does it get in their way?

## For Other Builders

If you're building creative tools:

1. **Find your Nikel.** Identify the most serious practitioners in your field and get them involved early.

2. **Optimize for flow, not features.** Every click, every choice, every pause is potential friction.

3. **Default to invisible.** The best user experience is the one users don't notice.

4. **Test with pros.** Serious users will push your tool harder and demand higher standards.

5. **Build for the ecosystem.** Individual tools succeed when they enhance existing creative communities.

The goal isn't to build the most feature-rich app. It's to build the app that disappears when creativity begins.

---

*CyphrCam launches soon. Built for dancers who demand professional tools that respect their creative flow.*

**Coming next:** The challenges of being a non-technical founder building technical products.`;
    }
    
    getNonTechnicalFounderContent() {
        return `# I'm a Dancer Who Can't Code. Here's How I'm Building an iOS App Anyway.

## The Uncomfortable Truth

I am not a programmer. I'm a dancer, a marketer, and someone who understands the freestyle community. Six months ago, I could barely read JavaScript, let alone write Swift.

Today, CyphrCam is a fully functional iOS app with 19 Swift files and over 2,400 lines of code.

This is the story of how I built something I wasn't qualified to build.

## The Traditional Advice (And Why It Doesn't Work)

Every entrepreneur gets the same advice: "Find a technical co-founder." 

I tried. For months, I pitched developers, attended tech meetups, and posted on co-founder matching sites. The responses were always the same:

- "Interesting idea, but I don't understand the dance market."
- "How do you know people will pay for this?"
- "Can you fund development until we get traction?"

The problem wasn't finding developers. It was finding developers who understood what I was trying to build and why it mattered.

## The AI Partnership

Instead of waiting for the perfect co-founder, I found an unexpected partner: **Claude Code**.

I know how that sounds. "AI" has become the answer to everything these days. But this isn't about hype—it's about practical problem-solving.

Here's how it actually works:

### My Role: The Strategic Layer
- Define what the app needs to do
- Design the user experience 
- Test with real dancers
- Make product decisions
- Handle business development

### Claude's Role: The Implementation Layer  
- Write Swift and SwiftUI code
- Implement iOS frameworks
- Debug technical issues
- Optimize performance
- Handle iOS-specific requirements

## The Learning Curve

I didn't stay non-technical. Working with AI forced me to learn:

### Swift Fundamentals
I can now read and modify Swift code, understand MVVM architecture, and debug common iOS issues. Not because I studied programming, but because I needed to communicate effectively with my AI partner.

### iOS Development Concepts
Core Data, AVFoundation, UserDefaults, View modifiers—these aren't abstract concepts anymore. They're tools I use daily to build features.

### Git and Version Control
Managing a codebase with 2,400+ lines requires real version control. I learned Git not from tutorials, but from necessity.

## The Advantages of Being "Non-Technical"

Being a non-programmer actually provided some unexpected advantages:

### User-First Thinking
I never got caught up in elegant code architecture. Every decision was based on user needs, not technical preferences.

### Practical Problem-Solving
When something was too complex to implement, I found simpler solutions that worked just as well for users.

### Real-World Testing
I tested CyphrCam as a dancer first, developer second. If I couldn't use it easily, neither could my users.

## The Collaboration Process

Here's what a typical development session looks like:

1. **I identify a problem:** "The audio sync drifts during long recordings"

2. **I describe the desired behavior:** "Audio should stay perfectly synced for recordings up to 5 minutes"

3. **Claude suggests solutions:** Multiple approaches with tradeoffs explained

4. **We implement together:** I provide context, Claude writes code

5. **I test as a user:** Does this actually solve the dancer's problem?

6. **We iterate:** Refine until it works perfectly in real-world use

## The Technical Challenges

Building CyphrCam required solving some genuinely complex problems:

### Audio-Video Synchronization
Automatically syncing music to dance footage requires precise timing algorithms and buffer management.

### Real-Time Processing  
The app processes audio and video simultaneously without dropping frames or overheating the device.

### File Management
Large video files need efficient compression, storage, and cleanup to prevent crashes.

### iOS Optimization
The app had to work smoothly on devices from iPhone SE to iPhone 15 Pro Max.

I couldn't have solved these problems alone. But I could articulate them clearly and test solutions rigorously.

## The Validation Process

Every feature gets tested by real dancers before it ships:

- **BTM community members** for professional feedback
- **Social media dancers** for content creation workflows
- **Studio dancers** for practical daily use
- **Beginner dancers** for ease of use

This constant feedback loop catches issues that code review never would.

## What I've Learned

### You Don't Need to Be an Expert to Build
You need to understand your users better than anyone else. Technical skills can be acquired or partnered.

### Domain Knowledge Is Irreplaceable
No developer could have designed CyphrCam's UX without deep understanding of how dancers actually work.

### AI Is a Tool, Not Magic
Claude doesn't build the app for me. It helps me build the app I design. The strategic decisions, user research, and product vision still require human judgment.

### Learning Happens Through Building
I learned more about iOS development in 6 months of building than I would have in 2 years of tutorials.

## For Other Non-Technical Founders

If you're sitting on an idea because you "can't code":

1. **Start with your domain expertise.** What do you understand better than anyone else?

2. **Learn to communicate technically.** You don't need to write code, but you need to describe what it should do precisely.

3. **Test constantly with real users.** Your advantage is understanding user needs—leverage that.

4. **Embrace AI as a development partner.** But remember: you're still the product manager.

5. **Learn enough to be dangerous.** You don't need to be a senior developer, but understanding basics helps immensely.

## The Current State

CyphrCam now has:
- 19 Swift files with clean, maintainable code
- Comprehensive error handling and edge case management
- Professional-grade audio processing
- Smooth 60fps video performance
- App Store-ready polish

I built this not because I was qualified, but because dancers needed it and I was willing to figure it out.

---

*CyphrCam launches on the App Store soon. Proof that domain expertise + determination + AI can build real products.*

**The message:** Stop waiting for permission to build. Start building to get permission.`;
    }
    
    closeEditor() {
        if (this.hasUnsavedChanges()) {
            if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
                return;
            }
        }
        
        document.getElementById('markdownEditorModal').classList.remove('open');
        this.currentFile = null;
        this.closeAIPanel();
        
        // Clear auto-save
        if (this.autoSaveInterval) {
            clearTimeout(this.autoSaveInterval);
        }
        
        this.notifyObservers('editorClosed');
    }
    
    hasUnsavedChanges() {
        // Simple implementation - in real world you'd compare with last saved state
        return false;
    }
    
    openAIRewrite() {
        const selection = this.getSelectedText();
        if (!selection) {
            this.showError('Please select text to rewrite');
            return;
        }
        
        document.getElementById('aiRewritePanel').style.display = 'block';
    }
    
    closeAIPanel() {
        document.getElementById('aiRewritePanel').style.display = 'none';
        document.getElementById('aiResults').style.display = 'none';
    }
    
    getSelectedText() {
        if (this.isWysiwygMode) {
            return window.getSelection().toString();
        } else {
            const editor = this.getCurrentMarkdownEditor();
            const selection = editor.getSelection();
            return editor.getModel().getValueInRange(selection);
        }
    }
    
    async runAIRewrite() {
        const selectedText = this.getSelectedText();
        const style = document.querySelector('.option-btn.active')?.dataset.style || 'improve';
        const model = document.getElementById('aiModelSelect').value;
        const customPrompt = document.getElementById('customPrompt').value;
        
        try {
            // Show loading state
            document.getElementById('runRewriteBtn').textContent = '⏳ Rewriting...';
            document.getElementById('runRewriteBtn').disabled = true;
            
            // Simulate AI API call (replace with actual implementation)
            const rewrittenText = await this.callAIAPI(selectedText, style, model, customPrompt);
            
            // Show results
            document.getElementById('aiRewriteOutput').innerHTML = marked.parse(rewrittenText);
            document.getElementById('aiResults').style.display = 'block';
            
        } catch (error) {
            this.showError('AI rewrite failed: ' + error.message);
        } finally {
            document.getElementById('runRewriteBtn').textContent = '🚀 Rewrite';
            document.getElementById('runRewriteBtn').disabled = false;
        }
    }
    
    async callAIAPI(text, style, model, customPrompt) {
        // Simulate API call - replace with actual AI integration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const stylePrompts = {
            improve: 'Improve the clarity and flow of this text while maintaining its meaning:',
            expand: 'Expand this text with more details and examples:',
            simplify: 'Simplify this text to make it easier to understand:',
            professional: 'Rewrite this text in a more professional tone:',
            casual: 'Rewrite this text in a more casual, friendly tone:',
            creative: 'Rewrite this text in a more creative and engaging way:'
        };
        
        const prompt = customPrompt || stylePrompts[style] || stylePrompts.improve;
        
        // Mock response
        return `${prompt}\n\n**Original:** ${text}\n\n**Rewritten:** This is a mock AI rewrite of the selected text. In a real implementation, this would be the actual AI-generated content from ${model}.`;
    }
    
    acceptRewrite() {
        const rewrittenText = document.getElementById('aiRewriteOutput').textContent;
        this.replaceSelectedText(rewrittenText);
        this.closeAIPanel();
    }
    
    discardRewrite() {
        document.getElementById('aiResults').style.display = 'none';
    }
    
    replaceSelectedText(newText) {
        if (this.isWysiwygMode) {
            document.execCommand('insertText', false, newText);
        } else {
            const editor = this.getCurrentMarkdownEditor();
            const selection = editor.getSelection();
            editor.executeEdits('replace-text', [{
                range: selection,
                text: newText
            }]);
        }
    }
    
    enableSectionSelection() {
        this.showInfo('Click and drag to select a section for rewriting');
        // Implementation for section-based editing would go here
    }
    
    rewriteSelectedSection() {
        // Implementation for section-specific rewriting
        this.openAIRewrite();
    }
    
    showError(message) {
        // Simple error display - in real implementation use a proper notification system
        alert('Error: ' + message);
    }
    
    showInfo(message) {
        // Simple info display
        alert('Info: ' + message);
    }
    
    // Observer pattern for integration with Mission Control
    addObserver(callback) {
        this.observers.add(callback);
    }
    
    removeObserver(callback) {
        this.observers.delete(callback);
    }
    
    notifyObservers(event, data) {
        this.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Observer callback failed:', error);
            }
        });
    }
}

// Initialize the markdown editor when DOM is loaded
let markdownEditor;
document.addEventListener('DOMContentLoaded', () => {
    markdownEditor = new MarkdownEditor();
});

// Global function to open files from Mission Control
function openMarkdownEditor(filePath, title) {
    if (markdownEditor) {
        markdownEditor.openFile(filePath, title);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownEditor;
}