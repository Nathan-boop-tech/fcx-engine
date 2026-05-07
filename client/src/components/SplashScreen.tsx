/**
 * Splash Screen Component
 * Professional Aviation Cockpit Minimalism: Animated logo with radar sweep effect
 * 
 * Features:
 * - Fade-in logo (400ms)
 * - Rotating radar sweep animation (2s loop)
 * - Fade-out transition (500ms)
 * - Branding: "Powered by Synthra Labs × Acrylic Studios"
 */

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 4000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663637495086/F57xwTHhFZm2x9WSTiGqLZ/fcx-splash-background-NAS7Xek4UoxS98k3kKLXsr.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Radar Sweep */}
      <div className="relative w-48 h-48 mb-8">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radar circles */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />

          {/* Rotating sweep line */}
          <g
            style={{
              animation: 'spin 3s linear infinite',
              transformOrigin: '100px 100px',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="#00D9FF"
              strokeWidth="2"
              opacity="0.8"
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="#00D9FF"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="5,5"
            />
          </g>

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="#00D9FF" />
        </svg>
      </div>

      {/* Logo Text */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold font-mono text-primary mb-2 animate-fade-in">
          Flight Control X
        </h1>
        <p className="text-lg text-muted-foreground font-mono">FCX Engine Lite</p>
      </div>

      {/* Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-sm text-muted-foreground font-mono">
          Powered by Synthra Labs × Acrylic Studios
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
