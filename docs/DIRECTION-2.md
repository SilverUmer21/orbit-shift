# Orbit Shift — Direction 2: story, depth, retention, Home

Proposal, 2026-10-18. It combines three research tracks: competitor reviews, depth in one-tap games, and cozy storytelling. It also builds on `docs/RETENTION-STRATEGY.md`.

**Owner decisions so far:**
- Keep the one-tap reverse as the core, and add depth on top.
- The story tone is **cozy & wondrous**.
- The launch target is **Google Play** (Capacitor, AAB).

Every new mechanic below is a proposal. Each one goes through plan → mockup/prototype → owner approval before it ships.

---

## 1. What competitors' players taught us

Sources covered reviews and press for Helix Jump, Stack, Crossy Road, Rolly Vortex, Twisty Road, Geometry Dash Lite, Alto's Odyssey, Duet, Super Hexagon, Tiny Wings, Orbia and Paperly. The direct "orbit" competitors are too small to have useful reviews.

**What players hate,** ranked by how many games show it:

| # | Complaint | What it means for us |
|---|---|---|
| 1 | Ads everywhere: after every death, mid-level, ads that crash the game or play sound on silent | We have **no ads**. Say it loudly in the store and in the game. |
| 2 | **"Repetitive / boring after a while"** (also the #1–2 reason players quit, per industry surveys) | Each island needs a **new idea**, and the game needs a long arc (story, album). |
| 3 | Missed taps, lag, hitboxes that feel wrong | Act on touch-down (we already do), add hidden forgiveness, hold 60 fps on cheap phones. |
| 4 | Difficulty walls ("level 3 is impossible") | Ramp gently. Add **practice from the guardian**, plus a soft hint after repeated fails. |
| 5 | Lost progress after updates or a new phone | **Cloud save (Play Games) from day one.** Never reset cosmetics. |
| 6 | Grind walls and too little content | Price unlocks so one arrives every few sessions. Ship content in waves. |
| 7 | Updates that changed the feel people loved | Lock the core feel before launch. |

**What players praise:**
- art and music, and a calm atmosphere
- easy to start and deep to master
- relaxing, no-fail modes (Alto's Zen)
- deaths that feel fair, with instant restart
- unlocks that are fair and cosmetic-only
- "one more try"
- secrets

**What players ask for that competitors don't have:**
- more levels and planes in regular drops
- a calm no-fail mode
- practice or checkpoints
- protection from accidental taps after a death
- reliable cloud save
- clear danger cues in flat art
- rising audio on streaks

---

## 2. Story: three cozy concepts

| Concept | Hook | Hero / companion | Fit |
|---|---|---|---|
| **A. The Night Post** *(recommended)* | *"Every star is a letter that never arrived. Fly them home."* | **Pip**, a tiny paper-moth courier, flying the glider. That works because a folded paper glider *is* a letter, so the ship art stays as it is. **Old Moon**, the sky's sleepy postmaster in a nightcap. | Keeps the night palette. Gold becomes postmarks and wax seals. Every retention feature has a natural story form. |
| B. Wick and the Sleeping Sun | The Sun, a huge origami crane, fell asleep under her wing | Wick, a lantern moth carrying a pinch of sunlight | Lovely, but the dawn ending fights the night palette. |
| C. Grandma Nori's Fold Book | A slipped fold scattered the pages of the sky book as islands | Kit, a grandchild in a paper hat | Strongest store-icon face, but needs a human character drawn and a bigger art job. |

### Why A, The Night Post

**The conflict is cozy.** Moon dozed off with the curtain drawn, the night mail stopped, and the islands curled up waiting for their letters. No villain, just a world that misses its messages.

**The game's pieces map onto the story:**

| In the game | In the story |
|---|---|
| Gates | Letter slots |
| Perfect pass | Gold postmark |
| 3 fragments | A stamp |
| Fever | Express Post |
| Guardians | Gatekeepers who hoarded the mail for years and are calmed, not killed |
| Clearing an island | **Delivering its letter.** The island unfolds, windows light up, and a gold thread joins two stars on the map |

**Each beat takes no more than 5 seconds and is mostly wordless:**
- a wax seal stamps "Delivered" on the results screen (1 s)
- a postcard arrives from the islanders as the reward card (2–3 s)
- one line of chapter text
- islanders appear on the map as you restore them

**Chapter outline:**

| Chapter | Beat |
|---|---|
| **Bloom** | Pip finds a glowing letter in Moon's dropped mailbag. Petal-folk mailbox flags pop up. Letters are caught in vines. The shy **Budkeeper** guardian has hoarded the mail, so your perfects are gentle knocks. It blooms and hands over Ember's letter. |
| **Ember** | Dark windows and a cold wax furnace. Match-folk pass cinders along. A thank-you postcard arrives from Bloom. The **Solar Forge** has resealed one letter for years. Calmed, it reveals the letter is addressed *"To Moon."* |
| **Void** | Moon's dark paper curtain. Lost letters drift by. A near-silent level. **Moonrise:** every island's "goodnight" is delivered, Moon wakes and smiles, and the nightly mail begins. That opening of the daily mail is the bridge to the live game. |

**Store page.** A gold wax seal on the paper glider, with Pip waving under a crescent moon. Character-led icons tested about 9% better than abstract ones in one published icon test.

---

## 3. Gameplay depth (the tap stays instant reverse)

Each world introduces **one** new idea, following Nintendo's teach → develop → twist → combine. Levels use a sawtooth: tension, a breather, then a peak. That answers complaint #2 without cluttering the one-tap feel.

| Idea | How it plays | Skill it adds | Where | Size | Why |
|---|---|---|---|---|---|
| **Brush sparks** (graze) | Passing close to a gate's edge without a perfect throws ink sparks: + score and + fever charge | Optional precision; players pick their own risk | All | S | Lets players set their own difficulty (shmup graze, flOw) |
| **Lost letters** (risky fragments) | Optional letters sit in dangerous spots and are worth double. They fill the **Stamp Album** | Risk/reward routes | All | S | Gives runs a goal beyond survival and feeds the album |
| **Hidden forgiveness** | A tap about 60 ms late still counts (coyote time), and a tap just before a gate isn't swallowed by the debounce | None visible; fairness | All | S | Directly answers complaint #3 |
| **Practice from the gatekeeper** | After failing a guardian level, retry from the guardian with no stars | Drilling the hard part | Guardian levels | S | Answers complaint #4 (Geometry Dash practice mode) |
| **Express fold** (hold) | Tap still reverses on press. *Keeping* the finger down tucks the glider: ~15% faster, but a narrower perfect window | Speed management, the second verb | Introduced in **Ember** | M | The Tiny Wings model, and the input code already allows it |
| **Paper comets** | A comet sweeps across the orbit, with a dotted warning line ~1 s ahead. Dodge it by reversing, or graze its tail | Reading two threats | Introduced in **Void** | S–M | Telegraphed, learnable, and works in endless |
| **Folding gates** | The gate gap opens and closes like origami | Arrival timing | Late **Bloom** | M | A twist on the gate you already know |
| **Stargazing** (calm endless) | Endless with no fail: a crash just ripples and you carry on, no score | Relaxing | Home mode | S–M | Alto's Zen is a top 5-star theme |
| **Rising postmark chime** | Each consecutive perfect plays a higher note | Feedback | All | S | Stack's most-loved feel detail |
| **Tap lockout + pause** | A ~400 ms lockout after a death, and "Tap to continue" after the app was interrupted | Fairness | All | S | Accidental-tap and interruption complaints |

**Prototype first:** Brush sparks, Lost letters, Hidden forgiveness, Practice from the gatekeeper and the Tap lockout + pause. All five are small, they make the game deeper and fairer, and none of them breaks simplicity. Next come **Express fold** and **Paper comets** as the Ember and Void identities.

---

## 4. Retention, told through the story

These are the waves from `RETENTION-STRATEGY.md` in Night Post form:

| Retention lever | Night Post form |
|---|---|
| Daily seeded run + share card | **Tonight's Letter**: one shared delivery per day. The share card is a postcard with your postmarks, e.g. `Orbit Shift · Night 42 ✉✦✦✧ 1 248`. |
| Streak with a freeze | **Mailbox flags / lanterns** along Pip's route on Home. Day 7 brings a parcel. A missed day dims the flags, and a weekly **Paper Moon** freeze covers it. |
| Three daily goals | **Tonight's rounds**: three deliveries a day. The first one, "Open the post office", is done on launch. |
| Collection album | **The Stamp Album**: level stamps, gold postmarks from perfect-heavy runs, lost letters and island sets. A finished set gives a permanent trail or paint. No expiry, no paid packs. |
| Stars sink + investment | **Decorate Pip's moon post office / Home sky** with lanterns, a mailbox, comets and frames. |
| Lore drip | **Letters from islanders**: one line each, arriving with rewards. This is Neko Atsume's gift lesson: gifts reveal character. |
| Install / notification | "Tonight's letter is ready", at most once a day, opt-in after a 2-day streak. On Android this is a local notification with no server. |

---

## 5. Home review and redesign direction

**Problems with Home today:**
1. **Ascension can't be reached from Home,** yet Home shows "BEST 640", which is an Ascension score. The best score dangles with no way to chase it, so the "one more try" engine is three taps away.
2. **The hero is static.** It's always the Bloom planet, with no progress, story or daily state, even when you're in Ember.
3. **The big logo takes about 30% of the screen** on every visit.
4. **Nothing to come back for** is visible: no daily, streak or letters.

**Proposed Home, for mockups after approval:**

| Area | What goes there |
|---|---|
| **Top** | Settings, a **mailbox** (letters and postcards, with a badge) and the star chip |
| **Sky band** | The streak flags/lanterns strung across the sky. The logo is big on first launch and shrinks to a small wordmark for returning players. |
| **Hero** | The **current island** (Bloom or Ember, matching progress) with Pip's glider orbiting. Restored islanders appear around it. |
| **Primary** | **PLAY**, showing the next delivery ("Level 3 · Tangled Orbit"), as now |
| **Secondary row** | Hangar · **Tonight's Letter** card (when available) · Islands |
| **Ascension** | A slim pill under PLAY: **"∞ Ascension · Best 640"**, one tap. Stargazing (calm) sits behind it as a toggle. |

---

## 6. Google Play implications

- **Play Games Services cloud save** at launch (complaint #5).
- **Offline by default,** which is already true.
- **No ad SDK,** which keeps the Data safety form simple.
- **Performance:** 60 fps on low-end phones. The recent optimizations help.
- **Testing:** the personal developer account needs **12 opted-in testers for 14 days** before production. Start recruiting early.
- **Store listing:** lead with *"No ads. No interruptions."*, cozy paper art and Pip. Screenshots must show **real gameplay**, since misleading ads are a known trust killer.

---

## 7. Decisions for the owner

1. **Story concept:** A (The Night Post), B or C?
2. **First gameplay prototypes:** which of the small five, and do we include Express fold or Paper comets now?
3. **Home:** OK with the direction in §5, Ascension as a pill under PLAY? Mockups would follow.

Then the order is story bible → Home mockups → gameplay prototypes (behind flags, tested) → Hangar, inside the story → Wave 1 retention.

## Sources

The full source lists are in the three research hand-offs summarized here. Key sources:

**Competitor reviews:**
- [Helix Jump (Common Sense Media)](https://www.commonsensemedia.org/app-reviews/helix-jump)
- [Stack App Store reviews](https://apps.apple.com/us/app/stack/id1080487957?see-all=reviews&platform=ipad)
- [Crossy Road (TouchArcade)](https://toucharcade.com/2014/11/21/crossy-road-review/)
- [Rolly Vortex (Play)](https://play.google.com/store/apps/details?id=com.bdj.vortexDroid&hl=en_IN)
- [Twisty Road review](https://www.gravenoisemedia.com/game-review-twisty-road-mobile-free-play/)
- [Geometry Dash Lite (TechRadar)](https://www.techradar.com/computing/websites-apps/geometry-dash-lite)
- [Paperly (Play)](https://play.google.com/store/apps/details?id=com.atgstudios.paperly&hl=en_US)
- [Alto's Odyssey (CGMagazine)](https://www.cgmagonline.com/review/game/altos-odyssey-review/)
- [Duet (148apps)](https://148apps.com/reviews/duet-review)
- [Super Hexagon (Trusted Reviews)](https://www.trustedreviews.com/reviews/super-hexagon)
- [Tiny Wings (AppSpy)](https://www.appspy.com/tiny-wings-review)
- [Orbia (mobi.gg)](https://mobi.gg/en/orbia/test/)
- [Hyper-casual report (Udonis)](https://www.blog.udonis.co/mobile-marketing/mobile-games/hyper-casual-games-report)
- [Misleading-ads research (Nexters)](https://gameindustrylibrary.com/documents/misleading-non-core-gameplay-ads-research-2023)

**Gameplay depth:**
- [Terry Cavanagh on Super Hexagon (Game Developer)](https://www.gamedeveloper.com/design/terry-cavanagh-and-the-heart-of-i-super-hexagon-i-)
- [Tiny Wings (Macworld)](https://www.macworld.com/article/212903/tiny_wings.html)
- [Shmup design and graze (Critpoints)](https://critpoints.net/2016/05/20/shmup-design/)
- [Near-miss research (UBC)](https://cgr.psych.ubc.ca/?p=510)
- [Geometry Dash practice mode (wiki)](https://geometrydash.wiki.gg/wiki/Practice_Mode)
- [Celeste Assist Mode (Vice)](https://www.vice.com/en/article/d3w887/celeste-difficulty-assist-mode)
- [Nintendo's four-step level design (MCV)](https://www.mcvuk.com/development/video-nintendos-level-design-secrets-in-four-steps)
- [Jenova Chen notes (GameDev.net)](https://gamedev.net/tutorials/industry/interviews/notes-on-gamedev-jenova-chen-r3061)
- [Juice it or lose it (summary)](https://roblog.co.uk/2024/03/juicy-games/)

**Story:**
- [Florence (AV Club)](https://avclub.com/florence-tells-a-familiar-story-in-a-wordless-new-form-1823616786)
- [Monument Valley 2 interview (indienova)](https://indienova.com/en/indie-game-news/monument-valley-2-interview-eu/)
- [Gris (Gamereactor)](https://www.gamereactor.eu/what-does-gris-mean-we-talk-to-nomada-studio/)
- [Monument Valley 3 (ustwo)](https://ustwogames.co.uk/news/monument-valley-3-out-now-pc-and-console/)
- [Sky (thatgamecompany)](https://thatgamecompany.com/sky-children-of-the-light-out-on-google-play-now/)
- [Tiny Wings (Wikipedia)](https://en.wikipedia.org/wiki/Tiny_Wings)
- [Narrative design in Alto's Adventure (80.lv)](https://80.lv/articles/analyzing-the-beauty-of-narrative-design-in-alto-s-adventure/)
- [Tearaway Unfolded (Wikipedia)](https://en.wikipedia.org/wiki/Tearaway_Unfolded)
- [Crafting Lumino City (MCV)](https://mcvuk.com/development-news/crafting-the-lumino-city)
- [Neko Atsume (Wikipedia)](https://en.wikipedia.org/wiki/Neko_Atsume)
- [MyTona icon tests (SplitMetrics)](https://splitmetrics.com/cases/mytona-app-icons-halloween-update)

*Evidence quality: competitor review themes come from search summaries of store pages and reviews, because the sandbox could not open Google Play pages directly. Psychology and design-practice claims rest on established sources. Several items are marked weak in the hand-offs.*
