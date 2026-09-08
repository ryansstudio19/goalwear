import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight, Volume2, VolumeX, ShieldCheck, Zap, Flame, Eye, Play, ChevronRight, Sparkles } from 'lucide-react';

/**
 * HomepageHero Component
 * 
 * Features:
 * - Full-width background video element (loop, muted, playsinline, autoplay) with dynamic jersey footage
 * - Bold 'GoalWear' display headline with high-contrast stadium typography
 * - Compelling sub-header highlighting authentic player-issue quality and BD delivery
 * - 'Shop Collection' CTA button styled with glassmorphism classes (.btn-glass-cta, .glass-panel, .glass-hero-overlay)
 * - Interactive featured matchday kit preview & ambient stadium audio toggle
 */
export default function HomepageHero({ featuredProduct, onSelectProduct, onShopClick }) {
  const navigate = useNavigate();
  const shopCtx = useContext(ShopContext);
  const [audioActive, setAudioActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Dynamic jersey footage angles (high-speed CDN video assets)
  const jerseyFootageTracks = [
    {
      id: 'fabric-motion',
      title: 'Fabric Weave & Motion',
      src: 'https://assets.mixkit.co/videos/41134/41134-720.mp4',
      poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600',
      label: 'Angle 01 // Fabric Motion',
    },
    {
      id: 'match-sprint',
      title: 'Matchday Pitch Sprint',
      src: 'https://assets.mixkit.co/videos/41133/41133-720.mp4',
      poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600',
      label: 'Angle 02 // Pitch Sprint',
    },
    {
      id: 'striker-action',
      title: 'Vapor Strike in Action',
      src: 'https://assets.mixkit.co/videos/41135/41135-720.mp4',
      poster: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1600',
      label: 'Angle 03 // Striker Motion',
    },
  ];

  const currentVideo = jerseyFootageTracks[videoIndex];

  // Check reduced motion & data-saver connection
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSlowConnection =
      typeof navigator !== 'undefined' &&
      (navigator.connection?.saveData ||
        navigator.connection?.effectiveType === '2g' ||
        navigator.connection?.effectiveType === 'slow-2g');

    if (prefersReducedMotion || isSlowConnection) {
      setIsVideoActive(false);
    }
  }, []);

  // Spotlighted featured kits
  const heroDropKits = [
    {
      id: 'arg-home-2026',
      name: 'Argentina 2026 World Cup Edition',
      tag: 'WORLD CUP 3-STAR GOLD',
      colorwayName: 'Albiceleste Home',
      accentColor: '#74acdf',
      badge: '3-STAR GOLD CREST',
      price: '৳1,150',
      image: featuredProduct?.image || 'https://easydrop.asia/products/image-1777809771695-280330173.jpeg',
    },
    {
      id: 'rm-home-25/26',
      name: 'Real Madrid 25/26 Royal Edition',
      tag: 'ROYAL WHITE & GOLD',
      colorwayName: 'Madridista Gold',
      accentColor: '#e5c158',
      badge: 'UCL 15 CHAMPIONS',
      price: '৳1,150',
      image: 'https://easydrop.asia/products/image-1776588693696-692210727.jpeg',
    },
    {
      id: 'barca-home-25/26',
      name: 'FC Barcelona 125th Anniversary',
      tag: 'BLAUGRANA ANNIVERSARY',
      colorwayName: '125 Anys Blaugrana',
      accentColor: '#004d98',
      badge: 'LIMITED COMMEMORATIVE',
      price: '৳1,150',
      image: 'https://easydrop.asia/products/image-1776588932109-152534089.jpeg',
    },
  ];

  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const currentHeroKit = heroDropKits[selectedHeroIndex];

  // Synthesize ambient stadium matchday acoustic murmur via Web Audio API
  const toggleStadiumSound = () => {
    if (audioActive) {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setAudioActive(false);
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.04;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setAudioCtx(ctx);
        setAudioActive(true);
      } catch (e) {
        console.warn('AudioContext user gesture needed:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtx) audioCtx.close();
    };
  }, [audioCtx]);

  const handleShopCollectionClick = () => {
    if (onShopClick) {
      onShopClick();
    } else if (shopCtx?.setView) {
      shopCtx.setView('shop');
      navigate('/shop');
    } else {
      navigate('/shop');
    }
  };

  const handleKitSelect = (kitId) => {
    if (onSelectProduct) {
      onSelectProduct(kitId);
    } else if (shopCtx?.setView) {
      shopCtx.setView('product-details', { productId: kitId });
      navigate(`/product/${kitId}`);
    } else {
      navigate(`/product/${kitId}`);
    }
  };

  return (
    <section
      id="homepage-hero-goalwear"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '94vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 0 80px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#04060a',
      }}
    >
      {/* ============================================================ */}
      {/* 1. FULL-WIDTH BACKGROUND VIDEO ELEMENT                       */}
      {/* (looping, muted, playsinline, autoplay)                      */}
      {/* ============================================================ */}
      {isVideoActive ? (
        <div
          id="hero-video-wrapper"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <video
            ref={videoRef}
            key={currentVideo.src}
            src={currentVideo.src}
            poster={currentVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 38%',
              filter: 'brightness(0.60) contrast(1.25) saturate(1.2)',
              transform: 'scale(1.04)',
              transition: 'opacity 0.6s ease',
              opacity: videoLoaded ? 0.75 : 0.45,
              pointerEvents: 'none',
            }}
          />
        </div>
      ) : (
        /* Low-power / reduced-motion static poster */
        <div
          id="hero-poster-fallback"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundImage: `url(${currentVideo.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5) contrast(1.2)',
          }}
        />
      )}

      {/* ============================================================ */}
      {/* 2. STADIUM LIGHTING & VOLUMETRIC FLOODLIGHT GLOWS            */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '0%',
          width: '700px',
          height: '900px',
          background: 'radial-gradient(ellipse at top, rgba(0, 255, 136, 0.22) 0%, transparent 68%)',
          transform: 'rotate(-20deg)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '0%',
          width: '700px',
          height: '900px',
          background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.16) 0%, transparent 68%)',
          transform: 'rotate(20deg)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* High-Contrast Vignette for Overlay Legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(4, 6, 10, 0.35) 0%, rgba(4, 6, 10, 0.78) 72%, #04060a 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Pitch Grid Coordinate Line Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Arena Telemetry Header Bar */}
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
              backgroundColor: '#00ff88',
              boxShadow: '0 0 10px #00ff88',
            }}
          />
          <span style={{ fontWeight: 700, color: '#f1f5f9' }}>GOALWEAR ARENA BROADCAST // 1080P 60FPS</span>
        </div>
        <div style={{ display: 'none', mdDisplay: 'block' }}>
          <span>BANGLADESH COD • 24–48H EXPRESS DELIVERY</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. GLASSMORPHIC HERO CONTENT OVERLAY                         */}
      {/* ============================================================ */}
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
            gridTemplateColumns: '1fr',
            lgTemplateColumns: '1.2fr 0.85fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* Main Hero Card utilizing existing .glass-hero-overlay and .glass-panel styling */}
          <div
            id="hero-glassmorphism-card"
            className="glass-hero-overlay"
            style={{
              padding: 'clamp(28px, 4.5vw, 48px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Micro-Header: Brand Pill & Stadium Controls */}
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
              {/* Glass Tag Badge */}
              <div
                className="glass-panel"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(0, 255, 136, 0.12)',
                  borderColor: 'rgba(0, 255, 136, 0.45)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                }}
              >
                <Zap size={14} color="var(--accent, #00ff88)" />
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--accent, #00ff88)',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  2026 OFFICIAL MATCHDAY DROPS
                </span>
              </div>

              {/* Glassmorphic Auxiliary Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Stadium Crowd Roar Sound Toggle */}
                <button
                  id="hero-sound-toggle-btn"
                  onClick={toggleStadiumSound}
                  className="btn-secondary-glass"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    borderColor: audioActive ? 'var(--accent, #00ff88)' : undefined,
                    color: audioActive ? 'var(--accent, #00ff88)' : undefined,
                    backgroundColor: audioActive ? 'rgba(0, 255, 136, 0.18)' : undefined,
                    whiteSpace: 'nowrap',
                  }}
                  title="Toggle stadium crowd audio roar"
                >
                  {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span>{audioActive ? 'Crowd: Live' : 'Sound FX'}</span>
                </button>
              </div>
            </div>

            {/* BOLD 'GOALWEAR' HEADLINE */}
            <h1
              id="hero-headline-goalwear"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)',
                lineHeight: 1.02,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                margin: '0 0 16px',
                color: '#ffffff',
                textShadow: '0 4px 28px rgba(0, 0, 0, 0.95)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  color: 'var(--accent, #00ff88)',
                  textShadow: '0 0 36px rgba(0, 255, 136, 0.55), 0 0 12px rgba(0, 255, 136, 0.8)',
                  letterSpacing: '0.04em',
                }}
              >
                GOALWEAR
              </span>
              WEAR THE PASSION. <br />
              <span
                style={{
                  color: '#ffffff',
                  opacity: 0.95,
                  display: 'inline-block',
                }}
              >
                RULE THE PITCH.
              </span>
            </h1>

            {/* COMPELLING SUB-HEADER */}
            <p
              id="hero-sub-header-goalwear"
              style={{
                fontSize: 'clamp(0.98rem, 1.8vw, 1.16rem)',
                color: '#e2e8f0',
                lineHeight: 1.68,
                maxWidth: '620px',
                margin: '0 0 24px',
                textShadow: '0 2px 10px rgba(0,0,0,0.85)',
              }}
            >
              Engineered for champions and street connoisseurs. Authentic player-spec micro-mesh weaves, heat-applied official silicone crests, and custom name &amp; number vinyl kits delivered across Bangladesh in 24–48 hours.
            </p>

            {/* Dynamic Jersey Footage Perspective Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '26px',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '0.08em',
                }}
              >
                Jersey Cam:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {jerseyFootageTracks.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setVideoIndex(i)}
                    className="glass-panel"
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      backgroundColor:
                        videoIndex === i ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor:
                        videoIndex === i
                          ? 'var(--accent, #00ff88)'
                          : 'rgba(255, 255, 255, 0.12)',
                      color: videoIndex === i ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Play
                      size={10}
                      fill={videoIndex === i ? '#00ff88' : 'none'}
                      color={videoIndex === i ? '#00ff88' : 'currentColor'}
                    />
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 'SHOP COLLECTION' CTA BUTTON (GLASSMORPHISM STYLE)           */}
            {/* ============================================================ */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '26px',
              }}
            >
              {/* PRIMARY 'SHOP COLLECTION' CTA WITH EXISTING GLASSMORPHISM CLASSES */}
              <button
                id="hero-shop-collection-cta"
                onClick={handleShopCollectionClick}
                className="btn-glass-cta"
                style={{
                  fontSize: '1rem',
                }}
              >
                <span>Shop Collection</span>
                <ArrowRight size={19} strokeWidth={2.6} />
              </button>

              {/* SECONDARY GLASSMORPHIC BUTTON */}
              <button
                id="hero-view-featured-kit-cta"
                onClick={() => handleKitSelect(currentHeroKit.id)}
                className="btn-glass-secondary"
                style={{
                  fontSize: '0.92rem',
                }}
              >
                <span>View {currentHeroKit.colorwayName}</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Matchday Trust Micro-Badges */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                paddingTop: '18px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.82rem',
                color: '#cbd5e1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={17} color="var(--accent, #00ff88)" />
                <span style={{ fontWeight: 600 }}>Official Player Spec Aeroready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={17} color="#ffaa00" />
                <span style={{ fontWeight: 600 }}>Free Custom Name &amp; Number Vinyl</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stadium Spotlight Glass Showcase for Matchday Kit */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            <div
              className="glass-panel"
              style={{
                position: 'relative',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: 'rgba(8, 12, 20, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `0 28px 56px -12px rgba(0, 0, 0, 0.9), 0 0 45px -10px ${currentHeroKit.accentColor}40`,
                overflow: 'hidden',
              }}
            >
              {/* Dynamic Club Color Spotlight */}
              <div
                style={{
                  position: 'absolute',
                  top: '42%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '320px',
                  height: '320px',
                  background: `radial-gradient(circle, ${currentHeroKit.accentColor}35 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Status Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 10,
                  marginBottom: '8px',
                }}
              >
                <div
                  className="glass-panel"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(0, 255, 136, 0.15)',
                    border: '1px solid var(--accent, #00ff88)',
                    padding: '5px 12px',
                    borderRadius: '16px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent, #00ff88)',
                      boxShadow: '0 0 6px #00ff88',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentHeroKit.price} • In Stock
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentHeroKit.badge}
                </span>
              </div>

              {/* High-Resolution Matchday Kit Photograph */}
              <div
                id="hero-kit-showcase-view"
                onClick={() => handleKitSelect(currentHeroKit.id)}
                style={{
                  width: '100%',
                  height: '330px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                title="Click to inspect kit details and vinyl customization"
              >
                <img
                  src={currentHeroKit.image}
                  alt={currentHeroKit.name}
                  style={{
                    maxHeight: '310px',
                    maxWidth: '92%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.85))',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                />
              </div>

              {/* Kit Details */}
              <div style={{ marginTop: '8px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: '0 0 4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentHeroKit.name}
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary, #a0aec0)', margin: 0 }}>
                  Authentic Matchday Vapor Edition • Official Club Silicone Crest
                </p>
              </div>

              {/* Quick Kit Switcher Pills with Glassmorphism */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                  zIndex: 10,
                  flexWrap: 'wrap',
                }}
              >
                {heroDropKits.map((kit, idx) => (
                  <button
                    key={kit.id}
                    onClick={() => setSelectedHeroIndex(idx)}
                    className="glass-panel"
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      backgroundColor:
                        selectedHeroIndex === idx
                          ? 'rgba(255, 255, 255, 0.14)'
                          : 'rgba(255, 255, 255, 0.04)',
                      borderColor:
                        selectedHeroIndex === idx
                          ? kit.accentColor
                          : 'rgba(255, 255, 255, 0.08)',
                      color: selectedHeroIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: kit.accentColor,
                        boxShadow: selectedHeroIndex === idx ? `0 0 8px ${kit.accentColor}` : 'none',
                      }}
                    />
                    <span>{kit.colorwayName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
