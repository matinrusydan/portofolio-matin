"use client"

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import { tsParticles } from '@tsparticles/engine';
import TextType from "@/components/TextType";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (sectionRef.current) {
        const { clientX } = event;
        const rect = sectionRef.current.getBoundingClientRect();
        // Hitung posisi mouse relatif terhadap elemen section, bukan window
        const mouseXPercent = ((clientX - rect.left) / rect.width) * 100;
        // Terapkan variabel CSS ke elemen itu sendiri
        sectionRef.current.style.setProperty('--mouse-x', `${mouseXPercent.toFixed(2)}%`);
      }
    };

    // Dengarkan event mousemove pada elemen section itu sendiri
    const currentSection = sectionRef.current;
    if (currentSection) {
      currentSection.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      // Hapus event listener saat komponen di-unmount
      if (currentSection) {
        currentSection.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  useEffect(() => {
    const initParticles = async () => {
      await loadSlim(tsParticles);
    };
    initParticles();
  }, []);

  return (
      <section
        ref={sectionRef} // PASTIKAN REF INI TERPASANG DI SINI
        className="relative isolate flex min-h-screen flex-col items-center justify-center text-center px-6 md:px-8 pt-32 md:pt-40 overflow-hidden" // Tambahkan overflow-hidden
        aria-label="Intro"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 god-rays" aria-hidden="true" />
        <div className="absolute inset-0 -z-20 particles-mask">
          <Particles
            id="tsparticles"
            options={{
              fullScreen: { enable: false },
              background: { color: { value: "transparent" } },
              particles: {
                number: { value: 60 },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: { min: 0.05, max: 0.25 }, animation: { enable: true, speed: 0.2 } },
                size: { value: { min: 0.5, max: 2.5 } },
                move: {
                  enable: true,
                  speed: 0.3,
                  direction: "bottom",
                  random: true,
                  straight: false,
                  outModes: { default: "out" },
                },
              },
              detectRetina: true,
              interactivity: { events: { onHover: { enable: false } } },
            }}
          />
        </div>
        {/* Headings */}
        <TextType
          as="h1"
          text={[
            "Hi, I am Matin Rusydan",
            "An Aspiring Software Engineer",
            "A Technology Enthusiast"
          ]}
          className="font-manrope text-[60px] md:text-[80px] font-normal tracking-[-0.02em] text-primary leading-none text-center h-[1.2em] md:h-auto"
          typingSpeed={75}
          deletingSpeed={50}
          pauseDuration={2000}
        />
        <div className="relative mt-3 text-center inline-block">
          <span className="technology-text block">
            Technology
          </span>
          <span className="enthusiast-text">
            Enthusiast
          </span>
        </div>
        <p className="mt-4 max-w-[60ch] text-pretty text-base md:text-lg text-muted-foreground">
          Bridging User Experience and Advanced Technologies
        </p>

        {/* CTA */}
        <div className="mt-8">
        <Button
          size="lg"
          className="rounded-[50px] px-10 md:px-12 md:py-5"
        >
          Let's Talk
        </Button>
        </div>
    </section>
  )
}
