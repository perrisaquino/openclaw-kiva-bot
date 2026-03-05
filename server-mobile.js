// Mobile Mission Control Server Extensions
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Set up multer for voice note uploads
const upload = multer({
    dest: path.join(process.env.HOME, '.openclaw/media/inbound/'),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

function addMobileEndpoints(app) {
    const workspacePath = path.join(process.env.HOME, '.openclaw/workspace');
    const memoryPath = path.join(workspacePath, 'memory');

    // Voice Note Upload & Transcription
    app.post('/mc/voice-note', upload.single('audio'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No audio file uploaded' });
            }

            const audioPath = req.file.path;
            const timestamp = req.body.timestamp || new Date().toISOString();
            const today = new Date().toISOString().split('T')[0];

            console.log(`📱 Voice note uploaded: ${req.file.filename}`);

            // Transcribe using Whisper API
            let transcription = '';
            try {
                const transcribeScript = path.join(process.env.HOME, '.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh');
                const { stdout } = await execAsync(`bash "${transcribeScript}" "${audioPath}"`);
                transcription = stdout.trim();
                console.log(`🎙️ Transcription: ${transcription.substring(0, 100)}...`);
            } catch (error) {
                console.error('Transcription failed:', error);
                transcription = '[Transcription failed - audio file saved]';
            }

            // Save to daily note
            const dailyNotePath = path.join(memoryPath, `${today}.md`);
            const noteEntry = `
## 🎙️ Voice Note - ${new Date(timestamp).toLocaleTimeString()}

**Transcription:**
${transcription}

**Audio file:** ${req.file.filename}

---

`;

            // Append to daily note (create if doesn't exist)
            try {
                await fs.access(dailyNotePath);
                const existingContent = await fs.readFile(dailyNotePath, 'utf8');
                await fs.writeFile(dailyNotePath, existingContent + noteEntry);
            } catch {
                // File doesn't exist, create it
                const header = `# ${today}\n\n## Daily Captures\n\n`;
                await fs.writeFile(dailyNotePath, header + noteEntry);
            }

            // Clean up temp audio file (optional - keep for now)
            // await fs.unlink(audioPath);

            res.json({
                success: true,
                transcription: transcription,
                savedTo: dailyNotePath,
                audioFile: req.file.filename
            });

        } catch (error) {
            console.error('Voice note processing failed:', error);
            res.status(500).json({ error: 'Voice note processing failed' });
        }
    });

    // Text Note Saving
    app.post('/mc/text-note', async (req, res) => {
        try {
            const { content, timestamp } = req.body;
            
            if (!content || !content.trim()) {
                return res.status(400).json({ error: 'No content provided' });
            }

            const today = new Date().toISOString().split('T')[0];
            const dailyNotePath = path.join(memoryPath, `${today}.md`);
            
            const noteEntry = `
## ✍️ Text Note - ${new Date(timestamp).toLocaleTimeString()}

${content.trim()}

---

`;

            // Append to daily note
            try {
                await fs.access(dailyNotePath);
                const existingContent = await fs.readFile(dailyNotePath, 'utf8');
                await fs.writeFile(dailyNotePath, existingContent + noteEntry);
            } catch {
                const header = `# ${today}\n\n## Daily Captures\n\n`;
                await fs.writeFile(dailyNotePath, header + noteEntry);
            }

            console.log(`📱 Text note saved to ${dailyNotePath}`);

            res.json({
                success: true,
                savedTo: dailyNotePath,
                timestamp: timestamp
            });

        } catch (error) {
            console.error('Text note saving failed:', error);
            res.status(500).json({ error: 'Text note saving failed' });
        }
    });

    // File Browser - Analysis Documents
    app.get('/mc/files/analysis', async (req, res) => {
        try {
            const files = [];
            
            // Scan workspace for analysis documents
            const workspaceFiles = await fs.readdir(workspacePath);
            
            for (const filename of workspaceFiles) {
                if (filename.endsWith('.md') && 
                    (filename.includes('analysis') || 
                     filename.includes('strategy') || 
                     filename.includes('roadmap') || 
                     filename.includes('audit') || 
                     filename.includes('report'))) {
                    
                    const filepath = path.join(workspacePath, filename);
                    const stats = await fs.stat(filepath);
                    
                    files.push({
                        name: filename.replace('.md', ''),
                        path: filepath,
                        date: stats.mtime.toLocaleDateString(),
                        size: `${Math.round(stats.size / 1024)}KB`,
                        icon: getFileIcon(filename)
                    });
                }
            }

            // Sort by modification time (newest first)
            files.sort((a, b) => new Date(b.date) - new Date(a.date));

            res.json(files);

        } catch (error) {
            console.error('Failed to load analysis files:', error);
            res.status(500).json({ error: 'Failed to load analysis files' });
        }
    });

    // File Browser - Daily Notes
    app.get('/mc/files/daily', async (req, res) => {
        try {
            const files = [];
            
            // Scan memory directory for daily notes
            try {
                const memoryFiles = await fs.readdir(memoryPath);
                
                for (const filename of memoryFiles) {
                    if (filename.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
                        const filepath = path.join(memoryPath, filename);
                        const stats = await fs.stat(filepath);
                        
                        files.push({
                            name: filename.replace('.md', ''),
                            path: filepath,
                            date: stats.mtime.toLocaleDateString(),
                            size: `${Math.round(stats.size / 1024)}KB`,
                            icon: '📅'
                        });
                    }
                }
            } catch {
                // Memory directory might not exist
            }

            // Sort by date (newest first)
            files.sort((a, b) => b.name.localeCompare(a.name));

            res.json(files);

        } catch (error) {
            console.error('Failed to load daily notes:', error);
            res.status(500).json({ error: 'Failed to load daily notes' });
        }
    });

    // File Viewer
    app.get('/mc/file/view', async (req, res) => {
        try {
            const filepath = req.query.path;
            
            if (!filepath || !filepath.startsWith(process.env.HOME)) {
                return res.status(400).json({ error: 'Invalid file path' });
            }

            const content = await fs.readFile(filepath, 'utf8');
            res.send(content);

        } catch (error) {
            console.error('Failed to read file:', error);
            res.status(500).json({ error: 'Failed to read file' });
        }
    });

    // Today's Captures
    app.get('/mc/captures/today', async (req, res) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const dailyNotePath = path.join(memoryPath, `${today}.md`);
            const captures = [];

            try {
                const content = await fs.readFile(dailyNotePath, 'utf8');
                
                // Parse captures from the daily note
                const lines = content.split('\n');
                let currentCapture = null;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    if (line.startsWith('## 🎙️ Voice Note -')) {
                        const timeMatch = line.match(/(\d{1,2}:\d{2}:\d{2})/);
                        const time = timeMatch ? timeMatch[1] : 'Unknown';
                        
                        // Get preview from next few lines
                        let preview = 'Voice recording';
                        for (let j = i + 1; j < i + 5; j++) {
                            if (lines[j] && lines[j].trim() && !lines[j].startsWith('**')) {
                                preview = lines[j].substring(0, 60) + (lines[j].length > 60 ? '...' : '');
                                break;
                            }
                        }
                        
                        captures.push({
                            id: `voice_${time}`,
                            type: 'voice',
                            time: time,
                            preview: preview
                        });
                    }
                    
                    if (line.startsWith('## ✍️ Text Note -')) {
                        const timeMatch = line.match(/(\d{1,2}:\d{2}:\d{2})/);
                        const time = timeMatch ? timeMatch[1] : 'Unknown';
                        
                        // Get preview from next line
                        let preview = 'Text note';
                        if (lines[i + 2] && lines[i + 2].trim()) {
                            preview = lines[i + 2].substring(0, 60) + (lines[i + 2].length > 60 ? '...' : '');
                        }
                        
                        captures.push({
                            id: `text_${time}`,
                            type: 'text',
                            time: time,
                            preview: preview
                        });
                    }
                }
                
            } catch {
                // No daily note exists yet
            }

            res.json(captures);

        } catch (error) {
            console.error('Failed to load today\'s captures:', error);
            res.status(500).json({ error: 'Failed to load captures' });
        }
    });

    // Stats Endpoints
    app.get('/mc/stats/tasks', async (req, res) => {
        try {
            // This would integrate with Todoist API when configured
            res.json({ count: '-' });
        } catch (error) {
            res.json({ count: 'Error' });
        }
    });

    app.get('/mc/stats/notes', async (req, res) => {
        try {
            // Count analysis documents
            const workspaceFiles = await fs.readdir(workspacePath);
            const analysisFiles = workspaceFiles.filter(f => 
                f.endsWith('.md') && 
                (f.includes('analysis') || f.includes('strategy') || f.includes('roadmap'))
            );
            
            res.json({ count: analysisFiles.length });
        } catch (error) {
            res.json({ count: 'Error' });
        }
    });

    console.log('📱 Mobile Mission Control endpoints added');
}

function getFileIcon(filename) {
    if (filename.includes('analysis')) return '🔍';
    if (filename.includes('strategy')) return '🎯';
    if (filename.includes('roadmap')) return '🗺️';
    if (filename.includes('audit')) return '🔍';
    if (filename.includes('report')) return '📊';
    if (filename.includes('insight')) return '💡';
    return '📄';
}

module.exports = { addMobileEndpoints };