"use client";

import { useState, useEffect } from "react";
import LevelSelect from "@/components/level-select";
import GameBoard from "@/components/game-board";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);

  // 🔹 NEW: username state
  const [username, setUsername] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);

  // 🔹 NEW: instruction popup
  const [showInstructions, setShowInstructions] = useState(false);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("EndlessHighScore");
    if (saved) setHighScore(Number.parseInt(saved, 10));
  }, []);

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
  };

  const handleBackToMenu = () => {
    setCurrentLevel(null);
  };

  // 🔹 STEP 1: USERNAME SCREEN
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            🧩 Endless Puzzle Game
          </h1>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full p-3 rounded bg-gray-800 text-white outline-none mb-4"
          />

          <button
            disabled={!username.trim()}
            onClick={() => setHasStarted(true)}
            className="w-full bg-blue-600 disabled:opacity-50 text-white py-3 rounded"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // 🔹 STEP 3: GAME SCREEN
  if (currentLevel !== null) {
    return (
      <GameBoard
        level={currentLevel}
        username={username} // ✅ pass username to game
        onBack={handleBackToMenu}
        highScore={highScore}
        onScoreUpdate={(score) => {
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("EndlessHighScore", score.toString());
          }
        }}
      />
    );
  }

  // 🔹 STEP 2: LEVEL SELECT + HOW TO PLAY
  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-white font-semibold">Player, {username} 👋</h2>

        <button
          onClick={() => setShowInstructions(true)}
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded"
        >
          How to Play
        </button>
      </div>

      <LevelSelect onSelectLevel={handleLevelSelect} highScore={highScore} />

      {/* 🔹 INSTRUCTION POPUP */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md text-white">
            <h2 className="text-xl font-bold mb-3">How to Play</h2>

            <ul className="space-y-2 text-sm">
              <li>
                🧩 Drag puzzle pieces to the squar board and click to snap
              </li>
              <li>🎯 Pieces snap when placed correctly</li>
              <li>⏱️ Finish faster to score higher</li>
              <li>⏸️ You can pause anytime</li>
            </ul>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 w-full bg-blue-600 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
