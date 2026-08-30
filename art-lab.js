const palette=document.querySelector("#palette"),phone=document.querySelector("#phone");
for(const button of document.querySelectorAll("nav button"))button.addEventListener("click",()=>{document.querySelector("nav .active").classList.remove("active");button.classList.add("active");for(const gallery of document.querySelectorAll("main"))gallery.hidden=gallery.id!==button.dataset.tab;});
function sizeCanvases(){const heights={320:568,390:844,430:932};document.body.style.setProperty("--phone-width",`${phone.value}px`);document.body.style.setProperty("--phone-height",`${heights[phone.value]}px`);}
phone.addEventListener("change",sizeCanvases);sizeCanvases();
function frame(ms){const time=ms/1000;for(const canvas of document.querySelectorAll("canvas[data-map]"))OrbitArt.drawCampaignMap(canvas,canvas.dataset.map,palette.value,time);for(const canvas of document.querySelectorAll("canvas[data-planet]"))OrbitArt.drawPlanetPreview(canvas,canvas.dataset.planet,palette.value,time);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
