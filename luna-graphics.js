(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const canvas = document.querySelector("#heroCanvas");
  const ctx = canvas.getContext("2d");
  const palette = window.OrbitArt?.palettes?.bloom || {
    bg: "#07171b", deep: "#0d2d32", ink: "#143d3b", paper: "#55b897",
    mid: "#82d8a9", light: "#f0e8b8", accent: "#ef7069", gold: "#f0cb61",
  };

  const planes = {
    manta: {
      id: "manta", title: "Manta", role: "Baseline", short: "Read the route",
      description: "The clean reference plane. No trick, no rescue—just read the opening and turn.",
    },
    crescent: {
      id: "crescent", title: "Crescent", role: "Recovery", short: "Hold a soft turn",
      description: "A tap eases through a short paper drift. Late corrections feel possible, but perfect chains demand patience.",
    },
    splitwing: {
      id: "splitwing", title: "Splitwing", role: "Rhythm", short: "Catch the echo",
      description: "A perfect pass leaves an afterimage. Reverse again while it lives and the orbit answers back.",
    },
  };

  const demo = {
    planeId: "manta", angle: -Math.PI / 2, direction: 1, time: 0,
    lastFrame: performance.now(), pulse: 0, drift: 0, echo: 0, echoAngle: 0,
    readout: "steady orbit", readoutTime: 0,
  };

  function alpha(hex, opacity) {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${opacity})`;
  }

  function drawPlane(target, shape, scale, time, options = {}) {
    const fever = options.fever || false;
    const pulse = options.pulse || 0;
    target.save();
    target.scale(scale, scale * (1 + pulse * .04));
    target.fillStyle = "rgba(0,0,0,.34)";
    target.beginPath(); target.ellipse(-2, 4, 30, 17, 0, 0, TAU); target.fill();

    const path = () => {
      target.beginPath();
      if (shape === "manta") {
        target.moveTo(31, 0); target.lineTo(5, -7); target.lineTo(-17, -24); target.lineTo(-29, -18);
        target.lineTo(-20, 0); target.lineTo(-29, 18); target.lineTo(-17, 24); target.lineTo(5, 7);
      } else if (shape === "crescent") {
        target.moveTo(31, 0); target.quadraticCurveTo(-4, -7, -25, -24); target.quadraticCurveTo(-36, -5, -16, 0);
        target.quadraticCurveTo(-36, 5, -25, 24); target.quadraticCurveTo(-4, 7, 31, 0);
      } else {
        target.moveTo(32, 0); target.lineTo(-25, -22); target.lineTo(-8, -3); target.lineTo(-28, 0);
        target.lineTo(-8, 3); target.lineTo(-25, 22);
      }
      target.closePath();
    };

    if (shape === "crescent" && options.drift) {
      target.save(); target.globalAlpha = .34 * options.drift; target.strokeStyle = palette.mid; target.lineWidth = 3;
      target.beginPath(); target.arc(-17, 0, 32, -.85, .85); target.stroke(); target.restore();
    }

    target.fillStyle = palette.ink; path(); target.fill();
    target.save(); target.scale(.91, .82); target.fillStyle = palette.light; path(); target.fill(); target.restore();
    target.fillStyle = palette.paper; target.beginPath(); target.moveTo(29, 0); target.lineTo(2, -7); target.lineTo(-12, 0); target.lineTo(2, 7); target.closePath(); target.fill();
    target.fillStyle = palette.accent; target.beginPath(); target.moveTo(14, 0); target.lineTo(-8, -5); target.lineTo(-17, 0); target.lineTo(-8, 5); target.closePath(); target.fill();
    target.fillStyle = palette.gold; target.beginPath(); target.moveTo(-20, -5); target.lineTo(-31 - (fever ? 7 : 0), 0); target.lineTo(-20, 5); target.closePath(); target.fill();
    if (fever) { target.globalAlpha = .5 + Math.sin(time * 9) * .08; target.strokeStyle = palette.gold; target.lineWidth = 2; path(); target.stroke(); }
    target.restore();
  }

  function drawStars(target, width, height, time) {
    target.save(); target.fillStyle = alpha(palette.light, .46);
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 83 % 337) / 337 * width;
      const y = (i * 47 % 349) / 349 * height;
      const size = 1 + (i % 3) * .45;
      target.globalAlpha = .18 + Math.sin(time * .8 + i) * .08;
      target.fillRect(x, y, size, size);
    }
    target.restore();
  }

  function drawGate(target, cx, cy, radius, gap, rotation, opacity = 1) {
    target.save(); target.translate(cx, cy); target.rotate(rotation); target.strokeStyle = alpha(palette.mid, .72 * opacity); target.lineWidth = 5;
    target.beginPath(); target.arc(0, 0, radius, gap + .36, gap + TAU - .36); target.stroke();
    target.strokeStyle = alpha(palette.light, .5 * opacity); target.lineWidth = 1.2;
    target.beginPath(); target.arc(0, 0, radius, gap + .36, gap + TAU - .36); target.stroke();
    target.restore();
  }

  function drawHero(time) {
    const frame = window.OrbitArt?.helpers?.prepare(canvas) || { ctx, width: 390, height: 430 };
    const target = frame.ctx; const width = frame.width || 390; const height = frame.height || 430;
    const centerX = width / 2; const centerY = height * .57; const orbit = Math.min(width * .37, 145); const planet = Math.min(width * .19, 72);
    target.clearRect(0, 0, width, height); target.fillStyle = palette.bg; target.fillRect(0, 0, width, height); drawStars(target, width, height, time);
    if (window.OrbitArt) window.OrbitArt.drawLivingPlanet(target, "bloom-crown", { x: centerX, y: centerY, radius: planet, paletteId: "bloom", time });
    target.save(); target.strokeStyle = alpha(palette.light, .17); target.lineWidth = 1.2; target.setLineDash([2, 8]); target.beginPath(); target.arc(centerX, centerY, orbit, 0, TAU); target.stroke(); target.restore();
    drawGate(target, centerX, centerY, orbit, -1.2, time * .08, .78);
    drawGate(target, centerX, centerY, orbit, 1.65, -time * .12 + .2, .46);

    const x = centerX + Math.cos(demo.angle) * orbit; const y = centerY + Math.sin(demo.angle) * orbit;
    if (demo.planeId === "splitwing" && demo.echo > 0) {
      target.save(); target.translate(centerX + Math.cos(demo.echoAngle) * orbit, centerY + Math.sin(demo.echoAngle) * orbit);
      target.globalAlpha = demo.echo * .34; drawPlane(target, "splitwing", .55, time, { pulse: demo.pulse }); target.restore();
    }
    target.save(); target.translate(x, y); target.rotate(demo.angle + demo.direction * Math.PI / 2); drawPlane(target, demo.planeId, .72, time, { pulse: demo.pulse, drift: demo.drift, fever: demo.planeId === "splitwing" && demo.echo > .55 }); target.restore();
    target.save(); target.fillStyle = alpha(palette.gold, .72); target.font = "900 10px Arial"; target.textAlign = "center"; target.fillText("TAP ANYWHERE TO REVERSE", centerX, height - 18); target.restore();
  }

  function drawCardPreview(cardCanvas, planeId) {
    const frame = window.OrbitArt?.helpers?.prepare(cardCanvas) || { ctx: cardCanvas.getContext("2d"), width: 150, height: 92 };
    const target = frame.ctx; const width = frame.width || 150; const height = frame.height || 92;
    target.clearRect(0, 0, width, height); target.fillStyle = alpha(palette.deep, .42); target.fillRect(0, 0, width, height);
    target.save(); target.translate(width / 2, height / 2 + 4); target.rotate(-.1); drawPlane(target, planeId, .62, 0, { drift: planeId === "crescent" ? 1 : 0, pulse: planeId === "splitwing" ? 1 : 0 }); target.restore();
    if (planeId === "splitwing") { target.save(); target.globalAlpha = .18; target.translate(width / 2 - 30, height / 2 + 4); target.rotate(-.1); drawPlane(target, planeId, .42, 0, {}); target.restore(); }
  }

  function renderCards() {
    document.querySelectorAll(".plane-card").forEach((card) => drawCardPreview(card.querySelector("canvas"), card.dataset.plane));
  }

  function renderText() {
    const plane = planes[demo.planeId];
    document.querySelector("#planeRole").textContent = plane.role;
    document.querySelector("#planeTitle").textContent = plane.title;
    document.querySelector("#planeDescription").textContent = plane.description;
    document.querySelector("#behaviorReadout").textContent = demo.readout;
    document.querySelector("#stageHint").textContent = demo.planeId === "manta" ? "Tap the orbit to reverse" : `Tap to test ${plane.title}`;
  }

  function setReadout(text, duration = 0) {
    demo.readout = text; demo.readoutTime = duration; renderText();
  }

  function selectPlane(planeId) {
    if (!planes[planeId]) return;
    demo.planeId = planeId; demo.echo = 0; demo.drift = 0; demo.pulse = .4;
    document.querySelectorAll(".plane-card").forEach((card) => card.classList.toggle("selected", card.dataset.plane === planeId));
    setReadout(planeId === "manta" ? "steady orbit" : planeId === "crescent" ? "soft turn ready" : "echo waiting");
  }

  function reverse() {
    demo.direction *= -1; demo.pulse = 1;
    if (demo.planeId === "manta") setReadout("reversal committed", .5);
    if (demo.planeId === "crescent") { demo.drift = 1; setReadout("drift in motion", .8); }
    if (demo.planeId === "splitwing") { demo.echo = 1; demo.echoAngle = demo.angle - demo.direction * .62; setReadout("echo released", 1.2); }
  }

  document.querySelectorAll(".plane-card").forEach((card) => card.addEventListener("click", () => selectPlane(card.dataset.plane)));
  canvas.addEventListener("pointerdown", reverse);
  window.addEventListener("keydown", (event) => {
    if (["Space", "ArrowUp", "Enter"].includes(event.code)) { event.preventDefault(); reverse(); }
  });

  function loop(now) {
    const delta = Math.min(.04, (now - demo.lastFrame) / 1000); demo.lastFrame = now; demo.time += delta;
    demo.angle += demo.direction * delta * 1.42; demo.pulse = Math.max(0, demo.pulse - delta * 3.8); demo.drift = Math.max(0, demo.drift - delta * 1.8); demo.echo = Math.max(0, demo.echo - delta * .55);
    demo.readoutTime = Math.max(0, demo.readoutTime - delta);
    if (!demo.readoutTime && demo.readout !== (demo.planeId === "manta" ? "steady orbit" : demo.planeId === "crescent" ? "soft turn ready" : "echo waiting")) setReadout(demo.planeId === "manta" ? "steady orbit" : demo.planeId === "crescent" ? "soft turn ready" : demo.echo > 0 ? "echo waiting" : "echo expired");
    drawHero(demo.time); requestAnimationFrame(loop);
  }

  renderCards(); renderText(); requestAnimationFrame(loop);
  window.LunaGraphics = { planes, demo, drawPlane };
}());
