# Orbit Shift · "The Night Mail" soundtrack. Synthesised from the render's event log so every hit lands on its frame.
#   python3 trailer/soundtrack.py trailer/out/events.json trailer/out/soundtrack.wav
# Palette: paper percussion (kick thump, shaker, wood tock), a music box for Pip, warm pad, bells for gates and postmarks.
import json, sys, wave
import numpy as np

SR = 44100
events_path, out_path = sys.argv[1], sys.argv[2]
log = json.load(open(events_path))
DUR = log['frames'] / log['fps']
N = int(DUR * SR) + SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(20261019)
ev = log['events']
def times(kind): return [e['video'] for e in ev if e['type'] == kind]
def first(kind, default=None):
    t = times(kind); return t[0] if t else default

def hz(note):  # MIDI note -> Hz
    return 440.0 * 2 ** ((note - 69) / 12)

def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[:N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.414
    mix[i:i + len(sig), 1] += sig * gain * r * 1.414

def tt(d): return np.arange(int(d * SR)) / SR

def band(noise, lo, hi):
    f = np.fft.rfft(noise); fr = np.fft.rfftfreq(len(noise), 1 / SR)
    f[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(f, len(noise))

# ---------- instruments
def musicbox(note, d=1.6):
    t = tt(d); f = hz(note)
    s = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 6) + .18 * np.sin(2 * np.pi * f * 4.2 * t) * np.exp(-t * 14))
    return s * np.exp(-t * 3.2) * np.minimum(1, t * 400)

def bell(note, d=2.4):
    t = tt(d); f = hz(note)
    parts = [(1, 1, 1.6), (2.0, .5, 2.4), (2.76, .35, 3.4), (5.4, .2, 6), (8.9, .08, 9)]
    s = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for m, a, k in parts)
    return s * np.minimum(1, t * 600) * .6

def pad(notes, d, attack=.6, release=.8):
    t = tt(d); s = np.zeros_like(t)
    for n in notes:
        for det in (-.07, .07):
            f = hz(n + det)
            for h in range(1, 6): s += np.sin(2 * np.pi * f * h * t + h) / h ** 1.7
    env = np.minimum(1, t / attack) * np.minimum(1, (d - t) / release)
    return s * np.clip(env, 0, 1) / (len(notes) * 4)

def kick(d=.42, gain=1.0):
    t = tt(d); f = 46 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 9) + .25 * band(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t * 90)
    return s * gain

def shaker(d=.09):
    t = tt(d); return band(rng.standard_normal(len(t)), 5000, 12000) * np.exp(-t * 55) * .5

def snap(d=.16):  # paper snap: bright noise crack with a body
    t = tt(d)
    return band(rng.standard_normal(len(t)), 1200, 7000) * np.exp(-t * 40) * .7 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .4

def tock(up):
    t = tt(.18); f = 760 if up > 0 else 620
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 34)

def tick(d=.05):
    t = tt(d); return band(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 120) + np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 90) * .3

def swish(d=.45, lo=600, hi=6000):  # page turn
    t = tt(d); n = band(rng.standard_normal(len(t)), lo, hi)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2 * (1 - .5 * t / d)
    return n * env * .55

def whoosh(d, rise=True):
    t = tt(d); x = t / d
    lows = band(rng.standard_normal(len(t)), 200, 1400); highs = band(rng.standard_normal(len(t)), 1400, 7000)
    k = x if rise else 1 - x
    env = np.minimum(1, x * 6) * np.minimum(1, (1 - x) * 5)
    tone = np.sin(2 * np.pi * np.cumsum(220 + 440 * k) / SR) * .15
    return ((1 - k) * lows + k * highs * 1.3 + tone) * env * .5

def thud():
    t = tt(.9); f = 38 + 70 * np.exp(-t * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 1.3 + band(rng.standard_normal(len(t)), 80, 900) * np.exp(-t * 14) * .6

def sparkle(d=1.2, base=84):
    out = np.zeros(int(d * SR))
    for k in range(9):
        s = bell(base + [0, 4, 7, 12, 16, 19, 24, 19, 16][k], .7) * .25
        i = int(k * d / 11 * SR); out[i:i + len(s)] += s[:len(out) - i]
    return out

def heartbeat():
    return kick(.35, .8)

# ---------- score
hush, cut = first('hush', .93), first('cut', 2.5)
curtain, present = first('curtain', 2.53), first('present', 3.27)
hold_on, hold_off = first('holdOn'), first('holdOff')
turns = times('turn'); stamp = first('stamp'); bloom = first('bloom'); letter = first('letter'); logo = first('logo')
s3 = [e['video'] for e in ev if e['type'] == 'tap'][0] - .6 if times('tap') else 5.0
BEAT = 60 / 100

# S1 hook: tick-tock that slows with the slow motion, a low drone, silence on the cut.
t, k = .0, 0
while t < cut - .14:
    tv = t; sp = 1 if tv < .9 else max(.1, 1 - .9 * min(1, (tv - .9) / .9))
    place(tick(), t, .5 if k % 2 == 0 else .32, -.3 if k % 2 else .3); k += 1
    t += .3 / sp
place(pad([38, 45], cut - .05, attack=.3, release=.12), 0, .3)
place(whoosh(1.2, rise=False), hush, .25)
place(heartbeat(), hush + .5, .7); place(heartbeat(), hush + 1.05, .55)
for p in times('perfect'):
    if p < cut: place(bell(86, 1.6), p, .35)

# S2 story: curtain swish, music box lullaby, Pip's present chime.
place(swish(.7, 300, 5000), curtain, .9)
lullaby = [(0, 74), (.3, 78), (.6, 81), (.9, 78), (1.2, 86), (1.65, 85), (1.95, 81)]
for dt, n in lullaby: place(musicbox(n), curtain + .25 + dt, .32, .2)
place(pad([50, 57, 62, 66], s3 - curtain + .2, attack=.8, release=.4), curtain, .45)
place(bell(93, 1.2), present + .15, .22, -.3)

# Groove: S3..S5 (paper percussion at 100 BPM) and a lighter one in S7.
prog = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]  # D  Bm  G  A
def groove(start, end, base=1.0, chords=True, dense_from=None):
    b, i = start, 0
    while b < end - .05:
        density = 1.3 if dense_from is not None and b >= dense_from - .01 else base
        bar_beat = i % 4
        if bar_beat in (0, 2) or (density > 1.2 and bar_beat == 3): place(kick(), b, .62)
        if bar_beat in (1, 3): place(snap(), b, .45 * density, .15)
        for sub in range(2 if density < 1.2 else 4):
            st = b + sub * BEAT / (2 if density < 1.2 else 4)
            if st < end: place(shaker(), st, .22 * density, -.25 if sub % 2 else .25)
        if chords and i % 8 == 0:
            ch = prog[(i // 8) % 4]
            place(pad(ch, min(BEAT * 8, end - b) + .3, attack=.25, release=.5), b, .42)
            place(pad([ch[0] - 12], min(BEAT * 8, end - b) + .3, attack=.05, release=.4), b, .28)
        b += BEAT; i += 1

end_s5 = (stamp - 2.6) if stamp else 19.0
groove(s3, end_s5, 1.0, dense_from=turns[0] if turns else None)  # build: double-time shakers once the page turns start

# Taps and gates on the run.
for e in ev:
    if e['type'] == 'tap': place(tock(e.get('dir', 1)), e['video'], .55, -.2 if e.get('dir', 1) < 0 else .2)
gate_notes = [74, 76, 78, 81, 83, 86, 88]
gi = 0
for e in ev:
    if e['type'] == 'gate' and cut < e['video'] < end_s5:
        place(bell(gate_notes[gi % len(gate_notes)], 1.4), e['video'], .3, .1); gi += 1

# S4 hold: rising whoosh while tucked, release breath after.
if hold_on is not None and hold_off is not None:
    place(whoosh(hold_off - hold_on + .2, rise=True), hold_on, .55)
    place(whoosh(.5, rise=False), hold_off, .3)

# Page turns, the ember heat, the comet.
for t in turns: place(swish(), t - .12, .8, -.2)
if len(turns) >= 2: place(pad([38, 45], 2.0, attack=.2, release=.5), turns[1], .5)
if len(turns) >= 3:
    place(whoosh(.9, rise=True), turns[2] + .2, .35, .4)
    place(sparkle(.7, 88), turns[2] + 1.15, .5, .3)

# S6 payoff: drop to a pad + heartbeat in slow motion, then the postmark: thud, gold chord, bloom swell.
if stamp:
    s6 = stamp - 2.6
    place(pad([38, 50, 57], stamp - s6 + .1, attack=.4, release=.08), s6, .5)
    for k in range(3): place(heartbeat(), s6 + .5 + k * .7, .7)
    place(whoosh(.6, rise=True), stamp - .6, .4)
    place(thud(), stamp, 1.0)
    for n, d in ((74, 0), (78, .02), (81, .04), (86, .06), (90, .09)): place(bell(n, 2.8), stamp + d, .32)
    place(sparkle(1.0, 86), stamp + .1, .45)
if bloom:
    place(pad([50, 57, 62, 66, 69], 3.0, attack=.25, release=1.2), bloom, .7)
    place(pad([38], 3.0, attack=.1, release=1.0), bloom, .35)
    place(sparkle(1.6, 81), bloom + .2, .5)
    place(swish(1.0, 2000, 9000), bloom, .3)

# S7 world: the music box returns over a soft groove; tonight's letter chimes.
s7 = turns[3] if len(turns) >= 4 else 24.0
end_s7 = logo - .17 if logo else 28.0
groove(s7, end_s7, .7)
melody = [74, 78, 81, 86, 85, 81, 78, 81, 83, 81, 78, 74]
for k, n in enumerate(melody): place(musicbox(n, 1.2), s7 + .1 + k * BEAT / 2, .26, .25)
if letter:
    place(swish(.35, 1500, 7000), letter - .05, .5)
    place(bell(90, 1.5), letter + .1, .3, -.2); place(bell(95, 1.5), letter + .25, .22, -.2)

# S8 end card: final chord, Pip chirp, ring out.
if logo:
    place(kick(), logo - .1, .7)
    place(pad([50, 57, 62, 66, 74], DUR - logo + .1, attack=.05, release=1.6), logo - .1, .7)
    place(pad([38], DUR - logo + .1, attack=.02, release=1.6), logo - .1, .35)
    for n, d in ((74, 0), (81, .06), (86, .12), (90, .18)): place(bell(n, 2.0), logo - .1 + d, .3)
    chirp = tt(.22); place(np.sin(2 * np.pi * np.cumsum(1800 + 1400 * chirp / .22) / SR) * np.exp(-chirp * 14) * .3, logo + .45, 1, -.2)
    place(np.sin(2 * np.pi * np.cumsum(2400 + 900 * chirp / .22) / SR) * np.exp(-chirp * 14) * .25, logo + .62, 1, -.2)

# ---------- room + master
ir_t = tt(1.6); ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.2)[:, None]; ir[:int(.012 * SR)] = 0
wet = np.zeros_like(mix)
L = len(mix) + len(ir)
for c in range(2):
    wet[:, c] = np.fft.irfft(np.fft.rfft(mix[:, c], L) * np.fft.rfft(ir[:, c], L), L)[:len(mix)]
out = mix + wet * (.18 / np.max(np.abs(wet) + 1e-9) * np.max(np.abs(mix)))
out = out[:int(DUR * SR)]
# Silence on the hard cut, then the curtain.
c0, c1 = int((cut - .1) * SR), int((cut + .02) * SR)
out[c0:c1] *= np.linspace(1, 0, c1 - c0)[:, None]; out[c1:int(curtain * SR)] = 0
fade = int(.5 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
# Low cut under 35 Hz and a -4 dB shelf under ~100 Hz (phone speakers), then a soft limiter.
for c in range(2):
    f = np.fft.rfft(out[:, c]); fr = np.fft.rfftfreq(len(out), 1 / SR); f *= np.clip((fr - 20) / 25, 0, 1) * (.6 + .4 * np.clip((fr - 70) / 90, 0, 1)); out[:, c] = np.fft.irfft(f, len(out))
out = np.tanh(out / np.percentile(np.abs(out), 99.97) * 1.1) * .86
with wave.open(out_path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('wrote', out_path, f'{len(out) / SR:.2f}s')
