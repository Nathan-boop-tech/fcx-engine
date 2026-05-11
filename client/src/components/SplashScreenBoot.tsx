/**
 * FCX Engine Lite Splash Screen
 * Boot animation with grid particles and logo fade-in
 */

import { useEffect, useState } from 'react';

interface SplashScreenBootProps {
  onComplete: () => void;
}

export default function SplashScreenBoot({ onComplete }: SplashScreenBootProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeline = [
      { delay: 500, stage: 1 }, // Fade in black
      { delay: 1000, stage: 2 }, // Grid appears
      { delay: 1500, stage: 3 }, // Logo fades in
      { delay: 2500, stage: 4 }, // Subtext appears
      { delay: 3500, stage: 5 }, // Pulse glow
      { delay: 4500, stage: 6 }, // Zoom transition
    ];

    const timers = timeline.map((item) =>
      setTimeout(() => setStage(item.stage), item.delay)
    );

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Grid Pattern */}
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>

        {/* Particle Effects */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div
          className={`transition-all duration-1000 ${
            stage >= 3
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75'
          }`}
        >
          <h1 className="text-6xl font-mono font-bold text-primary mb-4 hud-readout">
            FCX ENGINE LITE
          </h1>

          {/* Pulse Glow Effect */}
          {stage >= 5 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
          )}
        </div>

        {/* Subtext */}
        <div
          className={`transition-all duration-1000 ${
            stage >= 4
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm font-mono text-muted-foreground">
            Powered by Acrylic Studios & Synthra Labs
          </p>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary transition-all duration-4000 ${
              stage >= 6 ? 'w-full' : 'w-0'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
        <p className="text-xs font-mono text-muted-foreground text-center mt-3">
          Initializing engine...
        </p>
      </div>
    </div>
  );
}
