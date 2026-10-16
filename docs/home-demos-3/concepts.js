// ---------- shared small UI ----------
const logoHTML = '<h1 class="logo"><span class="o" data-t="Orbit">Orbit</span><span class="s" data-t="Shift">Shift</span></h1>';
function topline() {
  return `<div class="topline"><button class="stat" data-act="best" aria-label="Best score">${ICON.crown}<b>${DATA.best}</b></button>${logoHTML}<button class="stat r" data-act="stars" aria-label="Stars"><b class="sv">${DATA.stars}</b>${ICON.star}</button></div>`;
}
const GLYPH = { garage: ICON.garage, daily: ICON.flame, friends: ICON.friends, settings: ICON.gear };
const LABEL = { garage: "Garage", daily: "Daily", friends: "Friends", settings: "Settings" };
// gate ring: the game's core shape (an arc with a gap, leaf marks and light diamonds) reused as a button
function gateRing(size, color, gapDeg = 70, rot = -55, leaves = true) {
  const r = size / 2 - size * .1, c = size / 2, sw = size * .09, arc = 360 - gapDeg, a0 = rot + gapDeg / 2 - 90 + 90;
  let marks = "";
  if (leaves) for (let a = rot + gapDeg / 2 + 20; a < rot + gapDeg / 2 + arc - 12; a += 34) { const rad = (a - 90) * Math.PI / 180; marks += `<ellipse cx="${c + Math.cos(rad) * (r + sw * .2)}" cy="${c + Math.sin(rad) * (r + sw * .2)}" rx="${size * .035}" ry="${size * .075}" transform="rotate(${a} ${c + Math.cos(rad) * (r + sw * .2)} ${c + Math.sin(rad) * (r + sw * .2)})" fill="${a % 68 < 34 ? "#e6e3b3" : "#77d5aa"}"/>`; }
  const dia = [rot + gapDeg / 2 - 90, rot - gapDeg / 2 + 360 - 90 + gapDeg].map(a => { const rad = a * Math.PI / 180, x = c + Math.cos(rad) * r, y = c + Math.sin(rad) * r; return `<path d="M0 -${size * .08}L${size * .06} 0L0 ${size * .08}L-${size * .06} 0Z" transform="translate(${x} ${y}) rotate(${a + 90})" fill="#f4ecc8"/>`; }).join("");
  return `<svg class="gring" viewBox="0 0 ${size} ${size}" style="width:${size}px;height:${size}px"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="${sw + 3}" pathLength="100" stroke-dasharray="${arc / 3.6} 100" stroke-linecap="round" transform="rotate(${rot + gapDeg / 2 - 90} ${c} ${c}) translate(1.5 2)"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" pathLength="100" stroke-dasharray="${arc / 3.6} 100" stroke-linecap="round" transform="rotate(${rot + gapDeg / 2 - 90} ${c} ${c})"/>${marks}${dia}</svg>`;
}
const sparkle = (x, y, s, o = 1) => `<path class="sp" d="M${x} ${y - s * 2.2}L${x + s * .34} ${y - s * .34}L${x + s * 2.2} ${y}L${x + s * .34} ${y + s * .34}L${x} ${y + s * 2.2}L${x - s * .34} ${y + s * .34}L${x - s * 2.2} ${y}L${x - s * .34} ${y - s * .34}Z" opacity="${o}"/>`;
const legendHTML = () => `<button class="legend" data-act="missions" aria-label="Today's missions">${DATA.goals.map(g => `<span class="${ready(g) ? "rdy" : ""}"><i style="--c:${g.v >= g.t ? "#edca62" : g.c}"></i>${g.short}<b>${g.v >= g.t ? "✓" : g.v + "/" + g.t}</b></span>`).join("")}</button>`;
// activity-style rings hugging the planet, one per mission
function missionRings(ctx, cx, cy, pr, t) {
  DATA.goals.forEach((g, i) => {
    const r = pr + 11 + i * 7, p = Math.min(1, g.v / g.t), done = g.v >= g.t, col = done ? "#edca62" : g.c;
    ctx.save(); ctx.lineWidth = 3.6; ctx.lineCap = "butt";
    ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "rgba(244,236,200,.08)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = done ? 10 + Math.sin(t * 4) * 3 : 5; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.stroke(); ctx.restore();
  });
}

// ============ H · Constellation Chart ============
const CONS = [
  { k: "garage", x: 60, y: 136, pts: [[38, 0], [-8, -20], [4, 0], [-8, 20], [-32, 0]], ln: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]], lab: [0, 40] },
  { k: "settings", x: 332, y: 138, pts: [[0, 0], ...Array.from({ length: 8 }, (_, i) => [Math.cos(i * Math.PI / 4) * 25, Math.sin(i * Math.PI / 4) * 25]), ...[0, 2, 4, 6].map(i => [Math.cos(i * Math.PI / 4) * 36, Math.sin(i * Math.PI / 4) * 36])], ln: Array.from({ length: 8 }, (_, i) => [1 + i, 1 + (i + 1) % 8]).concat([[0, 1], [0, 3], [0, 5], [0, 7], [1, 9], [3, 10], [5, 11], [7, 12]]), lab: [0, 50] },
  { k: "daily", x: 50, y: 450, pts: [[2, -38], [16, -12], [12, 14], [0, 28], [-12, 14], [-16, -12]], ln: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]], lab: [0, 48], dot: 1 },
  { k: "friends", x: 336, y: 450, soon: 1, pts: [[-15, -16], [-30, 20], [0, 20], [17, -12], [3, 24], [33, 24]], ln: [[0, 1], [0, 2], [1, 2], [3, 4], [3, 5], [4, 5]], lab: [0, 46] },
];
setup("H", { cy: 372, pr: 70, or: 118 }, () => {
  const cons = CONS.map(c => `<g class="con${c.soon ? " soon" : ""}" transform="translate(${c.x} ${c.y})">${c.ln.map(([a, b]) => `<line x1="${c.pts[a][0]}" y1="${c.pts[a][1]}" x2="${c.pts[b][0]}" y2="${c.pts[b][1]}"/>`).join("")}${c.pts.map((p, i) => sparkle(p[0], p[1], i % 3 === 0 ? 3.1 : 2.2)).join("")}${c.dot ? '<path class="badge" d="M20 -40l5 5-5 5-5-5z"/>' : ""}<text x="${c.lab[0]}" y="${c.lab[1]}">${LABEL[c.k].toUpperCase()}</text>${c.soon ? `<text class="sub" x="0" y="${c.lab[1] + 11}">SOON</text>` : ""}</g>`).join("");
  const hits = CONS.map(c => `<button class="hit" data-act="${c.k}" aria-label="${LABEL[c.k]}" style="left:${c.x - 44}px;top:${c.y - 48}px;width:88px;height:112px"></button>`).join("");
  const dials = DATA.goals.map((m, i) => `<div class="hd-m" style="left:${[56, 148, 240][i]}px;top:${[600, 616, 600][i]}px">${dial(m, 42)}<span>${m.short}</span><small>${Math.min(m.v, m.t)} of ${m.t}</small></div>`).join("");
  return `${topline()}
  <svg class="chart" viewBox="0 0 390 844"><circle cx="195" cy="372" r="86" fill="none" stroke="#edca62" stroke-width="3" pathLength="100" stroke-dasharray="86 14" transform="rotate(-62 195 372)" style="filter:drop-shadow(0 0 6px rgba(237,202,98,.5))"/><path d="M-6 -7L12 0L-6 7Z" fill="#edca62" transform="translate(${195 + Math.cos(-.9) * 86} ${372 + Math.sin(-.9) * 86}) rotate(-52)"/>
    <path d="M88 624 Q148 650 205 634 Q262 620 306 624" fill="none" stroke="rgba(244,236,200,.26)" stroke-dasharray="2 6" transform="translate(0 -4)"/>${cons}</svg>
  ${hits}<button class="core" data-act="play" aria-label="Play"></button>${dials}
  <button class="mhit" data-act="missions" aria-label="Missions" style="left:30px;top:588px;width:330px;height:92px"></button>
  <button class="plate pbtn" data-act="play" style="top:728px">${ICON.play}Play</button>`;
}, { bind(root) { const groups = root.querySelectorAll(".con"); root.querySelectorAll(".hit").forEach((h, i) => { const on = () => groups[i].classList.add("press"), off = () => groups[i].classList.remove("press"); h.onpointerdown = on; h.onpointerup = off; h.onpointerleave = off; }); } });

// ============ J · Bookmark Tabs ============
setup("J", { cy: 430, pr: 72, or: 124 }, () => {
  const tabs = [["garage", "L", 330, "#77d5aa"], ["daily", "L", 438, "#ef8a7a", 1], ["friends", "R", 330, "#a99be0", 0, 1], ["settings", "R", 438, "#e6dba8"]];
  const t = tabs.map(([k, side, y, col, dot, soon]) => `<button class="etab ${side}${soon ? " soon" : ""}" data-act="${k}" style="top:${y}px;--c:${col}" aria-label="${LABEL[k]}"><span class="face">${GLYPH[k]}<em>${LABEL[k]}${soon ? " · soon" : ""}</em><i class="fold"></i></span>${dot ? '<b class="ping"></b>' : ""}</button>`).join("");
  const dials = DATA.goals.map((m, i) => `<div class="jm" style="left:${[80, 175, 270][i]}px">${dial(m, 38)}<span>${m.short}</span><small>${Math.min(m.v, m.t)}/${m.t}</small></div>`).join("");
  return `${topline()}${t}
  <button class="jstrip" data-act="missions" aria-label="Today's missions"><span class="jl">TODAY</span>${dials}<span class="jr">›</span></button>
  <button class="flap" data-act="play"><span>${ICON.play}Play</span></button>`;
}, { side: true });

// ============ M · Gate Dock ============
setup("M", { cy: 368, pr: 70, or: 130 }, () => {
  const g = (k, size, cx) => `<button class="gbtn${k === "friends" ? " soon" : ""}" data-act="${k}" style="left:${cx - 30}px" aria-label="${LABEL[k]}"><span class="rw">${gateRing(size, k === "friends" ? "#8b9a96" : "#4fae91")}</span>${GLYPH[k]}<small>${LABEL[k]}</small>${k === "daily" ? '<b class="ping"></b>' : ""}</button>`;
  return `${topline()}
  <button class="core" data-act="missions" aria-label="Missions" style="left:81px;top:254px;width:228px;height:228px;border-radius:50%"></button>
  ${legendHTML().replace('class="legend"', 'class="legend" style="top:520px"')}
  ${g("garage", 50, 48)}${g("daily", 50, 118)}${g("friends", 50, 272)}${g("settings", 50, 342)}
  <button class="pgate" data-act="play" aria-label="Play"><span class="rw">${gateRing(70, "#edca62", 64, -50)}</span><svg class="pl" viewBox="0 0 48 48"><path d="M16 10l24 14-24 14z" fill="#edca62"/></svg><span class="orb"><i></i></span><small>PLAY</small></button>`;
}, { draw(ctx, t, a) { missionRings(ctx, 195, 368, 70, t); } });

// ============ P · Instant Orbit v2 ============
(function () {
  const CY = 384, PR = 70, OR = 138;
  let ang = -1.2, dir = 1, last = 0, gates = [], nextGate = 1.2, ripples = [], taps = 0;
  setup("P", { cy: CY, pr: PR, or: OR }, () => `${topline()}
    ${legendHTML().replace('class="legend"', 'class="legend" style="top:566px"')}
    <div class="ptap"><i></i>TAP ANYWHERE TO PLAY<i></i></div>
    <div class="picons">${["garage", "daily", "friends", "settings"].map(k => `<button class="pic${k === "friends" ? " soon" : ""}" data-act="${k}" aria-label="${LABEL[k]}">${GLYPH[k]}<small>${LABEL[k]}</small>${k === "daily" ? '<b class="ping"></b>' : ""}</button>`).join("")}</div>`,
  {
    loop(ctx, t, root) {
      const dt = Math.min(.05, t - last); last = t; ang += dir * 1.05 * dt;
      if (t > nextGate) { gates.push({ r: 430, gap: ang + dir * 1.05 * 4.2, open: 1.25 + Math.random() * .3 }); nextGate = t + 2.9; }
      for (const g of gates) g.r -= (g.r > OR + 70 ? 112 : 78) * dt; gates = gates.filter(g => g.r > PR + 10);
      sky(ctx, t, 195, CY);
      for (const g of gates) {
        const half = g.open / 2, st = g.gap + half, en = g.gap + TAU - half, near = Math.min(1, (OR + 210 - g.r) / 145 + .16);
        ctx.save(); ctx.globalAlpha = Math.max(.12, near); ctx.lineCap = "round";
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 13; ctx.beginPath(); ctx.arc(197, CY + 3, g.r, st, en); ctx.stroke();
        ctx.strokeStyle = PAL.paper; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(195, CY, g.r, st, en); ctx.stroke();
        for (let a = st + .18; a < en - .12; a += .36) { ctx.save(); ctx.translate(195 + Math.cos(a) * g.r, CY + Math.sin(a) * g.r); ctx.rotate(a); ctx.fillStyle = a % .72 < .36 ? PAL.mid : PAL.light; ctx.beginPath(); ctx.ellipse(0, 8, 4, 10, a % .72 < .36 ? .5 : -.5, 0, TAU); ctx.fill(); ctx.restore(); }
        ctx.fillStyle = PAL.light; for (const s of [-1, 1]) { const a = g.gap + s * half; ctx.save(); ctx.translate(195 + Math.cos(a) * g.r, CY + Math.sin(a) * g.r); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4.3, 0); ctx.lineTo(0, 6); ctx.lineTo(-4.3, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.restore();
        if (!g.done && g.r <= OR + 8) { g.done = true; const d = Math.abs(Math.atan2(Math.sin(ang - g.gap), Math.cos(ang - g.gap))); ripples.push({ life: 1, good: d < half - .1 }); }
      }
      ctx.save(); ctx.setLineDash([2, 11]); ctx.lineDashOffset = -t * 20 * dir; ctx.strokeStyle = colorAlpha(PAL.light, .3); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(195, CY, OR, 0, TAU); ctx.stroke(); ctx.restore();
      OrbitArt.drawLivingPlanet(ctx, "bloom-crown", { x: 195, y: CY, radius: PR, paletteId: "bloom", time: t, reduced: false });
      missionRings(ctx, 195, CY, PR, t);
      for (const r of ripples) { r.life -= .03; ctx.save(); ctx.globalAlpha = Math.max(0, r.life) * .7; ctx.strokeStyle = r.good === false ? PAL.accent : PAL.gold; ctx.lineWidth = 2 + r.life * 4; ctx.beginPath(); ctx.arc(195, CY, OR + (1 - r.life) * 26, 0, TAU); ctx.stroke(); ctx.restore(); }
      ripples = ripples.filter(r => r.life > 0);
      ctx.save(); ctx.translate(195 + Math.cos(ang) * OR, CY + Math.sin(ang) * OR); ctx.rotate(ang + dir * Math.PI / 2); ctx.scale(1.15, 1.15); drawGlider(ctx, RIDER, PAL, 1, t, 0, false, 0); ctx.restore();
    },
    bind(root) { if (root._pb) return; root._pb = 1; root.addEventListener("pointerdown", e => { if (e.target.closest("[data-act]")) return; dir *= -1; taps++; ripples.push({ life: 1 }); if (taps === 4) toast(root, "→ In the real game this starts a run"); }); },
  });
})();

// ---------- chrome ----------
const WHY = {
  H: "<b>Constellation Chart.</b> No button plates. Garage is drawn as the plane, Settings as a gear, Daily as a flame. Mission stars glow as you progress. Tap the planet's gold gate ring or the small Play tab.",
  J: "<b>Bookmark Tabs.</b> Small paper index tabs poke in from the edges and the centre stays free. Missions open as a page from the right. Play is a small gold flap on the bottom edge.",
  M: "<b>Gate Dock.</b> Every button is a tiny gate ring and its gap swings when pressed. Missions are activity rings around the planet. Tap the planet or the legend for details.",
  P: "<b>Instant Orbit.</b> No Play button: tap anywhere and you are already playing (try it, it reverses the plane). Tiny icons below, missions hugging the planet.",
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
show(/^#[HJMP]$/.test(location.hash) ? location.hash[1] : "H");
