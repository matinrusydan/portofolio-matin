"use client"

import React, { useEffect, useRef, useState } from "react"
import CoreLogo from "./CoreLogo"
import EnergyLink from "./EnergyLink"
import { SiReact, SiCplusplus, SiPython, SiJavascript, SiNodedotjs, SiTypescript, SiNextdotjs, SiLaravel } from 'react-icons/si'

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 480 })
  const [debugMode, setDebugMode] = useState(false)

  
  const colorPalette = [
    '#e81cff', // Magenta
    '#40c9ff', // Cyan
    '#ff00a2', // Pink Terang
    '#40c9ff', // Cyan (diulang untuk variasi)
  ];

  const leftIcons = [
    { name: "React", component: SiReact },
    { name: "C++", component: SiCplusplus },
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

  return (
    <div className="w-full h-screen bg-black text-white relative">
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