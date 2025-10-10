"use client"
import React from "react"

interface TechIconProps {
  src: string
  position: { x: number; y: number }
  side: "left" | "right"
}

const TechIcon = React.forwardRef<SVGImageElement | null, TechIconProps>(({ src, position, side }, ref) => {
  return (
    <image
      ref={ref}
      href={src}
      x={position.x - 25}
      y={position.y - 25}
      width="50"
      height="50"
      className="tech-icon"
      style={{ cursor: "pointer" }}
    />
  )
})

TechIcon.displayName = "TechIcon"

export default TechIcon
