/**
 * FCX Engine Pro - Asset Management System
 * Handles models, textures, audio, and prefabs
 */

import * as THREE from 'three';

export interface Asset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'audio' | 'prefab' | 'script';
  data: any;
  metadata?: Record<string, any>;
}

export interface Prefab {
  id: string;
  name: string;
  meshId?: string;
  materialId?: string;
  components: Record<string, any>;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

export class AssetManager {
  private assets: Map<string, Asset> = new Map();
  private prefabs: Map<string, Prefab> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private modelCache: Map<string, THREE.Group> = new Map();

  /**
   * Register asset
   */
  registerAsset(asset: Asset): void {
    this.assets.set(asset.id, asset);
  }

  /**
   * Get asset
   */
  getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Create texture asset
   */
  createTextureAsset(id: string, name: string, url: string): Asset {
    const asset: Asset = {
      id,
      name,
      type: 'texture',
      data: { url },
    };
    this.registerAsset(asset);
    return asset;
  }

  /**
   * Create model asset
   */
  createModelAsset(id: string, name: string, geometry: THREE.BufferGeometry): Asset {
    const asset: Asset = {
      id,
      name,
      type: 'model',
      data: { geometry },
    };
    this.registerAsset(asset);
    return asset;
  }

  /**
   * Create prefab
   */
  createPrefab(id: string, name: string, config: Partial<Prefab> = {}): Prefab {
    const prefab: Prefab = {
      id,
      name,
      components: {},
      position: config.position || { x: 0, y: 0, z: 0 },
      rotation: config.rotation || { x: 0, y: 0, z: 0 },
      scale: config.scale || { x: 1, y: 1, z: 1 },
      ...config,
    };
    this.prefabs.set(id, prefab);
    return prefab;
  }

  /**
   * Get prefab
   */
  getPrefab(id: string): Prefab | undefined {
    return this.prefabs.get(id);
  }

  /**
   * Instantiate prefab
   */
  instantiatePrefab(prefabId: string): THREE.Group | null {
    const prefab = this.prefabs.get(prefabId);
    if (!prefab) return null;

    const group = new THREE.Group();

    if (prefab.position) {
      group.position.set(prefab.position.x, prefab.position.y, prefab.position.z);
    }

    if (prefab.rotation) {
      group.rotation.set(prefab.rotation.x, prefab.rotation.y, prefab.rotation.z);
    }

    if (prefab.scale) {
      group.scale.set(prefab.scale.x, prefab.scale.y, prefab.scale.z);
    }

    return group;
  }

  /**
   * Load texture
   */
  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }

    const textureLoader = new THREE.TextureLoader();
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(url, resolve, undefined, reject);
    });

    this.textureCache.set(url, texture);
    return texture;
  }

  /**
   * Create procedural geometry
   */
  createBoxGeometry(width: number, height: number, depth: number): THREE.BoxGeometry {
    return new THREE.BoxGeometry(width, height, depth);
  }

  createSphereGeometry(radius: number, segments: number = 32): THREE.SphereGeometry {
    return new THREE.SphereGeometry(radius, segments, segments);
  }

  createPlaneGeometry(width: number, height: number): THREE.PlaneGeometry {
    return new THREE.PlaneGeometry(width, height);
  }

  createCylinderGeometry(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    segments: number = 32
  ): THREE.CylinderGeometry {
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
  }

  /**
   * Serialize asset
   */
  serializeAsset(id: string): string {
    const asset = this.assets.get(id);
    if (!asset) return '';

    return JSON.stringify({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      metadata: asset.metadata,
    });
  }

  /**
   * Serialize prefab
   */
  serializePrefab(id: string): string {
    const prefab = this.prefabs.get(id);
    if (!prefab) return '';

    return JSON.stringify(prefab);
  }

  /**
   * Get all assets
   */
  getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get all prefabs
   */
  getAllPrefabs(): Prefab[] {
    return Array.from(this.prefabs.values());
  }

  /**
   * Dispose asset manager
   */
  dispose(): void {
    this.assets.clear();
    this.prefabs.clear();
    this.textureCache.forEach((texture) => texture.dispose());
    this.textureCache.clear();
    this.modelCache.clear();
  }
}
