import {Application,Assets,BlurFilter,Container,Graphics,Sprite} from "./vendor/pixi.min.mjs";

const asset=name=>new URL(`assets/archipelago/${name}`,import.meta.url).href;

export async function createArchipelagoMap(mount,{pointerTarget=mount,completed=false}={}){
  const app=new Application();
  await app.init({background:"#07161c",antialias:true,resolution:Math.min(devicePixelRatio,2),autoDensity:true});
  mount.appendChild(app.canvas);
  const world=new Container(),backdrop=new Container({isRenderGroup:true}),bridges=new Container(),islands=new Container(),atmosphere=new Container();
  world.addChild(backdrop,bridges,islands,atmosphere);app.stage.addChild(world);
  const [backdropTexture,bloomTexture,emberTexture,voidTexture]=await Promise.all([Assets.load(asset("backdrop.svg")),Assets.load(asset("bloom-island.svg")),Assets.load(asset("ember-island.svg")),Assets.load(asset("void-island.svg"))]);
  const backdropArt=new Sprite(backdropTexture);backdropArt.anchor.set(.5);backdrop.addChild(backdropArt);
  const bloom=new Sprite(bloomTexture);bloom.anchor.set(.5);islands.addChild(bloom);
  const ember=new Sprite(emberTexture);ember.anchor.set(.5);islands.addChild(ember);
  const voidIsland=new Sprite(voidTexture);voidIsland.anchor.set(.5);islands.addChild(voidIsland);
  const bridgeGlow=new Graphics(),bridgeCore=new Graphics();bridges.addChild(bridgeGlow,bridgeCore);bridgeGlow.filters=[new BlurFilter({strength:6,quality:3})];
  const selectionRingBack=new Graphics(),selectionRingFront=new Graphics(),selectionRings=[selectionRingBack,selectionRingFront];bridges.addChild(selectionRingBack);atmosphere.addChild(selectionRingFront);
  const restorationArt=new Graphics();atmosphere.addChild(restorationArt);let restorationStage=0;
  const satellites=[];
  for(let i=0;i<11;i+=1){const shard=new Graphics().poly([0,-7,5,1,0,8,-4,1]).fill({color:[0x79dcb7,0xf1ca63,0x9f92dc][i%3],alpha:.72});shard.orbit=i<4?0:i<8?1:2;shard.phase=i*1.73;atmosphere.addChild(shard);satellites.push(shard);}
  const motes=[];
  for(let i=0;i<28;i+=1){const mote=new Graphics().circle(0,0,1+i%2).fill({color:i%3?0x75d8b4:0xf2c961,alpha:.45});mote.seed=i*7.13;atmosphere.addChild(mote);motes.push(mote);}
  const stars=[];
  for(let i=0;i<42;i+=1){const dot=new Graphics().circle(0,0,1+(i%3)*.45).fill({color:i%5?0x7ad8bd:0xf3cd67,alpha:.18+(i%4)*.08});dot.seed=i*2.37;backdrop.addChild(dot);stars.push(dot);}
  const pointer={x:0,y:0};
  const move=event=>{const rect=pointerTarget.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width-.5;pointer.y=(event.clientY-rect.top)/rect.height-.5;};
  const leave=()=>{pointer.x=0;pointer.y=0;};pointerTarget.addEventListener("pointermove",move);pointerTarget.addEventListener("pointerleave",leave);
  function setRestoration(stage=0){restorationStage=Math.max(0,Math.min(4,Number(stage)||0));completed=restorationStage>0;ember.alpha=completed?.88:.58;voidIsland.alpha=restorationStage>=4?.76:completed?.68:.5;bridgeCore.tint=completed?0xf2cf63:0xffffff;if(app.screen.width)drawRestoration(app.screen.width,app.screen.height);}
  function setCompleted(value){setRestoration(value?Math.max(1,restorationStage):0);}
  function drawRestoration(width,height){
    restorationArt.clear();if(!restorationStage)return;
    const scale=Math.min(width/430,height/844),x=width*.34,y=height*.23;
    for(let i=0;i<restorationStage*4;i+=1){const angle=i*2.399+.3,r=(62+(i%3)*9)*scale,px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r*.62;restorationArt.ellipse(px,py,8*scale,3.5*scale).fill({color:i%3?0x79dcb7:0xf1ca63,alpha:.48+.08*restorationStage});}
    if(restorationStage>=4){const points=[];for(let i=0;i<6;i+=1){const angle=-1.75+i*.67;points.push([x+Math.cos(angle)*112*scale,y+Math.sin(angle)*82*scale]);}restorationArt.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(point=>restorationArt.lineTo(point[0],point[1]));restorationArt.stroke({color:0xf2cf63,width:1.5*scale,alpha:.62});points.forEach(point=>restorationArt.poly([point[0],point[1]-5*scale,point[0]+4*scale,point[1],point[0],point[1]+5*scale,point[0]-4*scale,point[1]]).fill({color:0xf2cf63,alpha:.8}));}
  }
  function resize(width=mount.clientWidth,height=mount.clientHeight){if(!width||!height)return;app.renderer.resize(width,height);layout(width,height);}
  function layout(width,height){
    backdropArt.position.set(width/2,height/2);backdropArt.width=width;backdropArt.height=height;
    const scale=Math.min(width/430,height/844);bloom.scale.set(scale*.86);bloom.baseX=width*.34;bloom.baseY=height*.23;ember.scale.set(scale*.72);ember.baseX=width*.68;ember.baseY=height*.5;voidIsland.scale.set(scale*.7);voidIsland.baseX=width*.34;voidIsland.baseY=height*.74;
    bridgeGlow.clear().moveTo(width*.36,height*.28).bezierCurveTo(width*.66,height*.31,width*.8,height*.38,width*.68,height*.46).bezierCurveTo(width*.52,height*.56,width*.2,height*.59,width*.34,height*.69).stroke({color:0x6fd6b3,width:9*scale,alpha:.2});
    bridgeCore.clear().moveTo(width*.36,height*.28).bezierCurveTo(width*.66,height*.31,width*.8,height*.38,width*.68,height*.46).bezierCurveTo(width*.52,height*.56,width*.2,height*.59,width*.34,height*.69).stroke({color:0xd9e7b4,width:2*scale,alpha:.55});
    const rx=92*scale,ry=54*scale,k=.5522848;
    selectionRingBack.clear().moveTo(-rx,0).bezierCurveTo(-rx,-k*ry,-k*rx,-ry,0,-ry).bezierCurveTo(k*rx,-ry,rx,-k*ry,rx,0).stroke({color:0xf2cf63,width:2*scale,alpha:.7});
    selectionRingFront.clear().moveTo(rx,0).bezierCurveTo(rx,k*ry,k*rx,ry,0,ry).bezierCurveTo(-k*rx,ry,-rx,k*ry,-rx,0).stroke({color:0xf2cf63,width:2*scale,alpha:.7});
    selectionRings.forEach(ring=>ring.position.set(bloom.baseX,bloom.baseY));
    drawRestoration(width,height);
    motes.forEach((mote,index)=>{mote.baseX=(index*137%977)/977*width;mote.baseY=(index*211%971)/971*height;});stars.forEach((star,index)=>star.position.set((index*83%997)/997*width,(index*137%991)/991*height));
  }
  let elapsed=0;
  app.ticker.add(ticker=>{elapsed+=ticker.deltaMS/1000;world.x+=(pointer.x*7-world.x)*.04;world.y+=(pointer.y*5-world.y)*.04;stars.forEach((star,index)=>{star.alpha=.28+Math.sin(elapsed*(.35+index%4*.08)+star.seed)*.16;});bloom.position.set(bloom.baseX+Math.sin(elapsed*.42)*3,bloom.baseY+Math.sin(elapsed*.67)*5);bloom.rotation=Math.sin(elapsed*.31)*.012;ember.position.set(ember.baseX+Math.sin(elapsed*.36+2)*4,ember.baseY+Math.sin(elapsed*.58+1)*4);ember.rotation=Math.sin(elapsed*.28+2)*.014;voidIsland.position.set(voidIsland.baseX+Math.sin(elapsed*.33+4)*3,voidIsland.baseY+Math.sin(elapsed*.53+4)*5);voidIsland.rotation=Math.sin(elapsed*.24+4)*.012;const centers=[[bloom.x,bloom.y,76],[ember.x,ember.y,57],[voidIsland.x,voidIsland.y,56]];satellites.forEach(shard=>{const center=centers[shard.orbit],angle=elapsed*(.12+shard.orbit*.025)+shard.phase;shard.position.set(center[0]+Math.cos(angle)*center[2],center[1]+Math.sin(angle)*center[2]*.55);shard.rotation=angle+.5;});motes.forEach(mote=>{mote.x=mote.baseX+Math.sin(elapsed*.22+mote.seed)*5;mote.y=(mote.baseY-elapsed*(4+mote.seed%3)+app.screen.height)%app.screen.height;mote.alpha=.2+Math.sin(elapsed*.7+mote.seed)*.14;});bridgeCore.alpha=.42+Math.sin(elapsed*1.4)*.14;restorationArt.alpha=.72+Math.sin(elapsed*1.3)*.2;const ringScale=1+Math.sin(elapsed*1.8)*.035,ringAlpha=.45+Math.sin(elapsed*1.8)*.2;selectionRings.forEach(ring=>{ring.scale.set(ringScale);ring.alpha=ringAlpha;});});
  const observer=new ResizeObserver(()=>resize());observer.observe(mount);resize();setRestoration(completed?1:0);
  return{app,resize,setCompleted,setRestoration,pulse(){selectionRings.forEach(ring=>ring.scale.set(1.16));},setActive(active){active?app.ticker.start():app.ticker.stop();},destroy(){observer.disconnect();pointerTarget.removeEventListener("pointermove",move);pointerTarget.removeEventListener("pointerleave",leave);app.destroy(true);}};
}
