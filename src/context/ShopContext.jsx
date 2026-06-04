import React, { createContext, useState, useEffect } from 'react';
import { products } from '../data/products';

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

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('goalwear_orders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    // Seed database with a sample order for demonstration/admin convenience
    const initialSeed = [
      {
        id: "GW-58492",
        date: "2026-06-02 18:30",
        customerName: "Rohan Ahmed",
        phone: "01712345678",
        address: "House 24, Road 5, Dhanmondi, Dhaka",
        bkashNumber: "01712345678",
        bkashTxnId: "BKD839SF2G",
        items: [
          {
            product: products[0],
            size: "M",
            quantity: 1
          },
          {
            product: products[1],
            size: "L",
            quantity: 1
          }
        ],
        subtotal: 8050,
        deliveryCharge: 150,
        total: 8200,
        status: "Pending verification"
      }
    ];
    localStorage.setItem('goalwear_orders', JSON.stringify(initialSeed));
    return initialSeed;
  });

  // Dynamic reviews list
  const [customReviews, setCustomReviews] = useState(() => {
    const savedReviews = localStorage.getItem('goalwear_custom_reviews');
    return savedReviews ? JSON.parse(savedReviews) : {};
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('goalwear_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goalwear_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('goalwear_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('goalwear_custom_reviews', JSON.stringify(customReviews));
  }, [customReviews]);

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

  // Place order
  const placeOrder = (customerDetails) => {
    const orderId = `GW-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = getCartTotal();
    const deliveryCharge = 150; // Standard delivery charge in BDT
    const total = subtotal + deliveryCharge;
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: orderId,
      date: dateStr,
      customerName: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
      bkashNumber: customerDetails.bkashNumber,
      bkashTxnId: customerDetails.bkashTxnId,
      items: [...cart],
      subtotal,
      deliveryCharge,
      total,
      status: "Pending verification"
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    setView('confirmation', { orderId });
    return orderId;
  };

  // Admin Verification Panel operations
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
