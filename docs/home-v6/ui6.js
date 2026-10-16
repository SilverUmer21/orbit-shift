// Home v6: illustrated UI. Same lighting as the plane: lit upper-left, shaded lower-right, ink outline, hard cast shadow.
const INK = "#061319";
let UID = 0;
NAV.shop = "Star shop: coming soon"; NAV.level = "→ Profile & rank"; NAV.streak = "3-day streak · play today to keep it"; NAV.daily = "→ Daily reward: claim +50 ★"; NAV.garage = "→ Garage"; NAV.settings = "→ Settings"; NAV.friends = "Friends & rivals: coming soon"; NAV.play = "→ Level select"; NAV.missions = "";

// ───────────── custom lettering: chunky folded-paper letters built from skeleton paths ─────────────
const LET = {
  R: { d: "M7 56V7H28L38 17V25L28 35H7M26 35L38 56", adv: 50 },
  B: { d: "M7 56V7H27L36 15V25L27 31H7M27 31L38 38V48L29 56H7", adv: 50 },
  I: { d: "M7 7V56", adv: 24 },
  T: { d: "M3 7H39M21 7V56", adv: 52 },
  S: { d: "M36 15L28 7H11L3 15V22L11 29H27L35 36V48L27 56H10L2 48", adv: 46 },
  H: { d: "M7 7V56M33 7V56M7 31H33", adv: 50 },
  F: { d: "M7 56V7H33M7 30H27", adv: 40 },
};
function letter(ch, x, y, s, face, dark, W = 12) {
  const id = "m" + (++UID), d = LET[ch].d, st = 'fill="none" stroke-linejoin="miter" stroke-miterlimit="3" stroke-linecap="butt"';
  let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
  g += `<path d="${d}" ${st} stroke="rgba(0,0,0,.4)" stroke-width="${W + 5}" transform="translate(3 12)"/>`;
  for (let dy = 7; dy >= 0; dy -= .5) g += `<path d="${d}" ${st} stroke="${INK}" stroke-width="${W + 5}" transform="translate(0 ${dy})"/>`;
  for (let dy = 6; dy > 0; dy -= .5) g += `<path d="${d}" ${st} stroke="${dark}" stroke-width="${W}" transform="translate(0 ${dy})"/>`;
  g += `<path d="${d}" ${st} stroke="${face}" stroke-width="${W}"/>`;
  g += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="120" height="120"><path d="${d}" ${st} stroke="#fff" stroke-width="${W}"/></mask><g mask="url(#${id})"><path d="${d}" ${st} stroke="rgba(255,255,255,.85)" stroke-width="${W * .16}" transform="translate(${-W * .39} ${-W * .39})"/><path d="${d}" ${st} stroke="rgba(6,19,25,.3)" stroke-width="${W * .15}" transform="translate(${W * .4} ${W * .4})"/></g>`;
  return g + "</g>";
}
const LOGO = { s: 1.12, y1: 78, y2: 160 };
function logoLayout() {
  const s = LOGO.s, w1 = (66 + 50 + 50 + 24 + 52) * s, w2 = (46 + 50 + 24 + 40 + 52) * s, x1 = (390 - w1) / 2, x2 = (390 - w2) / 2;
  return { x1, x2, ox: x1 + 33 * s, oy: LOGO.y1 + 37.500 * s + 3 };
}
function logoSVG(top = 0) {
  const s = LOGO.s, L = logoLayout(); let g = "", x = L.x1 + 66 * s;
  for (const ch of "RBIT") { g += letter(ch, x, LOGO.y1 + 6 * s + 3, s, "#f4ecc8", "#2f7f69"); x += LET[ch].adv * s; }
  x = L.x2;
  for (const ch of "SHIFT") { g += letter(ch, x, LOGO.y2 + 6 * s + 3, s, "#edca62", "#a8433f"); x += LET[ch].adv * s; }
  const sp = (cx, cy, r, d) => `<path class="tw" style="animation-delay:-${d}s" d="M${cx} ${cy - r * 2.2}L${cx + r * .34} ${cy - r * .34}L${cx + r * 2.2} ${cy}L${cx + r * .34} ${cy + r * .34}L${cx} ${cy + r * 2.2}L${cx - r * .34} ${cy + r * .34}L${cx - r * 2.2} ${cy}L${cx - r * .34} ${cy - r * .34}Z" fill="#fff6c8"/>`;
  g += sp(L.x2 + 4, LOGO.y2 - 6, 4, 0) + sp(L.x1 + 66 * s + 50 * s * 3 + 24 * s + 42 * s + 14, LOGO.y1 - 2, 3.4, 1.2) + sp(L.x2 + (46 + 50 + 24 + 40 + 52) * s + 6, LOGO.y2 + 70, 3, 2.1);
  g += `<text x="195" y="270" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="9.500" letter-spacing="4.200" fill="#77d5aa" style="text-shadow:0 2px 6px #000">A TINY WORLD IN MOTION</text>`;
  return `<svg class="logo6" viewBox="0 0 390 300" style="top:${top}px">${g}</svg>`;
}
// the O is the real living planet; a small glider circles it
function drawPlanetO(ctx, t, L) {
  const s = LOGO.s, r = 29 * s;
  ctx.save(); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.arc(L.ox + 3, L.oy + 12, r * 1.2, 0, TAU); ctx.fill(); ctx.restore();
  const plane = (back) => { const a = t * .9, rx = r * 1.2 + 14, ry = 14, tilt = -.35, ex = Math.cos(a) * rx, ey = Math.sin(a) * ry, px = L.ox + ex * Math.cos(tilt) - ey * Math.sin(tilt), py = L.oy + ex * Math.sin(tilt) + ey * Math.cos(tilt), dx = -Math.sin(a) * rx, dy2 = Math.cos(a) * ry, ang = Math.atan2(dx * Math.sin(tilt) + dy2 * Math.cos(tilt), dx * Math.cos(tilt) - dy2 * Math.sin(tilt)); if ((Math.sin(a) < 0) !== back) return; ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(.5, .5); drawGlider(ctx, RIDER, PAL, 1, t, 0, false, 0); ctx.restore(); };
  plane(true);
  OrbitArt.drawLivingPlanet(ctx, "bloom-crown", { x: L.ox, y: L.oy, radius: r, paletteId: "bloom", time: t, reduced: false });
  plane(false);
}

// ───────────── illustrated medallion buttons ─────────────
const MP = { garage: ["#b9efd2", "#2f7f69", "#4fae91"], daily: ["#ffc2b8", "#a8433f", "#ef6e67"], friends: ["#d9d1f6", "#6f62b5", "#a99be0"], settings: ["#fff6d2", "#a89b66", "#e6dba8"], play: ["#fff0b0", "#b98a2e", "#edca62"], grey: ["#a8b3af", "#4d5a57", "#7d8a86"], gift: ["#ffd0a8", "#c9743a", "#f59a56"] };
const pt = (c, r, a) => `${(c + Math.cos(a * Math.PI / 180) * r).toFixed(2)} ${(c + Math.sin(a * Math.PI / 180) * r).toFixed(2)}`;
const halfRing = (c, r0, r1, a0, a1) => `M${pt(c, r1, a0)}A${r1} ${r1} 0 0 1 ${pt(c, r1, a1)}L${pt(c, r0, a1)}A${r0} ${r0} 0 0 0 ${pt(c, r0, a0)}Z`;
function medal(kind, S, o = {}) {
  const id = ++UID, c = S / 2 + 3, T = S + 8, locked = o.state === "locked", [L, D, M] = locked ? MP.grey : MP[kind], R = S / 2 - 1, face = R * .74;
  let s = `<circle cx="${c + 2.500}" cy="${c + 5}" r="${R}" fill="rgba(0,0,0,.42)"/><circle cx="${c}" cy="${c + 3.500}" r="${R}" fill="${D}" stroke="${INK}" stroke-width="2.200"/><circle cx="${c}" cy="${c}" r="${R}" fill="${M}" stroke="${INK}" stroke-width="2.200"/>`;
  s += `<path d="${halfRing(c, face, R - 1, 135, 315)}" fill="${L}"/><path d="${halfRing(c, face, R - 1, 315, 495)}" fill="${D}" opacity=".7"/>`;
  if (kind === "play" && !locked) {
    let rays = ""; for (let i = 0; i < 16; i++) rays += `<path d="M${c} ${c}L${pt(c, face + 2, i * 22.5)}L${pt(c, face + 2, i * 22.5 + 22.5)}Z" fill="${i % 2 ? "#f6cf63" : "#edc152"}"/>`;
    s += `<circle cx="${c}" cy="${c}" r="${face}" fill="#edca62" stroke="${INK}" stroke-width="2"/><clipPath id="cp${id}"><circle cx="${c}" cy="${c}" r="${face - 1}"/></clipPath><g clip-path="url(#cp${id})">${rays}<g transform="skewX(-20)"><rect x="-30" y="0" width="${S * .2}" height="${T}" fill="rgba(255,255,255,.5)"><animateTransform attributeName="transform" type="translate" from="-30 0" to="${T + 40} 0" dur="3.600s" repeatCount="indefinite"/></rect></g></g>`;
    const k = face * .62, tx = c + k * .12;
    s += `<path d="M${tx - k * .52} ${c - k * .86}L${tx + k * .98} ${c}L${tx - k * .52} ${c + k * .86}Z" fill="rgba(0,0,0,.28)" transform="translate(1.500 2.500)"/><path d="M${tx - k * .52} ${c - k * .86}L${tx + k * .98} ${c}L${tx - k * .52} ${c + k * .86}Z" fill="#2a1a05" stroke="#2a1a05" stroke-width="2" stroke-linejoin="round"/><path d="M${tx - k * .52} ${c - k * .86}L${tx + k * .98} ${c}L${tx - k * .52} ${c}Z" fill="#fff0b0"/><path d="M${tx - k * .52} ${c}L${tx + k * .98} ${c}L${tx - k * .52} ${c + k * .86}Z" fill="#d9a43a"/>`;
  } else {
    s += `<circle cx="${c}" cy="${c}" r="${face}" fill="#0d2d31" stroke="${INK}" stroke-width="2"/><path d="${halfRing(c, face - 4, face - .5, 135, 315)}" fill="rgba(0,0,0,.4)"/><path d="${halfRing(c, face - 3, face - .5, 315, 495)}" fill="rgba(255,255,255,.14)"/>`;
    const gs = face * 1.5; s += `<g transform="translate(${c - gs / 2} ${c - gs / 2 - 1}) scale(${gs / 48})">${glyphInner(locked ? "lock" : kind)}</g>`;
  }
  s += `<path d="M${pt(c, R - 3, 200)}A${R - 3} ${R - 3} 0 0 1 ${pt(c, R - 3, 250)}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round"/>`;
  if (o.badge) s += `<g class="bd"><circle cx="${c + R * .72}" cy="${c - R * .72}" r="9.500" fill="#ef6e67" stroke="${INK}" stroke-width="2.200"/><text x="${c + R * .72}" y="${c - R * .72 + 4.200}" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="12" fill="#fff">${o.badge}</text></g>`;
  return `<svg class="med" viewBox="0 0 ${T} ${T}" style="width:${T}px;height:${T}px">${s}</svg>`;
}
const mbtn = (kind, S, o = {}) => `<button class="mb ${kind} ${o.state || ""}" data-act="${o.act || kind}" aria-label="${o.label}" style="${o.style || ""}">${medal(kind, S, o)}<small>${o.label}${o.state === "locked" ? "<em>SOON</em>" : ""}</small></button>`;

// ───────────── HUD ─────────────
const hexPts = (c, r, k = 0) => Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90) * Math.PI / 180; return `${(c + Math.cos(a) * r).toFixed(1)},${(c + Math.sin(a) * r + k).toFixed(1)}`; }).join(" ");
function levelBadge() {
  const c = 27, R = 24;
  return `<svg viewBox="0 0 54 58" style="width:54px;height:58px"><polygon points="${hexPts(c, R, 4)}" fill="rgba(0,0,0,.4)" transform="translate(1.500 2)"/><polygon points="${hexPts(c, R, 3.500)}" fill="#2f7f69" stroke="${INK}" stroke-width="2.400" stroke-linejoin="round"/><polygon points="${hexPts(c, R)}" fill="#4fae91" stroke="${INK}" stroke-width="2.400" stroke-linejoin="round"/><polygon points="${hexPts(c, R - 5)}" fill="#0d2d31" stroke="${INK}" stroke-width="1.800" stroke-linejoin="round"/><path d="M${c - 20.8} ${c - 12}L${c} ${c - 24}L${c + 20.8} ${c - 12}" fill="none" stroke="#b9efd2" stroke-width="2.600" stroke-linejoin="round" stroke-linecap="round"/><text x="${c}" y="${c + 7}" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="21" fill="#f4ecc8" stroke="${INK}" stroke-width="3" paint-order="stroke">${PLAYER.level}</text></svg>`;
}
const starCoin = (S) => medal("play", S).replace('class="med"', 'class="med coin"');
function hud() {
  const p = PLAYER.xp / PLAYER.xpMax * 100;
  return `<div class="lvl"><button class="lvb" data-act="level" aria-label="Level ${PLAYER.level}">${levelBadge()}</button><div class="xpw"><div class="xpbar"><i style="width:${p}%"></i><b>${PLAYER.xp} / ${PLAYER.xpMax} XP</b></div><button class="streak" data-act="streak"><svg viewBox="0 0 48 48">${glyphInner("flameMini", false)}</svg><span>${PLAYER.streak}-day streak</span></button></div></div>
  <button class="pill" data-act="shop" aria-label="Stars"><span class="scoin"><svg viewBox="0 0 48 48" style="width:34px;height:34px">${glyphInner("star")}</svg></span><b class="sv2">${DATA.stars}</b><span class="plus">+</span></button>`;
}
function missionCard() {
  const claims = DATA.goals.filter(ready).length;
  const coins = DATA.goals.map((m, i) => {
    const done = m.v >= m.t, p = Math.min(1, m.v / m.t), col = done ? "#edca62" : m.c, c = 25, r = 17, claim = ready(m);
    const arc = done ? `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#edca62" stroke-width="7"/>` : `<path d="M${pt(c, r, -90)}A${r} ${r} 0 ${p > .5 ? 1 : 0} 1 ${pt(c, r, -90 + 359.9 * p)}" fill="none" stroke="${col}" stroke-width="7"/>`;
    const svg = `<svg viewBox="0 0 50 54" style="width:50px;height:54px"><circle cx="${c + 1.500}" cy="${c + 3.500}" r="22" fill="rgba(0,0,0,.4)"/><circle cx="${c}" cy="${c + 2.500}" r="22" fill="#08191d" stroke="${INK}" stroke-width="2.200"/><circle cx="${c}" cy="${c}" r="22" fill="#134347" stroke="${INK}" stroke-width="2.200"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="7.400"/>${arc}<circle cx="${c}" cy="${c}" r="${r - 5}" fill="${done ? "#edca62" : "#0d2d31"}" stroke="${INK}" stroke-width="1.800"/>${done ? `<path d="M${c - 6.500} ${c + .5}L${c - 1.500} ${c + 5.500}L${c + 7.500} ${c - 5}" fill="none" stroke="#2a1a05" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round"/>` : `<text x="${c}" y="${c + 5.200}" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="14" fill="#f4ecc8">${m.v}</text>`}<path d="M${pt(c, 20, 200)}A20 20 0 0 1 ${pt(c, 20, 250)}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.800" stroke-linecap="round"/></svg>`;
    return `<button class="mc ${claim ? "ready" : ""}" data-act="missions" aria-label="${m.label}">${svg}<span class="n">${m.short}</span>${claim ? `<span class="cl6">CLAIM +${m.rw}</span>` : `<span class="c">${Math.min(m.v, m.t)} / ${m.t}</span>`}</button>`;
  }).join("");
  return `<div class="mcard"><div class="mh"><span>TODAY'S MISSIONS</span>${claims ? `<em><i></i>${claims} READY</em>` : `<em>RESETS ${DATA.reset.toUpperCase()}</em>`}</div><div class="mrow6">${coins}</div></div>`;
}
function dockPath() {
  return `<path d="M0 34H128C146 34 152 8 195 8C238 8 244 34 262 34H390V116H0Z" fill="rgba(0,0,0,.4)" transform="translate(0 4)"/><path d="M0 32H128C146 32 152 6 195 6C238 6 244 32 262 32H390V116H0Z" fill="#0c2a2e" stroke="${INK}" stroke-width="2.400"/><path d="M0 35H128C146 35 152 9 195 9C238 9 244 35 262 35H390" fill="none" stroke="rgba(244,236,200,.2)" stroke-width="1.600"/><path d="M12 34H116M274 34H378" stroke="rgba(244,236,200,.28)" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" transform="translate(0 12)"/>`;
}
const WORLD = { cy: 418, pr: 74, or: 112, ps: 1.4 };
function homeHTML() {
  return `${hud()}${logoSVG(0)}${missionCard()}
  <svg class="dockbg" viewBox="0 0 390 116" style="top:728px">${dockPath()}</svg>
  ${mbtn("garage", 50, { label: "GARAGE", style: "left:19px;top:742px" })}${mbtn("daily", 50, { label: "DAILY", badge: "!", style: "left:97px;top:742px" })}${mbtn("play", 90, { label: "", style: "left:142px;top:688px;width:106px" })}${mbtn("friends", 50, { label: "FRIENDS", state: "locked", style: "left:231px;top:742px" })}${mbtn("settings", 50, { label: "SETTINGS", style: "left:309px;top:742px" })}<span class="ptag" style="top:792px">PLAY</span>`;
}
const L6 = logoLayout();
setup("H", WORLD, homeHTML, {
  draw(ctx, t) { drawPlanetO(ctx, t, L6); },
  bind(root) {
    root.querySelectorAll(".mb,.pill,.lvb,.streak").forEach(b => b.addEventListener("pointerdown", () => { if (b.classList.contains("mb")) sparkAt(root, b); }));
  },
});
function sparkAt(root, b) {
  const r = b.querySelector(".med").getBoundingClientRect(), h = root.getBoundingClientRect(), k = h.width / 390, cx = (r.left - h.left + r.width / 2) / k, cy = (r.top - h.top + r.height / 2) / k;
  for (let i = 0; i < 10; i++) { const el = document.createElement("i"); el.className = "spk"; el.style.left = cx + "px"; el.style.top = cy + "px"; el.style.background = ["#ffe28a", "#f4ecc8", "#77d5aa", "#ef6e67"][i % 4]; root.appendChild(el); const a = Math.random() * 6.28, d = 30 + Math.random() * 26; el.animate([{ transform: "translate(-50%,-50%) rotate(45deg) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) rotate(${200 + i * 30}deg) scale(.2)`, opacity: 0 }], { duration: 560, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => el.remove(); }
}

// ───────────── kit page ─────────────
(function () {
  const root = document.getElementById("K");
  root.innerHTML = `<div class="kit"><h2>Home v6 · illustrated kit</h2><p class="lead">Every piece shares one light (upper-left), an ink outline, a hard cast shadow and two-tone facets, the same rules as the plane.</p>
  <h3>Logo</h3><div class="logobox"><canvas width="780" height="560"></canvas>${logoSVG(0).replace('class="logo6"', 'class="logo6 klogo"')}</div>
  <h3>Medallion buttons</h3><div class="row">${[["garage", "Garage"], ["daily", "Daily"], ["friends", "Friends"], ["settings", "Settings"]].map(([k, l]) => `<div class="kc">${medal(k, 56, { state: k === "friends" ? "locked" : "", badge: k === "daily" ? "!" : "" })}<small>${l}${k === "friends" ? " · locked" : ""}</small></div>`).join("")}<div class="kc">${medal("play", 90)}<small>Play</small></div></div>
  <h3>Level and currency</h3><div class="row"><div class="kc">${levelBadge()}<small>Level badge</small></div><div class="kc"><div class="pill static"><span class="scoin"><svg viewBox="0 0 48 48" style="width:34px;height:34px">${glyphInner("star")}</svg></span><b>120</b><span class="plus">+</span></div><small>Stars</small></div></div>
  <p class="spec">Medallion: rim (lit upper-left, shaded lower-right), recessed face, layered paper glyph, specular tick. Sizes 50 / 90. Ink outline 2.2. Cast shadow +2.5,+5.</p></div>`;
  const ctx = root.querySelector("canvas").getContext("2d"), t0 = performance.now(); ctx.setTransform(2, 0, 0, 2, 0, 0);
  (function f() { if (root.classList.contains("on")) { ctx.clearRect(0, 0, 390, 300); drawPlanetO(ctx, (performance.now() - t0) / 1000, L6); } requestAnimationFrame(f); })();
})();

const WHY = { H: "<b>Illustrated Home.</b> Custom chunky paper lettering with the living planet as the O, medallion buttons lit like the plane, a quest panel, and a dock that cradles Play.", K: "<b>Kit.</b> The logo, medallions and HUD pieces on their own." };
const stage = document.getElementById("stage"), why = document.getElementById("why");
function fit() { const s = Math.min(1, (innerHeight - 112) / H, innerWidth / W); stage.style.transform = `scale(${s})`; stage.style.marginBottom = -(H * (1 - s)) + "px"; }
addEventListener("resize", fit); fit();
function show(k) { document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x.dataset.t === k)); document.querySelectorAll(".phone").forEach(p => p.classList.toggle("on", p.id === k)); why.innerHTML = WHY[k]; history.replaceState(null, "", "#" + k); }
document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => show(b.dataset.t));
show(/^#(H|K)$/.test(location.hash) ? location.hash.slice(1) : "H");
