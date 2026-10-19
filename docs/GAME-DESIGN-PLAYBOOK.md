# Game Design & UI Playbook

A reusable way of working for any game, distilled from the Orbit Shift remake. Copy this file into a new project (for example `docs/PLAYBOOK.md`), fill in the **Identity card** below, and point your `CLAUDE.md` / project instructions at it.

---

## 0. The one rule (read first, every session)

**Work as a game designer and a UI/UX game designer, not as someone decorating screens.**

1. **Start from the game's identity.** Before designing anything, look at its **theme**, its **art style** and its **genre**. Every screen, animation and VFX must feel like it belongs to that world and meets that genre's expectations.
2. **"Game language" ≠ reusing existing assets.** Existing art is a building block, not the rule. Invent new shapes, motion and effects whenever they express the world better. For every piece, ask:
   - What does this say about the world?
   - What should the player feel?
   - Does it meet the genre's expectations (instant readability, speed, juice, an obvious next step)?
3. **Research before making.** For every feature, first study how strong games in the genre (and in similar art styles) solve it. Write down the findings and references, then design from them.
4. **Learn from competitors' bad reviews.** One-star reviews are a free list of what players hate (forced ads, unfair deaths, lost progress, grind, confusing menus). Design so those complaints can't be written about your game.

## 1. Identity card (fill in per game)

| | |
|---|---|
| **One line** | *e.g. a one-tap portrait orbit game: tap to reverse and thread closing gates to wake sleeping planets.* |
| **Theme / world** | *e.g. a folded-paper cosmos, the night post.* |
| **Art style** | *e.g. cut paper, folds, two-tone hard-split shading, night palette, gold = reward.* |
| **Genre** | *e.g. one-tap hyper-casual arcade with a light meta layer.* |
| **Story tone** | *e.g. cozy & wondrous; told through scenery and one-liners, never walls of text.* |
| **Mascot / guide** | *e.g. Pip, a paper-moth courier who reacts, idles, dozes and presents the daily letter.* |
| **Core verb** | *the one thing the player does; never break it.* |
| **Platform / sizes** | *e.g. Android via Capacitor; test at 390×844, the owner's phone, and 320×568.* |
| **Monetisation stance** | *e.g. no ads.* |

**Map the story onto the mechanics** so the UI can speak in-world. Orbit Shift example: gates = letter slots, perfect = gold postmark, fever = Express Post, daily run = Tonight's Letter, streak = lanterns, rewards = parcels.

## 2. Working agreement (the loop)

**Plan → research → mockup → owner approval → build → test at target sizes → screenshot → commit and push.** One step at a time.

- **Ask** when a choice is the owner's (taste, scope, gameplay). Offer 2–3 options with a recommendation, never a blind pick.
- **Mock before building.** Use quick HTML mockups or interactive previews. Show several directions, side by side, at real phone size.
- **Gameplay changes only as approved additions.** Never alter the core verb, collisions, timing, scoring or level formation without approval. New mechanics ship **behind a flag** until the owner has played them.
- **Protected art:** characters, ships and planets don't change without approval.
- **Never edit tests to make a change pass.** Keep the DOM ids and APIs the code relies on.
- **A living GDD.** Keep one design doc as the single source of truth: what's built, the current step, the bug log and the decisions log (date + what the owner chose). Update it whenever something is built, decided or found. Read it at the start of every session.
- **Take feedback literally and fast.** "Too much text", "title too big", "button too high": fix the specific thing, re-screenshot at the owner's phone size, and confirm.

## 3. Genre pillars (hyper-casual / hybrid-casual)

| Pillar | Rule of thumb |
|---|---|
| Instant play | One control; playing within seconds. The big PLAY starts the next thing directly. |
| Short sessions | ~40–80 s runs. |
| Light meta | Stars/coins → ships, paints, trails. Always show the *next* unlock (badge on Home, progress bar on results). |
| Reward every run | A loud, staged ending: stars, a near-miss line, one reward at a time. |
| Staged juice | Feedback in beats ~60–150 ms apart (spark → value → count-up → pulse). Never everything at once. |
| Obvious next step | Maps are a path with the next level highlighted and one big PLAY. |
| Game language everywhere | Menus feel like the same world as a run. |
| Fairness | Add hidden forgiveness: input buffering, a grace frame on near-crashes, practice from the hard part, pause on interruption. Players should feel they lost by their own mistake, never the game's. |

Sources: Homa Games "15 Golden Rules", Voodoo design guide (GameAnalytics), Tap Nation hybrid-casual features, GameAnalytics on meta mechanics, Game Developer (map formats, game juice), CrazyLabs level design, progress-bar reward studies.

## 4. UI / UX rules we learned

**Home screen**
- Minimal text. **Never show the same text twice.** Let icons, the mascot and objects read visually.
- Use a big title (sized for the owner's phone), then breathing room.
- Put the main action at the bottom in the thumb zone: a big PLAY with secondary actions beside it (e.g. Hangar | PLAY | Islands).
- Give the mascot and the hero object space; don't pack everything in.
- Secondary modes get a distinctive edge tab with their own icon, not another pill in the stack.
- Avoid redundancy. If the mascot already holds the letter, don't also add a mail icon beside it.

**Results / rewards**
- A short, celebratory title (an arc of text works well) with no duplicate level names.
- Show three stars with no captions, and give them life: pop, shine, count-up.
- Reveal rewards one at a time, then a clear next step (Again / Next / Hangar).
- Use the player's *actual* equipped ship and items everywhere they appear.
- Keep text inside its buttons at every size. Test the longest label at 320 wide.

**Maps / level select**
- Use stepping stones along a path, with generous spacing and aligned labels.
- The ship flies the trail to a newly unlocked level as a moment.

**Mascot**
- Should never be static: give it an idle cycle (look, wave, peek, yawn), react on tap, react on entering, doze after inactivity, and present things.
- Draw it as an SVG rig with named parts so it can animate cheaply.

**Motion & VFX**
- Every animation should *say something about the world* (Orbit Shift: paper folds, postmarks stamping, page turns, lanterns glowing).
- Respect reduced-motion and effects settings.

**Performance (mobile web)**
- Don't repaint the game canvas under opaque screens.
- Cache static backgrounds, lazy-load heavy libraries (e.g. a WebGL map), preload fonts, and cap the device pixel ratio at 2.
- Measure with CPU throttling before claiming wins.

## 5. Retention through story (not through nagging)

- **A daily seeded run** ("Tonight's Letter"): the same level for everyone today, one scored try, and a shareable postcard.
- **A visual streak** (lanterns), with a forgiving freeze item.
- **Small daily goals** and collectibles that fill an album.
- **No dark patterns.** No forced ads, no punishing streak loss, no lost progress, and it plays offline.
- **ASO:** design the screenshots and trailer from the hook outward, and fix in the product what competitors' bad reviews complain about.

## 6. Trailer recipe (30 s vertical)

1. **Hook (0–2.5 s):** a tense real moment and a question ("Tap… or not?"). Cut to black before the payoff.
2. **Story (2.5 s):** the mascot and the world in one line.
3. **Teach the verb (4 s):** captions that *move with the gameplay* (drift with direction, squash on each tap).
4. **Second verb / twist (4 s):** e.g. hold to speed up, with the video itself speed-ramping.
5. **Build (3 × 2 s):** page-turn cuts on the beat, one word each.
6. **Payoff (5 s):** slow motion, freeze on success, a big in-world stamp, the world reacting.
7. **Meta (4 s):** map progress and the daily hook.
8. **End card (2 s):** mascot, logo, tagline, store badge, "No ads · Plays offline".

**Production:**
- Use real gameplay on a virtual clock (deterministic time and random numbers), and stage moments by adjusting level data so the game's own rules score them.
- Hide in-game labels under the captions.
- Synthesize the sound from an event log so every hit lands on its frame.
- Use the official store badge only once the listing is live.

## 7. Session checklist

- [ ] Read the GDD and this playbook.
- [ ] Restate the identity: theme, art style, genre.
- [ ] Research how 3–5 strong games solve this feature; note references and their bad reviews.
- [ ] Ask the owner the questions that are theirs to answer.
- [ ] Mock 2–3 directions at phone size; get approval.
- [ ] Build: protected areas untouched, new mechanics behind a flag.
- [ ] Test at all target sizes (including the owner's phone); run the test suite.
- [ ] Screenshot, update the GDD (built / decided / bugs), commit, push.
