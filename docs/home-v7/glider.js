// Generated from game.js so the demos use the exact in-game glider art.
const TAU = Math.PI * 2;
const state = { reducedEffects: false };
function colorAlpha(hex, alpha) { const value = parseInt(hex.slice(1), 16); return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${alpha})`; }
function shadeColor(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  let r = value >> 16, g = value >> 8 & 255, b = value & 255;
  if (amount < 0) { const k = 1 + amount; r *= k; g *= k; b *= k; }
  else { r += (255 - r) * amount; g += (255 - g) * amount; b += (255 - b) * amount; }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function rgbToHex(rgb) { const [r, g, b] = rgb.match(/\d+/g).map(Number); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
function mixColor(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16), b = parseInt(hexB.slice(1), 16);
  const ch = (shift) => Math.round((a >> shift & 255) * (1 - t) + (b >> shift & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

// Upper-half facets [colorKey, shade, points]; the lower half mirrors them in a darker fold.
const gliderFacets = {
  manta: [
    ["light", 0, [[31,0],[5,-7],[-17,-24],[-20,-8],[-12,0]]],
    ["light", -.17, [[5,-7],[-17,-24],[-29,-18],[-20,-8]]],
    ["light", -.3, [[-12,0],[-20,-8],[-29,-18],[-20,0]]],
    ["accent", 0, [[-17,-24],[-29,-18],[-25,-13],[-15,-17]]],
    ["paper", 0, [[29,0],[2,-6],[-11,0]]],
    ["gold", 0, [[-20,-4],[-31,0],[-20,0]]],
  ],
  dart: [
    ["light", 0, [[32,0],[-17,-23],[-8,-5]]],
    ["light", -.2, [[32,0],[-8,-5],[-19,0]]],
    ["accent", 0, [[-8,-5],[-30,-10],[-19,0]]],
    ["paper", 0, [[25,0],[5,-4.5],[-8,0]]],
    ["accent", .1, [[-17,-23],[-7,-14],[-11,-18]]],
    ["gold", 0, [[-19,-3],[-31,0],[-19,0]]],
  ],
  crescent: [
    ["light", 0, [[31,0],[14,-4],[-4,-9.5],[-16,0]]],
    ["light", -.18, [[-4,-9.5],[-15,-17],[-25,-24],[-31,-14],[-30,-6],[-16,0]]],
    ["accent", 0, [[-15,-17],[-25,-24],[-31,-14],[-23,-13]]],
    ["paper", 0, [[28,0],[10,-3.5],[-8,0]]],
    ["gold", 0, [[-20,-3],[-32,0],[-20,0]]],
  ],
  splitwing: [
    ["light", 0, [[32,0],[-25,-22],[-8,-3]]],
    ["light", -.22, [[32,0],[-8,-3],[-2,0]]],
    ["accent", 0, [[-25,-22],[-15,-12],[-20,-6],[-24,-14]]],
    ["paper", 0, [[27,0],[-3,-2.8],[-16,0]]],
    ["gold", 0, [[-8,-3],[-28,0],[-8,0]]],
  ],
  shuttle: [
    ["light", 0, [[30,0],[12,-9],[-4,-10],[-6,0]]],
    ["light", -.16, [[12,-9],[-20,-17],[-28,-8],[-24,0],[-6,0],[-4,-10]]],
    ["accent", 0, [[-20,-17],[-28,-8],[-21,-9]]],
    ["paper", 0, [[24,0],[9,-5],[-3,0]]],
    ["gold", 0, [[-24,-4],[-32,0],[-24,0]]],
  ],
  ringsail: [
    ["light", 0, [[31,0],[5,-7],[-1,0]]],
    ["paper", 0, [[28,0],[6,-4.5],[0,0]]],
  ],
};

function gliderOutline(target, shape) {
  target.beginPath();
  if (shape === "manta") { target.moveTo(31,0); target.lineTo(5,-7); target.lineTo(-17,-24); target.lineTo(-29,-18); target.lineTo(-20,0); target.lineTo(-29,18); target.lineTo(-17,24); target.lineTo(5,7); }
  else if (shape === "dart") { target.moveTo(32,0); target.lineTo(-17,-23); target.lineTo(-8,-5); target.lineTo(-30,-10); target.lineTo(-19,0); target.lineTo(-30,10); target.lineTo(-8,5); target.lineTo(-17,23); }
  else if (shape === "crescent") { target.moveTo(31,0); target.quadraticCurveTo(-4,-7,-25,-24); target.quadraticCurveTo(-36,-5,-16,0); target.quadraticCurveTo(-36,5,-25,24); target.quadraticCurveTo(-4,7,31,0); }
  else if (shape === "splitwing") { target.moveTo(32,0); target.lineTo(-25,-22); target.lineTo(-8,-3); target.lineTo(-28,0); target.lineTo(-8,3); target.lineTo(-25,22); }
  else if (shape === "shuttle") { target.moveTo(30,0); target.lineTo(12,-9); target.lineTo(-20,-17); target.lineTo(-28,-8); target.lineTo(-24,0); target.lineTo(-28,8); target.lineTo(-20,17); target.lineTo(12,9); }
  else { target.moveTo(31,0); target.lineTo(5,-7); target.arc(-8,0,22,-.3,TAU+.3); target.lineTo(5,7); }
  target.closePath();
}

function drawGlider(target, rider, palette, scale = 1, time = 0, flip = 0, fever = false, glow = 0) {
  const wing = (fever ? 1.16 : 1) * (1 - flip * 0.14), shape = rider.shape;
  const ring = shape === "ringsail", soft = !state.reducedEffects;
  target.save(); target.scale(scale, scale * wing);
  // cast shadow, offset as if the glider floats above the page
  target.save(); target.translate(2, 6); target.fillStyle = "rgba(0,0,0,.34)";
  if (soft) { target.shadowColor = "rgba(0,0,0,.5)"; target.shadowBlur = 7; }
  gliderOutline(target, shape); target.fill(); target.restore();
  // engine flame: a folded gold/cyan tongue that breathes with time
  const flame = (fever ? 17 : 10) + Math.sin(time * 22) * 2 + glow * 4;
  const burn = target.createLinearGradient(-29, 0, -29 - flame, 0);
  burn.addColorStop(0, colorAlpha(palette.gold, .95)); burn.addColorStop(.55, colorAlpha(palette.accent, .55)); burn.addColorStop(1, colorAlpha(palette.accent, 0));
  target.fillStyle = burn; target.beginPath(); target.moveTo(-26, -4.5); target.lineTo(-29 - flame, 0); target.lineTo(-26, 4.5); target.closePath(); target.fill();
  // cut edge
  target.fillStyle = palette.ink; target.strokeStyle = palette.ink; target.lineJoin = "round"; target.lineWidth = 2.6;
  if (ring) { target.beginPath(); target.arc(-8, 0, 22.5, 0, TAU); target.arc(-8, 0, 12.5, 0, TAU, true); target.fill("evenodd"); gliderOutline(target, shape); target.stroke(); }
  else { gliderOutline(target, shape); target.fill(); target.stroke(); }
  const facet = (points, color, shade, mirror) => {
    target.save(); if (mirror) target.scale(1, -1);
    const base = palette[color] || color;
    target.fillStyle = mirror ? mixColor(rgbToHex(shadeColor(base, shade)), palette.ink, .34) : shadeColor(base, shade); target.beginPath();
    points.forEach((point, index) => index ? target.lineTo(point[0], point[1]) : target.moveTo(point[0], point[1]));
    target.closePath(); target.fill();
    target.strokeStyle = `rgba(255,250,224,${mirror ? .16 : .42})`; target.lineWidth = .7; target.stroke(); target.restore();
  };
  if (ring) {
    for (let i = 0; i < 8; i += 1) {
      const a0 = i * Math.PI / 4 + .06, a1 = (i + 1) * Math.PI / 4 + .06, upper = Math.sin((a0 + a1) / 2) < 0;
      target.fillStyle = shadeColor(palette.light, (i % 2 ? -.2 : -.02) + (upper ? .08 : -.12));
      target.beginPath(); target.arc(-8, 0, 21.5, a0, a1); target.arc(-8, 0, 13.5, a1, a0, true); target.closePath(); target.fill();
      target.strokeStyle = "rgba(255,250,224,.3)"; target.lineWidth = .7; target.stroke();
    }
    target.strokeStyle = colorAlpha(palette.accent, .9); target.lineWidth = 2.2; target.beginPath(); target.arc(-8, 0, 17.5, -2.4, -.7); target.stroke();
    target.fillStyle = palette.gold; target.beginPath(); target.moveTo(-26, -3); target.lineTo(-31, 0); target.lineTo(-26, 3); target.closePath(); target.fill();
  }
  for (const [color, shade, points] of gliderFacets[shape] || gliderFacets.manta) { facet(points, color, shade, true); }
  for (const [color, shade, points] of gliderFacets[shape] || gliderFacets.manta) { facet(points, color, shade, false); }
  // spine crease
  target.strokeStyle = "rgba(6,19,25,.3)"; target.lineWidth = .8; target.beginPath(); target.moveTo(27, 0); target.lineTo(-18, 0); target.stroke();
  // canopy glint
  target.fillStyle = "rgba(255,250,224,.55)"; target.beginPath(); target.moveTo(21, -.6); target.lineTo(8, -3.4); target.lineTo(10, -1.2); target.closePath(); target.fill();
  if (glow || fever) {
    target.globalAlpha = .4 + glow * .35 + Math.sin(time * 9) * .1; target.strokeStyle = palette.gold; target.lineWidth = 2 + glow * 2;
    if (soft) { target.shadowColor = palette.gold; target.shadowBlur = 12; }
    gliderOutline(target, shape); target.stroke();
  }
  target.restore();
}

