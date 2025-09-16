"use client";

export const TILE_SIZE = 32;

const TILES = {
  GRASS: 0,
  BOULDER: 1,
  COBBLESTONE: 2,
  WATER: 3,
  GROVE_SAGE: 4,
  VERDANT_GATE: 5,
  SAND: 6,
  SANDSTONE_SPIRE: 7,
  OASIS_WATER: 8,
  AZURE_GATE: 9,
  AZURE_CHRONICLER: 11,
  AZURE_SENTINEL: 12,
  AZURE_CARTOGRAPHER: 13,
  AZURE_TIDEGUARD: 14,
  AZURE_BARD: 15,
  DESERT_STORYTELLER: 16,
  DESERT_DUELIST: 17,
  DESERT_NAVIGATOR: 18,
  DESERT_BEASTMASTER: 19,
  DESERT_ORACLE: 20,
  GLADE_GRASS: 21,
  GLADE_TREE: 22,
  GLADE_WATER: 23,
  GLADE_GATE: 24,
  GLADE_HISTORIAN: 25,
  GLADE_GUARDIAN: 26,
  GLADE_SONGWEAVER: 27,
  GLADE_SEER: 28,
  GLADE_CARETAKER: 29,
  DESERT_GATE: 30,
} as const;

export const tileColors: Record<number, string> = {
  [TILES.GRASS]: "#6abe30",
  [TILES.BOULDER]: "#4d3827",
  [TILES.COBBLESTONE]: "#c4b28a",
  [TILES.WATER]: "#3b6db0",
  [TILES.GROVE_SAGE]: "#b75cff",
  [TILES.VERDANT_GATE]: "#9cd6f4",
  [TILES.SAND]: "#d7a75a",
  [TILES.SANDSTONE_SPIRE]: "#8f5e2b",
  [TILES.OASIS_WATER]: "#1f7fad",
  [TILES.AZURE_GATE]: "#6fb6ff",
  [TILES.AZURE_CHRONICLER]: "#91b4ff",
  [TILES.AZURE_SENTINEL]: "#6aa4ff",
  [TILES.AZURE_CARTOGRAPHER]: "#87c9ff",
  [TILES.AZURE_TIDEGUARD]: "#4f9cff",
  [TILES.AZURE_BARD]: "#79a9ff",
  [TILES.DESERT_STORYTELLER]: "#d7b07a",
  [TILES.DESERT_DUELIST]: "#d48d52",
  [TILES.DESERT_NAVIGATOR]: "#d3a06b",
  [TILES.DESERT_BEASTMASTER]: "#c57d3b",
  [TILES.DESERT_ORACLE]: "#e0c278",
  [TILES.GLADE_GRASS]: "#8de070",
  [TILES.GLADE_TREE]: "#427331",
  [TILES.GLADE_WATER]: "#5ad3f3",
  [TILES.GLADE_GATE]: "#b6f2ff",
  [TILES.GLADE_HISTORIAN]: "#7ce4a0",
  [TILES.GLADE_GUARDIAN]: "#66c58a",
  [TILES.GLADE_SONGWEAVER]: "#94e0c5",
  [TILES.GLADE_SEER]: "#5fbf91",
  [TILES.GLADE_CARETAKER]: "#82f0bc",
  [TILES.DESERT_GATE]: "#f0d28d",
};

export type TileEvent =
  | {
      type: "levelTransition";
      targetLevelId: string;
      spawn?: { row: number; col: number };
    }
  | { type: "dialogue"; npcId: string }
  | { type: "battle"; encounterId: string };

export interface TileDefinition {
  id: number;
  name: string;
  imagePath: string;
  walkable: boolean;
  event?: TileEvent;
  scale?: number;
}

export const tileDefinitions: TileDefinition[] = [
  {
    id: TILES.GRASS,
    name: "grass",
    imagePath: "/tiles/grass-tile-5.png",
    walkable: true,
  },
  {
    id: TILES.BOULDER,
    name: "boulder",
    imagePath: "/tiles/rock-obstacle-tile.png",
    walkable: false,
  },
  {
    id: TILES.COBBLESTONE,
    name: "cobblestone-path",
    imagePath: "/tiles/cobblestone-path-tile.png",
    walkable: true,
  },
  {
    id: TILES.WATER,
    name: "water",
    imagePath: "/tiles/water-tile-1.png",
    walkable: false,
  },
  {
    id: TILES.GROVE_SAGE,
    name: "grove-sage",
    imagePath: "/characters/wizard-blue.png",
    walkable: false,
    scale: 1.6,
    event: { type: "dialogue", npcId: "grove-sage" },
  },
  {
    id: TILES.VERDANT_GATE,
    name: "verdant-waystone",
    imagePath: "/globe.svg",
    walkable: true,
    scale: 1.3,
    event: {
      type: "levelTransition",
      targetLevelId: "azure-approach",
      spawn: { row: 4, col: 3 },
    },
  },
  {
    id: TILES.SAND,
    name: "sand",
    imagePath: "/tiles/sand-tile-1.png",
    walkable: true,
  },
  {
    id: TILES.SANDSTONE_SPIRE,
    name: "sandstone-spire",
    imagePath: "/tiles/rock-tile-1.png",
    walkable: false,
  },
  {
    id: TILES.OASIS_WATER,
    name: "oasis-water",
    imagePath: "/tiles/water-tile-2.png",
    walkable: false,
  },
  {
    id: TILES.AZURE_GATE,
    name: "azure-waystone",
    imagePath: "/globe.svg",
    walkable: true,
    scale: 1.3,
    event: {
      type: "levelTransition",
      targetLevelId: "crimson-dunes",
      spawn: { row: 3, col: 3 },
    },
  },
  {
    id: TILES.AZURE_CHRONICLER,
    name: "azure-chronicler",
    imagePath: "/characters/wizard-purple.png",
    walkable: false,
    scale: 1.55,
    event: { type: "dialogue", npcId: "azure-chronicler" },
  },
  {
    id: TILES.AZURE_SENTINEL,
    name: "azure-sentinel",
    imagePath: "/characters/player-left.png",
    walkable: false,
    scale: 1.45,
    event: { type: "battle", encounterId: "azure-wave-warden" },
  },
  {
    id: TILES.AZURE_CARTOGRAPHER,
    name: "azure-cartographer",
    imagePath: "/characters/character-sprite-image.png",
    walkable: false,
    scale: 1.4,
    event: { type: "dialogue", npcId: "azure-cartographer" },
  },
  {
    id: TILES.AZURE_TIDEGUARD,
    name: "azure-tideguard",
    imagePath: "/characters/player-right.png",
    walkable: false,
    scale: 1.45,
    event: { type: "battle", encounterId: "azure-tideguard" },
  },
  {
    id: TILES.AZURE_BARD,
    name: "azure-bard",
    imagePath: "/characters/player-back.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "azure-bard" },
  },
  {
    id: TILES.DESERT_STORYTELLER,
    name: "desert-storyteller",
    imagePath: "/characters/player-front.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "desert-storyteller" },
  },
  {
    id: TILES.DESERT_DUELIST,
    name: "desert-duelist",
    imagePath: "/characters/player-character-front.png",
    walkable: false,
    scale: 1.45,
    event: { type: "battle", encounterId: "dune-duelist" },
  },
  {
    id: TILES.DESERT_NAVIGATOR,
    name: "desert-navigator",
    imagePath: "/characters/wizard-blue.png",
    walkable: false,
    scale: 1.5,
    event: { type: "dialogue", npcId: "desert-navigator" },
  },
  {
    id: TILES.DESERT_BEASTMASTER,
    name: "desert-beastmaster",
    imagePath: "/characters/character-sprite-image.png",
    walkable: false,
    scale: 1.5,
    event: { type: "battle", encounterId: "beastmaster-kai" },
  },
  {
    id: TILES.DESERT_ORACLE,
    name: "desert-oracle",
    imagePath: "/characters/wizard-purple.png",
    walkable: false,
    scale: 1.55,
    event: { type: "dialogue", npcId: "desert-oracle" },
  },
  {
    id: TILES.DESERT_GATE,
    name: "desert-waystone",
    imagePath: "/globe.svg",
    walkable: true,
    scale: 1.3,
    event: {
      type: "levelTransition",
      targetLevelId: "luminous-glade",
      spawn: { row: 3, col: 3 },
    },
  },
  {
    id: TILES.GLADE_GRASS,
    name: "glade-grass",
    imagePath: "/tiles/grass-flower-tile-1.png",
    walkable: true,
  },
  {
    id: TILES.GLADE_TREE,
    name: "glade-tree",
    imagePath: "/tiles/bush-tile-2.png",
    walkable: false,
  },
  {
    id: TILES.GLADE_WATER,
    name: "glade-water",
    imagePath: "/tiles/water-tile-3.png",
    walkable: false,
  },
  {
    id: TILES.GLADE_GATE,
    name: "glade-waystone",
    imagePath: "/globe.svg",
    walkable: true,
    scale: 1.3,
    event: {
      type: "levelTransition",
      targetLevelId: "verdant-fields",
      spawn: { row: 2, col: 3 },
    },
  },
  {
    id: TILES.GLADE_HISTORIAN,
    name: "glade-historian",
    imagePath: "/characters/player-left.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "glade-historian" },
  },
  {
    id: TILES.GLADE_GUARDIAN,
    name: "glade-guardian",
    imagePath: "/characters/player-character-front.png",
    walkable: false,
    scale: 1.5,
    event: { type: "battle", encounterId: "glade-guardian" },
  },
  {
    id: TILES.GLADE_SONGWEAVER,
    name: "glade-songweaver",
    imagePath: "/characters/player-back.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "glade-songweaver" },
  },
  {
    id: TILES.GLADE_SEER,
    name: "glade-seer",
    imagePath: "/characters/player-right.png",
    walkable: false,
    scale: 1.5,
    event: { type: "battle", encounterId: "glade-seer" },
  },
  {
    id: TILES.GLADE_CARETAKER,
    name: "glade-caretaker",
    imagePath: "/characters/player-front.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "glade-caretaker" },
  },
];

function createFilledMap(width: number, height: number, fill: number): number[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}

function addBorder(map: number[][], tileId: number) {
  const height = map.length;
  const width = map[0]?.length ?? 0;
  for (let col = 0; col < width; col++) {
    map[0][col] = tileId;
    map[height - 1][col] = tileId;
  }
  for (let row = 0; row < height; row++) {
    map[row][0] = tileId;
    map[row][width - 1] = tileId;
  }
}

function fillRectangle(
  map: number[][],
  top: number,
  left: number,
  bottom: number,
  right: number,
  tileId: number
) {
  const height = map.length;
  const width = map[0]?.length ?? 0;
  const startRow = Math.max(0, Math.min(top, bottom));
  const endRow = Math.min(height - 1, Math.max(top, bottom));
  const startCol = Math.max(0, Math.min(left, right));
  const endCol = Math.min(width - 1, Math.max(left, right));
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      map[row][col] = tileId;
    }
  }
}

function drawHorizontalPath(
  map: number[][],
  row: number,
  startCol: number,
  endCol: number,
  tileId: number
) {
  fillRectangle(map, row, startCol, row, endCol, tileId);
}

function drawVerticalPath(
  map: number[][],
  col: number,
  startRow: number,
  endRow: number,
  tileId: number
) {
  fillRectangle(map, startRow, col, endRow, col, tileId);
}

function placeTile(map: number[][], row: number, col: number, tileId: number) {
  if (map[row]?.[col] !== undefined) {
    map[row][col] = tileId;
  }
}

function createVerdantFields(): number[][] {
  const width = 24;
  const height = 20;
  const map = createFilledMap(width, height, TILES.GRASS);
  addBorder(map, TILES.BOULDER);

  fillRectangle(map, 3, 8, 5, 10, TILES.WATER);
  fillRectangle(map, 7, 14, 8, 18, TILES.WATER);
  fillRectangle(map, 12, 4, 13, 6, TILES.WATER);

  drawVerticalPath(map, 3, 1, 16, TILES.COBBLESTONE);
  drawHorizontalPath(map, 10, 3, 16, TILES.COBBLESTONE);
  drawHorizontalPath(map, 16, 3, 19, TILES.COBBLESTONE);
  drawVerticalPath(map, 20, 13, 16, TILES.COBBLESTONE);

  placeTile(map, 5, 12, TILES.GROVE_SAGE);
  placeTile(map, 9, 5, TILES.BOULDER);
  placeTile(map, 11, 7, TILES.BOULDER);
  placeTile(map, 6, 16, TILES.BOULDER);
  placeTile(map, 14, 8, TILES.BOULDER);
  placeTile(map, 8, 13, TILES.BOULDER);

  placeTile(map, 15, 20, TILES.COBBLESTONE);
  placeTile(map, 16, 19, TILES.COBBLESTONE);
  placeTile(map, 17, 20, TILES.COBBLESTONE);
  placeTile(map, 16, 20, TILES.VERDANT_GATE);

  return map;
}

function createAzureApproach(): number[][] {
  const width = 24;
  const height = 20;
  const map = createFilledMap(width, height, TILES.WATER);
  addBorder(map, TILES.BOULDER);

  drawHorizontalPath(map, 4, 2, width - 3, TILES.COBBLESTONE);
  drawVerticalPath(map, 8, 4, 15, TILES.COBBLESTONE);
  drawVerticalPath(map, 12, 4, 15, TILES.COBBLESTONE);
  drawVerticalPath(map, 16, 4, 15, TILES.COBBLESTONE);
  drawVerticalPath(map, 20, 4, 15, TILES.COBBLESTONE);
  drawHorizontalPath(map, 10, 8, 20, TILES.COBBLESTONE);
  drawHorizontalPath(map, 12, 8, 20, TILES.COBBLESTONE);
  drawHorizontalPath(map, 15, 8, 20, TILES.COBBLESTONE);

  fillRectangle(map, 6, 3, 8, 6, TILES.GRASS);
  fillRectangle(map, 11, 9, 13, 11, TILES.GRASS);
  fillRectangle(map, 13, 15, 14, 17, TILES.GRASS);

  placeTile(map, 5, 3, TILES.AZURE_CHRONICLER);
  placeTile(map, 5, 7, TILES.AZURE_SENTINEL);
  placeTile(map, 5, 11, TILES.AZURE_CARTOGRAPHER);
  placeTile(map, 5, 15, TILES.AZURE_TIDEGUARD);
  placeTile(map, 5, 18, TILES.AZURE_BARD);

  placeTile(map, 4, width - 3, TILES.AZURE_GATE);

  placeTile(map, 9, 8, TILES.BOULDER);
  placeTile(map, 9, 9, TILES.BOULDER);
  placeTile(map, 14, 12, TILES.BOULDER);
  placeTile(map, 15, 18, TILES.BOULDER);

  return map;
}

function createCrimsonDunes(): number[][] {
  const width = 24;
  const height = 20;
  const map = createFilledMap(width, height, TILES.SAND);
  addBorder(map, TILES.SANDSTONE_SPIRE);

  fillRectangle(map, 3, 6, 5, 7, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 4, 13, 6, 15, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 8, 2, 9, 5, TILES.OASIS_WATER);
  fillRectangle(map, 10, 9, 12, 11, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 11, 15, 13, 18, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 13, 4, 15, 6, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 14, 10, 16, 12, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 7, 17, 8, 19, TILES.OASIS_WATER);

  drawHorizontalPath(map, 9, 3, 20, TILES.COBBLESTONE);
  drawVerticalPath(map, 6, 12, 12, TILES.COBBLESTONE);
  drawVerticalPath(map, 12, 9, 16, TILES.COBBLESTONE);
  drawVerticalPath(map, 20, 9, 15, TILES.COBBLESTONE);

  placeTile(map, 4, 6, TILES.DESERT_STORYTELLER);
  placeTile(map, 6, 11, TILES.DESERT_DUELIST);
  placeTile(map, 8, 14, TILES.DESERT_NAVIGATOR);
  placeTile(map, 11, 9, TILES.DESERT_BEASTMASTER);
  placeTile(map, 14, 13, TILES.DESERT_ORACLE);

  placeTile(map, 15, 20, TILES.DESERT_GATE);

  return map;
}

function createLuminousGlade(): number[][] {
  const width = 24;
  const height = 20;
  const map = createFilledMap(width, height, TILES.GLADE_GRASS);
  addBorder(map, TILES.GLADE_TREE);

  fillRectangle(map, 4, 5, 6, 8, TILES.GLADE_WATER);
  fillRectangle(map, 8, 3, 9, 5, TILES.GLADE_WATER);
  fillRectangle(map, 11, 14, 13, 17, TILES.GLADE_WATER);
  fillRectangle(map, 6, 14, 7, 16, TILES.GLADE_TREE);
  fillRectangle(map, 10, 9, 12, 11, TILES.GLADE_TREE);
  fillRectangle(map, 14, 4, 16, 6, TILES.GLADE_TREE);

  drawHorizontalPath(map, 15, 4, 20, TILES.COBBLESTONE);

  placeTile(map, 5, 6, TILES.GLADE_HISTORIAN);
  placeTile(map, 7, 14, TILES.GLADE_GUARDIAN);
  placeTile(map, 9, 9, TILES.GLADE_SONGWEAVER);
  placeTile(map, 12, 15, TILES.GLADE_SEER);
  placeTile(map, 14, 8, TILES.GLADE_CARETAKER);

  placeTile(map, 16, 20, TILES.GLADE_GATE);

  return map;
}

export const levelOneMap = createVerdantFields();
export const levelTwoMap = createAzureApproach();
export const levelThreeMap = createCrimsonDunes();
export const levelFourMap = createLuminousGlade();

export interface LevelDefinition {
  id: string;
  name: string;
  description: string;
  map: number[][];
  startingPosition: { row: number; col: number };
}

export const levels: LevelDefinition[] = [
  {
    id: "verdant-fields",
    name: "Verdant Fields",
    description:
      "A tranquil meadow of soft grass, winding cobblestone paths, and the grove sage who watches over the first waystone.",
    map: levelOneMap,
    startingPosition: { row: 2, col: 3 },
  },
  {
    id: "azure-approach",
    name: "Azure Approach",
    description:
      "Piers and islands linked by slick planks usher explorers across the bay toward storytellers of the tides.",
    map: levelTwoMap,
    startingPosition: { row: 4, col: 3 },
  },
  {
    id: "crimson-dunes",
    name: "Crimson Dunes",
    description:
      "Rolling dunes, oasis pools, and nomads of the desert test your resolve beneath a blazing sun.",
    map: levelThreeMap,
    startingPosition: { row: 3, col: 3 },
  },
  {
    id: "luminous-glade",
    name: "Luminous Glade",
    description:
      "Bioluminescent groves and crystalline ponds glow softly as guardians of light share the region's ancient lore.",
    map: levelFourMap,
    startingPosition: { row: 3, col: 3 },
  },
];

export type LevelId = (typeof levels)[number]["id"];

const defaultLevel = levels[0];
if (!defaultLevel) {
  throw new Error("At least one level must be defined.");
}

export const DEFAULT_LEVEL = defaultLevel;
