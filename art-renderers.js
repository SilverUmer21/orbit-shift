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
