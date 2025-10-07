import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false, minimal = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (minimal) {
    return (
      <div className="flex items-center justify-center p-2">
        <motion.div
          className="w-5 h-5 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Outer rotating ring */}
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          className={`absolute inset-0 m-auto ${sizes[size]} bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/10 rounded-full flex items-center justify-center backdrop-blur-sm`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Center sparkle icon */}
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="text-luxury-gold" size={size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 20 : 24} />
          </motion.div>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 120, 240].map((angle, index) => (
          <motion.div
            key={index}
            className="absolute w-1.5 h-1.5 bg-luxury-gold rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              rotate: [angle, angle + 360],
              x: [0, 30 * Math.cos((angle * Math.PI) / 180), 0],
              y: [0, 30 * Math.sin((angle * Math.PI) / 180), 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3
            }}
          />
        ))}
      </div>
      
      {text && (
        <div className="space-y-2">
          <motion.p
            className="text-luxury-pearl font-serif text-lg font-semibold text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
          
          {/* Loading dots */}
          <div className="flex items-center justify-center space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-luxury-black bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-luxury-gold to-transparent"></div>
          <div className="absolute top-0 left-0 w-0.5 h-16 bg-gradient-to-b from-luxury-gold to-transparent"></div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-0 right-0 w-16 h-0.5 bg-gradient-to-l from-luxury-gold to-transparent"></div>
          <div className="absolute top-0 right-0 w-0.5 h-16 bg-gradient-to-b from-luxury-gold to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32">
          <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-luxury-gold to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-0.5 h-16 bg-gradient-to-t from-luxury-gold to-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-0 right-0 w-16 h-0.5 bg-gradient-to-l from-luxury-gold to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-0.5 h-16 bg-gradient-to-t from-luxury-gold to-transparent"></div>
        </div>

        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;