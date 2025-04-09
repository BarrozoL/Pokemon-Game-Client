"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// 1) Define an interface for your Player data
interface Player {
  id: number;
  username: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function PlayersPage() {
  // 2) State for storing fetched players
  const [players, setPlayers] = useState<Player[]>([]);

  // 3) State for new player input
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  // 4) Fetch players on mount
  useEffect(() => {
    fetchPlayers();
  }, []);

  // GET request to fetch all players (using Axios)
  const fetchPlayers = async () => {
    try {
      const response = await axios.get<Player[]>(
        "http://localhost:5005/player"
      );
      setPlayers(response.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  };

  // POST request to create a new player (using Axios)
  const createPlayer = async () => {
    try {
      const response = await axios.post<Player>(
        "http://localhost:5005/player",
        {
          username,
        }
      );
      const newPlayer = response.data;
      setStatus(
        `New player created: ${newPlayer.username} (ID: ${newPlayer.id})`
      );
      setUsername("");
      // Re-fetch players to update the list
      fetchPlayers();
    } catch (error) {
      console.error("Failed to create player:", error);
      setStatus("Error creating player");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player List</h1>

      {/* Displaying the fetched players */}
      {players.length > 0 ? (
        <ul className="list-disc list-inside space-y-1">
          {players.map((player) => (
            <li key={player.id}>
              {player.username}{" "}
              <span className="text-sm">(Level {player.level})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No players found.</p>
      )}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Create a New Player</h2>
      <div className="flex items-center mb-4 space-x-2">
        <input
          className="border border-gray-300 rounded px-2 py-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a username"
        />
        <button
          onClick={createPlayer}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Create Player
        </button>
      </div>

      {status && <p className="text-green-600">{status}</p>}
    </main>
  );
}
