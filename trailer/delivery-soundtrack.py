# Orbit Shift · Trailer B "Special Delivery" soundtrack, synthesised from the render's event log so every hit lands on
# its frame. Reuses the Night Mail palette (paper percussion, music box, warm pad, bells) with a calmer arc:
# lullaby under the envelope and Home -> groove under the take -> slow-motion heartbeat -> postmark -> lighter groove
# with the melody under rewards, Hangar and Night Post -> final chord on the logo.
#   python3 trailer/delivery-soundtrack.py trailer/out-delivery/events.json trailer/out-delivery/soundtrack.wav
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

def hz(note): return 440.0 * 2 ** ((note - 69) / 12)

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
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + .25 * band(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t * 90)
    return s * gain

def shaker(d=.09):
    t = tt(d); return band(rng.standard_normal(len(t)), 5000, 12000) * np.exp(-t * 55) * .5

def snap(d=.16):  # paper snap: bright noise crack with a body
    t = tt(d)
    return band(rng.standard_normal(len(t)), 1200, 7000) * np.exp(-t * 40) * .7 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .4

def crack():  # wax seal: a short dry snap plus a low knock
    t = tt(.25)
    return band(rng.standard_normal(len(t)), 900, 9000) * np.exp(-t * 60) * .9 + np.sin(2 * np.pi * np.cumsum(140 + 200 * np.exp(-t * 40)) / SR) * np.exp(-t * 22) * .6

def tock(up):
    t = tt(.18); f = 760 if up > 0 else 620
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 34)

def tick(d=.05):
    t = tt(d); return band(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 120) + np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 90) * .3

def swish(d=.45, lo=600, hi=6000):  # paper movement
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

def fold_sfx(t0):  # a letter folding: two crisp creases and a slide
    place(swish(.3, 900, 7000), t0, .55, -.2); place(snap(), t0 + .12, .5, -.1); place(snap(), t0 + .3, .45, .1)
    place(swish(.45, 1500, 9000), t0 + .45, .35, .2)

# ---------- events
env_in, seal, flap, letter_out, unfold = first('envIn', .55), first('seal', 1.42), first('flap', 1.5), first('letterOut', 1.95), first('unfold', 2.55)
press, dissolve = first('press', 7.45), first('dissolve', 7.5)
slow, stamp = first('slow'), first('stamp')
folds = times('fold'); slides = times('slide')
hold_on, hold_off = first('holdOn'), first('holdOff')
awaken, results, card = first('awaken'), first('results'), first('card')
pick, buy, mail_tab, card_flip, logo = first('pick'), first('buy'), first('mailTab'), first('cardFlip'), first('logo')
BEAT = 60 / 100

# Opener and premise: a music-box lullaby over a warm pad.
lullaby = [(0, 74), (.3, 78), (.6, 81), (.9, 78), (1.2, 86), (1.65, 85), (1.95, 81), (2.4, 78), (2.7, 81), (3.0, 83), (3.6, 81),
           (4.2, 74), (4.5, 78), (4.8, 81), (5.1, 86), (5.55, 88), (5.85, 86), (6.3, 85), (6.75, 81)]
for dt, n in lullaby: place(musicbox(n), .15 + dt, .26, .2)
place(pad([50, 57, 62, 66], dissolve + .3, attack=1.2, release=.5), 0, .28)
place(pad([38], dissolve + .3, attack=1.5, release=.5), 0, .15)
place(swish(.8, 300, 3000), env_in - .45, .4, -.3)                     # the envelope drifts in
place(crack(), seal, .7); place(sparkle(.6, 91), seal + .03, .45, .2)  # the seal cracks
place(swish(.4, 700, 5000), flap, .5)                                  # the flap opens
place(swish(.6, 1500, 8000), letter_out, .45, .1)                      # the letter slides out
place(snap(), unfold, .45, -.15); place(snap(), unfold + .17, .4, .15); place(bell(86, 1.5), unfold + .35, .22)
for t in times('tag'): place(tick(), t, .28, .25); place(swish(.18, 2500, 9000), t, .2, .25)

# PLAY: a button thunk, then the groove starts on the dissolve.
place(kick(.3, .6), press, .5); place(tock(1), press, .35)

prog = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]  # D  Bm  G  A
def groove(start, end, base=1.0, chords=True):
    b, i = start, 0
    while b < end - .05:
        bar_beat = i % 4
        if bar_beat in (0, 2): place(kick(), b, .58 * base)
        if bar_beat in (1, 3): place(snap(), b, .42 * base, .15)
        for sub in range(2):
            st = b + sub * BEAT / 2
            if st < end: place(shaker(), st, .2 * base, -.25 if sub % 2 else .25)
        if chords and i % 8 == 0:
            ch = prog[(i // 8) % 4]
            place(pad(ch, min(BEAT * 8, end - b) + .3, attack=.25, release=.5), b, .4 * base)
            place(pad([ch[0] - 12], min(BEAT * 8, end - b) + .3, attack=.05, release=.4), b, .3 * base)
        b += BEAT; i += 1

take_end = slow if slow else dissolve + 9.6
groove(dissolve, take_end, 1.25)
for e in ev:
    if e['type'] == 'tap': place(tock(e.get('dir', 1)), e['video'], .55, -.2 if e.get('dir', 1) < 0 else .2)
gate_notes = [79, 83, 86, 88]; gi = 0
for e in ev:
    if e['type'] == 'gate': place(bell(gate_notes[gi % len(gate_notes)], 1.4), e['video'], .3, .1); gi += 1
for e in ev:
    if e['type'] == 'perfect': place(bell(91 + 2 * min(3, e.get('n', 1)), 1.6), e['video'] + .01, .28, -.1)

# Slow motion: the groove drops to a held pad and a heartbeat; the postmark lands with a thud and a gold chord.
if slow and stamp:
    place(pad([38, 50, 57], stamp - slow + .1, attack=.4, release=.08), slow, .5)
    k = 0
    while slow + .4 + k * .75 < stamp - .1: place(kick(.35, .8), slow + .4 + k * .75, .62); k += 1
    place(whoosh(.7, rise=True), stamp - .7, .4)
    place(thud(), stamp, 1.0)
    for n, d in ((74, 0), (78, .02), (81, .04), (86, .06), (90, .09)): place(bell(n, 2.8), stamp + d, .3)
    place(sparkle(1.0, 86), stamp + .1, .42)
    place(pad([50, 57, 62, 66, 69], (folds[0] if folds else stamp + 1.8) - stamp + .4, attack=.2, release=.5), stamp, .45)

# Hold (Ember): the fold into it, a lower groove, the tuck whoosh.
if folds:
    fold_sfx(folds[0] - .02)
    hold_end = awaken if awaken else folds[0] + 4.5
    groove(folds[0] + .3, hold_end, .85)
    place(pad([38, 45], hold_end - folds[0], attack=.4, release=.4), folds[0], .32)
if hold_on is not None and hold_off is not None:
    place(whoosh(hold_off - hold_on + .25, rise=True), hold_on, .6)
    place(whoosh(.55, rise=False), hold_off, .32)

# Rewards: the furnace lights (swell), results beats, the card pops.
if awaken:
    place(pad([50, 57, 62, 66, 69], 2.4, attack=.25, release=1.0), awaken, .6)
    place(pad([38], 2.4, attack=.1, release=.9), awaken, .3)
    place(sparkle(1.4, 81), awaken + .15, .45); place(swish(1.0, 2000, 9000), awaken, .3)
if results:
    for k in range(3): place(bell(84 + k * 4, 1.0), results + .2 + k * .18, .22, -.2 + k * .2)
    for k in range(8): place(tick(), results + .05 + k * .1, .18)
if card:
    place(swish(.35, 1200, 8000), card - .05, .4)
    for n, d in ((79, 0), (83, .05), (86, .1), (91, .16)): place(bell(n, 1.6), card + d, .26)

# Hangar and Night Post: a light groove with the music-box melody; slides, picks, the purchase and the card turn.
meta_from = results if results else (awaken or 26.0) + 1.3
meta_end = folds[1] if len(folds) > 1 else DUR - 4
groove(meta_from, meta_end, .8)
melody = [74, 78, 81, 86, 85, 81, 78, 81, 83, 81, 78, 74, 76, 78, 81, 83, 86, 83, 81, 78, 81, 78, 76, 74]
for k, n in enumerate(melody):
    t = meta_from + .3 + k * BEAT
    if t < meta_end - .2: place(musicbox(n, 1.2), t, .24, .25)
for t in slides: place(swish(.55, 800, 7000), t, .55, -.3)
if pick: place(tick(), pick, .4); place(tock(1), pick, .25)
if buy:
    place(tock(1), buy, .3); place(swish(.5, 1000, 8000), buy + .05, .35)
    for n, d in ((74, .1), (81, .16), (86, .22), (90, .3)): place(bell(n, 1.8), buy + d, .26)
    place(sparkle(1.0, 88), buy + .3, .4)
if mail_tab: place(tick(), mail_tab, .4)
if card_flip: place(swish(.3, 1500, 8000), card_flip, .5); place(snap(), card_flip + .14, .3)

# End card: the letter folds up to Pip; the final chord on the logo, Pip's chirp, ring out.
if len(folds) > 1: fold_sfx(folds[1] - .02)
if logo:
    place(kick(), logo, .65)
    place(pad([50, 57, 62, 66, 74], DUR - logo + .1, attack=.05, release=1.6), logo, .7)
    place(pad([38], DUR - logo + .1, attack=.02, release=1.6), logo, .35)
    for n, d in ((74, 0), (81, .06), (86, .12), (90, .18)): place(bell(n, 2.0), logo + d, .3)
    chirp = tt(.22)
    place(np.sin(2 * np.pi * np.cumsum(1800 + 1400 * chirp / .22) / SR) * np.exp(-chirp * 14) * .3, logo + .35, 1, -.2)
    place(np.sin(2 * np.pi * np.cumsum(2400 + 900 * chirp / .22) / SR) * np.exp(-chirp * 14) * .25, logo + .52, 1, -.2)

# ---------- room + master
ir_t = tt(1.6); ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.2)[:, None]; ir[:int(.012 * SR)] = 0
wet = np.zeros_like(mix)
L = len(mix) + len(ir)
for c in range(2):
    wet[:, c] = np.fft.irfft(np.fft.rfft(mix[:, c], L) * np.fft.rfft(ir[:, c], L), L)[:len(mix)]
out = mix + wet * (.18 / np.max(np.abs(wet) + 1e-9) * np.max(np.abs(mix)))
out = out[:int(DUR * SR)]
fade = int(.6 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
# Low cut under 35 Hz and a -4 dB shelf under ~100 Hz (phone speakers), then a soft limiter.
for c in range(2):
    f = np.fft.rfft(out[:, c]); fr = np.fft.rfftfreq(len(out), 1 / SR); f *= np.clip((fr - 20) / 25, 0, 1) * (.6 + .4 * np.clip((fr - 70) / 90, 0, 1)); out[:, c] = np.fft.irfft(f, len(out))
out = np.tanh(out / np.percentile(np.abs(out), 99.97) * 1.1) * .86
with wave.open(out_path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('wrote', out_path, f'{len(out) / SR:.2f}s')
