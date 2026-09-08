import React, { useEffect, useState } from 'react';

export default function MagneticCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer & no reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('canvas') ||
        target.closest('.interactive-target') ||
        target.getAttribute('role') === 'button'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99998,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.06s ease-out',
      }}
    >
      {/* Central Aim Dot */}
      <div
        style={{
          width: hovered ? '8px' : '6px',
          height: hovered ? '8px' : '6px',
          borderRadius: '50%',
          backgroundColor: hovered ? 'var(--accent, #00ff88)' : '#ffffff',
          boxShadow: '0 0 8px var(--accent, #00ff88)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease',
        }}
      />

      {/* Floodlight Target Ring */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: hovered ? '46px' : '26px',
          height: hovered ? '46px' : '26px',
          border: hovered
            ? '1.5px solid var(--accent, #00ff88)'
            : '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
          backgroundColor: hovered ? 'rgba(0, 255, 136, 0.05)' : 'transparent',
        }}
      />
    </div>
  );
}
