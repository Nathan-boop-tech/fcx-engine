# FCX Engine Lite — Design Brainstorm

## Design Philosophy: Professional Aviation Cockpit Minimalism

After evaluating three distinct approaches, I've selected **Professional Aviation Cockpit Minimalism** as the design foundation for FCX Engine Lite.

### Design Movement
**Modern Cockpit Modernism** — Inspired by contemporary aircraft avionics, military HUD displays, and professional flight simulation software (X-Plane, Prepar3D). Clean lines, functional aesthetics, and purposeful visual hierarchy.

### Core Principles
1. **Functional Clarity**: Every UI element serves a purpose; no decorative flourishes that distract from flight operations.
2. **Dark Cockpit Paradigm**: Dark backgrounds reduce eye strain during extended use and create the authentic feel of a modern glass cockpit.
3. **Precision Typography**: Monospaced elements for data readout, sans-serif for labels and controls. Hierarchy through size and weight, not color alone.
4. **Subtle Depth**: Minimal shadows and borders create separation without visual noise. Emphasis on data legibility over decorative effects.

### Color Philosophy
- **Primary Background**: Deep navy (`#0F1419`) — mimics modern aircraft displays and reduces fatigue.
- **Accent Color**: Cyan/Electric Blue (`#00D9FF`) — classic HUD color, instantly recognizable as aviation-grade UI.
- **Secondary Accent**: Amber/Gold (`#FFB800`) — warning/caution indicator, used sparingly for alerts.
- **Text**: Off-white (`#E8E8E8`) for primary readability, muted gray (`#7A8A99`) for secondary info.
- **Rationale**: Dark + cyan creates the authentic "glass cockpit" aesthetic while maintaining accessibility and reducing eye strain.

### Layout Paradigm
- **Asymmetric Control Panels**: Avoid centered, grid-based layouts. Use left sidebar for navigation, center for main content, right panel for telemetry/debug.
- **Layered Information Density**: Dashboard shows high-level overview; clicking cards expands into detailed control panels.
- **Vertical Rhythm**: Consistent spacing (8px base unit) creates visual breathing room and professional polish.

### Signature Elements
1. **HUD-Style Readouts**: Monospaced data displays with subtle glow effects (e.g., `ALT: 15,000 ft`).
2. **Radar Sweep Animation**: Rotating line or circular scan effect in splash screen and loading sequences.
3. **Glowing Accent Borders**: Subtle cyan glow on active panels and interactive elements.

### Interaction Philosophy
- **Immediate Feedback**: Buttons and controls respond instantly with color shift and subtle scale change.
- **State Indication**: Active vs. inactive states clearly distinguished through color and opacity.
- **Smooth Transitions**: All state changes use 200-300ms easing for fluid, professional feel.
- **Keyboard-First Design**: Full keyboard support for flight controls; mouse as secondary input.

### Animation Guidelines
- **Splash Screen**: Fade-in logo (400ms), radar sweep animation (2s loop), fade-out transition (500ms).
- **Loading Sequence**: Progress bar animates smoothly; loading steps fade in/out sequentially.
- **Dashboard Cards**: Subtle scale-up (1.02x) on hover, smooth color transition on click.
- **Flight Sim**: Real-time physics loop (60 FPS); smooth aircraft movement and HUD updates.
- **Avoid**: Excessive bounce, overly playful easing; keep animations professional and purposeful.

### Typography System
- **Display Font**: `IBM Plex Mono` (monospaced) for HUD readouts and data displays — conveys technical precision.
- **Body Font**: `Roboto` (sans-serif) for labels, buttons, and UI text — clean and professional.
- **Hierarchy**:
  - **H1 (Display)**: 32px, `IBM Plex Mono`, bold, cyan accent — main titles.
  - **H2 (Subheading)**: 20px, `Roboto`, semibold, off-white — section headers.
  - **Body**: 14px, `Roboto`, regular, off-white — standard text.
  - **Data Readout**: 16px, `IBM Plex Mono`, regular, cyan — flight telemetry.
  - **Label**: 12px, `Roboto`, regular, muted gray — field labels.

---

## Implementation Commitment

This design philosophy will guide **every** decision:
- When in doubt: "Does this choice reinforce the professional cockpit aesthetic?"
- Avoid: Centered layouts, purple gradients, excessive rounded corners, generic Inter font.
- Embrace: Asymmetric panels, cyan accents, monospaced data, dark backgrounds, functional animations.

All CSS files will include this philosophy as a comment block at the top for consistency.
