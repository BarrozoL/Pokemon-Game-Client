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
  // New interactive tiles
  TREASURE_CHEST: 31,
  MYSTERIOUS_ORB: 32,
  ANCIENT_RUNE: 33,
  BRIDGE_LEVER: 34,
  LOCKED_DOOR: 35,
  SECRET_PASSAGE: 36,
  HEALING_FOUNTAIN: 37,
  FLOWER_PATCH: 38,
  CRYSTALVINE: 39,
  MUSHROOM_CIRCLE: 40,
  // New NPCs
  VERDANT_MERCHANT: 41,
  VERDANT_EXPLORER: 42,
  AZURE_FISHERMAN: 43,
  AZURE_SCHOLAR: 44,
  DESERT_TRADER: 45,
  DESERT_NOMAD: 46,
  GLADE_DRUID: 47,
  GLADE_SPRITE: 48,
  // New terrain
  QUICKSAND: 49,
  ICE_PATCH: 50,
  LAVA_POOL: 51,
  MOVING_PLATFORM: 52,
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
  // New tile colors
  [TILES.TREASURE_CHEST]: "#ffd700",
  [TILES.MYSTERIOUS_ORB]: "#8a2be2",
  [TILES.ANCIENT_RUNE]: "#4169e1",
  [TILES.BRIDGE_LEVER]: "#cd853f",
  [TILES.LOCKED_DOOR]: "#8b4513",
  [TILES.SECRET_PASSAGE]: "#2f4f4f",
  [TILES.HEALING_FOUNTAIN]: "#40e0d0",
  [TILES.FLOWER_PATCH]: "#ff69b4",
  [TILES.CRYSTALVINE]: "#9370db",
  [TILES.MUSHROOM_CIRCLE]: "#ff6347",
  [TILES.VERDANT_MERCHANT]: "#32cd32",
  [TILES.VERDANT_EXPLORER]: "#228b22",
  [TILES.AZURE_FISHERMAN]: "#4682b4",
  [TILES.AZURE_SCHOLAR]: "#191970",
  [TILES.DESERT_TRADER]: "#daa520",
  [TILES.DESERT_NOMAD]: "#d2691e",
  [TILES.GLADE_DRUID]: "#9acd32",
  [TILES.GLADE_SPRITE]: "#98fb98",
  [TILES.QUICKSAND]: "#f4a460",
  [TILES.ICE_PATCH]: "#e0ffff",
  [TILES.LAVA_POOL]: "#ff4500",
  [TILES.MOVING_PLATFORM]: "#a9a9a9",
};

export type TileEvent =
  | {
      type: "levelTransition";
      targetLevelId: string;
      spawn?: { row: number; col: number };
    }
  | { type: "dialogue"; npcId: string }
  | { type: "battle"; encounterId: string }
  | { type: "treasure"; itemId: string; message: string }
  | { type: "heal"; amount: number; message: string }
  | { type: "puzzle"; puzzleId: string }
  | { type: "secret"; revealTiles: Array<{ row: number; col: number; newTileId: number }> }
  | { type: "teleport"; targetRow: number; targetCol: number }
  | { type: "shop"; shopId: string };

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
      spawn: { row: 8, col: 6 },
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
      spawn: { row: 6, col: 6 },
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
      spawn: { row: 6, col: 6 },
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
      spawn: { row: 4, col: 6 },
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
  // New interactive tiles
  {
    id: TILES.TREASURE_CHEST,
    name: "treasure-chest",
    imagePath: "/tiles/grass-tile-5.png", // Placeholder - you can replace with chest image
    walkable: true,
    scale: 1.2,
    event: { type: "treasure", itemId: "ancient-coin", message: "You found an ancient coin!" },
  },
  {
    id: TILES.MYSTERIOUS_ORB,
    name: "mysterious-orb",
    imagePath: "/globe.svg",
    walkable: true,
    scale: 0.8,
    event: { type: "puzzle", puzzleId: "orb-sequence" },
  },
  {
    id: TILES.ANCIENT_RUNE,
    name: "ancient-rune",
    imagePath: "/tiles/cobblestone-path-tile.png",
    walkable: true,
    event: { type: "secret", revealTiles: [{ row: 10, col: 10, newTileId: TILES.SECRET_PASSAGE }] },
  },
  {
    id: TILES.BRIDGE_LEVER,
    name: "bridge-lever",
    imagePath: "/tiles/rock-obstacle-tile.png",
    walkable: false,
    scale: 1.1,
    event: { type: "puzzle", puzzleId: "bridge-mechanism" },
  },
  {
    id: TILES.LOCKED_DOOR,
    name: "locked-door",
    imagePath: "/tiles/rock-obstacle-tile.png",
    walkable: false,
    scale: 1.3,
    event: { type: "puzzle", puzzleId: "door-key" },
  },
  {
    id: TILES.SECRET_PASSAGE,
    name: "secret-passage",
    imagePath: "/tiles/cobblestone-path-tile.png",
    walkable: true,
    event: { type: "teleport", targetRow: 5, targetCol: 5 },
  },
  {
    id: TILES.HEALING_FOUNTAIN,
    name: "healing-fountain",
    imagePath: "/tiles/water-tile-3.png",
    walkable: true,
    scale: 1.1,
    event: { type: "heal", amount: 25, message: "The mystical waters restore your energy!" },
  },
  {
    id: TILES.FLOWER_PATCH,
    name: "flower-patch",
    imagePath: "/tiles/grass-flower-tile-1.png",
    walkable: true,
    event: { type: "treasure", itemId: "healing-herb", message: "You gathered some healing herbs!" },
  },
  {
    id: TILES.CRYSTALVINE,
    name: "crystalvine",
    imagePath: "/tiles/bush-tile-2.png",
    walkable: false,
    scale: 1.2,
    event: { type: "dialogue", npcId: "crystalvine-spirit" },
  },
  {
    id: TILES.MUSHROOM_CIRCLE,
    name: "mushroom-circle",
    imagePath: "/tiles/grass-tile-5.png",
    walkable: true,
    event: { type: "teleport", targetRow: 15, targetCol: 15 },
  },
  // New NPCs
  {
    id: TILES.VERDANT_MERCHANT,
    name: "verdant-merchant",
    imagePath: "/characters/character-sprite-image.png",
    walkable: false,
    scale: 1.4,
    event: { type: "shop", shopId: "verdant-goods" },
  },
  {
    id: TILES.VERDANT_EXPLORER,
    name: "verdant-explorer",
    imagePath: "/characters/player-right.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "verdant-explorer" },
  },
  {
    id: TILES.AZURE_FISHERMAN,
    name: "azure-fisherman",
    imagePath: "/characters/player-front.png",
    walkable: false,
    scale: 1.5,
    event: { type: "dialogue", npcId: "azure-fisherman" },
  },
  {
    id: TILES.AZURE_SCHOLAR,
    name: "azure-scholar",
    imagePath: "/characters/wizard-purple.png",
    walkable: false,
    scale: 1.55,
    event: { type: "dialogue", npcId: "azure-scholar" },
  },
  {
    id: TILES.DESERT_TRADER,
    name: "desert-trader",
    imagePath: "/characters/character-sprite-image.png",
    walkable: false,
    scale: 1.4,
    event: { type: "shop", shopId: "desert-bazaar" },
  },
  {
    id: TILES.DESERT_NOMAD,
    name: "desert-nomad",
    imagePath: "/characters/player-left.png",
    walkable: false,
    scale: 1.45,
    event: { type: "dialogue", npcId: "desert-nomad" },
  },
  {
    id: TILES.GLADE_DRUID,
    name: "glade-druid",
    imagePath: "/characters/wizard-blue.png",
    walkable: false,
    scale: 1.55,
    event: { type: "battle", encounterId: "glade-druid" },
  },
  {
    id: TILES.GLADE_SPRITE,
    name: "glade-sprite",
    imagePath: "/characters/player-back.png",
    walkable: false,
    scale: 1.3,
    event: { type: "dialogue", npcId: "glade-sprite" },
  },
  // Special terrain
  {
    id: TILES.QUICKSAND,
    name: "quicksand",
    imagePath: "/tiles/sand-tile-1.png",
    walkable: true,
  },
  {
    id: TILES.ICE_PATCH,
    name: "ice-patch",
    imagePath: "/tiles/water-tile-1.png",
    walkable: true,
  },
  {
    id: TILES.LAVA_POOL,
    name: "lava-pool",
    imagePath: "/tiles/rock-tile-1.png",
    walkable: false,
  },
  {
    id: TILES.MOVING_PLATFORM,
    name: "moving-platform",
    imagePath: "/tiles/cobblestone-path-tile.png",
    walkable: true,
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
  const width = 48;
  const height = 40;
  const map = createFilledMap(width, height, TILES.GRASS);
  addBorder(map, TILES.BOULDER);

  // Main water features - lakes and streams
  fillRectangle(map, 6, 15, 10, 20, TILES.WATER);
  fillRectangle(map, 14, 28, 16, 35, TILES.WATER);
  fillRectangle(map, 24, 8, 26, 12, TILES.WATER);
  fillRectangle(map, 30, 20, 32, 25, TILES.WATER);

  // Connecting streams
  drawHorizontalPath(map, 8, 20, 28, TILES.WATER);
  drawVerticalPath(map, 25, 8, 20, TILES.WATER);

  // Main cobblestone roads
  drawVerticalPath(map, 6, 2, 35, TILES.COBBLESTONE);
  drawHorizontalPath(map, 20, 6, 32, TILES.COBBLESTONE);
  drawHorizontalPath(map, 32, 6, 38, TILES.COBBLESTONE);
  drawVerticalPath(map, 40, 25, 32, TILES.COBBLESTONE);

  // Secondary paths
  drawHorizontalPath(map, 12, 6, 40, TILES.COBBLESTONE);
  drawVerticalPath(map, 12, 12, 30, TILES.COBBLESTONE);
  drawVerticalPath(map, 28, 12, 30, TILES.COBBLESTONE);

  // Original NPCs
  placeTile(map, 10, 24, TILES.GROVE_SAGE);

  // New NPCs and features
  placeTile(map, 8, 10, TILES.VERDANT_MERCHANT);
  placeTile(map, 15, 15, TILES.VERDANT_EXPLORER);
  placeTile(map, 25, 30, TILES.TREASURE_CHEST);
  placeTile(map, 18, 35, TILES.HEALING_FOUNTAIN);
  placeTile(map, 28, 15, TILES.FLOWER_PATCH);
  placeTile(map, 35, 25, TILES.MYSTERIOUS_ORB);

  // Hidden areas and secrets
  fillRectangle(map, 2, 35, 8, 42, TILES.GRASS);
  placeTile(map, 5, 38, TILES.ANCIENT_RUNE);
  placeTile(map, 4, 40, TILES.SECRET_PASSAGE);

  // Additional landscape features
  fillRectangle(map, 22, 2, 25, 5, TILES.BOULDER);
  fillRectangle(map, 35, 10, 37, 15, TILES.BOULDER);

  // Gate to next level
  placeTile(map, 32, 40, TILES.COBBLESTONE);
  placeTile(map, 33, 39, TILES.COBBLESTONE);
  placeTile(map, 34, 40, TILES.COBBLESTONE);
  placeTile(map, 33, 40, TILES.VERDANT_GATE);

  return map;
}

function createAzureApproach(): number[][] {
  const width = 48;
  const height = 40;
  const map = createFilledMap(width, height, TILES.WATER);
  addBorder(map, TILES.BOULDER);

  // Main pier structure - more complex dock system
  drawHorizontalPath(map, 8, 4, width - 6, TILES.COBBLESTONE);
  drawVerticalPath(map, 16, 8, 30, TILES.COBBLESTONE);
  drawVerticalPath(map, 24, 8, 30, TILES.COBBLESTONE);
  drawVerticalPath(map, 32, 8, 30, TILES.COBBLESTONE);
  drawVerticalPath(map, 40, 8, 30, TILES.COBBLESTONE);

  // Cross-connecting piers
  drawHorizontalPath(map, 15, 16, 40, TILES.COBBLESTONE);
  drawHorizontalPath(map, 20, 16, 40, TILES.COBBLESTONE);
  drawHorizontalPath(map, 25, 16, 40, TILES.COBBLESTONE);
  drawHorizontalPath(map, 30, 16, 40, TILES.COBBLESTONE);

  // Island platforms
  fillRectangle(map, 12, 6, 14, 12, TILES.GRASS);
  fillRectangle(map, 18, 18, 22, 22, TILES.GRASS);
  fillRectangle(map, 26, 28, 28, 35, TILES.GRASS);
  fillRectangle(map, 32, 10, 35, 14, TILES.GRASS);

  // Original NPCs repositioned
  placeTile(map, 10, 6, TILES.AZURE_CHRONICLER);
  placeTile(map, 10, 14, TILES.AZURE_SENTINEL);
  placeTile(map, 10, 22, TILES.AZURE_CARTOGRAPHER);
  placeTile(map, 10, 30, TILES.AZURE_TIDEGUARD);
  placeTile(map, 10, 36, TILES.AZURE_BARD);

  // New NPCs and features
  placeTile(map, 20, 20, TILES.AZURE_FISHERMAN);
  placeTile(map, 27, 30, TILES.AZURE_SCHOLAR);
  placeTile(map, 33, 12, TILES.TREASURE_CHEST);
  placeTile(map, 16, 25, TILES.HEALING_FOUNTAIN);
  placeTile(map, 28, 18, TILES.MYSTERIOUS_ORB);

  // Bridge mechanisms
  placeTile(map, 12, 20, TILES.BRIDGE_LEVER);
  placeTile(map, 24, 35, TILES.BRIDGE_LEVER);

  // Hidden underwater sections
  fillRectangle(map, 35, 20, 37, 25, TILES.SECRET_PASSAGE);
  placeTile(map, 36, 22, TILES.ANCIENT_RUNE);

  // Gate to next level
  placeTile(map, 8, width - 6, TILES.AZURE_GATE);

  // Additional obstacles
  placeTile(map, 18, 16, TILES.BOULDER);
  placeTile(map, 18, 17, TILES.BOULDER);
  placeTile(map, 28, 24, TILES.BOULDER);
  placeTile(map, 30, 36, TILES.BOULDER);

  return map;
}

function createCrimsonDunes(): number[][] {
  const width = 48;
  const height = 40;
  const map = createFilledMap(width, height, TILES.SAND);
  addBorder(map, TILES.SANDSTONE_SPIRE);

  // Large sandstone formations and dunes
  fillRectangle(map, 6, 12, 10, 14, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 8, 26, 12, 30, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 16, 4, 18, 10, TILES.OASIS_WATER);
  fillRectangle(map, 20, 18, 24, 22, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 22, 30, 26, 36, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 26, 8, 30, 12, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 28, 20, 32, 24, TILES.SANDSTONE_SPIRE);
  fillRectangle(map, 14, 34, 16, 38, TILES.OASIS_WATER);

  // Major oasis areas
  fillRectangle(map, 32, 15, 35, 20, TILES.OASIS_WATER);
  fillRectangle(map, 10, 35, 13, 40, TILES.OASIS_WATER);

  // Ancient caravan routes
  drawHorizontalPath(map, 18, 6, 40, TILES.COBBLESTONE);
  drawVerticalPath(map, 12, 24, 24, TILES.COBBLESTONE);
  drawVerticalPath(map, 24, 18, 32, TILES.COBBLESTONE);
  drawVerticalPath(map, 40, 18, 30, TILES.COBBLESTONE);
  drawHorizontalPath(map, 30, 12, 35, TILES.COBBLESTONE);

  // Quicksand hazards
  fillRectangle(map, 12, 8, 14, 10, TILES.QUICKSAND);
  fillRectangle(map, 25, 14, 27, 16, TILES.QUICKSAND);
  fillRectangle(map, 35, 25, 37, 28, TILES.QUICKSAND);

  // Original NPCs repositioned
  placeTile(map, 8, 12, TILES.DESERT_STORYTELLER);
  placeTile(map, 12, 22, TILES.DESERT_DUELIST);
  placeTile(map, 16, 28, TILES.DESERT_NAVIGATOR);
  placeTile(map, 22, 18, TILES.DESERT_BEASTMASTER);
  placeTile(map, 28, 26, TILES.DESERT_ORACLE);

  // New NPCs and features
  placeTile(map, 17, 7, TILES.DESERT_TRADER);
  placeTile(map, 33, 17, TILES.DESERT_NOMAD);
  placeTile(map, 24, 35, TILES.TREASURE_CHEST);
  placeTile(map, 11, 37, TILES.HEALING_FOUNTAIN);
  placeTile(map, 29, 15, TILES.MYSTERIOUS_ORB);

  // Ancient ruins and secrets
  placeTile(map, 15, 20, TILES.ANCIENT_RUNE);
  placeTile(map, 30, 35, TILES.SECRET_PASSAGE);
  placeTile(map, 35, 8, TILES.LOCKED_DOOR);

  // Gate to next level
  placeTile(map, 30, 40, TILES.DESERT_GATE);

  return map;
}

function createLuminousGlade(): number[][] {
  const width = 48;
  const height = 40;
  const map = createFilledMap(width, height, TILES.GLADE_GRASS);
  addBorder(map, TILES.GLADE_TREE);

  // Mystical grove areas with crystal pools
  fillRectangle(map, 8, 10, 12, 16, TILES.GLADE_WATER);
  fillRectangle(map, 16, 6, 18, 10, TILES.GLADE_WATER);
  fillRectangle(map, 22, 28, 26, 34, TILES.GLADE_WATER);
  fillRectangle(map, 30, 15, 33, 20, TILES.GLADE_WATER);

  // Ancient tree groves
  fillRectangle(map, 12, 28, 16, 32, TILES.GLADE_TREE);
  fillRectangle(map, 20, 18, 24, 22, TILES.GLADE_TREE);
  fillRectangle(map, 28, 4, 32, 8, TILES.GLADE_TREE);
  fillRectangle(map, 35, 25, 38, 30, TILES.GLADE_TREE);

  // Magical pathways
  drawHorizontalPath(map, 30, 8, 40, TILES.COBBLESTONE);
  drawVerticalPath(map, 20, 10, 35, TILES.COBBLESTONE);
  drawHorizontalPath(map, 15, 8, 30, TILES.COBBLESTONE);

  // Mystical features
  fillRectangle(map, 6, 25, 8, 30, TILES.CRYSTALVINE);
  fillRectangle(map, 25, 10, 27, 15, TILES.MUSHROOM_CIRCLE);
  fillRectangle(map, 32, 32, 34, 38, TILES.FLOWER_PATCH);

  // Original NPCs repositioned
  placeTile(map, 10, 12, TILES.GLADE_HISTORIAN);
  placeTile(map, 14, 28, TILES.GLADE_GUARDIAN);
  placeTile(map, 18, 18, TILES.GLADE_SONGWEAVER);
  placeTile(map, 24, 30, TILES.GLADE_SEER);
  placeTile(map, 28, 12, TILES.GLADE_CARETAKER);

  // New mystical NPCs and features
  placeTile(map, 31, 17, TILES.GLADE_DRUID);
  placeTile(map, 26, 12, TILES.GLADE_SPRITE);
  placeTile(map, 17, 8, TILES.HEALING_FOUNTAIN);
  placeTile(map, 36, 27, TILES.TREASURE_CHEST);
  placeTile(map, 7, 27, TILES.MYSTERIOUS_ORB);

  // Hidden magical areas
  fillRectangle(map, 2, 35, 6, 42, TILES.SECRET_PASSAGE);
  placeTile(map, 4, 38, TILES.ANCIENT_RUNE);
  placeTile(map, 35, 15, TILES.MUSHROOM_CIRCLE);

  // Ice patches from magical frost
  fillRectangle(map, 20, 35, 22, 38, TILES.ICE_PATCH);
  fillRectangle(map, 12, 20, 14, 22, TILES.ICE_PATCH);

  // Return gate to beginning
  placeTile(map, 32, 40, TILES.GLADE_GATE);

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
      "A vast, tranquil meadow of soft grass, interconnected waterways, winding cobblestone paths, and mysterious secrets hidden among ancient groves.",
    map: levelOneMap,
    startingPosition: { row: 4, col: 6 },
  },
  {
    id: "azure-approach",
    name: "Azure Approach",
    description:
      "An expansive network of piers, islands, and floating platforms linked by weathered planks, where tide-touched explorers and scholars share maritime mysteries.",
    map: levelTwoMap,
    startingPosition: { row: 8, col: 6 },
  },
  {
    id: "crimson-dunes",
    name: "Crimson Dunes",
    description:
      "Vast rolling dunes, treacherous quicksand, sprawling oasis pools, and ancient caravan routes where desert nomads guard forgotten treasures.",
    map: levelThreeMap,
    startingPosition: { row: 6, col: 6 },
  },
  {
    id: "luminous-glade",
    name: "Luminous Glade",
    description:
      "An enchanted realm of bioluminescent groves, crystalline ponds, mystical crystal vines, and ancient magic circles where guardians of primordial light dwell.",
    map: levelFourMap,
    startingPosition: { row: 6, col: 6 },
  },
];

export type LevelId = (typeof levels)[number]["id"];

const defaultLevel = levels[0];
if (!defaultLevel) {
  throw new Error("At least one level must be defined.");
}

export const DEFAULT_LEVEL = defaultLevel;
