"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in-up">
      <div className="max-w-md text-center space-y-8">
        <h1 className="font-['Fraunces'] font-bold text-4xl">
          Building your Ideal Customer…
        </h1>
        <p className="text-foreground/70 max-w-md">
          This takes about 5 seconds.
        </p>

        {/* Loading Animation */}
        <div className="py-8">
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-button-green animate-float"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.2s',
                  animationIterationCount: 'infinite',
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-accent-grey rounded-full overflow-hidden">
            <div 
              className="h-full bg-button-green rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-foreground/50 mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
