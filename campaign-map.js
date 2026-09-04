import{createArchipelagoMap}from"./archipelago-map.js";

const mount=document.querySelector("#campaignMap"),screen=document.querySelector("#campaign");
const ready=createArchipelagoMap(mount,{pointerTarget:screen}).then(map=>{map.setActive(!screen.hidden);return map;});
window.OrbitArchipelago={
  ready,
  setCompleted:value=>ready.then(map=>map.setCompleted(value)),
  setRestoration:value=>ready.then(map=>map.setRestoration(value)),
  setEmberRestoration:value=>ready.then(map=>map.setEmberRestoration(value)),
  pulse:()=>ready.then(map=>map.pulse()),
  setActive:value=>ready.then(map=>map.setActive(value))
};
