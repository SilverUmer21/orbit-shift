// Three Home concepts built on the real planet and glider art. Everything here is demo-only.
const W = 390, H = 844;
const PAL = { id: "bloom", bg: "#08191d", ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62" };
const RIDER = { shape: "manta" };
const DATA = { best: 842, stars: 120, goals: [{ label: "Survive 35s", v: 21, t: 35, c: "#77d5aa" }, { label: "5 perfect gates", v: 3, t: 5, c: "#edca62" }, { label: "Pass 12 gates", v: 7, t: 12, c: "#ef6e67" }] };
const ICON = {
  garage: '<svg viewBox="0 0 48 48"><path d="M44 24 12 8l6 13H6l8 3-8 3h12l-6 13z" fill="currentColor"/></svg>',
  gear: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 3l4 7h-8zM24 45l-4-7h8zM3 24l7-4v8zM45 24l-7 4v-8zM9 9l8 2-6 6zM39 39l-8-2 6-6zM39 9l-2 8-6-6zM9 39l2-8 6 6z" fill="currentColor"/></svg>',
  flame: '<svg viewBox="0 0 48 48"><path d="M24 4c2 9 12 13 12 25a12 12 0 01-24 0c0-6 3-9 6-12 0 4 2 6 4 7-1-8 0-14 2-20z" fill="currentColor"/></svg>',
  crown: '<svg viewBox="0 0 48 48"><path d="M5 38 3 14l12 11L24 8l9 17L45 14l-2 24z" fill="currentColor"/></svg>',
};

// ---------- shared drawing ----------
const stars = Array.from({ length: 40 }, (_, i) => ({ x: ((i * 83) % 997) / 997 * W, y: ((i * 47) % 991) / 991 * H, size: .9 + (i % 4) * .34, phase: i * .63 }));
function mk(root) { const c = root.querySelector("canvas"), r = Math.min(devicePixelRatio || 1, 2); c.width = W * r; c.height = H * r; const x = c.getContext("2d"); x.setTransform(r, 0, 0, r, 0, 0); return x; }
function sky(ctx, t, cx, cy, px = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, shadeColor(PAL.bg, -.25)); g.addColorStop(.55, PAL.bg); g.addColorStop(1, shadeColor(PAL.ink, -.45));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(cx, cy, 50, cx, cy, H * .62); glow.addColorStop(0, colorAlpha(PAL.paper, .28)); glow.addColorStop(.5, colorAlpha(PAL.ink, .14)); glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  for (let l = 0; l < 3; l++) {
    const base = H * (.2 + l * .2), amp = 16 + l * 7;
    ctx.save(); ctx.fillStyle = colorAlpha(l === 1 ? PAL.paper : PAL.ink, .1 + l * .035); ctx.shadowColor = "rgba(0,0,0,.32)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.moveTo(-10, H + 10);
    for (let x = -10; x <= W + 10; x += 18) ctx.lineTo(x, base + Math.sin(x * .018 + t * (.06 + l * .03) + l * 2.1 + px * .004 * (l + 1)) * amp + Math.sin(x * .043 + l) * amp * .4);
    ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  for (const s of stars) {
    const tw = .5 + Math.sin(t * 1.3 + s.phase) * .5, z = s.size * (1.4 + tw * .6);
    ctx.globalAlpha = .2 + tw * .38; ctx.fillStyle = s.phase % 2 > 1 ? PAL.mid : PAL.light;
    ctx.save(); ctx.translate(s.x + px * .01 * s.size, s.y);
    ctx.beginPath(); ctx.moveTo(0, -z * 2.2); ctx.lineTo(z * .34, -z * .34); ctx.lineTo(z * 2.2, 0); ctx.lineTo(z * .34, z * .34); ctx.lineTo(0, z * 2.2); ctx.lineTo(-z * .34, z * .34); ctx.lineTo(-z * 2.2, 0); ctx.lineTo(-z * .34, -z * .34); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.globalAlpha = 1;
}
function planet(ctx, x, y, r, t) { OrbitArt.drawLivingPlanet(ctx, "bloom-crown", { x, y, radius: r, paletteId: "bloom", time: t, reduced: false }); }
function dashed(ctx, x, y, r, t, dir = 1, a = .28) { ctx.save(); ctx.setLineDash([2, 11]); ctx.lineDashOffset = -t * 20 * dir; ctx.strokeStyle = colorAlpha(PAL.light, a); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); }
function ship(ctx, x, y, rot, t, s = 1.3, glow = .05) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); drawGlider(ctx, RIDER, PAL, 1, t, 0, false, glow); ctx.restore(); }
function dial(v, t, color, size = 48) {
  const p = Math.min(1, v / t) * 100;
  return `<svg viewBox="0 0 48 48" style="width:${size}px;height:${size}px"><circle cx="24" cy="24" r="19" fill="rgba(0,0,0,.4)" stroke="rgba(244,236,200,.16)" stroke-width="3"/><circle cx="24" cy="24" r="19" fill="none" stroke="${color}" stroke-width="4" pathLength="100" stroke-dasharray="${p} 100" transform="rotate(-90 24 24)" style="filter:drop-shadow(0 0 4px ${color})"/><text x="24" y="28" text-anchor="middle" fill="#f4ecc8" font-family="Fraunces,serif" font-weight="700" font-size="14">${v}</text></svg>`;
}
function toast(root, msg) { const el = root.querySelector(".toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1700); }
const frames = {};
function loop(id, fn) { const t0 = performance.now(); (function f() { if (document.getElementById(id).classList.contains("on")) fn((performance.now() - t0) / 1000); frames[id] = requestAnimationFrame(f); })(); }
const tilt = { x: 0 };
addEventListener("pointermove", e => { tilt.x = (e.clientX / innerWidth - .5) * 2; });

// ---------- A: Star-Chart Console ----------
(function () {
  const root = document.getElementById("A"), CX = 195, CY = 396;
  const nodes = [["Garage", 150, "garage", 0], ["Settings", 30, "gear", 0], ["Daily", -50, "flame", 1], ["Ranks", -130, "crown", 2]];
  let ticks = "";
  for (let a = 0; a < 360; a += 6) { const r1 = 196, r2 = a % 30 === 0 ? 206 : 201, rad = a * Math.PI / 180; ticks += `<line x1="${CX + Math.cos(rad) * r1}" y1="${CY + Math.sin(rad) * r1}" x2="${CX + Math.cos(rad) * r2}" y2="${CY + Math.sin(rad) * r2}" stroke="rgba(244,236,200,${a % 30 === 0 ? .5 : .22})" stroke-width="1"/>`; }
  let spokes = "";
  for (const [, ang] of nodes) { const rad = ang * Math.PI / 180; spokes += `<line x1="${CX + Math.cos(rad) * 108}" y1="${CY + Math.sin(rad) * 108}" x2="${CX + Math.cos(rad) * 150}" y2="${CY + Math.sin(rad) * 150}" stroke="rgba(244,236,200,.22)" stroke-dasharray="2 5"/>`; }
  root.innerHTML = `<canvas></canvas>
  <svg class="chart" viewBox="0 0 390 844"><g>${ticks}${spokes}</g>
    <circle cx="${CX}" cy="${CY}" r="172" fill="none" stroke="rgba(244,236,200,.14)"/>
    <circle cx="${CX}" cy="${CY}" r="100" fill="none" stroke="#edca62" stroke-width="3" stroke-dasharray="520 108" transform="rotate(-70 ${CX} ${CY})" style="filter:drop-shadow(0 0 7px rgba(237,202,98,.6))"/>
    <g class="spin"><defs><path id="rtA" d="M${CX},${CY} m-111,0 a111,111 0 1,1 222,0 a111,111 0 1,1 -222,0"/></defs><text class="ringtext" dy="0"><textPath href="#rtA" textLength="690" lengthAdjust="spacing">TAP THE PLANET TO LAUNCH ◆ TAP THE PLANET TO LAUNCH ◆</textPath></text></g>
  </svg>
  <div class="abs" style="left:0;right:0;top:26px;text-align:center"><div class="eyebrow">A tiny world in motion</div><h1 class="logo" style="margin-top:9px;display:flex;justify-content:center;gap:12px;font-size:46px"><span class="o" data-t="Orbit">Orbit</span><span class="s" data-t="Shift">Shift</span></h1></div>
  <div class="abs stats"><span>Best<b>${DATA.best}</b></span><i></i><span>Stars<b>${DATA.stars}</b></span></div>
  <button class="core" aria-label="Launch"></button>
  <div class="abs consts"></div><div class="toast"></div>`;
  const ctx = mk(root), consts = root.querySelector(".consts");
  nodes.forEach(([label, ang, icon, badge], i) => {
    const rad = ang * Math.PI / 180, x = CX + Math.cos(rad) * 172 - 30, y = CY + Math.sin(rad) * 172 - 30;
    const b = document.createElement("button"); b.className = "plate node" + (label === "Ranks" ? " lock" : ""); b.style.left = x + "px"; b.style.top = y + "px";
    b.innerHTML = ICON[icon] + `<span>${label}</span>` + (badge === 1 ? '<i class="badge"></i>' : ""); b.querySelector("svg").style.cssText = "width:24px;height:24px;color:#edca62";
    b.onclick = () => toast(root, label === "Ranks" ? "Friends leaderboard: coming soon" : "→ " + label); root.appendChild(b);
  });
  const pos = [[8, 40], [143, 76], [278, 40]];
  consts.innerHTML = `<svg class="abs" style="left:0;top:0;width:390px;height:150px;overflow:visible"><path d="M60 62 Q195 112 330 62" fill="none" stroke="rgba(244,236,200,.28)" stroke-dasharray="2 6"/></svg>` + DATA.goals.map((g, i) => `<div class="cnode" style="left:${pos[i][0]}px;top:${[24, 62, 24][i]}px">${dial(g.v, g.t, g.c)}${g.label}<small>${g.v} of ${g.t}</small></div>`).join("");
  root.querySelector(".core").onclick = () => { launch = 1; toast(root, "→ Launch: level select"); };
  let launch = 0;
  loop("A", t => {
    sky(ctx, t, CX, CY, tilt.x * 40);
    ctx.save(); ctx.translate(tilt.x * -4, 0);
    dashed(ctx, CX, CY, 128, t, 1, .3);
    const ang = t * .55 - 1.2, sx = CX + Math.cos(ang) * 128, sy = CY + Math.sin(ang) * 128;
    planet(ctx, CX, CY + Math.sin(t * 1.4) * 1.5, 78 * (1 + launch * .04), t);
    launch = Math.max(0, launch - .02);
    ship(ctx, sx, sy, ang + Math.PI / 2, t, 1.25);
    ctx.restore();
  });
})();

// ---------- B: Paper Diorama ----------
(function () {
  const root = document.getElementById("B"), CX = 195, CY = 428;
  const tags = [["Garage", "garage", 20, 250, "6.2s"], ["Settings", "gear", 308, 232, "7s"]];
  root.innerHTML = `<canvas></canvas>
  <div class="banner"><div class="sheet"><div class="eyebrow">A tiny world in motion</div><h1 class="logo"><span class="o" data-t="Orbit">Orbit</span><span class="s" data-t="Shift">Shift</span></h1><div class="bestline"><span>BEST <b>${DATA.best}</b></span><i></i><span>STARS <b>${DATA.stars}</b></span></div></div>
    <div class="daily"><button class="plate dailybtn"><svg viewBox="0 0 48 48"><path d="M24 4c2 9 12 13 12 25a12 12 0 01-24 0c0-6 3-9 6-12 0 4 2 6 4 7-1-8 0-14 2-20z" fill="currentColor"/></svg>Daily challenge<em>3 new</em></button></div></div>
  ${tags.map(([l, ic, x, len, d]) => `<div class="mobile" style="left:${x + 31}px;--len:${len}px;animation-duration:${d};animation-delay:-${len / 50}s"><button class="plate tag" data-l="${l}"><i></i>${ICON[ic]}<span>${l.toUpperCase()}</span></button></div>`).join("")}
  <button class="pad" aria-label="Take off"></button><div class="pad-label">TAP TO TAKE OFF</div>
  ${DATA.goals.map((g, i) => `<div class="flag" style="left:${[16, 78, 300][i]}px;top:${[626, 650, 632][i]}px"><div class="pole"><div class="cloth"><i style="--p:${g.v / g.t * 100}%;--c:${g.c}"></i></div></div><em>${g.v}/${g.t}</em>${g.label}</div>`).join("")}
  <div class="toast"></div>`;
  const ctx = mk(root); let fly = -1;
  root.querySelectorAll(".tag,.dailybtn").forEach(b => b.onclick = () => toast(root, "→ " + (b.dataset.l || "Daily challenge")));
  root.querySelector(".pad").onclick = () => { if (fly < 0) { fly = 0; toast(root, "→ Takeoff: level select"); } };
  loop("B", t => {
    sky(ctx, t, CX, CY, tilt.x * 40);
    const px = tilt.x * -6;
    dashed(ctx, CX + px * .3, CY, 156, t, 1, .26);
    planet(ctx, CX + px * .3, CY, 92, t);
    for (const [i, c, y0, a] of [[0, "#0d3335", 664, 18], [1, "#0a2a2c", 712, 14], [2, "#07201f", 760, 10]]) {
      ctx.save(); ctx.fillStyle = c; ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = -4;
      ctx.beginPath(); ctx.moveTo(-10, H + 10);
      for (let x = -10; x <= W + 10; x += 10) ctx.lineTo(x + px * (i + 1) * .5, y0 + Math.sin(x * .02 + i * 2.2) * a + Math.sin(x * .05 + i) * a * .4);
      ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    for (const [r, c, dy] of [[82, "#12343a", 0], [68, "#1f6a5e", -5], [54, "#edca62", -10]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(CX, 784 + dy, r, r * .27, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = "rgba(6,19,25,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(CX, 774, 38, 10, 0, 0, TAU); ctx.stroke();
    let sx = CX, sy = 742 + Math.sin(t * 2.2) * 3, rot = -Math.PI / 2;
    if (fly >= 0) {
      fly += .012; const u = Math.min(1, fly), ty = CY + 156, e = u * u * (3 - 2 * u);
      sx = CX; sy = 742 + (ty - 742) * e - Math.sin(u * Math.PI) * 30; rot = -Math.PI / 2 + (u > .8 ? (u - .8) * 5 * Math.PI / 2 * .9 : 0);
      if (fly > 1) { const a = Math.PI / 2 + (fly - 1) * 1.6; sx = CX + Math.cos(a) * 156; sy = CY + Math.sin(a) * 156; rot = a + Math.PI / 2; if (fly > 3.6) fly = -1; }
    }
    ship(ctx, sx, sy, rot, t, 1.2);
  });
})();

// ---------- C: Instant Orbit (attract mode) ----------
(function () {
  const root = document.getElementById("C"), CX = 195, CY = 452, PR = 76, OR = 146;
  root.innerHTML = `<canvas></canvas>
  <div class="titlebar"><h1 class="logo"><span class="o" data-t="Orbit">Orbit</span><span class="s" data-t="Shift">Shift</span></h1></div>
  <button class="plate corner" style="left:16px;top:60px" aria-label="Garage">${ICON.garage}</button>
  <button class="plate corner" style="right:16px;top:60px" aria-label="Settings">${ICON.gear}</button>
  <div class="bestwrap"><small>BEAT YOUR BEST</small><b>${DATA.best}</b></div>
  <div class="legend">${DATA.goals.map(g => `<span><i style="--c:${g.c}"></i>${g.label}</span>`).join("")}</div>
  <div class="tap">TAP ANYWHERE TO PLAY</div><div class="tap-sub">Tap to reverse · thread the gaps</div><div class="toast"></div>`;
  const ctx = mk(root);
  let ang = -1.2, dir = 1, last = 0, gates = [], nextGate = 1, ripples = [], taps = 0, auto = 1;
  const speed = 1.1;
  root.querySelectorAll(".corner").forEach((b, i) => b.onclick = e => { e.stopPropagation(); toast(root, i ? "→ Settings" : "→ Garage"); });
  root.addEventListener("pointerdown", e => { if (e.target.closest(".corner")) return; dir *= -1; taps++; auto = 0; ripples.push({ r: OR, life: 1 }); if (taps === 4) toast(root, "→ In the real game this starts a run"); });
  function spawn() {
    // aim the gap at where the ship will be when the gate arrives, assuming it keeps going the same way
    const travel = 4.2, a = ang + dir * speed * travel;
    gates.push({ r: 430, gap: a, open: 1.25 + Math.random() * .3, type: gates.length % 2 });
  }
  loop("C", t => {
    const dt = Math.min(.05, t - last); last = t;
    ang += dir * speed * dt;
    if (t > nextGate) { spawn(); nextGate = t + 2.9; }
    for (const g of gates) g.r -= (g.r > OR + 70 ? 112 : 78) * dt;
    gates = gates.filter(g => g.r > PR + 10);
    sky(ctx, t, CX, CY, tilt.x * 40);
    // inner goal arcs hugging the planet
    [["#77d5aa", DATA.goals[0]], ["#edca62", DATA.goals[1]], ["#ef6e67", DATA.goals[2]]].forEach(([c, g], i) => {
      const s = -Math.PI / 2 + i * TAU / 3 + .12, e = s + (TAU / 3 - .24), r = PR + 14;
      ctx.save(); ctx.lineWidth = 4; ctx.lineCap = "butt"; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.arc(CX, CY, r, s, e); ctx.stroke();
      ctx.strokeStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(CX, CY, r, s, s + (e - s) * Math.min(1, g.v / g.t)); ctx.stroke(); ctx.restore();
    });
    // gates: thin leaf rings like the real game
    for (const g of gates) {
      const half = g.open / 2, st = g.gap + half, en = g.gap + TAU - half, near = Math.min(1, (OR + 210 - g.r) / 145 + .16);
      ctx.save(); ctx.globalAlpha = Math.max(.12, near); ctx.lineCap = "round";
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 13; ctx.beginPath(); ctx.arc(CX + 2, CY + 3, g.r, st, en); ctx.stroke();
      ctx.strokeStyle = PAL.paper; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(CX, CY, g.r, st, en); ctx.stroke();
      for (let a = st + .18; a < en - .12; a += .36) { ctx.save(); ctx.translate(CX + Math.cos(a) * g.r, CY + Math.sin(a) * g.r); ctx.rotate(a); ctx.fillStyle = a % .72 < .36 ? PAL.mid : PAL.light; ctx.beginPath(); ctx.ellipse(0, 8, 4, 10, a % .72 < .36 ? .5 : -.5, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = PAL.light; for (const s of [-1, 1]) { const a = g.gap + s * half; ctx.save(); ctx.translate(CX + Math.cos(a) * g.r, CY + Math.sin(a) * g.r); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4.3, 0); ctx.lineTo(0, 6); ctx.lineTo(-4.3, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.restore();
      if (!g.done && g.r <= OR + 8) { g.done = true; const d = Math.abs(Math.atan2(Math.sin(ang - g.gap), Math.cos(ang - g.gap))); ripples.push({ r: OR, life: 1, good: d < half - .1 }); }
    }
    dashed(ctx, CX, CY, OR, t, dir, .3);
    planet(ctx, CX, CY, PR, t);
    for (const r of ripples) { r.life -= .03; ctx.save(); ctx.globalAlpha = Math.max(0, r.life) * .7; ctx.strokeStyle = r.good === false ? PAL.accent : PAL.gold; ctx.lineWidth = 2 + r.life * 4; ctx.beginPath(); ctx.arc(CX, CY, OR + (1 - r.life) * 26, 0, TAU); ctx.stroke(); ctx.restore(); }
    ripples = ripples.filter(r => r.life > 0);
    ship(ctx, CX + Math.cos(ang) * OR, CY + Math.sin(ang) * OR, ang + dir * Math.PI / 2, t, 1.1);
  });
})();

// ---------- chrome ----------
const stage = document.getElementById("stage");
function fitStage() { const s = Math.min(1, (innerHeight - 74) / H, innerWidth / W); stage.style.transform = `scale(${s})`; stage.style.height = H + "px"; stage.style.marginBottom = -(H * (1 - s)) + "px"; }
addEventListener("resize", fitStage); fitStage();
document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => {
  document.querySelectorAll("#tabs button").forEach(x => x.setAttribute("aria-pressed", x === b));
  document.querySelectorAll(".phone").forEach(p => p.classList.toggle("on", p.id === b.dataset.t));
  history.replaceState(null, "", "#" + b.dataset.t);
});
if (/^#[ABC]$/.test(location.hash)) document.querySelector(`#tabs [data-t="${location.hash[1]}"]`).click();
