/**
 * FCX Engine Pro - Game Editor Workspace
 * Full development environment with 3D viewport, inspector, and play mode
 */

import { useState } from 'react';
import { FCXProject } from '@/lib/project-manager';
import { Play, Save, Settings, X } from 'lucide-react';
import GameEditorViewport from './GameEditorViewport';

interface GameEditorWorkspaceProps {
  project: FCXProject;
  onClose?: () => void;
  onPlayGame?: (gameType: string) => void;
}

export default function GameEditorWorkspace({
  project,
  onClose,
  onPlayGame,
}: GameEditorWorkspaceProps) {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-card/50 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono text-primary hud-readout">{project.name}</h1>
          <p className="text-xs text-muted-foreground font-mono">FCX Engine Pro Editor</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlayGame?.('flight_sim')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-700 text-white rounded-lg font-mono text-sm transition-smooth"
          >
            <Play className="w-4 h-4" />
            Play Flight Sim
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-mono text-sm transition-smooth">
            <Save className="w-4 h-4" />
            Save
          </button>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-mono text-sm transition-smooth"
          >
            <Settings className="w-4 h-4" />
            Inspector
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-mono text-sm transition-smooth"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Project Explorer */}
        <div className="w-64 bg-card/30 backdrop-blur border border-border rounded-lg p-4 overflow-auto">
          <h3 className="font-mono text-sm text-primary hud-readout mb-4">Project Explorer</h3>

          <div className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground">
              <div className="mb-3">📁 Scenes ({project.scenes.length})</div>
              {project.scenes.map((scene) => (
                <div key={scene} className="ml-4 text-foreground hover:text-primary cursor-pointer">
                  📄 {scene}
                </div>
              ))}
            </div>

            <div className="text-xs font-mono text-muted-foreground mt-4">
              <div className="mb-3">🎨 Assets ({project.assets.length})</div>
              {project.assets.slice(0, 5).map((asset) => (
                <div key={asset.id} className="ml-4 text-foreground hover:text-primary cursor-pointer">
                  📦 {asset.name}
                </div>
              ))}
              {project.assets.length > 5 && (
                <div className="ml-4 text-muted-foreground text-xs">
                  +{project.assets.length - 5} more...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - 3D Viewport */}
        <div className="flex-1 flex flex-col">
          <GameEditorViewport
            width={window.innerWidth - 400}
            height={window.innerHeight - 150}
            onObjectSelected={setSelectedObject}
          />
        </div>

        {/* Right Panel - Inspector */}
        {showInspector && (
          <div className="w-80 bg-card/30 backdrop-blur border border-border rounded-lg p-4 overflow-auto">
            <h3 className="font-mono text-sm text-primary hud-readout mb-4">Inspector</h3>

            {selectedObject ? (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-muted-foreground">Object ID</label>
                  <div className="text-foreground mt-1">{selectedObject}</div>
                </div>

                <div>
                  <label className="text-muted-foreground">Position</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="X"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground">Rotation</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="X"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground">Scale</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="X"
                      defaultValue="1"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      defaultValue="1"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Z"
                      defaultValue="1"
                      className="px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground">Physics</label>
                  <div className="mt-2 space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-3 h-3" />
                      <span>Use Gravity</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-3 h-3" />
                      <span>Cast Shadow</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-xs">
                Select an object in the viewport to inspect
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-card/50 backdrop-blur border-t border-border px-6 py-2 font-mono text-xs text-muted-foreground flex justify-between">
        <div>FCX Engine Pro • {project.name}</div>
        <div>3 Objects • 60 FPS • Ready</div>
      </div>
    </div>
  );
}
