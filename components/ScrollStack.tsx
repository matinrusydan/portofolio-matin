'use client';

import { useLayoutEffect, useRef, useCallback, ReactNode, CSSProperties } from 'react';
import Lenis from 'lenis';

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 bg-[oklch(0.985_0_0)] shadow-[0_0_30px_rgba(255,255,255,0.1)] box-border origin-top will-change-transform text-[oklch(0.17_0_0)] rounded-xl ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      contain: 'layout paint style'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  holdZone?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 200,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '40%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  holdZone = 0.2,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef<Map<number, any>>(new Map());
  const displayedTransformsRef = useRef<Map<number, any>>(new Map());
  const lastScrollTopRef = useRef<number>(-1);
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(String(value));
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) {
        return {
          scrollTop: 0,
          containerHeight: 0,
          scrollContainer: document.body
        };
      }
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const shouldUpdate = (scrollTop: number) => {
    const last = lastScrollTopRef.current;
    if (last === -1) return true;
    // threshold to avoid tiny updates causing repaints
    return Math.abs(scrollTop - last) > 0.5;
  };

  const applyTransformToCard = (card: HTMLElement, i: number, target: { translateY: number; scale: number; rotation: number; blur: number }) => {
    const displayed = displayedTransformsRef.current.get(i) || { ...target };
    // lerp smoothing factor - tune 0.15..0.35
    const t = 0.22;
    const smoothed = {
      translateY: lerp(displayed.translateY ?? target.translateY, target.translateY, t),
      scale: lerp(displayed.scale ?? target.scale, target.scale, t),
      rotation: lerp(displayed.rotation ?? target.rotation, target.rotation, t),
      blur: lerp(displayed.blur ?? target.blur, target.blur, t)
    };

    // Only apply if significant change
    const last = lastTransformsRef.current.get(i);
    const delta =
      !last ||
      Math.abs(last.translateY - smoothed.translateY) > 0.3 ||
      Math.abs(last.scale - smoothed.scale) > 0.001 ||
      Math.abs(last.rotation - smoothed.rotation) > 0.2 ||
      Math.abs(last.blur - smoothed.blur) > 0.5;

    if (delta) {
      const transform = `translate3d(0, ${Math.round(smoothed.translateY * 100) / 100}px, 0) scale(${Math.round(smoothed.scale * 1000) / 1000}) rotate(${Math.round(smoothed.rotation * 100) / 100}deg)`;
      const filter = smoothed.blur > 0 ? `blur(${Math.round(smoothed.blur * 100) / 100}px)` : '';
      // apply styles
      card.style.transform = transform;
      card.style.filter = filter;
      // cache
      lastTransformsRef.current.set(i, smoothed);
      displayedTransformsRef.current.set(i, smoothed);
    }
  };

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();

    // only update when scroll moved meaningfully
    if (!shouldUpdate(scrollTop)) return;
    lastScrollTopRef.current = scrollTop;

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement as HTMLElement) : 0;

    // Determine whether all cards have reached their triggerStart (i.e. stacked)
    const lastCard = cardsRef.current[cardsRef.current.length - 1];
    const lastCardTop = lastCard ? getElementOffset(lastCard) : 0;
    const allCardsVisible = scrollTop > (lastCardTop - containerHeight * 0.45);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;

      const progress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const holdProgress = Math.max(0, Math.min(1, (progress - holdZone) / (1 - holdZone)));
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - holdProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * holdProgress : 0;

      // blur logic
      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;

      if (!allCardsVisible) {
        // Phase 1: individual rise to stack position
        // clamp so cards don't jump beyond the intended pin spot
        const raw = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
        translateY = Math.max(0, raw * 0.85);
      } else {
        // Phase 2: collective lift — move the whole stack up smoothly
        // compute how far we've passed the release point
        const releaseStart = lastCardTop - containerHeight * 0.45;
        const releaseProgress = Math.max(0, (scrollTop - releaseStart) / (containerHeight * 0.6)); // normalized
        // small easing
        const eased = Math.min(1, Math.pow(releaseProgress, 0.9));
        const collectiveOffset = eased * containerHeight * 0.6; // adjust magnitude
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i - collectiveOffset;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      // apply smoothing + threshold inside helper
      applyTransformToCard(card, i, newTransform);

      // handle onStackComplete for last card
      if (i === cardsRef.current.length - 1) {
        const isInView = allCardsVisible;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    holdZone,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current;
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });
      lenisRef.current = lenis;

      const loop = (time: number) => {
        lenis.raf(time);
        updateCardTransforms();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
      return lenis;
    } else {
      if (!scroller) return;
      const content = scroller.querySelector('.scroll-stack-inner') || undefined;
      const lenis = new Lenis({
        wrapper: scroller,
        content,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });
      lenisRef.current = lenis;

      const loop = (time: number) => {
        lenis.raf(time);
        updateCardTransforms();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
      return lenis;
    }
  }, [updateCardTransforms, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll ? document.querySelectorAll('.scroll-stack-card') : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;
    lastTransformsRef.current.clear();
    displayedTransformsRef.current.clear();

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
      card.style.contain = 'layout paint style';
    });

    // start Lenis + RAF loop
    setupLenis();

    // initial compute once
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      displayedTransformsRef.current.clear();
      isUpdatingRef.current = false;
      lastScrollTopRef.current = -1;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    holdZone,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  const containerStyles = useWindowScroll
    ? {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }
    : {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      };

  const containerClassName = useWindowScroll
    ? `relative w-full bg-[oklch(0.15_0_0)] ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible bg-[oklch(0.15_0_0)] ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles as CSSProperties}>
      <div className="scroll-stack-inner pt-[20vh] px-20 pb-[50rem] min-h-screen" style={{ perspective: '1000px' }}>
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
