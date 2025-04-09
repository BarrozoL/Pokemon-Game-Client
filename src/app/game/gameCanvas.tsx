"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  mapData,
  tileColors,
  tileImagePaths,
  TILE_SIZE,
  MAP_ROWS,
  MAP_COLS,
  PLAYER_IMAGE_PATH,
} from "./mapData";

// type for loaded images
type LoadedTileImages = Record<number, HTMLImageElement>;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<LoadedTileImages | null>(
    null
  );
  const [playerImage, setPlayerImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [playerTile, setPlayerTile] = useState<{ row: number; col: number }>({
    row: 1,
    col: 1,
  });

  // defined in mapData
  const tileSize = TILE_SIZE;
  const rows = MAP_ROWS;
  const cols = MAP_COLS;

  // Effect for loading images
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const imagesToLoad: { [key: number]: HTMLImageElement } = {};
    const promises: Promise<void>[] = [];

    Object.entries(tileImagePaths).forEach(([key, src]) => {
      const tileType = Number(key);
      const img = new Image(); // Creating Image objects *here* (client-side)
      imagesToLoad[tileType] = img;
      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = (err) => {
          console.error(`Failed to load image: ${src}`, err);
          resolve(); // Resolve even on error to allow fallback color, or reject to indicate a loading failure.
        };
        img.src = src;
      });
      promises.push(promise);
    });

    //Loading player image
    const playerImg = new Image();
    const playerPromise = new Promise<void>((resolve) => {
      playerImg.onload = () => resolve();
      playerImg.onerror = (err) => {
        console.error(`Failed to load player image: ${PLAYER_IMAGE_PATH}`, err);
        resolve(); // Resolve even on error
      };
      playerImg.src = PLAYER_IMAGE_PATH;
    });
    promises.push(playerPromise);

    // Resolve all promises together
    Promise.all(promises)
      .then(() => {
        if (isMounted) {
          setLoadedImages(imagesToLoad); // Set state when all loaded/failed
          //Checking if player image is loaded
          if (playerImg.complete && playerImg.naturalHeight !== 0) {
            setPlayerImage(playerImg);
          } else {
            console.error(
              "Player image failed to load properly, player will not be rendered as image."
            );
            setPlayerImage(null);
          }
        }
      })
      .catch((error) => {
        console.error("Error loading tile images:", error);
        if (isMounted) {
          // maybe set an error state?
          setLoadedImages({}); // Set to empty object or handle error state
          setPlayerImage(null);
        }
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

        // Collision check: 1 or 3 or 4 => blocked tiles (Adjust based on your mapData meaning)
        const tile = mapData[newRow][newCol];
        // Make sure tile type 1, 3, 4 are indeed obstacles
        if (tile === 1 || tile === 3 || tile === 4) {
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
        const drawX = Math.floor(col * tileSize - cameraX); // Use Math.floor for crisp pixels
        const drawY = Math.floor(row * tileSize - cameraY); // Use Math.floor for crisp pixels

        // Get the loaded image for this tile type
        const tileImg = loadedImages[tileType];

        // Draw image if loaded and complete, otherwise draw fallback color
        if (tileImg && tileImg.complete && tileImg.naturalHeight !== 0) {
          // Check if image actually loaded
          ctx.drawImage(tileImg, drawX, drawY, tileSize, tileSize);
        } else {
          ctx.fillStyle = tileColors[tileType] || "#000"; // Fallback color
          ctx.fillRect(drawX, drawY, tileSize, tileSize);
        }
      }
    }

    // Draw Player
    const playerScreenX = Math.floor(playerTile.col * tileSize - cameraX);
    const playerScreenY = Math.floor(playerTile.row * tileSize - cameraY);
    if (
      playerImage &&
      playerImage.complete &&
      playerImage.naturalHeight !== 0
    ) {
      ctx.drawImage(
        playerImage, // The loaded player image
        playerScreenX, // Position X on canvas
        playerScreenY, // Position Y on canvas
        tileSize + 10, // Draw width (same as tile)
        tileSize + 10 // Draw height (same as tile)
      );
    } else {
      // Fallback
      console.warn("Player image not available, drawing fallback rectangle.");
      ctx.fillStyle = "blue"; // Fallback color
      ctx.fillRect(playerScreenX, playerScreenY, tileSize, tileSize);
    }
  }, [loadedImages, playerImage, canvasSize, playerTile, tileSize, rows, cols]);

  // Keyboard Input Effect
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          attemptMove(-1, 0);
          break;
        case "ArrowDown":
        case "s":
          attemptMove(1, 0);
          break;
        case "ArrowLeft":
        case "a":
          attemptMove(0, -1);
          break;
        case "ArrowRight":
        case "d":
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
