import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumb = ({ customItems = [] }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Define route mappings
  const routeMap = {
    products: 'Products',
    product: 'Product Details',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    orders: 'Track Orders',
    about: 'About Us',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    auth: 'Authentication',
    admin: 'Admin',
    dashboard: 'Dashboard',
    users: 'Users'
  };

  // Use custom items if provided, otherwise generate from pathname
  const breadcrumbItems = customItems.length > 0 ? customItems : [
    { label: 'Home', path: '/' },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: routeMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
        path: routeTo
      };
    })
  ];

  if (breadcrumbItems.length <= 1) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center space-x-2 text-sm mb-6 bg-luxury-charcoal/80 border border-luxury-gold/20 px-6 py-3 rounded-sm shadow-lg backdrop-blur-sm"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index === 0 && (
            <Home className="w-4 h-4 text-luxury-gold/70 mr-1" />
          )}
          
          {index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.path}
              className="text-gray-300 hover:text-luxury-gold transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-luxury-pearl font-semibold">{item.label}</span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-luxury-gold/50" />
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;