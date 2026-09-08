import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import TunnelPreloader from './components/TunnelPreloader';
import MagneticCursor from './components/MagneticCursor';
import { ShieldCheck, ArrowRight } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import NationalTeams from './pages/NationalTeams';
import ClubTeams from './pages/ClubTeams';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import SizeGuide from './pages/SizeGuide';
import TrackOrder from './pages/TrackOrder';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ReturnPolicy from './pages/ReturnPolicy';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import ProductDetails from './pages/ProductDetails';
import AdminPanel from './pages/AdminPanel';
import AccountAuth from './pages/AccountAuth';
import CustomerOrders from './pages/CustomerOrders';

// ScrollToTop on path or search param change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
}

export default function App() {
  const { isAdminLoggedIn } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Hash route fallback redirection (e.g. #/shop -> /shop)
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const target = window.location.hash.slice(1);
      navigate(target, { replace: true });
    }
  }, [navigate]);

  // Secret Owner Access Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Lenis Smooth Scroll Engine */}
      <SmoothScroll />

      {/* First-load Tunnel Walk Cinematic Preloader */}
      <TunnelPreloader />

      {/* Desktop Magnetic Aim Cursor */}
      <MagneticCursor />

      {/* Scroll restoration */}
      <ScrollToTop />

      {/* Stadium Ambient Lights */}
      <div className="stadium-glow-container">
        <div className="spotlight spotlight-1"></div>
        <div className="spotlight spotlight-2"></div>
        <div className="spotlight spotlight-3"></div>
      </div>
      
      {/* Navigation: Customer store navbar only rendered outside the admin workspace */}
      {!isAdminRoute && <Navbar />}
      
      {/* Main Pages Router wrapper */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/national-teams" element={<NationalTeams />} />
          <Route path="/national" element={<Navigate to="/national-teams" replace />} />
          <Route path="/club-teams" element={<ClubTeams />} />
          <Route path="/club" element={<Navigate to="/club-teams" replace />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/sizeguide" element={<Navigate to="/size-guide" replace />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track" element={<Navigate to="/track-order" replace />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<Confirmation />} />
          <Route path="/order-confirmation/:orderId" element={<Confirmation />} />
          <Route path="/confirmation" element={<Navigate to="/order-confirmation" replace />} />
          <Route path="/confirmation/:orderId" element={<Confirmation />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/refund-policy" element={<Navigate to="/return-policy" replace />} />
          <Route path="/returns" element={<Navigate to="/return-policy" replace />} />
          
          {/* Customer Account & Order History */}
          <Route path="/account" element={<AccountAuth />} />
          <Route path="/account/login" element={<AccountAuth />} />
          <Route path="/account/orders" element={<CustomerOrders />} />
          <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
          
          {/* Dedicated Admin Portal - Protected by Supabase Auth */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer: Customer store footer only rendered outside the admin workspace */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
