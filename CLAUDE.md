# Orbit Shift

Read `docs/GDD.md` before any work. It holds the context, what is built, the current step, the bug log and the decisions. Update it when something is built, decided or found.

Rules that always apply:
- Work on the `complete-remake-orbit-shift` branch.
- Never change gameplay, ring/gate formation, planets or ship art without the owner's approval.
- Plan → mockup → approval → build → test at 390×844, 390×760 (owner's phone) and 320×568 → screenshot → commit and push.
- Keep the DOM ids `game.js` uses; never edit tests to make a change pass.
- Run `node tests/ascension-timing.cjs` and `node tests/ascension-timing.cjs 19 320` before every commit.
