import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import JerseyViewer3D from '../components/JerseyViewer3D';
import { Shield, Sparkles, Truck, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';

export default function Home() {
  const { setView } = useContext(ShopContext);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter products
  const featuredJersey = products[0]; // Argentina
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: "Is the pre-paid bKash delivery fee refundable?", a: "No, the 120 BDT delivery charge is paid first to secure your dispatch slot and confirm your COD package details. It is non-refundable once the shipping label is generated." },
    { q: "How long does shipping take?", a: "Shipping takes 24-48 hours within Dhaka and 3-4 days nationwide across Bangladesh. Once confirmed, you can track order milestones on our Track Order page." },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 0 60px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-glass)',
        background: 'radial-gradient(circle at 50% 30%, rgba(0, 255, 136, 0.05), transparent 60%)'
      }}>
        {/* Animated Grid lines in background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          pointerEvents: 'none'
        }} />

        <div className="container-custom hero-grid-layouts" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          lgTemplateColumns: '1.2fr 1fr',
          gap: '50px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 5
        }}>
          
          {/* Hero Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--accent)', padding: '6px 12px', borderRadius: '30px', width: 'fit-content' }}>
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em' }}>New 24/25 Season Kits Dropped</span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}>
              WEAR THE <br />
              <span style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--accent-glow)' }}>PASSION.</span> <br />
              RULE THE PITCH.
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '540px'
            }}>
              Custom crafted, ultra-premium football jerseys engineered for elite athletes and die-hard supporters. Rotate, zoom, and inspect our threads in 3D sandbox mode before ordering.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button onClick={() => setView('shop')} className="btn-premium btn-primary-glow" style={{ padding: '16px 36px' }}>
                Explore Shop
              </button>
              <button onClick={() => setView('sizeguide')} className="btn-premium btn-secondary-glass" style={{ padding: '16px 36px' }}>
                Sizing Guide
              </button>
            </div>
          </div>

          {/* Hero Right: Floating Interactive 3D Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div 
              className="glass-panel animate-float"
              style={{
                width: '100%',
                maxWidth: '440px',
                border: '1px solid var(--border-glass)',
                borderRadius: '24px',
                padding: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(10, 12, 18, 0.7)'
              }}
            >
              <JerseyViewer3D design={featuredJersey.design} />
              
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{featuredJersey.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>3D Sandbox Viewer</p>
                </div>
                <button 
                  onClick={() => setView('product-details', { productId: featuredJersey.id })}
                  className="btn-premium btn-primary-glow" 
                  style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.75rem' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: <Shield size={32} color="var(--accent)" />, title: "Premium Fabric", desc: "100% breathable jacquard weave" },
            { icon: <Truck size={32} color="var(--accent)" />, title: "Fast Shipping", desc: "COD across BD, 150 BDT prepay" },
            { icon: <RefreshCw size={32} color="var(--accent)" />, title: "7-Day Exchange", desc: "Hassle-free size replacement" },
            { icon: <Sparkles size={32} color="var(--accent)" />, title: "3D Sandbox View", desc: "Inspect detailed mesh textures" }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{item.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Dual Banners */}
      <section className="container-custom" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <h2 className="section-title">Shop by <span>Squad</span></h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          mdTemplateColumns: '1fr 1fr',
          gap: '28px'
        }} className="category-banners-grid">
          
          {/* National Teams */}
          <div 
            onClick={() => setView('national')}
            className="glass-panel glass-panel-hover category-card-hover"
            style={{
              padding: '40px',
              height: '320px',
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,255,136,0.03)), url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              transition: 'var(--transition-bounce)'
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>World Domination</span>
            <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', fontWeight: 900, marginBottom: '16px' }}>National Kits</h3>
            <button className="btn-premium btn-accent-border" style={{ width: 'fit-content', padding: '10px 20px', fontSize: '0.8rem' }}>
              View National Teams <ChevronRight size={14} />
            </button>
          </div>

          {/* Club Teams */}
          <div 
            onClick={() => setView('club')}
            className="glass-panel glass-panel-hover category-card-hover"
            style={{
              padding: '40px',
              height: '320px',
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,255,136,0.03)), url("https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              transition: 'var(--transition-bounce)'
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Elite Club Leagues</span>
            <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', fontWeight: 900, marginBottom: '16px' }}>Club Jerseys</h3>
            <button className="btn-premium btn-accent-border" style={{ width: 'fit-content', padding: '10px 20px', fontSize: '0.8rem' }}>
              View Club Teams <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container-custom">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '30px' }}>
          <h2 className="section-title">New <span>Arrivals</span></h2>
          <button onClick={() => setView('new-arrivals')} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>See All</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="jersey-grid">
          {newArrivals.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      </section>

      {/* Dynamic 3D Interaction Teaser Board */}
      <section className="container-custom">
        <div 
          className="glass-panel sandbox-teaser-grid"
          style={{
            padding: '50px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            lgTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(15,16,22,0.9), rgba(0,255,136,0.03))',
            border: '1px solid var(--border-glass-hover)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>
              PRO-LEVEL <span style={{ color: 'var(--accent)' }}>3D VIEWPORT</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
              Take full control of the jersey showcase sandbox. Zoom right in to examine the collar embroidery, rotate a full 360-degrees, and swap between front and back views to inspect heat-applied squad numbers. Try the simulation controls directly on our product detail interface.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                "Drag to rotate jersey on any axis",
                "Scroll or click +/- to zoom",
                "Verify front/back print coordinates"
              ].map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              {/* Load a Manchester City jersey in demo */}
              <JerseyViewer3D design={products[3].design} />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container-custom">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '30px' }}>
          <h2 className="section-title">Best <span>Sellers</span></h2>
          <button onClick={() => setView('best-sellers')} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>See All</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="jersey-grid">
          {bestSellers.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      </section>

      {/* FAQs Section Preview */}
      <section className="container-custom" style={{ maxWidth: '800px' }}>
        <h2 className="section-title" style={{ display: 'block', textAlign: 'center', margin: '0 auto 40px' }}>
          Matchday <span>Q&A</span>
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel"
              style={{ 
                padding: '18px 24px', 
                cursor: 'pointer',
                border: activeFaq === idx ? '1px solid var(--accent)' : '1px solid var(--border-glass)'
              }}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, color: 'white' }}>
                  <HelpCircle size={18} color={activeFaq === idx ? 'var(--accent)' : 'var(--text-muted)'} />
                  <span>{faq.q}</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>
                  {activeFaq === idx ? '-' : '+'}
                </span>
              </div>
              
              {activeFaq === idx && (
                <p style={{ marginTop: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Overlay Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      {/* Style overrides for Home layout elements */}
      <style>{`
        @media (min-width: 992px) {
          .hero-grid-layouts {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .sandbox-teaser-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (min-width: 768px) {
          .category-banners-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .category-card-hover:hover {
          transform: scale(1.02);
          border-color: var(--accent) !important;
          box-shadow: 0 0 20px var(--accent-glow), var(--shadow-glass) !important;
        }
      `}</style>
    </div>
  );
}
