// Orbit Shift home prototype: the title floats over live gameplay, menu items are objects in the world,
// and the first tap starts a real run.
const W = 390, H = 844, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const PAL = { ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62", bg: "#08191d" };
const DART = { shape: "dart" }, MANTA = { shape: "manta" };
const C = { cream: "#f4ecc8", gold: "#edca62", goldD: "#c9963a", coral: "#ef6e67", mint: "#77d5aa", leaf: "#4fae91", leafD: "#2f7f69", lav: "#b5a8e6", teal: "#123740" };
const P = { cx: 195, cy: 452, pr: 70, or: 124 };
const G = { stars: 120, best: 842, level: 7, xp: .62, dailyOpen: false, sound: true,
  missions: [{ n: "Survive 35s", v: 35, t: 35, c: "#8fd9b8", rw: 18, claimed: false }, { n: "5 perfect", v: 3, t: 5, c: "#b5a8e6", rw: 20, claimed: false }, { n: "12 gates", v: 7, t: 12, c: "#f0a196", rw: 18, claimed: false }] };

// ───────── logo: rounded paper letters, the O is a gate ring ─────────
const LET = {
  R: "M8 56V7H25C33.500 7 39 12.500 39 21.500C39 30 33.500 35.500 25 35.500H8M25 35.500L39 56",
  B: "M8 56V7H24C31.500 7 36 11 36 18C36 25 31.500 29.500 24 29.500H8M24 29.500H26C34 29.500 39 34.500 39 42.500C39 51 34 56 26 56H8",
  I: "M8 7V56", T: "M3 7H39M21 7V56",
  S: "M37 17C35 10.500 29.500 7 22.500 7C14 7 8 11.500 8 18.500C8 25.500 13.500 28.500 22 30.500C31 32.500 37.500 35.500 37.500 43.500C37.500 51.500 31 56 22.500 56C14 56 8.500 52 6.500 45",
  H: "M8 7V56M36 7V56M8 31.500H36", F: "M8 56V7H35M8 30.500H29",
};
const ADV = { R: 50, B: 50, I: 24, T: 50, S: 48, H: 52, F: 44 };
function logoSVG() {
  const s = 1.12, st = 'fill="none" stroke-linecap="round" stroke-linejoin="round"', x1 = (W - 240 * s) / 2, x2 = (W - 218 * s) / 2, y1 = 98, y2 = 178;
  let n = 0;
  const L = (d, x, y, face, depth) => `<g class="lt" style="animation-delay:${(n++) * 70 + 120}ms"><g transform="translate(${x.toFixed(2)} ${y}) scale(${s})"><path d="${d}" ${st} stroke="rgba(0,0,0,.45)" stroke-width="13" transform="translate(0 9)" filter="url(#lsh)"/>${[4.5, 3, 1.5].map(dy => `<path d="${d}" ${st} stroke="${depth}" stroke-width="12" transform="translate(0 ${dy})"/>`).join("")}<path d="${d}" ${st} stroke="url(#${face})" stroke-width="12"/><path d="${d}" ${st} stroke="rgba(255,255,255,.55)" stroke-width="2" transform="translate(-2.600 -2.600)"/></g></g>`;
  // gate-ring O: an arc with a gap at the top right, leaf marks and light diamonds, like the in-game gates
  const ox = x1 + 33 * s, oy = y1 + 31.5 * s, R = 21.5 * s, gap = 52, g0 = -45 + gap / 2, g1 = -45 - gap / 2 + 360, pt = (a, r = R) => [ox + Math.cos(a * Math.PI / 180) * r, oy + Math.sin(a * Math.PI / 180) * r];
  const [ax, ay] = pt(g0), [bx, by] = pt(g1), arc = `M${ax.toFixed(2)} ${ay.toFixed(2)}A${R} ${R} 0 1 1 ${bx.toFixed(2)} ${by.toFixed(2)}`;
  let leaves = "";
  for (let a = g0 + 22, i = 0; a < g1 - 12; a += 30, i++) { const [lx, ly] = pt(a, R + 9.5); leaves += `<ellipse cx="${lx.toFixed(2)}" cy="${ly.toFixed(2)}" rx="5.200" ry="2.300" transform="rotate(${a + (i % 2 ? 30 : -30)} ${lx.toFixed(2)} ${ly.toFixed(2)})" fill="${i % 2 ? C.cream : "#a6e3c2"}"/>`; }
  const dia = [[ax, ay, g0], [bx, by, g1]].map(([x, y, a]) => `<path d="M0 -4.600L3.400 0L0 4.600L-3.400 0Z" transform="translate(${(x + Math.cos(a * Math.PI / 180) * 11.5).toFixed(2)} ${(y + Math.sin(a * Math.PI / 180) * 11.5).toFixed(2)}) rotate(${a + 90})" fill="${C.cream}"/>`).join("");
  const O = `<g class="lt" style="animation-delay:40ms"><path d="${arc}" ${st} stroke="rgba(0,0,0,.45)" stroke-width="${13 * s}" transform="translate(0 9)" filter="url(#lsh)"/>${[4.5, 3, 1.5].map(dy => `<path d="${arc}" ${st} stroke="#2f7f69" stroke-width="${12 * s}" transform="translate(0 ${dy * s})"/>`).join("")}<path d="${arc}" ${st} stroke="url(#lo)" stroke-width="${12 * s}"/><path d="${arc}" ${st} stroke="rgba(255,255,255,.5)" stroke-width="2" transform="translate(-2.400 -2.400)"/>${leaves}${dia}</g>`;
  let g = O, x = x1 + 66 * s; n = 1;
  for (const ch of "RBIT") { g += L(LET[ch], x, y1, "la", "#3f8e7d"); x += ADV[ch] * s; }
  x = x2; for (const ch of "SHIFT") { g += L(LET[ch], x, y2, "lb", "#c26f63"); x += ADV[ch] * s; }
  return `<svg class="logo" viewBox="0 0 390 300" width="390" height="300" aria-label="Orbit Shift"><defs>
    <linearGradient id="la" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="#fdf6e1"/><stop offset="1" stop-color="#e2d2a2"/></linearGradient>
    <linearGradient id="lb" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="62"><stop offset="0" stop-color="#f8df92"/><stop offset="1" stop-color="#dfae4a"/></linearGradient>
    <linearGradient id="lo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be6c4"/><stop offset="1" stop-color="#4fae91"/></linearGradient>
    <filter id="lsh" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.400"/></filter></defs>${g}
    <text x="195" y="278" text-anchor="middle" class="tag">A TINY WORLD IN MOTION</text></svg>`;
}

// ───────── world objects (DOM, drawn as illustrations) ─────────
function medal() {
  const c = 30, lobes = Array.from({ length: 16 }, (_, i) => { const a = i * 22.5 * Math.PI / 180; return `<circle cx="${(c + Math.cos(a) * 22).toFixed(2)}" cy="${(c + Math.sin(a) * 22).toFixed(2)}" r="6.400"/>`; }).join("");
  const xa = -90 + 359.9 * G.xp, xr = 15.5, ex = c + Math.cos(xa * Math.PI / 180) * xr, ey = c + Math.sin(xa * Math.PI / 180) * xr;
  return `<button class="obj medal" data-obj="level" aria-label="Level ${G.level}"><svg viewBox="0 0 60 78" width="60" height="78">
    <path d="M18 44L12 74L21 68L27 76L32 48Z" fill="#c2625b"/><path d="M42 44L48 74L39 68L33 76L28 48Z" fill="#e0847a"/>
    <g fill="rgba(0,0,0,.4)" transform="translate(1.500 3)">${lobes}<circle cx="${c}" cy="${c}" r="22"/></g>
    <g fill="#4fae91">${lobes}<circle cx="${c}" cy="${c}" r="22"/></g><g fill="#77d5aa" transform="translate(-.8 -.8)" opacity=".55" clip-path="inset(0 0 55% 0)">${lobes}</g>
    <circle cx="${c}" cy="${c}" r="18.500" fill="${C.cream}"/><circle cx="${c}" cy="${c}" r="${xr}" fill="none" stroke="rgba(18,52,58,.15)" stroke-width="3"/>
    <path d="M${c} ${c - xr}A${xr} ${xr} 0 ${G.xp > .5 ? 1 : 0} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="${C.goldD}" stroke-width="3" stroke-linecap="round"/>
    <text x="${c}" y="${c + 6.500}" text-anchor="middle" class="lvn">${G.level}</text></svg></button>`;
}
const STAR = "M12 2.6L14.7 8.9L21.5 9.6L16.400 14.100L17.900 20.800L12 17.300L6.100 20.800L7.600 14.100L2.500 9.600L9.300 8.900Z";
function ribbon() {
  return `<button class="obj ribbon" data-obj="shop" aria-label="${G.stars} stars"><svg viewBox="0 0 132 52" width="132" height="52">
    <path d="M30 13H128L118 26L128 39H30Z" fill="rgba(0,0,0,.4)" transform="translate(1.500 3)"/><path d="M30 13H128L118 26L128 39H30Z" fill="${C.cream}"/><path d="M30 13H128L124 18H30Z" fill="#fff" opacity=".45"/><path d="M30 34H124L128 39H30Z" fill="#c9bc8c" opacity=".6"/>
    <circle cx="26" cy="29" r="20" fill="rgba(0,0,0,.4)"/><circle cx="24.500" cy="26" r="20" fill="${C.goldD}"/><circle cx="24.500" cy="24.500" r="20" fill="${C.gold}"/><circle cx="24.500" cy="24.500" r="15" fill="#f6d77e"/>
    <g transform="translate(13.500 13.500) scale(.92)"><path d="${STAR}" fill="#b8822a" transform="translate(.6 1.200)"/><path d="${STAR}" fill="#fff6d0"/></g>
    <path d="M10 15A20 20 0 0 1 22 5.500" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.200" stroke-linecap="round"/>
    <text x="80" y="32" text-anchor="middle" class="cnt">${G.stars}</text></svg></button>`;
}
function gear() {
  const pts = []; for (let t = 0; t < 8; t++) for (const [da, r] of [[-12.5, 11], [-7.5, 15], [7.5, 15], [12.5, 11]]) { const a = (t * 45 + da - 90) * Math.PI / 180; pts.push([18 + Math.cos(a) * r, 18 + Math.sin(a) * r]); }
  const d = "M" + pts.map(p => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z M18 13.200a4.800 4.800 0 1 0 .01 0Z";
  return `<button class="obj gear" data-obj="settings" aria-label="Settings"><svg viewBox="0 0 36 40" width="36" height="40"><path d="${d}" fill="rgba(0,0,0,.4)" fill-rule="evenodd" transform="translate(1.300 2.600)"/><path d="${d}" fill="${C.cream}" fill-rule="evenodd"/><path d="M18 9.500a8.500 8.500 0 1 0 .01 0Z M18 13.200a4.800 4.800 0 1 0 .01 0Z" fill="#cdbf8e" fill-rule="evenodd"/></svg></button>`;
}
function gift() {
  return `<button class="obj gift${G.dailyOpen ? " opened" : ""}" data-obj="daily" aria-label="Daily gift"><span class="bob"><svg viewBox="0 0 70 84" width="70" height="84">
    <ellipse cx="35" cy="80" rx="18" ry="3.500" fill="rgba(0,0,0,.35)"/>
    <g class="giftbox"><path d="M12 34H58V66A4 4 0 0 1 54 70H16A4 4 0 0 1 12 66Z" fill="#c2625b"/><path d="M12 34H35V70H16A4 4 0 0 1 12 66Z" fill="${C.coral}"/>
    <path d="M30.500 34H39.500V70H30.500Z" fill="${C.gold}"/><path d="M30.500 34H35V70H30.500Z" fill="#f6d77e"/></g>
    <g class="lid"><path d="M8 24H62V34A2 2 0 0 1 60 36H10A2 2 0 0 1 8 34Z" fill="#e0847a"/><path d="M8 24H62V28H8Z" fill="#f29a8f"/><path d="M30 24H40V36H30Z" fill="${C.gold}"/>
    <path d="M35 24C27 24 20 20 21.500 15C23 11 30 12 35 24Z" fill="${C.gold}"/><path d="M35 24C43 24 50 20 48.500 15C47 11 40 12 35 24Z" fill="#f6d77e"/><circle cx="35" cy="23" r="3.200" fill="#d9a43a"/></g>
    ${G.dailyOpen ? "" : `<g class="badge"><circle cx="60" cy="16" r="8" fill="${C.coral}" stroke="#0c2228" stroke-width="2.500"/><path d="M60 11.500V17M60 19.800V20" stroke="#fff" stroke-width="2.400" stroke-linecap="round"/></g>`}
    </svg></span><span class="olbl">${G.dailyOpen ? "Tomorrow" : "Daily gift"}</span></button>`;
}
function islandsObj() { return `<button class="obj isl" data-obj="islands" aria-label="Cosmic Islands map"><span class="bob"><img src="bloom-island.svg" alt="" width="118" height="118"></span><span class="olbl">Islands <em>1/4</em></span></button>`; }
function emberObj() { return `<button class="obj emb" data-obj="ember" aria-label="Ember island, locked"><span class="bob"><img src="ember-island.svg" alt="" width="72" height="72"><svg class="lk" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="11" fill="#0c2228"/><path d="M8.600 11V9.200a3.400 3.400 0 0 1 6.800 0V11h-1.800V9.200a1.600 1.600 0 0 0-3.200 0V11z" fill="#cdbf8e"/><rect x="7.400" y="10.600" width="9.200" height="7.200" rx="1.600" fill="#f4ecc8"/></svg></span></button>`; }
function hangarObj() {
  return `<button class="obj hangar" data-obj="garage" aria-label="Garage"><span class="bob"><svg viewBox="0 0 118 118" width="118" height="118"><defs><linearGradient id="hr" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#275b59"/><stop offset="1" stop-color="#102b35"/></linearGradient><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#efe2b0"/><stop offset="1" stop-color="#cbb980"/></linearGradient><filter id="hs"><feGaussianBlur stdDeviation="3"/></filter></defs>
    <ellipse cx="59" cy="104" rx="34" ry="6.500" fill="#02090d" opacity=".45" filter="url(#hs)"/>
    <path d="M18 66L100 64L88 88L59 108L30 88Z" fill="url(#hr)"/><path d="M22 70L42 90L48 72L59 106L66 72L76 90L96 68L86 88L59 106L32 88Z" fill="#173945"/>
    <ellipse cx="59" cy="65" rx="42" ry="13" fill="url(#hg)"/><ellipse cx="59" cy="63.500" rx="30" ry="8.500" fill="none" stroke="#a4925b" stroke-width="1.600" stroke-dasharray="3 4"/>
    <path d="M30 60L36 50L40 60Z" fill="${C.mint}"/><path d="M80 59L86 48L91 59Z" fill="${C.coral}"/></svg><canvas width="236" height="160" class="hcv"></canvas></span><span class="olbl">Garage <em>new</em></span></button>`;
}
function missionsLegend() {
  return `<button class="obj legend" data-obj="missions" aria-label="Today's missions">${G.missions.map(m => { const done = m.v >= m.t; return `<span class="${done && !m.claimed ? "rdy" : ""}${m.claimed ? " got" : ""}"><i style="--c:${done ? C.gold : m.c}"></i>${m.n}<b>${m.claimed ? "✓" : done ? "claim" : m.v + "/" + m.t}</b></span>`; }).join("")}</button>`;
}
function homeHTML() {
  return `<div class="homeui">${medal()}${ribbon()}${gear()}<div class="logow">${logoSVG()}</div>${emberObj()}${gift()}${missionsLegend()}<div class="tap"><i></i>TAP TO PLAY<i></i></div>${islandsObj()}${hangarObj()}</div>
  <div class="playui"><div class="score">0</div><div class="sbest">BEST <b>${G.best}</b></div></div>
  <div class="overui"><p class="ob">Orbit broken</p><div class="ofinal">0</div><p class="onew">New best</p><div class="tap retry"><i></i>TAP TO RETRY<i></i></div><button class="obj homebtn" data-obj="home">Home</button></div>`;
}

// ───────── sim: attract mode and real play share it ─────────
let mode = "home", ang = -1.2, dir = 1, flip = 0, gates = [], nextGate = 1, fxs = [], labels = [], shake = 0, score = 0, flow = 1, sinceRev = 9, over = 0, lastT = 0, rings = [];
const W0 = 1.55;
const speed = () => mode === "play" ? Math.min(2.2, W0 + score * .02) : 1.15;
function spawnGate() {
  const travel = mode === "play" ? Math.max(2.2, 3.2 - score * .03) : 4.2, open = mode === "play" ? Math.max(.92, 1.25 - score * .012) : 1.45;
  const reach = speed() * travel, gap = ang + (Math.random() * 2 - 1) * Math.min(Math.PI, reach * .8);
  gates.push({ r: 470, v: (470 - P.or) / travel, gap, open, done: false });
}
function reverse() { dir *= -1; flip = 1; sinceRev = 0; ripple(); beep(520, .05, "sine", .03); }
function startPlay() { mode = "play"; score = 0; flow = 1; gates = []; nextGate = .5; $("#phone").className = "playing"; $(".score").textContent = "0"; beep(660, .08, "triangle", .04); }
function crash() {
  mode = "over"; over = 0; shake = 14; burst(P.cx + Math.cos(ang) * P.or, P.cy + Math.sin(ang) * P.or, 26, ["#f4ecc8", "#ef6e67", "#edca62", "#77d5aa"], 220);
  const nb = score > G.best; if (nb) G.best = score;
  $(".ofinal").textContent = score; $(".onew").style.visibility = nb ? "visible" : "hidden"; $("#phone").className = "over"; beep(140, .25, "square", .05);
}
function goHome() { mode = "home"; gates = []; nextGate = 1; $("#ui").innerHTML = homeHTML(); bindHangar(); $("#phone").className = "home"; }
function stepSim(dt, t) {
  const w = speed(); ang += dir * w * dt; flip = Math.max(0, flip - dt * 6); sinceRev += dt;
  if (mode !== "over" && t > nextGate) { spawnGate(); nextGate = t + (mode === "play" ? Math.max(1.35, 2.2 - score * .02) : 2.9); }
  for (const g of gates) {
    g.r -= g.v * dt * (mode === "over" ? .3 : 1);
    if (!g.done && g.r <= P.or + 2) {
      g.done = true; const d = Math.abs(Math.atan2(Math.sin(ang - g.gap), Math.cos(ang - g.gap))), clear = g.open / 2 - .1 - d;
      if (mode === "play") {
        if (clear < 0) { crash(); continue; }
        const perfect = d < g.open * .14; score += perfect ? 2 * flow : 1; flow = perfect ? Math.min(5, flow + 1) : 1; $(".score").textContent = score;
        rings.push({ r: P.or, life: 1, col: perfect ? C.gold : C.cream });
        if (perfect) { labels.push({ text: flow > 1 ? `PERFECT x${flow}` : "PERFECT", life: 1 }); burst(P.cx + Math.cos(ang) * P.or, P.cy + Math.sin(ang) * P.or, 12, [C.gold, C.cream], 150); beep(880, .07, "triangle", .04); beep(1320, .09, "sine", .02, .06); }
        else beep(660, .05, "sine", .03);
      } else rings.push({ r: P.or, life: 1, col: "rgba(244,236,200,.7)" });
    }
  }
  gates = gates.filter(g => g.r > P.pr + 6);
  // attract mode steers itself toward the next gap
  if (mode === "home") { const g = gates.filter(g => !g.done).sort((a, b) => a.r - b.r)[0]; if (g) { const d = Math.atan2(Math.sin(g.gap - ang), Math.cos(g.gap - ang)); if (Math.sign(d) !== dir && Math.abs(d) > .22 && sinceRev > .3) { dir *= -1; flip = 1; sinceRev = 0; } } }
  for (const r of rings) { r.life -= dt * 1.6; r.r += dt * 60; } rings = rings.filter(r => r.life > 0);
  for (const f of fxs) { f.life -= dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 160 * dt; f.rot += f.spin * dt; } fxs = fxs.filter(f => f.life > 0);
  for (const l of labels) l.life -= dt * 1.1; labels = labels.filter(l => l.life > 0);
  shake = Math.max(0, shake - dt * 40);
  if (mode === "over") over += dt;
}
function burst(x, y, n, cols, sp) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = sp * (.35 + Math.random() * .65), life = .5 + Math.random() * .5; fxs.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life, max: life, size: 2.5 + Math.random() * 3.5, col: cols[i % cols.length], rot: Math.random() * 6, spin: (Math.random() - .5) * 10 }); } }

// ───────── drawing (matches the game's papercut scenery) ─────────
const bgStars = Array.from({ length: 34 }, (_, i) => ({ x: (i * 83) % 997 / 997 * W, y: (i * 47) % 991 / 991 * H, s: 1 + (i % 3) * .5, p: i * .63 }));
const motes = Array.from({ length: 18 }, (_, i) => ({ x: (i * 97) % W, y: (i * 211) % H, r: .9 + (i % 3) * .5, p: i * 1.7, v: 4 + (i % 5) * 1.4 }));
let tilt = 0; addEventListener("pointermove", e => { tilt = (e.clientX / innerWidth - .5) * 2; });
function drawWorld(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#071419"); g.addColorStop(.45, "#0c2329"); g.addColorStop(1, "#08171c"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(P.cx, P.cy, P.pr * .6, P.cx, P.cy, H * .62); glow.addColorStop(0, "rgba(79,174,145,.22)"); glow.addColorStop(.55, "rgba(18,52,58,.12)"); glow.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  for (const s of bgStars) { const tw = .5 + Math.sin(t * 1.2 + s.p) * .5; ctx.globalAlpha = .18 + tw * .35; ctx.fillStyle = s.p % 2 > 1 ? PAL.mid : PAL.light; const z = s.s * (1.2 + tw * .5); ctx.save(); ctx.translate(s.x + tilt * s.s * 2, s.y); ctx.beginPath(); ctx.moveTo(0, -z * 2); ctx.lineTo(z * .35, -z * .35); ctx.lineTo(z * 2, 0); ctx.lineTo(z * .35, z * .35); ctx.lineTo(0, z * 2); ctx.lineTo(-z * .35, z * .35); ctx.lineTo(-z * 2, 0); ctx.lineTo(-z * .35, -z * .35); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.globalAlpha = 1;
  // side vines with paper leaves (the game's Bloom scenery)
  for (let layer = 0; layer < 3; layer++) {
    ctx.save(); ctx.globalAlpha = .11 + layer * .04; ctx.strokeStyle = [PAL.ink, PAL.paper, PAL.mid][layer]; ctx.lineWidth = 16 - layer * 4; ctx.lineCap = "round";
    const sway = Math.sin(t * .4 + layer) * 4;
    ctx.beginPath(); ctx.moveTo(-20, H * (.14 + layer * .1)); ctx.quadraticCurveTo(W * .15 + sway, H * (.3 + layer * .05), W * .06, H * (.56 + layer * .07)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W + 20, H * (.1 + layer * .12)); ctx.quadraticCurveTo(W * .84 - sway, H * (.26 + layer * .07), W * .94, H * (.52 + layer * .09)); ctx.stroke(); ctx.restore();
  }
  for (let i = 0; i < 12; i++) { const side = i % 2 ? 1 : -1, x = side < 0 ? 8 + (i % 3) * 7 : W - 8 - (i % 3) * 7, y = H * (.14 + i * .045); ctx.save(); ctx.globalAlpha = .26; ctx.translate(x, y); ctx.rotate(side * (.55 + Math.sin(t * .7 + i) * .1)); ctx.fillStyle = i % 3 ? PAL.paper : PAL.accent; ctx.beginPath(); ctx.ellipse(0, 0, 7 + i % 4, 18 + i % 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = PAL.light; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke(); ctx.restore(); }
  // gates (leafy paper rings, like the game)
  for (const gt of gates) {
    const half = gt.open / 2, st = gt.gap + half, en = gt.gap + Math.PI * 2 - half, a = gt.done ? .25 : Math.min(1, (P.or + 230 - gt.r) / 150 + .12) * (mode === "home" ? .8 : 1);
    ctx.save(); ctx.globalAlpha = Math.max(.08, a); ctx.lineCap = "round";
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 13; ctx.beginPath(); ctx.arc(P.cx + 2, P.cy + 3, gt.r, st, en); ctx.stroke();
    ctx.strokeStyle = PAL.paper; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(P.cx, P.cy, gt.r, st, en); ctx.stroke();
    for (let q = st + .18; q < en - .12; q += .36) { ctx.save(); ctx.translate(P.cx + Math.cos(q) * gt.r, P.cy + Math.sin(q) * gt.r); ctx.rotate(q); ctx.fillStyle = q % .72 < .36 ? PAL.mid : PAL.light; ctx.beginPath(); ctx.ellipse(0, 8, 4, 10 + Math.sin(t * 1.6 + q) * 1.5, q % .72 < .36 ? .5 : -.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    for (const sd of [-1, 1]) { const q = gt.gap + sd * half; ctx.save(); ctx.translate(P.cx + Math.cos(q) * gt.r, P.cy + Math.sin(q) * gt.r); ctx.rotate(q); ctx.fillStyle = PAL.light; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 0); ctx.lineTo(0, 7); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  // paper hills in front of the gates, behind the islands
  for (let l = 0; l < 3; l++) { const base = H * (.79 + l * .055), cols = ["rgba(18,56,61,.95)", "rgba(13,44,48,.97)", "rgba(9,32,36,1)"]; ctx.save(); ctx.fillStyle = cols[l]; ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = -5; ctx.beginPath(); ctx.moveTo(-10, H + 10); for (let x = -10; x <= W + 10; x += 10) ctx.lineTo(x + tilt * (l + 1) * 2, base + Math.sin(x * .016 + l * 2.2 + t * .05) * (14 - l * 3) + Math.sin(x * .045 + l) * 5); ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
  for (const m of motes) { const y = ((m.y - t * m.v) % (H + 40) + H + 40) % (H + 40) - 20, x = m.x + Math.sin(t * .4 + m.p) * 12, a = .18 + .3 * (.5 + Math.sin(t * 1.1 + m.p) * .5); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#e8f3c8"; ctx.shadowColor = "#e8f3c8"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(x, y, m.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  // orbit, planet, mission rings
  ctx.save(); ctx.setLineDash([2, 11]); ctx.lineDashOffset = -t * 20 * dir; ctx.strokeStyle = "rgba(230,227,179,.28)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(P.cx, P.cy, P.or, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  OrbitArt.drawLivingPlanet(ctx, "bloom-crown", { x: P.cx, y: P.cy, radius: P.pr, paletteId: "bloom", time: t, reduced: false });
  if (mode === "home") G.missions.forEach((m, i) => { const r = P.pr + 11 + i * 6.5, p = Math.min(1, m.v / m.t), done = m.v >= m.t, col = m.claimed ? "rgba(244,236,200,.35)" : done ? C.gold : m.c; ctx.save(); ctx.lineWidth = 3.4; ctx.strokeStyle = "rgba(0,0,0,.38)"; ctx.beginPath(); ctx.arc(P.cx, P.cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = done && !m.claimed ? 9 + Math.sin(t * 4) * 3 : 4; ctx.beginPath(); ctx.arc(P.cx, P.cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (m.claimed ? 1 : p)); ctx.stroke(); ctx.restore(); });
  for (const r of rings) { ctx.save(); ctx.globalAlpha = r.life * .6; ctx.strokeStyle = r.col; ctx.lineWidth = 2 + r.life * 3; ctx.beginPath(); ctx.arc(P.cx, P.cy, r.r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  // glider (hidden after a crash)
  if (mode !== "over") {
    const px = P.cx + Math.cos(ang) * P.or, py = P.cy + Math.sin(ang) * P.or;
    for (let k = 1; k <= 12; k++) { const ta = ang - dir * k * .05; ctx.globalAlpha = (1 - k / 13) * .4; ctx.fillStyle = k % 2 ? PAL.gold : PAL.accent; ctx.beginPath(); ctx.arc(P.cx + Math.cos(ta) * P.or, P.cy + Math.sin(ta) * P.or, 3 * (1 - k / 14), 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.save(); ctx.translate(px, py); ctx.rotate(ang + dir * Math.PI / 2 + flip * dir * .18); ctx.scale(1.08, 1.08); drawGlider(ctx, MANTA, PAL, 1, t, flip, flow >= 4, 0); ctx.restore();
  }
  for (const f of fxs) { ctx.save(); ctx.globalAlpha = Math.max(0, f.life / f.max); ctx.fillStyle = f.col; ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.beginPath(); ctx.moveTo(0, -f.size); ctx.lineTo(f.size * .72, 0); ctx.lineTo(0, f.size); ctx.lineTo(-f.size * .72, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
  for (const l of labels) { const u = 1 - l.life; ctx.save(); ctx.globalAlpha = Math.min(1, l.life * 2); ctx.translate(P.cx, P.cy - P.or - 34 - u * 18); const sc = 1 + Math.sin(Math.min(1, u * 5) * Math.PI) * .2; ctx.scale(sc, sc); ctx.font = "800 20px Fraunces, Georgia, serif"; ctx.textAlign = "center"; ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillText(l.text, 1, 6); ctx.fillStyle = "#c26f63"; ctx.fillText(l.text, 0, 3); ctx.fillStyle = C.gold; ctx.fillText(l.text, 0, 0); ctx.restore(); }
}

// ───────── interaction ─────────
let audio;
function beep(f, d, type = "sine", vol = .03, delay = 0) { if (!G.sound) return; try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + delay; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g).connect(audio.destination); o.start(t0); o.stop(t0 + d + .02); } catch { } }
function phonePt(e) { const r = $("#phone").getBoundingClientRect(), k = r.width / W; return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; }
let lastTap = { x: P.cx, y: P.cy };
function ripple() { const el = document.createElement("i"); el.className = "rip"; el.style.left = lastTap.x + "px"; el.style.top = lastTap.y + "px"; $("#fx").appendChild(el); el.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: .7 }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 520, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => el.remove(); }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 1700); }
function squash(el) { el?.animate([{ transform: "scale(1)" }, { transform: "scale(.88,.92)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" }); }
function objCenter(el) { const r = el.getBoundingClientRect(), p = $("#phone").getBoundingClientRect(), k = p.width / W; return { x: (r.left - p.left + r.width / 2) / k, y: (r.top - p.top + r.height / 2) / k }; }
function flyStars(from, n, amount) {
  const coin = $(".ribbon svg"), to = objCenter(coin); to.x -= 41; to.y -= 1.5;
  let left = n;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div"); el.className = "fly"; el.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="${STAR}" fill="#b8822a" transform="translate(.6 1.2)"/><path d="${STAR}" fill="${C.gold}"/></svg>`; $("#fx").appendChild(el);
    const sx = from.x + (Math.random() - .5) * 30, sy = from.y + (Math.random() - .5) * 20, cx = sx + (to.x - sx) * .3 + (Math.random() - .5) * 120, cy = Math.min(sy, to.y) - 40 - Math.random() * 60, kf = [];
    for (let j = 0; j <= 16; j++) { const u = j / 16, x = (1 - u) ** 2 * sx + 2 * (1 - u) * u * cx + u * u * to.x, y = (1 - u) ** 2 * sy + 2 * (1 - u) * u * cy + u * u * to.y; kf.push({ transform: `translate(${x}px,${y}px) translate(-50%,-50%) scale(${1.3 - .6 * u}) rotate(${u * 260}deg)`, opacity: j ? 1 : 0 }); }
    el.animate(kf, { duration: 820, delay: i * 55, easing: "cubic-bezier(.5,0,.4,1)", fill: "both" }).onfinish = () => { el.remove(); squash($(".ribbon")); beep(990 + i * 40, .05, "triangle", .02); if (--left === 0) { const c = $(".cnt"), from0 = G.stars; G.stars += amount; const t0 = performance.now(); (function f(t) { const u = Math.min(1, (t - t0) / 500); c.textContent = Math.round(from0 + amount * (1 - (1 - u) ** 3)); if (u < 1) requestAnimationFrame(f); })(t0); } };
  }
}
function note(html) { $("#note").innerHTML = html + `<button class="nclose" data-close>Close</button>`; $("#note").classList.add("on"); $("#veil").classList.add("on"); }
function closeNote() { $("#note").classList.remove("on"); $("#veil").classList.remove("on"); }
function missionsNote() {
  note(`<h3>Today's missions</h3>${G.missions.map((m, i) => { const done = m.v >= m.t; return `<div class="nrow"><i style="--c:${done ? C.gold : m.c}"></i><span><b>${m.n}</b><em><u style="width:${Math.min(100, m.v / m.t * 100)}%;background:${done ? C.gold : m.c}"></u></em></span>${m.claimed ? `<strong>Done</strong>` : done ? `<button class="nclaim" data-claim="${i}">+${m.rw} ★</button>` : `<strong>${m.v}/${m.t}</strong>`}</div>`; }).join("")}<p class="nsub">New missions at midnight</p>`);
}
function openGift() {
  const rays = Array.from({ length: 18 }, (_, i) => { const a0 = i * 20 * Math.PI / 180, a1 = (i * 20 + 9) * Math.PI / 180; return `<path d="M0 0L${(Math.cos(a0) * 220).toFixed(1)} ${(Math.sin(a0) * 220).toFixed(1)}L${(Math.cos(a1) * 220).toFixed(1)} ${(Math.sin(a1) * 220).toFixed(1)}Z"/>`; }).join("");
  const big = gift().replace('data-obj="daily"', 'data-obj="giftopen"').replace('class="obj gift', 'class="obj gift big').replace(/<g class="badge">[\s\S]*?<\/g>/, "");
  $("#giftview").innerHTML = `<svg class="rays" viewBox="-220 -220 440 440" width="440" height="440"><defs><radialGradient id="rg"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs><g fill="url(#rg)">${rays}</g><circle r="90" fill="url(#rg)"/></svg>
    <p class="gt">Daily gift</p><p class="gday">Day 4 of 7 · keep the streak</p>${big}<p class="gs">Tap to open</p><div class="gamt">+40</div>`;
  $("#giftview").classList.add("on"); $("#veil").classList.add("on");
}
function onTap(e) {
  const p = phonePt(e); lastTap = p;
  if (e.target.closest("[data-close]")) { closeNote(); return; }
  const cl = e.target.closest("[data-claim]");
  if (cl) { const i = +cl.dataset.claim, m = G.missions[i]; if (m.claimed) return; m.claimed = true; const from = objCenter(cl); closeNote(); refreshHome(); setTimeout(() => flyStars(from, 6, m.rw), 120); return; }
  const o = e.target.closest("[data-obj]");
  if ($("#veil").classList.contains("on") && !o) { closeNote(); $("#giftview").classList.remove("on"); return; }
  if (o) {
    squash(o.querySelector("svg,img") || o); beep(740, .05, "triangle", .025);
    const k = o.dataset.obj;
    if (k === "home") { goHome(); return; }
    if (k === "missions") { missionsNote(); return; }
    if (k === "daily") { if (G.dailyOpen) toast("Next gift tomorrow"); else openGift(); return; }
    if (k === "giftopen") {
      if (o.classList.contains("opening")) return; o.classList.add("opening"); beep(520, .3, "triangle", .03);
      setTimeout(() => { o.classList.add("opened"); $("#giftview").classList.add("done"); const from = objCenter(o); burst(from.x, from.y - 10, 28, [C.gold, C.cream, C.coral, C.mint], 230); beep(880, .1, "triangle", .04); beep(1320, .14, "sine", .03, .08); $(".gs").textContent = "4-day streak";
        setTimeout(() => { $("#giftview").classList.remove("on", "done"); $("#veil").classList.remove("on"); G.dailyOpen = true; refreshHome(); flyStars(from, 8, 40); }, 1300); }, 650);
      return;
    }
    toast({ level: "Level 7 · 380 XP to level 8", shop: "Star shop opens here", settings: (G.sound = !G.sound) ? "Sound on" : "Sound off", islands: "Cosmic Islands map opens here", garage: "Garage opens here · Dart glider unlocked", ember: "Ember unlocks after the Bloom chapter" }[k]);
    return;
  }
  if (mode === "home") { burst(p.x, p.y, 8, [C.cream, C.mint, C.gold], 110); startPlay(); return; }
  if (mode === "play") { reverse(); return; }
  if (mode === "over" && over > .6) { startPlay(); }
}
function refreshHome() { if (mode !== "home") return; const ui = $(".homeui"); if (!ui) return; const keep = ui.querySelector(".logow").outerHTML; $("#ui").innerHTML = homeHTML(); $(".logow").outerHTML = keep; $(".homeui").classList.add("still"); bindHangar(); }
let hangarCtx = null;
function bindHangar() { const c = $(".hcv"); hangarCtx = c ? c.getContext("2d") : null; if (hangarCtx) hangarCtx.setTransform(2, 0, 0, 2, 0, 0); }

// ───────── boot ─────────
function boot() {
  const cv = $("#world"), r = Math.min(devicePixelRatio || 1, 2); cv.width = W * r; cv.height = H * r; const ctx = cv.getContext("2d");
  goHome();
  $("#phone").addEventListener("pointerdown", e => { if (e.button === 0) onTap(e); });
  addEventListener("keydown", e => { if (e.code === "Space") { e.preventDefault(); if (mode === "play") reverse(); else if (mode === "home") startPlay(); else if (over > .6) startPlay(); } });
  const stage = $("#stage"), fit = () => { const s = Math.min(1, innerHeight / H, innerWidth / W); stage.style.transform = `scale(${s})`; stage.style.marginBottom = -(H * (1 - s)) + "px"; };
  addEventListener("resize", fit); fit();
  const t0 = performance.now();
  (function f(now) {
    const t = (now - t0) / 1000, dt = Math.min(.05, t - lastT); lastT = t; stepSim(dt, t);
    ctx.setTransform(r, 0, 0, r, 0, 0); ctx.save(); if (shake) ctx.translate((Math.random() - .5) * shake, (Math.random() - .5) * shake); drawWorld(ctx, t); ctx.restore();
    if (hangarCtx) { hangarCtx.clearRect(0, 0, 118, 80); hangarCtx.save(); hangarCtx.translate(59, 36 + Math.sin(t * 2) * 2.5); hangarCtx.rotate(-.55 + Math.sin(t * .8) * .08); hangarCtx.scale(.92, .92); drawGlider(hangarCtx, DART, PAL, 1, t, 0, false, .25); hangarCtx.restore(); }
    requestAnimationFrame(f);
  })(t0);
}
boot();
