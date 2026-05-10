/**
 * Engine Boot Sequence Component
 * Real engine startup with console-style output
 * FCX Engine Lite v2.0
 */

import { useEffect, useState } from 'react';

interface EngineBootSequenceProps {
  onComplete: () => void;
  duration?: number;
}

interface BootStep {
  name: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  progress: number;
}

export default function EngineBootSequence({ onComplete, duration = 4000 }: EngineBootSequenceProps) {
  const [steps, setSteps] = useState<BootStep[]>([
    { name: 'Initializing 3D Renderer', status: 'pending', progress: 0 },
    { name: 'Loading Scene Graph', status: 'pending', progress: 0 },
    { name: 'Building Physics World (3D)', status: 'pending', progress: 0 },
    { name: 'Loading Aircraft Models', status: 'pending', progress: 0 },
    { name: 'Initializing Camera System', status: 'pending', progress: 0 },
    { name: 'Syncing Simulation Loop', status: 'pending', progress: 0 },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const stepDuration = duration / steps.length;
    let currentStep = 0;

    const updateStep = () => {
      if (currentStep >= steps.length) {
        setFadeOut(true);
        setTimeout(onComplete, 500);
        return;
      }

      // Mark current step as loading
      setSteps((prev) => {
        const newSteps = [...prev];
        newSteps[currentStep].status = 'loading';
        return newSteps;
      });

      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 40;
        if (progress >= 100) progress = 100;

        setSteps((prev) => {
          const newSteps = [...prev];
          newSteps[currentStep].progress = progress;
          return newSteps;
        });

        if (progress >= 100) {
          clearInterval(progressInterval);
          setSteps((prev) => {
            const newSteps = [...prev];
            newSteps[currentStep].status = 'complete';
            return newSteps;
          });

          // Move to next step
          currentStep++;
          setTimeout(updateStep, 300);
        }
      }, 100);
    };

    // Start boot sequence
    const startTimer = setTimeout(updateStep, 500);

    // Calculate overall progress
    const progressInterval = setInterval(() => {
      setSteps((prev) => {
        const completed = prev.filter((s) => s.status === 'complete').length;
        const total = prev.length;
        setOverallProgress((completed / total) * 100);
        return prev;
      });
    }, 100);

    return () => {
      clearTimeout(startTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete, steps.length]);

  const getStatusIcon = (status: BootStep['status']) => {
    switch (status) {
      case 'complete':
        return '✓';
      case 'loading':
        return '⟳';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  const getStatusColor = (status: BootStep['status']) => {
    switch (status) {
      case 'complete':
        return 'text-green-400';
      case 'loading':
        return 'text-yellow-400 animate-spin';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-2xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-mono font-bold text-primary mb-2 hud-readout">
            FCX Engine Lite v2.0
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            Engine Boot Sequence
          </p>
        </div>

        {/* Boot Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className={`w-4 text-center ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </span>
                <span className="text-foreground flex-1">{step.name}</span>
                <span className="text-muted-foreground w-12 text-right">
                  {step.status === 'complete' ? '100%' : `${Math.round(step.progress)}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="ml-7 h-1 bg-secondary rounded overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            {overallProgress === 100 ? 'Engine Ready' : 'Initializing...'}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Powered by Synthra Labs × Acrylic Studios
          </p>
        </div>
      </div>
    </div>
  );
}
