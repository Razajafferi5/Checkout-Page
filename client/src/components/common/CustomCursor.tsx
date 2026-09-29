import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Smooth springs for cursor position
  const cursorX = useSpring(0, { stiffness: 450, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 450, damping: 30 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .interactive-hover');
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleHoverCheck);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleHoverCheck);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer interactive follower ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-brand-500/40 dark:border-brand-400/40 pointer-events-none z-50 backdrop-blur-[0.5px]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 46 : 26,
          height: isHovering ? 46 : 26,
          backgroundColor: isHovering ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.02)',
          borderColor: isHovering ? 'rgba(2, 132, 199, 0.6)' : 'rgba(2, 132, 199, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
      {/* Central precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 0.6 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};
