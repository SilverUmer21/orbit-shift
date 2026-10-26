# Orbit Shift — organic launch plan (no ad spend)

2026-10-26 · for Blitzedo · uses the film "Fly Them Home" (60 s, 16:9 and 9:16), its 30 s and 15 s cuts, and the Night Mail trailer (30 s, 9:16).

## Verdict

**The first marketing job is 12+ testers, not followers.** A new personal Play Console account can't launch (or open pre-registration) until 12 opted-in testers have stayed in a closed test for 14 days in a row, and the clock restarts if the count drops below 12. So every post in the next two weeks asks for one thing: *"Be one of the first pilots — test it before launch."* Start the clock this week, recruit **20–25** people (dropouts reset it), and turn the same audience into pre-registrations and launch-day installs.

Ads stay at zero until the closed test shows retention (target D1 ≥ 35 %, D7 ≥ 12 %, from `docs/RETENTION-STRATEGY.md`).

## Assumptions (please correct any that are wrong)

- Team: Blitzedo, small studio; the game is HTML5/Canvas wrapped with Capacitor for Android (`ANDROID-RELEASE.md`).
- Budget: no ads yet. Only costs: the one-time Play registration fee (US$25, per `ANDROID-RELEASE.md`).
- Play Console account: **unknown whether it exists yet** and whether it is personal or organization. Organization accounts skip the 12-tester rule.
- Home market and language: not stated. The plan is written for English posts; WhatsApp Status reach is strongest in your own contact circles, so translate captions for your home market.
- The game has **no ads** (decision 2026-10-17). That rules out ad-funded web portals by default (see below).

## Verified terms (checked 2026-10-26)

| Item | What holds now | Source |
|---|---|---|
| Play: new personal accounts | Closed test with **12 opted-in testers for 14 consecutive days** before production access; organization accounts exempt; clock resets if testers drop below 12; Google also checks testers actually used the app | [Google Play Help (cited in ANDROID-RELEASE.md)](https://support.google.com/googleplay/android-developer/answer/14151465); [Testers Community, 2026](https://www.testerscommunity.com/blog/google-play-closed-testing-requirements-2026); [ExtendsClass, 2026](https://extendsclass.com/blog/google-plays-closed-testing-requirement-what-developers-need-to-know-in-2026) |
| Play pre-registration | Opens after production access; 90-day window per country; an optional reward must be a dedicated in-app product (we have none, so no reward) | [Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/9859047); [AppRadar](https://appradar.com/academy/google-play-app-store-optimization/google-play-pre-registration-create-hype-for-apps-before-launch) |
| Play preview video | A YouTube URL (public or unlisted, ads off, embeddable); autoplays muted, the first ~30 s matter most; real gameplay early | [AppFollow, 2026](https://www.appfollow.io/blog/app-store-video-strategy/); [AppLaunchFlow, 2026](https://www.applaunchflow.com/blog/google-play-promo-video-requirements-2026) |
| WhatsApp Status | 60 s per video for most users; 90 s was rolling out to some; one 2026 report still says 30 s. **Not verified officially**: check your own trim screen. The 30 s cut fits every case | [GIGA](https://www.giga.de/artikel/whatsapp-status-video-verlaengern-und-limit-umgehen-so-gehts/); [Green API, 2025](https://green-api.com/en/blog/2025/whatsapp-increases-status-length-to-90-seconds/); [LetsDataScience, Feb 2026](https://letsdatascience.com/news/whatsapp-users-share-valentines-day-status-videos-414599fd) |
| WhatsApp Channels | Free broadcast channel; 2–4 posts a week recommended. Status ads and promoted channels now exist (paid; not for now) | [Qualimero, 2026](https://qualimero.com/en/blog/whatsapp-channel); [ChatMaxima, 2026](https://chatmaxima.com/blog/whatsapp-status-ads-promoted-channels-2026/) |
| Instagram Stories | 60 s per story segment; link sticker open to all accounts (not brand-new or rule-breaking ones) | [Motiongility, 2026](https://motiongility.com/?p=69864); [Unilink, 2026](https://www.unilink.us/blog/instagram-link-sticker-explained) |
| Instagram Reels | Long Reels allowed (sources say 3–20 min), but 7–30 s performs best for reach; **Trial Reels** show a Reel to non-followers first | [Inro, 2026](https://www.inro.social/blog/instagram-reels-can-now-be-20-minutes-long-new-time-limit-explained-2025); [TechCrunch, Dec 2024](https://techcrunch.com/2024/12/10/instagram-rolls-out-trial-reels-that-arent-shown-to-a-creators-followers) |
| YouTube Shorts | Up to 3 min if vertical or square; 30–60 s is the usual sweet spot | [Async, 2026](https://async.com/blog/how-long-can-youtube-shorts-be/); [Piktochart, 2026](https://piktochart.com/blog/how-long-youtube-shorts/) |
| itch.io (web demo) | Upload an HTML5 zip, live in minutes, no review gate; default 10 % cut, adjustable to 0 %; no ads required | [Cinevva, 2026](https://app.cinevva.com/guides/publish-web-game) (third-party; check itch.io's own terms) |
| Poki | Web-exclusive by default (5–7 years, sources differ), ad revenue share via its SDK | [Poki for Developers](https://sdk.poki.com/deals); [Playgama](https://playgama.com/blog/business-faqs/poki-vs-crazygames-vs-gamedistribution-revenue-share/) |
| CrazyGames | Non-exclusive by default; full launch adds its SDK and ads | [Cinevva, 2026](https://app.cinevva.com/guides/publish-game-crazygames) |

**Lock-in warning:** Poki's default deal is multi-year web exclusivity, and both big portals monetise with ads inside the game. That conflicts with "No ads" on the end card. Don't sign a portal deal before deciding whether the web version is ad-free.

## Sequence

| When | Step | Goal |
|---|---|---|
| This week (from Oct 27) | Open (or confirm) the Play Console account, upload the Capacitor build to a **closed test**, make the opt-in link. Post the 60 s vertical film on WhatsApp Status, Instagram Stories (with link sticker) and a WhatsApp Channel. | 20–25 opted-in testers |
| Days 1–14 | One short clip a day (calendar below). Every post: "Test it before anyone else, link in bio/story". Keep testers playing: a short tester update in the channel every 3–4 days | Keep ≥ 12 testers active for 14 straight days; collect D1/D7 |
| ~Day 15 (earliest ~Nov 10) | Apply for production access. Publish the landscape film on YouTube (unlisted is fine) as the Play preview video | Production access |
| After approval | Open **pre-registration** in your markets; switch the end card line to the official Play badge once the listing is live (`docs/GDD.md`) | Pre-registrations |
| Launch week | Launch post set: 60 s film everywhere, 15 s teaser as Reel/Short/TikTok, Reddit posts in the allowed slots, thank-you post to testers | Day-1 installs, first ratings |
| Optional, needs your decision | Ad-free **web demo** (first night only) on itch.io and blitzedo.com, so a Story viewer can play in 5 seconds without installing | Lower friction for Status/Stories viewers |

## Organic engine

**Cadence.** One vertical clip a day, the same file posted to Instagram Reels, YouTube Shorts and TikTok; WhatsApp Status and Instagram Stories 3–4 times a week (Stories are for people who already follow you, so they carry the call to action). Everyone at Blitzedo and close friends post the Status on launch day: on WhatsApp, reach is your contacts' contacts.

**What to post (a two-week bank; the film tooling can re-render any moment deterministically, so clips are cheap):**

| Day | Clip | Length |
|---|---|---|
| 1 | Full vertical film "Fly Them Home" (Status, Stories, Reel) | 60 s |
| 2 | 15 s teaser: fleet swaps → last gate → Moonrise → logo | 15 s |
| 3 | "How Pip folds a letter into a plane" (13–19 s of the film) | 6–8 s |
| 4 | 30 s cut (story version) | 30 s |
| 5 | "One tap. That's the whole game." Bloom section, TAP TO SHIFT | 8 s |
| 6 | Behind the scenes: art lab, a planet blooming, paper textures | 10–15 s |
| 7 | Night Mail trailer (already rendered, vertical) | 30 s |
| 8 | "Hold to fold" speed ramp + Express Post | 7 s |
| 9 | Devlog: "We filmed our own game frame by frame on a virtual clock" (render timelapse) | 15–20 s |
| 10 | The last gate in extreme slow motion, "Tap… or not?" | 5 s |
| 11 | Meet the fleet: six planes, one tap each | 4–6 s |
| 12 | "No ads. Plays offline." (the end card, cut to the beat) | 6 s |
| 13 | Old Moon asleep / Moonrise before-and-after | 6 s |
| 14 | Tester thank-you + "pre-registration opens soon" | 10 s |

**Three hooks to test first** (one change per test; on Instagram use Trial Reels so a weak hook doesn't reach your followers):
1. **"One tap. Six planes. On the beat."** Open on the first fleet swap (film 40.0 s), the moment testers already react to. Proof first: the payoff is in frame 1.
2. **"Every star is a letter that never arrived."** The story hook for Status and Stories: the close-up star-envelope, then the line.
3. **"A mobile game with no ads. Really."** A contrarian line over the Express Post gold flood. It sells the rarest thing about the game in this genre.

**Communities (read each sidebar first; rules change):** r/IndieGaming, r/MobileGaming (new-release flair), r/AndroidGaming; TouchArcade's self-promotion forum; Android Central's developer forum (announce yourself, keep one thread updated, include the store link). Post the clip natively (not a YouTube link) and answer every comment in the first hour.

**In-game sharing (biggest free channel, needs your approval):** the *Tonight's Sky* share card already proposed in `docs/RETENTION-STRATEGY.md` (Wave 1 A), Wordle-style, so every player posts the game. If it's approved, build it before launch so pre-registered players have something to share on day one.

**Store page:** keep the ASO plan in `docs/RETENTION-STRATEGY.md` §4 (title, 80-character short description with "No ads", keywords). First screenshot = the payoff (a PERFECT postmark on a blooming planet); preview video = the landscape film, so its first 30 seconds (the studio sting, the letter, Pip) should be checked muted.

**Creative bank.** Keep every clip with its numbers. When ads do start, the best organic clips become the first paid creatives.

## Measure and decide (weekly)

Track per clip: views, average watch time / completion, profile or link taps, tester sign-ups (Stories link-sticker taps → opt-ins). Our own rules (estimates, not industry benchmarks):

- **Kill** a clip format if it is in the bottom third for sign-ups per 1,000 views two weeks running.
- **Iterate** a format with good watch time but few taps: keep the clip, change only the last frame and caption (the call to action).
- **Scale** the top format: three new variants of it the following week.
- **Spend** nothing on ads until the closed test shows D1 ≥ 35 % and D7 ≥ 12 % (targets from `docs/RETENTION-STRATEGY.md`), and then only a capped test with a stop-loss.

## Monetization

Out of scope here: the game has no ads and stars are earned only in play, so a pre-registration reward isn't possible (it needs an in-app product). Revenue is a separate decision for later.

## Open questions

1. Does the Play Console account exist yet, and is it personal or organization?
2. Which country and language should the captions target first?
3. Do you want an ad-free web demo (itch.io / blitzedo.com) as the Story link, or Play-only?
