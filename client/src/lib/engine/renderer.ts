/**
 * FCX Engine Pro - 3D Rendering Engine
 * Complete Three.js rendering pipeline
 */

import * as THREE from 'three';

export interface RendererConfig {
  width: number;
  height: number;
  pixelRatio?: number;
  antialias?: boolean;
  shadowMap?: boolean;
}

export class FCXRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private lights: Map<string, THREE.Light> = new Map();
  private objects: Map<string, THREE.Object3D> = new Map();
  private materials: Map<string, THREE.Material> = new Map();
  private textures: Map<string, THREE.Texture> = new Map();

  constructor(canvas: HTMLCanvasElement, config: RendererConfig) {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1419);
    this.scene.fog = new THREE.Fog(0x0f1419, 1000, 5000);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      config.width / config.height,
      0.1,
      10000
    );
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: config.antialias !== false,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    this.renderer.setSize(config.width, config.height);
    this.renderer.setPixelRatio(config.pixelRatio || window.devicePixelRatio);
    this.renderer.shadowMap.enabled = config.shadowMap !== false;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    // Default lighting
    this.setupDefaultLighting();
  }

  private setupDefaultLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    this.lights.set('ambient', ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.far = 1000;
    this.scene.add(directionalLight);
    this.lights.set('directional', directionalLight);

    // Hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.4);
    this.scene.add(hemisphereLight);
    this.lights.set('hemisphere', hemisphereLight);
  }

  /**
   * Create a material
   */
  createMaterial(
    id: string,
    options: {
      color?: number;
      metalness?: number;
      roughness?: number;
      emissive?: number;
      transparent?: boolean;
      opacity?: number;
    } = {}
  ): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color: options.color || 0xffffff,
      metalness: options.metalness || 0.5,
      roughness: options.roughness || 0.5,
      emissive: options.emissive || 0x000000,
      transparent: options.transparent || false,
      opacity: options.opacity || 1,
    });

    this.materials.set(id, material);
    return material;
  }

  /**
   * Create a mesh
   */
  createMesh(
    id: string,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    options: { castShadow?: boolean; receiveShadow?: boolean } = {}
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = options.castShadow !== false;
    mesh.receiveShadow = options.receiveShadow !== false;
    this.scene.add(mesh);
    this.objects.set(id, mesh);
    return mesh;
  }

  /**
   * Create a box
   */
  createBox(
    id: string,
    width: number,
    height: number,
    depth: number,
    material?: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mat = material || this.createMaterial(`${id}_material`);
    return this.createMesh(id, geometry, mat);
  }

  /**
   * Create a sphere
   */
  createSphere(
    id: string,
    radius: number,
    widthSegments: number = 32,
    heightSegments: number = 32,
    material?: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const mat = material || this.createMaterial(`${id}_material`);
    return this.createMesh(id, geometry, mat);
  }

  /**
   * Create a plane
   */
  createPlane(
    id: string,
    width: number,
    height: number,
    material?: THREE.Material
  ): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(width, height);
    const mat = material || this.createMaterial(`${id}_material`);
    const mesh = this.createMesh(id, geometry, mat);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  /**
   * Get object by ID
   */
  getObject(id: string): THREE.Object3D | undefined {
    return this.objects.get(id);
  }

  /**
   * Remove object
   */
  removeObject(id: string): void {
    const obj = this.objects.get(id);
    if (obj) {
      this.scene.remove(obj);
      this.objects.delete(id);
    }
  }

  /**
   * Get scene
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get camera
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Render frame
   */
  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  onWindowResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Dispose renderer
   */
  dispose(): void {
    this.renderer.dispose();
  }
}
