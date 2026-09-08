import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import StadiumSmokeAtmosphere from './StadiumSmokeAtmosphere';
import JerseyEmanatingAura from './JerseyEmanatingAura';
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Zap,
  Flame,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers
} from 'lucide-react';

// The 4 Authentic Matchday Kits with Real Photographs
const MATCHDAY_KITS = [
  {
    id: 'arg-home-2026',
    name: 'Argentina 2026 World Cup Edition',
    subtitle: 'World Cup 3-Star Gold Crest & Sky Blue Stripes',
    tag: 'WORLD CUP CHAMPIONS',
    accentColor: '#74acdf',
    secondaryColor: '#ffd700',
    badge: '3-STAR GOLD EMBROIDERY',
    price: '৳1,150',
    originalPrice: '৳1,450',
    photo: '/jerseys/argentina.jpg',
    team: 'Argentina',
    description: 'Official 3-Star Player Spec kit featuring gold federation embroidery, breathable jacquard micro-mesh, and celestial sky-blue vertical stripes.',
  },
  {
    id: 'rm-home-25/26',
    name: 'Real Madrid 25/26 Royal Edition',
    subtitle: 'Houndstooth Weave, Gold Piping & Fly Better',
    tag: 'UCL 15 KINGS',
    accentColor: '#e5c158',
    secondaryColor: '#ffffff',
    badge: 'UCL 15 TROPHY STARBALL',
    price: '৳1,150',
    originalPrice: '৳1,450',
    photo: '/jerseys/real-madrid.jpg',
    team: 'Real Madrid',
    description: 'The royal white home edition engineered with bespoke houndstooth textured jacquard and metallic gold championship trim.',
  },
  {
    id: 'barca-home-25/26',
    name: 'FC Barcelona 25/26 Special Edition',
    subtitle: 'Blaugrana Lightning Zig-Zag & Yellow Spotify',
    tag: 'SPECIAL EDITION BLAUGRANA',
    accentColor: '#004d98',
    secondaryColor: '#ffdd00',
    badge: 'SPOTIFY GOLDEN CREST',
    price: '৳1,150',
    originalPrice: '৳1,450',
    photo: '/jerseys/barcelona.jpg',
    team: 'FC Barcelona',
    description: 'Commemorative 125 Anys edition featuring the iconic blaugrana split with lightning accents and heat-applied silicone crest.',
  },
  {
    id: 'bra-home-2026',
    name: 'Brazil 2026 World Cup Edition',
    subtitle: 'Canarinho Jaguar Weave & 5-Star Crest',
    tag: '5-STAR PENTACAMPEÃO',
    accentColor: '#007a33',
    secondaryColor: '#ffcc00',
    badge: '5-STAR CBF EMBROIDERY',
    price: '৳1,150',
    originalPrice: '৳1,450',
    photo: '/jerseys/brazil.jpg',
    team: 'Brazil',
    description: 'The iconic Amarelinha with textured jaguar fur weave, deep navy collar accents, and the legendary 5-Star World Cup crest.',
  },
];

export default function Stadium3DHero({ featuredProduct, onSelectProduct }) {
  const navigate = useNavigate();
  const { setView } = useContext(ShopContext);

  const [activeKitIndex, setActiveKitIndex] = useState(0);
  const [audioActive, setAudioActive] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const audioCtxRef = useRef(null);
  const audioGainRef = useRef(null);
  const heroVideoRef = useRef(null);
  const cardRef = useRef(null);

  const currentKit = MATCHDAY_KITS[activeKitIndex];

  // ============================================================
  // 1. ALWAYS-ON STADIUM CROWD SOUND EFFECT (HOMEPAGE ONLY)
  // ============================================================
  useEffect(() => {
    let ctx = null;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        ctx = new AudioCtxClass();
        audioCtxRef.current = ctx;

        // Generate authentic pink/brown filtered crowd ambience
        const bufferSize = ctx.sampleRate * 2.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.045;
        }

        const crowdNoise = ctx.createBufferSource();
        crowdNoise.buffer = noiseBuffer;
        crowdNoise.loop = true;

        // Bandpass filter centered at 320Hz with Q=1.8 for deep reverberant stadium roar
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.22, ctx.currentTime);
        audioGainRef.current = gainNode;

        crowdNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        crowdNoise.start(0);

        // Auto-unlock audio on first gesture if suspended by browser autoplay policy
        const resumeAudio = () => {
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        };
        window.addEventListener('pointerdown', resumeAudio, { passive: true });
        window.addEventListener('scroll', resumeAudio, { passive: true });
        window.addEventListener('touchstart', resumeAudio, { passive: true });
        window.addEventListener('keydown', resumeAudio, { passive: true });
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }

    return () => {
      if (ctx) {
        try {
          ctx.close().catch(() => {});
        } catch {}
      }
    };
  }, []);

  // Pause audio on tab change
  useEffect(() => {
    const handleVisibility = () => {
      if (!audioCtxRef.current) return;
      if (document.hidden) {
        audioCtxRef.current.suspend().catch(() => {});
      } else if (audioActive) {
        audioCtxRef.current.resume().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [audioActive]);

  const toggleStadiumSound = () => {
    const nextState = !audioActive;
    setAudioActive(nextState);

    if (audioGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      audioGainRef.current.gain.cancelScheduledValues(now);
      if (nextState) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        audioGainRef.current.gain.linearRampToValueAtTime(0.22, now + 0.15);
      } else {
        audioGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.15);
      }
    }
  };

  // ============================================================
  // 2. INTERACTIVE 3D PERSPECTIVE TILT & GROW ON POINTER MOVEMENT
  // ============================================================
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle, elegant 3D tilt angle (smooth 8.5 degrees)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    // Glare position percentage
    const glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleSelectKit = (idx) => {
    setActiveKitIndex(idx);
    setImageLoaded(false);
    setTimeout(() => setImageLoaded(true), 50);
  };

  const handleShopCollection = () => {
    navigate('/shop');
  };

  const handleInspectCurrentKit = () => {
    if (onSelectProduct) {
      onSelectProduct(currentKit.id);
    } else if (setView) {
      setView('product-details', { productId: currentKit.id });
    } else {
      navigate(`/shop?kit=${currentKit.id}`);
    }
  };

  const handleScrollToPitch = () => {
    const nextSection = document.getElementById('stadium-kickoff-hero')?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="stadium-kickoff-hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#04070d',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        paddingBottom: '60px',
      }}
    >
      {/* Background Stadium Video (Muted, Ambient) */}
      <video
        ref={heroVideoRef}
        src="/stadium-kickoff-hero.mp4"
        poster="/stadium-kickoff-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          filter: 'brightness(0.55) contrast(1.2) saturate(1.1)',
          transform: 'scale(1.02)',
          zIndex: 0,
        }}
      />

      {/* Realistic Stadium Smoke & Tunnel Fog Atmosphere (Homepage Only) */}
      <StadiumSmokeAtmosphere
        tintColor={currentKit.accentColor}
        accentTint="rgba(0, 255, 136, 0.08)"
      />

      {/* Floodlight & Vignette Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '650px',
          height: '800px',
          background: `radial-gradient(ellipse at top, ${currentKit.accentColor}25 0%, transparent 68%)`,
          transform: 'rotate(-25deg)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.5s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '650px',
          height: '800px',
          background: `radial-gradient(ellipse at top, ${currentKit.secondaryColor}20 0%, transparent 68%)`,
          transform: 'rotate(25deg)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Deep Dark Overlay for High Text Legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 35% 50%, rgba(4, 7, 13, 0.45) 0%, rgba(4, 7, 13, 0.8) 75%, #04070d 100%), linear-gradient(90deg, rgba(4, 7, 13, 0.92) 0%, rgba(4, 7, 13, 0.72) 48%, rgba(4, 7, 13, 0.35) 82%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top Arena Broadcast Status Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.68rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.6)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: currentKit.accentColor,
              boxShadow: `0 0 10px ${currentKit.accentColor}`,
              transition: 'all 0.3s ease',
            }}
          />
          <span style={{ fontWeight: 700, color: '#f1f5f9' }}>
            MATCHDAY LIVE // {currentKit.team.toUpperCase()} EDITION
          </span>
        </div>
        <div style={{ display: 'none', mdDisplay: 'block' }}>
          <span>BANGLADESH COD • 24–48H EXPRESS DELIVERY</span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div
        className="container-custom"
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '40px',
            minHeight: '75vh',
            width: '100%',
          }}
        >
          {/* ============================================================ */}
          {/* LEFT: HERO HEADLINE, DETAILS & CTAS                         */}
          {/* ============================================================ */}
          <div
            id="stadium-hero-text-overlay"
            style={{
              position: 'relative',
              maxWidth: '620px',
              padding: '16px 0',
              zIndex: 10,
            }}
          >
            {/* Top Micro-Header: Live Status & Stadium Sound Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {/* Status Tag Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: `${currentKit.accentColor}25`,
                  border: `1px solid ${currentKit.accentColor}60`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Zap size={14} color={currentKit.accentColor} />
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: currentKit.accentColor,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentKit.tag}
                </span>
              </div>

              {/* Stadium Crowd Roar Sound FX Toggle (Always ON on Homepage) */}
              <button
                id="hero-stadium-sound-btn"
                onClick={toggleStadiumSound}
                className="btn-secondary-glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  borderColor: audioActive ? 'var(--accent, #00ff88)' : undefined,
                  color: audioActive ? 'var(--accent, #00ff88)' : undefined,
                  backgroundColor: audioActive ? 'rgba(0, 255, 136, 0.18)' : undefined,
                  whiteSpace: 'nowrap',
                }}
                title="Stadium Crowd Atmosphere (Always active on homepage - click to mute/unmute)"
              >
                {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{audioActive ? 'Crowd: Live' : 'Crowd: Muted'}</span>
                {audioActive && (
                  <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '10px' }}>
                    <span style={{ width: '2px', height: '10px', backgroundColor: 'var(--accent, #00ff88)', animation: 'pulse 0.7s infinite' }} />
                    <span style={{ width: '2px', height: '6px', backgroundColor: 'var(--accent, #00ff88)', animation: 'pulse 0.5s infinite 0.2s' }} />
                  </span>
                )}
              </button>
            </div>

            {/* BOLD 'GOALWEAR' HEADLINE */}
            <h1
              id="hero-headline-goalwear"
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                lineHeight: 1.04,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: '0 0 16px',
                color: '#ffffff',
                textShadow: '0 4px 28px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  color: 'var(--accent, #00ff88)',
                  textShadow: '0 0 36px rgba(0, 255, 136, 0.6), 0 0 14px rgba(0, 255, 136, 0.85), 0 4px 24px rgba(0,0,0,0.9)',
                  letterSpacing: '0.04em',
                }}
              >
                GOALWEAR
              </span>
              WEAR THE PASSION. <br />
              <span
                style={{
                  color: '#ffffff',
                  opacity: 0.98,
                  display: 'inline-block',
                }}
              >
                RULE THE PITCH.
              </span>
            </h1>

            {/* Active Kit Highlight Name & Description */}
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: currentKit.accentColor,
                  margin: '0 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textShadow: `0 0 20px ${currentKit.accentColor}60`,
                }}
              >
                <span>{currentKit.name}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {currentKit.price}
                </span>
              </h2>
              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
                  color: '#e2e8f0',
                  lineHeight: 1.62,
                  margin: 0,
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                }}
              >
                {currentKit.description}
              </p>
            </div>

            {/* 4 Authentic Kits Quick Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '26px',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.08em',
                }}
              >
                Select Authentic Kit:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {MATCHDAY_KITS.map((kit, idx) => (
                  <button
                    key={kit.id}
                    onClick={() => handleSelectKit(idx)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '24px',
                      backgroundColor:
                        activeKitIndex === idx ? 'rgba(255, 255, 255, 0.22)' : 'rgba(4, 7, 13, 0.65)',
                      border:
                        activeKitIndex === idx ? `2px solid ${kit.accentColor}` : '1px solid rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: activeKitIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: activeKitIndex === idx ? `0 0 16px ${kit.accentColor}50` : '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: kit.accentColor,
                        boxShadow: activeKitIndex === idx ? `0 0 10px ${kit.accentColor}` : 'none',
                      }}
                    />
                    <span>{kit.team}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '26px',
              }}
            >
              <button
                id="hero-shop-collection-cta"
                onClick={handleShopCollection}
                className="btn-glass-cta"
                style={{
                  fontSize: '1rem',
                  padding: '14px 28px',
                }}
              >
                <span>Shop Full Catalog</span>
                <ArrowRight size={19} strokeWidth={2.6} />
              </button>

              <button
                id="hero-inspect-kit-cta"
                onClick={handleInspectCurrentKit}
                className="btn-glass-secondary"
                style={{
                  fontSize: '0.94rem',
                  padding: '14px 24px',
                }}
              >
                <Eye size={17} color={currentKit.accentColor} />
                <span>Inspect {currentKit.team} Kit</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                paddingTop: '12px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                textShadow: '0 2px 8px rgba(0,0,0,0.85)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--accent, #00ff88)" />
                <span style={{ fontWeight: 600 }}>Player Spec Aeroready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="#ffaa00" />
                <span style={{ fontWeight: 600 }}>Free Custom Name & Number</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color={currentKit.accentColor} />
                <span style={{ fontWeight: 600 }}>{currentKit.badge}</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: REAL JERSEY PHOTO SHOWCASE WITH EMANATING EFFECTS     */}
          {/* ============================================================ */}
          <div
            id="stadium-hero-real-jersey-showcase"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              perspective: '1200px',
            }}
          >
            {/* Jersey Card Container with Subtle 3D Tilt & Grow */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleInspectCurrentKit}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '3 / 4',
                maxHeight: '68vh',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transform: isHovered
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: isHovered
                  ? 'transform 0.12s ease-out'
                  : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform',
              }}
            >
              {/* Dynamic Aura, Shockwaves, and Sparks Emanating from the Jersey */}
              <JerseyEmanatingAura
                accentColor={currentKit.accentColor}
                secondaryColor={currentKit.secondaryColor}
              />

              {/* Real Jersey Photo Framing */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(7, 12, 22, 0.45)',
                  border: `1.5px solid ${isHovered ? currentKit.accentColor : 'rgba(255, 255, 255, 0.16)'}`,
                  boxShadow: isHovered
                    ? `0 32px 70px -15px rgba(0, 0, 0, 0.95), 0 0 45px ${currentKit.accentColor}50`
                    : `0 20px 50px -15px rgba(0, 0, 0, 0.85), 0 0 25px ${currentKit.accentColor}25`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'border-color 0.3s ease, box-shadow 0.35s ease',
                  zIndex: 1,
                }}
              >
                {/* Authentic Jersey Photo with Smooth Grow on Hover */}
                <img
                  src={currentKit.photo}
                  alt={currentKit.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    padding: '14px',
                    filter: isHovered
                      ? 'contrast(1.1) brightness(1.06) saturate(1.05) drop-shadow(0 20px 30px rgba(0,0,0,0.9))'
                      : 'contrast(1.04) brightness(0.98) drop-shadow(0 10px 20px rgba(0,0,0,0.75))',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.3s ease, opacity 0.3s ease',
                    opacity: imageLoaded ? 1 : 0.6,
                  }}
                />

                {/* Dynamic Specular Light Glare following cursor */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
                    mixBlendMode: 'overlay',
                    transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.5s ease',
                    zIndex: 2,
                  }}
                />

                {/* Holographic Light Sweep Sheen on Hover */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.18) 45%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.18) 55%, transparent 70%)',
                    transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                    transition: 'transform 0.8s ease',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                />

                {/* Top Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(4, 7, 13, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Sparkles size={12} color={currentKit.accentColor} />
                  <span>Real Photo • {currentKit.team}</span>
                </div>

                {/* Price & Inspect Pill */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(4, 7, 13, 0.82)',
                    border: `1px solid ${currentKit.accentColor}50`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                      Player Edition
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: currentKit.accentColor }}>{currentKit.price}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                        {currentKit.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: `${currentKit.accentColor}30`,
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: `1px solid ${currentKit.accentColor}`,
                    }}
                  >
                    <span>Inspect</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Real Photos Thumbnail Row */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '18px',
                padding: '8px 14px',
                borderRadius: '30px',
                backgroundColor: 'rgba(4, 7, 13, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {MATCHDAY_KITS.map((kit, idx) => (
                <button
                  key={kit.id}
                  onClick={() => handleSelectKit(idx)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.18) translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.7), 0 0 18px ${kit.accentColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = activeKitIndex === idx ? 'scale(1.1)' : 'scale(1)';
                    e.currentTarget.style.boxShadow = activeKitIndex === idx ? `0 0 12px ${kit.accentColor}` : 'none';
                  }}
                  style={{
                    position: 'relative',
                    width: '46px',
                    height: '56px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: activeKitIndex === idx ? `2px solid ${kit.accentColor}` : '1.5px solid rgba(255,255,255,0.15)',
                    backgroundColor: '#0a0f1d',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease',
                    transform: activeKitIndex === idx ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: activeKitIndex === idx ? `0 0 12px ${kit.accentColor}` : 'none',
                  }}
                  title={`View real photo of ${kit.name}`}
                >
                  <img
                    src={kit.photo}
                    alt={kit.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '7px',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Scroll Down Indicator */}
      <button
        id="hero-scroll-down-pitch-btn"
        onClick={handleScrollToPitch}
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.65)',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#00ff88';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
        }}
        title="Scroll down to explore matchday kits collection"
      >
        <span
          style={{
            fontSize: '0.66rem',
            fontFamily: 'monospace',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          SCROLL TO CATALOG
        </span>
        <div
          style={{
            width: '18px',
            height: '28px',
            borderRadius: '14px',
            border: '1.5px solid currentColor',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '3px',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '7px',
              borderRadius: '2px',
              backgroundColor: 'currentColor',
              animation: 'bounce 1.6s infinite',
            }}
          />
        </div>
      </button>
    </section>
  );
}
