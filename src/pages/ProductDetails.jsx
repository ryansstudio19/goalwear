import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import JerseyViewer3D from '../components/JerseyViewer3D';
import ReviewsSection from '../components/ReviewsSection';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, Star, Info, ListFilter, ClipboardCheck } from 'lucide-react';

export default function ProductDetails() {
  const { viewParams, wishlist, toggleWishlist, addToCart, setView } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  
  const productId = viewParams?.productId || products[0].id;
  const product = products.find(p => p.id === productId) || products[0];

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.sizes.length === 0;

  // Reset page states when moving to another product details page
  useEffect(() => {
    setSelectedSize('');
    setQuantity(1);
    setActiveTab('specs');
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    addToCart(product, selectedSize, quantity);
    alert(`Added ${quantity} x ${product.name} (Size: ${selectedSize}) to your cart!`);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  // Get related products (same category, excluding current product)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Dynamic Details block */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.2fr 1fr',
        gap: '50px',
        marginBottom: '60px'
      }} className="details-grid-layouts">
        
        {/* Left Column: 3D Viewport Sandbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '16px', position: 'relative', border: '1px solid var(--border-glass-hover)', backgroundColor: 'rgba(10,12,18,0.7)', boxShadow: 'var(--shadow-glass)' }}>
            <JerseyViewer3D design={product.design} />
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)'
          }}>
            <strong>Interactive 3D instructions:</strong> Hold left mouse click (or drag with single finger on mobile) and rotate the model to inspect print coordinates. Press Front or Back buttons below the canvas to snap view directions.
          </div>
        </div>

        {/* Right Column: Info, Sizes, Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header titles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' }}>
              {product.name}
            </h1>
            
            {/* Star ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#ffb400', marginTop: '4px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={14} 
                    fill={s <= Math.round(product.rating) ? '#ffb400' : 'none'} 
                    color="#ffb400"
                  />
                ))}
              </div>
              <span style={{ color: 'white', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.reviews.length} Customer Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>
              {product.price} BDT
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {product.originalPrice} BDT
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

          {/* Sizing selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'white' }}>Select Size:</span>
              <button 
                onClick={() => setView('sizeguide')}
                style={{ fontSize: '0.8rem', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
              >
                <Info size={12} />
                <span>Size Guide Calculator</span>
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border-glass)',
                    backgroundColor: selectedSize === size ? 'rgba(0, 255, 136, 0.15)' : 'transparent',
                    color: selectedSize === size ? 'var(--accent)' : 'white',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)'
                  }}
                  className="size-choice-hover"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty Selector & Wishlist */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
            
            {/* Quantity */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              height: '48px'
            }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0 16px', height: '100%', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                className="qty-btn"
              >
                -
              </button>
              <span style={{ width: '30px', textAlignment: 'center', fontWeight: 700, fontSize: '1rem', display: 'inline-block', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0 16px', height: '100%', fontSize: '1rem', color: 'var(--text-secondary)' }}
                className="qty-btn"
              >
                +
              </button>
            </div>

            {/* Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="btn-premium btn-primary-glow"
              style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>

            {/* Wishlist Icon */}
            <button 
              onClick={handleWishlistToggle}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isWishlisted ? 'var(--accent)' : 'white',
                transition: 'var(--transition-smooth)'
              }}
              className="details-wishlist-hover"
            >
              <Heart size={20} fill={isWishlisted ? 'var(--accent)' : 'none'} />
            </button>
          </div>

          {/* bKash Alert Notice */}
          <div style={{
            backgroundColor: 'rgba(0, 255, 136, 0.02)',
            border: '1px dashed var(--accent)',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)'
          }}>
            <strong>Direct Payment Heuristics:</strong> GoalWear operates via Cash On Delivery. To protect shipment logistics against false orders, the delivery charge of <strong>150 BDT</strong> must be pre-paid via bKash. You will enter the TxnID during the billing process.
          </div>

        </div>
      </div>

      {/* Tabs System: Specifications vs Reviews */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('specs')}
            style={{
              padding: '12px 24px',
              fontFamily: 'var(--font-headings)',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              borderBottom: '2px solid',
              borderColor: activeTab === 'specs' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'specs' ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)'
            }}
          >
            Specifications
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '12px 24px',
              fontFamily: 'var(--font-headings)',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              borderBottom: '2px solid',
              borderColor: activeTab === 'reviews' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'reviews' ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)'
            }}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Tab content rendering */}
        <div style={{ animation: 'fade-in 0.2s ease' }}>
          {activeTab === 'specs' ? (
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 800 }}>{key}</span>
                    <span style={{ fontSize: '0.95rem', color: 'white' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ReviewsSection product={product} />
          )}
        </div>
      </section>

      {/* Related jerseys section */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title" style={{ marginBottom: '30px' }}>Related <span>Jerseys</span></h2>
          <div className="jersey-grid">
            {related.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onQuickView={(prod) => setView('product-details', { productId: prod.id })} 
              />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (min-width: 992px) {
          .details-grid-layouts {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
        .size-choice-hover:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .qty-btn:hover {
          color: var(--accent);
          background-color: rgba(255,255,255,0.02);
        }
        .details-wishlist-hover:hover {
          border-color: var(--accent);
          background-color: rgba(0, 255, 136, 0.05);
        }
      `}</style>
    </div>
  );
}
