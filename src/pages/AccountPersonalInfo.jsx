import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AccountPersonalInfo() {
  const { user, profile, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || profile.fullName || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!fullName.trim()) {
      setStatus({ type: 'error', message: 'Full name is required.' });
      setLoading(false);
      return;
    }

    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim()
      });
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px 0', color: 'white' }}>
        Personal Information
      </h2>

      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', maxWidth: '600px' }}>
        
        {status.message && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px',
            backgroundColor: status.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)',
            border: `1px solid ${status.type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 68, 68, 0.2)'}`,
            color: status.type === 'success' ? '#00ff88' : '#ff6b6b',
            marginBottom: '24px', fontSize: '0.85rem'
          }}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-muted)', cursor: 'not-allowed', fontSize: '0.95rem'
              }} 
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email addresses are managed in Security settings or cannot be changed.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 14px 14px 42px', borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
                }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 017XXXXXXXX"
                style={{
                  width: '100%', padding: '14px 14px 14px 42px', borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
                }} 
              />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium btn-primary-glow"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
