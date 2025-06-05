import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Settings // Add this import for Services icon
} from 'lucide-react';
import { routes } from '../routes/routes';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersExpanded, setUsersExpanded] = useState(false);
  const location = useLocation();

  // Auto-expand Users section when on any users page
  useEffect(() => {
    if (location.pathname.startsWith('/users')) {
      setUsersExpanded(true);
    }
  }, [location.pathname]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: BarChart3, 
      current: location.pathname === '/' 
    },
    { 
      name: 'Users', 
      href: '/users',
      icon: Users,
      current: location.pathname === '/users',
      children: routes
        .filter(route => route.path.startsWith('/users/'))
        .map(route => ({
          name: route.name,
          href: route.path,
          current: location.pathname === route.path
        }))
    },
    // Add Services navigation
    { 
      name: 'Services', 
      href: '/services/services', 
      icon: Settings, 
      current: location.pathname === '/services/services' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white shadow-lg flex-shrink-0 lg:block ${
        sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-0">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <div className="flex items-center justify-between px-6 py-3">
                    <Link
                      to={item.href}
                      className={`flex items-center text-sm font-medium transition-colors flex-1 ${
                        item.current
                          ? 'text-blue-700'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                    <button
                      onClick={() => setUsersExpanded(!usersExpanded)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {usersExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {usersExpanded && (
                    <div className="ml-8 space-y-1 pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            child.current
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Handyman Admin Panel
            </h2>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;