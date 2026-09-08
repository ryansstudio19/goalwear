import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import Stadium3DHero from '../components/Stadium3DHero';
import TiltGrowJerseyImage from '../components/TiltGrowJerseyImage';
import { Shield, Sparkles, Truck, RefreshCw, ChevronRight, HelpCircle, CheckCircle2, Award } from 'lucide-react';

export default function Home() {
  const { setView, products: catalogProducts } = useContext(ShopContext);
  const allProducts = (catalogProducts && catalogProducts.length > 0) ? catalogProducts : products;
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter products
  const featuredJersey = allProducts[0]; // Argentina
  const newArrivals = allProducts.filter(p => p.isNew).slice(0, 4);
  const bestSellers = allProducts.filter(p => p.isBestSeller).slice(0, 4);

  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: "Is the pre-paid bKash delivery fee refundable?", a: "No, the 120 BDT delivery charge is paid first to secure your dispatch slot and confirm your COD package details. It is non-refundable once the shipping label is generated." },
    { q: "How long does shipping take?", a: "Shipping takes 24-48 hours within Dhaka and 3-4 days nationwide across Bangladesh. Once confirmed, you can track order milestones on our Track Order page." },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* Immersive 3D Kickoff Stadium Hero */}
      <Stadium3DHero
        featuredProduct={featuredJersey}
        onSelectProduct={(pId) => setView('product-details', { productId: pId })}
      />

      {/* Trust Badges Bar */}
      <section className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: <Shield size={32} color="var(--accent)" />, title: "Premium Fabric", desc: "100% breathable jacquard weave" },
            { icon: <Truck size={32} color="var(--accent)" />, title: "Fast Shipping", desc: "COD across BD, 120 BDT advance" },
            { icon: <RefreshCw size={32} color="var(--accent)" />, title: "7-Day Exchange", desc: "Hassle-free size replacement" },
            { icon: <Award size={32} color="var(--accent)" />, title: "Authentic Badges", desc: "Heat-applied official federation crests" }
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
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,255,136,0.03)), url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800")',
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

      {/* Craftsmanship & Operational Guarantee Spotlight */}
      <section className="container-custom">
        <div 
          className="glass-panel"
          style={{
            padding: '50px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            lgTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(15,16,22,0.95), rgba(0,255,136,0.04))',
            border: '1px solid var(--border-glass-hover)',
            borderRadius: '20px'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Shield size={16} />
              <span>Standard of Excellence</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 16px 0', lineHeight: 1.1 }}>
              AUTHENTIC MATCH-GRADE <span style={{ color: 'var(--accent)' }}>CRAFTSMANSHIP</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 24px 0', fontSize: '0.95rem' }}>
              Every jersey in the GoalWear catalog is tailored to official player standards. We partner directly with certified jersey manufacturers to guarantee thermo-bonded silicone federation crests, laser-cut ventilation zones, and micro-jacquard weaves that hold up both on the pitch and in the stands.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                "100% Breathable Aeroready Micro-mesh",
                "Official Heat-Applied Crest & Sponsor Fonts",
                "bKash Verified Advance Delivery Protection",
                "24-48 Hour Dhaka Express Dispatch"
              ].map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              onClick={() => setView('product-details', { productId: products[3].id })}
              style={{ width: '100%', maxWidth: '420px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid var(--border-glass)', cursor: 'pointer' }}
            >
              <div style={{ width: '100%', height: '320px' }}>
                <TiltGrowJerseyImage 
                  src={products[3].image} 
                  alt={products[3].name} 
                  maxTilt={8}
                  growScale={1.05}
                  glowColor="rgba(0, 255, 136, 0.3)"
                  style={{ borderRadius: '10px', height: '320px' }}
                  imgStyle={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>{products[3].name}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)' }}>৳{products[3].price}</span>
              </div>
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
