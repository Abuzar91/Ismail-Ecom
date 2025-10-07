import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone, Mail, User, MessageCircle, X, Sparkles, Crown, Shield, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Truck
    },
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      description: 'Mobile payment via Easypaisa',
      icon: Phone,
      number: '03001234567'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Mobile payment via JazzCash',
      icon: Phone,
      number: '03001234567'
    }
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
        setShowPaymentModal(true);
        setSubmitting(false);
        return;
      }

      const orderData = {
        customerInfo: data,
        items: items,
        paymentMethod: paymentMethod
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success', { 
          state: { orderId: response.data.order._id } 
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobilePayment = async () => {
    const formData = getValues();
    setSubmitting(true);
    
    try {
      const orderData = {
        customerInfo: formData,
        items: items,
        paymentMethod: paymentMethod
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        toast.success('Order placed! Please send payment screenshot via WhatsApp.');
        navigate('/order-success', { 
          state: { 
            orderId: response.data.order._id,
            paymentMethod: paymentMethod 
          } 
        });
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setShowPaymentModal(false);
      setSubmitting(false);
    }
  };

  const sendToWhatsApp = () => {
    const whatsappNumber = "+923001234567";
    const message = `Hi! I've placed an order and need to send payment screenshot for ${paymentMethod.toUpperCase()}. Order Total: Rs. ${getCartTotal()}`;
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
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
              Secure Luxury Checkout
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-luxury-pearl mb-4">
              Complete Your Order
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Your journey to timeless elegance is almost complete
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-16 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm">
                      <User className="text-luxury-gold" size={24} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-luxury-pearl">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-luxury-gold text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="03XX XXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-luxury-gold text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-luxury-gold text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm">
                      <MapPin className="text-luxury-gold" size={24} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-luxury-pearl">Delivery Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register('address.street', { required: 'Street address is required' })}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="House #, Street, Area"
                      />
                      {errors.address?.street && (
                        <p className="text-luxury-gold text-sm mt-1">{errors.address.street.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register('address.city', { required: 'City is required' })}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="City"
                      />
                      {errors.address?.city && (
                        <p className="text-luxury-gold text-sm mt-1">{errors.address.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        {...register('address.state')}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Punjab, Sindh, KPK, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        {...register('address.zipCode')}
                        className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-300"
                        placeholder="Postal Code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register('address.country')}
                        defaultValue="Pakistan"
                        className="w-full px-4 py-3 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm">
                      <CreditCard className="text-luxury-gold" size={24} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-luxury-pearl">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-6 border-2 rounded-sm cursor-pointer transition-all duration-300 ${
                          paymentMethod === method.id
                            ? 'border-luxury-gold bg-luxury-gold/10 shadow-lg shadow-luxury-gold/20'
                            : 'border-luxury-gold/20 hover:border-luxury-gold/40 bg-luxury-charcoal/30'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-luxury-gold' : 'border-gray-500'
                          }`}>
                            {paymentMethod === method.id && (
                              <div className="w-3 h-3 rounded-full bg-luxury-gold"></div>
                            )}
                          </div>
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm">
                            <method.icon className="text-luxury-gold" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-luxury-pearl text-lg">{method.name}</h3>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                            {method.number && (
                              <p className="text-luxury-gold text-sm font-medium mt-1">
                                Account: {method.number}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-luxury-black border border-luxury-gold/20 rounded-sm p-8 sticky top-8 backdrop-blur-sm"
                >
                  <h2 className="font-serif text-2xl font-bold text-luxury-pearl mb-8">Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-6 mb-8">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 pb-6 border-b border-luxury-gold/10">
                        <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 border border-luxury-gold/20">
                          <img
                            src={item.images?.[0].url || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-semibold text-luxury-pearl text-sm mb-1">{item.name}</h4>
                          <p className="text-gray-400 text-xs">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-serif font-bold text-luxury-gold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
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

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black border-2 border-luxury-gold text-luxury-gold py-4 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-luxury-gold/50 mb-6"
                  >
                    {submitting ? 'Processing Your Order...' : 'Complete Order'}
                  </button>

                  <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm p-4 backdrop-blur-sm">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Complimentary luxury packaging with every order
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Trust Badges */}
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
                <Shield className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                Secure Checkout
              </h3>
              <p className="text-gray-400 text-sm">
                Your information is encrypted and protected
              </p>
            </div>

            <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                <Truck className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                White-Glove Delivery
              </h3>
              <p className="text-gray-400 text-sm">
                Free nationwide shipping with care
              </p>
            </div>

            <div className="text-center p-6 bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-sm backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-4">
                <Award className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-lg font-semibold text-luxury-pearl mb-2">
                Authenticity Guaranteed
              </h3>
              <p className="text-gray-400 text-sm">
                100% genuine luxury fragrances
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border-2 border-luxury-gold/30 rounded-sm p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-luxury-pearl">Payment Instructions</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm border border-luxury-gold/20 text-luxury-gold transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="font-serif text-4xl font-bold text-luxury-gold mb-3">
                Rs. {getCartTotal().toLocaleString()}
              </div>
              <p className="text-gray-300 mb-6">Please send this amount to:</p>
              <div className="bg-luxury-black border border-luxury-gold/30 p-6 rounded-sm">
                <p className="font-serif text-xl font-bold text-luxury-gold mb-1">
                  {paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}
                </p>
                <p className="text-2xl font-mono text-luxury-pearl">03001234567</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-luxury-gold/10 border border-luxury-gold/30 p-6 rounded-sm">
                <h4 className="font-semibold text-luxury-gold mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Important Instructions
                </h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-luxury-gold mr-2">•</span>
                    <span>Send exact amount: Rs. {getCartTotal().toLocaleString()}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-luxury-gold mr-2">•</span>
                    <span>Take a screenshot of the transaction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-luxury-gold mr-2">•</span>
                    <span>Send screenshot via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={sendToWhatsApp}
                  className="flex-1 bg-green-600 text-white py-3 rounded-sm hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold border border-green-500"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleMobilePayment}
                  disabled={submitting}
                  className="flex-1 bg-black border-2 border-luxury-gold text-luxury-gold py-3 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Complete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;