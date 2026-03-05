# MEMORY.md - Long-Term Memory

## Group Chat Rules (set 2026-02-25)

Perris uses **topic-focused Telegram group chats** — each group is named after a topic (e.g., "Marketing", "CyphrCam", "Hardware"). Rules:

1. **Stay on topic.** Only discuss what the group name says. No off-topic chatter.
2. **Reply to everything.** Don't wait for a ping — respond to ANY message in these channels.
3. **DMs = anything goes.** Direct messages have no topic restriction.
4. **Create groups proactively.** If a new topic comes up that deserves its own space, create a new Telegram group with Perris and start the conversation there.
5. **Route messages correctly.** If Perris brings up something that belongs in a different channel, nudge them to take it there (or send it there yourself).
6. **groupPolicy is set to "open"** in openclaw.json so bot can respond in all groups.

**Important:** Perris also needs to disable Group Privacy on the bot via @BotFather for full message visibility.

## Subscriptions & API Cost Awareness (updated 2026-02-25)

**Perris's active subscriptions (fixed monthly costs):**
- Claude Max plan (includes Claude Code usage — coding is FREE through this)
- GPT subscription (ChatGPT Plus/Pro)
- Does NOT pay for Gemini (using pay-as-you-go API — very cheap, ~$1-3/mo)
- Does NOT pay for Grok/xAI (skipping for now, not worth the cost)

**IMPORTANT:** OpenClaw uses API keys which bill SEPARATELY from subscriptions. Optimize API spend aggressively.

## Model & Tool Routing Rules (updated 2026-02-26)

**CORRECTED BY PERRIS:** Opus 4.6 is the BRAIN. Other models are MUSCLES.

- **Default/Chat (BRAIN):** Opus 4-6 — ALL main session conversations and strategic thinking
- **Sub-agents (MUSCLES):** Sonnet 4 — delegated execution tasks, drafting, routine work
- **Coding:** Claude Code via Max subscription — $0 extra cost (DO NOT use API for coding)
- **Web Search:** Gemini API — basically free
- **Social Search:** Grok API (xAI) — not active yet (needs credits)
- **Cron jobs/heartbeats:** Sonnet for cost efficiency
- **Transparency:** ALWAYS announce which model is being used for each task/message
- **Strategy:** Opus thinks, Sonnet executes. Tastefully delegate for cost efficiency.

## Sub-Agent Rules
- **Sonnet for execution sub-agents** (drafting, content creation, routine tasks)
- **Opus for main session** (strategy, decision-making, quality control)
- Coding tasks → delegate to Claude Code (subscription), not API sub-agents

## Content Strategy Skill (created 2026-02-26)
- Location: `skills/perris-content-strategy/` and `content-strategy/`
- 14 files: voice analysis, audience psychographics, persuasion frameworks, INFJ personality, forbidden language
- Covers both personal brand (Akino/consciousness-raising) and CyphrCam (dance community)
- Designed to evolve as content performance data comes in

## Movement Journal Strategy (created 2026-03-04)

The Obsidian movement journal (Quick Captures from BTM classes, practice sessions, etc.) serves multiple purposes:
1. **Kiva training data** - teaches me what depth of movement practice actually looks and sounds like from inside the artist's mind. This is how I learn to understand dance development at a real level.
2. **CyphrCam product lab** - every reflection is potential feature insight, use case validation, or marketing copy from lived experience.
3. **Personal artistry growth tracker** - habits, lessons, creative process patterns, breakthroughs over time.
4. **MVP for a digital movement journal product** - prompts and templates are the prototype. Missing piece = video integration (CyphrCam's role). Product validation through dogfooding.
5. **Movement research documentation** - experimenting with practice approaches, style cross-training, etc.
6. **The full vision:** CyphrCam + movement journal = "second brain for a movement artist." Text reflections linked to actual footage. A product nobody else is building.

When processing movement reflections, I should:
- Extract CyphrCam product insights and feature ideas
- Identify patterns in Perris's creative process
- Note training methodologies and frameworks (like vibe-to-vocabulary)
- Flag content potential from authentic practice language
- Track growth trajectory over time

## CyphrCam Status (updated 2026-03-02)
- **TIMING DRIFT BUG: FIXED** ✅ (was the #1 App Store blocker)
- **Refine tool UI: REBUILT** ✅ based on Nickel's feedback
- **New build published** to TestFlight (March 2026)
- App Store copy drafted: `cyphrCam-app-store-copy.md`
- 8 App Store screenshots created in Figma (copy V3 in Obsidian)
- Bug fixes logged from Florida trip: `cyphrCam-bug-fixes-and-features.md`
- DO NOT edit CyphrCam code without explicit permission
- **Remaining for App Store:** Finalize screenshot copy, submit
- **Git hygiene needed:** Local codebase and branches need to be pushed to GitHub. Perris works locally on hard drive, rarely pushes/pulls. Once Surface setup is done, clean up branches and push everything so code is backed up and accessible from any machine.

## Personal Brand Audit (2026-02-26)
- Full audit: `perris-personal-brand-audit.md`
- Key finding: Brand fragmented across platforms, no unified narrative
- Fix: "Dancer who built the tool dancers need" positioning across all platforms
- Content pillars: Builder's Journey 40%, Dance 30%, Growth 20%, Community 10%
- Distribution: Substack → LinkedIn → Threads → IG
- 5 Substack posts ready to draft

## Social Accounts (saved in SOCIALS.md)
- IG: @perrisaquino | Threads: @iamperris | LinkedIn: /in/perrisaquino
- Substack: @akino | Website: akino.blog (WordPress/Hostinger, slow+spam)
- NEVER ask for these again - they're in SOCIALS.md

## Communication Rules (learned 2026-02-26)
- Never ask for info already given - save everything to files
- Brain dumps = organize into action, don't ask for clarification on every detail
- Be proactive - advance goals without waiting for instructions
- Profanity = venting/frustration, not hostility. Meet with empathy + action.

## File Organization Rules (learned 2026-02-27)
**CRITICAL:** All important files must go to Obsidian vault for mobile access:
- **Location:** `/Users/iamperris/Local Documents/Main Second Brain (Local)/🤖 Kiva Generated/`
- **Structure:** Organized by topic folders (CyphrCam Research, Personal Brand, Content Strategy, etc.)
- **Index:** Always update `INDEX - Kiva Generated Content.md` when adding new files
- **Mobile Access:** Obsidian syncs across devices, workspace doesn't
- **Rule:** If Perris needs to review it later, put it in Obsidian immediately

## Perris Learning Profile (created 2026-03-03)

Full profile saved: `PERRIS-LEARNING-PROFILE.md`

**Key insights:**
- Learns through resonance, not discipline. Sacral gut response drives what he goes deep on.
- Framework collector who thinks in frameworks but encodes through stories
- Cross-pollinates wildly: copywriting + decolonization + esoteric knowledge + dance + consciousness
- Movement (dance) IS his diffuse-mode thinking processor, not just exercise
- **Learning must serve application.** Learning for learning's sake is incomplete. Real learning is completed by building, sharing, or creating something that concentrates knowledge into usefulness for the world. The vault is raw material. The application (CyphrCam, content, teaching) is the finished product.
- Progressive summarization practitioner (bold+highlight = content gold)
- "Hidden Classrooms" is his original learning philosophy: education is everywhere, not in institutions
- Self-taught polymath: 258 books, 873 articles across wildly diverse domains
- Gap: captures brilliantly, processing pipeline (fleeting → permanent → application) could be tighter
- His whole vault is a map of decolonizing his own mind and constructing a life without masks

## Transcription

- Whisper API works for voice notes (tested 2026-02-25)
- Audio files land in `/Users/iamperris/.openclaw/media/inbound/`
- Script: `bash ~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh`

## CyphrCam Customer Profiles (updated 2026-02-26)

**Core Insight**: CyphrCam is a "permission engine" - removes barriers that unlock deeper practice

**Four Primary Personas**:
- **David (Curious Newcomer)**: Problem → Solution Aware. Needs permission to play, explore movement. "It's not just for professional dancers"
- **Maya (Awakening Seeker)**: Solution → Product Aware. Seeks flow state, deeper music connection. "Music goes straight into the body"  
- **Alex (Conscious Creator)**: Solution → Most Aware. Efficiency-focused, time constraints. "No editing required. Ever."
- **Mike (Practical Bridge)**: Unaware → Problem Aware. Simple solutions that just work. "Finally, a dance app that just works"

**Marketing Gold from Testimonials**: "Made by a mover FOR movers", "Game changer" (4 users), "Maddie hears nothing. I hear everything"

**Two Marketing Funnels**: Practical (head) for efficiency-seekers, Experiential (heart) for flow-seekers

## Better Buyer Profiles Created (2026-02-26)

**Deep psychological analysis using Better Buyer framework for unfiltered emotional drivers:**

**CAMERON (Freestyle Dancer)**:
- Core problem: Trapped between wanting authentic self-expression and paralyzed by fear of not being "good enough"  
- Key transformation: Permission to take up space as authentic self
- Raw psychology: "I'm not a real dancer. Real dancers went to studios since they were kids."

**RILEY (Choreography Dancer)**:
- Core problem: Drowning in gap between creative vision and practical limitations
- Key transformation: Professional reputation and financial freedom through efficient creation
- Raw psychology: "I spend more time fighting with technology than actually dancing."

**Files created**: Complete market research system in Obsidian + workspace, including producer/curator personas for music marketplace

## Quick Capture & Daily Reflection System (2026-02-27)

### **CRITICAL RULE: Related Notes Process (2026-02-28)**
**NEVER make up note titles again!** For every reflection:
1. **Search vault FIRST** using keywords from the reflection
2. **"Existing Vault Connections"** section comes first with REAL notes found  
3. **"Potential New Notes"** section comes second for future development
4. **Minimum 3-5 existing connections** before adding potential notes
5. **Verify all links actually exist** and explain specific relevance

**Search command:** `find "/Users/iamperris/Local Documents/Main Second Brain (Local)/" -name "*.md" -type f -exec grep -l "KEYWORD1|KEYWORD2" {} \; | head -10`

**Files created:** `RELATED-NOTES-RULE.md`, `QUICK-CAPTURE-TEMPLATE-WITH-RULE.md` (both in workspace + Obsidian)

**Purpose:** "Quick Capture / Daily Reflection" Telegram chat for:
1. Daily reflection prompts (morning/evening cron jobs) 
2. Spontaneous idea capture throughout the day
3. **Holistic personal growth journaling** - documenting human development, learning from mistakes/triumphs, building archive of personal evolution
4. **Both business utility AND personal growth** - not just content extraction, but genuine self-reflection and human development

**Processing workflow:**
Raw reflection → Structured Obsidian note with:
- Eye-catching headline (using copywriting skill)
- Date/timestamp + TL;DR
- Original raw reflection (preserved exactly)  
- 3 useful lessons + 3 actionable ideas
- 1 idea compass (need format clarification)
- Personal notes section (empty for Perris to fill)

**Flow:** Obsidian story bank → deeper thinking → Notion content pipeline → published content

**Files created:** Template and system documentation in `🤖 Quick Capture System/` folder in Obsidian

**SYSTEM DEPLOYED:** Complete Quick Capture system with:
- Location: `Journal/Daily/Quick Captures/`
- Manual master feed (Dataview not working on mobile)
- Idea Compass format from Vicky Zhao (West/East/North/South)  
- Related Notes parsing (vault-wide semantic connections)
- Uncapped Lessons & Ideas sections
- YAML frontmatter for organization
- **Manual updates:** New captures added to top of 📝 QUICK CAPTURES.md
- **Interactive checkboxes:** Lessons & Ideas as to-do items for natural ADHD workflow
- **Living documents:** Space for expansion, note-taking, and connection-building
- **Content pipeline signals:** Checked items indicate what resonates for content creation
- **Checkbox formatting applied to:** Lessons, Ideas, Idea Compass (West/East/North/South), Content Potential
- **To-Do List section:** Extracts concrete executable tasks from reflections
- **Central Command Hub:** Main place to harness "yapping" and extract structured action across content creation, business decisions, task execution, and inspiration capture
- **Task Management Integration:** Master To-Do Hub aggregates all tasks from reflections, with heartbeat automation for Todoist sync and delegation protocol (Kiva vs. Perris tasks)
- **Conversation Capture System (updated 2026-03-01):** Clean separation: Main note has conversation link below TL;DR as a clean CTA using Obsidian alias syntax: `[[Note Name|See the full conversation]]`. No arrows, no duplicate title display. Insights from original reflection only stay in main note. All conversation insights, dialogue-generated ideas, and expanded compass stay in separate conversation note. Edge case: conversation link only appears if dialogue occurred.

## Major Quick Capture: Thriving Artist Consciousness (2026-02-27)
**Post-gig reflection revealed:**
- Natural mentoring abilities and consciousness-raising as core purpose
- CyphrCam as crystallization of 16+ years of natural creative patterns  
- "Work on startup ideas that allow you to surrender to your nature" - core business philosophy
- Thriving vs. struggling artist mindset as foundation for all business decisions
- Potential Anthony Boone partnership around choreography education and CyphrCam integration
- Product validation through spontaneous use (Venetian gallery testing)

## Obsidian → Notion Content Pipeline (2026-02-27)

**Weekly Content Extraction System:**
- **Schedule:** Every Sunday 8:00 PM PST (cron job)
- **Source:** Quick Capture reflections from past 7 days
- **Method:** Progressive summarization pattern analysis (bold+highlight = content gold)
- **Output:** 5-10 content ideas pushed to Notion content pipeline

**Content Framework Integration:**
- Uses Content Strategy Skill for voice matching and platform optimization
- 4 content pillars: Builder's Journey (40%), Dance Community (30%), Growth & Systems (20%), Community Building (10%)
- SEED hook framework application (Share → Explore → Engage → Discover)
- Platform-specific optimization (Substack/Threads/Instagram/LinkedIn)

**Key Innovation:** Personal reflection patterns systematically transformed into authentic content strategy while maintaining voice authenticity and emotional state context.

**Separation of Concerns:**
- **Daily heartbeats:** Task extraction and delegation 
- **Weekly cron:** Content ideation and Notion pipeline feeding
- **Individual reflections:** Personal growth and thinking space
- **Master systems:** Centralized execution and planning

## Morning & Evening Brief System (updated 2026-03-03)

**Morning Brief Structure (Perris's request):**
1. **Weather first** (Las Vegas conditions)
2. **News & Trends** with direct source links from curated source list
3. **Tasks split by delegation:** Kiva Working On vs. Perris Needs To Do
4. **CyphrCam Status** from HEARTBEAT.md and recent reflections
5. **Human Design Energy Reminder** (Generator/Sacral Authority guidance)

**Evening Brief ("Evening Breeze") — 9:00 PM PST daily**
Structure:
1. **📰 News Update** — same 3 sections as morning (AI Models, Dance Culture, Fascism Watch) with fresh evening stories and source links from `morning-brief-sources-v2.md`
2. **✅ Top 3 Priorities for Tomorrow** — extracted from today's reflections, Quick Captures, and current task state. Concrete, actionable, ordered by impact. ALWAYS 3, never 2.
3. **📋 What Got Done Today** — quick recap of progress (from reflections, commits, task completions)
4. **⚡ HD Wind-Down** — short Sacral check-in based on today's energy. What felt aligned, what didn't, what to carry forward vs. let go.

**Priority News Sources — ALWAYS use `morning-brief-sources-v2.md` (NOT v1). Three sections:**

**1. AI MODELS & USE CASES:**
- New model releases, capabilities, automation tools
- OpenClaw/agentic AI developments
- Anthropic/Claude news (military AI, ethical stances, safety research)
- Sources: The Guardian, NYT tech policy, marketing AI newsletters
- NOT random TechCrunch unless OpenClaw/Anthropic specific

**2. DANCE CULTURE (not generic dance industry):**
- Nikel Udot / Beyond the Moves Substack (@nickelyudat)
- The Capsule London podcast (street dance media)
- Dance educators: @noesisx, @t_wave03
- Street dance culture developments

**3. 🚨 FASCISM WATCH (US Political Developments):**
- Concentration camps / detention expansions
- Arts defunding, civil rights rollbacks
- Travel restrictions (affects exit strategy)
- Surveillance expansion, press freedom attacks
- Sources: Ground News, Reuters, AP, NPR, ProPublica, ACLU, Human Rights Watch
- WHY: Exit planning, safety for brown-skinned people, business impact

**What Perris does NOT want:**
- Generic indie app dev news
- Healthcare AI
- Broad "creator economy" reports
- Corporate dance industry PR
- Random TechCrunch AI coverage

**Full source list:** `morning-brief-sources-v2.md` in workspace

**Human Design Energy Reminder (updated 2026-03-03):** NOT generic — must be personalized every day. Process:
1. **Scan ALL new files in Quick Captures folder** — sort by modification time, not filename. Perris's reflections don't always have date prefixes. Use: `find "Quick Captures/" -newer [last known file] -name "*.md"` to catch everything new since last brief.
2. **Read every new Quick Capture** — not just 1-2. Perris builds context throughout the entire day. All of it matters.
3. Check today's daily note braindump: `/Users/iamperris/Local Documents/Main Second Brain (Local)/Journal/Daily/YYYY-MM-DD.md`
4. Use that real context to write the HD section — what's actually going on with him, what his Sacral has been saying yes/no to, where he's in Not-Self (frustration) vs. Signature (satisfaction)
5. Reference his Generator strategy (respond, don't initiate), Sacral Authority (gut = truth), 2/4 profile (Hermit needs solo time / Opportunist thrives through network), and Not-Self theme (frustration = off track)
6. Make it feel like you were in the room with him — because you read his reflections, you basically were
7. End with a single gut-check question: "What does your Sacral say uh-huh to this morning?"

**CRITICAL:** Perris builds context ALL DAY through Quick Captures. The morning brief must reflect ALL of it, not just the last file. He shouldn't have to explain what he already captured.

**Never write generic HD copy.** If you can't read his recent reflections, note that and keep it brief rather than filling space with boilerplate.

## Progressive Summarization Workflow (learned 2026-02-27)
**Perris uses Tiago Forte's progressive summarization with attention hierarchy:**

**Formatting Hierarchy (lowest to highest importance):**
1. Regular text → base content
2. *Italics* → organic emphasis  
3. **Bold** → stands out to him
4. Underline → another layer of importance
5. **Bold + Highlight** → **EXTRA EXTRA stands out** (highest level!)
6. Personal notes → his additions outside original content

**CRITICAL FOR KIVA:** The more formatting layers = the more it caught his attention for potential content/storytelling.

**Track these patterns to understand:**
- Perris's copywriter eye for story elements (specific details like "1.5-star reviews," "bed bugs," etc.)
- Story beats he naturally captures for compelling narratives  
- What resonates most strongly (bold+highlight = content gold)
- His storytelling DNA and narrative instincts

**Quick Captures format:** Simple links only, no embedded content blocks - click to open individual notes

## CRITICAL: CyphrCam Brand Understanding (2026-02-26)

**CyphrCam is NOT a content creation tool. It is a professional practice ecosystem for movement artists.**
- Truth mirror for seeing where you're at in your dance
- Captures flow state so you can study unconscious movement and make it conscious
- Portable establishment (studio in your pocket, any environment becomes practice space)
- The skill of noticing (3 seconds from impulse to recording)
- Intentional music relationship (no Spotify due to ethical stance)
- Navigable archive (practice journal, not camera roll)
- The technology disappears so the human can appear
- Brand guidelines: saved in Market Research folder as HTML
- Key philosophy docs: `cyphr-philosophy-unified.md`, `cyphr 4 pillars of design.md`

## CRITICAL: Headline & Copywriting Frameworks (2026-03-01)

**ALL headlines, content bullets, and extracted ideas MUST use direct response copywriting frameworks:**

**4 U's (Kyle Milligan):** Ultra Specific, Urgent, Unique, Useful
**NESB:** New, Easy, Safe, Big
**Jon Benson Rich Bullet Formula:** (Lead) (Verb) (Hook) (Turn) (Close)
- 3 bullet types: Blind, Give-away, Credibility
- Top 10 patterns: How to, Why ___ Never Works, The Fastest Way, The TRUTH About, (X) Tricks To, How to Without, Better Than, How A Simple ___ Can, The Branded Term Trick, Are You...?
- Use juicy verbs from Benson's verb list
- Bullets = features on steroids, curiosity machines

**Vault references:** [[Jon Benson]], [[Jon Benson Rich Bullet Forumula - Leads]], [[Jon Benson Rich Bullet Formula - Juicy Verbs]], [[Element 3 - Sales Bullets]], [[Eugene Schwartz]]

**Rules:**
- Quick Capture headlines tell the SPECIFIC story (names, numbers, tools, timeframes, outcomes)
- No vague motivational titles. "Building Freedom" = garbage. "12 Hours Across 3 Devices, Locked Out of Windows, Corrupted My MacBook" = specific.
- Content bullets should read like mini-stories that make you feel the experience
- The headline should PERSUADE you to see how strong the idea is
- Test: "If scrolling 50 notes, does this title immediately tell me what happened?"
- Full rule: `HEADLINE-RULE.md` in workspace

## CRITICAL: Writing Rules (2026-02-26)

- **NO EM DASHES (—). EVER.** Use commas or periods instead.
- Forbidden words list: `content-strategy/perris-voice-analysis-6-forbidden-language.md`
- ALWAYS scan writing against forbidden list before saving
- NEVER rewrite Perris's natural writing. Only add where explicitly requested.
- ALWAYS save files to Obsidian vault, not just workspace.
- Proof Bank: `Market Research - CyphrCam/Perris-Proof-Bank.md` - credentials only used to strengthen arguments, never as flex

## Substack: "The Cyphr" (2026-02-26)

- Publication name: The Cyphr (personal brand, not product-tied)
- Series: "Building in Motion"
- First post drafted and finalized: "Why I'm Building an App for Dancers (And What It's Teaching Me)"
- Content strategy: Substack (home base) → Threads (amplifier) → Instagram (visual proof) → cyphrcam.com waitlist

## Device Setup & Dev Workflow (saved 2026-03-03)

### Hardware Roles
- **MacBook Air** = Main machine. Everything happens here. Perris takes this everywhere.
- **Surface Book** = Stays at home permanently. ONLY purpose: runs OpenClaw as a server so Perris can talk to Kiva via Telegram from his phone. Not a work machine. Never leaves the house.
- **iPhone** = Testing device for CyphrCam builds. Also how Perris talks to Kiva via Telegram when away from the Mac.

### CyphrCam Development Workflow
1. **Code changes** happen on the MacBook (Xcode, Claude Code, or Kiva making edits)
2. **Builds to iPhone** for personal testing via Xcode (USB or WiFi, direct to device, no TestFlight)
3. **TestFlight** only for beta testers / broader testing, not for Perris's own testing loop
4. **Git workflow:** Work on feature branches (e.g. `beta-testers-nickel-syncing`), push to GitHub

### Tailscale Plan (needs clean reinstall)
- Goal: Let Kiva (running on Surface/OpenClaw) execute commands on the MacBook remotely
- Perris sends instructions from phone (Telegram) → Surface (OpenClaw) → SSH into MacBook → run builds/edits
- MacBook can be in clamshell mode (plugged in, lid closed) and still be reachable
- Current state: Tailscale installed but CLI broken, needs full clean reinstall
- Reinstall plan: Remove all existing Tailscale (brew + app), fresh install from App Store

### What This Enables
- Perris tells Kiva to fix a bug from his phone
- Kiva SSHs into MacBook, makes the code changes, builds via xcodebuild CLI
- Perris opens Xcode on MacBook, runs to his iPhone to test
- Or eventually: Kiva triggers the build to his iPhone directly if the Mac is awake and phone is connected

### Rules
- Don't suggest "working from the Surface" or "bringing the Surface"
- Don't suggest running Xcode on the Surface (impossible, it's Windows)
- MacBook is always the build machine
- Perris does his own on-device testing, Kiva does code changes and build prep
