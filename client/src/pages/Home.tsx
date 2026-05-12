/**
 * Flight Control X - Professional Game Engine
 * Complete 3D game engine with AI coding partner, physics, and playable games
 * 
 * App Flow:
 * 1. Splash Screen - Boot animation
 * 2. Launcher - Project management and game creation
 * 3. Editor - 3D game editor with AI coding partner
 * 4. Play Mode - Fully playable games with real physics
 * 
 * Features:
 * - AI 3D Model Generator
 * - AI Coding Partner
 * - Real-time Physics Engine
 * - Advanced 3D Rendering
 * - Game Creation Wizard
 * - Multiple Game Templates
 */

import { useState } from 'react';
import { FCXProject } from '@/lib/project-manager';
import SplashScreenBoot from '@/components/SplashScreenBoot';
import EngineLauncherRedesigned from '@/components/EngineLauncherRedesigned';
import GameEditorWorkspace from '@/components/GameEditorWorkspace';
import FlightSimulatorGame from '@/components/FlightSimulatorGame';

type AppState = 'splash' | 'launcher' | 'editor' | 'play_flight_sim';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [selectedProject, setSelectedProject] = useState<FCXProject | null>(null);

  const handleSplashComplete = () => {
    setAppState('launcher');
  };

  const handleProjectSelected = (project: FCXProject) => {
    setSelectedProject(project);
    setAppState('editor');
  };

  const handleCloseEditor = () => {
    setAppState('launcher');
    setSelectedProject(null);
  };

  const handlePlayGame = (gameType: string) => {
    if (gameType === 'flight_sim') {
      setAppState('play_flight_sim');
    }
  };

  const handleCloseGame = () => {
    setAppState('editor');
  };

  return (
    <>
      {appState === 'splash' && (
        <SplashScreenBoot onComplete={handleSplashComplete} />
      )}
      {appState === 'launcher' && (
        <EngineLauncherRedesigned onProjectSelected={handleProjectSelected} />
      )}
      {appState === 'editor' && selectedProject && (
        <GameEditorWorkspace 
          project={selectedProject} 
          onClose={handleCloseEditor}
          onPlayGame={handlePlayGame}
        />
      )}
      {appState === 'play_flight_sim' && (
        <FlightSimulatorGame onClose={handleCloseGame} />
      )}
    </>
  );
}
