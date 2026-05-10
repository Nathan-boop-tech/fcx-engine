/**
 * Home Page - FCX Engine Lite v2.0
 * 3D Flight Simulation Engine with Real-Time Rendering
 * 
 * App Flow:
 * 1. Splash Screen (3D) - Animated rotating aircraft
 * 2. Engine Boot Sequence - Real engine startup
 * 3. Dashboard (Engine Control Center) - Main menu
 * 4. Flight Simulator / Physics Sandbox / World Editor / Debug Console
 */

import { useState } from 'react';
import SplashScreen3D from '@/components/SplashScreen3D';
import EngineBootSequence from '@/components/EngineBootSequence';
import Dashboard3D from '@/components/Dashboard3D';
import FlightSimulator3D from '@/components/FlightSimulator3D';
import PhysicsSandbox from '@/components/PhysicsSandbox';
import WorldEditor from '@/components/WorldEditor';
import EngineDebugConsole from '@/components/EngineDebugConsole';

type AppState = 'splash' | 'boot' | 'dashboard' | 'simulator' | 'sandbox' | 'editor' | 'console';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');

  const handleSplashComplete = () => {
    setAppState('boot');
  };

  const handleBootComplete = () => {
    setAppState('dashboard');
  };

  const handleLaunchSimulator = () => {
    setAppState('simulator');
  };

  const handleLaunchPhysicsSandbox = () => {
    setAppState('sandbox');
  };

  const handleLaunchWorldEditor = () => {
    setAppState('editor');
  };

  const handleLaunchDebugConsole = () => {
    setAppState('console');
  };

  const handleExitToDashboard = () => {
    setAppState('dashboard');
  };

  return (
    <>
      {appState === 'splash' && <SplashScreen3D onComplete={handleSplashComplete} />}
      {appState === 'boot' && <EngineBootSequence onComplete={handleBootComplete} />}
      {appState === 'dashboard' && (
        <Dashboard3D
          onLaunchSimulator={handleLaunchSimulator}
          onLaunchPhysicsSandbox={handleLaunchPhysicsSandbox}
          onLaunchWorldEditor={handleLaunchWorldEditor}
          onLaunchDebugConsole={handleLaunchDebugConsole}
        />
      )}
      {appState === 'simulator' && <FlightSimulator3D onClose={handleExitToDashboard} />}
      {appState === 'sandbox' && <PhysicsSandbox onClose={handleExitToDashboard} />}
      {appState === 'editor' && <WorldEditor onClose={handleExitToDashboard} />}
      {appState === 'console' && <EngineDebugConsole onClose={handleExitToDashboard} />}
    </>
  );
}
