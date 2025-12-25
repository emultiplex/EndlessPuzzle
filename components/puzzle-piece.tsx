import type React from "react";

interface Piece {
  id: number;
  row: number;
  col: number;
  currentX: number;
  currentY: number;
  placed: boolean;
}

interface PuzzlePieceProps {
  piece: Piece;
  image: string;
  gridSize: number;
  pieceSize: number;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  isPaused: boolean;
  isPlaced: boolean;
}

export default function PuzzlePiece({
  piece,
  image,
  gridSize,
  pieceSize,
  onPointerDown,
  isPaused,
  isPlaced,
}: PuzzlePieceProps) {
  // 🔹 Image slicing math
  const backgroundPosX = -piece.col * pieceSize;
  const backgroundPosY = -piece.row * pieceSize;
  const backgroundSize = gridSize * pieceSize;

  return (
    <div
      className={`absolute select-none transition-opacity duration-150 ${
        isPlaced ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"
      } ${isPaused && !isPlaced ? "opacity-50" : ""}`}
      style={{
        width: pieceSize,
        height: pieceSize,

        // 🔹 Position
        left: isPlaced ? piece.col * pieceSize : piece.currentX,
        top: isPlaced ? piece.row * pieceSize : piece.currentY,

        // 🔹 Image slice
        backgroundImage: `url(${image})`,
        backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
        backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
        backgroundRepeat: "no-repeat",

        // 🔹 Interaction polish
        touchAction: "none",
        willChange: "left, top",

        // 🔹 Visuals
        borderRadius: "6px",
        border: isPlaced
          ? "1px solid rgba(255,255,255,0.15)"
          : "2px solid rgba(255,255,255,0.35)",
        boxShadow: isPlaced ? "none" : "0 6px 16px rgba(0,0,0,0.6)",

        // 🔹 Layering
        zIndex: isPlaced ? 10 : 100,

        pointerEvents: isPaused && !isPlaced ? "none" : "auto",
      }}
      onPointerDown={onPointerDown}
    />
  );
}
