import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

const AnnouncementBar = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!announcements || announcements.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements]);

  if (!isVisible || !announcements || announcements.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-luxury-gold via-yellow-500 to-luxury-gold overflow-hidden">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-black mr-3 flex-shrink-0" />

          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-center"
              >
                <span className="font-bold text-black mr-2">
                  {announcements[currentIndex].title}
                </span>
                <span className="text-black/90">
                  {announcements[currentIndex].message}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="ml-3 p-1 text-black/70 hover:text-black transition-colors flex-shrink-0"
            aria-label="Close announcement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {announcements.length > 1 && (
          <div className="flex justify-center mt-2 space-x-1.5">
            {announcements.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-black'
                    : 'w-1 bg-black/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>
    </div>
  );
};

export default AnnouncementBar;
