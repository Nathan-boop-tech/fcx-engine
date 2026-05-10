/**
 * Home Page - FCX Engine Lite v1.0
 * Professional Game Engine Editor
 * 
 * App Flow:
 * 1. Launcher UI - Project management
 * 2. Engine Editor - Full workspace with all panels
 */

import { useState } from 'react';
import { FCXProject } from '@/lib/project-manager';
import EngineLauncher from '@/components/EngineLauncher';
import EngineEditor from '@/components/EngineEditor';

type AppState = 'launcher' | 'editor';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('launcher');
  const [selectedProject, setSelectedProject] = useState<FCXProject | null>(null);

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
      {appState === 'launcher' && (
        <EngineLauncher onProjectSelected={handleProjectSelected} />
      )}
      {appState === 'editor' && selectedProject && (
        <EngineEditor project={selectedProject} onClose={handleCloseEditor} />
      )}
    </>
  );
}
