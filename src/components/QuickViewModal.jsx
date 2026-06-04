import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, ShoppingBag, Info } from 'lucide-react';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fade-in 0.2s ease'
    }}>
      <div 
        className="glass-panel modal-content-grid"
        style={{
          width: '100%',
          maxWidth: '850px',
          backgroundColor: '#0c0e15',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          position: 'relative',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          mdTemplateColumns: '1fr 1.2fr',
          gap: '24px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 10,
            transition: 'var(--transition-fast)'
          }}
          className="close-hover"
        >
          <X size={20} />
        </button>

        {/* Left Column: Image */}
        <div style={{
          borderRadius: '8px',
          backgroundColor: 'var(--bg-tertiary)',
          overflow: 'hidden',
          height: '100%',
          minHeight: '280px',
          maxHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Right Column: Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px', lineHeight: 1.2 }}>
              {product.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
              {product.price} BDT
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {product.originalPrice} BDT
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Size Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Select Size:</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Info size={12} />
                <span>Size Chart</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border-glass)',
                    backgroundColor: selectedSize === size ? 'rgba(0, 255, 136, 0.15)' : 'transparent',
                    color: selectedSize === size ? 'var(--accent)' : 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'var(--transition-fast)'
                  }}
                  className="size-option"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout Info Box */}
          <div style={{
            backgroundColor: 'rgba(0, 255, 136, 0.03)',
            border: '1px dashed var(--accent)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <strong>Matchday Prepay Notice:</strong> Delivery charge of 150 BDT must be paid first via bKash. Jersey payment is Cash On Delivery (COD).
          </div>

          {/* Add to Cart CTA */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="btn-premium btn-primary-glow"
              style={{
                width: '100%',
                padding: '14px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <ShoppingBag size={18} />
              <span>{added ? 'ADDED TO SQUAD!' : 'ADD TO CART'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .modal-content-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
        .close-hover:hover {
          background-color: var(--accent) !important;
          color: black !important;
          box-shadow: 0 0 10px var(--accent);
          border-color: var(--accent) !important;
        }
        .size-option:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
