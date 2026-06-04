import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Sparkles } from 'lucide-react';

export default function NewArrivals() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const newKits = products.filter(p => p.isNew);

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '40px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,255,136,0.05)), url("https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', marginBottom: '10px' }}>
          <Sparkles size={20} style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>New Season Dropped</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
          New <span style={{ color: 'var(--accent)' }}>Arrivals</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Inspect the freshest drops of the 2024/25 football season. Gear up in brand new designs constructed with high-performance cooling fabrics.
        </p>
      </div>

      {/* Grid */}
      {newKits.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No new arrivals kits available at this time.</p>
      ) : (
        <div className="jersey-grid">
          {newKits.map(product => (
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
