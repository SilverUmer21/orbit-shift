# Merge the events.json files of parallel render ranges (each range replays its shot from the start, so game events
# before its own start are duplicates): keep each event once, by type, time and shot.
import json, sys
out, parts = sys.argv[1], sys.argv[2:]
cues, game, seen = None, [], set()
for p in parts:
    d = json.load(open(p)); cues = cues or d['cues']
    for e in d['game']:
        k = (e['type'], round(e['t'], 3), e.get('shot'))
        if k not in seen: seen.add(k); game.append(e)
game.sort(key=lambda e: e['t'])
json.dump({'fps': 60, 'cues': cues, 'game': game}, open(out, 'w'), indent=1)
print(len(game), 'game events,', len(cues), 'cues')
