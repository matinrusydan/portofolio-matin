import React from 'react';

interface TechIconProps {
  src: string;
  position: { x: number; y: number };
  side: 'left' | 'right';
}

const TechIcon: React.FC<TechIconProps> = ({ src, position, side }) => {
  return (
    <image
      href={src}
      x={position.x - 25}
      y={position.y - 25}
      width="50"
      height="50"
      className="tech-icon"
      style={{ cursor: 'pointer' }}
    />
  );
};

export default TechIcon;