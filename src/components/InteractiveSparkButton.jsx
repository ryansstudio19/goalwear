import React, { useState, useRef } from 'react';

/**
 * InteractiveSparkButton
 * Enhances buttons with:
 * 1. Precision localized ripple expanding from click coordinates
 * 2. High-energy spark particle explosion bursting outward
 * 3. Tactile spring scale bounce
 * 4. Synthetic stadium click pop chime via Web Audio API
 */
export default function InteractiveSparkButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style = {},
  sparkColor = '#00ff88',
  secondaryColor = '#ffd700',
  enableSound = true,
  id,
  ...rest
}) {
  const [ripples, setRipples] = useState([]);
  const [sparks, setSparks] = useState([]);
  const buttonRef = useRef(null);

  // Play a crisp tactile stadium chime / pop
  const playClickAudio = () => {
    if (!enableSound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const handleClick = (e) => {
    if (disabled) return;

    // Calculate click coordinates relative to button safely (supporting touch, keyboard & mouse)
    const rect = buttonRef.current?.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = (clientX !== undefined && clientX !== 0 && rect) 
      ? clientX - rect.left 
      : (rect ? rect.width / 2 : 20);
    const y = (clientY !== undefined && clientY !== 0 && rect) 
      ? clientY - rect.top 
      : (rect ? rect.height / 2 : 20);

    // 1. Add Ripple
    const rippleId = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // 2. Generate 12 flying sparks bursting in radial directions
    const newSparks = [];
    const sparkCount = 12;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * (Math.PI * 2) + (Math.random() - 0.5) * 0.5;
      const distance = 35 + Math.random() * 45;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const color = i % 2 === 0 ? sparkColor : secondaryColor;
      const size = 3 + Math.random() * 3.5;
      newSparks.push({
        id: rippleId + i,
        x,
        y,
        dx,
        dy,
        color,
        size,
      });
    }
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
    }, 650);

    // 3. Audio feedback
    playClickAudio();

    // 4. Fire original onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`interactive-spark-btn ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.965)';
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.965)';
      }}
      onTouchEnd={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchCancel={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {/* Expanding Ripple Effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            transform: 'translate(-50%, -50%)',
            animation: 'buttonRippleAnimation 0.55s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      ))}

      {/* Bursting Sparks */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          style={{
            position: 'absolute',
            left: spark.x,
            top: spark.y,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            borderRadius: '50%',
            backgroundColor: spark.color,
            boxShadow: `0 0 8px ${spark.color}`,
            transform: 'translate(-50%, -50%)',
            '--dx': `${spark.dx}px`,
            '--dy': `${spark.dy}px`,
            animation: 'buttonSparkBurst 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) forwards',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        />
      ))}

      {/* Button Children */}
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 'inherit' }}>
        {children}
      </span>
    </button>
  );
}
