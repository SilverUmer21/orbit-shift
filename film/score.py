# Orbit Shift · "Fly Them Home" score and sound. Synthesised from the render's event log, so every hit lands on its frame.
#   python3 film/score.py film/out/events.json film/out/score.wav
# 120 BPM (one bar = 2 s), D major. One theme ("fly them home": A D F# E) heard alone on a music box, then in each
# world's colours (kalimba in Bloom, brass in Ember, glass in Void), then in full at Moonrise.
# The kit is a post office: parcel kick, rubber-stamp snare, rustling-letter shaker, paper-flick hats, bells on postmarks.
import json, sys
import numpy as np
from scipy import signal

SR = 48000
events_path, out_path = sys.argv[1], sys.argv[2]
LOG = json.load(open(events_path))
CUES, GAME = LOG['cues'], LOG['game']
DUR = 60.6
N = int(DUR * SR)
rng = np.random.default_rng(20261022)
BEAT = .5

music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); send = np.zeros((N, 2)); duck_src = np.zeros(N)

def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def sos(kind, f, order=2):
    if kind == 'bp': return signal.butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], btype='band', output='sos')
    return signal.butter(order, f / (SR / 2), btype=kind, output='sos')
def filt(x, kind, f, order=2): return signal.sosfilt(sos(kind, f, order), x)
def noise(d): return rng.standard_normal(int(d * SR))
def env(d, a=.005, decay=4.0):
    t = tt(d); return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t * decay)
def fade(sig, a=.004, r=.02):
    n = len(sig); ai, ri = int(a * SR), int(r * SR)
    if ai: sig[:ai] *= np.linspace(0, 1, ai)
    if ri and ri < n: sig[-ri:] *= np.linspace(1, 0, ri)
    return sig

def place(bus, sig, t, gain=1.0, pan=0.0, verb=0.0, duck=False):
    i = int(round(t * SR))
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        st = np.stack([sig * l, sig * r], 1)
    else: st = sig
    if i < 0: st, i = st[-i:], 0
    if i >= N: return
    st = st[:N - i] * gain
    bus[i:i + len(st)] += st
    if verb: send[i:i + len(st)] += st * verb
    if duck: duck_src[i:i + len(st)] += np.abs(st[:, 0])

# ---------------------------------------------------------------- instruments
def musicbox(m, d=2.2):
    t = tt(d); f = hz(m)
    s = np.sin(2 * np.pi * f * t) + .42 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 5) + .2 * np.sin(2 * np.pi * f * 4.95 * t) * np.exp(-t * 11) + .08 * np.sin(2 * np.pi * f * 8.1 * t) * np.exp(-t * 18)
    click = filt(noise(d), 'hp', 3500) * np.exp(-t * 400) * .25
    return fade((s * np.exp(-t * 2.4) + click) * np.minimum(1, t * 900))

def bell(m, d=3.0, bright=1.0):
    t = tt(d); f = hz(m)
    parts = [(1, 1, 1.2), (2.0, .55, 1.9), (2.76, .4 * bright, 2.8), (5.4, .22 * bright, 5), (8.93, .1 * bright, 8)]
    s = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t * dk) for k, a, dk in parts)
    return fade(s * np.minimum(1, t * 1200) * .5)

def glock(m, d=1.4):
    t = tt(d); f = hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3) + .4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9) + .2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 16)
    return fade(s * np.minimum(1, t * 2000) * .6)

def kalimba(m, d=1.3):
    t = tt(d); f = hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.2) + .3 * np.sin(2 * np.pi * f * 5.9 * t) * np.exp(-t * 22) + .12 * np.sin(2 * np.pi * f * 3.0 * t) * np.exp(-t * 9)
    thump = filt(noise(d), 'bp', (200, 900)) * np.exp(-t * 90) * .2
    return fade((s + thump) * np.minimum(1, t * 1500) * .7)

def pluck(m, d=.9, bright=4000):
    # Karplus-Strong: a paper-ish pluck for crease notes and letter pops.
    f = hz(m); L = max(2, int(SR / f)); n = int(d * SR)
    buf = filt(rng.standard_normal(L), 'lp', min(bright, SR / 2.2)); out = np.zeros(n)
    for i in range(0, n, L):
        out[i:i + L] = buf[:min(L, n - i)]
        buf = .996 * .5 * (buf + np.roll(buf, -1))
    return fade(out * .5)

def saw(f, t, det=0.0):
    ph = (f * (1 + det)) * t; return 2 * (ph - np.floor(ph + .5))

def pad(notes, d, a=.8, r=1.2, cutoff=1800, det=.004, gain=1.0):
    t = tt(d); s = np.zeros_like(t)
    for m in notes:
        for k, dd in enumerate((-det, 0, det)):
            s += saw(hz(m), t, dd) * (.8 if k == 1 else .5)
    s = filt(s, 'lp', cutoff, 2) / (len(notes) * 2.2)
    e = np.minimum(1, t / a) * np.clip((d - t) / r, 0, 1)
    return s * e * gain

def choir(notes, d, a=1.2, r=1.6):
    # Formant-filtered saws on "ah" (800 / 1150 / 2900 Hz), slow vibrato.
    t = tt(d); s = np.zeros_like(t)
    for m in notes:
        vib = 1 + .004 * np.sin(2 * np.pi * 5.1 * t + m)
        ph = np.cumsum(hz(m) * vib) / SR; s += 2 * (ph - np.floor(ph + .5))
    v = filt(s, 'bp', (650, 950), 2) * 1.0 + filt(s, 'bp', (1000, 1300), 2) * .6 + filt(s, 'bp', (2600, 3200), 2) * .25
    e = np.minimum(1, t / a) * np.clip((d - t) / r, 0, 1)
    return v * e / len(notes) * 2.2

def brass(m, d, gain=1.0):
    t = tt(d); f = hz(m)
    s = saw(f, t) * .6 + saw(f, t, .003) * .4
    cut = 600 + 2600 * np.exp(-t * 5) + 500
    # Time-varying lowpass in short blocks.
    out = np.zeros_like(s); blk = 512
    for i in range(0, len(s), blk):
        out[i:i + blk] = signal.sosfilt(sos('lp', float(cut[i]), 2), s[max(0, i - 64):i + blk])[-len(s[i:i + blk]):]
    e = np.minimum(1, t / .02) * np.clip((d - t) / .08, 0, 1) * (.75 + .25 * np.exp(-t * 3))
    return fade(out * e * .5 * gain)

def glass(m, d):
    t = tt(d); f = hz(m)
    s = (np.sin(2 * np.pi * f * t + .8 * np.sin(2 * np.pi * f * 2 * t)) * .7 + np.sin(2 * np.pi * f * 1.003 * t) * .5) * (1 + .25 * np.sin(2 * np.pi * 5.5 * t))
    e = np.minimum(1, t / .25) * np.clip((d - t) / .6, 0, 1)
    return s * e * .35

def rev_piano(m, d=1.2):
    t = tt(d); f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (2 + k * 1.5)) for k, a in [(1, 1), (2, .5), (3, .25), (4, .12)])
    return fade((s * np.minimum(1, t * 800))[::-1].copy() * .45)

def bass(m, d, kind='pluck'):
    t = tt(d); f = hz(m)
    if kind == 'sub': s = np.sin(2 * np.pi * f * t) * np.minimum(1, t / .02) * np.clip((d - t) / .05, 0, 1)
    else: s = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t))) * np.exp(-t * 3.5) * np.minimum(1, t / .004)
    return fade(s * .55)

# ---- the post-office kit
def kick(gain=1.0, d=.5):
    t = tt(d); f = 45 + 110 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7); box = filt(noise(d), 'bp', (90, 400)) * np.exp(-t * 35) * .5
    return fade((body + box) * gain)

def stamp(gain=1.0, d=.35):
    # Rubber stamp on a counter: a snappy 'tok' with a papery spray.
    t = tt(d); tok = np.sin(2 * np.pi * 210 * t) * np.exp(-t * 40) * .7
    spray = filt(noise(d), 'bp', (1200, 6500)) * np.exp(-t * 22) * .6
    return fade((tok + spray) * gain)

def shaker(gain=1.0, d=.09):
    t = tt(d); return fade(filt(noise(d), 'bp', (3500, 9000)) * np.minimum(1, t / .012) * np.exp(-t * 45) * gain * .36)

def flick(gain=1.0, d=.05):
    t = tt(d); return fade(filt(noise(d), 'bp', (5000, 11000)) * np.exp(-t * 120) * gain * .45)

def tom(m=45, gain=1.0, d=.7):
    t = tt(d); f = hz(m) * (1 + .6 * np.exp(-t * 18)); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade((np.sin(ph) * np.exp(-t * 5) + filt(noise(d), 'lp', 900) * np.exp(-t * 25) * .4) * gain)

def boom(gain=1.0, d=3.0):
    t = tt(d); f = 38 + 30 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
    return fade((np.sin(ph) * np.exp(-t * 1.4) + filt(noise(d), 'lp', 300) * np.exp(-t * 3) * .5) * gain)

def cymbal(d=3.0, rev=False, gain=1.0):
    t = tt(d); s = filt(filt(noise(d), 'hp', 4500), 'lp', 11000) * np.exp(-t * (1.3 if not rev else .9))
    s = s * np.minimum(1, t / .003)
    if rev: s = s[::-1].copy()
    return fade(s * gain * .22, .01, .05)

# ---- paper and post foley
def crease(gain=1.0, d=.28, bright=1.0):
    t = tt(d); crackle = np.zeros(int(d * SR))
    for k in range(9):
        i = int(rng.uniform(0, .12) * SR); w = int(rng.uniform(.002, .008) * SR)
        crackle[i:i + w] += rng.standard_normal(min(w, len(crackle) - i)) * rng.uniform(.4, 1)
    body = filt(noise(d), 'bp', (900, 5200 * bright)) * np.exp(-t * 18) * .6
    thud = np.sin(2 * np.pi * 120 * t) * np.exp(-t * 30) * .4
    return fade((filt(filt(crackle, 'hp', 1500), 'lp', 8500) + body + thud) * gain)

def whoosh(d=.8, f0=400, f1=3000, gain=1.0, peak=.5):
    n = int(d * SR); x = noise(d); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        u = i / n; fc = f0 * (f1 / f0) ** u
        out[i:i + blk] = signal.sosfilt(sos('bp', (fc * .6, min(fc * 1.6, 20000))), x[max(0, i - 256):i + blk])[-len(x[i:i + blk]):]
    t = np.arange(n) / n; e = np.where(t < peak, t / peak, (1 - t) / (1 - peak)) ** 1.6
    return fade(out * e * gain)

def shift_snd(dirn=1, gain=1.0):
    # The tap: a 90 ms reversed shimmer that snaps into a paper flick (the world flips direction).
    swell = bell(86 + (2 if dirn > 0 else 0), .09)[::-1].copy() * .35 + filt(noise(.09), 'hp', 3000)[::-1] * np.linspace(0, .25, int(.09 * SR))
    snap = stamp(.25, .08); snap[:int(.06 * SR)] += flick(1.2, .06)
    return fade(np.concatenate([swell, snap]) * gain)

def sparkle(n=8, spread=.5, base=86, gain=1.0):
    out = np.zeros(int((spread + 1.2) * SR))
    scale = [0, 2, 4, 7, 9, 12, 14, 16]
    for k in range(n):
        s = glock(base + scale[rng.integers(len(scale))], 1.0) * rng.uniform(.3, .7)
        i = int(rng.uniform(0, spread) * SR); out[i:i + len(s)] += s[:len(out) - i]
    return out * gain

def heartbeat(gain=1.0):
    t = tt(.5); a = np.sin(2 * np.pi * 52 * t) * np.exp(-t * 18)
    out = np.zeros(int(.7 * SR)); out[:len(a)] += a; j = int(.18 * SR); out[j:j + len(a)] += a[:len(out) - j] * .7
    return filt(out, 'lp', 160) * gain

def pen(d=.6):
    t = tt(d); m = (np.sin(2 * np.pi * 7 * t) > .2) * (.6 + .4 * np.sin(2 * np.pi * 3 * t)) ** 2
    return fade(filt(noise(d), 'bp', (2200, 6000)) * m * .16)

def squelch(gain=1.0):
    t = tt(.4); f = 260 * np.exp(-t * 9) + 60; ph = 2 * np.pi * np.cumsum(f) / SR
    return fade((np.sin(ph) * np.exp(-t * 9) * .7 + filt(noise(.4), 'lp', 1200) * np.exp(-t * 20) * .5) * gain)

def flutter(d=.8, gain=1.0):
    n = int(d * SR); out = np.zeros(n); step = int(SR / 26)
    for i in range(0, n - 400, step): out[i:i + 400] += filt(rng.standard_normal(400), 'bp', (700, 3000)) * np.hanning(400) * rng.uniform(.4, 1)
    return out * gain * .5

def riser(d, gain=1.0):
    t = tt(d); x = whoosh(d, 300, 9000, 1, .98)
    tone = np.sin(2 * np.pi * np.cumsum(200 * 2 ** (t / d * 3)) / SR) * (t / d) ** 2 * .12
    return (x + tone) * gain

def snare_roll(t0, t1, gain=1.0):
    t = t0; k = 0
    while t < t1:
        u = (t - t0) / (t1 - t0); place(music, stamp(.25 + .6 * u ** 1.5, .12), t, gain, rng.uniform(-.2, .2), .1)
        t += BEAT / (4 if u < .5 else 8); k += 1

def chord_names():
    return {'D': [50, 57, 62, 66, 69], 'Bm': [47, 54, 59, 62, 66], 'G': [43, 50, 55, 59, 62], 'A': [45, 52, 57, 61, 64],
            'Em': [40, 47, 52, 55, 59], 'Asus': [45, 52, 57, 62, 64], 'Dadd9': [50, 57, 62, 64, 66, 69], 'F#m': [42, 49, 54, 57, 61]}
CH = chord_names()
ROOT = {'D': 38, 'Bm': 35, 'G': 31, 'A': 33, 'Em': 28, 'Asus': 33, 'Dadd9': 38, 'F#m': 30}

def notes(line, t0, inst, gain=1.0, pan=0.0, verb=.25, step=BEAT):
    for b, m, dur in line:
        place(music, inst(m, max(.3, dur * step + .8)), t0 + b * step, gain, pan, verb)

# ---------------------------------------------------------------- the cue sheet
def cues(kind): return [c for c in CUES if c['type'] == kind]
def cue(kind, default=None):
    c = cues(kind); return c[0]['t'] if c else default
def game(kind, shot=None): return [e for e in GAME if e['type'] == kind and (shot is None or e.get('shot') == shot)]
pan_of = lambda e: float(np.clip((e.get('x', 384) - 384) / 384 * .7, -.8, .8))

# 0 · studio sting: every pixel lands with a soft tick that rises left to right; the glow runs with a warm shimmer.
for c in cues('pixel'):
    place(sfx, pluck(74 + int(c.get('p', .5) * 14), .25, 6000), c['t'], .16, (c.get('p', .5) - .5) * .9, .15)
place(sfx, boom(.6, 2.6), cue('wmSolid'), .7, 0, .25)
place(sfx, whoosh(1.3, 2000, 9000, .25, .6), cue('wmGlow'), 1, -.5, .3)
for k in range(5): place(sfx, glock(98 - k * 3, .6), cue('emberDrop') + k * .1, .12, .1 * k, .4)

# 1 · the seal, the letter, the page folding away.
place(sfx, squelch(1.0), cue('seal'), .8, 0, .2)
place(sfx, kick(1.3, .7) + 0, cue('sealPress'), .9, 0, .3)
place(sfx, boom(.7, 2.0), cue('sealPress'), .5, 0, .3)
place(music, musicbox(69, 3.0), cue('sealPress') + .02, .5, 0, .5)
place(sfx, whoosh(.45, 600, 3000, .5, .5), cue('flip'), .7, .2, .15)
place(sfx, pen(.62), cue('write'), .9, .1, .1)
for c in cues('pageFold'):
    if c['t'] < 10: place(sfx, crease(1.0, .35, .8), c['t'], .7, -.3, .2)
place(sfx, whoosh(.6, 300, 1800, .5, .4), cue('pageFly'), 1, -.6, .2)

# 2-4 · the sky, Old Moon, Pip: music box over a warm pad, half time.
place(music, pad(CH['Dadd9'], 4.6, 1.6, 1.4, 1400), 4.4, .55, 0, .5)
place(music, pad(CH['Bm'], 4.4, 1.2, 1.4, 1200), 8.6, .55, 0, .5)
place(music, pad(CH['G'], 4.4, 1.2, 1.6, 1300), 12.6, .5, 0, .5)
place(music, pad(CH['A'], 3.6, 1.0, .4, 1600), 16.8, .55, 0, .5)
L1 = cue('line1', 5.7)
for dt, m, d in [(0, 69, 1.6), (.6, 74, 1.2), (.9, 78, 1.6), (1.7, 76, 3.0), (3.1, 74, 1.6), (3.5, 73, 2.2)]:
    place(music, musicbox(m, d + .6), L1 + dt, .5, .15, .45)
place(sfx, glock(93, 1.2), cue('starGlint'), .3, .5, .5)
for dt, m, d in [(0, 66, 1.6), (.6, 71, 1.2), (.9, 74, 1.6), (1.7, 73, 2.6), (3.0, 71, 1.6), (3.6, 69, 1.6), (4.2, 66, 2.6)]:
    place(music, musicbox(m, d + .6), 9.6 + dt, .42, .25, .5)
for c in cues('snore'):
    t = tt(1.1); f = 92 * (1 - .2 * t / 1.1); ph = 2 * np.pi * np.cumsum(f) / SR
    s = filt(saw(1, t) * 0 + np.sign(np.sin(ph)) * .4, 'lp', 700) * np.sin(np.pi * t / 1.1) ** 2
    place(sfx, s, c['t'], .3, .35, .2)
place(sfx, flutter(1.2, 1.0), cue('pipEnter'), .5, -.6, .15)
place(sfx, pluck(81, .6) + 0, cue('catch'), .5, -.2, .3); place(sfx, sparkle(5, .3, 88), cue('catch'), .4, -.2, .4)
for c, m in zip(cues('crease'), [74, 78, 81, 86]):
    place(sfx, crease(.9, .28), c['t'], .55, -.1, .2); place(music, pluck(m, 1.2, 6000), c['t'], .55, 0, .35)
place(sfx, sparkle(12, .5, 86, 1.0), cue('pop'), .6, 0, .5)
place(music, bell(86, 3) + 0, cue('pop'), .25, -.3, .5); place(music, bell(90, 3), cue('pop') + .03, .2, .3, .5)
place(sfx, riser(3.0, .55), 17.0, 1, 0, .2)
snare_roll(18.0, 20.0, .7)
place(sfx, whoosh(1.2, 250, 6000, .9, .3), cue('launch'), 1, .3, .2)
place(sfx, cymbal(.6, True, 1.4), 19.4, 1, 0, .2)

# 6-9 · gameplay. Bars: Bloom 20-27, Ember 27-34 (groove from 28), Void 34-40, the fleet build 40-43.
def groove(t0, bars, chords, heavy=False, sparse=False, until=43.0):
    for b in range(bars):
        t = t0 + b * 2
        if t >= until: break
        ch = chords[b % len(chords)]
        place(music, pad(CH[ch], min(2.2, until - t + .2), .05 if heavy else .2, .3, 2600 if heavy else 1800), t, .32 if not sparse else .26, 0, .3)
        for k in range(4):
            bt = t + k * BEAT
            if bt >= until - 1e-6: break
            if not sparse or k == 0: place(music, kick(1.0), bt, .95 if heavy else .85, 0, .05, True)
            if k in (1, 3) and not sparse: place(music, stamp(1.0), bt, .55 if heavy else .45, .1, .15)
            if sparse and k == 2: place(music, stamp(.6), bt, .3, .2, .3)
            for s16 in range(4 if not sparse else 2):
                st = bt + s16 * BEAT / (4 if not sparse else 2)
                place(music, shaker(1.0 if s16 % 2 else .6), st, .4 if not sparse else .3, .35, .05)
            place(music, flick(1.0), bt + BEAT / 2, .35, -.35, .05)
            if heavy and k in (1, 3): place(music, tom(43 if k == 1 else 40, .7), bt + BEAT * .5, .5, -.2, .15)
            r = ROOT[ch] + 12
            pat = [r, r, r + 7, r + 12] if not sparse else [r - 12, None, None, None]
            if pat[k] is not None: place(music, bass(pat[k], BEAT * (.9 if not sparse else 3.8), 'sub' if sparse else 'pluck'), bt, .65, 0, 0)
            if heavy: place(music, bass(r, BEAT * .4), bt + BEAT / 2, .4, 0, 0)

groove(20.0, 4, ['D', 'Bm', 'G', 'A'], until=27.0)
place(sfx, cymbal(2.6, False, 1.2), 20.0, .6, 0, .35)
notes([(0, 69, .75), (.75, 74, .25), (1, 78, 1), (2, 76, 2), (4, 74, .5), (4.5, 76, .5), (5, 78, .5), (5.5, 81, .5), (6, 83, 1), (7, 81, 1),
       (8, 79, .75), (8.75, 78, .25), (9, 76, 1), (10, 74, 2), (12, 76, .5), (12.5, 78, .5)], 20.0, kalimba, .55, -.15, .3)
for c in game('bloom'): place(sfx, sparkle(14, .7, 86, 1.2), c['t'], .55, 0, .5); place(music, bell(74, 4), c['t'], .3, 0, .5)
# Ember: a tom fill on the page fold, then the heavier groove and the brass.
for k in range(8): place(music, tom(40 + k, .5 + k * .06, .4), 27.0 + k * BEAT / 4, .5, -.4 + k * .1, .15)
groove(28.0, 3, ['Bm', 'G', 'A'], heavy=True, until=34.0)
place(sfx, cymbal(2.2, False, 1.0), 28.0, .5, .2, .3)
notes([(0, 57, .75), (.75, 62, .25), (1, 66, 1), (2, 64, 2), (4, 62, .5), (4.5, 64, .5), (5, 66, .5), (5.5, 69, .5), (6, 71, 1), (7, 69, 1),
       (8, 69, .5), (8.5, 74, .5), (9, 78, 1), (10, 76, 1.5), (11.5, 78, .5)], 28.0, lambda m, d: brass(m, d), .5, .1, .2)
for c in cues('pageFold'):
    if 20 < c['t'] < 40: place(sfx, crease(1.1, .35), c['t'], .6, -.2, .2)
for e in game('holdOn'): place(sfx, whoosh(2.2, 150, 900, 1.0, .85), e['t'], .7, 0, .1)
for e in game('holdOff'): place(sfx, whoosh(.5, 900, 300, .8, .2), e['t'], .5, 0, .1)
for e in game('fever'):
    place(music, brass(74, 1.4, 1.3) + brass(78, 1.4, 1.1) + brass(81, 1.4, 1.0), e['t'], .45, 0, .3)
    place(sfx, sparkle(16, .8, 86, 1.0), e['t'], .5, 0, .5); place(sfx, cymbal(2.5, False, 1.0), e['t'], .7, 0, .3)
# Void: sparse, glassy, deep.
groove(34.0, 3, ['Bm', 'G', 'Em'], sparse=True, until=40.0)
place(music, boom(.8, 3.0), 34.0, .5, 0, .4)
for t0, ch in [(34, 'Bm'), (36, 'G'), (38, 'Em')]:
    for m in CH[ch][2:]: place(music, glass(m + 12, 2.2), t0, .28, rng.uniform(-.5, .5), .6)
for b, m in [(0, 78), (1.5, 83), (3, 86), (4.5, 85), (6, 83), (8, 78), (9.5, 81), (10.5, 79)]:
    place(music, rev_piano(m, 1.0), 34.0 + b * BEAT * 1 - 1.0 + .5, .35, rng.uniform(-.4, .4), .5)
for e in game('cometWarn'):
    for k in range(8): place(sfx, glock(98, .15), e['t'] + k * 1.1 / 8, .12 + k * .02, -.3, .2)
    place(sfx, whoosh(1.1, 2000, 7000, .25, .95), e['t'], 1, -.3, .2)
for e in game('tailSpark'): place(sfx, sparkle(6, .2, 93), e['t'], .5, pan_of(e), .4)
place(sfx, whoosh(1.4, 180, 1200, .9, .5), 36.6, 1, .3, .3)
# The fleet: a rising paper flick on every half-beat over a held dominant, then the cut.
place(music, pad(CH['Asus'], 3.0, .4, .05, 2200), 40.0, .4, 0, .3)
place(music, bass(33, 3.0, 'sub'), 40.0, .6, 0, 0)
for i, m in enumerate([74, 76, 78, 79, 81, 83]):
    t = 40.0 + i * BEAT; place(music, pluck(m, .8, 7000), t, .6, 0, .3); place(music, kick(.9), t, .8, 0, .05, True); place(music, bell(m + 12, 1.0), t, .12, 0, .3)
snare_roll(41.0, 43.0, .7)
place(sfx, riser(2.0, .6), 41.0, 1, 0, .2)

# Gameplay feedback from the game's own events (panned to the glider).
for e in game('tap'):
    if e['t'] < 43: place(sfx, shift_snd(e.get('dir', 1)), e['t'] - .09, .6, pan_of(e), .12)
streak_notes = [86, 88, 90, 93, 95, 98, 100]
for e in game('perfect'):
    if e['t'] > 43.5: continue
    n = max(1, int(e.get('n', 1))); m = streak_notes[min(len(streak_notes) - 1, n - 1)]
    place(sfx, bell(m, 2.5), e['t'], .4, pan_of(e), .45); place(sfx, stamp(1.2, .3) + 0, e['t'], .5, pan_of(e), .15)
for e in game('gate'):
    if e['t'] < 43: place(sfx, whoosh(.35, 800, 4000, .35, .4), e['t'] - .15, 1, pan_of(e), .1)

# 10 · the last gate: silence, a heartbeat, one music-box note as it clears.
lastgate = np.zeros((N, 2))
for t in (43.3, 44.0): place(lastgate, heartbeat(1.0), t, 1.0, 0, .1)
place(sfx, filt(noise(1.6), 'bp', (300, 1500)) * np.sin(np.linspace(0, np.pi, int(1.6 * SR))) * .06, 43.1, 1, 0, .3)
lastp = [e['t'] for e in game('perfect', 'void') if e['t'] > 43.5]
place(lastgate, musicbox(81, 4.0), lastp[0] if lastp else 44.25, .75, 0, .9)
place(sfx, cymbal(1.2, True, .8), cue('flash', 44.85) - 1.05, .5, 0, .2)

# 11 · Moonrise: free time; the theme in full.
place(sfx, sparkle(6, .25, 86), cue('unpop'), .4, -.3, .4)
for c, m in zip(cues('uncrease'), [86, 81, 78]): place(sfx, crease(.7, .25), c['t'], .45, -.3, .2); place(music, pluck(m, 1.0, 6000), c['t'], .4, -.2, .4)
place(sfx, whoosh(.6, 500, 2500, .5, .5), cue('slip'), 1, .2, .3)
place(music, glock(86, 2.0), cue('wake'), .5, .3, .6); place(music, glock(90, 2.0), cue('wake') + .12, .4, .3, .6)
place(sfx, whoosh(1.2, 120, 900, .8, .6), cue('curtain'), 1, 0, .3)
MR = cue('moonrise', 47.5)
place(music, boom(1.3, 4.0), MR, .9, 0, .4); place(sfx, cymbal(4.5, False, 1.3), MR, .7, 0, .5)
place(music, pad(CH['G'], 2.5, .3, .8, 3000), MR - .5, .55, 0, .5); place(music, choir([55, 62, 67, 71], 2.6, .4, .9), MR - .5, .5, 0, .6)
place(music, pad(CH['D'], 4.0, .2, 1.8, 3200), 49.4, .55, 0, .5); place(music, choir([50, 57, 62, 66, 69], 4.4, .2, 2.2), 49.4, .5, 0, .6)
place(music, bass(31, 2.0, 'sub'), MR - .5, .6, 0, 0); place(music, bass(38, 3.5, 'sub'), 49.4, .55, 0, 0)
for dt, m, d in [(0, 69, 1), (.45, 74, .6), (.7, 78, 1.0), (1.3, 76, 1.8), (2.2, 74, .6), (2.5, 76, .6), (2.8, 78, .6), (3.1, 81, 1.4)]:
    place(music, bell(m, d + 2.5), MR + dt, .3, 0, .55); place(music, musicbox(m + 12, d + 1.2), MR + dt, .25, .2, .5)
for k in range(22): place(sfx, glock([86, 88, 90, 93, 95, 98][k % 6] + 12 * (k % 3 == 0), .9), 47.4 + k * .055 + rng.uniform(0, .03), .14, rng.uniform(-.8, .8), .5)
for k in range(14): place(music, pluck(62 + [0, 2, 4, 7, 9][k % 5] + 12 * (k // 5), 1.2, 8000), cue('threads') + k * .045, .25, -.6 + k * .09, .5)
place(sfx, sparkle(10, .8, 81), cue('islands'), .35, 0, .5)

# 12-13 · title and end card: tempo returns; SHIFT lands on the downbeat.
place(sfx, whoosh(1.0, 300, 3500, .7, .55), cue('orbitDraw'), 1, -.4, .25)
for c, m in zip(cues('letterPop'), [74, 78, 81, 86]): place(music, pluck(m, 1.1, 7000), c['t'], .6, -.4 + .2 * c.get('i', 0), .3); place(sfx, crease(.5, .15), c['t'], .4, 0, .1)
SH = cue('shift', 52.0)
place(sfx, whoosh(.25, 3000, 600, .8, .7), SH - .2, 1, .6, .1)
place(music, kick(1.5, .8), SH, 1.0, 0, .2, True); place(music, stamp(1.5), SH, .7, 0, .3); place(sfx, cymbal(3.0, False, 1.4), SH, .6, 0, .4)
for m in (62, 69, 74, 78): place(music, bell(m + 12, 3.5), SH, .22, rng.uniform(-.3, .3), .5)
place(sfx, whoosh(.8, 2500, 9000, .3, .5), cue('glint'), 1, -.5, .3)
place(sfx, flutter(.9, .8), cue('pipLand'), .4, -.5, .2)
for b in range(3):
    t = 52.0 + b * 2; ch = ['D', 'G', 'A'][b]
    place(music, pad(CH[ch], 2.2, .1, .4, 2400), t, .3, 0, .35)
    for k in range(4):
        bt = t + k * BEAT
        if bt >= 55.0: break
        if k in (0, 2) and not (b == 0 and k == 0): place(music, kick(.9), bt, .7, 0, .05, True)
        if k == 2: place(music, stamp(.8), bt, .35, .1, .2)
        place(music, shaker(.8), bt + BEAT / 2, .3, .3, .05)
        place(music, bass(ROOT[ch] + 12, BEAT * .9), bt, .5, 0, 0)
notes([(0, 69, .75), (.75, 74, .25), (1, 78, 1), (2, 76, 2), (4, 74, .5), (4.5, 76, .5), (5, 78, .5), (5.5, 81, .5)], 52.0 + .0, kalimba, .45, -.1, .3)
# End card: a held chord, chimes, the seal and the wordmark's ticks again.
place(music, pad(CH['Dadd9'], 5.6, .6, 2.6, 2000), 55.0, .5, 0, .6); place(music, choir([62, 66, 69, 76], 5.4, 1.0, 2.6), 55.0, .25, 0, .6)
place(music, bass(38, 5.0, 'sub'), 55.0, .5, 0, 0)
place(music, glock(86, 1.5), cue('tagline'), .25, -.2, .5); place(music, glock(90, 1.5), cue('store'), .22, .2, .5); place(music, glock(93, 1.5), cue('noads'), .2, 0, .5)
ES = cue('endSeal', 57.0)
place(sfx, squelch(.8), ES, .6, -.15, .2); place(sfx, kick(1.1, .7), ES + .1, .7, -.15, .3)
for c in cues('pixel'): place(sfx, pluck(74 + int(c.get('p', .5) * 14), .22, 6000), ES + .15 + c['t'] - .22, .07, (c.get('p', .5) - .5) * .5, .2)
for dt, m, d in [(0, 69, 1.4), (.55, 74, 1), (.8, 78, 1.4), (1.5, 76, 3.5)]:
    place(music, musicbox(m, d + 1.5), ES + .3 + dt, .45, 0, .6)

# ---------------------------------------------------------------- mix
def reverb_ir(d=2.6, rt=2.3):
    t = tt(d); ir = np.zeros((len(t), 2))
    for ch in range(2):
        nz = rng.standard_normal(len(t)) * np.exp(-t * 6.9 / rt)
        nz = filt(nz, 'lp', 6500); nz = filt(nz, 'hp', 180)
        ir[:, ch] = nz
    for k, (dt, a) in enumerate([(.011, .5), (.019, .4), (.027, .35), (.041, .3)]): ir[int(dt * SR), k % 2] += a * 8
    return ir / np.sqrt((ir ** 2).sum(0, keepdims=True)) * .9

ir = reverb_ir()
wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], 1)
# Sidechain: the pads and bass breathe with the kick.
envd = filt(np.minimum(1, duck_src * 2.5), 'lp', 12); duck = 1 - .35 * np.clip(envd / max(1e-6, envd.max()), 0, 1)
# The last gate: everything but the heartbeat and the one note falls away (43.0-44.2 s).
tt_ = np.arange(N) / SR
hush = 1 - .88 * np.clip((tt_ - 43.0) / .08, 0, 1) * np.clip((44.9 - tt_) / .7, 0, 1)
quiet = music * duck[:, None]
mix = (quiet + wet * .55) * hush[:, None] + lastgate + sfx * np.maximum(hush, .6)[:, None]
mix = filt(mix.T, 'hp', 28).T

def loudness(x):
    # ITU-R BS.1770 K-weighting at 48 kHz, 400 ms blocks with 75% overlap, absolute and relative gates.
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, .73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, .99007225036621]
    y = signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=0), axis=0)
    blk, hop = int(.4 * SR), int(.1 * SR)
    z = np.array([np.mean(y[i:i + blk] ** 2, 0).sum() for i in range(0, len(y) - blk, hop)])
    lk = -.691 + 10 * np.log10(z + 1e-12); z = z[lk > -70]
    rel = -.691 + 10 * np.log10(z.mean()) - 10; lk = -.691 + 10 * np.log10(z + 1e-12)
    return -.691 + 10 * np.log10(z[lk > rel].mean())

# Glue compression (gentle) then loudness to -14 LUFS, then a look-ahead peak limiter at -1 dBFS.
lvl = filt(np.abs(mix).max(1), 'lp', 8); thr = 10 ** (-12 / 20)
gain = np.where(lvl > thr, (thr / np.maximum(lvl, 1e-9)) ** (1 - 1 / 2.0), 1.0)
mix *= filt(gain, 'lp', 20)[:, None]
mix *= 10 ** ((-14.0 - loudness(mix)) / 20)
ceil = 10 ** (-1.0 / 20); la = int(.004 * SR)
peak = np.abs(mix).max(1); peak = np.maximum.reduce([np.roll(peak, -k) for k in range(0, la, 8)])
g = np.minimum(1, ceil / np.maximum(peak, 1e-9)); g = np.minimum.accumulate(g[::-1])[::-1] if False else g
g = filt(g, 'lp', 60); g = np.minimum(g, ceil / np.maximum(np.abs(mix).max(1), 1e-9))
mix *= g[:, None]
fo = int(.9 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
print(f'loudness {loudness(mix):.1f} LUFS, peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS')
import wave
with wave.open(out_path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix[:int(60.0 * SR)], -1, 1) * 32767).astype('<i2').tobytes())
print('wrote', out_path)
