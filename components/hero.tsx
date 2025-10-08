"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-screen flex-col items-center justify-center text-center px-6 md:px-8"
      aria-label="Intro"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 ray-bg" aria-hidden="true" />
      {/* Headings */}
      <h1 className="text-balance text-3xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] text-primary">
        HI, I am Matin Rusydan
      </h1>
      <div className="relative mt-3 flex justify-center items-center">
        <span className="technology-text">
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
          className="px-6 md:px-8 shadow-[0_0_24px_rgba(255,255,255,0.06)] hover:shadow-[0_0_36px_rgba(255,255,255,0.1)]"
        >
          Lets Talk
        </Button>
      </div>
    </section>
  )
}
