/**
 * 3D Scene Viewport
 * Interactive 3D world editor with orbit camera and gizmos
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Grid3x3, Move, RotateCw, Maximize2 } from 'lucide-react';

interface SceneViewportProps {
  onObjectSelected: (objectId: string) => void;
}

export default function SceneViewport({ onObjectSelected }: SceneViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);
  const [gizmoMode, setGizmoMode] = useState<'move' | 'rotate' | 'scale'>('move');
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(200, 20, 0x00d9ff, 0x444444);
    scene.add(gridHelper);

    // Sample objects
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x00d9ff });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Orbit camera controls (simplified)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Orbit camera
      const radius = camera.position.length();
      const theta = Math.atan2(camera.position.x, camera.position.z);
      const phi = Math.acos(camera.position.y / radius);

      const newTheta = theta - deltaX * 0.01;
      const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01));

      camera.position.x = radius * Math.sin(newPhi) * Math.sin(newTheta);
      camera.position.y = radius * Math.cos(newPhi);
      camera.position.z = radius * Math.sin(newPhi) * Math.cos(newTheta);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const direction = camera.position.clone().normalize();
      const distance = camera.position.length();
      const newDistance = Math.max(10, Math.min(500, distance + e.deltaY * zoomSpeed));
      camera.position.copy(direction.multiplyScalar(newDistance));
    });

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate cube
      cube.rotation.x += 0.001;
      cube.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Toolbar */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => setGizmoMode('move')}
          className={`p-2 rounded transition-smooth ${
            gizmoMode === 'move'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary text-foreground'
          }`}
          title="Move (M)"
        >
          <Move className="w-4 h-4" />
        </button>

        <button
          onClick={() => setGizmoMode('rotate')}
          className={`p-2 rounded transition-smooth ${
            gizmoMode === 'rotate'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary text-foreground'
          }`}
          title="Rotate (R)"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded transition-smooth ${
            showGrid
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary text-foreground'
          }`}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button className="p-2 hover:bg-secondary rounded transition-smooth text-foreground">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1"
        style={{ display: 'block' }}
      />

      {/* Info */}
      <div className="bg-card/50 border-t border-border px-4 py-2 text-xs font-mono text-muted-foreground">
        <div>Gizmo: {gizmoMode.toUpperCase()} | Grid: {showGrid ? 'ON' : 'OFF'} | Drag to Orbit | Scroll to Zoom</div>
      </div>
    </div>
  );
}
