import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  AlertTriangle,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, pagination.current]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 20,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      });

      const response = await axios.get(`/api/users?${params}`);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setSelectedUser(response.data.user);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
      isActive: user.isActive !== false,
    });
    setShowCreateModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
      isActive: true,
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const submitData = { ...formData };

      if (editingUser && !submitData.password) {
        delete submitData.password;
      }

      if (editingUser) {
        response = await axios.put(`/api/users/${editingUser._id}`, submitData);
      } else {
        response = await axios.post("/api/users", submitData);
      }

      if (response.data.success) {
        toast.success(
          editingUser
            ? "User updated successfully"
            : "User created successfully"
        );
        setShowCreateModal(false);
        resetForm();
        fetchUsers();
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/users/${userToDelete._id}`);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
      isActive: true,
    });
    setEditingUser(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !users.length) {
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
              <Users className="w-4 h-4 mr-2" />
              User Management
            </motion.div>

            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-luxury-pearl mb-2">
                  User Accounts
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-3"></div>
                <p className="text-gray-400 text-lg">
                  Manage user accounts and permissions
                </p>
              </div>

              <button
                onClick={handleCreateUser}
                className="px-6 py-3 bg-luxury-gold text-black rounded-sm hover:bg-luxury-gold/90 transition-all font-medium flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add User</span>
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
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="px-4 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Users Table */}
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
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-luxury-gold/10 hover:bg-luxury-black/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-luxury-gold" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-luxury-pearl mb-1">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-sm border ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                          }`}
                        >
                          {user.role === "admin" && (
                            <Crown size={12} className="mr-1" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-luxury-pearl">
                          {user.orderCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-serif font-bold text-luxury-gold">
                          Rs. {(user.totalSpent || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${
                            user.isActive
                              ? "bg-green-500/10 text-green-500 border-green-500/30"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-sm transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-sm transition-colors"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                            title="Delete User"
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
                  Showing page{" "}
                  <span className="font-medium text-luxury-pearl">
                    {pagination.current}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-luxury-pearl">
                    {pagination.pages}
                  </span>{" "}
                  ({pagination.total} total users)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current: prev.current - 1,
                    }))
                  }
                  disabled={pagination.current <= 1}
                  className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      current: prev.current + 1,
                    }))
                  }
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">
                  User Details
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-luxury-gold">
                  User Information
                </h4>
                <div className="bg-luxury-black/50 border border-luxury-gold/10 p-4 rounded-sm space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="font-medium text-luxury-pearl">
                        {selectedUser.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email Address</p>
                      <p className="font-medium text-luxury-pearl">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-luxury-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone Number</p>
                        <p className="font-medium text-luxury-pearl">
                          {selectedUser.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="font-medium text-luxury-pearl">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-luxury-gold">
                  Order Statistics
                </h4>
                <div className="bg-luxury-black/50 border border-luxury-gold/10 p-4 rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Orders:</span>
                    <span className="font-bold text-luxury-pearl">
                      {selectedUser.orderStats?.totalOrders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Spent:</span>
                    <span className="font-serif font-bold text-luxury-gold">
                      Rs.{" "}
                      {(
                        selectedUser.orderStats?.totalSpent || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Average Order:</span>
                    <span className="font-serif font-bold text-luxury-gold">
                      Rs.{" "}
                      {(
                        selectedUser.orderStats?.averageOrder || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {selectedUser.recentOrders &&
              selectedUser.recentOrders.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-luxury-gold mb-4">
                    Recent Orders
                  </h4>
                  <div className="space-y-3">
                    {selectedUser.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 bg-luxury-black/50 border border-luxury-gold/10 rounded-sm"
                      >
                        <div>
                          <p className="font-medium text-luxury-pearl">
                            #{order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif font-bold text-luxury-gold mb-1">
                            Rs. {order.totalAmount?.toLocaleString()}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${
                              order.orderStatus === "delivered"
                                ? "bg-green-500/10 text-green-500 border-green-500/30"
                                : order.orderStatus === "shipped"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </motion.div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-lg w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-luxury-pearl">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Password {editingUser ? "(leave blank to keep current)" : "*"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-luxury-gold bg-luxury-black border-luxury-gold/30 rounded focus:ring-luxury-gold"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Active User
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 rounded-sm hover:bg-luxury-gold/20 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-luxury-gold text-black font-semibold rounded-sm hover:bg-luxury-gold/90 transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-lg w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl">
                  Delete User
                </h3>
              </div>
              <button
                onClick={cancelDeleteUser}
                disabled={deleteLoading}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 text-gray-300">
              <p className="mb-4">
                Are you sure you want to delete this user? This action is
                permanent and cannot be undone.
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <div>
                    <p className="text-luxury-pearl font-medium">
                      {userToDelete.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {userToDelete.email}
                    </p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-400">Role:</span>{" "}
                    <span
                      className={`${
                        userToDelete.role === "admin"
                          ? "text-purple-400"
                          : "text-blue-400"
                      }`}
                    >
                      {userToDelete.role}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Orders:</span>{" "}
                    {userToDelete.orderCount || 0}
                  </p>
                  <p>
                    <span className="text-gray-400">Total Spent:</span> Rs.{" "}
                    {(userToDelete.totalSpent || 0).toLocaleString()}
                  </p>
                  <p>
                    <span className="text-gray-400">Status:</span>{" "}
                    {userToDelete.isActive ? "Active" : "Inactive"}
                  </p>
                  {userToDelete.createdAt && (
                    <p>
                      <span className="text-gray-400">Joined:</span>{" "}
                      {formatDate(userToDelete.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={cancelDeleteUser}
                disabled={deleteLoading}
                className="px-5 py-2 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 rounded-sm hover:bg-luxury-gold/20 transition-all font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
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

export default AdminUsers;