import React, { useEffect, useRef } from 'react';

/**
 * JerseyEmanatingAura
 * Creates dynamic glowing energy rings, volumetric light beams, and floating
 * sparks/particles that emanate directly from behind and around the real jersey photo.
 */
export default function JerseyEmanatingAura({
  accentColor = '#00ff88',
  secondaryColor = '#ffffff',
  intensity = 1.0,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isVisible = true;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Set canvas dimensions
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    updateSize();

    // Spawn sparks radiating outward and upward from jersey center
    const particles = [];
    const maxParticles = 24; // Lightweight for 60fps on phones

    const createParticle = () => {
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 500;
      const centerX = w / 2;
      const centerY = h / 2 + 30;

      // Angle biased upwards and outward
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const speed = 0.6 + Math.random() * 1.2;
      const dist = 40 + Math.random() * 70;

      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed * 0.7,
        vy: Math.sin(angle) * speed - 0.5, // Float upwards
        size: 1.5 + Math.random() * 2.5,
        maxLife: 50 + Math.random() * 50,
        life: 0,
        color: Math.random() > 0.4 ? accentColor : secondaryColor,
        sparkle: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // Stagger initial life
      particles.push(p);
    }

    let frame = 0;
    const render = () => {
      frame++;
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 500;

      ctx.clearRect(0, 0, w, h);

      // Draw subtle center energy ring
      const centerX = w / 2;
      const centerY = h / 2 + 10;
      const pulse = 1 + Math.sin(frame * 0.04) * 0.08;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        40 * pulse,
        centerX,
        centerY,
        180 * pulse
      );
      gradient.addColorStop(0, `${accentColor}33`);
      gradient.addColorStop(0.5, `${secondaryColor}15`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 190 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw emanating sparks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.sparkle += 0.08;

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * (0.6 + Math.sin(p.sparkle) * 0.4);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (isVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    // Pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    window.addEventListener('resize', updateSize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [accentColor, secondaryColor, intensity]);

  return (
    <div
      id="jersey-emanating-aura-wrapper"
      style={{
        position: 'absolute',
        inset: '-15%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      {/* 1. Volumetric Backlight Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${accentColor}45 0%, ${secondaryColor}20 35%, transparent 72%)`,
          filter: 'blur(32px)',
          transform: 'scale(1.15)',
          opacity: 0.85,
          transition: 'background 0.5s ease',
        }}
      />

      {/* 2. Concentric Energy Shockwave Rings */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '380px',
          height: '380px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1.5px solid ${accentColor}40`,
          boxShadow: `0 0 40px ${accentColor}30, inset 0 0 30px ${accentColor}20`,
          animation: 'pulse 3.2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '460px',
          height: '460px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1px dashed ${secondaryColor}25`,
          animation: 'spin 24s linear infinite',
        }}
      />

      {/* 3. Canvas Sparks Emanating Upward */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
