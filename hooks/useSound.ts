"use client";

import { useEffect, useRef } from "react";

export function useSound(src: string, volume: number = 0.8) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;

    audioRef.current = audio;

    return () => {
      audioRef.current = null;
    };
  }, [src, volume]);

  const play = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current.play().catch(() => {
      /* autoplay blocked silently */
    });
  };

  return play;
}
