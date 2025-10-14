"use client"

import React, { useEffect, useId, useMemo, useRef } from "react"
import { gsap } from "gsap"
import * as d3 from "d3"

// Helper untuk interpolasi linear, jika dibutuhkan
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Side = "left" | "right"

export interface EnergyLinkProps {
  startPos: { x: number; y: number }
  coreCenter: { x: number; y: number }
  side: Side
  index: number
  curvature?: number
  iconColor: string
  debugMode?: boolean
  drawProgress?: number
}

export default React.memo(function EnergyLink({
  startPos,
  coreCenter,
  side,
  index,
  curvature = 0.65,
  iconColor,
  debugMode = false,
  drawProgress = 1,
}: EnergyLinkProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const pathLengthRef = useRef<number>(0)
  const gradId = useId().replaceAll(":", "_") + "-grad"
  const glowId = useId().replaceAll(":", "_") + "-glow"

  const safeStartColor =
    (iconColor || "").toLowerCase() === "#ffffff" || (iconColor || "").toLowerCase() === "white"
      ? side === "left"
        ? "#7C3AED"
        : "#3B82F6"
      : iconColor

  const { d, debugPoints, actualStartPos } = useMemo(() => {
    const dir = side === "left" ? 1 : -1
    const iconRadius = 25
    const actualStartPos = { x: startPos.x + dir * iconRadius, y: startPos.y }
    const dx = Math.abs(coreCenter.x - actualStartPos.x)

    // --- Parameter Kustomisasi ---
    const straightLenRatio = 0.4 
    const converge1Ratio = 0.60
    const braidInset = 80
    
    const ampBase = 10
    const cycles = 1

    const ampModulationCycles = 1.5 
    const ampModulationIntensity = 0.4

    const p1 = { x: actualStartPos.x + dir * (dx * straightLenRatio), y: actualStartPos.y }
    const p2 = {
        x: actualStartPos.x + dir * (dx * converge1Ratio),
        y: lerp(actualStartPos.y, coreCenter.y, 0.5)
    }
    const pBraidStart = { x: coreCenter.x - dir * braidInset, y: coreCenter.y }

    const braidWidth = Math.abs(coreCenter.x - pBraidStart.x)
    const amplitude = ampBase * curvature
    const phase = index * (Math.PI / 2)
    const samplesBraid = 40
    const braidPts: [number, number][] = []

    for (let i = 0; i <= samplesBraid; i++) {
      const t = i / samplesBraid
      const x = pBraidStart.x + dir * braidWidth * t
      
      let taper;
      if (t < 0.5) { 
        const segmentT = t / 0.5;
        taper = lerp(0.4, 0.6, segmentT);
      } else {
        const segmentT = (t - 0.5) / 0.5;
        taper = lerp(0.8, 1.0, segmentT);
      }
      
      const modulator = Math.sin(t * ampModulationCycles * 2 * Math.PI)
      const dynamicAmplitude = amplitude * (1 + modulator * ampModulationIntensity)

      const y = coreCenter.y + Math.sin(t * cycles * 2 * Math.PI + phase) * dynamicAmplitude * taper
      braidPts.push([x, y])
    }
    
    // FIX: Tambahkan titik akhir eksplisit (coreCenter) untuk memastikan garis sampai ke tengah.
    const allPts: [number, number][] = [
      [actualStartPos.x, actualStartPos.y],
      [p1.x, p1.y],
      [p2.x, p2.y],
      [pBraidStart.x, pBraidStart.y],
      ...braidPts,
      [coreCenter.x, coreCenter.y], // Titik ini memastikan garis menyambung sempurna.
    ]

    const line = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => d[0])
      .y((d) => d[1])

    const dStr = line(allPts) || ""

    const debugPoints = { p1, p2, pBraidStart, end: coreCenter }

    return { d: dStr, debugPoints, actualStartPos }
  }, [startPos, coreCenter, side, index, curvature])

  // Smooth GSAP animation with proper easing
  useEffect(() => {
    if (!pathRef.current) return

    const path = pathRef.current
    const len = path.getTotalLength()
    pathLengthRef.current = len

    // Set initial dash array
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len * (1 - drawProgress)
    })

    // Animate to new position with optimized transition
    gsap.to(path, {
      strokeDashoffset: len * (1 - drawProgress),
      duration: 0.2, // Faster response for scroll
      ease: "power1.out", // Simpler easing for better performance
      overwrite: true // More aggressive overwrite
    })
  }, [d, drawProgress])

  return (
    <g>
      <defs>
        {/* PERUBAHAN 1: Gradien dibuat lebih cerah di tengah */}
        <linearGradient
          id={gradId}
          x1={actualStartPos.x} y1={actualStartPos.y}
          x2={coreCenter.x} y2={coreCenter.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={safeStartColor} />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>

        {/* PERUBAHAN 2: Filter yang lebih canggih untuk efek Glow & Glare */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          {/* Lapisan 1: Cahaya (Glow) utama yang lebih lebar dan halus */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur-wide" />
          
          {/* Lapisan 2: Cahaya (Glow) sekunder yang lebih fokus */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur-tight" />
          
          {/* Lapisan 3: Kilau (Glare) menggunakan pencahayaan */}
          <feSpecularLighting in="blur-tight" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor={safeStartColor} result="specularOut">
            <fePointLight x="50" y="50" z="200" />
          </feSpecularLighting>
          <feComposite in="specularOut" in2="SourceAlpha" operator="in" result="specular-glare" />

          {/* Gabungkan semua lapisan */}
          <feMerge>
            <feMergeNode in="blur-wide" />
            <feMergeNode in="blur-tight" />
            <feMergeNode in="specular-glare" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={d}
        stroke={`url(#${gradId})`}
        strokeWidth={2}
        fill="none"
        opacity={0.9}
        // Terapkan filter baru yang sudah canggih
        filter={`url(#${glowId})`}
      />

      {debugMode && (
        <>
          <circle cx={actualStartPos.x} cy={actualStartPos.y} r={3} fill="yellow" />
          <circle cx={debugPoints.p1.x} cy={debugPoints.p1.y} r={3} fill="orange" />
          <circle cx={debugPoints.p2.x} cy={debugPoints.p2.y} r={4} fill="limegreen" />
          <circle cx={debugPoints.pBraidStart.x} cy={debugPoints.pBraidStart.y} r={3} fill="deepskyblue" />
          <circle cx={coreCenter.x} cy={coreCenter.y} r={4} fill="red" />
        </>
      )}
    </g>
  )
})