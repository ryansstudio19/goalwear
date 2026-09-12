import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { products as defaultProducts } from '../data/products';
import { supabase } from '../supabaseClient';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation View State (SPA Router)
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState(null); // Used for passing ID like selected product

  // Track Admin Supabase session for privileged owner UI
  const [adminSession, setAdminSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync currentView with location.pathname for active states
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentView('home');
    else if (path.startsWith('/shop')) setCurrentView('shop');
    else if (path.startsWith('/national')) setCurrentView('national');
    else if (path.startsWith('/club')) setCurrentView('club');
    else if (path.startsWith('/new-arrivals')) setCurrentView('new-arrivals');
    else if (path.startsWith('/best-sellers')) setCurrentView('best-sellers');
    else if (path.startsWith('/size-guide') || path.startsWith('/sizeguide')) setCurrentView('sizeguide');
    else if (path.startsWith('/track')) setCurrentView('track');
    else if (path.startsWith('/wishlist')) setCurrentView('wishlist');
    else if (path.startsWith('/cart')) setCurrentView('cart');
    else if (path.startsWith('/checkout')) setCurrentView('checkout');
    else if (path.startsWith('/order-confirmation') || path.startsWith('/confirmation')) setCurrentView('confirmation');
    else if (path.startsWith('/product')) setCurrentView('product-details');
    else if (path.startsWith('/about')) setCurrentView('about');
    else if (path.startsWith('/contact')) setCurrentView('contact');
    else if (path.startsWith('/faq')) setCurrentView('faq');
    else if (path.startsWith('/admin')) setCurrentView('admin');
  }, [location.pathname]);

  // ── Products Inventory State ──────────────────────────────────────────────
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('goalwear_products_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load stored products catalog:', e);
    }
    return defaultProducts.map((p) => ({
      ...p,
      inStock: p.inStock ?? true,
      stockStatus: p.stockStatus || 'in_stock', // 'in_stock' | 'low_stock' | 'out_of_stock'
      stockCount: p.stockCount ?? 30
    }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('goalwear_products_catalog', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products catalog:', e);
    }
  }, [products]);

  // E-commerce state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('goalwear_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('goalwear_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Orders now live in Supabase, not localStorage.
  // Empty array until the first fetch completes.
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Dynamic reviews list
  const [customReviews, setCustomReviews] = useState(() => {
    const savedReviews = localStorage.getItem('goalwear_custom_reviews');
    return savedReviews ? JSON.parse(savedReviews) : {};
  });

  // Sync cart/wishlist/reviews to local storage (these stay local, no need for a backend)
  useEffect(() => {
    localStorage.setItem('goalwear_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goalwear_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('goalwear_custom_reviews', JSON.stringify(customReviews));
  }, [customReviews]);

  // --- Supabase orders: fetch + realtime sync ---

  // Standardizes any status string into the canonical Admin Panel and tracking statuses:
  // 'Pending verification' | 'bKash Verified' | 'Processing' | 'Shipped' | 'Delivered' | 'Rejected'
  const normalizeOrderStatus = (rawStatus) => {
    if (!rawStatus) return 'Pending verification';
    const s = String(rawStatus).trim();
    const lower = s.toLowerCase().replace(/[\s_-]+/g, ' ');
    if (lower === 'bkash verified' || lower === 'verified' || lower === 'paid' || lower === 'bkash_verified') {
      return 'bKash Verified';
    }
    if (lower === 'processing' || lower === 'packaging' || lower === 'in processing') {
      return 'Processing';
    }
    if (lower === 'shipped' || lower === 'dispatched' || lower === 'in transit') {
      return 'Shipped';
    }
    if (lower === 'delivered' || lower === 'completed') {
      return 'Delivered';
    }
    if (lower === 'rejected' || lower === 'cancelled' || lower === 'canceled' || lower === 'fake') {
      return 'Rejected';
    }
    if (lower === 'pending verification' || lower === 'pending' || lower === 'pending_verification') {
      return 'Pending verification';
    }
    return s;
  };

  // Converts a Supabase row (snake_case) into the shape the rest of the app expects (camelCase)
  const mapRowToOrder = (row) => ({
    id: row.order_number || row.id,
    orderNumber: row.order_number || row.id,
    customerId: row.customer_id || null,
    date: row.created_at,
    customerName: row.shipping_name || row.customer_name || 'Anonymous Fan',
    phone: row.shipping_phone || row.phone || '',
    address: row.shipping_address || row.address || '',
    city: row.shipping_city || row.city || 'Dhaka',
    bkashNumber: row.bkash_number || '',
    bkashTxnId: row.bkash_txn_id || row.bkashTrxId || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    deliveryCharge: Number(row.delivery_charge ?? 120),
    total: Number(row.total || 0),
    status: normalizeOrderStatus(row.status),
    paymentStatus: row.payment_status || 'PENDING_VERIFICATION'
  });

  const fetchOrders = async () => {
    setOrdersLoading(true);
    let combined = [];

    // Fetch from Supabase / mock orders storage
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        combined = data.map(mapRowToOrder);
      }
    } catch (err) {
      console.warn('Orders fetch error from Supabase/storage:', err);
    }

    // Sort newest orders first
    combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    setOrders(combined);
    setOrdersLoading(false);
  };

  useEffect(() => {
    // 1. Initial full fetch
    fetchOrders();

    // 2. Refetch whenever Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchOrders();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ── Customer Directory aggregation ────────────────────────────────────────
  // Aggregates unique customers across all orders so the admin can view buyers
  const customersList = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const phoneKey = (order.phone || '').trim();
      const nameKey = (order.customerName || 'Anonymous Fan').trim();
      const identifier = phoneKey || nameKey.toLowerCase();
      if (!identifier) return;

      if (!customerMap.has(identifier)) {
        customerMap.set(identifier, {
          id: identifier,
          name: nameKey,
          phone: order.phone || 'N/A',
          address: order.address || 'N/A',
          bkashNumber: order.bkashNumber || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          firstOrderDate: order.date,
          lastOrderDate: order.date,
          lastOrderStatus: order.status,
          orders: []
        });
      }

      const c = customerMap.get(identifier);
      c.totalOrders += 1;
      c.totalSpent += Number(order.total || 0);
      c.orders.push(order);

      const orderTimestamp = new Date(order.date || 0).getTime();
      const lastTimestamp = new Date(c.lastOrderDate || 0).getTime();
      if (orderTimestamp >= lastTimestamp) {
        c.lastOrderDate = order.date;
        c.lastOrderStatus = order.status;
        if (order.address && order.address !== 'N/A') c.address = order.address;
        if (order.customerName && order.customerName !== 'Anonymous Fan') c.name = order.customerName;
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Routing navigation helper with real URL paths
  const setView = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);

    switch (view) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        if (params?.search) {
          navigate(`/shop?search=${encodeURIComponent(params.search)}`);
        } else if (params?.category) {
          navigate(`/shop?category=${encodeURIComponent(params.category)}`);
        } else {
          navigate('/shop');
        }
        break;
      case 'national':
        navigate('/national-teams');
        break;
      case 'club':
        navigate('/club-teams');
        break;
      case 'new-arrivals':
        navigate('/new-arrivals');
        break;
      case 'best-sellers':
        navigate('/best-sellers');
        break;
      case 'sizeguide':
        navigate('/size-guide');
        break;
      case 'track':
        if (params?.orderId) {
          navigate(`/track-order?id=${encodeURIComponent(params.orderId)}`);
        } else {
          navigate('/track-order');
        }
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      case 'confirmation':
        if (params?.orderId) {
          navigate(`/order-confirmation/${encodeURIComponent(params.orderId)}`);
        } else {
          navigate('/order-confirmation');
        }
        break;
      case 'product-details':
        if (params?.productId) {
          navigate(`/product/${encodeURIComponent(params.productId)}`);
        } else {
          navigate('/shop');
        }
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Product Inventory Actions ─────────────────────────────────────────────
  const updateProductStockStatus = (productId, stockStatus) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stockStatus,
              inStock: stockStatus !== 'out_of_stock',
              stockCount: stockStatus === 'out_of_stock' ? 0 : (p.stockCount && p.stockCount > 0 ? p.stockCount : 20)
            }
          : p
      )
    );
  };

  const toggleProductBadge = (productId, badgeField) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, [badgeField]: !p[badgeField] } : p
      )
    );
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
  };

  const addProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const resetProductsToDefault = () => {
    const initialized = defaultProducts.map((p) => ({
      ...p,
      inStock: true,
      stockStatus: 'in_stock',
      stockCount: 30
    }));
    setProducts(initialized);
    localStorage.removeItem('goalwear_products_catalog');
  };

  // Cart operations with 3D Customization Support (Player Name, Number & Kit Edition)
  const getItemKey = (item) => {
    const custKey = item.customization
      ? `${item.customization.customName || ''}-${item.customization.customNumber || ''}-${item.customization.colorway || ''}`
      : 'standard';
    return `${item.product.id}-${item.size}-${custKey}`;
  };

  const addToCart = (product, size, quantity = 1, customization = null) => {
    setCart((prevCart) => {
      const targetKey = getItemKey({ product, size, customization });
      const existingItemIndex = prevCart.findIndex(
        (item) => getItemKey(item) === targetKey
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, size, quantity, customization }];
      }
    });
  };

  const removeFromCart = (productId, size, customization = null) => {
    setCart((prevCart) => {
      if (!customization) {
        return prevCart.filter((item) => !(item.product.id === productId && item.size === size));
      }
      const targetKey = getItemKey({ product: { id: productId }, size, customization });
      return prevCart.filter((item) => getItemKey(item) !== targetKey);
    });
  };

  const updateCartQty = (productId, size, quantity, customization = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, customization);
      return;
    }
    const targetKey = getItemKey({ product: { id: productId }, size, customization });
    setCart((prevCart) =>
      prevCart.map((item) => {
        const match = customization
          ? getItemKey(item) === targetKey
          : item.product.id === productId && item.size === size;
        return match ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  // Reviews operations
  const addReview = (productId, review) => {
    setCustomReviews((prev) => {
      const existingReviews = prev[productId] || [];
      return {
        ...prev,
        [productId]: [review, ...existingReviews]
      };
    });
  };

  // Place order - validates cart against authoritative catalog then uses atomic stored procedure
  const placeOrder = async (customerDetails) => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return null;
    }

    // Server-side / Authoritative Cart Validation against master products
    for (const item of cart) {
      const dbProduct = products.find((p) => p.id === item.product.id);
      if (!dbProduct) {
        alert(`Product "${item.product.name}" is no longer available in the catalog.`);
        return null;
      }
      if (dbProduct.inStock === false || dbProduct.stockStatus === 'out_of_stock') {
        alert(`Sorry, "${dbProduct.name}" is currently out of stock.`);
        return null;
      }
      // Re-assert authoritative price to prevent client-side DOM/state manipulation
      item.product.price = Number(dbProduct.price);
    }

    const orderId = `GW-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const deliveryCharge = 120; // Standard bKash delivery charge in BDT
    const total = subtotal + deliveryCharge;

    // First attempt to invoke atomic stored procedure if connected to PostgreSQL
    let atomicSucceeded = false;
    let finalOrderId = orderId;

    try {
      const itemsPayload = cart.map(item => ({
        variant_id: item.variantId || item.product.id,
        product_id: item.product.id,
        product_name: item.product.name,
        size: item.size,
        price: item.product.price,
        quantity: item.quantity
      }));

      const { data: rpcData, error: rpcError } = await supabase.rpc('place_order_atomic', {
        p_customer_id: customerDetails.customerId || null,
        p_shipping_name: customerDetails.name,
        p_shipping_phone: customerDetails.phone,
        p_shipping_address: customerDetails.address,
        p_shipping_city: customerDetails.city || 'Dhaka',
        p_bkash_number: customerDetails.bkashNumber,
        p_bkash_txn_id: customerDetails.bkashTxnId,
        p_customer_notes: customerDetails.notes || '',
        p_items: itemsPayload
      });

      if (!rpcError && rpcData && rpcData.order_number) {
        atomicSucceeded = true;
        finalOrderId = rpcData.order_number;
      }
    } catch (rpcErr) {
      console.warn('Atomic RPC skipped or pending schema deployment, using direct orders insert:', rpcErr);
    }

    // Prepare clean serializable order items array for cross-device persistence
    const itemsForStorage = cart.map((item) => ({
      product: {
        id: item.product?.id || 'item',
        name: item.product?.name || 'GoalWear Jersey Kit',
        price: Number(item.product?.price || 0),
        image: item.product?.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop'
      },
      size: item.size || 'M',
      quantity: Number(item.quantity || 1),
      customization: item.customization || null
    }));

    if (!atomicSucceeded) {
      const newOrderRow = {
        id: finalOrderId,
        order_number: finalOrderId,
        customer_id: customerDetails.customerId || null,
        customer_name: customerDetails.name,
        shipping_name: customerDetails.name,
        phone: customerDetails.phone,
        shipping_phone: customerDetails.phone,
        address: customerDetails.address,
        shipping_address: customerDetails.address,
        city: customerDetails.city || 'Dhaka',
        shipping_city: customerDetails.city || 'Dhaka',
        bkash_number: customerDetails.bkashNumber,
        bkash_txn_id: customerDetails.bkashTxnId,
        items: itemsForStorage,
        subtotal,
        delivery_charge: deliveryCharge,
        total,
        status: 'PENDING',
        payment_status: 'PENDING_VERIFICATION',
        created_at: new Date().toISOString()
      };

      try {
        const { error } = await supabase.from('orders').insert(newOrderRow);
        if (error) {
          console.warn('Supabase local/mock order store note:', error.message);
        }
      } catch (insertErr) {
        console.warn('Direct order store note:', insertErr);
      }
    }

    // Refresh orders in context
    await fetchOrders();

    clearCart();
    setView('confirmation', { orderId: finalOrderId });
    return finalOrderId;
  };

  // Admin Verification Panel operations - updates Supabase in real-time
  const updateOrderStatus = async (orderId, newStatus) => {
    // Canonicalize status
    const canonicalStatus = normalizeOrderStatus(newStatus);

    // Optimistically update local state so UI feels instant
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: canonicalStatus } : order
      )
    );

    // Update in Supabase / mock store
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: canonicalStatus })
        .eq('id', orderId);

      if (error) {
        console.warn('Supabase update order status:', error.message);
      }
    } catch (err) {
      console.warn('Supabase status update note:', err);
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.error('Failed to delete order from Supabase/storage:', err);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        viewParams,
        setView,
        products,
        updateProductStockStatus,
        toggleProductBadge,
        updateProduct,
        addProduct,
        deleteProduct,
        resetProductsToDefault,
        cart,
        wishlist,
        adminSession,
        isAdminLoggedIn: Boolean(adminSession),
        orders,
        ordersLoading,
        customersList,
        refetchOrders: fetchOrders,
        customReviews,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        getCartTotal,
        getCartCount,
        toggleWishlist,
        addReview,
        placeOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

