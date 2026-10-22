// Fly Them Home · post pass (WebGL2). Bloom and an anamorphic streak only from gold (keyed from the picture) and from the
// explicit glow layer (wax, sparks, moonlight), then exposure, grade, vignette, grain, flash and fade.
(() => {
  const VS = `#version 300 es
  in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
  const BRIGHT = `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D comp, glow; uniform vec2 texel; uniform float goldGain, glowGain;
  vec3 key(vec2 q){ vec3 c = texture(comp, q).rgb; float l = dot(c, vec3(.299,.587,.114)); float warm = c.r - c.b;
    return c * smoothstep(.6, .9, l) * smoothstep(.16, .42, warm); }
  void main(){ vec2 d = texel * .5; vec3 k = (key(uv + vec2(-d.x,-d.y)) + key(uv + vec2(d.x,-d.y)) + key(uv + vec2(-d.x,d.y)) + key(uv + d)) * .25;
    o = vec4(k * goldGain + texture(glow, uv).rgb * glowGain, 1.); }`;
  const BLUR = `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D src; uniform vec2 dir;
  void main(){ const float w[7] = float[7](.1964825501511404, .2969069646728344, .09447039785044732, .010381362401148057, .0, .0, .0);
    vec3 c = texture(src, uv).rgb * w[0];
    c += (texture(src, uv + dir * 1.411764705882353).rgb + texture(src, uv - dir * 1.411764705882353).rgb) * w[1];
    c += (texture(src, uv + dir * 3.2941176470588234).rgb + texture(src, uv - dir * 3.2941176470588234).rgb) * w[2];
    c += (texture(src, uv + dir * 5.176470588235294).rgb + texture(src, uv - dir * 5.176470588235294).rgb) * w[3];
    o = vec4(c, 1.); }`;
  const STREAK = `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D src; uniform vec2 texel;
  void main(){ vec3 c = vec3(0.); float tw = 0.;
    for (int i = -24; i <= 24; i++) { float f = float(i); float w = exp(-abs(f) / 9.); vec3 s = texture(src, uv + vec2(f * texel.x * 3., 0.)).rgb; c += max(s - .18, 0.) * w; tw += w; }
    o = vec4(c / tw * 3.2, 1.); }`;
  const FINAL = `#version 300 es
  precision highp float; in vec2 uv; out vec4 o;
  uniform sampler2D comp, b1, b2, streak; uniform float exposure, bloom, streakAmt, contrast, sat, vig, grain, frame, fade, flash, warmth, lift;
  uniform vec3 flashColor;
  float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec3 c = texture(comp, uv).rgb * exposure;
    vec3 bl = texture(b1, uv).rgb * .75 + texture(b2, uv).rgb * 1.05;
    c += bl * bloom + texture(streak, uv).rgb * streakAmt * vec3(1., .82, .55);
    c = (c - .5) * contrast + .5 + lift;
    float l = dot(c, vec3(.299, .587, .114)); c = mix(vec3(l), c, sat);
    c *= vec3(1. + warmth * .06, 1. + warmth * .01, 1. - warmth * .07);
    vec2 q = (uv - .5) * vec2(1.0, .82); c *= 1. - vig * smoothstep(.28, .92, length(q) * 1.35);
    c += (h(uv * vec2(1920., 1080.) + frame * 7.13) - .5) * grain;
    c = mix(c, flashColor, flash);
    c *= 1. - fade;
    o = vec4(clamp(c, 0., 1.), 1.); }`;

  function create(out, comp, glow) {
    const gl = out.getContext("webgl2", { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false });
    gl.getExtension("EXT_color_buffer_float");
    const W = out.width, H = out.height;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = fs => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
    const P = { bright: prog(BRIGHT), blur: prog(BLUR), streak: prog(STREAK), final: prog(FINAL) };
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const tex = (w, h, float) => {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      return t;
    };
    const target = (w, h) => { const t = tex(w, h, true), f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { t, f, w, h }; };
    const tComp = tex(W, H, false), tGlow = tex(glow.width, glow.height, false);
    const q = [W / 4, H / 4], e = [W / 16, H / 16];
    const A = target(...q), B = target(...q), S = target(...q), C2 = target(...e), D = target(...e);
    const use = (p, fb, w, h) => { gl.useProgram(p); gl.bindFramebuffer(gl.FRAMEBUFFER, fb ? fb.f : null); gl.viewport(0, 0, w, h); };
    const bind = (p, name, t, unit) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(gl.getUniformLocation(p, name), unit); };
    const u1 = (p, n, v) => gl.uniform1f(gl.getUniformLocation(p, n), v);
    const u2 = (p, n, a, b) => gl.uniform2f(gl.getUniformLocation(p, n), a, b);
    const draw = () => gl.drawArrays(gl.TRIANGLES, 0, 3);
    const blur = (src, dst, tmp, scale) => {
      use(P.blur, tmp, dst.w, dst.h); bind(P.blur, "src", src.t, 0); u2(P.blur, "dir", scale / dst.w, 0); draw();
      use(P.blur, dst, dst.w, dst.h); bind(P.blur, "src", tmp.t, 0); u2(P.blur, "dir", 0, scale / dst.h); draw();
    };

    function render(o) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, tComp); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, comp);
      // The glow layer is mostly transparent: upload it premultiplied so faint glows stay faint.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, tGlow); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glow);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      use(P.bright, A, A.w, A.h); bind(P.bright, "comp", tComp, 0); bind(P.bright, "glow", tGlow, 1);
      u2(P.bright, "texel", 1 / A.w, 1 / A.h); u1(P.bright, "goldGain", o.goldGain ?? .55); u1(P.bright, "glowGain", o.glowGain ?? 1.1); draw();
      // Streak from the bright key before blurring, so it stays a thin line.
      use(P.streak, S, S.w, S.h); bind(P.streak, "src", A.t, 0); u2(P.streak, "texel", 1 / S.w, 1 / S.h); draw();
      blur(A, A, B, 1.2); blur(A, A, B, 2.2);
      // Wide bloom: downsample A into C2 through the blur.
      blur(A, C2, D, 1.0); blur(C2, C2, D, 2.0);
      use(P.final, null, W, H);
      bind(P.final, "comp", tComp, 0); bind(P.final, "b1", A.t, 1); bind(P.final, "b2", C2.t, 2); bind(P.final, "streak", S.t, 3);
      u1(P.final, "exposure", o.exposure ?? 1); u1(P.final, "bloom", o.bloom ?? .8); u1(P.final, "streakAmt", o.streak ?? .5);
      u1(P.final, "contrast", o.contrast ?? 1.04); u1(P.final, "sat", o.sat ?? 1.04); u1(P.final, "vig", o.vig ?? .35);
      u1(P.final, "grain", o.grain ?? .028); u1(P.final, "frame", o.frame || 0); u1(P.final, "fade", o.fade || 0);
      u1(P.final, "flash", o.flash || 0); u1(P.final, "warmth", o.warmth || 0); u1(P.final, "lift", o.lift || 0);
      const fc = o.flashColor || [1, .96, .86]; gl.uniform3f(gl.getUniformLocation(P.final, "flashColor"), fc[0], fc[1], fc[2]);
      draw();
    }
    return { render };
  }
  window.FilmPost = { create };
})();
