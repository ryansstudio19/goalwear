import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

export default function ProductCard({ product, onQuickView }) {
  const { wishlist, toggleWishlist, addToCart, setView } = useContext(ShopContext);
  
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    setView('product-details', { productId: product.id });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="glass-panel glass-panel-hover card-anim"
      style={{
        padding: '16px',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'var(--transition-bounce)',
        height: '100%'
      }}
    >
      {/* Badges Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 5
      }}>
        {product.isNew && (
          <span style={{
            background: 'var(--accent)',
            color: '#000000',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: '0 0 10px var(--accent-glow)'
          }}>
            New
          </span>
        )}
        {product.isBestSeller && (
          <span style={{
            background: '#ff3366',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: '0 0 10px rgba(255, 51, 102, 0.4)'
          }}>
            Hot
          </span>
        )}
        {discountPercent > 0 && (
          <span style={{
            background: '#ffc107',
            color: '#000000',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 5,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
          border: '1px solid var(--border-glass)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isWishlisted ? 'var(--accent)' : 'white',
          transition: 'var(--transition-smooth)'
        }}
        className="wishlist-btn-hover"
      >
        <Heart size={18} fill={isWishlisted ? 'var(--accent)' : 'none'} />
      </button>

      {/* Product Image Area */}
      <div style={{
        borderRadius: '8px',
        backgroundColor: 'var(--bg-tertiary)',
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        position: 'relative'
      }} className="image-container">
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="product-img"
        />
        
        {/* Quick actions overlay on hover */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }} className="quick-actions">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="btn-premium btn-secondary-glass" 
            style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem' }}
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category}
        </span>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, minHeight: '44px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </h3>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#ffb400' }}>
          <Star size={12} fill="#ffb400" />
          <span style={{ fontWeight: 600, color: 'white' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviews.length})</span>
        </div>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>
            {product.price} BDT
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {product.originalPrice} BDT
            </span>
          )}
        </div>
      </div>

      {/* Sandbox CTA */}
      <div style={{ marginTop: 'auto' }}>
        <button 
          className="btn-premium btn-accent-border"
          style={{ width: '100%', padding: '10px 0', fontSize: '0.8rem' }}
        >
          View 3D Sandbox
        </button>
      </div>

      <style>{`
        .card-anim:hover {
          transform: translateY(-8px);
          border-color: var(--border-glass-hover);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.05), var(--shadow-glass);
        }
        .card-anim:hover .product-img {
          transform: scale(1.08);
        }
        .card-anim:hover .quick-actions {
          opacity: 1 !important;
        }
        .wishlist-btn-hover:hover {
          background-color: var(--accent) !important;
          color: black !important;
          box-shadow: 0 0 12px var(--accent);
        }
      `}</style>
    </div>
  );
}
