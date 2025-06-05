import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Star, CheckCircle, Plus, X } from 'lucide-react';
import ApiService from '../../utils/api';

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'provider'
  });

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching providers...');
      const response = await ApiService.getUsers({
        role: 'provider',
        search: searchTerm,
        limit: 50
      });
      console.log('Providers API response:', response);
      
      // Add more safety checks here
      if (!response || !Array.isArray(response.users)) {
        console.warn('Invalid response format:', response);
        setProviders([]);
        return;
      }
      
      // Map the response to match expected provider structure with more safety checks
      const providersData = response.users.map(user => {
        // Ensure user object exists and has required properties
        if (!user || typeof user !== 'object') {
          console.warn('Invalid user object:', user);
          return null;
        }

        // Fix the specialty field to handle both string arrays and object arrays
        let specialty = 'General Services';
        if (user.providerProfile?.services && Array.isArray(user.providerProfile.services) && user.providerProfile.services.length > 0) {
          const firstService = user.providerProfile.services[0];
          if (typeof firstService === 'string') {
            specialty = firstService;
          } else if (typeof firstService === 'object' && firstService.serviceName) {
            specialty = firstService.serviceName;
          } else if (typeof firstService === 'object' && firstService.name) {
            specialty = firstService.name;
          }
        }

        return {
          id: user._id || user.id || `temp-${Date.now()}-${Math.random()}`,
          name: String(user.name || 'Unknown Provider'),
          email: String(user.email || 'No email provided'),
          phone: String(user.phone || 'N/A'),
          specialty: String(specialty),
          type: String(user.providerProfile?.providerType || 'individual'),
          joinDate: user.createdAt || new Date().toISOString(),
          rating: Number(user.providerProfile?.metrics?.averageRating) || 0,
          totalJobs: Number(user.providerProfile?.metrics?.totalTransactions) || 0,
          successRate: Number(user.providerProfile?.metrics?.successRate) || 0,
          status: user.isVerified ? 'verified' : 'pending',
          lastActivity: user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'N/A'
        };
      }).filter(Boolean); // Remove any null entries
      
      console.log('Processed providers data:', providersData);
      setProviders(providersData);
      
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError(err.message || 'Failed to load providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ApiService.createUser(newUser);
      console.log('User created:', response);
      
      // Refresh the providers list
      await fetchProviders();
      
      // Reset form and close modal
      setNewUser({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'provider'
      });
      setShowAddModal(false);
      
      alert('Provider added successfully!');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create provider: ' + (error.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    // Add safety checks for providers array
    if (!Array.isArray(providers)) {
      console.warn('Providers is not an array:', providers);
      setFilteredProviders([]);
      return;
    }

    try {
      const filtered = providers.filter(provider => {
        // Ensure provider object exists
        if (!provider || typeof provider !== 'object') {
          return false;
        }

        const name = String(provider.name || '').toLowerCase();
        const email = String(provider.email || '').toLowerCase();
        const specialty = String(provider.specialty || '').toLowerCase();
        const searchLower = String(searchTerm || '').toLowerCase();

        return name.includes(searchLower) ||
               email.includes(searchLower) ||
               specialty.includes(searchLower);
      });
      
      setFilteredProviders(filtered);
    } catch (filterError) {
      console.error('Error filtering providers:', filterError);
      setFilteredProviders([]);
    }
  }, [searchTerm, providers]);

  // Add error boundary handling
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
          <button 
            onClick={() => {
              setError(null);
              fetchProviders();
            }}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add safety check for providers data
  const safeFilteredProviders = Array.isArray(filteredProviders) ? filteredProviders : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Service Provider Users
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">Manage service provider user accounts</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-bold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Provider</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter password"
                  minLength="6"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Add Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 shadow-sm"
            />
          </div>
          <button className="flex items-center px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 font-bold text-gray-700 transition-all duration-200">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Total Providers</h3>
              <p className="text-3xl font-black text-purple-600 mt-2">
                {Number(safeFilteredProviders.length) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Verified</h3>
              <p className="text-3xl font-black text-green-600 mt-2">
                {Number(safeFilteredProviders.filter(provider => provider.status === 'verified').length) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Pending</h3>
              <p className="text-3xl font-black text-orange-600 mt-2">
                {Number(safeFilteredProviders.filter(provider => provider.status === 'pending').length) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Total Jobs</h3>
              <p className="text-3xl font-black text-blue-600 mt-2">
                {Number(safeFilteredProviders.reduce((sum, provider) => sum + (Number(provider.totalJobs) || 0), 0)) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-50 to-purple-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="relative px-8 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/30">
              {safeFilteredProviders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-12 text-center text-gray-500">
                    No providers found
                  </td>
                </tr>
              ) : (
                safeFilteredProviders.map((provider, index) => (
                  <tr key={provider.id || `provider-${index}`} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50 transition-all duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-black text-purple-700">
                            {provider.name ? String(provider.name).split(' ').map(n => n[0]).join('').toUpperCase() : 'N/A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{String(provider.name || 'N/A')}</div>
                          <div className="text-sm text-gray-600 font-medium">{String(provider.specialty || 'General Services')}</div>
                          <div className="text-sm text-gray-500 font-medium">ID: {String(provider.id || 'N/A')}</div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${
                              provider.type === 'company' 
                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200'
                            }`}>
                              {String(provider.type || 'individual')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {String(provider.email || 'N/A')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {String(provider.phone || 'N/A')}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{Number(provider.rating) || 0}</span>
                        </div>
                        <div className="text-sm text-gray-500">{Number(provider.totalJobs) || 0} jobs</div>
                        <div className="text-sm text-green-600">{Number(provider.successRate) || 0}% success</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {provider.joinDate ? new Date(provider.joinDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-2 text-xs font-black rounded-full border ${
                        provider.status === 'verified' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200' 
                          : provider.status === 'pending'
                          ? 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border-orange-200'
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200'
                      }`}>
                        {provider.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {String(provider.status || 'pending')}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {String(provider.lastActivity || 'N/A')}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;