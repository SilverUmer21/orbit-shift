# Film B — "Fly Them Home" (60 s presentation film)

Approved by the owner on 2026-10-22 (concept A with C's fold transitions and B's beat-synced taps). Work lives on the `intro` branch, tooling in `film/`.

**Purpose.** The Night Mail trailer (30 s, vertical) sells the mechanic. This film presents the game: who made it (Blitzedo), what world it is, why it feels good, and why you'd want to play.

**Format.** 16:9, 1920×1080, 60 fps, stereo. Real gameplay from the game itself on a virtual clock; story scenes drawn by the film compositor. Nothing in the game changes.

**Story.** One letter, addressed *To Moon*, travels from the studio's hands to the Moon. The game's logline is split into bookends: it opens on *"Every star is a letter that never arrived."* and closes on *"Fly them home."* The film starts dark and gets brighter every time mail moves; Moonrise is the first full exposure.

## Beat sheet (120 BPM, one bar = 2 s)

| Time | Picture | Sound |
|---|---|---|
| 0:00–0:02.6 | **Studio.** Black. The pixel "blit" builds block by block, the red glow runs through it, "zedo" settles in (the website's own wordmark animation). | A wood tick per block, rising; a low thoom. |
| 0:02.6–0:05 | **The seal.** One spark falls onto ivory paper; red wax spreads and a seal with the pixel b presses down. The envelope turns over: *To Moon*. The studio black folds away like paper into the Paper Night sky. | Wax squash and thunk, paper turn, pen. |
| 0:05–0:09 | **The sleeping sky.** Cut-paper layers with depth of field. A star up close is a tiny sealed envelope. *Every star is a letter that never arrived.* | Music-box theme, warm pad, paper rustle. |
| 0:09–0:13 | **Old Moon.** Asleep in a nightcap behind the dark paper curtain (the Eclipse); the islands below are dark. No text. | Theme in minor, a tiny snore. |
| 0:13–0:18 | **Pip.** Pip catches the letter and folds it into the glider on four beats. *Ready, pilot?* | Wing flutter, four creases, a riser. |
| 0:18–0:20 | **Launch** into orbit around the Bloom planet. | Whoosh, then the beat drops. |
| 0:20–0:27 | **Bloom: learn it.** *TAP TO SHIFT* (the frame shifts with every reverse), *THREAD THE GAP*, gold PERFECT postmarks, the planet blooms. | Paper percussion, kalimba, bells. |
| 0:27–0:34 | **Ember: feel it.** Page fold. *HOLD TO FOLD* with a speed ramp; heat gates; Express Post (fever) floods the frame gold. | Bigger drums, crackle, brassy lead. |
| 0:34–0:40 | **Void: master it.** Page fold to indigo; paper comets with dotted warnings, a slow-motion near miss; lost letters drift by. | Glass, sub bass, reversed piano. |
| 0:40–0:43 | **The fleet.** A tap on every half beat swaps the ship: Manta, Dart, Crescent, Splitwing, Shuttle, Ring Sail. | Rising pitched paper flicks. |
| 0:43–0:45 | **The last gate.** Silence; extreme slow motion through the gap. | A heartbeat, one music-box note. |
| 0:45–0:50 | **Moonrise.** The glider unfolds back into the letter, slips under the curtain; the Moon wakes, the curtain lifts, light rays through the paper clouds, the star-envelopes open, gold threads, the islands light up. *Fly them home.* | The full theme, the loudest moment. |
| 0:50–0:55 | **Title.** The glider's trail draws the O; ORBIT unfolds; on the last tap SHIFT shifts in, gold glint; Pip lands. | Paper pops, tap, thwack. |
| 0:55–1:00 | **End card.** *One tap. Deliver the night.* · Coming soon to Google Play · No ads · Plays offline. A red wax seal: *a game by blitzedo*. | The last note with the seal. |

## Transitions (polish pass, 2026-10-23)

- **Page folds** (the studio black page at 0:04.4, Bloom → Ember at 0:27, Ember → Void at 0:34): the old frame folds in half twice and flies off. The lifting half is drawn in perspective (it comes toward the camera as it turns), its back is paper with the old world showing faintly through, and it has a lit edge and a soft shadow that widens as it lifts. Pip's letter fold at 0:15 uses the same 3D lift.
- **Orbit iris** (into the game at 0:19.5, out of it into Moonrise at 0:44.7): no white flashes. A gold ring, the game's dashed orbit with a lit paper edge, opens from the island and later from the glider, revealing the next scene inside it, with a ring of chimes.

## Rules for this film

- Blitzedo red appears only in the opening and the closing seal, so the game keeps its own palette (Blitzedo DESIGN.md: each game keeps its own visual personality; the wordmark gets no added sparkle beyond its own animation).
- Glare only on gold (postmarks, seals, stars, Express Post) and on the red wax. No chromatic aberration, glitch or lens dirt.
- The ship is the letter: Pip folds it on screen; it unfolds at the delivery. The glider is always the game's own `drawGlider` art; planets are always `OrbitArt` renderers.
- Moonrise and the Old Moon hero art are film-only (the Void chapter is not built yet). Approved by the owner.
- Store line stays "Coming soon to Google Play" until the listing is live.

## Narration

Wanted by the owner if it makes the film better. The script is timed into the edit (`film/narration.json`). Not rendered yet: the only good offline voice (Kokoro) downloads from huggingface.co, which this build environment's network policy blocks, and a robotic system voice would make the film worse. The film ships music-only; allow huggingface.co (or supply a recorded read) and the narrated mix can be rendered from the same script.

## Sound

The score is built from a post office: kick = a thumped parcel, snare = a rubber stamp, hats = paper flicks, shaker = rustling letters, Pip's music box carries the theme, bells on every postmark. One theme ("fly them home"), heard alone first, then in each world's colours, then in full at Moonrise. The glider's whoosh is panned to its place on the orbit, so a reverse is heard as well as seen. Original and synthesised (`film/score.py`), so there is nothing to license.
