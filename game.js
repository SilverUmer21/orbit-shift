const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const ui = {
  score: document.querySelector("#score"), multiplier: document.querySelector("#multiplier"),
  best: document.querySelector("#best"), fever: document.querySelector("#feverBar"),
  shell: document.querySelector(".shell"), home: document.querySelector("#home"), campaign: document.querySelector("#campaign"), bloomChapter: document.querySelector("#bloomChapter"),
  garage: document.querySelector("#garage"), settings: document.querySelector("#settings"), results: document.querySelector("#results"),
  resultScore: document.querySelector("#resultScore"), resultStats: document.querySelector("#resultStats"),
  resultEyebrow: document.querySelector("#resultEyebrow"), resultObjectives: document.querySelector("#resultObjectives"), resultHome: document.querySelector("#resultHome"),
  record: document.querySelector("#recordText"), unlock: document.querySelector("#unlockText"),
  cosmetics: document.querySelector("#cosmetics"), riderGrid: document.querySelector("#riderGrid"), hangarShowcase: document.querySelector("#hangarShowcase"), hangarName: document.querySelector("#hangarName"), hangarAction: document.querySelector("#hangarAction"), hangarTabs: document.querySelector("#hangarTabs"),
  homeBest: document.querySelector("#homeBest"), homeStars: document.querySelector("#homeStars"), garageStars: document.querySelector("#garageStars"),
  resultStars: document.querySelector("#resultStars"), preview: document.querySelector("#riderPreview"),
  tutorialPanel: document.querySelector("#tutorialPanel"), tutorialStep: document.querySelector("#tutorialStep"), tutorialCopy: document.querySelector("#tutorialCopy"), skipTutorial: document.querySelector("#skipTutorial"), replayTutorial: document.querySelector("#replayTutorial"),
  rewardSeal: document.querySelector("#rewardSeal"), rewardPreview: document.querySelector("#rewardPreview"), rewardName: document.querySelector("#rewardName"), rewardChoices: document.querySelector("#rewardChoices"), continueRewards: document.querySelector("#continueRewards"), resultRating: document.querySelector("#resultRating"),
  sound: document.querySelector("#soundToggle"), haptics: document.querySelector("#hapticsToggle"), effects: document.querySelector("#effectsToggle"),
  shield: document.querySelector("#shield"), actLabel: document.querySelector("#actLabel"),
  campaignRun: document.querySelector("#campaignRun"), fragmentCount: document.querySelector("#fragmentCount"), perfectCount: document.querySelector("#perfectCount"),
  guardian: document.querySelector("#guardian"), guardianName: document.querySelector("#guardianName"), guardianBar: document.querySelector("#guardianBar"),
  goals: document.querySelector("#voyageGoals"), trails: document.querySelector("#trails"), goalRewards: document.querySelector("#goalRewards"),
  report: document.querySelector("#report"), showReport: document.querySelector("#showReport"), copyReport: document.querySelector("#copyReport"),
  campaignStars: document.querySelector("#campaignStars"), firstLightRating: document.querySelector("#firstLightRating"),
  campaignMap: document.querySelector("#campaignMap"), bloomProgress: document.querySelector("#bloomProgress"),
  rewardRibbon: document.querySelector("#rewardRibbon"), rewardType: document.querySelector("#rewardType"), rewardTitle: document.querySelector("#rewardTitle"), rewardDesc: document.querySelector("#rewardDesc"),
  rewardCount: document.querySelector("#rewardCount"), rewardBonus: document.querySelector("#rewardBonus"), rewardCard: document.querySelector("#rewardCard"), equipReward: document.querySelector("#equipReward"),
  resultStarChip: document.querySelector("#resultStarChip"), resultStarTotal: document.querySelector("#resultStarTotal"),
  mapNext: document.querySelector("#mapNext"), ascensionBest: document.querySelector("#ascensionBest"), chapterPlay: document.querySelector("#chapterPlay"), chapterPlayLevel: document.querySelector("#chapterPlayLevel"),
  hangarShip: document.querySelector("#hangarShip"), hangarBadge: document.querySelector("#hangarBadge"), playLevel: document.querySelector("#playLevel"), resultTitle: document.querySelector("#resultTitle"), resultHangarShip: document.querySelector("#resultHangarShip"), resultHangar: document.querySelector("#resultHangar"), fold: document.querySelector("#foldToggle"), retry: document.querySelector("#retry"), retryLabel: document.querySelector("#retryLabel"), nextLevel: document.querySelector("#nextLevel"), nextLevelTitle: document.querySelector("#nextLevelTitle"), nextLevelName: document.querySelector("#nextLevelName"), extras: document.querySelector("#extrasToggle"), mailTabs: document.querySelector("#mailTabs"), cardBadge: document.querySelector("#cardBadge"), postcard: document.querySelector("#postcard"), cardStrip: document.querySelector("#cardStrip"), albumIsles: document.querySelector("#albumIsles"), albumPage: document.querySelector("#albumPage"), parcelOverlay: document.querySelector("#parcelOverlay"), parcelBox: document.querySelector("#parcelBox"), parcelGifts: document.querySelector("#parcelGifts"), parcelCollect: document.querySelector("#parcelCollect"), openMail: document.querySelector("#openMail"), mailBadge: document.querySelector("#mailBadge"), lanterns: document.querySelector("#lanterns"),
  pip: document.querySelector("#pip"), homeAscension: document.querySelector("#homeAscension"), mailbag: document.querySelector("#mailbag"), letterNight: document.querySelector("#letterNight"),
  letterCard: document.querySelector("#letterCard"), letterTitle: document.querySelector("#letterTitle"), letterScore: document.querySelector("#letterScore"), flyLetter: document.querySelector("#flyLetter"),
  shareLetter: document.querySelector("#shareLetter"), shareLetterMail: document.querySelector("#shareLetterMail"), practiceGuardian: document.querySelector("#practiceGuardian"), resumeOverlay: document.querySelector("#resumeOverlay"), resumeButton: document.querySelector("#resumeButton"), nearMiss: document.querySelector("#nearMiss"),
  nextPlane: document.querySelector("#nextPlane"), nextPlaneArt: document.querySelector("#nextPlaneArt"), nextPlaneName: document.querySelector("#nextPlaneName"), nextPlaneBar: document.querySelector("#nextPlaneBar"), nextPlaneCount: document.querySelector("#nextPlaneCount"),
  bloomLevels: document.querySelector("#bloomLevels"), bloomStory: document.querySelector("#bloomStory"), bloomChapterArt: document.querySelector("#bloomChapterArt"),
};

const TAU = Math.PI * 2;
const MAX_PARTICLES = 220;
const cosmetics = [
  { id: "bloom", name: "Bloom", score: 0, bg: "#08191d", ink: "#12343a", paper: "#4fae91", mid: "#77d5aa", light: "#e6e3b3", accent: "#ef6e67", gold: "#edca62", shape: "leaf" },
  { id: "ember", name: "Ember", score: 250, bg: "#1b1118", ink: "#4b2632", paper: "#ba4f4c", mid: "#e7795f", light: "#f2d8a0", accent: "#62c6b4", gold: "#f1bd4e", shape: "flame" },
  { id: "void", name: "Void", score: 700, bg: "#0e1020", ink: "#25274d", paper: "#5753a6", mid: "#8b76c7", light: "#d9d1df", accent: "#76d9c1", gold: "#e4bd5d", shape: "moon" },
  { id: "wax", name: "Wax seal", score: null, album: "ember", bg: "#1a1013", ink: "#45202a", paper: "#b8433f", mid: "#e0645a", light: "#f6e4c4", accent: "#ffcf6b", gold: "#ffdf8a", shape: "leaf" },
];
const riders = [
  { id: "manta", name: "Manta", price: 0, shape: "manta" },
  { id: "dart", name: "Dart", price: 40, shape: "dart" },
  { id: "crescent", name: "Crescent", price: 100, shape: "crescent" },
  { id: "splitwing", name: "Splitwing", price: 200, shape: "splitwing" },
  { id: "shuttle", name: "Shuttle", price: 350, shape: "shuttle" },
  { id: "ringsail", name: "Ring Sail", price: 550, shape: "ringsail" },
];
const SAVE_VERSION = 5;
const campaignLevels = [
  {
    id:"first-light",name:"First Light",duration:45,story:"A sleeping seed searches for its first rhythm.",perfectTarget:2,orientationBias:.8,warningStrength:1,
    gateTimes:[2,8,14,19,24,30,36,42],hazardTimes:[],
    phases:[{id:"first-light-teach",name:"First Light",start:0,end:12,biome:0},{id:"first-light-rhythm",name:"Living Rhythm",start:12,end:45,biome:0},{id:"first-light-complete",name:"Seed Awakened",start:45,end:Infinity,biome:0}],
  },
  {
    id:"pollen-path",name:"Pollen Path",duration:55,story:"Carry the island's light through the waking canopy.",perfectTarget:2,orientationBias:.65,warningStrength:.72,
    gateTimes:[2,7,12,17,22,27,32,37,42,47,52],hazardTimes:[],
    phases:[{id:"pollen-awakens",name:"Pollen Awakens",start:0,end:15,biome:0},{id:"pollen-path",name:"Pollen Path",start:15,end:55,biome:0},{id:"pollen-complete",name:"Canopy Lit",start:55,end:Infinity,biome:0}],
  },
  {
    id:"tangled-orbit",name:"Tangled Orbit",duration:65,story:"Untangle the old vines without breaking their flow.",perfectTarget:3,orientationBias:.5,warningStrength:.42,
    gateTimes:[2,7,12,17,22,27,32,37,42,47,52,57,62],hazardTimes:[38],
    phases:[{id:"tangle-roots",name:"Tangled Roots",start:0,end:20,biome:0},{id:"vine-current",name:"Vine Current",start:20,end:65,biome:0},{id:"tangle-complete",name:"Roots Restored",start:65,end:Infinity,biome:0}],
  },
  {
    id:"crown-of-petals",name:"Crown of Petals",duration:75,story:"Awaken the Budkeeper and return the Bloom Crown.",perfectTarget:3,orientationBias:.5,warningStrength:.18,
    gateTimes:[2,7,12,17,22,27,32,37,42,47,51,57,63,69,73],hazardTimes:[35],
    phases:[{id:"petal-ascent",name:"Petal Ascent",start:0,end:50,biome:0},{id:"budkeeper",name:"Budkeeper",start:50,end:75,biome:0,guardian:true,target:3},{id:"crown-complete",name:"Bloom Crown",start:75,end:Infinity,biome:0}],
  },
].map((level,index)=>({...level,motion:[[50,1.72,.04],[56,1.52,.1],[63,1.34,.2],[69,1.22,.28]][index],perfectGates:[[3,5,7],[3,6,9],[3,6,9,12],[3,6,9]][index],fragmentTimes:[.12,.24,.37,.5,.64,.78].map(fraction=>Math.round(level.duration*fraction)),biome:"bloom",objectives:["Restore the Bloom rhythm","Collect 3 orbit fragments",`Thread ${level.perfectTarget} perfect gates`]}));
campaignLevels.push({
  id:"kindling",name:"Kindling",biome:"ember",duration:60,story:"Carry Bloom's spark into the sleeping furnace.",
  perfectTarget:2,orientationBias:.65,warningStrength:.72,motion:[62,1.6,.08],
  gateTimes:[2,7,12,18,23,29,35,41,47,53],perfectGates:[3,5,7,9],heatGates:[3,5,7,9],hazardTimes:[],
  fragmentTimes:[7,14,22,30,38,47],objectives:["Light the sleeping furnace","Collect 3 orbit fragments","Thread 2 perfect gates"],
  phases:[{id:"kindling-arrival",name:"Kindling",start:0,end:12,biome:1},{id:"kindling-heat",name:"First Heat",start:12,end:35,biome:1},{id:"kindling-rhythm",name:"Furnace Rhythm",start:35,end:60,biome:1},{id:"kindling-complete",name:"Furnace Lit",start:60,end:Infinity,biome:1}],
});
campaignLevels.push(
  {id:"cinder-step",name:"Cinder Step",biome:"ember",duration:65,story:"The furnace answers in measured breaths.",perfectTarget:2,orientationBias:.64,warningStrength:.78,motion:[70,1.36,.16],
    gateTimes:[2,7,12,18,23,29,34,40,45,51,56,61],perfectGates:[3,5,7,9,11],heatGates:[1,3,5,7,9,11],recoveryGates:[2,4,6,8,10,12],hazardTimes:[],fragmentTimes:[8,16,25,34,43,52],
    objectives:["Temper the waking cinders","Collect 3 orbit fragments","Thread 2 perfect gates"],phases:[{id:"cinder-arrival",name:"Cinder Step",start:0,end:18,biome:1},{id:"cinder-breath",name:"Heat and Rest",start:18,end:65,biome:1},{id:"cinder-complete",name:"Cinders Steady",start:65,end:Infinity,biome:1}]},
  {id:"furnace-heart",name:"Furnace Heart",biome:"ember",duration:70,story:"Turn with the furnace before its heart closes.",perfectTarget:3,orientationBias:.58,warningStrength:.84,motion:[72,1.35,.22],
    gateTimes:[2,7,12,17,22,27,32,43,48,53,58,63],perfectGates:[3,6,8,10,12],heatGates:[2,3,5,6,8,10,11],recoveryGates:[1,4,7,9,12],hazardTimes:[38],fragmentTimes:[8,17,27,37,47,57],
    objectives:["Reach the furnace heart","Collect 3 orbit fragments","Thread 3 perfect gates"],phases:[{id:"heart-entry",name:"Heart Entry",start:0,end:22,biome:1},{id:"heart-turn",name:"Rotating Heat",start:22,end:52,biome:1},{id:"heart-release",name:"Cooling Draft",start:52,end:70,biome:1},{id:"heart-complete",name:"Heart Tempered",start:70,end:Infinity,biome:1}]},
  {id:"solar-forge",name:"Solar Forge",biome:"ember",duration:80,story:"The forge calls for one final, lucid orbit.",perfectTarget:3,orientationBias:.56,warningStrength:.9,motion:[72,1.35,.22],guardianMotion:[90,1.04,.22],
    gateTimes:[2,7,12,17,22,27,32,37,42,47,52,57,61,65,69,73],perfectGates:[3,6,9,11,13,15],heatGates:[2,3,5,7,9,11,13,15],recoveryGates:[1,4,6,8,10,12],hazardTimes:[],fragmentTimes:[8,17,27,37,47,54],
    objectives:["Answer the solar forge","Collect 3 orbit fragments","Thread 3 perfect gates"],phases:[{id:"solar-approach",name:"Solar Approach",start:0,end:28,biome:1},{id:"solar-temper",name:"Tempered Light",start:28,end:56,biome:1},{id:"solar-forge-guardian",name:"Solar Forge",start:56,end:80,biome:1,guardian:true,target:3},{id:"solar-complete",name:"Forge Awakened",start:80,end:Infinity,biome:1}]}
);
const phases = [
  { id: "bloom", name: "Bloom", start: 0, end: 25, biome: 0 },
  { id: "petal", name: "Petal Crown", start: 25, end: 33, biome: 0, guardian: true, target: 3 },
  { id: "drift-ember", name: "Ember Awakens", start: 33, end: 35, biome: 1, transition: true },
  { id: "ember", name: "Ember", start: 35, end: 60, biome: 1 },
  { id: "forge", name: "Solar Forge", start: 60, end: 68, biome: 1, guardian: true, target: 2 },
  { id: "drift-void", name: "Void Opens", start: 68, end: 70, biome: 2, transition: true },
  { id: "void", name: "Void", start: 70, end: 95, biome: 2 },
  { id: "eclipse", name: "Eclipse Eye", start: 95, end: 103, biome: 2, guardian: true, target: 3 },
  { id: "ascension", name: "Ascension", start: 103, end: Infinity, biome: -1 },
];
const goalSets = {
  survival: [{ label: "Survive 35 seconds", kind: "survive", target: 35, reward: 18 }, { label: "Reach the Void", kind: "act", target: 3, reward: 30 }, { label: "Survive 90 seconds", kind: "survive", target: 90, reward: 45 }],
  skill: [{ label: "Thread 5 perfect gates", kind: "perfect", target: 5, reward: 20 }, { label: "Ignite fever twice", kind: "fever", target: 2, reward: 28 }, { label: "Thread 15 perfect gates", kind: "perfect", target: 15, reward: 50 }],
  journey: [{ label: "Pass 12 living gates", kind: "gate", target: 12, reward: 18 }, { label: "Defeat a guardian", kind: "guardian", target: 1, reward: 35 }, { label: "Defeat all guardians", kind: "guardian", target: 3, reward: 70 }],
};
const trailStyles = ["paper", "pollen", "spark", "ribbon", "echo", "crown", "bloom-wake"];
const saved = loadSave();
const goalCycle = saved.goalCycle || { survival: 0, skill: 0, journey: 0 };
const initialGoals = saved.goals || Object.keys(goalSets).map((category) => makeGoal(category, goalCycle[category]));
const initialStats = saved.stats || { sessions: 0, runs: 0, totalMs: 0, longestMs: 0, deaths: { gate: 0, hazard: 0 }, acts: [0,0,0], guardians: 0, goals: 0, dates: [] };
const savedCampaign=saved.campaign||{},completedCampaign=Array.isArray(savedCampaign.completed)?savedCampaign.completed:[];
const bloomCompleted=campaignLevels.filter(level=>level.biome==="bloom"&&completedCampaign.includes(level.id));
const emberCompleted=campaignLevels.filter(level=>level.biome==="ember"&&completedCampaign.includes(level.id));
const initialCampaign={completed:completedCampaign,ratings:savedCampaign.ratings||{},fragments:savedCampaign.fragments||{},rewards:savedCampaign.rewards||[],unlockedLevel:Math.min(4,Math.max(Number(savedCampaign.unlockedLevel)||1,completedCampaign.includes("first-light")?2:1)),restoration:Math.min(4,Math.max(Number(savedCampaign.restoration)||0,bloomCompleted.length)),emberRestoration:Math.min(4,emberCompleted.length)};
const state = {
  mode: "home", score: 0, multiplier: 1, streak: 0, runBestStreak: 0, fever: 0, feverCharge: 0,
  best: saved.best || 0, bestStreak: saved.bestStreak || 0,
  unlocked: saved.unlocked || ["bloom"], selected: saved.selected || "bloom",
  stars: Number(saved.stars) || 0, runStars: 0, runGoalStars: 0, gatesPassed: 0, perfects: 0, feverCount: 0,
  ownedRiders: saved.ownedRiders || ["manta"], selectedRider: saved.selectedRider || "manta",
  shield: false, shieldEarned: false, invulnerable: 0, phaseId: "", guardianPassed: 0, runGoalRewards: [],
  runRewards: [],
  runActMax: 0,
  goals: initialGoals, goalCycle, goalsCompleted: Number(saved.goalsCompleted) || 0,
  unlockedTrails: saved.unlockedTrails || ["paper"], selectedTrail: saved.selectedTrail || "paper", relics: saved.relics || [],
  stats: initialStats,
  daily: saved.daily || null, muted: Boolean(saved.muted), haptics: saved.haptics !== false, reducedEffects: Boolean(saved.reducedEffects), expressFold: saved.expressFold !== false, nightPostExtras: saved.nightPostExtras !== false,
  tutorialSeen: Boolean(saved.tutorialSeen), elapsed: 0, paused: false,
  runType: "endless", levelId: null, levelComplete: false, runFragments: 0, chapter: "bloom",
  campaign: initialCampaign,
};

let width = 0;
let height = 0;
let cx = 0;
let cy = 0;
let planetRadius = 0;
let orbitRadius = 0;
let player = { angle: -Math.PI / 2, direction: 1, flip: 0, glow: 0, fold: 0 };
// Express fold (beta): the tap still reverses on press; keeping the finger down tucks the glider for extra orbit speed.
const FOLD_BOOST = .3, FOLD_HOLD = .14;
let holdStart = 0, holding = false;
function foldSpeed() { return 1 + FOLD_BOOST * player.fold; }
let gates = [];
let hazards = [];
// Paper comets (beta): a folded star that crosses the orbit on a straight line, shown as a dotted warning first.
let comets = [], nextComet = 0;
const COMET_WARN = 1.1, COMET_TRAVEL = .9, COMET_SPEED = 430;
let fragments = [];
let particles = [];
let rings = [];
let labels = [];
let trail = [];
let stars = [];
let grain = [];
let gateCount = 0;
let eligibleGateCount = 0;
let plannedTurns = [];
let nextGate = 0;
let nextHazard = 12;
let campaignGateIndex = 0;
let campaignFragmentIndex = 0;
let nextFragment = 0;
let campaignHazardIndex = 0;
let recoveryGate = false;
let tutorial = 0;
let crashTimer = 0;
let shake = 0;
let flash = 0;
let lastReverse = 0;
let lastTime = performance.now();
let audio;
let musicTimer = 0;
let musicStep = 0;
let awakening = null;
let tutorialSession = null;
let purchasePreview = null;
let rewardAnimation = null;
let rewardIndex = 0;
let rewardChapterComplete = false;
let starTally = null;

const today = new Date().toISOString().slice(0, 10);
state.stats.sessions += 1;
if (!state.stats.dates.includes(today)) state.stats.dates.push(today);
state.stats.dates = state.stats.dates.slice(-14);

function loadSave() {
  try { return JSON.parse(localStorage.getItem("orbit-shift-save") || "{}"); }
  catch { return {}; }
}

function save() {
  // Storage can throw (private mode, quota); progress then lives for this session only instead of breaking the run.
  try { localStorage.setItem("orbit-shift-save", JSON.stringify({
    version: SAVE_VERSION,
    best: state.best, bestStreak: state.bestStreak, unlocked: state.unlocked,
    selected: state.selected, stars: state.stars, ownedRiders: state.ownedRiders, selectedRider: state.selectedRider,
    goals: state.goals, goalCycle: state.goalCycle, goalsCompleted: state.goalsCompleted,
    unlockedTrails: state.unlockedTrails, selectedTrail: state.selectedTrail, relics: state.relics, stats: state.stats,
    muted: state.muted, haptics: state.haptics, reducedEffects: state.reducedEffects, expressFold: state.expressFold, tutorialSeen: state.tutorialSeen,
    campaign: state.campaign, daily: state.daily, nightPostExtras: state.nightPostExtras, post: state.post,
  })); } catch {}
}

function makeGoal(category, index) {
  const template = goalSets[category][index % goalSets[category].length];
  return { ...template, category, progress: 0 };
}

function resize() {
  // Canvas sharpness is capped at 2x for performance; the trailer renderer raises the cap via window.orbitMaxPixelRatio.
  const ratio = Math.min(devicePixelRatio || 1, window.orbitMaxPixelRatio || 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  cx = width / 2;
  cy = height * 0.55;
  planetRadius = Math.max(62, Math.min(84, width * 0.205));
  orbitRadius = Math.min(width * 0.39, planetRadius + 78);
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: 24 }, (_, i) => ({
    x: ((i * 83) % 997) / 997 * width, y: ((i * 47) % 991) / 991 * height,
    size: 1 + (i % 3) * 0.4, phase: i * 0.63,
  }));
  grain = Array.from({ length: 70 }, (_, i) => ({
    x: (((i * 71) % 197) / 197 - 0.5) * 1.65,
    y: (((i * 43) % 193) / 193 - 0.5) * 1.65,
    alpha: 0.025 + (i % 4) * 0.012,
  })).filter((dot) => dot.x * dot.x + dot.y * dot.y < 0.72);
}

function startRun(runType = "endless", levelId = null) {
  if(runType==="campaign"&&!isLevelUnlocked(levelId))return false;
  tutorialSession = null; rewardAnimation = null;
  ui.tutorialPanel.hidden = true;
  window.OrbitArchipelago?.setActive(false);
  state.mode = "run";
  state.runType = runType;
  state.levelId = levelId;
  state.levelComplete = false;
  holding = false; state.practice = false; state.runLetters = 0; queuedReverse = false; graceCrash = null; realInput = false; ui.resumeOverlay.hidden = true; state.dailyRun = null; dailyRandom = null;
  state.runFragments = 0;
  state.score = 0;
  state.multiplier = 1;
  state.streak = 0;
  state.runBestStreak = 0;
  state.fever = 0;
  state.feverCharge = 0;
  state.elapsed = 0;
  state.runStars = 0;
  state.runGoalStars = 0;
  state.gatesPassed = 0;
  state.perfects = 0;
  state.feverCount = 0;
  state.shield = false;
  state.shieldEarned = false;
  state.invulnerable = 0;
  state.phaseId = "";
  state.guardianPassed = 0;
  state.runActMax = 0;
  state.runGoalRewards = [];
  state.runRewards = [];
  if (runType !== "tutorial") state.stats.runs += 1;
  state.paused = false;
  player = { angle: -Math.PI / 2, direction: 1, flip: 0, glow: 0, fold: 0 };
  gates = [];
  hazards = [];
  comets = []; nextComet = 4;
  fragments = [];
  particles = [];
  rings = [];
  labels = [];
  trail = [];
  gateCount = 0;
  eligibleGateCount = 0;
  plannedTurns = [];
  nextGate = 0.65;
  nextHazard = 12;
  campaignGateIndex = 0;
  campaignFragmentIndex = 0;
  nextFragment = 0;
  campaignHazardIndex = 0;
  recoveryGate = false;
  tutorial = 0;
  crashTimer = 0;
  awakening = null;
  lastReverse = 0;
  shake = 0;
  flash = 0;
  hideScreens();
  ui.results.hidden = true;
  ui.shell.classList.add("playing");
  ui.shell.classList.remove("crashing");
  lastTime = performance.now();
  updateHud();
  if (runType !== "tutorial") updateJourney(true);
  startMusic();
  beep(360, 0.07, "triangle");
  vibrate(12);
}

const tutorialSteps = [
  { copy: "Tap to reverse direction", kind: "reverse" },
  { copy: "Pass through the wide gate", kind: "pass" },
  { copy: "Collect the orbit fragment", kind: "fragment" },
  { copy: "Thread the marked perfect", kind: "perfect" },
];

function startTutorial() {
  startRun("tutorial");
  tutorialSession = { step: 0, elapsed: 0 };
  setupTutorialStep();
}

function setupTutorialStep() {
  const session = tutorialSession;
  if (!session) return;
  session.elapsed = 0; gates = []; fragments = []; hazards = []; trail = []; particles = []; labels = [];
  const step = tutorialSteps[session.step];
  ui.tutorialPanel.hidden = false;
  ui.tutorialStep.textContent = `Practice ${session.step + 1}/4`;
  ui.tutorialCopy.textContent = step.copy;
  if (step.kind === "pass" || step.kind === "perfect") {
    const travel = 150 / 80, opening = step.kind === "pass" ? 2.25 : 1.6;
    const target = player.angle + player.direction * orbitalTravel(0, travel);
    gates.push({ radius: orbitRadius + 150, previousRadius: orbitRadius + 150, speed: 80, age: 0, gap: normalize(target + (step.kind === "perfect" ? opening/2-.105-.12 : 0)), opening, rotation: 0, generous: step.kind === "perfect", palette: 0, type: 0, tutorialKind: step.kind });
  }
  if (step.kind === "fragment") fragments.push({ radius: orbitRadius + 130, speed: 120, angle: normalize(player.angle + player.direction * .85), spin: 0, collected: false, tutorial: true });
}

function advanceTutorial() {
  if (!tutorialSession) return;
  tutorialSession.step += 1;
  if (tutorialSession.step < tutorialSteps.length) { setupTutorialStep(); beep(680, .08, "triangle"); return; }
  state.tutorialSeen = true; save(); tutorialSession = null; ui.tutorialPanel.hidden = true; ui.shell.classList.remove("playing"); stopMusic(); showScreen("campaign");
}

function resetTutorialStep() {
  if (!tutorialSession) return;
  player = { angle: -Math.PI / 2, direction: 1, flip: 0, glow: 0, fold: 0 };
  setupTutorialStep(); labels.push({ text: "TRY AGAIN", life: .8, max: .8, y: cy - orbitRadius - 28 });
}

function skipTutorial() {
  state.tutorialSeen = true; save(); tutorialSession = null; ui.tutorialPanel.hidden = true; ui.shell.classList.remove("playing"); stopMusic(); showScreen("campaign");
}

// Forgiveness (real input only, so the test autopilot is unchanged): a tap inside the 75 ms debounce is queued instead
// of dropped, and a tap up to 70 ms after a gate edge clipped the ship forgives that crash.
let queuedReverse = false, graceCrash = null, realInput = false;
function reverse() {
  if (state.mode !== "run" || state.paused) return false;
  const now = performance.now();
  if (now - lastReverse < 75) return false;
  lastReverse = now;
  if (graceCrash) { graceCrash = null; labels.push({ text: "CLOSE CALL", life: .8, max: .8, y: cy - orbitRadius - 28 }); }
  player.direction *= -1;
  player.flip = 1;
  burst(playerPoint(), currentCosmetic().accent, 7, 90, "dot");
  if (tutorialSession?.step === 0) advanceTutorial();
  beep(300 + (player.direction > 0 ? 65 : 0), 0.045, "triangle");
  vibrate(8);
  return true;
}
function tapInput() { realInput = true; if (!reverse() && state.mode === "run" && !state.paused) queuedReverse = true; }
function updateForgiveness() {
  if (queuedReverse && performance.now() - lastReverse >= 75) { queuedReverse = false; reverse(); }
  if (graceCrash && performance.now() > graceCrash.deadline) { graceCrash = null; beginCrash("gate"); }
}

function beginCrash(cause = "gate") {
  if (state.mode !== "run" || state.invulnerable > 0) return;
  if (state.runType === "tutorial") { resetTutorialStep(); return; }
  if (state.shield) {
    state.shield = false;
    state.invulnerable = 1;
    state.streak = 0;
    state.feverCharge = 0;
    state.multiplier = state.fever>0 ? 5 : 1;
    gates = gates.filter((gate) => gate.resolved || gate.radius > orbitRadius + 42);
    hazards = []; comets = [];
    flash = .75; shake = state.reducedEffects ? 2 : 8;
    rings.push({ radius: orbitRadius, life: .8, max: .8, color: currentCosmetic().gold, speed: 120 });
    labels.push({ text: "SHIELD", life: 1, max: 1, y: cy - orbitRadius - 28 });
    burst(playerPoint(), currentCosmetic().gold, 24, 210, "paper");
    beep(180, .08, "square"); beep(720, .18, "sine"); vibrate(35); updateHud();
    return;
  }
  state.mode = "crash";
  ui.shell.classList.add("crashing");
  state.stats.deaths[cause] = (state.stats.deaths[cause] || 0) + 1;
  crashTimer = 0.82;
  shake = state.reducedEffects ? 3 : 14;
  flash = 0.8;
  const point = playerPoint();
  gliderBurst(point, currentCosmetic(), currentRider());
  burst(point, currentCosmetic().accent, 10, 190, "shard");
  rings.push({ radius: orbitRadius, life: 1, max: 1, color: currentCosmetic().accent, speed: 100 });
  beep(92, 0.22, "sawtooth");
  vibrate(55);
}

function finishRun() {
  if(state.mode!=="run"&&state.mode!=="crash") return;
  if (state.runType === "tutorial") return;
  ui.results.classList.add("lockout"); setTimeout(() => ui.results.classList.remove("lockout"), 450);
  if (state.practice) { finishPractice(); return; }
  const oldBest = state.best;
  const firstCampaignClear = state.runType === "campaign" && state.levelComplete && !state.campaign.completed.includes(state.levelId);
  const previousUnlocks = state.unlocked.length;
  state.mode = "results";
  state.best = Math.max(state.best, Math.floor(state.score));
  state.bestStreak = Math.max(state.bestStreak, state.runBestStreak);
  const runMs = Math.floor(state.elapsed * 1000);
  state.stats.totalMs += runMs;
  state.stats.longestMs = Math.max(state.stats.longestMs, runMs);
  updateGoals("survive", Math.floor(state.elapsed), true);
  let campaignRating = 0;
  if (state.runType === "campaign" && state.levelComplete) {
    const level=currentCampaignLevel();
    campaignRating = 1 + Number(state.runFragments >= 3) + Number(state.perfects >= level.perfectTarget);
    const firstClear = !state.campaign.completed.includes(state.levelId);
    chapterReveal = { level: state.levelId, unlocked: firstClear, starsFrom: state.campaign.ratings[state.levelId] || 0 };
    if (firstClear) {
      state.campaign.completed.push(state.levelId); state.runStars += 15; state.runRewards.push({ type: "clear", id: state.levelId, label: `${level.name} restored` });
      const levelIndex=campaignLevels.findIndex(item=>item.id===state.levelId);
      if(level.biome==="bloom"){
        state.campaign.unlockedLevel=Math.max(state.campaign.unlockedLevel,Math.min(4,levelIndex+2));
        state.campaign.restoration=Math.max(state.campaign.restoration,levelIndex+1);
      }else state.campaign.emberRestoration=Math.min(4,campaignLevels.filter(item=>item.biome==="ember"&&state.campaign.completed.includes(item.id)).length);
    }
    state.campaign.ratings[state.levelId] = Math.max(state.campaign.ratings[state.levelId] || 0, campaignRating);
    state.campaign.fragments[state.levelId] = Math.max(state.campaign.fragments[state.levelId] || 0, state.runFragments);
    if (level.biome==="bloom" && !state.campaign.rewards.includes("bloom-wake")) {
      state.campaign.rewards.push("bloom-wake");
      if (!state.unlockedTrails.includes("bloom-wake")) { state.unlockedTrails.push("bloom-wake"); state.runRewards.push({ type: "trail", id: "bloom-wake", label: "Bloom Wake trail" }); }
      state.runGoalRewards.push("Bloom Wake unlocked");
    }
    if (state.levelId === "crown-of-petals" && !state.campaign.rewards.includes("bloom-crown")) {
      state.campaign.rewards.push("bloom-crown"); state.runGoalRewards.push("Bloom constellation restored");
      if(!state.relics.includes("bloom-crown")) { state.relics.push("bloom-crown"); state.runRewards.push({ type: "relic", id: "bloom-crown", label: "Bloom Crown relic" }); }
    }
  }
  if (state.dailyRun) finishDaily();
  postRun(firstCampaignClear ? state.levelId : null);
  state.stars += state.runStars;
  for (const cosmetic of cosmetics) {
    if (cosmetic.score != null && state.best >= cosmetic.score && !state.unlocked.includes(cosmetic.id)) { state.unlocked.push(cosmetic.id); state.runRewards.push({ type: "biome", id: cosmetic.id, label: `${cosmetic.name} palette` }); }
  }
  save();
  ui.resultScore.textContent = Math.floor(state.score);
  ui.resultStats.textContent = `Best ${state.best} · Flow x${Math.max(1, state.runBestStreak)}`;
  ui.resultEyebrow.textContent = state.runType === "campaign" ? state.levelComplete ? `${currentCampaignLevel().name} restored` : `${currentCampaignLevel().name} interrupted` : "Orbit broken";
  ui.resultObjectives.hidden = state.runType !== "campaign";
  if (state.runType === "campaign") {
    const level=currentCampaignLevel();
    const checks = [state.levelComplete, state.runFragments >= 3, state.perfects >= level.perfectTarget];
    const captions = ["Finish", "3 fragments", `${level.perfectTarget} perfects`];
    ui.resultObjectives.innerHTML = level.objectives.map((objective,index)=>`<span class="${checks[index]?"done":""}" title="${objective}"><i aria-hidden="true">${resultStar}</i><small>${captions[index]}</small></span>`).join("");
    ui.resultStats.textContent = (state.levelComplete ? `Best flow x${Math.max(1,state.runBestStreak)}` : `Reached ${Math.floor(state.elapsed)} seconds`) + ` · ${state.runFragments} fragments`;
  }
  setArcTitle(ui.resultTitle, state.dailyRun ? (state.dailyRun.scored ? "Letter delivered!" : "Practice") : state.runType === "campaign" ? (state.levelComplete ? "Level clear!" : "So close!") : state.best > oldBest ? "New record!" : "Orbit broken");
  ui.resultEyebrow.textContent = state.dailyRun ? `Night ${state.dailyRun.night}` : state.runType === "campaign" ? currentCampaignLevel().name : "Ascension";
  ui.shareLetter.hidden = !state.dailyRun?.scored;
  const guardianPhase = state.runType === "campaign" ? currentCampaignLevel().phases.find(phase => phase.guardian) : null;
  ui.practiceGuardian.hidden = !(guardianPhase && !state.levelComplete && state.elapsed >= guardianPhase.start);
  const nearMiss = nearMissText(campaignRating);
  ui.nearMiss.textContent = nearMiss; ui.nearMiss.hidden = !nearMiss;
  renderNextPlane();
  renderHangarShip(ui.resultHangarShip);
  ui.resultStars.textContent = `+${state.runStars + state.runGoalStars}`;
  ui.goalRewards.textContent = state.runGoalRewards.join(" - ");
  ui.record.textContent = state.best > oldBest ? "New orbit record" : "";
  ui.unlock.textContent = state.unlocked.length > previousUnlocks ? "New biome awakened" : "";
  ui.resultHome.textContent = state.runType === "campaign" ? `${currentCampaignLevel().biome==="ember"?"Ember":"Bloom"} Chapter` : "Home";
  ui.results.hidden = false;
  renderResultActions();
  renderRewardSeal();
  prepareStarTally();
  if (!state.runRewards.length) startStarTally();
  animateRating(campaignRating, firstCampaignClear);
  ui.shell.classList.remove("playing");
  stopMusic();
  renderCosmetics();
  updateHud();
}

// Results actions: a campaign win leads with NEXT LEVEL (NEXT CHAPTER when the next level is on another island) and
// shrinks Again to a small Replay; a loss leads with one big RETRY; Ascension says FLY AGAIN. No Hangar here.
function levelAfter(levelId) {
  const next = campaignLevels[campaignLevels.findIndex(level => level.id === levelId) + 1];
  return next && isLevelUnlocked(next.id) ? next : null;
}
function renderResultActions() {
  const next = state.runType === "campaign" && state.levelComplete && !state.practice ? levelAfter(state.levelId) : null;
  ui.nextLevel.hidden = !next;
  ui.retry.classList.toggle("replay", Boolean(next));
  ui.retryLabel.textContent = next ? "Replay" : state.runType === "endless" ? "Fly again" : state.levelComplete ? "Again" : "Retry";
  if (!next) return;
  ui.nextLevel.dataset.level = next.id;
  ui.nextLevelTitle.textContent = next.biome === currentCampaignLevel().biome ? "Next level" : "Next chapter";
  ui.nextLevelName.textContent = `Level ${campaignLevels.indexOf(next) + 1} · ${next.name}`;
}

// Practice from the gatekeeper: replay a guardian level from just before its guardian, for no stars or rewards.
function startPractice(levelId) {
  const level = campaignLevels.find(item => item.id === levelId), guardian = level?.phases.find(phase => phase.guardian);
  if (!guardian || startRun("campaign", levelId) === false) return;
  state.practice = true;
  state.elapsed = Math.max(0, guardian.start - 2);
  const after = times => { const index = times.findIndex(time => time >= state.elapsed); return index < 0 ? times.length : index; };
  campaignGateIndex = after(level.gateTimes); campaignFragmentIndex = after(level.fragmentTimes); campaignHazardIndex = after(level.hazardTimes);
  gateCount = campaignGateIndex;
  labels.push({ text: "PRACTICE", life: 1.4, max: 1.4, y: cy - orbitRadius - 28 });
}
function finishPractice() {
  state.mode = "results"; state.runStars = 0; state.runGoalStars = 0; state.runRewards = []; state.runGoalRewards = [];
  setArcTitle(ui.resultTitle, state.levelComplete ? "Gatekeeper calmed!" : "Practice");
  ui.resultEyebrow.textContent = currentCampaignLevel().name;
  ui.resultObjectives.hidden = true; ui.nearMiss.hidden = true; ui.record.textContent = ""; ui.unlock.textContent = ""; ui.goalRewards.textContent = "";
  ui.resultScore.textContent = Math.floor(state.score);
  ui.resultStats.textContent = "Practice run · no stars";
  ui.resultStars.textContent = "+0";
  ui.practiceGuardian.hidden = false;
  ui.resultHome.textContent = `${currentCampaignLevel().biome==="ember"?"Ember":"Bloom"} Chapter`;
  renderNextPlane(); renderHangarShip(ui.resultHangarShip);
  ui.results.hidden = false;
  renderResultActions();
  renderRewardSeal(); prepareStarTally(); startStarTally();
  ui.shell.classList.remove("playing"); stopMusic(); updateHud();
}

function resumeRun() { ui.resumeOverlay.hidden = true; state.paused = false; holding = false; lastTime = performance.now(); }

function beginAwakening() {
  if(state.mode!=="run"||state.runType!=="campaign"||!state.levelComplete)return;
  const level=currentCampaignLevel(),palette=currentCosmetic();
  const paper=hazards.map((hazard,index)=>{
    const angle=hazard.angle+index*.38, speed=28+index*6;
    return {x:cx+Math.cos(hazard.angle)*orbitRadius,y:cy+Math.sin(hazard.angle)*orbitRadius,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,rotation:hazard.phase,spin:index%2?.9:-.9,color:index%2?palette.paper:palette.gold};
  });
  for(const gate of gates.slice(0,3))for(let i=0;i<4;i++){
    const angle=gate.gap+Math.PI/2+i*.45;
    paper.push({x:cx+Math.cos(angle)*gate.radius,y:cy+Math.sin(angle)*gate.radius,vx:Math.cos(angle)*24,vy:Math.sin(angle)*24,rotation:angle,spin:.7,color:palette.accent});
  }
  hazards=[]; gates=[]; fragments=[];
  const skippable=state.campaign.completed.includes(state.levelId);
  finishRun();
  awakening={life:1.5,max:1.5,skippable,paper:paper.slice(0,state.reducedEffects?6:18),biome:level.biome,rating:1+Number(state.runFragments>=3)+Number(state.perfects>=level.perfectTarget),chapterComplete:level.id==="crown-of-petals"||level.id==="solar-forge"};
  state.mode="awakening";
  ui.results.hidden=true;
}

function finishAwakening() {
  if(!awakening)return;
  awakening=null;
  state.mode="results";
  ui.results.hidden=false;
}

function animateRating(rating, firstClear) {
  rewardAnimation = {elapsed:0,shown:0,rating:firstClear?rating:0};
  ui.resultRating.hidden = !firstClear;
  ui.resultRating.innerHTML = firstClear ? Array.from({ length: 3 }, (_, index) => `<span>${index < rating ? "★" : "☆"}</span>`).join("") : "";
  if (!firstClear) return;
}

function renderRewardSeal(index = 0) {
  rewardIndex = index;
  const rewards = state.runRewards;
  ui.rewardSeal.hidden = rewards.length === 0;
  if (!rewards.length) return;
  const reward = rewards[Math.min(index, rewards.length - 1)];
  const name = rewardDisplayName(reward), copy = rewardCopy(reward);
  rewardChapterComplete = state.runType === "campaign" && state.levelComplete && ["crown-of-petals", "solar-forge"].includes(state.levelId);
  ui.rewardSeal.classList.toggle("chapter-awakening", rewardChapterComplete);
  ui.rewardSeal.classList.toggle("reduced", state.reducedEffects);
  ui.rewardName.textContent = name;
  ui.rewardRibbon.textContent = copy.ribbon;
  ui.rewardType.textContent = copy.type;
  ui.rewardTitle.textContent = copy.title;
  ui.rewardDesc.textContent = copy.desc;
  ui.rewardBonus.hidden = !copy.bonus;
  ui.rewardCount.textContent = `${Math.min(index, rewards.length - 1) + 1} of ${rewards.length}`;
  ui.continueRewards.textContent = "Claim";
  ui.rewardPreview.setAttribute("aria-label", `Show next reward. Current reward: ${name}`);
  ui.rewardChoices.innerHTML = "";
  rewards.forEach((item, itemIndex) => {
    const button = document.createElement("button"), itemName = rewardDisplayName(item); button.type = "button"; button.title = itemName; button.setAttribute("aria-label", `Reward ${itemIndex + 1}: ${itemName}`); button.setAttribute("aria-pressed", String(itemIndex === index));
    button.className = itemIndex === index ? "selected" : itemIndex < index ? "seen" : ""; button.addEventListener("click", () => renderRewardSeal(itemIndex)); ui.rewardChoices.append(button);
  });
  const equippable = (reward.type === "trail" && state.unlockedTrails.includes(reward.id) && state.selectedTrail !== reward.id) || (reward.type === "biome" && state.unlocked.includes(reward.id) && state.selected !== reward.id);
  ui.equipReward.hidden = !equippable; ui.equipReward.disabled = false; ui.equipReward.textContent = "Equip now";
  ui.rewardCard.classList.remove("pop"); void ui.rewardCard.offsetWidth; ui.rewardCard.classList.add("pop");
  drawRewardPreview();
}

const trailWords = { paper: "paper diamonds", pollen: "glowing pollen", spark: "bright sparks", ribbon: "paper ribbons", echo: "echo rings", crown: "crown gems", "bloom-wake": "petals", "pressed-petal": "pressed petals" };
function rewardCopy(reward) {
  const name = rewardDisplayName(reward).replace(/^[^:]+:\s*/, "");
  if (reward.type === "trail") return { ribbon: "New trail!", type: "Trail", title: name.replace(/-/g, " "), desc: `Your glider leaves a trail of ${trailWords[reward.id] || "paper"}.` };
  if (reward.type === "biome") { const paint = cosmetics.find(item => item.id === reward.id); return { ribbon: "New paint!", type: "Paint", title: name, desc: paint?.score ? `Unlocked for reaching ${paint.score} points.` : "A new paint for your glider." }; }
  if (reward.type === "relic") return { ribbon: "New relic!", type: "Relic", title: name, desc: reward.id === "bloom-crown" ? "The Bloom constellation shines again." : "Guardian cleared. Kept in your collection." };
  const level = campaignLevels.find(item => item.id === reward.id);
  return { ribbon: "Level clear!", type: "First clear", title: level?.name || name, desc: level?.story || "", bonus: true };
}

function claimReward() {
  if (rewardIndex < state.runRewards.length - 1) { renderRewardSeal(rewardIndex + 1); beep(660, .06, "triangle"); return; }
  ui.rewardSeal.hidden = true;
  startStarTally();
}

function equipCurrentReward() {
  const reward = state.runRewards[rewardIndex]; if (!reward) return;
  if (reward.type === "trail" && state.unlockedTrails.includes(reward.id)) state.selectedTrail = reward.id;
  else if (reward.type === "biome" && state.unlocked.includes(reward.id)) state.selected = reward.id;
  else return;
  save(); renderCosmetics(); renderHangarShip(ui.resultHangarShip);
  ui.equipReward.textContent = "Equipped"; ui.equipReward.disabled = true;
}

// Results tally: stars fly from the run total into the badge, the badge counts up, then the next-plane bar fills.
function prepareStarTally() {
  const gained = state.runStars + state.runGoalStars;
  starTally = { gained, from: state.stars - gained, score: Math.floor(state.score), elapsed: 0, started: false, launched: false, scored: false, done: false };
  ui.resultScore.classList.remove("landed"); ui.record.classList.remove("stamp");
  if (!state.reducedEffects) ui.resultScore.textContent = 0;
  showStarTally(0);
}
function startStarTally() { if (starTally) starTally.started = true; }
function showStarTally(progress) {
  if (!starTally) return;
  const total = starTally.from + Math.round(starTally.gained * progress);
  ui.resultStarTotal.textContent = total;
  renderNextPlane(total);
}
function launchFlyingStars() {
  const from = ui.resultStars?.getBoundingClientRect?.(), to = ui.resultStarChip?.getBoundingClientRect?.(), home = ui.results?.getBoundingClientRect?.();
  if (!from || !to || !home || state.reducedEffects || starTally.gained <= 0) return;
  const count = Math.min(8, Math.max(3, Math.ceil(starTally.gained / 5)));
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("span"); star.className = "fly-star"; star.setAttribute("aria-hidden", "true");
    star.style.left = `${from.left - home.left + from.width / 2 - 11 + (i % 3 - 1) * 8}px`; star.style.top = `${from.top - home.top - 4}px`;
    star.style.setProperty("--dx", `${to.left - from.left - from.width / 2 + 4 - (i % 3 - 1) * 8}px`); star.style.setProperty("--dy", `${to.top - from.top + 8}px`);
    star.style.animationDelay = `${i * 90}ms`;
    star.addEventListener("animationend", () => star.remove());
    ui.results.append(star);
  }
}
function updateStarTally(delta) {
  const tally = starTally;
  if (!tally || !tally.started || tally.done || ui.results.hidden) return;
  tally.elapsed += delta;
  // Beats: score counts up (0–0.8s) and lands, the record stamps, then stars fly into the badge and the bar fills.
  const scoreProgress = state.reducedEffects ? 1 : Math.min(1, tally.elapsed / .8);
  ui.resultScore.textContent = Math.round(tally.score * (1 - (1 - scoreProgress) ** 3));
  if (scoreProgress >= 1 && !tally.scored) { tally.scored = true; ui.resultScore.classList.add("landed"); ui.record.classList.add("stamp"); }
  const delay = state.reducedEffects ? 0 : .95, duration = state.reducedEffects ? 0 : .35 + Math.min(tally.gained, 40) * .02;
  if (!tally.launched && tally.elapsed >= delay - .35) { tally.launched = true; launchFlyingStars(); }
  const progress = duration ? Math.max(0, Math.min(1, (tally.elapsed - delay) / duration)) : 1;
  showStarTally(progress);
  ui.resultStarChip.classList.toggle("counting", progress > 0 && progress < 1);
  if (progress >= 1) { tally.done = true; ui.resultStarChip.classList.remove("counting"); if (tally.gained > 0) beep(880, .1, "triangle"); }
}

function rewardGlyph(reward) { return reward.type === "trail" ? "~" : reward.type === "relic" ? "◆" : reward.type === "biome" ? "●" : "✦"; }

function rewardDisplayName(reward) {
  const label = reward.label.replace(/\s+(trail|relic)$/i, "");
  if (reward.type === "clear") return `Level cleared: ${label.replace(/\s+restored$/i, "")}`;
  if (reward.type === "relic") return `Relic: ${label}`;
  if (reward.type === "trail") return `Trail: ${label}`;
  return `Palette: ${label.replace(/\s+palette$/i, "")}`;
}

function rewardPalette(reward) {
  const level = campaignLevels.find(item => item.id === reward.id);
  const phase = phases.find(item => item.id === reward.id) || campaignLevels.flatMap(item => item.phases).find(item => item.id === reward.id);
  const id = reward.type === "biome" ? reward.id : level?.biome || cosmetics[phase?.biome]?.id || (reward.id === "bloom-crown" ? "bloom" : currentCosmetic().id);
  return cosmetics.find(item => item.id === id) || cosmetics[0];
}

function drawRewardPreview() {
  const reward = state.runRewards[rewardIndex]; if (!reward) return;
  const canvas = ui.rewardPreview.querySelector("canvas"), w = 290, h = 214, ratio = 2, palette = rewardPalette(reward), time = rewardAnimation?.elapsed || 0, motion = state.reducedEffects ? 0 : time;
  if (canvas.width !== w * ratio || canvas.height !== h * ratio) { canvas.width = w * ratio; canvas.height = h * ratio; }
  const target = canvas.getContext("2d"); target.setTransform(ratio, 0, 0, ratio, 0, 0); target.clearRect(0, 0, w, h);
  if (rewardChapterComplete) { const scale = Math.min(w / 220, h / 142); target.translate((w - 220 * scale) / 2, (h - 142 * scale) / 2); target.scale(scale, scale); drawChapterRewardStage(target, reward, palette, time); return; }
  if (reward.type === "trail") {
    const paint = currentCosmetic();
    for (let i = 0; i < 26; i += 1) { const t = i / 25, x = 25 + t * 167, y = 145 - t * 43 - Math.sin(t * Math.PI) * 23 + Math.sin(i * .5 - motion * 3) * 2.5; target.globalAlpha = .25 + t * .75; target.fillStyle = i % 2 ? paint.accent : paint.gold; drawTrailPiece(target, reward.id, x, y, 3.5 + t * 4.5, -.6, i); }
    target.globalAlpha = 1; target.translate(226, 73); target.rotate(-.75); drawGlider(target, currentRider(), paint, 1.3, motion, 0, false, 0);
  } else if (reward.type === "biome") {
    const paint = cosmetics.find(item => item.id === reward.id) || palette;
    target.translate(w / 2, h / 2 + 4 + Math.sin(motion * 2) * 3); target.rotate(-.35); drawGlider(target, currentRider(), paint, 1.8, motion, 0, false, 0);
  } else if (reward.type === "relic") {
    target.translate(w / 2, h / 2); target.scale(2.1, 2.1); drawRelicMedallion(target, palette, time);
  } else {
    const level = campaignLevels.find(item => item.id === reward.id), ember = level?.biome === "ember";
    OrbitArt.drawLivingPlanet(target, ember ? "ember-furnace" : "bloom-crown", { x: w / 2, y: h / 2 - 10, radius: 60, paletteId: ember ? "ember" : "bloom", time, reduced: state.reducedEffects });
  }
}

function drawRewardMark(target,reward,palette,time) {
  if (reward.type === "trail") {
    for(let i=0;i<12;i++){target.globalAlpha=1-i/12;target.fillStyle=i%2?palette.accent:palette.gold;drawTrailPiece(target,reward.id,48-i*9,Math.sin(i*.3-time)*8,5,0,i);}
  } else if (reward.type === "biome" && reward.id === "wax") {
    target.save(); target.rotate(-.35); drawGlider(target,currentRider(),cosmetics.find(item=>item.id==="wax"),1.1,time,0,false,0); target.restore();
  } else if (reward.type === "biome") {
    OrbitArt.drawLivingPlanet(target,reward.id==="ember"?"ember-furnace":"bloom-crown",{x:0,y:0,radius:30,paletteId:reward.id,time,reduced:state.reducedEffects});
  } else if (reward.type === "clear") {
    const level=campaignLevels.find(item=>item.id===reward.id), biome=level?.biome === "ember" ? "ember" : "bloom";
    OrbitArt.drawLivingPlanet(target,biome === "ember" ? "ember-furnace" : "bloom-crown",{x:0,y:2,radius:27,paletteId:biome,time,reduced:state.reducedEffects});
    drawRewardCompletion(target,palette);
  } else drawRelicMedallion(target,palette,time);
}

function drawChapterRewardStage(target,reward,palette,time) {
  const reduced=state.reducedEffects,w=220,h=142;
  target.fillStyle=palette.ink;target.fillRect(0,0,w,h);
  target.fillStyle=palette.light;target.globalAlpha=.16;target.fillRect(0,0,w,68);target.globalAlpha=1;
  target.save();target.translate(w/2,53);target.strokeStyle=palette.gold;target.lineWidth=2;target.globalAlpha=.35;
  const rayCount=reduced?5:9;for(let i=0;i<rayCount;i++){target.rotate(TAU/rayCount);target.beginPath();target.moveTo(0,0);target.lineTo(0,-46);target.stroke();}target.restore();
  target.save();target.translate(w/2,83);target.fillStyle=palette.paper;
  for(const layer of [[-74,17,22],[-61,8,16],[-49,0,10]]){target.beginPath();target.moveTo(layer[0],layer[1]);target.lineTo(-31,layer[1]-layer[2]);target.lineTo(0,layer[1]-6);target.lineTo(34,layer[1]-layer[2]);target.lineTo(-layer[0],layer[1]);target.lineTo(-layer[0]+8,layer[1]+17);target.lineTo(-70,layer[1]+14);target.closePath();target.globalAlpha=.4+(layer[2]/40);target.fill();}target.globalAlpha=1;
  OrbitArt.drawLivingPlanet(target,state.levelId==="solar-forge"?"ember-furnace":"bloom-crown",{x:0,y:-5,radius:27,paletteId:state.levelId==="solar-forge"?"ember":"bloom",time,reduced});drawChapterEmblem(target,palette,18);target.restore();
  target.save();target.translate(w/2,111);target.scale(.55,.55);drawRewardMark(target,reward,palette,time);target.restore();
  window.OrbitArt.helpers?.paperGrain?.(target,w,h,palette.light,.06);
}

function drawRewardSurface(target,palette,time) {
  target.fillStyle=palette.light;target.fillRect(0,0,180,76);
  target.fillStyle=palette.paper;target.beginPath();target.moveTo(0,54);target.lineTo(34,43);target.lineTo(70,57);target.lineTo(111,40);target.lineTo(180,52);target.lineTo(180,76);target.lineTo(0,76);target.closePath();target.fill();
  target.fillStyle=palette.ink;target.globalAlpha=.18;target.beginPath();target.moveTo(0,63);target.lineTo(48,54);target.lineTo(93,69);target.lineTo(139,51);target.lineTo(180,62);target.lineTo(180,76);target.lineTo(0,76);target.closePath();target.fill();target.globalAlpha=1;
  window.OrbitArt.helpers?.paperGrain?.(target,180,76,palette.ink,.08);
  target.strokeStyle=palette.gold;target.globalAlpha=.45;target.lineWidth=1;target.beginPath();target.moveTo(8,13);target.lineTo(39,8);target.lineTo(58,15);target.moveTo(127,11);target.lineTo(170,16);target.stroke();target.globalAlpha=1;
}

function drawRewardCompletion(target,palette) {
  target.save();target.translate(0,-27);target.fillStyle=palette.gold;target.beginPath();target.moveTo(-16,8);target.lineTo(-16,-5);target.lineTo(-7,1);target.lineTo(0,-8);target.lineTo(7,1);target.lineTo(16,-5);target.lineTo(16,8);target.closePath();target.fill();target.strokeStyle=palette.ink;target.lineWidth=1.5;target.stroke();target.strokeStyle=palette.light;target.lineWidth=2.5;target.beginPath();target.moveTo(-6,9);target.lineTo(-1,14);target.lineTo(9,3);target.stroke();target.restore();
}

function drawRelicMedallion(target,palette,time) {
  target.save();target.rotate(time*.04);target.fillStyle=palette.ink;target.beginPath();for(let i=0;i<12;i++){const a=i*TAU/12-Math.PI/2,r=i%2?25:30;i?target.lineTo(Math.cos(a)*r,Math.sin(a)*r):target.moveTo(Math.cos(a)*r,Math.sin(a)*r);}target.closePath();target.fill();target.fillStyle=palette.gold;target.beginPath();target.arc(0,0,23,0,TAU);target.fill();target.fillStyle=palette.paper;target.beginPath();target.moveTo(-14,-9);target.lineTo(0,-17);target.lineTo(14,-9);target.lineTo(14,9);target.lineTo(0,17);target.lineTo(-14,9);target.closePath();target.fill();target.strokeStyle=palette.light;target.lineWidth=2;target.beginPath();target.moveTo(-10,-4);target.lineTo(0,5);target.lineTo(10,-4);target.moveTo(0,5);target.lineTo(0,13);target.stroke();target.restore();
}

function drawChapterEmblem(target,palette,size) {
  target.save();target.fillStyle=palette.gold;target.strokeStyle=palette.ink;target.lineWidth=2;target.beginPath();
  for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?size*.46:size;target.lineTo(Math.cos(a)*r,Math.sin(a)*r);}target.closePath();target.fill();target.stroke();target.restore();
}

function updateRewardAnimation(delta) {
  if(!rewardAnimation||state.mode!=="results")return;
  rewardAnimation.elapsed+=delta;
  updateStarTally(delta);
  const reveal=state.reducedEffects?1:Math.min(1,rewardAnimation.elapsed/.65);
  ui.rewardSeal.style.setProperty("--unfold",String(reveal));
  const stars=ui.resultRating.querySelectorAll("span");
  const count=state.reducedEffects?stars.length:Math.min(stars.length,Math.floor(rewardAnimation.elapsed/.18)+1);
  while(rewardAnimation.shown<count){const i=rewardAnimation.shown++;stars[i].classList.add("show");if(i<rewardAnimation.rating)beep(540+i*110,.06,"triangle");}
  if(!ui.rewardSeal.hidden)drawRewardPreview();
}

function currentCampaignLevel() { return campaignLevels.find(level=>level.id===state.levelId) || campaignLevels[0]; }
function isLevelUnlocked(id) {
  const level=campaignLevels.find(item=>item.id===id);
  if(!level)return false;
  if(level.biome!=="ember")return campaignLevels.indexOf(level)<state.campaign.unlockedLevel;
  const emberLevels=campaignLevels.filter(item=>item.biome==="ember"),index=emberLevels.indexOf(level);
  return index===0 ? state.campaign.completed.includes("crown-of-petals") : state.campaign.completed.includes(emberLevels[index-1].id);
}
function activePhases() { return state.runType === "campaign" ? currentCampaignLevel().phases : phases; }
function phaseAt(elapsed) { const list = activePhases(); return list.find((phase) => elapsed >= phase.start && elapsed < phase.end) || list[list.length - 1]; }

function updateJourney(force = false) {
  const phase = phaseAt(state.elapsed);
  if (!force && phase.id === state.phaseId) return phase;
  const previous = activePhases().find((item) => item.id === state.phaseId);
  if (previous?.guardian && state.guardianPassed >= previous.target) completeGuardian(previous);
  state.phaseId = phase.id;
  state.guardianPassed = 0;
  const act = phase.biome >= 0 ? phase.biome : Math.floor((state.elapsed - 103) / 24) % 3;
  if (!phase.guardian && !phase.transition && act + 1 > state.runActMax) {
    state.runActMax = act + 1;
    state.stats.acts[act] = (state.stats.acts[act] || 0) + 1;
    updateGoals("act", state.runActMax, true);
  }
  if (phase.transition) { gates = []; hazards = []; comets = []; nextGate = phase.end - state.elapsed + .2; }
  else nextGate = .15;
  ui.actLabel.textContent = phase.name;
  ui.actLabel.classList.remove("show");
  void ui.actLabel.offsetWidth;
  ui.actLabel.classList.add("show");
  updateHud();
  return phase;
}

function completeGuardian(phase) {
  state.stats.guardians += 1;
  state.runStars += 10;
  updateGoals("guardian", 1);
  const relic = phase.id;
  if (!state.relics.includes(relic)) { state.relics.push(relic); state.runGoalRewards.push(`${phase.name} relic`); state.runRewards.push({type:"relic",id:relic,label:`${phase.name} relic`}); }
  labels.push({ text: "GUARDIAN CLEARED", life: 1.4, max: 1.4, y: cy - orbitRadius - 28 });
  beep(1040, .18, "triangle"); vibrate(28);
}

function updateGoals(kind, amount, absolute = false) {
  for (let i = 0; i < state.goals.length; i += 1) {
    const goal = state.goals[i];
    if (goal.kind !== kind) continue;
    goal.progress = absolute ? Math.max(goal.progress, amount) : goal.progress + amount;
    if (goal.progress < goal.target) continue;
    state.stars += goal.reward;
    state.runGoalStars += goal.reward;
    state.goalsCompleted += 1;
    state.stats.goals += 1;
    state.runGoalRewards.push(`${goal.label} +${goal.reward} stars`);
    const goalTrails = trailStyles.filter(name => name !== "bloom-wake");
    const trailName = goalTrails[Math.min(state.goalsCompleted, goalTrails.length - 1)];
    if (!state.unlockedTrails.includes(trailName)) { state.unlockedTrails.push(trailName); state.runGoalRewards.push(`${trailName} trail unlocked`); state.runRewards.push({ type: "trail", id: trailName, label: `${trailName} trail` }); }
    state.goalCycle[goal.category] = (state.goalCycle[goal.category] || 0) + 1;
    state.goals[i] = makeGoal(goal.category, state.goalCycle[goal.category]);
    beep(880, .13, "triangle");
  }
}

function collectLetter(gate) {
  gate.letterTaken = true; state.runLetters += 1; state.runStars += 2;
  labels.push({ text: "LOST LETTER +2", life: 1, max: 1, y: cy - orbitRadius - 52 });
  burst(playerPoint(), currentCosmetic().gold, 14, 150, "paper"); beep(988, .08, "sine"); vibrate(10);
}
function brushSpark(hazard) {
  hazard.brushed = true; state.score += 12 * state.multiplier;
  labels.push({ text: "BRUSH", life: .6, max: .6, y: cy - orbitRadius - 28 });
  burst(playerPoint(), currentCosmetic().light, 9, 120, "paper"); beep(1180, .04, "triangle");
}

function updateFold(delta) {
  const tucked = state.expressFold && holding && state.mode === "run" && performance.now() - holdStart >= FOLD_HOLD * 1000;
  const before = player.fold;
  player.fold = tucked ? Math.min(1, player.fold + delta * 7) : Math.max(0, player.fold - delta * 9);
  if (before === 0 && player.fold > 0) { beep(170, .09, "sine"); vibrate(4); }
  if (player.fold > 0) state.score += delta * 6 * player.fold;
}
function pressHold() { if (state.mode === "run") { holdStart = performance.now(); holding = true; } }
function releaseHold() { holding = false; }

function orbitalTravel(elapsed,duration) {
  const primitive=t=>{const capped=Math.min(t,(2.45-1.66)/.009);return 1.66*capped+.0045*capped*capped+2.45*(t-capped);};
  return primitive(elapsed+duration)-primitive(elapsed);
}
function worldTravel(duration,fever) { return duration-.2*Math.min(duration,fever); }
function crossingTime(travel,fever=0) { return travel<=fever*.8 ? travel/.8 : travel+fever*.2; }
// Integral of the heat speed multiplier in hazard-clock seconds.
function heatTravel(age) {
  if(age<=1.2)return .75*age;
  if(age>=1.6)return 1.3+1.25*(age-1.6);
  const u=(age-1.2)/.4;
  return .9+.75*(age-1.2)+.2*(u**3-.5*u**4);
}
function gateDistance(gate,duration,age=gate.age||0) {
  return gate.speed*(gate.heat ? heatTravel(age+duration)-heatTravel(age) : duration);
}
function gateTravelTime(gate,distance,age=gate.age||0) {
  if(!gate.heat)return Math.max(0,distance)/gate.speed;
  let low=0,high=Math.max(0,distance)/(gate.speed*.75);
  for(let i=0;i<32;i++){const mid=(low+high)/2;if(gateDistance(gate,mid,age)<distance)low=mid;else high=mid;}
  return (low+high)/2;
}
function routeAngle(snapshot,time,turns) {
  let angle=snapshot.angle,direction=snapshot.direction,previous=0;
  for(const turn of turns){if(turn>time)break;angle+=direction*orbitalTravel(snapshot.elapsed+previous,turn-previous);direction*=-1;previous=turn;}
  return normalize(angle+direction*orbitalTravel(snapshot.elapsed+previous,time-previous));
}
function routeIsSafe(snapshot,turns,horizon) {
  for(const gate of snapshot.constraints||[]){
    if(gate.time>horizon)continue;
    if(angleDistance(routeAngle(snapshot,gate.time,turns),gate.gap)>gate.opening/2-.125)return false;
  }
  for(const hazard of snapshot.hazards||[]) for(let t=Math.max(0,hazard.arm);t<=Math.min(horizon,hazard.life);t+=.06){
    if(angleDistance(routeAngle(snapshot,t,turns),normalize(hazard.angle+hazard.speed*worldTravel(t,snapshot.fever||0)))<.22)return false;
  }
  return true;
}
function findRoute(snapshot,horizon,targetTime,wantsEasy,random=Math.random) {
  horizon=Math.max(horizon,...(snapshot.hazards||[]).map(h=>h.life));
  const base=(snapshot.turns||[]).filter(t=>t>0&&t<horizon),candidates=[base,[]];
  const phase=random();
  for(let i=0;i<48;i+=1){const turn=.1+(horizon-.2)*((i+phase)/48);candidates.push([turn]);if(base.length&&turn>base[base.length-1]+.1)candidates.push([...base,turn]);}
  if(snapshot.hazards?.length)for(let first=1;first<7;first++)for(let second=first+1;second<8;second++)candidates.push([horizon*first/8,horizon*second/8]);
  let fallback=null;
  for(const turns of candidates){
    if(!routeIsSafe(snapshot,turns,horizon))continue;
    const route={turns,target:routeAngle(snapshot,targetTime,turns)};
    fallback ||= route;
    if(wantsEasy===undefined||isSideOpening(route.target)!==wantsEasy)return route;
  }
  return snapshot.forceEasy ? null : fallback;
}
function planningSnapshot() {
  return {elapsed:state.elapsed,angle:player.angle,direction:player.direction,fever:state.fever,
    turns:plannedTurns.map(t=>t-state.elapsed).filter(t=>t>0),
    constraints:gates.filter(g=>!g.resolved).map(g=>{const travel=gateTravelTime(g,g.radius-orbitRadius);return {time:crossingTime(travel,state.fever),gap:normalize(g.gap+g.rotation*travel),opening:g.opening};}).concat(fragments.filter(f=>!f.collected&&f.radius>orbitRadius).map(f=>({time:crossingTime((f.radius-orbitRadius)/f.speed,state.fever),gap:f.angle,opening:.8}))),
    hazards:hazards.map(h=>({...h,arm:Math.max(0,.85-h.age)}))};
}

function buildGatePlan(snapshot, random = Math.random) {
  const earlySpeeds = [52, 59, 66];
  const earlyOpenings = [1.66, 1.5, 1.38];
  const phase = snapshot.phase || phaseAt(snapshot.elapsed);
  let speed = snapshot.index < 3 ? earlySpeeds[snapshot.index] : Math.min(108, 68 + snapshot.elapsed * 0.42);
  if (phase.id === "ember" || phase.id === "forge" || phase.id === "solar-forge-guardian") speed *= 1.08;
  if (phase.id === "void" || phase.id === "eclipse") speed *= .96;
  if (phase.guardian) speed = Math.max(speed, phase.id === "forge" ? 98 : 90);
  let rotationLimit = snapshot.index < 3 ? 0.12 : Math.min(0.54, 0.16 + snapshot.elapsed * 0.004);
  if (phase.id === "ember" || phase.id === "forge" || phase.id === "solar-forge-guardian") rotationLimit *= 1.25;
  if (phase.id === "void" || phase.id === "eclipse") rotationLimit *= .72;
  let opening = snapshot.index < 3 ? earlyOpenings[snapshot.index] : Math.max(0.88, 1.34 - snapshot.elapsed * 0.0046);
  if (phase.guardian) opening = phase.id === "forge" || phase.id === "solar-forge-guardian" ? 1.04 : 1.12;
  if(snapshot.settings){[speed,opening,rotationLimit]=snapshot.settings;}
  if (snapshot.forceEasy) {
    opening=Math.max(opening,1.58);
    if(!snapshot.heat)speed*=.92;
  }
  const radius=snapshot.orbitRadius+snapshot.shortSide*.56,rotation=(random()-.5)*2*rotationLimit;
  const motion={speed,heat:Boolean(snapshot.heat),age:0};
  const travel=gateTravelTime(motion,radius-snapshot.orbitRadius),flight=crossingTime(travel,snapshot.fever||0);
  const pairTravel=gateTravelTime(motion,radius-snapshot.orbitRadius+(snapshot.pairSpacing||0));
  const pairFlight=crossingTime(pairTravel,snapshot.fever||0);
  const horizon=Math.max(pairFlight,...(snapshot.constraints||[]).map(g=>g.time));
  const candidate=findRoute(snapshot,horizon,flight,snapshot.forceEasy||random()<(snapshot.orientationBias??.5),random);
  if(!candidate)return null;
  return {...motion,radius,flight,travel,gap:normalize(candidate.target-rotation*travel),target:candidate.target,rotation,opening,turns:candidate.turns,
    pairGap:normalize(routeAngle(snapshot,pairFlight,candidate.turns)-rotation*pairTravel),wantsTurn:candidate.turns.length>0};
}

function isSideOpening(angle) { return Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle)); }
function endlessOrientationBias(elapsed) { return elapsed < 30 ? .8 : elapsed < 90 ? .8-(elapsed-30)/200 : .5; }

function spawnGate() {
  const phase = phaseAt(state.elapsed);
  if (phase.transition) return false;
  const level = state.runType === "campaign" ? currentCampaignLevel() : null;
  const kindling=level?.id==="kindling",ember=level?.biome==="ember",number=gateCount+1;
  const heat=Boolean(level?.heatGates?.includes(number));
  const forceEasy = (recoveryGate || level?.recoveryGates?.includes(number) || kindling&&number>=4&&number%2===0) && !phase.guardian;
  const campaignPair=level?.id==="crown-of-petals"&&!phase.guardian&&gateCount+1>5&&(gateCount+1)%5===0;
  const paired=(phase.id==="forge"||phase.id==="solar-forge-guardian"||campaignPair||!level&&state.elapsed>103&&gameRandom()<.24)&&gates.filter(g=>!g.resolved).length<2;
  const settings=level ? (phase.guardian?(level.guardianMotion||[72,1.18,.24]):kindling&&number<=2?[62,1.75,0]:kindling&&forceEasy?[62,1.75,.08]:ember&&forceEasy?[Math.min(72,level.motion[0]),1.62,.08]:level.motion) : null;
  const plan = buildGatePlan({
    ...planningSnapshot(),settings,heat,pairSpacing:paired?58:0,
    index: gateCount, elapsed: state.elapsed, angle: player.angle, direction: player.direction,
    angularSpeed: playerSpeed(), orbitRadius, shortSide: Math.min(width, height), phase, forceEasy,
    orientationBias:level?.orientationBias ?? endlessOrientationBias(state.elapsed),
  }, gameRandom);
  if(!plan)return false;
  plannedTurns=plan.turns.map(t=>t+state.elapsed);
  const gate = {
    ...plan, previousRadius: plan.radius, resolved: false, type: ember?1:gateCount % 4,
    palette: gateCount % 3, pair: false, guardian: Boolean(phase.guardian), guardianId: phase.id,
    sideOpening:isSideOpening(plan.target),warningStrength:level?.warningStrength || 0,recovery:forceEasy,
  };
  if (!gate.guardian && !paired && gateCount % 4 === 2) gate.letter = gateCount % 8 === 2 ? 1 : -1;
  gates.push(gate);
  recoveryGate = !gate.guardian && gate.sideOpening && !forceEasy;
  gateCount += 1;
  if(!gate.guardian&&!paired){
    eligibleGateCount+=1;
    gate.generous=level ? level.perfectGates.includes(gateCount) : eligibleGateCount%3===0;
  }
  if (paired) {
    const spacing = 58;
    gates.push({
      ...gate, radius: gate.radius + spacing, previousRadius: gate.radius + spacing,
      gap: plan.pairGap, resolved: false, pair: true,
    });
  }
  return true;
}

function spawnFragment() {
  const radius = orbitRadius + Math.min(width, height) * .5;
  const speed = 64;
  const snapshot=planningSnapshot(),flight=crossingTime((radius-orbitRadius)/speed,state.fever);
  const horizon=Math.max(flight,...snapshot.constraints.map(g=>g.time));
  const route=findRoute(snapshot,horizon,flight,undefined,gameRandom);
  if(!route)return false;
  plannedTurns=route.turns.map(t=>t+state.elapsed);
  fragments.push({ radius, previousRadius: radius, speed, angle:route.target, collected:false,spin:Math.random()*TAU });
  return true;
}

// Comets aim at where the ship will be when they arrive (give or take), so the player must reverse or tuck to dodge.
// Only for real input, so the deterministic test autopilot never meets one; never right before a gate arrives.
function cometsActive(phase) { return realInput && state.runType === "endless" && (state.elapsed >= 25 || ["void", "eclipse", "ascension"].includes(phase.id)); }
function spawnComet() {
  if (gates.some((gate) => !gate.resolved && (gate.radius - orbitRadius) / gate.speed < 2.6)) return false;
  const arrive = COMET_WARN + COMET_TRAVEL;
  const predicted = normalize(player.angle + player.direction * orbitalTravel(state.elapsed, arrive) * foldSpeed());
  const cross = normalize(predicted + (gameRandom() - .5) * .35);
  // Headed at the planet (a small slant), so the comet crosses the orbit exactly once and then bursts on the planet.
  const heading = cross + Math.PI + (gameRandom() < .5 ? -1 : 1) * (.1 + gameRandom() * .25);
  comets.push({ cross, dx: Math.cos(heading), dy: Math.sin(heading), clock: 0, brushed: false, spin: Math.random() * TAU });
  return true;
}
function cometPoint(comet) {
  const along = (comet.clock - COMET_WARN - COMET_TRAVEL) * COMET_SPEED;
  return { x: cx + Math.cos(comet.cross) * orbitRadius + comet.dx * along, y: cy + Math.sin(comet.cross) * orbitRadius + comet.dy * along };
}
function updateComets(delta, worldScale, phase) {
  if (cometsActive(phase)) {
    nextComet -= delta;
    if (nextComet <= 0) nextComet = spawnComet() ? (["void", "eclipse", "ascension"].includes(phase.id) ? 5.5 : 8.5) + gameRandom() * 2.5 : .5;
  }
  const ship = playerPoint();
  for (const comet of comets) {
    comet.clock += delta * worldScale; comet.spin += delta * 6;
    if (comet.clock < COMET_WARN) continue;
    const point = cometPoint(comet), distance = Math.hypot(point.x - ship.x, point.y - ship.y);
    if (Math.hypot(point.x - cx, point.y - cy) < planetRadius * .9) { comet.done = true; burst(point, currentCosmetic().gold, 16, 160, "paper"); continue; }
    if (distance < 19) { beginCrash("hazard"); if (state.mode !== "run") return; }
    else if (distance < 48 && !comet.brushed) {
      comet.brushed = true; state.score += 15 * state.multiplier;
      labels.push({ text: "TAIL SPARK", life: .7, max: .7, y: cy - orbitRadius - 28 });
      burst(ship, currentCosmetic().gold, 10, 140, "paper"); beep(1320, .05, "triangle");
    }
  }
  comets = comets.filter((comet) => !comet.done && comet.clock < COMET_WARN + COMET_TRAVEL + 1.4);
}

function spawnHazard() {
  const gateSoon = gates.some((gate) => !gate.resolved && (gate.radius - orbitRadius) / gate.speed < 2.2);
  if (gateSoon) return false;
  const hazard={angle:normalize(player.angle+Math.PI),speed:-player.direction*.65,life:5.2,age:0,phase:Math.random()*TAU};
  const snapshot=planningSnapshot();snapshot.hazards.push({...hazard,arm:.85});
  const horizon=Math.max(hazard.life,...snapshot.constraints.map(g=>g.time));
  let route=null;
  for(let sector=0;sector<6&&!route;sector++){
    hazard.angle=normalize(player.angle+Math.PI+sector*TAU/6);
    snapshot.hazards[snapshot.hazards.length-1].angle=hazard.angle;
    route=findRoute(snapshot,horizon,horizon,undefined,gameRandom);
  }
  if(!route)return false;
  plannedTurns=route.turns.map(t=>t+state.elapsed);
  hazards.push(hazard);
  return true;
}

function update(delta) {
  if (state.paused) return;
  updateRewardAnimation(delta);
  if (state.mode === "awakening") { updateAwakening(delta); return; }
  if (state.mode === "crash") {
    crashTimer -= delta;
    updateEffects(delta);
    if (crashTimer <= 0) finishRun();
    return;
  }
  if (state.mode !== "run") {
    player.angle = normalize(player.angle + delta * 0.24);
    updateEffects(delta);
    return;
  }

  if (state.runType === "tutorial") { updateTutorial(delta); return; }

  state.elapsed += delta;
  const phase = updateJourney();
  if (state.runType === "campaign" && state.elapsed >= currentCampaignLevel().duration) {
    state.levelComplete = true;
    if (state.practice) finishRun(); else beginAwakening();
    return;
  }
  tutorial = Math.max(0, tutorial - delta);
  state.score += delta * (4 + state.multiplier * 1.45);
  const wasFever=state.fever>0;
  const oldFever=state.fever;
  state.fever = Math.max(0, state.fever - delta);
  if(wasFever&&state.fever===0) state.multiplier=1+Math.min(4,state.streak);
  state.invulnerable = Math.max(0, state.invulnerable - delta);
  const worldScale = delta>0 ? worldTravel(delta,oldFever)/delta : 1;
  const previousPlayer = playerPoint();
  const previousAngle=player.angle;
  updateForgiveness(); if (state.mode !== "run") return;
  updateFold(delta);
  const speedScale = foldSpeed();
  player.angle = normalize(player.angle + player.direction * orbitalTravel(state.elapsed-delta,delta) * speedScale);
  player.flip = Math.max(0, player.flip - delta * 7);
  player.glow = Math.max(0, player.glow - delta * 2.8);
  trail.unshift({ ...playerPoint(), life: 1 });
  trail = trail.slice(0, state.fever > 0 ? 26 : player.fold > .3 ? 22 : 14);
  for (const point of trail) point.life -= delta * 1.9;

  for (const gate of gates) {
    gate.previousRadius = gate.radius;
    const gapBefore=gate.gap;
    const ageBefore=gate.age||0;
    gate.radius -= gateDistance(gate,delta*worldScale,ageBefore);
    gate.age=ageBefore+delta*worldScale;
    if(gate.heat&&ageBefore<.6&&gate.age>=.6)beep(230,.09,"triangle");
    gate.gap = normalize(gate.gap + gate.rotation * delta * worldScale);
    if (!gate.resolved && gate.previousRadius > orbitRadius && gate.radius <= orbitRadius) {
      const travel=gateTravelTime(gate,gate.previousRadius-orbitRadius,ageBefore),crossing=crossingTime(travel,oldFever);
      resolveGate(gate,normalize(previousAngle+player.direction*orbitalTravel(state.elapsed-delta,crossing)*speedScale),normalize(gapBefore+gate.rotation*travel));
      if(state.mode!=="run")return;
    }
  }
  gates = gates.filter((gate) => gate.radius > planetRadius - 25);

  for (const hazard of hazards) {
    hazard.age+=delta;
    hazard.angle = normalize(hazard.angle + hazard.speed * delta * worldScale);
    hazard.life -= delta;
    if (hazard.age>=.85 && hazard.life > 0.35 && angleDistance(player.angle, hazard.angle) < 0.135) {beginCrash("hazard");if(state.mode!=="run")return;}
    else if (hazard.age>=.85 && hazard.life > 0.35 && !hazard.brushed && angleDistance(player.angle, hazard.angle) < 0.135 + .12) brushSpark(hazard);
  }
  hazards = hazards.filter((hazard) => hazard.life > 0);
  updateComets(delta, worldScale, phase); if (state.mode !== "run") return;

  updateFragments(delta,worldScale,previousPlayer);
  updateSpawns(delta,phase);

  if (Math.random() < delta * (state.fever > 0 ? 42 : 13)) burst(playerPoint(), currentCosmetic().mid, 1, state.fever > 0 ? 130 : 55, "paper");
  updateEffects(delta);
  updateHud();
}

function updateTutorial(delta) {
  const session = tutorialSession;
  if (!session) return;
  const stepIndex=session.step;
  session.elapsed += delta;
  const previousPlayer = playerPoint(), previousAngle = player.angle;
  player.angle = normalize(player.angle + player.direction * orbitalTravel(session.elapsed - delta, delta));
  player.flip = Math.max(0, player.flip - delta * 7);
  trail.unshift({ ...playerPoint(), life: 1 }); trail = trail.slice(0, 14);
  for (const point of trail) point.life -= delta * 1.9;
  for (const gate of gates) {
    gate.previousRadius = gate.radius; const gapBefore = gate.gap, ageBefore = gate.age || 0;
    gate.radius -= gateDistance(gate, delta, ageBefore); gate.age = ageBefore + delta;
    if (!gate.resolved && gate.previousRadius > orbitRadius && gate.radius <= orbitRadius) {
      const travel = gateTravelTime(gate, gate.previousRadius - orbitRadius, ageBefore);
      resolveGate(gate, normalize(previousAngle + player.direction * orbitalTravel(session.elapsed - delta, travel)), gapBefore);
      if (!tutorialSession || tutorialSession !== session || session.step!==stepIndex || session.elapsed===0) return;
    }
  }
  gates = gates.filter(gate => gate.radius > planetRadius - 25);
  updateFragments(delta, 1, previousPlayer);
  if(tutorialSession===session&&session.step===stepIndex&&session.elapsed>5&&stepIndex>0)resetTutorialStep();
  updateEffects(delta); updateHud();
}

function updateSpawns(delta,phase) {
  if (state.runType === "campaign") {
    const level=currentCampaignLevel();
    nextGate-=delta;nextFragment-=delta;
    if(level.gateTimes[campaignGateIndex]<=state.elapsed&&nextGate<=0){if(spawnGate())campaignGateIndex+=1;nextGate=.25;}
    if(level.fragmentTimes[campaignFragmentIndex]<=state.elapsed&&nextFragment<=0){if(spawnFragment())campaignFragmentIndex+=1;nextFragment=.25;}
  } else {
    nextGate -= delta;
    if (nextGate <= 0) {
      const spawned=spawnGate();
      nextGate = phase.transition ? phase.end - state.elapsed + .2 : !spawned ? .25 : phase.guardian ? 1.55 : gateCount < 3 ? 2.85 : Math.max(1.72, 2.52 - state.elapsed * 0.006);
    }
  }
  nextHazard -= delta;
  const hazardDue=state.runType==="campaign" ? currentCampaignLevel().hazardTimes[campaignHazardIndex]<=state.elapsed : ["void","eclipse","ascension"].includes(phase.id);
  if (hazardDue && nextHazard <= 0) {
    const spawned=spawnHazard();
    if(spawned&&state.runType==="campaign")campaignHazardIndex+=1;
    nextHazard = spawned ? 10 + gameRandom() * 3 : .5;
  }
}

function sweptPickup(before,after,shipBefore,shipAfter,radius) {
  const x=before.x-shipBefore.x,y=before.y-shipBefore.y;
  const dx=after.x-shipAfter.x-x,dy=after.y-shipAfter.y-y;
  const t=Math.max(0,Math.min(1,-(x*dx+y*dy)/(dx*dx+dy*dy||1)));
  return (x+dx*t)**2+(y+dy*t)**2<=radius*radius;
}

function updateFragments(delta,worldScale,previousPlayer) {
  const ship=playerPoint(),pickupRadius=Math.max(48,Math.min(68,orbitRadius*.44));
  for (const fragment of fragments) {
    if(fragment.collected){fragment.snapLife-=delta;continue;}
    const before={x:cx+Math.cos(fragment.angle)*fragment.radius,y:cy+Math.sin(fragment.angle)*fragment.radius};
    fragment.previousRadius = fragment.radius;
    fragment.radius -= fragment.speed * delta * worldScale;
    fragment.spin += delta * 2.4;
    const after={x:cx+Math.cos(fragment.angle)*fragment.radius,y:cy+Math.sin(fragment.angle)*fragment.radius};
    if (sweptPickup(before,after,previousPlayer,ship,pickupRadius)) {
      fragment.collected = true;
      fragment.snapLife=.14;fragment.snapFrom=after;
      if (state.runType === "tutorial") { if (fragment.tutorial) advanceTutorial(); continue; }
        state.runFragments += 1;
        state.runStars += 3;
        labels.push({ text: state.runFragments>3 ? "BONUS FRAGMENT +3" : `FRAGMENT ${state.runFragments}/3`, life: 1, max: 1, y: cy - orbitRadius - 28 });
        burst(playerPoint(), currentCosmetic().gold, 14, 130, "paper");
        beep(720 + Math.min(6,state.runFragments) * 80, .1, "triangle");
    }
  }
  fragments = fragments.filter((fragment) => fragment.collected ? fragment.snapLife>0 : fragment.radius > orbitRadius-pickupRadius-10);
}

function perfectWindow(gate) { return gate.generous && !gate.guardian && !gate.pair ? .24 : .145; }

function resolveGate(gate,crossingAngle=player.angle,crossingGap=gate.gap) {
  if(gate.resolved||state.mode!=="run")return;
  gate.resolved = true;
  const distance = angleDistance(crossingAngle, crossingGap);
  const clearance = gate.opening / 2 - 0.105 - distance;
  if (clearance < 0) {
    const movingAway = angleDistance(normalize(crossingAngle + player.direction * .01), crossingGap) > distance;
    if (realInput && clearance > -.05 && movingAway && state.runType !== "tutorial" && !graceCrash) graceCrash = { deadline: performance.now() + 70 };
    else beginCrash("gate");
    return;
  }
  // Lost letter: an envelope sits in the gate's edge zone on one side; threading that edge collects it.
  if (gate.letter && !gate.letterTaken && angleDistance(crossingAngle, normalize(crossingGap + gate.letter * (gate.opening / 2 - .175))) < .1) collectLetter(gate);
  if (state.runType === "tutorial") {
    if (gate.tutorialKind === "perfect" && clearance >= perfectWindow(gate)) { resetTutorialStep(); return; }
    advanceTutorial(); return;
  }
  state.gatesPassed += 1;
  state.runStars += 1;
  updateGoals("gate", 1);
  if (gate.guardian && gate.guardianId === state.phaseId) state.guardianPassed += 1;
  if (clearance < perfectWindow(gate)) {
    state.perfects += 1;
    state.runStars += 2;
    updateGoals("perfect", 1);
    state.streak += 1;
    state.runBestStreak = Math.max(state.runBestStreak, state.streak);
    state.multiplier = state.fever>0 ? 5 : 1 + Math.min(4, state.streak);
    if(state.fever<=0) state.feverCharge=Math.min(5,state.feverCharge+1);
    state.score += 28 * state.multiplier;
    player.glow = 1;
    rings.push({ radius: orbitRadius, life: 0.65, max: 0.65, color: currentCosmetic().gold, speed: 72 });
    labels.push({ text: state.feverCharge===5 ? "FEVER" : "PERFECT", life: 0.8, max: 0.8, y: cy - orbitRadius - 28 });
    burst(playerPoint(), currentCosmetic().gold, 18, 175, "paper");
    beep(570 + Math.min(5, state.streak) * 62, 0.07, "triangle");
    if (state.feverCharge >= 5 && state.fever <= 0) {
      state.fever = 6;
      state.feverCharge = 0;
      state.feverCount += 1;
      state.runStars += 5;
      updateGoals("fever", 1);
      if (!state.shieldEarned) { state.shield = true; state.shieldEarned = true; }
      state.multiplier = 5;
      flash = 0.65;
      beep(900, 0.17, "sine");
    }
  } else {
    state.score += 18 * state.multiplier;
    state.streak = 0;
    state.multiplier = state.fever>0 ? 5 : 1;
    burst(playerPoint(), currentCosmetic().light, 7, 90, "paper");
    beep(440, 0.045, "sine");
  }
}

function updateEffects(delta) {
  particles = particles.filter((item) => (item.life -= delta) > 0);
  for (const item of particles) {
    item.x += item.vx * delta; item.y += item.vy * delta;
    item.vx *= 0.982; item.vy *= 0.982; item.rotation += item.spin * delta;
  }
  rings = rings.filter((item) => (item.life -= delta) > 0);
  for (const item of rings) item.radius += item.speed * delta;
  labels = labels.filter((item) => (item.life -= delta) > 0);
  for (const item of labels) item.y -= delta * 18;
  shake = Math.max(0, shake - delta * 34);
  flash = Math.max(0, flash - delta * 2.5);
}

function updateAwakening(delta) {
  if(!awakening)return;
  awakening.life-=delta;
  for(const paper of awakening.paper){
    paper.x+=paper.vx*delta;paper.y+=paper.vy*delta;paper.rotation+=paper.spin*delta;
    if(paper.x<12||paper.x>width-12)paper.vx*=-1;
    if(paper.y<12||paper.y>height-12)paper.vy*=-1;
    paper.x=Math.max(12,Math.min(width-12,paper.x));paper.y=Math.max(12,Math.min(height-12,paper.y));
  }
  updateEffects(delta);
  if(awakening.life<=0)finishAwakening();
}

function draw() {
  const time = performance.now() / 1000;
  const palette = currentCosmetic();
  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  drawBackground(time, palette);
  if (state.runType === "campaign") drawBloomScenery(time, palette);
  drawJourneyTransition(time, palette);
  drawPaperWaves(time, palette);
  drawGates(time, palette);
  drawFragments(time, palette);
  drawGuardianAura(time, palette);
  drawAwakening(time, palette, true);
  drawPlanet(time, palette);
  drawAwakening(time, palette);
  drawOrbit(time, palette);
  drawHazards(time, palette);
  drawComets(time, palette);
  drawTrail(palette);
  if (state.mode !== "crash" && state.mode !== "results") drawPlayer(time, palette);
  drawParticles();
  drawRings();
  drawLabels(palette);
  if (state.mode === "crash") drawCrashCurtain(palette);
  if (tutorialSession && state.mode === "run") drawTutorial(time, palette);
  if (state.fever > 0) drawFever(time, palette);
  if (flash > 0) {
    ctx.fillStyle = `rgba(242,207,99,${flash * 0.18})`;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

function drawAwakening(time,palette,behind=false) {
  if(!awakening)return;
  const progress=1-awakening.life/awakening.max,burst=Math.sin(Math.min(1,progress/.8)*Math.PI);
  if(behind){
    ctx.save();ctx.globalAlpha=burst*(state.reducedEffects?.24:.56);ctx.fillStyle=palette.paper;
    const rayCount=state.reducedEffects?4:8;
    for(let i=0;i<rayCount;i++){
      const angle=i*TAU/rayCount-time*.12;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle-.09)*height,cy+Math.sin(angle-.09)*height);ctx.lineTo(cx+Math.cos(angle+.09)*height,cy+Math.sin(angle+.09)*height);ctx.closePath();ctx.fill();
    }
    for(const item of awakening.paper){ctx.globalAlpha=.72*Math.max(0,awakening.life/.55);ctx.fillStyle=item.color;paperDiamond(item.x,item.y,6,item.rotation);}
    ctx.restore();return;
  }
  ctx.save();ctx.translate(cx,cy);ctx.globalAlpha=burst;
  if(awakening.biome==="bloom"){
    ctx.fillStyle=palette.gold;ctx.beginPath();ctx.arc(0,0,planetRadius*.2,0,TAU);ctx.fill();
  }else{
    ctx.fillStyle=palette.gold;ctx.beginPath();ctx.moveTo(-planetRadius*.24,planetRadius*.25);ctx.quadraticCurveTo(-planetRadius*.42,-planetRadius*.1,0,-planetRadius*.72);ctx.quadraticCurveTo(planetRadius*.4,-planetRadius*.04,planetRadius*.2,planetRadius*.3);ctx.closePath();ctx.fill();
    ctx.fillStyle=palette.light;ctx.beginPath();ctx.moveTo(-planetRadius*.08,planetRadius*.2);ctx.quadraticCurveTo(-planetRadius*.14,-planetRadius*.08,0,-planetRadius*.48);ctx.quadraticCurveTo(planetRadius*.16,-planetRadius*.06,planetRadius*.08,planetRadius*.2);ctx.closePath();ctx.fill();
  }
  if(progress>.42){ctx.globalAlpha=Math.min(1,(progress-.42)*4);ctx.fillStyle=palette.light;ctx.font="900 22px Arial";ctx.textAlign="center";ctx.fillText("★".repeat(awakening.rating),0,-planetRadius-30);}
  if(awakening.chapterComplete&&progress>.28){ctx.globalAlpha=Math.min(1,(progress-.28)*3);drawChapterEmblem(ctx,palette,planetRadius*.55);}
  ctx.restore();
}

function drawFragments(time, palette) {
  for (const fragment of fragments) {
    const ship=playerPoint(),progress=fragment.collected?1-(fragment.snapLife/.14)**2:0;
    const x = fragment.collected ? fragment.snapFrom.x+(ship.x-fragment.snapFrom.x)*progress : cx + Math.cos(fragment.angle) * fragment.radius;
    const y = fragment.collected ? fragment.snapFrom.y+(ship.y-fragment.snapFrom.y)*progress : cy + Math.sin(fragment.angle) * fragment.radius;
    ctx.save(); ctx.translate(x, y); ctx.rotate(fragment.spin); ctx.shadowColor = palette.gold; ctx.shadowBlur = state.reducedEffects ? 3 : 12;
    ctx.fillStyle = palette.gold; paperDiamond(0, 0, 9 + Math.sin(time * 5 + fragment.spin) * 1.2, 0);
    ctx.fillStyle = palette.light; paperDiamond(0, 0, 4, Math.PI / 4); ctx.restore();
  }
}

// The flat fill and planet glow only change with the palette, fever and canvas size, so they are painted once into a
// canvas-sized bitmap and copied each frame instead of filling the screen with a fresh radial gradient.
let backgroundLayer = null, backgroundKey = "";
function drawBackground(time, palette) {
  const glowColor = state.fever > 0 ? palette.gold : palette.paper, key = `${palette.bg}${glowColor}${palette.ink}${canvas.width}x${canvas.height}`;
  if (key !== backgroundKey) {
    backgroundKey = key; backgroundLayer ||= document.createElement("canvas");
    backgroundLayer.width = canvas.width; backgroundLayer.height = canvas.height;
    const layer = backgroundLayer.getContext("2d");
    layer.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    layer.fillStyle = palette.bg;
    layer.fillRect(0, 0, width, height);
    const glow = layer.createRadialGradient(cx, cy, planetRadius, cx, cy, height * 0.58);
    glow.addColorStop(0, colorAlpha(glowColor, 0.19));
    glow.addColorStop(0.55, colorAlpha(palette.ink, 0.12));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    layer.fillStyle = glow;
    layer.fillRect(0, 0, width, height);
  }
  ctx.drawImage(backgroundLayer, 0, 0, width, height);
  for (const star of stars) {
    ctx.globalAlpha = 0.16 + Math.sin(time * 1.2 + star.phase) * 0.08;
    ctx.fillStyle = star.phase % 2 > 1 ? palette.mid : palette.light;
    ctx.save(); ctx.translate(star.x, star.y); ctx.rotate(Math.PI / 4); ctx.fillRect(-star.size / 2, -star.size / 2, star.size, star.size); ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawBloomScenery(time, palette) {
  if(state.runType==="campaign"&&currentCampaignLevel().biome==="ember"&&["run","crash","awakening","results"].includes(state.mode)){drawEmberScenery(time,palette);return;}
  ctx.save();
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.globalAlpha = .09 + layer * .035;
    ctx.strokeStyle = [palette.ink, palette.paper, palette.mid][layer];
    ctx.lineWidth = 18 - layer * 5;
    ctx.beginPath();
    ctx.moveTo(-20, height * (.18 + layer * .12));
    ctx.quadraticCurveTo(width * .16, height * (.28 + layer * .05), width * .09, height * (.52 + layer * .08));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width + 20, height * (.12 + layer * .14));
    ctx.quadraticCurveTo(width * .82, height * (.25 + layer * .08), width * .92, height * (.5 + layer * .1));
    ctx.stroke();
  }
  ctx.globalAlpha = .24;
  for (let i = 0; i < 14; i += 1) {
    const side = i % 2 ? 1 : -1;
    const x = side < 0 ? 8 + (i % 3) * 8 : width - 8 - (i % 3) * 8;
    const y = height * (.12 + i * .055);
    ctx.save(); ctx.translate(x, y); ctx.rotate(side * (.55 + Math.sin(time * .7 + i) * .08));
    ctx.fillStyle = i % 3 ? palette.paper : palette.accent;
    ctx.beginPath(); ctx.ellipse(0, 0, 8 + i % 4, 20 + i % 5, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = palette.light; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(0,14); ctx.stroke(); ctx.restore();
  }
  ctx.globalAlpha = .055; ctx.fillStyle = palette.light;
  for (let y = 7; y < height; y += 19) for (let x = (y % 38) + 5; x < width; x += 31) ctx.fillRect(x, y, 1.2, .8);
  ctx.restore();
}

function drawEmberScenery(time,palette) {
  ctx.save();
  for(const side of [-1,1])for(let i=0;i<5;i++){
    const x=side<0?-5:width+5,y=height*(.17+i*.17),depth=14+(i%3)*9;
    ctx.fillStyle=i%2?"#20272d":"#29232c";ctx.beginPath();ctx.moveTo(x,y-48);ctx.lineTo(x-side*depth,y-16);ctx.lineTo(x-side*(depth+8),y+27);ctx.lineTo(x,y+69);ctx.closePath();ctx.fill();
    ctx.strokeStyle=colorAlpha(palette.paper,.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-side*4,y-32);ctx.lineTo(x-side*depth,y-10);ctx.lineTo(x-side*(depth+3),y+15);ctx.stroke();
  }
  if(!state.reducedEffects)for(let i=0;i<10;i++){
    const x=i%2?width-22-(i%3)*8:22+(i%3)*8,y=height-((time*9+i*83)%height);
    ctx.fillStyle=colorAlpha(i%3?palette.paper:palette.light,.2);paperDiamond(x,y,2.3,i+time*.15);
  }
  ctx.restore();
}

function drawJourneyTransition(time, palette) {
  const phase = phaseAt(state.elapsed);
  if (!phase.transition) return;
  const progress = (state.elapsed - phase.start) / (phase.end - phase.start);
  ctx.save(); ctx.globalAlpha = Math.sin(progress * Math.PI) * .7; ctx.fillStyle = palette.paper;
  for (let i=0;i<8;i+=1) {
    const angle=i*TAU/8+time*.25;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(angle-.16)*height,cy+Math.sin(angle-.16)*height); ctx.lineTo(cx+Math.cos(angle+.16)*height,cy+Math.sin(angle+.16)*height); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawCrashCurtain(palette) {
  const progress = 1 - crashTimer / .82;
  const eased = 1 - Math.pow(1 - Math.min(1, progress), 3);
  const pointAt = (t) => ({
    x: width * 1.12 + (width * -.24 - width * 1.12) * t,
    y: height * 1.08 + (height * -.08 - height * 1.08) * t - Math.sin(t * Math.PI) * height * .08,
  });
  const paperStar = (point, size, rotation, color, alpha = 1) => {
    ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(rotation); ctx.globalAlpha *= alpha;
    ctx.shadowColor = color; ctx.shadowBlur = state.reducedEffects ? 3 : size * .7; ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 ? size * .42 : size;
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha *= .48; ctx.fillStyle = palette.light;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size); ctx.lineTo(size * .25, -size * .34); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = colorAlpha(palette.bg, eased * .26); ctx.fillRect(0, 0, width, height);
  if (!state.reducedEffects) {
    ctx.strokeStyle = colorAlpha(palette.gold, .32 * eased); ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 14; i += 1) { const point = pointAt(eased * i / 14); i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y); }
    ctx.stroke();
  }
  for (let i = 5; i >= 1; i -= 1) {
    const wake = eased - i * .075;
    if (wake > 0) paperStar(pointAt(wake), 7 + (5 - i) * 2.2, wake * 5 + i, [palette.accent, palette.paper, palette.light][i % 3], Math.min(1, wake * 3));
  }
  paperStar(pointAt(eased), Math.min(width, height) * .075, eased * 4, palette.gold);
  ctx.restore();
}

function drawPaperWaves(time, palette) {
  ctx.save();
  ctx.globalAlpha = state.fever > 0 ? 0.18 : 0.08;
  for (let layer = 0; layer < 3; layer += 1) {
    ctx.fillStyle = [palette.paper, palette.accent, palette.gold][layer];
    ctx.beginPath();
    ctx.moveTo(-20, height);
    for (let x = -20; x <= width + 20; x += 24) {
      const y = height * (0.82 + layer * 0.055) + Math.sin(x * 0.025 + time * (0.35 + layer * 0.08)) * (16 + layer * 5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width + 20, height); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawGates(time, palette) {
  for (const gate of gates) {
    const alpha = gate.resolved ? 0.3 : Math.min(1, (orbitRadius + 210 - gate.radius) / 145 + 0.16);
    const colors = [palette.paper, palette.accent, palette.gold];
    const color = state.runType==="campaign"&&currentCampaignLevel().biome==="ember" ? gate.heat?palette.mid:palette.paper : colors[gate.palette];
    const half = gate.opening / 2;
    const start = gate.gap + half;
    const end = gate.gap + TAU - half;
    ctx.save();
    ctx.globalAlpha = Math.max(0.12, alpha);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = gate.guardian ? 18 : 13;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx + 2, cy + 3, gate.radius, start, end); ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = gate.guardian ? 11 : gate.type === 3 ? 9 : 7;
    ctx.beginPath(); ctx.arc(cx, cy, gate.radius, start, end); ctx.stroke();
    drawGateDetails(gate, start, end, color, palette, time);
    if(gate.heat)drawHeatWarning(gate,palette);
    if(gate.generous) drawPerfectPetals(gate,palette);
    if(gate.letter && !gate.letterTaken && !gate.resolved) drawLetter(gate.gap + gate.letter * (half - .175), gate.radius, palette, time);
    drawSideGuidance(gate,time,palette,alpha);
    for (const side of [-1, 1]) {
      const angle = gate.gap + side * half;
      const x = cx + Math.cos(angle) * gate.radius;
      const y = cy + Math.sin(angle) * gate.radius;
      ctx.fillStyle = palette.light;
      paperDiamond(x, y, 6 + Math.sin(time * 6 + gate.radius) * 1.2, angle);
    }
    ctx.restore();
  }
}

function drawHeatWarning(gate,palette) {
  const age=gate.age||0,warming=age>=.6&&age<1.6;
  ctx.save();ctx.globalAlpha=gate.resolved?.2:warming?.95:.6;
  ctx.strokeStyle=warming?palette.light:palette.mid;ctx.lineWidth=warming?2.8:1.8;
  // Inward double folds mark solid paper, never the safe opening.
  for(let mark=0;mark<7;mark++)for(let fold=0;fold<2;fold++){
    const angle=gate.gap+gate.opening/2+.25+mark*(TAU-gate.opening-.5)/6,r=gate.radius+9+fold*7;
    ctx.save();ctx.translate(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(3,-5);ctx.lineTo(-3,0);ctx.lineTo(3,5);ctx.stroke();ctx.restore();
  }
  ctx.restore();
}

function drawPerfectPetals(gate,palette) {
  ctx.save();ctx.fillStyle=palette.gold;
  for(const side of [-1,1]) for(let petal=0;petal<3;petal+=1){
    const angle=gate.gap+side*(gate.opening/2-.105-.24*(petal+.5)/3);
    ctx.save();ctx.translate(cx+Math.cos(angle)*gate.radius,cy+Math.sin(angle)*gate.radius);ctx.rotate(angle);
    ctx.beginPath();ctx.ellipse(0,0,5,2.5,.35*side,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();
}

function drawSideGuidance(gate,time,palette,gateAlpha) {
  if (!gate.sideOpening || gate.warningStrength <= 0 || gate.guardian) return;
  const strength=gate.warningStrength;
  const approach=Math.max(0,Math.min(1,1-(gate.radius-orbitRadius)/(Math.min(width,height)*.56)));
  const pulse=state.reducedEffects ? 1 : .82+Math.sin(time*7+gate.radius*.04)*.18;
  ctx.save();
  ctx.globalAlpha=Math.min(1,gateAlpha)*strength*(.5+approach*.5)*pulse;
  ctx.fillStyle=palette.accent;
  ctx.strokeStyle=colorAlpha(palette.accent,.7);
  ctx.lineWidth=2;
  if(!state.reducedEffects){ctx.shadowColor=palette.accent;ctx.shadowBlur=10+strength*10;}
  for(const side of [-1,1]){
    const angle=gate.gap+side*gate.opening*.5;
    const x=cx+Math.cos(angle)*gate.radius,y=cy+Math.sin(angle)*gate.radius;
    ctx.save();ctx.translate(x,y);ctx.rotate(angle+Math.PI/2);
    ctx.beginPath();ctx.moveTo(-side*13,-7);ctx.lineTo(side*2,0);ctx.lineTo(-side*13,7);ctx.lineTo(-side*8,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    const inner=gate.radius-10-approach*6;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(angle)*gate.radius,cy+Math.sin(angle)*gate.radius);ctx.lineTo(cx+Math.cos(angle-side*.12)*inner,cy+Math.sin(angle-side*.12)*inner);ctx.stroke();
  }
  const centerX=cx+Math.cos(gate.gap)*gate.radius,centerY=cy+Math.sin(gate.gap)*gate.radius;
  ctx.fillStyle=palette.gold;ctx.globalAlpha*=.82;paperDiamond(centerX,centerY,3+strength*2,gate.gap);
  ctx.restore();
}

function drawGuardianAura(time, palette) {
  const phase = phaseAt(state.elapsed);
  if (!phase.guardian || state.mode !== "run") return;
  if (phase.id === "budkeeper") { drawBudkeeper(time, palette); return; }
  const count = phase.id === "forge" || phase.id === "solar-forge-guardian" ? 4 : phase.id === "eclipse" ? 2 : 8;
  ctx.save(); ctx.globalAlpha = .32; ctx.strokeStyle = palette.accent; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, planetRadius + 18 + Math.sin(time * 4) * 3, 0, TAU); ctx.stroke();
  ctx.fillStyle = phase.id === "eclipse" ? palette.ink : palette.gold;
  for (let i=0;i<count;i+=1) {
    const angle=time*(phase.id === "forge" || phase.id === "solar-forge-guardian" ? 1.4 : .45)+i*TAU/count;
    paperDiamond(cx+Math.cos(angle)*(planetRadius+20),cy+Math.sin(angle)*(planetRadius+20),phase.id === "eclipse" ? 9 : 5,angle);
  }
  ctx.restore();
}

function drawBudkeeper(time, palette) {
  const pulse = 1 + Math.sin(time * 4) * .04;
  ctx.save(); ctx.translate(cx,cy); ctx.scale(pulse,pulse);
  ctx.globalAlpha=.24; ctx.fillStyle=palette.gold;
  for(let i=0;i<10;i+=1){ctx.save();ctx.rotate(i*TAU/10+time*.08);ctx.translate(0,-planetRadius*1.08);ctx.beginPath();ctx.ellipse(0,0,8,20,0,0,TAU);ctx.fill();ctx.restore();}
  ctx.globalAlpha=.8; ctx.fillStyle=palette.ink; ctx.beginPath();ctx.arc(0,0,planetRadius*.2,0,TAU);ctx.fill();
  ctx.fillStyle=palette.gold; ctx.beginPath();ctx.arc(0,0,planetRadius*.09,0,TAU);ctx.fill();
  ctx.strokeStyle=palette.light;ctx.lineWidth=2;ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(0,0,planetRadius+13,-Math.PI/2,-Math.PI/2+TAU*state.guardianPassed/3);ctx.stroke();
  ctx.restore();
}

function drawGateDetails(gate, start, end, color, palette, time) {
  const step = gate.type === 2 ? 0.24 : 0.36;
  for (let angle = start + 0.18; angle < end - 0.12; angle += step) {
    const x = cx + Math.cos(angle) * gate.radius;
    const y = cy + Math.sin(angle) * gate.radius;
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (gate.guardian && gate.guardianId === "budkeeper") {
      ctx.fillStyle = angle % .72 < .36 ? palette.accent : palette.gold;
      ctx.beginPath(); ctx.moveTo(-6,12); ctx.quadraticCurveTo(0,1,6,12); ctx.quadraticCurveTo(0,19,-6,12); ctx.fill();
      ctx.fillStyle=palette.light;ctx.beginPath();ctx.arc(0,11,2.2,0,TAU);ctx.fill();
    } else if (state.runType === "campaign" && currentCampaignLevel().biome==="ember") {
      ctx.fillStyle=palette.paper;ctx.beginPath();ctx.moveTo(-5,3);ctx.lineTo(-1,15);ctx.lineTo(5,8);ctx.lineTo(2,1);ctx.closePath();ctx.fill();
      ctx.strokeStyle=palette.light;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-1,4);ctx.lineTo(1,10);ctx.stroke();
    } else if (state.runType === "campaign" && !gate.guardian) {
      ctx.fillStyle = angle % .72 < .36 ? palette.mid : palette.light;
      ctx.beginPath(); ctx.ellipse(0, 8, 4, 10 + Math.sin(time * 1.6 + angle) * 1.5, angle % .72 < .36 ? .5 : -.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0,2); ctx.quadraticCurveTo(4,7,0,15); ctx.stroke();
    } else if (gate.type === 0) {
      ctx.fillStyle = angle % 0.72 < 0.36 ? palette.mid : palette.light;
      ctx.beginPath(); ctx.ellipse(0, 8, 3.5, 8, angle % 0.72 < 0.36 ? 0.45 : -0.45, 0, TAU); ctx.fill();
    } else if (gate.type === 1) {
      ctx.fillStyle = angle % 0.72 < 0.36 ? palette.light : color;
      ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(0, 13); ctx.lineTo(5, 4); ctx.closePath(); ctx.fill();
    } else if (gate.type === 2) {
      ctx.fillStyle = angle % 0.48 < 0.24 ? palette.gold : palette.light;
      ctx.beginPath(); ctx.arc(0, 7 + Math.sin(time * 2 + angle) * 1.5, 2.2, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = palette.ink;
      ctx.fillRect(-5, 5, 10, 4);
    }
    ctx.restore();
  }
}

function drawPlanet(time, palette) {
  const kick = state.mode === "crash" ? Math.sin(crashTimer * 36) * crashTimer * 8 : 0;
  const ember=state.runType==="campaign"&&currentCampaignLevel().biome==="ember"&&["run","crash","awakening","results"].includes(state.mode);
  OrbitArt.drawLivingPlanet(ctx,ember?"ember-furnace":"bloom-crown",{x:cx+kick,y:cy,radius:planetRadius,paletteId:palette.id,time:time*(state.fever>0?1.8:1),reduced:state.reducedEffects});
}

function drawBiomeMarks(time, palette) {
  for (let i = 0; i < 10; i += 1) {
    const angle = i * TAU / 10 + 0.2;
    const r = planetRadius * (0.62 + (i % 3) * 0.09);
    ctx.save(); ctx.translate(Math.cos(angle) * r, Math.sin(angle) * r); ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = i % 3 === 0 ? palette.accent : palette.gold;
    if (currentCosmetic().shape === "leaf") {
      ctx.beginPath(); ctx.ellipse(0, -4, 3.5, 9 + Math.sin(time + i), 0.25 * (i % 2 ? 1 : -1), 0, TAU); ctx.fill();
    } else if (currentCosmetic().shape === "flame") {
      ctx.beginPath(); ctx.moveTo(-4, 2); ctx.quadraticCurveTo(-2, -8, 0, -13); ctx.quadraticCurveTo(7, -3, 3, 3); ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, -4, 7, -Math.PI / 2, Math.PI / 2); ctx.arc(3, -4, 5, Math.PI / 2, -Math.PI / 2, true); ctx.fill();
    }
    ctx.restore();
  }
}

function drawOrbit(time, palette) {
  ctx.save();
  ctx.setLineDash([2, 11]);
  ctx.lineDashOffset = -time * (state.fever > 0 ? 46 : 20) * player.direction;
  ctx.strokeStyle = colorAlpha(state.fever > 0 ? palette.gold : palette.light, state.fever > 0 ? 0.72 : 0.25);
  ctx.lineWidth = state.fever > 0 ? 3 : 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius, 0, TAU); ctx.stroke();
  ctx.restore();
}

function drawTrail(palette) {
  ctx.save();
  for (let i = trail.length - 1; i >= 0; i -= 1) {
    const point = trail[i];
    const size = Math.max(1, (1 - i / trail.length) * (state.fever > 0 ? 9 : 5));
    ctx.globalAlpha = Math.max(0, point.life) * 0.52;
    ctx.fillStyle = i % 2 ? palette.accent : palette.gold;
    drawTrailPiece(ctx,state.selectedTrail,point.x,point.y,size,player.angle,i);
  }
  ctx.restore();
}

function drawTrailPiece(target,id,x,y,size,angle,index) {
  target.save();target.translate(x,y);
  const diamond=(s,rotation)=>{target.save();target.rotate(rotation);target.beginPath();target.moveTo(0,-s);target.lineTo(s*.72,0);target.lineTo(0,s);target.lineTo(-s*.72,0);target.closePath();target.fill();target.restore();};
  if(id==="pressed-petal"){target.rotate(angle*.5+index*.9);for(let k=0;k<5;k+=1){target.rotate(TAU/5);target.beginPath();target.ellipse(0,-size*.6,size*.34,size*.6,0,0,TAU);target.fill();}target.fillStyle="#FFF4DC";target.beginPath();target.arc(0,0,size*.26,0,TAU);target.fill();}
  else if(id==="bloom-wake"){target.rotate(angle+index*.15);target.beginPath();target.ellipse(0,0,size*.72,size*1.5,.45,0,TAU);target.fill();}
  else if(id==="pollen"){target.beginPath();target.arc(0,0,size*.65,0,TAU);target.fill();}
  else if(id==="spark")diamond(size*1.25,angle+index);
  else if(id==="ribbon")target.fillRect(-size*1.5,-1,size*3,2);
  else if(id==="echo"){target.strokeStyle=target.fillStyle;target.lineWidth=1.5;target.beginPath();target.arc(0,0,size,0,TAU);target.stroke();}
  else if(id==="crown"){diamond(size,angle);diamond(size*.55,angle+Math.PI/2);}
  else diamond(size,angle);
  target.restore();
}

function drawPlayer(time, palette) {
  const point = playerPoint();
  const scale = width < 350 ? 0.88 : width > 420 ? 1.08 : 1;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(player.angle + player.direction * Math.PI / 2 + player.flip * player.direction * 0.18);
  ctx.scale(scale * (1 + player.fold * .08), scale * (1 - player.fold * .3));
  if (player.fold > .05) drawFoldStreaks(palette);
  drawGlider(ctx, currentRider(), palette, 1, time, player.flip, state.fever > 0, player.glow);
  ctx.restore();
}

function drawHazards(time, palette) {
  for (const hazard of hazards) {
    const x = cx + Math.cos(hazard.angle) * orbitRadius;
    const y = cy + Math.sin(hazard.angle) * orbitRadius;
    ctx.save();ctx.globalAlpha=hazard.age<.85?.35:1; ctx.translate(x, y); ctx.rotate(time * -2.1 + hazard.phase);
    ctx.fillStyle = palette.ink; paperDiamond(2, 3, 15, 0);
    ctx.fillStyle = palette.accent;
    for (let i = 0; i < 4; i += 1) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(-3, -3); ctx.lineTo(0, -17); ctx.lineTo(4, -3); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = palette.gold; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
    ctx.restore();
  }
}

function drawParticles() {
  for (const item of particles) {
    ctx.save(); ctx.globalAlpha = item.life / item.max; ctx.fillStyle = item.color; ctx.translate(item.x, item.y); ctx.rotate(item.rotation);
    if (item.shape === "shard") { ctx.beginPath(); ctx.moveTo(-item.size, item.size); ctx.lineTo(0, -item.size * 1.8); ctx.lineTo(item.size, item.size); ctx.fill(); }
    else if (item.shape === "paper") paperDiamond(0, 0, item.size, 0);
    else { ctx.beginPath(); ctx.arc(0, 0, item.size, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
}

function drawRings() {
  for (const ring of rings) {
    ring.start ??= ring.radius;
    ctx.globalAlpha = ring.life / ring.max;
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 2 + ring.life * 4;
    ctx.beginPath(); ctx.arc(cx, cy, ring.radius, 0, TAU); ctx.stroke();
    // A dashed echo trails each shockwave, like a second orbit rippling outward.
    ctx.globalAlpha *= .7; ctx.lineWidth = 2; ctx.setLineDash([2, 9]); ctx.lineDashOffset = ring.life * 40;
    ctx.beginPath(); ctx.arc(cx, cy, ring.start + (ring.radius - ring.start) * .55, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.globalAlpha = 1;
}

function drawLabels(palette) {
  // Labels land like a stamped paper tag: overshoot, settle, drift up. A perfect streak shows its count.
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const label of labels) {
    label.streak ??= label.text === "PERFECT" ? state.streak : 0;
    const age = label.max - label.life, pop = age < .16 ? .4 + age / .16 * .9 : Math.max(1, 1.3 - (age - .16) * 3);
    const big = label.text === "PERFECT" || label.text === "FEVER", text = label.streak > 1 ? `${label.text} ×${label.streak}` : label.text;
    ctx.globalAlpha = Math.min(1, label.life / label.max * 2.2);
    ctx.font = `${big ? 24 : 17}px "Lilita One", "Arial Black", sans-serif`;
    ctx.save(); ctx.translate(cx, label.y - age * 16); ctx.scale(pop, pop); ctx.rotate(-.04);
    ctx.fillStyle = palette.ink; ctx.fillText(text, 2, 3);
    ctx.fillStyle = palette.gold; ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// Comet warning: a dotted line along the whole path and a pulsing ring where it crosses the orbit; then a folded paper
// star with three ribbon tails flies the line.
function drawComets(time, palette) {
  for (const comet of comets) {
    const ox = cx + Math.cos(comet.cross) * orbitRadius, oy = cy + Math.sin(comet.cross) * orbitRadius;
    const warn = Math.min(1, comet.clock / COMET_WARN), flying = comet.clock >= COMET_WARN;
    ctx.save();
    ctx.globalAlpha = flying ? .3 : .5 + .4 * Math.abs(Math.sin(time * 9));
    ctx.strokeStyle = palette.gold; ctx.lineWidth = 3; ctx.setLineDash([3, 9]); ctx.lineCap = "round";
    const toPlanet = Math.max(0, orbitRadius - planetRadius) / Math.max(.3, -(comet.dx * Math.cos(comet.cross) + comet.dy * Math.sin(comet.cross)));
    ctx.beginPath(); ctx.moveTo(ox - comet.dx * 700, oy - comet.dy * 700); ctx.lineTo(ox + comet.dx * toPlanet, oy + comet.dy * toPlanet); ctx.stroke();
    ctx.setLineDash([]);
    if (!flying) { ctx.globalAlpha = .9; ctx.strokeStyle = palette.gold; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(ox, oy, 32 - warn * 14, 0, TAU); ctx.stroke(); }
    if (flying) {
      const point = cometPoint(comet), angle = Math.atan2(comet.dy, comet.dx);
      ctx.globalAlpha = 1; ctx.translate(point.x, point.y); ctx.rotate(angle);
      for (let i = 0; i < 3; i += 1) {
        ctx.globalAlpha = .7 - i * .18; ctx.fillStyle = i === 1 ? palette.gold : palette.paper;
        const y = (i - 1) * 6, wave = Math.sin(time * 14 + i) * 3;
        ctx.beginPath(); ctx.moveTo(-6, y - 2); ctx.quadraticCurveTo(-30, y + wave, -58 - i * 8, y); ctx.quadraticCurveTo(-30, y + wave + 2, -6, y + 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.rotate(comet.spin);
      ctx.fillStyle = palette.ink; drawStarShape(2, 3, 13);
      ctx.fillStyle = palette.gold; drawStarShape(0, 0, 13);
      ctx.fillStyle = palette.light; drawStarShape(0, 0, 5);
    }
    ctx.restore();
  }
}
function drawStarShape(x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) { const a = -Math.PI / 2 + i * Math.PI / 5, radius = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius); }
  ctx.closePath(); ctx.fill();
}

// A lost letter: a small folded envelope with a gold seal, bobbing in the gate's edge zone.
function drawLetter(angle, radius, palette, time) {
  ctx.save(); ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius); ctx.rotate(angle + Math.PI / 2 + Math.sin(time * 3) * .12); ctx.scale(1.3, 1.3);
  ctx.fillStyle = palette.ink; ctx.fillRect(-8, -5, 18, 13);
  ctx.fillStyle = palette.light; ctx.fillRect(-9, -6, 18, 12);
  ctx.strokeStyle = palette.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(0, 1); ctx.lineTo(9, -6); ctx.stroke();
  ctx.fillStyle = palette.gold; ctx.beginPath(); ctx.arc(0, 1, 2.6, 0, TAU); ctx.fill();
  ctx.restore();
}

// Paper streaks peel off the tucked glider's wings (glider space: nose points +x).
function drawFoldStreaks(palette) {
  ctx.save(); ctx.globalAlpha = .55 * player.fold; ctx.fillStyle = palette.light;
  const t = performance.now() / 90;
  for (let i = 0; i < 4; i += 1) {
    const y = (i - 1.5) * 9, phase = (t + i * .37) % 1, x = -26 - phase * 34, length = 16 + (i % 2) * 8;
    ctx.globalAlpha = .55 * player.fold * (1 - phase);
    ctx.beginPath(); ctx.moveTo(x, y - 1.2); ctx.lineTo(x - length, y); ctx.lineTo(x, y + 1.2); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawTutorial(time, palette) {
  const point = playerPoint();
  const ghostAngle = normalize(player.angle - player.direction * 0.55);
  const gx = cx + Math.cos(ghostAngle) * orbitRadius;
  const gy = cy + Math.sin(ghostAngle) * orbitRadius;
  const step = tutorialSteps[tutorialSession.step];
  ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(time * 4) * 0.12;
  ctx.strokeStyle = palette.gold; ctx.lineWidth = 3; ctx.setLineDash([5, 6]);
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius, Math.min(player.angle, ghostAngle), Math.max(player.angle, ghostAngle)); ctx.stroke();
  ctx.fillStyle = palette.gold; paperDiamond(gx, gy, 9, ghostAngle);
  const target = gates[0] ? { x: cx + Math.cos(gates[0].gap) * gates[0].radius, y: cy + Math.sin(gates[0].gap) * gates[0].radius } : fragments[0] ? { x: cx + Math.cos(fragments[0].angle) * fragments[0].radius, y: cy + Math.sin(fragments[0].angle) * fragments[0].radius } : point;
  if (step.kind !== "reverse") { ctx.globalAlpha = .18 + Math.sin(time * 6) * .08; ctx.fillStyle = palette.gold; ctx.beginPath(); ctx.arc(target.x, target.y, 24, 0, TAU); ctx.fill(); }
  ctx.fillStyle = palette.light; ctx.beginPath(); ctx.arc(point.x, point.y, 30 + Math.sin(time * 5) * 4, 0, TAU); ctx.globalAlpha = 0.08; ctx.fill();
  ctx.restore();
}

function drawFever(time, palette) {
  ctx.save(); ctx.globalAlpha = 0.14 + Math.sin(time * 8) * 0.035; ctx.strokeStyle = palette.gold; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.arc(cx, cy, orbitRadius + 18 + Math.sin(time * 6) * 4, 0, TAU); ctx.stroke(); ctx.restore();
}

function burst(point, color, count, speed, shape) {
  const cap = state.reducedEffects ? 90 : MAX_PARTICLES;
  const room = Math.max(0, cap - particles.length);
  for (let i = 0; i < Math.min(count, room); i += 1) {
    const angle = Math.random() * TAU;
    const velocity = speed * (0.35 + Math.random() * 0.65);
    const life = 0.25 + Math.random() * 0.38;
    particles.push({
      x: point.x, y: point.y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
      size: 1.5 + Math.random() * 3, life, max: life, color, shape,
      rotation: Math.random() * TAU, spin: (Math.random() - 0.5) * 8,
    });
  }
}

function drawGlider(target, rider, palette, scale = 1, time = 0, flip = 0, fever = false, glow = 0) {
  const wing = (fever ? 1.16 : 1) * (1 - flip * 0.14);
  target.save(); target.scale(scale, scale * wing);
  target.fillStyle = "rgba(0,0,0,.28)"; target.beginPath(); target.ellipse(-2, 4, 30, 17, 0, 0, TAU); target.fill();
  const path = () => {
    target.beginPath();
    if (rider.shape === "manta") { target.moveTo(31,0); target.lineTo(5,-7); target.lineTo(-17,-24); target.lineTo(-29,-18); target.lineTo(-20,0); target.lineTo(-29,18); target.lineTo(-17,24); target.lineTo(5,7); }
    else if (rider.shape === "dart") { target.moveTo(32,0); target.lineTo(-17,-23); target.lineTo(-8,-5); target.lineTo(-30,-10); target.lineTo(-19,0); target.lineTo(-30,10); target.lineTo(-8,5); target.lineTo(-17,23); }
    else if (rider.shape === "crescent") { target.moveTo(31,0); target.quadraticCurveTo(-4,-7,-25,-24); target.quadraticCurveTo(-36,-5,-16,0); target.quadraticCurveTo(-36,5,-25,24); target.quadraticCurveTo(-4,7,31,0); }
    else if (rider.shape === "splitwing") { target.moveTo(32,0); target.lineTo(-25,-22); target.lineTo(-8,-3); target.lineTo(-28,0); target.lineTo(-8,3); target.lineTo(-25,22); }
    else if (rider.shape === "shuttle") { target.moveTo(30,0); target.lineTo(12,-9); target.lineTo(-20,-17); target.lineTo(-28,-8); target.lineTo(-24,0); target.lineTo(-28,8); target.lineTo(-20,17); target.lineTo(12,9); }
    else { target.moveTo(31,0); target.lineTo(5,-7); target.arc(-8,0,22,-.3,TAU+.3); target.lineTo(5,7); }
    target.closePath();
  };
  target.fillStyle = palette.ink; path(); target.fill();
  target.save(); target.scale(.91,.82); target.fillStyle = palette.light; path(); target.fill(); target.restore();
  target.fillStyle = palette.paper; target.beginPath(); target.moveTo(29,0); target.lineTo(2,-7); target.lineTo(-12,0); target.lineTo(2,7); target.closePath(); target.fill();
  target.fillStyle = palette.accent; target.beginPath(); target.moveTo(14,0); target.lineTo(-8,-5); target.lineTo(-17,0); target.lineTo(-8,5); target.closePath(); target.fill();
  target.fillStyle = palette.gold; target.beginPath(); target.moveTo(-20,-5); target.lineTo(-31-(fever?7:0),0); target.lineTo(-20,5); target.closePath(); target.fill();
  if (glow || fever) { target.globalAlpha=.35+glow*.3+Math.sin(time*9)*.08; target.strokeStyle=palette.gold; target.lineWidth=2+glow*2; path(); target.stroke(); }
  target.restore();
}

function gliderBurst(point, palette) {
  for (let i=0;i<5;i+=1) {
    const angle=Math.random()*TAU, life=.48+Math.random()*.2;
    particles.push({x:point.x,y:point.y,vx:Math.cos(angle)*150,vy:Math.sin(angle)*150,size:5+Math.random()*4,life,max:life,color:[palette.light,palette.paper,palette.accent,palette.gold][i%4],shape:"shard",rotation:angle,spin:(Math.random()-.5)*9});
  }
}

function blobPath(x, y, radius, wobble, lobes, offset = 0) {
  ctx.beginPath();
  for (let i = 0; i <= 36; i += 1) {
    const angle = i / 36 * TAU;
    const r = radius * (1 + Math.sin(angle * lobes + offset) * wobble);
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function paperDiamond(x, y, size, rotation) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.beginPath();
  ctx.moveTo(0, -size); ctx.lineTo(size * 0.72, 0); ctx.lineTo(0, size); ctx.lineTo(-size * 0.72, 0); ctx.closePath(); ctx.fill(); ctx.restore();
}

function playerPoint() { return { x: cx + Math.cos(player.angle) * orbitRadius, y: cy + Math.sin(player.angle) * orbitRadius }; }
function playerSpeed() { return Math.min(2.45, 1.66 + state.elapsed * 0.009); }
function normalize(angle) { return (angle % TAU + TAU) % TAU; }
function angleDistance(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))); }
function currentCosmetic() {
  const chapterRun=state.runType==="campaign"&&["run","crash","awakening","results"].includes(state.mode);
  const id=chapterRun ? currentCampaignLevel().biome : state.selected;
  return cosmetics.find((item) => item.id === id) || cosmetics[0];
}
function currentRider() { return riders.find((item) => item.id === state.selectedRider) || riders[0]; }
function colorAlpha(hex, alpha) { const value = parseInt(hex.slice(1), 16); return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${alpha})`; }

function showScreen(name) {
  ui.shell.classList.remove("playing");
  ui.shell.classList.remove("crashing");
  stopMusic();
  hideScreens(); ui.tutorialPanel.hidden = true;
  ui[name].hidden = false;
  state.mode = name;
  if (name === "home") {
    pipRig?.react("enter");
    player.direction = 1;
    player.flip = 0;
    trail = [];
    updateHome();
  }
  if (name === "garage") { hangarPick.planes = hangarPick.paint = hangarPick.trails = null; renderGarage(); }
  if (name === "mailbag") renderMailbag();
  if (name === "campaign") {
    renderCampaignMap();
    ui.campaign.classList.remove("arriving");
    void ui.campaign.offsetWidth;
    ui.campaign.classList.add("arriving");
  }
  if (name === "bloomChapter") renderBloomChapter();
  window.OrbitArchipelago?.setActive(name === "campaign");
}

function hideScreens() { for (const screen of [ui.home, ui.campaign, ui.bloomChapter, ui.garage, ui.settings, ui.results, ui.mailbag]) screen.hidden = true; }

// Results star: folded paper star (face + shaded half) with a small glint that twinkles once it is earned.
const resultStar = '<svg viewBox="0 0 48 48"><polygon class="star-face" points="24,3 29.6,17 44.5,17.8 32.9,27.2 36.8,41.6 24,33.4 11.2,41.6 15.1,27.2 3.5,17.8 18.4,17"/><polygon class="star-fold" points="24,3 29.6,17 44.5,17.8 32.9,27.2 36.8,41.6 24,33.4"/><path class="star-glint" d="M40 2 L41.6 6.4 46 8 41.6 9.6 40 14 38.4 9.6 34 8 38.4 6.4 Z"/></svg>';
const lockIcon = '<svg aria-hidden="true" viewBox="0 0 48 48"><path d="M15 22 V16 Q15 7 24 7 Q33 7 33 16 V22" fill="none" stroke="#E9D6B0" stroke-width="5"/><rect x="9" y="21" width="30" height="21" rx="5" fill="#FFF4DC"/><path d="M9 31 H39 V37 Q39 42 34 42 H14 Q9 42 9 37 Z" fill="#E9D6B0"/><circle cx="24" cy="30" r="3" fill="#12363D"/></svg>';
function mapProgress(value, max) { return `<i class="map-bar"><i style="width:${Math.min(100, value / max * 100)}%"></i></i>${value}/${max} ★`; }

function renderCampaignMap() {
  const rating = campaignLevels.reduce((total,level)=>total+(state.campaign.ratings[level.id]||0),0);
  ui.campaignStars.textContent = `${rating}/${campaignLevels.length*3}`;
  const chapterRating = biome => campaignLevels.filter(level=>level.biome===biome).reduce((total,level)=>total+(state.campaign.ratings[level.id]||0),0);
  ui.firstLightRating.innerHTML = mapProgress(chapterRating("bloom"), 12);
  const ember = ui.campaign.querySelector(".ember-island");
  const completed = state.campaign.completed.includes("first-light");
  const unlocked=isLevelUnlocked("kindling");
  ember.disabled=!unlocked;
  ember.classList.toggle("locked",!unlocked);
  ember.classList.toggle("revealed", unlocked);
  ember.querySelector("em").innerHTML = unlocked ? mapProgress(chapterRating("ember"), 12) : `${lockIcon}Clear Crown of Petals`;
  ember.querySelector("em").classList.toggle("lock-badge", !unlocked);
  const nextChapter = !state.campaign.completed.includes("crown-of-petals") ? "bloom" : unlocked && !state.campaign.completed.includes("solar-forge") ? "ember" : "";
  ui.mapNext.hidden = !nextChapter; ui.mapNext.dataset.chapter = nextChapter;
  ui.ascensionBest.textContent = state.best ? `Endless run · Best ${state.best}` : "Endless run";
  window.OrbitArchipelago?.setCompleted(completed);
  window.OrbitArchipelago?.setRestoration(state.campaign.restoration);
  window.OrbitArchipelago?.setEmberRestoration?.(state.campaign.emberRestoration);
}

// Set by a campaign clear; the chapter screen plays it once: new stars pop on that level and, on a first clear, the
// equipped ship flies the trail to the next level, which then ignites.
let chapterReveal = null;
function renderBloomChapter() {
  const ember=state.chapter==="ember",levels=campaignLevels.filter(level=>level.biome===state.chapter);
  const rating = levels.reduce((total,level)=>total+(state.campaign.ratings[level.id]||0),0);
  ui.bloomChapter.dataset.biome=state.chapter;
  ui.bloomChapter.querySelector(".eyebrow").textContent=ember?"Ember Chapter":"Bloom Chapter";
  ui.bloomChapter.querySelector("h2").textContent=ember?"Light the Furnace":"Restore the Crown";
  ui.bloomProgress.textContent = `${rating}/${levels.length*3}`;
  const open = levels.filter(level => isLevelUnlocked(level.id));
  const nextLevel = open.find(level => !state.campaign.completed.includes(level.id));
  const playLevel = nextLevel || open[open.length - 1] || levels[0];
  ui.bloomStory.textContent = nextLevel ? nextLevel.story : ember ? "A first flame breathes beneath the folded stone." : "The Bloom Crown shines in rhythm again.";
  const revealIndex = chapterReveal ? levels.findIndex(level => level.id === chapterReveal.level) : -1;
  const reveal = revealIndex >= 0 && !state.reducedEffects ? chapterReveal : null;
  if (revealIndex >= 0) chapterReveal = null;
  const igniteIndex = reveal?.unlocked && levels[revealIndex + 1] && isLevelUnlocked(levels[revealIndex + 1].id) ? revealIndex + 1 : -1;
  ui.bloomLevels.innerHTML = "";
  ui.bloomLevels.style?.setProperty("--rows", levels.length);
  levels.forEach((level, index) => {
    const unlocked = isLevelUnlocked(level.id), stars = state.campaign.ratings[level.id] || 0, number = campaignLevels.indexOf(level) + 1, isNext = level === nextLevel;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chapter-level${unlocked ? "" : " locked"}${stars ? " completed" : ""}${isNext ? " next" : ""}${index === igniteIndex ? " igniting" : ""}`;
    button.disabled = !unlocked;
    button.setAttribute("aria-label", `Level ${number}, ${level.name}${unlocked ? `, ${stars} of 3 stars` : ", locked"}`);
    const top = isNext ? '<i class="next-tag">Next</i>' : unlocked ? `<span class="level-stars">${[0,1,2].map(i=>`<i class="${i<stars?"on":""}${index===revealIndex&&reveal&&i>=reveal.starsFrom&&i<stars?" pop":""}" style="--k:${i-(reveal?.starsFrom||0)}">★</i>`).join("")}</span>` : level.phases.some(phase => phase.guardian) ? '<i class="guardian-tag">Guardian</i>' : "";
    button.innerHTML = `<span class="level-node">${unlocked ? number : lockIcon}</span><span class="level-top">${top}</span><span class="level-label"><b>${level.name}</b><small>Level ${number} · ${level.duration}s</small></span>`;
    button.addEventListener("click",()=>launchCampaignLevel(level.id,button));
    ui.bloomLevels.append(button);
  });
  // Trail between level centres (x 28/72, one 80-unit row each); leaves each level sideways so it never crosses a label. Reached parts are coloured.
  // The segment just unlocked starts faint and is drawn in by a mask while the ship flies it.
  const done = [], todo = [], fresh = igniteIndex > 0 ? trailSegment(igniteIndex - 1) : "";
  levels.slice(1).forEach((level, i) => (i === igniteIndex - 1 ? todo : isLevelUnlocked(level.id) ? done : todo).push(trailSegment(i)));
  const freshPath = fresh ? `<defs><mask id="trailReveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="${levels.length * 80 + 40}"><path class="trail-reveal" d="${fresh}" pathLength="1"/></mask></defs><path class="done" d="${fresh}" mask="url(#trailReveal)" vector-effect="non-scaling-stroke"/>` : "";
  ui.bloomLevels.insertAdjacentHTML?.("beforeend", `<svg class="level-path" aria-hidden="true" viewBox="0 0 100 ${levels.length * 80}" preserveAspectRatio="none"><path class="todo" d="${todo.join(" ")}" vector-effect="non-scaling-stroke"/><path class="done" d="${done.join(" ")}" vector-effect="non-scaling-stroke"/>${freshPath}</svg>`);
  if (fresh) flyRevealShip(igniteIndex - 1, levels.length);
  ui.chapterPlay.dataset.level = playLevel.id;
  ui.chapterPlayLevel.textContent = `Level ${campaignLevels.indexOf(playLevel) + 1} · ${playLevel.name}`;
}

function trailSegment(i) { const y1 = i * 80 + 40, y2 = y1 + 80, x1 = i % 2 ? 72 : 28, x2 = i % 2 ? 28 : 72, d = x2 - x1; return `M${x1} ${y1} C${x1 + d * .75} ${y1} ${x2 - d * .75} ${y2} ${x2} ${y2}`; }

// The equipped ship flies the newly drawn trail: the same curve, converted from the path's viewBox to pixels for offset-path.
function flyRevealShip(i, rows) {
  const box = ui.bloomLevels.querySelector?.(".level-path")?.getBoundingClientRect?.(), host = ui.bloomLevels.getBoundingClientRect?.();
  if (!box?.width || !host) return;
  const sx = box.width / 100, sy = box.height / (rows * 80), ox = box.left - host.left, oy = box.top - host.top;
  const pixel = trailSegment(i).replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${(ox + x * sx).toFixed(1)} ${(oy + y * sy).toFixed(1)}`);
  const size = 52, ratio = Math.min(devicePixelRatio || 1, 3), ship = document.createElement("canvas");
  ship.className = "reveal-ship"; ship.width = ship.height = size * ratio; ship.setAttribute("aria-hidden", "true");
  const target = ship.getContext("2d"); target.setTransform(ratio, 0, 0, ratio, size / 2 * ratio, size / 2 * ratio);
  drawGlider(target, currentRider(), currentCosmetic(), .74, 0, 0, false, 0);
  ship.style.offsetPath = `path("${pixel}")`;
  ship.addEventListener("animationend", () => ship.remove());
  ui.bloomLevels.append(ship);
}

function openChapter(biome="bloom") {
  if(biome!=="bloom"&&(biome!=="ember"||!isLevelUnlocked("kindling")))return;
  state.chapter=biome;showScreen("bloomChapter");
}

function launchCampaignLevel(levelId,button) {
  if (button?.disabled || !isLevelUnlocked(levelId)) return;
  button?.classList.add("launching");
  setTimeout(()=>{ button?.classList.remove("launching"); startRun("campaign",levelId); },180);
}

function nextCampaignLevel() {
  const open = campaignLevels.filter(level => isLevelUnlocked(level.id));
  return open.find(level => !state.campaign.completed.includes(level.id)) || open[open.length - 1] || campaignLevels[0];
}

function playFromHome() {
  if (!state.tutorialSeen) { startTutorial(); return; }
  startRun("campaign", nextCampaignLevel().id);
}

// Results title curves along a circular arc: one SVG text in defs, drawn three times (two lip shadows, then gold).
function setArcTitle(element, text) {
  element.setAttribute?.("aria-label", text);
  if (!element.insertAdjacentHTML) { element.textContent = text; return; }
  element.innerHTML = `<svg class="arc-title" viewBox="0 0 320 122" aria-hidden="true"><defs><path id="resultArc" d="M16 116 A190 190 0 0 1 304 116"/><text id="resultArcText" text-anchor="middle" style="font-size:${Math.min(46, Math.round(46 * 12 / Math.max(12, text.length)))}px"><textPath href="#resultArc" startOffset="50%">${text.toUpperCase()}</textPath></text></defs><use href="#resultArcText" class="arc-deep" y="8"/><use href="#resultArcText" class="arc-lip" y="4"/><use href="#resultArcText" class="arc-face"/></svg>`;
}

function nextPlane() { return riders.find(rider => !state.ownedRiders.includes(rider.id)); }

function nearMissText(rating) {
  if (state.runType === "campaign") {
    const level = currentCampaignLevel();
    if (!state.levelComplete) { const left = Math.max(1, Math.ceil(level.duration - state.elapsed)); return `Only ${left}s from the finish`; }
    if (rating >= 3) return "";
    const fragments = Math.max(0, 3 - state.runFragments), perfects = Math.max(0, level.perfectTarget - state.perfects);
    const ordinal = rating === 1 ? "next" : "3rd";
    if (fragments && (!perfects || fragments <= perfects)) return `${fragments} more fragment${fragments > 1 ? "s" : ""} for the ${ordinal} star`;
    return `${perfects} more perfect${perfects > 1 ? "s" : ""} for the ${ordinal} star`;
  }
  const gap = state.best - Math.floor(state.score);
  return gap > 0 ? `${gap} away from your best` : "";
}

function renderNextPlane(stars = state.stars) {
  const rider = nextPlane();
  ui.nextPlane.hidden = !rider;
  if (!rider) { ui.resultHangar.classList.remove("ready"); return; }
  ui.nextPlaneName.textContent = stars >= rider.price ? `${rider.name} is ready!` : `Next plane · ${rider.name}`;
  ui.nextPlane.classList.toggle("ready", stars >= rider.price); ui.resultHangar.classList.toggle("ready", stars >= rider.price);
  ui.nextPlaneCount.textContent = `${Math.min(stars, rider.price)}/${rider.price}`;
  ui.nextPlaneBar.style.setProperty("width", `${Math.min(100, stars / rider.price * 100)}%`);
  const mini = ui.nextPlaneArt.getContext("2d");
  mini.setTransform(1, 0, 0, 1, 0, 0); mini.clearRect(0, 0, 88, 56); mini.translate(44, 28);
  drawGlider(mini, rider, currentCosmetic(), 1.15, 0, 0, false, 0);
}

function renderHangarShip(canvas = ui.hangarShip) {
  // Hangar buttons (Home and Results) show the equipped ship, drawn by the same renderer as gameplay.
  const size = 68, ratio = Math.min(devicePixelRatio || 1, 3);
  if (canvas.width !== size * ratio) { canvas.width = size * ratio; canvas.height = size * ratio; }
  const target = canvas.getContext("2d");
  target.setTransform(ratio, 0, 0, ratio, 0, 0); target.clearRect(0, 0, size, size);
  target.translate(size / 2, size / 2); target.rotate(-0.55);
  drawGlider(target, currentRider(), currentCosmetic(), 0.85, 0, 0, false, 0);
}

function updateHome() {
  ui.homeBest.textContent = state.best;
  ui.homeStars.textContent = state.stars;
  const affordable = riders.filter(rider => !state.ownedRiders.includes(rider.id) && state.stars >= rider.price).length;
  ui.hangarBadge.textContent = affordable; ui.hangarBadge.hidden = affordable === 0;
  renderHangarShip();
  ui.playLevel.textContent = state.tutorialSeen ? `Level ${campaignLevels.indexOf(nextCampaignLevel()) + 1}` : "";
  // First launch shows only the title, the world, Pip and PLAY; the rest appears after the first delivery.
  const returning = state.campaign.completed.length > 0 || state.best > 0;
  ui.homeAscension.hidden = !returning; ui.openMail.hidden = !returning; ui.lanterns.hidden = !returning;
  keepLanterns();
  const letterReady = returning && !dailyDone(), view = lanternView(), mail = Number(letterReady) + unreadCards().length + Number(view.parcel);
  ui.mailBadge.hidden = !returning || mail === 0; ui.mailBadge.textContent = mail;
  pipRig?.setReady(returning && mail > 0); pipRig?.setReduced(state.reducedEffects || matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  ui.pip.classList.toggle("parcel", view.parcel);
  if (returning) { renderLanterns(view); if (state.post.fx) { state.post.fx = ""; save(); } }
  placePip();
  ui.sound.checked = !state.muted;
  ui.haptics.checked = state.haptics;
  ui.effects.checked = state.reducedEffects;
  ui.fold.checked = state.expressFold;
  ui.extras.checked = state.nightPostExtras;
  renderGoals();
}

// Night lanterns: consecutive days played (from stats.dates), one lantern per night, a parcel on the 7th.
function playStreak() {
  const days = new Set(state.stats.dates); let streak = 0;
  for (const day = new Date(); days.has(day.toISOString().slice(0, 10)); day.setDate(day.getDate() - 1)) streak += 1;
  return streak;
}
function renderLanterns(view) {
  const { slots, lit } = view, W = 400, y0 = 6, sag = 34, body = view.gold ? ["#FFF4DC", "#F3E6C8"] : ["#FFC94D", "#E0A93A"];
  let svg = `<svg viewBox="0 0 ${W} 60" preserveAspectRatio="xMidYMin meet" class="${view.dim ? "dim" : ""}"><path d="M-10 ${y0} Q ${W / 2} ${y0 + sag} ${W + 10} ${y0}" fill="none" stroke="#7FA8A2" stroke-opacity=".55" stroke-width="1.6"/>`;
  for (let i = 0; i < 7; i += 1) {
    const t = (i + 1) / 8, x = (1 - t) * (1 - t) * -10 + 2 * (1 - t) * t * (W / 2) + t * t * (W + 10), y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag) + t * t * y0, slot = slots[i], on = slot.on;
    const newest = on && i === lit - 1 && (view.fx === "lit" || view.fx === "relit"), next = !on && i === lit && !view.tonight && !view.dim && lit < 7;
    const cls = [on && !slot.moon ? "lit" : "", slot.moon ? "moon" : "", newest ? "ignite" : "", slot.moon && view.fx === "moon" ? "pop" : "", next ? "next" : "", i === 6 && view.parcel ? "ready" : ""].filter(Boolean).join(" ");
    svg += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}" stroke="#7FA8A2" stroke-opacity=".6" stroke-width="1.2"/><g transform="translate(${x} ${y + 8})"><g class="${cls}">`;
    if (slot.moon) svg += `<circle cx="0" cy="12" r="17" fill="#A8F0CF" opacity=".25"/><path d="M4 0 A12 12 0 1 0 13 18 A9.5 9.5 0 1 1 4 0Z" fill="#FFF4DC"/><path d="M-9 18 A12 12 0 0 0 13 18 A9.5 9.5 0 0 1 -3 18Z" fill="#E9D6B0"/><circle cx="-2" cy="10" r="1.3" fill="#3A1E14"/><path d="M-5 14 Q-2 16 1 14" stroke="#3A1E14" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M-6 2 Q-1 -6 7 -3 L4 1 Q0 0 -6 2Z" fill="#12363D"/>`;
    else if (i === 6) svg += `${on || view.parcel ? '<circle cx="0" cy="12" r="20" fill="#FFC94D" opacity=".24"/>' : ""}<rect x="-10" y="2" width="20" height="18" rx="2" fill="${on ? "#FFF4DC" : "#1A4A50"}" stroke="${on ? "none" : "#2c5f66"}"/><rect x="-10" y="11" width="20" height="9" rx="1" fill="${on ? "#E9D6B0" : "#163F46"}"/><rect x="-2" y="2" width="4" height="18" fill="${on ? "#FF6F61" : "#2c5f66"}"/><path d="M0 2 Q-7 -6 -8 0 Q-4 3 0 2 Q4 3 8 0 Q7 -6 0 2Z" fill="${on ? "#FF6F61" : "#2c5f66"}"/>`;
    else svg += `${on ? '<circle cx="0" cy="12" r="17" fill="#FFC94D" opacity=".22"/>' : ""}<rect x="-5" y="0" width="10" height="3.5" rx="1" fill="#12363D"/><path d="M-8 4 H8 Q11 12 8 21 H-8 Q-11 12 -8 4Z" fill="${on ? body[0] : "#1A4A50"}" stroke="${on ? "none" : next ? "#7FA8A2" : "#2c5f66"}" stroke-width="1.2" ${next ? 'stroke-dasharray="2 2"' : ""}/><path d="M0 4 H8 Q11 12 8 21 H0Z" fill="${on ? body[1] : "#163F46"}"/>${on && view.gold ? '<path d="M0 7 L1.6 11 L5.5 12.5 L1.6 14 L0 18 L-1.6 14 L-5.5 12.5 L-1.6 11Z" fill="#FFC94D"/>' : `<path d="M-4 4 Q-6 12 -4 21 M4 4 Q6 12 4 21" stroke="${on ? "#C98A22" : "#2c5f66"}" stroke-width="1" fill="none"/>`}${slot.relit ? '<path d="M-6 9 L-1 7 L0 12 L-5 14Z" fill="#FFF4DC" opacity=".9"/><path d="M-5.5 9.5 L-1 12.5 M-1.5 8 L-4.5 13" stroke="#C98A22" stroke-width=".7"/>' : ""}<rect x="-5" y="21" width="10" height="3" rx="1" fill="#12363D"/>`;
    svg += "</g></g>";
  }
  ui.lanterns.innerHTML = svg + "</svg>";
  ui.lanterns.setAttribute?.("aria-label", `${lit} lanterns lit${view.dim ? ", dimmed: fly tonight to relight them" : ""}`);
}
// Pip sits just outside the orbit, lower left of the planet drawn on the game canvas.
// Pip's rig (pip.js); absent in the test sandbox. Ticked from the frame loop only while Home is showing.
const pipRig = window.OrbitPip?.create(ui.pip) || null;
function tickPip(delta) {
  if (!pipRig || ui.home.hidden) return;
  // The glider's position relative to Pip's head, in roughly -1..1, for his "watch" idle.
  const size = parseFloat(ui.pip.style?.getPropertyValue?.("--size")) || 112, left = parseFloat(ui.pip.style?.left) || 0, top = parseFloat(ui.pip.style?.top) || 0;
  const headX = left + size / 2, headY = top + size * .33, glider = playerPoint();
  pipRig.setGlider((glider.x - headX) / 160, (glider.y - headY) / 160);
  pipRig.tick(delta);
}
function placePip() {
  // Pip rests at the lower left, just above the Hangar button and clear of the orbit.
  const size = Math.round(Math.max(72, Math.min(108, width * .27)));
  ui.pip.style?.setProperty("--size", `${size}px`);
  const rowTop = ui.home.querySelector?.(".action-row")?.offsetTop;
  const top = rowTop > 0 ? rowTop - size * 1.075 - 2 : cy + orbitRadius * .62 - size / 2;
  ui.pip.style?.setProperty("left", `${Math.max(4, cx - orbitRadius - size * .2)}px`);
  ui.pip.style?.setProperty("top", `${top}px`);
  // The Ascension tab sits on the right edge between the title and the orbit, never over the glider's path.
  const tab = ui.homeAscension, title = ui.home.querySelector?.("h1")?.getBoundingClientRect?.(), home = ui.home.getBoundingClientRect?.();
  if (!tab?.style || !title?.height || !home) return;
  const tabHeight = tab.offsetHeight || 78, tabLeft = width - (tab.offsetWidth || 60);
  const orbitAtTab = Math.sqrt(Math.max(0, orbitRadius * orbitRadius - (tabLeft - cx) ** 2));
  const clearTop = title.bottom - home.top + 10, clearBottom = orbitAtTab ? cy - orbitAtTab - 8 : cy;
  tab.style.top = `${Math.max(clearTop, Math.min(clearBottom - tabHeight, (clearTop + clearBottom - tabHeight) / 2))}px`;
}

// Tonight's Letter: one daily Ascension delivery, the same sky for everyone that night. Only gameplay randomness
// (gate plans, routes, pairs, comets, hazard timing) is seeded by the night number; particles stay random so frame
// rate can never change the sky. One scored delivery per night; later flights are practice.
const DAILY_EPOCH = Date.UTC(2026, 9, 1);
let dailyRandom = null;
function nightNumber(date = new Date()) { return Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - DAILY_EPOCH) / 864e5) + 1; }
function seededRandom(seed) {
  return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function gameRandom() { return dailyRandom ? dailyRandom() : Math.random(); }
function dailyDone() { return state.daily?.night === nightNumber(); }
function startDaily() {
  if (startRun("endless") === false) return;
  dailyRandom = seededRandom(Math.imul(nightNumber(), 2654435761));
  state.dailyRun = { night: nightNumber(), scored: !dailyDone() };
}
function finishDaily() {
  const run = state.dailyRun; dailyRandom = null; if (!run) return;
  if (run.scored) { state.runStars += 10; state.daily = { night: run.night, score: Math.floor(state.score), perfects: state.perfects, letters: state.runLetters, seconds: Math.floor(state.elapsed) }; }
}
function postcardText() {
  const d = state.daily; if (!d) return "";
  return `Orbit Shift · Night ${d.night} ✉\n${"◆".repeat(Math.min(10, d.perfects))}${d.perfects > 10 ? "+" : ""} ${d.perfects} perfects\n${"✉".repeat(Math.min(5, d.letters))} ${d.letters} lost letters · ${d.seconds}s\n${d.score} points`;
}
async function sharePostcard(button) {
  const text = postcardText(); if (!text) return;
  try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); button.textContent = "Copied"; setTimeout(() => { button.textContent = "Share postcard"; }, 1400); } }
  catch {}
}
function renderMailbag() {
  const done = dailyDone();
  ui.letterNight.textContent = nightNumber();
  ui.letterCard.classList.toggle("done", done);
  ui.letterTitle.textContent = done ? "Delivered" : "Tonight's Letter";
  ui.letterScore.hidden = !done; ui.letterScore.textContent = done ? `${state.daily.score}` : "";
  ui.shareLetterMail.hidden = !done;
  ui.flyLetter.classList.toggle("secondary", done);
  ui.mailbag.dataset.extras = state.nightPostExtras ? "on" : "off";
  ui.mailbag.dataset.tab = state.nightPostExtras ? mailTab : "tonight";
  const unread = unreadCards().length;
  ui.cardBadge.hidden = unread === 0; ui.cardBadge.textContent = unread;
  if (!state.nightPostExtras) return;
  if (mailTab === "cards") renderPostcards();
  if (mailTab === "album") renderAlbum();
}
function cardBack(card) {
  const sent = state.post.cards[card.id], stamp = window.OrbitPost?.stamp({ kind: card.island === "ember" ? "level" : card.island === "moon" ? "moon" : card.island === "post" ? "parcel" : card.island === "sky" ? "night" : "level", biome: card.island, n: Math.max(1, campaignLevels.findIndex(level => level.id === card.id) + 1), got: true }) || "";
  return `<p class="pc-line">${card.line}</p><b class="pc-sign">${card.from}<small>${card.place}</small></b><i class="pc-rule"></i><span class="pc-stamp">${stamp}</span><span class="pc-mark">${window.OrbitPost?.postmark(sent?.night || nightNumber()) || ""}</span><span class="pc-to">To: Pip &amp; pilot<br>Night Post Loft<br>The Sky</span>`;
}
// Postcards: the newest unread one first; viewing a card reads it. Tap the card to turn it over.
function renderPostcards() {
  const received = POSTCARDS.filter(card => state.post.cards[card.id]);
  // Open on the newest unread card (latest night, then latest in the story), else the newest card.
  const newest = list => list.reduce((best, card) => !best || state.post.cards[card.id].night >= state.post.cards[best.id].night ? card : best, null);
  if (!received.some(card => card.id === cardView)) cardView = (newest(unreadCards()) || newest(received))?.id || null;
  const card = POSTCARDS.find(item => item.id === cardView);
  ui.postcard.classList.remove("flipped");
  ui.postcard.classList.toggle("empty", !card);
  ui.postcard.innerHTML = card ? `<span class="pc-face pc-front">${window.OrbitPost?.front(card) || ""}</span><span class="pc-face pc-back">${cardBack(card)}</span>`
    : `<span class="pc-face pc-front"><span class="pc-empty"><b>No postcards yet</b><small>Islanders write when you wake their island</small></span></span>`;
  if (card && !state.post.cards[card.id].read) { state.post.cards[card.id].read = true; save(); ui.cardBadge.hidden = unreadCards().length === 0; ui.cardBadge.textContent = unreadCards().length; }
  ui.cardStrip.innerHTML = "";
  for (const item of POSTCARDS) {
    const sent = state.post.cards[item.id], thumb = document.createElement("button");
    thumb.type = "button"; thumb.className = `card-thumb${sent ? "" : " missing"}${item.id === cardView ? " on" : ""}${sent && !sent.read ? " unread" : ""}`;
    thumb.setAttribute("aria-label", sent ? `Postcard from ${item.from}` : "Postcard not yet received");
    thumb.innerHTML = sent ? window.OrbitPost?.front(item) || "" : "<i></i>";
    if (sent) thumb.addEventListener("click", () => { cardView = item.id; beep(520, .04, "triangle"); renderPostcards(); });
    ui.cardStrip.append(thumb);
  }
}
let albumView = "bloom", albumHint = "";
function renderAlbum() {
  const pages = albumPages(), page = pages.find(item => item.id === albumView) || pages[0], { got, total } = pageStamps(page), done = state.post.pages.includes(page.id);
  ui.albumIsles.innerHTML = "";
  for (const item of pages) {
    const tab = document.createElement("button"), counts = pageStamps(item);
    tab.type = "button"; tab.className = `album-isle isle-${item.id}${item.id === page.id ? " on" : ""}`; tab.setAttribute("aria-label", `${item.name} page, ${counts.got} of ${counts.total}`);
    tab.innerHTML = `<i></i><span>${item.name}</span>`;
    tab.addEventListener("click", () => { albumView = item.id; albumHint = ""; beep(430, .03, "triangle"); renderAlbum(); });
    ui.albumIsles.append(tab);
  }
  const rows = page.rows.map(([label, stamps]) => `<p class="album-row">${label}</p>${stamps.map(stamp => `<button type="button" class="album-stamp${stamp.got ? " got" : ""}" data-how="${stamp.got ? stamp.label : stamp.how}">${window.OrbitPost?.stamp({ ...stamp, biome: page.id }) || ""}<small>${stamp.label}</small></button>`).join("")}`).join("");
  ui.albumPage.innerHTML = `<header><b>${page.name}</b><span>${got}/${total}</span></header><div class="album-grid">${rows}</div><p class="album-hint">${albumHint || "Tap a stamp to see how to earn it"}</p>
    <div class="album-reward${done ? " done" : ""}"><canvas width="192" height="104"></canvas><span><b>${done ? page.reward.name : "Fill the page"}</b><small>${done ? "Earned" : page.reward.name}</small></span>${done ? HANGAR_SEAL : `<i class="need-bar"><b style="width:${Math.round(got / total * 100)}%"></b></i>`}</div>`;
  ui.albumPage.querySelectorAll?.(".album-stamp").forEach(button => button.addEventListener("click", () => { albumHint = button.dataset.how; ui.albumPage.querySelector(".album-hint").textContent = albumHint; beep(500, .03, "triangle"); }));
  const mini = ui.albumPage.querySelector("canvas")?.getContext("2d");
  if (mini) {
    mini.save(); mini.translate(96, 52); mini.scale(2, 2);
    if (page.reward.type === "trail") drawTrailSwatch(mini, page.reward.id, cosmetics[0]);
    else if (page.reward.type === "biome") drawGlider(mini, currentRider(), cosmetics.find(item => item.id === page.reward.id), 1.15, 0, 0, false, .2);
    else for (let i = 0; i < 3; i += 1) { mini.save(); mini.translate(-22 + i * 22, -2 + (i === 1 ? 4 : 0)); mini.fillStyle = "#FFF4DC"; mini.beginPath(); mini.moveTo(-6, -8); mini.lineTo(6, -8); mini.quadraticCurveTo(9, 0, 6, 9); mini.lineTo(-6, 9); mini.quadraticCurveTo(-9, 0, -6, -8); mini.fill(); mini.fillStyle = "#FFC94D"; mini.beginPath(); for (let k = 0; k < 8; k += 1) { const a = k / 8 * TAU - Math.PI / 2, rr = k % 2 ? 1.6 : 4.4; mini.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } mini.fill(); mini.restore(); }
    mini.restore();
  }
}
// The weekly parcel: saved on tap, then the lid lifts and the gifts come out one by one.
function showParcel() {
  const gift = claimParcel();
  if (!gift) { showScreen("mailbag"); return; }
  ui.parcelBox.innerHTML = window.OrbitPost?.parcel() || "";
  const stamp = window.OrbitPost?.stamp({ kind: gift.gold ? "goldparcel" : "parcel", got: true }) || "";
  ui.parcelGifts.innerHTML = `<span class="gift">${STAR_ICON}<b>+${gift.stars}</b><small>Stars</small></span><span class="gift">${stamp}<b>Stamp</b><small>${gift.gold ? "Gold week" : `Week ${gift.week}`}</small></span>${gift.moon ? `<span class="gift">${window.OrbitPost?.moonGift() || ""}<b>Moon</b><small>Keeps a night</small></span>` : ""}`;
  ui.parcelOverlay.classList.remove("open"); ui.parcelOverlay.hidden = false;
  beep(392, .08, "triangle");
  setTimeout(() => { ui.parcelOverlay.classList.add("open"); beep(659, .1, "triangle"); setTimeout(() => beep(988, .14, "sine"), 160); vibrate(20); }, 520);
}
function closeParcel() { ui.parcelOverlay.hidden = true; ui.parcelOverlay.classList.remove("open"); updateHome(); pipRig?.react("hop"); }

// Night Post extras (beta, Settings): the lantern string is kept by a Paper Moon or relit after one dark night, every
// 7th night brings a parcel, islanders send postcards, and the Stamp Album collects what you've done. A lantern lights
// when a flight ends (any mode), one per night.
const POSTCARDS = [
  { id: "first-light", island: "bloom", from: "Sprout", place: "First Light", line: "I woke up! I don't know what a morning is yet, but I'm ready for one." },
  { id: "pollen-path", island: "bloom", from: "Clover", place: "Pollen Path", line: "The vines are dancing again. Grandma Bud cried happy dew. Come back for tea?" },
  { id: "tangled-orbit", island: "bloom", from: "Twig & Twine", place: "Tangled Orbit", line: "We untangled ourselves! Mostly. Twine still has one knot. She named it Gerald." },
  { id: "crown-of-petals", island: "bloom", from: "The Budkeeper", place: "Crown of Petals", line: "I kept every letter safe for so long, I forgot to read them. Thank you for being patient with an old flower. This one is for Ember." },
  { id: "kindling", island: "ember", from: "Flick", place: "Kindling", line: "My head is warm again! Please keep me away from the curtains." },
  { id: "cinder-step", island: "ember", from: "Ash & Soot", place: "Cinder Step", line: "We passed the cinder all the way down the line. Nobody dropped it. NOBODY." },
  { id: "furnace-heart", island: "ember", from: "Old Wick", place: "Furnace Heart", line: "The furnace hums like it used to. I hum too now. The neighbours are thrilled." },
  { id: "solar-forge", island: "ember", from: "The Forge Keeper", place: "Solar Forge", line: "I sealed this one years ago, waiting for someone brave. It says 'To Moon'. I think that's your job now." },
  { id: "parcel-1", island: "post", from: "The Night Post", place: "Pip's loft", line: "Seven nights in a row! Pip wrapped this one himself. Please ignore the extra tape." },
  { id: "letter-1", island: "sky", from: "A Stargazer", place: "Far away", line: "Someone far away flew the very same sky as you tonight. You both made it." },
  { id: "moon-1", island: "moon", from: "Old Moon", place: "Fast asleep", line: "Zzz… kept your lanterns… zzz… lit. You're welcome… zzz." },
  { id: "album-bloom", island: "bloom", from: "All of Bloom", place: "Bloom", line: "We pressed a petal from every corner of the island for you. Fly it proud." },
];
const bonusTrails = ["pressed-petal"];
let mailTab = "tonight", cardView = null;
function initialPost() {
  const post = { held: 0, count: 0, last: null, moonAt: [], relitAt: [], parcels: 0, parcelFor: 0, best: 0, cards: {}, letters: 0, fevers: 0, delivered: 0, moonsUsed: 0, pages: [], gold: false, fx: "", ...(saved.post || {}) };
  if (!saved.post) {
    // Older saves: the string continues from the days already played; cleared islands' postcards arrive already read.
    const days = new Set(state.stats.dates), key = offset => { const day = new Date(); day.setDate(day.getDate() - offset); return day.toISOString().slice(0, 10); };
    let start = days.has(key(0)) ? 0 : days.has(key(1)) ? 1 : -1;
    if (start >= 0) { while (days.has(key(start + post.count))) post.count += 1; post.last = nightNumber() - start; post.best = post.count; }
    for (const id of state.campaign.completed) if (POSTCARDS.some(card => card.id === id)) post.cards[id] = { night: nightNumber(), read: true };
    post.delivered = state.daily ? 1 : 0;
  }
  return post;
}
// Missed nights: one Paper Moon covers one night, and one dark night can still be relit by flying tonight.
function keepLanterns(now = nightNumber()) {
  const post = state.post;
  if (!state.nightPostExtras || post.last == null) return;
  const missed = now - post.last - 1;
  if (missed <= 0) return;
  if (post.held && missed <= 2) {
    post.held = 0; post.last += 1; post.count += 1; post.moonAt.push(post.last); post.moonsUsed += 1; post.fx = "moon";
    sendCard("moon-1"); save(); return;
  }
  if (missed >= 2) { post.count = 0; post.last = null; post.moonAt = []; post.relitAt = []; save(); }
}
function lightLantern(now = nightNumber()) {
  if (!state.nightPostExtras) return;
  keepLanterns(now);
  const post = state.post;
  if (post.last === now) return;
  if (post.last === now - 2) { post.relitAt.push(now - 1); post.count += 1; post.fx = "relit"; }
  else if (post.last !== now - 1) { post.count = 0; post.moonAt = []; post.relitAt = []; }
  post.count += 1; post.last = now; post.best = Math.max(post.best, post.count);
  if (post.fx !== "relit") post.fx = "lit";
  post.moonAt = post.moonAt.filter(night => night > now - 8); post.relitAt = post.relitAt.filter(night => night > now - 8);
}
function lanternView(now = nightNumber()) {
  if (!state.nightPostExtras) {
    const streak = playStreak(), lit = streak ? (streak - 1) % 7 + 1 : 0;
    return { lit, slots: Array.from({ length: 7 }, (_, i) => ({ on: i < lit })), dim: false, tonight: streak > 0, parcel: false, gold: false, fx: "" };
  }
  const post = state.post, alive = post.last != null && now - post.last <= 2, count = alive ? post.count : 0, lit = count ? (count - 1) % 7 + 1 : 0;
  const slots = Array.from({ length: 7 }, (_, i) => { const night = post.last - (lit - 1 - i); return { on: i < lit, moon: i < lit && post.moonAt.includes(night), relit: i < lit && post.relitAt.includes(night) }; });
  return { lit, slots, dim: alive && now - post.last === 2, tonight: post.last === now, parcel: parcelReady(now), gold: post.gold, fx: post.fx };
}
function parcelReady(now = nightNumber()) {
  const post = state.post;
  return state.nightPostExtras && post.last != null && now - post.last <= 2 && post.count > 0 && post.count % 7 === 0 && post.parcelFor < post.count;
}
// The weekly parcel: few stars on purpose (5, then 10, then 15), a week stamp, and a Paper Moon when none is held.
function claimParcel() {
  if (!parcelReady()) return null;
  const post = state.post;
  post.parcels += 1; post.parcelFor = post.count;
  const gift = { week: post.parcels, stars: [5, 10][post.parcels - 1] || 15, moon: post.held === 0, gold: post.parcels % 4 === 0 };
  state.stars += gift.stars; if (gift.moon) post.held = 1;
  if (post.parcels === 1) sendCard("parcel-1");
  gift.rewards = checkAlbum(); save();
  return gift;
}
function sendCard(id) {
  if (!state.nightPostExtras || state.post.cards[id]) return;
  state.post.cards[id] = { night: nightNumber(), read: false };
}
function unreadCards() { return state.nightPostExtras ? POSTCARDS.filter(card => state.post.cards[card.id] && !state.post.cards[card.id].read) : []; }
function albumPages() {
  const post = state.post, cleared = id => state.campaign.completed.includes(id), cards = Object.keys(post.cards).length;
  const islands = biome => campaignLevels.filter(level => level.biome === biome).map(level => ({ id: `clear-${level.id}`, kind: level.phases.some(phase => phase.guardian) ? "guard" : "level", n: campaignLevels.indexOf(level) + 1, label: level.name, got: cleared(level.id), how: `Clear ${level.name}` }));
  const golds = biome => campaignLevels.filter(level => level.biome === biome).map(level => ({ id: `gold-${level.id}`, kind: "gold", label: `3★ ${level.name.split(" ")[0]}`, got: (state.campaign.ratings[level.id] || 0) >= 3, how: `Three stars on ${level.name}` }));
  const count = (id, kind, label, have, need, how) => ({ id, kind, label, got: have >= need, progress: Math.min(1, have / need), how });
  return [
    { id: "bloom", name: "Bloom", reward: { type: "trail", id: "pressed-petal", name: "Pressed petal trail" }, rows: [["Islands", islands("bloom")], ["Gold postmarks", golds("bloom")], ["Specials", [
      count("letters-10", "letter", "10 lost letters", post.letters, 10, "Catch 10 lost letters"), count("flow-5", "flow", "Flow ×5", state.bestStreak, 5, "Reach flow ×5"),
      count("express-1", "express", "Express Post", post.fevers, 1, "Fill the Express Post bar"), count("survive-60", "orbit", "60s Ascension", state.stats.longestMs / 1000, 60, "Fly 60 seconds in one run")]]] },
    { id: "ember", name: "Ember", reward: { type: "biome", id: "wax", name: "Wax seal paint" }, rows: [["Islands", islands("ember")], ["Gold postmarks", golds("ember")], ["Specials", [
      count("letters-25", "letter", "25 lost letters", post.letters, 25, "Catch 25 lost letters"), count("flow-10", "flow", "Flow ×10", state.bestStreak, 10, "Reach flow ×10"),
      count("express-10", "express", "10 Express", post.fevers, 10, "Fill the Express Post bar 10 times"), count("survive-100", "orbit", "100s Ascension", state.stats.longestMs / 1000, 100, "Fly 100 seconds in one run")]]] },
    { id: "post", name: "Night Post", reward: { type: "lanterns", id: "gold", name: "Star lanterns" }, rows: [["Parcels", [1, 2, 3, 4].map(week => ({ id: `parcel-${week}`, kind: week === 4 ? "goldparcel" : "parcel", label: week === 4 ? "Gold week" : `Week ${week}`, got: post.parcels >= week, how: `Open ${week === 1 ? "a weekly parcel" : `${week} weekly parcels`}` }))],
      ["Tonight's Letter", [count("letter-1", "night", "1 letter", post.delivered, 1, "Deliver Tonight's Letter"), count("letter-7", "night", "7 letters", post.delivered, 7, "Deliver 7 nightly letters"), count("letter-30", "night", "30 letters", post.delivered, 30, "Deliver 30 nightly letters"), count("moon-1", "moon", "Paper Moon", post.moonsUsed, 1, "Let a Paper Moon keep your lanterns")]],
      ["Lanterns & mail", [count("nights-14", "lantern", "14 nights", post.best, 14, "Light 14 nights in a row"), count("nights-30", "lantern", "30 nights", post.best, 30, "Light 30 nights in a row"), count("cards-6", "card", "6 postcards", cards, 6, "Receive 6 postcards"), count("cards-12", "card", "12 postcards", cards, 12, "Receive all 12 postcards")]]] },
  ];
}
function pageStamps(page) { const stamps = page.rows.flatMap(row => row[1]); return { got: stamps.filter(stamp => stamp.got).length, total: stamps.length }; }
// A full page pays out once: Bloom a new trail, Ember a new paint, the Night Post gold star lanterns on Home.
function checkAlbum() {
  const granted = [];
  if (!state.nightPostExtras) return granted;
  for (const page of albumPages()) {
    const { got, total } = pageStamps(page);
    if (got < total || state.post.pages.includes(page.id)) continue;
    state.post.pages.push(page.id); granted.push(page.reward);
    if (page.reward.type === "trail" && !state.unlockedTrails.includes(page.reward.id)) state.unlockedTrails.push(page.reward.id);
    if (page.reward.type === "biome" && !state.unlocked.includes(page.reward.id)) state.unlocked.push(page.reward.id);
    if (page.reward.type === "lanterns") state.post.gold = true;
    if (page.id === "bloom") sendCard("album-bloom");
  }
  return granted;
}
// Called from finishRun (rewards are saved there): counters, the night's lantern, postcards for first clears, album pages.
function postRun(firstClearId) {
  if (!state.nightPostExtras) return;
  state.post.letters += state.runLetters; state.post.fevers += state.feverCount;
  lightLantern();
  if (firstClearId) sendCard(firstClearId);
  if (state.dailyRun?.scored) { state.post.delivered += 1; sendCard("letter-1"); }
  for (const reward of checkAlbum()) if (reward.type !== "lanterns") state.runRewards.push({ type: reward.type, id: reward.id, label: reward.name });
}

state.post = initialPost();
keepLanterns();

function renderGoals() {
  // Show only the goal closest to completion; the other two keep progressing in the background.
  const goal = state.goals.reduce((closest, item) => item.progress / item.target > closest.progress / closest.target ? item : closest, state.goals[0]);
  ui.goals.innerHTML = goal ? `<div class="voyage-goal"><b>${goal.label}</b><i style="--progress:${Math.min(100,goal.progress/goal.target*100)}%"></i><span>${Math.min(goal.progress,goal.target)}/${goal.target}</span></div>` : "";
}

// Hangar · the Sorting Room: Pip's mail-sorting loft. One shelf open at a time (planes, paint, trails). Tapping a slot
// previews it on the showcase stand, locked ones too; tapping the previewed slot again, or the big button, buys or equips.
let hangarTab = "planes";
const hangarPick = { planes: null, paint: null, trails: null };
const trailNames = { paper: "Paper diamonds", pollen: "Pollen", spark: "Spark", ribbon: "Ribbon", echo: "Echo rings", crown: "Crown gems", "bloom-wake": "Petal wake", "pressed-petal": "Pressed petal" };
const STAR_ICON = '<svg aria-hidden="true" viewBox="0 0 48 48"><polygon points="24,4 29,17.12 43.02,17.82 32.08,26.63 35.76,40.18 24,32.5 12.24,40.18 15.92,26.63 4.98,17.82 19,17.12" fill="#FFC94D"/><polygon points="24,4 29,17.12 43.02,17.82 32.08,26.63 35.76,40.18 24,32.5" fill="#E0A93A"/></svg>';
const HANGAR_SEAL = '<svg class="slot-seal" aria-hidden="true" viewBox="0 0 40 40"><path d="M20 2 L24 6 L30 4 L31 10 L37 12 L35 18 L39 22 L34 26 L35 32 L29 32 L26 38 L20 35 L14 38 L11 32 L5 32 L6 26 L1 22 L5 18 L3 12 L9 10 L10 4 L16 6Z" fill="#FFC94D"/><path d="M20 2 L24 6 L30 4 L31 10 L37 12 L35 18 L39 22 L34 26 L35 32 L29 32 L26 38 L20 35Z" fill="#E0A93A"/><path d="M13 20 L18 25 L28 14" fill="none" stroke="#3A1E14" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const HANGAR_LOCK = '<svg class="slot-lock" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10 V7 a5 5 0 0 1 10 0 V10" fill="none" stroke="currentColor" stroke-width="2.6"/><rect x="4" y="10" width="16" height="12" rx="3" fill="currentColor"/></svg>';
const NEW_POSTMARK = `<svg class="reveal-stamp" aria-hidden="true" viewBox="0 0 100 100">${Array.from({ length: 28 }, (_, i) => `<circle cx="${(50 + Math.cos(i / 28 * TAU) * 46).toFixed(1)}" cy="${(50 + Math.sin(i / 28 * TAU) * 46).toFixed(1)}" r="3.4" fill="#FFC94D"/>`).join("")}<circle cx="50" cy="50" r="41" fill="#FFC94D"/><path d="M50 9 A41 41 0 0 1 50 91Z" fill="#E0A93A"/><circle cx="50" cy="50" r="33" fill="none" stroke="#3A1E14" stroke-width="2.2" stroke-dasharray="3 3"/><text x="50" y="58" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="27" fill="#3A1E14">NEW</text></svg>`;

// The previewed item on a shelf and what the big button can do with it: on (equipped), owned, buy, short (stars) or locked.
function hangarItem(tab = hangarTab) {
  if (tab === "planes") {
    const rider = riders.find(item => item.id === hangarPick.planes) || currentRider();
    const owned = state.ownedRiders.includes(rider.id);
    return { tab, id: rider.id, name: rider.name, price: rider.price, state: state.selectedRider === rider.id ? "on" : owned ? "owned" : state.stars >= rider.price ? "buy" : "short",
      need: `Need ${rider.price - state.stars} more`, progress: state.stars / Math.max(1, rider.price) };
  }
  if (tab === "paint") {
    const paint = cosmetics.find(item => item.id === hangarPick.paint) || cosmetics.find(item => item.id === state.selected) || cosmetics[0];
    const page = paint.album && albumPages().find(item => item.id === paint.album), stamps = page && pageStamps(page);
    return { tab, id: paint.id, name: paint.name, state: state.selected === paint.id ? "on" : state.unlocked.includes(paint.id) ? "owned" : "locked",
      need: page ? `Fill the ${page.name} album page` : `Best score ${paint.score}`, progress: page ? stamps.got / stamps.total : state.best / Math.max(1, paint.score) };
  }
  const id = hangarPick.trails || state.selectedTrail, goals = trailStyles.indexOf(id), page = id === "pressed-petal" && albumPages()[0], stamps = page && pageStamps(page);
  return { tab, id, name: trailNames[id] || id, state: state.selectedTrail === id ? "on" : state.unlockedTrails.includes(id) ? "owned" : "locked",
    need: page ? "Fill the Bloom album page" : id === "bloom-wake" ? "Clear First Light" : `Finish ${goals} goal${goals === 1 ? "" : "s"}`,
    progress: page ? stamps.got / stamps.total : id === "bloom-wake" ? 0 : state.goalsCompleted / Math.max(1, goals) };
}
function hangarAct(tab = hangarTab) {
  const item = hangarItem(tab);
  if (item.state === "buy") {
    state.stars -= item.price; state.ownedRiders.push(item.id); purchasePreview = item.id; save(); beep(820, .14, "triangle"); vibrate(25);
  } else if (item.state === "owned") {
    if (tab === "planes") state.selectedRider = item.id; else if (tab === "paint") state.selected = item.id; else state.selectedTrail = item.id;
    save(); beep(620, .07, "triangle"); vibrate(10);
  } else {
    if (item.state !== "on") { ui.hangarAction.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 180 }); beep(120, .08, "square"); }
    return;
  }
  renderGarage(); updateHome();
}
function pickHangar(tab, id) {
  if (hangarItem(tab).id === id) { hangarAct(tab); return; }
  hangarPick[tab] = id; beep(430, .03, "triangle"); renderGarage();
}
function hangarSlot(tab, id, className, label, html, draw) {
  const slot = document.createElement("button");
  slot.type = "button"; slot.className = `slot ${className}`; slot.setAttribute("aria-label", label);
  slot.innerHTML = `<canvas width="264" height="168"></canvas>${html}`;
  const mini = slot.querySelector("canvas").getContext("2d"); mini.save(); mini.translate(132, 84); mini.scale(2, 2); draw(mini); mini.restore();
  slot.addEventListener("click", () => pickHangar(tab, id));
  return slot;
}
function slotState(id, item, on, owned, extra = "") { return `${on ? " on" : ""}${item.id === id ? " picked" : ""}${owned ? "" : extra}`; }
function drawTrailSwatch(target, id, palette, time = 0) {
  for (let i = 15; i >= 0; i -= 1) {
    const t = i / 15, x = 44 - t * 92, y = -10 + Math.sin(t * 2.2) * 14 + t * 6 + Math.sin(time * 3 + i) * .6;
    target.globalAlpha = .25 + (1 - t) * .75; target.fillStyle = i % 2 ? palette.accent : palette.gold;
    drawTrailPiece(target, id, x, y, 3 + (1 - t) * 6, -.3 + t, i);
  }
  target.globalAlpha = 1;
}
function renderGarage() {
  ui.garageStars.textContent = state.stars;
  ui.garage.dataset.tab = hangarTab;
  const paint = currentCosmetic();
  ui.riderGrid.innerHTML = "";
  if (purchasePreview) {
    const rider = riders.find(item => item.id === purchasePreview);
    if (rider) {
      // The new plane unfolds out of its crease and a gold NEW postmark lands, the same family as PERFECT.
      const reveal = document.createElement("div"); reveal.className = "purchase-reveal";
      reveal.innerHTML = `<i class="reveal-rays"></i><canvas width="720" height="440"></canvas>${NEW_POSTMARK}<i class="reveal-confetti">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37 + 7) % 100}%;--d:${(i % 8) * .11}s;--c:${["#FFC94D", "#FF6F61", "#A8F0CF", "#FFF4DC", "#5ED6A6"][i % 5]}"></i>`).join("")}</i><b>${rider.name}</b><button class="hangar-action owned" type="button">Equip</button>`;
      const mini = reveal.querySelector("canvas").getContext("2d"); mini.translate(360, 220); mini.rotate(-.12); drawGlider(mini, rider, paint, 8, 0, 0, false, .25);
      reveal.querySelector("button").addEventListener("click", () => { state.selectedRider = rider.id; hangarPick.planes = rider.id; purchasePreview = null; save(); renderGarage(); updateHome(); });
      ui.riderGrid.append(reveal);
    }
  }
  const plane = hangarItem("planes");
  for (const rider of riders) {
    const owned = state.ownedRiders.includes(rider.id), on = state.selectedRider === rider.id;
    ui.riderGrid.append(hangarSlot("planes", rider.id, slotState(rider.id, plane, on, owned, state.stars >= rider.price ? " can" : " short"),
      `${rider.name}${on ? ", equipped" : owned ? "" : `, ${rider.price} stars`}`,
      `${on ? HANGAR_SEAL : ""}<b>${rider.name}</b>${owned ? "" : `<em class="slot-price">${STAR_ICON}${rider.price}</em>`}`,
      mini => drawGlider(mini, rider, paint, 1.45, 0, 0, false, 0)));
  }
  renderCosmetics();
  renderTrails();
  renderHangarAction();
}
function renderCosmetics() {
  ui.cosmetics.innerHTML = "";
  const item = hangarItem("paint"), rider = riders.find(r => r.id === hangarPick.planes) || currentRider();
  for (const cosmetic of cosmetics) {
    const owned = state.unlocked.includes(cosmetic.id), on = state.selected === cosmetic.id;
    ui.cosmetics.append(hangarSlot("paint", cosmetic.id, slotState(cosmetic.id, item, on, owned, " locked"),
      `${cosmetic.name} paint${on ? ", equipped" : owned ? "" : `, best score ${cosmetic.score}`}`,
      `${on ? HANGAR_SEAL : ""}${owned ? "" : HANGAR_LOCK}<b>${cosmetic.name}</b>`,
      mini => drawGlider(mini, rider, cosmetic, 1.45, 0, 0, false, 0)));
  }
}
function renderTrails() {
  ui.trails.innerHTML = "";
  const item = hangarItem("trails"), palette = cosmetics.find(c => c.id === state.selected) || cosmetics[0];
  for (const trailName of [...trailStyles, ...bonusTrails]) {
    const owned = state.unlockedTrails.includes(trailName), on = state.selectedTrail === trailName;
    ui.trails.append(hangarSlot("trails", trailName, slotState(trailName, item, on, owned, " locked"),
      `${trailNames[trailName]} trail${on ? ", equipped" : owned ? "" : ", locked"}`,
      `${on ? HANGAR_SEAL : ""}${owned ? "" : HANGAR_LOCK}<b>${trailNames[trailName].split(" ")[0]}</b>`,
      mini => drawTrailSwatch(mini, trailName, palette)));
  }
}
function renderHangarAction() {
  const item = hangarItem();
  ui.hangarName.textContent = item.name;
  ui.hangarAction.className = `hangar-action ${item.state}`;
  ui.hangarAction.innerHTML = item.state === "buy" ? `Buy <span class="cost">${STAR_ICON}${item.price}</span>`
    : item.state === "owned" ? "Equip" : item.state === "on" ? "Equipped"
    : `<span>${item.need}</span><i class="need-bar"><b style="width:${Math.round(Math.min(1, item.progress) * 100)}%"></b></i>`;
}
// The showcase: the previewed plane in the previewed paint on its paper stand, flying the previewed trail.
function drawHangarShowcase(time) {
  const canvas = ui.hangarShowcase;
  if (ui.garage.hidden || !canvas?.offsetParent) return;
  const ratio = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) { canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio); }
  const g = canvas.getContext("2d"); g.setTransform(ratio, 0, 0, ratio, 0, 0); g.clearRect(0, 0, w, h);
  const rider = riders.find(r => r.id === hangarPick.planes) || currentRider();
  const paint = cosmetics.find(c => c.id === hangarPick.paint) || cosmetics.find(c => c.id === state.selected) || cosmetics[0];
  const trailId = hangarPick.trails || state.selectedTrail, scale = Math.min(w / 120, h / 82), bob = state.reducedEffects ? 0 : Math.sin(time * 1.8) * 4;
  const sx = w * .6, sy = h * .47 + bob, standY = h * .83;
  g.fillStyle = "rgba(255,244,220,.5)";
  for (let i = 0; i < 24; i += 1) { g.globalAlpha = .15 + (i % 5) * .08 + Math.sin(time * 1.3 + i) * .06; g.fillRect((i * .3819 % 1) * w, (i * .577 + .13) % .7 * h, 2, 2); }
  g.globalAlpha = 1;
  const glow = g.createRadialGradient(sx, standY - 20, 4, sx, standY - 20, w * .42); glow.addColorStop(0, "rgba(255,201,77,.24)"); glow.addColorStop(1, "rgba(255,201,77,0)");
  g.fillStyle = glow; g.fillRect(0, 0, w, h);
  // Folded paper stand.
  const sw = Math.min(190, w * .52); g.save(); g.translate(sx, standY);
  g.fillStyle = "rgba(10,31,36,.5)"; g.beginPath(); g.ellipse(0, 22, sw * .46, 6, 0, 0, TAU); g.fill();
  g.fillStyle = "#E9D6B0"; g.beginPath(); g.moveTo(-sw * .4, 4); g.lineTo(sw * .4, 4); g.lineTo(sw * .3, 22); g.lineTo(-sw * .3, 22); g.fill();
  g.fillStyle = "#C9B48C"; g.beginPath(); g.moveTo(0, 4); g.lineTo(sw * .4, 4); g.lineTo(sw * .3, 22); g.lineTo(0, 22); g.fill();
  g.fillStyle = "#FFF4DC"; g.beginPath(); g.moveTo(-sw * .4, 4); g.lineTo(0, -5); g.lineTo(sw * .4, 4); g.fill();
  g.fillStyle = "#F3E6C8"; g.beginPath(); g.moveTo(0, -5); g.lineTo(sw * .4, 4); g.lineTo(0, 4); g.fill(); g.restore();
  // Trail streaming behind, as if flying.
  const drift = state.reducedEffects ? 0 : time * 34;
  for (let i = 22; i >= 0; i -= 1) {
    const d = ((i * 14 + drift) % 308) / 308, x = sx - 22 * scale * .5 - d * w * .55, y = sy + 6 + d * h * .26 - Math.sin(d * 3) * 10;
    g.globalAlpha = (1 - d) * .95; g.fillStyle = i % 2 ? paint.accent : paint.gold;
    drawTrailPiece(g, trailId, x, y, Math.max(2, (1 - d) * 9.5), -.4 + d, i);
  }
  g.globalAlpha = 1;
  g.save(); g.translate(sx, sy); g.rotate(-.1); drawGlider(g, rider, paint, scale * .8, time, 0, false, .25); g.restore();
}

function drawHomePreview(time) {
  if (ui.home.hidden || !ui.preview.offsetParent) return;
  const target = ui.preview.getContext("2d");
  target.clearRect(0,0,ui.preview.width,ui.preview.height);
  target.save(); target.translate(130,75+Math.sin(time*2)*3); drawGlider(target,currentRider(),currentCosmetic(),2.45,time,0,false,.25); target.restore();
}

function drawBloomChapterPreview(time) {
  if (ui.bloomChapter.hidden || !window.OrbitArt || !ui.bloomChapterArt.offsetParent) return;
  const ember=state.chapter==="ember";
  const frame=window.OrbitArt.helpers.prepare(ui.bloomChapterArt),target=frame.ctx,w=frame.width,h=frame.height,stage=ember?state.campaign.emberRestoration:state.campaign.restoration,palette=window.OrbitArt.palettes[state.chapter];
  target.fillStyle=palette.bg;target.fillRect(0,0,w,h);window.OrbitArt.helpers.paperGrain(target,w,h,palette.light,.04);
  window.OrbitArt.drawLivingPlanet(target,ember?"ember-furnace":"bloom-crown",{x:w/2,y:h*.72,radius:Math.min(w*.25,h*.15),paletteId:state.chapter,time,lit:stage>0,reduced:state.reducedEffects});
  target.save();target.translate(w/2,h*.72);target.lineWidth=2;
  for(let ring=0;ring<stage;ring+=1){target.strokeStyle=colorAlpha(ember?palette.gold:ring%2?"#edca62":"#77d5aa",.22+ring*.05);target.beginPath();target.ellipse(0,0,w*(.29+ring*.035),h*(.15+ring*.017),time*.015*(ring%2?1:-1),0,TAU);target.stroke();}
  if(stage>=4){target.fillStyle="#edca62";for(let i=0;i<7;i+=1){const angle=i*TAU/7+time*.04,x=Math.cos(angle)*w*.4,y=Math.sin(angle)*h*.21;target.beginPath();target.moveTo(x,y-5);target.lineTo(x+4,y);target.lineTo(x,y+5);target.lineTo(x-4,y);target.closePath();target.fill();}}
  target.restore();
}

function updateHud() {
  ui.score.textContent = Math.floor(state.score);
  ui.multiplier.textContent = `x${state.multiplier}`;
  ui.best.textContent = state.best;
  ui.fever.style.width = `${(state.fever > 0 ? state.fever / 6 : state.feverCharge / 5) * 100}%`;
  ui.shield.classList.toggle("ready", state.shield && state.mode === "run");
  ui.campaignRun.classList.toggle("active", state.runType === "campaign" && state.mode === "run");
  ui.fragmentCount.textContent = `${Math.min(3,state.runFragments)}/3`;
  ui.fragmentCount.classList.toggle("complete",state.runFragments>=3);
  const perfectTarget=state.runType==="campaign"?currentCampaignLevel().perfectTarget:3;
  ui.perfectCount.textContent = `${Math.min(perfectTarget,state.perfects)}/${perfectTarget}`;
  const phase = phaseAt(state.elapsed);
  ui.guardian.classList.toggle("active", Boolean(phase.guardian && state.mode === "run"));
  ui.guardianName.textContent = phase.name;
  ui.guardianBar.style.setProperty("--guardian", `${phase.guardian ? Math.min(100,state.guardianPassed/phase.target*100) : 0}%`);
}

function reportText() {
  const stats = state.stats;
  const minutes = Math.round(stats.totalMs / 6000) / 10;
  return `ORBIT SHIFT PLAYTEST\nSessions: ${stats.sessions}\nReturn days: ${stats.dates.length}\nRuns: ${stats.runs}\nPlay time: ${minutes} min\nLongest run: ${Math.round(stats.longestMs/1000)} sec\nReached Bloom/Ember/Void: ${stats.acts.join(" / ")}\nGuardians cleared: ${stats.guardians}\nGoals completed: ${stats.goals}\nDeaths gate/hazard: ${stats.deaths.gate} / ${stats.deaths.hazard}`;
}

function vibrate(duration) { if (state.haptics && navigator.vibrate) navigator.vibrate(duration); }

function beep(frequency, duration, type) {
  if (state.muted) return;
  try {
    ensureAudio();
    tone(frequency, duration, type, .04);
  } catch { /* Sound is optional. */ }
}

function ensureAudio() { audio ||= new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); }

function tone(frequency, duration, type = "sine", volume = .012) {
  if (!audio || state.muted) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
  oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + duration);
}

function startMusic() {
  if (state.muted) return;
  try { ensureAudio(); } catch { return; }
  stopMusic(); musicStep = 0;
  musicTimer = setInterval(musicTick, 250);
}

function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = 0; }

function musicTick() {
  if (state.mode !== "run" || state.paused || state.muted) return;
  const phase = phaseAt(state.elapsed);
  const biome = phase.biome >= 0 ? phase.biome : Math.floor((state.elapsed - 103) / 24) % 3;
  const root = [220,164.81,138.59][biome];
  const notes = [[1,1.25,1.5,2],[1,1.2,1.5,1.8],[1,1.125,1.5,1.6875]][biome];
  if (musicStep % 4 === 0) tone(root/2,.38,biome === 1 ? "sawtooth" : "sine",.009);
  if (state.multiplier > 1 && musicStep % 2 === 0) tone(root*notes[(musicStep/2)%4|0],.16,"triangle",.008);
  if (phase.guardian && musicStep % 2 === 1) tone(root*.75,.08,"square",.007);
  if (state.fever > 0) tone(root*2*notes[musicStep%4],.1,"triangle",.007);
  musicStep += 1;
}

function runSelfChecks() {
  let seed = 19;
  const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const previousRunType = state.runType,previousLevelId=state.levelId;
  state.runType="endless";
  for (let i = 0; i < 600; i += 1) {
    const elapsed = i % 121;
    const plan = buildGatePlan({ index: i % 12, elapsed, angle: random() * TAU, direction: random() > 0.5 ? 1 : -1, angularSpeed: 2, orbitRadius: 150, shortSide: 390, phase: phaseAt(elapsed) }, random);
    console.assert(angleDistance(normalize(plan.gap + plan.rotation * plan.flight), plan.target) < 0.0001, "Gate opening must resolve to its reachable target");
  }
  for (let i=1;i<phases.length;i+=1) console.assert(phases[i-1].end === phases[i].start, "Journey phases must be contiguous");
  console.assert(phaseAt(25).id === "petal" && phaseAt(34).transition && phaseAt(103).id === "ascension", "Journey boundaries must select the intended phases");
  state.runType = "campaign";
  for(const level of campaignLevels){
    state.levelId=level.id;
    for(let i=1;i<level.phases.length;i+=1) console.assert(level.phases[i-1].end===level.phases[i].start,`${level.name} phases must be contiguous`);
    let easy=0;
    for(const [index,elapsed] of level.gateTimes.entries()){
      const phase=phaseAt(elapsed),kindling=level.id==="kindling",plan=buildGatePlan({index,elapsed,angle:random()*TAU,direction:random()>.5?1:-1,angularSpeed:2,orbitRadius:150,shortSide:390,phase,settings:level.motion,heat:level.heatGates?.includes(index+1),forceEasy:kindling&&index>=3&&index%2===1,orientationBias:level.orientationBias},random);
      easy+=Number(!isSideOpening(plan.target));
      console.assert(angleDistance(normalize(plan.gap+plan.rotation*plan.flight),plan.target)<.0001,`${level.name} gate must remain reachable`);
    }
    console.assert(easy/level.gateTimes.length>=level.orientationBias-.22,`${level.name} opening distribution must retain its easy-sector bias`);
  }
  const recovery=buildGatePlan({index:8,elapsed:50,angle:random()*TAU,direction:1,angularSpeed:2,orbitRadius:150,shortSide:390,phase:campaignLevels[2].phases[1],forceEasy:true,orientationBias:.5},random);
  console.assert(!isSideOpening(recovery.target)&&recovery.opening>=1.58,"Recovery gates must be wide top/bottom openings");
  state.runType = previousRunType;state.levelId=previousLevelId;
  console.assert(angleDistance(0.05, TAU - 0.05) < 0.11, "Wrapped angle distance must stay small");
  console.assert(riders[0].id === "manta" && riders[0].price === 0, "Manta must remain the free default");
  console.assert(riders.slice(1).map((rider) => rider.price).join() === "40,100,200,350,550", "Garage prices must remain ordered");
  console.assert(trailStyles.length === 7 && state.goals.length === 3, "Progression must expose seven trails and three goals");
  console.assert(SAVE_VERSION === 5 && state.campaign && campaignLevels.length === 8, "Campaign save migration must remain available");
}

// Screens that fully cover the game canvas (the Hangar and settings are 96% opaque): the scene keeps updating but is not repainted.
const coveredModes = new Set(["campaign", "bloomChapter", "garage", "settings", "mailbag"]);
function frame(time) {
  const delta = Math.max(0, Math.min(0.1, (time - lastTime) / 1000 || 0));
  lastTime = time;
  // Catch up slower frames in small collision-safe steps, without a long resume jump.
  const steps = Math.max(1, Math.ceil(delta * 60));
  for (let step = 0; step < steps; step += 1) update(delta / steps);
  if (!coveredModes.has(state.mode)) draw();
  drawHomePreview(time / 1000);
  drawHangarShowcase(time / 1000);
  tickPip(delta);
  drawBloomChapterPreview(time / 1000);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", () => { resize(); if (!ui.home.hidden) placePip(); });
canvas.addEventListener("pointerdown", () => { if (awakening?.skippable) finishAwakening(); else { tapInput(); pressHold(); } });
for (const type of ["pointerup", "pointercancel", "blur"]) window.addEventListener(type, releaseHold);
document.querySelector("#play").addEventListener("click", playFromHome);
ui.chapterPlay.addEventListener("click", () => launchCampaignLevel(ui.chapterPlay.dataset.level, ui.chapterPlay));
document.querySelector("#openIslands").addEventListener("click", () => showScreen("campaign"));
document.querySelector("#resultHangar").addEventListener("click", () => showScreen("garage"));
document.querySelector("#ascension").addEventListener("click", () => startRun("endless"));
for(const button of document.querySelectorAll("[data-chapter]"))button.addEventListener("click",()=>{if(!button.disabled){window.OrbitArchipelago?.pulse();openChapter(button.dataset.chapter);}});
document.querySelector("#retry").addEventListener("click", () => state.dailyRun ? startDaily() : startRun(state.runType, state.levelId));
ui.nextLevel.addEventListener("click", () => { if (ui.nextLevel.dataset.level) startRun("campaign", ui.nextLevel.dataset.level); });
document.querySelector("#openGarage").addEventListener("click", () => showScreen("garage"));
ui.hangarAction.addEventListener("click", () => hangarAct());
ui.hangarTabs.addEventListener("click", event => { const tab = event.target.closest?.("[data-tab]")?.dataset.tab; if (!tab || tab === hangarTab) return; hangarTab = tab; beep(360, .03, "triangle"); renderGarage(); });
document.querySelector("#openSettings").addEventListener("click", () => showScreen("settings"));
ui.resultHome.addEventListener("click", () => state.runType === "campaign" ? openChapter(currentCampaignLevel().biome) : showScreen("home"));
for (const button of document.querySelectorAll("[data-home]")) button.addEventListener("click", () => showScreen("home"));
for (const button of document.querySelectorAll("[data-campaign]")) button.addEventListener("click", () => showScreen("campaign"));
ui.sound.addEventListener("change", () => { state.muted = !ui.sound.checked; save(); });
ui.haptics.addEventListener("change", () => { state.haptics = ui.haptics.checked; save(); vibrate(15); });
ui.effects.addEventListener("change", () => { state.reducedEffects = ui.effects.checked; save(); });
ui.fold.addEventListener("change", () => { state.expressFold = ui.fold.checked; save(); });
ui.extras.addEventListener("change", () => { state.nightPostExtras = ui.extras.checked; if (state.nightPostExtras) keepLanterns(); save(); });
ui.mailTabs.addEventListener("click", event => { const tab = event.target.closest?.("[data-mail]")?.dataset.mail; if (!tab || tab === mailTab) return; mailTab = tab; beep(360, .03, "triangle"); renderMailbag(); });
ui.postcard.addEventListener("click", () => { if (ui.postcard.classList.contains?.("empty")) return; ui.postcard.classList.toggle("flipped"); beep(300, .05, "triangle"); });
ui.parcelCollect.addEventListener("click", closeParcel);
ui.replayTutorial.addEventListener("click", startTutorial);
ui.skipTutorial.addEventListener("click", skipTutorial);
ui.continueRewards.addEventListener("click", claimReward);
ui.equipReward.addEventListener("click", equipCurrentReward);
ui.rewardPreview.addEventListener("click",()=>{if(state.runRewards.length)renderRewardSeal((rewardIndex+1)%state.runRewards.length);});
ui.showReport.addEventListener("click", () => { ui.report.textContent = reportText(); ui.report.hidden = !ui.report.hidden; ui.copyReport.hidden = ui.report.hidden; });
ui.copyReport.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(reportText()); ui.copyReport.textContent = "Copied"; setTimeout(() => { ui.copyReport.textContent = "Copy summary"; }, 1200); }
  catch { ui.copyReport.textContent = "Copy unavailable"; }
});
window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (state.mode === "run" && ["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) { pressHold(); window.addEventListener("keyup", releaseHold, { once: true }); }
  if(state.mode!=="run"&&event.target?.closest?.("button,input,select"))return;
  if (["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
    if (state.mode === "run" && !ui.resumeOverlay.hidden) resumeRun();
    else if (state.mode === "run") tapInput();
    else if (state.mode === "awakening" && awakening?.skippable) finishAwakening();
    else if (state.mode === "home") playFromHome();
    else if (state.mode === "campaign") openChapter();
    else if (state.mode === "bloomChapter" && event.target===document.body) launchCampaignLevel(ui.chapterPlay.dataset.level, ui.chapterPlay);
    else if (state.mode === "results") startRun(state.runType, state.levelId);
  }
});
document.addEventListener("visibilitychange", () => {
  // Coming back mid-run waits for a tap instead of resuming instantly into a gate.
  if (document.hidden) { state.paused = true; holding = false; audio?.suspend(); }
  else {
    lastTime = performance.now(); if (!state.muted) audio?.resume();
    if (state.mode === "run") ui.resumeOverlay.hidden = false; else state.paused = false;
  }
});
ui.resumeButton.addEventListener("click", resumeRun);
ui.practiceGuardian.addEventListener("click", () => startPractice(state.levelId));
function openMailbag() { mailTab = state.nightPostExtras && unreadCards().length ? "cards" : "tonight"; showScreen("mailbag"); }
ui.openMail.addEventListener("click", () => { if (parcelReady()) showParcel(); else openMailbag(); });
ui.pip.addEventListener("click", () => { const next = parcelReady() ? showParcel : openMailbag; if (!pipRig) { next(); return; } pipRig.react("tap"); setTimeout(() => { if (!ui.home.hidden) next(); }, 420); });
ui.flyLetter.addEventListener("click", startDaily);
ui.homeAscension.addEventListener("click", () => startRun("endless"));
ui.shareLetter.addEventListener("click", () => sharePostcard(ui.shareLetter));
ui.shareLetterMail.addEventListener("click", () => sharePostcard(ui.shareLetterMail));
// Block page drag and pull-to-refresh, but let the Hangar plane grid and reward dots scroll.
document.addEventListener("touchmove", (event) => { if (!event.target.closest?.(".rider-grid,.reward-choices")) event.preventDefault(); }, { passive: false });

resize();
renderCosmetics();
updateHud();
updateHome();
runSelfChecks();
save();
requestAnimationFrame(frame);
