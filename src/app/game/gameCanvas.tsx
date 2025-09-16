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

  useEffect(() => {
    setPlayerTile({ row: effectiveEntry.row, col: effectiveEntry.col });
    setDir("down");
  }, [effectiveEntry.row, effectiveEntry.col]);

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

        const tileId = mapGrid[newRow][newCol];
        if (!WALKABLE.has(tileId)) {
          return pos; // blocked
        }

        return { row: newRow, col: newCol };
      });
    },
    [cols, mapGrid, rows, WALKABLE]
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
      }
    },
    [activeLevel.id, onDialogue, onLevelChange, router]
  );

  const lastTransitionKey = useRef<string | null>(null);
  useEffect(() => {
    const tileId = mapGrid[playerTile.row]?.[playerTile.col];
    if (tileId === undefined) {
      lastTransitionKey.current = null;
      return;
    }
    const tileDef = tileDefinitionMap.get(tileId);
    if (!tileDef?.event || tileDef.event.type !== "levelTransition") {
      lastTransitionKey.current = null;
      return;
    }
    const key = `${playerTile.row}:${playerTile.col}:${tileId}`;
    if (lastTransitionKey.current === key) {
      return;
    }
    lastTransitionKey.current = key;
    handleTileEvent(tileDef, tileDef.event);
  }, [handleTileEvent, mapGrid, playerTile, tileDefinitionMap]);

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

    const tileId = mapGrid[targetRow][targetCol];
    const tileDef = tileDefinitionMap.get(tileId);
    if (!tileDef?.event) {
      return;
    }

    if (tileDef.event.type === "levelTransition") {
      // Players trigger level transitions by stepping onto the tile, not interacting.
      return;
    }

    handleTileEvent(tileDef, tileDef.event);
  }, [cols, dir, handleTileEvent, mapGrid, playerTile, rows, tileDefinitionMap]);

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
          row >= mapGrid.length ||
          col < 0 ||
          col >= mapGrid[0].length
        ) {
          continue;
        }

        const tileType = mapGrid[row][col];
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
    mapGrid,
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
  );
}
