/**
 * Flight Simulator Canvas Component
 * Professional Aviation Cockpit Minimalism: Real-time 2D flight simulation with HUD
 * 
 * Features:
 * - 2D aircraft sprite rendering
 * - Real-time physics simulation (60 FPS target)
 * - HUD display with flight telemetry
 * - Runway and airport visualization
 * - Debug overlay (F1 toggle)
 */

import { useEffect, useRef, useState } from 'react';
import { FlightPhysicsEngine, AircraftState } from '@/lib/physics';
import { InputHandler } from '@/lib/input';

interface FlightSimulatorProps {
  onClose: () => void;
}

const RUNWAY_X = 400;
const RUNWAY_Y = 600;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function FlightSimulator({ onClose }: FlightSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [flightData, setFlightData] = useState<AircraftState>({
    x: 100,
    y: 100,
    altitude: 5000,
    speed: 100,
    throttle: 0.3,
    pitch: 0,
    heading: 45,
    verticalVelocity: 0,
  });

  const physicsRef = useRef<FlightPhysicsEngine | null>(null);
  const inputRef = useRef<InputHandler | null>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const stateRef = useRef<AircraftState>(flightData);
  const debugTogglePressedRef = useRef(false);

  useEffect(() => {
    physicsRef.current = new FlightPhysicsEngine();
    inputRef.current = new InputHandler();
    return () => {
      if (inputRef.current) {
        inputRef.current.destroy();
        inputRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    stateRef.current = flightData;

    const animate = () => {
      if (!inputRef.current) return;
      const input = inputRef.current.getState();

      // Update throttle
      if (input.throttleUp) stateRef.current.throttle = Math.min(1, stateRef.current.throttle + 0.02);
      if (input.throttleDown) stateRef.current.throttle = Math.max(0, stateRef.current.throttle - 0.02);

      // Update pitch
      if (input.pitchUp) stateRef.current.pitch = Math.min(0.5, stateRef.current.pitch + 0.02);
      if (input.pitchDown) stateRef.current.pitch = Math.max(-0.5, stateRef.current.pitch - 0.02);

      // Update heading
      if (input.headingLeft) stateRef.current.heading = (stateRef.current.heading - 2 + 360) % 360;
      if (input.headingRight) stateRef.current.heading = (stateRef.current.heading + 2) % 360;

      // Check debug toggle
      if (inputRef.current && input.debugToggle && !debugTogglePressedRef.current) {
        setShowDebug((prev) => !prev);
        debugTogglePressedRef.current = true;
      } else if (!input.debugToggle) {
        debugTogglePressedRef.current = false;
      }

      // Update physics
      if (physicsRef.current) {
        stateRef.current = physicsRef.current.update(stateRef.current, 0.016);
      }

      // Wrap around world
      if (stateRef.current.x > CANVAS_WIDTH) stateRef.current.x = 0;
      if (stateRef.current.x < 0) stateRef.current.x = CANVAS_WIDTH;
      if (stateRef.current.y > CANVAS_HEIGHT) stateRef.current.y = 0;
      if (stateRef.current.y < 0) stateRef.current.y = CANVAS_HEIGHT;

      // Update display
      setFlightData({ ...stateRef.current });

      // Render
      renderScene(ctx, stateRef.current, showDebug);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [showDebug]);

  const renderScene = (
    ctx: CanvasRenderingContext2D,
    state: AircraftState,
    debug: boolean
  ) => {
    // Clear canvas
    ctx.fillStyle = '#0F1419';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw runway
    ctx.fillStyle = 'rgba(232, 232, 232, 0.3)';
    ctx.fillRect(RUNWAY_X - 40, RUNWAY_Y - 200, 80, 400);
    ctx.strokeStyle = '#E8E8E8';
    ctx.lineWidth = 2;
    ctx.strokeRect(RUNWAY_X - 40, RUNWAY_Y - 200, 80, 400);

    // Draw runway markings
    ctx.strokeStyle = '#E8E8E8';
    ctx.lineWidth = 1;
    for (let i = 0; i < 400; i += 40) {
      ctx.beginPath();
      ctx.moveTo(RUNWAY_X - 20, RUNWAY_Y - 200 + i);
      ctx.lineTo(RUNWAY_X + 20, RUNWAY_Y - 200 + i);
      ctx.stroke();
    }

    // Draw aircraft
    const radians = (state.heading * Math.PI) / 180;
    ctx.save();
    ctx.translate(state.x, state.y);
    ctx.rotate(radians);

    // Aircraft body
    ctx.fillStyle = '#00D9FF';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(15, 20);
    ctx.lineTo(0, 15);
    ctx.lineTo(-15, 20);
    ctx.closePath();
    ctx.fill();

    // Aircraft glow
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Draw HUD overlay
    drawHUD(ctx, state, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw debug info if enabled
    if (debug) {
      drawDebugOverlay(ctx, state);
    }
  };

  const drawHUD = (
    ctx: CanvasRenderingContext2D,
    state: AircraftState,
    width: number,
    height: number
  ) => {
    ctx.font = '14px "IBM Plex Mono"';
    ctx.fillStyle = '#00D9FF';
    ctx.textBaseline = 'top';

    // Top-left telemetry
    const telemetry = [
      `SPD: ${Math.round(state.speed)} kt`,
      `ALT: ${Math.round(state.altitude)} ft`,
      `THR: ${Math.round(state.throttle * 100)}%`,
      `PIT: ${(state.pitch * 100).toFixed(1)}°`,
    ];

    telemetry.forEach((line, i) => {
      ctx.fillText(line, 20, 20 + i * 20);
    });

    // Top-right heading
    ctx.textAlign = 'right';
    ctx.fillText(`HDG: ${Math.round(state.heading)}°`, width - 20, 20);

    // Bottom-left distance to runway
    const distance = physicsRef.current?.distanceToRunway(state.x, state.y, RUNWAY_X, RUNWAY_Y) || 0;
    ctx.textAlign = 'left';
    ctx.fillText(`RWY: ${Math.round(distance)} m`, 20, height - 40);

    // Bottom-right flight state
    const flightState = physicsRef.current?.getFlightState(
      state.altitude,
      state.verticalVelocity,
      state.speed
    ) || 'cruising';
    ctx.textAlign = 'right';
    ctx.fillText(`STATE: ${flightState.toUpperCase()}`, width - 20, height - 40);

    // Center crosshair
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    ctx.lineWidth = 1;
    const cx = width / 2;
    const cy = height / 2;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();
  };

  const drawDebugOverlay = (ctx: CanvasRenderingContext2D, state: AircraftState) => {
    ctx.font = '12px "IBM Plex Mono"';
    ctx.fillStyle = '#FFB800';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const debugInfo = [
      `FPS: 60`,
      `X: ${Math.round(state.x)}`,
      `Y: ${Math.round(state.y)}`,
      `VV: ${state.verticalVelocity.toFixed(2)} ft/s`,
      `[F1] Toggle Debug`,
    ];

    debugInfo.forEach((line, i) => {
      ctx.fillText(line, 20, CANVAS_HEIGHT - 120 + i * 16);
    });
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono text-primary hud-readout">
            ✈️ Flight Control X Project
          </h1>
          <p className="text-sm text-muted-foreground font-mono">v0.1 Prototype</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-80 transition-smooth font-mono text-sm"
        >
          Exit Simulation
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-background border-2 border-primary glow-border"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>

      {/* Controls help */}
      <div className="bg-card border-t border-border px-6 py-3 text-xs font-mono text-muted-foreground">
        <p>
          Controls: <span className="text-primary">W/S</span> Throttle |{' '}
          <span className="text-primary">↑/↓</span> Pitch |{' '}
          <span className="text-primary">←/→</span> Heading |{' '}
          <span className="text-primary">F1</span> Debug
        </p>
      </div>

      {/* Bottom branding */}
      <div className="bg-background border-t border-border px-6 py-2 text-center text-xs text-muted-foreground font-mono">
        Powered by Synthra Labs × Acrylic Studios
      </div>
    </div>
  );
}
