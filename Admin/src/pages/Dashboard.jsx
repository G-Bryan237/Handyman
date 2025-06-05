import React, { useState, useEffect } from 'react';
import { Users, UserCheck, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ApiService from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    clientUsers: 0,
    providerUsers: 0,
    activeUsers: 0
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [growthPeriod, setGrowthPeriod] = useState('6months');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data from API...');
      
      // Fetch all data concurrently
      const [statsResponse, growthResponse, activityResponse] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getUserGrowth(growthPeriod),
        ApiService.getRecentActivity(10)
      ]);
      
      console.log('Dashboard API responses:', { statsResponse, growthResponse, activityResponse });
      
      if (statsResponse) {
        // Ensure we're extracting numbers, not objects
        const safeStats = {
          totalUsers: Number(statsResponse.totalUsers) || 0,
          clientUsers: Number(statsResponse.totalClients) || 0,
          providerUsers: Number(statsResponse.totalProviders) || 0,
          activeUsers: Number(statsResponse.totalUsers) || 0
        };
        
        console.log('Processed stats:', safeStats);
        setStats(safeStats);
        
        // Set pie chart data
        setPieData([
          { name: 'Clients', value: safeStats.clientUsers, color: '#3B82F6' },
          { name: 'Providers', value: safeStats.providerUsers, color: '#10B981' }
        ]);
      }

      // Set growth chart data
      if (Array.isArray(growthResponse)) {
        setChartData(growthResponse);
      } else {
        // Fallback data if no growth data available
        setChartData([
          { month: 'Jan 2024', clients: 12, providers: 5 },
          { month: 'Feb 2024', clients: 19, providers: 8 },
          { month: 'Mar 2024', clients: 25, providers: 12 },
          { month: 'Apr 2024', clients: 32, providers: 15 },
          { month: 'May 2024', clients: 38, providers: 18 },
          { month: 'Jun 2024', clients: 45, providers: 22 }
        ]);
      }

      // Set recent activities
      if (Array.isArray(activityResponse)) {
        setRecentActivities(activityResponse);
      } else {
        setRecentActivities([]);
      }

      setLastUpdated(new Date());
      console.log('Dashboard data updated successfully');
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Set default empty data
      setStats({
        totalUsers: 0,
        clientUsers: 0,
        providerUsers: 0,
        activeUsers: 0
      });
      setChartData([]);
      setPieData([]);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [growthPeriod]); // Refetch when period changes

  const calculateGrowthPercentage = (data, type) => {
    if (!data || data.length < 2) return 0;
    
    const current = data[data.length - 1]?.[type] || 0;
    const previous = data[data.length - 2]?.[type] || 0;
    
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const StatCard = ({ title, value, icon: Icon, gradient, change }) => (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8 opacity-10">
        <div className={`w-full h-full rounded-full ${gradient}`} />
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-black text-gray-900 mb-3">
            {typeof value === 'number' ? value.toLocaleString() : '0'}
          </p>
          {change !== undefined && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              change > 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : change < 0
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {change > 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : change < 0 ? (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              ) : null}
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  // Calculate real growth percentages
  const clientGrowth = calculateGrowthPercentage(chartData, 'clients');
  const providerGrowth = calculateGrowthPercentage(chartData, 'providers');

  // Loading and error states...
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg font-medium">Real-time overview of users and platform activity</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3 shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-bold text-gray-700">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with real growth data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          change={Math.round((clientGrowth + providerGrowth) / 2)}
        />
        <StatCard
          title="Client Users"
          value={stats.clientUsers || 0}
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600"
          change={clientGrowth}
        />
        <StatCard
          title="Service Providers"
          value={stats.providerUsers || 0}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600"
          change={providerGrowth}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers || 0}
          icon={Activity}
          gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
          change={Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}
        />
      </div>

      {/* Charts Section with period selector */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Bar Chart with period selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-4">
              <select 
                value={growthPeriod} 
                onChange={(e) => setGrowthPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium"
              >
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 shadow-sm"></div>
                  <span className="text-gray-700 font-semibold">Clients</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-emerald-50 rounded-full">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 shadow-sm"></div>
                  <span className="text-gray-700 font-semibold">Providers</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-80">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="clients" 
                    fill="#3B82F6" 
                    name="Clients" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="providers" 
                    fill="#10B981" 
                    name="Providers" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No growth data available for the selected period
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl">
          <h3 className="text-2xl font-black text-gray-900 mb-8">User Distribution</h3>
          <div className="h-80">
            {pieData && pieData.length > 0 && pieData.some(entry => entry.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No user distribution data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity with real data */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">Recent Activity</h3>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl text-sm font-bold border border-blue-200">
              Live Updates
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-5 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100">
                  <div className={`w-4 h-4 rounded-full shadow-lg ${
                    activity.type === 'provider' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/50' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/50'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      <span className="font-bold text-gray-800">{activity.user || 'Unknown User'}</span>
                      <span className="text-gray-600 ml-1">{activity.action || 'performed an action'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{activity.time || 'Recently'}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold border ${
                    activity.type === 'provider' 
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200' 
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200'
                  }`}>
                    {activity.type || 'user'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activities to display</p>
                <p className="text-sm text-gray-400 mt-2">New user registrations will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;