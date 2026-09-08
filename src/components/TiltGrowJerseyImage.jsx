import React, { useState, useRef } from 'react';

/**
 * TiltGrowJerseyImage
 * Adds subtle 3D tilt and grow hover effects to jersey images.
 * Smoothly tracks cursor position to give tactile physical depth and elevation.
 */
export default function TiltGrowJerseyImage({
  src,
  alt = 'Jersey',
  className = '',
  style = {},
  imgStyle = {},
  maxTilt = 8.5,
  growScale = 1.05,
  glowColor = 'rgba(0, 255, 136, 0.25)',
  children,
}) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt calculations
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    // Glare coordinates
    const glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.3 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`jersey-tilt-grow-wrapper ${className}`}
      style={{
        perspective: '1000px',
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* 3D Transform Layer: Tilts and Grows */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: style.borderRadius || '12px',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${growScale}, ${growScale}, 1.05)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease'
            : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease',
          boxShadow: isHovered
            ? `0 20px 40px -12px rgba(0, 0, 0, 0.8), 0 0 25px ${glowColor}`
            : '0 4px 16px rgba(0, 0, 0, 0.25)',
          willChange: 'transform',
        }}
      >
        {/* The Jersey Image */}
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            filter: isHovered
              ? 'brightness(1.06) contrast(1.06) saturate(1.05)'
              : 'brightness(1) contrast(1) saturate(1)',
            transition: 'transform 0.4s ease, filter 0.3s ease',
            display: 'block',
            ...imgStyle,
          }}
        />

        {/* Dynamic Specular Reflection / Glare */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 65%)`,
            mixBlendMode: 'overlay',
            transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.5s ease',
            zIndex: 3,
          }}
        />

        {/* Subtle Ambient Vignette Rim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            boxShadow: isHovered
              ? 'inset 0 0 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
              : 'inset 0 0 12px rgba(0, 0, 0, 0.2)',
            borderRadius: 'inherit',
            transition: 'box-shadow 0.3s ease',
            zIndex: 4,
          }}
        />

        {/* Optional Overlay Children (e.g. Quick view actions) */}
        {children}
      </div>
    </div>
  );
}
