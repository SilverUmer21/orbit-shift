# Orbit Shift — Retention & ASO Strategy

Research and proposal, 2026-10-18. Nothing here is built yet; every item needs the owner's approval (plan → mockup → approval → build). Nothing below changes how gates/rings form, movement, collisions or scoring.

---

## 1. Diagnosis: why would a player come back tomorrow?

**What already works (keep):**
- **Instant play.** One tap reverses the orbit, PLAY starts the next level, and levels last 45–80 s.
- **Juice.** The staged results, PERFECT pop, star tally and chapter unlock moment.
- **A fair cosmetic meta.** Stars buy planes, paints and trails, and none of them change difficulty. This is the same promise Crossy Road made.
- **No ads, plus handcrafted paper art.** This is a rare combination in the genre and a real featuring/ASO asset.

**What is missing:**

| Gap | Evidence in the game | Why it hurts retention |
|---|---|---|
| **Short content runway** | 8 levels (Bloom 4, Ember 4, Void "coming soon"), about 15–20 min to clear | Once the map is done, only Ascension (endless) is left. Most hyper-casual players churn when "the next thing" disappears. |
| **No reason to return *tomorrow*** | Goals refresh only when completed, not daily. `stats.dates` already tracks play days but nothing shows them. | Without a daily trigger there is no habit. D1 to D7 is where hyper-casual loses most players. |
| **Stars stop mattering** | The last plane costs 550 stars, and after that stars buy nothing | The currency loses meaning, so runs stop feeling rewarding. |
| **No outside trigger** | Web only: no install, no notifications, no share | Players only return if they *remember* the game. |
| **No social proof or sharing** | — | Zero free distribution, and no friendly comparison. |

**Benchmarks to beat** (vendor data, directional only):

| Genre | D1 | D7 | D30 |
|---|---|---|---|
| Hyper-casual | ~25–35% | ~5–12% | ~1–4% |
| Hybrid-casual (games with a meta layer) | — | ~15–20% | ~8–12% |

The difference between the two rows is almost entirely the **meta layer and daily reasons to return**.
**Our target:** D1 ≥ 35%, D7 ≥ 12%, which means behaving like a hybrid-casual game without becoming a grindy one.

---

## 2. The "why": what actually makes players return

Each mechanic below works because it pulls a specific psychological lever. Picking the lever first stops us copying features blindly.

| Lever | What it is | Who uses it well | Watch-out |
|---|---|---|---|
| **Ritual + scarcity** | One shared thing per day makes play an appointment | Wordle (one puzzle per day, the same for everyone), Spelunky Daily (same seed, one attempt) | It must be quick. One run, not a chore. |
| **Loss aversion** | Losing a streak hurts about twice as much as gaining an equal reward feels good | Duolingo streaks | Punishing resets cause resentment. Use freezes and partial recovery. |
| **Goal gradient / endowed progress** | People speed up near a finish line; a head start raises completion | Loyalty cards (Nunes & Drèze), progress bars | Bars must show a concrete endpoint. |
| **Completion urge (sets)** | An unfinished set nags at the player | Monopoly Go albums, which reportedly drive about $200M/month; ~72% of top-grossing US games once used collections (GameRefinery, older figure) | Albums tied to paid packs feel predatory. We have no monetization, so ours can be generous. |
| **Small achievable tasks inside an endless world** | Three goals give each run a purpose and feed a level-up | Alto's Odyssey | Goals that depend on luck feel unfair. Ours should depend on skill. |
| **Fair collection** | Unlocks look different but never make the game easier, so mastery stays pure | Crossy Road | — |
| **Self-competition / mastery** | Beat your best, see your old self | Best-run ghosts, leaderboards (Orbit Snap, Orbit: 1-Tap Space Arcade) | — |
| **Investment** | The more you have built, the more you return to it (the Hook model's "investment" step) | Home and base builders | — |

---

## 3. Proposal: the Orbit Shift return loop

The world gives us the hook: **the night sky is broken, and every visit lights it a little more.** Every retention feature should *add something visible to the sky*. That makes the daily return feel like part of the story, not like a chore.

### Wave 1: reasons to return tomorrow (highest impact, low risk)

**A. Tonight's Sky: a daily orbit** (ritual + shared seed + sharing)
- **What.** One special Ascension run per day. It uses the existing endless generator with a **date-based seed**, so everyone flies the same sky that day. The gate rules and formation are unchanged; only the random numbers repeat.
- **One scored attempt per day.** Practice runs after that don't count.
- **Share card.** At the end, a spoiler-free card like Wordle's: `Orbit Shift · Sky #42 ✦✦✧ ◐◐◐◑ 1 248`. It encodes stars, perfects and score with paper-cut glyphs, with no screenshot needed.
- **Why.** Wordle and Spelunky Daily show that one shared thing per day becomes a ritual and a conversation, and the share card is free distribution.
- **Owner approval needed.** It seeds the run generator. Nothing about how rings form changes.

**B. Night Lanterns: the streak** (loss aversion, kindly)
- **What.** Each day you play hangs a folded paper lantern on a string across the Home sky. The data comes from `stats.dates`, which is already saved.
- **Day 7.** A "Paper Comet" streaks past and drops a gift: stars plus a chance at a trail.
- **Missing a day.** The lanterns dim instead of disappearing (partial recovery), and one **Paper Moon** freeze per week is used automatically.
- **Why.** Duolingo-style loss aversion, with the safety nets the research recommends so it never feels like punishment.
- **Theme fit.** The lanterns light the "broken sky", so the streak *is* the story.

**C. Tonight's charts: three daily goals** (Alto-style purpose plus endowed progress)
- **What.** The three goals (survive, skill, journey) refresh every day instead of only when completed. Clearing all three seals the day's chart for a bonus.
- **Head start.** The first goal is always "Open tonight's sky", which completes on launch, so the player starts at 1/4.
- **Why.** Small, skill-based tasks inside the endless mode give each run a purpose. The pre-filled step raises completion.
- **Home.** Still shows just one goal, the closest, as you decided.

### Wave 2: things to collect, a long arc

**D. The Constellation Atlas** (set completion, generous)
- **What.** A sky atlas of constellations: Bloom, Ember, Void and seasonal skies.
- **How stars get added.** Level 3-star clears, Daily Sky results and lantern gifts add stars to them. **Gold stars** come from perfect-heavy runs, giving a skill-based rarity tier.
- **Completing a constellation** gives a permanent trail or paint, and the constellation appears in the Home sky.
- **No expiry, no paid packs.** We take the completion urge from albums without the predatory parts.
- **Why it matters.** It is a long-term goal that outlasts the 8 levels. Every run, including endless and daily, now feeds something.

**E. Stars keep meaning something** (economy sink plus investment)
- After the planes, stars buy **sky decorations for your Home planet**: lanterns, paper moons, comets and constellation frames.
- Your Home screen becomes your personal night sky, the investment step of the Hook model.
- It shows Paper Night's art and gives players something to screenshot.

**F. Best-run ghost** (mastery; already in the README's V3 plan)
- **What.** A faint paper ghost of your best Ascension or daily run flies with you.
- **Why.** Self-competition with no server needed.
- **Owner approval needed.** It adds something to the play screen, although gameplay is unchanged.

### Wave 3: bring them back from outside

**G. Install + offline** (web)
- **What.** A web manifest with the Paper Night app icon, offline play, and instant relaunch.
- **When to ask.** The install prompt appears **after the first chapter clear**, a high moment, never on first launch.
- **Why.** Players install after a great moment, and a home-screen icon is the habit trigger the web otherwise lacks.

**H. One gentle notification**
- **What.** "Tonight's sky is ready" and "Your lantern is fading", at most once a day, opt-in only after a 2-day streak.
- **Limits.** On the web this only works for installed apps (iOS 16.4+ needs a Home Screen install). In the Android app (Capacitor) these become simple local notifications with no server.

**I. Seasonal skies**
- **What.** A monthly sky with its own palette, a limited trail and a seasonal constellation.
- **Why.** Poki notes that weekly and seasonal unlocks lift engagement, and Supersonic's Screw Master reached ~10% D30 with seasonal LiveOps plus a daily calendar.

### What we deliberately won't do

No ads, no energy or lives, no paid loot boxes, and no streak shaming. Our edge is being **the calm, fair, beautiful one**, and retention should never break that promise.

---

## 4. ASO plan (Google Play launch via Capacitor, plus web portals)

**Positioning.** The other "orbit" one-tap games all use neon and space looks:

| Game | Hook |
|---|---|
| *Orbit Snap* | Skins and a leaderboard |
| *Orbit: 1-Tap Space Arcade* | Zen and Competitive modes, plus a daily spin |
| *Orbit* (Dylight) | No ads |

Orbit Shift is the **handcrafted paper universe** among them. We lead with that, and with "no ads".

**Listing:**

| Field | Draft | Rule |
|---|---|---|
| Title (30) | **Orbit Shift: One-Tap Space** (26) | The heaviest-weighted keyword field |
| Short description (80) | *Tap to reverse your paper glider. Thread the gates. Wake the planets. No ads.* | Indexed; holds the value proposition |
| Keywords to work in | orbit, one tap, space, planet, arcade, relaxing, offline, no ads | The full description is indexed (4,000 characters) |

**Icon.**
- Character-led: the glider orbiting a planet, high contrast, no text. Character-led icons consistently beat abstract logos.
- A/B test two variants with Store Listing Experiments, one change at a time, for 2–4 weeks:
  - glider plus Bloom planet
  - glider threading a gold gate

**Screenshots** (portrait, one idea each, big captions; the first frame shows the core action):
1. "One tap. Reverse your orbit."
2. "Thread PERFECT gates" (the PERFECT pop)
3. "Wake the Cosmic Islands" (map)
4. "Collect planes, paints and trails" (Hangar)
5. "Tonight's Sky: one daily orbit" (share card)
6. "No ads. Plays offline."

**Promo video.** 15–30 s, with tap-reverse and PERFECT in the first 3 seconds.

**Ratings.**
- Use Google's In-App Review API **right after a first-time 3-star clear or a new record**.
- Never mid-run or on launch, and never with a "Do you like us?" pre-question (Google's rule).

**Custom store listings.** Tailor framing by search: "relaxing games" gets the calm, zen paper framing, and "space games" gets the planets framing.

**Featuring.** Distinct paper art, no ads and reduced-motion support are exactly what editors look for. Prepare a short pitch and assets.

**Web portals** (Poki, CrazyGames).
- Their review gate is about the first 3 minutes and load time; our lazy loading already helps.
- Poki tracks D1/D3/D7, so the daily sky and lanterns directly move their metrics.

**Measurement (needed to know any of this works).**
- Today we only have the local playtest report.
- Add privacy-friendly analytics: cohort D1/D7, daily sky participation, streak length, share taps. A small endpoint or the portals' SDK dashboards would do.

---

## 5. Recommended order

1. **Wave 1, A + B + C, and G (install).** The biggest jump in "reasons to return" for the least risk, and mostly menu and meta work.
2. **D + E.** Gives the long arc and a meaning for stars. Design these together with the **Hangar remake**, since the Hangar is where stars are spent.
3. **F, H, I**, and ASO assets when the Android build is close.

**Decisions for the owner:**
1. Daily Sky: OK to seed the endless run by date? The gate rules don't change.
2. Streak: Night Lanterns with a weekly Paper Moon freeze and dimming instead of resetting?
3. Daily refresh for the three goals?
4. Install prompt after the first chapter clear?
5. Analytics: OK to add a privacy-friendly one?

---

## Sources

- Benchmarks:
  - [Segwise: Mobile game retention benchmarks 2026](https://segwise.ai/blog/mobile-gaming-app-user-retention-strategies)
  - [GameBizConsulting: UA trends and benchmarks 2026](https://www.gamebizconsulting.com/blog/mobile-game-user-acquisition-stats-trends-2026)
  - [Gamigion: 2025 hybrid-casual market overview (Screw Master / Supersonic)](https://www.gamigion.com/2025-hybridcasual-market-overview-with-real-data/)
  - [Tap Nation: depth in hybrid-casual](https://www.tap-nation.io/blog/how-to-build-depth-and-keep-players-engaged-in-hybrid-casual-games/)
  - [ThinkingData: hypercasual to hybridcasual](https://thinkingdata.io/blog/breaking-down-the-evolution-of-hypercasual-mobile-games-to-hybridcasual/)
- Streaks:
  - [Psychology behind Duolingo's streak](https://japm.substack.com/p/the-psychology-behind-duolingos-most)
  - [Streaks, milestones and habit gamification](https://appstorys.com/blog-Streaks-Milestones-Habit-Gamification)
- Collections:
  - [Tech Insider: Monopoly Go sticker economy](https://tech-insider.org/monopoly-go-sticker-economy-mobile-monetization/)
  - [GameRefinery: collection systems](https://gamedevreports.substack.com/p/gamerefinery-collection-system-in)
- Case studies:
  - [Crossy Road (Wikipedia)](https://en.wikipedia.org/wiki/Crossy_Road)
  - [Hipster Whale interview (SmartCompany)](https://www.smartcompany.com.au/startupsmart/victorian-game-studio-hipster-whale-scores-hit-with-retro-game-inspired-crossy-road/)
  - [Alto's Odyssey: how a winning mobile game is made (Dice)](https://www.dice.com/career-advice/altos-odyssey-winning-mobile-game)
  - [Alto's Odyssey review (MobileSyrup)](https://mobilesyrup.com/2018/02/22/altos-odyssey-review/)
  - [Spelunky Daily Challenge (wiki)](https://spelunky.fandom.com/wiki/Daily_Challenge_Mode_(HD))
  - [Spelunky PC daily challenges (Shacknews)](https://www.shacknews.com/article/80294/spelunky-pc-introduces-daily-challenges)
  - [Wordle daily ritual analysis](https://desirabilitylab.com/backfill/backfill-2025-127-wordle-daily-puzzle)
- Psychology:
  - [Endowed progress effect and game quests](https://www.psychologyofgames.com/2010/11/16/endowed-progress-effect-and-game-quests/)
  - [Goal-gradient effect and progress bars](https://medium.com/design-bootcamp/goal-gradient-effect-and-the-psychology-of-progress-bars-df6fd889fd8e)
- Competitors:
  - [Orbit Snap](https://play.google.com/store/apps/details?id=com.orbitsnap.game&hl=en_US)
  - [Orbit: 1-Tap Space Arcade](https://play.google.com/store/apps/details?id=com.orbit.drstudios&hl=en_US)
  - [Orbit (Dylight)](https://play.google.com/store/apps/details?id=com.dylightit.orbit&hl=en_IE)
- ASO:
  - [Phiture: ASO for mobile games](https://phiture.com/asostack/mobile-games-guide-tactics/)
  - [AppTweak: creatives best practices](https://www.apptweak.com/en/aso-blog/best-aso-practices-for-your-app-game-creatives)
  - [AppFollow: screenshots 2026](https://appfollow.io/blog/aso-screenshots-best-practices)
  - [Gummicube: how Google Play ASO works](https://gummicube.com/how-aso-works-google)
  - [ASOMobile: short description](https://asomobile.net/en/blog/short-description-and-its-impact-on-convertion)
  - [Google: In-App Review API](https://developer.android.com/guide/playcore/in-app-review)
- Web:
  - [Poki: monetization and engagement tips](https://developers.poki.com/guide/monetization)
  - [Poki: playtesting](https://sdk.poki.com/playtesting)
  - [Google: how Poki tests games](https://blog.google/products/admob/app-monetization-insights-how-poki/)
  - [PWA vs native retention, 6 months of data (Indie Hackers)](https://www.indiehackers.com/post/pwa-vs-native-app-for-a-party-game-what-6-months-of-data-say-about-retention-da126462bb)
  - [OneSignal: web push for iOS](https://documentation.onesignal.com/docs/web-push-for-ios)

*Source quality: most benchmark and ASO numbers come from vendor blogs and are directional. The psychology effects (prospect theory, goal gradient, endowed progress) rest on established research. The Google Play rules come from Google's own docs.*
