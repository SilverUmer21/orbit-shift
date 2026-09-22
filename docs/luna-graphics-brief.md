# Luna Graphics: Plane Direction Brief

Status: exploration only. Nothing in this brief is approved for production gameplay.

## Current read

Orbit Shift is a one-input Canvas arcade game. The player flies a folded paper glider around a living planet, taps to reverse direction, threads shrinking gate openings, collects orbit fragments, builds Flow, and reaches Fever or guardian moments. The campaign restores Bloom and Ember islands while Ascension provides the endless route.

The current six riders have clear silhouettes but are mechanically cosmetic. The goal is to give a small number of planes a distinct relationship to the existing orbit without adding another button, a skill tree, or a pile of upgrade currencies.

## Direction rules

- Preserve the Luminous Papercut language: folded silhouettes, bevel-like ink edges, warm paper highlights, restrained grain, and the existing Bloom/Ember/Void palette roles.
- Keep the player-readable silhouette at the existing in-game scale. Plane identity must survive when the glider is only about 40–60 px wide.
- One plane changes one relationship with the orbit. Avoid generic `+speed` or `+damage` stats.
- Every advantage has a visible cost or commitment. The player should choose a feeling, not a best-in-slot item.
- Keep all experiments in this lab until a live comparison and playtest approve them.

## Plane hypotheses

| Plane | Play feeling | One defining behavior | Cost / tension |
| --- | --- | --- | --- |
| Manta | Read the route | Baseline Orbit Shift handling | No special safety net |
| Dart | Commit | Faster travel and stronger perfect payoff | Smaller timing margin |
| Crescent | Recover | A tap eases through a short drift instead of snapping | Back-to-back perfects are harder |
| Splitwing | Find a rhythm | A perfect gate creates a short-lived echo; reverse again while it lives to extend Flow | Missing the second beat loses the opportunity |
| Shuttle | Carry | Collected fragments visibly dock as cargo | Cargo makes the plane less agile |
| Ring Sail | Make a hard choice | A gate hit can consume a carried fragment instead of ending the run | The objective and the rescue compete |

The demo focuses on Manta, Crescent, and Splitwing first. They provide the clearest test triangle: baseline, forgiving, and expert.

## Fragment direction

Fragments should become the game's greed line rather than a passive `3/3` counter. Place them slightly inside or outside the normal orbit so collecting one asks for a deliberate reversal or a risky approach. Each pickup should visibly add a point to the planet's constellation before the result screen.

## Guardian direction

Guardians should read as patterns rather than only a bar of three successful passes:

- Bloom opens and closes like a flower.
- Ember alternates heat gates with recovery gates.
- Void can briefly hide the safe gap after a reversal.

## Demo acceptance check

The lab is useful only if each behavior is understandable without reading this document, readable at phone scale, visually coherent with the production game, and still interesting after ten consecutive reversals. Demos are drafts, not shippable assets.
