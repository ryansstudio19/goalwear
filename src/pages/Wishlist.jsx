import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Heart, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, toggleWishlist, setView } = useContext(ShopContext);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Map product IDs to product objects
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px' }}>
        <h1 className="section-title">My <span>Wishlist</span></h1>
        
        {wishlistedProducts.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your wishlist?")) {
                wishlist.forEach(id => toggleWishlist(id));
              }
            }}
            style={{
              color: '#ff3366',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="clear-wishlist-hover"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <Heart size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px' }}>Wishlist is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            You haven't favorited any jerseys yet. Explore the sandbox view of our new season kits and bookmark your favorites.
          </p>
          <button onClick={() => setView('shop')} className="btn-premium btn-primary-glow" style={{ padding: '12px 28px' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="jersey-grid">
          {wishlistedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={(p) => setQuickViewProduct(p)} 
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      <style>{`
        .clear-wishlist-hover:hover {
          text-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
