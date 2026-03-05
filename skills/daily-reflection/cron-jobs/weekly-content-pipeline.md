# 📅 Weekly Content Pipeline Cron Job

**Trigger:** Every Sunday at 8:00 PM PST  
**Duration:** ~30-45 minutes processing time  
**Purpose:** Transform weekly reflection patterns into strategic content pipeline

---

## 🎯 Cron Job Specification

```bash
# Weekly Content Extraction - Sundays at 8 PM PST  
0 20 * * 0 /Users/iamperris/.openclaw/workspace/scripts/weekly-content-extraction.sh
```

## 🔄 Execution Steps

### Phase 1: Reflection Analysis (10 min)
1. Scan all Quick Capture files from past 7 days
2. Extract progressive summarization patterns:
   - Bold text frequency and topics  
   - Bold+highlight content (highest priority)
   - Checked box patterns across reflections
   - Personal note additions and connections
3. Identify recurring themes and breakthrough moments

### Phase 2: Content Ideation (15 min)  
1. Apply content strategy frameworks to extracted patterns
2. Generate content ideas across 4 pillars:
   - **Builder's Journey** (40%): Solo dev, business decisions, AI collaboration
   - **Dance Community** (30%): CyphrCam insights, industry critique, artistry
   - **Growth & Systems** (20%): ADHD strategies, knowledge management, consciousness
   - **Community Building** (10%): Vulnerability, connection, authentic sharing
3. Create compelling headlines using copywriting skill
4. Match voice modes to reflection emotional states

### Phase 3: Notion Integration (15 min)
1. Format content ideas for Notion database structure
2. Assign platform optimization (Substack/Threads/Instagram/LinkedIn)  
3. Add priority levels based on progressive summarization intensity
4. Include source reflection links for authenticity verification
5. Push to Notion content pipeline via API

### Phase 4: Weekly Planning (5 min)
1. Generate suggested content calendar for the week
2. Balance content pillars across platforms
3. Identify high-priority items for immediate development
4. Create summary report for Monday morning review

---

## 🎯 Notion Database Fields

**Content Ideas Table Structure:**
- **Title** (Headline from copywriting skill)
- **Content Pillar** (Builder/Dance/Growth/Community - 40/30/20/10 split)
- **Platform** (Substack/Threads/Instagram/LinkedIn/Multi)  
- **Hook Strategy** (SEED framework classification)
- **Priority** (High/Medium/Low based on progressive summarization intensity)
- **Source Reflection** (Link back to Quick Capture note)
- **Voice Mode** (Emotional state context from reflection)
- **Status** (Extracted/In Progress/Drafted/Published)
- **Authenticity Notes** (Key elements that make content genuine)
- **Created Date** (Sunday extraction date)

---

## 🚀 Expected Outputs

**Weekly Content Pipeline Delivery:**
- **5-10 content ideas** extracted from reflection patterns
- **2-3 high-priority items** ready for immediate development  
- **Platform-specific optimization** suggestions
- **Authenticity preservation** through source reflection context
- **Content calendar** for strategic weekly planning

**Integration Benefits:**
- **Obsidian → Notion** seamless pipeline
- **Reflection patterns → Content strategy**
- **Personal growth → Audience value**
- **Authentic voice → Strategic distribution**
- **ADHD workflow → Systematic output**

---

*This cron job transforms your natural reflection process into a content creation engine that maintains authenticity while serving strategic business goals.*