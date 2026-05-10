/**
 * World Editor Component
 * Basic placement of runway and terrain objects
 * FCX Engine Lite v2.0
 */

import { useEffect, useRef, useState } from 'react';
import { CoreEngine } from '@/lib/core-engine';
import { X, Plus, Trash2 } from 'lucide-react';

interface WorldEditorProps {
  onClose: () => void;
}

interface PlacedObject {
  id: string;
  type: 'runway' | 'terrain';
  x: number;
  z: number;
}

export default function WorldEditor({ onClose }: WorldEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreEngine | null>(null);
  const [objects, setObjects] = useState<PlacedObject[]>([
    { id: '1', type: 'runway', x: 0, z: 500 },
  ]);
  const [selectedTool, setSelectedTool] = useState<'runway' | 'terrain' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new CoreEngine(canvas, {
      renderingWidth: canvas.clientWidth,
      renderingHeight: canvas.clientHeight,
    });

    engineRef.current = engine;
    engine.start();

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.dispose();
    };
  }, [onClose]);

  const addObject = () => {
    if (!selectedTool) return;

    const newObject: PlacedObject = {
      id: Date.now().toString(),
      type: selectedTool,
      x: Math.random() * 500 - 250,
      z: Math.random() * 500 - 250,
    };

    setObjects([...objects, newObject]);
  };

  const removeObject = (id: string) => {
    setObjects(objects.filter((obj) => obj.id !== id));
  };

  const clearAll = () => {
    setObjects([]);
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

      {/* Editor Panel */}
      <div className="w-80 bg-card border-l border-border overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-mono text-primary hud-readout">World Editor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools */}
        <div className="p-4 border-b border-border">
          <h3 className="font-mono text-sm text-muted-foreground mb-3">Placement Tools</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTool(selectedTool === 'runway' ? null : 'runway')}
              className={`w-full px-4 py-2 rounded font-mono text-sm transition-smooth ${
                selectedTool === 'runway'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              ✈️ Runway
            </button>
            <button
              onClick={() => setSelectedTool(selectedTool === 'terrain' ? null : 'terrain')}
              className={`w-full px-4 py-2 rounded font-mono text-sm transition-smooth ${
                selectedTool === 'terrain'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              🌍 Terrain Block
            </button>
          </div>
        </div>

        {/* Add Object */}
        <div className="p-4 border-b border-border">
          <button
            onClick={addObject}
            disabled={!selectedTool}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth font-mono text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Object
          </button>
        </div>

        {/* Object List */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-sm text-muted-foreground">Objects ({objects.length})</h3>
            <button
              onClick={clearAll}
              className="p-1 hover:bg-secondary rounded transition-smooth"
              title="Clear all objects"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center justify-between p-2 bg-secondary rounded text-sm font-mono"
              >
                <div>
                  <div className="text-foreground">
                    {obj.type === 'runway' ? '✈️' : '🌍'} {obj.type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({obj.x.toFixed(0)}, {obj.z.toFixed(0)})
                  </div>
                </div>
                <button
                  onClick={() => removeObject(obj.id)}
                  className="p-1 hover:bg-destructive/20 rounded transition-smooth"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-border">
          <h3 className="font-mono text-sm text-primary mb-2 hud-readout">Instructions</h3>
          <div className="space-y-1 font-mono text-xs text-muted-foreground">
            <p>1. Select a tool (Runway or Terrain)</p>
            <p>2. Click "Add Object" to place</p>
            <p>3. Objects appear in random positions</p>
            <p>4. Remove objects individually or clear all</p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-border">
          <h3 className="font-mono text-sm text-primary mb-2 hud-readout">Controls</h3>
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
