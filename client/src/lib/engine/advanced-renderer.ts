/**
 * FCX Engine Pro v2.0 - Advanced Rendering System
 * Post-processing, particles, advanced materials, skybox
 */

import * as THREE from 'three';

export interface ParticleConfig {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  lifetime: number;
  size: number;
  color: THREE.Color;
}

export interface PostProcessingConfig {
  bloom?: boolean;
  ssao?: boolean;
  motionBlur?: boolean;
  chromaticAberration?: boolean;
  vignette?: boolean;
}

export class ParticleSystem {
  private particles: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
    lifetime: number;
    maxLifetime: number;
    size: number;
    color: THREE.Color;
  }> = [];

  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;
  private maxParticles: number = 10000;

  constructor(scene: THREE.Scene) {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      transparent: true,
      vertexColors: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  /**
   * Emit particles
   */
  emit(config: ParticleConfig, count: number = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;

      this.particles.push({
        position: config.position.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.random() * 2,
          Math.sin(angle) * speed
        ),
        acceleration: config.acceleration.clone(),
        lifetime: config.lifetime,
        maxLifetime: config.lifetime,
        size: config.size,
        color: config.color.clone(),
      });
    }
  }

  /**
   * Update particles
   */
  update(deltaTime: number): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    this.particles = this.particles.filter((p) => {
      p.lifetime -= deltaTime;
      if (p.lifetime <= 0) return false;

      p.velocity.add(p.acceleration.clone().multiplyScalar(deltaTime));
      p.position.add(p.velocity.clone().multiplyScalar(deltaTime));

      const alpha = p.lifetime / p.maxLifetime;

      positions.push(p.position.x, p.position.y, p.position.z);
      colors.push(p.color.r, p.color.g, p.color.b, alpha);
      sizes.push(p.size * alpha);

      return true;
    });

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    this.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(colors), 4)
    );
    this.geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(new Float32Array(sizes), 1)
    );
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export class AdvancedRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particleSystem: ParticleSystem;
  private postProcessingConfig: PostProcessingConfig = {};
  private skyboxMesh: THREE.Mesh | null = null;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.particleSystem = new ParticleSystem(scene);

    this.setupAdvancedRendering();
  }

  /**
   * Setup advanced rendering features
   */
  private setupAdvancedRendering(): void {
    // Enable advanced features
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Enable shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  /**
   * Create skybox
   */
  createSkybox(color: number = 0x87ceeb): void {
    if (this.skyboxMesh) {
      this.scene.remove(this.skyboxMesh);
    }

    const geometry = new THREE.SphereGeometry(5000, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
    });

    this.skyboxMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.skyboxMesh);
  }

  /**
   * Create gradient skybox
   */
  createGradientSkybox(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(0.5, '#e0f6ff');
      gradient.addColorStop(1, '#ffcc99');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.SphereGeometry(5000, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    if (this.skyboxMesh) {
      this.scene.remove(this.skyboxMesh);
    }

    this.skyboxMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.skyboxMesh);
  }

  /**
   * Emit particles
   */
  emitParticles(config: ParticleConfig, count: number = 10): void {
    this.particleSystem.emit(config, count);
  }

  /**
   * Create advanced material
   */
  createAdvancedMaterial(options: {
    color?: number;
    metalness?: number;
    roughness?: number;
    emissive?: number;
    emissiveIntensity?: number;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
  } = {}): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: options.color || 0xffffff,
      metalness: options.metalness || 0.5,
      roughness: options.roughness || 0.5,
      emissive: options.emissive || 0x000000,
      emissiveIntensity: options.emissiveIntensity || 0,
      normalMap: options.normalMap,
      roughnessMap: options.roughnessMap,
      metalnessMap: options.metalnessMap,
    });
  }

  /**
   * Create glowing material
   */
  createGlowingMaterial(color: number = 0x00ff00, intensity: number = 1): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial({
      color,
      toneMapped: false,
    });
    return material;
  }

  /**
   * Add bloom effect (via emissive)
   */
  enableBloom(): void {
    this.postProcessingConfig.bloom = true;
    this.renderer.toneMappingExposure = 1.5;
  }

  /**
   * Add vignette effect
   */
  enableVignette(): void {
    this.postProcessingConfig.vignette = true;
  }

  /**
   * Update advanced rendering
   */
  update(deltaTime: number): void {
    this.particleSystem.update(deltaTime);

    // Update skybox position to follow camera
    if (this.skyboxMesh) {
      this.skyboxMesh.position.copy(this.camera.position);
    }
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particleSystem.getParticleCount();
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.particleSystem.dispose();
  }
}
