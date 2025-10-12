'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from './project-card';
import { ControlPanel } from './control-panel';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  link?: string;
}

interface ProjectShowcaseScrollProps {
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

export const ProjectShowcaseScroll: React.FC<ProjectShowcaseScrollProps> = ({
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Kill existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Calculate positions like CardSwap idle state
    const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
      x: i * distX,
      y: -i * distY,
      z: -i * distX * 1.5,
      zIndex: total - i
    });

    const placeNow = (el: HTMLElement, slot: any, skew: number) =>
      gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
      });

    // Set initial positions for all cards (invisible)
    cards.forEach((card, index) => {
      const slot = makeSlot(index, config.cardDistance, config.verticalDistance, cards.length);
      gsap.set(card, {
        ...slot,
        xPercent: -50,
        yPercent: -50,
        skewY: config.skewAmount,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true,
        opacity: 0, // Start invisible
        scale: 0.8,
      });
    });

    // Create scroll-triggered reveals
    cards.forEach((card, index) => {
      const slot = makeSlot(index, config.cardDistance, config.verticalDistance, cards.length);

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `top+=${index * 200} center`, // Staggered trigger points
        end: `bottom+=${(index + 1) * 200} center`,
        onEnter: () => {
          // Reveal card at its final position
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
          });
        },
        onLeaveBack: () => {
          // Hide card when scrolling back up
          gsap.to(card, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'power2.out',
          });
        },
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [projects, config.cardDistance, config.verticalDistance, config.skewAmount]);

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
              ref={containerRef}
              className="relative mx-auto"
              style={{
                height: '600px',
                width: '800px',
                maxWidth: '100%',
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl perspective-[900px]">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="absolute top-1/2 left-1/2 rounded-xl border border-cyan-500/20 bg-background/90 backdrop-blur-md shadow-lg hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-105"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      height: 'auto',
                      minHeight: '300px',
                    }}
                  >
                    <div className="p-6">
                      <ProjectCard {...project} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};