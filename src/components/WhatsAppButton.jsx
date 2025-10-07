import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const whatsappNumber = "+923001234567"; // Your WhatsApp number
  const message = "Hi! I'm interested in your luxury fragrance collection. Can you help me?";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Animated pulse rings */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="w-full h-full bg-luxury-gold/30 rounded-full"></div>
      </motion.div>

      {/* Main button */}
      <motion.button
        onClick={handleWhatsAppClick}
        className="relative bg-black border-2 border-luxury-gold text-luxury-gold p-4 rounded-full shadow-lg hover:shadow-luxury-gold/50 transition-all duration-300 hover:bg-luxury-gold hover:text-black group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <MessageCircle size={24} className="relative z-10" />
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full top-1/2 -translate-y-1/2 mr-4 pointer-events-none"
      >
        <div className="bg-luxury-charcoal border border-luxury-gold/30 text-luxury-pearl px-4 py-2 rounded-sm shadow-lg backdrop-blur-sm whitespace-nowrap text-sm font-medium">
          Chat with us on WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-luxury-charcoal border-r border-b border-luxury-gold/30"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppButton;