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
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Level Info */}
        <div className="text-center md:text-left shrink-0">
          <h1 className="text-xl font-bold text-white">Level {level}</h1>
          <p className="text-[10px] text-slate-400">Endless Puzzle Challenge</p>
        </div>

        {/* Center: Timer */}
        <div
          className={`text-center px-3 py-1 rounded-md border transition-all shrink-0 ${
            isLowTime
              ? "border-red-500 bg-red-500/20 animate-pulse"
              : "border-cyan-500/50 bg-slate-800"
          }`}
        >
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Time Remaining
          </p>
          <p
            className={`text-2xl font-bold font-mono ${
              isLowTime ? "text-red-400" : "text-cyan-400"
            }`}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        {/* Right: Score + High Score + Pause */}
        <div className="flex items-center gap-12 shrink-0">
          {/* Score & High Score */}
          <div className="flex items-center gap-12">
            <div>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider ">
                Score
              </p>
              <p className="text-lg font-bold text-cyan-400 ">{score}</p>
            </div>

            <div className="text-[10px] text-slate-300 uppercase tracking-wider">
              High Scored:
              <span className="text-lg font-bold text-yellow-300 ">
                {highScore}
              </span>
            </div>
          </div>

          {/* Pause Button */}
          <Button
            onClick={onPause}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold h-7 px-3 text-xs"
          >
            <PauseIcon className="w-3 h-3 mr-1" />
            Pause
          </Button>
        </div>
      </div>
    </header>
  );
}
