# FCX Engine Lite

A lightweight 2D game engine built with **TypeScript** and Canvas 2D API. Featuring a scene-based architecture with input handling, camera system, and collision detection.

# Current Features

TypeScript-based game engine - Fully typed codebase for better developer experience
Scene management system - Boot, Menu, and Game scenes with easy transitions
2D Canvas rendering - Efficient 2D graphics with camera smoothing
Entity system - Player, Wall, and extensible Entity classes
Collision detection - AABB (Axis-Aligned Bounding Box) collision detection
Input handling - Keyboard input with type-safe key enums
Debug HUD - Real-time debug information display
Error handling - Comprehensive error handling with user feedback
Project Structure

fcx-engine/
├── src/                      # TypeScript game engine
│   ├── main.ts              # Entry point with error handling
│   ├── game.ts              # Main Game class and game loop
│   ├── scene.ts             # Scene classes (Boot, Menu, Game)
│   ├── sceneManager.ts      # Scene management
│   ├── entity.ts            # Entity, Player, Wall classes
│   ├── input.ts             # Input system with KeyCode enum
│   ├── debugHUD.ts          # Debug overlay
├── core/                     # Core utilities (JavaScript)
│   ├── auth.js              # Authentication logic
│   └── physics.js           # Physics utility functions
├── renderer/                 # Renderer implementations
│   ├── lite2d/              # 2D Canvas renderer (current)
│   └── placeholder3d/       # 3D renderer (stub - not implemented)
├── app.js                   # Application wrapper
├── fcx-engine.js            # Engine initialization
├── index.html               # HTML entry point
├── styles.css               # Stylesheet
├── tsconfig.json            # TypeScript configuration
├── vite.config.js           # Vite build configuration
└── package.json             # Project dependencies
Quick Start

Install dependencies:

npm install
Run development server:

npm run dev
Build for production:

npm run build
Open in browser: Navigate to http://localhost:5173 (or the Vite port shown in terminal)

Game Controls

Arrow Keys - Move player
Space - Advance from Boot scene to Menu
Enter - Start game from Menu scene
Recent Fixes & Improvements (v0.2.1)

Critical Fixes

✅ Fixed entity render signature mismatch (camera parameters now properly optional)
✅ Added proper null checking for Canvas 2D context
✅ Fixed untyped input parameters with proper Input class typing
Quality Improvements

✅ Created KeyCode enum for type-safe keyboard input (eliminates magic strings)
✅ Added player bounds checking (prevents moving outside canvas)
✅ Improved camera follow with speed clamping (smooth, no jitter)
✅ Enhanced error handling with user-friendly messages
✅ Added DOMContentLoaded handling for proper initialization
About 3D Support

3D rendering is NOT currently available.

The renderer/placeholder3d/ directory contains only a stub function. The current implementation is fully 2D using the HTML5 Canvas 2D API.

To implement 3D:

Would require migrating from Canvas 2D to WebGL or Three.js
Need to rewrite rendering pipeline and update entity classes
Scene management would need adjustments for 3D camera
This is planned as a future enhancement but requires significant refactoring
For now, the engine is optimized for 2D games with: sprite rendering, camera systems, collision detection, and scene management.

Architecture Notes

src/ is TypeScript compiled to JavaScript
core/ contains legacy JavaScript utilities (consider migrating to TypeScript)
Renderers are designed to be swappable, but currently only 2D is functional
The engine uses a standard game loop pattern: update(deltaTime) → render(ctx)
Known Issues & Roadmap

Current Limitations

Only Canvas 2D rendering (no GPU acceleration)
Player movement is grid-free, collision-based
Limited entity types (Player, Wall only)
No sound system
No animation system
Next Steps

[ ] Add particle effects system
[ ] Implement audio system
[ ] Create tilemap support
[ ] Add automated test suite
[ ] Migrate core/ JavaScript to TypeScript
[ ] Optimize renderer for better performance
[ ] Document API with JSDoc comments
Contributing

Pull requests welcome! Please ensure:

TypeScript compiles without errors
All changes are type-safe
Include error handling for edge cases
License

MIT

Why this works for FCX-DT (Raspberry Pi 5)

By starting with top-down and scaling, the Pi 5 can reserve GPU power for "surreal" post-processing effects. This means the extra performance is spent on lighting, particle effects, and glass/weather treatment instead of millions of polygons.

SIMPLiC sample: altitude scaling

A simple flight-control effect in SIMPLiC might look like this:

# Simple Altitude Logic
if plane.climbing:
    plane.scale += 0.01
    shadow.offset += 1.5
    shadow.opacity -= 0.05
This fits the FCXPhaseView strategy: simple physics in the Lite engine, with visual depth provided by shaders and layered 2D presentation.

Supports asset uploads for models, textures, and mission data to prepare for heavier FCX Engine versions.
Designed with Raspberry Pi 5-compatible UI and light runtime behavior in mind for embedded FCX systems.
Flight Simulation Focus

This Lite app is an early Flight Control X development layer, enabling fast 2D game scripting today while leaving room for future heavy-model and simulation integration.
