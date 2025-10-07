import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  ShoppingCart,
  Eye,
  Calendar,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dashboard/stats?period=${period}`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  const overview = stats?.overview || {};
  const dailySales = stats?.dailySales || [];
  const orderStatusStats = stats?.orderStatusStats || [];
  const paymentMethodStats = stats?.paymentMethodStats || [];
  const topProducts = stats?.topProducts || [];
  const recentOrders = stats?.recentOrders || [];

  // Calculate unique customers from recent orders
  const uniqueCustomers = recentOrders.reduce((acc, order) => {
    if (!acc.includes(order.customerInfo?.email)) {
      acc.push(order.customerInfo?.email);
    }
    return acc;
  }, []).length;

  // Prepare chart data
  const salesChartData = dailySales.map(item => ({
    date: `${item._id.day}/${item._id.month}`,
    sales: item.sales,
    orders: item.orders
  }));

  const orderStatusChartData = orderStatusStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  const paymentMethodChartData = paymentMethodStats.map(item => ({
    name: item._id.toUpperCase(),
    orders: item.count,
    revenue: item.revenue
  }));

  const COLORS = ['#d4af37', '#f4c430', '#b8860b', '#daa520', '#ffd700'];

  const StatCard = ({ title, value, change, icon: Icon, gradient }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 hover:border-luxury-gold/50 transition-all duration-500 group backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-serif font-bold text-luxury-pearl mb-3">{value}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <ArrowUpRight className={`w-4 h-4 ${change >= 0 ? 'text-green-500' : 'text-red-500 rotate-90'}`} />
              <p className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}
              </p>
              <span className="text-xs text-gray-500">this period</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-sm ${gradient} shadow-lg`}>
          <Icon size={24} className="text-black" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-luxury-gold/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-sm font-medium mb-4"
              >
                <Crown className="w-4 h-4 mr-2" />
                Admin Dashboard
              </motion.div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-luxury-pearl mb-2">
                Performance Overview
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-luxury-gold to-transparent mb-3"></div>
              <p className="text-gray-400 text-lg">Monitor your luxury fragrance empire</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-3 bg-luxury-charcoal border border-luxury-gold/30 rounded-sm text-luxury-pearl focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`Rs. ${overview.totalRevenue?.toLocaleString() || 0}`}
              change={overview.recentRevenue}
              icon={DollarSign}
              gradient="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Total Orders"
              value={overview.totalOrders || 0}
              change={overview.recentOrders}
              icon={ShoppingCart}
              gradient="bg-gradient-to-br from-luxury-gold to-yellow-600"
            />
            <StatCard
              title="Total Products"
              value={overview.totalProducts || 0}
              icon={Package}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title="Total Customers"
              value={uniqueCustomers || overview.totalUsers || 0}
              change={overview.recentUsers}
              icon={Users}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">Sales Overview</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
                </div>
                <BarChart3 className="text-luxury-gold" size={24} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }}
                    formatter={(value, name) => [
                      name === 'sales' ? `Rs. ${value.toLocaleString()}` : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]} 
                  />
                  <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="#60a5fa" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Order Status Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">Order Status</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
                </div>
                <TrendingUp className="text-luxury-gold" size={24} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Payment Methods & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">Payment Methods</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethodChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
                  <Bar dataKey="orders" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm p-6 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">Top Selling Products</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center space-x-4 p-3 bg-luxury-black/50 border border-luxury-gold/10 rounded-sm hover:border-luxury-gold/30 transition-all">
                    <div className="w-12 h-12 bg-luxury-black border border-luxury-gold/20 rounded-sm flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-luxury-gold" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-luxury-pearl">{product.name}</h4>
                      <p className="text-sm text-gray-400">{product.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-luxury-gold">Rs. {product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-luxury-charcoal border border-luxury-gold/20 rounded-sm backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-luxury-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-pearl mb-1">Recent Orders</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-luxury-gold to-transparent"></div>
                </div>
                <button className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded-sm hover:bg-luxury-gold/20 transition-all font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-luxury-gold/20">
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="pb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={order._id} className="border-b border-luxury-gold/10 hover:bg-luxury-black/50 transition-colors">
                        <td className="py-4 text-sm font-medium text-luxury-pearl">
                          #{order.orderNumber}
                        </td>
                        <td className="py-4 text-sm text-gray-400">
                          {order.customerInfo.fullName}
                        </td>
                        <td className="py-4 text-sm font-serif font-semibold text-luxury-gold">
                          Rs. {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm border ${
                            order.orderStatus === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                            order.orderStatus === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                            order.orderStatus === 'processing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                            'bg-gray-500/10 text-gray-500 border-gray-500/30'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <button className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-sm transition-colors">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;