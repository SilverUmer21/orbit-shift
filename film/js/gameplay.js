// Fly Them Home · the bridge to the real game (index.html in an iframe on its own virtual clock). A shot restores a
// clean state, sets up a run, then steps the game while film-timed taps, holds, staged gates, comets and swaps fire.
// Staged gates are real gates: only their spawn time and gap angle are shifted (measured in silent passes, stored in
// corrections.json) so the game's own rules thread them, score the perfects and trigger Express Post.
(() => {
  const GB = { ready: false, corr: {}, events: [] };
  let W, frameEl, canvasEl;
  const run = code => W.eval(code);

  GB.init = async () => {
    frameEl = document.getElementById("game");
    await new Promise(res => { const ok = () => { try { return frameEl.contentWindow.eval('typeof state!=="undefined"&&typeof startRun==="function"'); } catch (e) { return false; } };
      const poll = () => ok() ? res() : setTimeout(poll, 30); poll(); });
    W = frameEl.contentWindow;
    W.document.head.insertAdjacentHTML("beforeend", '<style>.shell{width:100vw!important;height:100vh!important;min-height:0!important}</style>');
    W.dispatchEvent(new W.Event("resize"));
    canvasEl = W.document.getElementById("game");
    run(`state.muted=true;state.tutorialSeen=true;state.reducedEffects=false;state.expressFold=true;
      drawLabels=()=>{};
      window.__state0=JSON.stringify(state);
      window.__cross={};
      const __resolve=resolveGate;
      window.resolveGate=resolveGate=function(gate,ca=player.angle,cg=gate.gap){ if(gate.__tag){const p=playerPoint();__cross[gate.__tag]={ca,cg,dir:player.direction,opening:gate.opening,el:state.elapsed,x:p.x,y:p.y};} return __resolve.apply(this,arguments); };
      window.__seed=s=>{let a=s>>>0;Math.random=()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};};
      window.__watch={perfects:0,gates:0,fever:0,brushed:new Set()};`);
    GB.ready = true;
  };
  GB.canvas = () => canvasEl;
  GB.eval = run;
  GB.info = () => JSON.parse(run(`JSON.stringify((()=>{const p=playerPoint();return{el:state.elapsed,mode:state.mode,x:p.x,y:p.y,angle:player.angle,dir:player.direction,fold:player.fold,fever:state.fever,streak:state.streak,cx,cy,or:orbitRadius,pr:planetRadius}})())`));

  // ---------- Shots
  let shot = null;
  // The shot's clock starts `preroll` seconds before t0 so staged gates can already be on their way; nothing before t0
  // is filmed.
  GB.enter = (def, filmT0, measure = false) => {
    const pre = def.preroll ?? 3;
    shot = { def, t0: filmT0, ft: filmT0 - pre, fired: new Set(), measure, log: [], map: [], frameEvents: [], spawned: {} };
    // A fixed clock per shot (from its film start), so what the planets draw never depends on what ran before.
    W.__setNow(1e7 + Math.round((filmT0 - pre) * 1000));
    run(`if(window.__dpr&&window.__dpr!==2.5){window.__dpr=2.5;dispatchEvent(new Event('resize'));}`);
    run(`{const s0=JSON.parse(__state0);for(const k of Object.keys(state))if(!(k in s0))delete state[k];Object.assign(state,s0);}
      __seed(${def.seed || 1});window.__cross={};
      ${def.setup}
      state.invulnerable=${measure ? 999 : 0};
      {const keep={gateCount,eligibleGateCount,recoveryGate};const n=gates.length;window.__tmpl=null;
       if(spawnGate()&&gates.length>n){window.__tmpl=JSON.parse(JSON.stringify(gates[gates.length-1]));gates.length=n;}
       gateCount=keep.gateCount;eligibleGateCount=keep.eligibleGateCount;recoveryGate=keep.recoveryGate;plannedTurns=[];}`);
    GB.step(filmT0);
    shot.frameEvents = [];
    return shot;
  };
  function adv(sec) {
    W.__advance(sec * 1000);
    run(`if(state.mode==="run")state.elapsed=Math.round(state.elapsed*1e6)/1e6`);
  }
  // Fire every scheduled action whose film time has come (actions are keyed by film time so taps land on beats).
  function fire(ft) {
    const d = shot.def, c = GB.corr[d.id] || {};
    const due = (key, at) => { if (shot.fired.has(key) || at > ft + 1e-6) return false; shot.fired.add(key); return true; };
    for (const [i, t] of (d.taps || []).entries()) if (due(`tap${i}`, t)) { const r = JSON.parse(run(`(()=>{lastReverse=-1e9;const ok=reverse();const p=playerPoint();return JSON.stringify({ok,x:p.x,y:p.y,dir:player.direction,angle:player.angle})})()`)); GB.emit("tap", ft, r); }
    for (const [i, [a, b]] of (d.holds || []).entries()) {
      if (due(`holdOn${i}`, a)) { run(`holdStart=performance.now()-1000;holding=true;`); GB.emit("holdOn", ft); }
      if (due(`holdOff${i}`, b)) { run(`holding=false;`); GB.emit("holdOff", ft); }
    }
    for (const g of d.gates || []) {
      const at = g.cross - (g.lead ?? 2.4) + (c[g.id]?.spawn || 0);
      if (!shot.fired.has(`gate${g.id}`) && at <= ft + 1e-6) {
        // Staged gates are copies of a real gate the game planned at the start of the shot (same object, physics,
        // drawing and scoring), so their travel time is constant and they can land on the beat.
        const abs = c[g.id]?.abs, idx = (d.gates || []).indexOf(g), letter = g.letter ? (c[g.id]?.letter ?? 1) : "undefined";
        const ok = run(`(()=>{if(!window.__tmpl)return "false";const t=JSON.parse(JSON.stringify(__tmpl));
          const ember=state.runType==="campaign"&&currentCampaignLevel().biome==="ember";
          const g={...t,resolved:false,age:0,previousRadius:t.radius,letter:${letter},letterTaken:false,generous:${!!g.generous},guardian:false,pair:false,
            heat:${g.heat === undefined ? "t.heat" : g.heat},type:ember?1:${idx % 4},palette:${idx % 3},rotation:t.rotation*${idx % 2 ? -1 : 1},__tag:'${g.id}'};
          ${abs === undefined ? "" : `g.gap=normalize(${abs});`}gates.push(g);gateCount+=1;return JSON.stringify([state.elapsed,g.gap]);})()`);
        if (ok !== "false") { const [el, gap] = JSON.parse(ok); shot.fired.add(`gate${g.id}`); shot.spawned[g.id] = { ft, el, gap }; }
      }
      if (g.fever && due(`fever${g.id}`, g.cross - .45)) run(`state.feverCharge=4;state.streak=Math.max(state.streak,4);`);
    }
    for (const [i, cm] of (d.comets || []).entries()) if (due(`comet${i}`, cm.at)) {
      const aim = c[`comet${i}`]?.aim;
      run(`(()=>{const arrive=COMET_WARN+COMET_TRAVEL;const pred=normalize(player.angle+player.direction*orbitalTravel(state.elapsed,arrive)*foldSpeed());
        const cross=${aim === undefined ? "pred" : `normalize(${aim})`};const heading=cross+Math.PI+${cm.slant ?? .22};
        comets.push({cross,dx:Math.cos(heading),dy:Math.sin(heading),clock:0,brushed:false,spin:0,__i:${i}});})()`);
      GB.emit("cometWarn", ft, { i });
    }
    for (const [i, a] of (d.actions || []).entries()) if (due(`act${i}`, a.at)) { if (a.code) run(a.code); if (a.event) GB.emit(a.event, ft, a.data || {}); }
  }
  // Advance the shot to film time ft (game time follows the shot's speed curve).
  GB.step = ft => {
    const d = shot.def;
    while (shot.ft < ft - 1e-9) {
      const dt = Math.min(1 / 60, ft - shot.ft);
      fire(shot.ft);
      const sp = d.speed ? d.speed(shot.ft) : 1, gdt = dt * sp;
      if (gdt > 0) adv(gdt);
      shot.ft += dt;
      watch(shot.ft);
    }
    fire(shot.ft);
  };
  function watch(ft) {
    const r = JSON.parse(run(`JSON.stringify((()=>{const p=playerPoint();const out={el:state.elapsed,lt:state.runLetters||0,p:state.perfects,g:state.gatesPassed,f:state.fever,x:p.x,y:p.y,streak:state.streak,mode:state.mode,c:[]};
      for(const cm of comets){ if(cm.clock>=COMET_WARN+COMET_TRAVEL-1e-3&&cm.__arr===undefined){cm.__arr=1;out.c.push({i:cm.__i,arrive:true,angle:player.angle,dir:player.direction});}
        if(cm.brushed&&!__watch.brushed.has(cm)){__watch.brushed.add(cm);out.c.push({i:cm.__i,brush:true});} }
      return out;})())`));
    shot.map.push([ft, r.el]);
    if (ft > shot.t0) {
      if (r.p > (shot.lastP ?? r.p)) GB.emit("perfect", ft, { n: r.streak, x: r.x, y: r.y });
      if (r.g > (shot.lastG ?? r.g)) GB.emit("gate", ft, { x: r.x, y: r.y });
      if (r.lt > (shot.lastLt ?? r.lt)) GB.emit("letter", ft, { x: r.x, y: r.y });
      if (r.f > 0 && !(shot.lastF > 0)) GB.emit("fever", ft, { x: r.x, y: r.y });
      if (r.mode === "crash" && shot.lastMode !== "crash") GB.emit("crash", ft, {});
      for (const c of r.c) if (c.brush) GB.emit("tailSpark", ft, { i: c.i, x: r.x, y: r.y });
    }
    for (const c of r.c) if (c.arrive) shot.log.push({ comet: c.i, angle: c.angle, dir: c.dir });
    shot.lastP = r.p; shot.lastLt = r.lt; shot.lastG = r.g; shot.lastF = r.f; shot.lastMode = r.mode;
  }
  GB.emit = (type, t, data = {}) => { const e = { type, t: +t.toFixed(4), shot: shot?.def.id, ...data }; GB.events.push(e); if (shot) shot.frameEvents.push(e); };
  GB.takeEvents = () => { if (!shot) return []; const e = shot.frameEvents; shot.frameEvents = []; return e; };
  GB.shot = () => shot;

  // ---------- Measuring: run a shot silently (and a few seconds past its end), then move each staged gate's spawn so its
  // measured travel time lands the crossing on its beat, and turn its gap so it is threaded with the clearance it wants
  // (perfect = near the edge). Comets are aimed just behind the glider for a tail-spark near miss.
  GB.measure = (def, t0, t1) => {
    const c = GB.corr[def.id] || (GB.corr[def.id] = {});
    run(`window.__draw0=window.__draw0||draw;draw=()=>{};`);
    for (let pass = 0; pass < 16; pass++) {
      GB.events.length = 0;
      GB.enter(def, t0, true); GB.step(t1 + 6);
      const cross = JSON.parse(run("JSON.stringify(__cross)")); let changed = false;
      for (const g of def.gates || []) {
        const x = cross[g.id], sp = shot.spawned[g.id], cc = c[g.id] || (c[g.id] = { spawn: 0 });
        if (!sp) { cc.spawn -= .1; changed = true; continue; }
        if (!x) { cc.spawn -= .4; changed = true; continue; }
        const travel = x.el - sp.el, wantEl = elAt(g.cross) - travel, d = filmTimeOf(wantEl) - sp.ft;
        if (Math.abs(d) > .004) { cc.spawn += d; changed = true; }
        // Aim absolutely: the gap at spawn = where the glider will cross (minus the edge offset for a perfect) minus the
        // gate's own rotation in flight.
        const half = x.opening / 2 - .105, dist = g.want === "perfect" ? half - .07 : 0;
        const target = x.ca - x.dir * dist, rot = x.cg - sp.gap, abs = target - rot;
        const wrap = a => ((a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        if (cc.abs === undefined || Math.abs(wrap(abs - cc.abs)) > .002) { cc.abs = ((abs % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); changed = true; }
        if (g.letter && cc.letter !== x.dir) { cc.letter = x.dir; changed = true; }
      }
      for (const [i, cm] of (def.comets || []).entries()) {
        const a = shot.log.find(l => l.comet === i), want = a ? a.angle - a.dir * (cm.miss ?? .2) : null;
        const cur = c[`comet${i}`]?.aim;
        if (want !== null && (cur === undefined || Math.abs(want - cur) > .003)) { c[`comet${i}`] = { aim: want }; changed = true; }
      }
      console.log(`measure ${def.id} pass ${pass}`, JSON.stringify(c), JSON.stringify(GB.events.filter(e => e.type !== "tap").map(e => `${e.type}@${e.t.toFixed(2)}`)));
      if (!changed) break;
    }
    run(`draw=window.__draw0;`);
    return c;
  };
  // Game elapsed <-> film time, from the mapping recorded while the shot ran.
  function filmTimeOf(el) {
    const m = shot.map;
    if (el <= m[0][1]) return m[0][0] - (m[0][1] - el);
    for (let i = 1; i < m.length; i++) if (m[i][1] >= el) { const [f0, e0] = m[i - 1], [f1, e1] = m[i]; return f0 + (f1 - f0) * (e1 > e0 ? (el - e0) / (e1 - e0) : 0); }
    return m[m.length - 1][0];
  }
  function elAt(ft) {
    const m = shot.map;
    for (let i = 1; i < m.length; i++) if (m[i][0] >= ft) { const [f0, e0] = m[i - 1], [f1, e1] = m[i]; return e0 + (e1 - e0) * ((ft - f0) / (f1 - f0)); }
    return m[m.length - 1][1];
  }
  window.Game = GB;
})();
