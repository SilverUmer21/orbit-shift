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
| Game language everywhere | UI, animation and VFX reuse the game's own motifs: orbit rings and dashed orbits, paper folds and paper diamonds, the player's equipped ship and its trail, gold for stars/perfect. Menus should feel like the same world as a run. |
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
| Results | ✅ Built (results pass) | "LEVEL CLEAR!" curved on an arc (no level name above). Three folded paper stars, no captions, that pop in one by one with a sparkle burst, then float and twinkle. Score, best, near-miss line. Minimal next plane: "+15 STARS" on top, then plane · thin bar · count on one quiet line (no card). No goal-reward text list or "New biome awakened" (reward cards cover them). AGAIN with a bold folded back arrow (chapter) and Hangar showing the live equipped ship, same as Home. Content centred between the top and the buttons on tall phones. Beats: stars pop → score counts up and lands (0–0.8 s) → NEW ORBIT RECORD stamps in with a dashed orbit ripple → stars fly to the badge while a paper plane rides the next-plane bar; when affordable the bar shines, the text turns gold and a dashed orbit ring circles the Hangar button. |
| In-game HUD | ✅ Restyled | Score, flow, fever bar, counters. Play area untouched except VFX: in-run labels (PERFECT, FEVER, FRAGMENT…) pop in like a stamped paper tag in Lilita One and drift up; PERFECT shows the streak ("PERFECT ×3"); every shockwave ring leaves a dashed orbit echo. |
| Settings | ✅ Restyled | Paper switches, folded buttons. |
| Tutorial panel | ✅ Restyled | |
| Reward card | ✅ Built (Step 1) | Full-screen overlay, one card per reward: coral ribbon (NEW TRAIL!/NEW PAINT!/NEW RELIC!/LEVEL CLEAR!), counter dots, art drawn by game renderers, gold CLAIM, "Equip now" for trails/paints. After the last card, stars fly into the results star badge, which counts up; the next-plane bar fills from old to new total. Chapter clears keep the chapter stage art. |
| Island map | ✅ Built (Step 2) | PixiJS island art kept. Paper label cards pinned beside islands (night cards when locked / Void), gold progress bar per chapter, pulsing dashed ring + bobbing NEXT pin on the chapter to play, star chip in the header, folded Ascension button with best score. |
| Chapter screen | ✅ Built (Step 2, spacing pass) | Chapter planet removed (owner). "Stepping stones" (option A): levels zig-zag (28% / 72%) down the whole space between the story and PLAY on a dotted trail that turns mint (coral in Ember) up to the next level. Stars arc above each level; name and "Level N · 45s" centred below. Next level: big gold pulsing node, coral NEXT tag, gold name. Locked: lock node, muted label, GUARDIAN tag on guardian levels. Only the node, stars and label are tappable. One big PLAY for the next level. |
| **Hangar** | ⏳ Step 3 ← next | Currently only restyled cards; full redesign planned. |
| Awakening celebration | Unchanged | Canvas celebration on chapter clear. |

## 8. Roadmap

### Step 0 — Safe bug fixes  ✅ done (2026-10-17)
Fixed B1, B2, B3, B7, B8 (section 9). No redesign.

### Step 1 — Reward card  ✅ done (2026-10-17)
- One reward at a time on a large Paper Night card showing the real item: trail as a ribbon, paint as your old ship in that paint, relic/clear as a gold medallion.
- "NEW!" ribbon, gold CLAIM, "1 of N" counter.
- After the last reward, stars fly into the badge with a count-up, and the next-plane bar fills from the old value to the new one.
- Rewards stay saved before animations.

### Step 2 — Island map and chapter screen  ✅ done (2026-10-17)
- Keep the PixiJS island art. Labels become paper cards pinned beside islands.
- Pulsing "next" marker on the island to play, a star progress bar per chapter, a clear lock badge, and a styled Ascension button.
- Chapter screen: levels as dots on a path, next level highlighted, big PLAY for it.
- Decided: "Level N · Name" with the global level number (option A). Chapter planet art removed from the level list.

### Step 3 — Hangar  ← next
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
| B6 | Reward card | Placeholder glyphs (✦ ~ ◆ ●); rewards must be tapped through to discover. | Low | ✅ Fixed (Step 1): one card per reward with real art and dots |
| B7 | Map | Void lock is an emoji 🔒, looks different per phone. | Low | ✅ Fixed (Step 0): drawn folded lock + "Locked" |
| B8 | Progression | The 6th goal tries to unlock Bloom Wake (the Bloom chapter trail); its hint says "complete 6 goals". | Low | ✅ Fixed (Step 0): goals only unlock goal trails; hint says "clear First Light" |
| B9 | Chapter screen 320 px | The chapter planet art sits behind the last level cards on short screens. | Low | ✅ Fixed (Step 2): chapter planet removed from the level list |
| B10 | Results | Remake CSS gave `.result-objectives` `display:flex`, overriding `[hidden]`, so Ascension results showed the previous campaign stars. | Medium | ✅ Fixed (Step 1) |
| B11 | Map | The remake's `.island span` card rules also hit the progress bar's inner `<span>`, drawing a stray paper tab off-screen (seen at 320 px). Found during Step 2 build. | Low | ✅ Fixed (Step 2): bar is an `<i>` element |
| B12 | Results (phones ~620–844 px tall) | Leftover goal-reward text list and "New biome awakened" showed in plain caps and ran into AGAIN. Found by owner on a real phone. | Medium | ✅ Fixed: removed from results |
| B13 | Results (Android text scaling) | Android enlarged all text, pushing "AGAIN" past its button; the label also overflowed at 320 px without scaling. Found by owner. | Medium | ✅ Fixed: `text-size-adjust:100%`, label sized to its button |
| B14 | Hangar (touch phones) | A page-wide `touchmove` blocker stopped the plane grid from scrolling on touch, so short phones could never reach the lower planes (root cause of B5). Found in the game review. | High | ✅ Fixed: the blocker skips `.rider-grid` and `.reward-choices` (verified: touch drag scrolls 0 px before, 157 px after) |
| B15 | Save | `localStorage.setItem` could throw (private mode, full storage) and break the end of a run. | Medium | ✅ Fixed: save is wrapped in try/catch |
| B16 | Chapter screen | Space on the chapter screen started Kindling / an old level index instead of the level PLAY shows. | Low | ✅ Fixed: Space uses the PLAY button's level |
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
| 2026-10-17 | Reward card approved: ribbons NEW TRAIL!/NEW PAINT!/NEW RELIC!/LEVEL CLEAR!, keep "Equip now" on trails and paints. |
| 2026-10-17 | Step 2 approved: chapter levels labelled "Level N · Name" (option A); the big chapter planet removed from the levels screen (owner). |
| 2026-10-18 | Animations approved (owner's top three): chapter unlock moment, results beats, PERFECT pop. Rule from owner: UI, animation and VFX must speak the game's language — orbit rings, paper folds and diamonds, the player's own ship and trail. |
| 2026-10-17 | Results pass (owner): curved title kept as mocked, title only (no level name), stars without captions and animated, minimal next-plane line, bold folded back arrow (option 1), Hangar uses the live ship. Also check results at 390×760. |
| 2026-10-17 | Levels page spacing: owner asked for more room and better text alignment; chose "Stepping stones" (A) over "Trail cards" (B). Mockups: `design/paper-night/previews/levels-spacing-options.png`. |

## 11. Technical map

| File | Role |
|---|---|
| `index.html` | DOM screens over the game canvas. Keep ids stable. |
| `game.js` | All game logic and canvas drawing. UI-only edits are allowed; gameplay functions are off-limits. |
| `art-renderers.js` | Planet and map renderers (`OrbitArt`). Off-limits for now. |
| `archipelago-map.js`, `campaign-map.js` | PixiJS island map, lazy-loaded by `campaign-map.js` (idle time, Islands button press, or first map call) (positions: Bloom 0.34w/0.23h, Ember 0.68w/0.5h, Void 0.34w/0.74h; scale `min(w/430, h/844)`). |
| `styles.css`, `journey.css` | Original styles (left intact). |
| `remake.css` | Paper Night layer loaded last; all remake styling goes here. |
| `fonts/` | Bundled Lilita One and Nunito. |
| `design/paper-night/` | Exported assets, icons, previews, app icon masters. |
| `tests/ascension-timing.cjs` | Deterministic gameplay/progression suite. Run `node tests/ascension-timing.cjs` and `node tests/ascension-timing.cjs 19 320`. Six PASS lines expected. |
| `tests/visual.html` | Isolated visual harness with a disposable save (`python3 -m http.server 3000`, open `/tests/visual.html`). |

**Performance notes (game review, 2026-10-17):**
- The game canvas is not repainted while an opaque screen covers it (`coveredModes`: map, chapter, Hangar, settings); the scene still updates.
- The background fill and planet glow are cached in a canvas-sized bitmap (`backgroundLayer`), rebuilt only when the palette, fever or size changes. This was the largest paint cost.
- The hidden Home rider preview is not redrawn. Fonts are preloaded. PixiJS (~800 KB) no longer loads with the page.
- Measured (4× CPU throttle, software rendering, 390×844 @3x): Home/run/results 14 → 39 fps, chapter and Hangar 14–16 → 60 fps. The map stays slow in software WebGL; check on a real phone.
- Canvas DPR is already capped at 2. JavaScript per frame is under 1 ms on desktop.

**Constraints learned:**
- `tests/ascension-timing.cjs` asserts `ui.resultHome.textContent === 'Ember Chapter'`. The results back button therefore keeps its label as text and draws its icon in CSS.
- The test DOM stub accepts new elements created via `document.querySelector`.
- `state` and other top-level `const`s are not on `window`. In the harness use `contentWindow.eval(...)`.
- Reward-card test contract: one button per reward in `#rewardChoices`, `#rewardName` keeps "Trail: spark" style text (visually hidden), clicking a choice selects it, `#continueRewards` on the last reward hides `#rewardSeal`.
- Any element given a CSS `display` in `remake.css` that is toggled with `hidden` needs an explicit `[hidden]{display:none}` rule.
