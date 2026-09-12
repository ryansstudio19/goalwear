import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AccountAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '', phone: '', address_line: '', area: '', city: '', postal_code: '', country: 'Bangladesh', is_default: false
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) {
        if (error.code !== 'PGRST116') console.error(error);
        return;
      }
      setAddresses(data || []);
    } catch (err) {
      console.warn("Addresses table might not exist yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const resetForm = () => {
    setFormData({
      full_name: '', phone: '', address_line: '', area: '', city: '', postal_code: '', country: 'Bangladesh', is_default: false
    });
    setEditingId(null);
    setShowForm(false);
    setStatus({ type: '', message: '' });
  };

  const handleEdit = (addr) => {
    setFormData({
      full_name: addr.full_name, phone: addr.phone, address_line: addr.address_line,
      area: addr.area, city: addr.city, postal_code: addr.postal_code, country: addr.country,
      is_default: addr.is_default
    });
    setEditingId(addr.id);
    setShowForm(true);
    setStatus({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const { error } = await supabase.from('customer_addresses').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      // Unset all first
      await supabase.from('customer_addresses').update({ is_default: false }).eq('user_id', user.id);
      // Set the specific one
      await supabase.from('customer_addresses').update({ is_default: true }).eq('id', id).eq('user_id', user.id);
      fetchAddresses();
    } catch (err) {
      alert('Failed to set default address.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // If setting this to default, unset others first in DB (frontend driven for simplicity if no triggers exist)
      if (formData.is_default) {
        await supabase.from('customer_addresses').update({ is_default: false }).eq('user_id', user.id);
      }

      const payload = {
        user_id: user.id,
        ...formData
      };

      if (editingId) {
        const { error } = await supabase.from('customer_addresses').update(payload).eq('id', editingId);
        if (error) throw error;
        setStatus({ type: 'success', message: 'Address updated successfully.' });
      } else {
        const { error } = await supabase.from('customer_addresses').insert([payload]);
        if (error) throw error;
        setStatus({ type: 'success', message: 'Address added successfully.' });
      }

      await fetchAddresses();
      setTimeout(() => resetForm(), 1500);

    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to save address.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading addresses...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'white' }}>
          My Addresses
        </h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-premium btn-primary-glow"
            style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', maxWidth: '600px', marginBottom: '32px', position: 'relative' }}>
          <button onClick={resetForm} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 24px 0', color: 'white' }}>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', sm: { flexDirection: 'row' } }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name *</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>House / Road / Area *</label>
              <input required type="text" value={formData.address_line} onChange={e => setFormData({...formData, address_line: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Area/Thana</label>
                <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>City *</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Postal Code</label>
                <input type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.9rem' }} />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Country</label>
                <input type="text" value={formData.country} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Set as default address</span>
            </label>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={submitting} className="btn-premium btn-primary-glow" style={{ flex: 1, padding: '12px', fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
              </button>
              <button type="button" onClick={resetForm} className="btn-premium btn-secondary-glass" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        addresses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '16px', border: '1px dashed var(--border-glass)' }}>
            <MapPin size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'white' }}>No Saved Addresses</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add an address to make your checkout experience faster.</p>
            <button onClick={() => setShowForm(true)} className="btn-premium btn-secondary-glass" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Add Your First Address
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {addresses.map(addr => (
              <div key={addr.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', position: 'relative', border: addr.is_default ? '1px solid var(--accent)' : '1px solid var(--border-glass)' }}>
                {addr.is_default && (
                  <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--accent)', color: '#0a0f1d', fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                    Default
                  </span>
                )}
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'white', paddingRight: addr.is_default ? '60px' : '0' }}>{addr.full_name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
                  {addr.phone}<br/>
                  {addr.address_line}<br/>
                  {addr.area && <>{addr.area}<br/></>}
                  {addr.city}, {addr.postal_code}<br/>
                  {addr.country}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <button onClick={() => handleEdit(addr)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: 0 }} className="sidebar-link-hover">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(addr.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: 0 }} className="sidebar-link-hover">
                    <Trash2 size={14} /> Delete
                  </button>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: 0 }}>
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
