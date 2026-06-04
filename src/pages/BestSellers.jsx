import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Flame } from 'lucide-react';

export default function BestSellers() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const bestKits = products.filter(p => p.isBestSeller);

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '40px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,255,136,0.05)), url("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', marginBottom: '10px' }}>
          <Flame size={20} style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Most Wanted Kits</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
          Best <span style={{ color: 'var(--accent)' }}>Sellers</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Explore our highest rated and most requested jerseys. These high-demand squad shirts represent the peak of club and international support.
        </p>
      </div>

      {/* Grid */}
      {bestKits.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No best selling kits available at this time.</p>
      ) : (
        <div className="jersey-grid">
          {bestKits.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      )}

      {/* Quick View Overlay */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}
