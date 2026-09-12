import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Package, Heart, Shield, LogOut, Settings, LayoutDashboard, ChevronRight } from 'lucide-react';

import AccountOverview from './AccountOverview';
import AccountPersonalInfo from './AccountPersonalInfo';
import AccountAddresses from './AccountAddresses';
import AccountSecurity from './AccountSecurity';
import CustomerOrders from './CustomerOrders';
import Wishlist from './Wishlist';

export default function AccountDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/account/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/account/login');
  };

  const navItems = [
    { name: 'Overview', path: '/account', icon: LayoutDashboard },
    { name: 'Personal Info', path: '/account/profile', icon: User },
    { name: 'My Addresses', path: '/account/addresses', icon: MapPin },
    { name: 'Order History', path: '/account/orders', icon: Package },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, external: true },
    { name: 'Security', path: '/account/security', icon: Shield },
  ];

  return (
    <div className="container-custom" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '30px' }} className="account-layout">
        
        {/* Sidebar */}
        <aside className="account-sidebar" style={{ flex: '0 0 280px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '50%', 
                backgroundColor: 'rgba(0, 255, 136, 0.1)', 
                border: '1px solid rgba(0, 255, 136, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 800
              }}>
                {(profile?.full_name || profile?.fullName || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                  {profile?.full_name || profile?.fullName || 'Customer'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </p>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const isActive = item.path === '/account' 
                  ? location.pathname === '/account'
                  : location.pathname.startsWith(item.path);
                  
                if (item.external) {
                  return (
                    <Link 
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '12px 16px', borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none', transition: 'all 0.2s',
                        fontSize: '0.9rem', fontWeight: 600
                      }}
                      className="sidebar-link-hover"
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <Link 
                    key={item.name}
                    to={item.path}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 16px', borderRadius: '10px',
                      backgroundColor: isActive ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      textDecoration: 'none', transition: 'all 0.2s',
                      fontSize: '0.9rem', fontWeight: isActive ? 700 : 600,
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent'
                    }}
                    className="sidebar-link-hover"
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 16px', borderRadius: '10px',
                  backgroundColor: 'transparent', border: 'none',
                  color: '#ff4444', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                className="sidebar-link-hover signout-btn"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: '1', minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<AccountOverview />} />
            <Route path="profile" element={<AccountPersonalInfo />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="security" element={<AccountSecurity />} />
          </Routes>
        </main>
      </div>

      <style>{`
        .account-layout { flex-direction: column; }
        @media (min-width: 992px) { .account-layout { flex-direction: row; } }
        .sidebar-link-hover:hover { background-color: rgba(255, 255, 255, 0.05) !important; color: white !important; }
        .sidebar-link-hover.signout-btn:hover { background-color: rgba(255, 68, 68, 0.1) !important; color: #ff6b6b !important; }
      `}</style>
    </div>
  );
}
