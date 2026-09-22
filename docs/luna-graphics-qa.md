# Luna Graphics Lab QA

This checklist is for the isolated demo on `luna_graphics`. The lab is intentionally separate from the production game and should remain disposable until the plane direction is approved.

## Open

```powershell
python -m http.server 3000 --bind 0.0.0.0
```

Then open `http://127.0.0.1:3000/luna-graphics.html`.

## Review pass

- Confirm the Manta silhouette reads immediately at the hero orbit scale.
- Select Crescent and tap several times. Its reversal should show a short, visible soft-turn trail.
- Select Splitwing and tap several times. Its echo should appear behind the active plane, then fade without leaving permanent clutter.
- Resize to a narrow phone viewport and confirm the hero canvas, plane cards, and review notes remain usable.
- Compare the Bloom palette, paper highlights, ink edge, shadow offset, and planet renderer against the main game.
- Judge the behavior without reading the descriptions. If the plane identity is not visible from motion alone, it is not ready for production.

## Approval state

All three demos are exploratory code-native visuals. No raster asset, production game rule, purchase price, save schema, or live level has been changed by this branch.
