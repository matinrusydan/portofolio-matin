'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from '@/components/ui/project-card';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationStateRef = useRef({
    isInitialized: false,
  });

  useEffect(() => {
    if (!sectionRef.current || animationStateRef.current.isInitialized) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const cardDistance = 60;
    const verticalDistance = 70;
    const skewAmount = 6;

    // Calculate initial positions for the cards in a stack
    const makeSlot = (i: number, distX: number, distY: number) => ({
      x: -i * distX,          // 🔁 ke kiri
      y: i * distY,           // tetap ke bawah
      z: -i * distX * 1.5,    // kedalaman tetap
    });

    cards.forEach((card, index) => {
      const slot = makeSlot(index, cardDistance, verticalDistance);
      gsap.set(card, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skewAmount,
        transformOrigin: 'center center',
        zIndex: index + 1,               // urut naik: card 1 < 2 < 3
        force3D: true,
        opacity: 0,
        scale: 0.95,
      });
    });



    const totalCards = cards.length;
    const pinDuration = totalCards * 1200;

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${pinDuration}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    });

    const stagger = 1 / totalCards;
    cards.forEach((card, index) => {
      const startTime = index * stagger;
      masterTl.fromTo(
        card,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, ease: 'power3.out' },
        startTime
      );
    });

    animationStateRef.current.isInitialized = true;

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      animationStateRef.current.isInitialized = false;
    };
  }, [projects]);

  return (
    <section
        ref={sectionRef}
        className="relative bg-background overflow-hidden min-h-screen py-20"
    >
        <div className="container mx-auto px-20">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-16 h-full">
                {/* Kolom Teks */}
                <div className="flex-1 text-center lg:text-left max-w-2xl">
                    <h2 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-4">
                        Featured Projects
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Explore my latest work and creative experiments. Each project showcases
                        different technologies and design approaches with interactive animations.
                    </p>
                </div>

                {/* Kolom Media */}
                <div className="flex-1 flex justify-center lg:justify-end max-w-lg">
                    <div className="relative w-full h-[60vh] sm:h-[70vh]">
                        <div className="relative w-full h-full rounded-xl perspective-[900px]">
                            {projects.map((project, index) => (
                                <div
                                    key={index}
                                    ref={(el) => { cardRefs.current[index] = el; }}
                                    className="absolute top-1/2 left-1/2 rounded-xl border border-primary/20 bg-background/90 backdrop-blur-md shadow-lg"
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        height: 'auto',
                                        minHeight: '300px',
                                        transformStyle: 'preserve-3d',
                                        pointerEvents: 'none',
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
    </section>
  );
};
