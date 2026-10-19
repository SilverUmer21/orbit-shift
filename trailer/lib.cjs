// Shared trailer helpers: open the director with the virtual clock, drive the game frame, autopilot, event log.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const ROOT = path.join(__dirname, '..');
async function openDirector({ scale = 2.5, port = 3112 } = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: scale });
  await context.addInitScript({ content: `window.orbitMaxPixelRatio = 3;\n` + fs.readFileSync(path.join(__dirname, 'vclock.js'), 'utf8') });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${port}/trailer/director.html`);
  const frame = page.frames().find(f => f.url().endsWith('/index.html'));
  await frame.waitForFunction('typeof state !== "undefined" && typeof startRun === "function"');
  await frame.evaluate(`(() => {
    state.muted = true; state.tutorialSeen = true; state.reducedEffects = false;
    window.__pilot = false; window.__events = [];
    const log = (type, extra) => __events.push({ type, t: performance.now(), el: state.elapsed, ...extra });
    window.__log = log;
    const origReverse = reverse; let lastPerfects = 0, lastGates = 0, lastLetters = 0;
    window.__auto = () => {
      if (window.__pilot && state.mode === 'run' && plannedTurns.length && plannedTurns[0] <= state.elapsed + .009) {
        if (reverse()) { plannedTurns.shift(); const p = playerPoint(); log('tap', { x: p.x, y: p.y, dir: player.direction }); }
      }
    };
    window.__watch = () => {
      if (state.perfects > lastPerfects) { const p = playerPoint(); log('perfect', { n: state.streak, x: p.x, y: p.y }); }
      if (state.gatesPassed > lastGates) log('gate', { n: state.gatesPassed });
      if ((state.runLetters || 0) > lastLetters) log('letter');
      lastPerfects = state.perfects; lastGates = state.gatesPassed; lastLetters = state.runLetters || 0;
      if (state.mode === 'crash' && !window.__crashed) { window.__crashed = true; log('crash'); }
      if (state.mode !== 'crash') window.__crashed = false;
    };
    window.__resetWatch = () => { lastPerfects = state.perfects; lastGates = state.gatesPassed; lastLetters = state.runLetters || 0; };
  })()`);
  const step = (ms) => frame.evaluate(ms => { __auto(); __advance(ms); __watch(); }, ms);
  const run = async (ms, dt = 1000 / 60) => { for (let t = 0; t < ms - 1e-6; t += dt) await step(Math.min(dt, ms - t)); };
  return { browser, page, frame, errors, step, run, g: code => frame.evaluate(code) };
}
module.exports = { openDirector, ROOT };
