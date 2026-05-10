/**
 * FCX Engine Editor Workspace
 * Main editor UI with all panels
 */

import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { FCXProject, ProjectAsset } from '@/lib/project-manager';
import ProjectExplorer from './ProjectExplorer';
import SceneViewport from './SceneViewport';
import InspectorPanel from './InspectorPanel';
import ScriptEditor from './ScriptEditor';
import AnimationTimeline from './AnimationTimeline';

interface EngineEditorProps {
  project: FCXProject;
  onClose: () => void;
}

export default function EngineEditor({ project, onClose }: EngineEditorProps) {
  const [selectedAsset, setSelectedAsset] = useState<ProjectAsset | null>(null);
  const [showAnimationPanel, setShowAnimationPanel] = useState(false);
  const [isPlayTesting, setIsPlayTesting] = useState(false);

  const handleAssetAdded = (type: ProjectAsset['type']) => {
    console.log(`Add ${type}`);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono text-primary hud-readout">
            {project.name}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">FCX Engine Editor</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Play Test Button */}
          <button
            onClick={() => setIsPlayTesting(!isPlayTesting)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-smooth ${
              isPlayTesting
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            <Play className="w-4 h-4" />
            {isPlayTesting ? 'Stop Test' : 'Play Test'}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded transition-smooth"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Project Explorer */}
        <ProjectExplorer
          project={project}
          onAssetSelected={setSelectedAsset}
          onAssetAdded={handleAssetAdded}
        />

        {/* Center - 3D Viewport */}
        <div className="flex-1 flex flex-col">
          <SceneViewport onObjectSelected={(id) => console.log('Selected:', id)} />

          {/* Animation Timeline (Optional) */}
          {showAnimationPanel && (
            <AnimationTimeline onClipCreated={(clip) => console.log('Clip created:', clip)} />
          )}
        </div>

        {/* Right Panel - Inspector */}
        <InspectorPanel selectedAsset={selectedAsset} />
      </div>

      {/* Bottom Panel - Script Editor */}
      <div className="h-64 border-t border-border flex">
        <ScriptEditor onScriptSaved={(code) => console.log('Script saved:', code)} />
      </div>

      {/* Status Bar */}
      <div className="bg-card/50 border-t border-border px-6 py-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <div className="flex gap-4">
          <span>Project: {project.name}</span>
          <span>Assets: {project.assets.length}</span>
          <span>Scenes: {project.scenes.length}</span>
        </div>
        <div>
          {isPlayTesting ? (
            <span className="text-amber-400">▶ PLAY TEST MODE</span>
          ) : (
            <span>Ready</span>
          )}
        </div>
      </div>
    </div>
  );
}
