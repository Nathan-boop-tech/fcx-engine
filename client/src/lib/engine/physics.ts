/**
 * FCX Engine Pro - Physics Engine
 * Cannon.js physics simulation
 */

import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export interface RigidBodyConfig {
  mass?: number;
  shape?: 'box' | 'sphere' | 'plane' | 'cylinder';
  size?: { x: number; y: number; z: number };
  radius?: number;
  restitution?: number;
  friction?: number;
  linearDamping?: number;
  angularDamping?: number;
}

export interface PhysicsObject {
  id: string;
  body: CANNON.Body;
  mesh?: THREE.Object3D;
}

export class FCXPhysics {
  private world: CANNON.World;
  private bodies: Map<string, PhysicsObject> = new Map();
  private gravity: CANNON.Vec3;
  private materials: Map<string, CANNON.Material> = new Map();

  constructor(gravity: number = -9.82) {
    this.world = new CANNON.World();
    this.gravity = new CANNON.Vec3(0, gravity, 0);
    this.world.gravity.copy(this.gravity);
    this.world.defaultContactMaterial.friction = 0.4;
  }

  /**
   * Create a rigid body
   */
  createBody(id: string, config: RigidBodyConfig = {}): CANNON.Body {
    const mass = config.mass || 1;
    let shape: CANNON.Shape;

    switch (config.shape || 'box') {
      case 'box':
        const size = config.size || { x: 1, y: 1, z: 1 };
        shape = new CANNON.Box(
          new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
        );
        break;
      case 'sphere':
        shape = new CANNON.Sphere(config.radius || 1);
        break;
      case 'plane':
        shape = new CANNON.Plane();
        break;
      case 'cylinder':
        shape = new CANNON.Cylinder(
          config.radius || 1,
          config.radius || 1,
          config.size?.y || 2,
          16
        );
        break;
      default:
        shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    }

    const body = new CANNON.Body({
      mass,
      shape,
      linearDamping: config.linearDamping || 0.3,
      angularDamping: config.angularDamping || 0.3,
    });

    // Set material properties through contact material
    const material = new CANNON.Material('body_' + id);
    body.material = material;

    this.world.addBody(body);
    this.bodies.set(id, { id, body });

    return body;
  }

  /**
   * Link mesh to physics body
   */
  linkMesh(id: string, mesh: THREE.Object3D): void {
    const obj = this.bodies.get(id);
    if (obj) {
      obj.mesh = mesh;
    }
  }

  /**
   * Set body position
   */
  setPosition(id: string, x: number, y: number, z: number): void {
    const obj = this.bodies.get(id);
    if (obj) {
      obj.body.position.set(x, y, z);
    }
  }

  /**
   * Set body velocity
   */
  setVelocity(id: string, x: number, y: number, z: number): void {
    const obj = this.bodies.get(id);
    if (obj) {
      obj.body.velocity.set(x, y, z);
    }
  }

  /**
   * Apply force
   */
  applyForce(id: string, x: number, y: number, z: number): void {
    const obj = this.bodies.get(id);
    if (obj) {
      const force = new CANNON.Vec3(x, y, z);
      obj.body.applyForce(force, obj.body.position);
    }
  }

  /**
   * Apply impulse
   */
  applyImpulse(id: string, x: number, y: number, z: number): void {
    const obj = this.bodies.get(id);
    if (obj) {
      const impulse = new CANNON.Vec3(x, y, z);
      obj.body.applyImpulse(impulse, obj.body.position);
    }
  }

  /**
   * Get body
   */
  getBody(id: string): CANNON.Body | undefined {
    return this.bodies.get(id)?.body;
  }

  /**
   * Update physics and sync meshes
   */
  update(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 3);

    // Sync meshes with physics bodies
    this.bodies.forEach(({ body, mesh }) => {
      if (mesh) {
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      }
    });
  }

  /**
   * Remove body
   */
  removeBody(id: string): void {
    const obj = this.bodies.get(id);
    if (obj) {
      this.world.removeBody(obj.body);
      this.bodies.delete(id);
    }
  }

  /**
   * Get world
   */
  getWorld(): CANNON.World {
    return this.world;
  }

  /**
   * Set gravity
   */
  setGravity(x: number, y: number, z: number): void {
    this.world.gravity.set(x, y, z);
  }

  /**
   * Dispose physics
   */
  dispose(): void {
    this.bodies.clear();
  }
}
