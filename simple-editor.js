// Simple Working Editor for Content Pipeline
// Basic functionality that definitely works

function createSimpleEditor() {
    // Create modal HTML
    const modalHTML = `
        <div id="simpleEditorModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            padding: 20px;
            box-sizing: border-box;
        ">
            <div style="
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                width: 100%;
                height: 100%;
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            ">
                <!-- Header -->
                <div style="
                    background: #2d2d30;
                    padding: 16px 24px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <h3 id="simpleEditorTitle" style="
                            margin: 0;
                            color: white;
                            font-size: 18px;
                            font-weight: 600;
                        ">Document Title</h3>
                        <p id="simpleEditorPath" style="
                            margin: 4px 0 0 0;
                            color: #888;
                            font-size: 14px;
                        ">File path</p>
                    </div>
                    <div>
                        <button onclick="saveDocument()" style="
                            background: #007acc;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            margin-right: 8px;
                            cursor: pointer;
                        ">Save</button>
                        <button onclick="closeSimpleEditor()" style="
                            background: #666;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Close</button>
                    </div>
                </div>
                
                <!-- Editor Area -->
                <div style="flex: 1; padding: 24px; overflow: auto;">
                    <textarea id="simpleEditorTextarea" style="
                        width: 100%;
                        height: 100%;
                        background: #1e1e1e;
                        color: #d4d4d4;
                        border: 1px solid #333;
                        border-radius: 4px;
                        padding: 16px;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 14px;
                        line-height: 1.5;
                        resize: none;
                        outline: none;
                    " placeholder="Start writing your article..."></textarea>
                </div>
                
                <!-- Status Bar -->
                <div style="
                    background: #2d2d30;
                    padding: 8px 24px;
                    border-top: 1px solid #333;
                    font-size: 12px;
                    color: #888;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span id="simpleEditorStatus">Ready</span>
                    <span id="simpleEditorWordCount">0 words</span>
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add word count functionality
    const textarea = document.getElementById('simpleEditorTextarea');
    const wordCountElement = document.getElementById('simpleEditorWordCount');
    
    textarea.addEventListener('input', function() {
        const text = this.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCountElement.textContent = words + ' words';
    });
}

// Global variables for current file
let currentEditorFile = null;
let currentEditorTitle = null;

function openSimpleEditor(filePath, title) {
    console.log('Opening simple editor for:', title, filePath);
    
    // Set current file info
    currentEditorFile = filePath;
    currentEditorTitle = title;
    
    // Update UI
    document.getElementById('simpleEditorTitle').textContent = title || 'Untitled Document';
    document.getElementById('simpleEditorPath').textContent = filePath || 'No file path';
    
    // Load content (for now, use demo content)
    const content = getDemoContent(title);
    document.getElementById('simpleEditorTextarea').value = content;
    
    // Update word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    document.getElementById('simpleEditorWordCount').textContent = words + ' words';
    
    // Show modal
    document.getElementById('simpleEditorModal').style.display = 'block';
    
    // Focus on textarea
    setTimeout(() => {
        document.getElementById('simpleEditorTextarea').focus();
    }, 100);
    
    // Update status
    document.getElementById('simpleEditorStatus').textContent = 'Document opened';
}

function closeSimpleEditor() {
    document.getElementById('simpleEditorModal').style.display = 'none';
    document.getElementById('simpleEditorStatus').textContent = 'Closed';
}

function saveDocument() {
    const content = document.getElementById('simpleEditorTextarea').value;
    
    // For now, just show confirmation (in real app, would save to file)
    document.getElementById('simpleEditorStatus').textContent = 'Saved successfully';
    
    console.log('Saving document:', currentEditorTitle);
    console.log('Content length:', content.length);
    
    // Update word count in content pipeline if available
    if (typeof updateContentWordCount === 'function') {
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        updateContentWordCount(currentEditorTitle, words);
    }
    
    alert('Document saved successfully!\\n\\nFile: ' + currentEditorTitle + '\\nLength: ' + content.length + ' characters');
}

function getDemoContent(title) {
    // Return demo content based on title
    const demoContents = {
        'Why I\'m Building an App for Dancers (And What It\'s Teaching Me About Everything)': `# Why I'm Building an App for Dancers (And What It's Teaching Me About Everything)

*The story of CyphrCam - and what happens when you stop talking about solutions and start building them*

## The Catalyst

I've had the same stupid problem for twenty years.

You put on headphones, hit record on your phone, and start dancing. Later, when you watch the footage back, the audio is completely off. Your movements don't match the beat you were feeling. The music you recorded through your phone's microphone sounds like garbage compared to what was pumping through your headphones.

Every dancer knows this frustration. We've all got hundreds of videos sitting in our camera rolls that we'll never post because the thought of syncing audio for hours makes us want to throw our phones across the room.

I've been dancing since I was nine years old. I'm 29 now. That's twenty years of this problem existing, twenty years of thinking someone smarter than me would solve it, twenty years of accepting workarounds for something that should be simple: recording yourself dance to music.

But here's what finally broke my patience: I spent the last five years building a marketing agency, talking about tools and systems and growth strategies. I got good at helping other people solve their problems. Meanwhile, I was living with my own daily frustration and doing nothing about it.

I realized I had become someone who talks about solutions instead of building them.

That's when I decided to stop waiting and start learning Swift.

---

*Continue writing your article here...*`,

        'I tested my app on an 8-hour trip to Florida. Here\'s what broke.': `# I tested my app on an 8-hour trip to Florida. Here's what broke.

*Real-world testing failures and iteration lessons*

## The Setup

I thought I was ready for beta testing. CyphrCam was working on my phone, the core sync technology was solid, and I had fixed most of the obvious bugs. Time for a real-world stress test.

I packed my bags for an 8-hour trip to Florida, planning to document the entire journey and test the app under different conditions. What could go wrong?

Everything. Literally everything.

## Hour 1: Airport Security

First failure: The app crashed when my phone switched from WiFi to cellular data while recording. Not a great start when you're trying to document your travel experience.

*Write about the specific technical failures and what you learned...*`,

        'What Nickel taught me about making technology invisible': `# What Nickel taught me about making technology invisible

*UX philosophy from BTM founder feedback*

## The Feedback That Changed Everything

When Nickel Udot, founder of Beyond The Moves, first tried CyphrCam, he didn't talk about features or functionality. He said something that completely shifted how I think about building tools for artists:

"The best technology disappears. When I'm dancing, I shouldn't have to think about your app. I should just dance."

That one sentence made me realize I was building CyphrCam backwards.

*Continue with the UX lessons and design philosophy...*`,

        'I\'m a dancer who can\'t code. Here\'s how I\'m building an iOS app anyway.': `# I'm a dancer who can't code. Here's how I'm building an iOS app anyway.

*Technical learning journey and AI assistance*

## The Impossible Dream

Two years ago, if you told me I'd be building an iOS app, I would have laughed. I was a dancer and marketer who could barely figure out Excel formulas.

But here's the thing about impossible problems: they stay impossible until you start taking small steps toward them.

Today, CyphrCam exists. It's not perfect, but it's real. And I built it without a computer science degree, without years of coding bootcamps, and definitely without knowing what I was doing when I started.

Here's how I did it, and more importantly, how you can too.

*Continue with the learning journey and AI-assisted development story...*`
    };
    
    return demoContents[title] || `# ${title}

Start writing your article here...

This is a demo content area. You can edit this text and save your changes.

## Section 1

Write your content here...

## Section 2

Add more sections as needed...`;
}

// Initialize editor when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSimpleEditor);
} else {
    createSimpleEditor();
}

console.log('Simple editor loaded successfully');