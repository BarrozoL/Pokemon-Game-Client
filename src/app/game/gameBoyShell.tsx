"use client";
import React from "react";
import GameCanvas from "./gameCanvas"; // <-- your existing game code

export default function GameBoyShell() {
  return (
    <div
      style={{
        // Center it in the viewport
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#333", // or any background color
        height: "100vh", // fill the screen
        width: "100vw",
      }}
    >
      {/*
        SVG sized to some approximate Game Boy shape (400x600 just as an example). 
        You can tweak these dimensions.
      */}
      <svg
        width="400"
        height="600"
        viewBox="0 0 400 600"
        style={{
          background: "#ccc",
          borderRadius: 20,
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Outer body */}
        <rect x="0" y="0" width="400" height="600" rx="20" fill="#d5d2cf" />

        {/* Screen cutout: We'll place foreignObject here */}
        <rect
          x="60"
          y="40"
          width="280"
          height="230"
          fill="#000"
          stroke="#444"
          strokeWidth="3"
          rx="5"
        />

        {/* Speaker lines (simple) */}
        <rect x="300" y="90" width="2" height="50" fill="#222" />
        <rect x="310" y="90" width="2" height="50" fill="#222" />
        <rect x="320" y="90" width="2" height="50" fill="#222" />

        {/* D-pad (placeholder) */}
        <rect x="70" y="300" width="20" height="50" fill="#555" rx="3" />
        <rect x="60" y="315" width="40" height="20" fill="#555" rx="3" />

        {/* A / B Buttons (placeholder circles) */}
        <circle cx="300" cy="370" r="15" fill="#a00" />
        <circle cx="260" cy="350" r="15" fill="#a00" />

        {/* foreignObject => actual <canvas> will appear here */}
        <foreignObject x="60" y="40" width="280" height="230">
          {/*
            We'll embed our <GameCanvas> inside a <div>.
            Your <GameCanvas> is 800x600 by default, 
            but let's let it 'shrink to fit' or we can scale it.
          */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // We might want to set 'overflow: hidden' if it doesn't scale.
              overflow: "hidden",
            }}
          >
            {/* 
              Now we embed your existing GameCanvas. 
              Let's just let it scale down by using CSS maxWidth, maxHeight:
            */}
            <div
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                transformOrigin: "top left",
                // If we want to scale your 800x600 down to 280x210 or so:
                transform: "scale(0.35)", // approximate scale
              }}
            >
              <GameCanvas />
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
