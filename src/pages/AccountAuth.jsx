import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AccountAuth() {
  const { user, profile, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/account';

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate(redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already logged in, show customer profile hub
  if (user) {
    return (
      <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-glass-hover)' }}>
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

            <button
              onClick={async () => {
                await signOut();
                navigate('/account/login');
              }}
              className="btn-premium btn-secondary-glass"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              Sign Out
            </button>
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
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn({ email, password });
        navigate(redirectPath);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUp({ email, password, fullName, phone });
        setSuccessMsg('Account registered successfully! You are now logged in.');
        setTimeout(() => navigate(redirectPath), 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom" style={{ paddingTop: '50px', paddingBottom: '80px', maxWidth: '480px' }}>
      <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-glass-hover)', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
        
        {/* Toggle Modes */}
        <div style={{ display: 'flex', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'signin' ? 'var(--accent)' : 'transparent',
              color: mode === 'signin' ? '#000000' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'signup' ? 'var(--accent)' : 'transparent',
              color: mode === 'signup' ? '#000000' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px 0' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Join GoalWear'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            {mode === 'signin' ? 'Log in to track your squad jerseys & orders' : 'Create an account for expedited checkout & order tracking'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontSize: '0.82rem' }}>
            <AlertCircle size={16} color="#ef4444" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#86efac', fontSize: '0.82rem' }}>
            <CheckCircle2 size={16} color="var(--accent)" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Firebase Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="btn-premium"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '18px',
            cursor: 'pointer',
            opacity: submitting ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-glass)' }} />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-glass)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', marginBottom: '6px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fan@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: 'white',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', marginBottom: '6px' }}>
                Phone Number (Optional for COD)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'white', marginBottom: '6px' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: 'white',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-premium btn-primary-glow"
            style={{
              padding: '14px 0',
              fontWeight: 800,
              fontSize: '0.9rem',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: submitting ? 0.7 : 1
            }}
          >
            <span>{submitting ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Orders operate on Cash-On-Delivery with bKash advance delivery verification.
          </p>
        </div>

      </div>
    </div>
  );
}
