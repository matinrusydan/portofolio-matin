"use client"

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import CoreLogo from './CoreLogo';
import TechIcon from './TechIcon';
import EnergyLink from './EnergyLink';

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Icon data
  const leftIcons = [
    { name: 'React', src: '/react-icon.svg', index: 0 },
    { name: 'C++', src: '/cpp-icon.svg', index: 1 },
    { name: 'Python', src: '/python-icon.svg', index: 2 },
    { name: 'JavaScript', src: '/js-icon.svg', index: 3 },
  ];

  const rightIcons = [
    { name: 'Node.js', src: '/node-icon.svg', index: 0 },
    { name: 'TypeScript', src: '/ts-icon.svg', index: 1 },
    { name: 'Next.js', src: '/next-icon.svg', index: 2 },
    { name: 'Laravel', src: '/laravel-icon.svg', index: 3 },
  ];

  const centerPos = { x: dimensions.width / 2, y: dimensions.height / 2 };

  // Calculate icon positions
  const getIconPosition = (side: 'left' | 'right', index: number) => {
    const spacing = dimensions.height / 5;
    const y = spacing * (index + 1);
    const x = side === 'left' ? 100 : dimensions.width - 100;
    return { x, y };
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        <defs>
          {/* Turbulence filter for electric effect */}
          <filter id="energy-filter" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise1" scale="30" />
          </filter>
          {/* Glow filter for logo */}
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Energy Links */}
        {leftIcons.map((icon, i) => {
          const start = getIconPosition('left', i);
          return (
            <EnergyLink
              key={`left-${i}`}
              startPos={start}
              endPos={centerPos}
              side="left"
              curvature={0.4}
            />
          );
        })}
        {rightIcons.map((icon, i) => {
          const start = getIconPosition('right', i);
          return (
            <EnergyLink
              key={`right-${i}`}
              startPos={start}
              endPos={centerPos}
              side="right"
              curvature={0.4}
            />
          );
        })}

        {/* Tech Icons */}
        {leftIcons.map((icon, i) => (
          <TechIcon
            key={`left-${i}`}
            src={icon.src}
            position={getIconPosition('left', i)}
            side="left"
          />
        ))}
        {rightIcons.map((icon, i) => (
          <TechIcon
            key={`right-${i}`}
            src={icon.src}
            position={getIconPosition('right', i)}
            side="right"
          />
        ))}

        {/* Core Logo */}
        <CoreLogo position={centerPos} />
      </svg>
    </div>
  );
};

export default SkillsNetwork;