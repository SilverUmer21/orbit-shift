const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const ui = {
  score: document.querySelector("#score"), multiplier: document.querySelector("#multiplier"),
  best: document.querySelector("#best"), fever: document.querySelector("#feverBar"),
  shell: document.querySelector(".shell"), home: document.querySelector("#home"),
  garage: document.querySelector("#garage"), settings: document.querySelector("#settings"), results: document.querySelector("#results"),
  resultScore: document.querySelector("#resultScore"), resultStats: document.querySelector("#resultStats"),
  record: document.querySelector("#recordText"), unlock: document.querySelector("#unlockText"),
  cosmetics: document.querySelector("#cosmetics"), riderGrid: document.querySelector("#riderGrid"),
  homeBest: document.querySelector("#homeBest"), homeStars: document.querySelector("#homeStars"), garageStars: document.querySelector("#garageStars"),
  resultStars: document.querySelector("#resultStars"), preview: document.querySelector("#riderPreview"),
  sound: document.querySelector("#soundToggle"), haptics: document.querySelector("#hapticsToggle"), effects: document.querySelector("#effectsToggle"),
};

const TAU = Math.PI * 2;
const MAX_PARTICLES = 220;
const cosmetics = [
  { id: "bloom", name: "Bloom", score: 0, bg: "#08191d", ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62", shape: "leaf" },
  { id: "ember", name: "Ember", score: 250, bg: "#1b1118", ink: "#4b2632", paper: "#ba4f4c", mid: "#e7795f", light: "#f2d8a0", accent: "#62c6b4", gold: "#f1bd4e", shape: "flame" },
  { id: "void", name: "Void", score: 700, bg: "#0e1020", ink: "#25274d", paper: "#5753a6", mid: "#8b76c7", light: "#d9d1df", accent: "#76d9c1", gold: "#e4bd5d", shape: "moon" },
];
const riders = [
  { id: "manta", name: "Manta", price: 0, shape: "manta" },
  { id: "dart", name: "Dart", price: 40, shape: "dart" },
  { id: "crescent", name: "Crescent", price: 100, shape: "crescent" },
  { id: "splitwing", name: "Splitwing", price: 200, shape: "splitwing" },
  { id: "shuttle", name: "Shuttle", price: 350, shape: "shuttle" },
  { id: "ringsail", name: "Ring Sail", price: 550, shape: "ringsail" },
];
const saved = loadSave();
const state = {
  mode: "home", score: 0, multiplier: 1, streak: 0, runBestStreak: 0, fever: 0,
  best: saved.best || 0, bestStreak: saved.bestStreak || 0,
  unlocked: saved.unlocked || ["bloom"], selected: saved.selected || "bloom",
  stars: Number(saved.stars) || 0, runStars: 0, gatesPassed: 0, perfects: 0, feverCount: 0,
  ownedRiders: saved.ownedRiders || ["manta"], selectedRider: saved.selectedRider || "manta",
  muted: Boolean(saved.muted), haptics: saved.haptics !== false, reducedEffects: Boolean(saved.reducedEffects),
  tutorialSeen: Boolean(saved.tutorialSeen), elapsed: 0, paused: false,
};

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let planetRadius = 0;
let orbitRadius = 0;
let player = { angle: -Math.PI / 2, direction: 1, flip: 0, glow: 0 };
let gates = [];
let hazards = [];
let particles = [];
let rings = [];
let labels = [];
let trail = [];
let stars = [];
let grain = [];
let gateCount = 0;
let nextGate = 0;
let nextHazard = 12;
let tutorial = 0;
let crashTimer = 0;
let pinch = 0;
let shake = 0;
let flash = 0;
let lastReverse = 0;
let lastTime = performance.now();
let audio;

function loadSave() {
  try { return JSON.parse(localStorage.getItem("orbit-shift-save") || "{}"); }
  catch { return {}; }
}

function save() {
  localStorage.setItem("orbit-shift-save", JSON.stringify({
    best: state.best, bestStreak: state.bestStreak, unlocked: state.unlocked,
    selected: state.selected, stars: state.stars, ownedRiders: state.ownedRiders, selectedRider: state.selectedRider,
    muted: state.muted, haptics: state.haptics, reducedEffects: state.reducedEffects, tutorialSeen: state.tutorialSeen,
  }));
}

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  cx = width / 2;
  cy = height * 0.55;
  planetRadius = Math.max(62, Math.min(84, width * 0.205));
  orbitRadius = Math.min(width * 0.39, planetRadius + 78);
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: 24 }, (_, i) => ({
    x: ((i * 83) % 997) / 997 * width, y: ((i * 47) % 991) / 991 * height,
    size: 1 + (i % 3) * 0.4, phase: i * 0.63,
  }));
  grain = Array.from({ length: 70 }, (_, i) => ({
    x: (((i * 71) % 197) / 197 - 0.5) * 1.65,
    y: (((i * 43) % 193) / 193 - 0.5) * 1.65,
    alpha: 0.025 + (i % 4) * 0.012,
  })).filter((dot) => dot.x * dot.x + dot.y * dot.y < 0.72);
}

function startRun() {
  state.mode = "run";
  state.score = 0;
  state.multiplier = 1;
  state.streak = 0;
  state.runBestStreak = 0;
  state.fever = 0;
  state.elapsed = 0;
  state.runStars = 0;
  state.gatesPassed = 0;
  state.perfects = 0;
  state.feverCount = 0;
  state.paused = false;
  player = { angle: -Math.PI / 2, direction: 1, flip: 0, glow: 0 };
  gates = [];
  hazards = [];
  particles = [];
  rings = [];
  labels = [];
  trail = [];
  gateCount = 0;
  nextGate = 0.65;
  nextHazard = 12;
  tutorial = state.tutorialSeen ? 0 : 4.5;
  crashTimer = 0;
  pinch = 0;
  shake = 0;
  flash = 0;
  hideScreens();
  ui.results.hidden = true;
  ui.shell.classList.add("playing");
  lastTime = performance.now();
  updateHud();
  beep(360, 0.07, "triangle");
  vibrate(12);
}

function reverse() {
  if (state.mode !== "run" || state.paused) return;
  const now = performance.now();
  if (now - lastReverse < 75) return;
  lastReverse = now;
  player.direction *= -1;
  player.flip = 1;
  burst(playerPoint(), currentCosmetic().accent, 7, 90, "dot");
  if (tutorial > 0) {
    tutorial = 0;
    state.tutorialSeen = true;
    save();
  }
  beep(300 + (player.direction > 0 ? 65 : 0), 0.045, "triangle");
  vibrate(8);
}

function beginCrash() {
  if (state.mode !== "run") return;
  state.mode = "crash";
  crashTimer = 0.62;
  shake = state.reducedEffects ? 3 : 14;
  flash = 0.8;
  const point = playerPoint();
  gliderBurst(point, currentCosmetic(), currentRider());
  burst(point, currentCosmetic().accent, 10, 190, "shard");
  rings.push({ radius: orbitRadius, life: 1, max: 1, color: currentCosmetic().accent, speed: 100 });
  beep(92, 0.22, "sawtooth");
  vibrate(55);
}

function finishRun() {
  const oldBest = state.best;
  const previousUnlocks = state.unlocked.length;
  state.mode = "results";
  state.best = Math.max(state.best, Math.floor(state.score));
  state.bestStreak = Math.max(state.bestStreak, state.runBestStreak);
  state.stars += state.runStars;
  for (const cosmetic of cosmetics) {
    if (state.best >= cosmetic.score && !state.unlocked.includes(cosmetic.id)) state.unlocked.push(cosmetic.id);
  }
  save();
  ui.resultScore.textContent = Math.floor(state.score);
  ui.resultStats.textContent = `Best flow x${Math.max(1, state.runBestStreak)} - All-time ${state.best}`;
  ui.resultStars.textContent = `+${state.runStars} stars`;
  ui.record.textContent = state.best > oldBest ? "New orbit record" : "";
  ui.unlock.textContent = state.unlocked.length > previousUnlocks ? "New biome awakened" : "";
  ui.results.hidden = false;
  ui.shell.classList.remove("playing");
  renderCosmetics();
  updateHud();
}

function buildGatePlan(snapshot, random = Math.random) {
  const earlySpeeds = [52, 59, 66];
  const earlyOpenings = [1.66, 1.5, 1.38];
  const speed = snapshot.index < 3 ? earlySpeeds[snapshot.index] : Math.min(108, 68 + snapshot.elapsed * 0.68);
  const radius = snapshot.orbitRadius + snapshot.shortSide * 0.56;
  const flight = (radius - snapshot.orbitRadius) / speed;
  const wantsTurn = snapshot.index === 0 || (snapshot.index > 1 && random() < 0.64);
  const turnAt = wantsTurn ? 0.38 + random() * Math.min(0.75, flight * 0.42) : flight;
  const rotationLimit = snapshot.index < 3 ? 0.12 : Math.min(0.54, 0.16 + snapshot.elapsed * 0.006);
  const rotation = (random() - 0.5) * 2 * rotationLimit;
  const opening = snapshot.index < 3 ? earlyOpenings[snapshot.index] : Math.max(0.84, 1.34 - snapshot.elapsed * 0.0075);
  const travel = wantsTurn ? 2 * turnAt - flight : flight;
  const target = normalize(snapshot.angle + snapshot.direction * snapshot.angularSpeed * travel + (random() - 0.5) * 0.12);
  return { radius, speed, flight, gap: normalize(target - rotation * flight), target, rotation, opening, wantsTurn };
}

function spawnGate() {
  const plan = buildGatePlan({
    index: gateCount, elapsed: state.elapsed, angle: player.angle, direction: player.direction,
    angularSpeed: playerSpeed(), orbitRadius, shortSide: Math.min(width, height),
  });
  const gate = {
    ...plan, previousRadius: plan.radius, resolved: false, type: gateCount % 4,
    palette: gateCount % 3, pair: false,
  };
  gates.push(gate);
  gateCount += 1;
  if (state.elapsed > 30 && gates.filter((item) => !item.resolved).length < 3 && Math.random() < 0.18) {
    const spacing = 58;
    gates.push({
      ...gate, radius: gate.radius + spacing, previousRadius: gate.radius + spacing,
      gap: normalize(gate.gap - gate.rotation * spacing / gate.speed), resolved: false, pair: true,
    });
  }
}

function spawnHazard() {
  const gateSoon = gates.some((gate) => !gate.resolved && (gate.radius - orbitRadius) / gate.speed < 2.2);
  if (gateSoon) { nextHazard = 2; return; }
  hazards.push({ angle: normalize(player.angle + Math.PI), speed: -player.direction * 0.65, life: 5.2, phase: Math.random() * TAU });
}

function update(delta) {
  if (state.paused) return;
  if (state.mode === "crash") {
    crashTimer -= delta;
    updateEffects(delta);
    if (crashTimer <= 0) finishRun();
    return;
  }
  if (state.mode !== "run") {
    player.angle = normalize(player.angle + delta * 0.24);
    updateEffects(delta);
    return;
  }

  state.elapsed += delta;
  tutorial = Math.max(0, tutorial - delta);
  state.score += delta * (4 + state.multiplier * 1.45);
  state.fever = Math.max(0, state.fever - delta);
  pinch = Math.max(0, pinch - delta);
  const worldScale = (state.fever > 0 ? 0.8 : 1) * (pinch > 0 ? 0.42 : 1);
  player.angle = normalize(player.angle + player.direction * playerSpeed() * delta * (pinch > 0 ? 0.65 : 1));
  player.flip = Math.max(0, player.flip - delta * 7);
  player.glow = Math.max(0, player.glow - delta * 2.8);
  trail.unshift({ ...playerPoint(), life: 1 });
  trail = trail.slice(0, state.fever > 0 ? 26 : 14);
  for (const point of trail) point.life -= delta * 1.9;

  nextGate -= delta;
  if (nextGate <= 0) {
    spawnGate();
    nextGate = gateCount < 3 ? 2.85 : Math.max(1.7, 2.55 - state.elapsed * 0.011);
  }
  nextHazard -= delta;
  if (state.elapsed > 28 && nextHazard <= 0) {
    spawnHazard();
    nextHazard = 10 + Math.random() * 3;
  }

  for (const gate of gates) {
    gate.previousRadius = gate.radius;
    gate.radius -= gate.speed * delta * worldScale;
    gate.gap = normalize(gate.gap + gate.rotation * delta * worldScale);
    if (!gate.resolved && gate.previousRadius > orbitRadius && gate.radius <= orbitRadius) resolveGate(gate);
  }
  gates = gates.filter((gate) => gate.radius > planetRadius - 25);

  for (const hazard of hazards) {
    hazard.angle = normalize(hazard.angle + hazard.speed * delta * worldScale);
    hazard.life -= delta;
    if (hazard.life > 0.35 && angleDistance(player.angle, hazard.angle) < 0.135) beginCrash();
  }
  hazards = hazards.filter((hazard) => hazard.life > 0);

  if (Math.random() < delta * (state.fever > 0 ? 42 : 13)) burst(playerPoint(), currentCosmetic().mid, 1, state.fever > 0 ? 130 : 55, "paper");
  updateEffects(delta);
  updateHud();
}

function resolveGate(gate) {
  gate.resolved = true;
  const distance = angleDistance(player.angle, gate.gap);
  const clearance = gate.opening / 2 - 0.105 - distance;
  if (clearance < 0) { beginCrash(); return; }
  state.gatesPassed += 1;
  state.runStars += 1;
  if (clearance < 0.145) {
    state.perfects += 1;
    state.runStars += 2;
    state.streak += 1;
    state.runBestStreak = Math.max(state.runBestStreak, state.streak);
    state.multiplier = 1 + Math.min(4, state.streak);
    state.score += 28 * state.multiplier;
    pinch = 0.095;
    player.glow = 1;
    rings.push({ radius: orbitRadius, life: 0.65, max: 0.65, color: currentCosmetic().gold, speed: 72 });
    labels.push({ text: state.streak >= 5 ? "FEVER" : "PERFECT", life: 0.8, max: 0.8, y: cy - orbitRadius - 28 });
    burst(playerPoint(), currentCosmetic().gold, 18, 175, "paper");
    beep(570 + Math.min(5, state.streak) * 62, 0.07, "triangle");
    if (state.streak >= 5 && state.fever <= 0) {
      state.fever = 6;
      state.feverCount += 1;
      state.runStars += 5;
      state.multiplier = 5;
      flash = 0.65;
      beep(900, 0.17, "sine");
    }
  } else {
    state.score += 18 * state.multiplier;
    state.streak = 0;
    state.multiplier = 1;
    burst(playerPoint(), currentCosmetic().light, 7, 90, "paper");
    beep(440, 0.045, "sine");
  }
}

function updateEffects(delta) {
  particles = particles.filter((item) => (item.life -= delta) > 0);
  for (const item of particles) {
    item.x += item.vx * delta; item.y += item.vy * delta;
    item.vx *= 0.982; item.vy *= 0.982; item.rotation += item.spin * delta;
  }
  rings = rings.filter((item) => (item.life -= delta) > 0);
  for (const item of rings) item.radius += item.speed * delta;
  labels = labels.filter((item) => (item.life -= delta) > 0);
  for (const item of labels) item.y -= delta * 18;
  shake = Math.max(0, shake - delta * 34);
  flash = Math.max(0, flash - delta * 2.5);
}

function draw() {
  const time = performance.now() / 1000;
  const palette = currentCosmetic();
  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawBackground(time, palette);
  drawPaperWaves(time, palette);
  drawGates(time, palette);
  drawPlanet(time, palette);
  drawOrbit(time, palette);
  drawHazards(time, palette);
  drawTrail(palette);
  if (state.mode !== "crash" && state.mode !== "results") drawPlayer(time, palette);
  drawParticles();
  drawRings();
  drawLabels(palette);
  if (tutorial > 0 && state.mode === "run") drawTutorial(time, palette);
  if (state.fever > 0) drawFever(time, palette);
  if (flash > 0) {
    ctx.fillStyle = `rgba(242,207,99,${flash * 0.18})`;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

function drawBackground(time, palette) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(cx, cy, planetRadius, cx, cy, height * 0.58);
  glow.addColorStop(0, colorAlpha(state.fever > 0 ? palette.gold : palette.paper, 0.19));
  glow.addColorStop(0.55, colorAlpha(palette.ink, 0.12));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  for (const star of stars) {
    ctx.globalAlpha = 0.16 + Math.sin(time * 1.2 + star.phase) * 0.08;
    ctx.fillStyle = star.phase % 2 > 1 ? palette.mid : palette.light;
    ctx.save(); ctx.translate(star.x, star.y); ctx.rotate(Math.PI / 4); ctx.fillRect(-star.size / 2, -star.size / 2, star.size, star.size); ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawPaperWaves(time, palette) {
  ctx.save();
  ctx.globalAlpha = state.fever > 0 ? 0.18 : 0.08;
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.fillStyle = [palette.paper, palette.accent, palette.gold][layer];
    ctx.beginPath();
    ctx.moveTo(-20, height);
    for (let x = -20; x <= width + 20; x += 24) {
      const y = height * (0.82 + layer * 0.055) + Math.sin(x * 0.025 + time * (0.35 + layer * 0.08)) * (16 + layer * 5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width + 20, height); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawGates(time, palette) {
  for (const gate of gates) {
    const alpha = gate.resolved ? 0.3 : Math.min(1, (orbitRadius + 210 - gate.radius) / 145 + 0.16);
    const colors = [palette.paper, palette.accent, palette.gold];
    const color = colors[gate.palette];
    const half = gate.opening / 2;
    const start = gate.gap + half;
    const end = gate.gap + TAU - half;
    ctx.save();
    ctx.globalAlpha = Math.max(0.12, alpha);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 13;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx + 2, cy + 3, gate.radius, start, end); ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = gate.type === 3 ? 9 : 7;
    ctx.beginPath(); ctx.arc(cx, cy, gate.radius, start, end); ctx.stroke();
    drawGateDetails(gate, start, end, color, palette, time);
    for (const side of [-1, 1]) {
      const angle = gate.gap + side * half;
      const x = cx + Math.cos(angle) * gate.radius;
      const y = cy + Math.sin(angle) * gate.radius;
      ctx.fillStyle = palette.light;
      paperDiamond(x, y, 6 + Math.sin(time * 6 + gate.radius) * 1.2, angle);
    }
    ctx.restore();
  }
}

function drawGateDetails(gate, start, end, color, palette, time) {
  const step = gate.type === 2 ? 0.24 : 0.36;
  for (let angle = start + 0.18; angle < end - 0.12; angle += step) {
    const x = cx + Math.cos(angle) * gate.radius;
    const y = cy + Math.sin(angle) * gate.radius;
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (gate.type === 0) {
      ctx.fillStyle = angle % 0.72 < 0.36 ? palette.mid : palette.light;
      ctx.beginPath(); ctx.ellipse(0, 8, 3.5, 8, angle % 0.72 < 0.36 ? 0.45 : -0.45, 0, TAU); ctx.fill();
    } else if (gate.type === 1) {
      ctx.fillStyle = angle % 0.72 < 0.36 ? palette.light : color;
      ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(0, 13); ctx.lineTo(5, 4); ctx.closePath(); ctx.fill();
    } else if (gate.type === 2) {
      ctx.fillStyle = angle % 0.48 < 0.24 ? palette.gold : palette.light;
      ctx.beginPath(); ctx.arc(0, 7 + Math.sin(time * 2 + angle) * 1.5, 2.2, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = palette.ink;
      ctx.fillRect(-5, 5, 10, 4);
    }
    ctx.restore();
  }
}

function drawPlanet(time, palette) {
  const kick = state.mode === "crash" ? Math.sin(crashTimer * 36) * crashTimer * 8 : 0;
  ctx.save();
  ctx.translate(cx + kick, cy);
  ctx.rotate(time * (state.fever > 0 ? 0.11 : 0.035));
  ctx.fillStyle = "rgba(0,0,0,.28)";
  blobPath(4, 0.1, planetRadius + 6, 0.035, 5, 6); ctx.fill();
  ctx.fillStyle = palette.paper;
  blobPath(0, 0, planetRadius, 0.045, 7); ctx.fill();
  ctx.fillStyle = palette.mid;
  blobPath(3, 0.7, planetRadius * 0.79, 0.12, 7); ctx.fill();
  ctx.fillStyle = palette.ink;
  blobPath(-4, -2, planetRadius * 0.54, 0.14, 6); ctx.fill();
  ctx.fillStyle = palette.light;
  blobPath(-7, -5, planetRadius * 0.31, 0.16, 5); ctx.fill();
  drawBiomeMarks(time, palette);
  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, planetRadius, 0, TAU); ctx.clip();
  for (const dot of grain) {
    ctx.fillStyle = `rgba(3,9,13,${dot.alpha})`;
    ctx.fillRect(dot.x * planetRadius, dot.y * planetRadius, 1.4, 1.4);
  }
  ctx.restore();
  ctx.restore();
}

function drawBiomeMarks(time, palette) {
  for (let i = 0; i < 10; i += 1) {
    const angle = i * TAU / 10 + 0.2;
    const r = planetRadius * (0.62 + (i % 3) * 0.09);
    ctx.save(); ctx.translate(Math.cos(angle) * r, Math.sin(angle) * r); ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = i % 3 === 0 ? palette.accent : palette.gold;
    if (currentCosmetic().shape === "leaf") {
      ctx.beginPath(); ctx.ellipse(0, -4, 3.5, 9 + Math.sin(time + i), 0.25 * (i % 2 ? 1 : -1), 0, TAU); ctx.fill();
    } else if (currentCosmetic().shape === "flame") {
      ctx.beginPath(); ctx.moveTo(-4, 2); ctx.quadraticCurveTo(-2, -8, 0, -13); ctx.quadraticCurveTo(7, -3, 3, 3); ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, -4, 7, -Math.PI / 2, Math.PI / 2); ctx.arc(3, -4, 5, Math.PI / 2, -Math.PI / 2, true); ctx.fill();
    }
    ctx.restore();
  }
}

function drawOrbit(time, palette) {
  ctx.save();
  ctx.setLineDash([2, 11]);
  ctx.lineDashOffset = -time * (state.fever > 0 ? 46 : 20) * player.direction;
  ctx.strokeStyle = colorAlpha(state.fever > 0 ? palette.gold : palette.light, state.fever > 0 ? 0.72 : 0.25);
  ctx.lineWidth = state.fever > 0 ? 3 : 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius, 0, TAU); ctx.stroke();
  ctx.restore();
}

function drawTrail(palette) {
  ctx.save();
  for (let i = trail.length - 1; i >= 0; i -= 1) {
    const point = trail[i];
    const size = Math.max(1, (1 - i / trail.length) * (state.fever > 0 ? 9 : 5));
    ctx.globalAlpha = Math.max(0, point.life) * 0.52;
    ctx.fillStyle = i % 2 ? palette.accent : palette.gold;
    paperDiamond(point.x, point.y, size, player.angle);
  }
  ctx.restore();
}

function drawPlayer(time, palette) {
  const point = playerPoint();
  const scale = width < 350 ? 0.88 : width > 420 ? 1.08 : 1;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(player.angle + player.direction * Math.PI / 2 + player.flip * player.direction * 0.18);
  ctx.scale(scale, scale);
  drawGlider(ctx, currentRider(), palette, 1, time, player.flip, state.fever > 0, player.glow);
  ctx.restore();
}

function drawHazards(time, palette) {
  for (const hazard of hazards) {
    const x = cx + Math.cos(hazard.angle) * orbitRadius;
    const y = cy + Math.sin(hazard.angle) * orbitRadius;
    ctx.save(); ctx.translate(x, y); ctx.rotate(time * -2.1 + hazard.phase);
    ctx.fillStyle = palette.ink; paperDiamond(2, 3, 15, 0);
    ctx.fillStyle = palette.accent;
    for (let i = 0; i < 4; i += 1) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(-3, -3); ctx.lineTo(0, -17); ctx.lineTo(4, -3); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = palette.gold; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
    ctx.restore();
  }
}

function drawParticles() {
  for (const item of particles) {
    ctx.save(); ctx.globalAlpha = item.life / item.max; ctx.fillStyle = item.color; ctx.translate(item.x, item.y); ctx.rotate(item.rotation);
    if (item.shape === "shard" || item.shape === "beetle-fin") { ctx.beginPath(); ctx.moveTo(-item.size, item.size); ctx.lineTo(0, -item.size * 1.8); ctx.lineTo(item.size, item.size); ctx.fill(); }
    else if (item.shape === "beetle-shell") { ctx.beginPath(); ctx.arc(0, 0, item.size, 0.45, 5.7); ctx.arc(2, 0, item.size * 0.58, 5.55, 0.6, true); ctx.fill(); }
    else if (item.shape === "beetle-eye") { ctx.beginPath(); ctx.arc(0, 0, item.size, 0, TAU); ctx.fill(); }
    else if (item.shape === "beetle-feeler") { ctx.strokeStyle = item.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-item.size, 0); ctx.quadraticCurveTo(0, -item.size, item.size, 0); ctx.stroke(); }
    else if (item.shape === "paper") paperDiamond(0, 0, item.size, 0);
    else { ctx.beginPath(); ctx.arc(0, 0, item.size, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
}

function drawRings() {
  for (const ring of rings) {
    ctx.globalAlpha = ring.life / ring.max;
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 2 + ring.life * 4;
    ctx.beginPath(); ctx.arc(cx, cy, ring.radius, 0, TAU); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawLabels(palette) {
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "900 13px Arial";
  for (const label of labels) {
    ctx.globalAlpha = label.life / label.max;
    ctx.fillStyle = palette.ink; ctx.fillText(label.text, cx + 2, label.y + 3);
    ctx.fillStyle = palette.gold; ctx.fillText(label.text, cx, label.y);
  }
  ctx.restore();
}

function drawTutorial(time, palette) {
  const point = playerPoint();
  const ghostAngle = normalize(player.angle - player.direction * 0.55);
  const gx = cx + Math.cos(ghostAngle) * orbitRadius;
  const gy = cy + Math.sin(ghostAngle) * orbitRadius;
  ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(time * 4) * 0.12;
  ctx.strokeStyle = palette.gold; ctx.lineWidth = 3; ctx.setLineDash([5, 6]);
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius, Math.min(player.angle, ghostAngle), Math.max(player.angle, ghostAngle)); ctx.stroke();
  ctx.fillStyle = palette.gold; paperDiamond(gx, gy, 9, ghostAngle);
  ctx.fillStyle = palette.light; ctx.beginPath(); ctx.arc(point.x, point.y, 30 + Math.sin(time * 5) * 4, 0, TAU); ctx.globalAlpha = 0.08; ctx.fill();
  ctx.restore();
}

function drawFever(time, palette) {
  ctx.save(); ctx.globalAlpha = 0.14 + Math.sin(time * 8) * 0.035; ctx.strokeStyle = palette.gold; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius + 18 + Math.sin(time * 6) * 4, 0, TAU); ctx.stroke(); ctx.restore();
}

function burst(point, color, count, speed, shape) {
  const cap = state.reducedEffects ? 90 : MAX_PARTICLES;
  const room = Math.max(0, cap - particles.length);
  for (let i = 0; i < Math.min(count, room); i += 1) {
    const angle = Math.random() * TAU;
    const velocity = speed * (0.35 + Math.random() * 0.65);
    const life = 0.25 + Math.random() * 0.38;
    particles.push({
      x: point.x, y: point.y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
      size: 1.5 + Math.random() * 3, life, max: life, color, shape,
      rotation: Math.random() * TAU, spin: (Math.random() - 0.5) * 8,
    });
  }
}

function drawGlider(target, rider, palette, scale = 1, time = 0, flip = 0, fever = false, glow = 0) {
  const wing = (fever ? 1.16 : 1) * (1 - flip * 0.14);
  target.save(); target.scale(scale, scale * wing);
  target.fillStyle = "rgba(0,0,0,.28)"; target.beginPath(); target.ellipse(-2, 4, 30, 17, 0, 0, TAU); target.fill();
  const path = () => {
    target.beginPath();
    if (rider.shape === "manta") { target.moveTo(31,0); target.lineTo(5,-7); target.lineTo(-17,-24); target.lineTo(-29,-18); target.lineTo(-20,0); target.lineTo(-29,18); target.lineTo(-17,24); target.lineTo(5,7); }
    else if (rider.shape === "dart") { target.moveTo(32,0); target.lineTo(-17,-23); target.lineTo(-8,-5); target.lineTo(-30,-10); target.lineTo(-19,0); target.lineTo(-30,10); target.lineTo(-8,5); target.lineTo(-17,23); }
    else if (rider.shape === "crescent") { target.moveTo(31,0); target.quadraticCurveTo(-4,-7,-25,-24); target.quadraticCurveTo(-36,-5,-16,0); target.quadraticCurveTo(-36,5,-25,24); target.quadraticCurveTo(-4,7,31,0); }
    else if (rider.shape === "splitwing") { target.moveTo(32,0); target.lineTo(-25,-22); target.lineTo(-8,-3); target.lineTo(-28,0); target.lineTo(-8,3); target.lineTo(-25,22); }
    else if (rider.shape === "shuttle") { target.moveTo(30,0); target.lineTo(12,-9); target.lineTo(-20,-17); target.lineTo(-28,-8); target.lineTo(-24,0); target.lineTo(-28,8); target.lineTo(-20,17); target.lineTo(12,9); }
    else { target.moveTo(31,0); target.lineTo(5,-7); target.arc(-8,0,22,-.3,TAU+.3); target.lineTo(5,7); }
    target.closePath();
  };
  target.fillStyle = palette.ink; path(); target.fill();
  target.save(); target.scale(.91,.82); target.fillStyle = palette.light; path(); target.fill(); target.restore();
  target.fillStyle = palette.paper; target.beginPath(); target.moveTo(29,0); target.lineTo(2,-7); target.lineTo(-12,0); target.lineTo(2,7); target.closePath(); target.fill();
  target.fillStyle = palette.accent; target.beginPath(); target.moveTo(14,0); target.lineTo(-8,-5); target.lineTo(-17,0); target.lineTo(-8,5); target.closePath(); target.fill();
  target.fillStyle = palette.gold; target.beginPath(); target.moveTo(-20,-5); target.lineTo(-31-(fever?7:0),0); target.lineTo(-20,5); target.closePath(); target.fill();
  if (glow || fever) { target.globalAlpha=.35+glow*.3+Math.sin(time*9)*.08; target.strokeStyle=palette.gold; target.lineWidth=2+glow*2; path(); target.stroke(); }
  target.restore();
}

function gliderBurst(point, palette) {
  for (let i=0;i<5;i+=1) {
    const angle=Math.random()*TAU, life=.48+Math.random()*.2;
    particles.push({x:point.x,y:point.y,vx:Math.cos(angle)*150,vy:Math.sin(angle)*150,size:5+Math.random()*4,life,max:life,color:[palette.light,palette.paper,palette.accent,palette.gold][i%4],shape:"shard",rotation:angle,spin:(Math.random()-.5)*9});
  }
}

function blobPath(x, y, radius, wobble, lobes, offset = 0) {
  ctx.beginPath();
  for (let i = 0; i <= 36; i += 1) {
    const angle = i / 36 * TAU;
    const r = radius * (1 + Math.sin(angle * lobes + offset) * wobble);
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function paperDiamond(x, y, size, rotation) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.beginPath();
  ctx.moveTo(0, -size); ctx.lineTo(size * 0.72, 0); ctx.lineTo(0, size); ctx.lineTo(-size * 0.72, 0); ctx.closePath(); ctx.fill(); ctx.restore();
}

function playerPoint() { return { x: cx + Math.cos(player.angle) * orbitRadius, y: cy + Math.sin(player.angle) * orbitRadius }; }
function playerSpeed() { return Math.min(2.45, 1.66 + state.elapsed * 0.009); }
function normalize(angle) { return (angle % TAU + TAU) % TAU; }
function angleDistance(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
function currentCosmetic() { return cosmetics.find((item) => item.id === state.selected) || cosmetics[0]; }
function currentRider() { return riders.find((item) => item.id === state.selectedRider) || riders[0]; }
function colorAlpha(hex, alpha) { const value = parseInt(hex.slice(1), 16); return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${alpha})`; }

function renderCosmetics() {
  ui.cosmetics.innerHTML = "";
  for (const cosmetic of cosmetics) {
    const unlocked = state.unlocked.includes(cosmetic.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `cosmetic${state.selected === cosmetic.id ? " selected" : ""}${unlocked ? "" : " locked"}`;
    button.style.setProperty("--swatch", cosmetic.paper);
    button.textContent = unlocked ? "*" : ".";
    button.title = unlocked ? cosmetic.name : `${cosmetic.name}: reach ${cosmetic.score}`;
    button.setAttribute("aria-label", button.title);
    button.addEventListener("click", () => {
      if (!unlocked) return;
      state.selected = cosmetic.id; save();
      if (state.mode === "garage") renderGarage(); else renderCosmetics();
    });
    ui.cosmetics.append(button);
  }
}

function showScreen(name) {
  ui.shell.classList.remove("playing");
  hideScreens();
  ui[name].hidden = false;
  state.mode = name;
  if (name === "home") updateHome();
  if (name === "garage") renderGarage();
}

function hideScreens() { for (const screen of [ui.home, ui.garage, ui.settings, ui.results]) screen.hidden = true; }

function updateHome() {
  ui.homeBest.textContent = state.best;
  ui.homeStars.textContent = state.stars;
  ui.sound.checked = !state.muted;
  ui.haptics.checked = state.haptics;
  ui.effects.checked = state.reducedEffects;
}

function renderGarage() {
  ui.garageStars.textContent = `${state.stars} stars`;
  ui.riderGrid.innerHTML = "";
  const palette = currentCosmetic();
  for (const rider of riders) {
    const owned = state.ownedRiders.includes(rider.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `rider-card${owned ? "" : " locked"}${state.selectedRider === rider.id ? " selected" : ""}`;
    card.innerHTML = `<canvas width="130" height="78"></canvas><b>${rider.name}</b><small>${state.selectedRider === rider.id ? "Equipped" : owned ? "Equip" : `${rider.price} stars`}</small>`;
    const mini = card.querySelector("canvas").getContext("2d");
    mini.translate(65,39); drawGlider(mini,rider,palette,1.45,0,0,false,0);
    card.addEventListener("click", () => {
      if (!owned) {
        if (state.stars < rider.price) { card.animate([{transform:"translateX(-3px)"},{transform:"translateX(3px)"},{transform:"none"}],{duration:180}); beep(120,.08,"square"); return; }
        state.stars -= rider.price; state.ownedRiders.push(rider.id); beep(820,.14,"triangle"); vibrate(25);
      }
      state.selectedRider = rider.id; save(); renderGarage(); updateHome();
    });
    ui.riderGrid.append(card);
  }
  renderCosmetics();
}

function drawHomePreview(time) {
  if (ui.home.hidden) return;
  const target = ui.preview.getContext("2d");
  target.clearRect(0,0,ui.preview.width,ui.preview.height);
  target.save(); target.translate(130,75+Math.sin(time*2)*3); drawGlider(target,currentRider(),currentCosmetic(),2.45,time,0,false,.25); target.restore();
}

function updateHud() {
  ui.score.textContent = Math.floor(state.score);
  ui.multiplier.textContent = `x${state.multiplier}`;
  ui.best.textContent = state.best;
  ui.fever.style.width = `${(state.fever > 0 ? state.fever / 6 : Math.min(1, state.streak / 5)) * 100}%`;
}

function vibrate(duration) { if (state.haptics && navigator.vibrate) navigator.vibrate(duration); }

function beep(frequency, duration, type) {
  if (state.muted) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + duration);
  } catch { /* Sound is optional. */ }
}

function runSelfChecks() {
  let seed = 19;
  const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 300; i += 1) {
    const plan = buildGatePlan({ index: i % 12, elapsed: i % 61, angle: random() * TAU, direction: random() > 0.5 ? 1 : -1, angularSpeed: 2, orbitRadius: 150, shortSide: 390 }, random);
    console.assert(angleDistance(normalize(plan.gap + plan.rotation * plan.flight), plan.target) < 0.0001, "Gate opening must resolve to its reachable target");
  }
  console.assert(angleDistance(0.05, TAU - 0.05) < 0.11, "Wrapped angle distance must stay small");
  console.assert(riders[0].id === "manta" && riders[0].price === 0, "Manta must remain the free default");
  console.assert(riders.slice(1).map((rider) => rider.price).join() === "40,100,200,350,550", "Garage prices must remain ordered");
}

function frame(time) {
  const delta = Math.min(0.033, (time - lastTime) / 1000 || 0);
  lastTime = time;
  update(delta);
  draw();
  drawHomePreview(time / 1000);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resize);
canvas.addEventListener("pointerdown", reverse);
document.querySelector("#play").addEventListener("click", startRun);
document.querySelector("#retry").addEventListener("click", startRun);
document.querySelector("#openGarage").addEventListener("click", () => showScreen("garage"));
document.querySelector("#openSettings").addEventListener("click", () => showScreen("settings"));
document.querySelector("#resultHome").addEventListener("click", () => showScreen("home"));
for (const button of document.querySelectorAll("[data-home]")) button.addEventListener("click", () => showScreen("home"));
ui.sound.addEventListener("change", () => { state.muted = !ui.sound.checked; save(); });
ui.haptics.addEventListener("change", () => { state.haptics = ui.haptics.checked; save(); vibrate(15); });
ui.effects.addEventListener("change", () => { state.reducedEffects = ui.effects.checked; save(); });
window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
    if (state.mode === "run") reverse(); else if (state.mode === "home" || state.mode === "results") startRun();
  }
});
document.addEventListener("visibilitychange", () => {
  state.paused = document.hidden;
  if (!document.hidden) lastTime = performance.now();
});
document.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });

resize();
renderCosmetics();
updateHud();
updateHome();
runSelfChecks();
requestAnimationFrame(frame);
