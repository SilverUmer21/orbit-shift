import {Application,Assets,BlurFilter,Container,Graphics,Sprite} from "https://cdn.jsdelivr.net/npm/pixi.js@8.19.0/dist/pixi.min.mjs";

const mount=document.querySelector("#pixiMount"),frame=document.querySelector("#phoneFrame"),phone=document.querySelector("#phone");
const sizes={320:[320,568],390:[390,844],430:[430,932]};
const app=new Application();
await app.init({resizeTo:mount,background:"#07161c",antialias:true,resolution:Math.min(devicePixelRatio,2),autoDensity:true});
mount.appendChild(app.canvas);

const world=new Container(),backdrop=new Container({isRenderGroup:true}),bridges=new Container(),islands=new Container(),atmosphere=new Container();
world.addChild(backdrop,bridges,islands,atmosphere);app.stage.addChild(world);

const backdropTexture=await Assets.load("assets/archipelago/backdrop.svg");
const backdropArt=new Sprite(backdropTexture);backdropArt.anchor.set(.5);backdrop.addChild(backdropArt);
const bloomTexture=await Assets.load("assets/archipelago/bloom-island.svg");
const bloom=new Sprite(bloomTexture);bloom.anchor.set(.5);islands.addChild(bloom);
const emberTexture=await Assets.load("assets/archipelago/ember-island.svg");
const ember=new Sprite(emberTexture);ember.anchor.set(.5);ember.alpha=.68;islands.addChild(ember);
const voidTexture=await Assets.load("assets/archipelago/void-island.svg");
const voidIsland=new Sprite(voidTexture);voidIsland.anchor.set(.5);voidIsland.alpha=.64;islands.addChild(voidIsland);

const bridgeGlow=new Graphics(),bridgeCore=new Graphics();bridges.addChild(bridgeGlow,bridgeCore);bridgeGlow.filters=[new BlurFilter({strength:6,quality:3})];
const selectionRing=new Graphics();atmosphere.addChild(selectionRing);
const satellites=[];
for(let i=0;i<11;i+=1){
  const shard=new Graphics().poly([0,-7,5,1,0,8,-4,1]).fill({color:[0x79dcb7,0xf1ca63,0x9f92dc][i%3],alpha:.72});
  shard.orbit=i<4?0:i<8?1:2;shard.phase=i*1.73;atmosphere.addChild(shard);satellites.push(shard);
}
const motes=[];
for(let i=0;i<28;i+=1){const mote=new Graphics().circle(0,0,1+i%2).fill({color:i%3?0x75d8b4:0xf2c961,alpha:.45});mote.seed=i*7.13;atmosphere.addChild(mote);motes.push(mote);}

const stars=[];
for(let i=0;i<42;i+=1){
  const dot=new Graphics().circle(0,0,1+(i%3)*.45).fill({color:i%5?0x7ad8bd:0xf3cd67,alpha:.18+(i%4)*.08});
  dot.seed=i*2.37;backdrop.addChild(dot);stars.push(dot);
}

const pointer={x:0,y:0};
frame.addEventListener("pointermove",event=>{const rect=frame.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width-.5;pointer.y=(event.clientY-rect.top)/rect.height-.5;});
frame.addEventListener("pointerleave",()=>{pointer.x=0;pointer.y=0;});

function resize(){
  const [width,height]=sizes[phone.value];frame.style.setProperty("--w",`${width}px`);frame.style.setProperty("--h",`${height}px`);
  app.renderer.resize(width,height);layout(width,height);
}
function layout(width,height){
  backdropArt.position.set(width/2,height/2);backdropArt.width=width;backdropArt.height=height;
  const scale=Math.min(width/430,height/932);bloom.scale.set(scale*.86);bloom.baseX=width*.34;bloom.baseY=height*.26;
  ember.scale.set(scale*.72);ember.baseX=width*.68;ember.baseY=height*.52;
  voidIsland.scale.set(scale*.7);voidIsland.baseX=width*.34;voidIsland.baseY=height*.76;
  bridgeGlow.clear().moveTo(width*.36,height*.31).bezierCurveTo(width*.66,height*.34,width*.8,height*.4,width*.68,height*.48).bezierCurveTo(width*.52,height*.58,width*.2,height*.61,width*.34,height*.71).stroke({color:0x6fd6b3,width:9*scale,alpha:.2});
  bridgeCore.clear().moveTo(width*.36,height*.31).bezierCurveTo(width*.66,height*.34,width*.8,height*.4,width*.68,height*.48).bezierCurveTo(width*.52,height*.58,width*.2,height*.61,width*.34,height*.71).stroke({color:0xd9e7b4,width:2*scale,alpha:.55});
  selectionRing.clear().ellipse(0,0,92*scale,54*scale).stroke({color:0xf2cf63,width:2*scale,alpha:.7});selectionRing.position.set(bloom.baseX,bloom.baseY);
  motes.forEach((mote,index)=>{mote.baseX=(index*137%977)/977*width;mote.baseY=(index*211%971)/971*height;});
  stars.forEach((star,index)=>{star.position.set((index*83%997)/997*width,(index*137%991)/991*height);});
}
phone.addEventListener("change",resize);resize();

let elapsed=0;
app.ticker.add(ticker=>{
  elapsed+=ticker.deltaMS/1000;
  world.x+=(pointer.x*7-world.x)*.04;world.y+=(pointer.y*5-world.y)*.04;
  stars.forEach((star,index)=>{star.alpha=.28+Math.sin(elapsed*(.35+index%4*.08)+star.seed)*.16;});
  animateScene(elapsed,ticker.deltaTime);
});

function animateScene(time){
  bloom.position.set(bloom.baseX+Math.sin(time*.42)*3,bloom.baseY+Math.sin(time*.67)*5);bloom.rotation=Math.sin(time*.31)*.012;
  ember.position.set(ember.baseX+Math.sin(time*.36+2)*4,ember.baseY+Math.sin(time*.58+1)*4);ember.rotation=Math.sin(time*.28+2)*.014;
  voidIsland.position.set(voidIsland.baseX+Math.sin(time*.33+4)*3,voidIsland.baseY+Math.sin(time*.53+4)*5);voidIsland.rotation=Math.sin(time*.24+4)*.012;
  const centers=[[bloom.x,bloom.y,76],[ember.x,ember.y,57],[voidIsland.x,voidIsland.y,56]];
  satellites.forEach(shard=>{const center=centers[shard.orbit],angle=time*(.12+shard.orbit*.025)+shard.phase;shard.position.set(center[0]+Math.cos(angle)*center[2],center[1]+Math.sin(angle)*center[2]*.55);shard.rotation=angle+.5;});
  motes.forEach(mote=>{mote.x=mote.baseX+Math.sin(time*.22+mote.seed)*5;mote.y=(mote.baseY-time*(4+mote.seed%3)+app.screen.height)%app.screen.height;mote.alpha=.2+Math.sin(time*.7+mote.seed)*.14;});
  bridgeCore.alpha=.42+Math.sin(time*1.4)*.14;
  selectionRing.scale.set(1+Math.sin(time*1.8)*.035);selectionRing.alpha=.45+Math.sin(time*1.8)*.2;
}

document.querySelector(".level-bloom").addEventListener("click",()=>{document.querySelector("#labStatus").textContent="First Light selected - route ready for production integration.";selectionRing.scale.set(1.16);});
document.querySelector(".ascension").addEventListener("click",()=>{document.querySelector("#labStatus").textContent="Ascension remains the existing endless journey.";});

window.archipelagoLab={app,world,backdrop,bridges,islands,atmosphere,Assets,BlurFilter,Container,Graphics,Sprite,layout};
