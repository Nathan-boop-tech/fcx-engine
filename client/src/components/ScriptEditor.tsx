/**
 * Script Editor Panel
 * Multi-language support: JavaScript, Lua, C#, CSS#, SIMPLiC
 */

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Copy } from 'lucide-react';
import { SIMPLiCEngine } from '@/lib/simplic-engine';

interface ScriptEditorProps {
  onScriptSaved: (code: string) => void;
}

export default function ScriptEditor({ onScriptSaved }: ScriptEditorProps) {
  const [language, setLanguage] = useState<'javascript' | 'lua' | 'csharp' | 'simplic'>('simplic');
  const [code, setCode] = useState(
    `ON START
LOG "Script started"

ON CLICK "StartButton"
SPAWN OBJECT "Airplane"
START ENGINE "Airplane"
TAKEOFF "Airplane"`
  );
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const simplic = new SIMPLiCEngine();

  const handleExecute = () => {
    setOutput([]);
    setErrors([]);

    if (language === 'simplic') {
      const validation = simplic.validateScript(code);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      const script = simplic.parseScript(code);
      simplic.registerScript('main', script);

      // Execute START event
      simplic.on('LOG', (command: any) => {
        setOutput((prev) => [...prev, command.params.message]);
      });

      simplic.executeEvent('START');
    } else {
      setOutput(['Script execution not yet implemented for this language']);
    }
  };

  const handleSave = () => {
    onScriptSaved(code);
    setOutput(['Script saved successfully']);
  };

  const getMonacoLanguage = () => {
    switch (language) {
      case 'javascript':
        return 'javascript';
      case 'lua':
        return 'lua';
      case 'csharp':
        return 'csharp';
      case 'simplic':
        return 'plaintext';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="font-mono text-sm text-primary hud-readout">Script Editor</h3>

        {/* Language Selector */}
        <div className="flex gap-2">
          {(['javascript', 'lua', 'csharp', 'simplic'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded font-mono text-xs transition-smooth ${
                language === lang
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {lang === 'simplic' ? 'SIMPLiC' : lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: 'IBM Plex Mono',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="border-t border-border px-4 py-2 flex gap-2 bg-secondary/30">
        <button
          onClick={handleExecute}
          className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded font-mono text-xs hover:bg-primary/90 transition-smooth"
        >
          <Play className="w-3 h-3" />
          Execute
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1 bg-secondary text-foreground rounded font-mono text-xs hover:bg-secondary/80 transition-smooth"
        >
          <Save className="w-3 h-3" />
          Save
        </button>

        <button className="flex items-center gap-2 px-3 py-1 bg-secondary text-foreground rounded font-mono text-xs hover:bg-secondary/80 transition-smooth">
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>

      {/* Output Console */}
      <div className="h-32 border-t border-border bg-black/50 flex flex-col">
        <div className="px-4 py-2 border-b border-border">
          <p className="font-mono text-xs text-muted-foreground">Console Output</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
          {errors.length > 0 && (
            <div>
              {errors.map((error, idx) => (
                <div key={idx} className="text-red-400">
                  ✗ {error}
                </div>
              ))}
            </div>
          )}

          {output.length > 0 && (
            <div>
              {output.map((line, idx) => (
                <div key={idx} className="text-green-400">
                  &gt; {line}
                </div>
              ))}
            </div>
          )}

          {output.length === 0 && errors.length === 0 && (
            <div className="text-muted-foreground">Ready to execute...</div>
          )}
        </div>
      </div>
    </div>
  );
}
