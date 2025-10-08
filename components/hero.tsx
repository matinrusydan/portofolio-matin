"use client"

import { Button } from "@/components/ui/button"


export function Hero() {
  return (
      <section
        className="relative isolate flex min-h-screen flex-col items-center justify-center text-center px-6 md:px-8 pt-32 md:pt-40"
        aria-label="Intro"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 ray-bg" aria-hidden="true" />
        {/* Headings */}
        <h1 className="font-manrope text-[80px] font-normal tracking-[-0.02em] text-primary leading-none">
          HI, I am Matin Rusydan
        </h1>
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
          className="rounded-[50px] !rounded-[50px] px-10 md:px-12 md:py-5"
        >
          Lets Talk
        </Button>
        </div>
    </section>
  )
}
