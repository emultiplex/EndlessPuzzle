"use client";

import { useState, useEffect, useRef } from "react";
import GameHeader from "@/components/game-header";
import PuzzleBoard from "@/components/puzzle-board";
import ReferenceImage from "@/components/reference-image";
import PauseOverlay from "@/components/pause-overlay";
import LevelCompleteModal from "@/components/level-complete-modal";

interface GameBoardProps {
  level: number;
  onBack: () => void;
  highScore: number;
  onScoreUpdate: (score: number) => void;
}

const LEVEL_CONFIG = {
  1: { grid: 3, time: 500, image: "/images/level-1.png" },
  2: { grid: 4, time: 1500, image: "/images/level-2.png" },
  3: { grid: 5, time: 2000, image: "/images/level-3.png" },
  4: { grid: 6, time: 3000, image: "/images/level-4.jpg" },
  5: { grid: 7, time: 4000, image: "/images/level-5.jpg" },
};

export default function GameBoard({
  level,
  onBack,
  highScore,
  onScoreUpdate,
}: GameBoardProps) {
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];

  const [timeLeft, setTimeLeft] = useState(config.time);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused || isComplete) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isComplete]);

  // 🔻 Penalty handler
  const handleCheckReference = () => {
    setScore((prev) => Math.max(prev - 5, 0)); // no negative score
    setShowReference(true);
  };

  const handleLevelComplete = () => {
    setIsComplete(true);
    const finalScore = score + 100 + timeLeft * 10;
    setScore(finalScore);
    onScoreUpdate(finalScore);

    const unlockedLevels = JSON.parse(
      localStorage.getItem("endlessPuzzleUnlockedLevels") || "[1]"
    );

    if (!unlockedLevels.includes(level + 1) && level < 5) {
      unlockedLevels.push(level + 1);
      localStorage.setItem(
        "endlessPuzzleUnlockedLevels",
        JSON.stringify(unlockedLevels)
      );
    }
  };

  if (isComplete) {
    return (
      <LevelCompleteModal
        level={level}
        score={score}
        timeBonus={timeLeft * 10}
        onNextLevel={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <GameHeader
        level={level}
        timeLeft={timeLeft}
        score={score}
        highScore={highScore}
        onPause={() => setIsPaused(true)}
      />

      <main className="flex flex-col gap-4 p-4 md:p-8 max-w-5xl mx-auto">
        {/* 🔍 Check Reference Button */}
        <button
          onClick={handleCheckReference}
          className="self-end bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded text-sm font-semibold"
        >
          Check Reference (-5)
        </button>

        <PuzzleBoard
          level={level}
          gridSize={config.grid}
          image={config.image}
          isPaused={isPaused}
          onComplete={handleLevelComplete}
        />
      </main>

      {/* 🖼 Reference Image Modal */}
      {showReference && (
        <ReferenceImage
          image={config.image}
          onClose={() => setShowReference(false)}
        />
      )}

      {isPaused && (
        <PauseOverlay
          onResume={() => setIsPaused(false)}
          onRestart={() => window.location.reload()}
          onQuit={onBack}
        />
      )}
    </div>
  );
}
