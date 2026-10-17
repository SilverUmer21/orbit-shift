# Orbit Shift — Game Design Document

Living document for the **Complete Remake** (`complete-remake-orbit-shift` branch). Read this before every work session and update it whenever something is built, decided or found.

Last updated: 2026-10-17

---

## 1. Game in one line

A one-tap, portrait, hyper-casual orbit game: your paper glider circles a living planet, you tap to reverse, and you thread closing paper gates on the way to restoring the Cosmic Islands.

- **Platform:** mobile web (static HTML/Canvas, no build step). Later wrapped with Capacitor for Android (see `ANDROID-RELEASE.md`).
- **Target sizes:** 320×568, 390×844, 430×932 portrait.
- **Story:** the universe is folded living paper. An Eclipse broke its rhythm; the glider reconnects stars and wakes each island. Told through scenery and one-line chapter text only.

## 2. Working agreement

1. **Plan → mockup → owner approves → build → test at 390 and 320 → screenshot → commit and push.** One step at a time.
2. **Never change gameplay** (movement, tap-to-reverse, collisions, timing, scoring, fever, shield) or **how rings/gates form and draw**.
3. **Do not change the planets** (game's `bloom-crown` / `ember-furnace` renderers) or the **planes/ship art** (`drawGlider`) without explicit approval. A plane redesign is deferred.
4. Keep every DOM id that `game.js` uses. Do not weaken or edit tests to make a change pass.
5. Ask the owner when a choice is theirs; report bugs found and fix them inside the current step.
6. All work goes on `complete-remake-orbit-shift`.

## 3. Hyper-casual pillars (research summary)

| Pillar | What it means here |
|---|---|
| Instant play | One control, playing within seconds. PLAY on Home starts the next level directly. |
| Short sessions | Levels are 45–80 s (genre norm ~40 s). Level lengths are gameplay and stay as they are. |
| Light meta layer | Stars → planes, paints, trails, relics. Show the next unlock everywhere (Home badge, results progress bar). |
| Reward every level | Loud, staged level-end: stars, near-miss line, one reward at a time, progress bar filling toward the next plane. |
| Staged juice | Feedback in beats ~60–150 ms apart (spark → value → count-up → pulse). Never everything at once. |
| Obvious next step | Maps are a path with the next level highlighted and one big PLAY. |
| No ads | The game has no ads. Do not add ad-gated rewards unless the owner asks. |

Sources: Homa Games "15 Golden Rules"; Voodoo design guide (GameAnalytics); Tap Nation hybrid-casual features; GameAnalytics meta mechanics; Game Developer (map formats, game juice); CrazyLabs level design; Etermax/G5 progress-bar rewards.

## 4. Core gameplay (locked — do not change)

- Glider orbits the planet; **tap / Space / ←→ reverses direction**.
- **Gates (paper rings)** close in from outside with a gap; you must be at the gap when they reach your orbit.
- **Perfect**: pass near the gap centre. Golden-petal gates have a more forgiving perfect window.
- **Fever**: 5 perfects → 6 s at x5, hazards slowed 20%, grants the one **flow shield** per run.
- **Fragments**: 6 per level, collect 3 for the fragment star; extras give bonus stars.
- **Hazards**, **heat gates** (Ember: 75% → 125% speed), **paired gates**, **guardians** (Budkeeper, Solar Forge).
- **Ascension**: endless run through Bloom → Ember → Void with three guardians.

### Campaign

| Chapter | Level | Duration | Perfect target |
|---|---|---|---|
| Bloom | First Light | 45 s | 2 |
| Bloom | Pollen Path | 55 s | 2 |
| Bloom | Tangled Orbit | 65 s | 3 |
| Bloom | Crown of Petals (Budkeeper) | 75 s | 3 |
| Ember | Kindling | 60 s | 2 |
| Ember | Cinder Step | 65 s | 2 |
| Ember | Furnace Heart | 70 s | 3 |
| Ember | Solar Forge (guardian) | 80 s | 3 |
| Void | Eclipse Eye | — | deferred |

Each level has 3 stars: **finish**, **3 fragments**, **perfect target**. 24 stars total. Completing a level unlocks the next; finishing Crown of Petals unlocks Ember.

## 5. Meta and economy (current numbers)

**Stars (currency) per run:** gate +1, perfect +2, fragment +3, fever +5, guardian +10, first level clear +15, goal rewards +18 to +70.

**Planes** (`riders`, art by `drawGlider`, cosmetic only): Manta 0 (start), Dart 40, Crescent 100, Splitwing 200, Shuttle 350, Ring Sail 550.

**Paints** (`cosmetics`, unlocked by best score): Bloom 0, Ember 250, Void 700.

**Trails** (7): Paper (start); Pollen, Spark, Ribbon, Echo, Crown unlock one per goal completed; Bloom Wake unlocks on the first Bloom level clear.

**Goals:** three slots (Survival, Skill, Journey), each cycling through three tiers. Home shows only the goal closest to completion.

**Relics:** one per guardian cleared, plus the Bloom Crown relic.

**Save:** `localStorage`, `SAVE_VERSION = 5`. Rewards are saved before any reward animation plays. Preview builds must never write the real save.

## 6. Art direction — Paper Night

Approved direction "A · Paper Night": calm teal night, cut-paper layers, gold actions. Max 2–3 focal points per screen; supporting UI stays small.

**Colour tokens** (`remake.css` `:root`): Night 900 `#0A1F24`, Night 800 `#0E2A30`, Night 700 `#12363D`, Night 600 `#1A4A50`, Paper `#FFF4DC`, Paper fold `#E9D6B0`, Mint `#A8F0CF` / `#5ED6A6` / `#2E9C80`, Gold `#FFC94D`, Gold shade `#E0A93A`, Ember lip `#E0703C`, Coral `#FF6F61`, Muted `#7FA8A2`.

**Type:** Lilita One (titles, scores, buttons), Nunito 800/900 (UI). Both bundled in `fonts/` (OFL) for offline play.

**Buttons:** folded two-tone face (100° hard split), lit top edge, cut lip that sinks 4–6 px when pressed. Gold = the one primary action per screen; Night = navigation; Mint = confirm.

**Icons:** folded glyphs, two paper tones plus one accent, 48 px grid (`design/paper-night/svg/icons/`).

**Logo:** "ORBIT" (paper) over "SHIFT" (gold), offset left/right so the words physically shift.

**Planets:** always the game's own renderers. **Ships:** always the original `drawGlider` art.

Design canvas (mockups and boards): https://claude.ai/artifact/DzV3n7kg777bLBkugXmVtF ("A · Paper Night" page).

## 7. Screens — status

| Screen | Status | Notes |
|---|---|---|
| Home | ✅ Built | Logo, best, live planet with equipped ship orbiting (game canvas), closest-goal chip, PLAY (next level) with Hangar (live ship icon + affordable badge) and Islands (detailed island). Top bar: folded gear, big star badge. |
| Results | ✅ Built | Level name + title, 3-star row with captions, score, best, near-miss line, next-plane progress card, AGAIN with Back/Chapter and Hangar. |
| In-game HUD | ✅ Restyled | Score, flow, fever bar, counters. Play area untouched. |
| Settings | ✅ Restyled | Paper switches, folded buttons. |
| Tutorial panel | ✅ Restyled | |
| **Reward card** | ⏳ Step 1 | See roadmap. |
| **Island map + chapter list** | ⏳ Step 2 | See roadmap. |
| **Hangar** | ⏳ Step 3 | Currently only restyled cards; full redesign planned. |
| Awakening celebration | Unchanged | Canvas celebration on chapter clear. |

## 8. Roadmap

### Step 0 — Safe bug fixes  ✅ done (2026-10-17)
Fixed B1, B2, B3, B7, B8 (section 9). No redesign.

### Step 1 — Reward card  ← next
- One reward at a time on a large Paper Night card showing the real item: trail as a ribbon, paint as your old ship in that paint, relic/clear as a gold medallion.
- "NEW!" ribbon, gold CLAIM, "1 of N" counter.
- After the last reward, stars fly into the badge with a count-up, and the next-plane bar fills from the old value to the new one.
- Rewards stay saved before animations.

### Step 2 — Island map and chapter screen
- Keep the PixiJS island art. Labels become paper cards pinned beside islands.
- Pulsing "next" marker on the island to play, a star progress bar per chapter, a clear lock badge, and a styled Ascension button.
- Chapter screen: levels as dots on a path, next level highlighted, big PLAY for it.
- Open decision: "Level 6 · Pollen Path" numbering vs names only (show both in the mockup).

### Step 3 — Hangar
- Showcase: selected old ship on a floating-island stand.
- Tabs Planes / Paint / Trails, one grid at a time.
- Clear card states: equipped, owned, affordable, locked.
- Every trail and paint gets a name and a tappable unlock hint.
- Buying a plane plays a short unlock celebration, then Equip.

### Later (not scheduled)
Plane redesign (paper-plane set exists in `design/paper-night/svg/planes/`, not adopted), Void chapter, Android wrapper, V3 Constellation Weaving and Best-Run Ghost (see README).

## 9. Bug log

| # | Area | Bug | Severity | Status |
|---|---|---|---|---|
| B1 | Results | Goal-reward stars are added to the total but not shown in "+X stars" (can show +0 after earning +18). | Medium | ✅ Fixed (Step 0): `state.runGoalStars` counted in the total, no double counting |
| B2 | Chapter list | Earned ★ and unearned ☆ look almost the same in gold; 0-star levels look complete. | Medium | ✅ Fixed (Step 0): solid gold vs faint stars |
| B3 | Map 320 px | Island labels wrap and overlap the Ember/Void islands; title wraps to two lines. | Medium | ✅ Fixed (Step 0): labels positioned from the map layout via container units, no wrapping; map and chapter titles fit |
| B4 | Hangar | Trails/paints have no labels or unlock hints; hint only on mouse hover. | Medium | Step 3 |
| B5 | Hangar 320 px | Only ~1.5 rows of planes visible; paints/trails take most space. | Low | Step 3 |
| B6 | Reward card | Placeholder glyphs (✦ ~ ◆ ●); rewards must be tapped through to discover. | Low | Step 1 |
| B7 | Map | Void lock is an emoji 🔒, looks different per phone. | Low | ✅ Fixed (Step 0): drawn folded lock + "Locked" |
| B8 | Progression | The 6th goal tries to unlock Bloom Wake (the Bloom chapter trail); its hint says "complete 6 goals". | Low | ✅ Fixed (Step 0): goals only unlock goal trails; hint says "clear First Light" |
| B9 | Chapter screen 320 px | The chapter planet art sits behind the last level cards on short screens. | Low | Step 2 (chapter redesign) |
| — | Test harness | `tests/visual.html` logs 7 harmless 404s: the browser fetches files before `<base href>` applies. Real game loads cleanly. | Not a game bug | Noted |

## 10. Decisions log

| Date | Decision |
|---|---|
| 2026-10-16 | Paper Night (direction A) chosen over Pop Fold and Ink Orbit. |
| 2026-10-16 | Use the game's own planets in all art; keep the old planes; plane redesign later. |
| 2026-10-17 | Remake lives on `complete-remake-orbit-shift`. |
| 2026-10-17 | Home shows one goal (closest to completion). Garage renamed Hangar. Equipped ship orbits the planet on Home. |
| 2026-10-17 | PLAY starts the next unlocked level (tutorial first for new players); Islands opens the map. |
| 2026-10-17 | Home icons: folded gear (A), big star badge (A), Hangar shows the live equipped ship (B), detailed floating island (A+). |
| 2026-10-17 | No ads. Work order: Step 0 bugs → 1 reward card → 2 map → 3 Hangar. |

## 11. Technical map

| File | Role |
|---|---|
| `index.html` | DOM screens over the game canvas. Keep ids stable. |
| `game.js` | All game logic and canvas drawing. UI-only edits are allowed; gameplay functions are off-limits. |
| `art-renderers.js` | Planet and map renderers (`OrbitArt`). Off-limits for now. |
| `archipelago-map.js`, `campaign-map.js` | PixiJS island map (positions: Bloom 0.34w/0.23h, Ember 0.68w/0.5h, Void 0.34w/0.74h; scale `min(w/430, h/844)`). |
| `styles.css`, `journey.css` | Original styles (left intact). |
| `remake.css` | Paper Night layer loaded last; all remake styling goes here. |
| `fonts/` | Bundled Lilita One and Nunito. |
| `design/paper-night/` | Exported assets, icons, previews, app icon masters. |
| `tests/ascension-timing.cjs` | Deterministic gameplay/progression suite. Run `node tests/ascension-timing.cjs` and `node tests/ascension-timing.cjs 19 320`. Six PASS lines expected. |
| `tests/visual.html` | Isolated visual harness with a disposable save (`python3 -m http.server 3000`, open `/tests/visual.html`). |

**Constraints learned:**
- `tests/ascension-timing.cjs` asserts `ui.resultHome.textContent === 'Ember Chapter'`. The results back button therefore keeps its label as text and draws its icon in CSS.
- The test DOM stub accepts new elements created via `document.querySelector`.
- `state` and other top-level `const`s are not on `window`. In the harness use `contentWindow.eval(...)`.
