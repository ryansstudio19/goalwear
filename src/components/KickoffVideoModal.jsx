import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Play, RotateCcw, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * KickoffVideoModal
 * Shows the cinematic 9:16 vertical kickoff video (soccer ball dropping through clouds into stadium)
 * Automatically customized for both mobile and laptop/desktop screens:
 * - On laptops/desktops: Uses an ambient blurred mirror background to eliminate black bars,
 *   with luxury stadium broadcast frame, neon rim glows, and HUD overlays.
 * - On mobile: Fluid 9:16 edge-to-edge presentation with safe-area spacing.
 */
export default function KickoffVideoModal({
  isOpen,
  onClose,
  onComplete,
  userProfile = null,
  mode = 'signin', // 'signin' | 'signup'
  autoPlay = true,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(9.6);
  const [showControls, setShowControls] = useState(true);

  const mainVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const progressTimerRef = useRef(null);

  const videoSrc = '/kickoff-auth-intro.mp4';
  const posterSrc = '/kickoff-auth-poster.jpg';

  // Keyboard navigation (Escape to skip)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle video play & sound on mount
  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    setIsPlaying(true);

    const timer = setTimeout(() => {
      if (mainVideoRef.current) {
        mainVideoRef.current.currentTime = 0;
        mainVideoRef.current
          .play()
          .catch((err) => {
            console.warn('Autoplay with sound blocked, muting for playback:', err);
            setIsMuted(true);
            if (mainVideoRef.current) {
              mainVideoRef.current.muted = true;
              mainVideoRef.current.play().catch(() => {});
            }
          });
      }
      if (bgVideoRef.current) {
        bgVideoRef.current.currentTime = 0;
        bgVideoRef.current.play().catch(() => {});
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (!mainVideoRef.current) return;
    const curr = mainVideoRef.current.currentTime;
    const dur = mainVideoRef.current.duration || 9.6;
    setDuration(dur);
    setProgress((curr / dur) * 100);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto complete after short delay
    setTimeout(() => {
      handleFinish();
    }, 600);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = nextMuted;
    }
  };

  const handleReplay = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0;
      mainVideoRef.current.play();
      setIsPlaying(true);
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.currentTime = 0;
      bgVideoRef.current.play();
    }
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="kickoff-auth-video-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#030712',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: 'fadeIn 0.35s ease-out',
      }}
    >
      {/* ============================================================ */}
      {/* 1. LAPTOP/DESKTOP AMBIENT BLURRED BACKDROP (NO BLACK BARS!)  */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <video
          ref={bgVideoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          style={{
            width: '140%',
            height: '140%',
            objectFit: 'cover',
            filter: 'blur(55px) brightness(0.32) saturate(1.6)',
            transform: 'scale(1.2)',
            opacity: 0.85,
          }}
        />
        {/* Ambient Dark Gradient Vignette for Depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, rgba(3, 7, 18, 0.4) 0%, rgba(3, 7, 18, 0.85) 65%, #030712 100%)',
          }}
        />
      </div>

      {/* Floating Stadium Light Beams (Desktop/Laptop Polish) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '500px',
          height: '600px',
          background: 'radial-gradient(ellipse at top, rgba(0, 255, 136, 0.18) 0%, transparent 70%)',
          transform: 'rotate(-25deg)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '10%',
          width: '500px',
          height: '600px',
          background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.16) 0%, transparent 70%)',
          transform: 'rotate(25deg)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ============================================================ */}
      {/* 2. THE 9:16 HERO STAGE (CENTERED LUXURY PHONE/BROADCAST FRAME) */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '430px',
          height: '92vh',
          maxHeight: '860px',
          aspectRatio: '9 / 16',
          borderRadius: '28px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow:
            '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 255, 136, 0.3), inset 0 0 0 1.5px rgba(255, 255, 255, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
        }}
      >
        {/* Main 9:16 Video Player */}
        <video
          ref={mainVideoRef}
          src={videoSrc}
          poster={posterSrc}
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000',
          }}
        />

        {/* Top Stadium Broadcast Overlay Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            padding: '18px 18px 10px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00ff88',
                boxShadow: '0 0 10px #00ff88',
                animation: 'pulse 1.2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {mode === 'signup' ? 'KICKOFF // NEW SQUAD MEMBER' : 'KICKOFF // WELCOME BACK'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              title={isMuted ? 'Unmute Stadium Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="#00ff88" />}
            </button>

            {/* Skip / Close Button */}
            <button
              onClick={handleFinish}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              title="Skip Kickoff Intro"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Center Dynamic Status Tag: Soccer Ball Clouds -> Stadium Pitch */}
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: '18px',
            right: '18px',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(4, 7, 13, 0.72)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={13} color="#00ff88" />
            <span>FIFA Matchday Official Kickoff</span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom Celebration HUD & Action Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            padding: '24px 18px 20px',
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Progress Bar (9.6s Video Timeline) */}
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#00ff88',
                boxShadow: '0 0 10px #00ff88',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Member Welcome Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#00ff88',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {mode === 'signup' ? 'Account Created Successfully' : 'Signed In Successfully'}
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  margin: '2px 0 0',
                }}
              >
                {userProfile?.full_name ? `Welcome, ${userProfile.full_name}` : 'Welcome to GoalWear'}
              </div>
            </div>

            <div
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#ffd700',
                textTransform: 'uppercase',
              }}
            >
              VIP Access
            </div>
          </div>

          {/* Quick Enter Stadium Button */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleFinish}
              style={{
                flex: 1,
                padding: '13px 20px',
                borderRadius: '14px',
                backgroundColor: '#00ff88',
                color: '#000000',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(0, 255, 136, 0.55)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.backgroundColor = '#15ff92';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#00ff88';
              }}
            >
              <span>Enter Stadium</span>
              <ArrowRight size={18} strokeWidth={2.6} />
            </button>

            <button
              onClick={handleReplay}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Replay Video"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
