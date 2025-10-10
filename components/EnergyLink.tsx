import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

interface EnergyLinkProps {
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  side: 'left' | 'right';
  index?: number;
}

const EnergyLink: React.FC<EnergyLinkProps> = ({
  startPos,
  endPos,
  side,
  index = 0,
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  /**
   * Generates a multi-segment SVG path for a clean, interlaced neural network look.
   * The path consists of four main segments:
   * A: A straight line creating a tapering effect.
   * B: A smooth elbow curve downwards.
   * C: A sinusoidal "interlaced" weave resembling a DNA strand.
   * D: A final connecting point that stops short of the center logo.
   */
  const generatePath = useMemo(() => () => {
    // --- Visual Configuration ---
    const straightRatio = 0.55;      // 🔹 55% of the initial distance is a straight line.
    const cornerRadius = 50;         // 🔹 Radius of the elbow bend for a smooth turn.
    const interlaceAmplitude = 9;    // 🔹 Amplitude of the sinusoidal weave (±9px).
    const interlaceLoops = 2.5;      // 🔹 Number of twists in the central weave.
    const verticalOffset = 80;       // 🔹 How far below the center line the weave occurs.
    const stopBeforeCenter = 40;     // 🔹 Final gap from the line's end to the center logo.

    // --- Key Point Calculations ---
    const dx = endPos.x - startPos.x;
    const xDirection = side === 'left' ? 1 : -1;

    // --- SEGMENT A: Initial Straight Line ---
    // This part creates the "tapering" effect as lines converge towards the center.
    const p1 = {
      x: startPos.x + dx * straightRatio,
      y: startPos.y,
    };

    // --- SEGMENT B: Smooth Elbow Curve ---
    // A quadratic bezier curve ('Q') creates a smooth, non-sharp downward turn.
    const p2_control = { x: p1.x + cornerRadius * xDirection, y: p1.y };
    const p2 = {
      x: p1.x + cornerRadius * xDirection,
      y: p1.y + cornerRadius,
    };

    // --- SEGMENT C: Interlaced Weave ---
    // Defines the start and end points for the sinusoidal DNA-like weave.
    const interlaceStartY = endPos.y + verticalOffset;
    const p3_start = { x: p2.x, y: interlaceStartY };
    
    const interlaceEndX = endPos.x - (stopBeforeCenter * xDirection);
    const p3_end = { x: interlaceEndX, y: interlaceStartY };
    
    // --- Build the SVG Path String ---
    let pathData = `M ${startPos.x},${startPos.y}`; // Starting Point

    // Add Segment A: The straight horizontal line
    pathData += ` L ${p1.x},${p1.y}`;

    // Add Segment B: The elbow curve and a vertical line connecting to the weave area
    pathData += ` Q ${p2_control.x},${p2_control.y} ${p2.x},${p2.y}`;
    pathData += ` L ${p2.x},${p3_start.y}`; 

    // Add Segment C: The Sinusoidal Interlaced Weave
    const segments = 60; // Increased segments for a smoother wave
    // The phase is set to be opposite (π radians) for left vs. right sides to create the interlacing.
    // The 'index' prop adds a slight phase offset to each line for organic variation.
    const phase = (side === 'left' ? Math.PI : 0) + (index * 0.5); 

    for (let i = 1; i <= segments; i++) {
      const t = i / segments; // Represents progress along the weave (0 to 1)
      const currentX = p3_start.x + (p3_end.x - p3_start.x) * t;
      
      const wave = Math.sin(t * interlaceLoops * 2 * Math.PI + phase) * interlaceAmplitude;
      const currentY = p3_start.y + wave;
      
      pathData += ` L ${currentX.toFixed(2)},${currentY.toFixed(2)}`;
    }

    // --- SEGMENT D: Final Link ---
    // The last point of the weave serves as the final connecting point, completing the path.
    pathData += ` L ${p3_end.x},${p3_end.y}`;

    return pathData;
  }, [startPos, endPos, side, index]);

  const pathD = generatePath();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();

    // GSAP animation for a flowing "energy" effect along the path
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 5.5, // Duration within the 5-6s specification
      ease: 'power1.inOut',
      repeat: -1, // Infinite loop
      repeatDelay: 0.5,
    });
  }, [pathD]);

  return (
    <path
      ref={pathRef}
      d={pathD}
      stroke={side === 'left' ? '#7C3AED' : '#3B82F6'}
      strokeWidth="2.5"
      fill="none"
      filter="url(#glow-filter)" // Uses a soft glow effect instead of an energy filter
      opacity="0.9"
      style={{ cursor: 'pointer' }}
      // GSAP-powered hover effects for better interactivity
      onMouseEnter={() =>
        gsap.to(pathRef.current, { opacity: 1, strokeWidth: 3.5, duration: 0.3 })
      }
      onMouseLeave={() =>
        gsap.to(pathRef.current, { opacity: 0.9, strokeWidth: 2.5, duration: 0.3 })
      }
    />
  );
};

export default EnergyLink;