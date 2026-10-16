// Home round 2: calm world (plane orbiting the planet) + great foreground UI. Demo-only data and fake navigation.
const W = 390, H = 844;
const PAL = { id: "bloom", bg: "#08191d", ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62" };
const RIDER = { shape: "manta" };
const DATA = {
  best: 842, stars: 120, streak: 3, reset: "14h 22m", next: "Pollen Path · Lv 2",
  goals: [
    { label: "Survive 35 seconds", short: "Survive 35s", v: 35, t: 35, c: "#77d5aa", rw: 18 },
    { label: "Thread 5 perfect gates", short: "5 perfect gates", v: 3, t: 5, c: "#edca62", rw: 20 },
    { label: "Pass 12 living gates", short: "Pass 12 gates", v: 7, t: 12, c: "#ef6e67", rw: 18 },
  ],
};
const ICON = {
  garage: '<svg viewBox="0 0 48 48"><path d="M44 24 12 8l6 13H6l8 3-8 3h12l-6 13z" fill="currentColor"/></svg>',
  gear: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 3l4 7h-8zM24 45l-4-7h8zM3 24l7-4v8zM45 24l-7 4v-8zM9 9l8 2-6 6zM39 39l-8-2 6-6zM39 9l-2 8-6-6zM9 39l2-8 6 6z" fill="currentColor"/></svg>',
  flame: '<svg viewBox="0 0 48 48"><path d="M24 4c2 9 12 13 12 25a12 12 0 01-24 0c0-6 3-9 6-12 0 4 2 6 4 7-1-8 0-14 2-20z" fill="currentColor"/></svg>',
  crown: '<svg viewBox="0 0 48 48"><path d="M5 38 3 14l12 11L24 8l9 17L45 14l-2 24z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 48 48"><path d="M24 3l6 14 15 1.5-11.500 10L37 43 24 35 11 43l3.500-14.500L3 18.500 18 17z" fill="currentColor"/></svg>',
  friends: '<svg viewBox="0 0 48 48"><circle cx="17" cy="16" r="7" fill="currentColor"/><path d="M3 40c0-9 6-14 14-14s14 5 14 14z" fill="currentColor"/><circle cx="34" cy="18" r="6" fill="currentColor" opacity=".7"/><path d="M30 27c8-1 15 3 15 13H33c0-5-1-9-3-13z" fill="currentColor" opacity=".7"/></svg>',
  play: '<svg viewBox="0 0 48 48"><path d="M13 7l30 17-30 17z" fill="currentColor"/></svg>',
};
const STARPATH = "M24 12l3.300 7.200 7.700 1-5.600 5.400 1.400 7.700L24 29.600 17.200 33.300l1.400-7.700L13 20.200l7.700-1z";

// ---------- world (calm on purpose: the plane, missions and UI are the heroes) ----------
const stars = Array.from({ length: 34 }, (_, i) => ({ x: ((i * 83) % 997) / 997 * W, y: ((i * 47) % 991) / 991 * H, size: .9 + (i % 4) * .3, phase: i * .63 }));
function mk(root) { const c = root.querySelector("canvas"), r = Math.min(devicePixelRatio || 1, 2); c.width = W * r; c.height = H * r; const x = c.getContext("2d"); x.setTransform(r, 0, 0, r, 0, 0); return x; }
function sky(ctx, t, cx, cy) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, shadeColor(PAL.bg, -.25)); g.addColorStop(.55, PAL.bg); g.addColorStop(1, shadeColor(PAL.ink, -.45));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(cx, cy, 40, cx, cy, H * .55); glow.addColorStop(0, colorAlpha(PAL.paper, .24)); glow.addColorStop(.5, colorAlpha(PAL.ink, .12)); glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  for (let l = 0; l < 2; l++) {
    ctx.fillStyle = colorAlpha(l ? PAL.paper : PAL.ink, .07 + l * .02); ctx.beginPath(); ctx.moveTo(-10, H + 10);
    for (let x = -10; x <= W + 10; x += 18) ctx.lineTo(x, H * (.42 + l * .24) + Math.sin(x * .018 + t * .05 + l * 2.1) * 18 + Math.sin(x * .043 + l) * 7);
    ctx.lineTo(W + 10, H + 10); ctx.closePath(); ctx.fill();
  }
  for (const s of stars) {
    const tw = .5 + Math.sin(t * 1.3 + s.phase) * .5, z = s.size * (1.2 + tw * .5);
    ctx.globalAlpha = .14 + tw * .3; ctx.fillStyle = s.phase % 2 > 1 ? PAL.mid : PAL.light;
    ctx.save(); ctx.translate(s.x, s.y);
    ctx.beginPath(); ctx.moveTo(0, -z * 2.2); ctx.lineTo(z * .34, -z * .34); ctx.lineTo(z * 2.2, 0); ctx.lineTo(z * .34, z * .34); ctx.lineTo(0, z * 2.2); ctx.lineTo(-z * .34, z * .34); ctx.lineTo(-z * 2.2, 0); ctx.lineTo(-z * .34, -z * .34); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.globalAlpha = 1;
}
function world(ctx, t, cfg, boost = 0) {
  sky(ctx, t, 195, cfg.cy);
  ctx.save(); ctx.setLineDash([2, 11]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = colorAlpha(PAL.light, .3); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(195, cfg.cy, cfg.or, 0, TAU); ctx.stroke(); ctx.restore();
  OrbitArt.drawLivingPlanet(ctx, "bloom-crown", { x: 195, y: cfg.cy, radius: cfg.pr * (1 + boost * .03), paletteId: "bloom", time: t, reduced: false });
  const a = t * .5 - 1.1;
  ctx.save(); ctx.translate(195 + Math.cos(a) * cfg.or, cfg.cy + Math.sin(a) * cfg.or); ctx.rotate(a + Math.PI / 2); ctx.scale(1.3, 1.3); drawGlider(ctx, RIDER, PAL, 1, t, 0, false, 0); ctx.restore();
  return a;
}

// ---------- shared UI helpers ----------
const views = [];
const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstChild; };
const ready = g => g.v >= g.t && !g.claimed;
function dial(g, size = 44, paper = false) {
  const done = g.v >= g.t, p = Math.min(1, g.v / g.t) * 100, c = done ? "#edca62" : g.c;
  return `<svg class="dial${paper ? " paper" : ""}" viewBox="0 0 48 48" style="width:${size}px;height:${size}px"><circle class="tr" cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="19" fill="none" stroke="${paper && !done ? shadeColor(g.c, -.25) : c}" stroke-width="4" pathLength="100" stroke-dasharray="${done ? 100 : p} 100" transform="rotate(-90 24 24)"${paper ? "" : ` style="filter:drop-shadow(0 0 4px ${c})"`}/>${done ? `<path class="star" d="${STARPATH}"/>` : `<text class="tx" x="24" y="29">${g.v}</text>`}</svg>`;
}
function toast(root, msg) { const el = root.querySelector(".toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1500); }
function topbar() {
  return `<div class="topbar"><button class="plate chip" data-act="best" aria-label="Your best">${ICON.crown.replace("<svg", '<svg style="color:#edca62"')}<span class="col"><small>BEST</small>${DATA.best}</span></button>
  <h1 class="logo"><span class="o" data-t="Orbit">Orbit</span><span class="s" data-t="Shift">Shift</span></h1>
  <button class="plate chip" data-act="stars" aria-label="Stars">${ICON.star.replace("<svg", '<svg style="color:#edca62"')}<span class="col"><small>STARS</small><span class="sv">${DATA.stars}</span></span></button></div>`;
}
function tabsHTML(top, items) { return `<div class="tabs" style="top:${top}px">${items.map(([k, ic, l, o = {}]) => `<button class="plate tab${o.soon ? " soon" : ""}" data-act="${k}">${ICON[ic]}${l}${o.dot ? '<i class="dot"></i>' : ""}${o.soon ? '<span class="soonlbl">SOON</span>' : ""}</button>`).join("")}</div>`; }
function playbar(top) { return `<button class="plate playbar" style="top:${top}px" data-act="play">${ICON.play}<span class="pl">Play</span><span class="nx"><small>NEXT UP</small><b>${DATA.next}</b></span></button>`; }
const NAV = { garage: "→ Garage", settings: "→ Settings", daily: "→ Daily challenge", friends: "Friends & rivals: coming soon", play: "→ Level select", best: "Your best: 842 · friends' bests soon", stars: "Star shop: coming soon" };
function bindNav(root, sheet) {
  root.querySelectorAll("[data-act]").forEach(b => b.onclick = e => { e.stopPropagation(); const a = b.dataset.act; if (a === "missions") sheet.open(); else toast(root, NAV[a] || a); });
}
function Sheet(root) {
  const scrim = $('<div class="scrim"></div>'), el = $('<div class="sheet"></div>'); root.append(scrim, el);
  function render() {
    const done = DATA.goals.filter(g => g.v >= g.t).length;
    el.innerHTML = `<div class="grab"></div><h3>Today's missions</h3><div class="sub"><span>Resets in <em>${DATA.reset}</em></span><span>${done} of 3 complete</span></div>
    ${DATA.goals.map((g, i) => { const rdy = ready(g); return `<div class="mrow plate${rdy ? " ready" : ""}">${dial(g, 48)}<div><b>${g.label}</b><div class="bar"><i style="width:${Math.min(100, g.v / g.t * 100)}%;--c:${g.v >= g.t ? "#edca62" : g.c}"></i></div><small>${Math.min(g.v, g.t)} / ${g.t}</small></div><div class="rw">${g.claimed ? '<span class="claim plate done" style="display:grid;place-items:center">CLAIMED</span>' : rdy ? `<button class="plate claim" data-i="${i}">Claim</button><span class="reward">+${g.rw} ★</span>` : `<span class="reward">+${g.rw} ★</span>`}</div></div>`; }).join("")}
    <div class="streak">${ICON.flame}<span><b>${DATA.streak}-day streak</b> · finish one mission a day to keep it</span></div>`;
    el.querySelectorAll(".claim[data-i]").forEach(b => b.onclick = () => { const g = DATA.goals[+b.dataset.i]; g.claimed = true; DATA.stars += g.rw; views.forEach(v => v.redraw()); render(); root.querySelectorAll(".sv").forEach(s => { s.classList.remove("pop"); void s.offsetWidth; s.classList.add("pop"); }); toast(root, `+${g.rw} stars claimed`); });
  }
  const open = () => { render(); scrim.classList.add("on"); el.classList.add("on"); }, close = () => { scrim.classList.remove("on"); el.classList.remove("on"); };
  scrim.onclick = close; return { open, close, render };
}
function readyCount() { return DATA.goals.filter(ready).length; }
function frameLoop(id, fn) { const t0 = performance.now(); (function f() { if (document.getElementById(id).classList.contains("on")) fn((performance.now() - t0) / 1000); requestAnimationFrame(f); })(); }
function setup(id, cfg, build, extra) {
  const root = document.getElementById(id); root.innerHTML = '<canvas></canvas><div class="ui"></div><div class="toast"></div>';
  const ctx = mk(root), ui = root.querySelector(".ui"); let sheet;
  const view = { redraw() { ui.innerHTML = build(); sheet = sheet || Sheet(root); bindNav(root, sheet); root.querySelectorAll(".sv").forEach(s => s.textContent = DATA.stars); extra && extra.bind && extra.bind(root, sheet, view); } };
  views.push(view); view.redraw();
  frameLoop(id, t => { const a = world(ctx, t, cfg); extra && extra.tick && extra.tick(root, t, a); });
  return { root, view };
}

// ---------- D · Mission Control ----------
setup("D", { cy: 290, pr: 76, or: 134 }, () => {
  const g = DATA.goals, rc = readyCount();
  return `${topbar()}
  <button class="plate mcard" data-act="missions"><div class="hd"><span>Today's missions</span>${rc ? `<em><i></i>${rc} ready to claim<span class="chev">›</span></em>` : `<em>Resets ${DATA.reset}<span class="chev">›</span></em>`}</div>
    <div class="consts"><svg class="link"><path d="M72 36 Q116 52 160 38 M186 38 Q230 52 274 36" fill="none" stroke="rgba(244,236,200,.3)" stroke-dasharray="2 6"/></svg>
    ${g.map((m, i) => `<div class="cn" style="left:${[0, 118, 236][i]}px">${dial(m, 46)}${m.short}<small>${Math.min(m.v, m.t)} of ${m.t}</small></div>`).join("")}</div></button>
  ${playbar(620)}
  ${tabsHTML(712, [["garage", "garage", "Garage"], ["daily", "flame", "Daily", { dot: 1 }], ["friends", "friends", "Friends", { soon: 1 }], ["settings", "gear", "Settings"]])}`;
});

// ---------- E · Tags & Bunting ----------
setup("E", { cy: 392, pr: 70, or: 126 }, () => {
  const xs = [53, 154, 255], ys = [73, 84, 73];
  const pennants = DATA.goals.map((m, i) => `<div class="penwrap" style="left:${xs[i]}px;top:${ys[i]}px"><button class="pen" data-act="missions" style="animation-delay:-${i * 1.3}s">${dial(m, 44, true)}<span>${m.short}</span><small>${Math.min(m.v, m.t)} of ${m.t}</small></button></div>`).join("");
  const tag = (cls, left, w, h, ic, l, o = {}) => `<div class="hang" style="left:${left}px;width:${w}px;animation-delay:-${left / 60}s;animation-duration:${5 + (left % 3)}s"><button class="plate tag ${cls}" style="height:${h}px" data-act="${o.act}"><i></i>${ICON[ic]}${o.sub ? `<small>${o.sub}</small>` : ""}${l}${o.dot ? '<b class="dot"></b>' : ""}</button></div>`;
  return `${topbar()}
  <div class="bunting"><svg viewBox="0 0 390 150"><path d="M-10 64 Q195 102 400 64" fill="none" stroke="rgba(244,236,200,.55)" stroke-width="1.5"/></svg>${pennants}</div>
  <div class="rail"></div>
  ${tag("", 14, 56, 76, "garage", "Garage", { act: "garage" })}${tag("", 77, 56, 76, "flame", "Daily", { act: "daily", dot: 1 })}
  ${tag("play", 141, 108, 108, "play", "Play", { act: "play", sub: DATA.next })}
  ${tag("soon", 256, 56, 76, "friends", "Friends", { act: "friends" })}${tag("", 320, 56, 76, "gear", "Settings", { act: "settings" })}`;
});

// ---------- F · Mission Stage ----------
let fcur = 0;
setup("F", { cy: 282, pr: 72, or: 126 }, () => {
  const m = DATA.goals[fcur], rdy = ready(m), segN = m.t <= 12 ? m.t : 7, on = Math.round(Math.min(1, m.v / m.t) * segN), left = Math.max(0, m.t - m.v);
  return `${topbar()}
  <button class="plate stage-card" data-act="missions" style="--face:${rdy ? "rgba(36,54,34,.96)" : "rgba(9,32,36,.94)"}"><div class="row">${dial(m, 62)}<div><div class="k">Mission ${fcur + 1} of 3</div><h4>${m.label}</h4><div class="seg" style="--c:${m.v >= m.t ? "#edca62" : m.c}">${Array.from({ length: segN }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("")}</div></div><div class="nav"><b data-nav="-1">‹</b><b data-nav="1">›</b></div></div>
    <div class="sm"><span>${m.claimed ? "Claimed" : rdy ? "Ready to claim" : `${left} to go`}</span><span style="color:#edca62;font-weight:800">${m.claimed ? "✓" : "+" + m.rw + " ★"}</span></div>
    <div class="dots">${DATA.goals.map((_, i) => `<i class="${i === fcur ? "on" : ""}"></i>`).join("")}</div></button>
  <button class="launch" data-act="play" aria-label="Play"><svg viewBox="0 0 120 120"><circle class="l-under" cx="64" cy="65" r="42"/><circle class="l-disc" cx="60" cy="60" r="42"/><circle class="l-ring" cx="60" cy="60" r="51" pathLength="100" stroke-dasharray="88 12"/><g class="l-orbit"><path d="M60 -2l9 17-9-5-9 5z"/></g><path class="l-play" d="M52 44l24 16-24 16z"/></svg><span>PLAY</span></button>
  ${[[20, "garage", "garage", "Garage"], [78, "daily", "flame", "Daily", 1], [260, "friends", "friends", "Friends", 0, 1], [318, "settings", "gear", "Settings"]].map(([x, k, ic, l, dot, soon]) => `<button class="plate tab${soon ? " soon" : ""}" data-act="${k}" style="position:absolute;left:${x}px;top:628px;width:52px;height:60px;font-size:8.5px;letter-spacing:.1em">${ICON[ic]}${l}${dot ? '<i class="dot" style="right:8px"></i>' : ""}</button>`).join("")}`;
}, { bind(root, sheet, view) { root.querySelectorAll("[data-nav]").forEach(b => b.onclick = e => { e.stopPropagation(); fcur = (fcur + +b.dataset.nav + 3) % 3; view.redraw(); }); } });

// ---------- G · Orbit Stations ----------
const G = { cy: 392, or: 150, ang: [-90, 30, 150] };
setup("G", { cy: G.cy, pr: 70, or: G.or }, () => {
  const st = DATA.goals.map((m, i) => {
    const a = G.ang[i] * Math.PI / 180, x = 195 + Math.cos(a) * G.or - 32, y = G.cy + Math.sin(a) * G.or - 32;
    const above = G.ang[i] === -90, ly = above ? y - 40 : y + 70;
    return `<button class="st" data-act="missions" data-i="${i}" style="left:${x}px;top:${y}px;--c:${m.v >= m.t ? "#edca62" : m.c}"><span class="disc"></span>${dial(m, 64)}</button><div class="lbl" style="left:${x + 32 - 48}px;top:${ly}px">${m.short}<small>${Math.min(m.v, m.t)} of ${m.t}${ready(m) ? " · claim" : ""}</small></div>`;
  }).join("");
  return `${topbar()}${st}${playbar(664)}${tabsHTML(752, [["garage", "garage", "Garage"], ["daily", "flame", "Daily", { dot: 1 }], ["friends", "friends", "Friends", { soon: 1 }], ["settings", "gear", "Settings"]])}`;
}, { tick(root, t, a) { root.querySelectorAll(".st").forEach((s, i) => { const d = Math.abs(Math.atan2(Math.sin(a - G.ang[i] * Math.PI / 180), Math.cos(a - G.ang[i] * Math.PI / 180))); s.classList.toggle("hot", d < .32); }); } });

// ---------- chrome ----------
const WHY = {
  D: "<b>Mission control.</b> Missions live in one card under the planet, with a claim-ready badge. Play and the menu sit in the thumb zone, and Best and Stars take the familiar top corners.",
  E: "<b>Tags and bunting.</b> Missions are paper pennants on a string; the menu hangs as tags in easy thumb reach, with Play as the biggest tag. Everything sways softly.",
  F: "<b>Mission stage.</b> One mission at a time, big and readable (swipe or tap the arrows). Play is the orbit launcher, flanked by the menu. The least cluttered option.",
  G: "<b>Orbit stations.</b> Missions sit ON the orbit and light up as your plane passes. Most diegetic, with the cleanest bottom half. Tap a station for details.",
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
show(/^#[DEFG]$/.test(location.hash) ? location.hash[1] : "D");
