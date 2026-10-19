// Orbit Shift · "The Night Mail" (30 s, 1080x1920). Real gameplay on a virtual clock; staged gates are real gates whose
// gap is shifted (measured in silent passes) so the game's own rules score the perfects. Usage:
//   node trailer/render.cjs measure      -> computes gate corrections (trailer/corrections.json)
//   node trailer/render.cjs render [out]  -> renders frames + events.json into out (default trailer/out)
const fs = require('fs'), path = require('path');
const { openDirector } = require('./lib.cjs');
const FPS = 30, MODE = process.argv[2] || 'render', OUT = process.argv[3] || path.join(__dirname, 'out');
const CORR_FILE = path.join(__dirname, 'corrections.json');
const ease = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const back = t => { t = Math.max(0, Math.min(1, t)); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;

// Master Bloom run: staged gates (id, spawn time, want: 'pass' centred or 'perfect' edge) and scripted taps (game seconds).
const MASTER = {
  setup: `state.campaign.completed=['first-light'];state.campaign.unlockedLevel=2;startRun('campaign','first-light');campaignGateIndex=1e9;dailyRandom=seededRandom(777);`,
  gates: [['g1', .3, 'pass'], ['g2', 1.9, 'pass'], ['g3', 6.0, 'perfect'], ['g4', 7.6, 'perfect'], ['g5', 9.2, 'perfect'], ['g6', 10.8, 'perfect']],
  taps: [3.4, 5.6, 8.1, 11.4, 13.3],
};

async function main() {
  const d = await openDirector({ scale: MODE === 'render' ? Number(process.env.TRAILER_SCALE || 2.5) : 1 });
  await d.run(600);
  // Every master take restores the fresh-load state so earlier scenes (stats, unlocks, stars) can't change how gates are planned.
  await d.g(`window.__state0 = JSON.stringify(state)`);
  await d.g(`window.__cross = {}; const orig = resolveGate; window.resolveGate = function(gate, ca = player.angle, cg = gate.gap) {
    if (gate.__tag) { const p = playerPoint(); __cross[gate.__tag] = { ca, cg, dir: player.direction, opening: gate.opening, el: state.elapsed, x: p.x, y: p.y }; }
    return orig.apply(this, arguments); };`);
  await d.g(`document.head.insertAdjacentHTML('beforeend','<style id="cine">.cine .home .brand,.cine .home .action-row,.cine .home-top,.cine #lanterns,.cine #homeAscension,.cine #bloomStory{visibility:hidden!important}#actLabel{display:none!important}</style>')`);
  // Captions carry the words; the game's own floating labels would stack under them.
  await d.g(`drawLabels = () => {};`);

  let corr = fs.existsSync(CORR_FILE) ? JSON.parse(fs.readFileSync(CORR_FILE, 'utf8')) : {};
  const events = []; let videoT = 0, frameNo = 0;
  if (MODE === 'render') fs.mkdirSync(OUT, { recursive: true });

  // Run the master script from el=0. onFrame(el) is called once per 1/60 s of game time when capture is off,
  // or the caller drives it frame by frame through `masterStepper`.
  function masterStepper(measure) {
    let gi = 0, ti = 0;
    return async (ms) => {
      const el = await d.g('state.mode==="run"?state.elapsed:-1');
      if (el >= 0 && gi < MASTER.gates.length && MASTER.gates[gi][1] <= el + 1e-4) {
        const [id] = MASTER.gates[gi];
        const ok = await d.g(`(()=>{const n=gates.length;if(!spawnGate()||gates.length===n)return false;const g=gates[gates.length-1];g.__tag='${id}';g.gap=normalize(g.gap+(${corr[id] || 0}));return true;})()`);
        if (ok) gi++;
      }
      if (el >= 0 && ti < MASTER.taps.length && MASTER.taps[ti] <= el + 1e-4) { ti++; await tap(); }
      await d.step(ms);
      // Snap the run clock: float drift in performance.now deltas otherwise lets a scheduled spawn slip a frame
      // after earlier scenes, which reshuffles the seeded gate plan.
      await d.g(`if(state.mode==="run")state.elapsed=Math.round(state.elapsed*1e6)/1e6`);
    };
  }
  async function tap() { const r = await d.g(`(()=>{lastReverse=-1e9;const ok=reverse();const p=playerPoint();if(ok)__log('tap',{x:p.x,y:p.y,dir:player.direction});return ok})()`); return r; }
  async function startMaster(measure) {
    await d.g(`{const s0=JSON.parse(__state0);for(const k of Object.keys(state))if(!(k in s0))delete state[k];Object.assign(state,s0);}`);
    await d.g(MASTER.setup + `__events.length=0;__resetWatch();__pilot=false;window.__cross={};state.invulnerable=${measure ? 999 : 0};`);
    return masterStepper(measure);
  }
  async function fastForward(stepper, toEl, clear = true) { for (let guard = 0; guard < 6000; guard++) { const el = await d.g('state.elapsed'); if (el >= toEl - 1e-6) break; await stepper(1000 / 60); } if (clear) await d.g('__events.length=0'); }

  if (MODE === 'debug') {
    for (let i = 0; i < 2; i++) {
      const stepper = await startMaster(false);
      await fastForward(stepper, 16.5, false);
      const ev = await d.g('__events'), cross = await d.g('__cross');
      console.log('run', i, ev.map(e => `${e.type}${e.n !== undefined ? 'x' + e.n : ''}@${e.el.toFixed(2)}`).join(' '));
      console.log('   cross', Object.entries(cross).map(([k, c]) => `${k}:${c.ca.toFixed(3)}/${c.cg.toFixed(3)}@${c.el.toFixed(2)}`).join(' '));
    }
    await d.browser.close(); return;
  }
  if (MODE === 'measure') {
    // Iterate until every staged gate lands where we want it (later gates are planned around earlier corrected ones).
    corr = {};
    for (let pass = 0; pass < MASTER.gates.length + 3; pass++) {
      const stepper = await startMaster(true);
      await fastForward(stepper, 16.5);
      const cross = await d.g('__cross'); let changed = false;
      for (const [id, , want] of MASTER.gates) {
        const c = cross[id]; if (!c) { console.log('pass', pass, 'missing', id); changed = true; continue; }
        const half = c.opening / 2 - .105, dist = want === 'perfect' ? half - .07 : 0;
        const target = c.ca - c.dir * dist;
        const delta = ((target - c.cg + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        if (Math.abs(delta) > .002) { corr[id] = (corr[id] || 0) + delta; changed = true; }
      }
      console.log('pass', pass, JSON.stringify(Object.fromEntries(Object.entries(corr).map(([k, v]) => [k, +v.toFixed(3)]))));
      if (!changed) break;
    }
    // Verify with crashes enabled.
    const stepper = await startMaster(false); await fastForward(stepper, 16.5, false);
    const ev = await d.g('__events'), cross = await d.g('__cross');
    console.log('verify:', ev.filter(e => e.type !== 'tap').map(e => `${e.type}${e.n !== undefined ? 'x' + e.n : ''}@${e.el.toFixed(2)}`).join(' '));
    fs.writeFileSync(CORR_FILE, JSON.stringify({ ...corr, __cross: cross }, null, 1));
    await d.browser.close(); return;
  }

  const X = corr.__cross || {};
  const g6 = X.g6 || { el: 15.3, x: 216, y: 300 };
  const shotEvents = async () => { const ev = await d.g('__events.splice(0)'); return ev; };
  const info = () => d.g(`(()=>{const p=playerPoint();return {el:state.elapsed,mode:state.mode,x:p.x,y:p.y,dir:player.direction,fold:player.fold,streak:state.streak}})()`);

  // Capture one video frame: advance the game by `gameMs` (in <=1/60 s substeps), then render the overlay and shoot.
  async function capture(gameMs, overlay, stepper) {
    let left = gameMs;
    while (left > 1e-6) { const ms = Math.min(1000 / 60, left); await (stepper ? stepper(ms) : d.step(ms)); left -= ms; }
    const ev = await shotEvents(); for (const e of ev) events.push({ ...e, video: videoT });
    const s = await overlay(ev);
    s.t = videoT;
    await d.page.evaluate(st => window.render(st), s);
    if (MODE === 'render') await d.page.screenshot({ path: path.join(OUT, `f${String(frameNo).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    frameNo++; videoT += 1 / FPS;
  }
  const mark = (type, extra) => events.push({ type, video: videoT, ...extra });
  const trace = async tag => { if (process.env.TRAILER_TRACE) console.log(tag, videoT.toFixed(2), await d.g(`JSON.stringify({mode:state.mode,level:state.levelId,el:+state.elapsed.toFixed(2),seal:!ui.rewardSeal?.hidden,results:!document.querySelector('#results').hidden})`)); };

  // ---------- S1 · HOOK (2.5 s): the razor gap before the 4th perfect, slowing to 10%, cut to black on the tap.
  {
    const stepper = await startMaster(false); await fastForward(stepper, g6.el - 1.62);
    const start = videoT;
    for (let k = 0; k < 75; k++) {
      const tv = k / FPS, sp = tv < .9 ? 1 : lerp(1, .1, ease((tv - .9) / .9));
      await capture(1000 / FPS * sp, async () => {
        const z = lerp(1, 2.1, ease((tv - .5) / 1.6));
        return { cam: { z, x: lerp(216, g6.x, ease((tv - .3) / 1.4)), y: lerp(384, g6.y, ease((tv - .3) / 1.4)) },
          caps: tv > 1.0 ? [{ id: 'hook', text: 'Tap… or not?', y: 120, s: back((tv - 1.0) / .35) * .9 + .1, r: -3, o: Math.min(1, (tv - 1) * 6) }] : [],
          black: tv > 2.38 ? 1 : 0, vignette: .4 + .5 * ease((tv - .9) / 1) };
      }, stepper);
      if (k === 27) mark('hush');
    }
    mark('cut');
  }

  // ---------- S2 · STORY (2.5 s): paper curtain opens on the sleeping planet; Pip shows tonight's letter.
  {
    await d.g(`state.stats.dates=[new Date().toISOString().slice(0,10)];state.daily=null;state.best=640;state.campaign.completed=['first-light'];showScreen('home');document.documentElement.classList.add('cine');pipRig.react('enter');`);
    await d.run(1200);
    await d.g(`pipRig.setReady(true);`);
    const pip = await d.g(`(()=>{const r=ui.pip.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
    for (let k = 0; k < 75; k++) {
      const tv = k / FPS;
      if (k === 22) await d.g(`pipRig.react('present')`);
      await capture(1000 / FPS, async () => ({
        cam: { z: lerp(1.08, 1.16, tv / 2.5), x: Math.min(205, (pip.x + 216) / 2), y: (pip.y + 384) / 2 },
        curtain: tv < .7 ? ease(tv / .7) : undefined,
        caps: [
          { id: 's2a', text: 'The night mail stopped.', cls: 'small', y: 96, o: Math.max(0, Math.min(1, (tv - .35) * 5, (1.35 - tv) * 6)), x: 0, s: .86, ls: 0 },
          { id: 's2b', text: 'Pip needs a pilot.', cls: 'gold', y: 92, o: Math.max(0, Math.min(1, (tv - 1.35) * 5)), s: back((tv - 1.35) / .3) * .3 + .7 },
        ], vignette: .5,
      }));
      if (k === 0) mark('curtain'); if (k === 22) mark('present');
    }
    await d.g(`document.documentElement.classList.remove('cine')`);
  }

  // ---------- S3 · ONE TAP (4 s): two taps and two clean passes; captions ride the orbit and flip on each tap.
  {
    const stepper = await startMaster(false); await fastForward(stepper, 2.85);
    let dir = 1, flipAt = -9, x1 = 0, x2 = 0; const ripples = [];
    for (let k = 0; k < 120; k++) {
      const tv = k / FPS;
      await capture(1000 / FPS, async ev => {
        for (const e of ev) if (e.type === 'tap') { dir = e.dir; flipAt = tv; ripples.push({ x: e.x, y: e.y, t: tv }); }
        const inf = await info(); dir = inf.dir;
        x1 = Math.max(-34, Math.min(34, x1 + dir * 1.4)); x2 = Math.max(-34, Math.min(34, x2 + dir * 1.4));
        const squash = tv - flipAt < .18 ? .7 + .3 * ease((tv - flipAt) / .18) : 1;
        return { caps: [
          { id: 's3a', text: 'One tap', y: 92, x: x1, sx: squash, o: Math.min(1, tv * 5) },
          { id: 's3b', text: 'shifts everything', cls: 'small gold', y: 148, x: -x2 * .6, sx: squash, o: Math.max(0, Math.min(1, (tv - 1.2) * 4)) },
        ], ripples: ripples.filter(r => tv - r.t < .6).map(r => ({ x: r.x, y: r.y, r: 14 + (tv - r.t) * 110, o: .9 * (1 - (tv - r.t) / .6) })), vignette: .45 };
      }, stepper);
    }
  }

  // ---------- S4 · HOLD (4 s): tuck for speed; the video itself speed-ramps with the glider.
  {
    await d.g(`startRun('endless');nextGate=999;nextHazard=999;__events.length=0;__resetWatch();`);
    await d.run(300);
    let fold = 0; const turnIn = 6;
    for (let k = 0; k < 120; k++) {
      const tv = k / FPS;
      if (k === 18) { await d.g(`holdStart=performance.now()-1000;holding=true;`); mark('holdOn'); }
      if (k === 92) { await d.g(`holding=false;`); mark('holdOff'); }
      const sp = 1 + .65 * fold;
      await capture(1000 / FPS * sp, async () => {
        const inf = await info(); fold = inf.fold;
        return { caps: [
          { id: 's4a', text: 'Hold', y: 92, ls: 2 + fold * 22, o: Math.min(1, tv * 5) },
          { id: 's4b', text: 'to fly faster', cls: 'small gold', y: 148, ls: 2 + fold * 10, o: Math.max(0, Math.min(1, (tv - .5) * 4)) },
        ], streaks: fold * .85, ripples: fold > .05 ? [{ x: inf.x, y: inf.y, r: 30 + Math.sin(tv * 20) * 3, o: .5 * fold }] : [],
          turn: k < turnIn ? 1 - k / turnIn : undefined, vignette: .45 };
      });
    }
  }

  // ---------- S5 · BUILD (3 x 2 s): page-turn cuts on the beat: Bloom, Ember heat gates, a Void comet.
  const word = (id, text, tv, cls) => ({ id, text, cls, y: 104, s: back(tv / .28) * .8 + .2, r: -4, o: Math.min(1, tv * 8) });
  const turnFrames = (k, n) => k < 8 ? 1 - k / 8 : k > n - 8 ? (k - (n - 8)) / 8 : undefined;
  {
    // Bloom with the natural planner (autopilot), around a gate crossing.
    await d.g(`state.campaign.completed=['first-light','pollen-path'];state.campaign.unlockedLevel=3;startRun('campaign','pollen-path');__pilot=true;__events.length=0;__resetWatch();`);
    await d.run(10300); await d.g('__events.length=0');
    for (let k = 0; k < 60; k++) { const tv = k / FPS; await capture(1000 / FPS, async () => ({ caps: [word('s5a', 'Thread.', tv)], turn: turnFrames(k, 60), vignette: .45 })); if (k === 0) mark('turn'); }
    await d.g('__pilot=false');
  }
  {
    await d.g(`state.campaign.completed=['first-light','pollen-path','tangled-orbit','crown-of-petals','kindling'];state.campaign.unlockedLevel=4;startRun('campaign','cinder-step');__pilot=true;__events.length=0;__resetWatch();`);
    await d.run(9800); await d.g('__events.length=0');
    for (let k = 0; k < 60; k++) { const tv = k / FPS; await capture(1000 / FPS, async () => ({ caps: [word('s5b', 'Feel the heat.', tv, 'gold')], turn: turnFrames(k, 60), vignette: .45 })); if (k === 0) mark('turn'); }
    await d.g('__pilot=false');
  }
  {
    await d.g(`startRun('endless');realInput=true;state.elapsed=76;nextGate=999;nextHazard=999;gates=[];__events.length=0;__resetWatch();`);
    await d.run(500); await d.g(`nextComet=0.01`);
    for (let k = 0; k < 60; k++) {
      const tv = k / FPS;
      if (k === 26) await tap();
      await capture(1000 / FPS, async () => ({ caps: [word('s5c', 'Dodge.', tv)], turn: k < 8 ? 1 - k / 8 : undefined, vignette: .45 }));
      if (k === 0) mark('turn');
    }
  }

  // ---------- S6 · PAYOFF (5 s): back to the gap; slow motion through the crossing; freeze + gold postmark; the planet blooms.
  {
    await trace('S6 pre'); const stepper = await startMaster(false); await trace('S6 start'); await fastForward(stepper, g6.el - .55); await trace('S6 ff');
    let freeze = -1, stampAt = -1, streak = 4, awakened = false;
    for (let k = 0; k < 150; k++) {
      const tv = k / FPS;
      const inFreeze = freeze >= 0 && tv - freeze < .55;
      let sp = tv < .25 ? .6 : freeze < 0 ? .16 : inFreeze ? 0 : 1;
      if (!awakened && freeze >= 0 && tv - freeze > 1.5) { awakened = true; await d.g(`state.elapsed=currentCampaignLevel().duration-.02`); mark('bloom'); }
      await capture(1000 / FPS * sp, async ev => {
        for (const e of ev) if (e.type === 'perfect' && freeze < 0) { freeze = tv; stampAt = tv; streak = e.n; mark('stamp'); }
        const zIn = freeze < 0 ? lerp(1.25, 1.6, ease(tv / 1.2)) : lerp(1.6, 1, ease((tv - freeze - .55) / .5));
        const st = stampAt >= 0 ? { o: Math.max(0, Math.min(1, (tv - stampAt) * 10, (stampAt + 1.6 - tv) * 3)), s: (1 - back((tv - stampAt) / .3)) * 1.4 + 1, r: -8, n: `×${streak}` } : null;
        return { cam: { z: zIn, x: lerp(216, g6.x, (zIn - 1) / .6 * .7), y: lerp(384, g6.y, (zIn - 1) / .6 * .7) },
          black: k < 3 ? 1 - k / 3 : 0, stamp: st, vignette: freeze >= 0 && inFreeze ? .9 : .5,
          caps: tv > 4.0 ? [{ id: 's6', text: 'Delivered.', cls: 'gold', y: 110, s: back((tv - 4.0) / .3) * .7 + .3, o: Math.min(1, (tv - 4) * 6) }] : [] };
      }, stepper);
    }
  }

  // ---------- S7 · WORLD (2.4 s + 1.6 s): the ship flies the trail to the next level; tonight's letter waits.
  {
    await d.g(`state.campaign.completed=['first-light','pollen-path'];state.campaign.unlockedLevel=3;state.campaign.ratings={'first-light':3,'pollen-path':2};chapterReveal={level:'pollen-path',unlocked:true,starsFrom:0};openChapter('bloom');document.documentElement.classList.add('cine');`);
    for (let k = 0; k < 72; k++) { const tv = k / FPS; await capture(1000 / FPS, async () => ({ caps: [{ id: 's7a', text: 'Wake the islands.', y: 84, s: back((tv - .2) / .3) * .5 + .35, o: Math.max(0, Math.min(1, (tv - .2) * 6)) }], turn: k < 8 ? 1 - k / 8 : undefined, vignette: .35 })); if (k === 0) mark('turn'); }
    await d.g(`document.documentElement.classList.remove('cine');state.daily=null;showScreen('mailbag');`);
    for (let k = 0; k < 48; k++) { const tv = k / FPS; await capture(1000 / FPS, async () => ({ caps: [{ id: 's7b', text: 'A new letter every night.', cls: 'small gold', y: 120, o: Math.min(1, tv * 5) }], vignette: .35 })); if (k === 0) mark('letter'); }
  }

  // ---------- S8 · END CARD (2 s).
  {
    await d.page.evaluate(() => window.endPipReact('present'));
    for (let k = 0; k < 60; k++) {
      const tv = k / FPS;
      await capture(1000 / FPS, async () => ({ end: { o: Math.min(1, tv * 5), fold: ease((tv - .15) / .5), tag: ease((tv - .7) / .3), store: ease((tv - 1.0) / .3), pipTick: 1 / FPS }, vignette: 0 }));
      if (k === 4) mark('logo');
    }
  }

  fs.writeFileSync(path.join(MODE === 'render' ? OUT : __dirname, 'events.json'), JSON.stringify({ fps: FPS, frames: frameNo, events }, null, 1));
  console.log('frames', frameNo, 'seconds', (frameNo / FPS).toFixed(2), 'errors', JSON.stringify(d.errors));
  console.log('key events', events.filter(e => ['perfect', 'gate', 'crash', 'letter'].includes(e.type)).map(e => `${e.type}${e.n !== undefined ? 'x' + e.n : ''}@${e.video.toFixed(2)}`).join(' '));
  await d.browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
