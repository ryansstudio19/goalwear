import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Eye, EyeOff, Maximize2, ShieldCheck, Play } from 'lucide-react';
import InteractiveSparkButton from './InteractiveSparkButton';

/**
 * KickoffBackgroundVideo
 * Puts the FIFA kickoff animation video directly across the whole background
 * of the Account Creation and Sign In page in a continuous loop.
 *
 * Designed to be 100% visible, crisp, and responsive across laptop, desktop,
 * tablet, and mobile screens.
 */
export default function KickoffBackgroundVideo({
  children,
  isMuted = false,
  onToggleMute,
}) {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoFitMode, setVideoFitMode] = useState('cover'); // 'cover' or 'contain'
  const [isFormHidden, setIsFormHidden] = useState(false); // allows unobstructed video viewing

  const videoSrc = '/kickoff-auth-intro.mp4';
  const posterSrc = '/kickoff-auth-poster.jpg';

  // Autoplay and automatic sound management with instant playback and touch/click/focus unlock
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const playVideo = () => {
      vid.volume = 1.0;
      vid.muted = isMuted;
      const promise = vid.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If browser policy strictly gates sound before interaction,
          // play muted first so visuals are uninterrupted, then unlock sound on first user action
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    };

    playVideo();

    const handleInteraction = () => {
      if (!isMuted && vid) {
        vid.muted = false;
        vid.volume = 1.0;
        vid.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('focusin', handleInteraction, { passive: true });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('focusin', handleInteraction);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isMuted]);

  return (
    <div
      id="kickoff-auth-page-wrapper"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#020617',
        overflowX: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* 1. CRISP FULL-PAGE BACKGROUND VIDEO (CONTINUOUS LOOP)       */}
      {/* ============================================================ */}
      <div
        id="kickoff-video-bg-container"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
          backgroundColor: '#030712',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient glow backing for wide monitors when in 'contain' or 'pillar' */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.25)',
            transform: 'scale(1.15)',
            opacity: videoFitMode === 'contain' ? 0.85 : 0.2,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* The Main High-Definition Looping Video (NO BLUR - 100% CRISP) */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onLoadedMetadata={(e) => {
            setIsVideoLoaded(true);
            e.currentTarget.volume = 1.0;
            e.currentTarget.muted = isMuted;
            e.currentTarget.play().catch(() => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            });
          }}
          onCanPlay={(e) => {
            e.currentTarget.volume = 1.0;
            e.currentTarget.muted = isMuted;
            e.currentTarget.play().catch(() => {
              e.currentTarget.muted = true;
              e.currentTarget.play().catch(() => {});
            });
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            maxWidth: videoFitMode === 'contain' ? '540px' : '100%',
            objectFit: videoFitMode,
            objectPosition: 'center center',
            filter: 'none', // Explicitly NO blur so video is pristine and crisp!
            opacity: isVideoLoaded ? 1 : 0.85,
            transition: 'opacity 0.3s ease, max-width 0.4s ease',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle dynamic overlay scrim to guarantee 100% readable text without washing out the video */}
        <div
          id="video-atmosphere-scrim"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isFormHidden
              ? 'rgba(0, 0, 0, 0.1)'
              : 'radial-gradient(ellipse at center, rgba(3, 7, 18, 0.35) 0%, rgba(3, 7, 18, 0.65) 100%)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* Stadium Floodlight Accents */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: '400px',
            height: '350px',
            background: 'radial-gradient(ellipse at top, rgba(0, 255, 136, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '20%',
            width: '400px',
            height: '350px',
            background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. FLOATING TOP HUD CONTROLS (SOUND & VIEW MODE)             */}
      {/* ============================================================ */}
      <div
        id="kickoff-video-hud"
        style={{
          position: 'fixed',
          top: '78px',
          right: '16px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {/* Toggle Form Peek/Hide Button (Allows full view of the kickoff video) */}
        <InteractiveSparkButton
          id="toggle-peek-video-btn"
          onClick={() => setIsFormHidden((prev) => !prev)}
          sparkColor="#ffd700"
          secondaryColor="#00ff88"
          style={{
            padding: '7px 12px',
            borderRadius: '20px',
            backgroundColor: isFormHidden ? 'rgba(255, 215, 0, 0.9)' : 'rgba(10, 15, 26, 0.85)',
            border: isFormHidden ? '1px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.2)',
            color: isFormHidden ? '#000000' : '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}
          title={isFormHidden ? 'Return to Sign In Form' : 'Hide Form to Watch Full Video'}
        >
          {isFormHidden ? (
            <>
              <EyeOff size={14} />
              <span>Show Form</span>
            </>
          ) : (
            <>
              <Eye size={14} color="#ffd700" />
              <span>Watch Video</span>
            </>
          )}
        </InteractiveSparkButton>

        {/* Fit / Fill Mode Toggle */}
        <InteractiveSparkButton
          id="toggle-fit-mode-btn"
          onClick={() => setVideoFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'))}
          sparkColor="#00ff88"
          secondaryColor="#38bdf8"
          style={{
            padding: '7px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(10, 15, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e2e8f0',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}
          title={videoFitMode === 'cover' ? 'Switch to Pillarbox Uncropped View' : 'Switch to Full-Bleed Cover'}
        >
          <Maximize2 size={13} color="#38bdf8" />
          <span>{videoFitMode === 'cover' ? 'Fill Screen' : 'Fit Video'}</span>
        </InteractiveSparkButton>

        {/* Stadium Sound Toggle */}
        <InteractiveSparkButton
          id="toggle-stadium-sound-btn"
          onClick={onToggleMute}
          sparkColor="#00ff88"
          secondaryColor="#ffd700"
          style={{
            padding: '7px 14px',
            borderRadius: '20px',
            backgroundColor: isMuted ? 'rgba(10, 15, 26, 0.85)' : 'rgba(0, 255, 136, 0.15)',
            border: isMuted ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #00ff88',
            color: isMuted ? '#94a3b8' : '#00ff88',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: isMuted
              ? '0 4px 15px rgba(0,0,0,0.5)'
              : '0 0 20px rgba(0, 255, 136, 0.4), 0 4px 15px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
          }}
          title={isMuted ? 'Unmute Stadium Audio & Whistle' : 'Mute Sound'}
        >
          {isMuted ? (
            <>
              <VolumeX size={14} />
              <span>Sound: Off</span>
            </>
          ) : (
            <>
              <Volume2 size={14} color="#00ff88" />
              <span style={{ color: '#00ff88' }}>Live Audio</span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#00ff88',
                  boxShadow: '0 0 8px #00ff88',
                  animation: 'pulse 1s infinite',
                }}
              />
            </>
          )}
        </InteractiveSparkButton>
      </div>

      {/* ============================================================ */}
      {/* 3. FOREGROUND AUTH FORM CONTAINER                            */}
      {/* ============================================================ */}
      <div
        id="kickoff-auth-content-layer"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 'clamp(85px, 11vh, 105px) 16px clamp(40px, 8vh, 70px)',
          opacity: isFormHidden ? 0 : 1,
          transform: isFormHidden ? 'scale(0.96)' : 'scale(1)',
          pointerEvents: isFormHidden ? 'none' : 'auto',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="auth-card-container-wrapper"
          style={{
            width: '100%',
            maxWidth: '460px',
            margin: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
