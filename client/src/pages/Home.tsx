/**
 * Home Page - FCX Engine Lite v1.0
 * Professional Game Engine Editor
 * 
 * App Flow:
 * 1. Splash Screen - Boot animation (3-5 seconds)
 * 2. Launcher UI - Project management with grid
 * 3. Engine Editor - Full workspace with all panels
 */

import { useState } from 'react';
import { FCXProject } from '@/lib/project-manager';
import SplashScreenBoot from '@/components/SplashScreenBoot';
import EngineLauncherRedesigned from '@/components/EngineLauncherRedesigned';
import EngineEditor from '@/components/EngineEditor';

type AppState = 'splash' | 'launcher' | 'editor';

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

  return (
    <>
      {appState === 'splash' && (
        <SplashScreenBoot onComplete={handleSplashComplete} />
      )}
      {appState === 'launcher' && (
        <EngineLauncherRedesigned onProjectSelected={handleProjectSelected} />
      )}
      {appState === 'editor' && selectedProject && (
        <EngineEditor project={selectedProject} onClose={handleCloseEditor} />
      )}
    </>
  );
}
