import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard as Edit, Trash2, Save, X, Megaphone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    isActive: true,
    priority: 0
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/announcements/admin/all');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAnnouncement) {
        await axios.put(`/api/announcements/${editingAnnouncement._id}`, formData);
        toast.success('Announcement updated successfully');
      } else {
        await axios.post('/api/announcements', formData);
        toast.success('Announcement created successfully');
      }

      fetchAnnouncements();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      isActive: announcement.isActive,
      priority: announcement.priority
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      isActive: true,
      priority: 0
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
            <h1 className="text-3xl font-serif font-bold text-luxury-pearl">Announcements</h1>
            <p className="text-gray-400 mt-2">Manage site-wide announcements displayed at the top of pages</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-6 py-3 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all"
          >
            <Plus className="mr-2" size={20} />
            Add Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {announcements.map((announcement) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 hover:border-luxury-gold/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Megaphone className="text-luxury-gold" size={20} />
                    <h3 className="text-xl font-semibold text-luxury-pearl">
                      {announcement.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-4">{announcement.message}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      announcement.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-400">
                      Priority: {announcement.priority}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-sm transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-sm transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-16 bg-luxury-charcoal border border-luxury-gold/20 rounded-sm">
              <Megaphone className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No announcements yet</h3>
              <p className="text-gray-500">Create your first announcement to notify customers</p>
            </div>
          )}
        </div>
      </div>

      {/* Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm max-w-2xl w-full"
          >
            <div className="p-6 border-b border-luxury-gold/20 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-luxury-pearl">
                {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
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
                  placeholder="e.g., Flash Sale - 30% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                  rows="3"
                  required
                  placeholder="e.g., Limited time offer on all luxury fragrances. Use code LUXURY30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:border-luxury-gold focus:outline-none"
                  placeholder="Higher numbers appear first"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher priority announcements are shown first in the rotation
                </p>
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
                  Active (visible to users)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-luxury-gold/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-luxury-gold/30 text-gray-300 rounded-sm hover:bg-luxury-gold/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all"
                >
                  <Save className="mr-2" size={20} />
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
