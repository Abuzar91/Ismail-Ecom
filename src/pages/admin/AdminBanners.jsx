import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard as Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    productId: '',
    ctaText: 'Shop Now',
    isActive: true,
    orderPosition: 0
  });

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/banners/admin/all');
      setBanners(response.data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId) => {
    setExistingImages(prevImages => prevImages.filter(img => img.publicId !== publicId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0 && (!editingBanner || existingImages.length === 0)) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setUploading(true);
      const submitFormData = new FormData();

      submitFormData.append('title', formData.title);
      submitFormData.append('subtitle', formData.subtitle);
      submitFormData.append('productId', formData.productId);
      submitFormData.append('ctaText', formData.ctaText);
      submitFormData.append('isActive', formData.isActive);
      submitFormData.append('orderPosition', formData.orderPosition);

      imageFiles.forEach(file => {
        submitFormData.append('images', file);
      });

      if (editingBanner) {
        const removedImages = editingBanner.images
          .filter(img => !existingImages.find(ei => ei.publicId === img.publicId))
          .map(img => img.publicId);

        if (removedImages.length > 0) {
          submitFormData.append('removeImages', JSON.stringify(removedImages));
        }

        await axios.put(`/api/banners/${editingBanner._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Banner updated successfully');
      } else {
        await axios.post('/api/banners', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Banner created successfully');
      }

      fetchBanners();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(error.response?.data?.message || 'Failed to save banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await axios.delete(`/api/banners/${id}`);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setExistingImages(banner.images || []);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      productId: banner.productId?._id || '',
      ctaText: banner.ctaText,
      isActive: banner.isActive,
      orderPosition: banner.orderPosition
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setFormData({
      title: '',
      subtitle: '',
      productId: '',
      ctaText: 'Shop Now',
      isActive: true,
      orderPosition: 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-luxury-pearl">Banners Management</h1>
            <p className="text-gray-400 mt-2">Manage homepage banner carousel</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all"
          >
            <Plus className="mr-2" size={20} />
            Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={banner.images?.[0]?.url || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={banner.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  {banner.images && banner.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-luxury-black/80 text-luxury-gold px-3 py-1 rounded-full text-sm">
                      +{banner.images.length - 1} more
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-bold text-luxury-pearl mb-2">
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-gray-400 mb-3">{banner.subtitle}</p>
                      )}
                      {banner.productId && (
                        <p className="text-sm text-luxury-gold">
                          Linked to: {banner.productId.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-sm transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      banner.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-400">
                      Position: {banner.orderPosition}
                    </span>
                    <span className="text-gray-400">
                      CTA: {banner.ctaText}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {banners.length === 0 && (
            <div className="text-center py-16 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm">
              <ImageIcon className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No banners yet</h3>
              <p className="text-gray-500">Create your first banner to get started</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-luxury-gold/20 flex items-center justify-between sticky top-0 bg-luxury-charcoal z-10">
              <h2 className="text-2xl font-serif font-bold text-luxury-pearl">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banner Images * (You can upload multiple images)
                </label>
                <div className="border-2 border-dashed border-luxury-gold/30 rounded-sm p-6 text-center hover:border-luxury-gold/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="banner-images"
                  />
                  <label htmlFor="banner-images" className="cursor-pointer">
                    <Upload className="mx-auto text-luxury-gold mb-2" size={32} />
                    <p className="text-gray-300 mb-1">Click to upload banner images</p>
                    <p className="text-sm text-gray-500">Support multiple images (JPG, PNG, WEBP)</p>
                  </label>
                </div>

                {existingImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Existing Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-32 object-cover rounded-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.publicId)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">New Images to Upload:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Linked Product
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                >
                  <option value="">No product link</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.orderPosition}
                  onChange={(e) => setFormData({ ...formData, orderPosition: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-luxury-gold bg-luxury-black border-luxury-gold/20 rounded focus:ring-luxury-gold"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                  Active (visible on homepage)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-luxury-gold/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-luxury-gold/30 text-gray-300 rounded-sm hover:bg-luxury-gold/5 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center px-6 py-3 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      {editingBanner ? 'Update' : 'Create'} Banner
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
