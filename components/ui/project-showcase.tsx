'use client';

import React, { useState } from 'react';
import CardSwap, { Card } from '../CardSwap';
import { ProjectCard } from './project-card';
import { ControlPanel } from './control-panel';

interface Project {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  link?: string;
}

interface ProjectShowcaseProps {
  projects: Project[];
  initialConfig?: {
    pauseOnHover: boolean;
    cardDistance: number;
    verticalDistance: number;
    delay: number;
    skewAmount: number;
    easing: 'elastic' | 'linear' | 'power1';
  };
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  initialConfig = {
    pauseOnHover: false,
    cardDistance: 60,
    verticalDistance: 70,
    delay: 5000,
    skewAmount: 6,
    easing: 'elastic' as const,
  },
}) => {
  const [config, setConfig] = useState(initialConfig);

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const mapEasing = (easing: string): 'elastic' | 'linear' => {
    if (easing === 'power1') return 'linear';
    return easing as 'elastic' | 'linear';
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-background via-background to-cyan-950/10">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground via-cyan-400 to-foreground bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my latest work and creative experiments. Each project showcases
            different technologies and design approaches with interactive animations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ControlPanel config={config} onConfigChange={handleConfigChange} />
          </div>

          {/* Project Showcase */}
          <div className="lg:col-span-3 relative order-1 lg:order-2">
            <div
              className="relative mx-auto"
              style={{
                height: '600px',
                width: '800px',
                maxWidth: '100%',
              }}
            >
              <CardSwap
                width={800}
                height={600}
                cardDistance={config.cardDistance}
                verticalDistance={config.verticalDistance}
                delay={config.delay}
                pauseOnHover={config.pauseOnHover}
                skewAmount={config.skewAmount}
                easing={mapEasing(config.easing)}
              >
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    className="bg-background/90 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/40 shadow-lg hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-105"
                  >
                    <ProjectCard {...project} />
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};