/**
 * Engine Control Center Dashboard
 * FCX Engine Lite v2.0 - Main menu with new features
 */

import { useState } from 'react';
import { Plane, Microscope, Globe, Terminal, Settings } from 'lucide-react';

interface Dashboard3DProps {
  onLaunchSimulator: () => void;
  onLaunchPhysicsSandbox: () => void;
  onLaunchWorldEditor: () => void;
  onLaunchDebugConsole: () => void;
}

export default function Dashboard3D({
  onLaunchSimulator,
  onLaunchPhysicsSandbox,
  onLaunchWorldEditor,
  onLaunchDebugConsole,
}: Dashboard3DProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'flight-sim',
      icon: Plane,
      title: '3D Flight Simulator',
      description: 'Real-time 3D flight simulation with physics',
      color: '#00D9FF',
      action: onLaunchSimulator,
    },
    {
      id: 'physics-sandbox',
      icon: Microscope,
      title: 'Physics Sandbox (3D)',
      description: 'Interactive physics testing and parameter adjustment',
      color: '#FFB800',
      action: onLaunchPhysicsSandbox,
    },
    {
      id: 'world-editor',
      icon: Globe,
      title: 'World Editor',
      description: 'Place runway and terrain objects',
      color: '#00D9FF',
      action: onLaunchWorldEditor,
    },
    {
      id: 'debug-console',
      icon: Terminal,
      title: 'Engine Debug Console',
      description: 'Live 3D engine data visualization',
      color: '#00FF88',
      action: onLaunchDebugConsole,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663637495086/F57xwTHhFZm2x9WSTiGqLZ/fcx-dashboard-background-E67hbeP9F3SpUe7C3cqzeH.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Bar */}
      <div className="bg-card/80 backdrop-blur border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono text-primary hud-readout">
              Flight Control X
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              FCX Engine Lite v2.0 | Engine Control Center
            </p>
          </div>
          <button
            className="p-2 hover:bg-secondary rounded transition-smooth"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-6xl">
          {/* Section Title */}
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-mono text-primary hud-readout mb-2">
              Main Control Panel
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              Select an operation to begin
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;

              return (
                <button
                  key={card.id}
                  onClick={card.action}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative overflow-hidden rounded-lg transition-smooth"
                  style={{
                    background: 'rgba(26, 35, 50, 0.7)',
                    border: `2px solid ${card.color}`,
                    boxShadow: isHovered
                      ? `0 0 20px ${card.color}40, inset 0 0 20px ${card.color}10`
                      : `0 0 12px ${card.color}20, inset 0 0 12px ${card.color}05`,
                  }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${card.color}10, transparent)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative p-8 text-left">
                    {/* Icon */}
                    <div
                      className="mb-4 w-12 h-12 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${card.color}15`,
                        color: card.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-mono font-semibold mb-2 text-foreground">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground font-mono mb-4">
                      {card.description}
                    </p>

                    {/* Arrow indicator */}
                    <div
                      className="inline-flex items-center text-xs font-mono transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: card.color }}
                    >
                      LAUNCH →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-12 pt-8 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
              <div>
                <h4 className="text-primary hud-readout mb-2">Keyboard Controls</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>
                    <span className="text-primary">W/S</span> - Throttle
                  </li>
                  <li>
                    <span className="text-primary">↑/↓</span> - Pitch
                  </li>
                  <li>
                    <span className="text-primary">←/→</span> - Yaw
                  </li>
                  <li>
                    <span className="text-primary">F1</span> - Debug (Simulator)
                  </li>
                  <li>
                    <span className="text-primary">ESC</span> - Exit
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary hud-readout mb-2">Engine Status</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>
                    3D Rendering: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    Physics Engine: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    Camera System: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    Simulation Loop: <span className="text-primary">READY</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-card/80 backdrop-blur border-t border-border px-8 py-4 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Powered by Synthra Labs × Acrylic Studios
        </p>
      </div>
    </div>
  );
}
