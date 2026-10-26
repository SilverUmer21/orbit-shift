// Fly Them Home · the Sky World: one cut-paper diorama the camera tilts through (tau 0 = the islands on the horizon,
// tau 1 = Old Moon). Layers move by their own depth; star-envelopes open at Moonrise; gold threads stitch them.
(() => {
  const { TAU, clamp, lerp, ease, easeOut, back, C, rgba, mix, rng, canvas } = FT;
  const A = FilmArt;
  const S = {};
  const { V, W, H } = FT;
  // The vertical cut stacks the same diorama in a tall frame: the Moon higher and centred, the islands on the horizon
  // near the foot of the frame, more sky between them.
  S.MOON = V ? { x: 590, y: 700, R: 300, travel: 1040 } : { x: 1240, y: 352, R: 236, travel: 1040 };

  // Layer table: travel (px of vertical move from tau 0 to 1) and dolly depth.
  const L = { farStars: [700, .25], moon: [S.MOON.travel, .35], cloudFar: [1150, .55], stars: [1000, .6], islands: [1400, .8], cloudMid: [1300, .9], cloudNear: [1520, 1.25] };
  let cam = { tau: 0, zoom: 1, zx: W / 2, zy: H / 2 };
  const layer = (g, name) => {
    const [travel, depth] = L[name], z = Math.pow(cam.zoom, depth);
    g.translate(cam.zx, cam.zy); g.scale(z, z); g.translate(-cam.zx, -cam.zy + cam.tau * travel);
  };
  S.toScreen = (name, x, y) => { const [travel, depth] = L[name], z = Math.pow(cam.zoom, depth); return [cam.zx + (x - cam.zx) * z, cam.zy + (y + cam.tau * travel - cam.zy) * z]; };
  S.layerScale = name => Math.pow(cam.zoom, L[name][1]);

  const r = rng(2026);
  const farStars = Array.from({ length: V ? 200 : 170 }, () => ({ x: r() * W, y: -720 + r() * (V ? 2550 : 1700), s: 1.6 + r() * 2.6, ph: r() * TAU, sp: .8 + r() * 1.6 }));
  const stars = Array.from({ length: V ? 84 : 74 }, () => ({ x: 40 + r() * (W - 80), y: -1000 + r() * (V ? 2420 : 1650), s: 10 + Math.pow(r(), 2.2) * 30, ph: r() * TAU, rot: (r() - .5) * .5 }));
  // Far paper ribbons (the map backdrop's flowing bands, at film scale).
  const ribbons = (V ? [[-300, .22, "#3f7770", 11], [620, .16, "#3a6f69", 5], [-820, .14, "#4a8a80", 17], [1180, .12, "#3f7770", 23]] : [[-300, .22, "#3f7770", 11], [260, .16, "#3a6f69", 5], [-760, .14, "#4a8a80", 17]]).map(([y, a, c, seed]) => {
    const rr = rng(seed), pts = []; for (let x = -200; x <= W + 300; x += 240) pts.push([x, y + (rr() - .5) * 160]);
    return { pts, a, c, h: 70 + rr() * 60 };
  });
  // Keep the Moon's disc and the letter's flight clear of big stars.
  for (const st of stars) { const dx = st.x - S.MOON.x, dy = st.y + S.MOON.travel - S.MOON.y; if (Math.hypot(dx, dy) < S.MOON.R * 1.5) st.y -= 420; }
  for (const st of stars) st.open = Math.hypot(st.x - S.MOON.x, st.y + S.MOON.travel - S.MOON.y) / 1400;
  // Constellations: nearest-neighbour chains through the star-envelopes.
  const threads = [];
  { const used = new Set(); const rr = rng(77);
    for (let k = 0; k < 9; k++) {
      let i = Math.floor(rr() * stars.length); if (used.has(i)) continue;
      const chain = [i]; used.add(i);
      for (let n = 0; n < 3 + Math.floor(rr() * 2); n++) {
        const a = stars[chain[chain.length - 1]]; let best = -1, bd = 1e9;
        stars.forEach((b, j) => { if (used.has(j)) return; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < bd && d < 420) { bd = d; best = j; } });
        if (best < 0) break; chain.push(best); used.add(best);
      }
      if (chain.length > 2) threads.push(chain);
    } }

  const isl = V ? [[300, 1470, 420], [820, 1400, 340], [590, 1640, 300]] : [[430, 880, 330], [1490, 850, 290], [980, 990, 250]];
  const islands = [
    { id: "bloom", x: isl[0][0], y: isl[0][1], size: isl[0][2], lights: [[-60, -40], [-10, -62], [42, -48], [80, -20], [-96, -10]] },
    { id: "ember", x: isl[1][0], y: isl[1][1], size: isl[1][2], lights: [[-30, -44], [20, -56], [56, -30], [-64, -18]] },
    { id: "void", x: isl[2][0], y: isl[2][1], size: isl[2][2], lights: [[-30, -30], [14, -44], [48, -22]] },
  ];
  S.islands = islands;
  S.load = async () => {
    await Promise.all(islands.map(is => new Promise(res => { is.img = new Image(); is.img.onload = res; is.img.src = `../assets/archipelago/${is.id}-island.svg`; })));
    for (const is of islands) { const c = canvas(600, 600); c.getContext("2d").drawImage(is.img, 0, 0, 600, 600); is.bmp = c; }
    S.rays = canvas(W / 4, H / 4); S.rays2 = canvas(W / 4, H / 4);
  };

  // Cut-paper cloud band: bumpy top silhouette, two-tone fold, lit rim.
  const bands = {
    cloudFar: { y: V ? 1380 : 780, seed: 3, bump: 70, step: 120, fill: "#123a41", shade: "#0f3137", rim: "#2c6d6c" },
    cloudMid: { y: V ? 1560 : 905, seed: 9, bump: 90, step: 150, fill: "#0d2d33", shade: "#0a252a", rim: "#25605e" },
    cloudNear: { y: V ? 1780 : 1035, seed: 21, bump: 110, step: 190, fill: "#0a2127", shade: "#081b20", rim: "#1f5352" },
    wisp: { y: S.MOON.y - S.MOON.travel + S.MOON.R * 1.15, seed: 31, bump: 40, step: 90, fill: "#123a41", shade: "#0f3137", rim: "#3b7d78", x0: V ? -60 : 520, x1: V ? 1200 : 1960, thick: 70 },
  };
  for (const b of Object.values(bands)) {
    const rr = rng(b.seed), pts = []; const x0 = b.x0 ?? -260, x1 = b.x1 ?? W + 260;
    for (let x = x0; x <= x1 + b.step; x += b.step * (.7 + rr() * .6)) pts.push([x, b.y - (rr() * .7 + .3) * b.bump]);
    b.pts = pts;
  }
  function bandPath(b, dy = 0) {
    const p = new Path2D(), pts = b.pts, bottom = b.thick ? b.y + b.thick : b.y + 900;
    p.moveTo(pts[0][0], b.thick ? (pts[0][1] + bottom) / 2 : bottom); p.lineTo(pts[0][0], pts[0][1] + dy);
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], c = pts[i]; const mx = (a[0] + c[0]) / 2; p.quadraticCurveTo(a[0], a[1] - b.bump * .55 + dy, mx, (a[1] + c[1]) / 2 + dy); }
    if (b.thick) {
      // A floating cloud: scalloped underside back to the start.
      const last = pts[pts.length - 1]; p.quadraticCurveTo(last[0] + 60, (last[1] + bottom) / 2, last[0], bottom);
      for (let i = pts.length - 2; i >= 0; i--) { const x = pts[i][0], nx = pts[i + 1][0]; p.quadraticCurveTo((x + nx) / 2, bottom + 26, x, bottom - 4 * Math.sin(i)); }
    } else p.lineTo(pts[pts.length - 1][0], bottom);
    p.closePath();
    return p;
  }
  for (const b of Object.values(bands)) { b.path = bandPath(b); b.inner = bandPath(b, 18); }
  // Bands are cached per light level (they only change with the light), then placed with their layer's transform.
  const bandCache = {};
  function bandBitmap(key, light, blur) {
    const b = bands[key], lb = Math.round(light * 20) / 20, id = `${lb}|${blur}`, slot = bandCache[key] || (bandCache[key] = {});
    if (slot.id === id) return slot;
    const x0 = (b.x0 ?? -260) - 120, x1 = (b.x1 ?? W + 260) + 320, y0 = Math.min(...b.pts.map(p => p[1])) - b.bump - 90, y1 = (b.thick ? b.y + b.thick + 90 : b.y + 700);
    const c = slot.c && slot.c.width === Math.ceil(x1 - x0) ? slot.c : canvas(Math.ceil(x1 - x0), Math.ceil(y1 - y0)), q = c.getContext("2d");
    q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, c.width, c.height); q.translate(-x0, -y0);
    if (blur) q.filter = `blur(${blur}px)`;
    q.save(); q.shadowColor = "rgba(2,10,13,.55)"; q.shadowBlur = 36; q.shadowOffsetY = -10;
    q.fillStyle = mix(b.fill, C.night500, lb * .35); q.fill(b.path); q.restore();
    q.fillStyle = mix(b.shade, C.night700, lb * .3); q.fill(b.inner);
    q.save(); q.clip(b.path); q.globalCompositeOperation = "overlay"; q.globalAlpha = .35; q.fillStyle = q.createPattern(A.fibre, "repeat"); q.fillRect(x0, y0, x1 - x0, y1 - y0); q.restore();
    q.lineWidth = 4; q.strokeStyle = mix(b.rim, C.mint, clamp(lb - .2) * .55); q.globalAlpha = .55 + lb * .35; q.stroke(b.path);
    Object.assign(slot, { c, id, x0, y0 });
    return slot;
  }
  function drawBand(g, name, key, light, blur = 0) {
    const bm = bandBitmap(key, light, blur);
    g.save(); layer(g, name); g.drawImage(bm.c, bm.x0, bm.y0);
    // Below the cached area the band is solid.
    if (!bands[key].thick) { g.fillStyle = mix(bands[key].shade, C.night700, Math.round(light * 20) / 20 * .3); g.fillRect(bm.x0, bm.y0 + bm.c.height - 1, bm.c.width, 1400); }
    g.restore();
  }
  const islandCache = {};
  function islandBitmap(is, lit) {
    const k = Math.round(lit * 20) / 20, id = `${is.id}|${k}`;
    if (islandCache[id]) return islandCache[id];
    const c = canvas(600, 600), q = c.getContext("2d");
    q.filter = `brightness(${lerp(.42, 1.02, k)}) saturate(${lerp(.35, 1.05, k)})`; q.drawImage(is.bmp, 0, 0);
    return (islandCache[id] = c);
  }
  function envelopeStar(g, G, st, light, open, t) {
    const s = st.s, tw = .72 + .28 * Math.sin(t * st.sp * 1.3 + st.ph);
    g.save(); g.translate(st.x, st.y); g.rotate(st.rot);
    const w = s, h = s * .66, o = clamp(open);
    g.globalAlpha = clamp(.45 + light * .45 + o * .3) * (.75 + .25 * tw);
    if (o > 0 && G) {
      G.save(); G.translate(st.x, st.y);
      const rad = s * (.7 + o * .9), gg = G.createRadialGradient(0, -h * .2, 0, 0, -h * .2, rad);
      gg.addColorStop(0, rgba("#ffe39a", .5 * o * (1 - .5 * clamp((o - .9) * 10)))); gg.addColorStop(1, rgba("#ffc94d", 0)); G.fillStyle = gg; G.beginPath(); G.arc(0, -h * .2, rad, 0, TAU); G.fill(); G.restore();
    }
    g.fillStyle = mix("#8fa7a0", C.paper, clamp(light * .8 + o * .4)); g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = mix("#6f8a86", C.fold, clamp(light * .8 + o * .4)); g.beginPath(); g.moveTo(-w / 2, h / 2); g.lineTo(0, 0); g.lineTo(w / 2, h / 2); g.fill();
    if (o > 0) {
      // Light spilling out of the opened letter.
      g.fillStyle = rgba("#ffe7a0", o); g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(0, h * .05); g.fill();
    }
    // Top flap: closed (pointing down) to open (flipped up).
    const fy = lerp(1, -1, ease(o));
    g.fillStyle = fy > 0 ? mix("#a9bdb6", C.paper, clamp(light * .8)) : mix("#cdb48a", C.fold, .5);
    g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(0, -h / 2 + h * .62 * fy); g.closePath(); g.fill();
    if (o < .5) { g.fillStyle = C.gold; g.beginPath(); g.arc(0, -h / 2 + h * .55, s * .12, 0, TAU); g.fill(); }
    g.restore();
  }

  // state: { tau, zoom, zx, zy, light, t, moon: {...}, curtain, starsOpen (seconds since Moonrise), threads 0..1, islandsLit 0..1, rays 0..1 }
  S.draw = (g, G, st) => {
    cam = { tau: st.tau, zoom: st.zoom || 1, zx: st.zx ?? W / 2, zy: st.zy ?? H / 2 };
    const light = st.light ?? .3, t = st.t;
    // Sky gradient, warming toward the Moon as it wakes.
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mix("#04121a", "#0b2a35", light * .5)); sky.addColorStop(.55, mix(C.night800, "#17454d", light * .45)); sky.addColorStop(1, mix("#143a42", "#2a6a6a", light * .35));
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const [mx, my] = S.toScreen("moon", S.MOON.x, S.MOON.y - S.MOON.travel), ms = S.layerScale("moon");
    if (light > .2) {
      const mg = g.createRadialGradient(mx, my, 0, mx, my, 1300 * ms);
      mg.addColorStop(0, rgba("#ffe9b0", .18 * light)); mg.addColorStop(.4, rgba("#7fd8c0", .06 * light)); mg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = mg; g.fillRect(0, 0, W, H);
    }
    // Aurora and far paper ribbons.
    g.save(); layer(g, "farStars");
    const au = g.createRadialGradient(W * .55, -200, 0, W * .55, -200, 1300); au.addColorStop(0, rgba("#67dcb8", .1 + light * .06)); au.addColorStop(1, "rgba(103,220,184,0)");
    g.fillStyle = au; g.fillRect(-400, -1400, W + 800, 2800);
    for (const rb of ribbons) {
      g.beginPath(); const p = rb.pts; g.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) { const m = [(p[i - 1][0] + p[i][0]) / 2, (p[i - 1][1] + p[i][1]) / 2]; g.quadraticCurveTo(p[i - 1][0], p[i - 1][1], m[0], m[1]); }
      for (let i = p.length - 1; i > 0; i--) { const m = [(p[i - 1][0] + p[i][0]) / 2, (p[i - 1][1] + p[i][1]) / 2 + rb.h]; g.quadraticCurveTo(p[i][0], p[i][1] + rb.h * (.6 + .4 * Math.sin(i)), m[0], m[1]); }
      g.closePath(); g.globalAlpha = rb.a * (.8 + light * .5); g.fillStyle = rb.c; g.fill();
    }
    g.globalAlpha = 1; g.restore();
    // Far twinkles.
    g.save(); layer(g, "farStars");
    for (const s of farStars) {
      const a = (.35 + .5 * (.5 + .5 * Math.sin(t * s.sp + s.ph))) * (.55 + light * .45);
      g.globalAlpha = a; g.fillStyle = s.ph > 3 ? C.mint : C.paper;
      g.save(); g.translate(s.x, s.y); g.rotate(Math.PI / 4); g.fillRect(-s.s / 2, -s.s / 2, s.s, s.s); g.restore();
    }
    g.restore();
    // Old Moon behind the curtain.
    g.save(); G.save(); layer(g, "moon"); layer(G, "moon");
    const M = S.MOON, my0 = M.y - M.travel;
    A.moon(g, G, M.x, my0, M.R / 58 * .92, { ...st.moon, t });
    if (st.letterAtMoon) st.letterAtMoon(g, G, M.x, my0);
    A.curtain(g, M.x, my0, M.R, st.curtain || 0, t);
    g.restore(); G.restore();
    drawBand(g, "moon", "wisp", light);
    drawBand(g, "cloudFar", "cloudFar", light);
    // God rays from the Moon, occluded by the paper.
    if ((st.rays || 0) > 0) rays(g, G, st, mx, my);
    // Star-envelopes and their threads.
    g.save(); G.save(); layer(g, "stars"); layer(G, "stars");
    const so = st.starsOpen ?? -1;
    if ((st.threads || 0) > 0) {
      g.save(); g.lineCap = "round"; g.strokeStyle = C.gold; g.lineWidth = 3; G.strokeStyle = "#ffcf5a"; G.lineWidth = 6; G.lineCap = "round";
      threads.forEach((chain, k) => {
        const p = clamp(st.threads * 1.5 - k * .06);
        if (p <= 0) return;
        const segs = chain.length - 1, upto = p * segs;
        for (const c of [g, G]) { c.globalAlpha = c === G ? .3 : .85; c.beginPath(); c.moveTo(stars[chain[0]].x, stars[chain[0]].y);
          for (let i = 1; i <= Math.ceil(upto); i++) { const a = stars[chain[i - 1]], b = stars[chain[i]], f = Math.min(1, upto - (i - 1)); c.lineTo(lerp(a.x, b.x, f), lerp(a.y, b.y, f)); }
          c.stroke(); }
      });
      g.restore();
    }
    for (const s of stars) envelopeStar(g, G, s, light, so < 0 ? 0 : clamp((so - s.open * .9) / .35), t);
    g.restore(); G.restore();
    // Islands, dark until their letters arrive.
    g.save(); G.save(); layer(g, "islands"); layer(G, "islands");
    for (const is of islands) {
      const lit = clamp((st.islandsLit || 0) * 1.6 - (is.id === "bloom" ? 0 : is.id === "ember" ? .25 : .5));
      const bob = Math.sin(t * .6 + is.x) * 6;
      g.save(); g.translate(is.x, is.y + bob);
      const sz = is.size * (1 + .04 * back(lit) * (lit < 1 ? 1 : 0));
      g.drawImage(islandBitmap(is, lit), -sz / 2, -sz / 2, sz, sz);
      if (lit > 0) for (const [lx, ly] of is.lights) {
        const k = clamp(lit * 1.4 - Math.abs(lx) / 260), sc = is.size / 300;
        g.fillStyle = rgba("#ffd77a", k); g.fillRect(lx * sc - 4, ly * sc - 5, 8, 10);
        G.fillStyle = rgba("#ffc94d", .5 * k); G.beginPath(); G.arc(is.x + lx * sc, is.y + bob + ly * sc, 14, 0, TAU); G.fill();
      }
      g.restore();
    }
    g.restore(); G.restore();
    drawBand(g, "cloudMid", "cloudMid", light);
    // Near paper, out of focus.
    drawBand(g, "cloudNear", "cloudNear", light, st.nearBlur ?? 5);
    S.cam = cam;
  };

  function rays(g, G, st, mx, my) {
    const R = S.rays, c = R.getContext("2d"), q = .25;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W / 4, H / 4);
    const gr = c.createRadialGradient(mx * q, my * q, 0, mx * q, my * q, 260);
    gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(.25, "rgba(255,226,160,.55)"); gr.addColorStop(1, "rgba(255,226,160,0)");
    c.fillStyle = gr; c.fillRect(0, 0, W / 4, H / 4);
    // Occluders: the paper in front of the light.
    c.save(); c.scale(q, q); c.fillStyle = "#000";
    for (const [name, key] of [["moon", "wisp"], ["cloudFar", "cloudFar"], ["cloudMid", "cloudMid"]]) { c.save(); layer(c, name); c.fill(bands[key].path); c.restore(); }
    c.restore();
    // Radial blur toward the Moon.
    const R2 = S.rays2, c2 = R2.getContext("2d");
    c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, W / 4, H / 4); c2.globalCompositeOperation = "lighter";
    for (let i = 0; i < 9; i++) { const s = 1 + i * .09; c2.globalAlpha = .16 * (1 - i / 10); c2.setTransform(s, 0, 0, s, mx * q * (1 - s), my * q * (1 - s)); c2.drawImage(R, 0, 0); }
    c2.globalCompositeOperation = "source-over"; c2.globalAlpha = 1;
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = .24 * st.rays; g.drawImage(R2, 0, 0, W, H); g.restore();
    G.save(); G.globalCompositeOperation = "lighter"; G.globalAlpha = .1 * st.rays; G.drawImage(R2, 0, 0, W, H); G.restore();
  }

  window.Sky = S;
  void easeOut;
})();
