import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  Truck, 
  CheckCircle, 
  X, 
  Calendar, 
  AlertTriangle,
  Crown,
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    orderStatus: '',
    paymentStatus: '',
    adminNotes: ''
  });

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/10 text-red-500 border-red-500/30' }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    { value: 'paid', label: 'Paid', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
    { value: 'failed', label: 'Failed', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-500/10 text-gray-500 border-gray-500/30' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, paymentFilter, pagination.current]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
        paymentStatus: paymentFilter
      });

      const response = await axios.get(`/api/orders/admin/all?${params}`);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setSelectedOrder(response.data.order);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setStatusUpdate({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      adminNotes: order.adminNotes || ''
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`/api/orders/${selectedOrder._id}/status`, statusUpdate);
      
      if (response.data.success) {
        toast.success('Order status updated successfully');
        setShowStatusModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/orders/${orderToDelete._id}`);
      toast.success('Order deleted successfully');
      setShowDeleteModal(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const getStatusColor = (status, type = 'order') => {
    const statuses = type === 'order' ? orderStatuses : paymentStatuses;
    return statuses.find(s => s.value === status)?.color || 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
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
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order Management
            </motion.div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-luxury-pearl mb-2">
              Orders Dashboard
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-3"></div>
            <p className="text-gray-400 text-lg">Manage customer orders and track deliveries</p>
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
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Order Status</option>
                {orderStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="all">All Payment Status</option>
                {paymentStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                }}
                className="px-4 py-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Orders Table */}
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
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr 
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-luxury-gold/10 hover:bg-luxury-black/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-luxury-pearl">
                            #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-400">
                            {order.items?.length || 0} item(s)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-luxury-pearl">
                            {order.customerInfo?.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {order.customerInfo?.email}
                          </div>
                          <div className="text-sm text-gray-400">
                            {order.customerInfo?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-serif font-bold text-luxury-gold">
                          Rs. {order.totalAmount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          via {order.paymentMethod?.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${getStatusColor(order.paymentStatus, 'payment')}`}>
                          {paymentStatuses.find(s => s.value === order.paymentStatus)?.label || order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${getStatusColor(order.orderStatus)}`}>
                          {orderStatuses.find(s => s.value === order.orderStatus)?.label || order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewOrder(order._id)}
                            className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-sm transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-sm transition-colors"
                            title="Update Status"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                            title="Delete Order"
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
                  <span className="font-medium text-luxury-pearl">{pagination.pages}</span> ({pagination.total} total orders)
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">
                  Order Details
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
                <p className="text-gray-400 mt-2">#{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-luxury-gold">Customer Information</h4>
                <div className="bg-luxury-black/50 border border-luxury-gold/10 p-4 rounded-sm space-y-3">
                  <p className="text-luxury-pearl"><span className="text-gray-400">Name:</span> {selectedOrder.customerInfo?.fullName}</p>
                  <p className="text-luxury-pearl"><span className="text-gray-400">Email:</span> {selectedOrder.customerInfo?.email}</p>
                  <p className="text-luxury-pearl"><span className="text-gray-400">Phone:</span> {selectedOrder.customerInfo?.phone}</p>
                  <div>
                    <span className="text-gray-400">Address:</span>
                    <p className="text-sm text-luxury-pearl mt-1">
                      {selectedOrder.customerInfo?.address?.street}<br/>
                      {selectedOrder.customerInfo?.address?.city}, {selectedOrder.customerInfo?.address?.state} {selectedOrder.customerInfo?.address?.zipCode}<br/>
                      {selectedOrder.customerInfo?.address?.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-luxury-gold">Order Information</h4>
                <div className="bg-luxury-black/50 border border-luxury-gold/10 p-4 rounded-sm space-y-3">
                  <p className="text-luxury-pearl"><span className="text-gray-400">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p className="text-luxury-pearl"><span className="text-gray-400">Payment Method:</span> {selectedOrder.paymentMethod?.toUpperCase()}</p>
                  <p className="flex items-center space-x-2">
                    <span className="text-gray-400">Order Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {orderStatuses.find(s => s.value === selectedOrder.orderStatus)?.label}
                    </span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-gray-400">Payment Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${getStatusColor(selectedOrder.paymentStatus, 'payment')}`}>
                      {paymentStatuses.find(s => s.value === selectedOrder.paymentStatus)?.label}
                    </span>
                  </p>
                  {selectedOrder.adminNotes && (
                    <p className="text-luxury-pearl"><span className="text-gray-400">Admin Notes:</span> {selectedOrder.adminNotes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h4 className="font-semibold text-luxury-gold mb-4">Order Items</h4>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-luxury-black/50 border border-luxury-gold/10 rounded-sm">
                    <img
                      src={item.productSnapshot?.image || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={item.productSnapshot?.name}
                      className="w-16 h-16 object-cover rounded-sm border border-luxury-gold/20"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-luxury-pearl">{item.productSnapshot?.name}</h5>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-400">Price: Rs. {item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-luxury-gold">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-sm">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg font-semibold text-luxury-pearl">Total Amount:</span>
                  <span className="font-serif text-2xl font-bold text-luxury-gold">Rs. {selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-charcoal border border-luxury-gold/30 rounded-sm p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">
                  Update Status
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order Status
                </label>
                <select
                  value={statusUpdate.orderStatus}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, orderStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Payment Status
                </label>
                <select
                  value={statusUpdate.paymentStatus}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, paymentStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                >
                  {paymentStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={statusUpdate.adminNotes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNotes: e.target.value })}
                  className="w-full px-4 py-3 bg-luxury-black border border-luxury-gold/20 rounded-sm text-luxury-pearl placeholder-gray-500 focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
                  placeholder="Add any notes about this status update..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-3 border border-luxury-gold/30 rounded-sm text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-luxury-gold text-black rounded-sm hover:bg-luxury-gold/90 transition-colors font-medium"
                >
                  Update Status
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
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
                    Delete Order
                  </h3>
                </div>
              </div>
              <button
                onClick={cancelDeleteOrder}
                className="p-2 hover:bg-luxury-gold/10 rounded-sm text-luxury-pearl transition-colors"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-red-500">Order Details:</span>
                </div>
                <div className="space-y-2 text-sm text-luxury-pearl">
                  <p><span className="text-gray-400">Order Number:</span> #{orderToDelete.orderNumber}</p>
                  <p><span className="text-gray-400">Customer:</span> {orderToDelete.customerInfo?.fullName}</p>
                  <p><span className="text-gray-400">Amount:</span> <span className="font-serif font-semibold text-luxury-gold">Rs. {orderToDelete.totalAmount?.toLocaleString()}</span></p>
                  <p><span className="text-gray-400">Date:</span> {formatDate(orderToDelete.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={cancelDeleteOrder}
                className="px-4 py-3 border border-luxury-gold/30 rounded-sm text-luxury-pearl hover:bg-luxury-gold/10 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
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
                    <span>Delete Order</span>
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

export default AdminOrders;