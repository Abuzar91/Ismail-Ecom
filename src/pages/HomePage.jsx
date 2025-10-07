import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Award, Leaf, Crown, Star } from 'lucide-react';
import axios from 'axios';
import BannerCarousel from '../components/BannerCarousel';
import AnnouncementBar from '../components/AnnouncementBar';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, bannersRes, announcementsRes] = await Promise.all([
        axios.get('/api/products?featured=true&limit=4'),
        axios.get('/api/banners'),
        axios.get('/api/announcements')
      ]);

      setFeaturedProducts(productsRes.data.products || []);
      setBanners(bannersRes.data.banners || []);
      setAnnouncements(announcementsRes.data.announcements || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Crown,
      title: "Handcrafted Excellence",
      description: "Each fragrance is meticulously crafted with the finest ingredients"
    },
    {
      icon: Leaf,
      title: "Natural Essences",
      description: "Pure, sustainably sourced botanical extracts from around the world"
    },
    {
      icon: Sparkles,
      title: "Long-Lasting",
      description: "Premium concentration ensures all-day fragrance performance"
    },
    {
      icon: Award,
      title: "Award-Winning",
      description: "Recognized globally for exceptional quality and artistry"
    }
  ];

  const collections = [
    {
      name: "Midnight Collection",
      description: "Dark, mysterious fragrances for the evening",
      image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      name: "Golden Hour",
      description: "Warm, sophisticated scents for any occasion",
      image: "https://images.pexels.com/photos/7533347/pexels-photo-7533347.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      name: "Essence Pure",
      description: "Light, elegant fragrances for everyday luxury",
      image: "https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const testimonials = [
    {
      name: "Isabella Laurent",
      location: "Paris",
      rating: 5,
      comment: "The most exquisite perfume I've ever worn. Noir Essence captures true luxury.",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Sophia Chen",
      location: "Dubai",
      rating: 5,
      comment: "Absolutely stunning fragrances. The quality and longevity are unmatched.",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Amara Rodriguez",
      location: "New York",
      rating: 5,
      comment: "Noir Essence has become my signature. I receive compliments everywhere I go.",
      image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Noir Essence - Luxury Perfume Collection | Premium Fragrances</title>
        <meta name="description" content="Experience the art of luxury perfumery with Noir Essence. Discover our exclusive collection of handcrafted fragrances that embody sophistication and timeless elegance." />
        <meta name="keywords" content="luxury perfume, designer fragrance, premium perfume, exclusive scents, luxury fragrance" />
      </Helmet>
      <div className="min-h-screen bg-luxury-black">

      <AnnouncementBar announcements={announcements} />

      {banners.length > 0 ? (
        <BannerCarousel banners={banners} />
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Luxury Perfume Collection
              </motion.div>

              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-luxury-pearl mb-6 leading-tight">
                The Art of
                <span className="block bg-gradient-to-r from-luxury-gold via-yellow-400 to-luxury-gold bg-clip-text text-transparent mt-2">
                  Timeless Elegance
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                Experience luxury redefined through exceptional fragrances.
                Each scent tells a story of sophistication, crafted for those who appreciate the extraordinary.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-black border-2 border-luxury-gold text-luxury-gold font-semibold rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-luxury-pearl/20 text-luxury-pearl font-semibold rounded-none hover:bg-luxury-pearl/10 hover:border-luxury-pearl/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-12 text-sm text-gray-400">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-serif text-luxury-gold mb-1">100+</span>
                  <span>Signature Scents</span>
                </div>
                <div className="h-12 w-px bg-luxury-gold/30"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-serif text-luxury-gold mb-1">50K+</span>
                  <span>Luxury Enthusiasts</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="relative w-full h-96 lg:h-[700px]">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-sm transform rotate-3"></div>
                <img
                  src="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Luxury Perfume Collection"
                  className="relative w-full h-full object-cover rounded-sm shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent rounded-sm"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 shadow-2xl backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-sm text-luxury-pearl font-medium">Loved by 50,000+ connoisseurs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-luxury-gold to-yellow-600 text-black rounded-sm p-6 shadow-2xl"
              >
                <div className="text-3xl font-serif font-bold">100%</div>
                <div className="text-sm opacity-90">Natural Essence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              The Noir Essence Promise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every bottle embodies our commitment to unparalleled quality and artisanal craftsmanship
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-luxury-black/50 border border-luxury-gold/20 rounded-sm hover:border-luxury-gold/50 transition-all duration-500 group backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm mb-6 group-hover:bg-luxury-gold/20 group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-pearl mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              Signature Collections
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Discover your signature scent from our curated collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {collection.description}
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center text-luxury-gold hover:text-yellow-400 transition-colors font-medium"
                  >
                    Explore
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-luxury-charcoal relative">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              Featured Fragrances
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Handpicked selections from our exclusive collection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-luxury-black border border-luxury-gold/20 rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-luxury-gold/10"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.images?.[0]?.url || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 bg-luxury-black/50 backdrop-blur-sm">
                  <h3 className="font-serif text-lg font-semibold text-luxury-pearl mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold text-luxury-gold">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="px-4 py-2 bg-black border border-luxury-gold text-luxury-gold rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 text-sm font-medium"
                    >
                      Discover
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-4 bg-black border-2 border-luxury-gold text-luxury-gold font-semibold rounded-none hover:bg-luxury-gold hover:text-black transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50"
            >
              View Full Collection
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              Testimonials
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Stories from our distinguished clientele
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-8 hover:border-luxury-gold/50 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-luxury-gold/30"
                  />
                  <div>
                    <h4 className="font-semibold text-luxury-pearl">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 via-transparent to-luxury-gold/20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-pearl mb-6">
              Begin Your Journey
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Step into a world where fragrance becomes art.
              Discover your signature scent and embrace timeless sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-10 py-4 bg-luxury-gold text-black font-semibold rounded-none hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-luxury-gold/50"
              >
                Explore Collection
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-10 py-4 border-2 border-luxury-pearl text-luxury-pearl font-semibold rounded-none hover:bg-luxury-pearl hover:text-black transition-all duration-300"
              >
                Our Heritage
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;
