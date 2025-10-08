"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-screen flex-col items-center justify-center text-center px-6 md:px-8"
      aria-label="Intro"
    >
      {/* Light rays + spotlight */}
      <div className="pointer-events-none absolute inset-0 -z-10 ray-bg" aria-hidden="true" />
      {/* Optional location */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
        West Java, Indonesia
      </div>

      {/* Headings */}
      <h1 className="text-balance text-3xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] text-primary">
        HI, I am Matin Rusydan
      </h1>
      <p className="mt-3 text-balance text-2xl md:text-4xl font-bold text-foreground/90">Technology Enthusiast</p>
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
