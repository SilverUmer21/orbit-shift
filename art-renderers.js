(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const palettes = {
    bloom: { bg: "#07171b", deep: "#0d2d32", ink: "#143d3b", dark: "#266653", paper: "#55b897", mid: "#82d8a9", light: "#f0e8b8", accent: "#ef7069", gold: "#f0cb61" },
    ember: { bg: "#1a1017", deep: "#3c2029", ink: "#582c35", dark: "#873b3c", paper: "#bd514d", mid: "#ed7d60", light: "#f5d9a1", accent: "#63c9b4", gold: "#f2bd4e" },
    void: { bg: "#0d1020", deep: "#1a1d3d", ink: "#292c58", dark: "#403f86", paper: "#5d59ad", mid: "#907bca", light: "#ded5e3", accent: "#76dcc3", gold: "#e7c15f" },
  };

  function alpha(hex, opacity) {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${opacity})`;
  }

  function polygon(ctx, points, fill, shadow = null) {
    ctx.save();
    if (shadow) { ctx.shadowColor = shadow.color; ctx.shadowBlur = shadow.blur || 0; ctx.shadowOffsetX = shadow.x || 0; ctx.shadowOffsetY = shadow.y || 0; }
    ctx.fillStyle = fill; ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1]));
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function blob(ctx, x, y, radius, lobes, wobble, fill, rotation = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.fillStyle = fill; ctx.beginPath();
    for (let i = 0; i <= 40; i += 1) {
      const angle = i / 40 * TAU;
      const r = radius * (1 + Math.sin(angle * lobes + 1.2) * wobble + Math.sin(angle * (lobes + 3)) * wobble * .25);
      i ? ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function leaf(ctx, x, y, width, height, rotation, fill, vein) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.fillStyle = fill;
    ctx.beginPath(); ctx.moveTo(0, -height / 2); ctx.bezierCurveTo(width, -height * .24, width, height * .24, 0, height / 2); ctx.bezierCurveTo(-width, height * .24, -width, -height * .24, 0, -height / 2); ctx.fill();
    ctx.strokeStyle = vein; ctx.lineWidth = Math.max(1, width * .08); ctx.beginPath(); ctx.moveTo(0, -height * .34); ctx.lineTo(0, height * .34); ctx.stroke(); ctx.restore();
  }

  function crystal(ctx, x, y, size, fill, light, rotation = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    polygon(ctx, [[0,-size], [size*.68,-size*.12], [size*.45,size*.72], [0,size], [-size*.55,size*.55], [-size*.7,-size*.1]], fill, { color: "rgba(0,0,0,.28)", y: 4, blur: 4 });
    polygon(ctx, [[0,-size], [size*.68,-size*.12], [0,size*.12], [-size*.7,-size*.1]], light);
    ctx.restore();
  }

  function star(ctx, x, y, size, fill, rotation = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.fillStyle = fill; ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 ? size * .42 : size;
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      i ? ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius) : ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function paperGrain(ctx, width, height, color, opacity = .05) {
    ctx.save(); ctx.fillStyle = alpha(color, opacity);
    for (let y = 7; y < height; y += 17) for (let x = (y * 7 % 29) + 4; x < width; x += 23) ctx.fillRect(x, y, 1.1, .8);
    ctx.restore();
  }

  function prepare(canvas) {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || Number(canvas.getAttribute("width")) || 390;
    const height = canvas.clientHeight || Number(canvas.getAttribute("height")) || 720;
    if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
      canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
    }
    const ctx = canvas.getContext("2d"); ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx, width, height, ratio };
  }

  const mapRenderers = {};
  const planetRenderers = {};

  function mapBackdrop(ctx, width, height) {
    ctx.fillStyle = "#050d13"; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(230,227,179,.13)";
    for (let i = 0; i < 34; i += 1) {
      const x = (i * 83 % 337) / 337 * width, y = (i * 47 % 349) / 349 * height;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-1, -1, 2, 2); ctx.restore();
    }
    paperGrain(ctx, width, height, "#f0e8b8", .035);
  }

  function foldBridge(ctx, points, color, glow) {
    ctx.save(); ctx.strokeStyle = alpha(glow, .16); ctx.lineWidth = 15; ctx.lineJoin = "bevel"; ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1])); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.stroke();
    ctx.strokeStyle = alpha("#f0e8b8", .55); ctx.lineWidth = 1.4; ctx.stroke();
    for (let i = 1; i < points.length - 1; i += 1) crystal(ctx, points[i][0], points[i][1], 6, color, "#f0e8b8", Math.PI / 4);
    ctx.restore();
  }

  function floatingIsland(ctx, x, y, size, palette, emblem, time, locked = false) {
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha = locked ? .48 : 1;
    polygon(ctx, [[-size*.82,4],[-size*.55,size*.48],[-size*.28,size*.82],[0,size*1.12],[size*.24,size*.78],[size*.58,size*.45],[size*.84,2]], palette.deep, { color:"rgba(0,0,0,.48)",y:12,blur:16 });
    polygon(ctx, [[-size*.72,6],[-size*.28,size*.7],[0,size*1.05],[.03*size,8]], palette.ink);
    polygon(ctx, [[.03*size,8],[0,size*1.05],[size*.3,size*.7],[size*.75,4]], palette.dark);
    blob(ctx,0,0,size*.84,8,.07,palette.paper,time*.015);
    blob(ctx,-size*.07,-size*.05,size*.66,7,.08,palette.mid,-time*.01);
    ctx.strokeStyle=alpha(palette.light,.48);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-2,size*.58,size*.29,0,0,TAU);ctx.stroke();
    for(let i=0;i<7;i+=1){const angle=i*TAU/7+time*.08;leaf(ctx,Math.cos(angle)*size*.55,Math.sin(angle)*size*.24-3,size*.07,size*.22,angle+Math.PI/2,i%2?palette.dark:palette.accent,palette.light);}
    if(emblem==="star") star(ctx,0,-4,size*.24,palette.light,time*.12);
    else if(emblem==="crystal") crystal(ctx,0,-7,size*.23,palette.accent,palette.light,time*.08);
    else { ctx.fillStyle=palette.ink;ctx.beginPath();ctx.arc(0,-5,size*.22,0,TAU);ctx.fill();ctx.strokeStyle=palette.gold;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-5,size*.3,0,TAU);ctx.stroke();ctx.fillStyle=palette.light;ctx.beginPath();ctx.arc(0,-5,size*.07,0,TAU);ctx.fill(); }
    ctx.restore();
  }

  mapRenderers["verdant-stair"] = function (ctx,width,height,palette,time) {
    mapBackdrop(ctx,width,height);
    const b=palettes.bloom,e=palettes.ember,v=palettes.void;
    foldBridge(ctx,[[width*.35,height*.3],[width*.62,height*.39],[width*.45,height*.48],[width*.65,height*.58]],b.accent,b.light);
    foldBridge(ctx,[[width*.62,height*.59],[width*.39,height*.67],[width*.55,height*.75],[width*.38,height*.82]],v.accent,v.light);
    floatingIsland(ctx,width*.31,height*.23,Math.min(width*.19,68),b,"star",time,false);
    floatingIsland(ctx,width*.68,height*.5,Math.min(width*.2,72),e,"crystal",time,true);
    floatingIsland(ctx,width*.32,height*.77,Math.min(width*.19,68),v,"eye",time,true);
  };

  mapRenderers["orbit-archipelago"] = function (ctx,width,height,palette,time) {
    mapBackdrop(ctx,width,height); const b=palettes.bloom,e=palettes.ember,v=palettes.void;
    ctx.save();ctx.translate(width/2,height*.5);ctx.rotate(time*.025);ctx.strokeStyle=alpha(b.accent,.35);ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();ctx.ellipse(0,0,width*.36,height*.34,0,0,TAU);ctx.stroke();ctx.restore();
    floatingIsland(ctx,width*.5,height*.49,Math.min(width*.25,88),b,"star",time,false);
    floatingIsland(ctx,width*.23,height*.24,Math.min(width*.12,46),e,"crystal",time,true);
    floatingIsland(ctx,width*.76,height*.74,Math.min(width*.13,49),v,"eye",time,true);
    for(let i=0;i<7;i+=1){const a=time*.08+i*TAU/7;crystal(ctx,width*.5+Math.cos(a)*width*.38,height*.5+Math.sin(a)*height*.35,4+i%3,b.accent,b.light,a);}
  };

  mapRenderers["guardian-spires"] = function (ctx,width,height,palette,time) {
    mapBackdrop(ctx,width,height); const list=[palettes.bloom,palettes.ember,palettes.void];
    foldBridge(ctx,[[width*.5,height*.3],[width*.42,height*.38],[width*.58,height*.46],[width*.5,height*.54],[width*.42,height*.62],[width*.5,height*.7]],palettes.void.accent,palettes.bloom.light);
    [height*.2,height*.48,height*.76].forEach((y,index)=>{
      floatingIsland(ctx,width*.5,y,Math.min(width*.2,72),list[index],index===0?"star":index===1?"crystal":"eye",time,index>0);
      ctx.save();ctx.translate(width*.5,y-38);polygon(ctx,[[-13,22],[0,-22],[13,22]],list[index].light,{color:list[index].accent,blur:8});polygon(ctx,[[-6,18],[0,-14],[2,18]],list[index].accent);ctx.restore();
    });
  };

  function drawCampaignMap(canvas, rendererId, paletteId, time) {
    const frame = prepare(canvas); const palette = palettes[paletteId] || palettes.bloom;
    frame.ctx.clearRect(0, 0, frame.width, frame.height);
    (mapRenderers[rendererId] || mapRenderers["verdant-stair"] || (() => {}))(frame.ctx, frame.width, frame.height, palette, time);
  }

  function drawLivingPlanet(ctx, rendererId, options) {
    const palette = palettes[options.paletteId] || palettes.bloom;
    (planetRenderers[rendererId] || planetRenderers["bloom-crown"] || (() => {}))(ctx, options.x, options.y, options.radius, palette, options.time || 0, options);
  }

  function drawPlanetPreview(canvas, rendererId, paletteId, time) {
    const { ctx, width, height } = prepare(canvas); const palette = palettes[paletteId] || palettes.bloom;
    ctx.fillStyle = palette.bg; ctx.fillRect(0, 0, width, height); paperGrain(ctx, width, height, palette.light, .04);
    drawLivingPlanet(ctx, rendererId, { x: width / 2, y: height * .5, radius: Math.min(width * .25, height * .2), paletteId, time });
  }

  window.OrbitArt = { palettes, mapRenderers, planetRenderers, drawCampaignMap, drawLivingPlanet, drawPlanetPreview, helpers: { TAU, alpha, polygon, blob, leaf, crystal, star, paperGrain, prepare } };
}());
