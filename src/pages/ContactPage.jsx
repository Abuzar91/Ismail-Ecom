import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Sparkles } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Boutique",
      details: ["Main Boulevard, Gulberg III", "Lahore, Pakistan", "54000"]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+92 300 1234567", "+92 21 1234567", "Mon-Sat 9AM-8PM"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@noiressence.pk", "support@noiressence.pk", "orders@noiressence.pk"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 8PM", "Saturday: 10AM - 6PM", "Sunday: Closed"]
    }
  ];

  const sendToWhatsApp = () => {
    const whatsappNumber = "+923001234567";
    const message = "Hi! I'd like to know more about Noir Essence fragrances.";
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get in Touch
            </motion.div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-luxury-pearl mb-6">
              Connect With
              <span className="block bg-gradient-to-r from-luxury-gold via-yellow-400 to-luxury-gold bg-clip-text text-transparent mt-2">
                Noir Essence
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're here to assist you with any inquiries about our exclusive fragrances. 
              Experience personalized service that matches our commitment to luxury.
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-luxury-black/50 border border-luxury-gold/20 rounded-sm hover:border-luxury-gold/50 transition-all duration-500 group backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-6 group-hover:bg-luxury-gold/20 group-hover:scale-110 transition-all duration-500">
                  <info.icon className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-pearl mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-400 leading-relaxed">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-10 backdrop-blur-sm"
            >
              <h2 className="font-serif text-4xl font-bold text-luxury-pearl mb-6">Send us a Message</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-8"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-none text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-none text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-none text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-pearl mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-none text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Fragrance Inquiry</option>
                      <option value="order-support">Order Support</option>
                      <option value="consultation">Scent Consultation</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-luxury-pearl mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-none text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    placeholder="Tell us how we can assist you..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black border-2 border-luxury-gold text-luxury-gold px-8 py-4 rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-luxury-gold/50"
                  >
                    <Send size={20} />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={sendToWhatsApp}
                    className="flex-1 bg-green-600 text-white px-8 py-4 rounded-none hover:bg-green-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <MessageCircle size={20} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* FAQ Section */}
              <div className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-8 backdrop-blur-sm">
                <h3 className="font-serif text-3xl font-bold text-luxury-pearl mb-6">Frequently Asked</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-6"></div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-luxury-pearl mb-2 flex items-start">
                      <span className="text-luxury-gold mr-2">•</span>
                      How long does delivery take?
                    </h4>
                    <p className="text-gray-400 text-sm ml-4">We deliver within 2-5 business days across Pakistan with premium packaging.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-pearl mb-2 flex items-start">
                      <span className="text-luxury-gold mr-2">•</span>
                      Do you offer returns?
                    </h4>
                    <p className="text-gray-400 text-sm ml-4">Yes, we offer a 30-day return policy for unopened products in original condition.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-pearl mb-2 flex items-start">
                      <span className="text-luxury-gold mr-2">•</span>
                      Are your fragrances authentic?
                    </h4>
                    <p className="text-gray-400 text-sm ml-4">All our fragrances are 100% authentic and sourced directly from certified suppliers.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-luxury-pearl mb-2 flex items-start">
                      <span className="text-luxury-gold mr-2">•</span>
                      Can I get fragrance consultation?
                    </h4>
                    <p className="text-gray-400 text-sm ml-4">Yes, our fragrance experts are available to help you find your perfect scent.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 via-transparent to-luxury-gold/20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              Need Immediate Assistance?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our luxury concierge team is ready to provide personalized service 
              and answer any questions about our exclusive fragrances.
            </p>
            <button
              onClick={sendToWhatsApp}
              className="inline-flex items-center px-10 py-4 bg-luxury-gold text-black font-semibold rounded-none hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50 space-x-2"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp</span>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;