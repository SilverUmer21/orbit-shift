# Orbit Shift · "Fly Them Home" short cuts (30 s story cut, 15 s teaser) from a rendered film and its score.
#   python3 film/cuts.py <frames dir> <score.wav> <out dir> [suffix]
# Every cut is on a bar line of the score (120 BPM, one bar = 2 s, bars on even film seconds), so the groove never skips
# a beat; the audio joins with short equal-power crossfades and the last 0.6 s fades out.
import os, subprocess, sys, tempfile
import numpy as np
from scipy.io import wavfile

CUTS = {
    # Ready, pilot? → Bloom (tap, thread, perfects, the planet blooms) → Express Post → Void perfects, the fleet, the
    # last gate, Moonrise, "Fly them home." → the logo and the end card.
    'story-30s': [(17.0, 26.0), (30.0, 34.0), (38.0, 50.0), (54.0, 59.0)],
    # Hook first: a perfect in the Void, the six planes on the beat, the last gate, Moonrise → logo and end card.
    'teaser-15s': [(38.0, 48.0), (54.0, 59.0)],
}
FPS, XF, FADE = 60, .02, .6

frames, score, out = sys.argv[1], sys.argv[2], sys.argv[3]
suffix = sys.argv[4] if len(sys.argv) > 4 else ''
sr, audio = wavfile.read(score)
audio = audio.astype(np.float64) / (32768.0 if audio.dtype == np.int16 else 1.0)
os.makedirs(out, exist_ok=True)

for name, segs in CUTS.items():
    # Audio: each segment keeps XF seconds of its neighbours' material for an equal-power crossfade across the cut.
    x, n = int(XF * sr), sum(int(round((b - a) * sr)) for a, b in segs)
    padded = np.pad(audio, ((x, x), (0, 0)))
    ramp = np.sin(np.linspace(0, np.pi / 2, 2 * x))[:, None]
    mix, pos = np.zeros((n + 2 * x, audio.shape[1])), 0
    for i, (a, b) in enumerate(segs):
        s0, s1 = int(round(a * sr)), int(round(b * sr))
        chunk = padded[s0:s1 + 2 * x].copy()   # s0 - x .. s1 + x in the original
        if i > 0: chunk[:2 * x] *= ramp
        if i < len(segs) - 1: chunk[-2 * x:] *= ramp[::-1]
        mix[pos:pos + len(chunk)] += chunk
        pos += s1 - s0
    mix = mix[x:x + n]
    f = int(FADE * sr); mix[-f:] *= np.linspace(1, 0, f)[:, None] ** 2
    dur = n / sr
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        wavfile.write(wav, sr, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
        # Video: the segments' frames, renumbered as one sequence.
        k = 0
        for a, b in segs:
            for fr in range(int(round(a * FPS)), int(round(b * FPS))):
                os.symlink(os.path.abspath(os.path.join(frames, f'f{fr:05d}.jpg')), os.path.join(tmp, f'c{k:05d}.jpg')); k += 1
        dst = os.path.join(out, f'orbit-shift-fly-them-home-{name}{suffix}.mp4')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(tmp, 'c%05d.jpg'), '-i', wav,
                        '-vf', f'fade=t=out:st={dur - FADE:.3f}:d={FADE}', '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high',
                        '-pix_fmt', 'yuv420p', '-crf', '23', '-g', '120', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k',
                        '-shortest', dst], check=True)
        print(name, f'{dur:.2f} s', k, 'frames ->', dst)
