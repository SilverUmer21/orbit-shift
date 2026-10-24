# Orbit Shift — Game Design Document

Living document for the **Complete Remake** (`complete-remake-orbit-shift` branch). Read this before every work session and update it whenever something is built, decided or found.

Last updated: 2026-10-24

> ## ★ How we design (owner's rule, read first, every session)
>
> **Work as a game designer and a UI/UX game designer, not as someone decorating screens.**
>
> 1. **Start from the game's identity.** Before designing anything, look at its **theme** (a folded-paper cosmos with planets to restore), its **art style** (Paper Night: cut paper, folds, two-tone hard-split shading, night palette, gold for reward) and its **genre** (one-tap hyper-casual arcade with a light meta layer). Every screen, animation and VFX must feel like it belongs to this world and this genre.
> 2. **"Game language" ≠ reusing existing assets.** Existing art is a building block, not the rule. Invent new shapes, motion and effects whenever they express the theme, art style and genre better. Ask: *what does this say about the world, what should the player feel, and does it meet the genre's expectations (instant readability, speed, juice, an obvious next step)?*
> 3. **Research before making.** For every feature, first study how strong games in the genre and in similar art styles solve it: patterns, UX conventions, motion, feedback and retention mechanics. Write down the findings and the references, then design from them.
> 4. **Then the usual flow:** plan → mockup → owner approval → build → test → screenshot → commit and push.

---

## 1. Game in one line

A one-tap, portrait, hyper-casual orbit game: your paper glider circles a living planet, you tap to reverse, and you thread closing paper gates on the way to restoring the Cosmic Islands.

- **Platform:** mobile web (static HTML/Canvas, no build step). Later wrapped with Capacitor for Android (see `ANDROID-RELEASE.md`).
- **Target sizes:** 320×568, 390×844, 430×932 portrait.
- **Story:** the universe is folded living paper. An Eclipse broke its rhythm; the glider reconnects stars and wakes each island. Told through scenery and one-line chapter text only.

## 2. Working agreement

1. **Plan → mockup → owner approves → build → test at 390 and 320 → screenshot → commit and push.** One step at a time.
2. **Gameplay changes only as owner-approved additions** (section 4). Unapproved changes to movement, tap-to-reverse, collisions, timing, scoring, fever, shield and **how rings/gates form and draw** stay forbidden. Approved mechanics ship behind a flag until the owner has played them.
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
| Game language everywhere | UI, animation and VFX are designed from the theme (folded-paper cosmos), art style (Paper Night) and genre (one-tap hyper-casual), so menus feel like the same world as a run. This does not mean reusing existing assets: invent new art and motion when it serves the world better (see the rule at the top). |
| No ads | The game has no ads. Do not add ad-gated rewards unless the owner asks. |

Sources: Homa Games "15 Golden Rules"; Voodoo design guide (GameAnalytics); Tap Nation hybrid-casual features; GameAnalytics meta mechanics; Game Developer (map formats, game juice); CrazyLabs level design; Etermax/G5 progress-bar rewards.

## 4. Core gameplay

**2026-10-18:** the owner opened gameplay to *additions*. The one-tap instant reverse stays the core. New mechanics are approved one by one and ship behind a flag until the owner has played them. Anything not listed as approved below stays locked.

**Approved to prototype (Direction 2):**
- **Express fold.** Hold for speed; the owner calls it "the biggest great change".
- **The small five.** Brush sparks, Lost letters, hidden tap forgiveness, practice from the gatekeeper, and a tap lockout plus pause after interruptions.
- **Paper comets.**

**Built (beta, behind a Settings switch, on by default for playtesting):**
- **Tap turns, hold boosts** (Direction 3, 2026-10-24, owner-approved). With Express fold on, a tap turns when the finger lifts within 0.18 s (`HOLD_DECIDE`). A press still down at 0.18 s tucks for speed and never turns. The press is answered in the same frame with a crouch, a tick, a ring timer and a 10 ms buzz, so the wait isn't felt. A pending tap still counts inside the CLOSE CALL grace. Settings → "Classic: turn on touch" (`#classicToggle`, `state.classicTurn`) restores turn-on-press. The Settings practice tutorial always turns on touch.
- **Express fold** (2026-10-18). Holding tucks the glider: orbit speed ×1.3 (`FOLD_BOOST`), +6 score/s while tucked, a slimmer silhouette, paper streaks, a longer trail, and a low whoosh plus a light haptic.
- Releasing untucks it in about 0.1 s. Gate formation and timing rules are unchanged; only the player's angular speed scales, including in the exact gate-crossing calculation.
- The hold starts only from real input (pointer or key down), never from `reverse()` itself, so the test autopilot behaves exactly as before.

- **The small five** (2026-10-18, always on):
  - **Brush sparks.** Passing within about 0.12 rad of a hazard without touching it gives +12×multiplier score, a "BRUSH" tag and sparks, once per hazard.
  - **Lost letters.** Every 4th regular gate (not guardian, not paired) carries an envelope in its edge zone on a set side, so no extra randomness is used. Threading that edge (within 0.1 rad) collects it: +2 stars and a "LOST LETTER +2" tag. Counted in `state.runLetters`, ready for the Stamp Album.
  - **Hidden forgiveness** (real touch or key input only, so the test autopilot is unchanged):
    - A tap inside the 75 ms debounce is queued instead of dropped.
    - A gate edge that clips the ship by under 0.05 rad, while it moves away from the gap, gives a 70 ms grace window. A tap inside it forgives the crash ("CLOSE CALL").
  - **Practice from the gatekeeper.** After failing a guardian level past the guardian's start, results offer it. The run starts 2 s before the guardian with gate, fragment and hazard indices skipped ahead. It gives no stars, rewards or completion and ends on a "Practice" results screen.
  - **Tap lockout and pause.** Results ignore taps for 0.45 s. Returning to the app mid-run shows a "Paused · Tap to continue" card (Space works too) instead of resuming instantly.

- **Paper comets** (2026-10-18, beta). A folded paper star with ribbon tails, aimed at where the ship will be (±0.17 rad).
  - **Warning:** a gold dotted line along its path and a shrinking ring at the orbit crossing, for 1.1 s.
  - **Flight:** 0.9 s to the orbit at 430 px/s. It crosses the orbit **once**, then bursts on the planet.
  - **Outcome:** a hit within 19 px crashes ("hazard"). Passing within 48 px gives "TAIL SPARK" (+15×multiplier).
  - **Dodging:** reversing at the warning dodges it (verified: closest pass 53–62 px).
  - **When:** Ascension only for now, every ~8.5–11 s from 25 s, and every ~5.5–8 s in the Void and Ascension phases. Never within 2.6 s of a gate arriving.
  - **Tests:** only with real input, so the deterministic test autopilot never meets comets. The Void campaign levels will use them once they exist.

**Current core (unchanged):**

- Glider orbits the planet; **tap / Space / ←→ reverses direction**.
- **Gates (paper rings)** close in from outside with a gap; you must be at the gap when they reach your orbit.
- **Perfect**: thread *close to the gap's edge* (clearance under the perfect window; the old GDD wrongly said "centre"). Golden-petal gates have a wider perfect window.
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

## 4b. Story bible — The Night Post (approved 2026-10-18)

**Logline:** *Every star is a letter that never arrived. Fly them home.*

**Tone:** cozy & wondrous. No villain, no grim stakes. The world misses its messages.

**Characters:**
- **Pip.** A tiny paper-moth courier with an envelope satchel. Pip flies the glider, and the glider *is* a folded letter, so the ship art is unchanged.
- **Old Moon.** The sky's postmaster, a crescent in a nightcap. He dozed off with the dark paper curtain drawn (the "Eclipse"), so the night mail stopped and the islands curled up waiting.
- **Islanders.** Petal-folk (Bloom), match-folk (Ember), lost letters (Void). They appear on the map as you restore them.

**Mechanics in story terms:**

| Mechanic | Story term |
|---|---|
| Gates | Letter slots |
| Perfect | Gold postmark |
| 3 fragments | A stamp |
| Fever | Express Post |
| Hold (Express fold) | Pip tucks the letter tight for speed |
| Guardians | Gatekeepers who hoarded the mail and are calmed, not beaten |
| Clearing an island | Delivering its letter. The island unfolds, windows light up, and a gold thread joins two stars on the map. |

**Telling:** wordless, no more than 5 s per beat. A wax seal on the results screen, postcards as reward cards, one line of chapter text, islanders appearing on the map, and one-line letters from islanders arriving with rewards.

**Chapters:**
- **Bloom.** The dropped mailbag, then mailbox flags, then letters in vines. The Budkeeper blooms and hands over Ember's letter.
- **Ember.** A cold wax furnace, then the match-folk, then a thank-you postcard from Bloom. The Solar Forge reveals a letter addressed *"To Moon."*
- **Void.** Moon's curtain, then lost letters drifting, then a near-silent level, then Moonrise: Moon wakes and the nightly mail begins (this opens the daily live game).

**Retention forms:** Tonight's Letter (a daily shared delivery plus a postcard share card), mailbox flags / lanterns as the streak with a weekly Paper Moon freeze, Tonight's rounds (three daily goals), the Stamp Album (collection), decorating Pip's post office / Home sky (a place to spend stars), and letters from islanders (lore drip).

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
| Home | ✅ Built (Night Post v4, 2026-10-19) | Big ORBIT SHIFT title, live planet with the glider orbiting, and **Pip** (`pip.js` rig: always-alive base plus idle moves; see the Pip entries in the decisions log) placed just outside the orbit at the lower left, computed from the canvas layout. **Lantern string** shows the play streak (consecutive days in `stats.dates`; one lantern per night, a parcel on night 7; lit lanterns sway). **Mailbox** top right with a badge while tonight's letter is unflown; Pip's satchel seal glows then too; tapping Pip or the mailbox opens the Mailbag. PLAY shows "Level N". **Ascension portal** (D3 option B, 2026-10-24): a glowing dashed ring around a small planet with orbit ellipses and a sparkle, no plane, with "Ascension" and trophy · best underneath (`#homeBest` lives here). **Lanterns explained** (D3): after the first flight, a one-time card says what lanterns are and gives a starter Paper Moon. The newest lit lantern carries the night count. Tapping the string opens a status sheet (tonight lit or not, nights to the parcel, moons held). A dimmed string or a used moon gets one short toast. The closest-goal chip is hidden on Home. First launch shows only the title, the world, Pip and PLAY. |
| Mailbag + Tonight's Letter | ✅ Built (2026-10-19) | Drawer with one big sealed envelope and FLY. **Daily seeded run:** Ascension with gameplay randomness (gate plans, routes, pairs, comets, hazard timing) seeded by the night number (`gameRandom()`, mulberry32); particles stay random. Verified: the same sky twice, and different from a normal run. The first flight each night is scored (+10 stars, saved as `state.daily`); results read "Letter delivered!" / "Night N" with Share postcard (a spoiler-free text card via share sheet or clipboard). Later flights are "Practice". The delivered state shows the score, a fly-again outline button and Share postcard. |
| Results | ✅ Built (results pass; Direction 3 actions 2026-10-24) | **Actions (D3):** after a campaign win, a big gold **NEXT LEVEL** (`#nextLevel`, with "Level N · Name"; **NEXT CHAPTER** when the next level is in a new biome), with Replay as a small round button. After a loss, one big **RETRY**. Ascension shows **FLY AGAIN**. The Hangar button is hidden on results. Labels are sized with container units so they never overflow at 320. "LEVEL CLEAR!" curved on an arc (no level name above). Three folded paper stars, no captions, that pop in one by one with a sparkle burst, then float and twinkle. Score, best, near-miss line. Minimal next plane: "+15 STARS" on top, then plane · thin bar · count on one quiet line (no card). No goal-reward text list or "New biome awakened" (reward cards cover them). AGAIN with a bold folded back arrow (chapter) and Hangar showing the live equipped ship, same as Home. Content centred between the top and the buttons on tall phones. Beats: stars pop → score counts up and lands (0–0.8 s) → NEW ORBIT RECORD stamps in with a dashed orbit ripple → stars fly to the badge while a paper plane rides the next-plane bar; when affordable the bar shines, the text turns gold and a dashed orbit ring circles the Hangar button. |
| In-game HUD | ✅ Restyled | Score, flow, fever bar, counters. Play area untouched except VFX: in-run labels (PERFECT, FEVER, FRAGMENT…) pop in like a stamped paper tag in Lilita One and drift up; PERFECT shows the streak ("PERFECT ×3"); every shockwave ring leaves a dashed orbit echo. |
| Settings | ✅ Restyled | Paper switches, folded buttons. |
| Guided First Light | ✅ Built (D3, 2026-10-24) | A new player's PLAY opens Level 1 with a "Deliver the night mail" card (Pip presenting, letter → fold → glider). **Gate 1** slows, then waits completely for a tap: ghost finger with ripples, "TAP!", a red dashed path into the wall and a pulsing gold one back to the gap. **Gate 2** slows to 0.32× with "TAP!" only. **Gate 3** is not slowed. A miss in gates 1–3 bounces the gate back out ("AGAIN!") instead of crashing. Guided gates 1–2 are shaped so one tap about 1.1 s before the crossing is needed (this run only). The HUD fades in after gate 3 ("YOU'VE GOT IT") and `tutorialSeen` is set. **One-time tips** (`state.post.tips`, campaign only): HOLD with a filling ring at the start of Level 2 (0.25× until the fold is full); the first perfect ("Thread close to the edge / for a gold postmark") and the first fragment ("Catch 3 fragments / to earn a star") get a short slow-down and a card. Settings → Replay tutorial still runs the old four-step practice. |
| Reward card | ✅ Built (Step 1) | Full-screen overlay, one card per reward: coral ribbon (NEW TRAIL!/NEW PAINT!/NEW RELIC!/LEVEL CLEAR!), counter dots, art drawn by game renderers, gold CLAIM, "Equip now" for trails/paints. After the last card, stars fly into the results star badge, which counts up; the next-plane bar fills from old to new total. Chapter clears keep the chapter stage art. |
| Island map | ✅ Built (Step 2) | PixiJS island art kept. Paper label cards pinned beside islands (night cards when locked / Void), gold progress bar per chapter, pulsing dashed ring + bobbing NEXT pin on the chapter to play, star chip in the header, folded Ascension button with best score. |
| Chapter screen | ✅ Built (Step 2, spacing pass) | Chapter planet removed (owner). "Stepping stones" (option A): levels zig-zag (28% / 72%) down the whole space between the story and PLAY on a dotted trail that turns mint (coral in Ember) up to the next level. Stars arc above each level; name and "Level N · 45s" centred below. Next level: big gold pulsing node, coral NEXT tag, gold name. Locked: lock node, muted label, GUARDIAN tag on guardian levels. Only the node, stars and label are tappable. One big PLAY for the next level. |
| Night Post extras (beta) | ✅ Built (2026-10-19) | Settings switch `#extrasToggle` (default on).<br>• **Lanterns:** one lights per night when a flight ends (`state.post`). A held **Paper Moon** (max 1) covers one missed night: the moon hangs in that slot. One dark night without a moon dims the string; flying the next night relights it, shown with a paper patch. Two dark nights reset it. The next lantern pulses until tonight's is lit.<br>• **Parcel:** every 7th night, Pip holds it (`.pip.parcel`) and the parcel lantern sways. Tap Pip: it saves first, then the lid lifts and the gifts come out: 5★ → 10★ → 15★ cap, a week stamp, and a Moon if none is held.<br>• **Postcards:** 12 islander cards (`POSTCARDS`), art in `post-art.js`. Mailbag → Postcards opens on the newest unread; tap to turn over; a thumbnail strip shows all 12.<br>• **Stamp Album:** pages Bloom, Ember and Night Post, 12 stamps each. Page rewards: Pressed-petal trail, Wax-seal paint, Star lanterns.<br>• **Badges:** the mailbox badge counts the letter + unread cards + parcel. |
| Hangar | ✅ Built (Step 3, A · Sorting Room, 2026-10-19) | Pip's sorting loft:<br>• **Showcase** (`#hangarShowcase` canvas, drawn only while the Hangar is open): the previewed plane, paint and trail combined, on a folded paper stand, with a hanging name tag `#hangarName`.<br>• **Folder tabs** `#hangarTabs` switch one shelf at a time (`#riderGrid`, `#cosmetics`, `#trails`; ids kept).<br>• **Slots:** gold seal = equipped; mint outline = previewed; gold price tag = affordable; muted = too expensive; silhouette and lock = earned elsewhere.<br>• **`#hangarAction`:** BUY ★N / EQUIP / Equipped / a locked condition with a progress bar.<br>• **Tap to preview, tap again to buy or equip.** A purchase saves first, then plays the unfold, the NEW postmark and confetti, then EQUIP. |
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

### Direction 2 — story, gameplay depth, retention, Home  ← proposed, awaiting owner decisions
`docs/DIRECTION-2.md` (2026-10-18). Owner opened gameplay to *additions* (core one-tap reverse stays), chose a **cozy & wondrous** story tone and **Google Play** as the launch target. Proposal: story "The Night Post" (Pip the paper-moth courier, Old Moon the sleepy postmaster); depth ideas (Brush sparks, Lost letters, hidden forgiveness, practice from the gatekeeper, tap lockout + pause; then Express fold in Ember, Paper comets in Void, Stargazing calm mode); retention told through the story; Home redesign with Ascension one tap from Home. Each mechanic still needs owner approval.

### Retention & ASO strategy  ← proposed, merged into Direction 2
Research and proposal in `docs/RETENTION-STRATEGY.md`. Proposed waves: Tonight's Sky (daily seeded orbit and share card), Night Lanterns (streak with Paper Moon freeze), daily three goals, install/offline; then Constellation Atlas and Home sky decorations (stars sink, designed with the Hangar); then ghost, one notification, seasonal skies; ASO plan for Google Play and the web portals.

### Trailer A — "The Night Mail"  ✅ rendered (2026-10-19)
30 s, 1080×1920, `trailer/release/orbit-shift-night-mail-1080x1920.mp4`. Beats: hook "Tap… or not?" (slow motion into a razor gap, cut to black) → Pip and the sleeping planet ("The night mail stopped. / Pip needs a pilot.") → "One tap shifts everything" (captions drift with the glider and squash on each reverse) → "Hold to fly faster" (the video speed-ramps with the fold) → page-turn build: Thread / Feel the heat / Dodge → payoff: freeze on the 4th perfect, gold PERFECT ×4 postmark, the planet blooms, "Delivered." → islands and Tonight's Letter → end card (Pip, logo, "One tap. Deliver the night.", "No ads · Plays offline"). All footage is the real game on a virtual clock; staged gates are real gates whose gap is shifted so the game's own rules score the perfects. Soundtrack is synthesised from the render's event log (paper percussion at 100 BPM, music box, bells on gates and postmarks).
- Re-render: `node trailer/render.cjs measure`, then `node trailer/render.cjs render trailer/out`, `python3 trailer/soundtrack.py trailer/out/events.json trailer/out/soundtrack.wav`, then ffmpeg (command in `trailer/README.md`). Needs the preview server on port 3112.
- Before store use, swap "Coming soon to Google Play" for the official Get it on Google Play badge once the listing is live.

### Step 3 — Hangar  ✅ built (2026-10-19): A · Sorting Room
Pip's sorting loft:
- A showcase (the previewed plane in the previewed paint, on a folded paper stand, flying the previewed trail, with a hanging name tag).
- Folder tabs: Planes / Paint / Trails.
- A paper sorting rack.
- One action button: Buy / Equip / Equipped, or a locked item's condition with a progress bar.

Tap a slot to preview it (locked ones too); tap it again or the button to buy or equip. Buying plays the unfold, the NEW postmark and confetti, then Equip. Fits 390×844, 390×760 and 320×568 without scrolling. Prices and unlock rules are unchanged.

**Next: retention round 2** (parcel, Paper Moon, postcards, Stamp Album, Pressed-petal trail). Decisions are in `docs/HANGAR-RETENTION-2.md` §7; postcard lines are awaiting approval in §8.
Research, two directions (A · Sorting Room recommended, B · Island Dock) and the retention round (weekly parcel, Paper Moon freeze with dim-and-relight, islander postcards, Stamp Album) in `docs/HANGAR-RETENTION-2.md`; boards `design/paper-night/previews/hangar-directions.png` and `retention-wave2.png`.
- Showcase: selected old ship on a floating-island stand.
- Tabs Planes / Paint / Trails, one grid at a time.
- Clear card states: equipped, owned, affordable, locked.
- Every trail and paint gets a name and a tappable unlock hint.
- Buying a plane plays a short unlock celebration, then Equip.

### Direction 3 — feel, first minute, flow, challenge twists  ✅ built (2026-10-24), Special Delivery in the next version

The owner flagged six problems:
- no Next level after a win, and a Hangar button on the results screen;
- a weak Ascension button;
- unexplained lanterns;
- a poor tutorial;
- flat plane and boost animation;
- hold also turning the plane.

The owner also asked about challenge modes. The research, audit, proposal and decisions are in `docs/DIRECTION-3.md`, with boards in `design/paper-night/previews/d3-*.png`. In short:
- **Input:** turn on lift, hold 0.18 s to boost with no turn, same-frame press feedback, "Classic: turn on touch" in Settings.
- **Feel:** a juicier turn and boost recipe.
- **Tutorial:** First Light teaches itself (guided first three gates, no text, no failing them).
- **Results:** NEXT LEVEL / RETRY / NEXT CHAPTER, Hangar hidden.
- **Ascension:** a portal button.
- **Lanterns:** a first-night moment, a starter Paper Moon, a count, and a lantern sheet.
- **Challenge modes:** optional "Special Delivery" remixes. The first three are Turn the world (the owner's idea, with Pip pinned at the top), Postage and Lantern night.

**Owner's picks (2026-10-24) and what was built:**
1. Input "good to go". Built: turn on lift, hold to boost, Classic setting, CLOSE CALL grace for a pending tap.
2. Feel, "don't stretch it too long". Built: a short stretch and flip.
   - Crouch on press and a spring with a paper puff on release.
   - Gold boost aura with wind arcs, and a 24-point light/gold trail while tucked.
   - The camera pulls back 3.5%, with a rising bandpass whoosh.
   - Extra paper burst on a turn, and pentatonic perfect chimes.
   - A 50 ms hit-stop on a perfect streak of 4+ (real input only).
3. Guided tutorial "yeah ok". Built: Guided First Light and one-time tips (section 7).
4. Ascension "B is good, just show an orbit not a plane". Built: orbit portal with no plane.
5. Special Delivery "keep it in the GDD for next version". Not built; recorded below.
- Also fixed: button text overflowed at 320 (NEXT LEVEL / NEXT CHAPTER). Container-unit sizing now fits 390×844, 390×760 and 320×568.

**Next version: Special Delivery (recorded, not built).**
- **What it is:** an optional remix that changes one rule. It is never the campaign's hard mode.
- **How it reads:** one line of rule text, plus 1–3 wax seals for difficulty.
- **When it appears:** it unlocks after the Solar Forge or 60 s in Ascension, as a stamp on levels already cleared. One twist a week becomes Tonight's Letter on a fixed night.
- **Twists:**
  - **Turn the world** (owner's idea): Pip stays pinned at the top, and a tap reverses the planet's spin and swings its gates. Every level works as-is, so it's the cheapest to prototype.
  - **Postage:** every turn costs a stamp, and every gate passed pays one back.
  - **Lantern night:** only the light around Pip shows the gates; a natural opener for the Void chapter.
- Mockups: `design/paper-night/mockups/direction-3-board.html` (Challenge twists section).

### Later (not scheduled)
Plane redesign (paper-plane set exists in `design/paper-night/svg/planes/`, not adopted), Void chapter, Android wrapper, V3 Constellation Weaving and Best-Run Ghost (see README).

## 9. Bug log

| # | Area | Bug | Severity | Status |
|---|---|---|---|---|
| B1 | Results | Goal-reward stars are added to the total but not shown in "+X stars" (can show +0 after earning +18). | Medium | ✅ Fixed (Step 0): `state.runGoalStars` counted in the total, no double counting |
| B2 | Chapter list | Earned ★ and unearned ☆ look almost the same in gold; 0-star levels look complete. | Medium | ✅ Fixed (Step 0): solid gold vs faint stars |
| B3 | Map 320 px | Island labels wrap and overlap the Ember/Void islands; title wraps to two lines. | Medium | ✅ Fixed (Step 0): labels positioned from the map layout via container units, no wrapping; map and chapter titles fit |
| B4 | Hangar | Trails/paints have no labels or unlock hints; hint only on mouse hover. | Medium | ✅ Fixed in the Sorting Room: every item is named, and locked ones preview with their condition and progress on the action button |
| B5 | Hangar 320 px | Only ~1.5 rows of planes visible; paints/trails take most space. | Low | ✅ Fixed: one shelf at a time; the whole Hangar fits 320×568 with no scrolling |
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
| 2026-10-19 | Home v4 approved. The owner's "redundant mail" note meant the extra envelope floating next to Pip, not the top-right mailbox. The mailbox and its badge stay; the floating envelope is removed (Pip already wears an envelope satchel). When tonight's letter is ready, the satchel's wax seal glows softly. |
| 2026-10-19 | Home refinement (owner):
- PLAY was "way too high" on its own row, so it's back at the bottom between Hangar and Islands, smaller (≈186×66).
- **Ascension is a paper tab on the right edge**, between the title and the orbit, placed from the live layout so it never covers the glider's path. Its new icon is a paper glider launching up out of a dashed orbit ring around a tiny planet (the launch loops), with trophy · best underneath.
- **Pip rests at the lower left**, just above the Hangar button and clear of the orbit.
- The bottom carries only Hangar · PLAY · Islands.
- An interim layout had Pip perched by the logo; it was replaced the same day. |
| 2026-10-19 | The owner picked the 390×844 look, so the title is 60 px on all phones taller than 620 px (the 780 px step is removed). **The new animated Pip (`pip.js`) is wired into Home.** He is ticked from the game's frame loop only while Home shows, flies in each time Home opens, presents the letter when it's ready, watches the real glider, and hops on tap before the Mailbag opens (0.42 s). |
| 2026-10-19 | Home felt packed on the owner's phone (the title covered the glider's orbit). The title is 60 px (54 px at ≤780 px tall, 42 px at ≤620 px); top buttons, lantern string and Pip are a little smaller. The planet is gameplay, so it stays as it is. |
| 2026-10-24 | Direction 3 picks: (1) input approved; (2) feel approved, keep the stretch subtle and short; (3) guided tutorial approved; (4) Ascension option B, orbit only, no plane; (5) Special Delivery kept in the GDD for the next version; plus fix button text overflowing at 320. Results layout accepted. All built the same day except (5). |
| 2026-10-24 | Owner review: results need NEXT LEVEL and no Hangar; Ascension button needs better visuals; lanterns must be explained; tutorial is poor; plane and boost need better animation; tap should turn and hold should only speed up. Owner proposed challenge modes (e.g. controlling the gates). Research and proposal: `docs/DIRECTION-3.md`, awaiting picks. |
| 2026-10-19 | Postcard lines approved. Retention round 2 built behind the Night Post extras switch. A lantern now lights when a flight ends, not when the app is opened. `SAVE_VERSION` stays 5 and `trailStyles` stays 7 (the game's self-checks); the new save fields are additive, and Pressed petal lives in `bonusTrails`. |
| 2026-10-19 | Hangar **A · Sorting Room** approved and built. Lanterns: dim-and-relight with at most 1 Paper Moon (owner left it to me). Parcel: few stars (5 → 10 → 15★ cap) plus a stamp plus a Moon; no trail every 4th parcel. Album page reward: a new Pressed-petal trail (owner left the design to me). Postcard lines drafted for approval. |
| 2026-10-19 | Owner asked to start Step 3 (Hangar) and the next retention round together (parcel, Paper Moon, postcards, Stamp Album). Proposal written; awaiting picks. |
| 2026-10-19 | Trailer: owner chose concept **A · The Night Mail** (story-led, 30 s vertical, real gameplay, captions that move with the glider). |
| 2026-10-19 | Tonight's Letter = **daily seeded run**: one Ascension-style delivery a day with the date as the random seed, so everyone flies the same sky. Gate formation rules are unchanged. One scored try, then a shareable postcard. |
| 2026-10-19 | Home v1 feedback: too much and repeated text; keep the title big like before; Pip looks fine, add detail later. v2: no captions, the daily letter is held by Pip (tap Pip), lanterns read visually, Ascension pill shows only the trophy and best score. |
| 2026-10-18 | Direction 2 approved: story **The Night Post**; prototype Express fold (hold for speed, the owner's top pick), the small five and Paper comets; Home redesign to be mocked (Ascension one tap from Home). Launch target Google Play via Capacitor (APK for testing, AAB for the store). |
| 2026-10-18 | Animations approved (owner's top three): chapter unlock moment, results beats, PERFECT pop. Owner clarified the next day: "game language" means designing from theme, art style and genre as a game/UI/UX designer, with research first, not reusing existing assets (rule at the top of this GDD). |
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
| `post-art.js` | Night Post art as SVG strings (`OrbitPost`): postcard fronts, perforated stamps, postmarks, the parcel. Optional (absent in the test sandbox). |
| `pip.js` | Pip's SVG rig and idle/reaction state machine (`OrbitPip`). |
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

- Pip and the lanterns are DOM/SVG over the canvas. The Mailbag is in `coveredModes`, so the canvas isn't repainted behind it.

**Constraints learned:**
- `window.orbitMaxPixelRatio` (unset in the game) raises the 2× canvas DPR cap; the trailer renderer sets it to 3 for 1080×1920 frames.
- The trailer snaps `state.elapsed` to 1e-6 during staged takes: float drift in frame deltas otherwise lets a scheduled spawn slip a frame after earlier scenes and reshuffles the seeded gate plan.
- `tests/ascension-timing.cjs` asserts `ui.resultHome.textContent === 'Ember Chapter'`. The results back button therefore keeps its label as text and draws its icon in CSS.
- The test DOM stub accepts new elements created via `document.querySelector`.
- `state` and other top-level `const`s are not on `window`. In the harness use `contentWindow.eval(...)`.
- Reward-card test contract: one button per reward in `#rewardChoices`, `#rewardName` keeps "Trail: spark" style text (visually hidden), clicking a choice selects it, `#continueRewards` on the last reward hides `#rewardSeal`.
- Any element given a CSS `display` in `remake.css` that is toggled with `hidden` needs an explicit `[hidden]{display:none}` rule.
- The guided tutorial and tips only change `timeScale` inside `frame()`, never inside `update()`, and need a trusted touch (`liveTouch`, set from `event.isTrusted`), so the tests' direct `update()` calls and stubbed events never see slow motion or tips. The tests start the old practice through `startTutorial()` / `#replayTutorial`, so that path is kept.
- `tests/ascension-timing.cjs` needs pointerdown to advance the practice tutorial on press, so `liftTurn()` excludes `runType === "tutorial"`.
