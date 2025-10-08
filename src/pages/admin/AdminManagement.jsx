import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Shield, UserPlus, Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminManagement() {
  const { isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [permissions, setPermissions] = useState({
    products: { create: false, read: false, update: false, delete: false },
    orders: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    banners: { create: false, read: false, update: false, delete: false },
    collections: { create: false, read: false, update: false, delete: false },
    announcements: { create: false, read: false, update: false, delete: false },
    dashboard: { view: false, analytics: false }
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [isSuperAdmin]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admins');
      setAdmins(response.data.admins);
    } catch (error) {
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admins', {
        ...formData,
        permissions
      });
      toast.success('Admin created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '' });
      resetPermissions();
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleUpdatePermissions = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admins/${selectedAdmin._id}/permissions`, {
        permissions
      });
      toast.success('Permissions updated successfully');
      setShowPermissionsModal(false);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      await axios.delete(`/api/admins/${adminId}`);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    }
  };

  const openPermissionsModal = (admin) => {
    setSelectedAdmin(admin);
    if (admin.permissions) {
      setPermissions(admin.permissions);
    } else {
      resetPermissions();
    }
    setShowPermissionsModal(true);
  };

  const resetPermissions = () => {
    setPermissions({
      products: { create: false, read: false, update: false, delete: false },
      orders: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      banners: { create: false, read: false, update: false, delete: false },
      collections: { create: false, read: false, update: false, delete: false },
      announcements: { create: false, read: false, update: false, delete: false },
      dashboard: { view: false, analytics: false }
    });
  };

  const togglePermission = (resource, action) => {
    setPermissions(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: !prev[resource][action]
      }
    }));
  };

  const toggleAllPermissions = (resource) => {
    const allChecked = Object.values(permissions[resource]).every(v => v);
    setPermissions(prev => ({
      ...prev,
      [resource]: Object.keys(prev[resource]).reduce((acc, key) => {
        acc[key] = !allChecked;
        return acc;
      }, {})
    }));
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need SuperAdmin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A962]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', password: '' });
            resetPermissions();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-[#C4A962] text-white px-6 py-3 rounded-lg hover:bg-[#B39952] transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Create Admin
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdmins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.hasPermissions
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {admin.hasPermissions ? 'Configured' : 'Not Set'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openPermissionsModal(admin)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Permissions"
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Admin"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4A962]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4A962]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4A962]"
                  />
                </div>
              </div>

              <PermissionsEditor permissions={permissions} togglePermission={togglePermission} toggleAllPermissions={toggleAllPermissions} />

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#C4A962] text-white px-6 py-3 rounded-lg hover:bg-[#B39952]"
                >
                  Create Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPermissionsModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              Edit Permissions - {selectedAdmin.name}
            </h2>
            <form onSubmit={handleUpdatePermissions}>
              <PermissionsEditor permissions={permissions} togglePermission={togglePermission} toggleAllPermissions={toggleAllPermissions} />

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#C4A962] text-white px-6 py-3 rounded-lg hover:bg-[#B39952]"
                >
                  Update Permissions
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionsEditor({ permissions, togglePermission, toggleAllPermissions }) {
  const resources = [
    { key: 'products', label: 'Products', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'orders', label: 'Orders', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'users', label: 'Users', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'banners', label: 'Banners', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'collections', label: 'Collections', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'announcements', label: 'Announcements', actions: ['create', 'read', 'update', 'delete'] },
    { key: 'dashboard', label: 'Dashboard', actions: ['view', 'analytics'] }
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Permissions</h3>
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.key} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{resource.label}</h4>
              <button
                type="button"
                onClick={() => toggleAllPermissions(resource.key)}
                className="text-sm text-[#C4A962] hover:text-[#B39952]"
              >
                {Object.values(permissions[resource.key]).every(v => v) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {resource.actions.map((action) => (
                <label key={action} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions[resource.key][action]}
                    onChange={() => togglePermission(resource.key, action)}
                    className="w-4 h-4 text-[#C4A962] focus:ring-[#C4A962] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{action}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
