import React, { useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIdx, setActiveIdx] = useState(null);

  const faqData = [
    {
      q: "How does the bKash delivery fee pre-payment work?",
      a: "Because jerseys are custom-packed and dispatched using premium courier partners, we require the delivery fee of 150 BDT to be paid first via bKash. The actual cost of the jersey is paid Cash On Delivery (COD) once you receive the package.",
      cat: "Payment"
    },
    {
      q: "Is it safe to submit my bKash Transaction ID?",
      a: "Yes. The Transaction ID (TxnID) is used solely by our admin to verify that the 150 BDT delivery fee has been sent. Your details are encrypted locally and are not shared with any third party.",
      cat: "Payment"
    },
    {
      q: "What happens if my Transaction ID is rejected?",
      a: "If the transaction ID is incorrect or fails matching checks, our admin will reject the verification. Your order status on the Track Order page will show 'Rejected'. You can then email us at support@goalwear.com to rectify the TxnID.",
      cat: "Orders"
    },
    {
      q: "Are the jerseys authentic replicas?",
      a: "Yes, they are premium player-spec replicas featuring authentic badges, sponsor markings, and aeroready moisture absorption fabric structures matching the original club templates.",
      cat: "Product"
    },
    {
      q: "Can I customize the name and number printed on the back?",
      a: "Currently, our standard stock jerseys come with preset legendary numbers (e.g. Messi 10, Vinicius 7, De Bruyne 17). Custom printing can be requested by leaving a note on our Contact page.",
      cat: "Product"
    },
    {
      q: "Can I change my delivery address after placing an order?",
      a: "Address changes are accepted before the order state transitions to 'Shipped'. Search your Order ID on the Track page to monitor current shipping stages.",
      cat: "Orders"
    }
  ];

  const filteredFaqs = faqData.filter(item =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="section-title">Support <span>Hub</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px' }}>
          Frequently Asked Questions. Search keywords below to find solutions.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search FAQs by keywords (e.g. bKash, shipping)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px 14px 44px',
            borderRadius: '8px',
            border: '1px solid var(--border-glass)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'white',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Accordions */}
      {filteredFaqs.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No matching questions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFaqs.map((faq, index) => {
            const isActive = activeIdx === index;
            return (
              <div 
                key={index}
                className="glass-panel"
                style={{
                  padding: '18px 24px',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => setActiveIdx(isActive ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={18} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{faq.q}</span>
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>
                    {isActive ? '-' : '+'}
                  </span>
                </div>

                {isActive && (
                  <div style={{
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '8px'
                    }}>
                      Category: {faq.cat}
                    </span>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
