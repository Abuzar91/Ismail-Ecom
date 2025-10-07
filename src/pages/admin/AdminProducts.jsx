import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  X, 
  Upload, 
  Star, 
  Tag, 
  AlertTriangle,
  Package,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'face-cream',
    stock: '',
    features: '',
    ingredients: '',
    skinType: 'all',
    featured: false,
    isActive: true,
    tags: ''
  });

  const categories = [
    { value: 'face-cream', label: 'Face Cream' },
    { value: 'body-cream', label: 'Body Cream' },
    { value: 'anti-aging', label: 'Anti-Aging' },
    { value: 'moisturizer', label: 'Moisturizer' },
    { value: 'sunscreen', label: 'Sunscreen' },
    { value: 'night-cream', label: 'Night Cream' },
    { value: 'day-cream', label: 'Day Cream' }
  ];

  const skinTypes = [
    { value: 'all', label: 'All Skin Types' },
    { value: 'dry', label: 'Dry' },
    { value: 'oily', label: 'Oily' },
    { value: 'combination', label: 'Combination' },
    { value: 'sensitive', label: 'Sensitive' },
    { value: 'normal', label: 'Normal' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterCategory, filterStatus, pagination.current]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 20,
        search: searchTerm,
        category: filterCategory,
        status: filterStatus
      });

      const response = await axios.get(`/api/products/admin/all?${params}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'images') return;
        formDataToSend.append(key, formData[key]);
      });

      const imageInput = document.getElementById('images');
      if (imageInput?.files) {
        Array.from(imageInput.files).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      let response;
      if (editingProduct) {
        response = await axios.put(`/api/products/${editingProduct._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'face-cream',
      stock: product.stock || '',
      features: product.features?.join(', ') || '',
      ingredients: product.ingredients?.join(', ') || '',
      skinType: product.skinType || 'all',
      featured: product.featured || false,
      isActive: product.isActive !== false,
      tags: product.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/products/${productToDelete._id}`);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteProduct = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'face-cream',
      stock: '',
      features: '',
      ingredients: '',
      skinType: 'all',
      featured: false,
      isActive: true,
      tags: ''
    });
    setEditingProduct(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !products.length) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-luxury-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-4"
            >
              <Package className="w-4 h-4 mr-2" />
              Product Management
            </motion.div>
            
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-luxury-pearl mb-2">
                  Products Catalog
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-3"></div>
                <p className="text-gray-400 text-lg">Manage your luxury product collection</p>
              </div>
              
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-luxury-gold text-black rounded-sm hover:bg-luxury-gold/90 transition-all font-medium flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 mb-6 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                className="px-4 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm backdrop-blur-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-luxury-gold/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr 
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-luxury-gold/10 hover:bg-luxury-black/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            className="h-16 w-16 rounded-sm object-cover border border-luxury-gold/20"
                            src={product.images?.[0]?.url || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={product.name}
                          />
                          <div>
                            <div className="text-sm font-medium text-luxury-pearl mb-1">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {product.description?.substring(0, 50)}...
                            </div>
                            {product.featured && (
                              <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium rounded-sm bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                                <Star size={12} className="mr-1" fill="currentColor" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-sm bg-purple-500/10 text-purple-500 border border-purple-500/30">
                          {categories.find(cat => cat.value === product.category)?.label || product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-serif font-bold text-luxury-gold">
                          Rs. {product.price?.toLocaleString()}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-gray-400 line-through">
                            Rs. {product.originalPrice?.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${
                          product.stock > 10 
                            ? 'bg-green-500/10 text-green-500 border-green-500/30'
                            : product.stock > 0 
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                            : 'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}>
                          {product.stock || 0} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${
                          product.isActive 
                            ? 'bg-green-500/10 text-green-500 border-green-500/30'
                            : 'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-sm transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-luxury-gold/20">
              <div>
                <p className="text-sm text-gray-400">
                  Showing page <span className="font-medium text-luxury-pearl">{pagination.current}</span> of{' '}
                  <span className="font-medium text-luxury-pearl">{pagination.pages}</span> ({pagination.total} total products)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                  disabled={pagination.current <= 1}
                  className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                  disabled={pagination.current >= pagination.pages}
                  className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-luxury-gold">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Original Price (Rs.)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-luxury-gold">Additional Information</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Skin Type
                    </label>
                    <select
                      value={formData.skinType}
                      onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    >
                      {skinTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Key Features (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="Hydrating, Anti-aging, Natural ingredients"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ingredients (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="Vitamin E, Aloe Vera, Hyaluronic Acid"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                      placeholder="skincare, beauty, cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Product Images
                    </label>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold/10 file:text-luxury-gold hover:file:bg-luxury-gold/20 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload up to 5 images. Recommended size: 800x800px
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-luxury-gold/30 rounded bg-luxury-black"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-luxury-pearl">
                        Featured Product
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-luxury-gold/30 rounded bg-luxury-black"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-luxury-pearl">
                        Active Product
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-luxury-gold/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-luxury-gold/30 rounded-sm text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-luxury-gold text-black rounded-sm hover:bg-luxury-gold/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-red-500/30 rounded-sm p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500/10 rounded-sm flex items-center justify-center border border-red-500/30">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-luxury-pearl">
                    Delete Product
                  </h3>
                </div>
              </div>
              <button
                onClick={cancelDeleteProduct}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-red-500">Product Details:</span>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={productToDelete.images?.[0]?.url || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=60'}
                    alt={productToDelete.name}
                    className="w-12 h-12 object-cover rounded-sm border border-red-500/30"
                  />
                  <div>
                    <p className="text-sm font-medium text-luxury-pearl">{productToDelete.name}</p>
                    <p className="text-xs text-gray-400">
                      {categories.find(cat => cat.value === productToDelete.category)?.label || productToDelete.category}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-luxury-pearl">
                  <p><span className="text-gray-400">Price:</span> <span className="font-serif font-semibold text-luxury-gold">Rs. {productToDelete.price?.toLocaleString()}</span></p>
                  <p><span className="text-gray-400">Stock:</span> {productToDelete.stock || 0} units</p>
                  <p><span className="text-gray-400">Status:</span> {productToDelete.isActive ? 'Active' : 'Inactive'}</p>
                  {productToDelete.createdAt && (
                    <p><span className="text-gray-400">Created:</span> {formatDate(productToDelete.createdAt)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={cancelDeleteProduct}
                className="px-4 py-3 border border-luxury-gold/30 rounded-sm text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                disabled={deleteLoading}
                className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-sm hover:bg-red-500/30 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;