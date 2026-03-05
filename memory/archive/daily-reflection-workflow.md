# Daily Reflection Workflow

## Model Hierarchy
- **Opus 4.6 (this session):** Receives daily reflections, extracts strategic insights, orchestrates content pipeline
- **Sonnet sub-agents:** Draft actual content pieces (long-form articles, short-form articles, Threads posts, IG carousels, LinkedIn posts, short-form video scripts, YouTube scripts)

## Process
1. Perris brain dumps in Daily Reflection group chat
2. **Opus** receives, extracts insights, identifies content angles
3. **Opus** stores raw reflection in `memory/YYYY-MM-DD-daily-reflection.md`
4. **Opus** updates `content-insights-pipeline.md` with new angles
5. **Opus** spawns Sonnet sub-agents to draft specific content pieces
6. Drafts stored in `content-drafts/` for Perris to review/approve

## Content Formats Sonnet Can Draft
- Long-form articles (newsletter/blog)
- Short-form articles
- Threads posts
- Instagram carousel posts
- LinkedIn posts
- Short-form video scripts (Reels/TikTok)
- YouTube scripts

## Strategic Files
- `content-strategy-roadmap.md` — master strategy (4 pillars, funnel, platform strategy, revenue milestones)
- `content-insights-pipeline.md` — running log of extracted insights and content angles
- `memory/YYYY-MM-DD-daily-reflection.md` — raw daily reflections

## Dual Purpose
Every daily reflection serves:
1. **Personal growth** — Perris becomes more intentional about ideas
2. **Content pipeline** — Ideas get turned into distributable content that builds personal brand + drives CyphrCam users + revenue