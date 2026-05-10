/**
 * FCX Engine Animation System
 * Keyframe-based animation with timeline and blend transitions
 */

export interface Keyframe {
  time: number;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  property?: string;
  value?: any;
}

export interface AnimationClip {
  id: string;
  name: string;
  duration: number;
  keyframes: Keyframe[];
  loop: boolean;
  blendIn: number;
  blendOut: number;
}

export interface AnimationState {
  clip: AnimationClip;
  currentTime: number;
  isPlaying: boolean;
  speed: number;
}

export class AnimationSystem {
  private clips: Map<string, AnimationClip> = new Map();
  private activeAnimations: Map<string, AnimationState> = new Map();

  /**
   * Create animation clip
   */
  createClip(name: string, duration: number): AnimationClip {
    const clip: AnimationClip = {
      id: `clip_${Date.now()}`,
      name,
      duration,
      keyframes: [],
      loop: false,
      blendIn: 0.2,
      blendOut: 0.2,
    };

    this.clips.set(clip.id, clip);
    return clip;
  }

  /**
   * Add keyframe to clip
   */
  addKeyframe(clipId: string, keyframe: Keyframe): void {
    const clip = this.clips.get(clipId);
    if (!clip) throw new Error('Clip not found');

    clip.keyframes.push(keyframe);
    clip.keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * Remove keyframe
   */
  removeKeyframe(clipId: string, time: number): void {
    const clip = this.clips.get(clipId);
    if (!clip) throw new Error('Clip not found');

    clip.keyframes = clip.keyframes.filter((k) => k.time !== time);
  }

  /**
   * Play animation
   */
  playAnimation(objectId: string, clipId: string, speed: number = 1): void {
    const clip = this.clips.get(clipId);
    if (!clip) throw new Error('Clip not found');

    this.activeAnimations.set(objectId, {
      clip,
      currentTime: 0,
      isPlaying: true,
      speed,
    });
  }

  /**
   * Stop animation
   */
  stopAnimation(objectId: string): void {
    this.activeAnimations.delete(objectId);
  }

  /**
   * Pause animation
   */
  pauseAnimation(objectId: string): void {
    const state = this.activeAnimations.get(objectId);
    if (state) {
      state.isPlaying = false;
    }
  }

  /**
   * Resume animation
   */
  resumeAnimation(objectId: string): void {
    const state = this.activeAnimations.get(objectId);
    if (state) {
      state.isPlaying = true;
    }
  }

  /**
   * Update animations (call each frame)
   */
  update(deltaTime: number): Map<string, any> {
    const results = new Map<string, any>();

    this.activeAnimations.forEach((state, objectId) => {
      if (!state.isPlaying) return;

      state.currentTime += deltaTime * state.speed;

      // Handle looping
      if (state.currentTime > state.clip.duration) {
        if (state.clip.loop) {
          state.currentTime = state.currentTime % state.clip.duration;
        } else {
          this.activeAnimations.delete(objectId);
          return;
        }
      }

      // Interpolate keyframes
      const value = this.interpolateKeyframes(state.clip, state.currentTime);
      results.set(objectId, value);
    });

    return results;
  }

  /**
   * Interpolate between keyframes
   */
  private interpolateKeyframes(clip: AnimationClip, time: number): any {
    const keyframes = clip.keyframes;
    if (keyframes.length === 0) return null;

    // Find surrounding keyframes
    let before = keyframes[0];
    let after = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (keyframes[i].time <= time && keyframes[i + 1].time >= time) {
        before = keyframes[i];
        after = keyframes[i + 1];
        break;
      }
    }

    if (before.time === after.time) {
      return before;
    }

    // Linear interpolation factor
    const t = (time - before.time) / (after.time - before.time);

    // Interpolate properties
    const result: any = {};

    if (before.position && after.position) {
      result.position = {
        x: this.lerp(before.position.x, after.position.x, t),
        y: this.lerp(before.position.y, after.position.y, t),
        z: this.lerp(before.position.z, after.position.z, t),
      };
    }

    if (before.rotation && after.rotation) {
      result.rotation = {
        x: this.lerp(before.rotation.x, after.rotation.x, t),
        y: this.lerp(before.rotation.y, after.rotation.y, t),
        z: this.lerp(before.rotation.z, after.rotation.z, t),
      };
    }

    if (before.scale && after.scale) {
      result.scale = {
        x: this.lerp(before.scale.x, after.scale.x, t),
        y: this.lerp(before.scale.y, after.scale.y, t),
        z: this.lerp(before.scale.z, after.scale.z, t),
      };
    }

    return result;
  }

  /**
   * Linear interpolation
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  /**
   * Get clip
   */
  getClip(clipId: string): AnimationClip | undefined {
    return this.clips.get(clipId);
  }

  /**
   * Get all clips
   */
  getAllClips(): AnimationClip[] {
    return Array.from(this.clips.values());
  }

  /**
   * Delete clip
   */
  deleteClip(clipId: string): void {
    this.clips.delete(clipId);
  }

  /**
   * Get animation state
   */
  getAnimationState(objectId: string): AnimationState | undefined {
    return this.activeAnimations.get(objectId);
  }

  /**
   * Blend animations (transition between clips)
   */
  blendAnimations(
    objectId: string,
    fromClipId: string,
    toClipId: string,
    duration: number = 0.5
  ): void {
    const fromClip = this.clips.get(fromClipId);
    const toClip = this.clips.get(toClipId);

    if (!fromClip || !toClip) throw new Error('Clip not found');

    // Start new animation with blend in
    this.playAnimation(objectId, toClipId);
    const state = this.activeAnimations.get(objectId);
    if (state) {
      state.clip.blendIn = duration;
    }
  }
}
