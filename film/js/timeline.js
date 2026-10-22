// Fly Them Home · the edit. frame(t) draws film second t (60 fps, called in order) into the comp and glow layers, then
// the post pass. Story scenes are functions of t; gameplay comes from the real game through Game shots.
(() => {
  const { TAU, clamp, lerp, inv, ease, easeOut, easeIn, easeInOut, expoOut, back, spring, pulse, C, rgba, mix, rng, canvas, setFont } = FT;
  const A = FilmArt, S = Sky, T = FilmType, GB = Game;
  const W = 1920, H = 1080, FPS = 60;
  const F = { cues: [] };
  let out, comp, g, glow, G, post, prev, bgC, bgBlur, bgG, snap = null, snapAt = -1;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const cue = (type, t, data = {}) => F.cues.push({ type, t: +t.toFixed(4), ...data });

  // ---------------------------------------------------------------- shots (film seconds)
  const LETTER = { W: A.LW, H: A.LH };
  const shots = {
    bloom: {
      id: "bloom", seed: 11, t0: 19.6, t1: 27.0, preroll: 3.5,
      setup: `state.campaign.completed=['first-light'];state.campaign.unlockedLevel=2;state.selectedRider='manta';state.selectedTrail='paper';
        startRun('campaign','pollen-path');campaignGateIndex=1e9;campaignFragmentIndex=1e9;campaignHazardIndex=1e9;nextGate=1e9;`,
      taps: [20.0, 21.5, 22.5, 24.0, 25.0],
      gates: [{ id: "b1", cross: 21.0, want: "pass" }, { id: "b2", cross: 22.0, want: "perfect", generous: true }, { id: "b3", cross: 23.5, want: "perfect", letter: true }, { id: "b4", cross: 24.5, want: "perfect" }],
      // The planet blooms (the game's own awakening); its text stars are left out so the film's type carries the words.
      actions: [{ at: 25.5, code: `state.elapsed=currentCampaignLevel().duration-.01;`, event: "bloom" }, { at: 25.55, code: `if(awakening)awakening.rating=0;` }],
    },
    ember: {
      id: "ember", seed: 21, t0: 27.0, t1: 34.0, preroll: 3.5,
      setup: `state.campaign.completed=['first-light','pollen-path','tangled-orbit','crown-of-petals','kindling'];state.campaign.unlockedLevel=4;state.selectedRider='manta';state.selectedTrail='spark';
        startRun('campaign','cinder-step');campaignGateIndex=1e9;campaignFragmentIndex=1e9;campaignHazardIndex=1e9;nextGate=1e9;`,
      taps: [28.5, 30.0, 31.0, 32.0, 33.0],
      holds: [[27.55, 29.75]],
      speed: t => 1 + .5 * (ease(seg(t, 27.75, 28.1)) - ease(seg(t, 29.75, 30.0))),
      gates: [{ id: "e1", cross: 29.0, want: "pass", heat: true }, { id: "e2", cross: 30.5, want: "perfect", heat: false }, { id: "e3", cross: 31.5, want: "perfect", fever: true, heat: true }, { id: "e4", cross: 32.5, want: "perfect", heat: false }, { id: "e5", cross: 33.5, want: "perfect", heat: true }],
    },
    void: {
      id: "void", seed: 31, t0: 34.0, t1: 45.0, preroll: 3.5,
      setup: `state.selected='void';state.selectedRider='manta';state.selectedTrail='paper';startRun('endless');state.elapsed=78;updateJourney(true);nextGate=1e9;nextHazard=1e9;nextComet=1e9;`,
      taps: [36.0, 38.0, 39.0, 40.0, 40.5, 41.0, 41.5, 42.0, 42.5],
      speed: t => {
        const comet = 1 - .72 * pulse(t, 36.55, 37.6) ** .5;
        const last = t < 43 ? 1 : lerp(1, .1, easeOut(seg(t, 43.0, 43.6)));
        return comet * last;
      },
      comets: [{ at: 35.0, miss: .2 }],
      gates: [{ id: "v1", cross: 38.5, want: "perfect", letter: true }, { id: "v2", cross: 39.5, want: "perfect" }, { id: "L", cross: 44.25, want: "perfect" }],
      actions: [
        ...["dart", "crescent", "splitwing", "shuttle", "ringsail", "manta"].map((r, i) => ({ at: 40 + i * .5, code: `state.selectedRider='${r}';state.selected='${["bloom", "ember", "void", "wax", "ember", "bloom"][i]}';state.selectedTrail='${["pollen", "spark", "ribbon", "echo", "crown", "paper"][i]}';player.glow=1;`, event: "swap", data: { rider: r, i } })),
        { at: 42.8, code: `window.__dpr=6;dispatchEvent(new Event('resize'));` },
      ],
    },
  };
  F.shots = shots;

  // ---------------------------------------------------------------- setup
  F.init = async () => {
    out = document.getElementById("out");
    comp = canvas(W, H); g = comp.getContext("2d");
    glow = canvas(W / 2, H / 2); G = glow.getContext("2d");
    prev = canvas(W, H); bgC = canvas(W / 2, H / 2); bgBlur = canvas(W / 2, H / 2); bgG = canvas(W / 4, H / 4).getContext("2d");
    await document.fonts.load('400 100px "Lilita One"'); await document.fonts.load('800 60px "Nunito"'); await document.fonts.load('900 60px "Nunito"');
    await A.init(); await S.load(); await GB.init();
    F.W = GB.eval("window"); F.rider = n => GB.eval(`riders.find(r=>r.id==='${n}')`); F.palette = n => GB.eval(`cosmetics.find(c=>c.id==='${n}')`);
    post = FilmPost.create(out, comp, glow);
    F._layers = { comp, glow };
    try { GB.corr = await (await fetch("corrections.json", { cache: "no-store" })).json(); } catch (e) { GB.corr = {}; }
    F.layout = T.logoLayout(g, W / 2, 360, 250);
    buildFolds();
    storyCues();
  };

  // ---------------------------------------------------------------- the letter's folds (Pip folds it into the glider)
  let sheet, unfoldSheet, blackSheet;
  function buildFolds() {
    const w = LETTER.W, h = LETTER.H, r2 = Math.SQRT1_2;
    sheet = Fold.sheet(w, h, A.frontDone, A.backSealed);
    sheet.addFold([w / 2 - h / 2, -h / 2], [-r2, -r2]);
    sheet.addFold([w / 2 - h / 2, h / 2], [r2, -r2]);
    sheet.addFold([0, 0], [-1, 0]);
  }
  function pageSheet(front, backTone) {
    const back = canvas(W / 2, H / 2), b = back.getContext("2d");
    b.fillStyle = backTone; b.fillRect(0, 0, W / 2, H / 2);
    b.globalCompositeOperation = "overlay"; b.globalAlpha = .5; b.fillStyle = b.createPattern(A.fibre, "repeat"); b.fillRect(0, 0, W / 2, H / 2);
    const s = Fold.sheet(W, H, front, back);
    s.addFold([0, 0], [0, -1]);
    s.addFold([0, 0], [1, 0]);
    return s;
  }
  // A full-frame page that folds in half twice and flies off (p 0..1 over ~0.6 s).
  function foldAway(page, p, crease) {
    const a1 = Math.PI * easeInOut(seg(p, 0, .38)), a2 = Math.PI * easeInOut(seg(p, .34, .72)), fly = easeIn(seg(p, .7, 1));
    if (fly >= 1) return;
    g.save(); g.translate(W / 2 - fly * 900, H / 2 - fly * 700); g.rotate(-fly * .5); g.scale(1 - fly * .5, 1 - fly * .5);
    page.draw(g, [a1, a2], { shadow: .5, crease, edge: "rgba(168,240,207,.35)" });
    g.restore();
  }
  function creaseGlint(color = "#ffe3a0") {
    return (a, u, th) => {
      const k = Math.sin(th); if (k < .05) return;
      for (const c of [g, G]) { c.save(); c.globalAlpha = k * (c === G ? .9 : .7); c.strokeStyle = color; c.lineWidth = c === G ? 10 : 3; c.beginPath(); c.moveTo(a[0] - u[0] * 1400, a[1] - u[1] * 1400); c.lineTo(a[0] + u[0] * 1400, a[1] + u[1] * 1400); c.stroke(); c.restore(); }
    };
  }

  // ---------------------------------------------------------------- story cues for the score (static, frame exact)
  function storyCues() {
    for (const p of A.wm.px) cue("pixel", .22 + p.d * 1.3 + .125, { p: p.p });
    cue("wmSolid", 1.36); cue("wmGlow", 1.35); cue("emberDrop", 2.15); cue("seal", 3.0); cue("sealPress", 3.1);
    cue("flip", 3.55); cue("write", 3.95); cue("pageFold", 4.4); cue("pageFold", 4.74); cue("pageFly", 5.0);
    cue("line1", 5.7); cue("starGlint", 7.25); cue("tilt", 8.8); cue("snore", 10.6); cue("snore", 12.2);
    cue("pipEnter", 12.75); cue("catch", 14.3); [15, 15.5, 16, 16.5].forEach(t => cue("crease", t)); cue("pop", 16.95); cue("ready", 17.0);
    cue("launch", 18.0); cue("whip", 19.45); cue("drop", 20.0);
    cue("pageFold", 27.0); cue("pageFold", 27.2); cue("pageFold", 34.0); cue("pageFold", 34.2);
    cue("hush", 43.0); cue("flash", 44.85); cue("unpop", 45.35); [45.55, 45.75, 45.95].forEach(t => cue("uncrease", t));
    cue("slip", 46.1); cue("wake", 46.6); cue("curtain", 47.0); cue("moonrise", 47.5); cue("threads", 47.9); cue("islands", 48.4); cue("line2", 48.4);
    cue("orbitDraw", 50.0); [51.0, 51.25, 51.5, 51.75].forEach((t, i) => cue("letterPop", t, { i })); cue("shift", 52.0); cue("glint", 52.3); cue("pipLand", 52.9);
    cue("tagline", 55.6); cue("store", 56.05); cue("noads", 56.4); cue("endSeal", 57.0); cue("fadeOut", 59.3);
  }

  // ---------------------------------------------------------------- frame
  F.frame = async (t, opt = {}) => {
    const f = Math.round(t * FPS);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.filter = "none";
    G.setTransform(.5, 0, 0, .5, 0, 0); G.clearRect(0, 0, W, H); G.globalAlpha = 1; G.globalCompositeOperation = "source-over"; G.filter = "none";
    const look = { exposure: 1, bloom: .85, streak: .55, vig: .34, grain: .026, sat: 1.04, contrast: 1.04, frame: f, warmth: 0, lift: 0 };
    await pipTick(t);
    if (t < 4.4) studio(t, look);
    if (t >= 4.4 && t < 19.8) skyStory(t, look);
    if (t >= 4.4 && t < 5.3) foldAway(blackPage(), seg(t, 4.4, 5.25), creaseGlint("#ff6a4a"));
    if (t >= 2.4 && t < 6.8) letterScene(t, look);
    if (t >= 19.55 && t < 45.0) gameplay(t, look, opt);
    if (t >= 44.85 && t < 50.6) moonrise(t, look);
    if (t >= 50.0) titleEnd(t, look);
    // Camera shake on impacts, applied to the finished comp.
    if (look.shake > 0) { const p = prev.getContext("2d"), r = rng(f); p.drawImage(comp, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(prev, (r() - .5) * 22 * look.shake, (r() - .5) * 18 * look.shake); }
    // Keep the finished frame for page folds.
    if (!opt.noPrev) { const p = prev.getContext("2d"); p.drawImage(comp, 0, 0); }
    post.render(look);
  };

  // ---------------------------------------------------------------- 0-1 · studio sting, the seal, the letter
  const EMBER0 = () => A.wordmarkPoint(W / 2, 470, 980);
  const camDownAt = t => 720 * easeInOut(seg(t, 2.2, 3.0));
  function emberPos(t) {
    // Falls from the foot of the t onto the seal point of the letter (which rises with the camera).
    const [x0, y0] = EMBER0(), k = seg(t, 2.15, 3.0), fall = easeIn(k);
    const [sx, sy] = A.sealPoint(), endX = W / 2 + sx * 1.25, endY = 600 + sy * 1.25;
    let x = lerp(x0, endX, ease(k)) + Math.sin(k * 6) * 22 * (1 - k), y = y0 + fall * (endY - y0 + 720) - camDownAt(t);
    if (k < .3) { x = Math.round(x / 12) * 12; y = Math.round(y / 12) * 12; }
    return [x, y, k];
  }
  function studio(t, look) {
    g.fillStyle = C.studio; g.fillRect(0, 0, W, H);
    if (t < 2.75) A.wordmark(g, G, t, W / 2, 470 - camDownAt(t), 980);
    if (t > 2.15 && t < 3.0) {
      const [x, y, k] = emberPos(t), r = lerp(9, 15, k);
      g.fillStyle = k < .3 ? C.redHot : "#ff7a3a";
      if (k < .3) g.fillRect(x - 10, y - 10, 20, 20); else { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      G.fillStyle = "#ff5a2c"; G.beginPath(); G.arc(x, y, 70 + k * 60, 0, TAU); G.fill();
    }
    look.bloom = .8; look.streak = .35; look.vig = .22; look.grain = .02;
    if (t > 3.0 && t < 3.35) look.shake = 1 - seg(t, 3.0, 3.35);
  }
  function blackPage() {
    if (!blackSheet) { const fr = canvas(W / 2, H / 2), b = fr.getContext("2d"); b.fillStyle = C.studio; b.fillRect(0, 0, W / 2, H / 2); blackSheet = pageSheet(fr, "#20211F"); }
    return blackSheet;
  }
  function letterFace(t) {
    // Before the flip the back (seal side) shows; after it, the front with "To Moon" being written.
    const flip = seg(t, 3.55, 3.95);
    return { flip, front: flip > .5, write: seg(t, 3.95, 4.55) };
  }
  let frontLive = null, frontLiveAt = -1;
  function frontAt(write) {
    const k = Math.round(write * 40) / 40;
    if (k >= 1) return A.frontDone;
    if (frontLiveAt !== k) { frontLive = A.letterFront(k); frontLiveAt = k; }
    return frontLive;
  }
  function letterScene(t, look) {
    // The letter rises into frame with the camera, takes the wax, turns over, then drifts up into the sky.
    const lf = letterFace(t), drift = easeInOut(seg(t, 4.9, 6.7));
    const x = lerp(W / 2, 760, drift), y = 600 + 720 - camDownAt(t) - drift * 640 - Math.sin(t * 1.7) * 6 * seg(t, 3.4, 4);
    const sc = lerp(1.25, .3, drift) * (1 + .06 * pulse(t, 3.0, 3.25)), rot = lerp(0, -.28, drift) + Math.sin(t * 1.3) * .015 * seg(t, 3.4, 4);
    drawLetterCard(t, x, y, sc, rot, lf);
    look.warmth = .5 * (1 - seg(t, 4.2, 5.2));
  }
  function drawLetterCard(t, x, y, sc, rot, lf) {
    const sx = Math.cos(lf.flip * Math.PI) * (lf.flip > .5 ? -1 : 1);
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc * Math.max(.02, Math.abs(Math.cos(lf.flip * Math.PI))), sc);
    // Soft shadow.
    g.save(); g.filter = "blur(18px)"; g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(-LETTER.W / 2 + 18, -LETTER.H / 2 + 30, LETTER.W, LETTER.H); g.restore();
    const face = lf.front ? frontAt(lf.write) : (t < 3.0 ? A.backPlain : A.backPlain);
    g.drawImage(face, -LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H);
    // Turning: darken toward edge-on.
    const turn = Math.abs(Math.sin(lf.flip * Math.PI));
    if (turn > .01) { g.fillStyle = `rgba(30,20,14,${turn * .35})`; g.fillRect(-LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H); }
    // The letter comes out of the dark, lit first by the falling ember, then by the room.
    if (t < 3.5) {
      const [ex, ey] = emberPos(Math.min(t, 2.999)), lx = (ex - x) / sc, ly = (ey - y) / sc, k = seg(t, 2.5, 3.0);
      g.fillStyle = `rgba(9,10,8,${.82 * (1 - seg(t, 2.95, 3.45))})`; g.fillRect(-LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H);
      const gl = g.createRadialGradient(lx, ly, 0, lx, ly, 380); gl.addColorStop(0, `rgba(255,140,80,${.5 * k * (1 - seg(t, 3.0, 3.4))})`); gl.addColorStop(1, "rgba(255,140,80,0)");
      g.fillStyle = gl; g.globalCompositeOperation = "screen"; g.fillRect(-LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H); g.globalCompositeOperation = "source-over";
    }
    // The pen nib writing "To Moon".
    if (lf.front && lf.write > 0 && lf.write < 1) {
      const nx = -LETTER.W / 2 + 62 + (LETTER.W - 90) * lf.write, ny = -LETTER.H / 2 + 170 + Math.sin(lf.write * 40) * 10;
      g.fillStyle = C.gold; g.beginPath(); g.arc(nx, ny, 5, 0, TAU); g.fill();
      G.save(); G.translate(x, y); G.rotate(rot); G.scale(sc, sc); G.fillStyle = "#ffd36a"; G.beginPath(); G.arc(nx, ny, 26, 0, TAU); G.fill(); G.restore();
    }
    g.restore();
    // The wax seal on the back (drawn over the card in screen space so it can glow).
    if (!lf.front && t >= 3.0) {
      const [px, py] = A.sealPoint(), c = Math.cos(rot), s = Math.sin(rot), k = sc * Math.abs(Math.cos(lf.flip * Math.PI));
      const wx = x + (px * k) * c - (py * sc) * s, wy = y + (px * k) * s + (py * sc) * c;
      g.save(); g.translate(wx, wy); g.scale(Math.abs(Math.cos(lf.flip * Math.PI)), 1); g.translate(-wx, -wy);
      A.seal(g, lf.flip > 0 ? null : G, wx, wy, 46 * sc, { splash: seg(t, 3.0, 3.12), press: seg(t, 3.1, 3.24), heat: 1 - seg(t, 3.2, 4.0) });
      g.restore();
      if (t < 3.2) splash(t, wx, wy, sc);
    }
    void sx;
  }
  function splash(t, x, y, sc) {
    const k = seg(t, 3.0, 3.2), r = rng(5);
    for (let i = 0; i < 14; i++) {
      const a = r() * TAU, d = (40 + r() * 90) * sc * easeOut(k), s = (5 + r() * 7) * sc * (1 - k);
      g.fillStyle = i % 3 ? C.red : C.redHot; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, s, 0, TAU); g.fill();
    }
    G.fillStyle = `rgba(255,90,44,${.4 * (1 - k)})`; G.beginPath(); G.arc(x, y, 100 * sc, 0, TAU); G.fill();
  }

  // ---------------------------------------------------------------- 2-5 · the sky, Old Moon, Pip and the fold, launch
  function skyCam(t) {
    let tau = lerp(0, .12, ease(seg(t, 4.4, 9.0))), zoom = lerp(1, 1.12, ease(seg(t, 4.4, 9.0)));
    if (t > 8.8) { const k = easeInOut(seg(t, 8.8, 10.8)); tau = lerp(.12, 1, k); zoom = lerp(1.12, 1, k); }
    if (t > 10.8) zoom = lerp(1, 1.06, ease(seg(t, 10.8, 12.6)));
    if (t > 12.6) { const k = easeInOut(seg(t, 12.6, 14.0)); tau = lerp(1, .72, k); zoom = lerp(1.06, 1, k); }
    if (t > 14.0) zoom = lerp(1, 1.04, seg(t, 14, 18));
    let zx = W / 2, zy = H / 2;
    if (t > 18.0) { const k = easeInOut(seg(t, 18.0, 19.0)); tau = lerp(.72, .05, k); }
    if (t > 18.9) { const k = easeIn(seg(t, 18.9, 19.7)); zoom = lerp(1.04, 3.4, k); zx = lerp(W / 2, 430, Math.min(1, k * 3)); zy = lerp(H / 2, 930, Math.min(1, k * 3)); }
    return { tau, zoom, zx, zy };
  }
  function skyStory(t, look) {
    const cam = skyCam(t);
    const light = lerp(.28, .4, seg(t, 4.4, 14)) + .08 * seg(t, 16.8, 17.4);
    S.draw(g, G, { ...cam, t, light, moon: { snore: 1, awake: 0, light: .25 }, curtain: 0, nearBlur: 6 });
    // The letter drifting up into the sky (continues from the seal scene).
    // Line 1.
    if (t > 5.6 && t < 9.2) T.storyLine(g, G, [{ w: "Every" }, { w: "star" }, { w: "is" }, { w: "a" }, { w: "letter", gold: true }, { w: "that" }, { w: "never" }, { w: "arrived." }], W / 2, 880, 58, t - 5.7, 8.75 - t);
    // A star passes close to the lens: a tiny sealed envelope.
    if (t > 5.8 && t < 8.8) closeStar(t);
    // Z's from Old Moon while the camera looks up.
    if (t > 9.4 && t < 14.4) zzz(t, cam);
    if (t > 12.6 && t < 19.8) pipAndFold(t, look);
    look.exposure = lerp(.94, 1, seg(t, 12, 17)); look.vig = .42; look.bloom = .9;
    if (t > 19.0) { const k = seg(t, 19.0, 19.7); look.flash = Math.max(look.flash || 0, ease(seg(t, 19.42, 19.62)) * .8); look.vig = .42 + k * .3; streaks(k, 430, 930); }
  }
  function closeStar(t) {
    const k = seg(t, 5.8, 8.8), x = lerp(1180, 2150, easeIn(k)), y = lerp(330, 170, k), s = lerp(30, 360, easeIn(k)), blur = Math.max(0, (s - 160) / 18);
    g.save(); g.translate(x, y); g.rotate(-.2 + k * .25); if (blur > 0) g.filter = `blur(${blur}px)`;
    const w = s, h = s * .66;
    g.fillStyle = C.paper; g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = C.fold; g.beginPath(); g.moveTo(-w / 2, h / 2); g.lineTo(0, 0); g.lineTo(w / 2, h / 2); g.fill();
    g.fillStyle = "#f3e5c4"; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(0, h * .1); g.fill();
    g.fillStyle = C.gold; g.beginPath(); g.arc(0, h * .05, s * .11, 0, TAU); g.fill();
    g.restore();
    const gl = pulse(t, 6.9, 7.7);
    G.save(); G.globalAlpha = .18 + gl * .55; G.fillStyle = "#ffd36a"; G.beginPath(); G.arc(x, y + s * .03, s * .12 + gl * 26, 0, TAU); G.fill();
    if (gl > 0) { G.globalAlpha = gl * .8; G.fillRect(x - 260 * gl, y - 2, 520 * gl, 4); }
    G.restore();
  }
  function zzz(t, cam) {
    void cam;
    const [mx, my] = S.toScreen("moon", S.MOON.x, S.MOON.y - S.MOON.travel);
    for (let i = 0; i < 3; i++) {
      const k = ((t - 9.4) * .45 + i / 3) % 1, a = pulse(k, 0, 1);
      T.caption(g, null, i % 2 ? "Z" : "z", mx - 120 - k * 160 - i * 10, my - 170 - k * 230, 50 + i * 14, { style: "mint", alpha: a * .85, rot: -.2 + k * .3, track: 0 });
    }
  }
  function streaks(k, x, y) {
    if (k <= 0) return;
    const r = rng(3);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 40; i++) {
      const a = r() * TAU, d0 = 200 + r() * 600, len = 200 * k + r() * 300 * k;
      g.strokeStyle = rgba(C.paper, .25 * k); g.lineWidth = 2 + r() * 3;
      g.beginPath(); g.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0); g.lineTo(x + Math.cos(a) * (d0 + len), y + Math.sin(a) * (d0 + len)); g.stroke();
    }
    g.restore();
  }

  // Pip: enters, catches the letter, folds it on four beats, pops it into the glider, rides it out.
  const pipCues = [[12.75, "enter"], [14.3, "tap"], [15.0, "tap"], [15.5, "tap"], [16.0, "tap"], [16.5, "tap"], [17.05, "loop"], [52.75, "enter"], [54.0, "wave"], [57.4, "present"]];
  let pipClock = 0, pipCue = 0;
  async function pipTick(t) {
    const live = (t >= 12.7 && t < 19.4) || (t >= 52.7);
    if (!live) return;
    while (pipCue < pipCues.length && pipCues[pipCue][0] <= t + 1e-6) { A.pip.react(pipCues[pipCue][1]); pipCue++; }
    const dt = Math.max(0, Math.min(.05, t - pipClock)); pipClock = t;
    await A.pipFrame(dt || 1 / 60);
  }
  F.seekPip = t => { pipCue = 0; while (pipCue < pipCues.length && pipCues[pipCue][0] <= t) pipCue++; pipClock = t; };
  function gliderAt(x, y, scale, rot, rider = "manta", paint = "bloom", glow = 0) {
    const W2 = F.W; g.save(); g.translate(x, y); g.rotate(rot);
    W2.drawGlider(g, F.rider(rider), F.palette(paint), scale, 0, 0, false, glow); g.restore();
  }
  const FOLD_AT = [15.0, 15.5, 16.0];
  function pipAndFold(t, look) {
    // Letter path: falls from the top right into Pip's arms (14.3), then moves to the folding spot.
    const catchT = 14.3, foldPos = [880, 610], foldScale = 1.02;
    const enter = easeOut(seg(t, 12.75, 13.85));
    let pipX = lerp(-200, 560, enter) + Math.sin(t * 1.3) * 8, pipY = 560 + Math.sin(t * 2.1) * 6, pipH = 300;
    const ride = seg(t, 17.3, 17.7);
    // Letter.
    let lx, ly, ls, lr;
    if (t < catchT) { const k = easeInOut(seg(t, 12.9, catchT)); lx = lerp(1500, pipX + 110, k) + Math.sin(t * 2) * 30 * (1 - k); ly = lerp(-200, pipY + 40, k); ls = lerp(.45, .62, k); lr = lerp(.5, -.1, k) + Math.sin(t * 3) * .1 * (1 - k); }
    else { const k = easeInOut(seg(t, catchT + .1, 14.95)); lx = lerp(pipX + 110, foldPos[0], k); ly = lerp(pipY + 40, foldPos[1], k); ls = lerp(.62, foldScale, k); lr = lerp(-.1, 0, k); }
    if (t >= catchT) pipX = lerp(pipX, 520, ease(seg(t, 14.3, 15))), pipY = lerp(pipY, 380, ease(seg(t, 14.3, 15)));
    const angles = FOLD_AT.map(a => Math.PI * easeInOut(seg(t, a, a + .36)));
    const pop = seg(t, 16.5, 16.95);
    // Launch.
    let gx = foldPos[0], gy = foldPos[1], gs = 6.8, gr = 0;
    if (t > 17.0) { gr = lerp(0, -.18, ease(seg(t, 17.0, 17.6))); gy += Math.sin(t * 2.4) * 8; }
    if (t > 18.0) {
      const k = easeIn(seg(t, 18.0, 19.15)), isl = S.toScreen("islands", 430, 880), p0 = [gx, gy], p1 = [1500, 300], p2 = [isl[0] + 200, isl[1] - 420], p3 = [isl[0], isl[1] - 40];
      const b = (a, b2, c, d, u) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b2 + 3 * (1 - u) * u * u * c + u ** 3 * d;
      const nx = b(p0[0], p1[0], p2[0], p3[0], k), ny = b(p0[1], p1[1], p2[1], p3[1], k);
      const nx2 = b(p0[0], p1[0], p2[0], p3[0], Math.min(1, k + .01)), ny2 = b(p0[1], p1[1], p2[1], p3[1], Math.min(1, k + .01));
      gr = Math.atan2(ny2 - ny, nx2 - nx); gx = nx; gy = ny; gs = lerp(6.8, .8, k);
      trailDots(t, gx, gy, gr, gs);
    }
    // Pip draws behind the letter while folding, rides the glider after.
    if (ride <= 0) A.drawPip(g, pipX, pipY, pipH, Math.sin(t * 1.1) * .04);
    if (t < 16.62) {
      g.save(); g.translate(lx, ly); g.rotate(lr); g.scale(ls * (1 - easeIn(seg(pop, 0, .3)) * .9), ls * (1 - easeIn(seg(pop, 0, .3)) * .9));
      if (t < 14.95) g.drawImage(A.frontDone, -LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H);
      else sheet.draw(g, angles, { shadow: .45, crease: (a, u, th) => { const k = Math.sin(th); g.save(); g.beginPath(); g.rect(-LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H); g.clip(); g.strokeStyle = rgba("#fff0c0", k * .9); g.lineWidth = 3; g.beginPath(); g.moveTo(a[0] - u[0] * 600, a[1] - u[1] * 600); g.lineTo(a[0] + u[0] * 600, a[1] + u[1] * 600); g.stroke(); g.restore(); } });
      g.restore();
    }
    // The pop: a gold burst and the glider unfolds out of it.
    if (pop > 0) {
      const k = seg(t, 16.6, 16.95), burst = pulse(t, 16.55, 17.25);
      G.save(); G.globalAlpha = burst * .55; const bg2 = G.createRadialGradient(foldPos[0], foldPos[1], 0, foldPos[0], foldPos[1], 90 + burst * 160); bg2.addColorStop(0, "#ffe7a0"); bg2.addColorStop(1, "rgba(255,201,77,0)");
      G.fillStyle = bg2; G.beginPath(); G.arc(foldPos[0], foldPos[1], 90 + burst * 160, 0, TAU); G.fill(); G.globalAlpha = burst * .8; G.fillStyle = "#ffd36a"; G.fillRect(foldPos[0] - 520 * burst, foldPos[1] - 2, 1040 * burst, 4); G.restore();
      sparkles(foldPos[0], foldPos[1], seg(t, 16.58, 17.3), 260);
      ring(foldPos[0], foldPos[1], seg(t, 16.6, 17.2), 380);
      if (k > 0) gliderAt(gx, gy, gs * back(k, 2.4), gr, "manta", "bloom", 1 - seg(t, 17.0, 17.8));
    }
    if (ride > 0 && t < 19.6) A.drawPip(g, gx - Math.cos(gr) * 6 * gs / 6.8, gy - 70 * gs / 6.8 * ride - 10, 150 * gs / 6.8, gr * .5);
    if (t > 17.0 && t < 18.3) T.caption(g, null, "Ready, pilot?", 1290, 400, 104, { style: "gold", alpha: clamp((t - 17.0) * 6) * clamp((18.25 - t) * 5), scale: back(seg(t, 17.0, 17.3)) * .4 + .6, rot: -.05 });
    look.streak = .6;
  }
  function sparkles(x, y, k, r) {
    if (k <= 0 || k >= 1) return;
    const rr = rng(41);
    for (let i = 0; i < 16; i++) {
      const a = rr() * TAU, d = r * (.3 + rr() * .7) * easeOut(k), s = (6 + rr() * 8) * (1 - k);
      const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .8;
      g.save(); g.translate(px, py); g.rotate(a + k * 3); g.fillStyle = i % 3 ? C.gold : C.mint;
      g.beginPath(); g.moveTo(0, -s * 1.6); g.lineTo(s * .5, 0); g.lineTo(0, s * 1.6); g.lineTo(-s * .5, 0); g.fill(); g.restore();
      G.fillStyle = rgba("#ffd36a", .6 * (1 - k)); G.beginPath(); G.arc(px, py, s * 2, 0, TAU); G.fill();
    }
  }
  function ring(x, y, k, r) {
    if (k <= 0 || k >= 1) return;
    g.save(); g.strokeStyle = rgba(C.gold, 1 - k); g.lineWidth = 6 * (1 - k) + 1; g.setLineDash([4, 14]); g.beginPath(); g.arc(x, y, 40 + r * easeOut(k), 0, TAU); g.stroke(); g.restore();
  }
  function trailDots(t, x, y, rot, s) {
    for (let i = 1; i < 18; i++) {
      const d = i * 10 * s / 3; g.save(); g.globalAlpha = (1 - i / 18) * .6; g.fillStyle = i % 2 ? "#ef6e67" : "#edca62";
      g.translate(x - Math.cos(rot) * d, y - Math.sin(rot) * d); g.rotate(rot); const sz = s * 1.6 * (1 - i / 22);
      g.beginPath(); g.moveTo(0, -sz); g.lineTo(sz * .72, 0); g.lineTo(0, sz); g.lineTo(-sz * .72, 0); g.fill(); g.restore();
    }
  }

  // ---------------------------------------------------------------- 6-10 · gameplay
  let current = null, fx = { shiftT: -9, shiftDir: 1, capDir: 1, capX: 0, stamps: [], tags: [], glints: [], feverT: -9 };
  function shotFor(t) { if (t < 27.0) return shots.bloom; if (t < 34.0) return shots.ember; return shots.void; }
  F.seekShot = t => { const s = shotFor(t); current = s; GB.enter(s, s.t0); GB.step(t); GB.takeEvents(); };
  F.measure = () => { for (const s of Object.values(shots)) GB.measure(s, s.t0, s.t1); return GB.corr; };
  function gameCam(t, sh) {
    // Focus in game CSS px (the canvas is 768 x 432; the planet sits at 384, 237.6).
    let z = 1.06, fx0 = 384, fy0 = 222;
    if (sh.id === "bloom") { const k = easeOut(seg(t, 19.6, 20.15)); z = lerp(1.7, 1.06, k); fy0 = lerp(237.6, 222, k); }
    if (sh.id === "ember") z = 1.06 + .05 * ease(seg(t, 27.6, 28.2)) * (1 - ease(seg(t, 29.7, 30.1)));
    if (sh.id === "void") {
      const inf = GB.info();
      const push = ease(seg(t, 40.0, 43.0)), close = easeInOut(seg(t, 43.0, 44.1));
      z = lerp(1.06, 1.3, push); z = lerp(z, 2.7, close);
      fx0 = lerp(384, inf.x, push * .35 + close * .65); fy0 = lerp(222, inf.y, push * .35 + close * .65);
      if (t > 36.5 && t < 37.7) { const k = pulse(t, 36.5, 37.7); z += .18 * k; fx0 = lerp(fx0, inf.x, .3 * k); fy0 = lerp(fy0, inf.y, .3 * k); }
    }
    const hw = 384 / z, hh = 216 / z;
    return { z, fx: clamp(fx0, hw, 768 - hw), fy: clamp(fy0, hh, 432 - hh) };
  }
  const toScreen = (cam, x, y) => [W / 2 + (x - cam.fx) * 2.5 * cam.z, H / 2 + (y - cam.fy) * 2.5 * cam.z];
  function gameplay(t, look, opt) {
    const sh = shotFor(t);
    if (current !== sh) { current = sh; GB.enter(sh, Math.max(sh.t0, Math.min(t, sh.t0))); if (t > sh.t0 + 1e-6) GB.step(t); fx.stamps = []; fx.tags = []; }
    else GB.step(t);
    const evs = GB.takeEvents();
    const cam = gameCam(t, sh), inf = GB.info();
    for (const e of evs) {
      if (e.type === "tap") { fx.shiftT = t; const vx = -e.dir * Math.sin(e.angle); fx.shiftDir = vx >= 0 ? 1 : -1; fx.capDir *= -1; }
      // The last gate stays silent: no stamp, just a glint where it threads.
      if (e.type === "perfect") (t < 43 ? fx.stamps : fx.glints).push({ t, x: e.x, y: e.y, n: e.n, fever: inf.fever > 0 });
      if (e.type === "fever") fx.feverT = t;
      if (e.type === "tailSpark") fx.tags.push({ t, text: "TAIL SPARK", x: e.x, y: e.y });
      if (e.type === "letter") fx.tags.push({ t: t + .25, text: "LOST LETTER +2", x: e.x, y: e.y });
      if (e.type === "swap") fx.tags.push({ t, text: { dart: "DART", crescent: "CRESCENT", splitwing: "SPLITWING", shuttle: "SHUTTLE", ringsail: "RING SAIL", manta: "MANTA" }[e.rider], x: inf.x, y: inf.y, swap: true });
    }
    // The Shift: on every reverse the frame jolts toward the glider's new heading, then settles.
    const sp = pulse(t - fx.shiftT, 0, .3), sdx = fx.shiftDir * 26 * sp, skew = fx.shiftDir * .03 * sp;
    fx.capX += (fx.capDir * 30 - fx.capX) * (1 - Math.exp(-12 / FPS));
    g.fillStyle = "#05090b"; g.fillRect(0, 0, W, H);
    g.save(); g.translate(W / 2 + sdx, H / 2); g.transform(1, 0, skew, 1, 0, 0); g.scale(2.5 * cam.z * (1 + .03 * sp), 2.5 * cam.z * (1 + .03 * sp)); g.translate(-cam.fx, -cam.fy);
    g.drawImage(GB.canvas(), 0, 0, 768, 432); g.restore();
    overlays(t, sh, cam, inf, look);
    // Page folds between worlds: the last frame of the previous world folds up and flies away.
    for (const at of [27.0, 34.0]) if (t >= at && t < at + .62) {
      if (snapAt !== at) { snap = canvas(W, H); snap.getContext("2d").drawImage(prev, 0, 0); snapAt = at; F.page = pageSheet(snap, C.night700); }
      foldAway(F.page, seg(t, at, at + .62), creaseGlint());
    }
    // Into the Moonrise: a gold-white flash over the last crossing.
    if (t > 44.55) look.flash = Math.max(look.flash || 0, ease(seg(t, 44.6, 44.98)) * .95), look.flashColor = [1, .95, .8];
    if (sh.id === "bloom" && t < 19.8) look.flash = Math.max(look.flash || 0, .8 * (1 - seg(t, 19.6, 19.8)));
    look.bloom = .8; look.goldGain = .4; look.streak = .55; look.vig = .3; look.exposure = 1.02;
    if (t > 43 && t < 45) { look.vig = .3 + .35 * ease(seg(t, 43, 43.5)); look.sat = 1.04 - .25 * ease(seg(t, 43, 43.5)); }
    void opt;
  }
  function overlays(t, sh, cam, inf, look) {
    const cap = (lines, t0, t1, side) => {
      if (t < t0 || t > t1) return;
      const a = clamp((t - t0) * 7) * clamp((t1 - t) * 6), pop = back(seg(t, t0, t0 + .28));
      const xBase = side < 0 ? 330 : W - 330, drift = fx.capX;
      // Keep the widest line inside the frame.
      const wMax = Math.max(...lines.map(ln => T.measure(g, ln.text, ln.size))), x0 = clamp(xBase, wMax / 2 + 70, W - wMax / 2 - 70);
      lines.forEach((ln, i) => {
        const off = (i ? -1 : 1) * drift + (i ? 34 : -26);
        T.caption(g, null, ln.text, x0 + off, ln.y, ln.size, { style: ln.style, alpha: a * clamp((t - t0 - i * .12) * 7), scale: .55 + .45 * pop, rot: side * .03, skew: fx.shiftDir * .12 * pulse(t - fx.shiftT, 0, .3) });
      });
    };
    if (sh.id === "bloom") {
      cap([{ text: "TAP", y: 470, size: 190, style: "paper" }, { text: "TO SHIFT", y: 600, size: 112, style: "gold" }], 20.0, 21.4, -1);
      cap([{ text: "THREAD", y: 470, size: 150, style: "paper" }, { text: "THE GAP", y: 590, size: 112, style: "gold" }], 21.5, 23.3, 1);
    }
    if (sh.id === "ember") {
      cap([{ text: "HOLD", y: 470, size: 190, style: "paper" }, { text: "TO FOLD", y: 600, size: 112, style: "gold" }], 27.6, 29.8, -1);
      cap([{ text: "EXPRESS", y: 470, size: 140, style: "gold" }, { text: "POST", y: 610, size: 150, style: "paper" }], 31.55, 33.4, 1);
      // Paper speed streaks while tucked.
      if (inf.fold > .05) speedLines(t, inf.fold);
    }
    if (sh.id === "void") {
      cap([{ text: "DODGE", y: 470, size: 180, style: "paper" }, { text: "THE COMETS", y: 590, size: 100, style: "gold" }], 35.05, 36.9, -1);
      lostLetters(t);
    }
    // Express Post: gold floods in from the edges.
    if (inf.fever > 0) {
      const k = clamp((t - fx.feverT) * 3) * clamp(inf.fever);
      const vg = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1100); vg.addColorStop(0, "rgba(255,201,77,0)"); vg.addColorStop(1, `rgba(255,201,77,${.32 * k})`);
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
      G.save(); G.globalAlpha = .25 * k; G.fillStyle = vg; G.fillRect(0, 0, W, H); G.restore();
      look.warmth = .6 * k;
    }
    // Postmarks for perfects, stamped just outside the orbit.
    for (const s of fx.stamps) {
      const age = t - s.t; if (age > 1.15) continue;
      const [px, py] = toScreen(cam, s.x, s.y), [ccx, ccy] = toScreen(cam, inf.cx, inf.cy);
      const dx = px - ccx, dy = py - ccy, d = Math.hypot(dx, dy) || 1;
      const x = clamp(px + dx / d * 190, 160, W - 160), y = clamp(py + dy / d * 150, 150, H - 150);
      const a = clamp(age * 14) * clamp((1.15 - age) * 4), sc = 1 + .7 * (1 - back(seg(age, 0, .2), 2));
      T.postmark(g, G, x, y, 92, { n: `×${s.n}`, alpha: a, scale: sc, rot: -.16 + (s.n % 2) * .12 });
      if (age < .4) inkRing(x, y, age / .4);
    }
    for (const gl of fx.glints) {
      const age = t - gl.t; if (age > 1.2) continue;
      const [px, py] = toScreen(cam, gl.x, gl.y), k = pulse(age, 0, 1.2);
      for (const c of [g, G]) { c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = k * (c === G ? .9 : .6); c.fillStyle = "#fff2c4";
        c.beginPath(); c.moveTo(px - 260 * k, py); c.lineTo(px, py - 5); c.lineTo(px + 260 * k, py); c.lineTo(px, py + 5); c.fill();
        c.beginPath(); c.moveTo(px, py - 90 * k); c.lineTo(px + 4, py); c.lineTo(px, py + 90 * k); c.lineTo(px - 4, py); c.fill(); c.restore(); }
    }
    for (const tg of fx.tags) {
      const age = t - tg.t, life = tg.swap ? .5 : 1.0; if (age > life) continue;
      const [px, py] = toScreen(cam, tg.x, tg.y);
      T.caption(g, G, tg.text, px + (tg.swap ? 0 : 0), py - 110 - age * 40, tg.swap ? 64 : 70, { style: "gold", alpha: clamp(age * 10) * clamp((life - age) * 6), scale: back(seg(age, 0, .15)) * .3 + .7, glow: .4 });
    }
  }
  function inkRing(x, y, k) {
    g.save(); g.strokeStyle = rgba(C.gold, (1 - k) * .9); g.lineWidth = 8 * (1 - k); g.beginPath(); g.arc(x, y, 100 + k * 120, 0, TAU); g.stroke(); g.restore();
  }
  function speedLines(t, k) {
    const r = rng(Math.floor(t * 20));
    g.save(); g.globalAlpha = .5 * k;
    for (let i = 0; i < 26; i++) { const y = r() * H, x = r() * W, l = 140 + r() * 360; g.fillStyle = i % 3 ? C.paper : C.gold; g.fillRect(x, y, l * k, 3 + r() * 3); }
    g.restore();
  }
  let letterSprites = null;
  function lostLetters(t) {
    if (!letterSprites) letterSprites = [0, 4].map(bl => { const c = canvas(140, 110), q = c.getContext("2d"); q.translate(70, 55); if (bl) q.filter = `blur(${bl}px)`;
      q.fillStyle = "#d9d1df"; q.fillRect(-40, -26, 80, 52); q.fillStyle = "#8b76c7"; q.beginPath(); q.moveTo(-40, -26); q.lineTo(0, 4); q.lineTo(40, -26); q.fill(); return c; });
    const r = rng(8);
    for (let i = 0; i < 7; i++) {
      const sp = 60 + r() * 90, x = (r() * W * 1.4 - ((t - 34) * sp)) % (W + 400), y = r() * H, s = 26 + r() * 40, rot = Math.sin(t * .8 + i) * .5;
      const xx = x < -200 ? x + W + 400 : x, near = s > 52;
      g.save(); g.translate(xx, y + Math.sin(t + i) * 20); g.rotate(rot); g.globalAlpha = .55; const k = s / 80;
      g.drawImage(letterSprites[near ? 1 : 0], -70 * k, -55 * k, 140 * k, 110 * k);
      g.restore();
    }
  }

  // ---------------------------------------------------------------- 11 · Moonrise
  let unfold;
  function moonrise(t, look) {
    const k1 = easeInOut(seg(t, 47.6, 49.9));
    const tau = lerp(1, .06, k1), zoom = lerp(1.12, 1, ease(seg(t, 44.9, 47.2))) * lerp(1, .96, k1);
    const open = easeInOut(seg(t, 47.0, 48.0)), light = lerp(.3, 1.05, ease(seg(t, 47.0, 48.3)));
    const wakeT = 46.6;
    const letterAtMoon = (gg, GG, mx, my) => {
      // The letter slips under the curtain and glows in front of the Moon.
      if (t < 46.05) return;
      const k = easeInOut(seg(t, 46.05, 46.6)), x = lerp(mx - 520, mx - 120, k), y = lerp(my + 120, my + 150, k), s = lerp(.62, .5, k);
      gg.save(); gg.translate(x, y); gg.rotate(lerp(-.2, .05, k) + Math.sin(t * 2) * .03); gg.scale(s, s); gg.drawImage(A.frontDone, -LETTER.W / 2, -LETTER.H / 2, LETTER.W, LETTER.H); gg.restore();
      const gl = seg(t, 46.4, 47.2) * (1 - seg(t, 48.2, 49));
      GG.fillStyle = rgba("#ffd36a", .3 * gl); GG.beginPath(); GG.arc(x, y, 130, 0, TAU); GG.fill();
    };
    S.draw(g, G, { tau, zoom, t, light, moon: { awake: seg(t, wakeT, wakeT + .3), smile: seg(t, wakeT + .2, wakeT + .6), light, wokeAt: wakeT, snore: t < wakeT ? 1 : 0 }, curtain: open,
      starsOpen: t > 47.4 ? (t - 47.4) * 1.3 : -1, threads: seg(t, 47.9, 49.3), islandsLit: seg(t, 48.4, 49.5), rays: ease(seg(t, 47.1, 47.9)) * (1 - .35 * seg(t, 49, 50.5)), letterAtMoon, nearBlur: 6 });
    // The glider flies in and unfolds back into the letter.
    if (t < 46.1) {
      const [mx, my] = S.toScreen("moon", S.MOON.x, S.MOON.y - S.MOON.travel);
      const k = easeOut(seg(t, 44.9, 45.35));
      const x = lerp(-200, mx - 540, k), y = lerp(760, my + 140, k);
      if (t < 45.5) gliderAt(x, y, 5.2 * (1 - easeIn(seg(t, 45.35, 45.5))), lerp(-.5, -.05, k), "manta", "bloom", 1);
      else {
        const a = [45.95, 45.75, 45.55].map(s => Math.PI * (1 - easeInOut(seg(t, s, s + .2))));
        g.save(); g.translate(x, y); const s = .62 * back(seg(t, 45.45, 45.62), 2); g.scale(s, s); sheet.draw(g, a, { shadow: .4 }); g.restore();
      }
      G.save(); G.globalAlpha = .4 * pulse(t, 45.3, 45.8); G.fillStyle = "#ffd36a"; G.beginPath(); G.arc(x, y, 120, 0, TAU); G.fill(); G.restore();
    }
    if (t > 48.4 && t < 50.6) T.caption(g, null, "Fly them home.", W / 2, 250, 150, { style: "paper", alpha: clamp((t - 48.4) * 3) * clamp((50.55 - t) * 4), scale: .9 + .1 * easeOut(seg(t, 48.4, 49.4)) });
    look.exposure = lerp(.95, 1.06, ease(seg(t, 47.0, 48.0))) - .04 * ease(seg(t, 48.4, 50));
    look.bloom = lerp(.8, .95, ease(seg(t, 47.0, 48.0))); look.goldGain = .4; look.streak = .6; look.vig = lerp(.45, .32, open); look.warmth = .3 * open;
    look.flash = Math.max(look.flash || 0, .95 * (1 - seg(t, 44.9, 45.3)));
    if (t >= 50.0) look.fadeToTitle = seg(t, 50.0, 50.6);
    void unfold;
  }

  // ---------------------------------------------------------------- 12-13 · title and end card
  function titleEnd(t, look) {
    // Background: the lit sky, out of focus and dimmed, so the logo owns the frame.
    const bgk = seg(t, 50.0, 50.6);
    if (t < 50.6) { g.save(); g.globalAlpha = bgk; }
    const b = bgC.getContext("2d"); b.setTransform(.5, 0, 0, .5, 0, 0); bgG.setTransform(.25, 0, 0, .25, 0, 0); bgG.clearRect(0, 0, W, H);
    S.draw(b, bgG, { tau: .06, zoom: .96, t, light: 1, moon: { awake: 1, smile: 1, light: 1, wokeAt: 46.6 }, curtain: 1, starsOpen: 99, threads: 1, islandsLit: 1, rays: .5, nearBlur: 3 });
    // Defocus at half resolution, then scale up.
    const bq = bgBlur.getContext("2d"); bq.filter = `blur(${2 + 3 * bgk}px)`; bq.clearRect(0, 0, W / 2, H / 2); bq.drawImage(bgC, 0, 0); bq.filter = "none";
    g.drawImage(bgBlur, 0, 0, W, H);
    G.save(); G.globalAlpha = .18; G.drawImage(bgG.canvas, 0, 0, W, H); G.restore();
    g.fillStyle = rgba(C.night900, .5 * bgk); g.fillRect(0, 0, W, H);
    if (t < 50.6) g.restore();
    const lay = F.layout, end = easeInOut(seg(t, 55.0, 55.7));
    g.save(); G.save();
    const lt = (c) => { c.translate(W / 2, 360); c.scale(lerp(1, .74, end), lerp(1, .74, end)); c.translate(-W / 2, -360 - end * 130); };
    lt(g); lt(G);
    // The glider circles the O; its trail becomes the letter.
    const O = lay.orbit.letters[0], ocx = O.x + O.w / 2, ocy = lay.orbit.y - lay.size * .36, orr = lay.size * .3;
    const draw = seg(t, 50.0, 51.0);
    if (t < 51.25) {
      g.save(); g.strokeStyle = C.paper; g.lineWidth = lay.size * .17; g.lineCap = "round";
      g.globalAlpha = 1 - seg(t, 50.95, 51.2);
      g.beginPath(); g.arc(ocx, ocy, orr, -Math.PI / 2, -Math.PI / 2 + TAU * easeInOut(draw)); g.stroke(); g.restore();
      G.save(); G.strokeStyle = "#ffd36a"; G.lineWidth = 30; G.globalAlpha = .5 * (1 - draw); G.beginPath(); G.arc(ocx, ocy, orr, -Math.PI / 2, -Math.PI / 2 + TAU * easeInOut(draw)); G.stroke(); G.restore();
    }
    if (t < 51.6) {
      const a = -Math.PI / 2 + TAU * easeInOut(draw) + (t > 51 ? (t - 51) * 6 : 0), r = orr + (t > 51 ? (t - 51) * 900 : 0);
      gliderAt(ocx + Math.cos(a) * r, ocy + Math.sin(a) * r, 2.6, a + Math.PI / 2, "manta", "bloom", .6);
    }
    const orbitK = [0, 1, 2, 3, 4].map(i => i === 0 ? seg(t, 50.95, 51.2) * 1.0001 : seg(t, 51.0 + i * .25 - .25, 51.0 + i * .25) * 1.0001);
    const shiftK = t >= 52.0 ? Math.max(.0001, (t - 52.0) / .16) : 0;
    T.logo(g, G, lay, { orbit: orbitK, shift: shiftK, glint: (t - 52.3) / .7, o: 1 });
    if (t > 52.0 && t < 52.5) ring(W / 2 + 140, lay.shift.y - 80, seg(t, 52.12, 52.5), 700);
    g.restore(); G.restore();
    if (t > 52.12 && t < 52.4) look.shake = 1 - seg(t, 52.12, 52.4);
    // Pip arrives and perches by the logo.
    if (t > 52.75) {
      const k = easeOut(seg(t, 52.75, 53.8)), px = lerp(-200, lerp(470, 470, end), k), py = lerp(260, lerp(330, 250, end), k) + Math.sin(t * 2) * 6;
      A.drawPip(g, px, py, lerp(240, 190, end));
    }
    // End card.
    if (t > 55.5) {
      const a1 = ease(seg(t, 55.6, 56.0)), a2 = ease(seg(t, 56.05, 56.4)), a3 = ease(seg(t, 56.4, 56.8));
      g.save(); setFont(g, 54, "Nunito", 900); g.textAlign = "center"; g.letterSpacing = "1px";
      g.globalAlpha = a1; g.fillStyle = C.mint; g.fillText("One tap. Deliver the night.", W / 2, 660 + (1 - a1) * 16);
      // Store pill.
      g.globalAlpha = a2; const pw = 620, ph = 82, py = 712 + (1 - a2) * 16;
      g.fillStyle = rgba(C.night900, .85); round(g, W / 2 - pw / 2, py, pw, ph, 22); g.fill(); g.lineWidth = 4; g.strokeStyle = C.gold; g.stroke();
      setFont(g, 30, "Nunito", 900); g.letterSpacing = "2px"; g.textAlign = "left";
      const w1 = g.measureText("COMING SOON TO ").width, w2 = g.measureText("GOOGLE PLAY").width, sx = W / 2 - (w1 + w2) / 2;
      g.fillStyle = C.paper; g.fillText("COMING SOON TO ", sx, py + 52); g.fillStyle = C.gold; g.fillText("GOOGLE PLAY", sx + w1, py + 52);
      g.globalAlpha = a3; setFont(g, 24, "Nunito", 900); g.letterSpacing = "6px"; g.textAlign = "center"; g.fillStyle = C.muted; g.fillText("NO ADS · PLAYS OFFLINE", W / 2, 858);
      g.restore();
      // The studio's seal.
      if (t > 56.9) {
        const k = seg(t, 57.0, 57.14), cxs = W / 2 - 150, cys = 960;
        A.seal(g, G, cxs, cys, 44, { splash: k, press: seg(t, 57.08, 57.22), heat: 1 - seg(t, 57.2, 58.4) });
        const a4 = ease(seg(t, 57.25, 57.7));
        g.save(); g.globalAlpha = a4; setFont(g, 22, "Nunito", 900); g.letterSpacing = "5px"; g.fillStyle = C.muted; g.textAlign = "left"; g.fillText("A GAME BY", cxs + 76, cys - 22); g.restore();
        A.wordmark(g, G, Math.max(0, t - 57.15), cxs + 76 + 129, cys + 22, 258, a4);
        if (t < 57.4) look.shake = Math.max(look.shake || 0, .5 * (1 - seg(t, 57.0, 57.3)));
      }
    }
    look.exposure = 1.0; look.bloom = .8; look.goldGain = .3; look.streak = .6; look.vig = .38;
    look.fade = Math.max(look.fade || 0, ease(seg(t, 59.3, 60.0)));
  }
  function round(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  // Camera shake is applied to the whole comp before post.
  const render0 = F.frame;
  F.frame = async (t, opt) => { await render0(t, opt); };
  F.events = () => ({ cues: F.cues, game: GB.events });
  window.Film = F;
  void spring; void expoOut; void mix; void inv; void unfoldSheet; void setFont;
})();
