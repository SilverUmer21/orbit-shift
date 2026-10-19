# Trailer tooling

"The Night Mail" (30 s, 1080×1920) is rendered from the real game on a virtual clock.

- `vclock.js`: injected into every frame; replaces time, timers, rAF, CSS animation clocks and `Math.random` with deterministic versions. `window.__advance(ms)` steps the world.
- `director.html`: wraps `index.html` in a camera and draws the captions, postmark stamp, page turns and end card (`window.render(state)`).
- `lib.cjs`: opens the director in Playwright, adds the autopilot and the event watcher.
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
