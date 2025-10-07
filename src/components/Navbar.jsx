import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Fragrances', href: '/products', current: location.pathname === '/products' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ];

  return (
    <nav className="bg-luxury-black border-b border-luxury-gold/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-luxury-gold tracking-wider">NOIR ESSENCE</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                    item.current
                      ? 'text-luxury-gold border-b-2 border-luxury-gold'
                      : 'text-gray-300 hover:text-luxury-gold hover:border-b-2 hover:border-luxury-gold/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-luxury-gold transition-colors">
              <Search size={20} />
            </button>

            <Link
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-luxury-gold transition-colors"
            >
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-3">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="p-2 text-gray-300 hover:text-luxury-gold transition-colors"
                      title="Admin Dashboard"
                    >
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  <span className="text-sm text-gray-300">Hi, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-400 hover:text-luxury-gold transition-colors px-3 py-1 border border-gray-600 hover:border-luxury-gold rounded-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 text-gray-300 hover:text-luxury-gold transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-luxury-gold transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-luxury-charcoal border-t border-luxury-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 text-base font-medium transition-all duration-200 ${
                  item.current
                    ? 'bg-luxury-gold/10 text-luxury-gold border-l-4 border-luxury-gold'
                    : 'text-gray-300 hover:text-luxury-gold hover:bg-luxury-gold/5 border-l-4 border-transparent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!user && (
              <Link
                to="/auth"
                className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all duration-200 border-l-4 border-transparent"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
