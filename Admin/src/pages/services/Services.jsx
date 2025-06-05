import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Settings, DollarSign, MapPin, Clock } from 'lucide-react';
import ApiService from '../../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const categories = [
    { icon: 'electrical-services', label: 'Electricians', color: '#ffa500' },
    { icon: 'plumbing', label: 'Plumbers', color: '#4b9fd6' },
    { icon: 'spa', label: 'Beauticians', color: '#ff69b4' },
    { icon: 'cleaning-services', label: 'Cleaning', color: '#4caf50' },
    { icon: 'format-paint', label: 'Painters', color: '#ff8c00' },
    { icon: 'construction', label: 'Carpenters', color: '#8b4513' },
    { icon: 'grass', label: 'Landscapers', color: '#228b22' },
    { icon: 'home', label: 'Smart Home', color: '#4682B4' },
    { icon: 'settings', label: 'Mechanics', color: '#ff5722' },
    { icon: 'security', label: 'Security', color: '#607d8b' },
    { icon: 'local-shipping', label: 'Movers', color: '#8bc34a' },
    { icon: 'wb-sunny', label: 'Solar Services', color: '#ffc107' },
  ];

  useEffect(() => {
    console.log('Services component mounted');
    fetchServices();
    fetchStats();
  }, [pagination.page, searchTerm, selectedCategory, selectedStatus]);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        category: selectedCategory,
        active: selectedStatus
      };
      
      const response = await ApiService.getServices(params);
      console.log('Services response:', response);
      setServices(response.services || []);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (err) {
      console.error('Fetch services error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ApiService.getServiceStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Set default stats if API fails
      setStats({
        totalServices: 0,
        activeServices: 0,
        inactiveServices: 0
      });
    }
  };

  const handleCreateService = async (serviceData) => {
    try {
      await ApiService.createService(serviceData);
      setShowCreateModal(false);
      fetchServices();
      fetchStats();
    } catch (err) {
      alert('Failed to create service: ' + err.message);
    }
  };

  const handleUpdateService = async (serviceData) => {
    try {
      await ApiService.updateService(editingService._id, serviceData);
      setShowEditModal(false);
      setEditingService(null);
      fetchServices();
      fetchStats();
    } catch (err) {
      alert('Failed to update service: ' + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await ApiService.deleteService(serviceId);
        fetchServices();
        fetchStats();
      } catch (err) {
        alert('Failed to delete service: ' + err.message);
      }
    }
  };

  const ServiceModal = ({ isOpen, onClose, onSubmit, service = null, title }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      description: '',
      icon: '',
      color: '#000000',
      priceRange: { min: 0, max: 0 },
      pricingModel: 'hourly',
      availability: { regions: [], isNationwide: false },
      isActive: true,
      tags: [],
      estimatedDuration: { min: 30, max: 120 }
    });

    useEffect(() => {
      if (service) {
        setFormData(service);
      }
    }, [service]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.label} value={cat.label}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  placeholder="e.g., electrical-services"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Price ($)</label>
                <input
                  type="number"
                  value={formData.priceRange.min}
                  onChange={(e) => setFormData({
                    ...formData, 
                    priceRange: {...formData.priceRange, min: parseInt(e.target.value)}
                  })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Price ($)</label>
                <input
                  type="number"
                  value={formData.priceRange.max}
                  onChange={(e) => setFormData({
                    ...formData, 
                    priceRange: {...formData.priceRange, max: parseInt(e.target.value)}
                  })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pricing Model</label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({...formData, pricingModel: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                >
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed</option>
                  <option value="per_service">Per Service</option>
                  <option value="quote_based">Quote Based</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-bold text-gray-700">Active Service</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.availability.isNationwide}
                  onChange={(e) => setFormData({
                    ...formData, 
                    availability: {...formData.availability, isNationwide: e.target.checked}
                  })}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-bold text-gray-700">Available Nationwide</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg font-bold transition-all duration-200"
              >
                {service ? 'Update' : 'Create'} Service
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add error state display
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
          <button 
            onClick={() => {
              setError(null);
              fetchServices();
              fetchStats();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Service Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">Manage available services and categories</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-bold"
          >
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Services</p>
              <p className="text-3xl font-black text-gray-900">{stats.totalServices || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Settings className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Services</p>
              <p className="text-3xl font-black text-green-600">{stats.activeServices || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Inactive Services</p>
              <p className="text-3xl font-black text-red-600">{stats.inactiveServices || 0}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <MoreHorizontal className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
              <p className="text-3xl font-black text-purple-600">{categories.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Filter className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 shadow-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.label} value={cat.label}>{cat.label}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 shadow-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Service</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Price Range</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Providers</th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/30">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/50" style={{ backgroundColor: service.color + '20' }}>
                        <span className="text-lg" style={{ color: service.color }}>⚡</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-600 font-medium">{service.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-flex px-4 py-2 text-xs font-black rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-gray-900">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${service.priceRange?.min || 0} - ${service.priceRange?.max || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{service.pricingModel}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-4 py-2 text-xs font-black rounded-full border ${
                      service.isActive 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200' 
                        : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900">
                    {service.providersCount || 0}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateService}
        title="Create New Service"
      />
      
      <ServiceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingService(null);
        }}
        onSubmit={handleUpdateService}
        service={editingService}
        title="Edit Service"
      />
    </div>
  );
};

export default Services;
