import React, { createContext, useState, useEffect } from 'react';
import { products } from '../data/products';
import { supabase } from '../supabaseClient';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  // Navigation View State (SPA Router)
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState(null); // Used for passing ID like selected product

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

  // Converts a Supabase row (snake_case) into the shape the rest of the app expects (camelCase)
  const mapRowToOrder = (row) => ({
    id: row.id,
    date: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    bkashNumber: row.bkash_number,
    bkashTxnId: row.bkash_txn_id,
    items: row.items,
    subtotal: row.subtotal,
    deliveryCharge: row.delivery_charge,
    total: row.total,
    status: row.status
  });

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Most likely: not logged in as admin, so RLS is blocking reads.
      // This is expected on the public storefront - orders simply stay empty there.
      console.log('Orders fetch skipped (not authenticated or no rows):', error.message);
      setOrders([]);
    } else {
      setOrders(data.map(mapRowToOrder));
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Refetch whenever auth state changes (e.g. admin logs in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchOrders();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Routing navigation helper
  const setView = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product, size, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, size, quantity }];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const updateCartQty = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
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

  // Place order - now writes to Supabase instead of local state/localStorage
  const placeOrder = async (customerDetails) => {
    const orderId = `GW-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = getCartTotal();
    const deliveryCharge = 150; // Standard delivery charge in BDT
    const total = subtotal + deliveryCharge;

    const newOrderRow = {
      id: orderId,
      customer_name: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
      bkash_number: customerDetails.bkashNumber,
      bkash_txn_id: customerDetails.bkashTxnId,
      items: cart,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      status: 'Pending verification'
    };

    const { error } = await supabase.from('orders').insert(newOrderRow);

    if (error) {
      console.error('Failed to place order:', error.message);
      alert('Something went wrong placing your order. Please try again.');
      return null;
    }

    clearCart();
    setView('confirmation', { orderId });
    return orderId;
  };

  // Admin Verification Panel operations - now updates Supabase
  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistically update local state so the UI feels instant
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status:', error.message);
      // Roll back by refetching the real data from the server
      fetchOrders();
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        viewParams,
        setView,
        cart,
        wishlist,
        orders,
        ordersLoading,
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
        updateOrderStatus
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
