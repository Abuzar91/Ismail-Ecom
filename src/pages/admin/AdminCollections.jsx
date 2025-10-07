import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    orderPosition: 0
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/collections/admin/all');
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile && !editingCollection) {
      toast.error('Please upload an image');
      return;
    }

    try {
      setUploading(true);
      const submitFormData = new FormData();

      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('isActive', formData.isActive);
      submitFormData.append('orderPosition', formData.orderPosition);

      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      if (editingCollection) {
        await axios.put(`/api/collections/${editingCollection._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Collection updated successfully');
      } else {
        await axios.post('/api/collections', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Collection created successfully');
      }

      fetchCollections();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error(error.response?.data?.message || 'Failed to save collection');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await axios.delete(`/api/collections/${id}`);
      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setImagePreview(collection.image?.url || '');
    setFormData({
      name: collection.name,
      description: collection.description,
      isActive: collection.isActive,
      orderPosition: collection.orderPosition
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCollection(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
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
            <h1 className="text-3xl font-serif font-bold text-luxury-pearl">Collections Management</h1>
            <p className="text-gray-400 mt-2">Manage product collections displayed on homepage</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all"
          >
            <Plus className="mr-2" size={20} />
            Add Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-all group"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={collection.image?.url || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent"></div>

                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="p-2 bg-luxury-gold text-black rounded-sm hover:bg-yellow-400 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection._id)}
                    className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl font-bold text-luxury-pearl mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className={`px-3 py-1 rounded-full ${
                      collection.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-400">
                      Position: {collection.orderPosition}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {collections.length === 0 && (
            <div className="col-span-full text-center py-16 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm">
              <ImageIcon className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No collections yet</h3>
              <p className="text-gray-500">Create your first collection to get started</p>
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
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
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
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Collection Image *
                </label>
                <div className="border-2 border-dashed border-luxury-gold/30 rounded-sm p-6 text-center hover:border-luxury-gold/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="collection-image"
                  />
                  <label htmlFor="collection-image" className="cursor-pointer">
                    <Upload className="mx-auto text-luxury-gold mb-2" size={32} />
                    <p className="text-gray-300 mb-1">Click to upload collection image</p>
                    <p className="text-sm text-gray-500">Support JPG, PNG, WEBP formats</p>
                  </label>
                </div>

                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-sm"
                    />
                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(editingCollection?.image?.url || '');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )}
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
                      {editingCollection ? 'Update' : 'Create'} Collection
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

export default AdminCollections;
