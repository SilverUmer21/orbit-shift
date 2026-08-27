# Orbit Shift

A dependency-free mobile Canvas game with authored Luminous Papercut worlds and a six-ship Cosmic Glider collection. Tap to reverse around a living planet, pass through contracting gates, chain perfect dodges, and trigger fever mode.

## Play locally

From this folder:

```powershell
python -m http.server 3000 --bind 0.0.0.0
```

Open `http://127.0.0.1:3000/` on the computer.

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
- Home: play, open the garage, or change settings.
- Garage: spend run-earned stars to unlock and equip gliders; choose any unlocked biome independently.
- Settings: sound, supported-device haptics, and reduced effects.

Stars are awarded for passed gates, perfect dodges, and fever activations. Scores, stars, owned gliders, selected glider, unlocked biomes, tutorial completion, and preferences are stored locally under `orbit-shift-save`. Existing Orbit Shift saves migrate automatically and the old Neon Subway save remains untouched.

## Android direction

Keep the Vercel build as the playtest version. Once controls and replay balance are proven, wrap this same static app with Capacitor, add adaptive icons and splash assets, test offline/device behavior, sign an Android App Bundle, and release it through Play Console internal testing before a public listing.

## Godot mapping

- Canvas loop -> main scene and `_process(delta)`
- Player angle -> orbiting Player node
- Gate list -> gate scene instances and spawner
- Angular checks -> collision and signal handling
- DOM panels -> Control nodes
- `localStorage` -> `ConfigFile` or local save resource
