import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

interface EnergyLinkProps {
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  side: 'left' | 'right';
  curvature?: number; // 0–1
}

const EnergyLink: React.FC<EnergyLinkProps> = ({
  startPos,
  endPos,
  side,
  curvature = 0.4,
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  const generatePath = () => {
    const centerRadius = 25;
    const straightRatio = 0.88; // garis lurus dulu ~88%
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // arah vektor ke logo
    const dirX = dx / dist;
    const dirY = dy / dist;

    // titik akhir di tepi lingkaran
    const adjustedEndX = endPos.x - dirX * centerRadius;
    const adjustedEndY = endPos.y - dirY * centerRadius;

    // titik elbow (tempat belok mulai)
    const elbowX = startPos.x + dx * straightRatio;
    const elbowY = startPos.y;

    // titik “knot” sedikit sebelum logo, tempat jalur-jalur bertemu
    const knotOffset = side === 'left' ? 8 : -8;
    const knotX = endPos.x - dirX * (centerRadius + 8);
    const knotY = endPos.y + knotOffset;

    // control point sedikit naik/turun agar lengkungnya organik
    const controlY =
      elbowY + (knotY - elbowY) * 0.5 + (Math.random() - 0.5) * 10;

    // path: lurus → lengkung → sambung ke logo
    return `M ${startPos.x},${startPos.y}
            L ${elbowX},${elbowY}
            Q ${elbowX + (knotX - elbowX) * curvature},${controlY}
              ${knotX},${knotY}
            L ${adjustedEndX},${adjustedEndY}`;
  };

  const pathD = useMemo(generatePath, [startPos, endPos, side, curvature]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3.5,
      ease: 'none',
      repeat: -1,
    });
  }, [pathD]);

  return (
    <path
      ref={pathRef}
      d={pathD}
      stroke={side === 'left' ? '#7C3AED' : '#3B82F6'}
      strokeWidth="3"
      fill="none"
      filter="url(#energy-filter)"
      opacity="0.85"
      onMouseEnter={() => gsap.to(pathRef.current, { opacity: 1, duration: 0.3 })}
      onMouseLeave={() => gsap.to(pathRef.current, { opacity: 0.85, duration: 0.3 })}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default EnergyLink;
