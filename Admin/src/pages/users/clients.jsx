import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Plus, X } from 'lucide-react';
import ApiService from '../../utils/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching clients...');
      const response = await ApiService.getUsers({
        role: 'user', // Filter for client users only
        search: searchTerm,
        limit: 50
      });
      console.log('Clients API response:', response);
      
      // Add safety checks
      if (!response || !Array.isArray(response.users)) {
        console.warn('Invalid response format:', response);
        setClients([]);
        return;
      }
      
      // Map the response to match expected client structure
      const clientsData = response.users.map(user => {
        // Ensure user object exists
        if (!user || typeof user !== 'object') {
          console.warn('Invalid user object:', user);
          return null;
        }

        return {
          id: user._id || user.id || `temp-${Date.now()}-${Math.random()}`,
          name: String(user.name || 'Unknown Client'),
          email: String(user.email || 'No email provided'),
          phone: String(user.phone || 'N/A'),
          joinDate: user.createdAt || new Date().toISOString(),
          bookings: 0, // Default value since we don't have this data yet
          status: user.isActive ? 'active' : 'inactive',
          lastActivity: user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'N/A'
        };
      }).filter(Boolean); // Remove any null entries
      
      console.log('Processed clients data:', clientsData);
      setClients(clientsData);
      
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError(err.message || 'Failed to load clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ApiService.createUser(newUser);
      console.log('User created:', response);
      
      // Refresh the clients list
      await fetchClients();
      
      // Reset form and close modal
      setNewUser({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
      });
      setShowAddModal(false);
      
      alert('Client added successfully!');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create client: ' + (error.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Add safety checks for clients array
    if (!Array.isArray(clients)) {
      console.warn('Clients is not an array:', clients);
      setFilteredClients([]);
      return;
    }

    try {
      const filtered = clients.filter(client => {
        // Ensure client object exists
        if (!client || typeof client !== 'object') {
          return false;
        }

        const name = String(client.name || '').toLowerCase();
        const email = String(client.email || '').toLowerCase();
        const searchLower = String(searchTerm || '').toLowerCase();

        return name.includes(searchLower) || email.includes(searchLower);
      });
      
      setFilteredClients(filtered);
    } catch (filterError) {
      console.error('Error filtering clients:', filterError);
      setFilteredClients([]);
    }
  }, [searchTerm, clients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading clients...</div>
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
              fetchClients();
            }}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add safety check for clients data
  const safeFilteredClients = Array.isArray(filteredClients) ? filteredClients : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Client Users
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">Manage client user accounts</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-bold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Client</h2>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Add Client
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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900 placeholder-gray-500 shadow-sm"
            />
          </div>
          <button className="flex items-center px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 font-bold text-gray-700 transition-all duration-200">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Total Clients</h3>
              <p className="text-3xl font-black text-blue-600 mt-2">
                {Number(safeFilteredClients.length) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Active Clients</h3>
              <p className="text-3xl font-black text-green-600 mt-2">
                {Number(safeFilteredClients.filter(client => client.status === 'active').length) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Total Bookings</h3>
              <p className="text-3xl font-black text-purple-600 mt-2">
                {Number(safeFilteredClients.reduce((sum, client) => sum + (Number(client.bookings) || 0), 0)) || 0}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-50 to-green-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-8 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                  Bookings
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
              {safeFilteredClients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-12 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                safeFilteredClients.map((client, index) => (
                  <tr key={client.id || `client-${index}`} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200 flex items-center justify-center shadow-lg">
                          <span className="text-sm font-black text-blue-700">
                            {client.name ? String(client.name).split(' ').map(n => n[0]).join('').toUpperCase() : 'N/A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{String(client.name || 'N/A')}</div>
                          <div className="text-sm text-gray-600 font-medium">ID: {String(client.id || 'N/A')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {String(client.email || 'N/A')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {String(client.phone || 'N/A')}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {client.joinDate ? new Date(client.joinDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{Number(client.bookings) || 0}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-xs font-black rounded-full border ${
                        client.status === 'active' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200' 
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200'
                      }`}>
                        {String(client.status || 'inactive')}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {String(client.lastActivity || 'N/A')}
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

export default Clients;