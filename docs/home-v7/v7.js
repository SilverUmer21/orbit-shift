// Home v7: title-centred layout (status + missions on top, title with the planet-O in the middle, dock at the bottom)
// in five calm art styles. No ink outlines, soft diffused shadows, gentle gradients, slow eased motion.
let UID7 = 0;
const GP = {
  bloom: { ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62" },
  ember: { ink: "#4b2632", paper: "#ba4f4c", mid: "#e7795f", light: "#f2d8a0", accent: "#62c6b4", gold: "#f1bd4e" },
  void: { ink: "#25274d", paper: "#5753a6", mid: "#8b76c7", light: "#d9d1df", accent: "#76d9c1", gold: "#e4bd5d" },
};
const THEMES = {
  dusk: {
    name: "Dusk Paper", planet: ["bloom-crown", "bloom"], glider: "bloom", extra: "hills",
    sky: ["#0c2229", "#12353c", "#0f2b31", "#08171c"], aurora: [["#8fd9b8", .13], ["#b5a8e6", .08], ["#e8c872", .06]], hill: ["#12383d", "#0c2a2f"], dust: "#e8f3c8",
    text: "#f3ead0", muted: "#b3c4ba", accent: "#e9c86e", accentText: "#2c2310", track: "rgba(243,234,208,.14)", shadow: "rgba(0,0,0,.42)",
    letters: { style: "paper", a: ["#fdf6e1", "#e2d2a2"], ad: "#3f8e7d", b: ["#f8df92", "#dfae4a"], bd: "#c26f63", hi: "rgba(255,255,255,.55)" }, tag: "#8fd9b8",
    panelBg: "rgba(17,52,58,.72)", panelBorder: "rgba(243,234,208,.10)", btn: "pebble", face: ["#1d4c53", "#0f2e34"], icon: "#f3ead0", playIcon: "#3b2c10",
    pebble: { garage: ["#b6ead0", "#6bbf9f", "#3d8f7c"], daily: ["#ffcabf", "#e98f84", "#bf5f59"], friends: ["#ddd5f7", "#a99be0", "#7a6cc0"], settings: ["#fff2cf", "#e3d29a", "#b39f63"], play: ["#fff1bd", "#eecd72", "#cf9f3d"] },
    mcols: ["#8fd9b8", "#b5a8e6", "#f0a196"],
  },
  moon: {
    name: "Moonlit Glass", planet: ["petal-engine", "void"], glider: "void", extra: "stars",
    sky: ["#090d20", "#141939", "#1b1d48", "#090b1c"], aurora: [["#8a7cf0", .16], ["#5fd0e0", .08], ["#ffd98a", .05]], dust: "#d8d2ff",
    text: "#ece9ff", muted: "#a7a3d4", accent: "#ffd98a", accentText: "#2a2010", track: "rgba(236,233,255,.14)", shadow: "rgba(0,0,0,.5)",
    letters: { style: "glow", a: ["#ffffff", "#d3ccff"], ag: "#9d8cff", b: ["#fff0c8", "#ffc978"], bg: "#ffb35c", hi: "rgba(255,255,255,.7)" }, tag: "#b9b0ff",
    panelBg: "rgba(255,255,255,.06)", panelBorder: "rgba(255,255,255,.16)", btn: "glass", icon: "#ece9ff", playIcon: "#2a2010",
    glass: { garage: "#8fe3c8", daily: "#ff9e9e", friends: "#b9adff", settings: "#ffe7a8" }, pebble: { play: ["#fff2cc", "#ffd27f", "#e8a646"] },
    mcols: ["#7fe3d2", "#b9adff", "#ff9e9e"],
  },
  dawn: {
    name: "Dawn Pastel", planet: ["bloom-crown", "ember"], glider: "ember", extra: "clouds", light: true,
    sky: ["#f4c3cf", "#f8d8cb", "#f6e7d4", "#d6e6e3"], aurora: [["#ffffff", .38], ["#ffb3a7", .2], ["#c3b6ff", .14]], dust: "#ffffff",
    text: "#3b2c4a", muted: "#7f6d8c", accent: "#f08a76", accentText: "#ffffff", track: "rgba(59,44,74,.12)", shadow: "rgba(130,70,95,.28)",
    letters: { style: "paper", a: ["#66558a", "#3d2f56"], ad: "#c4b3ef", b: ["#ffa48b", "#ef7360"], bd: "#f5b9ad", hi: "rgba(255,255,255,.4)" }, tag: "#8a6fa0",
    panelBg: "rgba(255,255,255,.55)", panelBorder: "rgba(255,255,255,.85)", btn: "pebble", face: ["#ffffff", "#f8eef0"], icon: "#5b4a78", playIcon: "#ffffff",
    pebble: { garage: ["#d4f3e4", "#9edcc0", "#6fbb9b"], daily: ["#ffd7cf", "#f7a99c", "#e07f72"], friends: ["#e7e1fb", "#c3b8f1", "#9a8bd8"], settings: ["#fff6dc", "#f4e2ad", "#d9c07a"], play: ["#ffc9b8", "#f79a83", "#e0705c"] },
    mcols: ["#5fbf9a", "#9a8bd8", "#e9806f"],
  },
  lantern: {
    name: "Lantern Night", planet: ["ember-furnace", "ember"], glider: "ember", extra: "embers",
    sky: ["#1c0f17", "#2b1520", "#37202a", "#130a10"], aurora: [["#ffb85c", .13], ["#ff7a6b", .08], ["#ffd98a", .05]], dust: "#ffc27a",
    text: "#f7e6c8", muted: "#cdb293", accent: "#ffbe62", accentText: "#2c1a08", track: "rgba(247,230,200,.14)", shadow: "rgba(0,0,0,.5)",
    letters: { style: "paperglow", a: ["#fff4dd", "#f0d6a6"], ad: "#9a4a3b", ag: "#ff9a4a", b: ["#ffd27d", "#f29d40"], bd: "#8a3a2c", bg: "#ff8a3a", hi: "rgba(255,255,255,.5)" }, tag: "#ffc27a",
    panelBg: "rgba(66,32,40,.7)", panelBorder: "rgba(255,210,150,.12)", btn: "pebble", face: ["#4d2632", "#2d141c"], icon: "#f7e6c8", playIcon: "#3a2208",
    pebble: { garage: ["#c8e9cf", "#86c49a", "#4e9469"], daily: ["#ffc2a8", "#f28a64", "#c4573a"], friends: ["#e3d2f2", "#b79ad6", "#8466ad"], settings: ["#fff0cf", "#ebcf92", "#b9944f"], play: ["#ffe2a0", "#ffbe62", "#e08b2e"] },
    mcols: ["#9ed6a8", "#c9a6ec", "#ff9a7a"],
  },
  mist: {
    name: "Morning Mist", planet: ["petal-engine", "bloom"], glider: "bloom", extra: "fog", light: true,
    sky: ["#e9f0eb", "#dbe6e0", "#c9d9d1", "#b2c6bc"], aurora: [["#ffffff", .5], ["#cfe6da", .32], ["#f3dcc4", .26]], dust: "#ffffff",
    text: "#2e4a42", muted: "#6c877e", accent: "#d98e5a", accentText: "#ffffff", track: "rgba(46,74,66,.12)", shadow: "rgba(40,70,60,.26)",
    letters: { style: "paper", a: ["#56766b", "#2f4e47"], ad: "#a9c5b9", b: ["#eaa678", "#cd7f50"], bd: "#ecc9ae", hi: "rgba(255,255,255,.38)" }, tag: "#6c877e",
    panelBg: "rgba(255,255,255,.5)", panelBorder: "rgba(255,255,255,.8)", btn: "pebble", face: ["#ffffff", "#eef3f0"], icon: "#3d5d54", playIcon: "#ffffff",
    pebble: { garage: ["#d9efe4", "#a9d3bf", "#7cae98"], daily: ["#fbe0d0", "#efb595", "#d38c66"], friends: ["#e5e3f2", "#c2bedf", "#9b96c4"], settings: ["#f6f0dd", "#e3d6ae", "#bfae7a"], play: ["#ffd9bd", "#ecab7c", "#d0844f"] },
    mcols: ["#6aae94", "#8f88c4", "#d98e5a"],
  },
};
const ICO = {
  garage: '<path d="M42 24L8 7L15.500 24L8 41Z"/><path d="M15.500 24H42"/>',
  daily: '<path d="M24 4C26 12 37 17 37 30C37 38 31 44 24 44C17 44 11 38 11 30C11 24 14 20 17.500 17C17.500 21.500 19.500 24 22 25C20.500 16.500 21 10 24 4Z"/><path d="M24 40C20.600 40 18.400 37.400 18.400 34.200C18.400 30.600 21.400 28.600 23 25.400C26.600 28.600 29.600 31 29.600 34.400C29.600 37.600 27.400 40 24 40Z"/>',
  friends: '<circle cx="18" cy="17" r="6.500"/><path d="M5 41C5 32 10 27.500 18 27.500C26 27.500 31 32 31 41"/><path d="M30 12.500A6 6 0 1 1 33 24"/><path d="M33.500 28C40 28.500 43 33 43 41"/>',
  settings: '<circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="13.500"/><path d="M24 6.500V10.500M24 37.500V41.500M6.500 24H10.500M37.500 24H41.500M11.600 11.600L14.400 14.400M33.600 33.600L36.400 36.400M36.400 11.600L33.600 14.400M14.400 33.600L11.600 36.400"/>',
  lock: '<path d="M15 22V16A9 9 0 0 1 33 16V22"/><rect x="11" y="22" width="26" height="20" rx="4"/><path d="M24 30V34"/>',
  star: '<path d="M24 5L29.500 18L43.500 19L33 28L36.200 42L24 34.500L11.800 42L15 28L4.500 19L18.500 18Z"/>',
  check: '<path d="M11 25L20 34L37 14"/>',
  flame: '<path d="M24 4C26 12 37 17 37 30C37 38 31 44 24 44C17 44 11 38 11 30C11 24 14 20 17.500 17C17.500 21.500 19.500 24 22 25C20.500 16.500 21 10 24 4Z"/><path d="M24 40C20.600 40 18.400 37.400 18.400 34.200C18.400 30.600 21.400 28.600 23 25.400C26.600 28.600 29.600 31 29.600 34.400C29.600 37.600 27.400 40 24 40Z"/>',
  crown: '<path d="M6 37L4 15L15 25L24 9L33 25L44 15L42 37Z"/>',
};
const ico = (n, size, col, sw = 2.4, fill = "none", extra = "") => `<svg class="ic" viewBox="0 0 48 48" style="width:${size}px;height:${size}px${extra}" fill="${fill}" stroke="${col}" stroke-width="${sw * 48 / size}" stroke-linecap="round" stroke-linejoin="round">${ICO[n]}</svg>`;
const P7 = (c, r, a) => `${(c[0] + Math.cos(a * Math.PI / 180) * r).toFixed(2)} ${(c[1] + Math.sin(a * Math.PI / 180) * r).toFixed(2)}`;
const arc7 = (c, r, a0, a1) => `M${P7(c, r, a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${P7(c, r, a1)}`;
const LBL = { garage: "Garage", daily: "Daily", friends: "Friends", settings: "Settings" };

// ───────── rounded letterforms (skeletons on a 56 cap height, 12 stroke) ─────────
const LET7 = {
  R: { d: "M8 56V7H25C33.500 7 39 12.500 39 21.500C39 30 33.500 35.500 25 35.500H8M25 35.500L39 56", adv: 50 },
  B: { d: "M8 56V7H24C31.500 7 36 11 36 18C36 25 31.500 29.500 24 29.500H8M24 29.500H26C34 29.500 39 34.500 39 42.500C39 51 34 56 26 56H8", adv: 50 },
  I: { d: "M8 7V56", adv: 24 },
  T: { d: "M3 7H39M21 7V56", adv: 50 },
  S: { d: "M37 17C35 10.500 29.500 7 22.500 7C14 7 8 11.500 8 18.500C8 25.500 13.500 28.500 22 30.500C31 32.500 37.500 35.500 37.500 43.500C37.500 51.500 31 56 22.500 56C14 56 8.500 52 6.500 45", adv: 48 },
  H: { d: "M8 7V56M36 7V56M8 31.500H36", adv: 52 },
  F: { d: "M8 56V7H35M8 30.500H29", adv: 44 },
};
const TL = { s: 1.3, y1: 338, y2: 436 };
TL.x1 = (390 - 240 * TL.s) / 2; TL.x2 = (390 - 218 * TL.s) / 2; TL.ox = TL.x1 + 33 * TL.s; TL.oy = TL.y1 + 31.5 * TL.s; TL.cy = (TL.y1 + TL.y2 + 81) / 2;
function titleSVG(T) {
  const L = T.letters, id = ++UID7, s = TL.s, st = 'fill="none" stroke-linecap="round" stroke-linejoin="round"', paper = L.style.startsWith("paper"), glow = L.style.includes("glow");
  let defs = `<linearGradient id="ga${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="${L.a[0]}"/><stop offset="1" stop-color="${L.a[1]}"/></linearGradient><linearGradient id="gb${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="${L.b[0]}"/><stop offset="1" stop-color="${L.b[1]}"/></linearGradient>
  <filter id="sh${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.200"/></filter><filter id="gl${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>`;
  const letter = (ch, x, y, grad, depth, gcol) => {
    const d = LET7[ch].d; let g = `<g transform="translate(${x.toFixed(2)} ${(y - s).toFixed(2)}) scale(${s})">`;
    if (paper) { g += `<path d="${d}" ${st} stroke="${T.shadow}" stroke-width="13" transform="translate(0 8)" filter="url(#sh${id})"/>`; for (const dy of [4.5, 3, 1.5]) g += `<path d="${d}" ${st} stroke="${depth}" stroke-width="12" transform="translate(0 ${dy})"/>`; }
    if (glow) g += `<path d="${d}" ${st} stroke="${gcol}" stroke-width="${paper ? 16 : 18}" opacity="${paper ? .35 : .6}" filter="url(#gl${id})"/>`;
    g += `<path d="${d}" ${st} stroke="url(#${grad}${id})" stroke-width="12"/><path d="${d}" ${st} stroke="${L.hi}" stroke-width="2" transform="translate(-2.600 -2.600)"/>`;
    return g + "</g>";
  };
  let g = "", x = TL.x1 + 66 * s;
  for (const ch of "RBIT") { g += letter(ch, x, TL.y1, "ga", L.ad, L.ag); x += LET7[ch].adv * s; }
  x = TL.x2;
  for (const ch of "SHIFT") { g += letter(ch, x, TL.y2, "gb", L.bd, L.bg); x += LET7[ch].adv * s; }
  const ty = TL.y2 + 81 + 34;
  g += `<text x="195" y="${ty}" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="600" font-size="10" letter-spacing="4.600" fill="${T.tag}">A TINY WORLD IN MOTION</text>`;
  g += `<g transform="translate(0 ${ty + 30})"><g transform="translate(150 -10)">${ico("crown", 13, T.accent, 2, T.accent).replace('<svg', '<svg x="0" y="0"')}</g><text x="169" y="0" font-family="Outfit,sans-serif" font-weight="600" font-size="9.500" letter-spacing="2.600" fill="${T.muted}">BEST</text><text x="208" y="0.500" font-family="Fraunces,serif" font-weight="800" font-size="15" fill="${T.text}">${DATA.best}</text></g>`;
  return `<svg class="title7" viewBox="0 0 390 844"><defs>${defs}</defs>${g}</svg>`;
}

// ───────── buttons ─────────
function pebble(T, kind, S, o = {}) {
  const id = ++UID7, M = S + 18, c = [M / 2, M / 2 - 3], R = S / 2, locked = o.state === "locked";
  const glass = T.btn === "glass" && kind !== "play";
  let s = `<defs><filter id="bl${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${S > 60 ? 6 : 4}"/></filter>`;
  if (glass) {
    const col = locked ? T.muted : T.glass[kind];
    s += `<linearGradient id="gr${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient><radialGradient id="gf${id}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${col}" stop-opacity=".28"/><stop offset="1" stop-color="${col}" stop-opacity=".04"/></radialGradient></defs>`;
    s += `<circle cx="${c[0]}" cy="${c[1] + 6}" r="${R - 2}" fill="#000" opacity=".35" filter="url(#bl${id})"/><circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="url(#gf${id})"/><circle cx="${c[0]}" cy="${c[1]}" r="${R - .7}" fill="none" stroke="url(#gr${id})" stroke-width="1.400"${locked ? ' stroke-dasharray="3 4"' : ""}/>`;
    s += `<g transform="translate(${c[0] - S * .22} ${c[1] - S * .22})">${ico(locked ? "lock" : kind, S * .44, locked ? T.muted : T.icon, 2.200).replace("<svg", '<svg x="0" y="0"')}</g>`;
  } else {
    const [Lc, Mc, Dc] = locked ? (T.light ? ["#eef0ef", "#cfd6d3", "#aab4b0"] : ["#9aa4a1", "#6f7a77", "#4b5552"]) : T.pebble[kind];
    s += `<linearGradient id="gb${id}" x1=".15" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="${Lc}"/><stop offset=".55" stop-color="${Mc}"/><stop offset="1" stop-color="${Dc}"/></linearGradient>`;
    const face = kind === "play" ? [Lc, Mc] : T.face || ["#1d4c53", "#0f2e34"];
    s += `<linearGradient id="gc${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${face[1]}"/><stop offset="1" stop-color="${face[0]}"/></linearGradient></defs>`;
    s += `<circle cx="${c[0]}" cy="${c[1] + 7}" r="${R - 2}" fill="${T.shadow}" filter="url(#bl${id})"/><circle cx="${c[0]}" cy="${c[1]}" r="${R}" fill="url(#gb${id})"/>`;
    s += `<path d="${arc7(c, R - 1.600, 195, 265)}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.600" stroke-linecap="round"/>`;
    const fr = R * (kind === "play" ? .74 : .7);
    s += `<circle cx="${c[0]}" cy="${c[1]}" r="${fr}" fill="url(#gc${id})"/><circle cx="${c[0]}" cy="${c[1]}" r="${fr - .6}" fill="none" stroke="${T.light ? "rgba(0,0,0,.06)" : "rgba(0,0,0,.22)"}" stroke-width="1.200"/>`;
    if (kind === "play") {
      const k = fr * .5, tx = c[0] + k * .16;
      s += `<path d="M${tx - k * .55} ${c[1] - k * .9}L${tx + k} ${c[1]}L${tx - k * .55} ${c[1] + k * .9}Z" fill="${T.playIcon}" stroke="${T.playIcon}" stroke-width="${S * .06}" stroke-linejoin="round"/>`;
    } else {
      const ic = locked ? (T.light ? "#9aa5a1" : "#9fa9a6") : (T.light ? Dc : T.icon);
      s += `<g transform="translate(${c[0] - S * .2} ${c[1] - S * .2})">${ico(locked ? "lock" : kind, S * .4, ic, 2.200).replace("<svg", '<svg x="0" y="0"')}</g>`;
    }
  }
  if (o.badge) s += `<circle cx="${c[0] + R * .72}" cy="${c[1] - R * .72}" r="8.500" fill="#ef7a6b" stroke="${T.light ? "#fff" : T.sky[1]}" stroke-width="2.500"/><text x="${c[0] + R * .72}" y="${c[1] - R * .72 + 3.800}" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="11" fill="#fff">${o.badge}</text>`;
  return `<svg class="peb" viewBox="0 0 ${M} ${M}" style="width:${M}px;height:${M}px">${s}</svg>`;
}
function btn7(T, kind, S, x, y, o = {}) {
  const M = S + 18;
  return `<button class="b7 ${kind}${o.state ? " " + o.state : ""}" data-act="${kind}" aria-label="${o.label || LBL[kind]}${o.state === "locked" ? " (coming soon)" : ""}" style="left:${x - M / 2}px;top:${y - M / 2 + 3}px;width:${M}px">${pebble(T, kind, S, o)}${o.nolabel ? "" : `<small>${o.label || LBL[kind]}</small>`}</button>`;
}

// ───────── status + missions ─────────
function hud7(T) {
  const p = PLAYER.xp / PLAYER.xpMax, c = [26, 26];
  const ring = `<svg viewBox="0 0 52 52" style="width:52px;height:52px"><circle cx="26" cy="26" r="21" fill="${T.light ? "rgba(255,255,255,.7)" : (T.face || ["#1d2350"])[0]}"/><circle cx="26" cy="26" r="21" fill="none" stroke="${T.track}" stroke-width="3.500"/><path d="${arc7(c, 21, -90, -90 + 359.9 * p)}" fill="none" stroke="${T.accent}" stroke-width="3.500" stroke-linecap="round"/><text x="26" y="32.500" text-anchor="middle" font-family="Fraunces,serif" font-weight="800" font-size="19" fill="${T.text}">${PLAYER.level}</text></svg>`;
  return `<button class="lv7" data-act="level" aria-label="Level ${PLAYER.level}">${ring}</button>
  <div class="lvi7"><div class="r"><b>Level ${PLAYER.level}</b><span>${PLAYER.xp} / ${PLAYER.xpMax}</span></div><div class="xp7"><i style="width:${p * 100}%"></i></div><button class="stk7" data-act="streak">${ico("flame", 13, T.accent, 2.400)}<span>${PLAYER.streak}-day streak</span></button></div>
  <button class="pill7 pane" data-act="shop" aria-label="Stars"><span class="coin7">${ico("star", 15, T.accentText, 1.800, T.accentText)}</span><b class="sv2">${DATA.stars}</b><span class="plus7">+</span></button>`;
}
function missions7(T) {
  const rc = DATA.goals.filter(ready).length;
  return `<div class="mcard7 pane"><div class="mh7"><span>Today's missions</span>${rc ? `<em><i></i>${rc} ready</em>` : `<em>${DATA.reset}</em>`}</div><div class="mr7">${DATA.goals.map((m, i) => {
    const done = m.v >= m.t, p = Math.min(1, m.v / m.t), col = T.mcols[i], c = [24, 24];
    const svg = `<svg viewBox="0 0 48 48" style="width:46px;height:46px"><circle cx="24" cy="24" r="19" fill="none" stroke="${T.track}" stroke-width="4"/>${done ? `<circle cx="24" cy="24" r="19" fill="none" stroke="${T.accent}" stroke-width="4"/>` : `<path d="${arc7(c, 19, -90, -90 + 359.9 * p)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`}<circle cx="24" cy="24" r="13.500" fill="${done ? T.accent : (T.light ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.18)")}"/>${done ? `<g transform="translate(15 15)">${ico("check", 18, T.accentText, 2.600).replace("<svg", '<svg x="0" y="0"')}</g>` : `<text x="24" y="29.500" text-anchor="middle" font-family="Fraunces,serif" font-weight="800" font-size="15" fill="${T.text}">${m.v}</text>`}</svg>`;
    return `<button class="mc7${ready(m) ? " ready" : ""}" data-act="missions" aria-label="${m.label}">${svg}<span class="n">${m.short}</span>${ready(m) ? `<span class="cl7">Claim +${m.rw}</span>` : `<span class="c">${Math.min(m.v, m.t)} / ${m.t}</span>`}</button>`;
  }).join("")}</div></div>`;
}
function home7(T) {
  return () => `${hud7(T)}${missions7(T)}${titleSVG(T)}<div class="dock7 pane"></div>
  ${btn7(T, "garage", 46, 58, 768)}${btn7(T, "daily", 46, 128, 768, { badge: "!" })}${btn7(T, "play", 76, 195, 744, { label: "Play" })}${btn7(T, "friends", 46, 262, 768, { state: "locked" })}${btn7(T, "settings", 46, 332, 768)}`;
}

// ───────── ambient world ─────────
function loop7(T) {
  const fl = Array.from({ length: 22 }, (_, i) => ({ x: (i * 97) % 390, y: (i * 211) % 844, r: .8 + (i % 3) * .55, p: i * 1.7, v: 3 + (i % 5) * 1.6 }));
  const extraStars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 53.3) % 390, y: (i * 131.7) % 844, r: .5 + (i % 4) * .3, p: i * .9 }));
  const clouds = Array.from({ length: 5 }, (_, i) => ({ x: i * 110 - 40, y: 120 + (i * 137) % 520, s: .7 + (i % 3) * .25, v: 3 + i % 3 }));
  const glider = GP[T.glider]; let shoot = { t: 4 };
  return (ctx, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); T.sky.forEach((c, i) => g.addColorStop([0, .4, .72, 1][i], c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    [[.18, .22, 270, 0], [.86, .5, 300, 1.7], [.45, .9, 330, 3.1]].forEach(([bx, by, br, ph], i) => {
      const [col, a] = T.aurora[i], x = W * (bx + .07 * Math.sin(t * .06 + ph)), y = H * (by + .04 * Math.cos(t * .045 + ph)), rg = ctx.createRadialGradient(x, y, 0, x, y, br);
      rg.addColorStop(0, colorAlpha(col, a)); rg.addColorStop(1, colorAlpha(col, 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    });
    if (T.extra === "stars" || !T.light) {
      const list = T.extra === "stars" ? stars.concat(extraStars) : stars;
      for (const st of list) { const tw = .5 + Math.sin(t * .8 + (st.phase ?? st.p)) * .5; ctx.globalAlpha = .1 + tw * (T.extra === "stars" ? .55 : .3); ctx.fillStyle = T.dust; ctx.beginPath(); ctx.arc(st.x, st.y, (st.size || st.r * 2) * .7, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    if (T.extra === "stars") {
      if (t > shoot.t) { shoot = { t: t + 9 + Math.random() * 6, s: t, x: 60 + Math.random() * 220, y: 40 + Math.random() * 160 }; }
      const k = t - shoot.s; if (shoot.s && k < 1.2) { const x = shoot.x + k * 180, y = shoot.y + k * 70, a = Math.sin(k / 1.2 * Math.PI); const lg = ctx.createLinearGradient(x - 60, y - 23, x, y); lg.addColorStop(0, "rgba(255,255,255,0)"); lg.addColorStop(1, `rgba(255,255,255,${.7 * a})`); ctx.strokeStyle = lg; ctx.lineWidth = 1.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 60, y - 23); ctx.lineTo(x, y); ctx.stroke(); }
    }
    if (T.extra === "clouds") for (const cl of clouds) {
      const x = ((cl.x + t * cl.v) % 520) - 70, y = cl.y; ctx.save(); ctx.globalAlpha = .42; ctx.fillStyle = "#fff";
      for (const [dx, dy, r] of [[0, 0, 26], [24, -10, 30], [52, 0, 24], [26, 8, 26]]) { ctx.beginPath(); ctx.arc(x + dx * cl.s, y + dy * cl.s, r * cl.s, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    if (T.extra === "fog" || T.extra === "hills") for (let l = 0; l < 2; l++) {
      const base = H * (.8 + l * .07), fg = ctx.createLinearGradient(0, base - 40, 0, H);
      const cA = T.extra === "fog" ? colorAlpha("#ffffff", .5 - l * .12) : colorAlpha(T.hill[l], .9), cB = T.extra === "fog" ? colorAlpha("#ffffff", .15) : colorAlpha(T.hill[l], .95);
      fg.addColorStop(0, cA); fg.addColorStop(1, cB); ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-10, H + 10);
      for (let x = -10; x <= W + 10; x += 12) ctx.lineTo(x, base + Math.sin(x * .012 + t * .05 + l * 2) * 16 + Math.sin(x * .031 + l) * 6);
      ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill();
    }
    if (T.extra === "fog") for (let b = 0; b < 3; b++) { const y = 230 + b * 170 + Math.sin(t * .05 + b) * 12, x = ((t * (6 + b * 2)) % 200) - 100, fg = ctx.createLinearGradient(0, y - 30, 0, y + 30); fg.addColorStop(0, "rgba(255,255,255,0)"); fg.addColorStop(.5, "rgba(255,255,255,.28)"); fg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = fg; ctx.fillRect(x - 100, y - 30, W + 200, 60); }
    // soft drifting motes (fireflies, embers, petals of light)
    for (const f of fl) {
      const up = T.extra === "embers" ? 14 : 5, y = ((f.y - t * f.v * up / 5) % (H + 40) + H + 40) % (H + 40) - 20, x = f.x + Math.sin(t * .4 + f.p) * 14, a = .25 + .35 * (.5 + Math.sin(t * 1.1 + f.p) * .5);
      ctx.save(); ctx.globalAlpha = T.light ? a * .9 : a; ctx.fillStyle = T.dust; ctx.shadowColor = T.dust; ctx.shadowBlur = T.light ? 4 : 10; ctx.beginPath(); ctx.arc(x, y, f.r * (T.extra === "embers" ? 1.2 : 1), 0, TAU); ctx.fill(); ctx.restore();
    }
    // a soft halo behind the title
    const hg = ctx.createRadialGradient(195, TL.cy, 20, 195, TL.cy, 230); hg.addColorStop(0, colorAlpha(T.light ? "#ffffff" : T.accent, T.light ? .45 : .09)); hg.addColorStop(1, colorAlpha(T.light ? "#ffffff" : T.accent, 0)); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
    // the O: the living planet, circled by a little glider on a face-on orbit (the same view as gameplay)
    const r = 26 * TL.s, orb = r + 15, a = t * .42 - .6;
    ctx.save(); ctx.strokeStyle = T.light ? "rgba(60,40,70,.2)" : "rgba(255,255,255,.18)"; ctx.setLineDash([2, 7]); ctx.lineDashOffset = -t * 6; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(TL.ox, TL.oy, orb, 0, TAU); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.shadowColor = T.shadow; ctx.shadowBlur = 22; ctx.shadowOffsetY = 10; ctx.fillStyle = T.sky[2]; ctx.beginPath(); ctx.arc(TL.ox, TL.oy, r * 1.12, 0, TAU); ctx.fill(); ctx.restore();
    OrbitArt.drawLivingPlanet(ctx, T.planet[0], { x: TL.ox, y: TL.oy, radius: r, paletteId: T.planet[1], time: t * .5, reduced: false });
    for (let k = 1; k <= 10; k++) { const ta = a - k * .045; ctx.globalAlpha = (1 - k / 11) * .35; ctx.fillStyle = T.dust; ctx.beginPath(); ctx.arc(TL.ox + Math.cos(ta) * orb, TL.oy + Math.sin(ta) * orb, 2.2 * (1 - k / 12), 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(TL.ox + Math.cos(a) * orb, TL.oy + Math.sin(a) * orb); ctx.rotate(a + Math.PI / 2); ctx.scale(.5, .5); drawGlider(ctx, RIDER, glider, 1, t, 0, false, 0); ctx.restore();
  };
}
function ripple(root, b) {
  const sv = b.querySelector(".peb"), r = sv.getBoundingClientRect(), h = root.getBoundingClientRect(), k = h.width / 390, cx = (r.left - h.left + r.width / 2) / k, cy = (r.top - h.top + r.height / 2 - 3 * k) / k;
  const el = document.createElement("i"); el.className = "rip7"; el.style.left = cx + "px"; el.style.top = cy + "px"; el.style.width = el.style.height = (b.classList.contains("play") ? 80 : 50) + "px"; root.appendChild(el);
  el.animate([{ transform: "translate(-50%,-50%) scale(.8)", opacity: .55 }, { transform: "translate(-50%,-50%) scale(1.9)", opacity: 0 }], { duration: 700, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => el.remove();
}
NAV.shop = "Star shop: coming soon"; NAV.level = "Level 7 · 380 XP to level 8"; NAV.streak = "3-day streak · play today to keep it"; NAV.daily = "→ Daily reward: claim +50 ★"; NAV.garage = "→ Garage"; NAV.settings = "→ Settings"; NAV.friends = "Friends & rivals: coming soon"; NAV.play = "→ Level select"; NAV.missions = "";
const ORDER = ["dusk", "moon", "dawn", "lantern", "mist"];
for (const key of ORDER) {
  const T = THEMES[key], el = document.getElementById(key);
  el.style.cssText += `;--text:${T.text};--muted:${T.muted};--accent:${T.accent};--accentText:${T.accentText};--panelBg:${T.panelBg};--panelBorder:${T.panelBorder};--track:${T.track};--shadow:${T.shadow};--bg:${T.sky[1]}`;
  if (T.light) el.classList.add("lightT");
  setup(key, { cy: 0 }, home7(T), { loop: loop7(T), bind(root) { root.querySelectorAll(".b7").forEach(b => b.addEventListener("pointerdown", () => ripple(root, b))); } });
}
const stage = document.getElementById("stage");
function fit() { const s = Math.min(1, (innerHeight - 84) / H, innerWidth / W); stage.style.transform = `scale(${s})`; stage.style.marginBottom = -(H * (1 - s)) + "px"; }
addEventListener("resize", fit); fit();
function show(k) { document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x.dataset.t === k)); document.querySelectorAll(".phone").forEach(p => p.classList.toggle("on", p.id === k)); history.replaceState(null, "", "#" + k); }
document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => show(b.dataset.t));
show(ORDER.includes(location.hash.slice(1)) ? location.hash.slice(1) : "dusk");
