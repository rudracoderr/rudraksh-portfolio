import React, { useEffect, useRef, useState } from 'react';

export const RetroCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rippleContainerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [targetType, setTargetType] = useState('');

  // Position references for smooth interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on fine pointer devices (desktops/laptops, not touchphones)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) setIsVisible(true);

      // Instant update for the center dot (0-latency tracking)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over an interactive element
      const target = e.target;
      if (target && typeof target.closest === 'function') {
        const interactive = target.closest(
          'a, button, input, textarea, select, [role="button"], .nav-dock-item, .synth-btn, .social-matrix-link, .copy-badge-btn, .carousel-nav-btn, .telemetry-btn, .filter-chip, .tech-chip, .project-card, .clickable, .interactive, .direct-email-box, .terminal-badge'
        );

        if (interactive) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);

      // Spawn a tactile retro CRT radar ripple ring
      if (rippleContainerRef.current) {
        const ripple = document.createElement('div');
        ripple.className = 'retro-cursor-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        rippleContainerRef.current.appendChild(ripple);

        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 500);
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Physics loop for trailing reticle (smooth lerp 0.22)
    const renderLoop = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      ringPos.current.x += (targetX - ringPos.current.x) * 0.22;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  return (
    <div
      className={`retro-cursor-overlay ${isVisible ? 'visible' : 'hidden'} ${
        isHovered ? 'hovering' : ''
      } ${isClicking ? 'clicking' : ''}`}
      aria-hidden="true"
    >
      {/* Ripple Container */}
      <div ref={rippleContainerRef} className="retro-cursor-ripples" />

      {/* Trailing CRT Targeting Reticle */}
      <div ref={ringRef} className="retro-cursor-ring">
        <div className="reticle-frame">
          <span className="reticle-bracket tl" />
          <span className="reticle-bracket tr" />
          <span className="reticle-bracket bl" />
          <span className="reticle-bracket br" />
          <span className="reticle-crosshair-h" />
          <span className="reticle-crosshair-v" />
        </div>
      </div>

      {/* Instant Precision Center Dot */}
      <div ref={dotRef} className="retro-cursor-dot" />
    </div>
  );
};
