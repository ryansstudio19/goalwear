import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Globe } from 'lucide-react';

export default function NationalTeams() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const nationalKits = products.filter(p => p.category === "National Teams");

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '40px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,255,136,0.05)), url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', marginBottom: '10px' }}>
          <Globe size={20} style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>World Stage Kits</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
          National <span style={{ color: 'var(--accent)' }}>Teams</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Wear your colors with absolute pride. Shop authentic national kits featuring premium fabric weaves and honoring the historic triumphs of global football giants.
        </p>
      </div>

      {/* Grid */}
      {nationalKits.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No national teams kits available at this time.</p>
      ) : (
        <div className="jersey-grid">
          {nationalKits.map(product => (
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
