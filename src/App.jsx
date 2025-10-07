import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminUsers from './pages/admin/AdminUsers';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminRoute from './components/AdminRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Loading Context
const LoadingContext = React.createContext();

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingSpinner fullScreen text="Loading..." />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => React.useContext(LoadingContext);
function App() {
  return (
    <>
      <Helmet>
        <title>Noir Essence - Luxury Perfume Collection | Premium Fragrances</title>
        <meta name="description" content="Discover Noir Essence's exclusive luxury perfume collection. Immerse yourself in sophisticated fragrances crafted for the discerning individual. Experience timeless elegance." />
      </Helmet>
      <Router>
        <AuthProvider>
          <LoadingProvider>
            <CartProvider>
              <div className="min-h-screen bg-luxury-black">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<><Navbar /><HomePage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/product/:id" element={<><Navbar /><ProductDetailPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/cart" element={<><Navbar /><CartPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/checkout" element={<><Navbar /><CheckoutPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/order-success" element={<><Navbar /><OrderSuccessPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/about" element={<><Navbar /><AboutPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /><WhatsAppButton /></>} />
                  <Route path="/auth" element={<><Navbar /><AuthPage /><Footer /></>} />
                  
                  {/* Admin Routes with Layout */}
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/banners" element={<AdminRoute><AdminLayout><AdminBanners /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/announcements" element={<AdminRoute><AdminLayout><AdminAnnouncements /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
                </Routes>
                <Toaster position="top-right" />
              </div>
            </CartProvider>
          </LoadingProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;