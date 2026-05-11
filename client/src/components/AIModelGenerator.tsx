/**
 * FCX Engine Pro v2.0 - AI Model Generator UI
 * Generate 3D models from text descriptions
 */

import { useState } from 'react';
import { Wand2, Download, Trash2 } from 'lucide-react';
import { AIModelGenerator as Generator } from '@/lib/engine/ai-model-generator';

interface GeneratedModel {
  id: string;
  name: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  style: 'geometric' | 'organic' | 'mechanical';
}

export default function AIModelGenerator() {
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [style, setStyle] = useState<'geometric' | 'organic' | 'mechanical'>('geometric');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
  const [generator] = useState(() => new Generator());

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);

    try {
      const model = generator.generateFromDescription({
        description,
        complexity,
        style,
      });

      const newModel: GeneratedModel = {
        id: model.id,
        name: model.name,
        description,
        complexity,
        style,
      };

      setGeneratedModels([...generatedModels, newModel]);
      setDescription('');
    } catch (error) {
      console.error('Error generating model:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setGeneratedModels(generatedModels.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-6">
        <h3 className="text-lg font-mono text-primary hud-readout mb-4">AI 3D Model Generator</h3>

        <div className="space-y-4">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Model Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'A futuristic spaceship', 'A tall tree with branches', 'A mechanical robot'"
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Complexity
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-smooth ${
                    complexity === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Style
            </label>
            <div className="flex gap-2">
              {(['geometric', 'organic', 'mechanical'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-smooth ${
                    style === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold rounded-lg transition-smooth flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Model'}
          </button>
        </div>
      </div>

      {/* Generated Models */}
      {generatedModels.length > 0 && (
        <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-6">
          <h3 className="text-lg font-mono text-primary hud-readout mb-4">
            Generated Models ({generatedModels.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedModels.map((model) => (
              <div
                key={model.id}
                className="bg-secondary/50 border border-border rounded-lg p-4 hover:border-primary transition-smooth"
              >
                {/* Model Preview */}
                <div className="w-full h-32 bg-black/30 rounded-lg mb-3 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="text-xs text-muted-foreground font-mono">{model.name}</div>
                  </div>
                </div>

                {/* Model Info */}
                <div className="space-y-2 mb-4 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <span className="text-foreground ml-2">{model.description}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Complexity:</span>
                    <span className="text-primary ml-2">{model.complexity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Style:</span>
                    <span className="text-primary ml-2">{model.style}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-mono text-xs transition-smooth flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-mono text-xs transition-smooth"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedModels.length === 0 && (
        <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-8 text-center">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-muted-foreground font-mono text-sm">
            No models generated yet. Describe a model above to get started!
          </p>
        </div>
      )}
    </div>
  );
}
