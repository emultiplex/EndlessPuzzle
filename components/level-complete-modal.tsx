"use client";

import { Button } from "@/components/ui/button";
import { Trophy, Star } from "lucide-react";

interface LevelCompleteModalProps {
  level: number;
  score: number;
  timeBonus: number;
  onNextLevel: () => void;
}

export default function LevelCompleteModal({
  level,
  score,
  timeBonus,
  onNextLevel,
}: LevelCompleteModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center max-w-md w-full mx-4">
        {/* Animated trophy */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse" />
            <Trophy
              size={80}
              className="text-yellow-400 relative z-10 animate-bounce"
            />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-2">Level {level}</h1>
        <p className="text-2xl text-cyan-400 font-bold mb-8">Complete!</p>

        {/* Score breakdown */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Base Score:</span>
            <span className="text-xl font-bold text-white">100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Time Bonus:</span>
            <span className="text-xl font-bold text-cyan-400">
              +{timeBonus}
            </span>
          </div>
          <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-white">
              Total Score:
            </span>
            <span className="text-3xl font-bold text-yellow-400">{score}</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-8">
          <Star size={32} className="text-yellow-400 fill-yellow-400" />
          <Star size={32} className="text-yellow-400 fill-yellow-400" />
          <Star size={32} className="text-yellow-400 fill-yellow-400" />
        </div>

        {/* Button */}
        <Button
          onClick={onNextLevel}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 text-lg"
        >
          {level < 5 ? "Next Level" : "Back to Menu"}
        </Button>
      </div>
    </div>
  );
}
