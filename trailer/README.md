# Trailer tooling

Both trailers are rendered from the real game on a virtual clock. Shared pieces:

- `vclock.js`: injected into every frame; replaces time, timers, rAF, CSS animation clocks and `Math.random` with deterministic versions. `window.__advance(ms)` steps the world.
- `lib.cjs`: opens a director page in Playwright (`openDirector({ director })`), adds the autopilot and the event watcher.

## Trailer B — "Special Delivery" (44.5 s, 1080×1920) · current

Plan, research and beat sheet: `docs/TRAILER-B.md`. Output: `release/orbit-shift-special-delivery-1080x1920.mp4`.

- `delivery.html`: the director overlay.
  - Night backdrop and the envelope opener; the letter unfolds into the live game.
  - Paper-tag captions that unfold and flip over their crease.
  - Game-space annotations: direction arrow, landing zone, gap guides, edge glint.
  - Paper fingertip with tap ripples and a hold ring; the gold postmark.
  - Freeze-frame transitions: letter fold, postcard slide, dissolve.
  - End card: Pip, the logo, and the real `drawGlider` ship orbiting it.
- `delivery.cjs`: the edit (8 scenes). `measure` finds the gap shifts for the staged gates (`delivery-corrections.json`); `render [out]` writes the frames and `events.json`.
- `delivery-soundtrack.py`: synthesises the music and effects from `events.json` (numpy only).

```sh
python3 -m http.server 3112 --bind 127.0.0.1 &
node trailer/delivery.cjs measure
node trailer/delivery.cjs render trailer/out-delivery       # TRAILER_SCALE=1 for a fast 432×768 preview (~90 s)
python3 trailer/delivery-soundtrack.py trailer/out-delivery/events.json trailer/out-delivery/soundtrack.wav
ffmpeg -framerate 30 -start_number 0 -i trailer/out-delivery/f%04d.jpg -i trailer/out-delivery/soundtrack.wav \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 18 -movflags +faststart \
  -c:a aac -b:a 192k -shortest trailer/release/orbit-shift-special-delivery-1080x1920.mp4
```

## Trailer A — "The Night Mail" (30 s, 1080×1920)

- `director.html`: wraps `index.html` in a camera and draws the captions, postmark stamp, page turns and end card (`window.render(state)`).
- `render.cjs`: the edit. `measure` finds the gap shifts for the staged gates (`corrections.json`); `render [out]` writes the frames and `events.json`.
- `soundtrack.py`: synthesises the music and effects from `events.json` (numpy only).

```sh
python3 -m http.server 3112 --bind 127.0.0.1 &
node trailer/render.cjs measure
node trailer/render.cjs render trailer/out            # TRAILER_SCALE=1 for a fast 432×768 preview
python3 trailer/soundtrack.py trailer/out/events.json trailer/out/soundtrack.wav
ffmpeg -framerate 30 -start_number 0 -i trailer/out/f%04d.jpg -i trailer/out/soundtrack.wav \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 18 -movflags +faststart \
  -c:a aac -b:a 192k -shortest trailer/release/orbit-shift-night-mail-1080x1920.mp4
```
