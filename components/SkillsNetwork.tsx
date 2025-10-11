"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CoreLogo from "./CoreLogo"
import EnergyLink from "./EnergyLink"
import { SiReact, SiFigma, SiPython, SiJavascript, SiNodedotjs, SiTypescript, SiNextdotjs, SiLaravel } from 'react-icons/si'

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 480 })
  const [debugMode, setDebugMode] = useState(false)
  const [drawProgress, setDrawProgress] = useState(0)

  
  const colorPalette = useMemo(() => [
    '#e81cff', // Magenta
    '#40c9ff', // Cyan
    '#ff00a2', // Pink Terang
    '#40c9ff', // Cyan (diulang untuk variasi)
  ], []);

  const leftIcons = useMemo(() => [
    { name: "React", component: SiReact },
    { name: "Figma", component: SiFigma },
    { name: "Python", component: SiPython },
    { name: "JavaScript", component: SiJavascript },
  ], []);

  const rightIcons = useMemo(() => [
    { name: "Node.js", component: SiNodedotjs },
    { name: "TypeScript", component: SiTypescript },
    { name: "Next.js", component: SiNextdotjs },
    { name: "Laravel", component: SiLaravel },
  ], []);

  // --- PERUBAHAN DI SINI ---

  // 1. Definisikan titik tengah untuk tujuan GARIS
  const lineCenterPos = { 
    x: dimensions.width / 2, 
    y: dimensions.height / 2 
  };

  // 2. Definisikan posisi untuk LOGO dengan offset vertikal
  const verticalOffset = 30; // Geser logo ke atas sejauh 30px
  const logoCenterPos = useMemo(() => ({
    x: dimensions.width / 2,
    y: (dimensions.height / 2) - verticalOffset,
  }), [dimensions.width, dimensions.height]);

  const getIconPosition = useCallback((side: "left" | "right", index: number) => {
    const rows = 4
    const topPadding = 250
    const bottomPadding = 250
    const usable = dimensions.height - topPadding - bottomPadding
    const spacing = usable / (rows - 1)
    const y = topPadding + spacing * index
    const horizontalMargin = 220
    const x = side === "left" ? horizontalMargin : dimensions.width - horizontalMargin
    return { x, y }
  }, [dimensions.width, dimensions.height])

  useEffect(() => {
    const updateDimensions = () => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      setDimensions({ width: rect.width, height: rect.height })
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Smooth easing function for progress
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    }

    // Calculate progress based on how centered the element is in viewport
    const calculateProgress = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (!entry) return

      const rect = entry.boundingClientRect
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2

      // Distance from element center to viewport center
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter)

      // Maximum distance where we still want some effect
      const maxDistance = windowHeight / 2 + rect.height / 2

      // Progress is highest when element is centered, lowest when far from center
      const rawProgress = 1 - (distanceFromCenter / maxDistance)

      // Clamp and ease
      const clampedProgress = Math.max(0, Math.min(1, rawProgress))
      const easedProgress = easeInOutQuad(clampedProgress)

      setDrawProgress(easedProgress)
    }

    // Create IntersectionObserver with multiple thresholds for smooth transitions
    const observer = new IntersectionObserver(calculateProgress, {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0.00, 0.01, ..., 1.00
      rootMargin: '0px 0px -10% 0px' // Trigger slightly before/after viewport
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-screen bg-black text-white relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button onClick={() => setDebugMode(!debugMode)} className="bg-white text-black px-3 py-1.5 rounded">
          Debug: {debugMode ? "ON" : "OFF"}
        </button>
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full">
        {/* Links from left */}
        {leftIcons.map((_, i) => {
          const start = getIconPosition("left", i)
          return (
            <EnergyLink
              key={`left-link-${i}`}
              startPos={start}
              // 3. Gunakan `lineCenterPos` untuk garis
              coreCenter={lineCenterPos}
              side="left"
              index={i}
              curvature={0.7}
              iconColor={colorPalette[i % colorPalette.length]}
              debugMode={debugMode}
              drawProgress={drawProgress}
            />
          )
        })}

        {/* Links from right */}
        {rightIcons.map((_, i) => {
          const start = getIconPosition("right", i)
          return (
            <EnergyLink
              key={`right-link-${i}`}
              startPos={start}
              // 4. Gunakan `lineCenterPos` untuk garis
              coreCenter={lineCenterPos}
              side="right"
              index={i}
              curvature={0.7}
              iconColor={colorPalette[i % colorPalette.length]}
              debugMode={debugMode}
              drawProgress={drawProgress}
            />
          )
        })}

        {/* Tech Icons */}
        {leftIcons.map((icon, i) => {
          const pos = getIconPosition("left", i)
          return (
            <g key={`left-icon-${i}`} transform={`translate(${pos.x - 25}, ${pos.y - 25})`}>
              <icon.component size={50} color="white" />
            </g>
          )
        })}
        {rightIcons.map((icon, i) => {
          const pos = getIconPosition("right", i)
          return (
            <g key={`right-icon-${i}`} transform={`translate(${pos.x - 25}, ${pos.y - 25})`}>
              <icon.component size={50} color="white" />
            </g>
          )
        })}

        {/* Core Logo */}
        {/* 5. Gunakan `logoCenterPos` untuk logo */}
        <CoreLogo position={logoCenterPos} />
      </svg>
    </div>
  )
}

export default SkillsNetwork