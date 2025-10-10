"use client"

import { useEffect, useRef, useState } from 'react';
import CoreLogo from './CoreLogo';
import TechIcon from './TechIcon';
import EnergyLink from './EnergyLink';

const SkillsNetwork = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Data ikon tidak berubah
  const leftIcons = [
    { name: 'React', src: '/react-icon.svg' },
    { name: 'C++', src: '/cpp-icon.svg' },
    { name: 'Python', src: '/python-icon.svg' },
    { name: 'JavaScript', src: '/js-icon.svg' },
  ];

  const rightIcons = [
    { name: 'Node.js', src: '/node-icon.svg' },
    { name: 'TypeScript', src: '/ts-icon.svg' },
    { name: 'Next.js', src: '/next-icon.svg' },
    { name: 'Laravel', src: '/laravel-icon.svg' },
  ];

  const centerPos = { x: dimensions.width / 2, y: dimensions.height / 2 };

  const getIconPosition = (side: 'left' | 'right', index: number) => {
    const spacing = dimensions.height / (leftIcons.length + 1);
    const y = spacing * (index + 1);
    const x = side === 'left' ? 100 : dimensions.width - 100;
    return { x, y };
  };

  useEffect(() => {
    // ... useEffect untuk dimensi tidak berubah ...
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
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
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
              index={i}
              // ❌ Prop logoDimensions dan totalLinks dihapus
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
              index={i}
              // ❌ Prop logoDimensions dan totalLinks dihapus
            />
          );
        })}

        {/* ... sisa komponen TechIcon dan CoreLogo tidak berubah ... */}
        
        {/* Tech Icons */}
        {leftIcons.map((icon, i) => (
          <TechIcon
            key={`left-icon-${i}`}
            src={icon.src}
            position={getIconPosition('left', i)}
            side="left"
          />
        ))}
        {rightIcons.map((icon, i) => (
          <TechIcon
            key={`right-icon-${i}`}
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