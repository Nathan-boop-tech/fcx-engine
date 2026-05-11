/**
 * Sample Project Data Generator
 * Creates realistic project data when new projects are created
 */

import { FCXProject, ProjectAsset } from './project-manager';

export interface SampleProjectTemplate {
  name: string;
  description: string;
  assets: ProjectAsset[];
  scenes: string[];
}

/**
 * Generate sample assets for a project
 */
export function generateSampleAssets(): ProjectAsset[] {
  const assetTypes: Array<{ type: ProjectAsset['type']; names: string[] }> = [
    {
      type: 'model',
      names: [
        'Aircraft_Boeing737',
        'Aircraft_Cessna172',
        'Runway_MainStrip',
        'Hangar_01',
        'Tower_Control',
      ],
    },
    {
      type: 'texture',
      names: [
        'Metal_Brushed',
        'Concrete_Runway',
        'Sky_Gradient',
        'Glass_Cockpit',
        'Paint_Fuselage',
      ],
    },
    {
      type: 'audio',
      names: [
        'Engine_Startup',
        'Engine_Running',
        'Landing_Gear',
        'Wind_Noise',
        'Radio_Chatter',
      ],
    },
    {
      type: 'script',
      names: [
        'FlightController.js',
        'AirTrafficControl.lua',
        'WeatherSystem.js',
        'PlayerInput.simplic',
      ],
    },
    {
      type: 'scene',
      names: ['MainScene', 'Hangar', 'Runway', 'Cockpit'],
    },
  ];

  const assets: ProjectAsset[] = [];
  let assetId = 1;

  assetTypes.forEach(({ type, names }) => {
    names.forEach((name) => {
      assets.push({
        id: `asset_${assetId++}`,
        name,
        type,
        path: `assets/${type}/${name}`,
        data: {
          version: '1.0',
          author: 'FCX Engine',
          size: Math.floor(Math.random() * 5000) + 100,
        },
      });
    });
  });

  return assets;
}

/**
 * Generate sample scenes
 */
export function generateSampleScenes(): string[] {
  return [
    'MainScene',
    'Hangar',
    'Runway',
    'Cockpit',
    'AirTraffic',
    'WeatherTest',
  ];
}

/**
 * Create a sample project template
 */
export function createSampleProject(name: string, description: string): SampleProjectTemplate {
  return {
    name,
    description,
    assets: generateSampleAssets(),
    scenes: generateSampleScenes(),
  };
}

/**
 * Get predefined project templates
 */
export function getProjectTemplates(): SampleProjectTemplate[] {
  return [
    {
      name: 'Flight Control X',
      description: 'Professional flight simulation with realistic aerodynamics',
      assets: generateSampleAssets(),
      scenes: generateSampleScenes(),
    },
    {
      name: 'Airport Manager',
      description: 'Air traffic control and airport operations simulator',
      assets: generateSampleAssets(),
      scenes: generateSampleScenes(),
    },
    {
      name: 'Aerial Photography',
      description: 'Drone and aircraft cinematography tool',
      assets: generateSampleAssets(),
      scenes: generateSampleScenes(),
    },
  ];
}

/**
 * Generate realistic project metadata
 */
export function generateProjectMetadata() {
  return {
    version: '1.0.0',
    engine: 'FCX Lite 1.0',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    author: 'FCX Developer',
    targetPlatform: 'WebGL',
    settings: {
      targetFPS: 60,
      renderScale: 1.0,
      physics: true,
      enableAI: true,
      enableMultiplayer: false,
    },
  };
}

/**
 * Generate sample project statistics
 */
export function generateProjectStats(assets: ProjectAsset[]) {
  return {
    totalAssets: assets.length,
    models: assets.filter((a) => a.type === 'model').length,
    textures: assets.filter((a) => a.type === 'texture').length,
    audio: assets.filter((a) => a.type === 'audio').length,
    scripts: assets.filter((a) => a.type === 'script').length,
    scenes: assets.filter((a) => a.type === 'scene').length,
    totalSize: assets.reduce((sum, a) => sum + (a.data?.size || 0), 0),
  };
}
