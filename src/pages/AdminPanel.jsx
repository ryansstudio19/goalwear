import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Lock, FileText, CheckCircle, XCircle, ShieldCheck, Truck, ShoppingBag, Eye } from 'lucide-react';

export default function AdminPanel() {
  const { orders, updateOrderStatus } = useContext(ShopContext);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Authenticate mockup (Simple unlock for demonstration)
  const [authenticated, setAuthenticated] = useState(true);
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin' || password === 'goalwear') {
      setAuthenticated(true);
    } else {
      alert("Invalid developer credentials! Tip: Use 'admin' or 'goalwear'.");
    }
  };

  const getFilteredOrders = () => {
    switch (filter) {
      case 'pending':
        return orders.filter(o => o.status === 'Pending verification');
      case 'active':
        return orders.filter(o => o.status === 'bKash Verified' || o.status === 'Processing' || o.status === 'Shipped');
      case 'completed':
        return orders.filter(o => o.status === 'Delivered');
      case 'rejected':
        return orders.filter(o => o.status === 'Rejected');
      default:
        return orders;
    }
  };

  const filtered = getFilteredOrders();

  if (!authenticated) {
    return (
      <div className="container-custom" style={{ paddingTop: '80px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '36px', textAlign: 'center', backgroundColor: '#0c0e15', border: '1px solid var(--border-glass-hover)' }}>
          <div style={{ backgroundColor: 'rgba(0, 255, 136, 0.05)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent)', margin: '0 auto 20px' }} className="icon-wrap">
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '8px' }}>Admin Workspace</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Access is locked. Enter developer credentials to verify user bKash statements. (Tip: Use password <strong>admin</strong>)
          </p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="password" 
              placeholder="Enter passcode..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            <button type="submit" className="btn-premium btn-primary-glow" style={{ padding: '12px 0' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>
        <style>{`
          .icon-wrap {
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h1 className="section-title">Admin <span>Board</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            GoalWear E-Commerce simulated merchant dispatch and payment verification center.
          </p>
        </div>

        <button 
          onClick={() => setAuthenticated(false)}
          className="btn-premium btn-secondary-glass"
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          Lock Dashboard
        </button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { label: "Total Orders", val: orders.length, color: 'white' },
          { label: "Pending Verification", val: orders.filter(o => o.status === 'Pending verification').length, color: '#ffb400' },
          { label: "Active Deliveries", val: orders.filter(o => o.status === 'bKash Verified' || o.status === 'Processing' || o.status === 'Shipped').length, color: 'var(--accent)' },
          { label: "Rejected Sheets", val: orders.filter(o => o.status === 'Rejected').length, color: '#ff3366' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{stat.label}</span>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, marginTop: '4px' }}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Workspace panel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        xlTemplateColumns: '1.8fr 1.2fr',
        gap: '30px'
      }} className="admin-grid-layout">
        
        {/* Orders Table */}
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            {[
              { id: 'all', name: "All Orders" },
              { id: 'pending', name: "Pending Verification" },
              { id: 'active', name: "Active Delivery" },
              { id: 'completed', name: "Completed" },
              { id: 'rejected', name: "Rejected" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: filter === tab.id ? 'var(--accent)' : 'transparent',
                  color: filter === tab.id ? 'black' : 'var(--text-secondary)',
                  border: filter === tab.id ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'white' }}>
                <th style={{ padding: '12px 8px' }}>Order ID</th>
                <th style={{ padding: '12px 8px' }}>Customer</th>
                <th style={{ padding: '12px 8px' }}>bKash TxnID</th>
                <th style={{ padding: '12px 8px' }}>Total Cost</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No orders in this category.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr 
                    key={order.id} 
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setSelectedOrder(order)}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: 'white' }}>{order.id}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '14px 8px', color: 'var(--accent)' }}>{order.bkashTxnId}</td>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{order.total} BDT</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor: order.status === 'Rejected' ? 'rgba(255,51,102,0.15)' : 
                                         order.status === 'Delivered' ? 'rgba(0,255,136,0.15)' : 'rgba(255,180,0,0.15)',
                        color: order.status === 'Rejected' ? '#ff3366' : 
                               order.status === 'Delivered' ? 'var(--accent)' : '#ffb400'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="btn-premium btn-secondary-glass"
                        style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}
                      >
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details inspection card */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedOrder ? (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border-glass-hover)', backgroundColor: '#0c0e15' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Invoice Details</span>
                <h3 style={{ fontSize: '1.4rem', color: 'white', marginTop: '2px' }}>Order: {selectedOrder.id}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Submitted {selectedOrder.date}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

              {/* Customer parameters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div><strong>Customer:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customerName}</span></div>
                <div><strong>Phone Number:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.phone}</span></div>
                <div><strong>Shipping Address:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.address}</span></div>
                <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>bKash Payment Submissions:</div>
                  <div>Sender Account: <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.bkashNumber}</span></div>
                  <div>Transaction ID: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{selectedOrder.bkashTxnId}</span></div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.75rem' }}>Items Ordered:</span>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>{item.product.name} (Size: {item.size} x {item.quantity})</span>
                    <span>{item.product.price * item.quantity} BDT</span>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

              {/* Action buttons controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {selectedOrder.status === 'Pending verification' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => { updateOrderStatus(selectedOrder.id, 'bKash Verified'); setSelectedOrder(prev => ({ ...prev, status: 'bKash Verified' })); }}
                      className="btn-premium btn-primary-glow"
                      style={{ flex: 1, padding: '10px 0', fontSize: '0.75rem', display: 'flex', gap: '6px', justifyCenter: 'center', alignItems: 'center' }}
                    >
                      <ShieldCheck size={14} />
                      <span>Verify Paid</span>
                    </button>
                    <button 
                      onClick={() => { updateOrderStatus(selectedOrder.id, 'Rejected'); setSelectedOrder(prev => ({ ...prev, status: 'Rejected' })); }}
                      style={{ flex: 1, padding: '10px 0', fontSize: '0.75rem', backgroundColor: '#ff3366', color: 'white', display: 'flex', gap: '6px', justifyCenter: 'center', alignItems: 'center' }}
                      className="btn-premium"
                    >
                      <XCircle size={14} />
                      <span>Reject/Cancel</span>
                    </button>
                  </div>
                )}

                {selectedOrder.status === 'bKash Verified' && (
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Processing'); setSelectedOrder(prev => ({ ...prev, status: 'Processing' })); }}
                    className="btn-premium btn-primary-glow"
                    style={{ padding: '10px 0', fontSize: '0.75rem' }}
                  >
                    <ShoppingBag size={14} />
                    <span>Approve Processing</span>
                  </button>
                )}

                {(selectedOrder.status === 'Processing' || selectedOrder.status === 'bKash Verified') && (
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Shipped'); setSelectedOrder(prev => ({ ...prev, status: 'Shipped' })); }}
                    className="btn-premium btn-primary-glow"
                    style={{ padding: '12px 0', fontSize: '0.75rem', display: 'flex', gap: '6px', justifyCenter: 'center', alignItems: 'center' }}
                  >
                    <Truck size={14} />
                    <span>Dispatch Package (Mark Shipped)</span>
                  </button>
                )}

                {selectedOrder.status === 'Shipped' && (
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Delivered'); setSelectedOrder(prev => ({ ...prev, status: 'Delivered' })); }}
                    className="btn-premium btn-primary-glow"
                    style={{ padding: '12px 0', fontSize: '0.75rem', display: 'flex', gap: '6px', justifyCenter: 'center', alignItems: 'center' }}
                  >
                    <CheckCircle size={14} />
                    <span>Complete Handover (Mark Delivered)</span>
                  </button>
                )}

                {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Rejected') && (
                  <div style={{
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 700
                  }}>
                    No Pending Actions (Archived)
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-glass)' }}>
              <FileText size={32} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.9rem' }}>Select an order row from the table to inspect details and verify bKash receipts.</p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        @media (min-width: 1200px) {
          .admin-grid-layout {
            grid-template-columns: 1.8fr 1.2fr !important;
          }
        }
      `}</style>
    </div>
  );
}
