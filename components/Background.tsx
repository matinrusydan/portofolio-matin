"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const LightRaysClient = dynamic(() => import("./LightRays"), { ssr: false })

export function Background() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none translate-y-0 sm:translate-y-8 md:translate-y-0">
      {/* LightRays removed - now only in IntroSection */}
    </div>
  )
}