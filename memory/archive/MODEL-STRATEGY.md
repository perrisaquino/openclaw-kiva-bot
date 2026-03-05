# MODEL STRATEGY - Smart Model Switching

**Updated:** 2026-02-24  
**Status:** Active Strategy

## Core Philosophy
**Always start with Opus 4.6 for planning, then delegate execution to cheaper models.**

## Model Selection Matrix

### 🧠 Claude Opus 4.6 (Default)
- **Use for:** Strategic planning, complex reasoning, high-level decisions
- **Context:** 195K tokens
- **Cost:** High (but worth it for quality)
- **When:** Initial task analysis, complex problem-solving, important decisions

### 💻 GPT-5.1 Codex 
- **Use for:** Coding tasks, technical implementation, low-leverage work
- **Context:** 391K tokens  
- **Cost:** Medium
- **When:** Writing code, debugging, technical documentation, routine tasks

### ✍️ Claude Sonnet 4.6
- **Use for:** Writing, copywriting, marketing content, content creation
- **Context:** 195K tokens
- **Cost:** Medium
- **When:** Blog posts, marketing copy, creative writing, content strategy

### 🔧 Qwen Coder (Free Tier)
- **Use for:** General coding, experimentation, high-volume tasks
- **Context:** 125K tokens
- **Cost:** Free (2K requests/day)
- **When:** Code review, simple coding tasks, bulk operations

### 🌟 Kimi K2.5
- **Use for:** Multilingual tasks, long context needs, experimental work
- **Context:** 250K tokens  
- **Cost:** Low
- **When:** Chinese/multilingual content, very long documents

### 🏠 QWEN Local (Ollama)
- **Use for:** Private tasks, unlimited usage, experimentation
- **Context:** 32K tokens
- **Cost:** $0 (runs locally)
- **When:** Sensitive data, high-volume testing, offline work

## Workflow Rules

### 1. **Always Start with Opus**
```
🧠 Using Claude Opus 4.6 for strategic planning...
[Analysis and task breakdown]
```

### 2. **Delegate Based on Task Type**
- **Coding** → Spawn sub-agent with Codex
- **Writing** → Spawn sub-agent with Sonnet  
- **Bulk/Routine** → Use Qwen or Local
- **Sensitive** → Use Local only

### 3. **Always Announce Model Choice**
Every response should start with:
- `🧠 Using Claude Opus 4.6` for planning tasks
- `💻 Using GPT-5.1 Codex` for coding tasks  
- `✍️ Using Claude Sonnet 4.6` for writing tasks
- etc.

### 4. **Sub-agent Spawning Strategy**
When spawning sub-agents:
```bash
# Coding tasks
sessions_spawn agentId=coding-agent model=openai/gpt-5.1-codex

# Writing tasks  
sessions_spawn agentId=content-agent model=anthropic/claude-sonnet-4-20250514

# Bulk processing
sessions_spawn agentId=worker-agent model=qwen-portal/coder-model
```

## Cost Optimization Goals
- **Minimize Opus usage** to strategic decisions only
- **Maximize cheaper model usage** for execution
- **Use free/local models** for experimentation and high-volume work
- **Track cost per task type** for optimization

## Quick Switch Commands
```bash
# Available via ./switch-model script
./switch-model opus     # Planning (default)
./switch-model codex    # Coding 
./switch-model sonnet   # Writing
./switch-model qwen     # Free coding
./switch-model kimi     # Multilingual
./switch-model local    # Private/free
./switch-model list     # Show all options
```

---

**Remember:** Quality first, cost optimization second. Use Opus when you need the best thinking, delegate everything else.