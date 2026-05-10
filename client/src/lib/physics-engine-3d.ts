/**
 * 3D Flight Physics Engine
 * Vector-based physics simulation for FCX Engine Lite v2.0
 * Includes thrust, lift, drag, gravity, and rotation dynamics
 */

import * as THREE from 'three';

export interface Aircraft3DState {
  // Position
  position: THREE.Vector3;

  // Velocity
  velocity: THREE.Vector3;
  verticalVelocity: number;

  // Rotation (Euler angles)
  pitch: number; // X rotation (-π/2 to π/2)
  yaw: number; // Y rotation (0 to 2π)
  roll: number; // Z rotation (-π to π)

  // Control inputs
  throttle: number; // 0 to 1
  pitchInput: number; // -1 to 1
  yawInput: number; // -1 to 1
  rollInput: number; // -1 to 1

  // Flight characteristics
  speed: number; // Magnitude of velocity (knots)
  altitude: number; // Y position in feet
  weight: number; // Aircraft weight (affects lift/drag)
}

export interface Physics3DConstants {
  // Forces
  thrustForce: number;
  liftCoefficient: number;
  dragCoefficient: number;
  gravity: number;
  weight: number;

  // Limits
  maxSpeed: number;
  maxAltitude: number;
  minAltitude: number;

  // Rotation
  pitchRate: number;
  yawRate: number;
  rollRate: number;
  rollDamping: number; // Reduces roll over time

  // Wind
  windVector: THREE.Vector3;

  // Stall
  stallSpeed: number;
  stallRecoveryRate: number;
}

export const DEFAULT_PHYSICS_3D: Physics3DConstants = {
  thrustForce: 0.8,
  liftCoefficient: 0.08,
  dragCoefficient: 0.02,
  gravity: 0.15,
  weight: 1.0,

  maxSpeed: 500,
  maxAltitude: 45000,
  minAltitude: 0,

  pitchRate: 0.05,
  yawRate: 0.05,
  rollRate: 0.08,
  rollDamping: 0.02,

  windVector: new THREE.Vector3(0, 0, 0),

  stallSpeed: 50,
  stallRecoveryRate: 0.05,
};

export class Physics3DEngine {
  private constants: Physics3DConstants;
  private isStalled: boolean = false;

  constructor(constants: Partial<Physics3DConstants> = {}) {
    this.constants = { ...DEFAULT_PHYSICS_3D, ...constants };
  }

  /**
   * Main physics update
   */
  update(state: Aircraft3DState, deltaTime: number = 0.016): Aircraft3DState {
    const newState = { ...state };

    // 1. Apply throttle
    this.applyThrottle(newState, deltaTime);

    // 2. Calculate forces
    const forces = this.calculateForces(newState);

    // 3. Apply forces to velocity
    this.applyForces(newState, forces, deltaTime);

    // 4. Update rotation
    this.updateRotation(newState, deltaTime);

    // 5. Update position
    this.updatePosition(newState, deltaTime);

    // 6. Apply constraints
    this.applyConstraints(newState);

    // 7. Update speed
    newState.speed = newState.velocity.length();
    newState.altitude = newState.position.y;

    // 8. Check stall condition
    this.updateStallState(newState);

    return newState;
  }

  /**
   * Apply throttle to forward velocity
   */
  private applyThrottle(state: Aircraft3DState, deltaTime: number): void {
    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyEuler(new THREE.Euler(state.pitch, state.yaw, state.roll));

    const thrustAcceleration = this.constants.thrustForce * state.throttle * deltaTime;
    state.velocity.addScaledVector(forwardVector, thrustAcceleration);
  }

  /**
   * Calculate all forces acting on aircraft
   */
  private calculateForces(state: Aircraft3DState): {
    lift: THREE.Vector3;
    drag: THREE.Vector3;
    gravity: THREE.Vector3;
    wind: THREE.Vector3;
  } {
    // Lift (perpendicular to velocity, affected by pitch)
    const upVector = new THREE.Vector3(0, 1, 0);
    upVector.applyEuler(new THREE.Euler(state.pitch, state.yaw, state.roll));

    const lift = upVector.clone().multiplyScalar(
      state.speed * this.constants.liftCoefficient * Math.cos(state.pitch) * this.constants.weight
    );

    // Drag (opposite to velocity)
    const drag = state.velocity
      .clone()
      .normalize()
      .multiplyScalar(-state.speed * state.speed * this.constants.dragCoefficient);

    // Gravity (downward)
    const gravity = new THREE.Vector3(0, -this.constants.gravity * this.constants.weight, 0);

    // Wind effect
    const wind = this.constants.windVector.clone();

    return { lift, drag, gravity, wind };
  }

  /**
   * Apply forces to velocity
   */
  private applyForces(
    state: Aircraft3DState,
    forces: {
      lift: THREE.Vector3;
      drag: THREE.Vector3;
      gravity: THREE.Vector3;
      wind: THREE.Vector3;
    },
    deltaTime: number
  ): void {
    state.velocity.add(forces.lift.multiplyScalar(deltaTime));
    state.velocity.add(forces.drag.multiplyScalar(deltaTime));
    state.velocity.add(forces.gravity.multiplyScalar(deltaTime));
    state.velocity.add(forces.wind.multiplyScalar(deltaTime));
  }

  /**
   * Update aircraft rotation based on input
   */
  private updateRotation(state: Aircraft3DState, deltaTime: number): void {
    // Pitch
    state.pitch += state.pitchInput * this.constants.pitchRate * deltaTime;
    state.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.pitch));

    // Yaw
    state.yaw += state.yawInput * this.constants.yawRate * deltaTime;
    state.yaw = (state.yaw + Math.PI * 2) % (Math.PI * 2);

    // Roll
    state.roll += state.rollInput * this.constants.rollRate * deltaTime;
    state.roll = Math.max(-Math.PI, Math.min(Math.PI, state.roll));

    // Roll damping (gradually return to level)
    state.roll *= 1 - this.constants.rollDamping * deltaTime;
  }

  /**
   * Update position based on velocity
   */
  private updatePosition(state: Aircraft3DState, deltaTime: number): void {
    state.position.addScaledVector(state.velocity, deltaTime);
  }

  /**
   * Apply constraints (altitude, speed, etc.)
   */
  private applyConstraints(state: Aircraft3DState): void {
    // Altitude constraints
    if (state.position.y <= this.constants.minAltitude) {
      state.position.y = this.constants.minAltitude;
      state.velocity.y = Math.max(0, state.velocity.y);
    }

    if (state.position.y >= this.constants.maxAltitude) {
      state.position.y = this.constants.maxAltitude;
      state.velocity.y = Math.min(0, state.velocity.y);
    }

    // Speed constraints
    if (state.speed > this.constants.maxSpeed) {
      state.velocity.normalize().multiplyScalar(this.constants.maxSpeed);
    }
  }

  /**
   * Update stall state
   */
  private updateStallState(state: Aircraft3DState): void {
    if (state.speed < this.constants.stallSpeed) {
      this.isStalled = true;
    } else if (state.speed > this.constants.stallSpeed * 1.2) {
      this.isStalled = false;
    }

    // Reduce lift during stall
    if (this.isStalled) {
      state.velocity.y -= this.constants.stallRecoveryRate;
    }
  }

  /**
   * Get flight state
   */
  getFlightState(
    altitude: number,
    verticalVelocity: number,
    speed: number
  ): 'climbing' | 'cruising' | 'descending' | 'landed' | 'stalled' {
    if (altitude <= 10) return 'landed';
    if (this.isStalled) return 'stalled';
    if (verticalVelocity > 1) return 'climbing';
    if (verticalVelocity < -1) return 'descending';
    return 'cruising';
  }

  /**
   * Get force breakdown for debug display
   */
  getForceBreakdown(state: Aircraft3DState): {
    lift: number;
    drag: number;
    gravity: number;
    wind: number;
  } {
    const forces = this.calculateForces(state);
    return {
      lift: forces.lift.length(),
      drag: forces.drag.length(),
      gravity: forces.gravity.length(),
      wind: forces.wind.length(),
    };
  }

  /**
   * Set wind vector
   */
  setWind(x: number, y: number, z: number): void {
    this.constants.windVector.set(x, y, z);
  }

  /**
   * Get current constants
   */
  getConstants(): Physics3DConstants {
    return this.constants;
  }

  /**
   * Update constants (for physics sandbox)
   */
  updateConstants(updates: Partial<Physics3DConstants>): void {
    Object.assign(this.constants, updates);
  }
}
