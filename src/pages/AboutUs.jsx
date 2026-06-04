import React from 'react';
import { Activity, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="section-title">Our <span>Story</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '10px auto 0' }}>
          GoalWear is built on a single obsession: engineering football apparel that matches the visual beauty and rigorous endurance of the beautiful game.
        </p>
      </div>

      {/* Narrative grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.1fr 1fr',
        gap: '50px',
        alignItems: 'center',
        marginBottom: '60px'
      }} className="about-grid">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', textTransform: 'uppercase', fontWeight: 900 }}>
            ENGINEERED FOR THE <span style={{ color: 'var(--accent)' }}>MATCHDAY</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Established in Dhaka, Bangladesh, GoalWear was founded by a collective of industrial apparel designers and football fanatics who were frustrated by standard generic templates. We set out to build an international sports brand that delivers elite player-fit kits.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Every crease of our fabric, every embroidery thread on our crests, and every mesh panel on our cuffs undergoes severe stress testing to withstand the full heat of a 90-minute derby.
          </p>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '320px', border: '1px solid var(--border-glass-hover)', boxShadow: 'var(--shadow-glass)' }}>
          <img 
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800" 
            alt="GoalWear factory texture detail"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Brand Values cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '28px'
      }}>
        {[
          {
            icon: <ShieldCheck size={36} color="var(--accent)" />,
            title: "Rigorous Authenticity",
            desc: "We reproduce design patterns matching the authentic national and club specifications down to millimeters."
          },
          {
            icon: <Activity size={36} color="var(--accent)" />,
            title: "Dry-Comfort Tech",
            desc: "Our custom standard doubleknit polyester channels moisture away from skin pores, encouraging heat cooling."
          },
          {
            icon: <HeartHandshake size={36} color="var(--accent)" />,
            title: "Trusted Support",
            desc: "We verify and secure order logistics manually. Pre-paid bKash fees secure slots; your kit is Cash on Delivery."
          }
        ].map((val, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>{val.icon}</div>
            <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', color: 'white' }}>{val.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{val.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 992px) {
          .about-grid {
            grid-template-columns: 1.1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
