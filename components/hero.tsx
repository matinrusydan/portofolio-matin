"use client"

import { Button } from "@/components/ui/button"
import TextType from "@/components/TextType"

export function Hero() {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center px-6 md:px-8 min-h-[100vh] overflow-visible bg-transparent pt-[120px] z-10"
      aria-label="Intro"
    >
      {/* Headings */}
      <TextType
        as="h1"
        text={["Hi, I am Matin Rusydan"]}
        className="font-manrope text-4xl sm:text-6xl md:text-7xl font-normal tracking-[-0.02em] text-primary leading-tight text-center mb-4 h-[1.2em] md:h-auto"
        typingSpeed={75}
        deletingSpeed={50}
        pauseDuration={2000}
      />
      <div className="relative mt-2 sm:mt-4 text-center inline-block leading-none">
        <span className="modern-hero-text text-5xl sm:text-6xl md:text-7xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Technology
        </span>
        <span className="block text-5xl sm:text-6xl md:text-7xl font-light text-muted-foreground tracking-tight">
          Enthusiast
        </span>
      </div>
      <p className="mt-4 max-w-[60ch] text-pretty text-base md:text-lg text-muted-foreground">
        Bridging User Experience and Advanced Technologies
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Button size="lg" className="rounded-[50px] px-10 md:px-12 md:py-5">
          Lets Talk
        </Button>
      </div>
    </div>
  )
}
