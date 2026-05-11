/**
 * FCX Engine Pro v2.0 - AI Coding Partner UI
 * Real-time code analysis, suggestions, and debugging
 */

import { useState, useEffect } from 'react';
import { Zap, AlertCircle, Lightbulb, TrendingUp, Code, Bug, Wand2 } from 'lucide-react';
import { AICodingPartner } from '@/lib/engine/ai-coding-partner';

interface AICodingPartnerProps {
  code: string;
  language?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

export default function AICodingPartnerUI({
  code,
  language = 'javascript',
  onSuggestionApply,
}: AICodingPartnerProps) {
  const [partner] = useState(() => new AICodingPartner());
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'completions' | 'performance'>('analysis');
  const [completions, setCompletions] = useState<any[]>([]);
  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);

  useEffect(() => {
    if (code) {
      const result = partner.analyzeCode(code, language);
      setAnalysis(result);

      const issues = partner.detectPerformanceIssues(code);
      setPerformanceIssues(issues);
    }
  }, [code, language, partner]);

  if (!analysis) {
    return (
      <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-4 text-center">
        <p className="text-muted-foreground font-mono text-sm">Analyzing code...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quality Score */}
      <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-sm text-primary hud-readout">Code Quality</h3>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{Math.round(analysis.score)}</div>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Quality Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              analysis.score >= 80
                ? 'bg-green-500'
                : analysis.score >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
          <div className="bg-secondary/50 rounded p-2">
            <div className="text-muted-foreground">Lines</div>
            <div className="text-foreground font-bold">{analysis.metrics.lines}</div>
          </div>
          <div className="bg-secondary/50 rounded p-2">
            <div className="text-muted-foreground">Complexity</div>
            <div className="text-foreground font-bold">{analysis.metrics.complexity}</div>
          </div>
          <div className="bg-secondary/50 rounded p-2">
            <div className="text-muted-foreground">Functions</div>
            <div className="text-foreground font-bold">{analysis.metrics.functions}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['analysis', 'suggestions', 'completions', 'performance'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-mono text-xs transition-smooth border-b-2 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'analysis' && <AlertCircle className="w-4 h-4 inline mr-1" />}
            {tab === 'suggestions' && <Lightbulb className="w-4 h-4 inline mr-1" />}
            {tab === 'completions' && <Code className="w-4 h-4 inline mr-1" />}
            {tab === 'performance' && <TrendingUp className="w-4 h-4 inline mr-1" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card/30 backdrop-blur border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-3">
            {analysis.issues.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                <p>✓ No issues found!</p>
              </div>
            ) : (
              analysis.issues.map((issue: any) => (
                <div
                  key={issue.id}
                  className={`p-3 rounded-lg border ${
                    issue.severity === 'error'
                      ? 'bg-red-600/10 border-red-600/30'
                      : issue.severity === 'warning'
                        ? 'bg-yellow-600/10 border-yellow-600/30'
                        : 'bg-blue-600/10 border-blue-600/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Bug className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-mono text-xs font-bold">
                        {issue.severity.toUpperCase()} at line {issue.line}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{issue.message}</div>
                      {issue.fix && (
                        <button
                          onClick={() => onSuggestionApply?.(issue.fix)}
                          className="mt-2 px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded text-xs font-mono transition-smooth"
                        >
                          Apply Fix
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {analysis.suggestions.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                <p>No suggestions at this time</p>
              </div>
            ) : (
              analysis.suggestions.map((suggestion: any) => (
                <div key={suggestion.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-mono text-xs font-bold text-foreground">
                        {suggestion.type.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{suggestion.message}</div>
                      <div className="text-xs text-muted-foreground mt-2">{suggestion.explanation}</div>
                      {suggestion.code && (
                        <div className="mt-2 p-2 bg-black/30 rounded font-mono text-xs text-cyan-400 overflow-x-auto">
                          {suggestion.code}
                        </div>
                      )}
                      <button
                        onClick={() => onSuggestionApply?.(suggestion.code)}
                        className="mt-2 px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded text-xs font-mono transition-smooth"
                      >
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Completions Tab */}
        {activeTab === 'completions' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              Start typing to see code completions
            </p>
            <div className="space-y-1">
              {partner.getCompletions(code, code.length).map((completion: any, i) => (
                <div
                  key={i}
                  className="p-2 rounded hover:bg-primary/20 cursor-pointer transition-smooth text-xs font-mono"
                >
                  <div className="text-foreground">{completion.label}</div>
                  <div className="text-muted-foreground text-xs">{completion.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-3">
            {performanceIssues.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                <p>✓ No performance issues detected</p>
              </div>
            ) : (
              performanceIssues.map((issue, i) => (
                <div key={i} className="p-3 rounded-lg bg-yellow-600/10 border border-yellow-600/30">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">{issue}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-mono text-xs transition-smooth flex items-center justify-center gap-1">
          <Wand2 className="w-4 h-4" />
          Optimize Code
        </button>
        <button className="flex-1 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-mono text-xs transition-smooth flex items-center justify-center gap-1">
          <Code className="w-4 h-4" />
          Generate Docs
        </button>
      </div>
    </div>
  );
}
