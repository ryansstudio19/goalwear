import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

/**
 * Dynamic Intro Music Synthesizer
 * Generates an energetic, cinematic matchday tunnel walk soundtrack
 * using the Web Audio API with sub-bass kicks, rising atmospheric pads,
 * and crescendo swells timed with the entrance sequence.
 */
function createIntroAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let isPlaying = false;
  let kickInterval = null;

  const init = () => {
    if (ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      ctx = new AudioContextClass();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.connect(ctx.destination);
    } catch (e) {
      console.warn('Intro Web Audio init skipped:', e);
    }
  };

  const playKick = (time) => {
    if (!ctx || !masterGain) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch drop from 140Hz to 40Hz for punchy stadium sub-kick
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.18);

      gain.gain.setValueAtTime(0.42, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + 0.33);
    } catch (e) {}
  };

  const playPads = (startTime, durationSec) => {
    if (!ctx || !masterGain) return;
    try {
      // Atmospheric chord notes: E2, B2, E3, G3
      const freqs = [82.41, 123.47, 164.81, 196.0];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, startTime);
      filter.frequency.exponentialRampToValueAtTime(2600, startTime + durationSec * 0.85);
      filter.Q.setValueAtTime(3.5, startTime);

      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.001, startTime);
      padGain.gain.linearRampToValueAtTime(0.18, startTime + 0.6);
      padGain.gain.setValueAtTime(0.18, startTime + durationSec - 0.5);
      padGain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        // Slight detune for rich analog chorus
        osc.detune.setValueAtTime((idx - 1.5) * 8, startTime);

        osc.connect(filter);
        osc.start(startTime);
        osc.stop(startTime + durationSec);
      });

      filter.connect(padGain);
      padGain.connect(masterGain);

      // Tension riser sweep
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(110, startTime + 1.2);
      sweepOsc.frequency.exponentialRampToValueAtTime(880, startTime + durationSec * 0.95);

      sweepGain.gain.setValueAtTime(0.001, startTime + 1.2);
      sweepGain.gain.linearRampToValueAtTime(0.1, startTime + durationSec * 0.9);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(filter);
      sweepOsc.start(startTime + 1.2);
      sweepOsc.stop(startTime + durationSec);
    } catch (e) {}
  };

  const start = () => {
    init();
    if (!ctx || isPlaying) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    isPlaying = true;
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.65, now + 0.35);

    const totalDuration = 4.5;
    playPads(now, totalDuration);

    // Rhythm kicks every 0.5s (120 BPM)
    let beatTime = now + 0.15;
    const intervalTime = 0.5;
    for (let i = 0; i < 8; i++) {
      playKick(beatTime);
      beatTime += intervalTime;
    }
  };

  const stop = () => {
    if (!ctx || !isPlaying) return;
    isPlaying = false;
    try {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        if (ctx && ctx.state !== 'closed') {
          ctx.suspend().catch(() => {});
        }
      }, 450);
    } catch (e) {}
  };

  const toggleMute = (muted) => {
    if (!ctx || !masterGain) return;
    try {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      if (muted) {
        masterGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      } else {
        masterGain.gain.linearRampToValueAtTime(0.65, now + 0.1);
      }
    } catch (e) {}
  };

  return { start, stop, toggleMute, getCtx: () => ctx };
}

export default function TunnelPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false); // Muted by default to satisfy browser autoplay policy

  const videoRef = useRef(null);
  const audioEngineRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const activeVideoSrc = '/kickoff-auth-intro.mp4';
  const posterSrc = '/kickoff-auth-poster.jpg';

  const runIntroSequence = () => {
    setVisible(true);
    setProgress(0);
    setVideoLoaded(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = !soundEnabled;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser blocks unmuted play, enforce muted and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Safety fallback: dismiss after max 11 seconds if video gets stalled
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      dismiss();
    }, 11000);
  };

  useEffect(() => {
    // Automatically trigger the cinematic kickoff intro sequence on entrance
    runIntroSequence();

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const dismiss = () => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    setVisible(false);
  };

  const toggleSound = (e) => {
    if (e) e.stopPropagation();
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (videoRef.current) {
      videoRef.current.muted = !nextState;
      if (nextState) {
        videoRef.current.play().catch(() => {});
      }
    }
    if (audioEngineRef.current) {
      audioEngineRef.current.toggleMute(!nextState);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = Math.min(100, Math.round((videoRef.current.currentTime / videoRef.current.duration) * 100));
      setProgress(pct);
    }
  };

  const handleEnded = () => {
    setProgress(100);
    setTimeout(() => {
      dismiss();
    }, 350);
  };

  if (!visible) return null;

  return (
    <div
      id="goalwear-entrance-preloader"
      role="dialog"
      aria-label="Stadium kickoff entrance sequence"
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#020617',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        animation: progress >= 100 ? 'tunnelFadeOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
      }}
    >
      {/* 1. Full-Bleed Ambient Stadium Glow Backing (Wide Screens) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${posterSrc}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(35px) brightness(0.25)',
          transform: 'scale(1.15)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Crisp High-Definition Kickoff Video (Center Stage) */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          src={activeVideoSrc}
          poster={posterSrc}
          autoPlay
          muted={!soundEnabled}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => setVideoFailed(true)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            maxWidth: '560px', // Uncropped, pristine FIFA kickoff presentation on desktop
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'contrast(1.05) brightness(0.98)',
            transition: 'opacity 0.4s ease',
            opacity: videoLoaded ? 1 : 0.85,
            boxShadow: '0 0 60px rgba(0, 255, 136, 0.2)',
          }}
        >
          <source src={activeVideoSrc} type="video/mp4" />
        </video>
      ) : (
        /* Poster image fallback */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${posterSrc}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.85) contrast(1.1)',
          }}
        />
      )}

      {/* Subtle Vignette Framing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(2, 6, 23, 0) 30%, rgba(2, 6, 23, 0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Live Audio Toggle & Instant Skip CTA */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
        }}
      >
        {/* Dynamic Stadium Sound Toggle */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={soundEnabled ? 'Mute stadium audio' : 'Unmute stadium audio'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: soundEnabled ? 'rgba(0, 255, 136, 0.2)' : 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: soundEnabled ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 18px',
            borderRadius: '24px',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: soundEnabled ? '#00ff88' : 'rgba(255, 255, 255, 0.85)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: soundEnabled ? '0 0 20px rgba(0, 255, 136, 0.35)' : '0 4px 15px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={15} color="#00ff88" />
              <span>Stadium Sound: Live</span>
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '10px' }}>
                <span style={{ width: '2px', height: '10px', backgroundColor: '#00ff88', animation: 'pulse 0.8s infinite' }} />
                <span style={{ width: '2px', height: '6px', backgroundColor: '#00ff88', animation: 'pulse 0.6s infinite 0.2s' }} />
                <span style={{ width: '2px', height: '8px', backgroundColor: '#00ff88', animation: 'pulse 0.9s infinite 0.1s' }} />
              </span>
            </>
          ) : (
            <>
              <VolumeX size={15} />
              <span>Stadium Sound: Off (Tap to Unmute)</span>
            </>
          )}
        </button>

        {/* Immediate Skip / Enter Store Control */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Enter store"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#00ff88',
            color: '#000000',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '30px',
            fontSize: '0.78rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Enter Arena (ESC)</span>
          <ArrowRight size={15} strokeWidth={3} />
        </button>
      </div>

      {/* Bottom Floating Progress & Matchday Identity */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '20px',
          right: '20px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#00ff88',
            }}
          >
            GOALWEAR MATCHDAY
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'rgba(255, 255, 255, 0.85)',
              textTransform: 'uppercase',
            }}
          >
            Kickoff Prep: {progress}%
          </span>
        </div>

        {/* Progress bar line */}
        <div
          style={{
            width: 'min(380px, 85vw)',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#00ff88',
              boxShadow: '0 0 14px #00ff88',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        <span
          style={{
            marginTop: '8px',
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Click anywhere or press ESC to enter immediately
        </span>
      </div>
    </div>
  );
}
