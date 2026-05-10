/**
 * 3D Flight Simulator Component
 * FCX Engine Lite v2.0 - Real-time 3D flight simulation
 */

import { useEffect, useRef, useState } from 'react';
import { CoreEngine } from '@/lib/core-engine';
import { X } from 'lucide-react';

interface FlightSimulator3DProps {
  onClose: () => void;
}

export default function FlightSimulator3D({ onClose }: FlightSimulator3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreEngine | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    altitude: 0,
    throttle: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    fps: 0,
    flightState: 'cruising',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize engine
    const engine = new CoreEngine(canvas, {
      renderingWidth: canvas.clientWidth,
      renderingHeight: canvas.clientHeight,
    });

    engineRef.current = engine;
    engine.start();

    // Telemetry update loop
    const telemetryInterval = setInterval(() => {
      const state = engine.getAircraftState();
      setTelemetry({
        speed: state.speed,
        altitude: state.altitude,
        throttle: state.throttle * 100,
        pitch: (state.pitch * 180) / Math.PI,
        yaw: (state.yaw * 180) / Math.PI,
        roll: (state.roll * 180) / Math.PI,
        fps: engine.getFPS(),
        flightState: engine.getFlightState(),
      });
    }, 100);

    // Handle debug toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
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

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left telemetry */}
        <div className="absolute top-4 left-4 font-mono text-sm text-cyan-400">
          <div>SPD: {Math.round(telemetry.speed)} kt</div>
          <div>ALT: {Math.round(telemetry.altitude)} ft</div>
          <div>THR: {Math.round(telemetry.throttle)}%</div>
          <div>PIT: {telemetry.pitch.toFixed(1)}°</div>
          <div>YAW: {telemetry.yaw.toFixed(1)}°</div>
          <div>ROL: {telemetry.roll.toFixed(1)}°</div>
        </div>

        {/* Top-right info */}
        <div className="absolute top-4 right-4 font-mono text-sm text-cyan-400 text-right">
          <div>FPS: {telemetry.fps}</div>
          <div>STATE: {telemetry.flightState.toUpperCase()}</div>
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-cyan-400/30" />
          <div className="w-1 h-1 bg-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Bottom-left controls */}
        <div className="absolute bottom-4 left-4 font-mono text-xs text-muted-foreground">
          <div>W/S: Throttle</div>
          <div>↑/↓: Pitch</div>
          <div>←/→: Yaw</div>
          <div>F1: Debug</div>
          <div>ESC: Exit</div>
        </div>

        {/* Debug overlay */}
        {showDebug && (
          <div className="absolute bottom-4 right-4 font-mono text-xs text-amber-400 bg-black/70 p-3 rounded border border-amber-400/30">
            <div>Position: ({telemetry.altitude.toFixed(0)}, {telemetry.altitude.toFixed(0)}, 0)</div>
            <div>Velocity: {telemetry.speed.toFixed(2)} m/s</div>
            <div>Rotation: P:{telemetry.pitch.toFixed(1)}° Y:{telemetry.yaw.toFixed(1)}° R:{telemetry.roll.toFixed(1)}°</div>
            <div>Debug Mode: ACTIVE</div>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 hover:bg-secondary rounded transition-smooth pointer-events-auto"
        title="Exit Simulator (ESC)"
      >
        <X className="w-6 h-6 text-primary" />
      </button>
    </div>
  );
}
