'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from './project-card';

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
}

export const ProjectShowcaseScroll: React.FC<ProjectShowcaseScrollProps> = ({
  projects,
}) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const animationStateRef = useRef({
    currentCardIndex: 0,
    isInitialized: false,
  });

  const totalCards = projects.length;

  useEffect(() => {
    if (!containerRef.current || animationStateRef.current.isInitialized) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Kill existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Configuration constants (matching CardSwap)
    const cardDistance = 60;
    const verticalDistance = 70;
    const skewAmount = 6;

    // Calculate positions like CardSwap idle state
    const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
      x: i * distX,
      y: -i * distY,
      z: -i * distX * 1.5,
      zIndex: total - i
    });

    // Set initial positions for all cards - all in final stack positions but invisible
    cards.forEach((card, index) => {
      const slot = makeSlot(index, cardDistance, verticalDistance, cards.length);
      gsap.set(card, {
        x: slot.x,
        y: slot.y, // Preserve CardSwap vertical position
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skewAmount,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true,
        opacity: 0, // Start invisible for swipe-up effect
        scale: 0.95, // Slightly smaller for entrance
      });
    });

    // Create separate pin and scrub triggers
    const totalCards = cards.length;
    const pinDuration = totalCards * 1200; // Increased for better scroll control (3600px for 3 cards)

    // Separate pin trigger for stable pinning
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${pinDuration}`,
      pin: true,
      pinSpacing: true, // Add spacing so section stays pinned during animation
    });

    // Separate scrub timeline for animations
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${pinDuration}`,
        scrub: true, // Unified scrub control for smooth scroll-following
      }
    });

    // Add card animations with proper staggering
    const stagger = 1 / totalCards; // Distribute evenly across timeline
    cards.forEach((card, index) => {
      // Staggered start times: 0, 0.33, 0.66 for 3 cards
      const startTime = index * stagger;

      // Animate opacity and scale only (preserve CardSwap positions)
      masterTl.fromTo(card,
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          ease: 'power3.out',
        },
        startTime // Staggered start time
      );
    });

    animationStateRef.current.isInitialized = true;

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      animationStateRef.current.isInitialized = false;
    };
  }, [projects]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-background via-background to-cyan-950/10">
      <div className="container mx-auto px-4 py-12">
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-screen"
        >
          {/* Left Panel - Fixed within pinned section */}
          <div
            ref={leftPanelRef}
            className="lg:col-span-1 order-2 lg:order-1 flex flex-col justify-start pt-20"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-cyan-400 to-foreground bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore my latest work and creative experiments. Each project showcases
                different technologies and design approaches with interactive animations.
              </p>
            </div>
            {/* Control panel removed - only static content */}
          </div>

          {/* Right Panel - Scroll Controlled Cards */}
          <div className="lg:col-span-3 relative order-1 lg:order-2 flex items-center justify-center">
            <div
              className="relative"
              style={{
                height: '100%', // Fill parent container
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