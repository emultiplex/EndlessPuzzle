"use client";

import { useState, useEffect, useRef } from "react";
import PuzzlePiece from "@/components/puzzle-piece";
import { useSound } from "@/hooks/useSound";

interface PuzzleBoardProps {
  level: number;
  gridSize: number;
  image: string;
  isPaused: boolean;
  onComplete: () => void;
}

interface Piece {
  id: number;
  row: number;
  col: number;
  currentX: number;
  currentY: number;
  placed: boolean;
}

interface PointerState {
  pieceId: number | null;
  offsetX: number;
  offsetY: number;
}

export default function PuzzleBoard({
  gridSize,
  image,
  isPaused,
  onComplete,
}: PuzzleBoardProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [pieceSize, setPieceSize] = useState(0);
  const [pointerState, setPointerState] = useState<PointerState>({
    pieceId: null,
    offsetX: 0,
    offsetY: 0,
  });

  const boardRef = useRef<HTMLDivElement>(null);
  const SNAP_THRESHOLD = 20;

  // 🔊 Sounds
  const playSnap = useSound("/sounds/snap.mp3");
  const playComplete = useSound("/sounds/complete.mp3");

  // 🔹 Init puzzle
  useEffect(() => {
    if (!boardRef.current) return;

    const boardWidth = Math.min(360, window.innerWidth - 32);
    const size = boardWidth / gridSize;
    setPieceSize(size);

    const newPieces: Piece[] = [];
    let id = 0;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newPieces.push({
          id: id++,
          row,
          col,
          currentX: Math.random() * (boardWidth - size),
          currentY: Math.random() * (boardWidth - size),
          placed: false,
        });
      }
    }

    setPieces(newPieces);
  }, [gridSize]);

  // 🔹 Completion check
  useEffect(() => {
    if (pieces.length && pieces.every((p) => p.placed)) {
      playComplete();
      onComplete();
    }
  }, [pieces]);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    pieceId: number
  ) => {
    if (isPaused || pieces[pieceId]?.placed) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setPointerState({
      pieceId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (pointerState.pieceId === null || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    setPieces((prev) =>
      prev.map((p) =>
        p.id === pointerState.pieceId
          ? {
              ...p,
              currentX: e.clientX - boardRect.left - pointerState.offsetX,
              currentY: e.clientY - boardRect.top - pointerState.offsetY,
            }
          : p
      )
    );
  };

  const handlePointerUp = () => {
    if (pointerState.pieceId === null) return;

    const piece = pieces[pointerState.pieceId];
    const targetX = piece.col * pieceSize;
    const targetY = piece.row * pieceSize;

    if (
      Math.abs(piece.currentX - targetX) < SNAP_THRESHOLD &&
      Math.abs(piece.currentY - targetY) < SNAP_THRESHOLD
    ) {
      playSnap();

      setPieces((prev) =>
        prev.map((p) =>
          p.id === piece.id
            ? { ...p, currentX: targetX, currentY: targetY, placed: true }
            : p
        )
      );
    }

    setPointerState({ pieceId: null, offsetX: 0, offsetY: 0 });
  };

  useEffect(() => {
    if (pointerState.pieceId !== null) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [pointerState]);

  return (
    <div
      ref={boardRef}
      className="relative bg-gray-900 rounded-lg shadow-xl mx-auto touch-none"
      style={{
        width: pieceSize * gridSize,
        height: pieceSize * gridSize,
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div key={i} className="border border-gray-700 opacity-20" />
        ))}
      </div>

      {/* Pieces */}
      {pieces.map((piece) => (
        <PuzzlePiece
          key={piece.id}
          piece={piece}
          image={image}
          gridSize={gridSize}
          pieceSize={pieceSize}
          isPaused={isPaused}
          isPlaced={piece.placed}
          onPointerDown={(e) => handlePointerDown(e, piece.id)}
        />
      ))}
    </div>
  );
}
