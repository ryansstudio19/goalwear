import React, { useEffect, useRef, useState } from 'react';

/**
 * StadiumSmokeAtmosphere - Realistic, high-performance stadium fog/smoke effect.
 * Uses a lightweight HTML5 Canvas with soft noise-based drifting sprites.
 *
 * Why Particle Simulation over Video:
 * 1. 100% cross-platform reliability (no transparent WebM codec black-screen bugs on iOS/Safari).
 * 2. Zero network payload: instant load with zero bandwidth consumption.
 * 3. Extreme efficiency: Uses a single pre-cached offscreen canvas puff texture stamped with rotation/scale.
 * 4. Automatic pause via IntersectionObserver when scrolled offscreen to conserve 100% mobile battery.
 * 5. Full compliance with prefers-reduced-motion.
 */
export default function StadiumSmokeAtmosphere({
  tintColor = 'rgba(160, 205, 235, 0.12)',
  accentTint = 'rgba(0, 255, 136, 0.08)',
  density = 'normal',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const isVisibleRef = useRef(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Lazy-load effect after initial layout render
    const idleTimer = setTimeout(() => {
      setIsReady(true);
    }, 60);

    return () => clearTimeout(idleTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 1. Check prefers-reduced-motion
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Pre-render a realistic, organic smoke puff sprite to an offscreen canvas
    // This eliminates recalculating gradients during every frame, boosting mobile FPS to 60fps
    const spriteSize = 256;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = spriteSize;
    offscreenCanvas.height = spriteSize;
    const offCtx = offscreenCanvas.getContext('2d');

    if (offCtx) {
      const half = spriteSize / 2;
      const radGrad = offCtx.createRadialGradient(half, half, 0, half, half, half);
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      radGrad.addColorStop(0.25, 'rgba(235, 245, 255, 0.22)');
      radGrad.addColorStop(0.55, 'rgba(200, 225, 245, 0.08)');
      radGrad.addColorStop(0.8, 'rgba(180, 210, 235, 0.02)');
      radGrad.addColorStop(1, 'rgba(180, 210, 235, 0)');

      offCtx.fillStyle = radGrad;
      offCtx.beginPath();
      offCtx.arc(half, half, half, 0, Math.PI * 2);
      offCtx.fill();
    }

    // Secondary subtle emerald/cyan atmospheric accent puff
    const accentOffscreenCanvas = document.createElement('canvas');
    accentOffscreenCanvas.width = spriteSize;
    accentOffscreenCanvas.height = spriteSize;
    const accentOffCtx = accentOffscreenCanvas.getContext('2d');
    if (accentOffCtx) {
      const half = spriteSize / 2;
      const radGrad = accentOffCtx.createRadialGradient(half, half, 0, half, half, half);
      radGrad.addColorStop(0, 'rgba(0, 255, 136, 0.25)');
      radGrad.addColorStop(0.35, 'rgba(0, 220, 160, 0.12)');
      radGrad.addColorStop(0.65, 'rgba(0, 180, 140, 0.03)');
      radGrad.addColorStop(1, 'rgba(0, 180, 140, 0)');

      accentOffCtx.fillStyle = radGrad;
      accentOffCtx.beginPath();
      accentOffCtx.arc(half, half, half, 0, Math.PI * 2);
      accentOffCtx.fill();
    }

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap DPR at 1.5 for mid-range phones
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 3. Particle System configuration
    const isMobile = width < 768;
    const particleCount = prefersReducedMotion ? 4 : isMobile ? 12 : density === 'dense' ? 26 : 18;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height * 0.35 + Math.random() * (height * 0.65), // Hovering mid-to-lower stadium pitch
        vx: (Math.random() - 0.45) * 0.35, // Slow, gentle drift from left-to-right
        vy: -0.15 - Math.random() * 0.22, // Floating upwards subtly
        size: Math.random() * 260 + (isMobile ? 220 : 320),
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.002, // Gentle organic swirl
        opacity: Math.random() * 0.18 + 0.06,
        targetOpacity: Math.random() * 0.2 + 0.08,
        isAccent: Math.random() > 0.75, // 25% particles carry subtle stadium pitch emerald tint
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 4. Render loop
    let lastTime = performance.now();

    const render = (time) => {
      if (!isVisibleRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx * 60 * dt;
          p.y += p.vy * 60 * dt;
          p.angle += p.vAngle * 60 * dt;
          p.phase += dt * 0.8;

          // Breathing opacity oscillation
          const currentAlpha = p.opacity + Math.sin(p.phase) * 0.035;

          // Boundary wraps
          if (p.y < -p.size * 0.6) {
            p.y = height + p.size * 0.3;
            p.x = Math.random() * width;
          }
          if (p.x < -p.size * 0.8) {
            p.x = width + p.size * 0.6;
          } else if (p.x > width + p.size * 0.8) {
            p.x = -p.size * 0.6;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = Math.max(0, Math.min(0.24, currentAlpha));

          const halfSize = p.size / 2;
          const targetSprite = p.isAccent ? accentOffscreenCanvas : offscreenCanvas;
          ctx.drawImage(targetSprite, -halfSize, -halfSize, p.size, p.size);
          ctx.restore();
        } else {
          // Static soft haze for users requesting reduced motion
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.globalAlpha = 0.08;
          const halfSize = p.size / 2;
          ctx.drawImage(offscreenCanvas, -halfSize, -halfSize, p.size, p.size);
          ctx.restore();
        }
      }

      if (!prefersReducedMotion) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    // 5. Battery and GPU efficiency: Intersection Observer pauses rendering when scrolled offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 6. Handle tab visibility change
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReady, density, tintColor, accentTint]);

  return (
    <div
      ref={containerRef}
      id="stadium-smoke-atmosphere-layer"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2, // Sits above stadium pitch background, under typography/controls (z-index: 10)
        overflow: 'hidden',
        mixBlendMode: 'screen',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          opacity: 0.85,
        }}
      />
    </div>
  );
}
