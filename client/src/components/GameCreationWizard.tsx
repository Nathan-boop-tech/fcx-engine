/**
 * FCX Engine Pro v2.0 - Game Creation Wizard UI
 * Complete workflow for creating fully functional games
 */

import { useState } from 'react';
import { Play, Code, Zap, Download } from 'lucide-react';
import { GameCreationWizard as Wizard } from '@/lib/engine/game-creation-wizard';

interface CreatedGame {
  id: string;
  name: string;
  template: string;
  status: 'creating' | 'ready' | 'testing';
}

export default function GameCreationWizard() {
  const [step, setStep] = useState<'select' | 'configure' | 'review' | 'complete'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [gameName, setGameName] = useState('');
  const [createdGames, setCreatedGames] = useState<CreatedGame[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [wizard] = useState(() => new Wizard());

  const templates = wizard.getTemplates();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('configure');
  };

  const handleCreateGame = async () => {
    if (!selectedTemplate || !gameName.trim()) return;

    setIsCreating(true);

    try {
      const template = wizard.getTemplate(selectedTemplate);
      if (!template) return;

      const result = await wizard.createGame({
        projectId: 'current_project',
        gameName,
        template,
      });

      if (result.success) {
        const newGame: CreatedGame = {
          id: result.gameId,
          name: gameName,
          template: selectedTemplate,
          status: 'ready',
        };

        setCreatedGames([...createdGames, newGame]);
        setStep('complete');
        setGameName('');
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex gap-4 mb-6">
        {(['select', 'configure', 'review', 'complete'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : step > s
                    ? 'bg-green-600 text-white'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 3 && <div className="w-8 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Template */}
      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-primary hud-readout">Select Game Template</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="bg-card/30 backdrop-blur border border-border rounded-lg p-4 hover:border-primary transition-smooth text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-mono font-bold text-foreground">{template.name}</h4>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded font-mono">
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs text-muted-foreground">
                  Category: <span className="text-primary">{template.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Configure Game */}
      {step === 'configure' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-primary hud-readout">Configure Your Game</h3>

          <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-6 space-y-4">
            {/* Game Name */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Game Name
              </label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter your game name"
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Template Info */}
            {selectedTemplate && (
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Selected Template
                </label>
                <div className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground font-mono">
                  {wizard.getTemplate(selectedTemplate)?.name}
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Included Features
              </label>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>3D Rendering</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Physics Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Game Scripting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>AI Model Generation</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setStep('select')}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-mono text-sm transition-smooth"
              >
                Back
              </button>
              <button
                onClick={() => setStep('review')}
                disabled={!gameName.trim()}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground rounded-lg font-mono text-sm transition-smooth"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-primary hud-readout">Review & Create</h3>

          <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-3 text-sm font-mono">
              <div>
                <span className="text-muted-foreground">Game Name:</span>
                <span className="text-foreground ml-2">{gameName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Template:</span>
                <span className="text-primary ml-2">{wizard.getTemplate(selectedTemplate!)?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Engine:</span>
                <span className="text-primary ml-2">FCX Engine Pro v2.0</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Your game will include all core systems:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  <span>Real Physics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-3 h-3 text-primary" />
                  <span>Full Scripting</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setStep('configure')}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-mono text-sm transition-smooth"
              >
                Back
              </button>
              <button
                onClick={handleCreateGame}
                disabled={isCreating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white rounded-lg font-mono text-sm transition-smooth flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isCreating ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && (
        <div className="space-y-4">
          <h3 className="text-lg font-mono text-primary hud-readout">Game Created!</h3>

          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p className="font-mono text-foreground mb-2">{gameName}</p>
            <p className="text-xs text-muted-foreground">
              Your game is ready to play and edit!
            </p>
          </div>

          {/* Created Games List */}
          {createdGames.length > 0 && (
            <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-4">
              <h4 className="font-mono text-sm text-primary mb-3">Your Games</h4>
              <div className="space-y-2">
                {createdGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="text-xs font-mono">
                      <div className="text-foreground">{game.name}</div>
                      <div className="text-muted-foreground">{game.template}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded text-xs font-mono transition-smooth">
                        <Play className="w-3 h-3" />
                      </button>
                      <button className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground rounded text-xs font-mono transition-smooth">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep('select');
                setGameName('');
                setSelectedTemplate(null);
              }}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg font-mono text-sm transition-smooth"
            >
              Create Another Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
