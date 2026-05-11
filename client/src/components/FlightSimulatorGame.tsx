/**
 * FCX Engine Pro - Flight Simulator Game Player
 * Fully playable flight simulation
 */

import { useEffect, useRef, useState } from 'react';
import { FlightSimulator } from '@/lib/games/flight-simulator';
import { GameEngine } from '@/lib/engine/game-engine';
import { ArrowUp, ArrowDown, Volume2, X } from 'lucide-react';

interface FlightSimulatorGameProps {
  onClose?: () => void;
}

export default function FlightSimulatorGame({ onClose }: FlightSimulatorGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<FlightSimulator | null>(null);
  const [flightData, setFlightData] = useState({
    speed: 0,
    altitude: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
    throttle: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game engine
    const engine = new GameEngine({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      targetFPS: 60,
    });

    // Create flight simulator game
    const game = new FlightSimulator({ engine });
    gameRef.current = game;

    // Start game
    game.start();

    // Update HUD with flight data
    const updateInterval = setInterval(() => {
      setFlightData(game.getFlightData());
    }, 100);

    // Handle window resize
    const handleResize = () => {
      engine.onWindowResize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('resize', handleResize);
      game.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Left - Airspeed */}
        <div className="absolute top-8 left-8 font-mono text-cyan-400 text-sm border-2 border-cyan-400 p-4 bg-black/50 backdrop-blur">
          <div className="text-xs text-muted-foreground mb-1">AIRSPEED</div>
          <div className="text-3xl font-bold">{flightData.speed}</div>
          <div className="text-xs text-muted-foreground">knots</div>
        </div>

        {/* Top Right - Altitude */}
        <div className="absolute top-8 right-8 font-mono text-cyan-400 text-sm border-2 border-cyan-400 p-4 bg-black/50 backdrop-blur">
          <div className="text-xs text-muted-foreground mb-1">ALTITUDE</div>
          <div className="text-3xl font-bold">{flightData.altitude}</div>
          <div className="text-xs text-muted-foreground">feet</div>
        </div>

        {/* Center - Artificial Horizon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-48 h-48 border-4 border-cyan-400 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
            <div
              className="w-40 h-40 border-2 border-cyan-400/50 rounded-full flex items-center justify-center"
              style={{
                transform: `rotate(${flightData.roll}deg)`,
              }}
            >
              <div className="w-full h-1/2 bg-sky-900/50" />
              <div className="w-full h-1/2 bg-amber-900/50" />
              <div className="absolute w-8 h-1 bg-cyan-400" />
            </div>
          </div>
        </div>

        {/* Bottom Left - Heading */}
        <div className="absolute bottom-8 left-8 font-mono text-cyan-400 text-sm border-2 border-cyan-400 p-4 bg-black/50 backdrop-blur">
          <div className="text-xs text-muted-foreground mb-1">HEADING</div>
          <div className="text-3xl font-bold">{flightData.heading}°</div>
        </div>

        {/* Bottom Center - Throttle */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 font-mono text-cyan-400 text-sm border-2 border-cyan-400 p-4 bg-black/50 backdrop-blur">
          <div className="text-xs text-muted-foreground mb-1">THROTTLE</div>
          <div className="w-48 h-2 bg-black border border-cyan-400 rounded">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${flightData.throttle}%` }}
            />
          </div>
          <div className="text-center mt-2">{flightData.throttle}%</div>
        </div>

        {/* Bottom Right - Pitch & Roll */}
        <div className="absolute bottom-8 right-8 font-mono text-cyan-400 text-sm border-2 border-cyan-400 p-4 bg-black/50 backdrop-blur">
          <div className="text-xs text-muted-foreground mb-1">PITCH / ROLL</div>
          <div className="text-2xl font-bold">
            {flightData.pitch}° / {flightData.roll}°
          </div>
        </div>

        {/* Control Instructions */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 font-mono text-amber-400 text-xs border-2 border-amber-400 p-3 bg-black/50 backdrop-blur">
          <div className="flex gap-4">
            <div>W/S: Throttle</div>
            <div>↑↓: Pitch</div>
            <div>←→: Heading</div>
            <div>A/D: Roll</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-white transition-smooth pointer-events-auto"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Flight Status */}
      <div className="fixed bottom-4 left-4 font-mono text-xs text-green-400 pointer-events-auto">
        <div>FCX Flight Simulator • 60 FPS</div>
        <div>Position: ({Math.round(flightData.speed * 0.1)}, {flightData.altitude})</div>
      </div>
    </div>
  );
}
