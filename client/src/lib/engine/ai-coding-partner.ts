/**
 * FCX Engine Pro v2.0 - AI Coding Partner
 * Intelligent code analysis, suggestions, debugging, and optimization
 */

export interface CodeAnalysisResult {
  score: number; // 0-100
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
}

export interface CodeIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  line: number;
  column: number;
  message: string;
  fix?: string;
}

export interface CodeSuggestion {
  id: string;
  type: 'optimization' | 'refactor' | 'feature' | 'documentation';
  message: string;
  code?: string;
  explanation: string;
}

export interface CodeMetrics {
  lines: number;
  complexity: number;
  functions: number;
  variables: number;
  comments: number;
  maintainability: number;
}

export interface CompletionItem {
  label: string;
  kind: 'function' | 'variable' | 'keyword' | 'class' | 'method';
  detail: string;
  documentation: string;
  insertText: string;
}

export class AICodingPartner {
  private analysisHistory: Map<string, CodeAnalysisResult> = new Map();
  private commonPatterns: Map<string, string[]> = new Map();
  private builtInFunctions: Set<string> = new Set();
  private keywords: Set<string> = new Set();

  constructor() {
    this.initializeKnowledge();
  }

  /**
   * Initialize built-in knowledge
   */
  private initializeKnowledge(): void {
    // JavaScript built-in functions
    this.builtInFunctions = new Set([
      'console.log',
      'Math.sin',
      'Math.cos',
      'Math.sqrt',
      'Array.map',
      'Array.filter',
      'Array.reduce',
      'Object.keys',
      'JSON.parse',
      'JSON.stringify',
      'setTimeout',
      'setInterval',
      'fetch',
      'Promise.all',
      'async',
      'await',
    ]);

    // JavaScript keywords
    this.keywords = new Set([
      'if',
      'else',
      'for',
      'while',
      'function',
      'const',
      'let',
      'var',
      'return',
      'class',
      'extends',
      'import',
      'export',
      'async',
      'await',
      'try',
      'catch',
      'finally',
      'throw',
      'new',
      'this',
      'super',
    ]);

    // Common patterns
    this.commonPatterns.set('event-handler', [
      'addEventListener',
      'onClick',
      'onMouseMove',
      'onKeyDown',
    ]);
    this.commonPatterns.set('state-management', ['useState', 'useReducer', 'useContext']);
    this.commonPatterns.set('api-call', ['fetch', 'axios', 'XMLHttpRequest']);
    this.commonPatterns.set('loop', ['for', 'while', 'forEach', 'map', 'filter']);
  }

  /**
   * Analyze code
   */
  analyzeCode(code: string, language: string = 'javascript'): CodeAnalysisResult {
    const issues: CodeIssue[] = [];
    const suggestions: CodeSuggestion[] = [];
    const metrics = this.calculateMetrics(code);

    // Detect common issues
    issues.push(...this.detectCommonIssues(code));

    // Generate suggestions
    suggestions.push(...this.generateSuggestions(code));

    // Calculate quality score
    const score = Math.max(0, 100 - issues.length * 10 - suggestions.length * 2);

    const result: CodeAnalysisResult = {
      score,
      issues,
      suggestions,
      metrics,
    };

    this.analysisHistory.set(`${Date.now()}`, result);
    return result;
  }

  /**
   * Detect common issues
   */
  private detectCommonIssues(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for console.log in production
      if (line.includes('console.log') && !line.includes('//')) {
        issues.push({
          id: `issue_${lineNumber}_1`,
          severity: 'warning',
          line: lineNumber,
          column: line.indexOf('console.log'),
          message: 'Remove console.log from production code',
          fix: line.replace('console.log', '// console.log'),
        });
      }

      // Check for var usage
      if (/\bvar\s+\w+/.test(line) && !line.includes('//')) {
        issues.push({
          id: `issue_${lineNumber}_2`,
          severity: 'warning',
          line: lineNumber,
          column: line.indexOf('var'),
          message: 'Use const or let instead of var',
          fix: line.replace('var ', 'const '),
        });
      }

      // Check for empty catch blocks
      if (line.includes('catch') && lines[index + 1]?.includes('}')) {
        issues.push({
          id: `issue_${lineNumber}_3`,
          severity: 'error',
          line: lineNumber,
          column: line.indexOf('catch'),
          message: 'Empty catch block - handle the error',
        });
      }

      // Check for missing error handling
      if (line.includes('fetch(') && !code.includes('.catch')) {
        issues.push({
          id: `issue_${lineNumber}_4`,
          severity: 'warning',
          line: lineNumber,
          column: line.indexOf('fetch'),
          message: 'Missing error handling for fetch call',
          fix: `${line}.catch(error => console.error(error))`,
        });
      }

      // Check for unused variables
      if (/const\s+\w+\s*=/.test(line)) {
        const varMatch = line.match(/const\s+(\w+)/);
        if (varMatch) {
          const varName = varMatch[1];
          if (!code.includes(varName) || code.split(varName).length === 2) {
            issues.push({
              id: `issue_${lineNumber}_5`,
              severity: 'info',
              line: lineNumber,
              column: line.indexOf('const'),
              message: `Variable '${varName}' appears to be unused`,
            });
          }
        }
      }
    });

    return issues;
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(code: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Suggest arrow functions
    if (code.includes('function(') && !code.includes('=>')) {
      suggestions.push({
        id: 'suggest_1',
        type: 'refactor',
        message: 'Consider using arrow functions for cleaner syntax',
        code: 'const myFunc = (param) => { /* code */ }',
        explanation: 'Arrow functions are more concise and have lexical this binding',
      });
    }

    // Suggest async/await
    if (code.includes('.then(') && !code.includes('async')) {
      suggestions.push({
        id: 'suggest_2',
        type: 'refactor',
        message: 'Consider using async/await instead of .then()',
        code: 'async function getData() { const data = await fetch(...); }',
        explanation: 'async/await is more readable and easier to debug than promise chains',
      });
    }

    // Suggest destructuring
    if (code.includes('object.') && code.split('object.').length > 3) {
      suggestions.push({
        id: 'suggest_3',
        type: 'refactor',
        message: 'Consider using destructuring for cleaner code',
        code: 'const { property1, property2 } = object;',
        explanation: 'Destructuring reduces repetition and improves readability',
      });
    }

    // Suggest array methods
    if (code.includes('for (') && code.includes('push')) {
      suggestions.push({
        id: 'suggest_4',
        type: 'refactor',
        message: 'Consider using array methods like .map() or .filter()',
        code: 'const result = array.map(item => transform(item));',
        explanation: 'Array methods are more functional and readable than loops',
      });
    }

    // Suggest comments
    if (code.split('\n').length > 20 && code.split('//').length < 3) {
      suggestions.push({
        id: 'suggest_5',
        type: 'documentation',
        message: 'Add comments to explain complex logic',
        code: '// This function calculates...\nfunction calculate() { }',
        explanation: 'Comments help other developers understand your code',
      });
    }

    // Suggest error handling
    if (code.includes('try') && !code.includes('catch')) {
      suggestions.push({
        id: 'suggest_6',
        type: 'feature',
        message: 'Add catch block for error handling',
        code: 'try { /* code */ } catch (error) { console.error(error); }',
        explanation: 'Proper error handling prevents crashes and helps debugging',
      });
    }

    return suggestions;
  }

  /**
   * Calculate code metrics
   */
  private calculateMetrics(code: string): CodeMetrics {
    const lines = code.split('\n').length;
    const functions = (code.match(/function|=>|class/g) || []).length;
    const variables = (code.match(/const|let|var/g) || []).length;
    const comments = (code.match(/\/\/|\/\*|\*\//g) || []).length / 2;

    // Calculate cyclomatic complexity (simplified)
    const complexity =
      (code.match(/if|else|for|while|case|catch/g) || []).length + functions;

    // Calculate maintainability index (simplified 0-100)
    const maintainability = Math.max(
      0,
      100 - complexity * 2 - (lines / 10) + comments * 5
    );

    return {
      lines,
      complexity,
      functions,
      variables,
      comments: Math.floor(comments),
      maintainability: Math.floor(Math.min(100, maintainability)),
    };
  }

  /**
   * Get code completions
   */
  getCompletions(code: string, position: number): CompletionItem[] {
    const completions: CompletionItem[] = [];
    const prefix = this.getWordBeforeCursor(code, position);

    // Add built-in functions
    this.builtInFunctions.forEach((func) => {
      if (func.toLowerCase().startsWith(prefix.toLowerCase())) {
        completions.push({
          label: func,
          kind: 'function',
          detail: 'Built-in function',
          documentation: `JavaScript built-in: ${func}`,
          insertText: func,
        });
      }
    });

    // Add keywords
    this.keywords.forEach((keyword) => {
      if (keyword.toLowerCase().startsWith(prefix.toLowerCase())) {
        completions.push({
          label: keyword,
          kind: 'keyword',
          detail: 'Keyword',
          documentation: `JavaScript keyword: ${keyword}`,
          insertText: keyword,
        });
      }
    });

    // Add common patterns
    this.commonPatterns.forEach((patterns, patternName) => {
      patterns.forEach((pattern) => {
        if (pattern.toLowerCase().startsWith(prefix.toLowerCase())) {
          completions.push({
            label: pattern,
            kind: 'method',
            detail: `Pattern: ${patternName}`,
            documentation: `Common pattern: ${patternName}`,
            insertText: pattern,
          });
        }
      });
    });

    return completions.slice(0, 10); // Return top 10
  }

  /**
   * Get word before cursor
   */
  private getWordBeforeCursor(code: string, position: number): string {
    let start = position - 1;
    while (start >= 0 && /[a-zA-Z0-9_.]/.test(code[start])) {
      start--;
    }
    return code.substring(start + 1, position);
  }

  /**
   * Suggest fixes for issues
   */
  suggestFixes(code: string): Array<{ issue: string; fix: string }> {
    const analysis = this.analyzeCode(code);
    return analysis.issues
      .filter((issue) => issue.fix)
      .map((issue) => ({
        issue: issue.message,
        fix: issue.fix || '',
      }));
  }

  /**
   * Optimize code
   */
  optimizeCode(code: string): string {
    let optimized = code;

    // Replace var with const
    optimized = optimized.replace(/\bvar\s+/g, 'const ');

    // Replace function with arrow function (simple cases)
    optimized = optimized.replace(
      /function\s*\(\s*\)\s*{/g,
      '() => {'
    );

    // Remove unnecessary semicolons at end of blocks
    optimized = optimized.replace(/;(\s*})/g, '$1');

    return optimized;
  }

  /**
   * Generate documentation
   */
  generateDocumentation(code: string, functionName: string): string {
    const functionMatch = code.match(
      new RegExp(`(function|const)\\s+${functionName}\\s*\\([^)]*\\)`)
    );

    if (!functionMatch) return '';

    const lines = code.split('\n');
    const functionLine = lines.findIndex((line) => line.includes(functionName));

    if (functionLine === -1) return '';

    // Extract parameters
    const paramMatch = code.match(
      new RegExp(`${functionName}\\s*\\(([^)]*)\\)`)
    );
    const params = paramMatch ? paramMatch[1].split(',').map((p) => p.trim()) : [];

    let doc = `/**\n * ${functionName}\n`;
    params.forEach((param) => {
      doc += ` * @param {*} ${param}\n`;
    });
    doc += ` * @returns {*}\n */\n`;

    return doc;
  }

  /**
   * Detect performance issues
   */
  detectPerformanceIssues(code: string): string[] {
    const issues: string[] = [];

    // Check for nested loops
    const loopCount = (code.match(/for\s*\(/g) || []).length;
    if (loopCount > 2) {
      issues.push('Nested loops detected - consider optimizing algorithm');
    }

    // Check for synchronous operations
    if (code.includes('XMLHttpRequest') && !code.includes('async')) {
      issues.push('Synchronous XMLHttpRequest blocks UI - use fetch or async');
    }

    // Check for large arrays
    if (code.includes('new Array(') || code.includes('Array(')) {
      issues.push('Large array creation - consider lazy loading or pagination');
    }

    // Check for memory leaks
    if (code.includes('addEventListener') && !code.includes('removeEventListener')) {
      issues.push('Event listener added but not removed - potential memory leak');
    }

    return issues;
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory(): CodeAnalysisResult[] {
    return Array.from(this.analysisHistory.values());
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.analysisHistory.clear();
  }
}
