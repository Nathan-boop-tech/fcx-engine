/**
 * Main Dashboard Component
 * Professional Aviation Cockpit Minimalism: Clean control panel with three action cards
 * 
 * Features:
 * - Flight Control X Project card (launches flight simulator)
 * - Test Lab card (physics testing)
 * - Developer Tools card (debug view)
 * - Professional HUD-style layout
 */

import { useState } from 'react';
import { Plane, Microscope, Wrench, Settings } from 'lucide-react';

interface DashboardProps {
  onLaunchSimulation: () => void;
}

export default function Dashboard({ onLaunchSimulation }: DashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'flight-control',
      icon: Plane,
      title: 'Flight Control X Project',
      description: 'Launch simulation environment',
      color: '#00D9FF',
      action: onLaunchSimulation,
    },
    {
      id: 'test-lab',
      icon: Microscope,
      title: 'Test Lab',
      description: 'Physics tests (lift, drag, speed, altitude)',
      color: '#FFB800',
      action: () => alert('Test Lab - Coming soon'),
    },
    {
      id: 'dev-tools',
      icon: Wrench,
      title: 'Developer Tools',
      description: 'Debug view, flight data viewer, console logs',
      color: '#00D9FF',
      action: () => alert('Developer Tools - Coming soon'),
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
              FCX Engine Lite | v0.1 Prototype
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
        <div className="w-full max-w-5xl">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className="text-primary">←/→</span> - Heading
                  </li>
                  <li>
                    <span className="text-primary">F1</span> - Debug Overlay
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary hud-readout mb-2">System Status</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>
                    Physics Engine: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    Flight Systems: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    UI Modules: <span className="text-primary">READY</span>
                  </li>
                  <li>
                    Simulation Layer: <span className="text-primary">READY</span>
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
