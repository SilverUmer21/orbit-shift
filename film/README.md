# Film tooling — "Fly Them Home"

60 s presentation film, 1920×1080 at 60 fps. Plan and beat sheet: `docs/FILM-FLY-THEM-HOME.md`.

- `film.html` — the compositor page: the real game in an iframe (768×432 CSS px, rendered at 2.5× so its canvas is 1920×1080; 6× for the last-gate close-up), the film canvas, and Pip's rig from `pip.js`.
- `js/timeline.js` — the edit: `Film.frame(t)` draws film second t. Story scenes are functions of t; gameplay comes from shots.
- `js/gameplay.js` — the bridge to the game on its virtual clock (`trailer/vclock.js`). Taps, holds, comets and ship swaps fire on film time so they land on the beat. Staged gates are copies of a real gate the game planned at the start of the shot; `measure` moves each one's spawn and gap so the game's own rules thread it on its beat (perfects near the edge), and aims the comet for a tail-spark near miss.
- `js/art.js`, `js/sky.js`, `js/type.js`, `js/fold.js` — story art (the Blitzedo wordmark sting from the website's own SVG, the letter, the wax seal with the pixel b, Old Moon and the curtain), the cut-paper Sky World, captions/postmarks/logo, and the origami engine (folds drawn as textured affine flaps).
- `js/post.js` — WebGL post: bloom and an anamorphic streak only from gold and the explicit glow layer, exposure, grade, vignette, grain, flash and fade.
- `score.py` — the score and sound, synthesised from `events.json` (numpy + scipy), mastered to −14 LUFS.
- `narration.json` — the narration script, timed to the edit (not rendered yet).

```sh
python3 -m http.server 3112 --bind 127.0.0.1 &          # from the repo root
node film/render.cjs measure                             # stage gates and comets -> film/corrections.json
node film/render.cjs stills film/stills 22.1 47.8        # single frames for review
node film/render.cjs render film/out                     # 3600 frames + events.json (~40 min on 4 cores)
python3 film/score.py film/out/events.json film/out/score.wav
ffmpeg -framerate 60 -i film/out/f%05d.jpg -i film/out/score.wav -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -crf 18 -g 120 -movflags +faststart -c:a aac -b:a 256k -shortest film/release/orbit-shift-fly-them-home-1920x1080.mp4
```

Notes: the renderer launches Chromium with `--disable-accelerated-2d-canvas` (software WebGL makes accelerated 2D canvas very slow) and overrides `devicePixelRatio` in the game frame. The game's floating labels are switched off in the film (captions and postmarks carry the words); nothing in the game itself is changed.
