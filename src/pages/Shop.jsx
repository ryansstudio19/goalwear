import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Shop() {
  const { viewParams } = useContext(ShopContext);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('default');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync params from global navbar searches or category redirects
  useEffect(() => {
    if (viewParams) {
      if (viewParams.search) {
        setSearchTerm(viewParams.search);
      }
      if (viewParams.category) {
        setSelectedCategories([viewParams.category]);
      }
    }
  }, [viewParams]);

  // Handle category checkboxes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Handle size selections
  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Filtered and Sorted list
  const filteredProducts = products.filter(product => {
    // 1. Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(product.category);
    
    // 3. Size filter
    const matchesSize = selectedSizes.length === 0 || 
                        selectedSizes.some(s => product.sizes.includes(s));
    
    // 4. Price filter
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesSize && matchesPrice;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high-low') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // default order
  });

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title & Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <h1 className="section-title">Shop <span>Jerseys</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Showing {sortedProducts.length} premium kits match your filter criteria.
        </p>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '280px 1fr',
        gap: '30px'
      }} className="shop-layout-grid">
        
        {/* Toggle Mobile Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }} className="mobile-filter-bar">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="btn-premium btn-secondary-glass"
            style={{ flex: 1, padding: '12px 0', fontSize: '0.85rem' }}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <div style={{ position: 'relative', flex: 1 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
                appearance: 'none'
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Popularity/Rating</option>
            </select>
            <ArrowUpDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* 1. Sidebar Filters (Desktop Panel / Mobile Drawer) */}
        <aside 
          className={`glass-panel filter-sidebar ${showMobileFilters ? 'mobile-visible' : ''}`}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}
        >
          {/* Search bar inside sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, color: 'white' }}>Search Squad</h3>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, color: 'white' }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              {["National Teams", "Club Teams"].map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, color: 'white' }}>Sizes</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {["S", "M", "L", "XL", "XXL"].map(size => {
                const isActive = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border-glass)',
                      backgroundColor: isActive ? 'rgba(0, 255, 136, 0.15)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, color: 'white' }}>Max Price</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>{maxPrice} BDT</span>
            </div>
            <input 
              type="range" 
              min="3000" 
              max="5000" 
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--accent)', width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>3,000 BDT</span>
              <span>5,000 BDT</span>
            </div>
          </div>

          {/* Clear Filters CTA */}
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategories([]);
              setSelectedSizes([]);
              setMaxPrice(5000);
              setSortBy('default');
            }}
            className="btn-premium btn-accent-border"
            style={{ width: '100%', padding: '10px 0', fontSize: '0.8rem' }}
          >
            Reset Filters
          </button>
        </aside>

        {/* 2. Products Grid view area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Sorting panel (Desktop only) */}
          <div style={{ display: 'none', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }} className="desktop-sorting-panel">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
            <div style={{ position: 'relative', width: '200px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 30px 10px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default">Default Sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
              <ArrowUpDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Catalog grid */}
          {sortedProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
              <SlidersHorizontal size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px' }}>No Match Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any kits matching your select combinations. Try resetting filters or updating your search.
              </p>
            </div>
          ) : (
            <div className="jersey-grid">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Lightbox */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      {/* Media styling injections */}
      <style>{`
        .mobile-filter-bar {
          display: flex;
        }
        .filter-sidebar {
          display: none;
        }
        @media (min-width: 992px) {
          .shop-layout-grid {
            grid-template-columns: 280px 1fr !important;
          }
          .mobile-filter-bar {
            display: none !important;
          }
          .filter-sidebar {
            display: flex !important;
          }
          .desktop-sorting-panel {
            display: flex !important;
          }
        }
        /* Mobile filter drawer overlay behaviour */
        @media (max-width: 991px) {
          .filter-sidebar.mobile-visible {
            display: flex !important;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
