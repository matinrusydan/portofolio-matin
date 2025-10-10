'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import '@/styles/TrueFocus.css'; // Pastikan path ini sesuai dengan struktur proyek Anda

// Definisikan tipe untuk props
interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'True Focus',
  manualMode = true, // Diubah ke true untuk interaksi mouse
  blurAmount = 5,
  borderColor = '#FFFFFF', // Warna disesuaikan untuk background gelap
  animationDuration = 0.3,
  pauseBetweenAnimations = 1,
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev !== null ? (prev + 1) % words.length : 0));
      }, (animationDuration + pauseBetweenAnimations) * 1000);
      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || !wordRefs.current[currentIndex] || !containerRef.current) return;
    
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
    
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => { wordRefs.current[index] = el; }}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}
      <motion.div
        className="focus-frame"
        initial={{ opacity: 0 }}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex !== null ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{ '--border-color': borderColor } as any}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
