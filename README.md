# Orbit Shift

A dependency-free mobile Canvas arcade journey with authored Luminous Papercut worlds and a six-ship Cosmic Glider collection. Tap to reverse around a living planet, pass through contracting gates, chain perfect dodges, earn a flow shield, and trigger fever mode.

Version 1 adds a four-level Bloom chapter to the Cosmic Islands campaign. **First Light**, **Pollen Path**, **Tangled Orbit**, and **Crown of Petals** grow from a 45-second introduction into a 75-second Budkeeper finale. The island visibly restores after each clear, while the original continuous journey remains available as Ascension.

The approved Bloom chapter is on `main`. Ember and Void remain locked pending further playtesting.

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

Run `node tests/ascension-timing.cjs` for deterministic movement, pickup, fever, reward, legacy-save, and shared-route checks. The tests follow planned reversal inputs through all four levels and 120 seconds of Ascension at 20/30/60/120 FPS without collision immunity in the route checks.

Open `http://127.0.0.1:3000/tests/visual.html` for isolated 320x568, 390x844, and 430x932 previews. Its iframe uses a disposable in-memory save and cannot overwrite real player progress. Normal, fever, and guardian drawing measured approximately 0.8-0.9 ms median / 5.5-5.8 ms p95 CPU submission locally at 220 particles. These measurements exclude GPU completion and do not establish phone frame rates. Validate completion rates and comfort with real players before further balance changes.

## Android direction

Keep the Vercel build as the playtest version. Once controls and replay balance are proven, wrap this same static app with Capacitor, add adaptive icons and splash assets, test offline/device behavior, sign an Android App Bundle, and release it through Play Console internal testing before a public listing.

## Godot mapping

- Canvas loop -> main scene and `_process(delta)`
- Player angle -> orbiting Player node
- Gate list -> gate scene instances and spawner
- Angular checks -> collision and signal handling
- DOM panels -> Control nodes
- `localStorage` -> `ConfigFile` or local save resource
