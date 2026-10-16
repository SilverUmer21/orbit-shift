# Orbit Shift: Game Design Document (v0.1 draft)

Status: **draft for review.** Sections marked **DECISION** list options with a recommendation. Pick one, or write your own, and I will lock it in and update this file.

---

## 1. What the game is today

**One-line pitch:** Tap to reverse your glider around a living planet and thread contracting gates in a world made of folded paper.

**Core loop (as built):**
- The ship orbits a planet at a fixed radius. One tap reverses direction.
- Gates (rings with a gap) contract toward the planet. Be in the gap when one arrives.
- Passing near the gap's centre is a **perfect**. Perfects build **flow** (x1 to x5).
- Five perfects trigger **fever** (6 s, x5, slower hazards) and a one-time shield per run.
- Orbit fragments float in and can be collected for extra stars.

**Structure:**
- Campaign: Bloom (4 levels) and Ember (4 levels), each 45 to 80 s. Each level has 3 ratings (clear, fragments, perfects). Void is locked and unbuilt.
- Ascension: a continuous 120 s+ run through Bloom, Ember and Void, with three guardians. This is the only quasi-endless mode.
- Meta: stars buy 6 ships (40 to 550) and 7 trails. Three home-screen goals rotate.
- Tutorial: 4 steps, skippable.

**Technical constraints we keep:**
- Static, dependency-free web app on Vercel (Canvas gameplay, DOM menus, PixiJS map).
- Saves live in `localStorage` and must stay migratable.
- Mobile portrait first, with reduced-effects and haptics options.

## 2. Diagnosis: why players leave

| Problem | Evidence | Effect |
| --- | --- | --- |
| Fixed, authored routes | Every level has a hard-coded gate list | Replays feel identical, so there is little mastery payoff |
| One input, one threat type | Gates are the main obstacle, with a hazard now and then | Skill ceiling is reached fast |
| Weak session hooks | No daily reason to return, no streaks | Day-1 to day-7 drop-off |
| Slow first reward | First run pays about +1 star, cheapest ship costs 40 | Early progression feels dead |
| Single currency | Stars are the only currency | Nothing to chase besides ships |
| Ascension is not an endless mode | Ends at a finite act list | No "one more run" loop |
| Dull presentation | Flat ships, plain menus and results | Weak first impression and no sense of reward |

## 3. Design pillars (proposed)

1. **One tap, endless depth.** The input never changes. Variety comes from the world, not the controls.
2. **Rhythm over reflex.** Gates are read and timed, never random walls.
3. **Every run leaves something behind.** Stars, a new best, a restored piece of the world, or progress on a goal.
4. **The universe is folded paper.** Everything, including UI, is cut, layered and lit paper.

## 4. Mechanics options

### 4.1 Endless runs that get harder  **DECISION**

Goal: a "one more run" mode with a clear difficulty curve.

- **A. Tiered Ascension (Recommended).** Procedural gate rhythm in bands (Bloom, Ember, Void, then loop faster). Difficulty ramps by speed, gap size, gate pairs and hazard density. Milestone every 25 gates grants a bonus.
  - Pro: builds on the existing route planner, which already guarantees reachable gaps.
  - Con: needs careful tuning and new tests.
- **B. Depth levels.** Each 30 s is a "depth" with a named modifier set; the run ends in a death only.
  - Pro: very readable progress.
  - Con: more authoring.
- **C. Survival with a rising shadow.** A paper "eclipse" closes in over time; perfects push it back.
  - Pro: strong tension.
  - Con: biggest rule change.

Scoring (all options): keep flow and perfects; add a distance milestone bonus and a "clean streak" multiplier. Track personal best per mode.

### 4.2 Power-ups and run modifiers  **DECISION**

- **Power-ups (in-run pickups):**
  - *Paper Shield:* absorbs one crash (existing shield, made collectable).
  - *Slow Fold:* gates slow for 5 s.
  - *Star Magnet:* fragments pull in.
  - *Gap Bloom:* gaps widen for 3 gates.
  - *Echo Dash:* the next reversal is free of the turn cooldown.
- **Run modifiers (chosen before a run or rolled per run):**
  - *Double Time* (faster, x2 stars), *Thin Gaps*, *Mirror Gates*, *No Shield*, *Heavy Ship* (slower reversal turn).
- Options:
  - **A. Pickups only.** Simple; fits the one-input pillar.
  - **B. Pickups plus pre-run modifier picker (Recommended).** The player chooses risk for reward.
  - **C. Roguelite draft.** Every 25 gates choose 1 of 3 boons.
    - Highest depth and replay, highest cost to build and balance.

### 4.3 Challenges and daily goals  **DECISION**

- **Daily Challenge:** one fixed-seed run per day with a global shared seed, with a streak bonus.
- **Weekly Constellation:** a 5-step goal across the week that restores a piece of a constellation.
- **Mastery goals:** keep the 3 rotating goals, and add tiered long-term ones (for example "50 perfects in one run").
- Options:
  - **A. Daily seed + streak (Recommended).** Cheap, high retention.
  - **B. A plus weekly constellation.**
  - **C. Full quest board.** More UI and content cost.

Note: with no backend, leaderboards are local. Daily seeds work offline from the date.

### 4.4 Chapter bosses  **DECISION**

Bloom has the Budkeeper and Ember has the Solar Forge, both gate-pair guardians. Options:
- **A. Pattern bosses (Recommended).** Each boss has 3 phases of distinct gate patterns plus a telegraphed attack, and you win by passing N gates.
- **B. Interactive bosses.** Perfects deal damage; the boss has a health bar.
- **C. Keep as is** and add spectacle only.

### 4.5 The Void chapter  **DECISION**

Theme: the Eclipse that broke the rhythm; the "wrong" side of the paper.
- **A. Gravity-shift Void (Recommended).** The planet's pull shifts, so the orbit becomes an ellipse. This is the new mechanic and it reuses the single input.
- **B. Dark Void.** Gates are only visible near the ship; memory and rhythm matter.
- **C. Mirror Void.** Two ships, one tap, one mirrored. Hard and distinctive.

Four levels, ending in the Eclipse Eye boss. Unlocks after Ember, as the README's existing order implies.

## 5. Economy and progression  **DECISION**

- Keep stars as the soft currency and add **Shards** (earned from challenges and bosses) for cosmetics and modifiers.
- Faster early game: first-run bonus and a cheaper first ship (about 15 stars).
- Ships and trails stay purely cosmetic. No pay-to-win.

## 6. Art and UI direction

Chosen so far:
- **Style:** luminous papercut, deepened (layered paper, cast shadows, glowing cut edges, grain, parallax). Neon cosmic glass demos are provided for comparison; see `docs/style-demo.html`.
- **UI:** diegetic cosmic console: a star-chart hub, planets as level nodes, orbit-ring controls and a ship dock instead of card grids.
- **Art source:** all art is authored in code (SVG and Canvas) for this repo.

Deliverables, in order:
1. Design tokens: palette, type, paper layer rules, shadow and glow rules.
2. Ships: six redrawn gliders, drawn as layered paper with fold lines.
3. Home hub and chapter map.
4. HUD, gates, planets and effects.
5. Results, garage, settings.
6. Polish iterations on screenshots until each screen passes review at 320x568, 390x844 and 430x932.

## 7. Delivery plan

| Phase | Content | Branch |
| --- | --- | --- |
| 0 | GDD review (this doc) | `feature/ui-art-overhaul` |
| 1 | Art system and UI shell | `feature/ui-art-overhaul` |
| 2 | Endless mode, power-ups, modifiers | feature branch per system |
| 3 | Daily challenges and economy | feature branch |
| 4 | Bosses and the Void chapter | feature branch |

Each phase keeps the existing save format migratable and keeps `tests/ascension-timing.cjs` passing.

## 8. Open questions

1. Is the game free with no ads, or will it have a store listing later (Android direction)? This affects the economy.
2. Is a backend acceptable later for real leaderboards?
3. Target session length: 60 s quick runs, or 3 to 5 min?
