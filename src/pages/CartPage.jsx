import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Sparkles, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (productId, change) => {
    const item = items.find(item => item._id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-luxury-gold/10 border-2 border-luxury-gold/30 rounded-sm mb-8">
              <ShoppingBag className="w-16 h-16 text-luxury-gold" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-pearl mb-4">
              Your Cart is Empty
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Begin your journey into luxury. Explore our exclusive collection of handcrafted fragrances.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-4 bg-black border-2 border-luxury-gold text-luxury-gold font-semibold rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50"
            >
              <Sparkles className="mr-2" size={20} />
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-6 backdrop-blur-sm">
              <Crown className="w-4 h-4 mr-2" />
              Luxury Cart Experience
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-luxury-pearl mb-4">
              Your Selection
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-8">
              {items.length} exquisite {items.length === 1 ? 'fragrance' : 'fragrances'} awaiting you
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-luxury-gold hover:text-yellow-400 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-6 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm group"
                >
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.images?.[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent"></div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-luxury-pearl mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2 max-w-md">
                            {item.description}
                          </p>
                          <p className="text-2xl font-serif font-bold text-luxury-gold">
                            Rs. {item.price?.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-gray-400 hover:text-luxury-gold border border-luxury-gold/20 hover:border-luxury-gold/50 rounded-sm transition-all duration-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400 font-medium">Quantity:</span>
                          <div className="flex items-center border border-luxury-gold/30 rounded-sm bg-luxury-charcoal/50 backdrop-blur-sm">
                            <button
                              onClick={() => handleQuantityChange(item._id, -1)}
                              className="p-3 hover:bg-luxury-gold/10 transition-colors text-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-6 py-3 font-semibold text-luxury-pearl min-w-[4rem] text-center border-x border-luxury-gold/30">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
                              className="p-3 hover:bg-luxury-gold/10 transition-colors text-luxury-gold"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                          <p className="text-2xl font-serif font-bold text-luxury-gold">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 sticky top-8 backdrop-blur-sm"
              >
                <h2 className="font-serif text-2xl font-bold text-luxury-pearl mb-8">
                  Order Summary
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold">Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-luxury-gold font-semibold">Complimentary</span>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent"></div>
                  <div className="flex justify-between">
                    <span className="font-serif text-xl font-bold text-luxury-pearl">Total</span>
                    <span className="font-serif text-2xl font-bold text-luxury-gold">
                      Rs. {getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-black border-2 border-luxury-gold text-luxury-gold py-4 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold text-center block mb-6 shadow-lg hover:shadow-luxury-gold/50"
                >
                  Proceed to Checkout
                </Link>

                <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm p-4 backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Complimentary luxury packaging and free shipping on all orders across Pakistan
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-luxury-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                <Crown className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                Authentic Luxury
              </h3>
              <p className="text-gray-400 text-sm">
                100% genuine products with certificate of authenticity
              </p>
            </div>

            <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                <ShoppingBag className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                Secure Checkout
              </h3>
              <p className="text-gray-400 text-sm">
                Your payment information is encrypted and secure
              </p>
            </div>

            <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                <Sparkles className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                Premium Experience
              </h3>
              <p className="text-gray-400 text-sm">
                Luxury packaging and white-glove delivery service
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;