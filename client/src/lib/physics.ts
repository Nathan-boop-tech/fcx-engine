/**
 * Flight Physics Engine
 * Professional Aviation Cockpit Minimalism: Functional clarity through realistic physics
 * 
 * Simulates basic 2D aircraft flight dynamics including:
 * - Lift (increases with speed)
 * - Gravity (constant descent)
 * - Thrust (acceleration)
 * - Drag (gradual deceleration)
 */

export interface AircraftState {
  x: number;
  y: number;
  altitude: number;
  speed: number;
  throttle: number;
  pitch: number;
  heading: number;
  verticalVelocity: number;
}

export interface PhysicsConstants {
  gravity: number;
  dragCoefficient: number;
  liftCoefficient: number;
  thrustForce: number;
  maxSpeed: number;
  maxAltitude: number;
  minAltitude: number;
}

export const DEFAULT_PHYSICS: PhysicsConstants = {
  gravity: 0.15,
  dragCoefficient: 0.02,
  liftCoefficient: 0.08,
  thrustForce: 0.8,
  maxSpeed: 500,
  maxAltitude: 45000,
  minAltitude: 0,
};

export class FlightPhysicsEngine {
  private constants: PhysicsConstants;

  constructor(constants: Partial<PhysicsConstants> = {}) {
    this.constants = { ...DEFAULT_PHYSICS, ...constants };
  }

  /**
   * Update aircraft state based on physics simulation
   * Called once per frame (60 FPS target)
   */
  update(state: AircraftState, deltaTime: number = 0.016): AircraftState {
    const dt = deltaTime;

    // Apply throttle to speed
    const throttleEffect = state.throttle * this.constants.thrustForce * dt;
    let newSpeed = state.speed + throttleEffect;

    // Apply drag (slows aircraft gradually)
    const dragForce = (newSpeed * newSpeed) * this.constants.dragCoefficient * dt;
    newSpeed = Math.max(0, newSpeed - dragForce);

    // Clamp speed
    newSpeed = Math.min(newSpeed, this.constants.maxSpeed);

    // Calculate lift (increases with speed)
    const lift = newSpeed * this.constants.liftCoefficient;

    // Apply gravity and lift to vertical velocity
    let newVerticalVelocity = state.verticalVelocity + this.constants.gravity * dt;
    newVerticalVelocity -= lift * state.pitch * dt;

    // Update altitude
    let newAltitude = state.altitude + newVerticalVelocity * dt;
    newAltitude = Math.max(
      this.constants.minAltitude,
      Math.min(newAltitude, this.constants.maxAltitude)
    );

    // Ground collision
    if (newAltitude <= this.constants.minAltitude) {
      newAltitude = this.constants.minAltitude;
      newVerticalVelocity = 0;
    }

    // Update position based on speed and heading
    const radians = (state.heading * Math.PI) / 180;
    const newX = state.x + Math.cos(radians) * newSpeed * dt;
    const newY = state.y + Math.sin(radians) * newSpeed * dt;

    return {
      ...state,
      x: newX,
      y: newY,
      altitude: newAltitude,
      speed: newSpeed,
      verticalVelocity: newVerticalVelocity,
    };
  }

  /**
   * Calculate distance to runway (simple approximation)
   */
  distanceToRunway(x: number, y: number, runwayX: number, runwayY: number): number {
    const dx = runwayX - x;
    const dy = runwayY - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Determine flight state (climbing, cruising, landing)
   */
  getFlightState(
    altitude: number,
    verticalVelocity: number,
    speed: number
  ): 'climbing' | 'cruising' | 'descending' | 'landed' {
    if (altitude <= 500) {
      return 'landed';
    }
    if (verticalVelocity > 1) {
      return 'climbing';
    }
    if (verticalVelocity < -1) {
      return 'descending';
    }
    return 'cruising';
  }
}
