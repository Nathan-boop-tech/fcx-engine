/**
 * FCX Engine Pro - Game Editor Viewport
 * 3D scene editing with gizmos and selection
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GameEngine } from '@/lib/engine/game-engine';
import { AssetManager } from '@/lib/engine/assets';

interface GameEditorViewportProps {
  width: number;
  height: number;
  onObjectSelected?: (objectId: string) => void;
}

export default function GameEditorViewport({
  width,
  height,
  onObjectSelected,
}: GameEditorViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const assetManagerRef = useRef<AssetManager | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize engine
    const engine = new GameEngine({
      canvas: canvasRef.current,
      width,
      height,
      targetFPS: 60,
    });

    const assetManager = new AssetManager();

    engineRef.current = engine;
    assetManagerRef.current = assetManager;

    // Create ground plane
    const groundMaterial = engine.getRenderer().createMaterial('ground_material', {
      color: 0x2d3748,
      roughness: 0.8,
    });
    const ground = engine.getRenderer().createPlane('ground', 500, 500, groundMaterial);
    ground.position.y = 0;
    ground.receiveShadow = true;

    // Create some sample objects
    const boxMaterial = engine.getRenderer().createMaterial('box_material', {
      color: 0x00d9ff,
      metalness: 0.6,
      roughness: 0.4,
    });
    const box = engine.getRenderer().createBox('box1', 2, 2, 2, boxMaterial);
    box.position.set(0, 5, 0);
    box.castShadow = true;

    const sphereMaterial = engine.getRenderer().createMaterial('sphere_material', {
      color: 0xff00ff,
      metalness: 0.4,
      roughness: 0.6,
    });
    const sphere = engine.getRenderer().createSphere('sphere1', 2, 32, 32, sphereMaterial);
    sphere.position.set(10, 5, 0);
    sphere.castShadow = true;

    // Add physics bodies
    const physicsBox = engine.getPhysics().createBody('box1_physics', {
      mass: 1,
      shape: 'box',
      size: { x: 2, y: 2, z: 2 },
    });
    physicsBox.position.set(0, 5, 0);
    engine.getPhysics().linkMesh('box1_physics', box);

    const physicsSphere = engine.getPhysics().createBody('sphere1_physics', {
      mass: 1,
      shape: 'sphere',
      radius: 2,
    });
    physicsSphere.position.set(10, 5, 0);
    engine.getPhysics().linkMesh('sphere1_physics', sphere);

    // Setup camera controls
    const camera = engine.getCamera();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvasRef.current.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };

      // Raycast for object selection
      mouseRef.current.x = (e.clientX / width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const scene = engine.getScene();
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const selected = intersects[0].object;
        setSelectedObject(selected.name || selected.uuid);
        onObjectSelected?.(selected.name || selected.uuid);
      }
    });

    canvasRef.current.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.01);
        camera.position.applyAxisAngle(
          camera.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0)),
          deltaY * 0.01
        );
        camera.lookAt(0, 5, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    canvasRef.current.addEventListener('mouseup', () => {
      isDragging = false;
    });

    canvasRef.current.addEventListener('wheel', (e) => {
      e.preventDefault();
      const direction = camera.position.clone().normalize();
      const distance = camera.position.length();
      const newDistance = distance + e.deltaY * 0.1;
      camera.position.copy(direction.multiplyScalar(Math.max(10, newDistance)));
      camera.lookAt(0, 5, 0);
    });

    // Start engine
    engine.start();

    // Handle window resize
    const handleResize = () => {
      engine.onWindowResize(window.innerWidth - 300, window.innerHeight - 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [width, height, onObjectSelected]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-border">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Viewport Info Overlay */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-4 py-2 rounded-lg font-mono text-xs text-cyan-400">
        <div>3D Viewport</div>
        <div className="text-muted-foreground">Drag to rotate • Scroll to zoom</div>
        {selectedObject && (
          <div className="text-primary mt-1">Selected: {selectedObject}</div>
        )}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-4 py-2 rounded-lg font-mono text-xs text-muted-foreground">
        <div>60 FPS</div>
        <div>3 Objects</div>
      </div>
    </div>
  );
}
