/**
 * Input Handler for Flight Controls
 * Professional Aviation Cockpit Minimalism: Keyboard-first design with mouse as secondary
 * 
 * Keyboard Controls:
 * - W / Up Arrow: Increase throttle
 * - S / Down Arrow: Decrease throttle
 * - Arrow Up/Down: Pitch control
 * - Arrow Left/Right: Heading/banking
 * - F1: Toggle debug overlay
 */

export interface InputState {
  throttleUp: boolean;
  throttleDown: boolean;
  pitchUp: boolean;
  pitchDown: boolean;
  headingLeft: boolean;
  headingRight: boolean;
  debugToggle: boolean;
}

export class InputHandler {
  private state: InputState = {
    throttleUp: false,
    throttleDown: false,
    pitchUp: false,
    pitchDown: false,
    headingLeft: false,
    headingRight: false,
    debugToggle: false,
  };

  private debugTogglePressed = false;
  private handleKeyDownBound: (e: KeyboardEvent) => void;
  private handleKeyUpBound: (e: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.handleKeyUpBound = this.handleKeyUp.bind(this);
    this.setupListeners();
  }

  private setupListeners() {
    window.addEventListener('keydown', this.handleKeyDownBound);
    window.addEventListener('keyup', this.handleKeyUpBound);
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'w':
      case 'arrowup':
        if (event.key === 'w') this.state.throttleUp = true;
        else this.state.pitchUp = true;
        break;
      case 's':
      case 'arrowdown':
        if (event.key === 's') this.state.throttleDown = true;
        else this.state.pitchDown = true;
        break;
      case 'arrowleft':
        this.state.headingLeft = true;
        break;
      case 'arrowright':
        this.state.headingRight = true;
        break;
    }

    // F1 for debug toggle
    if (event.key === 'F1') {
      event.preventDefault();
      if (!this.debugTogglePressed) {
        this.state.debugToggle = !this.state.debugToggle;
        this.debugTogglePressed = true;
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'w':
        this.state.throttleUp = false;
        break;
      case 's':
        this.state.throttleDown = false;
        break;
      case 'arrowup':
        this.state.pitchUp = false;
        break;
      case 'arrowdown':
        this.state.pitchDown = false;
        break;
      case 'arrowleft':
        this.state.headingLeft = false;
        break;
      case 'arrowright':
        this.state.headingRight = false;
        break;
    }

    if (event.key === 'F1') {
      this.debugTogglePressed = false;
    }
  }

  getState(): InputState {
    return { ...this.state };
  }

  resetDebugToggle() {
    this.state.debugToggle = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDownBound);
    window.removeEventListener('keyup', this.handleKeyUpBound);
  }
}
