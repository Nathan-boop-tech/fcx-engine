/**
 * Engine Debug Console Component
 * Live 3D engine data visualization
 * FCX Engine Lite v2.0
 */

import { useEffect, useRef, useState } from 'react';
import { CoreEngine } from '@/lib/core-engine';
import { X, Copy, Trash2 } from 'lucide-react';

interface EngineDebugConsoleProps {
  onClose: () => void;
}

interface LogEntry {
  timestamp: number;
  type: 'info' | 'warning' | 'error' | 'data';
  message: string;
}

export default function EngineDebugConsole({ onClose }: EngineDebugConsoleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreEngine | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new CoreEngine(canvas, {
      renderingWidth: canvas.clientWidth,
      renderingHeight: canvas.clientHeight,
    });

    engineRef.current = engine;
    engine.start();

    // Add initial log
    addLog('Engine initialized', 'info');
    addLog('3D Renderer: Active', 'info');
    addLog('Physics Engine: Running', 'info');
    addLog('Input Handler: Ready', 'info');

    // Telemetry logging
    const telemetryInterval = setInterval(() => {
      const state = engine.getAircraftState();
      const forces = engine.getForceBreakdown();

      addLog(
        `Position: (${state.position.x.toFixed(0)}, ${state.position.y.toFixed(0)}, ${state.position.z.toFixed(0)})`,
        'data'
      );
      addLog(`Velocity: ${state.velocity.length().toFixed(2)} m/s`, 'data');
      addLog(
        `Rotation: P:${((state.pitch * 180) / Math.PI).toFixed(1)}° Y:${((state.yaw * 180) / Math.PI).toFixed(1)}° R:${((state.roll * 180) / Math.PI).toFixed(1)}°`,
        'data'
      );
      addLog(
        `Forces: Lift:${forces.lift.toFixed(2)}N Drag:${forces.drag.toFixed(2)}N Gravity:${forces.gravity.toFixed(2)}N`,
        'data'
      );
      addLog(`FPS: ${engine.getFPS()} | Speed: ${state.speed.toFixed(2)} kt`, 'data');
    }, 500);

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

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [
      ...prev.slice(-99), // Keep last 100 logs
      {
        timestamp: Date.now(),
        type,
        message,
      },
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Console cleared', 'info');
  };

  const copyAllLogs = () => {
    const text = logs.map((log) => `[${log.type.toUpperCase()}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'text-cyan-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'data':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-secondary rounded transition-smooth"
        >
          <X className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Debug Console */}
      <div className="h-64 bg-card border-t border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-mono text-primary hud-readout">Engine Debug Console</h3>
          <div className="flex gap-2">
            <button
              onClick={copyAllLogs}
              className="p-1 hover:bg-secondary rounded transition-smooth"
              title="Copy all logs"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={clearLogs}
              className="p-1 hover:bg-secondary rounded transition-smooth"
              title="Clear console"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto font-mono text-xs p-3 space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground">Waiting for engine data...</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={getLogColor(log.type)}>
                <span className="text-muted-foreground">[{log.type.toUpperCase()}]</span> {log.message}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
