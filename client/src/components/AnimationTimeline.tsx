/**
 * Animation Timeline Component
 * Keyframe editor and animation preview
 */

import { useState } from 'react';
import { Play, Pause, Plus, Trash2 } from 'lucide-react';
import { AnimationSystem, AnimationClip } from '@/lib/animation-system';

interface AnimationTimelineProps {
  onClipCreated: (clip: AnimationClip) => void;
}

export default function AnimationTimeline({ onClipCreated }: AnimationTimelineProps) {
  const [animationSystem] = useState(() => new AnimationSystem());
  const [clips, setClips] = useState<AnimationClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<AnimationClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [newClipName, setNewClipName] = useState('');
  const [newClipDuration, setNewClipDuration] = useState(2);

  const handleCreateClip = () => {
    if (!newClipName.trim()) return;

    const clip = animationSystem.createClip(newClipName, newClipDuration);
    setClips([...clips, clip]);
    setSelectedClip(clip);
    onClipCreated(clip);

    setNewClipName('');
    setNewClipDuration(2);
  };

  const handleAddKeyframe = () => {
    if (!selectedClip) return;

    animationSystem.addKeyframe(selectedClip.id, {
      time: currentTime,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    });

    setSelectedClip({ ...selectedClip });
  };

  const handlePlayClip = () => {
    if (!selectedClip) return;
    setIsPlaying(!isPlaying);
    setCurrentTime(0);
  };

  const handleDeleteClip = (clipId: string) => {
    animationSystem.deleteClip(clipId);
    setClips(clips.filter((c) => c.id !== clipId));
    if (selectedClip?.id === clipId) {
      setSelectedClip(null);
    }
  };

  return (
    <div className="flex-1 bg-card flex flex-col border-t border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-mono text-sm text-primary hud-readout">Animation Timeline</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Clip List */}
        <div className="w-48 border-r border-border flex flex-col">
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {clips.length === 0 ? (
              <p className="text-xs text-muted-foreground font-mono p-2">No clips</p>
            ) : (
              clips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => setSelectedClip(clip)}
                  className={`w-full text-left px-3 py-2 rounded font-mono text-xs transition-smooth ${
                    selectedClip?.id === clip.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <div className="truncate">{clip.name}</div>
                  <div className="text-xs text-muted-foreground">{clip.duration.toFixed(1)}s</div>
                </button>
              ))
            )}
          </div>

          {/* Create Clip Form */}
          <div className="border-t border-border p-2 space-y-2">
            <input
              type="text"
              placeholder="Clip name"
              value={newClipName}
              onChange={(e) => setNewClipName(e.target.value)}
              className="w-full px-2 py-1 bg-secondary border border-border rounded font-mono text-xs focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Duration"
              value={newClipDuration}
              onChange={(e) => setNewClipDuration(parseFloat(e.target.value))}
              className="w-full px-2 py-1 bg-secondary border border-border rounded font-mono text-xs focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleCreateClip}
              className="w-full px-2 py-1 bg-primary text-primary-foreground rounded font-mono text-xs hover:bg-primary/90 transition-smooth"
            >
              Create
            </button>
          </div>
        </div>

        {/* Timeline Editor */}
        {selectedClip ? (
          <div className="flex-1 flex flex-col">
            {/* Clip Info */}
            <div className="px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-mono text-sm text-foreground">{selectedClip.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedClip.keyframes.length} keyframes
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteClip(selectedClip.id)}
                  className="p-1 hover:bg-destructive/20 rounded transition-smooth"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handlePlayClip}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded font-mono text-xs hover:bg-primary/90 transition-smooth"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Play
                    </>
                  )}
                </button>

                <button
                  onClick={handleAddKeyframe}
                  className="flex items-center gap-1 px-3 py-1 bg-secondary text-foreground rounded font-mono text-xs hover:bg-secondary/80 transition-smooth"
                >
                  <Plus className="w-3 h-3" />
                  Add Keyframe
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-auto p-4">
              {/* Timeline ruler */}
              <div className="mb-4 h-6 bg-secondary rounded flex items-center px-2 font-mono text-xs text-muted-foreground">
                <div className="flex-1 flex justify-between">
                  {Array.from({ length: Math.ceil(selectedClip.duration) + 1 }).map((_, i) => (
                    <span key={i}>{i}s</span>
                  ))}
                </div>
              </div>

              {/* Keyframes */}
              <div className="space-y-2">
                {selectedClip.keyframes.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-mono">
                    No keyframes. Click "Add Keyframe" to create one.
                  </p>
                ) : (
                  selectedClip.keyframes.map((kf, idx) => (
                    <div
                      key={idx}
                      className="h-8 bg-secondary rounded flex items-center px-2 font-mono text-xs"
                    >
                      <span className="text-muted-foreground">
                        {kf.time.toFixed(2)}s
                      </span>
                      <span className="ml-2 text-foreground">
                        {kf.position ? 'Position' : kf.rotation ? 'Rotation' : 'Scale'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Time Slider */}
            <div className="border-t border-border px-4 py-3 bg-secondary/30">
              <input
                type="range"
                min="0"
                max={selectedClip.duration}
                step="0.01"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {currentTime.toFixed(2)}s / {selectedClip.duration.toFixed(1)}s
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-mono">
              Create or select a clip to edit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
