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
  requestAnimationFrame(()=>layout(app.screen.width,app.screen.height));
}
function layout(width,height){
  backdropArt.position.set(width/2,height/2);backdropArt.width=width;backdropArt.height=height;
  const scale=Math.min(width/430,height/932);bloom.scale.set(scale*.86);bloom.baseX=width*.34;bloom.baseY=height*.26;
  ember.scale.set(scale*.72);ember.baseX=width*.68;ember.baseY=height*.52;
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
}

window.archipelagoLab={app,world,backdrop,bridges,islands,atmosphere,Assets,BlurFilter,Container,Graphics,Sprite,layout};
