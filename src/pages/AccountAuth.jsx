import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Film, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import KickoffVideoModal from '../components/KickoffVideoModal';
import KickoffBackgroundVideo from '../components/KickoffBackgroundVideo';
import InteractiveSparkButton from '../components/InteractiveSparkButton';
import AuthErrorMessage from '../components/AuthErrorMessage';

export default function AccountAuth() {
  const { user, profile, signIn, signUp, signInWithGoogle, signInWithGoogleCredential, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Mount Google Identity Services Button
  useEffect(() => {
    let timer;
    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: '782378080369-tva27l9r3dmgeo0q4vnki6gnndnblu50.apps.googleusercontent.com',
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
  }, [signInWithGoogleCredential, navigate, redirectPath]);

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
      setErrorMsg(err?.message || 'Google sign-in could not complete. Please try again.');
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
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      setAuthError(err);
      setErrorMsg(err?.message || 'Google sign-in failed. Please use email or enable popups.');
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
        await signUp({ email, password, fullName, phone });
        setSuccessMsg('Account registered successfully! Welcome to the squad.');
        setTimeout(() => {
          navigate(redirectPath);
        }, 600);
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
    return (
      <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-glass-hover)', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '1.4rem' }}>
                {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                  {profile?.full_name || 'GoalWear Member'}
                </h1>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {user.email} • <span style={{ color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700 }}>{profile?.role || 'Customer'}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <InteractiveSparkButton
                onClick={async () => {
                  await signOut();
                  navigate('/account/login');
                }}
                className="btn-premium btn-secondary-glass"
                style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: '8px' }}
              >
                Sign Out
              </InteractiveSparkButton>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div 
              onClick={() => navigate('/account/orders')}
              className="glass-panel-hover" 
              style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'white' }}>My Orders</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                View your order history, delivery milestones, and invoices.
              </p>
            </div>

            <div 
              onClick={() => navigate('/cart')}
              className="glass-panel-hover" 
              style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: 'white' }}>Current Bag</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Check items in your cart ready for bKash delivery confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Kickoff Video Modal for replaying full cinematic */}
        <KickoffVideoModal
          isOpen={showKickoffModal}
          onClose={() => setShowKickoffModal(false)}
          onComplete={() => setShowKickoffModal(false)}
          userProfile={profile}
          mode={kickoffTriggerMode}
        />
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
        {/* Mode Toggles with Interactive Spark Effects */}
        <div
          style={{
            display: 'flex',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px',
            marginBottom: '24px',
            gap: '4px',
          }}
        >
          <InteractiveSparkButton
            id="auth-tab-signin"
            type="button"
            onClick={() => {
              setMode('signin');
              setAuthError(null);
              setErrorMsg('');
            }}
            sparkColor="#00ff88"
            secondaryColor="#ffd700"
            style={{
              flex: 1,
              minHeight: '48px',
              padding: '11px 0',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'signin' ? 'var(--accent)' : 'transparent',
              color: mode === 'signin' ? '#000000' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              boxShadow: mode === 'signin' ? '0 0 16px rgba(0, 255, 136, 0.45)' : 'none',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            Sign In
          </InteractiveSparkButton>

          <InteractiveSparkButton
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
              setErrorMsg('');
            }}
            sparkColor="#00ff88"
            secondaryColor="#ffd700"
            style={{
              flex: 1,
              minHeight: '48px',
              padding: '11px 0',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'signup' ? 'var(--accent)' : 'transparent',
              color: mode === 'signup' ? '#000000' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              boxShadow: mode === 'signup' ? '0 0 16px rgba(0, 255, 136, 0.45)' : 'none',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            Create Account
          </InteractiveSparkButton>
        </div>

        {/* Title & Subheading */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#00ff88',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            <Sparkles size={13} />
            <span>Official GoalWear Portal</span>
          </div>
          <h2
            style={{
              fontSize: '1.55rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              margin: '0 0 6px 0',
              color: '#ffffff',
            }}
          >
            {mode === 'signin' ? 'Welcome Back' : 'Join The Squad'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
            {mode === 'signin'
              ? 'Log in to track your squad jerseys, orders & VIP benefits'
              : 'Create your account for expedited delivery & exclusive drops'}
          </p>
        </div>

        {/* Centralized Firebase Auth Error Message Component */}
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

        {/* Google Authentication Section with GSI and Mobile Support */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {/* Native Google Identity Services Button Container */}
          <div id="googleSignInBtnContainer" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>

          {/* Interactive GoalWear Spark Button Fallback */}
          <InteractiveSparkButton
            id="google-signin-spark-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            sparkColor="#4285F4"
            secondaryColor="#EA4335"
            className="btn-premium"
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
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
          </InteractiveSparkButton>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.06em' }}>
            or with email
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
                placeholder="fan@example.com"
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

          {/* Interactive Submit Spark Button */}
          <InteractiveSparkButton
            id="auth-submit-btn"
            type="submit"
            disabled={submitting}
            sparkColor="#00ff88"
            secondaryColor="#ffd700"
            className="btn-premium"
            style={{
              width: '100%',
              minHeight: '52px',
              padding: '15px 0',
              fontWeight: 900,
              fontSize: '0.94rem',
              marginTop: '8px',
              borderRadius: '10px',
              backgroundColor: '#00ff88',
              color: '#000000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            <span>{submitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </InteractiveSparkButton>
        </form>

        {/* Footnote badge */}
        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.74rem',
              color: '#94a3b8',
            }}
          >
            <ShieldCheck size={14} color="#00ff88" />
            <span>Secure Checkout with bKash Advance Delivery</span>
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

