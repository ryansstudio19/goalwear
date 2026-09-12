import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Film, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import KickoffVideoModal from '../components/KickoffVideoModal';
import KickoffBackgroundVideo from '../components/KickoffBackgroundVideo';
import AuthErrorMessage from '../components/AuthErrorMessage';
import InteractiveSparkButton from '../components/InteractiveSparkButton';

export default function AccountAuth() {
  const { user, profile, isAdmin, isOwner, signIn, signUp, signInWithGoogle, signInWithGoogleCredential, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user && !loading) {
      const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/account';
      navigate(redirectUrl, { replace: true });
    }
  }, [user, loading, navigate, location.search]);

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Smooth scroll active input into visible viewport when mobile virtual keyboard expands
  const handleInputFocus = (e) => {
    setTimeout(() => {
      e.target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  // Handle actionable recovery buttons from the centralized AuthErrorMessage component
  const handleAuthErrorAction = (actionType) => {
    if (actionType === 'switch_to_signin') {
      setMode('signin');
      setAuthError(null);
      setErrorMsg('');
      setTimeout(() => {
        document.getElementById('auth-input-email')?.focus();
      }, 100);
    } else if (actionType === 'switch_to_signup') {
      setMode('signup');
      setAuthError(null);
      setErrorMsg('');
      setTimeout(() => {
        document.getElementById('auth-input-fullname')?.focus();
      }, 100);
    } else if (actionType === 'google_signin') {
      handleGoogleSignIn();
    } else if (actionType === 'retry') {
      setAuthError(null);
      setErrorMsg('');
      const submitBtn = document.getElementById('auth-submit-btn');
      submitBtn?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Background Video Sound Control - automatically on for matchday ambiance
  const [isMuted, setIsMuted] = useState(false);

  // Optional full-screen modal state
  const [showKickoffModal, setShowKickoffModal] = useState(false);
  const [kickoffTriggerMode, setKickoffTriggerMode] = useState('signin');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/account';

  // Mount Google Identity Services Button using configured Google Client ID from env
  const configuredGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let timer;
    if (!configuredGoogleClientId) {
      return;
    }

    const initGsi = () => {
      if (window.google?.accounts?.id && configuredGoogleClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: configuredGoogleClientId,
            callback: async (response) => {
              if (response?.credential) {
                setSubmitting(true);
                setErrorMsg('');
                try {
                  await signInWithGoogleCredential(response.credential);
                  setSuccessMsg('Google sign-in successful! Welcome to GoalWear.');
                  setTimeout(() => {
                    navigate(redirectPath);
                  }, 600);
                } catch (err) {
                  setAuthError(err);
                  setErrorMsg(err.message || 'Google authentication error. Please try email sign-in.');
                } finally {
                  setSubmitting(false);
                }
              }
            },
            auto_select: false
          });

          const container = document.getElementById('googleSignInBtnContainer');
          if (container) {
            container.innerHTML = '';
            window.google.accounts.id.renderButton(container, {
              type: 'standard',
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 320
            });
          }
        } catch (e) {
          console.warn('GSI render warning:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGsi();
        }
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [configuredGoogleClientId, signInWithGoogleCredential, navigate, redirectPath]);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setAuthError(null);
    setSubmitting(true);
    try {
      await executePopupAuth();
    } catch (err) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      setAuthError(err);
      setErrorMsg(err?.message || 'Google sign-in could not complete. Please try email sign-in.');
    } finally {
      setSubmitting(false);
    }
  };

  const executePopupAuth = async () => {
    try {
      const res = await signInWithGoogle();
      if (res && res.user) {
        setSuccessMsg('Google authentication successful! Entering GoalWear...');
        setTimeout(() => {
          navigate(redirectPath);
        }, 600);
      }
    } catch (err) {
      console.warn('Google sign-in exception:', err);
      // User dismissed or closed popup
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }

      setAuthError(err);
      setErrorMsg(
        err?.code === 'auth/unauthorized-domain'
          ? 'Google authentication domain restriction in this preview window. Any user can sign in or create an account with email below.'
          : err?.message || 'Google sign-in encountered an issue. Please try signing in with email or opening in a full window.'
      );
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn({ email, password });
        setSuccessMsg('Signed in successfully! Welcome back.');
        setTimeout(() => {
          navigate(redirectPath);
        }, 600);
      } else {
        if (!fullName.trim()) {
          const err = new Error('Please enter your full name');
          err.code = 'auth/missing-name';
          throw err;
        }
        const { session } = await signUp({ email, password, fullName, phone });
        
        if (!session) {
          setSuccessMsg('Account registered successfully! Please check your email to verify your account.');
          // Don't navigate, let them read the message
        } else {
          setSuccessMsg('Account registered successfully! Welcome to the squad.');
          setTimeout(() => {
            navigate(redirectPath);
          }, 600);
        }
      }
    } catch (err) {
      setAuthError(err);
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already logged in, show customer profile hub
  if (user) {
    // If logged in, send them to the account dashboard
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/account';
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
         <p style={{ color: 'var(--text-muted)' }}>Redirecting to your account...</p>
      </div>
    );
  }

  // ===================================================================
  // AUTHENTICATION SCREEN: THE WHOLE PAGE HAS THE VIDEO ON BACKGROUND IN LOOP
  // ===================================================================
  return (
    <KickoffBackgroundVideo
      isMuted={isMuted}
      onToggleMute={() => setIsMuted((prev) => !prev)}
    >
      <div
        className="auth-glass-card"
        style={{
          padding: '34px 28px',
          width: '100%',
        }}
      >
        {/* Mode Toggles */}
        <div
          style={{
            display: 'flex',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px',
            marginBottom: '24px',
            gap: '4px',
          }}
        >
          <button
            id="auth-tab-signin"
            type="button"
            onClick={() => {
              setMode('signin');
              setAuthError(null);
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              minHeight: '44px',
              padding: '10px 0',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'signin' ? 'var(--accent)' : 'transparent',
              color: mode === 'signin' ? '#000000' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              boxShadow: mode === 'signin' ? '0 0 16px rgba(0, 255, 136, 0.35)' : 'none',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            Sign In
          </button>

          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              minHeight: '44px',
              padding: '10px 0',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'signup' ? 'var(--accent)' : 'transparent',
              color: mode === 'signup' ? '#000000' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 0 16px rgba(0, 255, 136, 0.35)' : 'none',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Title & Subheading */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 255, 136, 0.08)',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              color: '#00ff88',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <ShieldCheck size={13} />
            <span>GoalWear Official Account</span>
          </div>
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0',
              color: '#ffffff',
            }}
          >
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
            {mode === 'signin'
              ? 'Access your orders, match kit customization & real-time delivery updates'
              : 'Register to unlock personalized jerseys, saved addresses & order tracking'}
          </p>
        </div>

        {/* Centralized Auth Error Message Component */}
        <AuthErrorMessage
          id="auth-main-error-alert"
          error={authError || errorMsg}
          mode={mode}
          onAction={handleAuthErrorAction}
          onDismiss={() => {
            setAuthError(null);
            setErrorMsg('');
          }}
        />

        {successMsg && (
          <div
            style={{
              backgroundColor: 'rgba(0, 255, 136, 0.15)',
              border: '1px solid var(--accent)',
              borderRadius: '10px',
              padding: '11px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#86efac',
              fontSize: '0.82rem',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Authentication Section */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {/* Native Google Identity Services Button Container (only if custom Google Client ID is configured) */}
          {configuredGoogleClientId && (
            <div id="googleSignInBtnContainer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
          )}

          {/* Clean Google Authentication Button */}
          <button
            id="google-signin-spark-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        </div>

        {/* Form Inputs with Glow Effects & Mobile Optimizations */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <div>
              <label 
                htmlFor="auth-input-fullname"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#e2e8f0', marginBottom: '6px', letterSpacing: '0.04em' }}
              >
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  id="auth-input-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={handleInputFocus}
                  autoComplete="name"
                  autoCapitalize="words"
                  autoCorrect="off"
                  enterKeyHint="next"
                  placeholder="e.g. Tanvir Ahmed"
                  className="auth-input-field"
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    padding: '13px 14px 13px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label 
              htmlFor="auth-input-email"
              style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#e2e8f0', marginBottom: '6px', letterSpacing: '0.04em' }}
            >
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                id="auth-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="next"
                placeholder="name@example.com"
                className="auth-input-field"
                style={{
                  width: '100%',
                  minHeight: '50px',
                  padding: '13px 14px 13px 42px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label 
                htmlFor="auth-input-phone"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#e2e8f0', marginBottom: '6px', letterSpacing: '0.04em' }}
              >
                Phone Number (Optional for Delivery)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  id="auth-input-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={handleInputFocus}
                  autoComplete="tel"
                  inputMode="tel"
                  enterKeyHint="next"
                  placeholder="017XXXXXXXX"
                  className="auth-input-field"
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    padding: '13px 14px 13px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label 
              htmlFor="auth-input-password"
              style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#e2e8f0', marginBottom: '6px', letterSpacing: '0.04em' }}
            >
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                id="auth-input-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="go"
                placeholder="••••••••"
                className="auth-input-field"
                style={{
                  width: '100%',
                  minHeight: '50px',
                  padding: '13px 48px 13px 42px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  touchAction: 'manipulation',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} color="#00ff88" /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '14px 20px',
              fontWeight: 800,
              fontSize: '0.92rem',
              marginTop: '8px',
              borderRadius: '10px',
              backgroundColor: '#00ff88',
              color: '#0a0f1d',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 4px 18px rgba(0, 255, 136, 0.35)',
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{submitting ? 'Please wait...' : mode === 'signin' ? 'Sign In to Account' : 'Create My Account'}</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </form>

        {/* Footnote security badge */}
        <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.74rem',
              color: '#94a3b8',
            }}
          >
            <ShieldCheck size={14} color="#00ff88" />
            <span>256-Bit SSL Encrypted Connection • Verified Match Kits Only</span>
          </div>
        </div>
      </div>

      {/* Cinematic Modal option if requested */}
      <KickoffVideoModal
        isOpen={showKickoffModal}
        onClose={() => setShowKickoffModal(false)}
        onComplete={() => setShowKickoffModal(false)}
        userProfile={{ full_name: fullName || (email ? email.split('@')[0] : '') }}
        mode={kickoffTriggerMode}
      />
    </KickoffBackgroundVideo>
  );
}
