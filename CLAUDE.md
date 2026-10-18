# Orbit Shift

Read `docs/GDD.md` before any work. It holds the context, what is built, the current step, the bug log and the decisions. Update it when something is built, decided or found.

How we design (owner's rule, also at the top of the GDD): act as a game designer and UI/UX game designer. Start from the game's theme, art style and genre; research how strong games in the genre solve a feature before designing it; invent new art, motion and VFX when that serves the world better. "Game language" does not mean reusing existing assets.

Rules that always apply:
- Work on the `complete-remake-orbit-shift` branch.
- Never change gameplay, ring/gate formation, planets or ship art without the owner's approval.
- Plan → mockup → approval → build → test at 390×844, 390×760 (owner's phone) and 320×568 → screenshot → commit and push.
- Keep the DOM ids `game.js` uses; never edit tests to make a change pass.
- Run `node tests/ascension-timing.cjs` and `node tests/ascension-timing.cjs 19 320` before every commit.
