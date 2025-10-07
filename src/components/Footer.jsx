import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-luxury-black border-t border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-luxury-gold tracking-wider">NOIR ESSENCE</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting timeless fragrances for the discerning individual.
              Experience luxury redefined through the art of perfumery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-luxury-gold transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-luxury-gold transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-luxury-gold transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold text-luxury-pearl mb-6">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Midnight Collection
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Golden Hour
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Essence Pure
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  All Fragrances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold text-luxury-pearl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-luxury-gold transition-colors text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-semibold text-luxury-pearl mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-luxury-gold" />
                <span className="text-gray-400 text-sm">+92-300-1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-luxury-gold" />
                <span className="text-gray-400 text-sm">contact@noiressence.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-luxury-gold mt-1" />
                <span className="text-gray-400 text-sm">
                  Luxury Avenue, Suite 100<br />
                  Karachi, Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-luxury-gold/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Noir Essence. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-4 md:mt-0">
            Crafted with <Sparkles size={16} className="text-luxury-gold mx-1" /> for perfume connoisseurs
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
