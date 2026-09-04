# Orbit Shift

A dependency-free mobile Canvas arcade journey with authored Luminous Papercut worlds and a six-ship Cosmic Glider collection. Tap to reverse around a living planet, pass through contracting gates, chain perfect dodges, earn a flow shield, and trigger fever mode.

Version 1 adds a four-level Bloom chapter to the Cosmic Islands campaign. **First Light**, **Pollen Path**, **Tangled Orbit**, and **Crown of Petals** grow from a 45-second introduction into a 75-second Budkeeper finale. The island visibly restores after each clear, while the original continuous journey remains available as Ascension.

The approved Bloom chapter and Ember's Kindling level are on `main`. The remaining Ember levels and Void stay unavailable pending approval.

## Kindling review build

Complete Crown of Petals with any rating to unlock Ember. Kindling is a 60-second introduction with ten gates, six fragment opportunities, and a two-perfect rating target. Gates 3, 5, 7, and 9 carry heat pulses; each is followed by a wide top/bottom recovery gate. There are no paired gates, hazards, or guardian in Kindling.

Heat gates start at 75% of base speed, show bright inward paper folds during warm-up, smoothly accelerate, then hold 125%. Fever slows both the cue and movement. The Ember furnace and chapter palette do not overwrite the equipped ship or saved palette. First completion lights the furnace and grants 15 spendable stars once. Bloom has 12 available rating stars, Ember has 3, and the combined total is 15.

Open `http://127.0.0.1:3000/tests/visual.html` for the isolated review build. It starts a playable Kindling run using disposable progress, so completing Bloom is unnecessary for review and real saves are untouched. The scene selector includes heat warnings, the Ember chapter, results, and the map. Use Play Kindling to restart the review run. Preview progress survives menu navigation, but resets when the preview page reloads.

Cinder Step, Furnace Heart, and Solar Forge are disabled previews, not playable levels.

## World Awakening review

The `world-awakening` branch adds a short campaign-clear celebration before the existing results. Paper rays unfold from the planet, Bloom blossoms or Ember ignites, and earned rating stars appear. Repeat clears can skip the celebration; reduced effects keep it restrained. Gameplay difficulty, rewards, and Ascension remain unchanged. This visual update awaits review before merging.

## Play locally

From this folder:

```powershell
python -m http.server 3000 --bind 0.0.0.0
```

Open `http://127.0.0.1:3000/` on the computer.

Open `http://127.0.0.1:3000/art-lab.html` to compare the earlier code-native campaign maps and living planets.

Open `http://127.0.0.1:3000/archipelago-lab.html` to inspect the production Orbit Archipelago renderer in isolation. The campaign uses this same shared renderer, authored SVG assets, and locally vendored PixiJS runtime.

For a phone test:

1. Connect the computer and phone to the same Wi-Fi.
2. Run `ipconfig` and find the Wi-Fi adapter's IPv4 address.
3. Open `http://YOUR-LAN-IP:3000/` on the phone, for example `http://192.168.1.20:3000/`.
4. Allow Python through Windows Firewall if the phone cannot connect.

## Deploy to Vercel

1. Create an empty GitHub repository.
2. In this folder run `git add .`, `git commit -m "Orbit Shift"`, `git branch -M main`, `git remote add origin YOUR_REPOSITORY_URL`, and `git push -u origin main`.
3. In Vercel choose **Add New -> Project** and import the GitHub repository.
4. Select framework preset **Other**, leave the build command empty, and keep the output directory as `.`.
5. Deploy and open the generated HTTPS URL on the phone.

## Controls

- Mobile or mouse: tap the game to reverse direction.
- Keyboard: Space, Left Arrow, or Right Arrow.
- Home: open Cosmic Islands, the garage, or settings.
- Cosmic Islands: open the four-level Bloom chapter or launch the existing Ascension journey.
- Garage: spend run-earned stars to unlock and equip gliders; choose any unlocked biome independently.
- Settings: sound, supported-device haptics, and reduced effects.
- Playtest report: view and copy local run/retention statistics from Settings; nothing is uploaded automatically.

Each Bloom level offers six fragments; collect any three for its fragment rating. Nearby fragments snap to the ship, and extras award three spendable stars each. The other ratings reward finishing and earning 2/2/3/3 perfects across the four levels. Selected golden-petal gates offer a more forgiving perfect zone; ordinary gates, paired gates, and guardians retain their original collision and perfect windows.

Five perfects charge fever even with ordinary passes between them. Fever lasts six seconds at x5, slows hazards by 20%, and grants at most one shield per run. Charge is run-only; ordinary passes reset the scoring streak, and shield collisions reset streak and charge. First Light unlocks Bloom Wake and Crown of Petals restores the Bloom constellation. Existing scores, campaign ratings, ships, currency, and settings remain intact.

## Verification

Run `node tests/ascension-timing.cjs` for deterministic movement, pickup, fever, reward, legacy-save, and shared-route checks. Optional arguments select a seed and logical phone width, for example `node tests/ascension-timing.cjs 991 320`. The tests follow planned reversal inputs through all five playable levels and 120 seconds of Ascension at 20/30/60/120 FPS without collision immunity in the route checks. Kindling checks include all ten gates resolving before completion, forced fever activation/expiration during pulses, recovery gates, chapter access, palette restoration, version-4 save migration, and repeat rewards.

Open `http://127.0.0.1:3000/tests/visual.html` for isolated 320x568, 390x844, and 430x932 previews. Its iframe uses a disposable in-memory save and cannot overwrite real player progress. Previous Bloom/Ascension normal, fever, and guardian drawing measured approximately 0.8-0.9 ms median / 5.5-5.8 ms p95 CPU submission locally at 220 particles. These measurements exclude GPU completion, do not cover the new Ember art, and do not establish phone frame rates. Validate completion rates and comfort with real players before further balance changes.

Kindling preview release checks: deterministic suites passed with seed/width pairs `19/320`, `991/390`, and `73/430`. In-app browser checks covered heat warnings, Ember chapter, and results at all three phone sizes with no document overflow; reduced-effects warnings, retry, chapter return, and repeat completion rewards were also checked with disposable progress. No browser warnings or errors were observed. Real-phone performance and a deeper source audit remain unverified.

## Android direction

Keep the Vercel build as the playtest version. Once controls and replay balance are proven, wrap this same static app with Capacitor, add adaptive icons and splash assets, test offline/device behavior, sign an Android App Bundle, and release it through Play Console internal testing before a public listing.

## Story direction

The universe is made from folded living paper. An Eclipse has broken its rhythm; the glider reconnects the stars and awakens each sleeping island. Tell this story through unfolding scenery and short chapter lines, not dialogue scenes.

## V3 Roadmap - Not Implemented

Constellation Weaving and Best-Run Ghost are reserved for a later prototype. They are not part of the current fever system or the Kindling review build.

- A perfect dodge would leave a glowing paper star behind the ship on its orbit, requiring a return rather than an automatic pickup.
- Players could circle or reverse to collect safely, using forgiving proximity collection. Stars would remain for several laps; exact lifetime needs playtesting.
- Each collected star would stitch a luminous thread toward one of five constellation points around the planet, accompanied by an ascending note. These stars would be separate from campaign fragments and spendable currency.
- Completing five points would fold the constellation into the planet: a Bloom flower crown, Ember paper sun, or Void eclipse halo.
- Proposed Starbreak would last six seconds, expand the ship's luminous ribbon trail, and grant one visibly indicated gate-breaking charge. The first gate collision would consume it; afterward normal collisions would apply. Exact interaction with the existing shield must be settled during the V3 prototype.
- Points would reset after Starbreak. Ordinary passes would preserve points; crashing would end the unfinished run constellation.
- Prototype this as a replacement for fever charge, not an additional meter. Five points and return collection are hypotheses to test for beginner accessibility, not guaranteed replay improvements.
- Best-Run Ghost would replay a previous personal-best trail. Fair comparison, replay compatibility, and storage limits remain V3 design work.

The intended loop is earn, return, connect, and transform. No Constellation Weaving, Starbreak, ghost racing, or permanent constellation rewards are implemented by documenting this direction.

## Godot mapping

- Canvas loop -> main scene and `_process(delta)`
- Player angle -> orbiting Player node
- Gate list -> gate scene instances and spawner
- Angular checks -> collision and signal handling
- DOM panels -> Control nodes
- `localStorage` -> `ConfigFile` or local save resource
