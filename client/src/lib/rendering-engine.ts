/**
 * 3D Rendering Engine
 * Manages Three.js scene, camera, renderer, and lighting
 * Foundation for FCX Engine Lite v2.0
 */

import * as THREE from 'three';

export interface RenderingConfig {
  width: number;
  height: number;
  fov: number;
  near: number;
  far: number;
  backgroundColor: number;
}

export const DEFAULT_RENDERING_CONFIG: RenderingConfig = {
  width: 1280,
  height: 720,
  fov: 75,
  near: 0.1,
  far: 10000,
  backgroundColor: 0x87ceeb, // Sky blue
};

export class RenderingEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private config: RenderingConfig;

  // Lighting
  private directionalLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  // Scene objects
  private skybox: THREE.Mesh | null = null;
  private terrain: THREE.Mesh | null = null;
  private aircraft: THREE.Group | null = null;

  constructor(canvas: HTMLCanvasElement, config: Partial<RenderingConfig> = {}) {
    this.config = { ...DEFAULT_RENDERING_CONFIG, ...config };

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.config.backgroundColor);
    this.scene.fog = new THREE.Fog(0x87ceeb, 5000, 10000);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      this.config.fov,
      this.config.width / this.config.height,
      this.config.near,
      this.config.far
    );
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(this.config.width, this.config.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Initialize lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(100, 200, 100);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.left = -500;
    this.directionalLight.shadow.camera.right = 500;
    this.directionalLight.shadow.camera.top = 500;
    this.directionalLight.shadow.camera.bottom = -500;
    this.scene.add(this.directionalLight);

    // Initialize scene elements
    this.initializeSkybox();
    this.initializeTerrain();
  }

  /**
   * Initialize skybox with gradient
   */
  private initializeSkybox(): void {
    const skyGeometry = new THREE.SphereGeometry(5000, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    this.skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(this.skybox);
  }

  /**
   * Initialize terrain grid
   */
  private initializeTerrain(): void {
    const terrainGeometry = new THREE.PlaneGeometry(2000, 2000, 50, 50);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5016,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(2000, 40, 0x444444, 0x888888);
    this.scene.add(gridHelper);
  }

  /**
   * Create aircraft group (placeholder mesh)
   */
  createAircraft(): THREE.Group {
    const group = new THREE.Group();

    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(2, 2, 20, 8);
    const fuselageMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.4,
      metalness: 0.6,
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    group.add(fuselage);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(40, 1, 8);
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      roughness: 0.3,
      metalness: 0.7,
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.y = 0;
    wings.castShadow = true;
    wings.receiveShadow = true;
    group.add(wings);

    // Tail
    const tailGeometry = new THREE.BoxGeometry(2, 8, 6);
    const tail = new THREE.Mesh(tailGeometry, wingMaterial);
    tail.position.z = -8;
    tail.position.y = 2;
    tail.castShadow = true;
    tail.receiveShadow = true;
    group.add(tail);

    // Cockpit (small sphere)
    const cockpitGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const cockpitMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      roughness: 0.2,
      metalness: 0.8,
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.z = 8;
    cockpit.position.y = 2;
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    group.add(cockpit);

    group.position.set(0, 100, 0);
    this.scene.add(group);
    this.aircraft = group;

    return group;
  }

  /**
   * Create runway in 3D space
   */
  createRunway(x: number, z: number): THREE.Group {
    const group = new THREE.Group();

    // Runway surface
    const runwayGeometry = new THREE.PlaneGeometry(100, 400);
    const runwayMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.9,
      metalness: 0.1,
    });
    const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
    runway.rotation.x = -Math.PI / 2;
    runway.receiveShadow = true;
    group.add(runway);

    // Runway markings (center line)
    const markingGeometry = new THREE.PlaneGeometry(4, 400);
    const markingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
    });
    const marking = new THREE.Mesh(markingGeometry, markingMaterial);
    marking.rotation.x = -Math.PI / 2;
    marking.position.y = 0.1;
    group.add(marking);

    group.position.set(x, 0, z);
    this.scene.add(group);

    return group;
  }

  /**
   * Update camera position (chase camera)
   */
  updateCameraChase(
    targetPos: THREE.Vector3,
    targetRotation: THREE.Euler,
    distance: number = 50,
    height: number = 20
  ): void {
    const offset = new THREE.Vector3(0, height, distance);
    offset.applyEuler(targetRotation);
    offset.add(targetPos);

    this.camera.position.lerp(offset, 0.1);
    this.camera.lookAt(targetPos);
  }

  /**
   * Update camera for cockpit view
   */
  updateCameraCockpit(targetPos: THREE.Vector3, targetRotation: THREE.Euler): void {
    this.camera.position.copy(targetPos);
    this.camera.rotation.copy(targetRotation);
  }

  /**
   * Update camera for side view (debug)
   */
  updateCameraSideView(targetPos: THREE.Vector3): void {
    this.camera.position.set(targetPos.x + 200, targetPos.y + 50, targetPos.z);
    this.camera.lookAt(targetPos);
  }

  /**
   * Get scene for adding objects
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
   * Get renderer
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get aircraft mesh
   */
  getAircraft(): THREE.Group | null {
    return this.aircraft;
  }

  /**
   * Render scene
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
   * Dispose resources
   */
  dispose(): void {
    this.renderer.dispose();
  }
}
