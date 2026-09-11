import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Activity, 
  ShieldCheck, 
  User, 
  RotateCcw, 
  Ruler, 
  Truck, 
  HelpCircle, 
  MessageCircle, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { currentView, setView, getCartCount, wishlist, isAdminLoggedIn } = useContext(ShopContext);
  const { user, profile, isAdmin, isOwner } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isStoreAdmin = Boolean(
    isAdmin || 
    isOwner || 
    isAdminLoggedIn || 
    profile?.role === 'admin' || 
    profile?.role === 'owner' || 
    (user?.email && ['siyamisaba@gmail.com', 'admin@goalwear.com', 'ryantasinff@gmail.com'].includes(user.email.toLowerCase()))
  );

  // Close mobile menu & search upon route transitions
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock background scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/', view: 'home' },
    { label: 'Shop', path: '/shop', view: 'shop' },
    { label: 'National Teams', path: '/national-teams', view: 'national' },
    { label: 'Club Teams', path: '/club-teams', view: 'club' },
    { label: 'New Arrivals', path: '/new-arrivals', view: 'new-arrivals' },
    { label: 'Size Guide', path: '/size-guide', view: 'sizeguide' },
    { label: 'Track Order', path: '/track-order', view: 'track' },
  ];

  const handleNavClick = (path, view) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      backgroundColor: 'rgba(3, 7, 18, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container-custom navbar-header-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
        padding: '0 clamp(10px, 2.5vw, 24px)'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="navbar-brand-container"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '7px', 
            cursor: 'pointer',
            fontFamily: 'var(--font-headings)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flexShrink: 0,
            userSelect: 'none'
          }}
        >
          <Activity size={23} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
          <span style={{ fontSize: 'clamp(1.15rem, 3.8vw, 1.55rem)', whiteSpace: 'nowrap' }}>
            GOAL<span style={{ color: 'var(--accent)' }}>WEAR</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none' }} className="desktop-nav-styles">
          <ul style={{ display: 'flex', gap: '28px', listStyle: 'none' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.view}>
                  <button
                    onClick={() => handleNavClick(link.path, link.view)}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-headings)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                      letterSpacing: '0.05em',
                      position: 'relative',
                      paddingBottom: '4px',
                      transition: 'var(--transition-fast)'
                    }}
                    className="nav-link-hover"
                  >
                    {link.label}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent)'
                      }} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Icons Area: All 5 actions fit flawlessly without mobile overflow */}
        <div 
          className="navbar-actions-group"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(5px, 1.5vw, 14px)',
            flexShrink: 0
          }}
        >
          {/* 1. Search Toggle */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="nav-action-btn"
            style={{ 
              color: searchOpen ? 'var(--accent)' : 'var(--text-primary)', 
              transition: 'var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: searchOpen ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
              border: searchOpen ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid transparent',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Search Products"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* 2. Customer Account */}
          <button
            onClick={() => navigate('/account')}
            className="nav-action-btn"
            style={{ 
              position: 'relative', 
              color: location.pathname.startsWith('/account') ? 'var(--accent)' : 'var(--text-primary)',
              transition: 'var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: location.pathname.startsWith('/account') ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
              border: location.pathname.startsWith('/account') ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid transparent',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title={user ? `Account (${profile?.full_name || user.email})` : 'Sign In / Account'}
            aria-label="Account"
          >
            <User size={19} />
            {user && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 6px var(--accent)'
              }} />
            )}
          </button>

          {/* Admin Portal Quick Access Button */}
          {isStoreAdmin && (
            <button
              id="nav-admin-portal-btn"
              onClick={() => navigate('/admin')}
              className="nav-action-btn"
              style={{
                position: 'relative',
                color: location.pathname.startsWith('/admin') ? '#000000' : 'var(--accent)',
                backgroundColor: location.pathname.startsWith('/admin') ? 'var(--accent)' : 'rgba(0, 255, 136, 0.12)',
                border: '1px solid var(--accent)',
                borderRadius: '8px',
                padding: '0 10px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Merchant Admin Portal"
            >
              <ShieldCheck size={16} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* 3. Wishlist */}
          <button 
            onClick={() => navigate('/wishlist')} 
            className="nav-action-btn"
            style={{ 
              position: 'relative', 
              color: location.pathname === '/wishlist' ? 'var(--accent)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: location.pathname === '/wishlist' ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
              border: location.pathname === '/wishlist' ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid transparent',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={19} fill={location.pathname === '/wishlist' ? 'var(--accent)' : 'none'} color={location.pathname === '/wishlist' ? 'var(--accent)' : 'currentColor'} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--accent)',
                color: '#000000',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px var(--accent-glow)'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 4. Cart */}
          <button 
            onClick={() => navigate('/cart')} 
            className="nav-action-btn"
            style={{ 
              position: 'relative', 
              color: location.pathname === '/cart' ? 'var(--accent)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: location.pathname === '/cart' ? 'rgba(0, 255, 136, 0.12)' : 'transparent',
              border: location.pathname === '/cart' ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid transparent',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag size={19} color={location.pathname === '/cart' ? 'var(--accent)' : 'currentColor'} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--accent)',
                color: '#000000',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px var(--accent-glow)'
              }}>
                {getCartCount()}
              </span>
            )}
          </button>

          {/* 5. Mobile Menu Toggle - NEVER CLIPPED OR OBSCURED */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="mobile-toggle"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: mobileMenuOpen ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: mobileMenuOpen ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.12)',
              color: mobileMenuOpen ? 'var(--accent)' : 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'var(--transition-fast)'
            }}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            title="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Dynamic Search Bar (Slide down) */}
      {searchOpen && (
        <div style={{
          position: 'absolute',
          top: '74px',
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(10, 15, 26, 0.98)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '14px 16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          animation: 'fade-in 0.2s ease',
          zIndex: 101
        }}>
          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Search jerseys (e.g. Argentina, Real Madrid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              autoFocus
            />
            <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '0 18px', fontSize: '0.85rem' }}>
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '74px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 74px)',
          backgroundColor: 'rgba(3, 7, 18, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 99,
          padding: '20px 16px 40px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderTop: '1px solid var(--border-glass)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
          overflowY: 'auto'
        }}>
          
          {/* Quick Account Status Card */}
          <div 
            onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 255, 136, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                  {user ? (profile?.full_name || user.email) : 'Welcome to GoalWear'}
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent)' }}>
                  {user ? 'View Profile & Order History' : 'Sign In or Register for Rewards'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          {/* Admin Portal in Drawer */}
          {isStoreAdmin && (
            <div 
              id="mobile-nav-admin-portal-link"
              onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 255, 136, 0.12)',
                border: '1px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0, 255, 136, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--accent)" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    Merchant Admin Portal
                  </span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#e2e8f0' }}>
                    Orders, bKash audits, &amp; inventory
                  </span>
                </div>
              </div>
              <ChevronRight size={16} color="var(--accent)" />
            </div>
          )}

          {/* Quick Search Form inside Drawer */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                placeholder="Search jerseys, clubs, players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '0 16px', fontSize: '0.82rem' }}>
              Go
            </button>
          </form>

          {/* Navigation Collections */}
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Jersey Catalog
            </span>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'All Matchday Kits', path: '/shop' },
                { label: 'National Teams', path: '/national-teams', badge: 'World Cup' },
                { label: 'Club Teams', path: '/club-teams', badge: 'UCL' },
                { label: 'New Arrivals', path: '/new-arrivals', badge: 'NEW' },
                { label: 'Best Sellers', path: '/best-sellers', badge: 'HOT' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(link.path)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: location.pathname === link.path ? 'rgba(0, 255, 136, 0.08)' : 'transparent',
                      color: location.pathname === link.path ? 'var(--accent)' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: link.badge === 'HOT' || link.badge === 'NEW' ? 'rgba(255, 71, 87, 0.15)' : 'rgba(0, 255, 136, 0.12)',
                        color: link.badge === 'HOT' || link.badge === 'NEW' ? '#ff4757' : 'var(--accent)',
                        fontWeight: 800
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Customer Support &amp; Policies
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {/* Return & Refund Policy (Highlighted) */}
              <button
                onClick={() => handleNavClick('/return-policy')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: location.pathname === '/return-policy' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 255, 136, 0.04)',
                  border: '1px solid rgba(0, 255, 136, 0.25)',
                  color: 'var(--accent)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RotateCcw size={17} />
                  <span>Return &amp; Refund Policy</span>
                </div>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(0, 255, 136, 0.15)', color: 'var(--accent)' }}>
                  7-Day
                </span>
              </button>

              {/* Size Guide */}
              <button
                onClick={() => handleNavClick('/size-guide')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: location.pathname === '/size-guide' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Ruler size={16} />
                <span>Size Guide Calculator</span>
              </button>

              {/* Track Order */}
              <button
                onClick={() => handleNavClick('/track-order')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: location.pathname === '/track-order' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Truck size={16} />
                <span>Track Order Milestones</span>
              </button>

              {/* FAQ */}
              <button
                onClick={() => handleNavClick('/faq')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: location.pathname === '/faq' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <HelpCircle size={16} />
                <span>Frequently Asked Questions</span>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNavClick('/contact')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: location.pathname === '/contact' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <MessageCircle size={16} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Connect */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <a
              href="https://wa.me/8801848520875"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--accent)',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Concierge: +880 1848-520875</span>
            </a>
          </div>

        </div>
      )}

      {/* Injecting CSS Media Queries for responsiveness */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav-styles {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .nav-action-btn, .mobile-toggle {
            width: 33px !important;
            height: 33px !important;
          }
          .navbar-actions-group {
            gap: 4px !important;
          }
          .navbar-header-container {
            padding: 0 10px !important;
          }
        }
        .nav-link-hover:hover {
          color: var(--accent) !important;
          text-shadow: 0 0 8px var(--accent-glow);
        }
      `}</style>
    </header>
  );
}

