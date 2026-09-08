import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HelpCircle, Search, RotateCcw, ArrowRight } from 'lucide-react';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIdx, setActiveIdx] = useState(null);
  const navigate = useNavigate();

  const faqData = [
    {
      q: "What is your Return & Refund Policy?",
      a: "We offer a 7-day hassle-free size exchange and defect return policy. If you receive an incorrect size or manufacturing defect, you can exchange it within 7 days of receiving the package. Items must be unworn, unwashed, and have original tags intact.",
      cat: "Returns"
    },
    {
      q: "Can I inspect the jersey before paying the courier rider?",
      a: "Yes! We encourage all customers to inspect their package in front of the courier delivery representative. If there is visible transit damage, wrong club, or wrong size delivered, you can reject the parcel on the spot.",
      cat: "Returns"
    },
    {
      q: "Are customized jerseys eligible for refund or return?",
      a: "Jerseys heat-pressed with custom vinyl name and squad number cannot be returned for a cash refund unless GoalWear made a spelling or printing defect.",
      cat: "Returns"
    },
    {
      q: "How does the bKash delivery fee pre-payment work?",
      a: "Because jerseys are custom-packed and dispatched using premium courier partners, we require the delivery fee of 120 BDT to be paid first via bKash. The actual cost of the jersey is paid Cash On Delivery (COD) once you receive the package.",
      cat: "Payment"
    },
    {
      q: "Is it safe to submit my bKash Transaction ID?",
      a: "Yes. The Transaction ID (TxnID) is used solely by our admin to verify that the 120 BDT delivery fee has been sent. Your details are encrypted locally and are not shared with any third party.",
      cat: "Payment"
    },
    {
      q: "What happens if my Transaction ID is rejected?",
      a: "If the transaction ID is incorrect or fails matching checks, our admin will reject the verification. Your order status on the Track Order page will show 'Rejected'. You can then contact us at support@goalwear.com or WhatsApp (+880 1848-520875) to rectify the TxnID.",
      cat: "Orders"
    },
    {
      q: "Are the jerseys authentic replicas?",
      a: "Yes, they are premium player-spec replicas featuring authentic badges, sponsor markings, and aeroready moisture absorption fabric structures matching the original club templates.",
      cat: "Product"
    },
    {
      q: "Can I customize the name and number printed on the back?",
      a: "Yes! On any product details page, toggle the 'Official Vinyl Heat-Press Customization' option to add your custom name and squad number.",
      cat: "Product"
    },
    {
      q: "Can I change my delivery address after placing an order?",
      a: "Address changes are accepted before the order state transitions to 'Shipped'. Search your Order ID on the Track Order page to monitor current shipping stages.",
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="section-title">Support <span>Hub</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px' }}>
          Frequently Asked Questions. Search keywords below to find solutions.
        </p>
      </div>

      {/* Return Policy Quick Callout Banner */}
      <div 
        onClick={() => navigate('/return-policy')}
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          backgroundColor: 'rgba(0, 255, 136, 0.04)',
          borderRadius: '12px',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 280px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            flexShrink: 0
          }}>
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
              Looking for our Return &amp; Refund Policy?
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Check full eligibility criteria, 7-day size exchange steps, and doorstep verification.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>
          <span>View Real Policy Page</span>
          <ArrowRight size={16} />
        </div>
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
