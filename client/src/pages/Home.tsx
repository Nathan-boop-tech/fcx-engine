/**
 * Home Page - Main Application Entry Point
 * Professional Aviation Cockpit Minimalism: Complete app flow with splash, loading, dashboard, and simulator
 * 
 * App Flow:
 * 1. Splash Screen (3-5 seconds) - Animated logo with radar sweep
 * 2. Loading Screen (3 seconds) - Progress bar with loading steps
 * 3. Dashboard - Main control panel with three action cards
 * 4. Flight Simulator - Interactive 2D flight simulation
 */

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoadingScreen from '@/components/LoadingScreen';
import Dashboard from '@/components/Dashboard';
import FlightSimulator from '@/components/FlightSimulator';

type AppState = 'splash' | 'loading' | 'dashboard' | 'simulator';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');

  const handleSplashComplete = () => {
    setAppState('loading');
  };

  const handleLoadingComplete = () => {
    setAppState('dashboard');
  };

  const handleLaunchSimulation = () => {
    setAppState('simulator');
  };

  const handleExitSimulation = () => {
    setAppState('dashboard');
  };

  return (
    <>
      {appState === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {appState === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {appState === 'dashboard' && <Dashboard onLaunchSimulation={handleLaunchSimulation} />}
      {appState === 'simulator' && <FlightSimulator onClose={handleExitSimulation} />}
    </>
  );
}
