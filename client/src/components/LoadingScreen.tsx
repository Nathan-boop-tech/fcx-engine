/**
 * Loading Screen Component
 * Professional Aviation Cockpit Minimalism: Progress bar with sequential loading steps
 * 
 * Features:
 * - Smooth progress bar animation (0-100%)
 * - Sequential loading steps with fade-in/out
 * - Professional HUD-style readout
 */

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

const LOADING_STEPS = [
  'Physics Core',
  'Flight Systems',
  'UI Modules',
  'Airport Database',
  'Simulation Layer',
];

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Update loading step
      const stepIndex = Math.floor((newProgress / 100) * LOADING_STEPS.length);
      setCurrentStep(Math.min(stepIndex, LOADING_STEPS.length - 1));

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663637495086/F57xwTHhFZm2x9WSTiGqLZ/fcx-dashboard-background-E67hbeP9F3SpUe7C3cqzeH.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-96 max-w-full px-8">
        {/* Loading Title */}
        <h2 className="text-2xl font-mono text-primary text-center mb-8 hud-readout">
          Initializing FCX Engine Lite...
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden glow-border">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground font-mono mt-2">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 mb-8">
          {LOADING_STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex items-center transition-all duration-300 ${
                index <= currentStep ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
              <span className="text-sm font-mono text-foreground">{step}</span>
            </div>
          ))}
        </div>

        {/* Branding */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Powered by Synthra Labs × Acrylic Studios
          </p>
        </div>
      </div>
    </div>
  );
}
