import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, ShoppingBag, Plus, Minus, Info } from 'lucide-react';

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, getCartTotal, setView } = useContext(ShopContext);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const subtotal = getCartTotal();
  const shippingCharge = 150; // standard bKash delivery fee in BDT
  const totalCost = subtotal + shippingCharge;

  const handleCheckoutClick = () => {
    if (!agreementChecked) {
      alert("Please confirm that you agree to pay the delivery charge first via bKash.");
      return;
    }
    setView('checkout');
  };

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Shopping <span>Cart</span></h1>
      </div>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <ShoppingBag size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            No shirts in your squad bag. Visit the catalog to customize your size and explore kits in 3D sandbox.
          </p>
          <button onClick={() => setView('shop')} className="btn-premium btn-primary-glow" style={{ padding: '12px 28px' }}>
            Browse Jerseys
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          lgTemplateColumns: '1.8fr 1fr',
          gap: '30px'
        }} className="cart-layout-grid">
          
          {/* 1. Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${item.size}`} 
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Product details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 250px' }}>
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {item.product.category}
                    </span>
                    <h3 style={{ fontSize: '1rem', color: 'white', marginTop: '2px' }}>{item.product.name}</h3>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginTop: '6px'
                    }}>
                      SIZE: {item.size}
                    </span>
                  </div>
                </div>

                {/* Qty Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}>
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.size, item.quantity - 1)}
                      style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
                      className="qty-btn"
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ width: '24px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.size, item.quantity + 1)}
                      style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
                      className="qty-btn"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    style={{ color: 'var(--text-muted)', transition: 'var(--transition-fast)' }}
                    className="trash-hover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Price Display */}
                <div style={{ minWidth: '100px', textAlign: 'right' }} className="item-price-align">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                    {item.product.price} BDT each
                  </span>
                  <strong style={{ fontSize: '1.15rem', color: 'white' }}>
                    {item.product.price * item.quantity} BDT
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Order Summary Sidebar */}
          <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cart.length} items):</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{subtotal} BDT</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge (Prepaid via bKash):</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>+ {shippingCharge} BDT</span>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8rem',
                lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', gap: '8px', color: 'white', fontWeight: 700, marginBottom: '4px' }}>
                  <Info size={14} color="var(--accent)" style={{ shrink: 0, marginTop: '2px' }} />
                  <span>bKash Payment Required</span>
                </div>
                <span>To prevent fake orders, you must pay the delivery charge of <strong>150 BDT</strong> via bKash immediately to process shipment. The jersey cost is Cash on Delivery (COD).</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>
                <span>Grand Total:</span>
                <span>{totalCost} BDT</span>
              </div>

              {/* Agreement checkbox */}
              <label style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer', marginTop: '2px', shrink: 0 }}
                />
                <span>I understand that the 150 BDT delivery fee must be paid first via bKash, and I will submit the Transaction ID during checkout.</span>
              </label>

              {/* Checkout Trigger */}
              <button 
                onClick={handleCheckoutClick}
                className={`btn-premium ${agreementChecked ? 'btn-primary-glow' : 'btn-secondary-glass'}`}
                style={{ width: '100%', padding: '14px 0', marginTop: '10px', opacity: agreementChecked ? 1 : 0.6 }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .cart-layout-grid {
            grid-template-columns: 1.8fr 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .item-price-align {
            text-align: left !important;
            width: 100%;
          }
        }
        .qty-btn:hover {
          color: var(--accent) !important;
          background-color: rgba(255, 255, 255, 0.03);
        }
        .trash-hover:hover {
          color: #ff3366 !important;
        }
      `}</style>
    </div>
  );
}
