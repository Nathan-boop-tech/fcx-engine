/**
 * Flight Control X - Project Launcher
 * Professional project management with grid view and game creation
 */

import { useState } from 'react';
import { Plus, FolderOpen, Upload, Settings, Search, User, Zap } from 'lucide-react';
import { ProjectManager, FCXProject } from '@/lib/project-manager';
import { createSampleProject } from '@/lib/sample-projects';

interface EngineLauncherRedesignedProps {
  onProjectSelected: (project: FCXProject) => void;
}

export default function EngineLauncherRedesigned({
  onProjectSelected,
}: EngineLauncherRedesignedProps) {
  const [projectManager] = useState(() => new ProjectManager());
  const [projects, setProjects] = useState<FCXProject[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    // Create project with sample data
    const sampleTemplate = createSampleProject(newProjectName, newProjectDesc);
    const project = projectManager.createProject(newProjectName, newProjectDesc);

    // Add sample assets and scenes
    project.assets = sampleTemplate.assets;
    project.scenes = sampleTemplate.scenes;

    setProjects([...projects, project]);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowCreateDialog(false);
  };

  const handleOpenProject = (project: FCXProject) => {
    projectManager.openProject(project.id);
    onProjectSelected(project);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-card/50 backdrop-blur border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-mono font-bold text-primary hud-readout">
              FCX Engine
            </h1>
          </div>
          <p className="text-xs text-muted-foreground font-mono">Lite v1.0</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono text-sm hover:bg-primary/30 transition-smooth">
            <Plus className="w-4 h-4" />
            New Project
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground font-mono text-sm hover:bg-secondary transition-smooth">
            <FolderOpen className="w-4 h-4" />
            Open Project
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground font-mono text-sm hover:bg-secondary transition-smooth">
            <Upload className="w-4 h-4" />
            Import Assets
          </button>

          <div className="my-4 border-t border-border" />

          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground font-mono text-sm hover:bg-secondary transition-smooth">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground font-mono text-sm hover:bg-secondary transition-smooth">
            <User className="w-4 h-4" />
            Profile
          </button>
          <p className="text-xs text-muted-foreground font-mono text-center mt-4">
            Powered by Acrylic Studios & Synthra Labs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-card/30 backdrop-blur border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-mono text-primary hud-readout">Project Hub</h2>
            <p className="text-xs text-muted-foreground font-mono">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 w-64">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Project Grid */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className="group relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-dashed border-primary rounded-lg hover:border-primary/80 hover:bg-primary/10 transition-all duration-300 flex flex-col items-center justify-center"
            >
              <Plus className="w-12 h-12 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-lg text-primary">New Project</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Create FCX Game
              </p>
            </button>

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className="group relative h-48 bg-card border border-border rounded-lg hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 p-6 text-left overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-mono text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <div>
                      <span className="text-primary">{project.assets.length}</span> Assets
                    </div>
                    <div>
                      <span className="text-primary">{project.scenes.length}</span> Scenes
                    </div>
                  </div>

                  {/* Last Edited */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">
                      Last edited: Today
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <FolderOpen className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Zap className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-mono text-foreground mb-2">No Projects Yet</h3>
              <p className="text-sm text-muted-foreground font-mono mb-6">
                Create your first FCX Engine project to get started
              </p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-sm hover:bg-primary/90 transition-smooth"
              >
                Create Project
              </button>
            </div>
          )}

          {/* No Search Results */}
          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-mono text-foreground mb-2">No Results</h3>
              <p className="text-sm text-muted-foreground font-mono">
                No projects match "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-card border-2 border-primary rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-mono text-primary hud-readout mb-6">
              Create New Project
            </h3>

            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg font-mono text-sm mb-3 focus:outline-none focus:border-primary transition-smooth"
            />

            <textarea
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg font-mono text-sm mb-6 focus:outline-none focus:border-primary transition-smooth h-24 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-mono text-sm hover:bg-primary/90 transition-smooth"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg font-mono text-sm hover:bg-secondary/80 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
