// Home round 2: calm world (plane orbiting the planet) + great foreground UI. Demo-only data and fake navigation.
const W = 390, H = 844;
const PAL = { id: "bloom", bg: "#08191d", ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62" };
const RIDER = { shape: "manta" };
const DATA = {
  best: 842, stars: 120, streak: 3, reset: "14h 22m", next: "Pollen Path · Lv 2",
  goals: [
    { label: "Survive 35 seconds", short: "Survive 35s", v: 35, t: 35, c: "#77d5aa", rw: 18 },
    { label: "Thread 5 perfect gates", short: "5 perfect gates", v: 3, t: 5, c: "#a99be0", rw: 20 },
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
function Sheet(root, side) {
  const scrim = $('<div class="scrim"></div>'), el = $('<div class="sheet' + (side ? ' side' : '') + '"></div>'); root.append(scrim, el);
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
  const view = { redraw() { ui.innerHTML = build(); sheet = sheet || Sheet(root, extra && extra.side); bindNav(root, sheet); root.querySelectorAll(".sv").forEach(s => s.textContent = DATA.stars); extra && extra.bind && extra.bind(root, sheet, view); } };
  views.push(view); view.redraw();
  frameLoop(id, t => { if (extra && extra.loop) { extra.loop(ctx, t, root); return; } const a = world(ctx, t, cfg); extra && extra.tick && extra.tick(root, t, a); extra && extra.draw && extra.draw(ctx, t, a); });
  return { root, view };
}

