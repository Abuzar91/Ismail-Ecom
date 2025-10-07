import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MessageCircle, Mail, Home, Crown, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderNumber, paymentMethod, customerName, totalAmount } = location.state || {};

  const sendToWhatsApp = () => {
    const whatsappNumber = "+923001234567";
    const message = `Hi! I've placed order ${orderNumber} and need to send payment screenshot for ${paymentMethod?.toUpperCase()}. Please confirm receipt.`;
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

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
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-32 h-32 bg-luxury-gold/10 border-2 border-luxury-gold/30 rounded-sm mb-8"
            >
              <CheckCircle className="w-16 h-16 text-luxury-gold" />
            </motion.div>

            <div className="inline-flex items-center px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-6 backdrop-blur-sm">
              <Crown className="w-4 h-4 mr-2" />
              Order Confirmed
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-luxury-pearl mb-4">
              Order Placed Successfully
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Thank you {customerName ? `${customerName}` : ''} for choosing us. Your order has been received and is being processed with the utmost care.
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

      {/* Order Details Section */}
      <section className="py-16 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details Card */}
            <div className="lg:col-span-2 space-y-6">
              {orderNumber && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm"
                >
                  <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-6">
                    Order Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-luxury-gold/20">
                      <span className="text-gray-300">Order Number:</span>
                      <span className="font-serif text-xl font-bold text-luxury-gold">{orderNumber}</span>
                    </div>
                    {paymentMethod && (
                      <div className="flex justify-between items-center pb-4 border-b border-luxury-gold/20">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="font-semibold text-luxury-pearl">{paymentMethod.toUpperCase()}</span>
                      </div>
                    )}
                    {totalAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Amount:</span>
                        <span className="font-serif text-2xl font-bold text-luxury-gold">Rs. {totalAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Payment Instructions for Mobile Payments */}
              {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-luxury-black border-2 border-luxury-gold/40 rounded-sm p-8 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-luxury-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-luxury-pearl mb-2">
                        Payment Required
                      </h3>
                      <p className="text-gray-300">
                        Please send your payment screenshot via WhatsApp to complete your order.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full bg-black border-2 border-luxury-gold text-luxury-gold py-4 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-luxury-gold/50"
                  >
                    <MessageCircle size={20} />
                    <span>Send Screenshot via WhatsApp</span>
                  </button>
                </motion.div>
              )}

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 backdrop-blur-sm"
              >
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-8 text-center">
                  What Happens Next
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                      <Mail className="w-8 h-8 text-luxury-gold" />
                    </div>
                    <h4 className="font-semibold text-luxury-pearl mb-2">Order Confirmation</h4>
                    <p className="text-gray-400 text-sm">
                      You'll receive an email confirmation with order details shortly.
                    </p>
                  </div>

                  <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                      <Package className="w-8 h-8 text-luxury-gold" />
                    </div>
                    <h4 className="font-semibold text-luxury-pearl mb-2">Order Processing</h4>
                    <p className="text-gray-400 text-sm">
                      We'll prepare your order and notify you when it's shipped.
                    </p>
                  </div>

                  <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                      <MessageCircle className="w-8 h-8 text-luxury-gold" />
                    </div>
                    <h4 className="font-semibold text-luxury-pearl mb-2">Stay Connected</h4>
                    <p className="text-gray-400 text-sm">
                      Contact us anytime via WhatsApp for order updates.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 sticky top-8 backdrop-blur-sm space-y-6"
              >
                <h2 className="font-serif text-2xl font-bold text-luxury-pearl mb-8">
                  Quick Actions
                </h2>

                <Link
                  to="/products"
                  className="w-full bg-black border-2 border-luxury-gold text-luxury-gold py-4 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold text-center block shadow-lg hover:shadow-luxury-gold/50"
                >
                  Continue Shopping
                </Link>

                <Link
                  to="/orders"
                  className="w-full bg-luxury-charcoal border-2 border-luxury-gold/30 text-luxury-pearl py-4 rounded-none hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300 font-semibold text-center block"
                >
                  Track Order
                </Link>

                <Link
                  to="/"
                  className="w-full bg-luxury-charcoal border-2 border-luxury-gold/30 text-luxury-pearl py-4 rounded-none hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300 font-semibold text-center flex items-center justify-center space-x-2"
                >
                  <Home size={20} />
                  <span>Back to Home</span>
                </Link>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent my-6"></div>

                {/* Contact Information */}
                <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-luxury-pearl mb-4 text-center">
                    Need Assistance?
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 text-luxury-gold hover:text-yellow-400 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span className="text-sm">WhatsApp Support</span>
                    </a>
                    <a
                      href="mailto:info@creamglow.pk"
                      className="flex items-center justify-center space-x-2 text-luxury-gold hover:text-yellow-400 transition-colors"
                    >
                      <Mail size={18} />
                      <span className="text-sm">Email Support</span>
                    </a>
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

export default OrderSuccessPage;