import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Settings,
  BarChart3,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../Logo"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Banners', href: '/admin/banners', icon: Settings },
    { name: 'Collections', href: '/admin/collections', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-charcoal border-r border-luxury-gold/20 shadow-2xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar header with gradient accent */}
        <div className="relative h-20 px-6 flex items-center justify-between border-b border-luxury-gold/20 bg-gradient-to-r from-luxury-black via-luxury-charcoal to-luxury-black">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
          
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-yellow-600 rounded-sm flex items-center justify-center shadow-lg shadow-luxury-gold/20">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="font-serif font-bold text-xl bg-gradient-to-r from-luxury-gold via-yellow-400 to-luxury-gold bg-clip-text text-transparent">
                  Noir Essence
                </span>
                <span className="block text-xs text-gray-400 font-medium">Admin Panel</span>
              </div>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-luxury-gold hover:bg-luxury-gold/10 p-2 rounded-sm transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info card */}
        <div className="p-6 border-b border-luxury-gold/20">
          <div className="bg-luxury-black border border-luxury-gold/30 rounded-sm p-4 hover:border-luxury-gold/50 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-yellow-600 rounded-sm flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg font-serif">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-pearl">{user?.name}</p>
                <p className="text-xs text-luxury-gold font-medium uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-luxury-gold/10 text-luxury-gold border-l-2 border-luxury-gold shadow-lg shadow-luxury-gold/10'
                      : 'text-gray-400 hover:bg-luxury-black hover:text-luxury-pearl border-l-2 border-transparent hover:border-luxury-gold/30'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-luxury-gold' : 'text-gray-500 group-hover:text-luxury-gold'
                    }`}
                  />
                  <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-luxury-gold rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-luxury-gold/20 bg-luxury-black/50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-sm hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all duration-300 border border-transparent hover:border-luxury-gold/30"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar for mobile */}
        <div className="bg-luxury-charcoal border-b border-luxury-gold/20 lg:hidden shadow-lg">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-luxury-gold hover:bg-luxury-gold/10 p-2 rounded-sm transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-luxury-gold to-yellow-600 rounded-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="font-serif font-bold text-lg bg-gradient-to-r from-luxury-gold via-yellow-400 to-luxury-gold bg-clip-text text-transparent">
                Noir Essence
              </span>
            </Link>
            
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page content with luxury background */}
        <main className="flex-1 overflow-y-auto bg-luxury-black">
          <div className="relative min-h-full">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/10"></div>
            </div>
            
            {/* Content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;