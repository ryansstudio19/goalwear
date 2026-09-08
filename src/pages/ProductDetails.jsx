import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ReviewsSection from '../components/ReviewsSection';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, Star, Info, ListFilter, ClipboardCheck, ArrowLeft, Check, ZoomIn, Image as ImageIcon, Sparkles, User, Hash, ShieldCheck, Flame, RotateCcw, Truck } from 'lucide-react';

export default function ProductDetails() {
  const { viewParams, wishlist, toggleWishlist, addToCart, setView, products: catalogProducts } = useContext(ShopContext);
  const { productId: routeProductId } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Customization & colorway states
  const [activeColorway, setActiveColorway] = useState('home'); // 'home' | 'away' | 'third'
  const [hasCustomization, setHasCustomization] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  
  const allProducts = (catalogProducts && catalogProducts.length > 0) ? catalogProducts : products;
  const productId = routeProductId || viewParams?.productId || allProducts[0].id;
  const product = allProducts.find(p => p.id === productId) || allProducts[0];

  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
  ];

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.inStock === false || product.stockStatus === 'out_of_stock' || product.stockCount === 0 || !product.sizes || product.sizes.length === 0;
  const isLowStock = !isOutOfStock && (product.stockStatus === 'low_stock' || (product.stockCount > 0 && product.stockCount <= 5));

  // Reset page states when moving to another product details page
  useEffect(() => {
    setSelectedSize('');
    setQuantity(1);
    setActiveTab('specs');
    setAddedSuccess(false);
    setActiveImageIndex(0);
    setActiveColorway('home');
    setHasCustomization(false);
    setCustomName('');
    setCustomNumber('');
  }, [productId]);

  // Star player suggestions based on club/country
  const getPlayerPresets = () => {
    const nameLower = (product.name || '').toLowerCase();
    if (nameLower.includes('argentina')) return [{ n: 'MESSI', num: '10' }, { n: 'DI MARIA', num: '11' }, { n: 'ALVAREZ', num: '9' }];
    if (nameLower.includes('madrid')) return [{ n: 'BELLINGHAM', num: '5' }, { n: 'VINICIUS JR', num: '7' }, { n: 'MBAPPÉ', num: '9' }];
    if (nameLower.includes('barcelona')) return [{ n: 'LAMINE YAMAL', num: '19' }, { n: 'PEDRI', num: '8' }, { n: 'LEWANDOWSKI', num: '9' }];
    if (nameLower.includes('brazil')) return [{ n: 'VINICIUS JR', num: '7' }, { n: 'RODRYGO', num: '10' }, { n: 'NEYMAR JR', num: '10' }];
    if (nameLower.includes('portugal')) return [{ n: 'RONALDO', num: '7' }, { n: 'B. FERNANDES', num: '8' }, { n: 'LEÃO', num: '17' }];
    if (nameLower.includes('arsenal')) return [{ n: 'SAKA', num: '7' }, { n: 'ØDEGAARD', num: '8' }, { n: 'RICE', num: '41' }];
    if (nameLower.includes('city')) return [{ n: 'HAALAND', num: '9' }, { n: 'DE BRUYNE', num: '17' }, { n: 'FODEN', num: '47' }];
    if (nameLower.includes('united')) return [{ n: 'GARNACHO', num: '17' }, { n: 'BRUNO F.', num: '8' }, { n: 'MAINOO', num: '37' }];
    return [{ n: 'CAPTAIN', num: '10' }, { n: 'STRIKER', num: '9' }, { n: 'LEGEND', num: '7' }];
  };

  const buildCustomizationData = () => {
    if (hasCustomization && (customName.trim() || customNumber.trim())) {
      return {
        colorway: activeColorway,
        customName: customName.trim().toUpperCase(),
        customNumber: customNumber.trim() || '10'
      };
    }
    return { colorway: activeColorway };
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first (S, M, L, XL, XXL)!");
      return;
    }
    addToCart(product, selectedSize, quantity, buildCustomizationData());
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size first (S, M, L, XL, XXL)!");
      return;
    }
    addToCart(product, selectedSize, quantity, buildCustomizationData());
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  // Get related products (same category, excluding current product)
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container-custom" style={{ paddingTop: '30px', paddingBottom: '80px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Home</button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Shop</button>
        <span>/</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Added to Cart Success Toast */}
      {addedSuccess && (
        <div style={{
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid var(--accent)',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'fade-in 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={18} color="var(--accent)" />
            <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
              Added <strong>{quantity} x {product.name} (Size: {selectedSize})</strong> to your bag!
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/cart')}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              View Cart
            </button>
            <button
              onClick={() => navigate('/checkout')}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Details block */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.2fr 1fr',
        gap: '50px',
        marginBottom: '60px'
      }} className="details-grid-layouts">
        
        {/* Left Column: High-Resolution Studio Photography Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Gallery Header Badge Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '10px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={16} color="var(--accent, #00ff88)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ffffff' }}>
                Studio Matchday Photography
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent, #00ff88)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--accent, #00ff88)', fontWeight: 800, textTransform: 'uppercase' }}>
                4K Ultra-Res
              </span>
            </div>
          </div>

          {/* Main Photo Card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '14px', 
              position: 'relative', 
              border: '1px solid var(--border-glass-hover)', 
              backgroundColor: 'rgba(10,12,18,0.7)', 
              boxShadow: 'var(--shadow-glass)',
              borderRadius: '14px',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '480px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={galleryImages[activeImageIndex] || product.image} 
                alt={`${product.name} View ${activeImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.35s ease',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))',
                }}
              />
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ZoomIn size={14} />
                <span>Image {activeImageIndex + 1} of {galleryImages.length}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: activeImageIndex === idx ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    padding: 0,
                    opacity: activeImageIndex === idx ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            padding: '14px 18px',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓ Official Match Issue:</span>
            <span>Laser-cut micro-ventilation, silicone crest badge, and thermal heat-bonded squad lettering.</span>
          </div>
        </div>

        {/* Right Column: Info, Sizes, Customization & Actions */}
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

          {/* Pricing & Stock Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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

            {/* Live Stock Badge */}
            <div>
              {isOutOfStock ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  Sold Out / Out of Stock
                </span>
              ) : isLowStock ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#f59e0b',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  Low Stock • Only Few Left
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  In Stock • Dispatching 24h
                </span>
              )}
            </div>
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
                onClick={() => navigate('/size-guide')}
                style={{ fontSize: '0.8rem', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', background: 'none', border: 'none' }}
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

          {/* Official Vinyl Heat-Press Customization Panel */}
          <div style={{
            backgroundColor: hasCustomization ? 'rgba(0, 255, 136, 0.04)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${hasCustomization ? 'var(--accent)' : 'var(--border-glass)'}`,
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'white', letterSpacing: '0.04em' }}>
                  Official Vinyl Heat-Press
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(0, 255, 136, 0.15)',
                  color: 'var(--accent)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  border: '1px solid rgba(0, 255, 136, 0.3)'
                }}>
                  FREE 24/25 SPECIAL
                </span>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={hasCustomization}
                  onChange={(e) => {
                    setHasCustomization(e.target.checked);
                    if (e.target.checked && !customName && !customNumber) {
                      const firstPreset = getPlayerPresets()[0];
                      if (firstPreset) {
                        setCustomName(firstPreset.n);
                        setCustomNumber(firstPreset.num);
                      }
                    }
                  }}
                  style={{ accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 700, color: hasCustomization ? 'var(--accent)' : 'inherit' }}>
                  {hasCustomization ? 'Custom Print Active' : 'Add Custom Name & #' }
                </span>
              </label>
            </div>

            {hasCustomization && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Enter your name or select a star player. Updates live in 3D Arena view above!
                </p>

                {/* Quick Player Presets */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Presets:</span>
                  {getPlayerPresets().map((preset) => (
                    <button
                      key={preset.n}
                      type="button"
                      onClick={() => {
                        setCustomName(preset.n);
                        setCustomNumber(preset.num);
                      }}
                      style={{
                        backgroundColor: customName === preset.n && customNumber === preset.num ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${customName === preset.n && customNumber === preset.num ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: customName === preset.n && customNumber === preset.num ? 'var(--accent)' : 'white',
                        borderRadius: '16px',
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset.n} #{preset.num}
                    </button>
                  ))}
                </div>

                {/* Custom Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Player Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={customName}
                        maxLength={14}
                        placeholder="e.g. MESSI"
                        onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '6px',
                          padding: '8px 12px 8px 30px',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      />
                      <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Squad #
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={customNumber}
                        maxLength={2}
                        placeholder="10"
                        onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '6px',
                          padding: '8px 12px 8px 28px',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          textAlign: 'center'
                        }}
                      />
                      <Hash size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                </div>

                {/* Kit Edition selector (Home / Away / Third) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Edition:</span>
                  {(['home', 'away', 'third']).map((edition) => (
                    <button
                      key={edition}
                      type="button"
                      onClick={() => setActiveColorway(edition)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: activeColorway === edition ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: activeColorway === edition ? 'rgba(0, 255, 136, 0.15)' : 'transparent',
                        color: activeColorway === edition ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      {edition} Kit
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              disabled={isOutOfStock}
              className={`btn-premium ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'btn-primary-glow'}`}
              style={{
                flex: '1 1 180px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: isOutOfStock ? 'rgba(255,255,255,0.05)' : undefined,
                color: isOutOfStock ? 'var(--text-muted)' : undefined,
                borderColor: isOutOfStock ? 'rgba(255,255,255,0.1)' : undefined
              }}
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? 'CURRENTLY OUT OF STOCK' : 'Add to Cart'}</span>
            </button>

            {/* Buy Now Button */}
            {!isOutOfStock && (
              <button 
                onClick={handleBuyNow}
                style={{
                  flex: '1 1 140px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}
              >
                <span>Buy Now</span>
              </button>
            )}

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
            <strong>Direct Payment Heuristics:</strong> GoalWear operates via Cash On Delivery. To protect shipment logistics against false orders, the delivery charge of <strong>120 BDT</strong> must be pre-paid via bKash. You will enter the TxnID during the billing process.
          </div>

          {/* Trust Guarantees & Policy Links */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            marginTop: '14px'
          }}>
            <button
              onClick={() => navigate('/return-policy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 255, 136, 0.04)',
                border: '1px solid rgba(0, 255, 136, 0.25)',
                color: 'var(--accent)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              title="Read our 7-day return and exchange policy"
            >
              <RotateCcw size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span>7-Day Return / Exchange Policy →</span>
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <ShieldCheck size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span>100% Authentic Badges</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <Truck size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span>Open Parcel Verification</span>
            </div>
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
