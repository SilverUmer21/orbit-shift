// Style tiles: the same Home composition in three UI languages. 8px grid, 16px margins, one construction rule set per style.
const TW = 390, TH = 640;
const K = { ivory: "#f4ecc8", cream: "#cfc597", gold: "#edca62", goldD: "#b98a2e", coral: "#ef6e67", coralD: "#a8433f", mint: "#77d5aa", leaf: "#4fae91", leafD: "#2f7f69", lav: "#a99be0", dark: "#0d2d31", ink: "#0a1c20", bg: "#08191d" };
const MISSIONS = [{ l: "Survive 35s", v: 35, t: 35, c: K.mint }, { l: "5 perfect gates", v: 3, t: 5, c: K.lav }, { l: "Pass 12 gates", v: 7, t: 12, c: K.coral }];
const LV = { n: 7, p: .62 };
const GRID = { cols: [62, 128, 195, 262, 328], dockY: 566 };
const xy = (cx, cy, r, a) => [cx + Math.cos(a * Math.PI / 180) * r, cy + Math.sin(a * Math.PI / 180) * r];
const arcPath = (cx, cy, r, a0, a1) => { const [x0, y0] = xy(cx, cy, r, a0), [x1, y1] = xy(cx, cy, r, a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
// monoline glyphs on a 48 grid
const MONO = {
  garage: '<path d="M43 24L7 6L16 24L7 42Z"/><path d="M16 24H43"/>',
  daily: '<path d="M24 5C27 14 37 18 37 30C37 38 31 43 24 43C17 43 11 38 11 30C11 24 14 21 17 18C17 22 19 24 21 25C20 17 21 10 24 5Z"/><path d="M24 40C20.500 40 18 37.500 18 34C18 30.500 21 29 22 26C26 29 30 31 30 34.500C30 38 27.500 40 24 40Z"/>',
  friends: '<circle cx="18" cy="17" r="6.500"/><path d="M5 41C5 32 10 27.500 18 27.500C26 27.500 31 32 31 41"/><path d="M30 12.500A6 6 0 1 1 33 24"/><path d="M33.500 28C40 28.500 43 33 43 41"/>',
  settings: '<circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="13"/><path d="M24 7V11M24 37V41M7 24H11M37 24H41M12 12L14.800 14.800M33.200 33.200L36 36M36 12L33.200 14.800M14.800 33.200L12 36"/>',
  play: '<path d="M15 8L41 24L15 40Z"/>',
  lock: '<path d="M15 22V16A9 9 0 0 1 33 16V22"/><path d="M11 22H37V42H11Z"/><path d="M24 30V34"/>',
  star: '<path d="M24 5L29.500 18L43.500 19L33 28L36.200 42L24 34.500L11.800 42L15 28L4.500 19L18.500 18Z"/>',
};
const mono = (n, cx, cy, size, col, sw = 2.5, fill = "none") => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 48})" fill="${fill}" stroke="${col}" stroke-width="${sw * 48 / size}" stroke-linecap="round" stroke-linejoin="round">${MONO[n]}</g>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-family="${o.f || "Outfit,sans-serif"}" font-weight="${o.w || 700}" font-size="${o.s || 10}" letter-spacing="${o.ls || 0}" fill="${o.c || K.ivory}"${o.st ? ` style="${o.st}"` : ""}>${s}</text>`;
const FR = "font-variation-settings:'SOFT' 0,'WONK' 0,'opsz' 72";

// ═══════════ A · ORBIT MAP (transit-map language: one line weight, circles, stations on lines) ═══════════
function tileA() {
  let s = "";
  const SW = 3, line = "rgba(244,236,200,.3)";
  // top row, centre y = 36
  s += `<circle cx="36" cy="36" r="20" fill="${K.dark}" stroke="rgba(244,236,200,.25)" stroke-width="${SW}"/><path d="${arcPath(36, 36, 20, -90, -90 + 360 * LV.p)}" fill="none" stroke="${K.gold}" stroke-width="${SW}" stroke-linecap="round"/>${T(36, 42, LV.n, { f: "Outfit", w: 800, s: 17 })}`;
  s += T(66, 41, "LV 7", { a: "start", s: 9, ls: 2.4, c: K.cream, w: 700 });
  s += T(344, 42, "120", { a: "end", w: 800, s: 19, c: K.gold }) + mono("star", 362, 36, 20, K.gold, 2.4, K.gold);
  // title: wordmark + a line with two stations
  s += T(195, 112, `ORBIT <tspan fill="${K.gold}">SHIFT</tspan>`, { w: 800, s: 38, ls: 5 });
  s += `<line x1="74" y1="130" x2="316" y2="130" stroke="${K.ivory}" stroke-width="${SW}" stroke-linecap="round"/><circle cx="74" cy="130" r="5.500" fill="${K.dark}" stroke="${K.ivory}" stroke-width="${SW}"/><circle cx="316" cy="130" r="5.500" fill="${K.dark}" stroke="${K.gold}" stroke-width="${SW}"/>`;
  s += T(195, 158, "A TINY WORLD IN MOTION", { s: 9, ls: 4, c: K.mint, w: 600 });
  // missions: a metro line with three stations, line fills with progress
  const mx = [70, 195, 320], my = 436;
  s += T(195, 396, "TODAY'S MISSIONS", { s: 9, ls: 4, c: K.cream, w: 700 });
  s += `<line x1="${mx[0]}" y1="${my}" x2="${mx[2]}" y2="${my}" stroke="${line}" stroke-width="${SW}" stroke-linecap="round"/><line x1="${mx[0]}" y1="${my}" x2="${mx[1] + (mx[2] - mx[1]) * .6}" y2="${my}" stroke="${K.gold}" stroke-width="${SW}" stroke-linecap="round"/>`;
  MISSIONS.forEach((m, i) => {
    const done = m.v >= m.t, c = done ? K.gold : m.c, p = Math.min(1, m.v / m.t);
    s += `<circle cx="${mx[i]}" cy="${my}" r="20" fill="${K.dark}" stroke="rgba(244,236,200,.22)" stroke-width="${SW}"/>${done ? "" : `<path d="${arcPath(mx[i], my, 20, -90, -90 + 359.9 * p)}" fill="none" stroke="${c}" stroke-width="${SW}" stroke-linecap="round"/>`}`;
    s += done ? `<circle cx="${mx[i]}" cy="${my}" r="20" fill="${K.gold}" stroke="${K.ivory}" stroke-width="${SW}"/><path d="M${mx[i] - 7} ${my}L${mx[i] - 2} ${my + 5.500}L${mx[i] + 8} ${my - 6}" fill="none" stroke="${K.ink}" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round"/>` : T(mx[i], my + 5.500, m.v, { f: "Outfit", w: 800, s: 15 });
    s += T(mx[i], my + 40, m.l, { s: 10.500, w: 600 }) + T(mx[i], my + 54, `${m.v}/${m.t}`, { s: 9, c: K.cream, ls: 1.200, w: 600 });
  });
  // dock: a line with stations; Play is the terminus
  const dy = GRID.dockY;
  s += `<line x1="28" y1="${dy}" x2="362" y2="${dy}" stroke="${line}" stroke-width="${SW}" stroke-linecap="round"/>`;
  [["garage", "GARAGE", 0], ["daily", "DAILY", 1], ["friends", "FRIENDS", 3], ["settings", "SETTINGS", 4]].forEach(([g, l, i]) => {
    const x = GRID.cols[i], locked = g === "friends";
    s += `<circle cx="${x}" cy="${dy}" r="21" fill="${K.dark}" stroke="${locked ? "rgba(244,236,200,.5)" : K.ivory}" stroke-width="${SW}"${locked ? ' stroke-dasharray="5 4"' : ""}/>`;
    s += mono(locked ? "lock" : g, x, dy, 24, locked ? "rgba(244,236,200,.6)" : K.ivory, 2.400);
    if (g === "daily") s += `<circle cx="${x + 15.500}" cy="${dy - 15.500}" r="7" fill="${K.coral}" stroke="${K.bg}" stroke-width="3"/>`;
    s += T(x, dy + 42, l, { s: 9, ls: 1.800, c: locked ? "rgba(207,197,151,.55)" : K.cream });
  });
  s += `<circle cx="195" cy="${dy}" r="34" fill="${K.gold}" stroke="${K.ivory}" stroke-width="${SW}"/>` + mono("play", 197, dy, 24, K.ink, 2.400, K.ink) + T(195, dy + 56, "PLAY", { s: 11, ls: 4, c: K.gold, w: 800 });
  return s;
}

// ═══════════ B · POP-UP PAPER (Tearaway-style: stacked sheets, hard shadows, stitched edges, folds) ═══════════
function tileB() {
  const P = { sheet: "#f1e7c1", sheetD: "#d9cd9b", ink: "#1b2a22" };
  const cut = (x, y, w, h, c = 9) => `M${x + c} ${y}H${x + w}V${y + h - c}L${x + w - c} ${y + h}H${x}V${y + c}Z`;
  const card = (x, y, w, h, face, under, c = 9) => `<path d="${cut(x, y, w, h, c)}" fill="rgba(0,0,0,.38)" transform="translate(3 4)"/><path d="${cut(x, y, w, h, c)}" fill="${under}" transform="translate(-2.500 3.500)"/><path d="${cut(x, y, w, h, c)}" fill="${face}"/><path d="M${x + c} ${y + .75}H${x + w}" stroke="rgba(255,255,255,.7)" stroke-width="1.500"/>`;
  let s = "";
  // top row
  s += `<circle cx="39" cy="39" r="22" fill="rgba(0,0,0,.38)"/><circle cx="36" cy="36" r="22" fill="${P.sheet}"/><circle cx="36" cy="36" r="17" fill="none" stroke="${K.goldD}" stroke-width="2.500" stroke-dasharray="3 3"/><path d="${arcPath(36, 36, 17, -90, -90 + 360 * LV.p)}" fill="none" stroke="${K.gold}" stroke-width="2.500"/>${T(36, 42, LV.n, { f: "Fraunces", w: 800, s: 17, c: P.ink, st: FR })}`;
  s += card(290, 18, 84, 36, P.sheet, K.leaf, 7) + `<g transform="translate(300 24) scale(.5)" fill="${K.gold}" stroke="${K.goldD}" stroke-width="2.400" stroke-linejoin="round"><path d="${"M24 3L30 17L45 18.500L34 28.500L37 43L24 35.500L11 43L14 28.500L3 18.500L18 17Z"}"/></g>` + T(350, 42, "120", { f: "Fraunces", w: 800, s: 18, c: P.ink, st: FR });
  // title patch: layered sheets, stitched border, folded corner
  s += `<path d="${cut(60, 74, 270, 82, 14)}" fill="rgba(0,0,0,.38)" transform="translate(4 5)"/><path d="${cut(60, 74, 270, 82, 14)}" fill="${K.leaf}" transform="translate(-5 5)"/><path d="${cut(60, 74, 270, 82, 14)}" fill="${P.sheet}"/>`;
  s += `<path d="${cut(68, 82, 254, 66, 9)}" fill="none" stroke="rgba(27,42,34,.4)" stroke-width="1.600" stroke-dasharray="4 3.500"/><path d="M316 74L330 88H316Z" fill="${P.sheetD}"/>`;
  s += T(195, 124, `Orbit <tspan fill="#c6892a">Shift</tspan>`, { f: "Fraunces", w: 800, s: 44, c: "#13302f", ls: -.5, st: FR });
  s += T(195, 142, "A TINY WORLD IN MOTION", { s: 7.500, ls: 3.400, c: "#4b6460", w: 700 });
  // missions: tags with a coloured under-sheet each
  const tx = [16, 140, 264], SHORT = ["Survive", "Perfect", "Gates"];
  MISSIONS.forEach((m, i) => {
    const done = m.v >= m.t, x = tx[i], y = 388, w = 110, h = 66, p = Math.min(1, m.v / m.t);
    s += card(x, y, w, h, P.sheet, done ? K.gold : m.c, 8) + `<circle cx="${x + 12}" cy="${y + 14}" r="3" fill="${K.bg}"/>`;
    s += `<circle cx="${x + 28}" cy="${y + 34}" r="14" fill="none" stroke="rgba(27,42,34,.16)" stroke-width="4"/><path d="${done ? arcPath(x + 28, y + 34, 14, -90, 269.9) : arcPath(x + 28, y + 34, 14, -90, -90 + 360 * p)}" fill="none" stroke="${done ? K.goldD : shadeColor(m.c, -.25)}" stroke-width="4"/>`;
    s += done ? `<path d="M${x + 22} ${y + 34}l4.500 4.500 8-9.500" fill="none" stroke="${K.goldD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : T(x + 28, y + 39.500, m.v, { f: "Fraunces", w: 800, s: 13, c: P.ink, st: FR });
    s += T(x + 51, y + 31, SHORT[i], { a: "start", s: 10.500, c: P.ink, w: 700 });
    s += T(x + 51, y + 45, `${m.v} / ${m.t}`, { a: "start", s: 9.500, c: "#5a6e68", w: 600, ls: .6 });
  });
  // dock: cards on one baseline
  const dy = GRID.dockY, BX = [48, 114, 195, 276, 342], cards = [["garage", "GARAGE", 0, K.leaf], ["daily", "DAILY", 1, K.coral], ["friends", "FRIENDS", 3, "#8a97b5"], ["settings", "SETTINGS", 4, K.cream]];
  cards.forEach(([g, l, i, under]) => {
    const x = BX[i] - 27, y = dy - 34, locked = g === "friends";
    s += card(x, y, 54, 68, locked ? "#cfc9b0" : P.sheet, under, 8);
    s += mono(locked ? "lock" : g, x + 27, y + 28, 24, locked ? "#6b7a74" : P.ink, 2.600);
    s += T(x + 27, y + 56, l, { s: 7.600, ls: .9, c: locked ? "#6b7a74" : P.ink, w: 800 });
    if (g === "daily") s += `<path d="M${x + 47} ${y - 6}l7 7-7 7-7-7z" fill="${K.coral}" stroke="${K.bg}" stroke-width="2"/>`;
  });
  s += `<path d="${cut(157, dy - 40, 76, 80, 11)}" fill="rgba(0,0,0,.38)" transform="translate(3 4)"/><path d="${cut(157, dy - 40, 76, 80, 11)}" fill="${K.coralD}" transform="translate(-3 4)"/><path d="${cut(157, dy - 40, 76, 80, 11)}" fill="${K.gold}"/><path d="M233 ${dy - 40}V${dy - 26}L219 ${dy - 40}Z" fill="${K.goldD}"/><path d="M168 ${dy - 39.200}H219" stroke="rgba(255,255,255,.6)" stroke-width="1.600"/>`;
  s += `<path d="M182 ${dy - 22}L206 ${dy - 8}L182 ${dy + 6}Z" fill="#241805"/>` + T(195, dy + 30, "PLAY", { f: "Fraunces", w: 800, s: 17, c: "#241805", ls: 1.500, st: FR });
  return s;
}

// ═══════════ C · CELESTIAL ATLAS (engraved instrument: fine gold linework, tick bezels, small caps) ═══════════
function tileC() {
  const G = "#d9b96a", Gd = "rgba(217,185,106,.5)", Gf = "rgba(217,185,106,.22)", SW = 1.300;
  const bezel = (cx, cy, r, n = 48, lit = 0, major = 6, col = G) => { let o = ""; for (let i = 0; i < n; i++) { const a = i * 360 / n - 90, M = i % major === 0, [x0, y0] = xy(cx, cy, r, a), [x1, y1] = xy(cx, cy, r + (M ? 5 : 3), a); o += `<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="${i < lit ? col : Gf}" stroke-width="${M ? 1.500 : 1.100}"/>`; } return o; };
  let s = "";
  // top row
  s += `<circle cx="36" cy="36" r="17" fill="${K.dark}" stroke="${G}" stroke-width="${SW}"/>${bezel(36, 36, 19, 36, Math.round(36 * LV.p), 9)}${T(36, 41.500, LV.n, { f: "Fraunces", w: 600, s: 16, c: G, st: FR })}`;
  s += T(344, 41, "120", { a: "end", f: "Fraunces", w: 600, s: 18, c: G, st: FR }) + mono("star", 362, 36, 18, G, 1.400);
  // title: engraved caps, an orbit crossing the word, plane on the orbit
  s += `<ellipse cx="195" cy="104" rx="152" ry="22" transform="rotate(-5 195 104)" fill="none" stroke="${Gd}" stroke-width="${SW}" stroke-dasharray="1 5"/>`;
  s += T(195, 114, `ORBIT <tspan fill="${G}">SHIFT</tspan>`, { f: "Fraunces", w: 600, s: 31, ls: 9, st: FR });
  s += `<g transform="translate(333 88) rotate(-52) scale(.9)" fill="${G}"><path d="M8 0L-5 -5L-9 0L-5 5Z"/></g>`;
  s += `<line x1="118" y1="140" x2="182" y2="140" stroke="${Gd}" stroke-width="${SW}"/><line x1="208" y1="140" x2="272" y2="140" stroke="${Gd}" stroke-width="${SW}"/><path d="M195 135.500L199.500 140L195 144.500L190.500 140Z" fill="${G}"/>`;
  s += T(195, 164, "A TINY WORLD IN MOTION", { s: 8, ls: 4.200, c: Gd, w: 600 });
  // missions: three bezel dials whose ticks light up with progress
  const mx = [70, 195, 320], my = 436;
  s += T(195, 394, "TODAY'S MISSIONS", { s: 8.500, ls: 4, c: Gd, w: 600 });
  MISSIONS.forEach((m, i) => {
    const done = m.v >= m.t, p = Math.min(1, m.v / m.t), n = 48, lit = Math.round(n * p);
    s += `<circle cx="${mx[i]}" cy="${my}" r="21" fill="${K.dark}" stroke="${Gf}" stroke-width="${SW}"/>${bezel(mx[i], my, 24, n, lit, 6, done ? G : m.c)}`;
    s += done ? `<path d="M${mx[i] - 6} ${my}l4.500 4.500 8-9" fill="none" stroke="${G}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : T(mx[i], my + 5.500, m.v, { f: "Fraunces", w: 600, s: 15, c: K.ivory, st: FR });
    s += T(mx[i], my + 46, m.l.toUpperCase(), { s: 8.500, ls: 1.800, c: K.ivory, w: 600 }) + T(mx[i], my + 59, `${m.v} / ${m.t}`, { s: 8.500, ls: 1.500, c: Gd, w: 600 });
  });
  // dock
  const dy = GRID.dockY;
  [["garage", "GARAGE", 0], ["daily", "DAILY", 1], ["friends", "FRIENDS", 3], ["settings", "SETTINGS", 4]].forEach(([g, l, i]) => {
    const x = GRID.cols[i], locked = g === "friends", col = locked ? Gd : G;
    s += `<circle cx="${x}" cy="${dy}" r="23" fill="${K.dark}" stroke="${col}" stroke-width="${SW}"/><circle cx="${x}" cy="${dy}" r="19.500" fill="none" stroke="${Gf}" stroke-width=".8"/>${bezel(x, dy, 26, 40, 40, 5, col)}`;
    s += mono(locked ? "lock" : g, x, dy, 22, col, 1.500);
    if (g === "daily") s += `<circle cx="${x + 19}" cy="${dy - 19}" r="4.500" fill="${K.coral}"/>`;
    s += T(x, dy + 47, l, { s: 8.500, ls: 2.100, c: locked ? "rgba(217,185,106,.45)" : K.cream, w: 600 });
  });
  s += `<circle cx="195" cy="${dy}" r="31" fill="none" stroke="${G}" stroke-width="${SW}"/>${bezel(195, dy, 34, 60, 60, 5, G)}<circle cx="195" cy="${dy}" r="25" fill="${G}"/><circle cx="195" cy="${dy}" r="25" fill="none" stroke="${K.ink}" stroke-opacity=".35" stroke-width="1"/>` + mono("play", 197, dy, 20, K.ink, 1.400, K.ink) + T(195, dy + 58, "P L A Y", { s: 9.500, ls: 2.500, c: G, w: 700 });
  return s;
}

function tile(id, build) {
  const root = document.getElementById(id); root.innerHTML = `<canvas width="${TW * 2}" height="${TH * 2}"></canvas><svg class="ui" viewBox="0 0 ${TW} ${TH}">${build()}</svg><div class="cap">${root.dataset.name}</div>`;
  const ctx = root.querySelector("canvas").getContext("2d"); ctx.setTransform(2, 0, 0, 2, 0, 0);
  const t0 = performance.now();
  (function f() { world(ctx, (performance.now() - t0) / 1000, { cy: 292, pr: 62, or: 98 }); requestAnimationFrame(f); })();
}
tile("A", tileA); tile("B", tileB); tile("C", tileC);
