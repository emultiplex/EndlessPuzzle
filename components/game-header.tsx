"use client";

import { Button } from "@/components/ui/button";
import { PauseIcon } from "lucide-react";

interface GameHeaderProps {
  level: number;
  timeLeft: number;
  score: number;
  onPause: () => void;
  highScore: number;
}

export default function GameHeader({
  level,
  timeLeft,
  score,
  onPause,
  highScore,
}: GameHeaderProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 30;

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Level Info */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white">Level {level}</h1>
          <p className="text-sm text-slate-400">Endless Puzzle Challenge</p>
        </div>

        {/* Center: Timer */}
        <div
          className={`text-center px-6 py-2 rounded-lg border-2 transition-all ${
            isLowTime
              ? "border-red-500 bg-red-500/20 animate-pulse"
              : "border-cyan-500/50 bg-slate-800"
          }`}
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            Time Remaining
          </p>
          <p
            className={`text-4xl font-bold font-mono ${
              isLowTime ? "text-red-400" : "text-cyan-400"
            }`}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        {/* Right: Score and Controls */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Score
            </p>
            <p className="text-2xl font-bold text-cyan-400">{score}</p>
          </div>
          <div className="text-xs text-slate-500">
            High:{" "}
            <span className="text-yellow-400 font-semibold">{highScore}</span>
          </div>
          <Button
            onClick={onPause}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold mt-2"
          >
            <PauseIcon className="w-4 h-4 mr-2" />
            Pause
          </Button>
        </div>
      </div>
    </header>
  );
}
