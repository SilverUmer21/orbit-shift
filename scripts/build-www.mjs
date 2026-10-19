// Copies only the production game files into www/ for Capacitor (no labs, tests, docs, design or trailer).
import { cpSync, rmSync, mkdirSync } from "node:fs";
const files = ["index.html", "game.js", "pip.js", "art-renderers.js", "campaign-map.js", "archipelago-map.js", "styles.css", "journey.css", "remake.css"];
const dirs = ["fonts", "vendor", "assets/archipelago"];
rmSync("www", { recursive: true, force: true });
mkdirSync("www", { recursive: true });
for (const f of files) cpSync(f, `www/${f}`);
for (const d of dirs) cpSync(d, `www/${d}`, { recursive: true, filter: src => !src.endsWith(".md") });
console.log("www/ ready:", files.length, "files +", dirs.join(", "));
