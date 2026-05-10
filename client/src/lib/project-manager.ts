/**
 * FCX Engine Project Manager
 * Handles project creation, loading, and asset management
 */

export interface ProjectAsset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'audio' | 'script' | 'scene';
  path: string;
  data?: any;
}

export interface FCXProject {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  modifiedAt: number;
  assets: ProjectAsset[];
  scenes: string[];
  scripts: string[];
  settings: {
    targetFPS: number;
    renderScale: number;
    physics: boolean;
  };
}

export class ProjectManager {
  private projects: Map<string, FCXProject> = new Map();
  private currentProject: FCXProject | null = null;
  private projectStorage: Map<string, FCXProject> = new Map();

  /**
   * Create new project
   */
  createProject(name: string, description: string = ''): FCXProject {
    const project: FCXProject = {
      id: `project_${Date.now()}`,
      name,
      description,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      assets: [],
      scenes: [],
      scripts: [],
      settings: {
        targetFPS: 60,
        renderScale: 1.0,
        physics: true,
      },
    };

    this.projects.set(project.id, project);
    this.projectStorage.set(project.id, project);
    return project;
  }

  /**
   * Open project
   */
  openProject(projectId: string): FCXProject | null {
    const project = this.projects.get(projectId);
    if (project) {
      this.currentProject = project;
      return project;
    }
    return null;
  }

  /**
   * Get current project
   */
  getCurrentProject(): FCXProject | null {
    return this.currentProject;
  }

  /**
   * Get all projects
   */
  getAllProjects(): FCXProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Add asset to project
   */
  addAsset(projectId: string, asset: Omit<ProjectAsset, 'id'>): ProjectAsset {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const newAsset: ProjectAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
    };

    project.assets.push(newAsset);
    project.modifiedAt = Date.now();

    return newAsset;
  }

  /**
   * Remove asset
   */
  removeAsset(projectId: string, assetId: string): void {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    project.assets = project.assets.filter((a) => a.id !== assetId);
    project.modifiedAt = Date.now();
  }

  /**
   * Get assets by type
   */
  getAssetsByType(projectId: string, type: ProjectAsset['type']): ProjectAsset[] {
    const project = this.projects.get(projectId);
    if (!project) return [];

    return project.assets.filter((a) => a.type === type);
  }

  /**
   * Create scene
   */
  createScene(projectId: string, sceneName: string): string {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const sceneId = `scene_${Date.now()}`;
    project.scenes.push(sceneId);
    project.modifiedAt = Date.now();

    return sceneId;
  }

  /**
   * Add script to project
   */
  addScript(projectId: string, scriptName: string, code: string): string {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const scriptId = `script_${Date.now()}`;
    project.scripts.push(scriptId);

    // Also add as asset
    this.addAsset(projectId, {
      name: scriptName,
      type: 'script',
      path: `/scripts/${scriptId}.js`,
      data: code,
    });

    project.modifiedAt = Date.now();
    return scriptId;
  }

  /**
   * Save project
   */
  saveProject(projectId: string): void {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    project.modifiedAt = Date.now();
    this.projectStorage.set(projectId, JSON.parse(JSON.stringify(project)));
  }

  /**
   * Export project as JSON
   */
  exportProject(projectId: string): string {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    return JSON.stringify(project, null, 2);
  }

  /**
   * Import project from JSON
   */
  importProject(jsonData: string): FCXProject {
    const project = JSON.parse(jsonData) as FCXProject;
    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Delete project
   */
  deleteProject(projectId: string): void {
    this.projects.delete(projectId);
    this.projectStorage.delete(projectId);

    if (this.currentProject?.id === projectId) {
      this.currentProject = null;
    }
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId: string) {
    const project = this.projects.get(projectId);
    if (!project) return null;

    return {
      totalAssets: project.assets.length,
      models: project.assets.filter((a) => a.type === 'model').length,
      textures: project.assets.filter((a) => a.type === 'texture').length,
      audio: project.assets.filter((a) => a.type === 'audio').length,
      scripts: project.scripts.length,
      scenes: project.scenes.length,
    };
  }
}
