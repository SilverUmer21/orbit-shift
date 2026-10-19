// Exports the game's own ship, trail and planet art to PNGs for the Hangar / retention mockups (no redrawn art).
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = path.join(__dirname, 'hangar-assets');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('http://127.0.0.1:3112/index.html'); await p.waitForTimeout(800);
  const files = await p.evaluate(() => {
    const out = {};
    const make = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g, w, h); return c.toDataURL('image/png'); };
    for (const pal of cosmetics) for (const r of riders) {
      out[`ship-${r.id}-${pal.id}.png`] = make(360, 220, g => { g.translate(180, 110); drawGlider(g, r, pal, 4.2, 0, 0, false, .25); });
    }
    // Trail swatches: an arc of the trail behind the Manta, as in flight.
    for (const id of trailStyles) {
      const pal = cosmetics[0];
      out[`trail-${id}.png`] = make(420, 200, g => {
        const R = 330, cx = 210, cy = 380;
        for (let i = 26; i >= 0; i--) {
          const a = -Math.PI / 2 - .05 - i * .028, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          g.globalAlpha = (1 - i / 27) * .9; g.fillStyle = i % 2 ? pal.accent : pal.gold;
          drawTrailPiece(g, id, x, y, Math.max(2, (1 - i / 27) * 12), a, i);
        }
        g.globalAlpha = 1; g.save(); const a = -Math.PI / 2 + .02; g.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.rotate(a + Math.PI / 2); drawGlider(g, riders[0], pal, 1.7, 0, 0, false, .25); g.restore();
      });
    }
    if (window.OrbitArt) for (const [id, kind] of [['bloom', 'bloom-crown'], ['ember', 'ember-furnace']])
      out[`planet-${id}.png`] = make(400, 400, g => window.OrbitArt.drawLivingPlanet(g, kind, { x: 200, y: 200, radius: 150, paletteId: id, time: 1, lit: true, reduced: true }));
    return out;
  });
  for (const [name, url] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), Buffer.from(url.split(',')[1], 'base64'));
  console.log(Object.keys(files).length, 'assets');
  await b.close();
})();
