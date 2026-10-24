# Orbit Shift: Direction 3 — feel, the first minute, flow, and challenge twists

Proposal, 2026-10-24. Nothing here is built yet; it is awaiting the owner's approval.

**Boards** (all in `design/paper-night/previews/`):

| Board | File |
|---|---|
| Results | `d3-results.png` |
| Ascension button | `d3-asc.png` |
| Lanterns | `d3-lan.png` |
| Tutorial | `d3-tut.png` |
| Plane and boost feel | `d3-feel.png` |
| Challenge twists | `d3-tw.png` |

**How they were made:**
- The mockups use the real game. The results mocks are the real results screen with the changes injected in the browser.
- The feel frames are drawn with the game's own `drawGlider` and trail art, and the twist frames come from real runs.
- Sources: `design/paper-night/mockups/direction-3.html` and `direction-3-board.html`.

## 1. What the owner flagged, and what the audit found

| Problem (owner) | What the game does today |
|---|---|
| No Next level after a win; Hangar shouldn't be there | After a win the big button is **AGAIN**. The row is Chapter · AGAIN · Hangar, and the same row appears on a fail. |
| Ascension button needs better visuals | A 62 px tab on the right edge with a tiny orbit icon and a number. There is no label, so it reads as a widget, not as a game mode. |
| Players won't understand the lanterns | Nothing explains them: no first-time moment, no tap target, no count. |
| Tutorial is bad | Four text pills ("Practice 1/4 · Tap to reverse direction", "Collect the orbit fragment", "Thread the marked perfect"). There is no demonstration, and the score/flow/best bar shows the whole time. It never teaches hold. It ends on the island map instead of in Level 1. |
| Plane and fast speed need better animation | The tuck is barely visible: a few thin streaks and a small squash. A boost looks almost like normal flight. |
| Tap should turn, hold should go faster | A press reverses at once (`pointerdown → tapInput()`), and holding then tucks (`pressHold()`). So every boost also turns the plane. |

## 2. Research: what strong games do

The research ran as three parallel searches. The full source lists are in the appendix. Where sources disagreed or couldn't be checked, that is noted.

### Tutorials and the first minute
- **The best one-tap games barely have a tutorial.**
  - Crossy Road uses an animated hand ("it doesn't feel like a tutorial").
  - Flappy Bird waits for your first tap before the run starts, so the first input can't kill you.
  - Mr Jump teaches tap first; the first obstacle that needs a hold comes later.
  - Tiny Wings shows a finger icon for press and release that fades away by itself.
- **Publishers:**
  - Kwalee's acid test: "can you fail the first level? If so, it may not be hyper-casual." Players should know what the game is within 3 s.
  - Coda: level 1 should be "close to impossible to fail", and anyone should grasp it in under 10 s.
  - Homa: levels of 40 s or less; reward every level.
  - Unity: end the first session on an accomplishment.
- **Text doesn't teach.** A text tutorial taught the rules to 2 of 10 testers; the rest tapped through it. Asking "play the tutorial?" makes about 70% opt out. PlaytestCloud says players should perform each new action twice.
- **Teach hold as its own step**, when it's needed, with a different signal from the tap. Alto's and Mr Jump treat hold as an extension of the tap.

### Explaining a streak
- Duolingo: "A lot of users do not understand how a streak works."
  - Adding about 8 words under the new-streak screen ("Start a day to extend your streak, but miss a day and it resets") gained more than 10,000 daily users. It was one of their top three retention wins.
  - Showing the **number**, not just a symbol, mattered.
  - Giving **two free streak freezes when a streak starts** was among their biggest wins.
  - "Earn back" (win the streak back by playing) beat paying to repair it.
  - Retention climbs steeply until day 7.
- Wordle shows the streak and a countdown on every result card.

### Tap versus hold
- **A press alone can't tell a tap from a hold**, so a game that uses both has to decide on release. Hypersect measured about 0.15 s of lost responsiveness in INVERSUS when a shot moved to release.
- **A tap's delay is how long the finger stays down, not the threshold.** The threshold only decides when a hold starts, and how often a slow tap is misread as a hold.
- **Reference thresholds:**
  - Android tap: 100 ms. Long press: 400 ms.
  - Unity tap: 200 ms. QMK tap-hold: 200 ms.
  - Celeste's hold window: 0.2 s.
- **Today's 0.14 s is too tight** once a misread costs the turn.
- **Hiding the delay:**
  - Respond to the press in the same frame: an anticipation pose, a sound, a haptic. Touch feels instant within roughly 5–50 ms (Kaaresoja 2014).
  - Make the wind-up lead into either outcome.
  - Keep forgiveness windows.
- **Proven games mostly let hold change the tap rather than replace it.** The owner's rule is valid, but it means deciding on release, so hiding the delay is required.

### Feel
- **Vlambeer's "Art of Screenshake"** and **"Juice it or lose it":** anticipation, squash and stretch along the motion, follow-through, particles, sound.
- **Speed reads through a wider view** (Hargreaves, MotoGP; an Aalborg study), not through motion blur. Mario Kart shows boost tiers with spark colours.
- **Audio:** Stack and Peggle climb a musical scale with each hit in a row.
- **Haptics:** crisp 10–20 ms ticks, never buzzing (Android, Apple).
- **Shake and freeze frames are for big moments only** (Sakurai on hit-stop).

### "One more try" and the results screen
- **Instant restart and short levels** (Super Meat Boy).
- **Near-miss feedback** raises the urge to replay only when the player had control (Clark 2009), so keep it honest.
- **Results screen:**
  - Homa calls it "one of the most important screens": show the win, the earnings, then progress.
  - Apple: highlight only the most likely action, and at most one or two highlighted buttons.
  - A win leads with **Next**; a fail leads with **Retry** plus how close you got. No shop on either.

### Challenge modes
- **"Control the world, not the hero" works when the hero stays still on screen** and the input moves the world directly.
  - Helix Jump turns the tower under a passive ball; Rise Up moves the shield, not the balloon.
  - Super Hexagon rotates and flips the view instead of changing the controls.
  - Randomly flipped controls feel like a punishment (Tetris Effect).
- **Hard and remix structures:**
  - Celeste's B-sides remix a chapter's own mechanics.
  - Mario Galaxy's Prankster Comets put **one** twist on a level you've already played.
  - Geometry Dash's weekly level; Slay the Spire's daily caps twists at 3; Hades' Heat is opt-in.
- **Optional hard content reaches a minority** (about 15% cleared Celeste's B-sides), so it must never block the campaign.

## 3. Proposal

### 3.1 Tap = turn, Hold = fly faster (no turn)
- **Decide on release.** Lift before **0.18 s** = turn, at the moment you lift. Still pressed at 0.18 s = tuck and boost, no turn. Releasing during a boost just untucks.
- **The press answers in the same frame:**
  - a wingtip crimp, a paper tick and a 10–20 ms haptic;
  - a mint ring sweeps round the glider as the timer;
  - from 0.11 s the wings start to fold (visual only), so a hold flows straight into the tuck.
- **Fairness:** a press that is still deciding counts for the gate grace. If it turns out to be a tap whose turn would have cleared the edge, it's a CLOSE CALL, not a crash. *This is a forgiveness change and needs owner approval.*
- **Settings:** "Classic: turn on touch" keeps today's instant turn. Express fold stays its own switch.
- **Tuning:** the Playtest report logs press lengths. If more than 2% of presses end just after the threshold, raise it within 0.16–0.22 s.
- **Later, optional:** while boosting, a second-finger tap turns at once.
- **Tests:** they call `reverse()` directly, so they are unaffected.

### 3.2 Plane and boost feel
- **Turn (tap):**
  - Stretch 1.15 × 0.87 along the new heading for about 60 ms, then settle with about 10% overshoot over 140 ms.
  - 4–6 paper flecks, a swoosh arc and a "fwip" sound.
  - *This scales the existing glider drawing. The art doesn't change, but please confirm.*
- **Boost (hold):**
  - **Onset:** the glider stretches and tucks, a gold glow appears, the camera pulls back about 5% then settles to 2%, a light haptic plays and the whoosh starts.
  - **While held:**
    - the trail is 60% longer and tinted gold, with 6–10 paper streaks;
    - the background drifts 1.7× faster;
    - the wings flutter ±1.5°;
    - the whoosh climbs 3–4 semitones.
  - **Tiers:** the streaks turn gold at 1 s and 2 s.
  - **Release:** the wings spring open with a paper puff, and the camera and pitch ease back.
  - **No** shake, motion blur or constant buzzing. Reduced-motion is respected.
- **Rewards:**
  - Perfects in a row climb a pentatonic chime scale.
  - A 40–60 ms freeze on PERFECT ×4 and above.
  - Screen shake only on a crash.

### 3.3 Tutorial: First Light teaches itself
- **No separate practice mode, no "Tutorial?" question, no text panels.** A first-time player goes from PLAY straight into Level 1:
  - **Opening:** Pip hands over a letter, which folds into the glider. One line: "Deliver the night mail."
  - **Gate 1:** as the glider heads for the wall, time slows right down and waits. A paper ghost finger taps with a ripple, and your tap restores speed and flips the glider.
  - **Gate 2:** a little slow motion, no finger.
  - **Gate 3:** full speed, no help.
  - A miss in gates 1–3 bounces softly and repeats, so you can't fail them. The score bar appears after gate 3.
- **Taught the first time it matters:**
  - **Hold** at the start of Level 2: slow motion, a finger with a filling ring, a gap escaping ahead.
  - **Gold postmark:** the first perfect freezes for a beat with one line.
  - **Fragment:** the first one glows with a pointer.
- **If you're stuck:** after two crashes of the same kind, the ghost finger shows once more. "Replay tutorial" stays in Settings.
- *This changes the first three gates of Level 1 for first-time players only, so it needs owner approval.*

### 3.4 Results
- **Win:** a big gold **NEXT LEVEL** showing the level name ("Level 3 · Tangled Orbit"), a small Replay, and the back-to-chapter button.
  - The Hangar button is hidden; the element stays for the code.
  - The back button keeps its chapter label, which the tests check.
- **Fail:** one big **RETRY**, with the near-miss line ("Only 34s from the finish"). Practice from the gatekeeper is the second option when it applies.
- **Other runs:**
  - The last level of a chapter shows **NEXT CHAPTER**.
  - Ascension shows **FLY AGAIN**.
  - Tonight's Letter shows **Share postcard** first.
- **Timing:** the whole sequence takes 2.5 s or less and a tap skips ahead. The 0.45 s tap lockout stays.
- **A new plane** you can afford is celebrated on the bar ("Dart is ready!") and badged on the Hangar button at Home, not offered on the results screen.

### 3.5 Ascension button
- **B · Orbit portal (recommended):** a glowing ring with a planet and a looping glider, "ASCENSION" and your best underneath. It reads as "a place to fly into".
- **A · Sky ladder:** a tall tab that climbs Bloom → Ember → Void to a star. It shows how far you've got, but it's busier.
- **C · Ticket under the title:** the most explicit, but it adds text to Home.

### 3.6 Lanterns, explained
- **The first night:** after the first finished flight, a lantern flies from the results to the string and lights up. Pip presents, with two lines: "Night 1 lit! Fly once every night to light the next lantern. Light all 7 and Pip brings you a parcel." Then one button.
- **Starter moon:** Pip gives the first Paper Moon when the string starts. That's Duolingo's free-freeze win, and it costs no stars.
- **Show the count:** the newest lantern carries a small gold number.
- **Tap the string** for a small sheet: whether tonight is lit, nights to the parcel, moons held, and one line on what a moon does.
- **First time something happens:** the first moon received, the first moon used, and the first dimmed night each explain themselves once ("Your lanterns dimmed. Fly once tonight to relight them.").
- **Celebration:** every lantern lit is a small moment, bigger on nights 3 and 7.
- **Later, with the Android app:** a local reminder 23.5 h after the last flight, plus an optional evening "last chance", both about the lantern.

### 3.7 Challenge twists: "Special Delivery"
**Verdict:** yes to the owner's idea, as optional remixes, never as the campaign's hard mode.

**How it works:**
- Each Special Delivery changes **one** rule, says it in one line, and shows 1–3 wax seals for difficulty.
- It unlocks after the Solar Forge or 60 s in Ascension, so new players never meet it.
- It appears as a stamp on levels you've already cleared, like a Mario Galaxy comet.
- One twist a week becomes Tonight's Letter on a fixed night.
- Rewards are cosmetic: a Stamp Album page, a postmark colour, a best score per twist. Past twists come back.
- The campaign stays one tap and Ascension stays as it is. Each twist is its own run type, behind a flag.

**First three to prototype:**
1. **Turn the world** (the owner's idea, made readable). Pip stays pinned at the top of the screen; a tap reverses the planet's spin and swings its gates to you.
   - It is the current game seen from Pip's point of view, so every level and the gate planner work unchanged. That makes it the cheapest to build.
   - The literal version, where Pip keeps flying while the gates spin, was rated the hardest to read, because you'd track two moving things.
   - If players like it, "Click-lock" (a tap turns the next gate one notch) is the real gate puzzle.
2. **Postage.** Every turn costs a stamp and every gate passed pays one back. Each tap becomes a decision, and it fits the post office story.
3. **Lantern night.** Darkness, with only Pip's lantern showing the gates. Color Switch's "Cave" mode proves the idea, and it's a natural opener for the Void chapter, where Moon's curtain is drawn.

**Later candidates (from the research):**

| Twist | Rule | Readability (5 = clearest) | Effort |
|---|---|---|---|
| Airmail | Always tucked, faster gates (a "Hyper" hard mode) | 5 | S |
| Registered mail | One hit, no forgiveness | 5 | S |
| Echo race | Race the ghost of your best Tonight's Letter | 4 | M |
| Pulse | Orbit speed swells to the beat | 4 | S |
| Hold-to-steer | Hold for clockwise, let go for counter-clockwise | 4 | S |
| Click-lock | A tap turns the next gate one notch | 3 | M |
| Invisible ink | Gaps fade as gates close in | 3 | S |

Twin gliders and gates that grow outward are held back: both change how gates form, and both are large builds.

## 4. Build order after approval

Each step: test at 390×844, 390×760 and 320×568, run both test commands, take screenshots, then commit and push.

1. **Results:** Next level, Retry, Next chapter, Fly again. Small change, big flow gain.
2. **Input split and feel:** turn on lift, hold to boost, the press feedback, the flip and the boost recipe. Behind "Classic: turn on touch".
3. **Lanterns and Home:** the first-night moment, starter moon, count, lantern sheet, Ascension button B.
4. **Tutorial:** guided First Light, first-time Hold, postmark and fragment moments.
5. **Special Delivery:** a "Turn the world" prototype behind a flag, then Postage, then Lantern night.

## 5. Decisions for the owner
1. **Input:** turn on lift and hold to boost (0.18 s) as the default, with "Classic: turn on touch" in Settings? And the pending-tap grace (CLOSE CALL)?
2. **Feel:** the flip and boost stretch scale the existing glider drawing (the art is unchanged). OK?
3. **Tutorial:** guided First Light (slow motion on the first gates, no failing them, first-time players only)? And a starter Paper Moon?
4. **Ascension:** B (portal), A (ladder) or C (ticket)?
5. **Twists:** the Special Delivery structure, starting with a "Turn the world" prototype?
6. **Results:** the layout as mocked?

## Appendix: sources

**Tutorials and streaks**
- https://www.kodeco.com/2510-video-tutorial-how-to-make-a-game-like-flappy-bird-part-4-keeping-score
- https://uxdesign.cc/crossy-roads-effective-and-almost-scary-engagement-methods-a-ux-analysis-13c52c0f28e0
- https://www.gameskinny.com/tips/altos-adventure-beginners-guide-tips-and-tricks/
- https://www.tapsmart.com/games/review-mr-jump-infuriatingly-addictive-single-tap-platformer/
- https://www.pocketgamer.com/tiny-wings/touching-the-sky-tiny-wings-tips-and-hints/
- https://www.kwalee.com/blog/follow-these-3-simple-steps-make-enjoyable-hyper-casual-games
- https://www.gameanalytics.com/blog/hyper-casual-game-common-mistakes
- https://hubspot.academy.homagames.com/15-golden-rules-of-hyper-casual-games
- https://supersonic.com/learn/blog/optimizing-ftue/
- https://unity.com/how-to/10-first-time-user-experience-tips-games
- https://developer.apple.com/design/human-interface-guidelines/onboarding
- https://grail.cs.washington.edu/projects/game-abtesting/chi2012/
- https://www.gamedeveloper.com/business/no-one-reads-text-in-a-tutorial
- https://blog.playtestcloud.com/mistakes-mobile-game-tutorials/
- https://github.com/ChatPRD/lennys-podcast-transcripts/blob/main/episodes/jackson-shuttleworth/transcript.md
- https://blog.duolingo.com/improving-the-streak
- https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
- https://docs.unity.com/en-us/services/solutions/daily-rewards

**Input, feel and results**
- https://www.gamedeveloper.com/design/opinion-dealing-with-designer-input-latency
- https://blog.hypersect.com/reducing-perceived-attack-delay/
- https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/main/core/java/android/view/ViewConfiguration.java
- https://raw.githubusercontent.com/qmk/qmk_firmware/master/docs/tap_hold.md
- https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs
- https://maddymakesgames.com/articles/celeste_and_forgiveness/
- https://eprints.gla.ac.uk/104653
- https://theengineeringofconsciousexperience.com/jan-willem-nijman-vlambeer-the-art-of-screenshake/
- https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough-
- https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/
- https://www.shawnhargreaves.com/blog/speed-is-a-matter-of-perspective.html
- https://developer.android.com/develop/ui/views/haptics/haptics-principles
- https://developer.apple.com/design/human-interface-guidelines/playing-haptics
- https://capacitorjs.com/docs/apis/haptics
- https://www.gamedeveloper.com/game-platforms/-i-super-meat-boy-i-s-mcmillen-explains-why-so-hard-
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2658737/
- https://hubspot.academy.homagames.com/game-design-the-p.a.s.s.e.d-method
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://defold.com/tutorials/level-complete

**Challenge modes**
- https://www.pocketgamer.biz/voodoo-development-magic-how-h8-games-launched-helix-jump
- https://en.wikipedia.org/wiki/Duet_(video_game)
- https://www.timeextension.com/features/the-making-of-super-hexagon-the-game-terry-cavanagh-never-expected-anyone-else-to-get
- https://apps.apple.com/us/app/-/id1315683948
- https://trustedreviews.com/reviews/tetris-effect
- https://en.wikipedia.org/wiki/Celeste_(video_game)
- https://www.mariowiki.com/Prankster_Comets
- https://geometry-dash.fandom.com/wiki/Weekly_Demon
- https://slaythespire.wiki.gg/wiki/Custom_Mode
- https://www.rpgsite.net/feature/10287-hades-pact-of-punishment-heat-modifiers-and-how-to-maximize-your-rewards
- https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/
- https://www.wemod.com/cheats/celeste-trainers/achievements
- https://supersonic.com/learn/blog/6-ways-to-boost-your-games-retention-from-d1-d7/

Some findings came from search summaries rather than full page reads; anything the research couldn't confirm is not stated as fact above.
