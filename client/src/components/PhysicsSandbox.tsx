/**
 * Physics Sandbox Component
 * Interactive 3D physics testing environment
 * FCX Engine Lite v2.0
 */

import { useEffect, useRef, useState } from 'react';
import { CoreEngine } from '@/lib/core-engine';
import { X, RotateCcw } from 'lucide-react';

interface PhysicsSandboxProps {
  onClose: () => void;
}

export default function PhysicsSandbox({ onClose }: PhysicsSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreEngine | null>(null);

  const [parameters, setParameters] = useState({
    thrust: 0.8,
    lift: 0.08,
    drag: 0.02,
    weight: 1.0,
  });

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    altitude: 0,
    fps: 0,
    forces: { lift: 0, drag: 0, gravity: 0, wind: 0 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new CoreEngine(canvas, {
      renderingWidth: canvas.clientWidth,
      renderingHeight: canvas.clientHeight,
    });

    engineRef.current = engine;
    engine.start();

    // Telemetry update
    const telemetryInterval = setInterval(() => {
      const state = engine.getAircraftState();
      const forces = engine.getForceBreakdown();

      setTelemetry({
        speed: state.speed,
        altitude: state.altitude,
        fps: engine.getFPS(),
        forces,
      });
    }, 100);

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(telemetryInterval);
      window.removeEventListener('keydown', handleKeyDown);
      engine.dispose();
    };
  }, [onClose]);

  const handleParameterChange = (param: string, value: number) => {
    const newParams = { ...parameters, [param]: value };
    setParameters(newParams);

    if (engineRef.current) {
      engineRef.current.updatePhysicsConstants({
        thrustForce: newParams.thrust,
        liftCoefficient: newParams.lift,
        dragCoefficient: newParams.drag,
        weight: newParams.weight,
      });
    }
  };

  const handleReset = () => {
    setParameters({
      thrust: 0.8,
      lift: 0.08,
      drag: 0.02,
      weight: 1.0,
    });

    if (engineRef.current) {
      engineRef.current.updatePhysicsConstants({
        thrustForce: 0.8,
        liftCoefficient: 0.08,
        dragCoefficient: 0.02,
        weight: 1.0,
      });
    }
  };

  return (
    <div className="w-full h-screen bg-black flex">
      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-card border-l border-border overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-mono text-primary hud-readout">Physics Sandbox</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parameters */}
        <div className="p-4 space-y-6">
          {/* Thrust */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Thrust Force: {parameters.thrust.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={parameters.thrust}
              onChange={(e) => handleParameterChange('thrust', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Lift */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Lift Coefficient: {parameters.lift.toFixed(3)}
            </label>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={parameters.lift}
              onChange={(e) => handleParameterChange('lift', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Drag */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Drag Coefficient: {parameters.drag.toFixed(3)}
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.01"
              value={parameters.drag}
              onChange={(e) => handleParameterChange('drag', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Weight: {parameters.weight.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={parameters.weight}
              onChange={(e) => handleParameterChange('weight', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-smooth font-mono text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>

        {/* Telemetry */}
        <div className="border-t border-border p-4">
          <h3 className="font-mono text-primary text-sm mb-3 hud-readout">Live Telemetry</h3>
          <div className="space-y-2 font-mono text-xs text-muted-foreground">
            <div>Speed: {telemetry.speed.toFixed(2)} kt</div>
            <div>Altitude: {telemetry.altitude.toFixed(0)} ft</div>
            <div>FPS: {telemetry.fps}</div>
          </div>
        </div>

        {/* Force Breakdown */}
        <div className="border-t border-border p-4">
          <h3 className="font-mono text-primary text-sm mb-3 hud-readout">Force Breakdown</h3>
          <div className="space-y-2 font-mono text-xs text-muted-foreground">
            <div>Lift: {telemetry.forces.lift.toFixed(2)} N</div>
            <div>Drag: {telemetry.forces.drag.toFixed(2)} N</div>
            <div>Gravity: {telemetry.forces.gravity.toFixed(2)} N</div>
            <div>Wind: {telemetry.forces.wind.toFixed(2)} N</div>
          </div>
        </div>

        {/* Controls Info */}
        <div className="border-t border-border p-4">
          <h3 className="font-mono text-primary text-sm mb-3 hud-readout">Controls</h3>
          <div className="space-y-1 font-mono text-xs text-muted-foreground">
            <div>W/S: Throttle</div>
            <div>↑/↓: Pitch</div>
            <div>←/→: Yaw</div>
            <div>ESC: Exit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
