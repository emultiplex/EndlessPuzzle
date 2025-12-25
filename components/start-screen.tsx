"use client";

import { useState } from "react";

export default function StartScreen({
  onStart,
}: {
  onStart: (username: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          🧩 Endless Puzzle
        </h1>

        <input
          className="w-full p-3 rounded bg-gray-800 text-white outline-none mb-4"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={!name.trim()}
          onClick={() => onStart(name.trim())}
          className="w-full bg-blue-600 disabled:opacity-50 text-white py-3 rounded"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
