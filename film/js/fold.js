// Fly Them Home · a small origami engine. A sheet is a set of facets (polygons in paper coordinates) with an affine map to
// the folded plane. Each fold splits the facets along a line and rotates the flap about it; under an orthographic view
// that rotation is affine, so both faces can be drawn as textures with setTransform. det < 0 means the back is showing.
(() => {
  const { TAU } = FT;
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  const apply = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  const invert = m => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
  const det = m => m[0] * m[3] - m[1] * m[2];
  // Rotation of the folded plane about the line (a, u) by angle th, seen orthographically.
  function rot(a, u, th) {
    const n = [-u[1], u[0]], c = Math.cos(th);
    const L = [u[0] * u[0] + c * n[0] * n[0], u[0] * u[1] + c * n[0] * n[1], u[0] * u[1] + c * n[0] * n[1], u[1] * u[1] + c * n[1] * n[1]];
    const m = [L[0], L[1], L[2], L[3], 0, 0];
    const t = apply(m, a); m[4] = a[0] - t[0]; m[5] = a[1] - t[1];
    return m;
  }
  // Split a polygon by the line (a, u): returns [keep (n·(p-a) <= 0), flap (> 0)].
  function split(poly, a, u) {
    const n = [-u[1], u[0]], s = p => n[0] * (p[0] - a[0]) + n[1] * (p[1] - a[1]);
    const keep = [], flap = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], sp = s(p), sq = s(q);
      if (sp <= 0) keep.push(p); if (sp > 0) flap.push(p);
      if ((sp <= 0) !== (sq <= 0)) { const t = sp / (sp - sq), x = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; keep.push(x); flap.push(x); }
    }
    return [keep.length > 2 ? keep : null, flap.length > 2 ? flap : null];
  }

  function sheet(W, H, front, back) {
    // front/back are canvases covering the sheet, both drawn as seen; the back is mirrored at draw time.
    const base = { poly: [[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]], M: [1, 0, 0, 1, 0, 0], layer: 0 };
    const stages = [[base]], folds = [];
    function addFold(a, u) {
      const len = Math.hypot(u[0], u[1]); u = [u[0] / len, u[1] / len];
      const cur = stages[stages.length - 1], keep = [], flap = [];
      const top = Math.max(...cur.map(f => f.layer)) + 1;
      for (const f of cur) {
        const inv = invert(f.M), plane = f.poly.map(p => apply(f.M, p));
        const [k, fl] = split(plane, a, u);
        if (k) keep.push({ poly: k.map(p => apply(inv, p)), M: f.M, layer: f.layer });
        if (fl) flap.push({ poly: fl.map(p => apply(inv, p)), M: f.M, layer: top + f.layer });
      }
      const R = rot(a, u, Math.PI);
      folds.push({ a, u, keep, flap });
      stages.push([...keep, ...flap.map(f => ({ ...f, M: mul(R, f.M) }))]);
      return folds.length - 1;
    }
    function face(g, f, M, shade, tex) {
      const d = det(M), img = d >= 0 ? front : back;
      g.save();
      g.beginPath(); f.poly.forEach((p, i) => { const q = apply(M, p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath();
      g.clip();
      g.save();
      // Paper coords -> texture pixels; mirror for the back face.
      const sx = img.width / W, sy = img.height / H;
      g.transform(M[0], M[1], M[2], M[3], M[4], M[5]);
      if (d >= 0) g.drawImage(img, -W / 2, -H / 2, W, H);
      else { g.scale(-1, 1); g.drawImage(img, -W / 2, -H / 2, W, H); }
      g.restore();
      const dark = (d < 0 ? .1 : 0) + shade;
      if (dark > 0) { g.fillStyle = `rgba(20,30,34,${Math.min(.8, dark)})`; g.fill(); }
      else if (dark < 0) { g.fillStyle = `rgba(255,250,235,${Math.min(.6, -dark)})`; g.fill(); }
      g.restore();
      void sx; void sy; void tex;
    }
    // angles: array of fold angles 0..PI (one per fold). Draws centred at the origin of g's current transform.
    function draw(g, angles = [], opts = {}) {
      let k = 0; while (k < folds.length && (angles[k] ?? 0) >= Math.PI - 1e-4) k++;
      const th = angles[k] ?? 0;
      if (k >= folds.length || th <= 1e-4) { const list = [...stages[k]].sort((a, b) => a.layer - b.layer); shadow(g, list, opts); for (const f of list) { face(g, f, f.M, 0); if (opts.edge && f.layer > 0) edgeLine(g, f, f.M, opts.edge); } return; }
      const F = folds[k], R = rot(F.a, F.u, th), lift = Math.sin(th);
      const keep = [...F.keep].sort((a, b) => a.layer - b.layer), flap = [...F.flap].sort((a, b) => th < Math.PI / 2 ? b.layer - a.layer : a.layer - b.layer);
      shadow(g, keep, opts);
      for (const f of keep) face(g, f, f.M, 0);
      // The flap's shadow falls onto the sheet while it is up.
      g.save(); g.globalAlpha = .28 * lift; g.fillStyle = "#06141a";
      for (const f of flap) { const M = mul(rot(F.a, F.u, th * .55), f.M); g.beginPath(); f.poly.forEach((p, i) => { const q = apply(M, p); i ? g.lineTo(q[0] + 10 * lift, q[1] + 14 * lift) : g.moveTo(q[0] + 10 * lift, q[1] + 14 * lift); }); g.closePath(); g.fill(); }
      g.restore();
      // Light falls off as the flap turns away, then the far side comes up lit (two-tone shading flips at 90 degrees).
      const c = Math.cos(th), shade = c > 0 ? (1 - c) * .32 : -(-c) * .06 + (1 + c) * .22;
      for (const f of flap) face(g, f, mul(R, f.M), shade);
      if (opts.edge) for (const f of flap) edgeLine(g, f, mul(R, f.M), opts.edge);
      if (opts.crease) opts.crease(F.a, F.u, th);
    }
    // A lit paper edge around a facet.
    function edgeLine(g, f, M, color) {
      g.save(); g.strokeStyle = color; g.lineWidth = 3; g.beginPath(); f.poly.forEach((p, i) => { const q = apply(M, p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); g.stroke(); g.restore();
    }
    function shadow(g, list, opts) {
      if (!opts.shadow) return;
      g.save(); g.globalAlpha = opts.shadow; g.fillStyle = "#04111a"; g.filter = "blur(14px)";
      for (const f of list) { g.beginPath(); f.poly.forEach((p, i) => { const q = apply(f.M, p); i ? g.lineTo(q[0] + 16, q[1] + 26) : g.moveTo(q[0] + 16, q[1] + 26); }); g.closePath(); g.fill(); }
      g.restore();
    }
    // Outline of the folded shape after n completed folds (for morphs and glows).
    function outline(n) { return stages[Math.min(n, stages.length - 1)].map(f => f.poly.map(p => apply(f.M, p))); }
    return { addFold, draw, outline, folds, W, H };
  }
  window.Fold = { sheet, rot, apply, mul };
  void TAU;
})();
