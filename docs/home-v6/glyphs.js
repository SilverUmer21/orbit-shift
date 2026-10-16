// Orbit Shift UI kit v2: gate-ring buttons, layered paper glyphs, level/streak layer, title lockups.
// Gate semantics: open gap = available, diamond in the gap = needs attention, closed ring = locked.
const C = { ink: "#08191d", disc: "#0d2d31", ivory: "#f4ecc8", cream: "#e6dba8", creamD: "#bdb07a", gold: "#edca62", goldD: "#b98a2e", goldL: "#ffe28a", coral: "#ef6e67", coralD: "#a8433f", ember: "#f59a56", mint: "#77d5aa", leaf: "#4fae91", leafD: "#2f7f69", lav: "#a99be0", lavD: "#6f62b5" };
const PLAYER = { level: 7, xp: 620, xpMax: 1000, streak: 3 };

// ---------- layered paper glyphs (48 grid). s:1 layers form the silhouette that casts the shadow ----------
function cogPath() {
  const pts = [];
  for (let t = 0; t < 8; t++) for (const [d, r] of [[-12, 15], [-8, 20], [8, 20], [12, 15]]) { const a = (t * 45 + d) * Math.PI / 180; pts.push([24 + Math.cos(a) * r, 24 + Math.sin(a) * r]); }
  return "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + "Z";
}
const FLAME = "M24 4C27 13 38 17 38 30C38 38.5 31.5 44 24 44C16.5 44 10 38.5 10 30C10 24 13.500 20 16.500 17C16.500 21 18.500 24 21 24.500C19.500 16 20.500 9.500 24 4Z";
const scaleAbout = (cx, cy, k) => `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`;
const GLYPH = {
  garage: [
    { d: "M43 24L7 5L16 24L7 43Z", f: C.cream, s: 1 },
    { d: "M43 24L7 5L16 24Z", f: C.ivory },
    { d: "M43 24L7 43L16 24Z", f: "#bdb27c" },
    { d: "M7 5L16 24L21 21L12 6Z", f: C.coral }, { d: "M7 43L16 24L21 27L12 42Z", f: C.coralD },
    { d: "M34 24L23 20L18 24L23 28Z", f: C.leaf }, { d: "M34 24L23 28L18 24Z", f: C.leafD },
    { d: "M43 24L16 24", stroke: "rgba(6,19,25,.3)", w: .8 },
  ],
  daily: [
    { d: FLAME, f: C.coral, s: 1 }, { d: FLAME, f: C.ember, t: scaleAbout(24, 42, .7) }, { d: FLAME, f: C.goldL, t: scaleAbout(24, 42, .4) },
    { d: "M17 37C16.500 33 19 30 21 28C21.500 31 22.500 33 22 36Z", f: "#fff", o: .35 },
  ],
  friends: [
    { d: "M20 44C20 33 25 28.500 32 28.500C39 28.500 44 33 44 44Z", f: C.lav, s: 1 }, { circle: [32, 17, 6], f: C.lav, s: 1 },
    { d: "M3 44C3 33 9 28.500 19 28.500C29 28.500 35 33 35 44Z", f: "rgba(0,0,0,.28)", t: "translate(1.200 1.600)" },
    { d: "M3 44C3 33 9 28.500 19 28.500C29 28.500 35 33 35 44Z", f: C.ivory, s: 1 }, { circle: [19, 19, 7.500], f: C.ivory, s: 1 },
    { d: "M19 28.500C29 28.500 35 33 35 44H19Z", f: C.creamD, o: .55 }, { d: "M32 11A6 6 0 0 1 38 17H32Z", f: C.lavD, o: .5 },
  ],
  settings: [
    { d: cogPath(), f: C.cream, s: 1 }, { circle: [24, 24, 11.500], f: C.ivory }, { d: "M24 12.500A11.500 11.500 0 0 1 35.500 24H24Z", f: C.creamD, o: .5 }, { circle: [24, 24, 5.500], f: C.disc },
  ],
  play: [
    { d: "M15 8L42 24L15 40Z", f: C.gold, s: 1 }, { d: "M15 24L42 24L15 40Z", f: C.goldD }, { d: "M15 8L42 24L15 24Z", f: C.goldL, o: .55 }, { d: "M15 24H42", stroke: "rgba(60,36,6,.35)", w: .9 },
  ],
  gift: [
    { d: "M9 22H39V43H9Z", f: C.coral, s: 1 }, { d: "M24 22H39V43H24Z", f: C.coralD, o: .45 }, { d: "M7 14H41V23H7Z", f: C.ember, s: 1 }, { d: "M24 14H41V23H24Z", f: "#c9743a", o: .5 },
    { d: "M21.500 14H26.500V43H21.500Z", f: C.gold }, { d: "M24 14C15 14 11 6.500 16.500 4.500C21 3.500 24 9 24 14Z", f: C.goldL, s: 1 }, { d: "M24 14C33 14 37 6.500 31.500 4.500C27 3.500 24 9 24 14Z", f: C.gold, s: 1 },
  ],
  lock: [
    { d: "M16 22V15A8 8 0 0 1 32 15V22", f: "none", stroke: C.ivory, w: 4.500, s: 1 }, { d: "M11 21H37V43H11Z", f: C.cream, s: 1 }, { d: "M24 21H37V43H24Z", f: C.creamD, o: .5 }, { circle: [24, 31, 3.200], f: C.disc }, { d: "M22.500 33H25.500L26 38H22Z", f: C.disc },
  ],
  star: [
    { d: "M24 3L30 17L45 18.500L34 28.500L37 43L24 35.500L11 43L14 28.500L3 18.500L18 17Z", f: C.gold, s: 1 }, { d: "M24 3L30 17L45 18.500L34 28.500L37 43L24 35.500Z", f: C.goldD }, { d: "M24 3L18 17L3 18.500L14 28.500L24 24Z", f: C.goldL, o: .6 },
  ],
  crown: [
    { d: "M4 38L2 14L14 24L24 8L34 24L46 14L44 38Z", f: C.gold, s: 1 }, { d: "M24 8L34 24L46 14L44 38H24Z", f: C.goldD }, { d: "M4 38H44V43H4Z", f: C.goldL, s: 1 },
  ],
  flameMini: [{ d: FLAME, f: C.coral, s: 1 }, { d: FLAME, f: C.ember, t: scaleAbout(24, 42, .7) }, { d: FLAME, f: C.goldL, t: scaleAbout(24, 42, .4) }],
};
function glyphInner(name, shadow = true) {
  const L = GLYPH[name], el = l => l.circle ? `<circle cx="${l.circle[0]}" cy="${l.circle[1]}" r="${l.circle[2]}"` : `<path d="${l.d}"`;
  const sh = shadow ? `<g transform="translate(1.300 2)" fill="rgba(0,0,0,.4)">${L.filter(l => l.s).map(l => `${el(l)}${l.stroke ? ` stroke="rgba(0,0,0,.4)" stroke-width="${l.w}" fill="none"` : ""}/>`).join("")}</g>` : "";
  return sh + L.map(l => `${el(l)} fill="${l.f || "none"}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.w}" stroke-linejoin="round"` : ""}${l.t ? ` transform="${l.t}"` : ""}${l.o ? ` opacity="${l.o}"` : ""}/>`).join("");
}
const glyphSVG = (name, size = 48, cls = "") => `<svg class="glyph ${cls}" viewBox="0 0 48 48" style="width:${size}px;height:${size}px">${glyphInner(name)}</svg>`;

// ---------- gate ring ----------
const ORN = { garage: "leaf", daily: "flame", friends: "star", settings: "cog", play: "petal", gift: "petal" };
const RING = { garage: [C.leaf, C.leafD], daily: [C.coral, C.coralD], friends: [C.lav, C.lavD], settings: [C.cream, C.creamD], play: [C.gold, C.goldD], gift: [C.ember, "#c9743a"] };
function ringBtnSVG(kind, size, state = "idle") {
  const closed = state === "locked", [col, colD] = closed ? ["#7d8a86", "#566360"] : RING[kind], c = size / 2, sw = size * .085, r = size / 2 - sw - size * .035, gap = closed ? 0 : 62, gc = -45, arc = 360 - gap, start = gc + gap / 2;
  const dash = closed ? "360 0" : `${arc} ${360 - arc}`, orn = ORN[kind], pt = (a, k = 1) => [c + Math.cos(a * Math.PI / 180) * (r + sw * .5 * k), c + Math.sin(a * Math.PI / 180) * (r + sw * .5 * k)];
  let g = `<circle cx="${c + 1.3}" cy="${c + 2}" r="${r}" fill="none" stroke="rgba(0,0,0,.42)" stroke-width="${sw + 1.4}" pathLength="360" stroke-dasharray="${dash}" stroke-linecap="${closed ? "butt" : "round"}" transform="rotate(${start} ${c + 1.3} ${c + 2})"/>`;
  g += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${colD}" stroke-width="${sw + 1.2}" pathLength="360" stroke-dasharray="${dash}" stroke-linecap="${closed ? "butt" : "round"}" transform="rotate(${start} ${c} ${c})"/>`;
  g += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" pathLength="360" stroke-dasharray="${dash}" stroke-linecap="${closed ? "butt" : "round"}" transform="rotate(${start} ${c} ${c})"/>`;
  g += `<circle cx="${c}" cy="${c}" r="${r + sw * .22}" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="${sw * .22}" pathLength="360" stroke-dasharray="${dash}" transform="rotate(${start} ${c} ${c})"/>`;
  const step = orn === "cog" ? 30 : orn === "petal" ? 26 : 34, a0 = closed ? 0 : start + 18, a1 = closed ? 360 : start + arc - 14;
  for (let a = a0, i = 0; a < a1; a += step, i++) {
    const [x, y] = pt(a, orn === "leaf" ? 1.1 : 1.15);
    if (closed) continue;
    if (orn === "leaf") g += `<ellipse cx="${x}" cy="${y}" rx="${size * .05}" ry="${size * .025}" transform="rotate(${a + (i % 2 ? 28 : -28)} ${x} ${y})" fill="${i % 2 ? C.ivory : "#a6e3c2"}"/>`;
    else if (orn === "flame") g += `<path d="M0 0C1.800 -1.600 3 -3 0 -7.200C-3 -3 -1.800 -1.600 0 0Z" transform="translate(${x} ${y}) rotate(${a + 90}) scale(${size / 52})" fill="${i % 2 ? C.ember : C.goldL}"/>`;
    else if (orn === "star") g += `<path d="M0 -3.800L1 -1L3.800 0L1 1L0 3.800L-1 1L-3.800 0L-1 -1Z" transform="translate(${x} ${y}) scale(${size / 52})" fill="${C.ivory}"/>`;
    else if (orn === "cog") g += `<rect x="-1.100" y="-3.600" width="2.200" height="3.600" transform="translate(${x} ${y}) rotate(${a + 90}) scale(${size / 52})" fill="${C.ivory}"/>`;
    else g += `<ellipse cx="${x}" cy="${y}" rx="${size * .052}" ry="${size * .026}" transform="rotate(${a + (i % 2 ? 24 : -24)} ${x} ${y})" fill="${i % 2 ? C.goldL : C.ivory}"/>`;
  }
  if (!closed) for (const a of [start, start + arc]) { const [x, y] = pt(a, 0); g += `<path d="M0 -${size * .06}L${size * .045} 0L0 ${size * .06}L-${size * .045} 0Z" transform="translate(${x} ${y}) rotate(${a + 90})" fill="${C.ivory}"/>`; }
  // gap slot: a diamond here means "needs attention"
  const [gx, gy] = pt(gc, 0);
  if (state === "attention" || state === "new") g += `<path class="slot ${state}" d="M0 -${size * .115}L${size * .085} 0L0 ${size * .115}L-${size * .085} 0Z" transform="translate(${gx} ${gy})" fill="${state === "new" ? C.goldL : C.coral}" stroke="${C.ink}" stroke-width="1.200"/>`;
  const dr = r - sw * .5 - 1.4, gs = dr * 1.52;
  const disc = `<circle cx="${c}" cy="${c}" r="${dr}" fill="${C.disc}"/><path d="M${c - dr * .86} ${c - dr * .48}A${dr} ${dr} 0 0 1 ${c + dr * .86} ${c - dr * .48}" fill="none" stroke="rgba(244,236,200,.22)" stroke-width="1"/>`;
  const gl = `<g class="gl" transform="translate(${c - gs / 2} ${c - gs / 2}) scale(${gs / 48})" style="transform-box:fill-box"><g>${glyphInner(closed ? "lock" : kind)}</g></g>`;
  const shim = closed ? "" : `<g class="shim" style="transform-origin:${c}px ${c}px;animation-duration:${kind === "play" ? 5 : 9}s;animation-delay:-${(kind.length * 1.7) % 7}s"><path d="M${c + r} ${c - 3.600}L${c + r + 2.600} ${c}L${c + r} ${c + 3.600}L${c + r - 2.600} ${c}Z" fill="#fffbe0" opacity=".95"/></g>`;
  return `<svg class="rsvg" viewBox="0 0 ${size} ${size}" style="width:${size}px;height:${size}px"><g class="ringg" style="transform-origin:${c}px ${c}px">${g}</g>${disc}${gl}${shim}</svg>`;
}
function ringButton(kind, o = {}) {
  const size = o.size || (kind === "play" ? 76 : 52), st = o.state || "idle", label = o.label ?? kind.charAt(0).toUpperCase() + kind.slice(1);
  const orbit = "";
  return `<button class="rb ${kind} ${st}${o.cls ? " " + o.cls : ""}" data-act="${o.act || kind}" aria-label="${label}${st === "locked" ? " (locked)" : ""}" style="${o.style || ""};width:${size + 8}px"><span class="rwrap" style="width:${size}px;height:${size}px">${ringBtnSVG(kind, size, st)}${orbit}</span>${o.nolabel ? "" : `<small>${label}</small>`}${st === "locked" ? `<em class="soonlbl" style="top:${size - 7}px">SOON</em>` : ""}</button>`;
}
function spark(btn) {
  const rw = btn.querySelector(".rwrap"), b = rw.getBoundingClientRect(), host = btn.closest(".phone"), hb = host.getBoundingClientRect(), k = hb.width / 390;
  const cx = (b.left - hb.left + b.width / 2) / k, cy = (b.top - hb.top + b.height / 2) / k;
  for (let i = 0; i < 9; i++) {
    const el = document.createElement("i"); el.className = "spk"; el.style.left = cx + "px"; el.style.top = cy + "px"; el.style.background = [C.goldL, C.ivory, C.mint, C.coral][i % 4]; host.appendChild(el);
    const a = Math.random() * 6.28, d = 26 + Math.random() * 20;
    el.animate([{ transform: "translate(-50%,-50%) rotate(45deg) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) rotate(${200 + i * 30}deg) scale(.2)`, opacity: 0 }], { duration: 520, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => el.remove();
  }
}

// ---------- player layer ----------
function levelBadge(size = 50) {
  const c = size / 2, R = size / 2 - 3, hex = (r, k = 0) => Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90) * Math.PI / 180; return `${(c + Math.cos(a) * r).toFixed(1)},${(c + Math.sin(a) * r + k).toFixed(1)}`; }).join(" "), p = PLAYER.xp / PLAYER.xpMax;
  return `<svg class="lvsvg" viewBox="0 0 ${size} ${size}" style="width:${size}px;height:${size}px"><circle cx="${c}" cy="${c}" r="${R}" fill="rgba(0,0,0,.4)" stroke="rgba(244,236,200,.14)" stroke-width="3"/><circle class="xp" cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${C.gold}" stroke-width="3.400" pathLength="100" stroke-dasharray="${p * 100} 100" stroke-linecap="round" transform="rotate(-90 ${c} ${c})" style="filter:drop-shadow(0 0 3px rgba(237,202,98,.7))"/>
  <polygon points="${hex(R - 6.500, 1.800)}" fill="rgba(0,0,0,.4)"/><polygon points="${hex(R - 6.500)}" fill="${C.leafD}"/><polygon points="${hex(R - 9.500)}" fill="${C.leaf}"/><polygon points="${hex(R - 9.500)}" fill="${C.mint}" opacity=".45" clip-path="inset(0 0 52% 0)"/>
  <text x="${c}" y="${c + 6.500}" text-anchor="middle" font-family="Fraunces,serif" font-weight="800" font-size="19" fill="${C.ivory}" style="paint-order:stroke" stroke="${C.ink}" stroke-width="2.400">${PLAYER.level}</text></svg>`;
}
function streakRow() {
  const pips = Array.from({ length: 7 }, (_, i) => {
    const on = i < PLAYER.streak, today = i === PLAYER.streak - 1, last = i === 6, x = i * 11 + 6;
    if (last) return `<g transform="translate(${x} 7) scale(.28) translate(-24 -24)">${glyphInner("gift", false)}</g>`;
    return `<path class="pip${on ? " on" : ""}${today ? " today" : ""}" d="M${x} 2.500L${x + 4} 7L${x} 11.500L${x - 4} 7Z" fill="${on ? C.gold : "rgba(0,0,0,.45)"}" stroke="${on ? C.goldD : "rgba(244,236,200,.2)"}" stroke-width=".8"/>`;
  }).join("");
  return `<div class="streak2"><svg class="sfl" viewBox="0 0 48 48">${glyphInner("flameMini", false)}</svg><b>${PLAYER.streak}</b><svg class="pips" viewBox="0 0 78 14">${pips}</svg></div>`;
}

// ---------- title lockups ----------
const flowerSVG = (cx, cy, r) => `<g transform="translate(${cx} ${cy})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-r * .62}" rx="${r * .2}" ry="${r * .36}" transform="rotate(${a})" fill="${C.cream}"/>`).join("")}<circle r="${r * .22}" fill="${C.gold}"/></g>`;
const miniPlane = (s = 1) => `<g transform="scale(${s})"><path d="M7 0L-4 -4L-8 -9L-6 -1L-9 0L-6 1L-8 9L-4 4Z" fill="rgba(0,0,0,.35)" transform="translate(.8 1.2)"/><path d="M7 0L-4 -4L-8 -9L-6 -1L-9 0Z" fill="${C.ivory}"/><path d="M7 0L-4 4L-8 9L-6 1L-9 0Z" fill="#c2b784"/><path d="M-6 -1L-9 0L-6 1Z" fill="${C.gold}"/><path d="M4 0L0 -1.400L-2 0L0 1.400Z" fill="${C.leaf}"/></g>`;
const TF = `font-family="Fraunces,Georgia,serif" font-weight="800" style="font-variation-settings:'SOFT' 0,'WONK' 0,'opsz' 144"`;
// T1: the O is a planet and the glider orbits it
function titleLockup() {
  const px = 42, py = 46, rot = -24, orbit = `M${px - 46} ${py}a46 16 0 1 0 92 0a46 16 0 1 0 -92 0Z`;
  return `<svg class="tl1" viewBox="0 0 250 132" aria-label="Orbit Shift">
  <g transform="rotate(${rot} ${px} ${py})"><path d="${orbit}" fill="none" stroke="rgba(244,236,200,.5)" stroke-width="1.300" stroke-dasharray="2 5"/></g>
  <g ${TF} font-size="68" letter-spacing="-1.500"><text x="76" y="70" fill="${C.leafD}" transform="translate(-3 4)">rbit</text><text x="76" y="70" fill="${C.ivory}">rbit</text></g>
  <circle cx="${px}" cy="${py}" r="28" fill="${C.leafD}" transform="translate(-3 4)"/><circle cx="${px}" cy="${py}" r="28" fill="${C.ivory}"/><circle cx="${px}" cy="${py}" r="13.500" fill="${C.disc}"/><circle cx="${px}" cy="${py}" r="13.500" fill="none" stroke="${C.creamD}" stroke-width="1.600"/>${flowerSVG(px, py, 12.500)}
  <g ${TF} font-size="64" letter-spacing=".5"><text x="30" y="124" fill="${C.coralD}" transform="translate(4 4)">Shift</text><text x="30" y="124" fill="${C.gold}">Shift</text></g>
  <g transform="rotate(${rot} ${px} ${py})"><g><animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path="${orbit}"/><g transform="rotate(0) scale(1.25)">${miniPlane()}</g></g></g></svg>`;
}
// T2: the title is the gate: a ring segment over the planet, text cut into the band, glider passing through the gap
let arcN = 0;
function titleArc(cx, cy, R) {
  const uid = ++arcN;
  const a0 = -143, a1 = -37, p = a => [cx + Math.cos(a * Math.PI / 180) * R, cy + Math.sin(a * Math.PI / 180) * R], [x0, y0] = p(a0), [x1, y1] = p(a1);
  const arcD = `M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}`, arcAt = (rr, s, e) => `M${cx + Math.cos(s * Math.PI / 180) * rr} ${cy + Math.sin(s * Math.PI / 180) * rr}A${rr} ${rr} 0 0 1 ${cx + Math.cos(e * Math.PI / 180) * rr} ${cy + Math.sin(e * Math.PI / 180) * rr}`;
  let leaves = "";
  for (let a = a0 + 8; a < a1 - 4; a += 7) { const [x, y] = [cx + Math.cos(a * Math.PI / 180) * (R + 19), cy + Math.sin(a * Math.PI / 180) * (R + 19)]; leaves += `<ellipse cx="${x}" cy="${y}" rx="5" ry="2" transform="rotate(${a + ((a / 7 | 0) % 2 ? 30 : -30)} ${x} ${y})" fill="${(a / 7 | 0) % 2 ? C.ivory : "#a6e3c2"}"/>`; }
  const dia = [a0, a1].map(a => { const [x, y] = p(a); return `<path d="M0 -8L6 0L0 8L-6 0Z" transform="translate(${x} ${y}) rotate(${a + 90})" fill="${C.ivory}" stroke="${C.ink}" stroke-width="1.200"/>`; }).join("");
  return `<svg class="tl2" viewBox="0 0 390 844" aria-label="Orbit Shift"><defs><path id="arcT${uid}" d="${arcAt(R - 9, a0 + 1, a1 - 1)}"/><path id="arcS${uid}" d="${arcAt(R - 11, a0 + 1, a1 - 1)}"/></defs>
  <path d="${arcD}" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="34" stroke-linecap="round" transform="translate(3 5)"/>
  <path d="${arcD}" fill="none" stroke="#0a2326" stroke-width="36" stroke-linecap="round"/><path d="${arcD}" fill="none" stroke="${C.leafD}" stroke-width="31" stroke-linecap="round"/><path d="${arcD}" fill="none" stroke="${C.leaf}" stroke-width="26" stroke-linecap="round"/><path d="${arcD}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" transform="translate(0 -9)" stroke-linecap="round"/>${leaves}${dia}
  <text ${TF} font-size="24" letter-spacing="5" text-anchor="middle"><textPath href="#arcS${uid}" startOffset="50%" fill="rgba(0,0,0,.55)">ORBIT SHIFT</textPath></text>
  <text ${TF} font-size="24" letter-spacing="5" text-anchor="middle"><textPath href="#arcT${uid}" startOffset="50%"><tspan fill="${C.ivory}">ORBIT </tspan><tspan fill="${C.goldL}">SHIFT</tspan></textPath></text></svg>`;
}
// T3: crest: planet inside a gold gate ring, glider riding the ring, small wordmark
function titleEmblem() {
  const c = 62, R = 46, gap = 56, gc = -45, arc = 360 - gap, start = gc + gap / 2;
  const orbit = `M${c} ${c - R}a${R} ${R} 0 1 1 0 ${2 * R}a${R} ${R} 0 1 1 0 ${-2 * R}Z`;
  let petals = "";
  for (let a = start + 14, i = 0; a < start + arc - 10; a += 22, i++) { const x = c + Math.cos(a * Math.PI / 180) * (R + 8), y = c + Math.sin(a * Math.PI / 180) * (R + 8); petals += `<ellipse cx="${x}" cy="${y}" rx="5.200" ry="2.400" transform="rotate(${a + (i % 2 ? 26 : -26)} ${x} ${y})" fill="${i % 2 ? C.goldL : C.ivory}"/>`; }
  return `<svg class="tl3" viewBox="0 0 124 150" aria-label="Orbit Shift">
  <circle cx="${c + 2}" cy="${c + 4}" r="${R}" fill="none" stroke="rgba(0,0,0,.42)" stroke-width="10" pathLength="360" stroke-dasharray="${arc} ${gap}" stroke-linecap="round" transform="rotate(${start} ${c + 2} ${c + 4})"/>
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${C.goldD}" stroke-width="11" pathLength="360" stroke-dasharray="${arc} ${gap}" stroke-linecap="round" transform="rotate(${start} ${c} ${c})"/>
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${C.gold}" stroke-width="8" pathLength="360" stroke-dasharray="${arc} ${gap}" stroke-linecap="round" transform="rotate(${start} ${c} ${c})"/>
  <circle cx="${c}" cy="${c}" r="${R + 1.500}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.600" pathLength="360" stroke-dasharray="${arc} ${gap}" transform="rotate(${start} ${c} ${c})"/>${petals}
  <circle cx="${c + 1.500}" cy="${c + 3}" r="33" fill="rgba(0,0,0,.4)"/><circle cx="${c}" cy="${c}" r="33" fill="#0a2326"/><circle cx="${c}" cy="${c}" r="30" fill="${C.leafD}"/><circle cx="${c}" cy="${c}" r="26" fill="${C.leaf}"/><circle cx="${c}" cy="${c}" r="16" fill="${C.disc}"/>${flowerSVG(c, c, 15)}
  <path d="M${c - 22} ${c - 18}A30 30 0 0 1 ${c + 4} ${c - 29}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2.500" stroke-linecap="round"/>
  <g><animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path="${orbit}"/><g transform="scale(1.35)">${miniPlane()}</g></g>
  <text x="62" y="136" text-anchor="middle" ${TF} font-size="21" letter-spacing="4.500" fill="${C.ink}" transform="translate(1.500 2)" opacity=".7">ORBIT SHIFT</text>
  <text x="62" y="136" text-anchor="middle" ${TF} font-size="21" letter-spacing="4.500" fill="${C.ivory}">ORBIT <tspan fill="${C.gold}">SHIFT</tspan></text>
  <text x="62" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="5.800" letter-spacing="2.600" fill="${C.mint}">A TINY WORLD IN MOTION</text></svg>`;
}
