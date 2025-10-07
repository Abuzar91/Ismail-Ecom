import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'md', className = '', showText = true, variant = 'default' }) => {
  const sizes = {
    sm: { container: 'h-8 w-8', text: 'text-lg', icon: 'text-sm' },
    md: { container: 'h-10 w-10', text: 'text-xl', icon: 'text-lg' },
    lg: { container: 'h-16 w-16', text: 'text-3xl', icon: 'text-2xl' },
    xl: { container: 'h-20 w-20', text: 'text-4xl', icon: 'text-3xl' }
  };

  const variants = {
    default: 'from-pink-500 to-rose-500',
    light: 'from-pink-400 to-rose-400',
    dark: 'from-pink-600 to-rose-600',
    white: 'bg-white text-pink-600 border-2 border-pink-200'
  };

  const currentSize = sizes[size];
  const gradientClass = variant === 'white' ? variants.white : `bg-gradient-to-r ${variants[variant]}`;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${currentSize.container} ${gradientClass} rounded-full flex items-center justify-center shadow-lg`}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`${currentSize.icon} font-bold ${variant === 'white' ? 'text-pink-600' : 'text-white'}`}
        >
          ✦
        </motion.div>
      </motion.div>
      
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${currentSize.text} font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent`}
        >
          Sitara
        </motion.span>
      )}
    </div>
  );
};

export default Logo;