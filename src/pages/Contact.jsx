import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in required fields.");
      return;
    }
    // Simulate contact form submission
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="section-title">Contact <span>Us</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '10px auto 0' }}>
          Have sizing inquiries or customization questions? Leave our support squad a message below.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1fr 1.2fr',
        gap: '40px'
      }} className="contact-grid">
        
        {/* Contact Info Card */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '16px', color: 'white' }}>Support Office</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our support team operates Saturday to Thursday from 10:00 AM to 8:00 PM (GMT+6) to assist with orders and returns.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid var(--border-glass-hover)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }} className="icon-wrap-center">
                <Phone size={18} color="var(--accent)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Hotline</span>
                <h4 style={{ fontSize: '0.95rem', color: 'white' }}>+880 1712-345678</h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid var(--border-glass-hover)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }} className="icon-wrap-center">
                <Mail size={18} color="var(--accent)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Support</span>
                <h4 style={{ fontSize: '0.95rem', color: 'white' }}>support@goalwear.com</h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid var(--border-glass-hover)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }} className="icon-wrap-center">
                <MapPin size={18} color="var(--accent)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HQ Showroom</span>
                <h4 style={{ fontSize: '0.95rem', color: 'white' }}>Stadium Avenue, Block C, Dhaka</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '24px', color: 'white' }}>Send Message</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="form-row-flex">
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Subject */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Subject</label>
              <input
                type="text"
                placeholder="Order Inquiries, Custom sizing, Sponsorship..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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

            {/* Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Message *</label>
              <textarea
                rows={5}
                required
                placeholder="Write details of your query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {sent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>Message sent successfully! Our squad will respond shortly.</span>
              </div>
            )}

            <button type="submit" className="btn-premium btn-primary-glow" style={{ width: '100%', padding: '14px 0' }}>
              <Send size={16} />
              <span style={{ marginLeft: '8px' }}>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .icon-wrap-center {
          justify-content: center;
          align-items: center;
        }
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr 1.2fr !important;
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
