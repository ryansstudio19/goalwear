import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingBag, Menu, X, Search, Activity } from 'lucide-react';

export default function Navbar() {
  const { currentView, setView, getCartCount, wishlist } = useContext(ShopContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'National Teams', view: 'national' },
    { label: 'Club Teams', view: 'club' },
    { label: 'New Arrivals', view: 'new-arrivals' },
    { label: 'Size Guide', view: 'sizeguide' },
    { label: 'Track Order', view: 'track' },
  ];

  const handleNavClick = (view) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView('shop', { search: searchQuery });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-glass)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setView('home')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            fontFamily: 'var(--font-headings)',
            fontWeight: 900,
            fontSize: '1.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <Activity size={26} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
          <span>GOAL<span style={{ color: 'var(--accent)' }}>WEAR</span></span>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none' }} className="desktop-nav-styles">
          <ul style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
            {navLinks.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  style={{
                    color: currentView === link.view ? 'var(--accent)' : 'var(--text-primary)',
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
                  {currentView === link.view && (
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
            ))}
          </ul>
        </nav>

        {/* Icons Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Search Toggle */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            style={{ color: 'var(--text-primary)', transition: 'var(--transition-fast)' }}
            hover-color="var(--accent)"
          >
            <Search size={22} />
          </button>

          {/* Wishlist */}
          <button 
            onClick={() => setView('wishlist')} 
            style={{ position: 'relative', color: 'var(--text-primary)' }}
          >
            <Heart size={22} fill={currentView === 'wishlist' ? 'var(--accent)' : 'none'} color={currentView === 'wishlist' ? 'var(--accent)' : 'currentColor'} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent)',
                color: '#000000',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 5px var(--accent-glow)'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button 
            onClick={() => setView('cart')} 
            style={{ position: 'relative', color: 'var(--text-primary)' }}
          >
            <ShoppingBag size={22} color={currentView === 'cart' ? 'var(--accent)' : 'currentColor'} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent)',
                color: '#000000',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 5px var(--accent-glow)'
              }}>
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="mobile-toggle"
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dynamic Search Bar (Slide down) */}
      {searchOpen && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '16px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'fade-in 0.2s ease'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Search football jerseys (e.g. Argentina, Real Madrid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none'
              }}
              autoFocus
            />
            <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '0 20px' }}>
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          backgroundColor: 'var(--bg-secondary)',
          zIndex: 99,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          borderTop: '1px solid var(--border-glass)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          overflowY: 'auto'
        }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', listStyle: 'none' }}>
            {navLinks.map((link) => (
              <li key={link.view} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <button
                  onClick={() => handleNavClick(link.view)}
                  style={{
                    color: currentView === link.view ? 'var(--accent)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-headings)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '1.2rem',
                    textAlign: 'left',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
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
        .nav-link-hover:hover {
          color: var(--accent) !important;
          text-shadow: 0 0 8px var(--accent-glow);
        }
      `}</style>
    </header>
  );
}
