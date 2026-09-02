// This script runs only inside the isolated visual-test iframe.
function testScene(name,reduced) {
  startRun('campaign','crown-of-petals');state.reducedEffects=reduced;
  state.elapsed=name==='Guardian'?55:12;state.invulnerable=999;
  state.fever=name==='Fever'?6:0;state.feverCharge=3;state.multiplier=state.fever?5:1;
  resize();updateJourney(true);gates=[];hazards=[];fragments=[];
  spawnGate();gates[0].radius=orbitRadius+38;gates[0].generous=name!=='Guardian';
  spawnFragment();if(fragments[0]){fragments[0].radius=orbitRadius+12;fragments[0].angle=player.angle+.3;}
  burst(playerPoint(),currentCosmetic().gold,MAX_PARTICLES,100,'paper');
  if(name==='Chapter'){showScreen('bloomChapter');}
  if(name==='Garage'){showScreen('garage');}
  if(name==='Settings'){showScreen('settings');}
  if(name==='Results'){state.runFragments=6;state.perfects=3;state.levelComplete=true;finishRun();}
  state.paused=true;updateHud();
}
function profileDrawing() {
  const samples=[];
  for(let i=0;i<20;i++)draw();
  for(let i=0;i<120;i++){const start=performance.now();draw();samples.push(performance.now()-start);}
  samples.sort((a,b)=>a-b);
  return `Canvas CPU submission: median ${samples[60].toFixed(2)} ms, p95 ${samples[114].toFixed(2)} ms; ${particles.length} particles. This excludes GPU completion and is not a device FPS benchmark.`;
}
