const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const logicalWidth=Number(process.argv[3])||390,logicalHeight={320:568,390:844,430:932}[logicalWidth]||844;

// Run the real game loop without a browser or persistent player data.
let mapActive = true;
let seed = Number(process.argv[2]) || 73;
const math = Object.create(Math);
math.random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const context = new Proxy({}, { get: (_, key) => key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {} });
const element = () => ({ clientWidth: logicalWidth, clientHeight: logicalHeight, width: logicalWidth, height: logicalHeight,
  hidden: true, dataset:{}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
  getContext: () => context, setAttribute() {}, addEventListener(type,listener) { (this.listeners[type] ||= []).push(listener); },
  listeners: {}, dispatchEvent(event) { for (const listener of this.listeners[event.type] || []) listener(event); },
  append() {}, querySelector: () => element() });
const elements = new Map();
const sandbox = { console: { ...console, assert: (ok,message) => assert.ok(ok,message) }, Math: math, performance: { now: () => 1000 }, devicePixelRatio: 1,
  document: { hidden: false, querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); },
    querySelectorAll: () => [], createElement: element, addEventListener() {} },
  window: { addEventListener() {}, OrbitArchipelago: { setActive(value) { mapActive = value; } },
    OrbitArt: { drawLivingPlanet() {} } },
  localStorage: { getItem: () => '{"muted":true,"tutorialSeen":true,"campaign":{"completed":["crown-of-petals"],"unlockedLevel":4,"restoration":4}}', setItem() {} },
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
console.log('PASS: '+logicalWidth+'x'+logicalHeight+' map suspension, 120-second Ascension at 20/30/60/120 FPS, particle cap, continuous perfect movement, pause and bounded catch-up');
vm.runInContext(`
  assert.equal(campaignLevels.length,8,'Campaign must expose four Bloom and four Ember levels');
  assert.deepEqual(Array.from(campaignLevels,l=>l.id),['first-light','pollen-path','tangled-orbit','crown-of-petals','kindling','cinder-step','furnace-heart','solar-forge']);
  assert.deepEqual(Array.from(campaignLevels,l=>l.perfectTarget),[2,2,3,3,2,2,3,3]);
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
  for(const offset of [Math.max(48,Math.min(68,orbitRadius*.44))-2,-30]){
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
  assert.equal(SAVE_VERSION,5);
  const oldCompleted=state.campaign.completed.slice(),oldUnlock=state.campaign.unlockedLevel;
  state.campaign.completed=[];state.campaign.unlockedLevel=1;
  const runsBefore=state.stats.runs;
  assert.equal(startRun('campaign','kindling'),false);assert.equal(startRun('campaign','missing'),false);
  assert.equal(startRun('campaign','crown-of-petals'),false);assert.equal(state.stats.runs,runsBefore,'Locked launches cannot record runs');
  state.campaign.completed=oldCompleted;state.campaign.unlockedLevel=oldUnlock;
  state.selected='void';startRun('campaign','kindling');assert.equal(currentCosmetic().id,'ember');assert.equal(state.selected,'void');
  const bloomStage=state.campaign.restoration;
  state.levelComplete=true;state.runFragments=6;state.perfects=2;finishRun();
  assert.equal(state.campaign.ratings.kindling,3);assert.equal(state.campaign.emberRestoration,1);assert.equal(state.campaign.restoration,bloomStage);
  assert.equal(state.runStars,15);assert.equal(ui.resultHome.textContent,'Ember Chapter');
  startRun('campaign','kindling');state.levelComplete=true;finishRun();assert.equal(state.runStars,0,'First clear reward is not repeated');
  assert.equal(state.campaign.ratings.kindling,3,'Lower replay rating cannot erase a best rating');
  showScreen('home');assert.equal(currentCosmetic().id,'void');assert.equal(state.selected,'void');
  state.campaign.completed=state.campaign.completed.filter(id=>id!=='first-light');
  state.campaign.ratings['first-light']=0;state.campaign.fragments['first-light']=0;state.campaign.unlockedLevel=4;
  startRun('campaign','first-light');state.levelComplete=true;state.runFragments=6;state.perfects=2;
  const firstClearStars=state.stars;beginAwakening();
  assert.equal(state.mode,'awakening');assert.equal(awakening.life,1.5);assert.equal(awakening.skippable,false);
  assert.equal(state.stars-firstClearStars,15,'First clear pays once before awakening');
  canvas.dispatchEvent({type:'pointerdown'});assert.equal(state.mode,'awakening','First clear cannot skip awakening');
  update(.75);assert.ok(Math.abs(awakening.life-.75)<1e-9);
  state.paused=true;const pausedLife=awakening.life;update(2);assert.equal(awakening.life,pausedLife,'Paused awakening timer must freeze');
  state.paused=false;update(1.01);assert.equal(state.mode,'results','Awakening reaches results after 1.5 seconds');
  const settledStars=state.stars;beginAwakening();finishAwakening();assert.equal(state.stars,settledStars,'Awakening cannot double reward');
  startRun('campaign','first-light');state.levelComplete=true;state.runFragments=0;state.perfects=0;beginAwakening();
  assert.equal(awakening.skippable,true);assert.equal(awakening.rating,1);assert.equal(state.campaign.ratings['first-light'],3,'Stored 3-star rating survives a 1-star replay');
  const replayStars=state.stars;canvas.dispatchEvent({type:'pointerdown'});assert.equal(state.mode,'results','Repeat clear can skip awakening');assert.equal(state.stars,replayStars,'Repeat clear pays no stars');
  startRun(state.runType,state.levelId);assert.equal(state.mode,'run');assert.equal(state.elapsed,0);assert.equal(state.runFragments,0);assert.equal(state.perfects,0);assert.equal(state.runStars,0);assert.equal(state.paused,false,'Retry resets run state');
  for(const age of [0,.59,.6,1.19,1.2,1.4,1.6,2])for(const distance of [1,40,200]){
    const gate={speed:62,heat:true,age},duration=gateTravelTime(gate,distance);
    assert.ok(Math.abs(gateDistance(gate,duration)-distance)<.00001,'Heat integral and inverse agree at every boundary');
  }
  assert.ok(Math.abs(heatTravel(1.2)-.9)<1e-9);assert.ok(Math.abs(heatTravel(1.6)-1.3)<1e-9);
  for(const age of [0,.8,1.35,2])for(const fever of [0,.2,1,6]){
    const gate={speed:62,heat:true,age},world=gateTravelTime(gate,180),flight=crossingTime(world,fever);
    let advanced=0,worldAdvanced=0;
    while(advanced<flight-1e-9){const dt=Math.min(1/120,flight-advanced);worldAdvanced+=worldTravel(dt,Math.max(0,fever-advanced));advanced+=dt;}
    assert.ok(Math.abs(gateDistance(gate,worldAdvanced)-180)<.00001,'Fever expiration preserves pulse crossing');
  }
`,sandbox);
 const bloomIds=['first-light','pollen-path','tangled-orbit','crown-of-petals'];
 for(const restoration of [0,1,2,3,4]){
   const completed=bloomIds.slice(0,restoration);
   let written;
   const fixture={version:4,best:800,stars:123,ownedRiders:['manta','dart'],selectedRider:'dart',selected:'void',unlocked:['bloom','ember','void'],muted:true,haptics:false,reducedEffects:true,tutorialSeen:true,stats:{sessions:3,runs:8,totalMs:1000,longestMs:1000,deaths:{gate:2,hazard:1},acts:[2,1,0],guardians:1,goals:2,dates:[]},campaign:{completed,ratings:{'first-light':3},fragments:{'first-light':6},rewards:['bloom-wake'],restoration:completed.length,unlockedLevel:Math.min(4,completed.length+1)}};
  const migration={...sandbox,localStorage:{getItem:()=>JSON.stringify(fixture),setItem:(key,value)=>{written=JSON.parse(value);}}};
  vm.createContext(migration);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8'),migration);
   assert.equal(written.version,5);assert.equal(written.stars,123);assert.equal(written.selected,'void');assert.equal(written.selectedRider,'dart');assert.equal(written.haptics,false);assert.equal(written.reducedEffects,true);assert.equal(written.stats.runs,8);assert.deepEqual(written.campaign.completed,completed);assert.equal(written.campaign.fragments['first-light'],6);assert.equal(written.campaign.restoration,restoration);assert.equal(written.campaign.emberRestoration,0);
  assert.equal(vm.runInContext('isLevelUnlocked("kindling")',migration),completed.includes('crown-of-petals'));
}
console.log('PASS: Kindling access, chapter rewards, palette restoration, v4 migration, heat integral and fever boundaries');
vm.runInContext(`
  const emberIds=['kindling','cinder-step','furnace-heart','solar-forge'];
  const savedCompleted=state.campaign.completed.slice();
  state.campaign.completed=[];
  for(const id of ['kindling','cinder-step','furnace-heart','solar-forge'])assert.equal(isLevelUnlocked(id),false,id+' must start locked');
  state.campaign.completed.push('crown-of-petals');
  assert.equal(isLevelUnlocked('kindling'),true);assert.equal(isLevelUnlocked('cinder-step'),false);
  for(const [index,id] of emberIds.entries()){
    assert.equal(isLevelUnlocked(id),true,id+' must unlock after its prerequisite clear');
    if(index<emberIds.length-1)assert.equal(isLevelUnlocked(emberIds[index+1]),false,id+' must be the only newly unlocked Ember level');
    state.campaign.completed.push(id);
    if(index<emberIds.length-1)assert.equal(isLevelUnlocked(emberIds[index+1]),true,emberIds[index+1]+' must unlock next');
  }
  state.campaign.completed=savedCompleted;
  const solar=campaignLevels.find(level=>level.id==='solar-forge'),guardian=solar.phases.find(phase=>phase.guardian);
  const guardianSnapshot={elapsed:60,angle:1,direction:1,fever:0,turns:[],constraints:[],hazards:[],index:11,orbitRadius:150,shortSide:390,phase:guardian,settings:solar.guardianMotion,pairSpacing:58};
  const guardianPlan=buildGatePlan(guardianSnapshot,()=>.73);
  const guardianMotion={speed:guardianPlan.speed,heat:guardianPlan.heat},pairTravel=gateTravelTime(guardianMotion,guardianPlan.radius-150+58),pairFlight=crossingTime(pairTravel,guardianSnapshot.fever);
  assert.ok(Number.isFinite(guardianPlan.pairGap),'Solar guardian must plan paired gates');
  assert.ok(angleDistance(routeAngle(guardianSnapshot,pairFlight,guardianPlan.turns),normalize(guardianPlan.pairGap+guardianPlan.rotation*pairTravel))<.001,'Solar guardian pair must remain reachable');
  const firstRewards=state.campaign.rewards.slice();
  state.campaign.completed=state.campaign.completed.filter(id=>id!=='first-light');
  startRun('campaign','first-light');state.levelComplete=true;state.runFragments=6;state.perfects=2;finishRun();
  const rewardCount=state.campaign.rewards.length,rewardStars=state.stars;
  startRun('campaign','first-light');state.levelComplete=true;finishRun();
  assert.equal(state.campaign.rewards.length,rewardCount,'Replay must not duplicate campaign rewards');
  assert.equal(state.stars,rewardStars,'Replay must not duplicate first-clear stars');
  assert.equal(new Set(state.campaign.rewards).size,state.campaign.rewards.length,'Campaign rewards must stay unique');
  state.campaign.rewards=firstRewards;
`,sandbox);
console.log('PASS: sequential Ember locks and duplicate-safe first-clear rewards');
vm.runInContext(`
  performance.now=()=>1000+state.elapsed*1000;
  for(const fps of [20,30,60,120])for(const feverAt of [6.9,12.8]){
    startRun('campaign','kindling');let activated=false,steps=0;
    const spawned=[],actualSpawn=spawnGate;
    spawnGate=()=>{const before=gates.length,ok=actualSpawn();if(ok)spawned.push({...gates[before]});return ok;};
    while(state.mode==='run'&&state.elapsed<60-1e-8){
      if(!activated&&state.elapsed>=feverAt-1e-8){
        for(let i=0;i<5;i++)resolveGate({gap:player.angle+.44,opening:1.2});
        assert.equal(state.fever,6);activated=true;
        const snapshot=planningSnapshot(),horizon=Math.max(0,...snapshot.constraints.map(g=>g.time));
        const route=findRoute(snapshot,horizon,horizon,undefined);
        assert.ok(route,'Existing gates remain reachable when fever starts');
        plannedTurns=route.turns.map(t=>t+state.elapsed);
      }
      while(plannedTurns.length&&plannedTurns[0]<=state.elapsed+1e-8){plannedTurns.shift();reverse();}
      const nextTurn=plannedTurns.length?plannedTurns[0]-state.elapsed:Infinity;
      const dt=Math.min(1/fps,1/60,nextTurn,activated?Infinity:feverAt-state.elapsed,60-state.elapsed);
      if(dt>1e-9)update(dt);
      assert.ok(++steps<20000,'Fever scenario must advance');
    }
    spawnGate=actualSpawn;
    if(state.runType==='campaign'&&state.mode==='awakening')update(1.51);
    assert.equal(state.mode,'results');assert.equal(state.levelComplete,true);
    assert.equal(state.shield,true,'Planned route must not rely on its shield');
    assert.equal(state.fever,0);assert.equal(campaignGateIndex,10);assert.equal(campaignFragmentIndex,6);assert.ok(state.runFragments>=3);
    assert.deepEqual(Array.from(spawned,(g,i)=>g.heat?i+1:null).filter(Boolean),[3,5,7,9]);
    for(const index of [3,5,7,9]){assert.equal(spawned[index].heat,false);assert.equal(spawned[index].sideOpening,false);assert.ok(spawned[index].opening>=1.75);}
    assert.ok(spawned.every(g=>!g.pair&&!g.guardian));
  }
`,sandbox);
console.log('PASS: complete Kindling routes with fever starting/expiring during heat pulses at all four frame rates');
vm.runInContext(`
  performance.now=()=>1000+state.elapsed*1000;
  const actualCrash=beginCrash;
  beginCrash=(cause)=>{if(state.mode==='run'&&!state.shield&&state.invulnerable<=0)console.log('Route collision',JSON.stringify({cause,time:state.elapsed,angle:player.angle,turns:plannedTurns,fever:state.fever,hazards:hazards.map(h=>({age:h.age,angle:h.angle,distance:angleDistance(h.angle,player.angle)})),gates:gates.filter(g=>!g.resolved).map(g=>({radius:g.radius,angle:g.gap,opening:g.opening}))}));actualCrash(cause);};
  const simulationResults=[];
  const routeFailures=[];
  state.campaign.completed.push('kindling','cinder-step','furnace-heart','solar-forge');
  const newEmberIds=['cinder-step','furnace-heart','solar-forge'];
  for(const fps of [20,30,60,120]) for(const level of [null,...campaignLevels]){
    const guardianRunsBefore=state.stats.guardians;
    let solarGuardianPair=false;
    const actualSpawn=spawnGate;
    spawnGate=()=>{const before=gates.length,ok=actualSpawn();if(ok&&level?.id==='solar-forge')solarGuardianPair ||= gates.slice(before).some(g=>g.guardian&&g.pair);return ok;};
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
      if(++frames>=fps*(duration+1)){routeFailures.push((level?.id||'endless')+'@'+fps+' FPS: simulation did not progress');break;}
    }
    if(level&&state.mode==='run')update(Math.max(1e-6,duration-state.elapsed));
    spawnGate=actualSpawn;
    if(state.mode==='crash')routeFailures.push((level?.id||'endless')+'@'+fps+' FPS: planned route collided at '+state.elapsed.toFixed(3));
    if(state.elapsed<duration-.01)routeFailures.push((level?.id||'endless')+'@'+fps+' FPS: planned route stopped at '+state.elapsed.toFixed(3)+' before '+duration);
    if(level){
      if(!state.levelComplete)routeFailures.push(level.id+'@'+fps+' FPS: campaign did not mark levelComplete');
      if(!['awakening','results'].includes(state.mode))routeFailures.push(level.id+'@'+fps+' FPS: campaign ended in '+state.mode+' instead of awakening/results');
      if(campaignFragmentIndex!==6)routeFailures.push(level.id+'@'+fps+' FPS: offered '+campaignFragmentIndex+'/6 fragments');
      if(state.runFragments<3)routeFailures.push(level.id+'@'+fps+' FPS: collected '+state.runFragments+'/3 required fragments');
      if(campaignHazardIndex!==level.hazardTimes.length)routeFailures.push(level.id+'@'+fps+' FPS: resolved '+campaignHazardIndex+'/'+level.hazardTimes.length+' hazards');
      if(campaignGateIndex!==level.gateTimes.length)routeFailures.push(level.id+'@'+fps+' FPS: scheduled '+campaignGateIndex+'/'+level.gateTimes.length+' gates');
      if(newEmberIds.includes(level.id)){
        if(gates.filter(g=>!g.resolved).length!==0)routeFailures.push(level.id+'@'+fps+' FPS: active gates remain at completion');
        if(state.gatesPassed<level.gateTimes.length)routeFailures.push(level.id+'@'+fps+' FPS: cleared '+state.gatesPassed+'/'+level.gateTimes.length+' scheduled gates');
      }
      if(level.id==='solar-forge'){
        if(!solarGuardianPair)routeFailures.push(level.id+'@'+fps+' FPS: no paired guardian gate spawned');
        if(state.stats.guardians!==guardianRunsBefore+1)routeFailures.push(level.id+'@'+fps+' FPS: guardian clears '+(state.stats.guardians-guardianRunsBefore)+'/1 before completion');
      }
    }
    if(level?.id==='kindling'){assert.equal(campaignGateIndex,10);assert.equal(state.gatesPassed,10,'All Kindling gates must clear before completion');}
    simulationResults.push({level:level?.id||'endless',fps,gates:state.gatesPassed,fragments:state.runFragments});
  }
  assert.equal(routeFailures.length,0,routeFailures.join('\\n'));
  console.log(JSON.stringify(simulationResults));
`,sandbox);
