import React, { useContext, useEffect } from 'react';
import { ShopContext } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import ProductDetails from './pages/ProductDetails';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const { currentView } = useContext(ShopContext);

  // Trigger smooth scroll on route switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'national':
        return <NationalTeams />;
      case 'club':
        return <ClubTeams />;
      case 'new-arrivals':
        return <NewArrivals />;
      case 'best-sellers':
        return <BestSellers />;
      case 'sizeguide':
        return <SizeGuide />;
      case 'track':
        return <TrackOrder />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'wishlist':
        return <Wishlist />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'confirmation':
        return <Confirmation />;
      case 'product-details':
        return <ProductDetails />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Stadium Ambient Lights */}
      <div className="stadium-glow-container">
        <div className="spotlight spotlight-1"></div>
        <div className="spotlight spotlight-2"></div>
        <div className="spotlight spotlight-3"></div>
      </div>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Pages Router wrapper */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderPage()}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
