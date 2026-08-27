# Orbit Shift

A dependency-free mobile Canvas game with an authored Luminous Papercut renderer. Tap to reverse around a living planet, pass through contracting gates, chain perfect dodges, and trigger fever mode.

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
- SFX button: mute or unmute sound.

Progress, unlocked biomes, tutorial completion, and sound preference are stored locally in the browser. The old Neon Subway save remains untouched.

## Godot mapping

- Canvas loop -> main scene and `_process(delta)`
- Player angle -> orbiting Player node
- Gate list -> gate scene instances and spawner
- Angular checks -> collision and signal handling
