import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ArrowLeft, Eye, ExternalLink } from 'lucide-react';

export default function CustomerOrders() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/account/login?redirect=/account/orders');
      return;
    }

    const fetchCustomerOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*),
            order_status_history (*)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // If schema is still mock or customer_id is empty, fallback to local search by user email/phone
          console.warn('Orders query:', error.message);
          const { data: fallbackOrders } = await supabase.from('orders').select('*');
          if (fallbackOrders) {
            setOrders(fallbackOrders.filter(o => o.phone === profile?.phone || o.customer_name === profile?.full_name));
          }
        } else if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [user, profile, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'Delivered':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' };
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
      case 'Shipped':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: '#3b82f6' };
      case 'PROCESSING':
      case 'PACKED':
      case 'CONFIRMED':
      case 'bKash Verified':
        return { bg: 'rgba(0, 255, 136, 0.15)', text: 'var(--accent)', border: 'var(--accent)' };
      case 'CANCELLED':
      case 'REFUNDED':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#ef4444' };
      default:
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' };
    }
  };

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '960px' }}>
      
      {/* Breadcrumb / Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/account')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Account</span>
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Logged in as <strong style={{ color: 'white' }}>{user?.email}</strong>
        </span>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 6px 0' }}>
          My Orders & History
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
          Track real-time shipment status, review purchased jersey sizes, and inspect delivery milestones.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading your orders from database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', border: '1px dashed var(--border-glass)' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>No Orders Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            You have not placed any orders yet. Discover our authentic match jerseys and national kits.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-premium btn-primary-glow"
            style={{ padding: '10px 24px', fontSize: '0.85rem' }}
          >
            Browse Jerseys
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const orderNum = order.order_number || order.id;
            const itemsCount = order.order_items?.length || (Array.isArray(order.items) ? order.items.length : 1);
            const formattedDate = new Date(order.created_at || order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div 
                key={order.id}
                className="glass-panel glass-panel-hover"
                style={{ padding: '20px', border: '1px solid var(--border-glass)', borderRadius: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>
                      #{orderNum}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Placed on {formattedDate}
                    </span>
                  </div>

                  <span style={{
                    backgroundColor: badge.bg,
                    color: badge.text,
                    border: `1px solid ${badge.border}`,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Total Amount: <strong style={{ color: 'white', fontSize: '1rem' }}>৳{order.total}</strong> ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Recipient: {order.shipping_name || order.customer_name} • {order.shipping_phone || order.phone}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => navigate(`/track-order?id=${encodeURIComponent(orderNum)}`)}
                      className="btn-premium btn-secondary-glass"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Truck size={14} />
                      <span>Track Shipment</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="btn-premium btn-secondary-glass"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Eye size={14} />
                      <span>{selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Order Inspector */}
                {selectedOrder?.id === order.id && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', animation: 'fade-in 0.2s ease' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 12px 0', color: 'var(--accent)' }}>
                      Order Items Breakdown
                    </h4>

                    {order.order_items && order.order_items.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {order.order_items.map((item) => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px' }}>
                            <span><strong>{item.quantity}x</strong> {item.product_name} (Size: {item.variant_size})</span>
                            <span style={{ fontWeight: 700 }}>৳{item.total_price}</span>
                          </div>
                        ))}
                      </div>
                    ) : Array.isArray(order.items) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px' }}>
                            <span><strong>{it.quantity}x</strong> {it.product?.name || 'Jersey'} (Size: {it.size})</span>
                            <span style={{ fontWeight: 700 }}>৳{(it.product?.price || 0) * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.82rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Delivery Address:</span>
                        <span style={{ color: 'white' }}>{order.shipping_address || order.address}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>bKash Verification:</span>
                        <span style={{ color: 'white' }}>Sender: {order.bkash_number || 'N/A'} • TxnID: {order.bkash_txn_id || 'N/A'}</span>
                      </div>
                      {order.tracking_number && (
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Courier Tracking:</span>
                          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{order.courier_name || 'Steadfast'}: {order.tracking_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
