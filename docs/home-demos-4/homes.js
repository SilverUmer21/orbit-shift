// Three Home screens on the v2 kit, plus a spec page. Shared: calm world, mission rings, level/streak layer, gate-ring dock.
NAV.reward = "→ Daily reward ready: claim +50 ★"; NAV.stars = "Star shop: coming soon"; NAV.best = "Your best: 842 · friends' bests soon"; NAV.missions = "";
const legendHTML = (top) => `<button class="legend" data-act="missions" style="top:${top}px" aria-label="Today's missions">${DATA.goals.map(g => `<span class="${ready(g) ? "rdy" : ""}"><i style="--c:${g.v >= g.t ? "#edca62" : g.c}"></i>${g.short}<b>${g.v >= g.t ? "✓" : g.v + "/" + g.t}</b></span>`).join("")}</button>`;
function missionRings(ctx, cx, cy, pr, t) {
  DATA.goals.forEach((g, i) => {
    const r = pr + 11 + i * 7, p = Math.min(1, g.v / g.t), done = g.v >= g.t, col = done ? "#edca62" : g.c;
    ctx.save(); ctx.lineWidth = 3.6; ctx.lineCap = "butt";
    ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "rgba(244,236,200,.08)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = done ? 10 + Math.sin(t * 4) * 3 : 5; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.stroke(); ctx.restore();
  });
}
function playerLayer() {
  return `<div class="tl"><button class="lvbtn" data-act="best" aria-label="Level ${PLAYER.level}">${levelBadge(50)}</button>${streakRow()}</div>
  <div class="tr"><button class="starchip" data-act="stars" aria-label="Stars"><b class="sv">${DATA.stars}</b>${glyphSVG("star", 16)}</button>${ringButton("gift", { size: 46, state: "new", label: "Reward", act: "reward", cls: "tiny" })}</div>`;
}
const bestLine = (top) => `<div class="bestline" style="top:${top}px">${glyphSVG("crown", 12)}<span>BEST</span><b>${DATA.best}</b></div>`;
function dock() {
  return `${ringButton("garage", { style: "left:18px;top:688px" })}${ringButton("daily", { state: "attention", style: "left:88px;top:688px" })}${ringButton("play", { style: "left:153px;top:664px", label: "PLAY" })}${ringButton("friends", { state: "locked", style: "left:242px;top:688px" })}${ringButton("settings", { style: "left:312px;top:688px" })}`;
}
const hooks = {
  bind(root) { root.querySelectorAll(".rb").forEach(b => b.addEventListener("pointerdown", () => spark(b))); },
  draw(cy, pr) { return (ctx, t) => missionRings(ctx, 195, cy, pr, t); },
};
// Home 1: orbit lockup
setup("H1", { cy: 428, pr: 66, or: 118 }, () => `${playerLayer()}<div class="ttl t1">${titleLockup()}</div>${bestLine(538)}${legendHTML(562)}${dock()}`, { bind: hooks.bind, draw: hooks.draw(428, 66) });
// Home 2: the title is a gate arched over the planet
setup("H2", { cy: 376, pr: 66, or: 112 }, () => `${playerLayer()}<div class="ttl t2">${titleArc(195, 376, 150)}</div>${bestLine(506)}${legendHTML(532)}${dock()}`, { bind: hooks.bind, draw: hooks.draw(376, 66) });
// Home 3: emblem crest
setup("H3", { cy: 438, pr: 64, or: 116 }, () => `${playerLayer()}<div class="ttl t3">${titleEmblem()}</div>${bestLine(548)}${legendHTML(572)}${dock()}`, { bind: hooks.bind, draw: hooks.draw(438, 64) });

// Spec page (scrolls)
(function () {
  const root = document.getElementById("K");
  const names = ["garage", "daily", "friends", "settings", "play", "gift", "lock", "star", "crown"];
  const states = [["Idle", "garage", "idle"], ["Attention", "daily", "attention"], ["New", "gift", "new"], ["Locked", "friends", "locked"]];
  root.innerHTML = `<div class="kit">
  <h2>Orbit Shift UI kit · v2</h2><p class="lead">Gate semantics: an <b>open gap</b> means available, a <b>diamond in the gap</b> means it needs you, a <b>closed ring</b> means locked. Pressing swings the gap.</p>
  <h3>Buttons</h3><div class="row big">${["garage", "daily", "friends", "settings"].map((k, i) => ringButton(k, { state: k === "friends" ? "locked" : k === "daily" ? "attention" : "idle", cls: "static", size: 66 })).join("")}${ringButton("play", { cls: "static", size: 92 })}</div>
  <p class="spec">Ring 52 / Play 76 · stroke 8.5% of size · gap 62° (Play 62°) · gap centred at 1:30 · hit area ≥ 60 · labels 8.5px caps</p>
  <h3>States</h3><div class="row">${states.map(([l, k, s]) => `<div class="st">${ringButton(k, { state: s, cls: "static", nolabel: 1, size: 60 })}<small>${l}</small></div>`).join("")}<div class="st"><div class="rb static pressed">${`<span class="rwrap" style="width:60px;height:60px">${ringBtnSVG("garage", 60, "idle")}</span>`}</div><small>Pressed</small></div></div>
  <h3>Layered paper glyphs</h3><div class="row glyphs">${names.map(n => `<div class="gl1"><span>${glyphSVG(n, 56)}</span><small>${n}</small></div>`).join("")}</div>
  <p class="spec">Each glyph is 2–4 flat layers on a 48 grid: a silhouette that casts a 1.3/2px hard shadow, a lit upper plane, a shaded lower plane and a crease.</p>
  <h3>Titles</h3><div class="tt"><div class="tcard">${titleLockup()}<small>1 · Orbit lockup</small></div><div class="tcard wide"><svg viewBox="0 0 390 230" class="arcprev">${""}</svg><div class="archolder"></div><small>2 · Gate arc (crowns the planet)</small></div><div class="tcard">${titleEmblem()}<small>3 · Crest</small></div></div>
  <h3>Progress layer</h3><div class="row prog"><div class="pg">${levelBadge(64)}<small>Level + XP arc</small></div><div class="pg wide">${streakRow()}<small>Streak · day 7 = chest</small></div><div class="pg">${ringButton("gift", { state: "new", cls: "static", size: 56, nolabel: 1 })}<small>Reward ready</small></div></div>
  </div>`;
  const holder = root.querySelector(".archolder"); holder.innerHTML = titleArc(195, 230, 150).replace('viewBox="0 0 390 844"', 'viewBox="0 50 390 140"'); root.querySelector(".arcprev").remove();
})();

// chrome
const WHY = {
  H1: "<b>Home 1 · Orbit lockup.</b> The O of ORBIT is the planet (with its flower) and the glider circles it. Title and logo mark in one.",
  H2: "<b>Home 2 · Gate arc.</b> The title is a gate ring arched over the planet, letters cut into the band, ends capped with the game's light diamonds.",
  H3: "<b>Home 3 · Crest.</b> A gold gate-ring badge with the planet inside and the glider riding the ring, over a small wordmark.",
  K: "<b>Kit.</b> The button, glyph, state and title specs behind all three homes. Scroll.",
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
document.querySelectorAll(".rb.static").forEach(b => b.addEventListener("pointerdown", () => spark(b)));
show(/^#(H1|H2|H3|K)$/.test(location.hash) ? location.hash.slice(1) : "H1");
