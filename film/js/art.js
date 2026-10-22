// Fly Them Home · story art: the Blitzedo wordmark sting, the letter (both faces), the wax seal, Old Moon, the curtain
// and Pip. Everything is vector, drawn at film resolution; G is the glow layer (same coordinates, half resolution).
(() => {
  const { TAU, clamp, lerp, ease, easeOut, back, steps, C, rgba, mix, rng, noise1, canvas, fibreTile, setFont } = FT;
  const A = {};

  // ---------- Wordmark (parsed from the website's own SVG, animated the way the site does it).
  A.loadWordmark = async () => {
    const txt = await (await fetch("assets/blitzedo-wordmark.svg")).text();
    const doc = new DOMParser().parseFromString(txt, "image/svg+xml");
    const num = (st, k) => parseFloat(st.match(new RegExp(`--${k}:(-?[\\d.]+)`))[1]);
    A.wm = {
      solid: new Path2D(doc.querySelector(".wm-solid").getAttribute("d")),
      px: [...doc.querySelectorAll(".wm-px")].map(r => { const st = r.getAttribute("style"); return { x: +r.getAttribute("x"), y: +r.getAttribute("y"), w: +r.getAttribute("width"), h: +r.getAttribute("height"), d: num(st, "d"), ox: num(st, "x"), oy: num(st, "y"), p: num(st, "p") }; }),
      sparks: [...doc.querySelectorAll(".wm-spark")].map(r => { const st = r.getAttribute("style"); return { x: +r.getAttribute("x"), y: +r.getAttribute("y"), w: +r.getAttribute("width"), fill: r.getAttribute("fill"), sx: num(st, "sx"), sy: num(st, "sy") }; }),
      zedo: [...doc.querySelectorAll("g[transform] > path")].map(p => ({ d: new Path2D(p.getAttribute("d")), tx: parseFloat(p.getAttribute("transform").match(/translate\(([-\d.]+)/)[1]) })),
      vb: [87, -15, 7683, 1627],
    };
    // The b of the wordmark: its pixel cells (x < 1210), used as the emboss on the wax seal.
    A.bCells = A.wm.px.filter(p => p.x < 1210).map(p => [Math.round((p.x - 86.2) / 159.7), Math.round((p.y - 143.8) / 159.7)]);
  };
  const WM_GLOW = 1.35;
  // t: seconds since the sting began. Draws centred at (x, y) with the wordmark `width` px wide.
  A.wordmark = (g, G, t, x, y, width, alpha = 1) => {
    const wm = A.wm, s = width / wm.vb[2];
    const tf = c => { c.translate(x, y); c.scale(s, s); c.translate(-(wm.vb[0] + wm.vb[2] / 2), -(wm.vb[1] + wm.vb[3] / 2)); };
    g.save(); tf(g); g.globalAlpha = alpha;
    G.save(); tf(G); G.globalAlpha = alpha;
    // zedo settles in smoothly while the pixels snap together.
    const zk = ease((t - .62) / .6);
    if (zk > 0) {
      g.save(); g.globalAlpha = alpha * zk; g.fillStyle = C.ivory; g.translate(0, 1582 + (1 - zk) * 60); g.scale(1, -1);
      for (const z of wm.zedo) { g.save(); g.translate(z.tx, 0); g.fill(z.d); g.restore(); }
      g.restore();
    }
    if (t > 1.36) { g.fillStyle = C.ivory; g.fill(wm.solid); }
    for (const p of wm.px) {
      const st = .22 + p.d * 1.3, k = steps((t - st) / .5, 4);
      if (k <= 0) continue;
      const gt = t - (WM_GLOW + p.p * .7);
      const fill = gt < 0 ? C.ivory : gt < .16 ? C.redGlow : gt < .36 ? C.redMid : gt < .56 ? C.redGlow : C.ivory;
      g.globalAlpha = alpha * k; g.fillStyle = fill;
      const dx = p.ox * (1 - k), dy = p.oy * (1 - k);
      g.fillRect(p.x + dx, p.y + dy, p.w, p.h);
      if (fill !== C.ivory) { G.globalAlpha = alpha * .55; G.fillStyle = fill === C.redMid ? "#ff3a2a" : "#ff7a52"; G.fillRect(p.x - 8, p.y - 8, p.w + 16, p.h + 16); G.globalAlpha = alpha; }
    }
    // Warm pixel sparks drift up off the letters in steps, as on the site.
    wm.sparks.forEach((sp, j) => {
      const st = 1.45 + j * .11, k = (t - st) / .95;
      if (k <= 0 || k >= 1) return;
      const q = steps(k, 9), a = q < .1 ? q * 10 : 1 - q;
      g.globalAlpha = alpha * a; g.fillStyle = sp.fill;
      g.fillRect(sp.x + sp.sx * q * .8, sp.y + sp.sy * q * .8, sp.w, sp.w);
      G.globalAlpha = alpha * a * .8; G.fillStyle = sp.fill; G.fillRect(sp.x + sp.sx * q * .8 - 30, sp.y + sp.sy * q * .8 - 30, sp.w + 60, sp.w + 60);
    });
    g.restore(); G.restore();
  };
  // Where the falling ember leaves the wordmark (the foot of the t), in screen space for a given placement.
  A.wordmarkPoint = (x, y, width) => { const wm = A.wm, s = width / wm.vb[2]; return [x + (3041 - (wm.vb[0] + wm.vb[2] / 2)) * s, y + (1500 - (wm.vb[1] + wm.vb[3] / 2)) * s]; };

  // ---------- The letter.
  A.LW = 520; A.LH = 325;
  A.fibre = null;
  function paperBase(c, w, h, tone = C.paper) {
    const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, mix(tone, "#ffffff", .25)); gr.addColorStop(1, mix(tone, C.fold, .35));
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = .55; g.fillStyle = g.createPattern(A.fibre, "repeat"); g.fillRect(0, 0, w, h); g.restore();
    return g;
  }
  function stamp(g, x, y, w, h) {
    g.save(); g.translate(x, y); g.rotate(.06);
    g.fillStyle = "rgba(58,30,20,.18)"; g.fillRect(-w / 2 + 4, -h / 2 + 6, w, h);
    g.fillStyle = C.paper; g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = C.night700; g.fillRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16);
    // A tiny Old Moon on the stamp.
    g.save(); g.translate(2, 4); g.scale(.42, .42); g.fillStyle = C.gold; g.fill(new Path2D("M18 -58 A58 58 0 1 0 64 34 A46 46 0 1 1 18 -58Z")); g.restore();
    g.fillStyle = C.gold; for (const [sx, sy] of [[-22, -30], [24, -26], [-26, 22]]) { g.beginPath(); g.arc(sx, sy, 2.6, 0, TAU); g.fill(); }
    // Perforations.
    g.fillStyle = C.paper; g.globalCompositeOperation = "destination-out";
    for (let i = 0; i <= 8; i++) for (const yy of [-h / 2, h / 2]) { g.beginPath(); g.arc(-w / 2 + i * w / 8, yy, 3.4, 0, TAU); g.fill(); }
    for (let i = 0; i <= 10; i++) for (const xx of [-w / 2, w / 2]) { g.beginPath(); g.arc(xx, -h / 2 + i * h / 10, 3.4, 0, TAU); g.fill(); }
    g.restore();
  }
  // Front: airmail border, stamp, and "To Moon" written on (write 0..1).
  A.letterFront = (write = 1, k = 2) => {
    const W = A.LW * k, H = A.LH * k, c = canvas(W, H), g = paperBase(c, W, H);
    g.scale(k, k);
    // Airmail border in coral and mint.
    g.save(); g.beginPath(); g.rect(0, 0, A.LW, A.LH); g.rect(16, 16, A.LW - 32, A.LH - 32); g.clip("evenodd");
    for (let i = -20; i < 60; i++) { g.fillStyle = i % 2 ? C.coral : C.mintDark; g.beginPath(); g.moveTo(i * 22, 0); g.lineTo(i * 22 + 11, 0); g.lineTo(i * 22 + 11 - 400, 400); g.lineTo(i * 22 - 400, 400); g.fill(); }
    g.restore();
    g.fillStyle = "rgba(58,30,20,.08)"; g.fillRect(16, 16, A.LW - 32, 3);
    stamp(g, A.LW - 78, 76, 76, 92);
    // Address, written by hand.
    const wx = 62, wy = 196;
    g.save();
    g.beginPath(); g.rect(0, 0, wx + (A.LW - 90) * clamp(write), A.LH); g.clip();
    setFont(g, 84); g.fillStyle = C.ink; g.textBaseline = "alphabetic"; g.fillText("To Moon", wx, wy);
    g.strokeStyle = C.gold; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(wx + 4, wy + 22); g.quadraticCurveTo(wx + 150, wy + 34, wx + 300, wy + 16); g.stroke();
    setFont(g, 22, "Nunito", 800); g.fillStyle = rgba(C.ink, .55); g.fillText("Old Moon · Top of the Night Sky", wx + 6, wy + 62);
    g.restore();
    return c;
  };
  // Back: the four flaps meeting under the seal (seal optional).
  A.letterBack = (withSeal = false, k = 2) => {
    const W = A.LW * k, H = A.LH * k, c = canvas(W, H), g = paperBase(c, W, H);
    g.scale(k, k);
    const w = A.LW, h = A.LH, mx = w / 2, my = h * .56;
    const tri = (pts, fill, line) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fillStyle = fill; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = 1.6; g.stroke(); } };
    tri([[0, 0], [mx, my], [0, h]], rgba(C.fold, .9));
    tri([[w, 0], [mx, my], [w, h]], rgba(C.fold, .75));
    tri([[0, h], [mx, my - 8], [w, h]], rgba("#F4E6C6", 1), rgba(C.ink, .14));
    // Top flap with its own little shadow.
    g.save(); g.shadowColor = "rgba(58,30,20,.22)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
    tri([[0, 0], [mx, my + 18], [w, 0]], C.paper, rgba(C.ink, .12)); g.restore();
    g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = .4; g.fillStyle = g.createPattern(A.fibre, "repeat"); g.fillRect(0, 0, w, h); g.restore();
    if (withSeal) A.seal(g, null, mx, my + 10, 46, { splash: 1, press: 1, heat: 0 });
    return c;
  };
  A.sealPoint = () => [0, A.LH * .56 + 10 - A.LH / 2];

  // ---------- Wax seal with the pixel b pressed in. st: splash 0..1, press 0..1, heat 0..1 (fresh, glowing wax).
  A.seal = (g, G, x, y, r, st) => {
    const sp = clamp(st.splash ?? 1), pr = clamp(st.press ?? 1), heat = clamp(st.heat ?? 0);
    if (sp <= 0) return;
    const R = r * (sp < 1 ? back(sp, 2.2) : 1) * (1 + .06 * Math.sin(pr * Math.PI));
    g.save(); g.translate(x, y);
    // Wax outline: a wobbly puddle with a few drips.
    const blob = new Path2D();
    for (let i = 0; i <= 64; i++) {
      const a = i / 64 * TAU, w = 1 + .07 * noise1(a * 2.2 + 3) + .05 * Math.sin(a * 7 + 1) + (Math.abs(a - 2.1) < .18 ? .14 * Math.cos((a - 2.1) / .18 * Math.PI / 2) : 0);
      const px = Math.cos(a) * R * w, py = Math.sin(a) * R * w;
      i ? blob.lineTo(px, py) : blob.moveTo(px, py);
    }
    blob.closePath();
    g.save(); g.shadowColor = "rgba(40,0,0,.45)"; g.shadowBlur = r * .35; g.shadowOffsetY = r * .14; g.fillStyle = C.redDeep; g.fill(blob); g.restore();
    const gr = g.createRadialGradient(-R * .3, -R * .35, R * .1, 0, 0, R * 1.05);
    gr.addColorStop(0, mix("#e8332a", "#ff6a3a", heat * .7)); gr.addColorStop(.55, mix(C.red, "#f0401f", heat * .5)); gr.addColorStop(1, mix(C.redDeep, "#b8141a", heat * .5));
    g.fillStyle = gr; g.fill(blob);
    // The pressed disc.
    if (pr > 0) {
      const d = R * .7;
      g.save(); g.globalAlpha = clamp(pr * 1.6);
      g.beginPath(); g.arc(0, 0, d, 0, TAU); g.lineWidth = R * .08; g.strokeStyle = rgba("#5a0508", .55); g.stroke();
      g.beginPath(); g.arc(-R * .02, -R * .03, d * .98, Math.PI * 1.05, Math.PI * 1.75); g.strokeStyle = rgba("#ff9a7a", .45); g.lineWidth = R * .05; g.stroke();
      const dg = g.createRadialGradient(0, 0, 0, 0, 0, d); dg.addColorStop(0, mix("#b01217", "#e0451f", heat * .7)); dg.addColorStop(1, mix("#9c0f14", "#c42a18", heat * .5));
      g.beginPath(); g.arc(0, 0, d * .94, 0, TAU); g.fillStyle = dg; g.fill();
      // The b in raised wax cells (7 x 9 grid of the wordmark's pixel b).
      const cell = d * 1.3 / 9, ox = -3.5 * cell, oy = -4.5 * cell;
      for (const [cx, cy] of A.bCells) {
        const px = ox + cx * cell, py = oy + cy * cell;
        g.fillStyle = rgba("#5a0508", .55); g.fillRect(px + cell * .12, py + cell * .14, cell, cell);
        g.fillStyle = mix("#e8332a", "#ff7a4a", heat * .8); g.fillRect(px, py, cell * .96, cell * .96);
        g.fillStyle = rgba("#ffb08a", .55); g.fillRect(px, py, cell * .96, cell * .16);
      }
      g.restore();
    }
    // Specular sheen.
    g.save(); g.globalAlpha = .55; g.fillStyle = "#ffd6c4"; g.beginPath(); g.ellipse(-R * .42, -R * .5, R * .2, R * .09, -.6, 0, TAU); g.fill(); g.restore();
    g.restore();
    if (G) {
      G.save(); G.translate(x, y);
      const a = .12 + heat * .3, rr = R * (1.1 + heat * .7);
      const gg = G.createRadialGradient(0, 0, 0, 0, 0, rr);
      gg.addColorStop(0, rgba("#d8261c", a)); gg.addColorStop(1, rgba("#d8261c", 0));
      G.fillStyle = gg; G.beginPath(); G.arc(0, 0, rr, 0, TAU); G.fill();
      G.fillStyle = rgba("#ffd6c4", .35); G.beginPath(); G.ellipse(-R * .42, -R * .5, R * .22, R * .1, -.6, 0, TAU); G.fill();
      G.restore();
    }
  };

  // ---------- Old Moon (the postmaster). Local units follow the game's postcard art (radius ~58); s scales it.
  const moonBody = new Path2D("M18 -58 A58 58 0 1 0 64 34 A46 46 0 1 1 18 -58Z");
  const moonShade = new Path2D("M-36 30 A58 58 0 0 0 64 34 A46 46 0 0 1 -14 30Z");
  const capPath = new Path2D("M-30 -36 Q-10 -76 28 -62 L18 -46 Q-6 -52 -30 -36Z");
  const capShade = new Path2D("M28 -62 L18 -46 Q4 -50 -8 -46 Q8 -66 28 -62Z");
  const capBand = new Path2D("M-30 -36 L18 -46 L20 -40 Q-6 -46 -28 -30Z");
  // st: awake 0..1 (eye opening), smile 0..1, snore 0..1 (breathing phase), light 0..1 (glow), t time.
  A.moon = (g, G, x, y, s, st) => {
    const t = st.t || 0, aw = clamp(st.awake || 0), light = st.light ?? .3, breathe = Math.sin(t * 1.6) * (1 - aw);
    // Halo.
    if (G) {
      G.save(); G.translate(x, y);
      const r = 58 * s * (1.2 + light * .9), gg = G.createRadialGradient(0, 0, 58 * s * .7, 0, 0, r);
      gg.addColorStop(0, rgba("#ffe7a8", .04 + light * .16)); gg.addColorStop(.5, rgba("#ffd27a", .02 + light * .06)); gg.addColorStop(1, rgba("#ffd27a", 0));
      G.fillStyle = gg; G.beginPath(); G.arc(0, 0, r, 0, TAU); G.fill(); G.restore();
    }
    g.save(); g.translate(x, y);
    const halo = g.createRadialGradient(0, 0, 58 * s * .6, 0, 0, 58 * s * 2.2);
    halo.addColorStop(0, rgba("#fff1c8", .06 + light * .12)); halo.addColorStop(1, rgba("#fff1c8", 0));
    g.fillStyle = halo; g.beginPath(); g.arc(0, 0, 58 * s * 2.2, 0, TAU); g.fill();
    g.scale(s, s); g.rotate(-.06 + breathe * .012);
    g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 18; g.shadowOffsetY = 8; g.fillStyle = mix("#e8dcc0", C.paper, .4 + light * .6); g.fill(moonBody); g.restore();
    g.fillStyle = mix("#c9b58c", C.fold, .3 + light * .7); g.fill(moonShade);
    g.save(); g.clip(moonBody); g.globalCompositeOperation = "overlay"; g.globalAlpha = .5; g.fillStyle = g.createPattern(A.fibre, "repeat"); g.fillRect(-80, -80, 160, 160); g.restore();
    // Craters as soft folded dents.
    g.fillStyle = rgba(C.foldDeep, .45); for (const [cx, cy, cr] of [[-6, 28, 6], [10, 44, 4], [-40, 26, 3.5]]) { g.beginPath(); g.arc(cx, cy, cr, 0, TAU); g.fill(); }
    // Face.
    g.fillStyle = rgba(C.coral, .45); g.beginPath(); g.arc(-38, 4, 5, 0, TAU); g.fill();
    g.strokeStyle = C.ink; g.lineCap = "round"; g.lineWidth = 2.6;
    if (aw < .5) { g.beginPath(); g.moveTo(-31, -9); g.quadraticCurveTo(-26, -4 + aw * 4, -21, -9); g.stroke(); }
    else { const k = (aw - .5) * 2; g.fillStyle = C.ink; g.beginPath(); g.ellipse(-26, -9, 3.6, 4.6 * k + .4, 0, 0, TAU); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(-24.6, -10.8, 1.3 * k, 0, TAU); g.fill(); }
    const sm = clamp(st.smile || 0);
    if (st.snore && aw < .3) { g.fillStyle = C.ink; g.beginPath(); g.ellipse(-27, 15, 2.2 + Math.max(0, breathe) * 1.4, 2.4 + Math.max(0, breathe) * 1.6, 0, 0, TAU); g.fill(); }
    else { g.beginPath(); g.moveTo(-32, 13 - sm); g.quadraticCurveTo(-26, 18 + sm * 4, -20, 13 - sm); g.stroke(); }
    // Nightcap.
    g.save(); g.rotate(breathe * .02 - aw * .04);
    g.fillStyle = C.night700; g.fill(capPath); g.fillStyle = C.night800; g.fill(capShade); g.fillStyle = C.mintMid; g.fill(capBand);
    const bob = Math.sin(t * 2.4) * 2 + aw * Math.sin(t * 9) * 2 * Math.exp(-Math.max(0, t - (st.wokeAt || 0)) * 2);
    g.fillStyle = C.gold; g.beginPath(); g.arc(34, -64 + bob, 6.5, 0, TAU); g.fill(); g.fillStyle = C.goldShade; g.beginPath(); g.arc(35.5, -62.5 + bob, 3.6, 0, TAU); g.fill();
    g.restore();
    g.restore();
  };

  // ---------- The Eclipse: two dark paper drapes in front of the Moon. open 0..1. Centre x of the gap, top/bottom y.
  A.curtain = (g, x, y, R, open, t) => {
    const panel = (side) => {
      const gap = side < 0 ? -.58 * R : .08 * R;
      const inner = x + gap + side * open * 2.1 * R, outer = x + side * 3.1 * R + side * open * 1.2 * R;
      const top = y - 2.6 * R, bottom = y + (1.45 - open * .9) * R, sway = Math.sin(t * .9 + side) * R * .03 * (1 - open);
      const xs = Math.min(inner, outer), xe = Math.max(inner, outer), w = xe - xs, n = 9;
      g.save();
      g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = 30; g.shadowOffsetY = 14;
      for (let i = 0; i < n; i++) {
        const x0 = xs + w * i / n, x1 = xs + w * (i + 1) / n, depth = Math.sin((i / n) * Math.PI) * .5 + .5;
        g.fillStyle = i % 2 ? mix(C.night700, C.night800, .5) : mix(C.night600, C.night700, .4 + .4 * depth);
        g.beginPath(); g.moveTo(x0, top); g.lineTo(x1, top);
        const by = bottom + Math.sin(i * 1.7) * 6 + (side < 0 ? (n - i) : i) * -3 * open;
        g.lineTo(x1 + sway, by); g.quadraticCurveTo((x0 + x1) / 2 + sway, by + R * .12, x0 + sway, by); g.closePath(); g.fill();
        if (i === 0) g.shadowColor = "transparent";
      }
      // Lit hem and the inner edge that catches the moonlight.
      g.strokeStyle = rgba(C.mint, .55); g.lineWidth = 4;
      g.beginPath(); g.moveTo(inner + sway, top); g.lineTo(inner + sway, bottom); g.stroke();
      // A gold tie-back cord.
      g.strokeStyle = C.goldShade; g.lineWidth = 5; g.beginPath(); g.moveTo(xs, y + R * .4); g.quadraticCurveTo((xs + xe) / 2, y + R * .55, xe, y + R * .4); g.stroke();
      g.fillStyle = C.gold; g.beginPath(); g.arc(inner + sway - side * 8, y + R * .42, 8, 0, TAU); g.fill();
      g.restore();
    };
    panel(-1); panel(1);
  };

  // ---------- Pip, rendered from the game's own rig (pip.js) into an image each frame.
  A.pipInit = () => {
    const host = document.getElementById("pipHost");
    A.pip = OrbitPip.create(host, { random: rng(91), dozeAfter: 1e9 });
    A.pipHost = host; A.pipImg = new Image();
  };
  A.pipFrame = async (dt) => {
    A.pip.tick(dt);
    const svg = A.pipHost.innerHTML.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="688" ');
    const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    await img.decode(); A.pipImg = img;
  };
  // Pip's image is 160 x 172 rig units; h = drawn height in px; (x, y) is the centre of the body.
  A.drawPip = (g, x, y, h, rot = 0, alpha = 1) => {
    if (!A.pipImg?.width) return;
    const w = h * 160 / 172;
    g.save(); g.globalAlpha = alpha; g.translate(x, y); g.rotate(rot); g.drawImage(A.pipImg, -w / 2, -h * .52, w, h); g.restore();
  };

  A.init = async () => {
    A.fibre = fibreTile(512, 11);
    await A.loadWordmark();
    A.frontDone = A.letterFront(1); A.backSealed = A.letterBack(true); A.backPlain = A.letterBack(false);
    A.pipInit();
  };
  window.FilmArt = A;
  void lerp; void easeOut;
})();
