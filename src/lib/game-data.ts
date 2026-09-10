import pencilArt from "@/assets/creature-pencil.png";
import catArt from "@/assets/creature-cat.png";
import blotArt from "@/assets/creature-blot.png";
import shadowArt from "@/assets/creature-shadow.png";

export type CardFrame = "friend" | "shadow" | "multiverse";
export type CrayonColor = "coral" | "sunshine" | "mint" | "sky" | "weird";

export type GameCardData = {
  id: string;
  name: string;
  title: string;
  frame: CardFrame;
  color: CrayonColor;
  art: string;
  attack: number;
  health: number;
  speed: number;
  cost: number;
  level: number;
  ability: { name: string; text: string };
  flavor: string;
};

export const CREATURE_ART = {
  pencil: pencilArt,
  cat: catArt,
  blot: blotArt,
  shadow: shadowArt,
};

export const COLLECTION: GameCardData[] = [
  {
    id: "pip",
    name: "Pip the Stub",
    title: "Friend · Scribbler",
    frame: "friend",
    color: "coral",
    art: pencilArt,
    attack: 4,
    health: 9,
    speed: 6,
    cost: 2,
    level: 3,
    ability: { name: "Re-draw", text: "Heals 3 HP to the messiest ally." },
    flavor: "Sharpened twice. Scared zero times.",
  },
  {
    id: "kit",
    name: "Paper Kit",
    title: "Friend · Glider",
    frame: "friend",
    color: "sky",
    art: catArt,
    attack: 6,
    health: 6,
    speed: 9,
    cost: 3,
    level: 2,
    ability: { name: "Fold Dash", text: "Moves twice before attacking." },
    flavor: "Folded from a spelling test.",
  },
  {
    id: "mossy",
    name: "Mossy Crayon",
    title: "Friend · Healer",
    frame: "friend",
    color: "mint",
    art: pencilArt,
    attack: 3,
    health: 12,
    speed: 4,
    cost: 3,
    level: 4,
    ability: { name: "Green Scribble", text: "Grows a shield of 4 on all friends." },
    flavor: "Smells faintly of grass.",
  },
  {
    id: "sunny",
    name: "Sunny Blob",
    title: "Friend · Bruiser",
    frame: "friend",
    color: "sunshine",
    art: catArt,
    attack: 8,
    health: 10,
    speed: 3,
    cost: 4,
    level: 2,
    ability: { name: "Big Smudge", text: "Hits every enemy in the row." },
    flavor: "Left a stain on page 14.",
  },
  {
    id: "loop",
    name: "Loop-de-Loop",
    title: "Multiverse · Trickster",
    frame: "multiverse",
    color: "weird",
    art: catArt,
    attack: 5,
    health: 7,
    speed: 8,
    cost: 3,
    level: 1,
    ability: { name: "Rewind", text: "Undo the last enemy action once per battle." },
    flavor: "Drawn in a notebook that doesn't exist yet.",
  },
  {
    id: "eraser",
    name: "Sir Eraser",
    title: "Friend · Guardian",
    frame: "friend",
    color: "coral",
    art: pencilArt,
    attack: 2,
    health: 16,
    speed: 2,
    cost: 3,
    level: 5,
    ability: { name: "Rub Out", text: "Removes one Blot effect from the field." },
    flavor: "Half gone, twice as brave.",
  },
  {
    id: "jarjar",
    name: "Jar of Water",
    title: "Multiverse · Support",
    frame: "multiverse",
    color: "sky",
    art: catArt,
    attack: 1,
    health: 11,
    speed: 5,
    cost: 2,
    level: 1,
    ability: { name: "Rinse", text: "Cleans ink from two allies." },
    flavor: "The brushes owe it everything.",
  },
  {
    id: "stitch",
    name: "Stitchy",
    title: "Friend · Scout",
    frame: "friend",
    color: "mint",
    art: pencilArt,
    attack: 5,
    health: 8,
    speed: 7,
    cost: 2,
    level: 1,
    ability: { name: "Peek", text: "Reveals the next two enemy turns." },
    flavor: "Sewn from a torn margin.",
  },
];

export const SHADOW_COMMANDERS: GameCardData[] = [
  {
    id: "umbra",
    name: "Umbra",
    title: "Shadow · Commander",
    frame: "shadow",
    color: "weird",
    art: shadowArt,
    attack: 7,
    health: 18,
    speed: 6,
    cost: 6,
    level: 3,
    ability: { name: "Night Pencil", text: "Once per battle, redraws a fallen friend at 50% HP." },
    flavor: "Lives between the pages.",
  },
  {
    id: "vela",
    name: "Vela the Quiet",
    title: "Shadow · Commander",
    frame: "shadow",
    color: "weird",
    art: shadowArt,
    attack: 9,
    health: 14,
    speed: 8,
    cost: 6,
    level: 2,
    ability: { name: "Hush", text: "Silences all Blot abilities for one turn." },
    flavor: "Never speaks above a whisper.",
  },
];

export const ENEMIES: GameCardData[] = [
  {
    id: "blotling",
    name: "Blotling",
    title: "Blot · Minion",
    frame: "shadow",
    color: "weird",
    art: blotArt,
    attack: 4,
    health: 8,
    speed: 5,
    cost: 0,
    level: 1,
    ability: { name: "Drip", text: "Leaves ink that blocks a tile." },
    flavor: "It grew from a dropped pen.",
  },
  {
    id: "smudger",
    name: "The Smudger",
    title: "Blot · Brute",
    frame: "shadow",
    color: "weird",
    art: blotArt,
    attack: 8,
    health: 15,
    speed: 3,
    cost: 0,
    level: 3,
    ability: { name: "Wipe", text: "Erases a friend's ability for two turns." },
    flavor: "Ruins everything it touches.",
  },
];

export type ActionCard = {
  id: string;
  name: string;
  cost: number;
  text: string;
  color: CrayonColor;
};

export const ACTION_HAND: ActionCard[] = [
  { id: "a1", name: "Sharpen", cost: 1, text: "+3 attack this turn", color: "coral" },
  { id: "a2", name: "Sticker Shield", cost: 2, text: "Block 6 damage", color: "sunshine" },
  { id: "a3", name: "Splash", cost: 2, text: "3 damage to a 2×2 area", color: "sky" },
  { id: "a4", name: "Second Wind", cost: 3, text: "Heal 8 and move again", color: "mint" },
  { id: "a5", name: "Weird Portal", cost: 4, text: "Swap two units on the grid", color: "weird" },
];

/* ---------------- Enemy roster ---------------- */

export type EnemyFamily = "ink" | "pencil" | "graphite" | "eraser" | "stationery" | "boss";

export type EnemyDef = {
  id: string;
  name: string;
  nameRu: string;
  family: EnemyFamily;
  behavior: string;
  attack: number;
  health: number;
  speed: number;
  /** footprint in grid cells */
  w: number;
  h: number;
  ability: string;
};

export const ENEMY_ROSTER: EnemyDef[] = [
  { id: "blotling", name: "Blotling", nameRu: "Кляксята", family: "ink", behavior: "Swarm", attack: 3, health: 7, speed: 5, w: 1, h: 1, ability: "Drips ink that blocks a tile." },
  { id: "smudge", name: "Smudge", nameRu: "Разводы", family: "ink", behavior: "Slow blocker", attack: 4, health: 12, speed: 3, w: 1, h: 1, ability: "Smears a friend's ability for a turn." },
  { id: "splatter", name: "Splatter", nameRu: "Брызги", family: "ink", behavior: "Ranged", attack: 5, health: 8, speed: 6, w: 1, h: 1, ability: "Hits from three tiles away." },
  { id: "scribble", name: "Scribble", nameRu: "Каляки-маляки", family: "pencil", behavior: "Rusher", attack: 5, health: 9, speed: 8, w: 1, h: 1, ability: "Moves twice before striking." },
  { id: "squiggle", name: "Squiggle", nameRu: "Кривули", family: "pencil", behavior: "Coiler", attack: 4, health: 11, speed: 7, w: 1, h: 1, ability: "Wraps a friend and holds it still." },
  { id: "hatch", name: "Hatch", nameRu: "Штрихи", family: "pencil", behavior: "Spiky", attack: 6, health: 10, speed: 5, w: 1, h: 1, ability: "Hurts anyone who attacks it." },
  { id: "dot", name: "Dot", nameRu: "Точки", family: "graphite", behavior: "Dust cloud", attack: 2, health: 6, speed: 9, w: 1, h: 1, ability: "Splits into two smaller dots." },
  { id: "gray", name: "Gray", nameRu: "Серости", family: "graphite", behavior: "Drainer", attack: 4, health: 13, speed: 4, w: 1, h: 1, ability: "Drains the colour from a friend." },
  { id: "eraser-enemy", name: "Eraser", nameRu: "Стирашки", family: "eraser", behavior: "Deleter", attack: 7, health: 12, speed: 5, w: 1, h: 1, ability: "Erases a tile into blank white space." },
  { id: "cross-out", name: "Cross-out", nameRu: "Зачёркиши", family: "stationery", behavior: "Bruiser", attack: 8, health: 14, speed: 4, w: 1, h: 1, ability: "Crosses a friend out for two turns." },
  { id: "stain", name: "Stain", nameRu: "Помарки", family: "stationery", behavior: "Dripper", attack: 5, health: 16, speed: 3, w: 1, h: 1, ability: "Leaves correction fluid that slows friends." },
  { id: "outline", name: "Outline", nameRu: "Обводки", family: "stationery", behavior: "Ghost", attack: 6, health: 10, speed: 7, w: 1, h: 1, ability: "Half of all damage passes through it." },
  { id: "great-stain", name: "Great Stain", nameRu: "Великая Помарка", family: "boss", behavior: "Boss · 2 cells", attack: 9, health: 40, speed: 4, w: 2, h: 1, ability: "Spreads tendrils across the row each turn." },
  { id: "scribble-giant", name: "Scribble Giant", nameRu: "Каляка-Великан", family: "boss", behavior: "Boss · 3 cells", attack: 11, health: 52, speed: 5, w: 1, h: 3, ability: "Sweeps every friend standing in front of it." },
  { id: "blot-mother", name: "Blot Mother", nameRu: "Клякса-Мать", family: "boss", behavior: "Boss · 3 cells", attack: 10, health: 58, speed: 4, w: 3, h: 1, ability: "Spawns a Blotling every second turn." },
  { id: "chief-eraser", name: "Chief Eraser", nameRu: "Главная Стирашка", family: "boss", behavior: "Boss · 2 cells", attack: 13, health: 62, speed: 6, w: 2, h: 2, ability: "Erases friends permanently — no redraws." },
  { id: "klaksa", name: "The Blot", nameRu: "Клякса", family: "boss", behavior: "Final boss · 4 cells", attack: 16, health: 90, speed: 5, w: 2, h: 2, ability: "Devours colour and swallows fallen drawings." },
];

export function enemyDef(id: string) {
  return ENEMY_ROSTER.find((e) => e.id === id) ?? ENEMY_ROSTER[0]!;
}

/* ---------------- Ten-chapter campaign ---------------- */

export type CampaignLevel = {
  id: number;
  /** "Глава N" */
  chapter: string;
  name: string;
  nameRu: string;
  blurb: string;
  difficulty: "easy" | "normal" | "hard" | "boss";
  reward: string;
  /** 0 = pristine paper, 1 = drowned in ink */
  corruption: number;
  /** hand-drawn trail path in a 100×62 viewBox */
  trail: string;
  /** stop positions along the trail, in % of the page box */
  stops: { x: number; y: number }[];
  encounter: string[];
};

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    chapter: "Глава 1",
    name: "The Pencil Case",
    nameRu: "Пенал",
    blurb: "A clean new page. Something small and inky is already hiding in the corner.",
    difficulty: "easy",
    reward: "120 tokens",
    corruption: 0,
    trail: "M 8 50 Q 26 34 42 46 Q 58 58 74 40 Q 86 28 94 34",
    stops: [{ x: 8, y: 50 }, { x: 25, y: 41 }, { x: 42, y: 46 }, { x: 74, y: 40 }, { x: 94, y: 34 }],
    encounter: ["blotling", "blotling"],
  },
  {
    id: 2,
    chapter: "Глава 2",
    name: "Spilled Ink Pond",
    nameRu: "Чернильная лужа",
    blurb: "A pen leaked overnight. The puddle learned to walk.",
    difficulty: "easy",
    reward: "Card: Stitchy",
    corruption: 0.12,
    trail: "M 6 20 Q 22 44 40 26 Q 56 10 70 32 Q 84 52 96 44",
    stops: [{ x: 6, y: 20 }, { x: 24, y: 38 }, { x: 40, y: 26 }, { x: 70, y: 32 }, { x: 96, y: 44 }],
    encounter: ["blotling", "blotling", "smudge"],
  },
  {
    id: 3,
    chapter: "Глава 3",
    name: "Crayon Ridge",
    nameRu: "Восковой хребет",
    blurb: "Wax hills keep the pencil scribbles out. Mostly.",
    difficulty: "normal",
    reward: "200 tokens",
    corruption: 0.22,
    trail: "M 10 54 L 24 24 L 38 52 L 52 22 L 66 50 Q 82 36 94 48",
    stops: [{ x: 10, y: 54 }, { x: 24, y: 24 }, { x: 38, y: 52 }, { x: 66, y: 50 }, { x: 94, y: 48 }],
    encounter: ["scribble", "scribble", "squiggle"],
  },
  {
    id: 4,
    chapter: "Глава 4",
    name: "Eraser Dunes",
    nameRu: "Стирательные дюны",
    blurb: "Pink crumbs everywhere. Whole shapes have gone missing.",
    difficulty: "normal",
    reward: "Multiverse frame",
    corruption: 0.34,
    trail: "M 5 44 Q 20 20 34 44 Q 48 66 62 42 Q 76 18 96 38",
    stops: [{ x: 5, y: 44 }, { x: 20, y: 32 }, { x: 34, y: 44 }, { x: 62, y: 42 }, { x: 96, y: 38 }],
    encounter: ["eraser-enemy", "hatch", "blotling", "smudge"],
  },
  {
    id: 5,
    chapter: "Глава 5",
    name: "The Great Stain",
    nameRu: "Великая Помарка",
    blurb: "One old spot on the page has been growing for years.",
    difficulty: "boss",
    reward: "300 tokens",
    corruption: 0.44,
    trail: "M 8 34 Q 30 52 46 30 Q 62 8 78 34 Q 88 50 96 30",
    stops: [{ x: 8, y: 34 }, { x: 28, y: 44 }, { x: 46, y: 30 }, { x: 78, y: 34 }, { x: 96, y: 30 }],
    encounter: ["great-stain", "splatter", "blotling"],
  },
  {
    id: 6,
    chapter: "Глава 6",
    name: "Grey Fog Margin",
    nameRu: "Серый туман",
    blurb: "The colours are draining out toward the margin.",
    difficulty: "hard",
    reward: "Card: Loop-de-Loop",
    corruption: 0.55,
    trail: "M 4 50 Q 18 28 32 46 Q 46 62 58 40 Q 72 16 84 40 Q 92 54 98 42",
    stops: [{ x: 4, y: 50 }, { x: 18, y: 34 }, { x: 32, y: 46 }, { x: 58, y: 40 }, { x: 98, y: 42 }],
    encounter: ["gray", "dot", "dot", "outline"],
  },
  {
    id: 7,
    chapter: "Глава 7",
    name: "Scribble Giant",
    nameRu: "Каляка-Великан",
    blurb: "Every loose pencil loop on the page rolled into one tall thing.",
    difficulty: "boss",
    reward: "450 tokens",
    corruption: 0.66,
    trail: "M 6 26 L 20 50 L 34 24 Q 52 44 64 24 Q 80 44 96 26",
    stops: [{ x: 6, y: 26 }, { x: 20, y: 50 }, { x: 34, y: 24 }, { x: 64, y: 24 }, { x: 96, y: 26 }],
    encounter: ["scribble-giant", "scribble", "hatch"],
  },
  {
    id: 8,
    chapter: "Глава 8",
    name: "Torn Page Cliffs",
    nameRu: "Рваные утёсы",
    blurb: "The paper is ripped here. Something crosses out whatever crosses it.",
    difficulty: "hard",
    reward: "Shadow: Vela",
    corruption: 0.76,
    trail: "M 8 46 Q 22 18 38 40 L 52 18 Q 68 44 80 22 Q 90 40 96 24",
    stops: [{ x: 8, y: 46 }, { x: 22, y: 26 }, { x: 38, y: 40 }, { x: 80, y: 22 }, { x: 96, y: 24 }],
    encounter: ["cross-out", "cross-out", "stain", "outline"],
  },
  {
    id: 9,
    chapter: "Глава 9",
    name: "Chief Eraser",
    nameRu: "Главная Стирашка",
    blurb: "A cracked giant eraser is rubbing the whole chapter away.",
    difficulty: "boss",
    reward: "700 tokens",
    corruption: 0.87,
    trail: "M 5 30 Q 24 54 40 30 Q 56 6 72 32 Q 84 52 96 34",
    stops: [{ x: 5, y: 30 }, { x: 22, y: 46 }, { x: 40, y: 30 }, { x: 72, y: 32 }, { x: 96, y: 34 }],
    encounter: ["chief-eraser", "eraser-enemy", "eraser-enemy", "dot"],
  },
  {
    id: 10,
    chapter: "Глава 10",
    name: "Klaksa, the Blot",
    nameRu: "Клякса",
    blurb: "The last page is almost black. One glowing eye is waiting in the puddle.",
    difficulty: "boss",
    reward: "Multiverse: Klaksa's Eye",
    corruption: 1,
    trail: "M 6 44 Q 18 16 32 40 Q 44 60 56 34 Q 70 10 82 38 Q 90 56 98 40",
    stops: [{ x: 6, y: 44 }, { x: 19, y: 28 }, { x: 32, y: 40 }, { x: 56, y: 34 }, { x: 98, y: 40 }],
    encounter: ["klaksa", "blot-mother", "splatter", "blotling"],
  },
];

export type LeaderRow = {
  rank: number;
  player: string;
  points: number;
  wins: number;
  tier: "gold" | "silver" | "bronze" | "paper";
};

export const LEADERBOARD: LeaderRow[] = [
  { rank: 1, player: "inkwitch.kepl", points: 4820, wins: 132, tier: "gold" },
  { rank: 2, player: "crayon_king", points: 4610, wins: 128, tier: "gold" },
  { rank: 3, player: "papercut", points: 4402, wins: 121, tier: "gold" },
  { rank: 4, player: "doodle.doom", points: 3990, wins: 110, tier: "silver" },
  { rank: 5, player: "mrs_smudge", points: 3841, wins: 104, tier: "silver" },
  { rank: 6, player: "glitterfang", points: 3620, wins: 98, tier: "silver" },
  { rank: 7, player: "you.kepl", points: 3410, wins: 91, tier: "bronze" },
  { rank: 8, player: "tinytiger", points: 3180, wins: 84, tier: "bronze" },
  { rank: 9, player: "wax.melter", points: 2905, wins: 77, tier: "bronze" },
  { rank: 10, player: "notebook9", points: 2740, wins: 70, tier: "paper" },
];

export const TIER_PRIZES = [
  { tier: "Gold Crayon", range: "Top 1–3", prize: "Multiverse card + 5000 tokens", color: "sunshine" as const },
  { tier: "Silver Pencil", range: "Top 4–20", prize: "Shadow card + 2000 tokens", color: "sky" as const },
  { tier: "Bronze Stub", range: "Top 21–100", prize: "Friend card + 800 tokens", color: "coral" as const },
  { tier: "Paper Club", range: "Everyone else", prize: "150 tokens + sticker", color: "mint" as const },
];
