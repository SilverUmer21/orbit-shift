const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Run the real game loop without a browser or persistent player data.
let mapActive = true;
let seed = Number(process.argv[2]) || 73;
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
vm.runInContext(`
  assert.deepEqual(Array.from(campaignLevels,l=>l.perfectTarget),[2,2,3,3]);
  for(const level of campaignLevels)assert.equal(level.fragmentTimes.length,6);
  for(const elapsed of [0,30,87,110])for(const fever of [0,.4,6])for(const spacing of [0,58]){
    const snapshot={index:8,elapsed,fever,angle:1,direction:-1,orbitRadius:150,shortSide:390,pairSpacing:spacing,settings:[72,1.18,.24],phase:phases[0]};
    const plan=buildGatePlan(snapshot);
    let angle=snapshot.angle,direction=snapshot.direction,radius=plan.radius,gap=plan.gap,time=0,turn=0;
    while(time<plan.flight-1e-8){
      if(plan.turns[turn]<=time+1e-8){direction*=-1;turn++;continue;}
      const dt=Math.min(1/240,plan.flight-time,(plan.turns[turn]??Infinity)-time);
      angle=normalize(angle+direction*orbitalTravel(elapsed+time,dt));
      const world=worldTravel(dt,Math.max(0,fever-time));radius-=plan.speed*world;gap=normalize(gap+plan.rotation*world);time+=dt;
    }
    assert.ok(Math.abs(radius-150)<.001&&angleDistance(angle,gap)<.001,'Actual movement must meet the planned opening through fever and acceleration');
    const pairTime=crossingTime(plan.travel+spacing/plan.speed,fever);
    assert.ok(angleDistance(routeAngle(snapshot,pairTime,plan.turns),normalize(plan.pairGap+plan.rotation*(plan.travel+spacing/plan.speed)))<.001,'Paired opening follows the same route');
  }
  assert.equal(sweptPickup({x:-100,y:0},{x:100,y:0},{x:0,y:0},{x:0,y:0},48),true);
  assert.equal(sweptPickup({x:-100,y:49},{x:100,y:49},{x:0,y:0},{x:0,y:0},48),false);
  startRun('campaign','first-light');
  for(const offset of [60,-30]){
    fragments=[{angle:player.angle,radius:orbitRadius+offset,speed:64,spin:0,collected:false}];
    const before=state.runFragments;
    updateFragments(.016,1,playerPoint());
    assert.equal(state.runFragments,before+1,'Near fragments collect on either side of the orbit');
    updateFragments(.016,1,playerPoint());assert.equal(state.runFragments,before+1,'Snap animation cannot award twice');
  }
  function pass(clearance,generous=false){const gate={gap:player.angle+(.6-.105-clearance),opening:1.2,generous};resolveGate(gate);return gate;}
  startRun('endless');pass(.2);assert.equal(state.perfects,0);
  const marked=pass(.2,true);assert.equal(state.perfects,1);
  resolveGate(marked);assert.equal(state.perfects,1,'A resolved gate cannot pay twice');
  assert.equal(perfectWindow({generous:true,guardian:true}),.145);
  assert.equal(perfectWindow({generous:true,pair:true}),.145);
  startRun('endless');
  for(let i=0;i<5;i++){pass(.05);if(i<4){const charge=state.feverCharge;pass(.4);assert.equal(state.feverCharge,charge);assert.equal(state.streak,0);}}
  assert.equal(state.fever,6);assert.equal(state.feverCharge,0);assert.equal(state.shield,true);
  pass(.4);assert.equal(state.multiplier,5);pass(.05);assert.equal(state.feverCharge,0);
  state.fever=.001;nextGate=999;update(.01);assert.equal(state.multiplier,2);
  state.feverCharge=3;beginCrash();assert.equal(state.mode,'run');assert.equal(state.shield,false);assert.equal(state.feverCharge,0);
  state.invulnerable=0;for(let i=0;i<5;i++)pass(.05);
  assert.equal(state.shield,false,'A later fever cannot grant a second shield');
  beginCrash();const reward=state.runStars;pass(.05);assert.equal(state.runStars,reward,'Crashes stop scoring');
  startRun('campaign','first-light');assert.equal(state.feverCharge,0);
  state.runFragments=6;state.perfects=2;state.levelComplete=true;finishRun();
  assert.equal(ui.fragmentCount.textContent,'3/3');
  assert.equal(state.campaign.ratings['first-light'],3,'Excess fragments still earn the rating');
  const wallet=state.stars;finishRun();assert.equal(state.stars,wallet,'Results cannot pay twice');
`,sandbox);
const legacy = { ...sandbox, performance:{now:()=>1000}, localStorage: {getItem:()=>JSON.stringify({version:3,best:800,stars:123,ownedRiders:['manta','dart'],selectedRider:'dart',campaign:{completed:['first-light'],ratings:{'first-light':3},fragments:{'first-light':3}},muted:true,tutorialSeen:true}),setItem(){}} };
vm.createContext(legacy);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8'),legacy);
vm.runInContext("assert.equal(state.stars,123);assert.equal(state.best,800);assert.equal(state.selectedRider,'dart');assert.equal(state.campaign.ratings['first-light'],3);assert.equal(state.campaign.unlockedLevel,2);",legacy);
console.log('PASS: pickup boundaries, duplicate guards, generous gates, fever charge, shields, excess-fragment rewards, legacy saves');
vm.runInContext(`
  performance.now=()=>1000+state.elapsed*1000;
  const actualCrash=beginCrash;
  beginCrash=(cause)=>{if(state.mode==='run'&&!state.shield&&state.invulnerable<=0)console.log('Route collision',JSON.stringify({cause,time:state.elapsed,angle:player.angle,turns:plannedTurns,fever:state.fever,hazards:hazards.map(h=>({age:h.age,angle:h.angle,distance:angleDistance(h.angle,player.angle)})),gates:gates.filter(g=>!g.resolved).map(g=>({radius:g.radius,angle:g.gap,opening:g.opening}))}));actualCrash(cause);};
  const simulationResults=[];
  for(const fps of [20,30,60,120]) for(const level of [null,...campaignLevels]){
    startRun(level?'campaign':'endless',level?.id);
    const duration=level?.duration||120;
    let frames=0;
    while(state.elapsed<duration-1e-7&&state.mode==='run'){
      let remaining=1/fps;
      while(remaining>1e-8&&state.mode==='run'){
        while(plannedTurns.length&&plannedTurns[0]<=state.elapsed+1e-8){plannedTurns.shift();reverse();}
        const toTurn=plannedTurns.length?plannedTurns[0]-state.elapsed:Infinity;
        const dt=Math.min(remaining,1/60,toTurn,duration-state.elapsed);
        if(dt<1e-9)break;
        update(dt);remaining-=dt;
      }
      assert.ok(++frames<fps*(duration+1),'Simulation must progress');
    }
    assert.notEqual(state.mode,'crash',(level?.id||'endless')+' planned route collided at '+state.elapsed+' ('+fps+' FPS)');
    assert.ok(state.elapsed>=duration-.01,'Planned route must finish');
    if(level){assert.equal(campaignFragmentIndex,6,level.id+' must offer six pickups');assert.ok(state.runFragments>=3,level.id+' planned route must meet pickup target');assert.equal(campaignHazardIndex,level.hazardTimes.length,'Deferred hazard must eventually spawn');}
    simulationResults.push({level:level?.id||'endless',fps,gates:state.gatesPassed,fragments:state.runFragments});
  }
  console.log(JSON.stringify(simulationResults));
`,sandbox);
