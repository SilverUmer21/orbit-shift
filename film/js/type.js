// Fly Them Home · type and stamps: gameplay captions (Lilita One with the logo's stacked hard shadows), the story lines,
// gold postmarks, and the ORBIT / SHIFT logo build.
(() => {
  const { TAU, clamp, lerp, ease, easeOut, back, C, rgba, mix, setFont } = FT;
  const T = {};
  const STYLES = {
    paper: { fill: C.paper, s1: C.mintDark, s2: C.night900 },
    gold: { fill: C.gold, s1: C.ember, s2: C.night900 },
    mint: { fill: C.mint, s1: C.night600, s2: C.night900 },
  };
  // A caption word set in Lilita One with the logo's stacked shadows. o: { style, align, alpha, scale, rot, skew, track, glow }
  T.caption = (g, G, text, x, y, size, o = {}) => {
    const st = STYLES[o.style || "paper"], a = o.alpha ?? 1;
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.rotate(o.rot || 0); if (o.skew) g.transform(1, 0, o.skew, 1, 0, 0);
    const sc = o.scale ?? 1; g.scale(sc * (o.sx ?? 1), sc * (o.sy ?? 1));
    setFont(g, size); g.textAlign = o.align || "center"; g.textBaseline = "alphabetic"; g.letterSpacing = `${o.track ?? size * .02}px`;
    g.globalAlpha = a;
    const d = size * .065;
    g.fillStyle = st.s2; g.fillText(text, 0, d * 2.1);
    g.fillStyle = st.s1; g.fillText(text, 0, d);
    g.fillStyle = st.fill; g.fillText(text, 0, 0);
    g.restore();
    if (G && o.glow) {
      G.save(); G.translate(x, y); G.rotate(o.rot || 0); G.scale(sc, sc); setFont(G, size); G.textAlign = o.align || "center"; G.letterSpacing = `${o.track ?? size * .02}px`;
      G.globalAlpha = a * o.glow; G.fillStyle = st.fill; G.filter = "blur(6px)"; G.fillText(text, 0, 0); G.restore();
    }
  };
  T.measure = (g, text, size, track) => { g.save(); setFont(g, size); g.letterSpacing = `${track ?? size * .02}px`; const w = g.measureText(text).width; g.restore(); return w; };

  // Story line: words rise in one by one. words: [{w, gold}], t: seconds since the line began, out: seconds left (fade).
  T.storyLine = (g, G, words, x, y, size, t, out = 9) => {
    g.save(); setFont(g, size, "Nunito", 800); g.textBaseline = "alphabetic"; g.letterSpacing = "1px";
    const space = g.measureText(" ").width, widths = words.map(w => g.measureText(w.w).width);
    const total = widths.reduce((s, w) => s + w, 0) + space * (words.length - 1);
    let cx = x - total / 2;
    const fade = clamp(out / .45);
    words.forEach((w, i) => {
      const k = easeOut((t - i * .085) / .5), a = clamp((t - i * .085) / .3) * fade;
      if (a > 0) {
        g.globalAlpha = a;
        g.fillStyle = "rgba(4,16,20,.55)"; g.fillText(w.w, cx + 2, y + (1 - k) * 22 + 4);
        g.fillStyle = w.gold ? C.gold : C.paper; g.fillText(w.w, cx, y + (1 - k) * 22);
      }
      cx += widths[i] + space;
    });
    g.restore();
  };

  // Gold postmark (the game's PERFECT stamp), radius r. o: { n, text, rot, alpha, scale }
  T.postmark = (g, G, x, y, r, o = {}) => {
    const a = o.alpha ?? 1; if (a <= 0) return;
    const s = (o.scale ?? 1) * r / 86;
    g.save(); g.translate(x, y); g.rotate(o.rot ?? -.14); g.scale(s, s); g.globalAlpha = a;
    // Cancellation waves trailing off to the right, like a real postmark.
    g.strokeStyle = rgba(C.gold, .85); g.lineWidth = 6; g.lineCap = "round";
    for (let i = -1; i <= 1; i++) { g.beginPath(); for (let k = 0; k <= 24; k++) { const xx = 112 + k * 7, yy = i * 22 + Math.sin(k * .7) * 7; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
    g.setLineDash([4, 10]); g.lineWidth = 10; g.strokeStyle = C.gold; g.beginPath(); g.arc(0, 0, 104, 0, TAU); g.stroke(); g.setLineDash([]);
    g.fillStyle = C.gold; g.beginPath(); g.arc(0, 0, 86, 0, TAU); g.fill();
    g.fillStyle = rgba(C.goldShade, .6); g.beginPath(); g.moveTo(0, 0); g.lineTo(86, 0); g.arc(0, 0, 86, 0, Math.PI / 2); g.closePath(); g.fill();
    g.lineWidth = 5; g.strokeStyle = C.goldShade; g.beginPath(); g.arc(0, 0, 86, 0, TAU); g.stroke();
    setFont(g, o.text && o.text.length > 7 ? 34 : 44); g.textAlign = "center"; g.fillStyle = "#3A1E14"; g.letterSpacing = "2px";
    g.fillText(o.text || "PERFECT", 0, o.n ? -6 : 14);
    if (o.n) { setFont(g, 40); g.fillText(o.n, 0, 42); }
    g.strokeStyle = rgba("#3A1E14", .35); g.lineWidth = 3; g.beginPath(); g.moveTo(-65, 15); g.quadraticCurveTo(0, 27, 65, 15); g.stroke();
    g.restore();
    if (G) {
      // A halo around the stamp only, so its face (and the word) stays readable.
      G.save(); G.translate(x, y); G.scale(s, s); G.globalAlpha = a * (o.glow ?? .45);
      const gg = G.createRadialGradient(0, 0, 92, 0, 0, 175); gg.addColorStop(0, "rgba(255,214,110,.7)"); gg.addColorStop(1, "rgba(255,201,77,0)");
      G.fillStyle = gg; G.beginPath(); G.arc(0, 0, 175, 0, TAU); G.arc(0, 0, 92, 0, TAU, true); G.fill(); G.restore();
    }
  };

  // The logo, built letter by letter. p: { orbit: [per-letter 0..1], shift: 0..1 slide, glint: -1..2 sweep, o: alpha }
  T.LOGO = { size: 250, gap: .86 };
  T.logoLayout = (g, cx, cy, size) => {
    const off = size / 86;
    const line = (text, y, dx) => { const w = T.measure(g, text, size, size * .035); let x = cx - w / 2 + dx; g.save(); setFont(g, size); g.letterSpacing = `${size * .035}px`;
      const letters = [...text].map(ch => { const lw = g.measureText(ch).width; const it = { ch, x, w: lw }; x += lw + size * .035; return it; }); g.restore(); return { y, letters, w }; };
    return { orbit: line("ORBIT", cy - size * .1, -18 * off), shift: line("SHIFT", cy + size * .78, 26 * off), size };
  };
  T.logo = (g, G, lay, p) => {
    const size = lay.size, d = size * .065, a = p.o ?? 1;
    const gx = p.glint > -.5 && p.glint < 1.6 ? lerp(lay.orbit.letters[0].x - 300, lay.shift.letters[4].x + 600, p.glint) : null;
    const band = (c, lx) => { const gr = c.createLinearGradient(lx - 130, 40, lx + 130, -40);
      gr.addColorStop(0, "rgba(255,255,240,0)"); gr.addColorStop(.5, "rgba(255,255,236,.85)"); gr.addColorStop(1, "rgba(255,255,240,0)"); return gr; };
    const letter = (it, y, st, k, dx = 0, blur = 0) => {
      if (k <= 0) return;
      // Each letter folds up from flat on its baseline; the far side shows paper fold while it turns.
      const sy = Math.sin(clamp(k) * Math.PI / 2), cx = it.x + it.w / 2 + dx;
      g.save(); g.translate(cx, y); g.scale(1, Math.max(.001, sy)); setFont(g, size); g.textAlign = "center"; g.letterSpacing = "0px"; g.globalAlpha = a;
      if (blur) g.filter = `blur(${blur}px)`;
      g.fillStyle = st.s2; g.fillText(it.ch, 0, d * 2.1); g.fillStyle = st.s1; g.fillText(it.ch, 0, d);
      g.fillStyle = sy < .55 ? mix(st.fill, C.fold, .6) : st.fill; g.fillText(it.ch, 0, 0);
      if (gx !== null) { g.fillStyle = band(g, gx - cx); g.fillText(it.ch, 0, 0); }
      g.restore();
      if (gx !== null && G) { G.save(); G.translate(cx, y); setFont(G, size); G.textAlign = "center"; G.letterSpacing = "0px"; G.fillStyle = band(G, gx - cx); G.globalAlpha = a; G.fillText(it.ch, 0, 0); G.restore(); }
    };
    lay.orbit.letters.forEach((it, i) => letter(it, lay.orbit.y, STYLES.paper, p.orbit[i] ?? 0));
    if ((p.shift ?? 0) > 0) {
      const k = p.shift, slide = (1 - easeOut(Math.min(1, k))) * 1500 + (k > 1 ? Math.sin((k - 1) * 18) * 30 * Math.exp(-(k - 1) * 7) : 0);
      lay.shift.letters.forEach(it => letter(it, lay.shift.y, STYLES.gold, 1, slide, k < .85 ? 10 * (1 - k) : 0));
    }
  };
  window.FilmType = T;
  void ease; void back; void lerp;
})();
