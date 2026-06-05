import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, Phone, MapPin, Lock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { setView } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={{
      backgroundColor: '#050608',
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '60px',
      paddingBottom: '30px',
      position: 'relative',
      zIndex: 5,
      color: 'var(--text-secondary)'
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info */}
          <div>
            <h3 style={{
              color: '#ffffff',
              fontFamily: 'var(--font-headings)',
              fontSize: '1.4rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px'
            }}>
              GOAL<span style={{ color: 'var(--accent)' }}>WEAR</span>
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
              GoalWear is a premium sports apparel brand crafting high-quality, international standard football jerseys. Experience stadium atmosphere design and interactive custom visualizers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--accent)" />
                <span>+880 1848-520875</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--accent)" />
                <span>goalwearbb@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="var(--accent)" />
                <span>NO AVAILABLE SHOWROOM AT THIS MOMENT!</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '20px' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><button onClick={() => setView('shop')} className="footer-link">All Jerseys</button></li>
              <li><button onClick={() => setView('national')} className="footer-link">National Team Kits</button></li>
              <li><button onClick={() => setView('club')} className="footer-link">Club League Shirts</button></li>
              <li><button onClick={() => setView('new-arrivals')} className="footer-link">New Season Arrivals</button></li>
              <li><button onClick={() => setView('sizeguide')} className="footer-link">Size Calculator</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ color: '#ffffff', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '20px' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><button onClick={() => setView('track')} className="footer-link">Track Order Status</button></li>
              <li><button onClick={() => setView('faq')} className="footer-link">Frequently Asked Questions</button></li>
              <li><button onClick={() => setView('about')} className="footer-link">Our Brand Story</button></li>
              <li><button onClick={() => setView('contact')} className="footer-link">Contact Us</button></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Returns Policy:\nWe offer exchanges within 7 days of delivery. The item must be unused, in its original packing, and have all tags attached."); }} className="footer-link">Return & Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter / Payments */}
          <div>
            <h4 style={{ color: '#ffffff', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '20px' }}>
              Join the Squad
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '15px' }}>
              Subscribe to get exclusive alerts on hot kit drops and limited edition releases.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '0 16px', height: '38px', borderRadius: '6px' }}>
                Join
              </button>
            </form>
            {subscribed && (
              <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, animation: 'fade-in 0.2s ease' }}>
                Welcome to the squad! Check your inbox soon.
              </p>
            )}

            {/* Payment badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '10px 15px',
              marginTop: '15px'
            }}>
              <ShieldCheck size={20} color="var(--accent)" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>Secure Checkout</span>
                <span style={{ fontSize: '0.65rem' }}>Cash On Delivery + bKash delivery fee</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)', marginBottom: '24px' }} />

        {/* Footer bottom */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          mdDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.8rem'
        }} className="footer-bottom-flex">
          <div>
            &copy; {new Date().getFullYear()} GoalWear. All Rights Reserved. Made for true football fans.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => alert("GoalWear Developer Security:\nSSL Encrypted payment portals simulated locally. No real payments are processed.")}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert("GoalWear Merchant Terms:\nCustom football jerseys replica quality. Delivery fee is non-refundable once order is shipped.")}>Terms of Service</span>
            {/* Subtle Admin Panel Trigger */}
            <button 
              onClick={() => setView('admin')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                opacity: 0.4, 
                transition: 'opacity 0.2s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
            >
              <Lock size={12} />
              <span>Admin Workspace</span>
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .footer-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0;
          font-size: inherit;
          text-align: left;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--accent);
          padding-left: 5px;
        }
        @media (min-width: 768px) {
          .footer-bottom-flex {
            flex-direction: row !important;
          }
        }
      `}</style>
    </footer>
  );
}
