/**
 * FCX Engine Pro - Game Scripting System
 * JavaScript-based game script execution
 */

import { GameEngine } from './game-engine';

export interface GameScript {
  id: string;
  name: string;
  code: string;
  language: 'javascript' | 'lua' | 'simplic';
}

export interface ScriptContext {
  engine: GameEngine;
  gameObject: any;
  deltaTime: number;
  input: InputState;
  physics: any;
  scene: any;
}

export interface InputState {
  keys: Map<string, boolean>;
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
}

export class GameScriptEngine {
  private scripts: Map<string, GameScript> = new Map();
  private contexts: Map<string, ScriptContext> = new Map();
  private engine: GameEngine;
  private inputState: InputState = {
    keys: new Map(),
    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
  };

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.setupInputHandling();
  }

  /**
   * Register a script
   */
  registerScript(script: GameScript): void {
    this.scripts.set(script.id, script);
  }

  /**
   * Execute script
   */
  executeScript(scriptId: string, context: Partial<ScriptContext>): any {
    const script = this.scripts.get(scriptId);
    if (!script || script.language !== 'javascript') return;

    try {
      // Create a safe function with context
      const fn = new Function(
        'engine',
        'gameObject',
        'deltaTime',
        'input',
        'physics',
        'scene',
        script.code
      );

      const ctx = {
        engine: this.engine,
        gameObject: context.gameObject || {},
        deltaTime: context.deltaTime || 0,
        input: this.inputState,
        physics: this.engine.getPhysics(),
        scene: this.engine.getScene(),
        ...context,
      };

      return fn(
        ctx.engine,
        ctx.gameObject,
        ctx.deltaTime,
        ctx.input,
        ctx.physics,
        ctx.scene
      );
    } catch (error) {
      console.error(`Error executing script ${scriptId}:`, error);
    }
  }

  /**
   * Create script from code
   */
  createScript(id: string, name: string, code: string): GameScript {
    const script: GameScript = {
      id,
      name,
      code,
      language: 'javascript',
    };
    this.registerScript(script);
    return script;
  }

  /**
   * Get script
   */
  getScript(id: string): GameScript | undefined {
    return this.scripts.get(id);
  }

  /**
   * Setup input handling
   */
  private setupInputHandling(): void {
    window.addEventListener('keydown', (e) => {
      this.inputState.keys.set(e.key.toLowerCase(), true);
    });

    window.addEventListener('keyup', (e) => {
      this.inputState.keys.set(e.key.toLowerCase(), false);
    });

    window.addEventListener('mousemove', (e) => {
      this.inputState.mouseX = e.clientX;
      this.inputState.mouseY = e.clientY;
    });

    window.addEventListener('mousedown', () => {
      this.inputState.mouseDown = true;
    });

    window.addEventListener('mouseup', () => {
      this.inputState.mouseDown = false;
    });
  }

  /**
   * Get input state
   */
  getInputState(): InputState {
    return this.inputState;
  }

  /**
   * Check if key is pressed
   */
  isKeyPressed(key: string): boolean {
    return this.inputState.keys.get(key.toLowerCase()) || false;
  }

  /**
   * Dispose scripting engine
   */
  dispose(): void {
    this.scripts.clear();
    this.contexts.clear();
  }
}
