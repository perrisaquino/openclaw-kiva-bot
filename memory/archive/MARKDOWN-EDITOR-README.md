# 📝 Integrated Markdown Editor for Mission Control

A professional, full-featured markdown editor that replaces broken `obsidian://` links with a comprehensive writing environment built for the Mission Control content pipeline.

## 🚀 Overview

This integrated editor system provides:

- **WYSIWYG editing** similar to Google Docs/Word
- **Markdown source editing** with Monaco Editor (VS Code engine)
- **Split-view mode** with live preview
- **AI-powered rewriting** with multiple models
- **Auto-save functionality** 
- **Section-based editing** for targeted improvements
- **Professional writing environment** with proper typography

## 📁 Files

- `markdown-editor.js` - Main editor functionality and integration
- `markdown-editor.css` - Professional styling and responsive design
- `mission-control.html` - Updated with editor integration
- `editor-demo.html` - Standalone demo page
- `MARKDOWN-EDITOR-README.md` - This documentation

## ✨ Features

### 🎨 Three Editing Modes

1. **Rich Text Mode (WYSIWYG)**
   - Visual formatting similar to Google Docs
   - Toolbar with formatting options
   - Automatic conversion to markdown

2. **Markdown Mode**
   - Monaco Editor with syntax highlighting
   - Advanced code editing features
   - Markdown-specific shortcuts

3. **Split View**
   - Side-by-side editing and preview
   - Real-time rendering
   - Synchronized scrolling

### 🤖 AI Integration

- **Multiple AI Models**: Claude 3.5 Sonnet, Opus, Haiku, GPT-4 Turbo
- **Rewrite Styles**: Improve, Expand, Simplify, Professional, Casual, Creative
- **Custom Instructions**: Provide specific prompts for targeted rewriting
- **Section Selection**: Rewrite specific paragraphs or sections

### 💾 File Management

- **Auto-save**: Saves every 2 seconds after changes
- **File Integration**: Works with Obsidian vault structure
- **Word Count Tracking**: Real-time statistics
- **Status Indicators**: Clear save status and mode indicators

### 🎯 Professional Features

- **Keyboard Shortcuts**: Ctrl+S to save, Ctrl+W to close
- **Responsive Design**: Works on desktop, tablet, mobile
- **Dark Theme**: Professional dark interface
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Integration with Mission Control

The editor integrates seamlessly with the existing Mission Control content pipeline:

### Replaced Functions

```javascript
// OLD: Broken obsidian:// links
function openInObsidian(obsidianPath) {
    const obsidianUrl = `obsidian://open?vault=...`;
    window.open(obsidianUrl); // This was broken
}

// NEW: Integrated editor
function openInObsidian(obsidianPath) {
    const title = obsidianPath.split('/').pop().replace('.md', '');
    const fullPath = `/Users/iamperris/Local Documents/Main Second Brain (Local)/${obsidianPath}`;
    
    if (markdownEditor) {
        markdownEditor.openFile(fullPath, title);
        addActivity(`Opened in editor: ${title}`, 'content');
    }
}
```

### Content Pipeline Updates

- **Word Count Tracking**: Automatically updates when files are saved
- **Activity Logging**: Tracks file opens, saves, and edits
- **Status Integration**: Updates content items with real word counts

### Button Updates

Changed from `📂 Open` to `📝 Edit` to better reflect the integrated editing experience.

## 🛠️ Setup Instructions

1. **Include CSS and JS files** in your HTML:
   ```html
   <link rel="stylesheet" href="markdown-editor.css">
   <script src="markdown-editor.js"></script>
   ```

2. **Initialize integration** in your main JavaScript:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       // ... existing initialization
       setupMarkdownEditorIntegration();
   });
   ```

3. **Use the global function** to open files:
   ```javascript
   openMarkdownEditor(filePath, title);
   ```

## 🎯 Usage Examples

### Opening Files from Content Pipeline

```javascript
// From Mission Control Kanban cards
<button onclick="openInObsidian('${item.obsidianPath}')">📝 Edit</button>
```

### AI Rewriting Workflow

1. **Select text** in any editing mode
2. **Click "🤖 AI Rewrite"** button
3. **Choose model** and rewrite style
4. **Review results** and accept/discard
5. **Iterate** if needed

### Split-View Writing

1. **Click "📊 Split View"** button
2. **Edit markdown** in the left panel
3. **See live preview** in the right panel
4. **Auto-save** keeps everything synchronized

## 📱 Responsive Design

- **Desktop**: Full-featured with all panels and toolbars
- **Tablet**: Optimized layout with collapsible AI panel
- **Mobile**: Stack view with touch-friendly controls

## 🔐 File System Integration

### Current Implementation
- Uses `localStorage` for persistence
- Simulates file operations
- Integrates with Mission Control data

### Future Enhancement Opportunities
- **Real file system access** using File System Access API
- **Obsidian vault synchronization** 
- **Git integration** for version control
- **Cloud backup** options

## ⚡ Performance

- **Monaco Editor**: Professional code editing experience
- **Lazy Loading**: Libraries load only when needed  
- **Efficient Rendering**: Minimal DOM updates
- **Memory Management**: Cleanup on modal close

## 🎨 Customization

### Theming
The editor uses CSS custom properties for easy theming:

```css
:root {
    --editor-bg: #1a1a1a;
    --editor-accent: #007acc;
    --editor-text: #ffffff;
    /* ... more variables */
}
```

### AI Model Configuration
Add or modify AI models in the editor:

```javascript
<select id="aiModelSelect">
    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
    <option value="your-custom-model">Your Model</option>
</select>
```

## 🐛 Debugging

### Common Issues

1. **Editor not loading**: Check console for JavaScript errors
2. **Monaco not initializing**: Verify CDN access
3. **Auto-save failing**: Check localStorage quota

### Debug Mode
Enable debug logging:

```javascript
markdownEditor.debug = true;
```

## 🚀 Demo

Open `editor-demo.html` to see the editor in action with sample content including:

- **Origin Story Article** - Complete article about building CyphrCam
- **Florida Testing Experience** - Real-world testing story
- **Lessons from Nikel** - Professional insights
- **Non-Technical Founder Journey** - Building without coding

## 📈 Future Enhancements

### Planned Features

1. **Real-time Collaboration** - Multiple users editing simultaneously
2. **Version History** - Track and revert changes
3. **Template System** - Pre-built article structures
4. **Export Options** - PDF, HTML, Word formats
5. **Plugin Architecture** - Custom extensions
6. **Advanced AI Features** - Content suggestions, research integration

### Integration Improvements

1. **Full File System API** - Direct Obsidian vault access
2. **Git Integration** - Automatic version control
3. **Cloud Sync** - Cross-device synchronization
4. **Advanced Search** - Full-text search across all content

## 🤝 Contributing

To extend the editor:

1. **Add new AI models** in the model selection dropdown
2. **Create custom rewrite styles** with specific prompts
3. **Extend toolbar** with additional formatting options
4. **Add export formats** for different publishing platforms

## 📄 License

This integrated markdown editor system is part of the Mission Control content pipeline and designed specifically for the CyphrCam project workflow.

---

## 🎉 Success Metrics

**Problem Solved**: Replaced broken `obsidian://` links with a professional, integrated writing environment.

**Key Improvements**:
- ✅ **Professional UI** - Looks and feels like a real writing tool
- ✅ **Multiple Editing Modes** - WYSIWYG, markdown, and split-view
- ✅ **AI Integration** - Multiple models for content improvement
- ✅ **Auto-save** - Never lose work again
- ✅ **Mobile Responsive** - Write anywhere, on any device
- ✅ **Mission Control Integration** - Updates content pipeline automatically

This editor transforms the content creation workflow from broken links to a professional writing environment that rivals dedicated markdown editors while being perfectly integrated with the Mission Control system.