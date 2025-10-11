"use client"

import React, { useEffect, useRef, useState } from "react"
import CoreLogo from "./CoreLogo"
import EnergyLink from "./EnergyLink"
import { SiReact, SiFigma, SiPython, SiJavascript, SiNodedotjs, SiTypescript, SiNextdotjs, SiLaravel } from 'react-icons/si'

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 480 })
  const [debugMode, setDebugMode] = useState(false)
  const [drawProgress, setDrawProgress] = useState(0)

  
  const colorPalette = [
    '#e81cff', // Magenta
    '#40c9ff', // Cyan
    '#ff00a2', // Pink Terang
    '#40c9ff', // Cyan (diulang untuk variasi)
  ];

  const leftIcons = [
    { name: "React", component: SiReact },
    { name: "Figma", component: SiFigma },
    { name: "Python", component: SiPython },
    { name: "JavaScript", component: SiJavascript },
  ]
  const rightIcons = [
    { name: "Node.js", component: SiNodedotjs },
    { name: "TypeScript", component: SiTypescript },
    { name: "Next.js", component: SiNextdotjs },
    { name: "Laravel", component: SiLaravel },
  ]

  // --- PERUBAHAN DI SINI ---

  // 1. Definisikan titik tengah untuk tujuan GARIS
  const lineCenterPos = { 
    x: dimensions.width / 2, 
    y: dimensions.height / 2 
  };

  // 2. Definisikan posisi untuk LOGO dengan offset vertikal
  const verticalOffset = 30; // Geser logo ke atas sejauh 30px
  const logoCenterPos = {
    x: dimensions.width / 2,
    y: (dimensions.height / 2) - verticalOffset,
  };

  const getIconPosition = (side: "left" | "right", index: number) => {
    const rows = 4
    const topPadding = 250
    const bottomPadding = 250
    const usable = dimensions.height - topPadding - bottomPadding
    const spacing = usable / (rows - 1)
    const y = topPadding + spacing * index
    const horizontalMargin = 220
    const x = side === "left" ? horizontalMargin : dimensions.width - horizontalMargin
    return { x, y }
  }

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
    const calculateDrawProgress = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress based on element position
      const elementTop = rect.top
      const elementBottom = rect.bottom
      const elementHeight = rect.height

      // Progress starts when top of element reaches top of viewport
      // Peaks when center of element is at center of viewport
      // Ends when bottom of element reaches bottom of viewport

      let progress = 0

      if (elementTop <= 0 && elementBottom >= windowHeight) {
        // Element is fully in view, center it
        progress = 1
      } else if (elementTop > 0) {
        // Element entering from top
        const enterProgress = 1 - (elementTop / windowHeight)
        progress = Math.max(0, Math.min(1, enterProgress))
      } else if (elementBottom < windowHeight) {
        // Element exiting to bottom
        const exitProgress = elementBottom / windowHeight
        progress = Math.max(0, Math.min(1, exitProgress))
      }

      setDrawProgress(progress)
    }

    const handleScroll = () => {
      requestAnimationFrame(calculateDrawProgress)
    }

    calculateDrawProgress()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
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