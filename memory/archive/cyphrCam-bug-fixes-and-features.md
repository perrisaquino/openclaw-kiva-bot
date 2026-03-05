# CyphrCam Bug Fixes & Feature Requests
*From: Florida Cyphr Notes (travel pressure-testing)*
*Logged: 2026-02-26*

## Context
Perris tested CyphrCam during an 8-hour cross-country trip to Florida for a performance. Captured creative moments during travel (including airplane bathroom video). These issues were found through real-world pressure testing.

---

## 🔴 BUGS (Fix Priority)

### 1. Music Note Audio Overlap
**Issue:** When playing music from the library and opening a music note, the audio from both sources plays simultaneously (overlapping).
**Expected:** Opening a music note should pause/cancel the background music from the library, so only one audio output plays at a time.
**Priority:** High - breaks core UX

### 2. Highlights Editor Freezing
**Issue:** When editing videos in highlights, the app freezes. During playback, the play button sometimes appears while video is playing, requiring an extra tap to dismiss.
**Priority:** High - makes highlights tool unreliable

### 3. Highlights Tool Seek Bug (Critical UX)
**Issue:** When using the highlights editor on a long video and skipping far ahead before the thumbnail renders, it breaks the highlights tool AND the main playback screen. Playback won't work at all after closing the highlights tool. Workaround: save to drafts, restart, reopen. This can happen repeatedly.
**Impact:** "Feels like I have to walk on eggshells when I use the highlights tool. It's not reliable."
**Priority:** Critical - makes highlights feature feel broken

### 4. Playlist "Sort by Most Recent" Not Working
**Issue:** The "sort by most recent" option in the playlist section doesn't actually sort when clicked. New playlists still appear at the bottom requiring scrolling.
**Context:** Perris created a new playlist for Florida-specific tracks and had to scroll down every time.
**Priority:** Medium - friction in daily workflow

---

## 🟡 UX IMPROVEMENTS

### 5. Refine Tool UX Overhaul (Nickel Feedback)
**Issue:** The refine/sync tool is not user-friendly. Nickel (beta tester, BTM community leader) found it confusing.
**Specific Problems:**
- Switching to iPhone speakers step is confusing
- The waveform syncing process isn't intuitive
**Proposed Solutions:**
- Option A: Make it more like Instagram's sound-matching UI
- Option B: Traditional video editing timeline for one-time waveform alignment
- Option C: Add a second slide/modal with visual instruction showing how to drag the waveform to match video
- Option D: Screen recording/motion graphic walkthrough
**Key Insight:** "Many people find it hard to use a video editor in the first place. But the key is that it happens once."
**Note:** Nickel did figure out the music eventually - it's about making the sync process more efficient and intuitive.
**Priority:** High - blocking key partnership with BTM community

### 6. Draft Cleanup on Export
**Issue:** When revisiting a draft and exporting it, the draft remains and takes up space.
**Expected:** Exporting a draft should remove it from drafts (or prompt to remove).
**Priority:** Medium - storage management

---

## 🟢 FEATURE REQUESTS

### 7. Randomly Generated Playlists
**Concept:** Auto-generated playlists based on different filters: intentions, artists, moods, genres, etc. to help switch things up during practice.
**Status:** Feature idea only - DO NOT implement yet. Add as future task.
**Priority:** Low - nice-to-have for future roadmap

---

## Task Summary (for Claude Code when ready)

| # | Type | Description | Priority |
|---|------|-------------|----------|
| 1 | Bug | Music note audio overlap | High |
| 2 | Bug | Highlights editor freezing + play button persistence | High |
| 3 | Bug | Highlights seek bug breaking playback entirely | Critical |
| 4 | Bug | Playlist sort by most recent not working | Medium |
| 5 | UX | Refine tool overhaul (Nickel feedback) | High |
| 6 | UX | Draft cleanup on export | Medium |
| 7 | Feature | Random playlist generation | Low/Future |

---

## 🔴 NEW BUGS - Nickel Setup Session (March 3, 2026)

### 8. Calibration Displays 0ms After Setting 180ms in Refine Tool
**Issue:** After completing first calibration and setting delay to 180ms in refine tool, the Settings "Bluetooth Delay" field still shows 0ms. Users think calibration didn't save.
**Root Cause (code audit):** `SettingsView.swift` line 563 displays `calibration.latencyOffset` (base estimate only), ignoring `totalManualAdjustment`. Should display `calibration.finalOffset` instead.
**Reproducible:** Yes, multiple users have reported this pattern.
**Priority:** Critical - App Store blocker. Destroys user trust in core feature.

### 9. Calibration Requires Export + Re-recording to Confirm
**Issue:** After calibrating, users must export the video AND record a new video to see that calibration actually saved. No immediate feedback that it worked.
**Expected:** Calibration should show results immediately in refine tool playback and settings display, without requiring export or re-recording.
**Priority:** Critical - First-time user experience killer.

### 10. Waveform Visual Shifts But Audio Playback Doesn't Match
**Issue:** In refine tool, dragging waveform updates visual position immediately but audio composition has a 500ms buffer rebuild delay. During that gap, what you see and what you hear are out of sync.
**Root Cause (code audit):** `VisualSyncEditorView.swift` composition rebuild has buffer stabilization delay. Sign convention (`baseOffset - timingAdjustment`) may also miscalculate for new users with no prior calibration.
**Priority:** High - Visual feedback is lying to the user about sync state.

### 11. 180ms Preset Not Applying on First Use (New Users)
**Issue:** Setting 180ms for AirPods doesn't apply to first recording. Manually entering the same value afterward works fine.
**Root Cause (code audit):** `LatencyDetectionService.swift` line 1208 `saveCalibration()` stores to `UserDefaults`, but initial onboarding flow may not trigger this function before first recording. The 180ms never applies to first export.
**Priority:** High - Breaks the out-of-box experience.

### 12. Looping Tool UI Needs Overhaul for Teaching Use Case
**Issue:** Nickel wants to use CyphrCam for teaching by looping sections of music. Current looping UI isn't intuitive enough for classroom use.
**Use Case:** Select a section of a song, loop it, teach choreography/technique over that section.
**Priority:** High - Nickel testing in BTM classroom soon. Direct partnership pathway.

---

## 📝 PATTERNS & NOTES

### Two Validated Use Cases (March 3, 2026)
Nickel confirmed 2 distinct CyphrCam use cases:
1. **Planned dance video creation** - Upload music, record, export
2. **Teaching with loops** - Loop sections for classroom instruction

Anthony Boone independently validated the same teaching use case the same day. Two teachers, same pattern.

### Music Import Friction = #1 Barrier to Daily Use
Users won't build playlists because importing music requires knowing a piracy workflow. Solutions being explored:
- Bundle royalty-free tracks for onboarding
- Cyphr Music discovery features (Jamendo integration)
- "30 seconds to add a song" tutorial content

---

| # | Type | Description | Priority |
|---|------|-------------|----------|
| 8 | Bug | Calibration displays 0ms after 180ms set | Critical |
| 9 | Bug | Calibration requires export + re-record to confirm | Critical |
| 10 | Bug | Waveform visual doesn't match audio playback | High |
| 11 | Bug | 180ms preset not applying on first use | High |
| 12 | UX | Looping tool UI for teaching use case | High |

---

*These tasks are organized and ready for when Perris wants to delegate to Claude Code. DO NOT edit CyphrCam code without explicit permission.*
