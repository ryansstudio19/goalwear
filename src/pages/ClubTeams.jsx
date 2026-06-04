import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Shield } from 'lucide-react';

export default function ClubTeams() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const clubKits = products.filter(p => p.category === "Club Teams");

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '40px',
          marginBottom: '40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,255,136,0.05)), url("https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent)', marginBottom: '10px' }}>
          <Shield size={20} style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Elite Club Leagues</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>
          Club <span style={{ color: 'var(--accent)' }}>Jerseys</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Support your club side at the highest level. From Spanish La Liga giants to English Premier League title contenders, explore the official colors and sponsor crests.
        </p>
      </div>

      {/* Grid */}
      {clubKits.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No club jerseys available at this time.</p>
      ) : (
        <div className="jersey-grid">
          {clubKits.map(product => (
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
