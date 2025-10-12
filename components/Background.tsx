"use client"

import dynamic from "next/dynamic"

const LightRaysClient = dynamic(() => import("./LightRays"), { ssr: false })

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none translate-y-0 sm:translate-y-8 md:translate-y-0">
      <LightRaysClient />
    </div>
  )
}