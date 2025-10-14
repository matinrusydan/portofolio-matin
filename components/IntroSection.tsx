"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"
import { useRef, useEffect, useState } from "react"

const LightRays = dynamic(() => import("./LightRays"), { ssr: false })

export function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  // Sync LightRays height dynamically with Hero height
  useEffect(() => {
    const updateHeight = () => {
      if (sectionRef.current) {
        setHeight(sectionRef.current.offsetHeight)
      }
    }
    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
    <section ref={sectionRef} id="intro" className="relative w-full overflow-visible bg-gradient-to-b from-black to-[#262626] hero-fade-container">
      {/* Light rays mengikuti tinggi hero */}
      {height && (
        <div className="absolute top-0 left-0 w-full z-[-1]" style={{ height: `${height}px` }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            rayLength={2}
            lightSpread={1.5}
            followMouse={true}
            mouseInfluence={0.1}
          />
        </div>
      )}
      <Hero />
    </section>
  )
}
