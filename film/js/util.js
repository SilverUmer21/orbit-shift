// Fly Them Home · shared helpers: timing curves, colour tokens, seeded noise, paper textures and type.
(() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, v) => clamp((v - a) / (b - a));
  const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const easeOut = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
  const easeIn = t => { t = clamp(t); return t * t * t; };
  const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const expoOut = t => { t = clamp(t); return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  // Overshoot ("back") and a damped spring, for things that land.
  const back = (t, s = 1.7) => { t = clamp(t); return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  const spring = (t, k = 7, d = 5) => t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(k * t);
  const pulse = (t, a, b) => t <= a || t >= b ? 0 : Math.sin((t - a) / (b - a) * Math.PI);
  const steps = (t, n) => Math.floor(clamp(t) * n) / n;

  const C = {
    night900: "#0A1F24", night800: "#0E2A30", night700: "#12363D", night600: "#1A4A50", night500: "#21585C",
    paper: "#FFF4DC", fold: "#E9D6B0", foldDeep: "#D9C194", ink: "#3A1E14",
    mint: "#A8F0CF", mintMid: "#5ED6A6", mintDark: "#2E9C80",
    gold: "#FFC94D", goldShade: "#E0A93A", ember: "#E0703C", coral: "#FF6F61", coralShade: "#E0574A", muted: "#7FA8A2",
    studio: "#090A08", ivory: "#FBF5EB", red: "#D51D22", redDeep: "#8E0E12", redHot: "#FF5A3C", redGlow: "#FF8A66", redMid: "#E8332A",
  };
  const rgba = (hex, a) => { const v = parseInt(hex.slice(1), 16); return `rgba(${v >> 16},${v >> 8 & 255},${v & 255},${a})`; };
  const mix = (h1, h2, t) => {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const ch = s => Math.round(lerp(a >> s & 255, b >> s & 255, clamp(t)));
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  };

  function rng(seed) { let s = seed >>> 0; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hash = (x, y = 0) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };

  function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

  // A tileable paper-fibre texture (grey around 128), used with "overlay" to give every paper surface tooth.
  function fibreTile(size = 512, seed = 7) {
    const c = canvas(size, size), g = c.getContext("2d"), r = rng(seed);
    const img = g.createImageData(size, size);
    for (let i = 0; i < size * size; i++) { const v = 128 + (r() - .5) * 22; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
    g.putImageData(img, 0, 0);
    g.globalAlpha = .16;
    for (let i = 0; i < 900; i++) {
      const x = r() * size, y = r() * size, a = r() * TAU, l = 6 + r() * 26;
      g.strokeStyle = r() < .5 ? "#fff" : "#000"; g.lineWidth = .6 + r() * .8;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .6) * l * .5, y + Math.sin(a + .6) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    g.globalAlpha = 1;
    return c;
  }

  // Bumpy cut-paper edge along a horizontal band: returns points of the top silhouette.
  function cloudTop(x0, x1, y, seed, bump = 46, step = 34) {
    const r = rng(seed), pts = [];
    for (let x = x0; x <= x1 + step; x += step) pts.push([x, y - (r() * .8 + .2) * bump - Math.sin(x * .004 + seed) * bump * .5]);
    return pts;
  }

  function setFont(g, size, family = "Lilita One", weight = 400) { g.font = `${weight} ${size}px "${family}"`; }

  // Layout: landscape 1920 x 1080 (the film) or vertical 1080 x 1920 (?v=1: WhatsApp Status, Stories, Reels, Shorts).
  const V = /[?&]v=1\b/.test(location.search), W = V ? 1080 : 1920, H = V ? 1920 : 1080;
  window.FT = { V, W, H, TAU, clamp, lerp, inv, ease, easeOut, easeIn, easeInOut, expoOut, back, spring, pulse, steps, C, rgba, mix, rng, hash, noise1, canvas, fibreTile, cloudTop, setFont };
})();
