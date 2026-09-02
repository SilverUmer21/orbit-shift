const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Run the real game loop without a browser or persistent player data.
let mapActive = true;
let seed = 73;
const math = Object.create(Math);
math.random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const context = new Proxy({}, { get: (_, key) => key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {} });
const element = () => ({ clientWidth: 390, clientHeight: 844, width: 390, height: 844,
  hidden: true, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
  getContext: () => context, setAttribute() {}, addEventListener() {}, append() {}, querySelector: () => element() });
const elements = new Map();
const sandbox = { console: { ...console, assert: (ok,message) => assert.ok(ok,message) }, Math: math, performance: { now: () => 1000 }, devicePixelRatio: 1,
  document: { hidden: false, querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); },
    querySelectorAll: () => [], createElement: element, addEventListener() {} },
  window: { addEventListener() {}, OrbitArchipelago: { setActive(value) { mapActive = value; } },
    OrbitArt: { drawLivingPlanet() {} } },
  localStorage: { getItem: () => '{"muted":true,"tutorialSeen":true}', setItem() {} },
  navigator: {}, requestAnimationFrame() {}, setTimeout() {}, setInterval() {}, clearInterval() {}, assert };
sandbox.OrbitArt = sandbox.window.OrbitArt;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8'), sandbox);
vm.runInContext('startRun("endless")', sandbox);
assert.equal(mapActive, false, 'The hidden map must stop rendering during a run');
vm.runInContext(`
  for (const fps of [20,30,60,120]) {
    startRun('endless'); state.invulnerable=999;
    lastTime=1000;
    for(let i=1;i<=fps*120;i++) frame(1000+i*1000/fps);
    assert.ok(Math.abs(state.elapsed-120)<.01, fps+' FPS must advance 120 game seconds');
    assert.equal(state.phaseId,'ascension');
    assert.ok(particles.length<=MAX_PARTICLES);
  }
  startRun('endless'); nextGate=999;
  resolveGate({gap:player.angle+.44,opening:1.2,resolved:false});
  assert.equal(state.perfects,1);
  const before=player.angle;
  update(1/60);
  assert.ok(Math.abs(angleDistance(player.angle,before)-playerSpeed()/60)<.00001,'Perfects must not stall the ship');
  state.paused=true;
  const pausedAt=state.elapsed;
  frame(lastTime+5000);
  assert.equal(state.elapsed,pausedAt,'Background pause must freeze simulation');
  state.paused=false;
  frame(lastTime+5000);
  assert.ok(state.elapsed-pausedAt<=.100001,'Long gaps must not cause a multi-second jump');
`, sandbox);
console.log('PASS: map suspension, 120-second Ascension at 20/30/60/120 FPS, particle cap, continuous perfect movement, pause and bounded catch-up');
