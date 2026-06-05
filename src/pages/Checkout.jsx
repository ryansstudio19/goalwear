import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Smartphone, ShieldAlert, CheckCircle2, User, MapPin, Phone } from 'lucide-react';

export default function Checkout() {
  const { placeOrder, getCartTotal } = useContext(ShopContext);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTxnId, setBkashTxnId] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = 150;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validations
    if (!name.trim() || !address.trim() || !phone.trim() || !bkashNumber.trim() || !bkashTxnId.trim()) {
      alert("Please fill out all shipping and payment fields.");
      return;
    }

    if (phone.length < 11 || bkashNumber.length < 11) {
      alert("Please enter a valid 11-digit Bangladeshi mobile number.");
      return;
    }

    if (bkashTxnId.length < 8) {
      alert("Please enter a valid bKash Transaction ID (minimum 8 characters).");
      return;
    }

    // Call placeOrder which records details, empties cart, and redirects to confirmation
    placeOrder({
      name,
      address,
      phone,
      bkashNumber,
      bkashTxnId
    });
  };

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="section-title">Secure <span>Checkout</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px' }}>
          Prepay delivery fee via bKash to confirm shipment. The jersey cost will be Cash On Delivery.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.2fr 1fr',
        gap: '40px'
      }} className="checkout-layout-grid">
        
        {/* Left Column: Form details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Step 1: Customer Details */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: 'var(--accent)', color: 'black', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 900 }} className="circle-node-num">1</span>
                <span>Shipping Details</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanzim Sakib"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-glass)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Delivery Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Detailed Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 3B, House 12, Road 4, Mirpur 12, Dhaka"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-glass)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <MapPin size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Contact Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Contact Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-glass)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <Phone size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Prepaid bKash Payment */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: 'var(--accent)', color: 'black', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 900 }} className="circle-node-num">2</span>
                <span>bKash Delivery Pre-Payment</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Instructions Box */}
                <div style={{
                  backgroundColor: 'rgba(233, 30, 99, 0.05)',
                  border: '1px solid #e91e63',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 700, marginBottom: '6px' }}>
                    <Smartphone size={16} color="#e91e63" />
                    <span>How to pre-pay bKash Fee:</span>
                  </div>
                  1. Open your bKash app and select <strong>Send Money</strong>.<br />
                  2. Enter our recipient number: <strong style={{ color: 'white' }}>01848-520875</strong>.<br />
                  3. Enter amount: <strong style={{ color: 'var(--accent)' }}>120 BDT</strong>.<br />
                  4. Complete transaction, then fill in the sender number and Transaction ID (TxnID) below.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', smTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-flex">
                  {/* bKash Sender No */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>bKash Sender Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-glass)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Transaction ID */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Transaction ID (TxnID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BKD839SF2G"
                      value={bkashTxnId}
                      onChange={(e) => setBkashTxnId(e.target.value.toUpperCase())}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-glass)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Warning details */}
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <ShieldAlert size={14} color="#ff3366" style={{ shrink: 0, marginTop: '2px' }} />
                  <span>Fraud Alert: Submitting fake Transaction IDs will result in automatic order cancellation and blocking of your IP address. Our admin verifies all bKash statements in real-time.</span>
                </div>

              </div>
            </div>

            {/* Complete Order button */}
            <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '16px 0', fontSize: '1rem' }}>
              Complete Order (Cash On Delivery)
            </button>

          </form>

        </div>

        {/* Right Column: Order breakdown */}
        <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
            Checkout Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '200px', overflowY: 'auto' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items to Ship</span>
              {/* Note: In checkout, we just display the summary items from context, or list them simply */}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal (Jersey cost):</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{subtotal} BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge (Prepaid):</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>150 BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Payment Mode:</span>
                <span style={{ color: 'white', fontWeight: 700 }}>COD + Pre-paid bKash</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

            <div style={{
              backgroundColor: 'rgba(0, 255, 136, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)', fontWeight: 700 }}>
                <span>Pay via bKash Now:</span>
                <span>150 BDT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 700 }}>
                <span>Due on Handover (COD):</span>
                <span>{subtotal} BDT</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .circle-node-num {
          justify-content: center;
          align-items: center;
        }
        @media (min-width: 992px) {
          .checkout-layout-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
        @media (min-width: 576px) {
          .form-row-flex {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
}
