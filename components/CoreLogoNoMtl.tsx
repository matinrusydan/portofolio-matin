import type React from "react"

interface CoreLogoProps {
  position: { x: number; y: number }
}

const CoreLogo: React.FC<CoreLogoProps> = ({ position }) => {
  return (
    <g transform={`translate(${position.x - 50}, ${position.y - 50})`}>
      {/* Glow effect */}
      <circle
        cx="50"
        cy="50"
        r="60"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.3"
        filter="url(#glow-filter)"
      />
      {/* Logo placeholder - replace with actual SVG */}
      <image href="/logo-matbrew.svg" x="25" y="25" width="50" height="50" className="core-logo" />
    </g>
  )
}

export default CoreLogo
