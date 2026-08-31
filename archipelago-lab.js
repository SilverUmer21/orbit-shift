import{createArchipelagoMap}from"./archipelago-map.js";

const mount=document.querySelector("#pixiMount"),frame=document.querySelector("#phoneFrame"),phone=document.querySelector("#phone"),sizes={320:[320,568],390:[390,844],430:[430,932]};
const map=await createArchipelagoMap(mount,{pointerTarget:frame});
function resize(){const[width,height]=sizes[phone.value];frame.style.setProperty("--w",`${width}px`);frame.style.setProperty("--h",`${height}px`);map.resize(width,height);}
phone.addEventListener("change",resize);resize();
document.querySelector(".level-bloom").addEventListener("click",()=>{document.querySelector("#labStatus").textContent="First Light selected - route ready for production integration.";map.pulse();});
document.querySelector(".ascension").addEventListener("click",()=>{document.querySelector("#labStatus").textContent="Ascension remains the existing endless journey.";});
