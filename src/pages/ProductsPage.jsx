import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('name');

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = ['all', 'oriental', 'floral', 'woody', 'fresh', 'citrus'];

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-gold"></div>
          <p className="text-gray-400">Loading fragrances...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Luxury Fragrances | Noir Essence Perfume Collection</title>
        <meta name="description" content="Browse Noir Essence's complete collection of luxury perfumes. Discover oriental, floral, woody, and fresh fragrances crafted for the discerning individual." />
        <meta name="keywords" content="luxury perfume, designer fragrance, oriental perfume, floral perfume, woody perfume, fresh fragrance" />
      </Helmet>
      <div className="min-h-screen bg-luxury-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Exclusive Collection
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-luxury-pearl mb-4">Our Fragrances</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our curated selection of luxury perfumes
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 mb-12 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-sm text-gray-300 placeholder-gray-500 focus:border-luxury-gold focus:outline-none transition-colors"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-sm text-gray-300 focus:border-luxury-gold focus:outline-none transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-luxury-charcoal">
                  {category === 'all' ? 'All Collections' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Price Range: Rs. {priceRange[0].toLocaleString()} - Rs. {priceRange[1].toLocaleString()}</label>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-luxury-darkgray rounded-sm appearance-none cursor-pointer accent-luxury-gold"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/30 rounded-sm text-gray-300 focus:border-luxury-gold focus:outline-none transition-colors"
            >
              <option value="name" className="bg-luxury-charcoal">Sort by Name</option>
              <option value="price-low" className="bg-luxury-charcoal">Price: Low to High</option>
              <option value="price-high" className="bg-luxury-charcoal">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group relative border border-luxury-gold/20 rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-all duration-500 hover:shadow-xl hover:shadow-luxury-gold/10"
            >
              {/* Sale Badge */}
              {product.discount > 0 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold z-10">
                  Sale
                </div>
              )}

              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-white">
                <img
                  src={product.images?.[0]?.url || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                />
              </Link>

              {/* Product Info */}
              <div className="p-4 text-center">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-medium text-luxury-pearl text-sm mb-2 line-clamp-2 min-h-[2.5rem] hover:text-luxury-gold transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-center gap-2">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="text-gray-500 text-sm line-through">
                        Rs.{product.originalPrice?.toLocaleString()}
                      </span>
                      <span className="text-luxury-gold font-bold text-lg">
                        Rs.{product.price?.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-luxury-pearl font-bold text-lg">
                      Rs.{product.price?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-500 text-xl mb-4">No fragrances found</div>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductsPage;