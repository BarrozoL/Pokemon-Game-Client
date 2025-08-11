"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  mapData,
  tileColors,
  tileDefinitions,
  TILE_SIZE,
  MAP_ROWS,
  MAP_COLS,
  PLAYER_IMAGE_PATH,
} from "./mapData";

// type for loaded images
type LoadedTileImages = Record<number, HTMLImageElement>;

type Direction = "down" | "up" | "left" | "right";

const PLAYER_IMAGE_PATHS: Record<Direction, string> = {
  down: "/characters/player-front.png",
  up: "/characters/player-back.png",
  left: "/characters/player-left.png",
  right: "/characters/player-right.png",
};

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<LoadedTileImages | null>(
    null
  );

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [playerTile, setPlayerTile] = useState<{ row: number; col: number }>({
    row: 1,
    col: 1,
  });
  const [dir, setDir] = useState<Direction>("down");
  const [playerImages, setPlayerImages] = useState<
    Partial<Record<Direction, HTMLImageElement>>
  >({});

  // defined in mapData
  const tileSize = TILE_SIZE;
  const rows = MAP_ROWS;
  const cols = MAP_COLS;

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
          resolve(); // Resolve even on error to allow fallback color, or reject to indicate a loading failure.
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
      // Consider basing size on viewport or container if needed
      setCanvasSize({
        width: 800, // Or window.innerWidth
        height: 600, // Or window.innerHeight
      });
    }
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  //Create a Set of walkable tiles once on mount
  const WALKABLE = new Set(
    tileDefinitions.filter((t) => t.walkable).map((t) => t.id)
  );

  // Memoize attemptMove to prevent redefining it on every render
  const attemptMove = useCallback(
    (deltaRow: number, deltaCol: number) => {
      setPlayerTile((pos) => {
        const newRow = pos.row + deltaRow;
        const newCol = pos.col + deltaCol;

        // Bounds check
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
          return pos; // out of map
        }

        // Collision check
        const tileId = mapData[newRow][newCol];
        if (!WALKABLE.has(tileId)) {
          return pos; // blocked
        }

        // Otherwise, move
        return { row: newRow, col: newCol };
      });
    },
    [rows, cols]
  ); // Include dependencies if they were used inside (rows, cols are used)

  // Drawing Effect
  useEffect(() => {
    // Checking if everything is loaded and canvas is ready
    if (
      !loadedImages ||
      !canvasRef.current ||
      !canvasSize.width ||
      !canvasSize.height
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Important check

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const mapWidth = cols * tileSize;
    const mapHeight = rows * tileSize;

    // Center the camera on the player tile
    let cameraX =
      playerTile.col * tileSize - canvasSize.width / 2 + tileSize / 2;
    let cameraY =
      playerTile.row * tileSize - canvasSize.height / 2 + tileSize / 2;

    // clamp so camera never goes beyond the map
    cameraX = Math.max(0, Math.min(cameraX, mapWidth - canvasSize.width));
    cameraY = Math.max(0, Math.min(cameraY, mapHeight - canvasSize.height));

    // which tile index is at top-left of the camera
    const startCol = Math.floor(cameraX / tileSize);
    const startRow = Math.floor(cameraY / tileSize);

    // how many tiles fit on-screen (+2 for buffer when scrolling)
    const visibleCols = Math.ceil(canvas.width / tileSize) + 2;
    const visibleRows = Math.ceil(canvas.height / tileSize) + 2;

    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;

    // Draw map tiles
    for (let row = startRow; row < startRow + visibleRows; row++) {
      for (let col = startCol; col < startCol + visibleCols; col++) {
        // Check if the tile is within the map boundaries
        if (
          row < 0 ||
          row >= mapData.length ||
          col < 0 ||
          col >= mapData[0].length
        ) {
          continue; // Skip drawing if outside map bounds
        }

        const tileType = mapData[row][col];

        // Look up the tile definition to get the scale (default is 1 if not specified)
        const tileDef = tileDefinitions.find((t) => t.id === tileType);
        const scale = tileDef?.scale ?? 1;
        const drawSize = tileSize * scale;
        // Center the scaled tile within the grid cell
        const offset = (drawSize - tileSize) / 2;
        const drawX = Math.floor(col * tileSize - cameraX) - offset;
        const drawY = Math.floor(row * tileSize - cameraY) - offset;

        // Get the loaded image for this tile type
        const tileImg = loadedImages[tileType];

        // Draw the tile image with scaling or fallback to a filled rectangle
        if (tileImg && tileImg.complete && tileImg.naturalHeight !== 0) {
          ctx.drawImage(tileImg, drawX, drawY, drawSize, drawSize);
        } else {
          ctx.fillStyle = tileColors[tileType] || "#000";
          ctx.fillRect(drawX, drawY, drawSize, drawSize);
        }
      }
    }

    // Draw Player
    const img = playerImages[dir];
    const playerScreenX = Math.floor(playerTile.col * tileSize - cameraX);
    const playerScreenY = Math.floor(playerTile.row * tileSize - cameraY);
    const playerWidth = tileSize;
    const playerHeight = tileSize;

    if (img && img.complete && img.naturalHeight !== 0) {
      ctx.drawImage(
        img,
        playerScreenX,
        playerScreenY,
        playerWidth,
        playerHeight
      );
    } else {
      // Fallback
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
  ]);

  // Keyboard Input Effect
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          setDir("up");
          attemptMove(-1, 0);
          break;
        case "ArrowDown":
        case "s":
          setDir("down");
          attemptMove(1, 0);
          break;
        case "ArrowLeft":
        case "a":
          setDir("left");
          attemptMove(0, -1);
          break;
        case "ArrowRight":
        case "d":
          setDir("right");
          attemptMove(0, 1);
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    // Cleanup: Remove listener when component unmounts
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attemptMove]); // Add attemptMove as a dependency because it's defined outside

  // Render the Canvas
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
