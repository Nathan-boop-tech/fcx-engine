/**
 * FCX Engine Pro v2.0 - Advanced Script Editor
 * With AI coding partner, syntax highlighting, and real-time analysis
 */

import { useState } from 'react';
import { ChevronRight, Settings, Save } from 'lucide-react';
import AICodingPartner from './AICodingPartner';

interface AdvancedScriptEditorProps {
  initialCode?: string;
  language?: 'javascript' | 'lua' | 'simplic' | 'csharp';
  onSave?: (code: string) => void;
}

export default function AdvancedScriptEditor({
  initialCode = '',
  language = 'javascript',
  onSave,
}: AdvancedScriptEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [showAI, setShowAI] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleApplySuggestion = (suggestion: string) => {
    if (suggestion) {
      setCode(suggestion);
    }
  };

  const handleSave = () => {
    onSave?.(code);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card/30 backdrop-blur border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <select
            value={language}
            className="px-3 py-1 bg-secondary border border-border rounded font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="javascript">JavaScript</option>
            <option value="lua">Lua</option>
            <option value="simplic">SIMPLiC</option>
            <option value="csharp">C#</option>
          </select>

          <div className="w-px h-6 bg-border" />

          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className="px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-smooth"
          >
            {lineNumbers ? '№' : '—'}
          </button>

          <button
            onClick={() => setShowAI(!showAI)}
            className={`px-2 py-1 text-xs font-mono transition-smooth ${
              showAI
                ? 'text-primary bg-primary/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AI
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-foreground rounded font-mono text-xs transition-smooth flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Settings
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary hover:bg-primary/80 text-primary-foreground rounded font-mono text-xs transition-smooth flex items-center gap-1"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-card/30 backdrop-blur border border-border rounded-lg overflow-hidden">
          {/* Editor Header */}
          <div className="px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              {code.split('\n').length} lines
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {code.length} characters
            </span>
          </div>

          {/* Code Input */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            {lineNumbers && (
              <div className="w-12 bg-black/20 border-r border-border px-2 py-4 font-mono text-xs text-muted-foreground overflow-hidden">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 flex items-center justify-end pr-2">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            {/* Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 px-4 py-4 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none"
              placeholder="// Write your code here..."
              spellCheck="false"
            />
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>{language}</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* AI Coding Partner Panel */}
        {showAI && (
          <div className="w-96 flex flex-col bg-card/30 backdrop-blur border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-sm text-primary hud-readout">AI Coding Partner</h3>
              <button
                onClick={() => setShowAI(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <AICodingPartner
                code={code}
                language={language}
                onSuggestionApply={handleApplySuggestion}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      {code.length === 0 && (
        <div className="px-4 py-3 bg-blue-600/10 border border-blue-600/30 rounded-lg text-xs text-muted-foreground">
          <span className="text-blue-400">💡 Tip:</span> Start typing code and the AI will provide real-time
          suggestions, completions, and analysis.
        </div>
      )}
    </div>
  );
}
