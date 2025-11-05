import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React,{ useState, useEffect, useCallback, useRef } from 'react';

// Constants for better performance and maintainability
const CONFIG = {
  CURSOR_SIZE: 24,
  THROTTLE_DELAY: 16, // ~60fps
  VISIBILITY_DELAY: 100,
  SPRING: { stiffness: 800, damping: 35, mass: 0.3 },
  TRAIL_SPRING: { stiffness: 400, damping: 25, mass: 0.2 }
};

// CSS to hide default cursor (injected once)
const hideCursorCSS = `
  html, body, * {
    cursor: none !important;
  }
`;

const MouseFollower = () => {
  // Use motion values for better performance with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const springX = useSpring(cursorX, CONFIG.SPRING);
  const springY = useSpring(cursorY, CONFIG.SPRING);
  const trailSpringX = useSpring(trailX, CONFIG.TRAIL_SPRING);
  const trailSpringY = useSpring(trailY, CONFIG.TRAIL_SPRING);
  
  // Transform for interactive effects
  const scale = useTransform(springX, [0, window.innerWidth], [0.8, 1.2]);
  const opacity = useTransform(springY, [0, window.innerHeight], [0.9, 1]);
  
  const [isVisible, setIsVisible] = useState(false);
  const lastCallTimeRef = useRef(0);
  const styleElementRef = useRef(null);
  const rafIdRef = useRef(null);

  // Throttled mouse position update
  const updateMousePosition = useCallback((x, y) => {
    cursorX.set(x - CONFIG.CURSOR_SIZE / 2);
    cursorY.set(y - CONFIG.CURSOR_SIZE / 2);
    trailX.set(x - CONFIG.CURSOR_SIZE / 2);
    trailY.set(y - CONFIG.CURSOR_SIZE / 2);
  }, [cursorX, cursorY, trailX, trailY]);

  // Optimized mouse move handler with requestAnimationFrame
  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    if (now - lastCallTimeRef.current >= CONFIG.THROTTLE_DELAY) {
      lastCallTimeRef.current = now;
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      rafIdRef.current = requestAnimationFrame(() => {
        updateMousePosition(e.clientX, e.clientY);
      });
    }
  }, [updateMousePosition]);

  // Event handlers with passive listeners
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    // Inject CSS to hide default cursor (only once)
    if (!styleElementRef.current) {
      styleElementRef.current = document.createElement('style');
      styleElementRef.current.innerHTML = hideCursorCSS;
      document.head.appendChild(styleElementRef.current);
    }

    // Set initial visibility after delay
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, CONFIG.VISIBILITY_DELAY);

    // Add event listeners with optimized options
    const options = { passive: true, capture: true };
    window.addEventListener('mousemove', handleMouseMove, options);
    window.addEventListener('mouseenter', handleMouseEnter, options);
    window.addEventListener('mouseleave', handleMouseLeave, options);

    return () => {
      // Cleanup
      clearTimeout(visibilityTimer);
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove, options);
      window.removeEventListener('mouseenter', handleMouseEnter, options);
      window.removeEventListener('mouseleave', handleMouseLeave, options);
      
      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Main cursor with smooth spring physics
  const MainCursor = () => (
    <motion.div
      className="fixed w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full pointer-events-none z-[9999] shadow-lg border-2 border-white backdrop-blur-sm"
      style={{
        x: springX,
        y: springY,
        scale,
        opacity: isVisible ? opacity : 0
      }}
      initial={{ scale: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.15 }}
    />
  );

  // Optional trailing cursor for extra smoothness
  const TrailCursor = () => (
    <motion.div
      className="fixed w-6 h-6 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full pointer-events-none z-[9998] shadow-md border border-white/50 backdrop-blur-sm"
      style={{
        x: trailSpringX,
        y: trailSpringY,
        scale: isVisible ? 0.6 : 0,
        opacity: isVisible ? 0.4 : 0
      }}
      initial={{ scale: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
    />
  );

  // Click effect overlay
  const ClickEffect = () => (
    <motion.div
      className="fixed w-8 h-8 bg-blue-400/30 rounded-full pointer-events-none z-[9997] border border-blue-300/50"
      style={{
        x: springX,
        y: springY,
        scale: isVisible ? 0 : 1,
        opacity: isVisible ? 0 : 0.8
      }}
      initial={{ scale: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
    />
  );

  return (
    <>
      <TrailCursor />
      <MainCursor />
      <ClickEffect />
    </>
  );
};

// Higher-order component to conditionally render MouseFollower
export const withMouseFollower = (Component) => {
  return function MouseFollowerWrapper(props) {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
      // Only enable on desktop devices
      const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsEnabled(isDesktop);
    }, []);

    return (
      <>
        <Component {...props} />
        {isEnabled && <MouseFollower />}
      </>
    );
  };
};

export default React.memo(MouseFollower);