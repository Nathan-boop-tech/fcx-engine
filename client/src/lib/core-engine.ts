/**
 * Core Engine Manager
 * Coordinates rendering, physics, and simulation loops
 * Central hub for FCX Engine Lite v2.0
 */

import * as THREE from 'three';
import { RenderingEngine } from './rendering-engine';
import { Physics3DEngine, Aircraft3DState, DEFAULT_PHYSICS_3D } from './physics-engine-3d';
import { InputHandler } from './input';

export interface EngineConfig {
  renderingWidth: number;
  renderingHeight: number;
  targetFPS: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  renderingWidth: 1280,
  renderingHeight: 720,
  targetFPS: 60,
};

export class CoreEngine {
  private renderingEngine: RenderingEngine;
  private physicsEngine: Physics3DEngine;
  private inputHandler: InputHandler;

  private aircraftState: Aircraft3DState;
  private aircraftMesh: THREE.Group | null = null;
  private runwayMesh: THREE.Group | null = null;

  private isRunning: boolean = false;
  private animationFrameId: number | undefined;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;

  private config: EngineConfig;

  constructor(canvas: HTMLCanvasElement, config: Partial<EngineConfig> = {}) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };

    // Initialize engines
    this.renderingEngine = new RenderingEngine(canvas, {
      width: this.config.renderingWidth,
      height: this.config.renderingHeight,
    });

    this.physicsEngine = new Physics3DEngine();
    this.inputHandler = new InputHandler();

    // Initialize aircraft state
    this.aircraftState = {
      position: new THREE.Vector3(0, 100, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      verticalVelocity: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      throttle: 0,
      pitchInput: 0,
      yawInput: 0,
      rollInput: 0,
      speed: 0,
      altitude: 100,
      weight: 1.0,
    };

    // Create aircraft mesh
    this.aircraftMesh = this.renderingEngine.createAircraft();

    // Create runway
    this.runwayMesh = this.renderingEngine.createRunway(0, 500);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Start engine loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  /**
   * Stop engine loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastFrameTime) / 1000, 0.016);
    this.lastFrameTime = now;

    // Update FPS counter
    this.frameCount++;
    if (now - (this.lastFrameTime - 1000) >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
    }

    // Process input
    this.processInput();

    // Update physics
    this.aircraftState = this.physicsEngine.update(this.aircraftState, deltaTime);

    // Update rendering
    this.updateRendering();

    // Render scene
    this.renderingEngine.render();

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Process input and update aircraft state
   */
  private processInput(): void {
    const input = this.inputHandler.getState();

    // Throttle
    if (input.throttleUp) {
      this.aircraftState.throttle = Math.min(1, this.aircraftState.throttle + 0.02);
    }
    if (input.throttleDown) {
      this.aircraftState.throttle = Math.max(0, this.aircraftState.throttle - 0.02);
    }

    // Pitch
    if (input.pitchUp) {
      this.aircraftState.pitchInput = -1;
    } else if (input.pitchDown) {
      this.aircraftState.pitchInput = 1;
    } else {
      this.aircraftState.pitchInput = 0;
    }

    // Yaw (heading)
    if (input.headingLeft) {
      this.aircraftState.yawInput = 1;
    } else if (input.headingRight) {
      this.aircraftState.yawInput = -1;
    } else {
      this.aircraftState.yawInput = 0;
    }

    // Roll (banking)
    // Can be added with additional input keys if needed
    this.aircraftState.rollInput = 0;
  }

  /**
   * Update rendering based on aircraft state
   */
  private updateRendering(): void {
    if (!this.aircraftMesh) return;

    // Update aircraft position
    this.aircraftMesh.position.copy(this.aircraftState.position);

    // Update aircraft rotation
    this.aircraftMesh.rotation.order = 'YXZ';
    this.aircraftMesh.rotation.y = this.aircraftState.yaw;
    this.aircraftMesh.rotation.x = this.aircraftState.pitch;
    this.aircraftMesh.rotation.z = this.aircraftState.roll;

    // Update camera (chase camera)
    this.renderingEngine.updateCameraChase(
      this.aircraftState.position,
      this.aircraftMesh.rotation as THREE.Euler,
      50,
      20
    );
  }

  /**
   * Handle window resize
   */
  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderingEngine.onWindowResize(width, height);
  }

  /**
   * Get aircraft state
   */
  getAircraftState(): Aircraft3DState {
    return this.aircraftState;
  }

  /**
   * Get physics engine
   */
  getPhysicsEngine(): Physics3DEngine {
    return this.physicsEngine;
  }

  /**
   * Get rendering engine
   */
  getRenderingEngine(): RenderingEngine {
    return this.renderingEngine;
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get force breakdown
   */
  getForceBreakdown() {
    return this.physicsEngine.getForceBreakdown(this.aircraftState);
  }

  /**
   * Get flight state
   */
  getFlightState(): string {
    return this.physicsEngine.getFlightState(
      this.aircraftState.altitude,
      this.aircraftState.verticalVelocity,
      this.aircraftState.speed
    );
  }

  /**
   * Set wind
   */
  setWind(x: number, y: number, z: number): void {
    this.physicsEngine.setWind(x, y, z);
  }

  /**
   * Update physics constants (for sandbox)
   */
  updatePhysicsConstants(updates: any): void {
    this.physicsEngine.updateConstants(updates);
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.stop();
    this.inputHandler.destroy();
    this.renderingEngine.dispose();
  }
}
