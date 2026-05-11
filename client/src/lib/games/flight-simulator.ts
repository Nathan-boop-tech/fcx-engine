/**
 * FCX Engine Pro - Flight Simulator Game Template
 * Fully functional flight simulation game
 */

import * as THREE from 'three';
import { GameEngine, GameObject } from '@/lib/engine/game-engine';
import { GameScriptEngine } from '@/lib/engine/scripting';

export interface FlightSimulatorConfig {
  engine: GameEngine;
}

export class FlightSimulator {
  private engine: GameEngine;
  private scriptEngine: GameScriptEngine;
  private aircraft: GameObject | null = null;
  private speed: number = 0;
  private altitude: number = 0;
  private heading: number = 0;
  private pitch: number = 0;
  private roll: number = 0;
  private throttle: number = 0;

  constructor(config: FlightSimulatorConfig) {
    this.engine = config.engine;
    this.scriptEngine = new GameScriptEngine(this.engine);
    this.setupGame();
  }

  /**
   * Setup game scene
   */
  private setupGame(): void {
    const renderer = this.engine.getRenderer();
    const physics = this.engine.getPhysics();
    const scene = this.engine.getScene();

    // Create ground/runway
    const runwayMaterial = renderer.createMaterial('runway_material', {
      color: 0x333333,
      roughness: 0.9,
    });
    const runway = renderer.createPlane('runway', 200, 1000, runwayMaterial);
    runway.position.y = 0;
    runway.receiveShadow = true;

    // Create runway markings (visual)
    const markingsGeometry = new THREE.PlaneGeometry(200, 1000);
    const markingsCanvas = document.createElement('canvas');
    markingsCanvas.width = 200;
    markingsCanvas.height = 1000;
    const ctx = markingsCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(80, i * 100, 40, 50);
      }
    }
    const markingsTexture = new THREE.CanvasTexture(markingsCanvas);
    const markingsMaterial = new THREE.MeshStandardMaterial({ map: markingsTexture });
    const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
    markings.position.y = 0.01;
    scene.add(markings);

    // Create aircraft
    const aircraftGroup = new THREE.Group();
    
    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 16);
    const fuselageMaterial = renderer.createMaterial('fuselage_material', {
      color: 0x00d9ff,
      metalness: 0.7,
      roughness: 0.3,
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.castShadow = true;
    aircraftGroup.add(fuselage);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(10, 0.2, 2);
    const wingMaterial = renderer.createMaterial('wing_material', {
      color: 0x00d9ff,
      metalness: 0.6,
      roughness: 0.4,
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.castShadow = true;
    aircraftGroup.add(wings);

    // Tail
    const tailGeometry = new THREE.BoxGeometry(0.2, 2, 2);
    const tailMaterial = renderer.createMaterial('tail_material', {
      color: 0xff00ff,
      metalness: 0.6,
      roughness: 0.4,
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = -2;
    tail.castShadow = true;
    aircraftGroup.add(tail);

    aircraftGroup.position.set(0, 50, 0);
    scene.add(aircraftGroup);

    // Create physics body for aircraft
    const aircraftPhysics = physics.createBody('aircraft', {
      mass: 1,
      shape: 'box',
      size: { x: 1, y: 1, z: 5 },
    });
    aircraftPhysics.position.set(0, 50, 0);

    // Create game object
    this.aircraft = {
      id: 'aircraft',
      mesh: aircraftGroup,
      update: (deltaTime: number) => this.updateAircraft(deltaTime),
    };

    this.engine.addGameObject('aircraft', this.aircraft);

    // Setup update loop
    this.engine.onUpdate((deltaTime: number) => {
      this.handleInput(deltaTime);
    });

    // Setup camera to follow aircraft
    this.engine.onUpdate(() => {
      if (aircraftGroup) {
        const camera = this.engine.getCamera();
        const distance = 30;
        const height = 10;
        camera.position.lerp(
          new THREE.Vector3(
            aircraftGroup.position.x - Math.sin(this.heading) * distance,
            aircraftGroup.position.y + height,
            aircraftGroup.position.z - Math.cos(this.heading) * distance
          ),
          0.1
        );
        camera.lookAt(aircraftGroup.position);
      }
    });
  }

  /**
   * Handle flight controls
   */
  private handleInput(deltaTime: number): void {
    const scriptEngine = this.scriptEngine;
    const maxSpeed = 200;
    const maxAltitude = 5000;

    // Throttle control (W/S)
    if (scriptEngine.isKeyPressed('w')) {
      this.throttle = Math.min(1, this.throttle + deltaTime);
    } else if (scriptEngine.isKeyPressed('s')) {
      this.throttle = Math.max(0, this.throttle - deltaTime);
    }

    // Apply throttle to speed
    this.speed = this.throttle * maxSpeed;

    // Pitch control (Arrow Up/Down)
    if (scriptEngine.isKeyPressed('arrowup')) {
      this.pitch = Math.min(Math.PI / 4, this.pitch + deltaTime);
    } else if (scriptEngine.isKeyPressed('arrowdown')) {
      this.pitch = Math.max(-Math.PI / 4, this.pitch - deltaTime);
    } else {
      this.pitch *= 0.95; // Damping
    }

    // Heading control (Arrow Left/Right)
    if (scriptEngine.isKeyPressed('arrowleft')) {
      this.heading += deltaTime * 2;
    } else if (scriptEngine.isKeyPressed('arrowright')) {
      this.heading -= deltaTime * 2;
    }

    // Roll control (A/D)
    if (scriptEngine.isKeyPressed('a')) {
      this.roll = Math.min(Math.PI / 6, this.roll + deltaTime);
    } else if (scriptEngine.isKeyPressed('d')) {
      this.roll = Math.max(-Math.PI / 6, this.roll - deltaTime);
    } else {
      this.roll *= 0.95; // Damping
    }

    // Update altitude based on pitch
    this.altitude += Math.sin(this.pitch) * this.speed * deltaTime;
    this.altitude = Math.max(0, Math.min(maxAltitude, this.altitude));
  }

  /**
   * Update aircraft position and rotation
   */
  private updateAircraft(deltaTime: number): void {
    if (!this.aircraft?.mesh) return;

    const mesh = this.aircraft.mesh as THREE.Group;

    // Update position
    mesh.position.x += Math.sin(this.heading) * this.speed * deltaTime;
    mesh.position.z += Math.cos(this.heading) * this.speed * deltaTime;
    mesh.position.y = this.altitude;

    // Update rotation
    mesh.rotation.x = this.pitch;
    mesh.rotation.y = this.heading;
    mesh.rotation.z = this.roll;

    // Gravity effect (if not at ground level)
    if (this.altitude > 0) {
      this.altitude -= 9.82 * deltaTime * 0.1;
    } else {
      this.altitude = 0;
      this.pitch = 0;
    }
  }

  /**
   * Get flight data
   */
  getFlightData() {
    return {
      speed: Math.round(this.speed),
      altitude: Math.round(this.altitude),
      heading: Math.round((this.heading * 180) / Math.PI),
      pitch: Math.round((this.pitch * 180) / Math.PI),
      roll: Math.round((this.roll * 180) / Math.PI),
      throttle: Math.round(this.throttle * 100),
    };
  }

  /**
   * Start game
   */
  start(): void {
    this.engine.start();
  }

  /**
   * Stop game
   */
  stop(): void {
    this.engine.stop();
  }

  /**
   * Dispose game
   */
  dispose(): void {
    this.engine.dispose();
    this.scriptEngine.dispose();
  }
}
