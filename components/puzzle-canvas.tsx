"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { type JigsawPiece, generatePuzzlePieces } from "@/lib/puzzle-generator";

interface PuzzleCanvasProps {
  level: number;
  gridSize: number;
  image: string;
  isPaused: boolean;
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

export default function PuzzleCanvas({
  level,
  gridSize,
  image,
  isPaused,
  onComplete,
}: PuzzleCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<JigsawPiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<JigsawPiece | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [placedPieces, setPlacedPieces] = useState<Set<number>>(new Set());
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  // Load and initialize puzzle
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      setImageLoaded(true);
      initializePuzzle(img);
    };
  }, [image, gridSize]);

  const initializePuzzle = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const canvasSize = Math.min(containerWidth - 32, 600);

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Scale image to fit canvas
    const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const offsetX = (canvasSize - scaledWidth) / 2;
    const offsetY = (canvasSize - scaledHeight) / 2;

    // Generate puzzle pieces
    const newPieces = generatePuzzlePieces(gridSize, {
      image: img,
      canvasWidth: canvasSize,
      canvasHeight: canvasSize,
      imageScale: scale,
      imageOffsetX: offsetX,
      imageOffsetY: offsetY,
    });

    setPieces(newPieces);
    setPlacedPieces(new Set());

    // Draw initial puzzle state
    drawPuzzle(canvasSize, newPieces, img, scale, offsetX, offsetY);
  };

  const drawPuzzle = (
    canvasSize: number,
    piecesToDraw: JigsawPiece[],
    img: HTMLImageElement,
    scale: number,
    offsetX: number,
    offsetY: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid lines
    ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
    ctx.lineWidth = 1;
    const pieceWidth = canvasSize / Math.sqrt(piecesToDraw.length);
    for (let i = 0; i <= Math.sqrt(piecesToDraw.length); i++) {
      ctx.beginPath();
      ctx.moveTo(i * pieceWidth, 0);
      ctx.lineTo(i * pieceWidth, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * pieceWidth);
      ctx.lineTo(canvasSize, i * pieceWidth);
      ctx.stroke();
    }

    // Draw placed pieces
    piecesToDraw.forEach((piece) => {
      if (placedPieces.has(piece.id)) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(
          img,
          piece.sourceX,
          piece.sourceY,
          piece.width,
          piece.height,
          piece.x,
          piece.y,
          piece.width,
          piece.height
        );
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
        ctx.restore();
      }
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find piece at click position (prioritize unplaced pieces)
    const clicked = pieces.find(
      (p) =>
        !placedPieces.has(p.id) &&
        x >= p.x &&
        x <= p.x + p.width &&
        y >= p.y &&
        y <= p.y + p.height
    );

    if (clicked) {
      setDraggedPiece(clicked);
      dragOffsetRef.current = { x: x - clicked.x, y: y - clicked.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedPiece || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update piece position
    const updatedPieces = pieces.map((p) =>
      p.id === draggedPiece.id
        ? {
            ...p,
            x: x - dragOffsetRef.current.x,
            y: y - dragOffsetRef.current.y,
          }
        : p
    );

    setPieces(updatedPieces);
    setDraggedPiece(
      updatedPieces.find((p) => p.id === draggedPiece.id) || null
    );
  };

  const handleMouseUp = () => {
    if (!draggedPiece) return;

    // Check if piece is close to its target position
    const tolerance = 20;
    if (
      Math.abs(draggedPiece.x - draggedPiece.targetX) < tolerance &&
      Math.abs(draggedPiece.y - draggedPiece.targetY) < tolerance
    ) {
      // Snap piece to target
      const snappedPieces = pieces.map((p) =>
        p.id === draggedPiece.id ? { ...p, x: p.targetX, y: p.targetY } : p
      );
      setPieces(snappedPieces);

      // Mark piece as placed
      const newPlacedPieces = new Set(placedPieces);
      newPlacedPieces.add(draggedPiece.id);
      setPlacedPieces(newPlacedPieces);

      // Check if puzzle is complete
      if (newPlacedPieces.size === pieces.length) {
        onComplete();
      }
    }

    setDraggedPiece(null);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden shadow-xl border border-slate-700">
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto cursor-grab active:cursor-grabbing"
        />
      </div>
      <div className="text-center text-slate-400">
        <p>
          Pieces placed:{" "}
          <span className="text-cyan-400 font-bold">{placedPieces.size}</span> /{" "}
          <span className="text-cyan-400 font-bold">{pieces.length}</span>
        </p>
      </div>
    </div>
  );
}
