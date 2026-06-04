import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { CheckCircle, Truck, Clipboard, Calendar, FileText } from 'lucide-react';

export default function Confirmation() {
  const { viewParams, setView } = useContext(ShopContext);
  const orderId = viewParams?.orderId || "GW-XXXXX";

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    alert(`Order ID ${orderId} copied to clipboard!`);
  };

  return (
    <div className="container-custom" style={{ paddingTop: '60px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: 'var(--shadow-glass)',
          border: '1px solid var(--border-glass-hover)',
          backgroundColor: '#0c0e15'
        }}
      >
        {/* Animated Check */}
        <div style={{
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          boxShadow: '0 0 25px var(--accent-glow)'
        }}>
          <CheckCircle size={44} />
        </div>

        {/* Text Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.15em' }}>Success! Order Received</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>WELCOME TO THE SQUAD</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px', margin: '6px auto 0' }}>
            Your checkout sheet has been submitted to our squad. Please copy your tracking ID below to check shipment milestones.
          </p>
        </div>

        {/* Order ID Copy Box */}
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-glass)',
          borderRadius: '10px',
          padding: '16px 24px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <FileText size={20} color="var(--accent)" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>GoalWear tracking code</span>
              <strong style={{ fontSize: '1.25rem', color: 'white', letterSpacing: '0.05em' }}>{orderId}</strong>
            </div>
          </div>
          <button 
            onClick={handleCopy}
            className="btn-premium btn-secondary-glass"
            style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            <Clipboard size={14} />
            <span>Copy</span>
          </button>
        </div>

        {/* Operational Next steps list */}
        <div style={{
          width: '100%',
          textAlign: 'left',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'white', fontWeight: 800 }}>Next Steps:</h4>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', shrink: 0, marginTop: '2px' }} className="circle-node-num">1</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'white', display: 'block' }}>Admin Verification</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Our team will match the bKash TxnID against our statements. (Usually takes 1-2 hours).</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent)', shrink: 0, marginTop: '2px' }} className="circle-node-num">2</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'white', display: 'block' }}>Packaging & Printing</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Once payment is verified, the order status changes to 'Processing' and we pack your kit.</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', width: '100%', flexWrap: 'wrap', marginTop: '10px' }} className="cta-flex">
          <button 
            onClick={() => setView('track', { orderId })}
            className="btn-premium btn-primary-glow"
            style={{ flex: 1, padding: '12px 0', minWidth: '180px' }}
          >
            <Truck size={16} />
            <span>Track Order Milestones</span>
          </button>
          <button 
            onClick={() => setView('shop')}
            className="btn-premium btn-secondary-glass"
            style={{ flex: 1, padding: '12px 0', minWidth: '180px' }}
          >
            Continue Shopping
          </button>
        </div>

      </div>
      
      <style>{`
        .circle-node-num {
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 576px) {
          .cta-flex {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
