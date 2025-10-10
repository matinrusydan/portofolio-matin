"use client"

import React, { useEffect, useRef, useState } from "react"
import CoreLogo from "./CoreLogo"
import TechIcon from "./TechIcon"
import EnergyLink from "./EnergyLink"

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 480 })
  const [debugMode, setDebugMode] = useState(false) // Toggle for debug markers

  // Refs for icons (kept for future interactions)
  const leftIconRefs = useRef<React.RefObject<SVGImageElement | null>[]>([])
  const rightIconRefs = useRef<React.RefObject<SVGImageElement | null>[]>([])
  if (leftIconRefs.current.length === 0) {
    leftIconRefs.current = Array(4)
      .fill(null)
      .map(() => React.createRef<SVGImageElement | null>())
    rightIconRefs.current = Array(4)
      .fill(null)
      .map(() => React.createRef<SVGImageElement | null>())
  }


  

  const colorPalette = [
    '#e81cff', // Magenta
    '#40c9ff', // Cyan
    '#ff00a2', // Pink Terang
    '#40c9ff', // Cyan (diulang untuk variasi)
  ];

  // Use placeholders to guarantee previewed icons
  const leftIcons = [
    { name: "React", src: "/react-logo.png", color: "#61DAFB" },
    { name: "C++", src: "/c---logo.jpg", color: "#00599C" },
    { name: "Python", src: "/python-logo.png", color: "#3776AB" },
    { name: "JavaScript", src: "/javascript-logo.png", color: "#F7DF1E" },
  ]
  const rightIcons = [
    { name: "Node.js", src: "/nodejs-logo.png", color: "#3C873A" },
    { name: "TypeScript", src: "/typescript-logo.png", color: "#3178C6" },
    { name: "Next.js", src: "/nextjs-logo.png", color: "#FFFFFF" },
    { name: "Laravel", src: "/laravel-logo.jpg", color: "#FF2D20" },
  ]


  
  const centerPos = { x: dimensions.width / 2, y: dimensions.height / 2 }

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

      {debugMode && (
        <div className="absolute top-4 left-4 z-10">
          <figure className="opacity-75">
            <img
              src="/images/reference-screenshot.png"
              alt="Reference screenshot"
              className="w-[320px] h-auto rounded"
            />
            <figcaption className="text-xs mt-1 text-neutral-300">Referensi tata letak target</figcaption>
          </figure>
        </div>
      )}

      <svg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full">
        {/* Links from left */}
        {leftIcons.map((icon, i) => {
          const start = getIconPosition("left", i)
          return (
            <EnergyLink
              key={`left-link-${i}`}
              startPos={start}
              coreCenter={centerPos}
              side="left"
              index={i}
              curvature={0.7}
              iconColor={colorPalette[i % colorPalette.length]} 
              debugMode={debugMode}
            />
          )
        })}

        {/* Links from right */}
        {rightIcons.map((icon, i) => {
          const start = getIconPosition("right", i)
          return (
            <EnergyLink
              key={`right-link-${i}`}
              startPos={start}
              coreCenter={centerPos}
              side="right"
              index={i}
              curvature={0.7}
              iconColor={colorPalette[i % colorPalette.length]} 
              debugMode={debugMode}
            />
          )
        })}

        {/* Tech Icons */}
        {leftIcons.map((icon, i) => (
          <TechIcon
            key={`left-icon-${i}`}
            ref={leftIconRefs.current[i]}
            src={icon.src}
            position={getIconPosition("left", i)}
            side="left"
          />
        ))}
        {rightIcons.map((icon, i) => (
          <TechIcon
            key={`right-icon-${i}`}
            ref={rightIconRefs.current[i]}
            src={icon.src}
            position={getIconPosition("right", i)}
            side="right"
          />
        ))}

        {/* Core Logo */}
        <CoreLogo position={centerPos} />
      </svg>
    </div>
  )
}

export default SkillsNetwork
