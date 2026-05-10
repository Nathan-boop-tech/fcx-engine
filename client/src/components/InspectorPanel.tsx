/**
 * Inspector Panel
 * Object properties and physics settings
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProjectAsset } from '@/lib/project-manager';

interface InspectorPanelProps {
  selectedAsset: ProjectAsset | null;
}

interface ObjectProperties {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  physics: {
    enabled: boolean;
    mass: number;
    friction: number;
    restitution: number;
  };
  material: {
    color: string;
    roughness: number;
    metalness: number;
  };
}

export default function InspectorPanel({ selectedAsset }: InspectorPanelProps) {
  const [properties, setProperties] = useState<ObjectProperties>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    physics: {
      enabled: true,
      mass: 1,
      friction: 0.5,
      restitution: 0.3,
    },
    material: {
      color: '#00d9ff',
      roughness: 0.4,
      metalness: 0.6,
    },
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Transform', 'Physics', 'Material'])
  );

  const toggleSection = (name: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedSections(newExpanded);
  };

  const updateProperty = (path: string, value: any) => {
    const keys = path.split('.');
    const newProps = JSON.parse(JSON.stringify(properties));
    let current = newProps;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setProperties(newProps);
  };

  const renderSection = (title: string, fields: Array<{ label: string; path: string; type: string }>) => {
    const isExpanded = expandedSections.has(title);

    return (
      <div key={title} className="border-b border-border">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-secondary transition-smooth"
        >
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
          <span className="font-mono text-sm text-foreground">{title}</span>
        </button>

        {isExpanded && (
          <div className="px-4 py-3 space-y-3 bg-secondary/30">
            {fields.map(({ label, path, type }) => {
              const keys = path.split('.');
              let value: any = properties;
              for (const key of keys) {
                value = value[key];
              }

              return (
                <div key={path}>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">
                    {label}
                  </label>
                  {type === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updateProperty(path, parseFloat(e.target.value))}
                      className="w-full px-2 py-1 bg-card border border-border rounded font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  ) : type === 'color' ? (
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateProperty(path, e.target.value)}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  ) : type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateProperty(path, e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border sticky top-0 bg-card">
        <h3 className="font-mono text-sm text-primary hud-readout">
          {selectedAsset ? selectedAsset.name : 'Inspector'}
        </h3>
        {selectedAsset && (
          <p className="text-xs text-muted-foreground font-mono mt-1">{selectedAsset.type}</p>
        )}
      </div>

      {/* Properties */}
      {selectedAsset ? (
        <div className="flex-1">
          {renderSection('Transform', [
            { label: 'Position X', path: 'position.x', type: 'number' },
            { label: 'Position Y', path: 'position.y', type: 'number' },
            { label: 'Position Z', path: 'position.z', type: 'number' },
            { label: 'Rotation X', path: 'rotation.x', type: 'number' },
            { label: 'Rotation Y', path: 'rotation.y', type: 'number' },
            { label: 'Rotation Z', path: 'rotation.z', type: 'number' },
            { label: 'Scale X', path: 'scale.x', type: 'number' },
            { label: 'Scale Y', path: 'scale.y', type: 'number' },
            { label: 'Scale Z', path: 'scale.z', type: 'number' },
          ])}

          {renderSection('Physics', [
            { label: 'Enabled', path: 'physics.enabled', type: 'checkbox' },
            { label: 'Mass', path: 'physics.mass', type: 'number' },
            { label: 'Friction', path: 'physics.friction', type: 'number' },
            { label: 'Restitution', path: 'physics.restitution', type: 'number' },
          ])}

          {renderSection('Material', [
            { label: 'Color', path: 'material.color', type: 'color' },
            { label: 'Roughness', path: 'material.roughness', type: 'number' },
            { label: 'Metalness', path: 'material.metalness', type: 'number' },
          ])}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <p className="text-sm text-muted-foreground font-mono">
            Select an asset to view properties
          </p>
        </div>
      )}
    </div>
  );
}
