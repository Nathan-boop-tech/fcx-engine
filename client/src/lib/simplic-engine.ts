/**
 * SIMPLiC Scripting Language Engine
 * Event-driven, beginner-friendly scripting for FCX Engine Lite
 */

export interface SIMPLiCEvent {
  type: 'START' | 'UPDATE' | 'CLICK' | 'COLLISION' | 'KEY';
  target?: string;
  key?: string;
}

export interface SIMPLiCCommand {
  action: string;
  subject?: string;
  params: Record<string, any>;
}

export interface SIMPLiCScript {
  name: string;
  code: string;
  events: Map<string, SIMPLiCCommand[]>;
}

export class SIMPLiCEngine {
  private scripts: Map<string, SIMPLiCScript> = new Map();
  private objects: Map<string, any> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * Parse SIMPLiC script
   */
  parseScript(code: string): SIMPLiCScript {
    const lines = code.split('\n').filter((line) => line.trim());
    const events = new Map<string, SIMPLiCCommand[]>();
    let currentEvent: string | null = null;
    let currentCommands: SIMPLiCCommand[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Event declaration
      if (trimmed.startsWith('ON ')) {
        if (currentEvent) {
          events.set(currentEvent, currentCommands);
        }
        currentEvent = trimmed.substring(3).trim();
        currentCommands = [];
      } else if (currentEvent && trimmed) {
        // Parse command
        const command = this.parseCommand(trimmed);
        if (command) {
          currentCommands.push(command);
        }
      }
    }

    // Save last event
    if (currentEvent) {
      events.set(currentEvent, currentCommands);
    }

    return {
      name: 'script',
      code,
      events,
    };
  }

  /**
   * Parse individual command
   */
  private parseCommand(line: string): SIMPLiCCommand | null {
    const tokens = line.split(/\s+/);
    if (tokens.length === 0) return null;

    const action = tokens[0].toUpperCase();

    switch (action) {
      case 'SPAWN':
        return {
          action: 'SPAWN',
          subject: tokens[1],
          params: { type: tokens[2]?.replace(/"/g, '') },
        };

      case 'START':
        return {
          action: 'START',
          subject: tokens[1],
          params: { system: tokens[2]?.replace(/"/g, '') },
        };

      case 'TAKEOFF':
        return {
          action: 'TAKEOFF',
          subject: tokens[1],
          params: {},
        };

      case 'LAND':
        return {
          action: 'LAND',
          subject: tokens[1],
          params: {},
        };

      case 'SET':
        return {
          action: 'SET',
          subject: tokens[1],
          params: {
            property: tokens[2],
            value: parseFloat(tokens[3]) || tokens[3]?.replace(/"/g, ''),
          },
        };

      case 'MOVE':
        return {
          action: 'MOVE',
          subject: tokens[1],
          params: {
            x: parseFloat(tokens[2]) || 0,
            y: parseFloat(tokens[3]) || 0,
            z: parseFloat(tokens[4]) || 0,
          },
        };

      case 'ROTATE':
        return {
          action: 'ROTATE',
          subject: tokens[1],
          params: {
            x: parseFloat(tokens[2]) || 0,
            y: parseFloat(tokens[3]) || 0,
            z: parseFloat(tokens[4]) || 0,
          },
        };

      case 'DELETE':
        return {
          action: 'DELETE',
          subject: tokens[1],
          params: {},
        };

      case 'ANIMATE':
        return {
          action: 'ANIMATE',
          subject: tokens[1],
          params: {
            animation: tokens[2]?.replace(/"/g, ''),
            duration: parseFloat(tokens[3]) || 1,
          },
        };

      case 'LOG':
        return {
          action: 'LOG',
          params: { message: tokens.slice(1).join(' ').replace(/"/g, '') },
        };

      default:
        return null;
    }
  }

  /**
   * Register script
   */
  registerScript(name: string, script: SIMPLiCScript): void {
    this.scripts.set(name, script);
  }

  /**
   * Register game object
   */
  registerObject(name: string, object: any): void {
    this.objects.set(name, object);
  }

  /**
   * Execute event
   */
  executeEvent(eventType: string, target?: string): void {
    this.scripts.forEach((script) => {
      const eventKey = target ? `${eventType} "${target}"` : eventType;

      script.events.forEach((commands, event) => {
        if (event.includes(eventType)) {
          for (const command of commands) {
            this.executeCommand(command);
          }
        }
      });
    });
  }

  /**
   * Execute command
   */
  private executeCommand(command: SIMPLiCCommand): void {
    const { action, subject, params } = command;

    switch (action) {
      case 'SPAWN':
        console.log(`[SIMPLiC] SPAWN ${subject} of type ${params.type}`);
        break;

      case 'START':
        console.log(`[SIMPLiC] START ${params.system} on ${subject}`);
        break;

      case 'TAKEOFF':
        console.log(`[SIMPLiC] TAKEOFF ${subject}`);
        break;

      case 'LAND':
        console.log(`[SIMPLiC] LAND ${subject}`);
        break;

      case 'SET':
        console.log(
          `[SIMPLiC] SET ${subject}.${params.property} = ${params.value}`
        );
        break;

      case 'MOVE':
        console.log(
          `[SIMPLiC] MOVE ${subject} to (${params.x}, ${params.y}, ${params.z})`
        );
        break;

      case 'ROTATE':
        console.log(
          `[SIMPLiC] ROTATE ${subject} by (${params.x}, ${params.y}, ${params.z})`
        );
        break;

      case 'DELETE':
        console.log(`[SIMPLiC] DELETE ${subject}`);
        break;

      case 'ANIMATE':
        console.log(
          `[SIMPLiC] ANIMATE ${subject} with ${params.animation} for ${params.duration}s`
        );
        break;

      case 'LOG':
        console.log(`[SIMPLiC] ${params.message}`);
        break;
    }

    // Trigger listeners
    const listeners = this.eventListeners.get(action) || [];
    for (const listener of listeners) {
      listener(command);
    }
  }

  /**
   * Register event listener
   */
  on(action: string, callback: Function): void {
    if (!this.eventListeners.has(action)) {
      this.eventListeners.set(action, []);
    }
    this.eventListeners.get(action)!.push(callback);
  }

  /**
   * Get all scripts
   */
  getScripts(): Map<string, SIMPLiCScript> {
    return this.scripts;
  }

  /**
   * Validate script syntax
   */
  validateScript(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = code.split('\n');

    let inEvent = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('ON ')) {
        inEvent = true;
      } else if (inEvent) {
        const tokens = line.split(/\s+/);
        const action = tokens[0].toUpperCase();

        const validActions = [
          'SPAWN',
          'START',
          'TAKEOFF',
          'LAND',
          'SET',
          'MOVE',
          'ROTATE',
          'DELETE',
          'ANIMATE',
          'LOG',
        ];

        if (!validActions.includes(action)) {
          errors.push(`Line ${i + 1}: Unknown command "${action}"`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
