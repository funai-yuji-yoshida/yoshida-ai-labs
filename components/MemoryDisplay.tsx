"use client";

import { useEffect, useState } from "react";

interface MemoryDisplayProps {
  words: string[];
  displayDuration?: number; // ミリ秒
  onComplete: () => void;
}

export function MemoryDisplay({
  words,
  displayDuration = 1500,
  onComplete,
}: MemoryDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentIndex >= words.length) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    setIsVisible(true);

    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remaining = displayDuration - elapsed;

      if (remaining > 0) {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 200); // フェード間の短い間隔
        }, remaining);
      } else {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 200);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [currentIndex, words.length, displayDuration, onComplete]);

  if (currentIndex >= words.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {currentIndex + 1} / {words.length}
      </div>
      <div
        className={`text-6xl md:text-8xl font-bold text-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {words[currentIndex]}
      </div>
    </div>
  );
}
