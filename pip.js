// Pip, the paper-moth courier of the Night Post. A detailed SVG rig plus a small procedural state machine:
// an always-alive base (hover, breathing, wing flutter, blinks, springy antennae, waving scarf) with idle
// variations every few seconds and reactions (enter, tap, letter ready, doze). The host calls tick(dt) each frame.
(function () {
  const TAU = Math.PI * 2;
  const ink = "#3A1E14", paper = "#FFF4DC", fold = "#E9D6B0", mint = "#A8F0CF", mintMid = "#5ED6A6", mintDark = "#2E9C80",
    gold = "#FFC94D", goldShade = "#E0A93A", coral = "#FF6F61", coralShade = "#E0574A", night = "#12363D", nightMid = "#1A4A50";
  const mirror = path => path.replace(/(-?\d+(?:\.\d+)?)(\s+)(-?\d+(?:\.\d+)?)/g, (_, x, gap, y) => `${(160 - Number(x)).toFixed(1)}${gap}${y}`);
  const foreWing = "M76 74 C60 58 34 44 18 46 C8 48 6 62 14 74 C22 86 46 92 74 86 Z";
  const foreShade = "M76 80 C60 84 36 86 14 74 C22 86 46 92 74 86 Z";
  const foreTrim = "M18 46 C8 48 6 62 14 74";
  const foreVeins = "M72 78 L30 56 M70 82 L24 72 M64 80 L44 64";
  const hindWing = "M74 90 C56 92 40 100 38 116 C38 128 50 134 62 128 C70 124 76 110 76 98 Z";
  const hindShade = "M74 90 C68 108 66 120 62 128 C70 124 76 110 76 98 Z";
  const wing = (id, d, shade, extra) => `<g id="${id}"><path d="${d}" fill="${mint}"/><path d="${shade}" fill="${mintMid}"/>${extra}</g>`;

  function svgMarkup(uid) {
    const foreExtra = side => {
      const m = side === "R" ? mirror : p => p, cx = side === "R" ? 126 : 34;
      return `<path d="${m(foreTrim)}" fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round"/><path d="${m(foreVeins)}" stroke="${mintDark}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>` +
        `<circle cx="${cx}" cy="64" r="7.5" fill="${paper}"/><circle cx="${cx}" cy="64" r="4.4" fill="${coral}"/><circle cx="${cx}" cy="64" r="1.7" fill="${ink}"/>`;
    };
    const hind = side => {
      const m = side === "R" ? mirror : p => p, sx = side === "R" ? 110 : 50, dx = side === "R" ? 102 : 58;
      return `<g id="${uid}hw${side}"><path d="${m(hindWing)}" fill="${gold}"/><path d="${m(hindShade)}" fill="${goldShade}"/><circle cx="${sx}" cy="116" r="4.2" fill="${coral}"/><circle cx="${dx}" cy="105" r="2.6" fill="${paper}" opacity=".9"/></g>`;
    };
    return `<svg class="pip-svg" viewBox="0 0 160 172" aria-hidden="true"><defs><radialGradient id="${uid}halo"><stop offset="0" stop-color="${gold}" stop-opacity=".9"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient><radialGradient id="${uid}mote"><stop offset="0" stop-color="#FFF4DC"/><stop offset=".45" stop-color="${gold}"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs>
<ellipse id="${uid}shadow" cx="80" cy="164" rx="30" ry="5" fill="#0A1F24" opacity=".45"/>
<g id="${uid}mote" opacity="0"><circle cx="0" cy="0" r="7" fill="url(#${uid}mote)"/><circle cx="0" cy="0" r="1.8" fill="#FFF4DC"/></g>
<g id="${uid}root">
 ${hind("L")}${hind("R")}
 ${wing(`${uid}fwL`, foreWing, foreShade, foreExtra("L"))}${wing(`${uid}fwR`, mirror(foreWing), mirror(foreShade), foreExtra("R"))}
 <path d="M74 118 l-5 10 M86 118 l5 10 M80 120 v11" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>
 <g id="${uid}body"><ellipse cx="80" cy="104" rx="13.5" ry="21" fill="${paper}"/><path d="M80 83 A13.5 21 0 0 1 80 125 Z" fill="${fold}"/><path d="M68.5 98 Q80 102 91.5 98 M69 106 Q80 110 91 106 M71 114 Q80 117.5 89 114" stroke="${fold}" stroke-width="1.8" fill="none"/></g>
 <path d="M63 78 L66 71 L70 77 L74 69.5 L78 76.5 L82 69.5 L86 76.5 L90 69.5 L94 77 L97 71 L98 78 Q80 88 63 78 Z" fill="${paper}"/><path d="M80 76 L82 69.5 L86 76.5 L90 69.5 L94 77 L97 71 L98 78 Q90 83 80 83 Z" fill="${fold}"/>
 <g id="${uid}scarf"><path d="M63 73 Q80 82 97 73 L97.5 79.5 Q80 88.5 62.5 79.5 Z" fill="${coral}"/><path d="M80 82.6 Q90 81 97.5 79.5 L97 73 Q90 77.5 80 79 Z" fill="${coralShade}"/><path id="${uid}tail" d="" fill="${coral}"/><circle cx="91" cy="80" r="4.4" fill="${coralShade}"/></g>
 <g id="${uid}satchel">
  <path d="M65 74 L97 108" stroke="${night}" stroke-width="3.2" stroke-linecap="round"/>
  <circle id="${uid}halo" cx="83" cy="98" r="18" fill="url(#${uid}halo)" opacity="0"/>
  <g id="${uid}letter"><rect x="73" y="92" width="20" height="13" rx="1.6" fill="${paper}" stroke="${ink}" stroke-width="1.6"/><path d="M73.5 93 L83 99.5 L92.5 93" fill="none" stroke="${ink}" stroke-width="1.5"/><circle cx="83" cy="99.5" r="3.1" fill="${coral}"/><path d="M83 97.4 L83.8 99 L85.4 99.2 L84.2 100.3 L84.5 102 L83 101.1 L81.5 102 L81.8 100.3 L80.6 99.2 L82.2 99Z" fill="${gold}"/></g>
  <path d="M70 101 H97 Q99 101 99 103 V118 Q99 122 95 122 H73 Q69 122 69 118 V103 Q69 101 70 101 Z" fill="${night}"/>
  <path d="M69 101 H99 V108.5 Q84 115 69 108.5 Z" fill="${nightMid}"/><rect x="81" y="106.5" width="6.5" height="5.5" rx="1.2" fill="${gold}"/><rect x="83" y="108.2" width="2.5" height="2.1" fill="${goldShade}"/>
 </g>
 <g id="${uid}head">
  <path id="${uid}antL" d="" fill="none" stroke="${ink}" stroke-width="7" stroke-dasharray="1.4 3.2" opacity=".55"/><path id="${uid}antLs" d="" fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>
  <path id="${uid}antR" d="" fill="none" stroke="${ink}" stroke-width="7" stroke-dasharray="1.4 3.2" opacity=".55"/><path id="${uid}antRs" d="" fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>
  <g id="${uid}tipL"><path d="M0 -5 L5 0 L0 5 L-5 0Z" fill="${gold}"/><path d="M0 -5 L5 0 L0 5Z" fill="${goldShade}"/></g><g id="${uid}tipR"><path d="M0 -5 L5 0 L0 5 L-5 0Z" fill="${gold}"/><path d="M0 -5 L5 0 L0 5Z" fill="${goldShade}"/></g>
  <circle cx="80" cy="54" r="18.5" fill="${paper}"/><path d="M80 35.5 A18.5 18.5 0 0 1 80 72.5 Z" fill="${fold}"/>
  <circle cx="68.5" cy="61" r="3.2" fill="${coral}" opacity=".5"/><circle cx="91.5" cy="61" r="3.2" fill="${coral}" opacity=".5"/>
  <g id="${uid}eyes"><g id="${uid}eyeL"><ellipse cx="73" cy="56" rx="3.7" ry="4.6" fill="${ink}"/><circle cx="74.5" cy="54.2" r="1.45" fill="#fff"/></g><g id="${uid}eyeR"><ellipse cx="87" cy="56" rx="3.7" ry="4.6" fill="${ink}"/><circle cx="88.5" cy="54.2" r="1.45" fill="#fff"/></g></g>
  <g id="${uid}happy" opacity="0"><path d="M69.3 57 Q73 52.5 76.7 57 M83.3 57 Q87 52.5 90.7 57" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/></g>
  <g id="${uid}sleep" opacity="0"><path d="M69.5 56 Q73 59 76.5 56 M83.5 56 Q87 59 90.5 56" fill="none" stroke="${ink}" stroke-width="2.3" stroke-linecap="round"/></g>
  <path id="${uid}smile" d="M76 63 Q80 66.8 84 63" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
  <ellipse id="${uid}oh" cx="80" cy="64.5" rx="2.6" ry="3.3" fill="${ink}" opacity="0"/>
  <path id="${uid}grin" d="M75 62.5 Q80 70 85 62.5 Z" fill="${ink}" opacity="0"/>
  <path d="M61.5 47 Q62.5 30.5 80 30.5 Q97.5 30.5 98.5 47 Z" fill="${night}"/><path d="M80 30.5 Q97.5 30.5 98.5 47 H80Z" fill="#0E2A30"/>
  <rect x="59.5" y="43.5" width="41" height="6" rx="3" fill="${mintMid}"/><path d="M57.5 48.5 Q80 56 102.5 48.5 L100.5 52 Q80 59 59.5 52 Z" fill="${mintDark}"/>
  <rect x="75" y="35" width="10" height="7" rx="1.2" fill="${gold}"/><path d="M75.5 35.6 L80 39 L84.5 35.6" fill="none" stroke="${goldShade}" stroke-width="1.2"/>
 </g>
</g>
<g id="${uid}zzz" opacity="0"><path d="M0 0 H7 L0 8 H7" fill="none" stroke="${paper}" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 -12 H17 L12 -6 H17" fill="none" stroke="${paper}" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 -22 H26 L22 -17.5 H26" fill="none" stroke="${paper}" stroke-width="1.5" stroke-linejoin="round"/></g>
<g id="${uid}spark" opacity="0">${Array.from({ length: 7 }, (_, i) => `<path class="pip-spark" data-i="${i}" d="M0 -4 L3 0 L0 4 L-3 0Z" fill="${i % 2 ? mint : gold}"/>`).join("")}</g>
</svg>`;
  }

  const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
  const pulse = (t, a, b) => t <= a || t >= b ? 0 : Math.sin((t - a) / (b - a) * Math.PI);
  const ACTIONS = { hop: 1.0, look: 2.2, wave: 1.5, peek: 1.8, catch: 2.6, loop: 1.5, watch: 2.6, yawn: 1.8, present: 1.6, tap: .75, enter: 1.1 };
  let count = 0;

  function create(container, options = {}) {
    const uid = `pip${count++}_`;
    container.innerHTML = svgMarkup(uid);
    const $ = id => container.querySelector(`#${uid}${id}`);
    const el = { root: $("root"), shadow: $("shadow"), body: $("body"), head: $("head"), fwL: $("fwL"), fwR: $("fwR"), hwL: $("hwL"), hwR: $("hwR"),
      eyes: $("eyes"), eyeL: $("eyeL"), eyeR: $("eyeR"), happy: $("happy"), sleep: $("sleep"), smile: $("smile"), oh: $("oh"), grin: $("grin"),
      antL: $("antL"), antLs: $("antLs"), antR: $("antR"), antRs: $("antRs"), tipL: $("tipL"), tipR: $("tipR"), tail: $("tail"),
      letter: $("letter"), halo: $("halo"), satchel: $("satchel"), zzz: $("zzz"), spark: $("spark"), mote: $("mote") };
    const sparks = [...container.querySelectorAll(".pip-spark")];
    const random = options.random || Math.random;
    const s = { t: 0, action: null, at: 0, nextIdle: 2.5, last: "", blink: 2, blinkLen: 0, ready: false, idleFor: 0, dozing: false,
      look: { x: 0, y: 0 }, lookTarget: { x: 0, y: 0 }, glider: null, ant: { x: 0, y: 0, vx: 0, vy: 0 }, prevY: 0, reduced: false };

    function start(name) { s.action = name; s.at = 0; if (name !== "doze") s.dozing = false; }
    function pickIdle() {
      if (s.ready && s.last !== "present" && random() < .45) return "present";
      const pool = ["look", "hop", "wave", "peek", "catch", "loop", "watch", "yawn", "look", "hop"].filter(n => n !== s.last);
      return pool[Math.floor(random() * pool.length)];
    }

    function tick(dt) {
      dt = Math.min(dt, .05); s.t += dt; s.idleFor += dt;
      if (s.action) { s.at += dt; if (s.at >= ACTIONS[s.action]) { s.last = s.action; s.action = null; s.nextIdle = 3.2 + random() * 3.2; } }
      else if (!s.dozing) { s.nextIdle -= dt; if (s.nextIdle <= 0) start(pickIdle()); }
      if (!s.action && !s.dozing && s.idleFor > (options.dozeAfter ?? 28)) s.dozing = true;

      const t = s.t, a = s.action, p = a ? s.at / ACTIONS[a] : 0, calm = s.reduced ? .35 : 1;
      // Base life.
      let x = 0, y = Math.sin(t * 2.1) * 3 * calm, sx = 1, sy = 1 + Math.sin(t * 2.1 + 1) * .022 * calm, rot = 0, headTilt = Math.sin(t * .9) * 2 * calm;
      let fore = Math.sin(t * 3.1) * 5 * calm, hind = Math.sin(t * 3.1 - .7) * 4 * calm, foreL = 0, foreR = 0, wingScale = 1;
      let eyesMode = "open", mouth = "smile", letterLift = 0, halo = s.ready ? .3 + .25 * Math.sin(t * 3) : 0, zzz = 0, spark = 0, sparkR = 0;
      s.lookTarget.x = 0; s.lookTarget.y = 0; let mote = null;
      if (s.dozing) { eyesMode = "sleep"; mouth = "smile"; y *= .5; fore *= .4; hind *= .4; headTilt = 7; zzz = 1; sy = 1 + Math.sin(t * 1.2) * .03; }

      if (a === "hop" || a === "tap") {
        const squat = pulse(p, 0, .2), air = p > .18 && p < .82 ? Math.sin((p - .18) / .64 * Math.PI) : 0, land = pulse(p, .8, 1);
        y -= air * (a === "tap" ? 16 : 24); sy *= 1 - squat * .12 - land * .1 + air * .06; sx *= 1 + squat * .08 + land * .07 - air * .03;
        fore += air * Math.sin(t * 42) * 24; hind += air * Math.sin(t * 42 - .5) * 16;
        if (a === "tap") { eyesMode = "happy"; mouth = "grin"; spark = pulse(p, .1, 1); sparkR = 18 + p * 40; }
      } else if (a === "look") {
        s.lookTarget.x = p < .4 ? -1 : p < .8 ? 1 : 0; s.lookTarget.y = -.2; headTilt += (p < .4 ? -6 : p < .8 ? 6 : 0) * ease(Math.min(1, s.at * 4));
      } else if (a === "watch" && s.glider) {
        s.lookTarget.x = Math.max(-1, Math.min(1, s.glider.x)); s.lookTarget.y = Math.max(-1, Math.min(1, s.glider.y)); headTilt += s.lookTarget.x * 5;
      } else if (a === "wave") {
        foreR = Math.sin(s.at * 14) * 26 * pulse(p, 0, 1); eyesMode = "happy"; headTilt += 5 * pulse(p, 0, 1);
      } else if (a === "peek") {
        const d = pulse(p, 0, 1); headTilt += 12 * d; s.lookTarget.y = 1 * d; s.lookTarget.x = .3 * d; letterLift = 4 * pulse(p, .3, .9); halo = Math.max(halo, .5 * pulse(p, .3, .9));
        if (p > .7) { spark = pulse(p, .7, 1); sparkR = 12 + (p - .7) * 40; }
      } else if (a === "present") {
        const d = pulse(p, 0, 1); letterLift = 13 * d; halo = Math.max(halo, d); eyesMode = "happy"; mouth = "grin"; y -= 6 * d; fore += Math.sin(t * 20) * 10 * d;
        spark = pulse(p, .25, 1); sparkR = 20 + p * 26;
      } else if (a === "loop") {
        const ang = ease(p) * TAU; x = Math.sin(ang) * 16; y -= (1 - Math.cos(ang)) * 14; rot = Math.sin(ang) * 14; fore += Math.sin(t * 36) * 18; hind += Math.sin(t * 36 - .5) * 12;
      } else if (a === "yawn") {
        const d = pulse(p, 0, 1); eyesMode = d > .25 ? "sleep" : "open"; mouth = d > .2 ? "oh" : "smile"; headTilt -= 9 * d; wingScale = 1 + .12 * d; sy *= 1 + .05 * d;
      } else if (a === "catch") {
        const fly = Math.min(1, p / .7), mx = 150 - fly * 66, my = 40 + Math.sin(fly * 9) * 10 - fly * 4;
        mote = { x: mx, y: my, o: p < .72 ? Math.min(1, p * 6) : 0 };
        s.lookTarget.x = Math.max(-1, Math.min(1, (mx - 80) / 40)); s.lookTarget.y = Math.max(-1, Math.min(1, (my - 56) / 30));
        if (p > .68) { const snap = pulse(p, .68, .9); y -= snap * 14; x += snap * 6; mouth = "oh"; }
        if (p > .74) { eyesMode = "happy"; mouth = "grin"; spark = pulse(p, .74, 1); sparkR = 10 + (p - .74) * 50; }
      } else if (a === "enter") {
        const k = ease(p); x = (1 - k) * -150; y -= Math.sin(k * Math.PI) * 30 + (1 - k) * 10; rot = (1 - k) * 18; fore += Math.sin(t * 40) * 22 * (1 - k * .6); hind += Math.sin(t * 40 - .5) * 14;
        if (p > .85) { const land = pulse(p, .85, 1); sy *= 1 - land * .12; sx *= 1 + land * .08; }
      }

      // Blinks (sometimes double) while the eyes are open.
      s.blink -= dt; if (s.blink <= 0) { s.blinkLen = .13; s.blink = random() < .2 ? .22 : 2.2 + random() * 3; }
      let lid = 1; if (s.blinkLen > 0) { s.blinkLen -= dt; lid = .12; }
      // Gaze eases toward its target.
      s.look.x += (s.lookTarget.x - s.look.x) * Math.min(1, dt * 9); s.look.y += (s.lookTarget.y - s.look.y) * Math.min(1, dt * 9);
      // Antenna tips are springs that lag the head and body (secondary motion).
      const vy = (y - s.prevY) / Math.max(dt, .001); s.prevY = y;
      const ax = -s.ant.x * 70 - s.ant.vx * 7 - headTilt * .9 - x * .02, ay = -s.ant.y * 70 - s.ant.vy * 7 + vy * .05;
      s.ant.vx += ax * dt; s.ant.vy += ay * dt; s.ant.x += s.ant.vx * dt; s.ant.y += s.ant.vy * dt;

      // Write the pose.
      const pivot = "80 150";
      el.root.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)} ${pivot}) translate(80 150) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-80 -150)`);
      const height = Math.max(0, -y) / 40;
      el.shadow.setAttribute("transform", `translate(${(x * .6).toFixed(2)} 0) translate(80 164) scale(${(1 - height * .5).toFixed(3)} 1) translate(-80 -164)`);
      el.shadow.setAttribute("opacity", (.45 - height * .25).toFixed(2));
      el.head.setAttribute("transform", `rotate(${headTilt.toFixed(2)} 80 70)`);
      el.fwL.setAttribute("transform", `rotate(${(-fore - foreL).toFixed(2)} 76 78) translate(76 78) scale(${wingScale.toFixed(3)}) translate(-76 -78)`);
      el.fwR.setAttribute("transform", `rotate(${(fore + foreR).toFixed(2)} 84 78) translate(84 78) scale(${wingScale.toFixed(3)}) translate(-84 -78)`);
      el.hwL.setAttribute("transform", `rotate(${(-hind).toFixed(2)} 74 92)`);
      el.hwR.setAttribute("transform", `rotate(${hind.toFixed(2)} 86 92)`);
      const eyeOpen = eyesMode === "open", lx = s.look.x * 2.3, ly = s.look.y * 1.8;
      for (const [eye, cxEye] of [[el.eyeL, 73], [el.eyeR, 87]]) eye.setAttribute("transform", `translate(${lx.toFixed(2)} ${ly.toFixed(2)}) translate(${cxEye} 56) scale(1 ${eyeOpen ? lid : 1}) translate(${-cxEye} -56)`);
      el.eyes.setAttribute("opacity", eyeOpen ? 1 : 0); el.happy.setAttribute("opacity", eyesMode === "happy" ? 1 : 0); el.sleep.setAttribute("opacity", eyesMode === "sleep" ? 1 : 0);
      el.smile.setAttribute("opacity", mouth === "smile" ? 1 : 0); el.oh.setAttribute("opacity", mouth === "oh" ? 1 : 0); el.grin.setAttribute("opacity", mouth === "grin" ? 1 : 0);
      // Antennae: feathery stems from the cap to spring-driven tips.
      const tipL = { x: 56 + s.ant.x * 6 - 2, y: 18 + s.ant.y * 4 }, tipR = { x: 104 + s.ant.x * 6 + 2, y: 18 - s.ant.y * 4 };
      const stemL = `M72 36 Q64 ${22 + s.ant.y} ${tipL.x.toFixed(1)} ${tipL.y.toFixed(1)}`, stemR = `M88 36 Q96 ${22 - s.ant.y} ${tipR.x.toFixed(1)} ${tipR.y.toFixed(1)}`;
      el.antL.setAttribute("d", stemL); el.antLs.setAttribute("d", stemL); el.antR.setAttribute("d", stemR); el.antRs.setAttribute("d", stemR);
      el.tipL.setAttribute("transform", `translate(${tipL.x.toFixed(1)} ${tipL.y.toFixed(1)}) rotate(${(s.ant.x * 30).toFixed(1)})`);
      el.tipR.setAttribute("transform", `translate(${tipR.x.toFixed(1)} ${tipR.y.toFixed(1)}) rotate(${(s.ant.x * 30).toFixed(1)})`);
      // Scarf tail flutters, more when moving.
      const flutter = Math.sin(t * 4.2) * 3 + Math.sin(t * 7.3) * 1.5 - vy * .02 + x * .05;
      el.tail.setAttribute("d", `M88 79 C96 ${(86 + flutter * .4).toFixed(1)} ${103 + flutter * .3} ${(84 + flutter).toFixed(1)} ${(112 + flutter * .4).toFixed(1)} ${(91 + flutter * 1.2).toFixed(1)} L${(108 + flutter * .3).toFixed(1)} ${(97 + flutter).toFixed(1)} C100 ${(91 + flutter * .5).toFixed(1)} 94 ${(92 + flutter * .3).toFixed(1)} 86 85 Z`);
      el.letter.setAttribute("transform", `translate(0 ${(-letterLift).toFixed(2)}) rotate(${(letterLift * -.6).toFixed(2)} 83 98)`);
      el.halo.setAttribute("opacity", Math.max(0, Math.min(1, halo)).toFixed(2));
      el.satchel.setAttribute("transform", `rotate(${(Math.sin(t * 2.1 + .6) * 1.5 * calm - headTilt * .15).toFixed(2)} 80 76)`);
      el.zzz.setAttribute("opacity", zzz ? (.55 + .45 * Math.sin(t * 2)).toFixed(2) : 0);
      el.zzz.setAttribute("transform", `translate(${(104 + Math.sin(t * 1.6) * 3).toFixed(1)} ${(34 - (t * 6 % 10)).toFixed(1)})`);
      el.spark.setAttribute("opacity", spark.toFixed(2));
      sparks.forEach((node, i) => { const ang = i / sparks.length * TAU + .4; node.setAttribute("transform", `translate(${(80 + Math.cos(ang) * sparkR).toFixed(1)} ${(76 + y + Math.sin(ang) * sparkR * .8).toFixed(1)}) rotate(${(t * 200 + i * 40).toFixed(0)}) scale(${(1.2 - spark * .4).toFixed(2)})`); });
      if (mote) { el.mote.setAttribute("opacity", mote.o.toFixed(2)); el.mote.setAttribute("transform", `translate(${mote.x.toFixed(1)} ${mote.y.toFixed(1)}) scale(${(1 + Math.sin(t * 12) * .15).toFixed(2)})`); }
      else el.mote.setAttribute("opacity", 0);
    }

    return {
      tick,
      react(name) { s.idleFor = 0; s.dozing = false; start(name); },
      setReady(value) { s.ready = Boolean(value); },
      setReduced(value) { s.reduced = Boolean(value); },
      // Glider position relative to Pip's head in -1..1 units, used by the "watch" idle.
      setGlider(gx, gy) { s.glider = { x: gx, y: gy }; },
      get action() { return s.action || (s.dozing ? "doze" : "idle"); },
    };
  }

  window.OrbitPip = { create };
})();
