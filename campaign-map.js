// PixiJS (~800 KB) is only needed for the island map, so it loads after startup: when the browser is idle, when the
// player reaches for the Islands button, or on the first map call, whichever comes first.
const mount=document.querySelector("#campaignMap"),screen=document.querySelector("#campaign");
let ready=null;
function load(){
  ready||=import("./archipelago-map.js").then(({createArchipelagoMap})=>createArchipelagoMap(mount,{pointerTarget:screen})).then(map=>{map.setActive(!screen.hidden);return map;});
  return ready;
}
const when=fn=>load().then(fn);
window.OrbitArchipelago={
  get ready(){return load();},
  setCompleted:value=>when(map=>map.setCompleted(value)),
  setRestoration:value=>when(map=>map.setRestoration(value)),
  setEmberRestoration:value=>when(map=>map.setEmberRestoration(value)),
  pulse:()=>when(map=>map.pulse()),
  // Stopping a map that was never loaded needs no download.
  setActive:value=>value||ready?when(map=>map.setActive(value)):Promise.resolve()
};
document.querySelector("#openIslands")?.addEventListener("pointerdown",load,{once:true});
addEventListener("load",()=>("requestIdleCallback" in window?requestIdleCallback(load,{timeout:3000}):setTimeout(load,1500)),{once:true});
