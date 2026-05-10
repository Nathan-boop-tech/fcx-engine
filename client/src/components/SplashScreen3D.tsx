/**
 * 3D Splash Screen Component
 * Animated rotating aircraft silhouette with 3D transition theme
 * FCX Engine Lite v2.0
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SplashScreen3DProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen3D({ onComplete, duration = 4000 }: SplashScreen3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1419);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00d9ff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Create aircraft model
    const aircraftGroup = new THREE.Group();

    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(2, 2, 20, 8);
    const fuselageMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.4,
      metalness: 0.6,
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    aircraftGroup.add(fuselage);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(40, 1, 8);
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.3,
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    aircraftGroup.add(wings);

    // Tail
    const tailGeometry = new THREE.BoxGeometry(2, 8, 6);
    const tail = new THREE.Mesh(tailGeometry, wingMaterial);
    tail.position.z = -8;
    tail.position.y = 2;
    aircraftGroup.add(tail);

    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const cockpitMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xff6b00,
      emissiveIntensity: 0.4,
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.z = 8;
    cockpit.position.y = 2;
    aircraftGroup.add(cockpit);

    scene.add(aircraftGroup);

    // Animation loop
    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Rotate aircraft
      aircraftGroup.rotation.y += 0.01;
      aircraftGroup.rotation.x = Math.sin(elapsed / 1000) * 0.3;

      // Fade in effect
      aircraftGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = Math.min(progress * 1.5, 1);
        }
      });

      renderer.render(scene, camera);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Auto-transition
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, duration);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ display: 'block' }}
      />

      {/* Content overlay */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-mono font-bold text-primary mb-4 hud-readout">
          Flight Control X
        </h1>
        <p className="text-lg font-mono text-cyan-400 mb-8">
          FCX Engine Lite v2.0
        </p>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Transitioning to 3D Simulation Core
        </p>

        {/* Loading indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="text-xs font-mono text-muted-foreground">
          Powered by Synthra Labs × Acrylic Studios
        </p>
      </div>
    </div>
  );
}
