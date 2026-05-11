/**
 * FCX Engine Pro - Game Engine Core
 * Central game loop and system coordination
 */

import * as THREE from 'three';
import { FCXRenderer } from './renderer';
import { FCXPhysics } from './physics';

export interface GameEngineConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  targetFPS?: number;
}

export interface GameObject {
  id: string;
  mesh?: THREE.Object3D;
  physicsBody?: any;
  update?: (deltaTime: number) => void;
  onCollision?: (other: GameObject) => void;
}

export class GameEngine {
  private renderer: FCXRenderer;
  private physics: FCXPhysics;
  private gameObjects: Map<string, GameObject> = new Map();
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private targetFPS: number;
  private frameTime: number;
  private animationId: number | null = null;
  private updateCallbacks: Array<(deltaTime: number) => void> = [];

  constructor(config: GameEngineConfig) {
    this.renderer = new FCXRenderer(config.canvas, {
      width: config.width,
      height: config.height,
      shadowMap: true,
      antialias: true,
    });

    this.physics = new FCXPhysics(-9.82);
    this.targetFPS = config.targetFPS || 60;
    this.frameTime = 1000 / this.targetFPS;
  }

  /**
   * Add game object
   */
  addGameObject(id: string, obj: GameObject): void {
    this.gameObjects.set(id, obj);
  }

  /**
   * Get game object
   */
  getGameObject(id: string): GameObject | undefined {
    return this.gameObjects.get(id);
  }

  /**
   * Remove game object
   */
  removeGameObject(id: string): void {
    const obj = this.gameObjects.get(id);
    if (obj && obj.mesh) {
      this.renderer.removeObject(id);
    }
    this.gameObjects.delete(id);
  }

  /**
   * Register update callback
   */
  onUpdate(callback: (deltaTime: number) => void): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Start game loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  /**
   * Stop game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.016); // Cap at 60fps
    this.lastTime = now;

    // Update physics
    this.physics.update(deltaTime);

    // Update game objects
    this.gameObjects.forEach((obj) => {
      if (obj.update) {
        obj.update(deltaTime);
      }
    });

    // Call registered callbacks
    this.updateCallbacks.forEach((cb) => cb(deltaTime));

    // Render
    this.renderer.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  /**
   * Handle window resize
   */
  onWindowResize(width: number, height: number): void {
    this.renderer.onWindowResize(width, height);
  }

  /**
   * Get renderer
   */
  getRenderer(): FCXRenderer {
    return this.renderer;
  }

  /**
   * Get physics
   */
  getPhysics(): FCXPhysics {
    return this.physics;
  }

  /**
   * Get scene
   */
  getScene(): THREE.Scene {
    return this.renderer.getScene();
  }

  /**
   * Get camera
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.renderer.getCamera();
  }

  /**
   * Dispose engine
   */
  dispose(): void {
    this.stop();
    this.renderer.dispose();
    this.physics.dispose();
    this.gameObjects.clear();
    this.updateCallbacks = [];
  }
}
