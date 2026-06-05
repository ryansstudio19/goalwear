import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Search, Package, CheckCircle2, Truck, Check, AlertTriangle } from 'lucide-react';

export default function TrackOrder() {
  const { orders, viewParams } = useContext(ShopContext);
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync param redirect from Order Confirmation page
  useEffect(() => {
    if (viewParams && viewParams.orderId) {
      setOrderId(viewParams.orderId);
      const match = orders.find(o => o.id === viewParams.orderId);
      if (match) {
        setSearchedOrder(match);
        setHasSearched(true);
      }
    }
  }, [viewParams, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const match = orders.find(o => o.id.trim().toUpperCase() === orderId.trim().toUpperCase());
    if (match) {
      setSearchedOrder(match);
    } else {
      setSearchedOrder(null);
    }
  };

  // Determine stage indexes
  // 1: Placed, 2: Paid/Verified, 3: Processing, 4: Shipped, 5: Delivered
  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending verification': return 1;
      case 'bKash Verified': return 2;
      case 'Processing': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Rejected': return -1;
      default: return 1;
    }
  };

  const stageIdx = searchedOrder ? getStageIndex(searchedOrder.status) : 1;

  const trackingStages = [
    { title: "Order Placed", desc: "Details submitted successfully", idx: 1 },
    { title: "bKash Verified", desc: "Delivery fee confirmed by admin", idx: 2 },
    { title: "Processing", desc: "Printing & packaging in progress", idx: 3 },
    { title: "Shipped", desc: "Dispatched with Pathao/RedX", idx: 4 },
    { title: "Delivered", desc: "Arrived at destination", idx: 5 }
  ];

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="section-title">Track <span>Order</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px' }}>
          Enter your GoalWear Order ID (e.g., GW-58492) to view shipment milestones.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            required
            placeholder="e.g. GW-58492"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 44px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <Package size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '0 28px' }}>
          <Search size={18} />
          <span style={{ marginLeft: '6px' }}>Track</span>
        </button>
      </form>

      {/* Results area */}
      {hasSearched && (
        <div style={{ animation: 'fade-in 0.3s ease' }}>
          {searchedOrder ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Order Overview Card */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tracking Code: {searchedOrder.id}</span>
                  <h2 style={{ fontSize: '1.4rem', color: 'white', margin: '4px 0' }}>Status: <span style={{ color: searchedOrder.status === 'Rejected' ? '#ff3366' : 'var(--accent)' }}>{searchedOrder.status}</span></h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Placed on {searchedOrder.date}</p>
                </div>
                
                <div style={{ textAlign: 'right' }} className="overview-right-flex">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delivery</span>
                  <h4 style={{ fontSize: '1.1rem', color: 'white' }}>2 - 4 Business Days</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>bKash TxnID: {searchedOrder.bkashTxnId}</span>
                </div>
              </div>

              {/* Rejected Alert (if applicable) */}
              {searchedOrder.status === 'Rejected' && (
                <div style={{
                  backgroundColor: 'rgba(255, 51, 102, 0.05)',
                  border: '1px solid #ff3366',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <AlertTriangle size={24} color="#ff3366" style={{ shrink: 0 }} />
                  <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '2px' }}>Payment Verification Failed</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Our admin rejected the payment because the bKash Transaction ID submitted is invalid. Please contact support at goalwearbb@gmail.com to resubmit.
                    </span>
                  </div>
                </div>
              )}

              {/* Visual timeline */}
              {searchedOrder.status !== 'Rejected' && (
                <div className="glass-panel" style={{ padding: '36px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
                    
                    {/* Vertical line indicator */}
                    <div style={{
                      position: 'absolute',
                      left: '17px',
                      top: '10px',
                      width: '2px',
                      height: 'calc(100% - 20px)',
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }} />

                    {trackingStages.map((stage) => {
                      const isCompleted = stageIdx >= stage.idx;
                      const isActive = stageIdx === stage.idx - 1; // Current active pulsing stage

                      return (
                        <div key={stage.idx} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 5 }}>
                          
                          {/* Step indicator node */}
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? 'var(--accent)' : 'var(--bg-tertiary)',
                            border: isCompleted ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCompleted ? 'black' : 'var(--text-muted)',
                            boxShadow: isCompleted ? '0 0 10px var(--accent-glow)' : 'none',
                            transition: 'var(--transition-smooth)',
                            flexShrink: 0
                          }} className={isActive ? 'pulse-accent-glow' : ''}>
                            {isCompleted ? <Check size={16} strokeWidth={3} /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{stage.idx}</span>}
                          </div>

                          {/* Stage details */}
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isCompleted ? 'white' : 'var(--text-muted)'
                            }}>
                              {stage.title}
                            </h4>
                            <p style={{
                              fontSize: '0.8rem',
                              color: isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)'
                            }}>
                              {stage.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>
              )}

              {/* Items in shipment */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>Items ordered</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {searchedOrder.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.product.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {item.size} x {item.quantity}</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.product.price * item.quantity} BDT</span>
                    </div>
                  ))}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '8px 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Subtotal:</span>
                    <span>{searchedOrder.subtotal} BDT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Delivery Charge (Prepaid):</span>
                    <span>{searchedOrder.deliveryCharge} BDT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, color: 'white' }}>
                    <span>Total Cost (COD):</span>
                    <span>{searchedOrder.subtotal} BDT</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <AlertTriangle size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '8px' }}>Order Not Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                We couldn't locate any orders with the ID "{orderId}". Double-check spelling and format (e.g. GW-58492).
              </p>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @media (max-width: 576px) {
          .overview-right-flex {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
