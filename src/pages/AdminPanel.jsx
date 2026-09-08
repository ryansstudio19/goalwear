import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../supabaseClient';
import {
  Lock,
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Eye,
  Users,
  Package,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Clock,
  DollarSign,
  Tag,
  Sparkles,
  Flame,
  X
} from 'lucide-react';

export default function AdminPanel() {
  const {
    orders,
    ordersLoading,
    updateOrderStatus,
    deleteOrder,
    refetchOrders,
    products,
    updateProductStockStatus,
    toggleProductBadge,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
    customersList
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // Active Workspace Tab: 'overview' | 'orders' | 'inventory' | 'customers'
  const [activeTab, setActiveTab] = useState('overview');

  // Auth state
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('admin@goalwear.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Orders filters and inspector
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);

  // Inventory filters and modals
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Customer search & drill-down
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState(null);

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoginError('Invalid email or password. You can use demo credentials.');
    } else {
      refetchOrders();
    }
    setLoggingIn(false);
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@goalwear.com');
    setPassword('admin123');
    setLoggingIn(true);
    await supabase.auth.signInWithPassword({
      email: 'admin@goalwear.com',
      password: 'admin123'
    });
    refetchOrders();
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSelectedOrder(null);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ── Metrics Calculation ───────────────────────────────────────────────────
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Rejected')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [orders]);

  const pendingVerificationOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Pending verification');
  }, [orders]);

  const activeDeliveries = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'bKash Verified' || o.status === 'Processing' || o.status === 'Shipped'
    );
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered');
  }, [orders]);

  const inStockCount = useMemo(() => {
    return products.filter(
      (p) => p.inStock !== false && p.stockStatus !== 'out_of_stock'
    ).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter(
      (p) => p.inStock === false || p.stockStatus === 'out_of_stock'
    ).length;
  }, [products]);

  // ── Filtered Orders ───────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      let matchesStatus = true;
      if (orderFilter === 'pending') matchesStatus = order.status === 'Pending verification';
      else if (orderFilter === 'verified') matchesStatus = order.status === 'bKash Verified';
      else if (orderFilter === 'active') matchesStatus = ['bKash Verified', 'Processing', 'Shipped'].includes(order.status);
      else if (orderFilter === 'delivered') matchesStatus = order.status === 'Delivered';
      else if (orderFilter === 'rejected') matchesStatus = order.status === 'Rejected';

      // Text search
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.phone?.toLowerCase().includes(q) ||
        order.bkashTxnId?.toLowerCase().includes(q) ||
        order.address?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // ── Filtered Products ─────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        productCategoryFilter === 'all' || p.category === productCategoryFilter;

      let matchesStock = true;
      if (productStockFilter === 'in_stock') {
        matchesStock = p.inStock !== false && p.stockStatus !== 'out_of_stock';
      } else if (productStockFilter === 'low_stock') {
        matchesStock = p.stockStatus === 'low_stock';
      } else if (productStockFilter === 'out_of_stock') {
        matchesStock = p.inStock === false || p.stockStatus === 'out_of_stock';
      } else if (productStockFilter === 'bestseller') {
        matchesStock = !!p.isBestSeller;
      } else if (productStockFilter === 'new') {
        matchesStock = !!p.isNew;
      }

      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return matchesCategory && matchesStock && matchesSearch;
    });
  }, [products, productCategoryFilter, productStockFilter, productSearch]);

  // ── Filtered Customers ────────────────────────────────────────────────────
  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customersList;
    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [customersList, customerSearch]);

  // ── Authentication Check Screen ───────────────────────────────────────────
  if (checkingSession) {
    return (
      <div className="container-custom" style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <RefreshCw size={20} className="animate-spin text-accent" />
          <span>Connecting to GoalWear Merchant Cloud...</span>
        </div>
      </div>
    );
  }

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="container-custom" style={{ paddingTop: '60px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px',
            backgroundColor: '#0c0e15',
            border: '1px solid var(--border-glass-hover)',
            borderRadius: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.25)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              margin: '0 auto 20px'
            }}
          >
            <Lock size={28} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', marginBottom: '6px' }}>
            Merchant <span style={{ color: 'var(--accent)' }}>Workspace</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
            Secure order fulfillment, bKash transactions audit, and live jersey inventory controls.
          </p>

          {/* Quick Demo Credentials Box */}
          <div
            style={{
              backgroundColor: 'rgba(0, 255, 136, 0.04)',
              border: '1px dashed var(--accent)',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} />
              <span>Demo Admin Credentials</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              Email: <code style={{ color: 'white' }}>admin@goalwear.com</code><br />
              Password: <code style={{ color: 'white' }}>admin123</code> (or <code style={{ color: 'white' }}>goalwear</code>)
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@goalwear.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: loginError ? '1px solid #ff3366' : '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: loginError ? '1px solid #ff3366' : '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {loginError && (
              <span style={{ color: '#ff3366', fontSize: '0.8rem', textAlign: 'center' }}>
                {loginError}
              </span>
            )}

            <button
              type="submit"
              className="btn-premium btn-primary-glow"
              style={{ padding: '14px 0', marginTop: '6px', fontWeight: 800 }}
              disabled={loggingIn}
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn-premium btn-secondary-glass"
              style={{ padding: '10px 0', fontSize: '0.8rem' }}
              disabled={loggingIn}
            >
              One-Click Instant Demo Access
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '10px',
                textAlign: 'center',
                padding: '4px'
              }}
            >
              ← Return to GoalWear Storefront
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="container-custom" style={{ paddingTop: '30px', paddingBottom: '90px' }}>

      {/* Top Merchant Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-glass)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                color: 'var(--accent)',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} className="animate-pulse" />
              GoalWear Cloud Active • Live Sync
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Logged in as {session.user?.email || 'admin@goalwear.com'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            Merchant <span style={{ color: 'var(--accent)' }}>Control Center</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            className="btn-premium btn-secondary-glass"
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Open customer storefront"
          >
            <ShoppingBag size={14} />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => refetchOrders()}
            className="btn-premium btn-secondary-glass"
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh database"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn-premium btn-secondary-glass"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Lock Out
          </button>
        </div>
      </div>

      {/* Primary KPI Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* 1. Total Customers / People Ordered */}
        <div
          className="glass-panel cursor-pointer hover:border-emerald-500/40 transition-all"
          onClick={() => setActiveTab('customers')}
          style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              People Ordered (Buyers)
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginTop: '8px' }}>
            {customersList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {customersList.length > 0
              ? `${Math.round((customersList.filter(c => c.totalOrders > 1).length / customersList.length) * 100)}% Repeat Buyers`
              : 'Direct customer accounts'}
          </div>
        </div>

        {/* 2. Total Orders */}
        <div
          className="glass-panel cursor-pointer hover:border-emerald-500/40 transition-all"
          onClick={() => { setActiveTab('orders'); setOrderFilter('all'); }}
          style={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Total Orders
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent)' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginTop: '8px' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: pendingVerificationOrders.length > 0 ? '#ffb400' : 'var(--accent)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pendingVerificationOrders.length > 0 ? (
              <>
                <AlertTriangle size={12} />
                <span>{pendingVerificationOrders.length} pending bKash audit</span>
              </>
            ) : (
              <>
                <CheckCircle size={12} />
                <span>All payments verified</span>
              </>
            )}
          </div>
        </div>

        {/* 3. Gross Sales Revenue */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Total Revenue
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', marginTop: '8px' }}>
            {totalRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: 'white' }}>BDT</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {deliveredOrders.length} successful handovers
          </div>
        </div>

        {/* 4. Active Catalog & Stock */}
        <div
          className="glass-panel cursor-pointer hover:border-emerald-500/40 transition-all"
          onClick={() => setActiveTab('inventory')}
          style={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Jersey Inventory
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginTop: '8px' }}>
            {products.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>items</span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '4px', display: 'flex', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>{inStockCount} In Stock</span>
            {outOfStockCount > 0 && (
              <span style={{ color: '#ff3366' }}>• {outOfStockCount} Sold Out</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-glass)'
        }}
      >
        {[
          { id: 'overview', name: 'Executive Overview', icon: BarChart3 },
          { id: 'orders', name: `Orders (${orders.length})`, icon: ShoppingBag, badge: pendingVerificationOrders.length },
          { id: 'inventory', name: `Product Inventory (${products.length})`, icon: Package },
          { id: 'customers', name: `Customers Directory (${customersList.length})`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: isActive ? '#000000' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
              {tab.badge > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? '#000' : '#ffb400',
                    color: isActive ? 'var(--accent)' : '#000',
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 900
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          TAB 1: EXECUTIVE OVERVIEW
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Alert Queue if any pending verification orders exist */}
          {pendingVerificationOrders.length > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '18px 24px',
                backgroundColor: 'rgba(255, 180, 0, 0.05)',
                border: '1px solid rgba(255, 180, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(255, 180, 0, 0.15)', color: '#ffb400' }}>
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: 800 }}>
                    Action Required: {pendingVerificationOrders.length} New Orders Awaiting bKash Verification
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Customers have submitted 150 BDT pre-payment transaction IDs. Verify sender accounts to approve dispatch.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('orders'); setOrderFilter('pending'); }}
                className="btn-premium btn-primary-glow"
                style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 800 }}
              >
                Inspect Queue Now
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

            {/* Pipeline Stage breakdown */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} className="text-accent" />
                <span>Fulfillment Funnel</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Pending Verification', count: pendingVerificationOrders.length, color: '#ffb400', pct: orders.length ? (pendingVerificationOrders.length / orders.length) * 100 : 0 },
                  { label: 'bKash Verified (Packing)', count: orders.filter(o => o.status === 'bKash Verified').length, color: '#60a5fa', pct: orders.length ? (orders.filter(o => o.status === 'bKash Verified').length / orders.length) * 100 : 0 },
                  { label: 'In Processing', count: orders.filter(o => o.status === 'Processing').length, color: '#c084fc', pct: orders.length ? (orders.filter(o => o.status === 'Processing').length / orders.length) * 100 : 0 },
                  { label: 'Dispatched & On The Way', count: orders.filter(o => o.status === 'Shipped').length, color: '#38bdf8', pct: orders.length ? (orders.filter(o => o.status === 'Shipped').length / orders.length) * 100 : 0 },
                  { label: 'Delivered (Completed COD)', count: deliveredOrders.length, color: 'var(--accent)', pct: orders.length ? (deliveredOrders.length / orders.length) * 100 : 0 }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{step.label}</span>
                      <span style={{ fontWeight: 800, color: step.color }}>{step.count} orders</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(step.pct, 4)}%`, height: '100%', backgroundColor: step.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} className="text-accent" />
                <span>Quick Store Controls</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => { setActiveTab('inventory'); setShowAddModal(true); }}
                  className="btn-premium btn-primary-glow"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}
                >
                  <Plus size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Add New Jersey</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>Publish to storefront</span>
                </button>

                <button
                  onClick={() => { setActiveTab('customers'); }}
                  className="btn-premium btn-secondary-glass"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}
                >
                  <Users size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>View Buyers</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{customersList.length} unique buyers</span>
                </button>

                <button
                  onClick={() => { setActiveTab('inventory'); setProductStockFilter('out_of_stock'); }}
                  className="btn-premium btn-secondary-glass"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}
                >
                  <Package size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Restock Items</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{outOfStockCount} sold out</span>
                </button>

                <button
                  onClick={() => { resetProductsToDefault(); alert('Catalog reset to official GoalWear defaults!'); }}
                  className="btn-premium btn-secondary-glass"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}
                >
                  <RefreshCw size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Reset Catalog</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Restore defaults</span>
                </button>
              </div>
            </div>

          </div>

          {/* Recent Orders Stream */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                Recent Order Activity
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                style={{ fontSize: '0.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>View all orders</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }}
                  className="table-row-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: '0.88rem' }}>{order.id}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.customerName} • <span style={{ color: 'var(--text-muted)' }}>{order.phone}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 800, color: 'white', fontSize: '0.9rem' }}>{order.total} BDT</span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor:
                          order.status === 'Rejected' ? 'rgba(255,51,102,0.15)' :
                          order.status === 'Delivered' ? 'rgba(0,255,136,0.15)' : 'rgba(255,180,0,0.15)',
                        color:
                          order.status === 'Rejected' ? '#ff3366' :
                          order.status === 'Delivered' ? 'var(--accent)' : '#ffb400'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          TAB 2: ORDERS MANAGEMENT
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="admin-orders-layout">

          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Phone, TxnID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending bKash' },
                  { id: 'active', label: 'Active Dispatches' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'rejected', label: 'Rejected' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: orderFilter === f.id ? 'var(--accent)' : 'transparent',
                      color: orderFilter === f.id ? '#000000' : 'var(--text-secondary)',
                      border: orderFilter === f.id ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Customer / Contact</th>
                  <th style={{ padding: '12px 8px' }}>bKash Verification</th>
                  <th style={{ padding: '12px 8px' }}>Amount</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No orders found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="table-row-hover"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          backgroundColor: isSelected ? 'rgba(0, 255, 136, 0.05)' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <td style={{ padding: '14px 8px', fontWeight: 800, color: 'white' }}>
                          <div>{order.id}</div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {new Date(order.date || Date.now()).toLocaleDateString('en-GB')}
                          </span>
                        </td>

                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 700, color: 'white' }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{order.phone}</span>
                            <a
                              href={`https://wa.me/88${(order.phone || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Chat on WhatsApp"
                              style={{ color: '#25D366' }}
                            >
                              <MessageCircle size={12} />
                            </a>
                          </div>
                        </td>

                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 700 }}>
                            {order.bkashTxnId || 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Sender: {order.bkashNumber || 'N/A'}
                          </div>
                        </td>

                        <td style={{ padding: '14px 8px', fontWeight: 800, color: 'white' }}>
                          {order.total} BDT
                        </td>

                        <td style={{ padding: '14px 8px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              backgroundColor:
                                order.status === 'Rejected' ? 'rgba(255,51,102,0.15)' :
                                order.status === 'Delivered' ? 'rgba(0,255,136,0.15)' : 'rgba(255,180,0,0.15)',
                              color:
                                order.status === 'Rejected' ? '#ff3366' :
                                order.status === 'Delivered' ? 'var(--accent)' : '#ffb400'
                            }}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                              className="btn-premium btn-secondary-glass"
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}
                              title="Inspect Details"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setInvoiceModalOrder(order); }}
                              className="btn-premium btn-secondary-glass"
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}
                              title="Print Invoice"
                            >
                              <Printer size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete test order ${order.id}?`)) {
                                  deleteOrder(order.id);
                                  if (selectedOrder?.id === order.id) setSelectedOrder(null);
                                }
                              }}
                              className="btn-premium btn-secondary-glass hover:text-red-400"
                              style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#ff3366' }}
                              title="Delete Order"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Right Column / Inspector Drawer */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedOrder ? (
              <div
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  backgroundColor: '#0c0e15',
                  border: '1px solid var(--border-glass-hover)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Invoice & Dispatch Inspection
                    </span>
                    <h3 style={{ fontSize: '1.4rem', color: 'white', margin: '2px 0 0 0' }}>
                      Order: {selectedOrder.id}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Submitted {new Date(selectedOrder.date || Date.now()).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: 0 }} />

                {/* Customer Contact Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Customer Contact:
                  </div>
                  <div><strong>Name:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customerName}</span></div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><strong>Phone:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.phone}</span></div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="btn-premium btn-secondary-glass"
                        style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={11} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/88${(selectedOrder.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-premium"
                        style={{ padding: '3px 8px', fontSize: '0.75rem', backgroundColor: '#25D366', color: '#000', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                      >
                        <MessageCircle size={11} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div><strong>Delivery Address:</strong> <span style={{ color: 'var(--text-secondary)' }}>{selectedOrder.address}</span></div>
                </div>

                {/* bKash Verification Box */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 255, 136, 0.03)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>bKash Payment Submissions:</span>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.bkashTxnId, 'txn')}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedField === 'txn' ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedField === 'txn' ? 'Copied!' : 'Copy TxnID'}</span>
                    </button>
                  </div>
                  <div>Sender Account: <strong style={{ color: 'white' }}>{selectedOrder.bkashNumber || 'N/A'}</strong></div>
                  <div>Transaction ID: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{selectedOrder.bkashTxnId || 'N/A'}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Prepaid delivery charge: 150 BDT • Remaining COD: {(Number(selectedOrder.total || 0) - 150)} BDT
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Ordered Jerseys ({(selectedOrder.items || []).length}):
                  </span>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-glass)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt=""
                            style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{item.product?.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Size: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{item.size}</span> • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'white' }}>
                        {((item.product?.price || 0) * (item.quantity || 1))} BDT
                      </div>
                    </div>
                  ))}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: 0 }} />

                {/* Status Action Workflow Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Update Order Milestone:
                  </div>

                  {selectedOrder.status === 'Pending verification' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'bKash Verified');
                          setSelectedOrder((prev) => ({ ...prev, status: 'bKash Verified' }));
                        }}
                        className="btn-premium btn-primary-glow"
                        style={{ flex: 1, padding: '10px 0', fontSize: '0.78rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <ShieldCheck size={15} />
                        <span>Verify Paid</span>
                      </button>

                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'Rejected');
                          setSelectedOrder((prev) => ({ ...prev, status: 'Rejected' }));
                        }}
                        style={{ flex: 1, padding: '10px 0', fontSize: '0.78rem', backgroundColor: '#ff3366', color: 'white', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                        className="btn-premium"
                      >
                        <XCircle size={15} />
                        <span>Reject / Fake Txn</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === 'bKash Verified' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'Processing');
                        setSelectedOrder((prev) => ({ ...prev, status: 'Processing' }));
                      }}
                      className="btn-premium btn-primary-glow"
                      style={{ padding: '11px 0', fontSize: '0.8rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <ShoppingBag size={15} />
                      <span>Start Packaging (Mark Processing)</span>
                    </button>
                  )}

                  {selectedOrder.status === 'Processing' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'Shipped');
                        setSelectedOrder((prev) => ({ ...prev, status: 'Shipped' }));
                      }}
                      className="btn-premium btn-primary-glow"
                      style={{ padding: '11px 0', fontSize: '0.8rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Truck size={15} />
                      <span>Handover to Courier (Mark Shipped)</span>
                    </button>
                  )}

                  {selectedOrder.status === 'Shipped' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'Delivered');
                        setSelectedOrder((prev) => ({ ...prev, status: 'Delivered' }));
                      }}
                      className="btn-premium btn-primary-glow"
                      style={{ padding: '11px 0', fontSize: '0.8rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <CheckCircle size={15} />
                      <span>Cash Received & Handed Over (Delivered)</span>
                    </button>
                  )}

                  {selectedOrder.status === 'Delivered' && (
                    <div
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 255, 136, 0.05)',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                        fontWeight: 700
                      }}
                    >
                      Order Completed & Revenue Collected
                    </div>
                  )}

                  {selectedOrder.status === 'Rejected' && (
                    <div
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 51, 102, 0.05)',
                        border: '1px solid rgba(255, 51, 102, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: '#ff3366',
                        fontWeight: 700
                      }}
                    >
                      Order Cancelled / Rejected
                    </div>
                  )}

                  {/* Print invoice button */}
                  <button
                    onClick={() => setInvoiceModalOrder(selectedOrder)}
                    className="btn-premium btn-secondary-glass"
                    style={{ padding: '9px 0', fontSize: '0.8rem', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Printer size={14} />
                    <span>Print Packing Slip & Invoice</span>
                  </button>
                </div>

              </div>
            ) : (
              <div
                className="glass-panel"
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-glass)'
                }}
              >
                <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  Select an order from the list to inspect customer details, bKash verification, or update delivery status.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          TAB 3: PRODUCT INVENTORY & STATUS
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Catalog Top Toolbar */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search jersey catalog..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="all">All Categories</option>
              <option value="National Teams">National Teams</option>
              <option value="Club Teams">Club Teams</option>
            </select>

            {/* Stock Filter */}
            <select
              value={productStockFilter}
              onChange={(e) => setProductStockFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="low_stock">Low Stock Only</option>
              <option value="out_of_stock">Out of Stock (Sold Out)</option>
              <option value="bestseller">Best Sellers (Hot)</option>
              <option value="new">New Season Arrivals</option>
            </select>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-premium btn-primary-glow"
              style={{ padding: '9px 16px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>Add New Jersey</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredProducts.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No jersey models match your search criteria.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.inStock === false || p.stockStatus === 'out_of_stock';
                const isLowStock = p.stockStatus === 'low_stock';

                return (
                  <div
                    key={p.id}
                    className="glass-panel"
                    style={{
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      border: isOutOfStock ? '1px solid rgba(255, 51, 102, 0.3)' : '1px solid var(--border-glass)',
                      backgroundColor: '#0c0e15',
                      position: 'relative'
                    }}
                  >
                    {/* Image & Quick Badges */}
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--bg-tertiary)',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isOutOfStock ? 'grayscale(0.6)' : 'none',
                            opacity: isOutOfStock ? 0.7 : 1
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700 }}>
                          {p.category}
                        </span>
                        <h4 style={{ margin: '2px 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                          {p.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontWeight: 900, color: 'white', fontSize: '1.1rem' }}>
                            {p.price} BDT
                          </span>
                          {p.originalPrice > p.price && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              {p.originalPrice} BDT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Controller Pill */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                        Live Stock Status:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                        <button
                          onClick={() => updateProductStockStatus(p.id, 'in_stock')}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: !isOutOfStock && !isLowStock ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.03)',
                            color: !isOutOfStock && !isLowStock ? 'var(--accent)' : 'var(--text-muted)',
                            border: !isOutOfStock && !isLowStock ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                            cursor: 'pointer'
                          }}
                        >
                          ● In Stock
                        </button>

                        <button
                          onClick={() => updateProductStockStatus(p.id, 'low_stock')}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: isLowStock ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                            color: isLowStock ? '#f59e0b' : 'var(--text-muted)',
                            border: isLowStock ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                            cursor: 'pointer'
                          }}
                        >
                          ● Low Stock
                        </button>

                        <button
                          onClick={() => updateProductStockStatus(p.id, 'out_of_stock')}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)',
                            color: isOutOfStock ? '#ef4444' : 'var(--text-muted)',
                            border: isOutOfStock ? '1px solid #ef4444' : '1px solid var(--border-glass)',
                            cursor: 'pointer'
                          }}
                        >
                          ● Sold Out
                        </button>
                      </div>
                    </div>

                    {/* Badge Toggles */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleProductBadge(p.id, 'isBestSeller')}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: p.isBestSeller ? 'rgba(255, 51, 102, 0.2)' : 'transparent',
                          color: p.isBestSeller ? '#ff3366' : 'var(--text-muted)',
                          border: p.isBestSeller ? '1px solid #ff3366' : '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Flame size={12} />
                        <span>{p.isBestSeller ? 'Hot / Best Seller' : '+ Set Best Seller'}</span>
                      </button>

                      <button
                        onClick={() => toggleProductBadge(p.id, 'isNew')}
                        style={{
                          flex: 1,
                          padding: '5px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: p.isNew ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                          color: p.isNew ? 'var(--accent)' : 'var(--text-muted)',
                          border: p.isNew ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Sparkles size={12} />
                        <span>{p.isNew ? 'New Season' : '+ Set New'}</span>
                      </button>
                    </div>

                    {/* Edit and Delete Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <button
                        onClick={() => setEditingProduct({ ...p })}
                        className="btn-premium btn-secondary-glass"
                        style={{ flex: 1, padding: '7px 0', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Edit2 size={13} />
                        <span>Edit Product Specs</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="btn-premium btn-secondary-glass"
                        style={{ padding: '7px 12px', fontSize: '0.78rem', color: '#ff3366' }}
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          TAB 4: CUSTOMERS DIRECTORY ("How many peoples order in my site")
          ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'customers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Customers Summary Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                Customer <span style={{ color: 'var(--accent)' }}>Directory</span>
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Direct ledger of every fan who has ordered on GoalWear. Complete with contact phone, delivery location, and lifetime spend.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unique Buyers</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{customersList.length}</div>
              </div>
              <div style={{ height: '36px', width: '1px', backgroundColor: 'var(--border-glass)' }} />
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Customer Spend</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)' }}>
                  {customersList.length > 0
                    ? Math.round(totalRevenue / customersList.length).toLocaleString()
                    : 0}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'white' }}>BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search customers by name, phone number, address..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Customer Name</th>
                  <th style={{ padding: '12px 8px' }}>Phone / WhatsApp</th>
                  <th style={{ padding: '12px 8px' }}>Primary Address</th>
                  <th style={{ padding: '12px 8px' }}>Total Orders</th>
                  <th style={{ padding: '12px 8px' }}>Lifetime BDT</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No customers recorded yet. When users place orders, their profile and contact information will appear here.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr
                      key={cust.id}
                      className="table-row-hover"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    >
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>{cust.name}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Latest order: {new Date(cust.lastOrderDate || Date.now()).toLocaleDateString('en-GB')}
                        </span>
                      </td>

                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{cust.phone}</span>
                          <a
                            href={`https://wa.me/88${(cust.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#25D366' }}
                            title="Open WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>
                          <a
                            href={`tel:${cust.phone}`}
                            style={{ color: 'var(--accent)' }}
                            title="Call customer"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      </td>

                      <td style={{ padding: '14px 8px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        {cust.address}
                      </td>

                      <td style={{ padding: '14px 8px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: cust.totalOrders > 1 ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                            color: cust.totalOrders > 1 ? 'var(--accent)' : 'white',
                            fontWeight: 800,
                            fontSize: '0.75rem'
                          }}
                        >
                          {cust.totalOrders} {cust.totalOrders > 1 ? 'Orders (VIP)' : 'Order'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 8px', fontWeight: 900, color: 'var(--accent)' }}>
                        {cust.totalSpent.toLocaleString()} BDT
                      </td>

                      <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedCustomerOrders(cust)}
                          className="btn-premium btn-secondary-glass"
                          style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                        >
                          View Order History
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          MODAL 1: ADD NEW JERSEY
          ────────────────────────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newProd) => {
            addProduct(newProd);
            setShowAddModal(false);
          }}
        />
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          MODAL 2: EDIT PRODUCT SPECS
          ────────────────────────────────────────────────────────────────────── */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updatedFields) => {
            updateProduct(editingProduct.id, updatedFields);
            setEditingProduct(null);
          }}
        />
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          MODAL 3: PRINT PACKING SLIP & INVOICE
          ────────────────────────────────────────────────────────────────────── */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          MODAL 4: CUSTOMER ORDER HISTORY DRILL-DOWN
          ────────────────────────────────────────────────────────────────────── */}
      {selectedCustomerOrders && (
        <CustomerHistoryModal
          customer={selectedCustomerOrders}
          onClose={() => setSelectedCustomerOrders(null)}
          onSelectOrder={(order) => {
            setSelectedCustomerOrders(null);
            setActiveTab('orders');
            setSelectedOrder(order);
          }}
        />
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        @media (min-width: 1100px) {
          .admin-orders-layout {
            grid-template-columns: 1.8fr 1.2fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-MODALS
// ─────────────────────────────────────────────────────────────────────────────

function AddProductModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Club Teams');
  const [price, setPrice] = useState('1499');
  const [originalPrice, setOriginalPrice] = useState('1899');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800');
  const [description, setDescription] = useState('Authentic official fan edition kit engineered with breathable aero-mesh performance fabric.');
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const presetImages = [
    { label: 'Real Madrid White', url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800' },
    { label: 'Barcelona Blaugrana', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800' },
    { label: 'Argentina Sky Blue', url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&q=80&w=800' },
    { label: 'Brazil Canary Yellow', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide a product title');
      return;
    }

    const id = `jersey-${Date.now()}`;
    const newProduct = {
      id,
      name,
      category,
      price: Number(price) || 1499,
      originalPrice: Number(originalPrice) || 1899,
      image: image || presetImages[0].url,
      description,
      stockStatus,
      inStock: stockStatus !== 'out_of_stock',
      stockCount: stockStatus === 'out_of_stock' ? 0 : 30,
      isBestSeller,
      isNew,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: {
        primary: '#112233',
        secondary: '#ffffff',
        accent: '#00ff88'
      },
      specs: {
        material: '100% Recycled AeroReady Polyester',
        fit: 'Athletic Matchday Fit',
        crest: 'Heat-Applied Silicon 3D Crest',
        origin: 'Imported Master Replica Grade A+'
      },
      rating: 5.0,
      reviews: []
    };

    onAdd(newProduct);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0c0e15',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px',
          padding: '28px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Add New <span style={{ color: 'var(--accent)' }}>Jersey Kit</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Jersey Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Manchester City 2024/25 Treble Home Kit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="Club Teams">Club Teams</option>
                <option value="National Teams">National Teams</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Initial Stock Status
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="in_stock">In Stock (Available)</option>
                <option value="low_stock">Low Stock (Alert)</option>
                <option value="out_of_stock">Out of Stock (Sold Out)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Selling Price (BDT)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Original Strikeout Price (BDT)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Jersey Image URL
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {presetImages.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: image === preset.url ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                    color: image === preset.url ? '#000' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'white', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
              />
              <span>Mark as Best Seller (Hot)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'white', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
              />
              <span>Mark as New Season</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-premium btn-secondary-glass"
              style={{ flex: 1, padding: '12px 0' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium btn-primary-glow"
              style={{ flex: 2, padding: '12px 0', fontWeight: 800 }}
            >
              Publish to Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditProductModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price || '');
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice || '');
  const [category, setCategory] = useState(product.category || 'Club Teams');
  const [description, setDescription] = useState(product.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      price: Number(price),
      originalPrice: Number(originalPrice),
      category,
      description
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#0c0e15',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Edit Product: <span style={{ color: 'var(--accent)' }}>{product.name}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Product Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Selling Price (BDT)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Original Price (BDT)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              <option value="Club Teams">Club Teams</option>
              <option value="National Teams">National Teams</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-premium btn-secondary-glass"
              style={{ flex: 1, padding: '12px 0' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium btn-primary-glow"
              style={{ flex: 2, padding: '12px 0', fontWeight: 800 }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvoiceModal({ order, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel printable-area"
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#0c0e15',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px',
          padding: '32px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              GOAL<span style={{ color: 'var(--accent)' }}>WEAR</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official Matchday Merchandise • Dhaka, Bangladesh</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>INVOICE / DISPATCH SLIP</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 800 }}>{order.id}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Date: {new Date(order.date || Date.now()).toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 0 20px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>
              Deliver To:
            </div>
            <div style={{ fontWeight: 800, color: 'white' }}>{order.customerName}</div>
            <div style={{ color: 'var(--text-secondary)' }}>{order.phone}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{order.address}</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>
              Payment Information:
            </div>
            <div>bKash Sender: <strong style={{ color: 'white' }}>{order.bkashNumber || 'N/A'}</strong></div>
            <div>Transaction ID: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{order.bkashTxnId}</strong></div>
            <div>Status: <strong style={{ color: 'var(--accent)' }}>{order.status}</strong></div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '8px 4px' }}>Item Description</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Size</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px 4px', color: 'white', fontWeight: 700 }}>{item.product?.name}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'center', color: 'var(--accent)', fontWeight: 800 }}>{item.size}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', color: 'white', fontWeight: 700 }}>
                    {((item.product?.price || 0) * (item.quantity || 1))} BDT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>{order.subtotal || order.total - 150} BDT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Delivery Fee (Paid bKash):</span>
              <span>150 BDT</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', color: 'white' }}>
              <span>Total Bill:</span>
              <span style={{ color: 'var(--accent)' }}>{order.total} BDT</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              Due on COD Delivery: {(Number(order.total || 0) - 150)} BDT
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn-premium btn-secondary-glass"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="btn-premium btn-primary-glow"
            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={16} />
            <span>Print Dispatch Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerHistoryModal({ customer, onClose, onSelectOrder }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#0c0e15',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: '16px',
          padding: '28px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Customer Profile: <span style={{ color: 'var(--accent)' }}>{customer.name}</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Phone: {customer.phone} • Total Spent: {customer.totalSpent.toLocaleString()} BDT
            </span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(customer.orders || []).map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="table-row-hover"
              style={{
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: 'white' }}>{order.id}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(order.date || Date.now()).toLocaleDateString('en-GB')} • {(order.items || []).length} items
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 800, color: 'white' }}>{order.total} BDT</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: order.status === 'Delivered' ? 'rgba(0,255,136,0.15)' : 'rgba(255,180,0,0.15)',
                    color: order.status === 'Delivered' ? 'var(--accent)' : '#ffb400'
                  }}
                >
                  {order.status}
                </span>
                <Eye size={14} className="text-muted" />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-premium btn-secondary-glass" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
