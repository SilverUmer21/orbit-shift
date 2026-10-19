// Renders each mockup phone in hangar-retention.html to a PNG (needs the preview server on 3112).
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = path.join(__dirname, '..', 'previews');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto('http://127.0.0.1:3112/design/paper-night/mockups/hangar-retention.html'); await p.waitForTimeout(900);
  for (const id of await p.$$eval('.phone', els => els.map(e => e.id))) await p.locator('#' + id).screenshot({ path: path.join(OUT, `hangar-retention-${id}.png`) });
  console.log('errors', JSON.stringify(errors)); await b.close();
})();
