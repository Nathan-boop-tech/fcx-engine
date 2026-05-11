/**
 * FCX Engine Pro v2.0 - AI 3D Model Generator
 * Procedural generation + text-to-model capabilities
 */

import * as THREE from 'three';

export interface ModelGenerationRequest {
  description: string;
  complexity?: 'low' | 'medium' | 'high';
  style?: 'geometric' | 'organic' | 'mechanical';
  scale?: number;
}

export interface GeneratedModel {
  id: string;
  name: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
}

export class AIModelGenerator {
  private generatedModels: Map<string, GeneratedModel> = new Map();
  private modelCounter: number = 0;

  /**
   * Generate model from text description
   */
  generateFromDescription(request: ModelGenerationRequest): GeneratedModel {
    const keywords = request.description.toLowerCase();
    const complexity = request.complexity || 'medium';
    const style = request.style || 'geometric';
    const scale = request.scale || 1;

    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    // Analyze description and generate appropriate model
    if (
      keywords.includes('sphere') ||
      keywords.includes('ball') ||
      keywords.includes('round')
    ) {
      geometry = this.generateSphere(complexity, scale);
      material = this.generateMaterial('sphere', style);
    } else if (
      keywords.includes('cube') ||
      keywords.includes('box') ||
      keywords.includes('block')
    ) {
      geometry = this.generateCube(complexity, scale);
      material = this.generateMaterial('cube', style);
    } else if (
      keywords.includes('pyramid') ||
      keywords.includes('cone') ||
      keywords.includes('peak')
    ) {
      geometry = this.generatePyramid(complexity, scale);
      material = this.generateMaterial('pyramid', style);
    } else if (
      keywords.includes('torus') ||
      keywords.includes('donut') ||
      keywords.includes('ring')
    ) {
      geometry = this.generateTorus(complexity, scale);
      material = this.generateMaterial('torus', style);
    } else if (
      keywords.includes('tree') ||
      keywords.includes('plant') ||
      keywords.includes('organic')
    ) {
      geometry = this.generateTree(complexity, scale);
      material = this.generateMaterial('tree', style);
    } else if (
      keywords.includes('building') ||
      keywords.includes('structure') ||
      keywords.includes('tower')
    ) {
      geometry = this.generateBuilding(complexity, scale);
      material = this.generateMaterial('building', style);
    } else if (
      keywords.includes('character') ||
      keywords.includes('figure') ||
      keywords.includes('person')
    ) {
      geometry = this.generateCharacter(complexity, scale);
      material = this.generateMaterial('character', style);
    } else {
      // Default: generate random interesting shape
      geometry = this.generateRandomShape(complexity, scale);
      material = this.generateMaterial('random', style);
    }

    const mesh = new THREE.Mesh(geometry, material);
    const id = `model_${++this.modelCounter}`;
    const name = request.description.substring(0, 30);

    const model: GeneratedModel = {
      id,
      name,
      geometry,
      material,
      mesh,
    };

    this.generatedModels.set(id, model);
    return model;
  }

  /**
   * Generate sphere
   */
  private generateSphere(complexity: string, scale: number): THREE.BufferGeometry {
    const segments = complexity === 'low' ? 16 : complexity === 'medium' ? 32 : 64;
    return new THREE.SphereGeometry(1 * scale, segments, segments);
  }

  /**
   * Generate cube
   */
  private generateCube(complexity: string, scale: number): THREE.BufferGeometry {
    const subdivisions = complexity === 'low' ? 1 : complexity === 'medium' ? 2 : 4;
    const geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale);

    if (subdivisions > 1) {
      const positionAttribute = geometry.getAttribute('position');
      const positions = positionAttribute.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.1 * (complexity === 'low' ? 0.5 : 1);
        positions[i + 1] += (Math.random() - 0.5) * 0.1 * (complexity === 'low' ? 0.5 : 1);
        positions[i + 2] += (Math.random() - 0.5) * 0.1 * (complexity === 'low' ? 0.5 : 1);
      }
      positionAttribute.needsUpdate = true;
    }

    return geometry;
  }

  /**
   * Generate pyramid
   */
  private generatePyramid(complexity: string, scale: number): THREE.BufferGeometry {
    const segments = complexity === 'low' ? 4 : complexity === 'medium' ? 8 : 16;
    return new THREE.ConeGeometry(1 * scale, 2 * scale, segments);
  }

  /**
   * Generate torus
   */
  private generateTorus(complexity: string, scale: number): THREE.BufferGeometry {
    const segments = complexity === 'low' ? 16 : complexity === 'medium' ? 32 : 64;
    return new THREE.TorusGeometry(1 * scale, 0.4 * scale, 16, segments);
  }

  /**
   * Generate tree
   */
  private generateTree(complexity: string, scale: number): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 2 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeometry);
    group.add(trunk);

    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(0.8 * scale, 16, 16);
    const foliage = new THREE.Mesh(foliageGeometry);
    foliage.position.y = 1.5 * scale;
    group.add(foliage);

    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const geometries = [trunkGeometry, foliageGeometry];
    let vertexOffset = 0;

    const positions: number[] = [];
    geometries.forEach((geo) => {
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      positions.push(...Array.from(pos));
    });

    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return mergedGeometry;
  }

  /**
   * Generate building
   */
  private generateBuilding(complexity: string, scale: number): THREE.BufferGeometry {
    const height = complexity === 'low' ? 2 : complexity === 'medium' ? 4 : 8;
    const width = complexity === 'low' ? 1 : complexity === 'medium' ? 1.5 : 2;

    const geometry = new THREE.BoxGeometry(width * scale, height * scale, width * scale);

    // Add some variation
    const positionAttribute = geometry.getAttribute('position');
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      if (Math.random() > 0.7) {
        positions[i] += (Math.random() - 0.5) * 0.05;
        positions[i + 2] += (Math.random() - 0.5) * 0.05;
      }
    }
    positionAttribute.needsUpdate = true;

    return geometry;
  }

  /**
   * Generate character
   */
  private generateCharacter(complexity: string, scale: number): THREE.BufferGeometry {
    const group = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3 * scale, 16, 16);
    group.add(new THREE.Mesh(headGeometry));

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.4 * scale, 0.8 * scale, 0.3 * scale);
    const body = new THREE.Mesh(bodyGeometry);
    body.position.y = -0.5 * scale;
    group.add(body);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.6 * scale, 8);
    const leftArm = new THREE.Mesh(armGeometry);
    leftArm.position.set(-0.3 * scale, -0.2 * scale, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry);
    rightArm.position.set(0.3 * scale, -0.2 * scale, 0);
    group.add(rightArm);

    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const geometries = [headGeometry, bodyGeometry, armGeometry];
    const positions: number[] = [];

    geometries.forEach((geo) => {
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      positions.push(...Array.from(pos));
    });

    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return mergedGeometry;
  }

  /**
   * Generate random shape
   */
  private generateRandomShape(complexity: string, scale: number): THREE.BufferGeometry {
    const shapes = [
      () => this.generateSphere(complexity, scale),
      () => this.generateCube(complexity, scale),
      () => this.generatePyramid(complexity, scale),
      () => this.generateTorus(complexity, scale),
    ];

    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    return randomShape();
  }

  /**
   * Generate material based on style
   */
  private generateMaterial(type: string, style: string): THREE.Material {
    const colors: Record<string, number> = {
      sphere: 0x00d9ff,
      cube: 0xff00ff,
      pyramid: 0xffb800,
      torus: 0x00ff00,
      tree: 0x228b22,
      building: 0x808080,
      character: 0xffdbac,
      random: 0xffffff,
    };

    const color = colors[type] || 0xffffff;

    if (style === 'metallic') {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.8,
        roughness: 0.2,
      });
    } else if (style === 'organic') {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0,
        roughness: 0.8,
      });
    } else if (style === 'mechanical') {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.6,
        roughness: 0.4,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.5,
      });
    }
  }

  /**
   * Get generated model
   */
  getModel(id: string): GeneratedModel | undefined {
    return this.generatedModels.get(id);
  }

  /**
   * Get all generated models
   */
  getAllModels(): GeneratedModel[] {
    return Array.from(this.generatedModels.values());
  }

  /**
   * Export model as JSON
   */
  exportModel(id: string): string {
    const model = this.generatedModels.get(id);
    if (!model) return '';

    return JSON.stringify({
      id: model.id,
      name: model.name,
      geometry: {
        type: model.geometry.type,
        parameters: (model.geometry as any).parameters,
      },
    });
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.generatedModels.forEach((model) => {
      model.geometry.dispose();
      if (model.material instanceof THREE.Material) {
        model.material.dispose();
      }
    });
    this.generatedModels.clear();
  }
}
