// Orbit Shift · "Fly Them Home" (60 s, 1920x1080, 60 fps). Usage (preview server on port 3112 from the repo root):
//   node film/render.cjs measure                 -> stage the gameplay gates and comets (film/corrections.json)
//   node film/render.cjs render [out] [from] [to] [step]  -> frames f00000.jpg.. + events.json (default film/out, whole film)
//   node film/render.cjs stills [out] t1 t2 ...  -> single frames at the given seconds (fast review)
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const FPS = 60, DUR = 60, MODE = process.argv[2] || 'render';
// FILM_V=1 renders the vertical cut (1080 x 1920); it shares corrections.json (the game's physics don't depend on layout).
const VERT = process.env.FILM_V === '1', VW = VERT ? 1080 : 1920, VH = VERT ? 1920 : 1080;
async function open() {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--use-angle=swiftshader', '--disable-accelerated-2d-canvas', '--disable-gpu-compositing'] });
  const context = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  await context.addInitScript({ content: `Object.defineProperty(window,'devicePixelRatio',{get:()=>window.__dpr||2.5,configurable:true});window.orbitMaxPixelRatio=8;\n` + fs.readFileSync(path.join(__dirname, 'vclock.js'), 'utf8') });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' || m.text().startsWith('measure')) console.log('[page]', m.text()); });
  await page.goto(`http://127.0.0.1:3112/film/film.html${VERT ? '?v=1' : ''}`);
  const ok = await page.evaluate(() => window.filmReady);
  if (ok !== true) throw new Error('film init failed: ' + ok);
  return { browser, page, errors };
}
(async () => {
  const { browser, page, errors } = await open();
  if (MODE === 'measure') {
    const corr = await page.evaluate(() => Film.measure());
    fs.writeFileSync(path.join(__dirname, 'corrections.json'), JSON.stringify(corr, null, 1));
    console.log('corrections', JSON.stringify(corr));
  } else if (MODE === 'layers') {
    const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
    for (const s of process.argv.slice(4).map(Number)) {
      const urls = await page.evaluate(async t => { Film.seekPip(t); if (t >= 19.45 && t < 45.2) Film.seekShot(t); await Film.frame(t); return [Film._layers.comp.toDataURL('image/jpeg', .9), Film._layers.glow.toDataURL('image/png')]; }, s);
      urls.forEach((u, i) => fs.writeFileSync(path.join(out, `t${s.toFixed(2)}-${i ? 'glow.png' : 'comp.jpg'}`), Buffer.from(u.split(',')[1], 'base64')));
    }
  } else if (MODE === 'stills') {
    const out = process.argv[3] || path.join(__dirname, 'stills'); fs.mkdirSync(out, { recursive: true });
    for (const s of process.argv.slice(4).map(Number)) {
      await page.evaluate(t => { Film.seekPip(t); if (t >= 19.45 && t < 45.2) Film.seekShot(t); return Film.frame(t, { noPrev: false }); }, s);
      await page.screenshot({ path: path.join(out, `t${s.toFixed(2).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
      console.log('still', s);
    }
  } else {
    const out = process.argv[3] || path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
    const from = Number(process.argv[4] || 0), to = Number(process.argv[5] || DUR), step = Number(process.argv[6] || 1);
    const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
    if (from > 0) await page.evaluate(t => { Film.seekPip(t); if (t >= 19.45 && t < 45.2) Film.seekShot(t); }, from);
    const t0 = Date.now();
    for (let f = f0; f < f1; f++) {
      await page.evaluate(t => Film.frame(t), f / FPS);
      if ((f - f0) % step === 0) await page.screenshot({ path: path.join(out, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 });
      if (f % 120 === 0) console.log(`frame ${f} (${(f / FPS).toFixed(1)} s) ${((Date.now() - t0) / 1000 / Math.max(1, f - f0 + 1)).toFixed(3)} s/frame`);
    }
    const ev = await page.evaluate(() => Film.events());
    fs.writeFileSync(path.join(out, 'events.json'), JSON.stringify({ fps: FPS, from, to, gw: VERT ? 432 : 768, ...ev }, null, 1));
  }
  if (errors.length) console.log('page errors:', errors.slice(0, 10));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
