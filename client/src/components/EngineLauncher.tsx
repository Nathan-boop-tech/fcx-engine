/**
 * FCX Engine Launcher UI
 * Project creation and management
 */

import { useState } from 'react';
import { Plus, FolderOpen, Upload, Settings, Play } from 'lucide-react';
import { ProjectManager, FCXProject } from '@/lib/project-manager';

interface EngineLauncherProps {
  onProjectSelected: (project: FCXProject) => void;
}

export default function EngineLauncher({ onProjectSelected }: EngineLauncherProps) {
  const [projectManager] = useState(() => new ProjectManager());
  const [projects, setProjects] = useState<FCXProject[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const project = projectManager.createProject(newProjectName, newProjectDesc);
    setProjects([...projects, project]);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowCreateDialog(false);
  };

  const handleOpenProject = (project: FCXProject) => {
    projectManager.openProject(project.id);
    onProjectSelected(project);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-mono font-bold text-primary hud-readout">
              FCX Engine Lite
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              v1.0 | Professional Game Engine Editor
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-secondary rounded transition-smooth">
              <Settings className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-mono text-primary hud-readout mb-3">
              Welcome to FCX Engine
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              Create, edit, and test game projects with professional development tools
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* Create New Project */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className="group p-6 bg-card border-2 border-primary rounded-lg hover:border-primary/80 hover:bg-card/80 transition-smooth text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded group-hover:bg-primary/30 transition-smooth">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-mono text-lg text-foreground mb-1">Create New Project</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    Start a new FCX Engine project
                  </p>
                </div>
              </div>
            </button>

            {/* Open Project */}
            <button className="group p-6 bg-card border-2 border-cyan-400/30 rounded-lg hover:border-cyan-400 hover:bg-card/80 transition-smooth text-left">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-400/20 rounded group-hover:bg-cyan-400/30 transition-smooth">
                  <FolderOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-mono text-lg text-foreground mb-1">Open Project</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    Load existing FCX project
                  </p>
                </div>
              </div>
            </button>

            {/* Import Assets */}
            <button className="group p-6 bg-card border-2 border-amber-400/30 rounded-lg hover:border-amber-400 hover:bg-card/80 transition-smooth text-left">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-400/20 rounded group-hover:bg-amber-400/30 transition-smooth">
                  <Upload className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-mono text-lg text-foreground mb-1">Import Assets</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    Add models, textures, audio files
                  </p>
                </div>
              </div>
            </button>

            {/* Settings */}
            <button className="group p-6 bg-card border-2 border-green-400/30 rounded-lg hover:border-green-400 hover:bg-card/80 transition-smooth text-left">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-400/20 rounded group-hover:bg-green-400/30 transition-smooth">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-mono text-lg text-foreground mb-1">Settings</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    Engine preferences and configuration
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Recent Projects */}
          {projects.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-mono text-primary hud-readout mb-4">Recent Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    className="p-4 bg-card border border-border rounded hover:border-primary hover:bg-card/80 transition-smooth text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-mono text-foreground group-hover:text-primary transition-smooth">
                          {project.name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground font-mono">
                          <span>Assets: {project.assets.length}</span>
                          <span>Scenes: {project.scenes.length}</span>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border-2 border-primary rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-mono text-primary hud-readout mb-4">
              Create New Project
            </h3>

            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded font-mono text-sm mb-3 focus:outline-none focus:border-primary"
            />

            <textarea
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded font-mono text-sm mb-4 focus:outline-none focus:border-primary h-24 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:bg-primary/90 transition-smooth"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 bg-secondary text-foreground rounded font-mono text-sm hover:bg-secondary/80 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-card/50 backdrop-blur border-t border-border px-8 py-4 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Powered by Synthra Labs × Acrylic Studios
        </p>
      </div>
    </div>
  );
}
