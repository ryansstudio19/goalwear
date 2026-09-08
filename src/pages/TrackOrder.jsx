import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../supabaseClient';
import { Search, Package, CheckCircle2, Truck, Check, AlertTriangle, MessageCircle, Copy, Clock, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TrackOrder() {
  const { orders, ordersLoading, viewParams } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Robust order search helper checking context state, localStorage backup, and Supabase client
  const locateOrder = useCallback(async (queryStr) => {
    if (!queryStr || !queryStr.trim()) return null;

    const raw = queryStr.trim();
    // Normalize target: remove leading '#' and uppercase
    const cleanTarget = raw.replace(/^#/, '').trim().toUpperCase();
    const cleanDigits = raw.replace(/\D/g, ''); // For phone number matching

    // 1. Check in ShopContext orders
    const matchInContext = (orders || []).find(o => {
      const oid = (o.id || o.orderNumber || o.order_number || '').trim().toUpperCase();
      const phone = (o.phone || o.shipping_phone || o.bkashNumber || o.bkash_number || '').replace(/\D/g, '');
      const txn = (o.bkashTxnId || o.bkash_txn_id || o.bkashTrxId || '').trim().toUpperCase();

      return (
        oid === cleanTarget ||
        oid.replace(/^GW-/, '') === cleanTarget ||
        cleanTarget.replace(/^GW-/, '') === oid ||
        (cleanDigits && cleanDigits.length >= 10 && phone.includes(cleanDigits)) ||
        (cleanTarget.length >= 4 && txn === cleanTarget)
      );
    });

    if (matchInContext) return matchInContext;

    // 2. Check in localStorage directly (immediate sync before context state settles)
    try {
      const rawStored = localStorage.getItem('goalwear_supabase_orders');
      if (rawStored) {
        const storedOrders = JSON.parse(rawStored);
        const matchInStorage = (storedOrders || []).find(o => {
          const oid = (o.id || o.order_number || o.orderNumber || '').trim().toUpperCase();
          const phone = (o.phone || o.shipping_phone || o.bkash_number || '').replace(/\D/g, '');
          const txn = (o.bkash_txn_id || o.bkashTxnId || '').trim().toUpperCase();

          return (
            oid === cleanTarget ||
            oid.replace(/^GW-/, '') === cleanTarget ||
            cleanTarget.replace(/^GW-/, '') === oid ||
            (cleanDigits && cleanDigits.length >= 10 && phone.includes(cleanDigits)) ||
            (cleanTarget.length >= 4 && txn === cleanTarget)
          );
        });

        if (matchInStorage) {
          return {
            id: matchInStorage.id || matchInStorage.order_number,
            orderNumber: matchInStorage.order_number || matchInStorage.id,
            date: matchInStorage.created_at || matchInStorage.date || new Date().toISOString(),
            customerName: matchInStorage.shipping_name || matchInStorage.customer_name || 'Fan',
            phone: matchInStorage.shipping_phone || matchInStorage.phone || '',
            address: matchInStorage.shipping_address || matchInStorage.address || '',
            city: matchInStorage.shipping_city || matchInStorage.city || 'Dhaka',
            bkashNumber: matchInStorage.bkash_number,
            bkashTxnId: matchInStorage.bkash_txn_id,
            items: matchInStorage.items || [],
            subtotal: Number(matchInStorage.subtotal || 0),
            deliveryCharge: Number(matchInStorage.delivery_charge ?? 120),
            total: Number(matchInStorage.total || 0),
            status: matchInStorage.status || 'Pending verification'
          };
        }
      }
    } catch (storageErr) {
      console.warn('TrackOrder storage fallback error:', storageErr);
    }

    // 3. Fallback direct query to Supabase if configured
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${cleanTarget},order_number.eq.${cleanTarget}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          id: row.order_number || row.id,
          orderNumber: row.order_number || row.id,
          date: row.created_at || new Date().toISOString(),
          customerName: row.shipping_name || row.customer_name || 'Fan',
          phone: row.shipping_phone || row.phone || '',
          address: row.shipping_address || row.address || '',
          city: row.shipping_city || row.city || 'Dhaka',
          bkashNumber: row.bkash_number,
          bkashTxnId: row.bkash_txn_id,
          items: row.items || [],
          subtotal: Number(row.subtotal || 0),
          deliveryCharge: Number(row.delivery_charge ?? 120),
          total: Number(row.total || 0),
          status: row.status || 'Pending verification'
        };
      }
    } catch (queryErr) {
      console.warn('TrackOrder supabase lookup error:', queryErr);
    }

    return null;
  }, [orders]);

  // Execute lookup and update UI state
  const executeSearch = useCallback(async (targetId) => {
    if (!targetId || !targetId.trim()) return;
    setSearching(true);
    setHasSearched(true);
    setOrderId(targetId);

    const match = await locateOrder(targetId);
    setSearchedOrder(match);
    setSearching(false);
  }, [locateOrder]);

  // Sync param redirect from URL (?id=...) or viewParams on route change
  useEffect(() => {
    const queryId = searchParams.get('id') || searchParams.get('orderId');
    const targetId = queryId || viewParams?.orderId;
    if (targetId) {
      setOrderId(targetId);
      executeSearch(targetId);
    }
  }, [searchParams, viewParams, executeSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearchParams({ id: orderId.trim() });
    executeSearch(orderId);
  };

  const handleQuickSample = (sampleId) => {
    setOrderId(sampleId);
    setSearchParams({ id: sampleId });
    executeSearch(sampleId);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.origin + '/track-order?id=' + encodeURIComponent(searchedOrder?.id || orderId);
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Determine milestone stage index
  // 1: Placed, 2: Paid/Verified, 3: Processing, 4: Shipped, 5: Delivered, -1: Rejected
  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending verification':
      case 'pending_verification':
      case 'PENDING':
        return 1;
      case 'bKash Verified':
      case 'bkash_verified':
      case 'CONFIRMED':
        return 2;
      case 'Processing':
      case 'processing':
      case 'PACKED':
      case 'PROCESSING':
        return 3;
      case 'Shipped':
      case 'shipped':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'Delivered':
      case 'delivered':
      case 'DELIVERED':
        return 5;
      case 'Rejected':
      case 'rejected':
      case 'CANCELLED':
      case 'REFUNDED':
        return -1;
      default:
        return 1;
    }
  };

  const stageIdx = searchedOrder ? getStageIndex(searchedOrder.status) : 1;

  const trackingStages = [
    { title: "Order Placed", desc: "Order details submitted & queued", idx: 1 },
    { title: "bKash Verified", desc: "120 BDT delivery fee confirmed", idx: 2 },
    { title: "Processing", desc: "Heat-press customization & packaging", idx: 3 },
    { title: "Shipped", desc: "Dispatched via Pathao / Steadfast", idx: 4 },
    { title: "Delivered", desc: "Handover completed & COD collected", idx: 5 }
  ];

  // Helper safely formatting order item lists
  const getDisplayItems = (order) => {
    if (!order) return [];
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((it) => ({
        name: it.product?.name || it.name || it.product_name || 'Official Football Kit',
        image: it.product?.image || it.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
        size: it.size || it.variant_size || 'M',
        quantity: it.quantity || 1,
        price: it.product?.price || it.price || 0,
        customization: it.customization || null
      }));
    }
    if (Array.isArray(order.order_items) && order.order_items.length > 0) {
      return order.order_items.map((it) => ({
        name: it.product_name || 'Official Football Kit',
        image: it.product_image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
        size: it.variant_size || 'M',
        quantity: it.quantity || 1,
        price: it.unit_price || (it.total_price ? Math.round(it.total_price / (it.quantity || 1)) : 0),
        customization: it.custom_name ? { name: it.custom_name, number: it.custom_number } : null
      }));
    }
    return [];
  };

  const displayItems = searchedOrder ? getDisplayItems(searchedOrder) : [];
  const subtotal = searchedOrder?.subtotal ?? (searchedOrder?.totalAmount ? searchedOrder.totalAmount - (searchedOrder.deliveryFee || 120) : 0);
  const deliveryCharge = searchedOrder?.deliveryCharge ?? searchedOrder?.deliveryFee ?? 120;
  const codDue = subtotal;

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '820px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.25)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.08em' }}>
          <Truck size={14} />
          <span>Real-Time Shipment Tracking</span>
        </div>
        <h1 className="section-title">Track <span>Order Status</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '10px', maxWidth: '560px', margin: '10px auto 0' }}>
          Enter your GoalWear Order ID (e.g. <strong>GW-58492</strong>) or phone number to view live verification, packaging, and courier dispatch milestones.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <input
            type="text"
            required
            placeholder="Enter Order ID (e.g. GW-58492) or Phone Number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 44px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          />
          <Package size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button 
          type="submit" 
          disabled={searching}
          className="btn-premium btn-primary-glow" 
          style={{ padding: '0 28px', minHeight: '48px', flexShrink: 0, opacity: searching ? 0.7 : 1 }}
        >
          <Search size={18} />
          <span style={{ marginLeft: '6px' }}>{searching ? 'Locating...' : 'Track Order'}</span>
        </button>
      </form>

      {/* Quick Test Demo Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Try Demo Order:</span>
        <button
          type="button"
          onClick={() => handleQuickSample('GW-58492')}
          style={{
            background: 'rgba(0, 255, 136, 0.08)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '6px',
            color: 'var(--accent)',
            padding: '4px 10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.78rem',
            transition: 'var(--transition-fast)'
          }}
          title="Track verified order demo"
        >
          GW-58492 (Verified)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSample('GW-10492')}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            padding: '4px 10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.78rem',
            transition: 'var(--transition-fast)'
          }}
          title="Track shipped order demo"
        >
          GW-10492 (Shipped)
        </button>
      </div>

      {/* Loading state indicator */}
      {searching && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 255, 136, 0.2)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Searching GoalWear order logs...</p>
        </div>
      )}

      {/* Results area */}
      {!searching && hasSearched && (
        <div style={{ animation: 'fade-in 0.3s ease' }}>
          {searchedOrder ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
              
              {/* Order Overview Card */}
              <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', position: 'relative' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Tracking Code
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: 'white', letterSpacing: '0.04em' }}>
                      {searchedOrder.id || searchedOrder.orderNumber}
                    </strong>
                    <button
                      onClick={handleCopyLink}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedLink ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                      title="Copy Tracking URL"
                    >
                      <Copy size={13} />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', color: 'white', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Status:</span>
                    <span style={{ 
                      color: searchedOrder.status === 'Rejected' ? '#ff3366' : 'var(--accent)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: searchedOrder.status === 'Rejected' ? 'rgba(255, 51, 102, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                      border: `1px solid ${searchedOrder.status === 'Rejected' ? 'rgba(255, 51, 102, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`,
                      fontSize: '1rem',
                      fontWeight: 800
                    }}>
                      {searchedOrder.status}
                    </span>
                  </h2>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Placed on {searchedOrder.date ? new Date(searchedOrder.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent Matchday'}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }} className="overview-right-flex">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Arrival</span>
                  <h4 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 800, margin: '3px 0' }}>2 - 4 Business Days</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', display: 'inline-block', backgroundColor: 'rgba(0, 255, 136, 0.08)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                    bKash TxnID: {searchedOrder.bkashTxnId || searchedOrder.bkash_txn_id || '9K28FX01'}
                  </span>
                </div>
              </div>

              {/* Rejected Alert (if applicable) */}
              {searchedOrder.status === 'Rejected' && (
                <div style={{
                  backgroundColor: 'rgba(255, 51, 102, 0.06)',
                  border: '1px solid #ff3366',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center'
                }}>
                  <AlertTriangle size={26} color="#ff3366" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '3px', fontSize: '0.95rem' }}>
                      Payment Verification Failed
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Our finance team could not match the provided bKash Transaction ID against our merchant statement. Please message customer support on WhatsApp (+880 1848-520875) with your payment screenshot to rectify and re-verify your order immediately.
                    </span>
                  </div>
                </div>
              )}

              {/* Visual 5-Stage Milestone Timeline */}
              {searchedOrder.status !== 'Rejected' && (
                <div className="glass-panel" style={{ padding: '36px 26px' }}>
                  <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '24px', fontWeight: 800 }}>
                    Milestone Progress Tracker
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
                    
                    {/* Vertical line indicator */}
                    <div style={{
                      position: 'absolute',
                      left: '17px',
                      top: '12px',
                      bottom: '24px',
                      width: '2px',
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }} />

                    {trackingStages.map((stage) => {
                      const isCompleted = stageIdx >= stage.idx;
                      const isActive = stageIdx === stage.idx; // Current active stage

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
                            boxShadow: isCompleted ? '0 0 12px var(--accent-glow)' : 'none',
                            transition: 'var(--transition-smooth)',
                            flexShrink: 0
                          }} className={isActive ? 'pulse-accent-glow' : ''}>
                            {isCompleted ? <Check size={16} strokeWidth={3} /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{stage.idx}</span>}
                          </div>

                          {/* Stage details */}
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{
                              fontSize: '0.98rem',
                              fontWeight: 700,
                              color: isCompleted ? 'white' : 'var(--text-muted)',
                              margin: 0
                            }}>
                              {stage.title} {isActive && <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 800, marginLeft: '6px', textTransform: 'uppercase' }}>• Current Stage</span>}
                            </h4>
                            <p style={{
                              fontSize: '0.82rem',
                              color: isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                              margin: '2px 0 0 0'
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

              {/* Delivery Destination & Contact Details */}
              <div className="glass-panel" style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Delivery Destination</span>
                    <strong style={{ color: 'white', display: 'block' }}>{searchedOrder.customerName || 'Customer'}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{searchedOrder.address || 'Dhaka, Bangladesh'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Phone size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Recipient Contact</span>
                    <strong style={{ color: 'white' }}>{searchedOrder.phone || '01XXXXXXXXX'}</strong>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Courier: Pathao / Steadfast</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Doorstep Inspection</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Open parcel verification supported prior to paying COD balance.</span>
                  </div>
                </div>
              </div>

              {/* Items in shipment */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px', color: 'white', fontWeight: 800 }}>
                  Items in Shipment
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {displayItems.length > 0 ? (
                    displayItems.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400';
                            }}
                            style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }} 
                          />
                          <div>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'white', margin: 0 }}>{item.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              <span>Size: <strong style={{ color: 'white' }}>{item.size}</strong></span>
                              <span>•</span>
                              <span>Qty: <strong style={{ color: 'white' }}>{item.quantity}</strong></span>
                              {item.customization && (
                                <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(0, 255, 136, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                                  #{item.customization.number} {item.customization.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
                          {item.price * item.quantity} BDT
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Official Matchday Kit Package
                    </div>
                  )}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '10px 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>{subtotal} BDT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Delivery Charge (Prepaid via bKash):</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{deliveryCharge} BDT (PAID)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: 'white', paddingTop: '4px' }}>
                    <span>Due on Delivery Handover (COD):</span>
                    <span style={{ color: 'var(--accent)' }}>{codDue} BDT</span>
                  </div>
                </div>
              </div>

              {/* Need Help / WhatsApp Concierge Direct Action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 211, 102, 0.05)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#25D366'
                  }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', margin: 0 }}>
                      Have questions about your delivery?
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Our Dhaka matchday logistics team is available on WhatsApp daily.
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/8801848520875?text=${encodeURIComponent(`Hello GoalWear Support, I am inquiring about my Order ID: ${searchedOrder.id || searchedOrder.orderNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#000000',
                    fontWeight: 800,
                    padding: '10px 18px',
                    fontSize: '0.82rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '48px 30px', textAlign: 'center' }}>
              <AlertTriangle size={42} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px', color: 'white', fontWeight: 800 }}>
                Order Not Found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                We couldn't locate any records matching <strong>"{orderId}"</strong>. Please verify the ID format (e.g. <strong>GW-58492</strong>) or try searching with your 11-digit phone number.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleQuickSample('GW-58492')}
                  className="btn-premium btn-primary-glow"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  Try Sample Order (GW-58492)
                </button>
                <a
                  href={`https://wa.me/8801848520875?text=${encodeURIComponent(`Hello GoalWear, I placed an order but cannot locate tracking for ID: ${orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-secondary-glass"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 576px) {
          .overview-right-flex {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
