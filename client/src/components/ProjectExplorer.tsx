/**
 * Project Explorer Panel
 * Asset hierarchy and file management
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Plus, Trash2 } from 'lucide-react';
import { FCXProject, ProjectAsset } from '@/lib/project-manager';

interface ProjectExplorerProps {
  project: FCXProject;
  onAssetSelected: (asset: ProjectAsset) => void;
  onAssetAdded: (type: ProjectAsset['type']) => void;
}

export default function ProjectExplorer({
  project,
  onAssetSelected,
  onAssetAdded,
}: ProjectExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['Models', 'Textures', 'Audio', 'Scripts', 'Scenes'])
  );
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const assetTypes: Array<{ name: string; type: ProjectAsset['type']; icon: string }> = [
    { name: 'Models', type: 'model', icon: '📦' },
    { name: 'Textures', type: 'texture', icon: '🖼️' },
    { name: 'Audio', type: 'audio', icon: '🔊' },
    { name: 'Scripts', type: 'script', icon: '📝' },
    { name: 'Scenes', type: 'scene', icon: '🎬' },
  ];

  const toggleFolder = (name: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedFolders(newExpanded);
  };

  const getAssetIcon = (type: ProjectAsset['type']) => {
    switch (type) {
      case 'model':
        return '📦';
      case 'texture':
        return '🖼️';
      case 'audio':
        return '🔊';
      case 'script':
        return '📝';
      case 'scene':
        return '🎬';
      default:
        return '📄';
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-mono text-sm text-primary hud-readout">Project Explorer</h3>
      </div>

      {/* Asset Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {assetTypes.map(({ name, type, icon }) => {
          const assets = project.assets.filter((a) => a.type === type);
          const isExpanded = expandedFolders.has(name);

          return (
            <div key={name}>
              {/* Folder Header */}
              <button
                onClick={() => toggleFolder(name)}
                className="w-full flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded transition-smooth text-sm font-mono text-foreground"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Folder className="w-4 h-4 text-cyan-400" />
                <span>{name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {assets.length}
                </span>
              </button>

              {/* Assets */}
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {assets.length === 0 ? (
                    <div className="px-2 py-1 text-xs text-muted-foreground font-mono">
                      No assets
                    </div>
                  ) : (
                    assets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => {
                          setSelectedAsset(asset.id);
                          onAssetSelected(asset);
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-smooth text-sm font-mono ${
                          selectedAsset === asset.id
                            ? 'bg-primary/20 text-primary'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        <File className="w-4 h-4" />
                        <span className="flex-1 truncate text-left">{asset.name}</span>
                      </button>
                    ))
                  )}

                  {/* Add Button */}
                  <button
                    onClick={() => onAssetAdded(type)}
                    className="w-full flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-secondary rounded transition-smooth font-mono"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add {name.slice(0, -1)}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground font-mono">
        <div>Total Assets: {project.assets.length}</div>
        <div>Scenes: {project.scenes.length}</div>
      </div>
    </div>
  );
}
