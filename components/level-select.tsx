"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
  highScore: number;
}

const LEVELS = [
  { id: 1, name: "Level 1", grid: "3×3", image: "/images/level-1.png" },
  { id: 2, name: "Level 2", grid: "4×4", image: "/images/level-2.png" },
  { id: 3, name: "Level 3", grid: "5×5", image: "/images/level-3.png" },
  { id: 4, name: "Level 4", grid: "6×6", image: "/images/level-4.jpg" },
  { id: 5, name: "Level 5", grid: "7×7", image: "/images/level-5.jpg" },
];

export default function LevelSelect({
  onSelectLevel,
  highScore,
}: LevelSelectProps) {
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);

  useEffect(() => {
    const saved = localStorage.getItem("endlessPuzzleUnlockedLevels");
    if (saved) {
      setUnlockedLevels(JSON.parse(saved));
    } else {
      setUnlockedLevels([1]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Endless Puzzle Game
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            High Score: {highScore}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {LEVELS.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            return (
              <div
                key={level.id}
                className={`rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 ${
                  isUnlocked
                    ? "hover:scale-105 cursor-pointer bg-white"
                    : "opacity-50 bg-gray-800"
                }`}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
                  {isUnlocked ? (
                    <img
                      src={level.image || "/placeholder.svg"}
                      alt={level.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-white text-lg font-semibold">
                        Locked
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-1 text-gray-800">
                    {level.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Grid: {level.grid}
                  </p>
                  <Button
                    onClick={() => onSelectLevel(level.id)}
                    disabled={!isUnlocked}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnlocked ? "Play" : "Locked"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
