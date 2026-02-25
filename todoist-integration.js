#!/usr/bin/env node

// Real Todoist API Integration for Mission Control
// Connects to actual Todoist account and pulls real tasks

const https = require('https');
const fs = require('fs').promises;

class TodoistIntegration {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseURL = 'https://api.todoist.com/rest/v2';
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseURL}${endpoint}`;
            const urlParts = new URL(url);
            
            const options = {
                hostname: urlParts.hostname,
                path: urlParts.pathname + urlParts.search,
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(responseData);
                        resolve(parsedData);
                    } catch (e) {
                        resolve({ error: 'Invalid JSON response', raw: responseData });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async getAllTasks() {
        try {
            const tasks = await this.makeRequest('/tasks');
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return { error: error.message };
        }
    }

    async getProjects() {
        try {
            const projects = await this.makeRequest('/projects');
            return projects;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return { error: error.message };
        }
    }

    async getLabels() {
        try {
            const labels = await this.makeRequest('/labels');
            return labels;
        } catch (error) {
            console.error('Error fetching labels:', error);
            return { error: error.message };
        }
    }

    // Organize tasks by business vs personal
    organizeTasks(tasks, projects) {
        if (!Array.isArray(tasks)) return { business: [], personal: [] };

        const businessProjects = projects.filter(p => 
            p.name.toLowerCase().includes('business') ||
            p.name.toLowerCase().includes('cyphrcam') ||
            p.name.toLowerCase().includes('work') ||
            p.name.toLowerCase().includes('app') ||
            p.name.toLowerCase().includes('revenue')
        ).map(p => p.id);

        const businessTasks = tasks.filter(task => 
            businessProjects.includes(task.project_id) ||
            task.content.toLowerCase().includes('cyphrcam') ||
            task.content.toLowerCase().includes('app store') ||
            task.content.toLowerCase().includes('business') ||
            task.content.toLowerCase().includes('revenue') ||
            task.content.toLowerCase().includes('marketing')
        );

        const personalTasks = tasks.filter(task => !businessTasks.includes(task));

        return {
            business: businessTasks,
            personal: personalTasks
        };
    }

    // Convert Todoist tasks to Mission Control format
    convertToMissionControlFormat(tasks) {
        return tasks.map(task => ({
            id: parseInt(task.id),
            title: task.content,
            description: task.description || '',
            priority: this.mapTodoistPriority(task.priority),
            date: task.due?.date || new Date().toISOString().split('T')[0],
            category: 'imported',
            completed: task.is_completed
        }));
    }

    mapTodoistPriority(priority) {
        // Todoist priority: 4 = urgent, 3 = high, 2 = medium, 1 = low
        switch(priority) {
            case 4: return 'high';
            case 3: return 'high';
            case 2: return 'medium';
            default: return 'low';
        }
    }

    // Sync tasks to Mission Control format
    async syncToMissionControl() {
        try {
            console.log('🔄 Syncing Todoist tasks to Mission Control...');
            
            const [tasks, projects] = await Promise.all([
                this.getAllTasks(),
                this.getProjects()
            ]);

            if (tasks.error || projects.error) {
                return {
                    success: false,
                    error: 'Failed to fetch Todoist data',
                    details: { tasks: tasks.error, projects: projects.error }
                };
            }

            const organizedTasks = this.organizeTasks(tasks, projects);
            
            const missionControlData = {
                business: {
                    backlog: this.convertToMissionControlFormat(
                        organizedTasks.business.filter(t => !t.is_completed)
                    ),
                    progress: [], // These would need to be identified by labels or project
                    done: this.convertToMissionControlFormat(
                        organizedTasks.business.filter(t => t.is_completed).slice(0, 10)
                    )
                },
                personal: {
                    backlog: this.convertToMissionControlFormat(
                        organizedTasks.personal.filter(t => !t.is_completed)
                    ),
                    progress: [],
                    done: this.convertToMissionControlFormat(
                        organizedTasks.personal.filter(t => t.is_completed).slice(0, 10)
                    )
                }
            };

            // Save to Mission Control data file
            await fs.writeFile('mc-todoist-sync.json', JSON.stringify({
                lastSync: new Date().toISOString(),
                totalTasks: tasks.length,
                businessTasks: organizedTasks.business.length,
                personalTasks: organizedTasks.personal.length,
                tasks: missionControlData
            }, null, 2));

            console.log(`✅ Synced ${tasks.length} tasks (${organizedTasks.business.length} business, ${organizedTasks.personal.length} personal)`);

            return {
                success: true,
                totalTasks: tasks.length,
                businessTasks: organizedTasks.business.length,
                personalTasks: organizedTasks.personal.length,
                data: missionControlData
            };

        } catch (error) {
            console.error('❌ Sync failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in server
module.exports = TodoistIntegration;

// CLI usage
if (require.main === module) {
    const apiToken = process.argv[2];
    
    if (!apiToken) {
        console.log('❌ Usage: node todoist-integration.js YOUR_TODOIST_API_TOKEN');
        console.log('   Get your token from: https://todoist.com/prefs/integrations');
        process.exit(1);
    }

    const todoist = new TodoistIntegration(apiToken);
    
    todoist.syncToMissionControl().then(result => {
        if (result.success) {
            console.log('🎉 Todoist sync complete!');
            console.log(`   Business tasks: ${result.businessTasks}`);
            console.log(`   Personal tasks: ${result.personalTasks}`);
            console.log('   Data saved to: mc-todoist-sync.json');
        } else {
            console.log('❌ Sync failed:', result.error);
        }
    });
}