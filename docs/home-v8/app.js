// Orbit Shift Home v8: one component system, two skins. Every icon is measured and fitted to one optical size and centre.
const W = 390, H = 844, PL = { id: "bloom" }, RIDER = { shape: "manta" };
const NS = "http://www.w3.org/2000/svg";
let UIDN = 0; const uid = () => ++UIDN;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ───────── skins ─────────
const SKINS = {
  dusk: {
    name: "Dusk Paper", planet: ["bloom-crown", "bloom"], glider: { ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62" },
    sky: ["#0d242b", "#123740", "#0f2c33", "#08171c"], aurora: [["#8fd9b8", .12], ["#b5a8e6", .07], ["#e8c872", .06]], dust: "#e8f3c8", hills: ["#12383d", "#0c2a2f"], stars: 30,
    text: "#f3ead0", muted: "#a9bdb3", accent: "#ecc96f", accentD: "#c9963a", accentText: "#2c2310", track: "rgba(243,234,208,.13)", disc: "rgba(0,0,0,.2)",
    panel: "rgba(17,52,58,.72)", panelBorder: "rgba(243,234,208,.11)", shadow: "rgba(0,0,0,.42)", sheet: "#10343a",
    btn: "pebble", face: ["#1a464d", "#0e2c32"], iconA: "#f3ead0", iconB: "#c4bb95", playIcon: "#3b2c10",
    rims: { garage: ["#c2efdd", "#76c6a6", "#3f927e"], daily: ["#ffd2c8", "#ee988b", "#c2625b"], friends: ["#e2dbf8", "#ae9fe2", "#7d6fc2"], settings: ["#fff3d3", "#e6d59e", "#b5a165"], play: ["#fff3c6", "#efcf76", "#cf9e3c"], locked: ["#a3aeab", "#74807d", "#4e5956"] },
    mcols: ["#8fd9b8", "#b5a8e6", "#f0a196"], tag: "#8fd9b8", coral: "#ef7a6b",
    letters: { style: "paper", a: ["#fdf6e1", "#e2d2a2"], ad: "#3f8e7d", b: ["#f8df92", "#dfae4a"], bd: "#c26f63", hi: "rgba(255,255,255,.55)" },
  },
  moon: {
    name: "Moonlit Glass", planet: ["petal-engine", "void"], glider: { ink: "#25274d", paper: "#5753a6", mid: "#8b76c7", light: "#d9d1df", accent: "#76d9c1", gold: "#e4bd5d" },
    sky: ["#0a0e22", "#151a3b", "#1c1e4a", "#0a0b1d"], aurora: [["#8a7cf0", .16], ["#5fd0e0", .08], ["#ffd98a", .05]], dust: "#d8d2ff", stars: 90, shooting: true,
    text: "#eeebff", muted: "#a9a5d6", accent: "#ffd98a", accentD: "#e3a94e", accentText: "#2a2010", track: "rgba(238,235,255,.13)", disc: "rgba(255,255,255,.05)",
    panel: "rgba(255,255,255,.065)", panelBorder: "rgba(255,255,255,.15)", shadow: "rgba(0,0,0,.5)", sheet: "#1a1d44",
    btn: "glass", iconA: "#eeebff", iconB: "#bdb6ee", playIcon: "#2a2010",
    glass: { garage: "#8fe3c8", daily: "#ff9e9e", friends: "#b9adff", settings: "#ffe7a8", locked: "#8f8bb3" },
    rims: { play: ["#fff2cc", "#ffd27f", "#e3a94e"] },
    mcols: ["#7fe3d2", "#b9adff", "#ff9e9e"], tag: "#b9b0ff", coral: "#ff8f8a",
    letters: { style: "glow", a: ["#ffffff", "#d3ccff"], ag: "#9d8cff", b: ["#fff0c8", "#ffc978"], bg: "#ffb35c", hi: "rgba(255,255,255,.7)" },
  },
};
let skinKey = "dusk", S = SKINS.dusk;

// ───────── demo state ─────────
const fresh = () => ({
  stars: 120, best: 842, level: 7, xp: 620, xpMax: 1000, streak: 3, dailyDay: 4, dailyClaimed: false,
  missions: [
    { icon: "timer", name: "Survive 35s", full: "Survive 35 seconds in one run", v: 35, t: 35, rw: 18, claimed: false },
    { icon: "perfect", name: "5 perfect gates", full: "Thread 5 perfect gates", v: 3, t: 5, rw: 20, claimed: false },
    { icon: "gate", name: "Pass 12 gates", full: "Pass 12 living gates", v: 7, t: 12, rw: 18, claimed: false },
  ],
});
let G = fresh();
const DAILY = [20, 25, 30, 40, 50, 60, "chest"];
const NEXT = { chapter: "Bloom", n: 2, name: "Pollen Path", secs: 55, stars: 0 };

// ───────── icon system (24 grid; parts tone a = main, b = shade, c = accent) ─────────
function gearPath() {
  const pts = [];
  for (let t = 0; t < 8; t++) for (const [da, r] of [[-12.5, 7.7], [-7.5, 10.5], [7.5, 10.5], [12.5, 7.7]]) { const rad = (t * 45 + da - 90) * Math.PI / 180; pts.push([12 + Math.cos(rad) * r, 12 + Math.sin(rad) * r]); }
  return "M" + pts.map(p => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z M12 8.6a3.4 3.4 0 1 0 .01 0Z";
}
function starPts(cx, cy, R, r) { return Array.from({ length: 10 }, (_, i) => { const a = (i * 36 - 90) * Math.PI / 180, k = i % 2 ? r : R; return [cx + Math.cos(a) * k, cy + Math.sin(a) * k]; }); }
const SP = starPts(12, 12.6, 10.2, 4.5), poly = p => "M" + p.map(q => q[0].toFixed(2) + " " + q[1].toFixed(2)).join("L") + "Z";
const ICONS = {
  garage: { opt: 1.08, parts: [{ d: "M21.5 3.5L2.5 10.8L10.2 13.6Z", t: "a" }, { d: "M21.5 3.5L10.2 13.6L13.4 21.2Z", t: "b" }] },
  daily: { opt: .97, parts: [{ d: "M3.5 8a1.5 1.5 0 0 1 1.5-1.5h14a1.5 1.5 0 0 1 1.5 1.5v2a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z", t: "a" }, { d: "M4.8 12.2h14.4v7.3a2 2 0 0 1-2 2H6.8a2 2 0 0 1-2-2z", t: "a" }, { d: "M10.8 6.5h2.4v15h-2.4z", t: "c" }, { d: "M12 6.3C9.4 6.3 7.3 5.3 7.6 3.7C7.9 2.4 10.4 2.3 12 6.3Z M12 6.3C14.6 6.3 16.7 5.3 16.4 3.7C16.1 2.4 13.6 2.3 12 6.3Z", t: "c" }] },
  friends: { opt: .98, parts: [{ c: [16.6, 8.6, 3.3], t: "b" }, { d: "M11.6 20.5C11.6 16 13.8 13.4 16.6 13.4C19.4 13.4 21.6 16 21.6 20.5Z", t: "b" }, { c: [9, 8.2, 3.9], t: "a" }, { d: "M2.6 21C2.6 16 5.3 13.3 9 13.3C12.7 13.3 15.4 16 15.4 21Z", t: "a" }] },
  settings: { opt: .94, parts: [{ d: gearPath(), t: "a" }, { d: "M12 6.4a5.6 5.6 0 1 0 .01 0Z M12 8.6a3.4 3.4 0 1 0 .01 0Z", t: "b" }] },
  lock: { opt: .94, parts: [{ d: "M7.6 11V8.2a4.4 4.4 0 0 1 8.8 0V11h-2.3V8.2a2.1 2.1 0 0 0-4.2 0V11z", t: "b" }, { d: "M6.5 10.6h11a1.8 1.8 0 0 1 1.8 1.8v7.3a1.8 1.8 0 0 1-1.8 1.8h-11a1.8 1.8 0 0 1-1.8-1.8v-7.3a1.8 1.8 0 0 1 1.8-1.8z M12 13.6a1.6 1.6 0 0 0-.8 3v2.2h1.6v-2.2a1.6 1.6 0 0 0-.8-3z", t: "a" }] },
  play: { opt: .84, dx: -.085, parts: [{ d: "M8.2 5.3C8.2 4.3 9.3 3.7 10.1 4.2L19.4 10.6C20.2 11.1 20.2 12.9 19.4 13.4L10.1 19.8C9.3 20.3 8.2 19.7 8.2 18.7Z", t: "a" }] },
  star: { opt: 1, parts: [{ d: poly(SP), t: "a" }, { d: poly([[12, 12.6], ...SP.slice(0, 6)]), t: "b" }] },
  flame: { opt: .92, parts: [{ d: "M12 2.4C13.1 6.6 18.6 9.1 18.6 15C18.6 19.1 15.7 21.6 12 21.6C8.3 21.6 5.4 19.1 5.4 15C5.4 12 6.9 10.1 8.8 8.7C8.8 11 9.8 12.3 11.1 12.7C10.3 8.7 10.6 5.2 12 2.4Z", t: "a" }, { d: "M12 20.2C10.2 20.2 9.1 18.9 9.1 17.2C9.1 15.4 10.6 14.3 11.4 12.6C13.3 14.3 14.9 15.6 14.9 17.4C14.9 19 13.8 20.2 12 20.2Z", t: "c" }] },
  crown: { opt: .95, parts: [{ d: "M3.6 17.6L2.6 7.6L8.2 12L12 4.6L15.8 12L21.4 7.6L20.4 17.6Z", t: "a" }, { d: "M3.8 19.2H20.2V20.8A.8.8 0 0 1 19.4 21.6H4.6A.8.8 0 0 1 3.8 20.8Z", t: "b" }] },
  check: { opt: .8, pad: 1.6, parts: [{ d: "M5.5 12.8L10.2 17.4L18.8 7.2", t: "a", s: 3.2 }] },
  timer: { opt: .92, parts: [{ d: "M12 5.4a8.1 8.1 0 1 0 .01 0Z M12 7.8a5.7 5.7 0 1 1-.01 0Z", t: "a" }, { d: "M12 13.5V10", t: "a", s: 2 }, { c: [12, 13.5, 1.3], t: "a" }, { d: "M10.3 2.4h3.4a.9.9 0 0 1 0 1.8h-3.4a.9.9 0 0 1 0-1.8z", t: "c" }, { d: "M17.6 6.1l1.5-1.5a.9.9 0 0 1 1.3 1.3l-1.5 1.5z", t: "c" }] },
  perfect: { opt: .98, parts: [{ d: "M12 2.2L14.5 9.5L21.8 12L14.5 14.5L12 21.8L9.5 14.5L2.2 12L9.5 9.5Z", t: "a" }, { d: "M12 2.2L14.5 9.5L21.8 12L14.5 14.5L12 21.8Z", t: "b" }] },
  gate: { opt: 1.04, pad: 1.5, parts: [{ d: "M19.33 9.33A7.8 7.8 0 1 1 14.67 4.67", t: "a", s: 3 }, { d: "M19.33 7.6L20.8 9.33L19.33 11.06L17.86 9.33Z", t: "c" }, { d: "M14.67 2.94L16.4 4.67L14.67 6.4L12.94 4.67Z", t: "c" }] },
  chest: { opt: .9, parts: [{ d: "M3.6 10.4V8.3C3.6 5.8 5.6 3.8 8.1 3.8H15.9C18.4 3.8 20.4 5.8 20.4 8.3V10.4Z", t: "b" }, { d: "M3.6 11.6H20.4V19.6A1.8 1.8 0 0 1 18.6 21.4H5.4A1.8 1.8 0 0 1 3.6 19.6Z", t: "a" }, { d: "M10.6 9.4h2.8a.6.6 0 0 1 .6.6v3.6a.6.6 0 0 1-.6.6h-2.8a.6.6 0 0 1-.6-.6V10a.6.6 0 0 1 .6-.6z", t: "c" }] },
  plus: { opt: .62, pad: 1.3, parts: [{ d: "M12 6.5V17.5M6.5 12H17.5", t: "a", s: 2.6 }] },
};
const partsSVG = (ic, tn) => ic.parts.map(p => p.c ? `<circle cx="${p.c[0]}" cy="${p.c[1]}" r="${p.c[2]}" fill="${tn[p.t]}"/>` : p.s ? `<path d="${p.d}" fill="none" stroke="${tn[p.t]}" stroke-width="${p.s}" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="${p.d}" fill="${tn[p.t]}" fill-rule="evenodd"/>`).join("");
const ICON_T = {};
function measureIcons() {
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", "48"); svg.setAttribute("height", "48"); svg.style.cssText = "position:absolute;left:-999px;top:0;visibility:hidden"; document.body.appendChild(svg);
  for (const [k, ic] of Object.entries(ICONS)) {
    const g = document.createElementNS(NS, "g"); g.innerHTML = partsSVG(ic, { a: "#000", b: "#000", c: "#000" }); svg.appendChild(g);
    const bb = g.getBBox(), p = ic.pad || 0, x = bb.x - p, y = bb.y - p, w = bb.width + 2 * p, h = bb.height + 2 * p;
    ICON_T[k] = { s: 18 * (ic.opt || 1) / Math.max(w, h), cx: x + w / 2 + (ic.dx || 0) * w, cy: y + h / 2 + (ic.dy || 0) * h };
  }
  svg.remove();
}
function icon(k, size, tn, x, y, cls = "") {
  const T = ICON_T[k], pos = x === undefined ? "" : ` x="${x.toFixed(2)}" y="${y.toFixed(2)}"`;
  return `<svg class="ic ${cls}"${pos} width="${size}" height="${size}" viewBox="0 0 24 24" overflow="visible"><g class="icg" transform="translate(12 12) scale(${T.s.toFixed(4)}) translate(${(-T.cx).toFixed(3)} ${(-T.cy).toFixed(3)})">${partsSVG(ICONS[k], tn)}</g></svg>`;
}
const arcD = (cx, cy, r, a0, a1) => { const p = a => [cx + Math.cos(a * Math.PI / 180) * r, cy + Math.sin(a * Math.PI / 180) * r], [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };

// ───────── buttons ─────────
function pebble(kind, size, o = {}) {
  const M = size + 24, c = M / 2, cy = M / 2 - 3, R = size / 2, locked = o.state === "locked", id = uid();
  const glass = S.btn === "glass" && kind !== "play";
  let s = `<defs><filter id="sh${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${size > 60 ? 5.5 : 4}"/></filter>`;
  let is, tn;
  if (glass) {
    const col = S.glass[locked ? "locked" : kind];
    s += `<radialGradient id="gf${id}" cx=".32" cy=".26" r=".95"><stop offset="0" stop-color="${col}" stop-opacity=".34"/><stop offset="1" stop-color="${col}" stop-opacity=".06"/></radialGradient><linearGradient id="gs${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="${col}" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient></defs>`;
    s += `<circle cx="${c}" cy="${cy + 6}" r="${R - 3}" fill="#000" opacity=".4" filter="url(#sh${id})"/><circle cx="${c}" cy="${cy}" r="${R}" fill="url(#gf${id})"/><circle cx="${c}" cy="${cy}" r="${R - .8}" fill="none" stroke="url(#gs${id})" stroke-width="1.6"${locked ? ' stroke-dasharray="3 3.500"' : ""}/>`;
    s += `<path d="${arcD(c, cy, R - 5, 200, 255)}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.400" stroke-linecap="round"/>`;
    is = size * .58; tn = locked ? { a: S.muted, b: S.muted, c: S.muted } : { a: S.iconA, b: S.iconB, c: col };
  } else {
    const [L, Mi, D] = S.rims[locked ? "locked" : kind], play = kind === "play", fr = R * (play ? .76 : .7);
    s += `<linearGradient id="gr${id}" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="${L}"/><stop offset=".55" stop-color="${Mi}"/><stop offset="1" stop-color="${D}"/></linearGradient>`;
    s += play ? `<radialGradient id="gc${id}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#fff8dc"/><stop offset=".6" stop-color="${Mi}"/><stop offset="1" stop-color="${D}"/></radialGradient></defs>` : `<linearGradient id="gc${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.face[1]}"/><stop offset="1" stop-color="${S.face[0]}"/></linearGradient></defs>`;
    s += `<circle cx="${c}" cy="${cy + 7}" r="${R - 3}" fill="${S.shadow}" filter="url(#sh${id})"/><circle cx="${c}" cy="${cy}" r="${R}" fill="url(#gr${id})"/><path d="${arcD(c, cy, R - 1.7, 198, 262)}" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.700" stroke-linecap="round"/>`;
    s += `<circle cx="${c}" cy="${cy}" r="${fr}" fill="url(#gc${id})"/><circle cx="${c}" cy="${cy}" r="${fr - .6}" fill="none" stroke="rgba(0,0,0,${play ? .12 : .25})" stroke-width="1.200"/>`;
    is = fr * (play ? 1.36 : 1.6);
    tn = play ? { a: S.playIcon, b: S.playIcon, c: S.playIcon } : locked ? { a: "#9aa5a2", b: "#7c8784", c: "#9aa5a2" } : { a: S.iconA, b: S.iconB, c: S.accent };
  }
  s += icon(locked ? "lock" : kind, is, tn, c - is / 2, cy - is / 2, "btnic");
  if (o.badge) s += `<circle class="badge" cx="${(c + R * .72).toFixed(2)}" cy="${(cy - R * .72).toFixed(2)}" r="6.500" fill="${S.coral}" stroke="${S.sky[1]}" stroke-width="2.600"/>`;
  return `<svg class="peb" viewBox="0 0 ${M} ${M}" width="${M}" height="${M}" data-cx="${c}" data-cy="${cy}">${s}</svg>`;
}
const COLS = [51.8, 123.4, 195, 266.6, 338.2], DOCK = { top: 742, h: 80, y: 770, playY: 752, base: 810, small: 46, play: 70 };
function dockBtn(kind, i, o = {}) {
  const size = kind === "play" ? DOCK.play : DOCK.small, M = size + 24, cy = kind === "play" ? DOCK.playY : DOCK.y, top = cy - (M / 2 - 3), cx = COLS[i];
  const label = o.label || kind[0].toUpperCase() + kind.slice(1);
  return `<button class="db ${kind}${o.state ? " " + o.state : ""}" data-act="${kind}" aria-label="${label}${o.state === "locked" ? ", coming soon" : ""}" style="left:${cx - 36}px;top:${top}px;width:72px;height:${DOCK.base + 6 - top}px">
    <span class="pw" style="left:${36 - M / 2}px">${pebble(kind, size, o)}</span><span class="dl" style="top:${DOCK.base - top - 10}px">${label}</span></button>`;
}

// ───────── HUD ─────────
function hud() {
  const p = G.xp / G.xpMax;
  return `<button class="lvb" data-act="level" aria-label="Level ${G.level}, ${G.xp} of ${G.xpMax} XP"><svg viewBox="0 0 52 52" width="52" height="52"><circle cx="26" cy="26" r="21.500" fill="${S.btn === "glass" ? "rgba(255,255,255,.07)" : S.face[0]}"/><circle cx="26" cy="26" r="21.500" fill="none" stroke="${S.track}" stroke-width="3.400"/><path class="xparc" d="${arcD(26, 26, 21.5, -90, -90 + 359.9 * p)}" fill="none" stroke="${S.accent}" stroke-width="3.400" stroke-linecap="round"/><text x="26" y="32.400" text-anchor="middle" class="lvn">${G.level}</text></svg></button>
  <div class="lvi"><div class="row"><b>Level ${G.level}</b><span class="tn">${G.xp} / ${G.xpMax}</span></div><div class="bar"><i style="width:${p * 100}%"></i></div><button class="stk" data-act="level">${icon("flame", 14, { a: S.coral, b: S.coral, c: "#ffe08a" })}<span><b class="stn">${G.streak}</b>-day streak</span></button></div>
  <button class="pill" data-act="shop" aria-label="${G.stars} stars"><span class="coin">${icon("star", 18, { a: S.accentText, b: S.accentText, c: S.accentText })}</span><b class="cnt tn">${G.stars}</b><span class="plus">${icon("plus", 18, { a: S.text })}</span></button>`;
}
function missionTile(m, i) {
  const x = [85, 195, 305][i], done = m.v >= m.t, rdy = done && !m.claimed, p = Math.min(1, m.v / m.t), col = S.mcols[i];
  let ring, inner, ic;
  if (m.claimed) { ring = `<circle cx="27" cy="27" r="22" fill="none" stroke="${S.track}" stroke-width="4"/>`; inner = S.disc; ic = icon("check", 26, { a: S.muted }, 14, 14); }
  else if (rdy) { ring = `<circle cx="27" cy="27" r="22" fill="none" stroke="${S.accent}" stroke-width="4"/>`; inner = S.accent; ic = icon("check", 26, { a: S.accentText }, 14, 14); }
  else { ring = `<circle cx="27" cy="27" r="22" fill="none" stroke="${S.track}" stroke-width="4"/><path d="${arcD(27, 27, 22, -90, -90 + 359.9 * p)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`; inner = S.disc; ic = icon(m.icon, 26, { a: col, b: shadeColor(col, -.25), c: S.text }, 14, 14); }
  const dial = `<svg class="dial" viewBox="0 0 54 54" width="54" height="54" data-cx="27" data-cy="27">${ring}<circle cx="27" cy="27" r="16.500" fill="${inner}"/>${ic}</svg>`;
  const under = m.claimed ? `<span class="ms done">Done</span>` : rdy ? `<span class="claim" data-claim="${i}">Claim +${m.rw} ${icon("star", 11, { a: S.accentText, b: S.accentText })}</span>` : `<span class="ms tn">${m.v} / ${m.t}</span>`;
  return `<button class="mt${rdy ? " ready" : ""}${m.claimed ? " claimed" : ""}" data-act="mission" data-i="${i}" aria-label="${m.full}: ${Math.min(m.v, m.t)} of ${m.t}" style="left:${x - 55 - 17}px"><span class="dw">${dial}</span><span class="mn">${m.name}</span>${under}</button>`;
}
function missions() {
  const n = G.missions.filter(m => m.claimed).length, pips = [0, 1, 2].map(i => `<i class="${i < n ? "on" : ""}"></i>`).join("");
  return `<div class="card pane" style="top:84px;height:148px"><div class="ch"><b>Daily missions</b><span class="timer tn" id="timer"></span></div>
  <button class="chest" data-act="chest" aria-label="Mission chest, ${n} of 3">${icon("chest", 24, { a: S.accent, b: S.accentD, c: S.coral })}<span class="pips">${pips}</span></button>
  ${G.missions.map(missionTile).join("")}</div>`;
}

// ───────── title (rounded paper letters, the O is the living planet drawn on the canvas) ─────────
const LET = {
  R: { d: "M8 56V7H25C33.500 7 39 12.500 39 21.500C39 30 33.500 35.500 25 35.500H8M25 35.500L39 56", adv: 50 },
  B: { d: "M8 56V7H24C31.500 7 36 11 36 18C36 25 31.500 29.500 24 29.500H8M24 29.500H26C34 29.500 39 34.500 39 42.500C39 51 34 56 26 56H8", adv: 50 },
  I: { d: "M8 7V56", adv: 24 }, T: { d: "M3 7H39M21 7V56", adv: 50 },
  S: { d: "M37 17C35 10.500 29.500 7 22.500 7C14 7 8 11.500 8 18.500C8 25.500 13.500 28.500 22 30.500C31 32.500 37.500 35.500 37.500 43.500C37.500 51.500 31 56 22.500 56C14 56 8.500 52 6.500 45", adv: 48 },
  H: { d: "M8 7V56M36 7V56M8 31.500H36", adv: 52 }, F: { d: "M8 56V7H35M8 30.500H29", adv: 44 },
};
const TL = { s: 1.3, y1: 332, y2: 430 };
TL.x1 = (390 - 240 * TL.s) / 2; TL.x2 = (390 - 218 * TL.s) / 2; TL.ox = TL.x1 + 33 * TL.s; TL.oy = TL.y1 + 31.5 * TL.s; TL.cy = (TL.y1 + TL.y2 + 81) / 2;
function nextChip() {
  const st = [0, 1, 2].map(i => icon("star", 14, i < NEXT.stars ? { a: S.accent, b: S.accentD } : { a: S.track, b: S.track })).join("");
  return `<button class="next pane" data-act="next" aria-label="Next level: ${NEXT.name}, ${NEXT.chapter} ${NEXT.n}"><span class="nl">Next</span><b>${NEXT.name}</b><span class="nc">${NEXT.chapter} ${NEXT.n}</span><span class="ns">${st}</span></button>`;
}
function titleSVG() {
  const L = S.letters, id = uid(), s = TL.s, st = 'fill="none" stroke-linecap="round" stroke-linejoin="round"', paper = L.style === "paper", glow = L.style === "glow";
  const defs = `<linearGradient id="ta${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="${L.a[0]}"/><stop offset="1" stop-color="${L.a[1]}"/></linearGradient><linearGradient id="tb${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="${L.b[0]}"/><stop offset="1" stop-color="${L.b[1]}"/></linearGradient><filter id="ts${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.200"/></filter><filter id="tg${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>`;
  const letter = (ch, x, y, gr, depth, gcol) => {
    const d = LET[ch].d; let g = `<g transform="translate(${x.toFixed(2)} ${(y - s).toFixed(2)}) scale(${s})">`;
    if (paper) { g += `<path d="${d}" ${st} stroke="${S.shadow}" stroke-width="13" transform="translate(0 8)" filter="url(#ts${id})"/>`; for (const dy of [4.5, 3, 1.5]) g += `<path d="${d}" ${st} stroke="${depth}" stroke-width="12" transform="translate(0 ${dy})"/>`; }
    if (glow) g += `<path d="${d}" ${st} stroke="${gcol}" stroke-width="18" opacity=".55" filter="url(#tg${id})"/>`;
    return g + `<path d="${d}" ${st} stroke="url(#${gr}${id})" stroke-width="12"/><path d="${d}" ${st} stroke="${L.hi}" stroke-width="2" transform="translate(-2.600 -2.600)"/></g>`;
  };
  let g = "", x = TL.x1 + 66 * s;
  for (const ch of "RBIT") { g += letter(ch, x, TL.y1, "ta", L.ad, L.ag); x += LET[ch].adv * s; }
  x = TL.x2; for (const ch of "SHIFT") { g += letter(ch, x, TL.y2, "tb", L.bd, L.bg); x += LET[ch].adv * s; }
  const ty = TL.y2 + 115;
  g += `<text x="195" y="${ty}" text-anchor="middle" class="tagl" fill="${S.tag}">A TINY WORLD IN MOTION</text>`;
  return `<svg class="title" viewBox="0 0 390 844" width="390" height="844"><defs>${defs}</defs>${g}</svg><div class="best" style="top:${ty + 14}px">${icon("crown", 14, { a: S.accent, b: S.accentD })}<span>BEST</span><b class="tn">${G.best}</b></div>`;
}

// ───────── render ─────────
function render() {
  $("#ui").innerHTML = `${hud()}${missions()}${titleSVG()}${nextChip()}<div class="dock pane" style="top:${DOCK.top}px;height:${DOCK.h}px"></div>
  ${dockBtn("garage", 0)}${dockBtn("daily", 1, { badge: !G.dailyClaimed })}${dockBtn("play", 2)}${dockBtn("friends", 3, { state: "locked" })}${dockBtn("settings", 4)}`;
  tick();
}
function tick() { const el = $("#timer"); if (!el) return; const n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); const d = Math.max(0, m - n) / 1000 | 0, hh = String(d / 3600 | 0).padStart(2, "0"), mm = String((d % 3600) / 60 | 0).padStart(2, "0"), ss = String(d % 60).padStart(2, "0"); el.textContent = `Resets in ${hh}:${mm}:${ss}`; }
setInterval(tick, 1000);

// ───────── feedback: toast, popover, stars flying to the counter ─────────
const phone = () => $("#phone"), fx = () => $("#fx");
function toPhone(el) { const ph = phone().getBoundingClientRect(), k = ph.width / W, r = el.getBoundingClientRect(); return { x: (r.left - ph.left + r.width / 2) / k, y: (r.top - ph.top + r.height / 2) / k, b: (r.bottom - ph.top) / k, l: (r.left - ph.left) / k, r: (r.right - ph.left) / k }; }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 1600); }
function popover(anchor, html, align = "center") {
  const p = $("#pop"), a = toPhone(anchor); p.innerHTML = html; p.className = "pop on";
  const w = p.offsetWidth, left = align === "left" ? 16 : align === "right" ? W - 16 - w : Math.max(16, Math.min(W - 16 - w, a.x - w / 2));
  p.style.left = left + "px"; p.style.top = (a.b + 10) + "px"; p.style.setProperty("--ax", (a.x - left) + "px");
}
const closePop = () => $("#pop").classList.remove("on");
function rollCount(to) { const el = $(".cnt"); if (!el) return; const from = +el.textContent, t0 = performance.now(); (function f(t) { const u = Math.min(1, (t - t0) / 520), e = 1 - (1 - u) ** 3; el.textContent = Math.round(from + (to - from) * e); if (u < 1) requestAnimationFrame(f); })(t0); }
function bump(el) { el?.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration: 260, easing: "cubic-bezier(.3,1.6,.5,1)" }); }
function flyStars(fromPt, n, onDone) {
  const coin = $(".coin"), to = toPhone(coin), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { onDone(); return; }
  let landed = 0;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div"); el.className = "fly"; el.innerHTML = icon("star", 18, { a: S.accent, b: S.accentD }); fx().appendChild(el);
    const sx = fromPt.x + (Math.random() - .5) * 18, sy = fromPt.y + (Math.random() - .5) * 10, cx = sx + (to.x - sx) * .3 + (Math.random() - .5) * 90, cy = Math.min(sy, to.y) - 50 - Math.random() * 50, kf = [];
    for (let j = 0; j <= 16; j++) { const u = j / 16, x = (1 - u) ** 2 * sx + 2 * (1 - u) * u * cx + u * u * to.x, y = (1 - u) ** 2 * sy + 2 * (1 - u) * u * cy + u * u * to.y; kf.push({ transform: `translate(${x}px,${y}px) translate(-50%,-50%) scale(${1.15 - .55 * u}) rotate(${u * 200}deg)`, opacity: j === 0 ? 0 : 1 }); }
    el.animate(kf, { duration: 760, delay: i * 60, easing: "cubic-bezier(.5,0,.4,1)", fill: "both" }).onfinish = () => { el.remove(); bump($(".coin")); if (++landed === n) onDone(); };
  }
}
function spark(btn) {
  const sv = btn.querySelector(".peb"); if (!sv) return; const a = toPhone(sv), y = a.y - 3;
  const r = document.createElement("i"); r.className = "ripple"; r.style.left = a.x + "px"; r.style.top = y + "px"; const d = btn.classList.contains("play") ? 76 : 50; r.style.width = r.style.height = d + "px"; fx().appendChild(r);
  r.animate([{ transform: "translate(-50%,-50%) scale(.85)", opacity: .6 }, { transform: "translate(-50%,-50%) scale(1.8)", opacity: 0 }], { duration: 640, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => r.remove();
}

// ───────── modals ─────────
function openDaily() {
  const m = $("#modal"), tiles = DAILY.map((rw, i) => {
    const d = i + 1, got = d < G.dailyDay || (d === G.dailyDay && G.dailyClaimed), today = d === G.dailyDay && !G.dailyClaimed, chest = rw === "chest";
    const ic = got ? icon("check", 22, { a: S.accentText }) : chest ? icon("chest", 30, { a: S.accent, b: S.accentD, c: S.coral }) : icon("star", 22, { a: S.accent, b: S.accentD });
    return `<div class="day${got ? " got" : ""}${today ? " today" : ""}${chest ? " big" : ""}"><span class="dn">Day ${d}</span><span class="di">${ic}</span><span class="dr">${chest ? "Chest" : "+" + rw}</span></div>`;
  }).join("");
  m.innerHTML = `<div class="mcard"><h3>Daily reward</h3><p>${G.dailyClaimed ? "Come back tomorrow for day " + (G.dailyDay + 1) + "." : "Day " + G.dailyDay + " of 7. Keep the streak to reach the chest."}</p><div class="days">${tiles}</div>
    <button class="cta" data-dclaim ${G.dailyClaimed ? "disabled" : ""}>${G.dailyClaimed ? "Claimed today" : `Claim +${DAILY[G.dailyDay - 1]} ${icon("star", 16, { a: S.accentText, b: S.accentText })}`}</button><button class="txt" data-close>Close</button></div>`;
  $("#scrim").classList.add("on"); m.classList.add("on");
  m.querySelector("[data-close]").onclick = closeModal;
  const b = m.querySelector("[data-dclaim]"); if (b && !G.dailyClaimed) b.onclick = () => {
    const from = toPhone(m.querySelector(".day.today")); G.dailyClaimed = true; G.streak = 4; const amt = DAILY[G.dailyDay - 1];
    closeModal(); setTimeout(() => { render(); flyStars(from, 7, () => { G.stars += amt; rollCount(G.stars); toast(`+${amt} stars · 4-day streak`); }); }, 180);
  };
}
function closeModal() { $("#scrim").classList.remove("on"); $("#modal").classList.remove("on"); }

// ───────── actions ─────────
let launch = { t: 0, dir: 0 };
function onAct(e) {
  const b = e.target.closest("[data-act],[data-claim]"); if (!b) { closePop(); return; }
  if (b.classList.contains("db")) spark(b);
  if (b.dataset.claim !== undefined || e.target.closest("[data-claim]")) {
    const i = +(e.target.closest("[data-claim]") || b).dataset.claim, m = G.missions[i], from = toPhone(e.target.closest("[data-claim]") || b);
    if (m.claimed) return; m.claimed = true; G.xp = Math.min(G.xpMax, G.xp + 40); render(); closePop();
    flyStars(from, 6, () => { G.stars += m.rw; rollCount(G.stars); });
    return;
  }
  const act = b.dataset.act;
  if (act === "mission") { const m = G.missions[+b.dataset.i]; if (m.v >= m.t && !m.claimed) return; popover(b, m.claimed ? `<b>${m.full}</b><span>Claimed. New missions at midnight.</span>` : `<b>${m.full}</b><span>${m.t - m.v} to go · reward +${m.rw} stars</span><div class="pb"><i style="width:${m.v / m.t * 100}%"></i></div>`); return; }
  if (act === "next") { popover(b, `<b>${NEXT.chapter} ${NEXT.n} · ${NEXT.name}</b><span>${NEXT.secs} second voyage. Earn up to 3 stars: finish it, collect 3 fragments, thread 2 perfect gates.</span>`); return; }
  if (act === "chest") { const n = G.missions.filter(m => m.claimed).length; popover(b, `<b>Mission chest</b><span>Claim all 3 missions today to open it: +60 stars and a new trail.</span><div class="pb"><i style="width:${n / 3 * 100}%"></i></div><span class="tn">${n} / 3 claimed</span>`, "right"); return; }
  if (act === "level") { const pips = Array.from({ length: 7 }, (_, i) => `<i class="${i < G.streak ? "on" : ""}${i === 6 ? " gift" : ""}"></i>`).join(""); popover($(".lvb"), `<b>Level ${G.level}</b><span>${G.xpMax - G.xp} XP to level ${G.level + 1}</span><div class="pb"><i style="width:${G.xp / G.xpMax * 100}%"></i></div><b class="sub">${G.streak}-day streak</b><div class="spips">${pips}</div><span>Play every day. Day 7 opens a chest.</span>`, "left"); return; }
  closePop();
  if (act === "daily") { openDaily(); return; }
  if (act === "play") { if (!launch.dir && launch.t === 0) { launch.dir = 1; $("#ui").classList.add("launching"); } return; }
  toast({ garage: "Garage opens here", settings: "Settings open here", friends: "Friends and rivals are coming soon", shop: "Star shop opens here" }[act] || act);
}

// ───────── world ─────────
let starsBG = [], motes = [], shoot = { next: 5 };
function seedWorld() {
  starsBG = Array.from({ length: S.stars }, (_, i) => ({ x: (i * 97.3) % W, y: (i * 151.7) % H, r: .5 + (i % 4) * .32, p: i * 1.3 }));
  motes = Array.from({ length: 20 }, (_, i) => ({ x: (i * 89) % W, y: (i * 211) % H, r: .8 + (i % 3) * .5, p: i * 1.7, v: 3 + (i % 5) * 1.5 }));
}
const ease = u => u < .5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
function drawWorld(ctx, t, dt) {
  const g = ctx.createLinearGradient(0, 0, 0, H); S.sky.forEach((c, i) => g.addColorStop([0, .4, .72, 1][i], c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  [[.18, .2, 270, 0], [.86, .52, 300, 1.7], [.45, .92, 330, 3.1]].forEach(([bx, by, br, ph], i) => { const [col, a] = S.aurora[i], x = W * (bx + .07 * Math.sin(t * .06 + ph)), y = H * (by + .04 * Math.cos(t * .045 + ph)), rg = ctx.createRadialGradient(x, y, 0, x, y, br); rg.addColorStop(0, colorAlpha(col, a)); rg.addColorStop(1, colorAlpha(col, 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); });
  for (const s of starsBG) { const tw = .5 + Math.sin(t * .8 + s.p) * .5; ctx.globalAlpha = .1 + tw * .45; ctx.fillStyle = S.dust; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  if (S.shooting && t > shoot.next) { shoot = { next: t + 9 + Math.random() * 6, s: t, x: 50 + Math.random() * 220, y: 260 + Math.random() * 60 }; }
  if (shoot.s && t - shoot.s < 1.1) { const k = (t - shoot.s) / 1.1, x = shoot.x + k * 170, y = shoot.y + k * 60, a = Math.sin(k * Math.PI), lg = ctx.createLinearGradient(x - 60, y - 22, x, y); lg.addColorStop(0, "rgba(255,255,255,0)"); lg.addColorStop(1, `rgba(255,255,255,${.7 * a})`); ctx.strokeStyle = lg; ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 60, y - 22); ctx.lineTo(x, y); ctx.stroke(); }
  if (S.hills) for (let l = 0; l < 2; l++) { const base = H * (.8 + l * .07); ctx.fillStyle = colorAlpha(S.hills[l], .92); ctx.beginPath(); ctx.moveTo(-10, H + 10); for (let x = -10; x <= W + 10; x += 12) ctx.lineTo(x, base + Math.sin(x * .012 + t * .05 + l * 2) * 16 + Math.sin(x * .031 + l) * 6); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill(); }
  for (const f of motes) { const y = ((f.y - t * f.v) % (H + 40) + H + 40) % (H + 40) - 20, x = f.x + Math.sin(t * .4 + f.p) * 14, a = .2 + .3 * (.5 + Math.sin(t * 1.1 + f.p) * .5); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = S.dust; ctx.shadowColor = S.dust; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, f.r, 0, TAU); ctx.fill(); ctx.restore(); }
  // launch: the planet-O travels to the centre and grows into the gameplay planet
  if (launch.dir) { launch.t = Math.max(0, Math.min(1, launch.t + launch.dir * dt / .95)); if (launch.t === 1 && launch.dir === 1) { launch.dir = 0; launch.hold = t; toast("Level select opens here"); } }
  if (!launch.dir && launch.hold && t - launch.hold > 1.1) { launch.hold = 0; launch.dir = -1; $("#ui").classList.remove("launching"); }
  if (launch.dir === -1 && launch.t === 0) launch.dir = 0;
  const e = ease(launch.t), r0 = 26 * TL.s, r = r0 + (82 - r0) * e, ox = TL.ox + (195 - TL.ox) * e, oy = TL.oy + (455 - TL.oy) * e, orb = (r0 + 15) + (138 - r0 - 15) * e;
  const hg = ctx.createRadialGradient(195, TL.cy, 20, 195, TL.cy, 230); hg.addColorStop(0, colorAlpha(S.accent, .08 * (1 - e))); hg.addColorStop(1, colorAlpha(S.accent, 0)); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
  const a = t * (.42 + e * .6) - .6;
  ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.setLineDash([2, 7]); ctx.lineDashOffset = -t * 6; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(ox, oy, orb, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.shadowColor = S.shadow; ctx.shadowBlur = 22; ctx.shadowOffsetY = 10; ctx.fillStyle = S.sky[2]; ctx.beginPath(); ctx.arc(ox, oy, r * 1.12, 0, TAU); ctx.fill(); ctx.restore();
  OrbitArt.drawLivingPlanet(ctx, S.planet[0], { x: ox, y: oy, radius: r, paletteId: S.planet[1], time: t * .5, reduced: false });
  for (let k = 1; k <= 10; k++) { const ta = a - k * .045; ctx.globalAlpha = (1 - k / 11) * .35; ctx.fillStyle = S.dust; ctx.beginPath(); ctx.arc(ox + Math.cos(ta) * orb, oy + Math.sin(ta) * orb, 2.2 * (1 - k / 12), 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.save(); ctx.translate(ox + Math.cos(a) * orb, oy + Math.sin(a) * orb); ctx.rotate(a + Math.PI / 2); const gs = .5 + .7 * e; ctx.scale(gs, gs); drawGlider(ctx, RIDER, S.glider, 1, t, 0, false, 0); ctx.restore();
}

// ───────── boot ─────────
function applySkin(k) {
  skinKey = k; S = SKINS[k]; const ph = phone();
  for (const [v, val] of Object.entries({ text: S.text, muted: S.muted, accent: S.accent, accentD: S.accentD, accentText: S.accentText, panel: S.panel, panelBorder: S.panelBorder, track: S.track, shadow: S.shadow, sheet: S.sheet, coral: S.coral, bg: S.sky[1] })) ph.style.setProperty("--" + v, val);
  ph.dataset.skin = k; seedWorld(); render();
  $$("#skins button").forEach(b => b.setAttribute("aria-pressed", b.dataset.skin === k));
  try { localStorage.setItem("os-skin", k); } catch { }
}
function boot() {
  measureIcons();
  const cv = $("#world"), r = Math.min(devicePixelRatio || 1, 2); cv.width = W * r; cv.height = H * r; const ctx = cv.getContext("2d"); ctx.setTransform(r, 0, 0, r, 0, 0);
  let k0 = "dusk"; try { k0 = localStorage.getItem("os-skin") || "dusk"; } catch { } if (/^#(dusk|moon)$/.test(location.hash)) k0 = location.hash.slice(1);
  applySkin(SKINS[k0] ? k0 : "dusk");
  phone().addEventListener("click", onAct);
  $("#scrim").onclick = closeModal;
  $$("#skins button").forEach(b => b.onclick = () => applySkin(b.dataset.skin));
  $("#reset").onclick = () => { G = fresh(); closeModal(); closePop(); render(); };
  const stage = $("#stage"), fit = () => { const s = Math.min(1, (innerHeight - 70) / H, (innerWidth - 8) / W); stage.style.transform = `scale(${s})`; stage.style.marginBottom = -(H * (1 - s)) + "px"; };
  addEventListener("resize", fit); fit();
  let last = performance.now(); const t0 = last;
  (function f(now) { const dt = Math.min(.05, (now - last) / 1000); last = now; drawWorld(ctx, (now - t0) / 1000, dt); requestAnimationFrame(f); })(last);
}
boot();
