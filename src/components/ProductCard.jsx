import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import TiltGrowJerseyImage from './TiltGrowJerseyImage';

export default function ProductCard({ product, onQuickView }) {
  const { wishlist, toggleWishlist, addToCart, setView } = useContext(ShopContext);
  
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const isOutOfStock = product.inStock === false || product.stockStatus === 'out_of_stock' || product.stockCount === 0;
  const isLowStock = !isOutOfStock && (product.stockStatus === 'low_stock' || (product.stockCount > 0 && product.stockCount <= 5));

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
        {isOutOfStock ? (
          <span style={{
            background: '#e53e3e',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: '0 0 10px rgba(229, 62, 62, 0.4)'
          }}>
            Sold Out
          </span>
        ) : isLowStock ? (
          <span style={{
            background: '#dd6b20',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: '0 0 10px rgba(221, 107, 32, 0.4)'
          }}>
            Low Stock
          </span>
        ) : null}
        {product.isNew && !isOutOfStock && (
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

      {/* Product Image Area with Subtle 3D Tilt & Grow */}
      <div style={{ width: '100%', height: '240px', position: 'relative' }}>
        <TiltGrowJerseyImage
          src={product.image}
          alt={product.name}
          maxTilt={9}
          growScale={1.06}
          glowColor={product.design?.primaryColor ? `${product.design.primaryColor}55` : 'rgba(0, 255, 136, 0.35)'}
          style={{
            borderRadius: '10px',
            backgroundColor: 'var(--bg-tertiary)',
            height: '240px',
          }}
          imgStyle={{
            objectFit: 'cover',
          }}
        >
          {/* Quick actions overlay on hover */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.88), transparent)',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              zIndex: 10,
            }}
            className="quick-actions"
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="btn-premium btn-secondary-glass" 
              style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '0.75rem', backdropFilter: 'blur(8px)' }}
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </TiltGrowJerseyImage>
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

      {/* Product Details CTA */}
      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={handleCardClick}
          className="btn-premium btn-accent-border"
          style={{ width: '100%', padding: '10px 0', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Eye size={14} />
          <span>View Kit Details</span>
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
