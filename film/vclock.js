// Virtual clock for frame-exact film capture (injected into every frame before page scripts run). A copy of
// trailer/vclock.js plus __setNow, so each gameplay shot can start from a fixed clock (the planets animate on it).
// performance.now, Date.now, requestAnimationFrame, timers and CSS/Web animations all follow __advance(ms);
// Math.random is seeded so every render replays the same run.
(() => {
  let vnow = 0, nextId = 1, seed = 20261019;
  const rafs = [], timers = [];
  performance.now = () => vnow;
  const dateBase = Date.now();
  Date.now = () => dateBase + vnow;
  Math.random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
  window.requestAnimationFrame = cb => { rafs.push(cb); return nextId++; };
  window.cancelAnimationFrame = () => {};
  window.setTimeout = (cb, ms = 0, ...args) => { const id = nextId++; timers.push({ id, at: vnow + ms, cb: () => cb(...args) }); return id; };
  window.clearTimeout = id => { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); };
  window.setInterval = (cb, ms = 0, ...args) => { const id = nextId++; const tick = () => { cb(...args); timers.push({ id, at: vnow + Math.max(1, ms), cb: tick }); }; timers.push({ id, at: vnow + Math.max(1, ms), cb: tick }); return id; };
  window.clearInterval = window.clearTimeout;
  window.requestIdleCallback = cb => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 10 }), 50);
  window.__vnow = () => vnow;
  window.__setNow = ms => { const d = ms - vnow; vnow = ms; for (const t of timers) t.at += d; };
  window.__advance = ms => {
    vnow += ms;
    for (let guard = 0; guard < 100; guard++) {
      timers.sort((a, b) => a.at - b.at);
      if (!timers.length || timers[0].at > vnow) break;
      timers.shift().cb();
    }
    const due = rafs.splice(0);
    for (const cb of due) cb(vnow);
    for (const a of document.getAnimations()) {
      if (a.__v === undefined) { a.__v = vnow - (a.currentTime || 0); a.pause(); }
      a.currentTime = vnow - a.__v;
    }
  };
})();
