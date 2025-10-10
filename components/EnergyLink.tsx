"use client"

import { useEffect, useId, useMemo, useRef } from "react"
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
}

export default function EnergyLink({
  startPos,
  coreCenter,
  side,
  index,
  curvature = 0.65,
  iconColor,
  debugMode = false,
}: EnergyLinkProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const gradId = useId().replaceAll(":", "_") + "-grad"
  const glowId = useId().replaceAll(":", "_") + "-glow"

  const safeStartColor =
    (iconColor || "").toLowerCase() === "#ffffff" || (iconColor || "").toLowerCase() === "white"
      ? side === "left"
        ? "#7C3AED"
        : "#3B82F6"
      : iconColor

  const { d, debugPoints } = useMemo(() => {
    const dir = side === "left" ? 1 : -1
    const dx = Math.abs(coreCenter.x - startPos.x)

    // --- Parameter Kustomisasi ---
    const straightLenRatio = 0.4 
    const converge1Ratio = 0.60
    const braidInset = 80
    
    // --- Parameter Jalinan Kurva (Interlaced) ---
    const ampBase = 14
    // UBAH DI SINI: Kurangi jumlah gelombang agar lebih renggang (sebelumnya 3.5)
    const cycles = 2.5 

    // Parameter untuk Amplitudo Dinamis/Organik
    const ampModulationCycles = 1.5 
    const ampModulationIntensity = 0.4

    // TAHAP 1: Garis Lurus
    const p1 = { x: startPos.x + dir * (dx * straightLenRatio), y: startPos.y }

    // TAHAP 2: Mengerucut Pertama
    const p2 = {
        x: startPos.x + dir * (dx * converge1Ratio),
        y: lerp(startPos.y, coreCenter.y, 0.5) 
    }

    // TAHAP 3: Mengerucut Final
    const pBraidStart = { x: coreCenter.x - dir * braidInset, y: coreCenter.y }

    // TAHAP 4: Jalinan Kurva dengan Amplitudo Dinamis
    const braidWidth = Math.abs(coreCenter.x - pBraidStart.x)
    const amplitude = ampBase * curvature
    const phase = index * (Math.PI / 2)
    const samplesBraid = 40
    const braidPts: [number, number][] = []

    for (let i = 0; i <= samplesBraid; i++) {
      const t = i / samplesBraid
      const x = pBraidStart.x + dir * braidWidth * t
      const taper = 1 - t * 0.25
      
      const modulator = Math.sin(t * ampModulationCycles * 2 * Math.PI)
      const dynamicAmplitude = amplitude * (1 + modulator * ampModulationIntensity)

      const y = coreCenter.y + Math.sin(t * cycles * 2 * Math.PI + phase) * dynamicAmplitude * taper
      braidPts.push([x, y])
    }
    
    const allPts: [number, number][] = [
      [startPos.x, startPos.y],
      [p1.x, p1.y],
      [p2.x, p2.y],
      [pBraidStart.x, pBraidStart.y],
      ...braidPts,
    ]

    const line = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => d[0])
      .y((d) => d[1])

    const dStr = line(allPts) || ""

    const debugPoints = { p1, p2, pBraidStart, end: coreCenter }

    return { d: dStr, debugPoints }
  }, [startPos, coreCenter, side, index, curvature])

  // GSAP draw animation
  useEffect(() => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len })
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 5.5,
      ease: "power1.inOut",
    })
  }, [d])

  return (
    <g>
      <defs>
        <linearGradient
          id={gradId}
          x1={startPos.x}
          y1={startPos.y}
          x2={coreCenter.x}
          y2={coreCenter.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={safeStartColor} />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
          <feColorMatrix in="blur1" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={d}
        stroke={`url(#${gradId})`}
        // UBAH DI SINI: Kurangi ketebalan garis (sebelumnya 3)
        strokeWidth={2}
        fill="none"
        opacity={0.9}
        filter={`url(#${glowId})`}
      />

      {debugMode && (
        <>
          <circle cx={startPos.x} cy={startPos.y} r={3} fill="yellow" />
          <circle cx={debugPoints.p1.x} cy={debugPoints.p1.y} r={3} fill="orange" />
          <circle cx={debugPoints.p2.x} cy={debugPoints.p2.y} r={4} fill="limegreen" />
          <circle cx={debugPoints.pBraidStart.x} cy={debugPoints.pBraidStart.y} r={3} fill="deepskyblue" />
          <circle cx={coreCenter.x} cy={coreCenter.y} r={4} fill="red" />
        </>
      )}
    </g>
  )
}