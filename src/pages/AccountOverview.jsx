import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Heart, Shield, ArrowRight } from 'lucide-react';

export default function AccountOverview() {
  const { user, profile } = useAuth();
  const { orders } = useContext(ShopContext);
  const navigate = useNavigate();
  const [defaultAddress, setDefaultAddress] = useState(null);
  
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const { data, error } = await supabase
          .from('customer_addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .single();
          
        if (!error && data) setDefaultAddress(data);
      } catch (err) {
        // Silently ignore if table doesn't exist yet
      }
    };
    if (user) fetchDefaultAddress();
  }, [user]);

  const recentOrders = orders?.slice(0, 2) || [];

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px 0', color: 'white' }}>
        Overview
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Profile Snapshot */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'white' }}>Personal Info</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage your personal details.</p>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: '4px' }}><strong style={{ color: 'white' }}>{profile?.full_name || 'Name not set'}</strong></div>
            <div style={{ marginBottom: '4px' }}>{user?.email}</div>
            <div>{profile?.phone || 'Phone not set'}</div>
          </div>
          <button onClick={() => navigate('/account/profile')} style={{ marginTop: 'auto', alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Edit Profile <ArrowRight size={14} />
          </button>
        </div>

        {/* Address Snapshot */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: 'white' }}>Default Address</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Where your gear gets delivered.</p>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {defaultAddress ? (
              <>
                <div style={{ marginBottom: '4px' }}><strong style={{ color: 'white' }}>{defaultAddress.full_name}</strong></div>
                <div>{defaultAddress.address_line}</div>
                <div>{defaultAddress.area}, {defaultAddress.city} {defaultAddress.postal_code}</div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} /> No default address set.
              </div>
            )}
          </div>
          <button onClick={() => navigate('/account/addresses')} style={{ marginTop: 'auto', alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage Addresses <ArrowRight size={14} />
          </button>
        </div>

      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', color: 'white' }}>Recent Orders</h3>
      {recentOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentOrders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ color: 'white', display: 'block', fontSize: '0.95rem' }}>#{order.order_number || order.id}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(order.created_at || order.date).toLocaleDateString()}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1rem', display: 'block' }}>৳{order.total}</span>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>{order.status}</span>
              </div>
            </div>
          ))}
          <button onClick={() => navigate('/account/orders')} style={{ alignSelf: 'center', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginTop: '10px', transition: 'all 0.2s' }} className="btn-hover-white">
            View All Orders
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderRadius: '12px' }}>
          <Package size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}
