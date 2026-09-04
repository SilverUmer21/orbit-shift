// This script runs only inside the isolated visual-test iframe.
function testScene(name,reduced) {
  if(name==='Tutorial'){state.reducedEffects=reduced;startTutorial();return;}
  state.campaign.unlockedLevel=4;
  for(const id of ['crown-of-petals','kindling','cinder-step','furnace-heart'])if(!state.campaign.completed.includes(id))state.campaign.completed.push(id);
  const levels={Cinder:'cinder-step',Furnace:'furnace-heart',Solar:'solar-forge'};
  const ember=['Kindling play','Kindling','Heat warning','Ember chapter','Kindling results','Awakening Ember','Map',...Object.keys(levels)].includes(name);
  startRun('campaign',levels[name]||(ember?'kindling':'crown-of-petals'));state.reducedEffects=reduced;
  if(name==='Kindling play')return;
  state.elapsed=name==='Guardian'?55:name==='Solar'?60:12;state.invulnerable=999;
  state.fever=name==='Fever'?6:0;state.feverCharge=3;state.multiplier=state.fever?5:1;
  resize();updateJourney(true);gates=[];hazards=[];fragments=[];
  if(ember)gateCount=name==='Cinder'?3:name==='Furnace'?4:name==='Solar'?11:2;
  spawnGate();gates[0].radius=orbitRadius+(name==='Heat warning'?85:38);gates[0].age=name==='Heat warning'?.9:2;gates[0].generous=name!=='Guardian';
  spawnFragment();if(fragments[0]){fragments[0].radius=orbitRadius+12;fragments[0].angle=player.angle+.3;}
  burst(playerPoint(),currentCosmetic().gold,MAX_PARTICLES,100,'paper');
  if(name==='Chapter'){openChapter('bloom');}
  if(name==='Ember chapter'){openChapter('ember');}
  if(name==='Map'){showScreen('campaign');}
  if(name==='Garage'){showScreen('garage');}
  if(name==='Settings'){showScreen('settings');}
  if(name==='Results'||name==='Kindling results'||name==='Rewards'){
    if(name==='Rewards'){state.campaign.completed=state.campaign.completed.filter(id=>id!==state.levelId);state.campaign.rewards=state.campaign.rewards.filter(id=>id!=='bloom-wake');state.unlockedTrails=state.unlockedTrails.filter(id=>id!=='bloom-wake');state.unlocked=state.unlocked.filter(id=>id!=='ember');state.score=300;}
    state.runFragments=6;state.perfects=3;state.levelComplete=true;finishRun();if(name==='Rewards'){state.paused=false;return;}
  }
  if(name==='Awakening Bloom'||name==='Awakening Ember'){
    if(name==='Awakening Bloom')state.campaign.completed=state.campaign.completed.filter(id=>id!=='crown-of-petals');
    hazards=[{angle:player.angle+.7,phase:0},{angle:player.angle-.8,phase:1.2}];state.runFragments=6;state.perfects=3;state.levelComplete=true;beginAwakening();awakening.life=.75;
  }
  state.paused=true;updateHud();
}
function profileDrawing() {
  const samples=[];
  for(let i=0;i<20;i++)draw();
  for(let i=0;i<120;i++){const start=performance.now();draw();samples.push(performance.now()-start);}
  samples.sort((a,b)=>a-b);
  return `Canvas CPU submission: median ${samples[60].toFixed(2)} ms, p95 ${samples[114].toFixed(2)} ms; ${particles.length} particles. This excludes GPU completion and is not a device FPS benchmark.`;
}
