// Orbit Map Home. Language: one 3px line weight, circles as stations, a route line, gold = the one primary action.
// Grid: 390 wide, 16px margins, dock columns at 46/120/195/270/344, mission columns at 70/195/320.
const OM = { ivory: "#f4ecc8", cream: "#cfc597", gold: "#edca62", coral: "#ef6e67", coralD: "#a8433f", mint: "#77d5aa", dark: "#0d2d31", ink: "#0a1c20", bg: "#08191d", lav: "#a99be0" };
const SW = 3, EDGE = "rgba(244,236,200,.24)", LINE = "rgba(244,236,200,.3)";
const COLS = [46, 120, 195, 270, 344], MCOL = [70, 195, 320];
const Y = { dock: 750, mis: 632 };
const MONO = {
  garage: '<path d="M43 24L7 6L16 24L7 42Z"/><path d="M16 24H43"/>',
  daily: '<path d="M24 5C27 14 37 18 37 30C37 38 31 43 24 43C17 43 11 38 11 30C11 24 14 21 17 18C17 22 19 24 21 25C20 17 21 10 24 5Z"/><path d="M24 40C20.500 40 18 37.500 18 34C18 30.500 21 29 22 26C26 29 30 31 30 34.500C30 38 27.500 40 24 40Z"/>',
  friends: '<circle cx="18" cy="17" r="6.500"/><path d="M5 41C5 32 10 27.500 18 27.500C26 27.500 31 32 31 41"/><path d="M30 12.500A6 6 0 1 1 33 24"/><path d="M33.500 28C40 28.500 43 33 43 41"/>',
  settings: '<circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="13"/><path d="M24 7V11M24 37V41M7 24H11M37 24H41M12 12L14.800 14.800M33.200 33.200L36 36M36 12L33.200 14.800M14.800 33.200L12 36"/>',
  play: '<path d="M15 8L41 24L15 40Z"/>',
  lock: '<path d="M15 22V16A9 9 0 0 1 33 16V22"/><path d="M11 22H37V42H11Z"/><path d="M24 30V34"/>',
  star: '<path d="M24 5L29.500 18L43.500 19L33 28L36.200 42L24 34.500L11.800 42L15 28L4.500 19L18.500 18Z"/>',
  check: '<path d="M10 25L20 35L38 13"/>',
};
const gl = (n, size, col, sw = 2.5, fill = "none") => `<svg class="g" viewBox="0 0 48 48" style="width:${size}px;height:${size}px" fill="${fill}" stroke="${col}" stroke-width="${sw * 48 / size}" stroke-linecap="round" stroke-linejoin="round">${MONO[n]}</svg>`;
const arc = (cx, cy, r, a0, a1) => { const p = a => [cx + Math.cos(a * Math.PI / 180) * r, cy + Math.sin(a * Math.PI / 180) * r], [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
const PL = { level: 7, xp: 620, max: 1000, streak: 3 };
let popOpen = false;

// ---------- station buttons ----------
function station(o) {
  const { cx, cy, r = 22, glyph, label, act, state = "idle", dot = false, style = "" } = o, locked = state === "locked", col = locked ? "rgba(244,236,200,.55)" : OM.ivory;
  return `<button class="stn ${state}" data-act="${act || glyph}" aria-label="${label}${locked ? " (coming soon)" : ""}" style="left:${cx - 36}px;top:${cy - r - 4}px;${style}">
    <svg class="sc" viewBox="0 0 72 ${r * 2 + 8}" style="width:72px;height:${r * 2 + 8}px"><circle class="ring" cx="36" cy="${r + 4}" r="${r - 1.5}" fill="${OM.dark}" stroke="${col}" stroke-width="${SW}"${locked ? ' stroke-dasharray="5 4"' : ""}/></svg>
    <span class="gw" style="top:${r + 4 - 12}px">${gl(locked ? "lock" : glyph, 24, col, 2.4)}</span>${dot ? `<i class="dot" style="top:${4}px;left:${36 + r * .72}px"></i>` : ""}
    <small style="top:${r * 2 + 12}px">${label}${locked ? '<em>SOON</em>' : ""}</small></button>`;
}
function playStation() {
  const cx = 195, cy = Y.dock - 6, r = 34;
  return `<button class="stn play" data-act="play" aria-label="Play" style="left:${cx - 44}px;top:${cy - r - 4}px"><svg class="sc" viewBox="0 0 88 ${r * 2 + 8}" style="width:88px;height:${r * 2 + 8}px"><circle class="halo" cx="44" cy="${r + 4}" r="${r + 2}" fill="none" stroke="${OM.gold}" stroke-width="2"/><circle class="ring" cx="44" cy="${r + 4}" r="${r - 1.5}" fill="${OM.gold}" stroke="${OM.ivory}" stroke-width="${SW}"/></svg><span class="gw" style="top:${r + 4 - 13}px;left:${44 - 12 + 2}px">${gl("play", 24, OM.ink, 2.4, OM.ink)}</span><small class="gold" style="top:${r * 2 + 12}px">PLAY</small></button>`;
}
function missions() {
  const g = DATA.goals, y = Y.mis, p2 = Math.min(1, g[1].v / g[1].t);
  const seg1 = g[0].v >= g[0].t ? 1 : 0, seg2 = g[0].v >= g[0].t ? p2 : 0, x0 = MCOL[0], x1 = MCOL[1], x2 = MCOL[2];
  let s = `<svg class="mline" viewBox="0 0 390 100" style="top:${y - 22 - 12}px"><line x1="${x0}" y1="34" x2="${x2}" y2="34" stroke="${LINE}" stroke-width="${SW}" stroke-linecap="round"/><line x1="${x0}" y1="34" x2="${x0 + (x1 - x0) * seg1}" y2="34" stroke="${OM.gold}" stroke-width="${SW}" stroke-linecap="round"/>${seg2 ? `<line x1="${x1}" y1="34" x2="${x1 + (x2 - x1) * seg2}" y2="34" stroke="${OM.gold}" stroke-width="${SW}" stroke-linecap="round"/>` : ""}</svg>`;
  s += g.map((m, i) => {
    const done = m.v >= m.t, claim = ready(m), c = done ? OM.gold : m.c, p = Math.min(1, m.v / m.t), cx = MCOL[i], r = 22;
    const inner = done ? `<circle cx="36" cy="${r + 4}" r="${r - 1.5}" fill="${OM.gold}" stroke="${OM.ivory}" stroke-width="${SW}"/>` : `<circle cx="36" cy="${r + 4}" r="${r - 1.5}" fill="${OM.dark}" stroke="${EDGE}" stroke-width="${SW}"/><path d="${arc(36, r + 4, r - 1.5, -90, -90 + 359.9 * p)}" fill="none" stroke="${c}" stroke-width="${SW}" stroke-linecap="round"/>`;
    return `<button class="stn mis ${claim ? "ready" : ""}" data-act="missions" aria-label="${m.label}: ${m.v} of ${m.t}" style="left:${cx - 40}px;top:${y - r - 4}px;width:80px"><svg class="sc" viewBox="0 0 72 ${r * 2 + 8}" style="width:72px;height:${r * 2 + 8}px;margin:0 4px">${inner}</svg>${done ? `<span class="gw" style="top:${r + 4 - 12}px;left:${40 - 12}px">${gl("check", 24, OM.ink, 3.200)}</span>` : `<b class="num" style="top:${r + 4 - 11}px">${m.v}</b>`}<small class="ml" style="top:${r * 2 + 12}px">${m.short}</small><small class="mc" style="top:${r * 2 + 27}px">${Math.min(m.v, m.t)}/${m.t}</small>${claim ? `<i class="dot" style="top:4px;left:${40 + r * .72}px"></i>` : ""}</button>`;
  }).join("");
  return s;
}
function popover() {
  const p = PL.xp / PL.max, pips = Array.from({ length: 7 }, (_, i) => {
    const on = i < PL.streak, last = i === 6, x = 7 + i * 17;
    return last ? `<g transform="translate(${x} 7)"><rect x="-5.500" y="-3" width="11" height="9" fill="none" stroke="${OM.gold}" stroke-width="1.600"/><path d="M0 -3V6M-5.500 1H5.500" stroke="${OM.gold}" stroke-width="1.600"/><path d="M0 -3C-3 -7 -6 -3 0 -3C6 -3 3 -7 0 -3" fill="none" stroke="${OM.gold}" stroke-width="1.400"/></g>` : `<circle cx="${x}" cy="7" r="5" fill="${on ? OM.gold : "none"}" stroke="${on ? OM.gold : EDGE}" stroke-width="1.800"/>`;
  }).join("");
  return `<div class="pop ${popOpen ? "on" : ""}"><div class="pr"><b>LEVEL ${PL.level}</b><span>${PL.xp} / ${PL.max} XP</span></div><div class="xpbar"><i style="width:${p * 100}%"></i></div><div class="pr s"><b>${PL.streak}-DAY STREAK</b><span>day 7 = reward</span></div><svg class="pips" viewBox="0 0 120 14">${pips}</svg></div>`;
}
function topRow() {
  const R = 20, c = 22, p = PL.xp / PL.max;
  return `<button class="lv" data-act="level" aria-label="Level ${PL.level}, ${PL.xp} of ${PL.max} XP. Show streak"><svg viewBox="0 0 44 44" style="width:44px;height:44px"><circle cx="${c}" cy="${c}" r="${R - 1.5}" fill="${OM.dark}" stroke="${EDGE}" stroke-width="${SW}"/><path d="${arc(c, c, R - 1.5, -90, -90 + 359.9 * p)}" fill="none" stroke="${OM.gold}" stroke-width="${SW}" stroke-linecap="round"/><text x="${c}" y="${c + 6}" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="17" fill="${OM.ivory}">${PL.level}</text></svg></button>
  <button class="stars" data-act="stars" aria-label="Stars"><b class="sv2">${DATA.stars}</b>${gl("star", 20, OM.gold, 2.2, OM.gold)}</button>${popover()}`;
}

// ---------- titles (all built from the same line + station vocabulary) ----------
const TT = `font-family="Outfit,sans-serif" font-weight="800"`;
function title1() { // terminal: wordmark over a route line with two stations; a plane dot rides between them
  return `<svg class="tt" viewBox="0 0 390 120" style="top:76px"><text x="195" y="52" text-anchor="middle" ${TT} font-size="40" letter-spacing="7" fill="${OM.ivory}">ORBIT <tspan fill="${OM.gold}">SHIFT</tspan></text>
  <line x1="78" y1="76" x2="312" y2="76" stroke="${OM.ivory}" stroke-width="${SW}" stroke-linecap="round"/><circle cx="78" cy="76" r="6" fill="${OM.bg}" stroke="${OM.ivory}" stroke-width="${SW}"/><circle cx="312" cy="76" r="6" fill="${OM.bg}" stroke="${OM.gold}" stroke-width="${SW}"/>
  <path d="M-7 0L5 -4.500L2.500 0L5 4.500Z" fill="${OM.gold}"><animateMotion dur="5s" repeatCount="indefinite" path="M92 76H298" rotate="auto"/></path>
  <text x="195" y="106" text-anchor="middle" font-family="Outfit" font-weight="600" font-size="9" letter-spacing="4" fill="${OM.mint}">A TINY WORLD IN MOTION</text></svg>`;
}
function title2() { // route: stacked words left-aligned beside a vertical route line with stations
  return `<svg class="tt" viewBox="0 0 390 130" style="top:70px"><line x1="34" y1="26" x2="34" y2="86" stroke="${OM.ivory}" stroke-width="${SW}" stroke-linecap="round"/><circle cx="34" cy="26" r="7" fill="${OM.bg}" stroke="${OM.ivory}" stroke-width="${SW}"/><circle cx="34" cy="86" r="7" fill="${OM.bg}" stroke="${OM.gold}" stroke-width="${SW}"/>
  <path d="M0 -5L4.500 4L0 2L-4.500 4Z" fill="${OM.gold}"><animateMotion dur="3.600s" repeatCount="indefinite" path="M34 38V74" rotate="auto"/></path>
  <text x="62" y="46" ${TT} font-size="46" letter-spacing="6" fill="${OM.ivory}">ORBIT</text><text x="62" y="98" ${TT} font-size="46" letter-spacing="6" fill="${OM.gold}">SHIFT</text>
  <text x="62" y="120" font-family="Outfit" font-weight="600" font-size="9" letter-spacing="4" fill="${OM.mint}">A TINY WORLD IN MOTION</text></svg>`;
}
function title3() { // line badge: a transit line sign, ORBIT and SHIFT as two line-colour halves joined by a station
  return `<svg class="tt" viewBox="0 0 390 120" style="top:80px"><rect x="55" y="12" width="280" height="60" rx="30" fill="${OM.dark}" stroke="${OM.ivory}" stroke-width="${SW}"/><path d="M195 12H305A30 30 0 0 1 305 72H195Z" fill="${OM.gold}"/><rect x="55" y="12" width="280" height="60" rx="30" fill="none" stroke="${OM.ivory}" stroke-width="${SW}"/>
  <text x="125" y="52" text-anchor="middle" ${TT} font-size="27" letter-spacing="3.500" fill="${OM.ivory}">ORBIT</text><text x="266" y="52" text-anchor="middle" ${TT} font-size="27" letter-spacing="3.500" fill="${OM.ink}">SHIFT</text>
  <circle cx="195" cy="42" r="8" fill="${OM.bg}" stroke="${OM.ivory}" stroke-width="${SW}"/><circle cx="195" cy="42" r="2.600" fill="${OM.gold}"/>
  <text x="195" y="104" text-anchor="middle" font-family="Outfit" font-weight="600" font-size="9" letter-spacing="4" fill="${OM.mint}">A TINY WORLD IN MOTION</text></svg>`;
}
const TITLES = { H1: title1, H2: title2, H3: title3 };

function build(id) {
  return () => `${topRow()}${TITLES[id]()}
  <div class="mhead"><span>TODAY'S MISSIONS</span><span class="best">BEST <b>${DATA.best}</b></span></div>${missions()}
  <svg class="dline" viewBox="0 0 390 20" style="top:${Y.dock - 6 - 10}px"><line x1="22" y1="10" x2="368" y2="10" stroke="${LINE}" stroke-width="${SW}" stroke-linecap="round"/></svg>
  ${station({ cx: COLS[0], cy: Y.dock, glyph: "garage", label: "GARAGE" })}${station({ cx: COLS[1], cy: Y.dock, glyph: "daily", label: "DAILY", dot: true })}${playStation()}${station({ cx: COLS[3], cy: Y.dock, glyph: "friends", label: "FRIENDS", state: "locked" })}${station({ cx: COLS[4], cy: Y.dock, glyph: "settings", label: "SETTINGS" })}`;
}
const NAVT = { level: "", garage: "→ Garage", daily: "→ Daily reward: claim +50 ★", settings: "→ Settings", friends: "Friends & rivals: coming soon", play: "→ Level select", stars: "Star shop: coming soon", best: "" };
Object.assign(NAV, NAVT);
function bindHome(root, sheet, view) {
  root.querySelectorAll('[data-act="level"]').forEach(b => b.onclick = e => { e.stopPropagation(); popOpen = !popOpen; root.querySelector(".pop").classList.toggle("on", popOpen); });
  root.onclick = e => { if (popOpen && !e.target.closest(".pop,.lv")) { popOpen = false; root.querySelector(".pop")?.classList.remove("on"); } };
  root.querySelectorAll(".stn").forEach(b => b.addEventListener("pointerdown", () => { const ring = b.querySelector(".ring"); ring && ring.animate([{ transform: "scale(1)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" }); }));
}
for (const id of ["H1", "H2", "H3"]) setup(id, { cy: 408, pr: 86, or: 138, ps: 1.65 }, build(id), { bind: bindHome });

// ---------- chrome ----------
const WHY = {
  H1: "<b>Title 1 · Terminal.</b> Centred wordmark over a route line with two stations; a small plane rides the line.",
  H2: "<b>Title 2 · Route.</b> The words stack beside a vertical route with stations, like a transit diagram. Left-aligned for a stronger edge.",
  H3: "<b>Title 3 · Line badge.</b> A transit line sign: ORBIT and SHIFT as two halves joined by a station. The most logo-like.",
};
const stage = document.getElementById("stage"), why = document.getElementById("why");
function fit() { const s = Math.min(1, (innerHeight - 112) / H, innerWidth / W); stage.style.transform = `scale(${s})`; stage.style.marginBottom = -(H * (1 - s)) + "px"; }
addEventListener("resize", fit); fit();
function show(k) {
  document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x.dataset.t === k));
  document.querySelectorAll(".phone").forEach(p => p.classList.toggle("on", p.id === k));
  why.innerHTML = WHY[k]; history.replaceState(null, "", "#" + k);
}
document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => show(b.dataset.t));
show(/^#(H1|H2|H3)$/.test(location.hash) ? location.hash.slice(1) : "H1");
