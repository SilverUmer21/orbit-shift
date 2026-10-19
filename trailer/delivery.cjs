// Orbit Shift · Trailer B "Special Delivery" (44.5 s, 1080x1920). Real gameplay on a virtual clock, framed as a letter
// Pip delivers to the viewer. Staged gates are real gates whose gap is shifted (measured in silent passes) so the game's
// own rules score the pass and the perfects. Usage:
//   node trailer/delivery.cjs measure      -> gate corrections (trailer/delivery-corrections.json)
//   node trailer/delivery.cjs render [out]  -> frames + events.json (default trailer/out-delivery); TRAILER_SCALE=1 previews
const fs = require('fs'), path = require('path');
const { openDirector } = require('./lib.cjs');
const FPS = 30, MODE = process.argv[2] || 'render', OUT = process.argv[3] || path.join(__dirname, 'out-delivery');
const CORR_FILE = path.join(__dirname, 'delivery-corrections.json');
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeOut = t => { t = clamp(t); return 1 - (1 - t) ** 3; };
const back = (t, c = 1.6) => { t = clamp(t); return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; };
const lerp = (a, b, t) => a + (b - a) * t;

// Scene lengths in seconds (sum 44.5).
const LEN = { open: 3.5, home: 4.0, take: 13.5, hold: 4.5, reward: 5.5, hangar: 4.5, mail: 5.0, end: 4.0 };

// The core take (First Light): staged gates [id, spawn el, want] and taps (run seconds). Slow motion from TAKE.slow.
const TAKE = {
  setup: `state.tutorialSeen=true;state.campaign.completed=[];state.campaign.unlockedLevel=1;startRun('campaign','first-light');campaignGateIndex=1e9;campaignFragmentIndex=1e9;dailyRandom=seededRandom(4242);`,
  gates: [['gA', 1.25, 'pass'], ['gB', 3.65, 'perfect'], ['gC', 5.15, 'perfect']],
  taps: [1.0, 2.3, 4.55],
  slow: 9.6,
};
const PERFECT_CLEAR = .035; // radians of clearance left at the graze (perfect window is .145)

async function main() {
  const d = await openDirector({ scale: MODE === 'render' ? Number(process.env.TRAILER_SCALE || 2.5) : 1, director: 'delivery.html' });
  await d.page.evaluate(() => window.preload());
  await d.run(600);
  await d.g(`window.__state0 = JSON.stringify(state)`);
  await d.g(`window.__cross = {}; const orig = resolveGate; window.resolveGate = function(gate, ca = player.angle, cg = gate.gap) {
    if (gate.__tag) { const p = playerPoint(); __cross[gate.__tag] = { ca, cg, dir: player.direction, opening: gate.opening, el: state.elapsed, x: p.x, y: p.y }; }
    return orig.apply(this, arguments); };`);
  await d.g(`document.head.insertAdjacentHTML('beforeend','<style>.cine-home .home .home-top{visibility:hidden!important}.cine-noact #actLabel{visibility:hidden!important}</style>')`);

  let corr = fs.existsSync(CORR_FILE) ? JSON.parse(fs.readFileSync(CORR_FILE, 'utf8')) : {};
  const events = []; let videoT = 0, frameNo = 0, lastShot = null;
  if (MODE === 'render') fs.mkdirSync(OUT, { recursive: true });

  function takeStepper() {
    let gi = 0, ti = 0;
    return async (ms) => {
      const el = await d.g('state.mode==="run"?state.elapsed:-1');
      if (el >= 0 && gi < TAKE.gates.length && TAKE.gates[gi][1] <= el + 1e-4) {
        const [id] = TAKE.gates[gi];
        const ok = await d.g(`(()=>{const n=gates.length;if(!spawnGate()||gates.length===n)return false;const g=gates[gates.length-1];g.__tag='${id}';g.letter=0;g.gap=normalize(g.gap+(${corr[id] || 0}));return true;})()`);
        if (ok) gi++;
      }
      if (el >= 0 && ti < TAKE.taps.length && TAKE.taps[ti] <= el + 1e-4) { ti++; await tap(); }
      await d.step(ms);
      await d.g(`if(state.mode==="run")state.elapsed=Math.round(state.elapsed*1e6)/1e6`);
    };
  }
  async function tap() { return d.g(`(()=>{lastReverse=-1e9;const ok=reverse();const p=playerPoint();if(ok)__log('tap',{x:p.x,y:p.y,dir:player.direction});return ok})()`); }
  async function startTake(measure) {
    await d.g(`{const s0=JSON.parse(__state0);for(const k of Object.keys(state))if(!(k in s0))delete state[k];Object.assign(state,s0);}`);
    await d.g(TAKE.setup + `__events.length=0;__resetWatch();__pilot=false;window.__cross={};state.invulnerable=${measure ? 999 : 0};`);
    return takeStepper();
  }
  async function fastForward(stepper, toEl) { for (let guard = 0; guard < 6000; guard++) { const el = await d.g('state.elapsed'); if (el >= toEl - 1e-6) break; await stepper(1000 / 60); } }

  if (MODE === 'measure') {
    corr = {};
    for (let pass = 0; pass < TAKE.gates.length + 4; pass++) {
      const stepper = await startTake(true);
      await fastForward(stepper, 11.5);
      const cross = await d.g('__cross'); let changed = false;
      for (const [id, , want] of TAKE.gates) {
        const c = cross[id]; if (!c) { console.log('pass', pass, 'missing', id); changed = true; continue; }
        const half = c.opening / 2 - .105, dist = want === 'perfect' ? half - PERFECT_CLEAR : 0;
        const target = c.ca - c.dir * dist;
        const delta = ((target - c.cg + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        if (Math.abs(delta) > .002) { corr[id] = (corr[id] || 0) + delta; changed = true; }
      }
      console.log('pass', pass, JSON.stringify(Object.fromEntries(Object.entries(corr).map(([k, v]) => [k, +v.toFixed(3)]))), Object.entries(cross).map(([k, c]) => `${k}@${c.el.toFixed(2)}`).join(' '));
      if (!changed) break;
    }
    const stepper = await startTake(false); await fastForward(stepper, 11.5);
    const ev = await d.g('__events'), cross = await d.g('__cross');
    console.log('verify:', ev.map(e => `${e.type}${e.n !== undefined ? 'x' + e.n : ''}@${e.el.toFixed(2)}`).join(' '));
    fs.writeFileSync(CORR_FILE, JSON.stringify({ ...corr, __cross: cross }, null, 1));
    await d.browser.close(); return;
  }

  const X = corr.__cross || {};
  const info = () => d.g(`(()=>{const p=playerPoint();return {el:state.elapsed,mode:state.mode,x:p.x,y:p.y,a:player.angle,dir:player.direction,fold:player.fold,streak:state.streak,
    gates:gates.filter(g=>g.__tag).map(g=>({id:g.__tag,r:g.radius,gap:g.gap,open:g.opening,rot:g.rotation||0,speed:g.speed,resolved:g.resolved}))}})()`);

  // One video frame: advance the game by gameMs (<=1/60 s substeps), render the overlay, shoot.
  async function capture(gameMs, overlay, stepper) {
    let left = gameMs;
    while (left > 1e-6) { const ms = Math.min(1000 / 60, left); await (stepper ? stepper(ms) : d.step(ms)); left -= ms; }
    const ev = await d.g('__events.splice(0)'); for (const e of ev) events.push({ ...e, video: videoT });
    const s = await overlay(ev);
    s.t = videoT;
    await d.page.evaluate(st => window.render(st), s);
    const buf = await d.page.screenshot({ type: 'jpeg', quality: 92 });
    lastShot = buf;
    if (MODE === 'render') fs.writeFileSync(path.join(OUT, `f${String(frameNo).padStart(4, '0')}.jpg`), buf);
    frameNo++; videoT += 1 / FPS;
  }
  const still = () => 'data:image/jpeg;base64,' + lastShot.toString('base64');
  const mark = (type, extra) => events.push({ type, video: videoT, ...extra });
  const frames = sec => Math.round(sec * FPS);
  // Captions: entries sharing an id are one tag that flips between lines.
  function capsAt(tv, list) {
    const out = [];
    for (const id of [...new Set(list.map(c => c.id))]) {
      const items = list.filter(c => c.id === id), first = items[0], last = items[items.length - 1];
      if (tv < first.from || tv > last.to) continue;
      const cur = [...items].reverse().find(c => tv >= c.from) || first;
      out.push({ id, text: cur.text, y: cur.y, x: cur.x || 0, s: cur.s ?? 1, age: tv - first.from, left: last.keep ? 9 : last.to - tv });
    }
    return out;
  }
  const capMarks = new Set();
  function markCaps(tv, list) { for (const c of list) if (tv >= c.from && !capMarks.has(c)) { capMarks.add(c); mark('tag'); } }
  // Fingertip presses: anticipation before the tap, release after; dashed ripples from the fingertip.
  function press(tv, taps) {
    let p = 0; const ripples = [];
    for (const T of taps) {
      if (tv >= T - .12 && tv < T) p = Math.max(p, ease((tv - (T - .12)) / .12));
      else if (tv >= T && tv < T + .24) p = Math.max(p, 1 - ease((tv - T) / .24));
      if (tv >= T && tv - T < .6) ripples.push({ r: 10 + (tv - T) * 85, o: .9 * (1 - (tv - T) / .6) });
    }
    return { press: p, ripples };
  }

  // ---------- S1 · SPECIAL DELIVERY (3.5 s): the envelope settles, Pip taps the seal, the letter unfolds into Home.
  await d.g(`state.tutorialSeen=true;state.campaign.completed=[];state.best=0;state.stars=0;state.daily=null;showScreen('home');document.documentElement.classList.add('cine-home');`);
  await d.run(1500);
  await d.g(`pipRig.setReady(true)`);
  await d.page.evaluate(() => window.render({ t: 0, vignette: .45 }));
  lastShot = await d.page.screenshot({ type: 'jpeg', quality: 92 });
  {
    const img = still(), n = frames(LEN.open);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      await capture(0, async () => {
        const drop = back(tv / .8, 1.2), fall = ease((tv - 2.55) / .8);
        const env = { x: 0, y: lerp(-420, 0, drop) + fall * 620, rot: lerp(-14, -3, drop) + fall * 10, o: 1 - ease((tv - 2.9) / .4),
          flap: tv < 1.5 ? 1 : Math.cos(Math.PI * ease((tv - 1.5) / .5)), seal: clamp((tv - 1.42) / .55), glow: tv > .8 && tv < 1.42 ? .5 + .5 * Math.sin((tv - .8) * 12) : 0 };
        // Pip: flies in to the envelope's corner, swoops to the seal and taps it, then lifts away.
        let px, py, pr = 0;
        if (tv < 1.05) { const u = easeOut((tv - .2) / .85); px = lerp(520, 352, u); py = lerp(170, 262, u) + Math.sin(u * Math.PI) * -40; pr = lerp(14, 0, u); }
        else if (tv < 1.38) { const u = ease((tv - 1.05) / .33); px = lerp(352, 268, u); py = lerp(262, 372, u); pr = -12 * u; }
        else { const u = easeOut((tv - 1.5) / .9); px = lerp(268, 470, u); py = lerp(372, 120, u); pr = lerp(-12, 18, u); }
        const pip = { x: px, y: py + env.y * (tv < 1.5 ? 1 : 0), rot: pr, o: tv < .2 ? 0 : 1 - ease((tv - 2.2) / .3), react: k === frames(1.12) ? 'tap' : k === frames(.3) ? 'enter' : undefined };
        // The letter: inside, slides up and out, comes forward, unfolds (bottom, then top) and grows to the frame.
        let letter = null;
        if (tv >= 1.75) {
          const rise = ease((tv - 1.95) / .6), grow = ease((tv - 2.95) / .55);
          letter = { img, slot: tv < 2.5 ? 'in' : 'top', x: 216, y: lerp(lerp(410, 216, rise), 384, grow), s: lerp(.5, 1, grow),
            bot: ease((tv - 2.55) / .35), top: ease((tv - 2.72) / .35), edge: 1 - grow, rot: lerp(-3, 0, ease((tv - 2.4) / .6)) };
        }
        return { bg: 1 - ease((tv - 3.25) / .25), hideGame: true, vignette: 0, ring: { y: 410, rx: 205, ry: 74, o: 1 - fall }, env: { ...env, pip, letter } };
      });
      if (k === frames(.55)) mark('envIn'); if (k === frames(1.42)) mark('seal'); if (k === frames(1.5)) mark('flap');
      if (k === frames(1.95)) mark('letterOut'); if (k === frames(2.55)) mark('unfold');
    }
  }

  // ---------- S2 · PREMISE (4.0 s): first-launch Home; the night mail stopped; Pip holds up his letter; PLAY.
  {
    const caps = [{ id: 'h', text: 'The night mail|stopped.', y: 14, s: .84, from: .25, to: 2.2 }, { id: 'h', text: 'Pip needs|a *pilot*.', y: 14, s: .84, from: 2.2, to: 3.85 }];
    const playAt = 3.45, n = frames(LEN.home);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (k === frames(.4)) await d.g(`pipRig.react('present')`);
      if (k === frames(playAt - .05)) await d.g(`document.querySelector('#play').style.transform='translateY(5px)'`);
      markCaps(tv, caps);
      await capture(1000 / FPS, async () => {
        const pr = press(tv, [playAt]), inn = easeOut((tv - 2.55) / .45);
        return { vignette: .45, cam: { z: lerp(1, 1.03, ease(tv / 4)), x: 216, y: 400 }, caps: capsAt(tv, caps),
          hand: tv > 2.5 ? { o: 1, x: 236, y: lerp(830, 702, inn), press: pr.press, ripples: pr.ripples, rot: -8 } : null };
      });
      if (k === frames(playAt)) mark('press');
    }
    await d.g(`document.querySelector('#play').style.transform='';document.documentElement.classList.remove('cine-home')`);
  }

  // ---------- S3 · THE TAKE (13.5 s): tap to turn, fly through the gap, graze the edge; slow motion; gold postmark.
  {
    const homeStill = still();
    const stepper = await startTake(false);
    await d.g(`document.documentElement.classList.add('cine-noact')`);
    const caps = [
      { id: 'k', text: '*Tap* to turn', y: 108, from: .45, to: 3.4 },
      { id: 'k', text: 'Fly through|the *gap*', y: 108, from: 3.4, to: 7.0 },
      { id: 'k', text: 'Graze the *edge*', y: 108, from: 7.0, to: LEN.take, keep: true },
    ];
    const gA = X.gA || { el: 6, ca: 1, cg: 1, dir: 1, opening: 1.72 }, gB = X.gB || { el: 8.4, ca: 2, cg: 2, dir: 1, opening: 1.72 }, gC = X.gC || { el: 9.95, ca: 3, cg: 3, dir: 1, opening: 1.72, x: 216, y: 300 };
    const tapsV = TAKE.taps; // 1x until the slow motion, so run seconds = take seconds here
    const edgeOf = g => { const side = Math.sign(((g.ca - g.cg + Math.PI * 3) % (Math.PI * 2)) - Math.PI) || 1; return { a: g.cg + side * g.opening / 2, side }; };
    let el = 0, freezeAt = -1, perfectN = 2, passFlash = -1, slowFrom = -1;
    const n = frames(LEN.take);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (slowFrom < 0 && el >= TAKE.slow - 1e-6) { slowFrom = tv; mark('slow'); }
      const sp = slowFrom < 0 ? 1 : freezeAt < 0 ? .2 : tv - freezeAt < .5 ? 0 : .45;
      markCaps(tv, caps);
      await capture(1000 / FPS * sp, async ev => {
        for (const e of ev) {
          if (e.type === 'perfect' && e.n >= 2 && freezeAt < 0 && slowFrom >= 0) { freezeAt = tv; perfectN = e.n; mark('freeze'); mark('stamp'); }
          if (e.type === 'gate' && e.n === 1) passFlash = tv;
        }
        const inf = await info(); el = inf.el;
        const ripples = events.filter(e => e.type === 'tap' && e.video > videoT - .7 && e.video <= videoT).map(e => ({ x: e.x, y: e.y, r: 14 + (videoT - e.video) * 80, o: .85 * (1 - (videoT - e.video) / .7) }));
        // Direction arrow: retracts just before a tap and regrows in the new direction after it.
        let len = ease((tv - .45) / .35);
        for (const T of tapsV) { if (tv >= T - .08 && tv < T) len = Math.min(len, (T - tv) / .08); else if (tv >= T && tv < T + .38) len = Math.min(len, back((tv - T - .06) / .32)); }
        const arrowO = 1 - ease((tv - 5.6) / .4);
        // Landing zone for gate A: the safe span of its gap where it will meet the orbit, plus guides from the gap edges.
        let zone = null; const ga = inf.gates.find(g => g.id === 'gA');
        if (tv > 3.3 && (ga && !ga.resolved || passFlash >= 0 && tv - passFlash < .45)) {
          const g = ga || { r: 162, gap: gA.cg, open: gA.opening, rot: 0, speed: 1 };
          const ahead = g.resolved ? 0 : Math.max(0, g.r - 162) / Math.max(1, g.speed) * g.rot, cg = g.gap + ahead, half = g.open / 2 - .105;
          zone = { a0: cg - half, a1: cg + half, g0: g.gap - g.open / 2, g1: g.gap + g.open / 2, r: g.r, o: ease((tv - 3.3) / .3) * (passFlash >= 0 ? 1 - ease((tv - passFlash) / .45) : 1), flash: passFlash >= 0 ? 1 - clamp((tv - passFlash) / .45) : 0 };
        }
        // Edge glints for the two perfects.
        let glint = null;
        for (const [id, gx, from] of [['gB', gB, 7.0], ['gC', gC, 8.75]]) {
          const g = inf.gates.find(q => q.id === id);
          if (g && !g.resolved && tv > from) { const e = edgeOf(gx); glint = { a: g.gap + (e.a - gx.cg), r: g.r, side: e.side, o: ease((tv - from) / .3), s: 1 }; }
        }
        const pr = press(tv, tapsV.map(T => T)), handIn = easeOut((tv - .2) / .4), handOut = ease((tv - 5.0) / .35);
        const hand = tv < 5.4 ? { o: 1, x: 216, y: lerp(840, 690, handIn) + handOut * 160, press: pr.press, ripples: pr.ripples } : null;
        // Camera: steady, then a slow push toward gate C's crossing for the slow-motion graze.
        const push = ease((tv - 8.6) / 1.6), relax = freezeAt >= 0 ? ease((tv - freezeAt - .6) / .9) : 0, z = 1 + .55 * push - .2 * relax;
        const fx = lerp(216, gC.x ?? 216, .8 * push * (1 - relax * .5)), fy = lerp(384, gC.y ?? 300, .8 * push * (1 - relax * .5));
        const st = freezeAt >= 0 ? { o: clamp(Math.min((tv - freezeAt) * 9, 1)), s: (1 - back((tv - freezeAt) / .32, 2.2)) * 1.3 + 1, r: -9, n: `×${perfectN}`, x: 216, y: 578 } : null;
        return { vignette: freezeAt >= 0 && tv - freezeAt < .5 ? .85 : slowFrom >= 0 ? .62 : .45, cam: { z, x: fx, y: fy }, hud: 1 - push * (1 - relax), caps: capsAt(tv, caps), hand, postmark: st,
          annot: { arrow: { a: inf.a, dir: inf.dir, len, o: arrowO }, zone, glint, ripples },
          freeze: tv < .5 ? { type: 'dissolve', img: homeStill, p: tv / .5 } : null };
      }, stepper);
      if (k === 0) mark('dissolve');
    }
  }

  // ---------- S4 · HOLD (4.5 s): Ember. Tap-and-hold tucks the glider; the video speed-ramps with it.
  {
    const takeStill = still();
    await d.g(`state.campaign.completed=['first-light','pollen-path','tangled-orbit','crown-of-petals'];state.campaign.unlockedLevel=4;state.unlocked=['bloom','ember','void'];startRun('campaign','kindling');campaignGateIndex=1e9;campaignFragmentIndex=1e9;nextHazard=999;__events.length=0;__resetWatch();document.documentElement.classList.add('cine-noact');`);
    await d.run(2600); await d.g('__events.length=0');
    const caps = [{ id: 'o', text: '*Hold* to fly faster', y: 108, from: .55, to: LEN.hold - .05 }];
    const holdOn = 1.15, holdOff = 3.75; let fold = 0;
    const n = frames(LEN.hold);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (k === frames(holdOn)) { await tap(); await d.g(`holdStart=performance.now();holding=true;`); mark('holdOn'); }
      if (k === frames(holdOff)) { await d.g(`holding=false;`); mark('holdOff'); }
      markCaps(tv, caps);
      const sp = 1 + .5 * fold;
      await capture(1000 / FPS * sp, async () => {
        const inf = await info(); fold = inf.fold;
        const down = tv >= holdOn - .12 && tv < holdOff + .2 ? (tv < holdOn ? ease((tv - holdOn + .12) / .12) : tv < holdOff ? 1 : 1 - ease((tv - holdOff) / .2)) : 0;
        const handIn = easeOut((tv - .5) / .4), handOut = ease((tv - 4.0) / .35);
        return { vignette: .45, caps: capsAt(tv, caps), streaks: fold * .75,
          hand: { o: 1, x: 216, y: lerp(840, 690, handIn) + handOut * 170, press: down, ring: tv >= holdOn ? clamp((tv - holdOn) / .55) * (tv < holdOff ? 1 : 1 - clamp((tv - holdOff) / .2)) : null, spin: tv,
            ripples: tv >= holdOn && tv - holdOn < .6 ? [{ r: 10 + (tv - holdOn) * 85, o: .9 * (1 - (tv - holdOn) / .6) }] : [] },
          annot: { ripples: fold > .05 ? [{ x: inf.x, y: inf.y, r: 28 + Math.sin(tv * 18) * 3, o: .45 * fold, c: '#FFC94D' }] : [] },
          freeze: tv < .75 ? { type: 'fold', img: takeStill, p: tv / .75, toY: -620 } : null };
      });
      if (k === 0) mark('fold');
    }
    await d.g(`document.documentElement.classList.remove('cine-noact')`);
  }

  // ---------- S5 · REWARDS (5.5 s): the furnace lights, LEVEL CLEAR! with stars, then a NEW TRAIL! card.
  {
    await d.g(`state.best=0;state.score=1240;state.runFragments=3;state.perfects=2;state.runBestStreak=4;state.elapsed=currentCampaignLevel().duration-.02;__resetWatch();__events.length=0;`);
    const caps = [{ id: 'r', text: 'Earn *stars*|& rewards', y: 652, s: .9, from: 1.55, to: LEN.reward - .05 }];
    let resultsAt = -1, cardAt = -1;
    const n = frames(LEN.reward);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (k === 1) { mark('awaken'); }
      if (resultsAt < 0 && tv >= 1.3) {
        await d.g(`if(awakening){finishAwakening()};ui.rewardSeal.hidden=true;startStarTally();`); resultsAt = tv; mark('results');
      }
      if (cardAt < 0 && tv >= 3.45) { await d.g(`renderRewardSeal(0)`); cardAt = tv; mark('card'); }
      markCaps(tv, caps);
      await capture(1000 / FPS, async () => ({ vignette: .3, caps: capsAt(tv, caps) }));
    }
  }

  // ---------- S6 · HANGAR (4.5 s): preview the Crescent, tap again to buy: the unfold, NEW postmark, confetti.
  {
    const rewardStill = still();
    await d.g(`state.stars=180;state.ownedRiders=['manta'];state.selectedRider='manta';hangarTab='planes';purchasePreview=null;showScreen('garage');`);
    await d.run(300);
    const slot = await d.g(`(()=>{const b=[...ui.riderGrid.querySelectorAll('.slot')][2].getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
    const caps = [{ id: 'g', text: 'Collect planes|& trails', y: 652, s: .9, from: .6, to: LEN.hangar - .05 }];
    const taps = [1.45, 2.55];
    const n = frames(LEN.hangar);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (k === frames(taps[0])) { await d.g(`pickHangar('planes','crescent')`); mark('pick'); }
      if (k === frames(taps[1])) { await d.g(`pickHangar('planes','crescent')`); mark('buy'); }
      markCaps(tv, caps);
      await capture(1000 / FPS, async () => {
        const pr = press(tv, taps), inn = easeOut((tv - .85) / .45), out = ease((tv - 2.9) / .4);
        return { vignette: .25, caps: capsAt(tv, caps),
          hand: tv > .8 && tv < 3.4 ? { o: 1, x: slot.x + 6, y: lerp(860, slot.y + 4, inn) + out * 300, press: pr.press, ripples: pr.ripples, rot: -10 } : null,
          freeze: tv < .7 ? { type: 'card', img: rewardStill, p: tv / .7 } : null };
      });
      if (k === 0) mark('slide');
    }
  }

  // ---------- S7 · NIGHT POST (5.0 s): Tonight's Letter, then postcards from the islanders; one turns over.
  {
    const hangarStill = still();
    await d.g(`state.daily=null;state.nightPostExtras=true;for(const id of ['first-light','kindling'])state.post.cards[id]={night:nightNumber(),read:false};mailTab='tonight';cardView=null;showScreen('mailbag');`);
    await d.run(300);
    const tab = await d.g(`(()=>{const b=document.querySelector('[data-mail="cards"]').getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
    const caps = [{ id: 'm', text: 'A new letter|every *night*', y: 652, s: .9, from: .6, to: 2.55 }, { id: 'm', text: 'Postcards from|the *islands*', y: 652, s: .9, from: 2.55, to: LEN.mail - .05 }];
    const tapTab = 2.25, flipAt = 3.55;
    const n = frames(LEN.mail);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      if (k === frames(tapTab)) { await d.g(`document.querySelector('[data-mail="cards"]').click()`); mark('mailTab'); }
      if (k === frames(flipAt)) { await d.g(`ui.postcard.click()`); mark('cardFlip'); }
      markCaps(tv, caps);
      await capture(1000 / FPS, async () => {
        const pr = press(tv, [tapTab]), inn = easeOut((tv - 1.5) / .45), out = ease((tv - 2.6) / .4);
        return { vignette: .25, caps: capsAt(tv, caps),
          hand: tv > 1.45 && tv < 3.1 ? { o: 1, x: tab.x + 4, y: lerp(860, tab.y + 2, inn) + out * 700, press: pr.press, ripples: pr.ripples, rot: -10 } : null,
          freeze: tv < .7 ? { type: 'card', img: hangarStill, p: tv / .7 } : null };
      });
      if (k === 0) mark('slide');
    }
  }

  // ---------- S8 · END CARD (4.0 s): the letter folds and flies up to Pip; logo, tagline, store line.
  {
    const mailStill = still();
    const caps = [{ id: 'e', text: 'One tap.|Deliver the *night*.', y: 470, s: .92, from: 1.3, to: LEN.end, keep: true }];
    const n = frames(LEN.end);
    for (let k = 0; k < n; k++) {
      const tv = k / FPS;
      markCaps(tv, caps);
      await capture(0, async () => ({ bg: 1, hideGame: true, vignette: 0, caps: capsAt(tv, caps),
        end: { o: 1, t: tv, react: k === frames(.6) ? 'present' : undefined },
        freeze: tv < .85 ? { type: 'fold', img: mailStill, p: tv / .85, toY: -210, rot: -4, sc: .2, glide: true } : null }));
      if (k === 0) mark('fold'); if (k === frames(.8)) mark('logo');
    }
  }

  fs.writeFileSync(path.join(MODE === 'render' ? OUT : __dirname, 'events.json'), JSON.stringify({ fps: FPS, frames: frameNo, events }, null, 1));
  console.log('frames', frameNo, 'seconds', (frameNo / FPS).toFixed(2), 'errors', JSON.stringify(d.errors));
  console.log('key events', events.filter(e => ['perfect', 'gate', 'crash', 'letter', 'tap'].includes(e.type)).map(e => `${e.type}${e.n !== undefined ? 'x' + e.n : ''}@${e.video.toFixed(2)}`).join(' '));
  await d.browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
