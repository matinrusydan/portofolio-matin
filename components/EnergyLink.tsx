import React, { useMemo, useRef, useEffect } from "react";
import { gsap } from "gsap";
import * as d3 from "d3";

interface EnergyLinkProps {
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  side: "left" | "right";
  curvature: number;
  iconRef: React.RefObject<SVGImageElement | null>;
  coreCenter: { x: number; y: number };
  debugMode: boolean;
}

const EnergyLink: React.FC<EnergyLinkProps> = ({
  startPos,
  endPos,
  side,
  curvature,
  iconRef,
  coreCenter,
  debugMode,
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  const { pathD, points } = useMemo(() => {
    const centerX = endPos.x;
    const centerY = endPos.y;
    const dir = side === "left" ? 1 : -1;

    // step layout (normalized)
    const yellowX = startPos.x + (centerX - startPos.x) * 0.3;
    const orangeX = startPos.x + (centerX - startPos.x) * 0.6;

    // green (merge) symmetric by side
    const greenX = centerX - dir * 200;
    const greenY = centerY;

    // blue (interlaced control start)
    const blueX = centerX - dir * 100;
    const blueY = centerY;

    // red (center)
    const redX = centerX;
    const redY = centerY;

    // DNA-style interlaced curve control points
    const interlaceSteps = 6;
    const interlaceAmp = 15 * curvature;
    const interlaceWave: [number, number][] = [];
    for (let i = 0; i <= interlaceSteps; i++) {
      const t = i / interlaceSteps;
      const x = d3.interpolateNumber(greenX, redX)(t);
      const y =
        centerY +
        Math.sin(t * Math.PI * 4 + (side === "left" ? 0 : Math.PI)) *
          interlaceAmp *
          (1 - t * 0.5);
      interlaceWave.push([x, y]);
    }

    // combine sections
    const fullPoints: [number, number][] = [
      [startPos.x, startPos.y],
      [yellowX, startPos.y],
      [orangeX, d3.interpolateNumber(startPos.y, centerY)(0.5)],
      [greenX, greenY],
      ...interlaceWave,
    ];

    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.8))
      .x((d: [number, number]) => d[0])
      .y((d: [number, number]) => d[1]);

    const pathD = lineGen(fullPoints) || "";

    return {
      pathD,
      points: {
        start: { x: startPos.x, y: startPos.y },
        yellow: { x: yellowX, y: startPos.y },
        orange: { x: orangeX, y: d3.interpolateNumber(startPos.y, centerY)(0.5) },
        green: { x: greenX, y: greenY },
        blue: { x: blueX, y: blueY },
        red: { x: redX, y: redY },
      },
    };
  }, [startPos, endPos, side, curvature]);

  // GSAP animation (once)
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power1.inOut",
    });
  }, [pathD]);

  return (
    <g>
      <path
        ref={pathRef}
        d={pathD}
        stroke={side === "left" ? "#7C3AED" : "#3B82F6"}
        strokeWidth={3}
        fill="none"
        opacity={0.9}
      />

      {debugMode && points && (
        <>
          <circle cx={points.yellow.x} cy={points.yellow.y} r={4} fill="yellow" />
          <circle cx={points.orange.x} cy={points.orange.y} r={4} fill="orange" />
          <circle cx={points.green.x} cy={points.green.y} r={5} fill="lime" />
          <circle cx={points.blue.x} cy={points.blue.y} r={5} fill="deepskyblue" />
          <circle cx={points.red.x} cy={points.red.y} r={5} fill="red" />
        </>
      )}
    </g>
  );
};

export default EnergyLink;
