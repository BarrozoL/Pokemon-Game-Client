"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  tileColors,
  tileDefinitions,
  TILE_SIZE,
  DEFAULT_LEVEL,
  LevelDefinition,
  TileDefinition,
  TileEvent,
} from "./mapData";
import { battleEncounters, npcDialogues, DialogueEntry } from "./eventData";

// type for loaded images
type LoadedTileImages = Record<number, HTMLImageElement>;

type Direction = "down" | "up" | "left" | "right";

const PLAYER_IMAGE_PATHS: Record<Direction, string> = {
  down: "/characters/player-front.png",
  up: "/characters/player-back.png",
  left: "/characters/player-left.png",
  right: "/characters/player-right.png",
};

interface GameCanvasProps {
  level?: LevelDefinition;
  entryPosition?: { row: number; col: number };
  onLevelChange?: (transition: {
    targetLevelId: string;
    spawn?: { row: number; col: number };
  }) => void;
  onDialogue?: (dialogue: DialogueEntry) => void;
  isInputDisabled?: boolean;
}

interface GameMessage {
  type: "treasure" | "heal" | "puzzle" | "secret" | "shop";
  message: string;
  duration?: number;
}

export default function GameCanvas({
  level,
  entryPosition,
  onLevelChange,
  onDialogue,
  isInputDisabled = false,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState<LoadedTileImages | null>(
    null
  );

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const activeLevel = level ?? DEFAULT_LEVEL;
  const mapGrid = activeLevel.map;
  const tileSize = TILE_SIZE;
  const rows = mapGrid.length;
  const cols = mapGrid[0]?.length ?? 0;

  const startingPosition = useMemo(
    () => ({ ...activeLevel.startingPosition }),
    [activeLevel]
  );

  const effectiveEntry = useMemo(
    () => entryPosition ?? startingPosition,
    [entryPosition, startingPosition]
  );

  const [playerTile, setPlayerTile] = useState<{ row: number; col: number }>(
    () => ({ ...effectiveEntry })
  );
  const [dir, setDir] = useState<Direction>("down");
  const [playerImages, setPlayerImages] = useState<
    Partial<Record<Direction, HTMLImageElement>>
  >({});
  const [gameMessage, setGameMessage] = useState<GameMessage | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [mapModifications, setMapModifications] = useState<Map<string, number>>(new Map());

  // Get the current map with modifications applied
  const currentMap = useMemo(() => {
    const modifiedMap = mapGrid.map(row => [...row]); // Deep copy
    mapModifications.forEach((tileId, key) => {
      const [row, col] = key.split(',').map(Number);
      if (modifiedMap[row] && modifiedMap[row][col] !== undefined) {
        modifiedMap[row][col] = tileId;
      }
    });
    return modifiedMap;
  }, [mapGrid, mapModifications]);

  useEffect(() => {
    setPlayerTile({ row: effectiveEntry.row, col: effectiveEntry.col });
    setDir("down");
    // Clear map modifications when changing levels
    setMapModifications(new Map());
  }, [effectiveEntry.row, effectiveEntry.col, activeLevel.id]);

  // Handle game message timeouts
  useEffect(() => {
    if (gameMessage && gameMessage.duration) {
      const timer = setTimeout(() => {
        setGameMessage(null);
      }, gameMessage.duration);
      return () => clearTimeout(timer);
    }
  }, [gameMessage]);

  // Effect for loading images
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const imagesToLoad: { [key: number]: HTMLImageElement } = {};
    const promises: Promise<void>[] = [];

    tileDefinitions.forEach((tile) => {
      const img = new Image(); // Creating Image objects *here* (client-side)
      imagesToLoad[tile.id] = img;
      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = (err) => {
          console.error(`Failed to load image for tile: ${tile.name}`, err);
          resolve();
        };
        img.src = tile.imagePath;
      });
      promises.push(promise);
    });

    //Loading player image
    const playerImgs: Partial<Record<Direction, HTMLImageElement>> = {};
    const playerPromises = (Object.keys(PLAYER_IMAGE_PATHS) as Direction[]).map(
      (d) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = PLAYER_IMAGE_PATHS[d];
          playerImgs[d] = img;
        })
    );
    promises.push(...playerPromises);

    Promise.all(promises).then(() => {
      if (!isMounted) return;
      setLoadedImages(imagesToLoad);
      setPlayerImages(playerImgs);
    });

    return () => {
      isMounted = false; // Cleanup function to prevent setting state after unmount
    };
  }, []);

  // Effect for setting initial canvas size and handling resize
  useEffect(() => {
    function updateCanvasSize() {
      setCanvasSize({
        width: 800,
        height: 600,
      });
    }
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const WALKABLE = useMemo(
    () => new Set(tileDefinitions.filter((t) => t.walkable).map((t) => t.id)),
    []
  );

  const tileDefinitionMap = useMemo(() => {
    const map = new Map<number, TileDefinition>();
    tileDefinitions.forEach((tile) => {
      map.set(tile.id, tile);
    });
    return map;
  }, []);

  const attemptMove = useCallback(
    (deltaRow: number, deltaCol: number) => {
      setPlayerTile((pos) => {
        const newRow = pos.row + deltaRow;
        const newCol = pos.col + deltaCol;

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
          return pos; // out of map
        }

        const tileId = currentMap[newRow][newCol];
        if (!WALKABLE.has(tileId)) {
          return pos; // blocked
        }

        return { row: newRow, col: newCol };
      });
    },
    [cols, currentMap, rows, WALKABLE]
  );

  const handleTileEvent = useCallback(
    (tileDef: TileDefinition, event: TileEvent) => {
      switch (event.type) {
        case "levelTransition": {
          if (!event.targetLevelId) {
            return;
          }
          onLevelChange?.({
            targetLevelId: event.targetLevelId,
            spawn: event.spawn,
          });
          break;
        }
        case "dialogue": {
          const dialogue = npcDialogues[event.npcId];
          if (dialogue) {
            onDialogue?.(dialogue);
          } else if (onDialogue) {
            onDialogue({
              id: event.npcId,
              name: tileDef.name,
              lines: ["..."],
            });
          }
          break;
        }
        case "battle": {
          const encounter = battleEncounters[event.encounterId];
          if (!encounter) {
            console.warn(`Encounter not found: ${event.encounterId}`);
            return;
          }
          const params = new URLSearchParams();
          params.set("encounter", event.encounterId);
          params.set("returnLevel", activeLevel.id);
          router.push(`/battleScreen?${params.toString()}`);
          break;
        }
        case "treasure": {
          setInventory(prev => [...prev, event.itemId]);
          setGameMessage({
            type: "treasure",
            message: event.message,
            duration: 3000
          });
          break;
        }
        case "heal": {
          setPlayerHealth(prev => Math.min(100, prev + event.amount));
          setGameMessage({
            type: "heal",
            message: event.message,
            duration: 2000
          });
          break;
        }
        case "puzzle": {
          setGameMessage({
            type: "puzzle",
            message: `Activated ${event.puzzleId}! Something changed in the distance...`,
            duration: 3000
          });
          // Puzzle logic could be expanded here
          break;
        }
        case "secret": {
          // Reveal secret tiles using proper state management
          setMapModifications(prev => {
            const newModifications = new Map(prev);
            event.revealTiles.forEach(tile => {
              if (mapGrid[tile.row] && mapGrid[tile.row][tile.col] !== undefined) {
                newModifications.set(`${tile.row},${tile.col}`, tile.newTileId);
              }
            });
            return newModifications;
          });
          setGameMessage({
            type: "secret",
            message: "A secret passage has been revealed!",
            duration: 3000
          });
          break;
        }
        case "teleport": {
          setPlayerTile({ row: event.targetRow, col: event.targetCol });
          setGameMessage({
            type: "secret",
            message: "You were teleported by ancient magic!",
            duration: 2000
          });
          break;
        }
        case "shop": {
          setGameMessage({
            type: "shop",
            message: `Welcome to the ${event.shopId}! (Shop system coming soon)`,
            duration: 3000
          });
          break;
        }
      }
    },
    [activeLevel.id, onDialogue, onLevelChange, router, mapGrid]
  );

  const lastTileEventKey = useRef<string | null>(null);
  useEffect(() => {
    const tileId = currentMap[playerTile.row]?.[playerTile.col];
    if (tileId === undefined) {
      lastTileEventKey.current = null;
      return;
    }
    const tileDef = tileDefinitionMap.get(tileId);
    if (!tileDef?.event) {
      lastTileEventKey.current = null;
      return;
    }

    // Only handle events that trigger when stepping on tiles
    const stepOnEvents = ["levelTransition", "treasure", "heal", "teleport", "secret"];
    if (!stepOnEvents.includes(tileDef.event.type)) {
      lastTileEventKey.current = null;
      return;
    }

    const key = `${playerTile.row}:${playerTile.col}:${tileId}`;
    if (lastTileEventKey.current === key) {
      return;
    }
    lastTileEventKey.current = key;
    handleTileEvent(tileDef, tileDef.event);
  }, [handleTileEvent, currentMap, playerTile, tileDefinitionMap]);

  const interactWithFacingTile = useCallback(() => {
    const offsets: Record<Direction, { row: number; col: number }> = {
      down: { row: 1, col: 0 },
      up: { row: -1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };
    const offset = offsets[dir];
    const targetRow = playerTile.row + offset.row;
    const targetCol = playerTile.col + offset.col;

    if (
      targetRow < 0 ||
      targetRow >= rows ||
      targetCol < 0 ||
      targetCol >= cols
    ) {
      return;
    }

    const tileId = currentMap[targetRow][targetCol];
    const tileDef = tileDefinitionMap.get(tileId);
    if (!tileDef?.event) {
      return;
    }

    // Only handle events that require interaction (facing + pressing space/enter)
    const interactionEvents = ["dialogue", "battle", "puzzle", "shop"];
    if (!interactionEvents.includes(tileDef.event.type)) {
      return;
    }

    handleTileEvent(tileDef, tileDef.event);
  }, [cols, dir, handleTileEvent, currentMap, playerTile, rows, tileDefinitionMap]);

  // Drawing Effect
  useEffect(() => {
    if (
      !loadedImages ||
      !canvasRef.current ||
      !canvasSize.width ||
      !canvasSize.height ||
      !rows ||
      !cols
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const mapWidth = cols * tileSize;
    const mapHeight = rows * tileSize;

    let cameraX =
      playerTile.col * tileSize - canvasSize.width / 2 + tileSize / 2;
    let cameraY =
      playerTile.row * tileSize - canvasSize.height / 2 + tileSize / 2;

    cameraX = Math.max(0, Math.min(cameraX, mapWidth - canvasSize.width));
    cameraY = Math.max(0, Math.min(cameraY, mapHeight - canvasSize.height));

    const startCol = Math.floor(cameraX / tileSize);
    const startRow = Math.floor(cameraY / tileSize);

    const visibleCols = Math.ceil(canvas.width / tileSize) + 2;
    const visibleRows = Math.ceil(canvas.height / tileSize) + 2;

    ctx.imageSmoothingEnabled = false;

    for (let row = startRow; row < startRow + visibleRows; row++) {
      for (let col = startCol; col < startCol + visibleCols; col++) {
        if (
          row < 0 ||
          row >= currentMap.length ||
          col < 0 ||
          col >= currentMap[0].length
        ) {
          continue;
        }

        const tileType = currentMap[row][col];
        const tileDef = tileDefinitionMap.get(tileType);
        const scale = tileDef?.scale ?? 1;
        const drawSize = tileSize * scale;
        const offset = (drawSize - tileSize) / 2;
        const drawX = Math.floor(col * tileSize - cameraX) - offset;
        const drawY = Math.floor(row * tileSize - cameraY) - offset;

        const tileImg = loadedImages[tileType];

        if (tileImg && tileImg.complete && tileImg.naturalHeight !== 0) {
          ctx.drawImage(tileImg, drawX, drawY, drawSize, drawSize);
        } else {
          ctx.fillStyle = tileColors[tileType] || "#000";
          ctx.fillRect(drawX, drawY, drawSize, drawSize);
        }
      }
    }

    const img = playerImages[dir];
    const playerScreenX = Math.floor(playerTile.col * tileSize - cameraX);
    const playerScreenY = Math.floor(playerTile.row * tileSize - cameraY);
    const playerWidth = tileSize;
    const playerHeight = tileSize;

    if (img && img.complete && img.naturalHeight !== 0) {
      ctx.drawImage(img, playerScreenX, playerScreenY, playerWidth, playerHeight);
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(playerScreenX, playerScreenY, tileSize, tileSize);
    }
  }, [
    loadedImages,
    playerImages,
    dir,
    canvasSize,
    playerTile,
    tileSize,
    rows,
    cols,
    currentMap,
    tileDefinitionMap,
  ]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isInputDisabled) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault();
          setDir("up");
          attemptMove(-1, 0);
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          setDir("down");
          attemptMove(1, 0);
          break;
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          setDir("left");
          attemptMove(0, -1);
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          setDir("right");
          attemptMove(0, 1);
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          interactWithFacingTile();
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attemptMove, interactWithFacingTile, isInputDisabled]);

  return (
    <div className="relative">
      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg z-10 min-w-[200px]">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Health:</span>
            <span>{playerHealth}/100</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${playerHealth}%` }}
            />
          </div>
          {inventory.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-300">Inventory:</div>
              <div className="text-xs">
                {inventory.slice(-3).map((item, index) => (
                  <div key={index} className="text-yellow-400">• {item}</div>
                ))}
                {inventory.length > 3 && <div className="text-xs text-gray-400">...and {inventory.length - 3} more</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          display: "block",
          background: "#333",
          margin: "20px auto",
          imageRendering: "pixelated",
        }}
      />

      {/* Game Messages */}
      {gameMessage && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg z-10 max-w-md text-center">
          <div className={`text-sm ${
            gameMessage.type === "treasure" ? "text-yellow-400" :
            gameMessage.type === "heal" ? "text-green-400" :
            gameMessage.type === "puzzle" ? "text-blue-400" :
            gameMessage.type === "secret" ? "text-purple-400" :
            gameMessage.type === "shop" ? "text-orange-400" :
            "text-white"
          }`}>
            {gameMessage.message}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg z-10 text-xs max-w-[180px]">
        <div className="space-y-1">
          <div><strong>Movement:</strong> WASD or Arrow Keys</div>
          <div><strong>Interact:</strong> Space or Enter</div>
          <div className="text-gray-300 mt-2">
            Walk into gates to travel between levels.
            Face NPCs and interactive objects, then press interact.
          </div>
        </div>
      </div>
    </div>
  );
}
