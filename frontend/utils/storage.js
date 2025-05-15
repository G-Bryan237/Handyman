import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  AUTH_TOKEN: 'handyman_auth_token',
  USER_DATA: 'handyman_user_data',
  SETTINGS: 'handyman_settings',
  RECENT_SEARCHES: 'handyman_recent_searches',
  FAVORITES: 'handyman_favorites',
  DARK_MODE: 'handyman_dark_mode',
  ACTIVE_ROLE: 'handyman_active_role',  // New key for tracking current role
  PROVIDER_ONBOARDING: 'handyman_provider_onboarding', // Track onboarding completion
  USER_LOCATION: 'handyman_user_location', // User's saved location
  NOTIFICATION_SETTINGS: 'handyman_notification_settings', // Notification preferences
  PROVIDER_SERVICES: 'handyman_provider_services', // Provider's service offerings
  PROVIDER_AVAILABILITY: 'handyman_provider_availability', // Provider's availability
  LANGUAGE: 'handyman_language', // App language preference
  CACHED_CATEGORIES: 'handyman_cached_categories', // Cached service categories
};

// Error handler wrapper
const handleStorageOperation = async (operation, defaultReturn = null) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Storage operation failed:', error);
    return defaultReturn;
  }
};

// User authentication token operations
export const saveToken = async (token) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    return true;
  }, false);
};

// Add setToken as an alias for saveToken for compatibility
export const setToken = saveToken;

export const getToken = async () => {
  return handleStorageOperation(async () => {
    const token = await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    return token;
  });
};

export const removeToken = async () => {
  return handleStorageOperation(async () => {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    return true;
  }, false);
};

// User data operations
export const saveUserData = async (userData) => {
  return handleStorageOperation(async () => {
    // If the user is a provider, make sure we set the default active role
    if (userData?.role === 'provider' && !(await getActiveRole())) {
      await setActiveRole('user'); // Default to user role even for providers
    }
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  }, false);
};

export const getUserData = async () => {
  return handleStorageOperation(async () => {
    const userData = await AsyncStorage.getItem(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  });
};

export const updateUserData = async (updates) => {
  return handleStorageOperation(async () => {
    const userData = await getUserData() || {};
    const updatedData = { ...userData, ...updates };
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(updatedData));
    return true;
  }, false);
};

// Check if user is logged in
export const isLoggedIn = async () => {
  return handleStorageOperation(async () => {
    const token = await getToken();
    return !!token; // Convert to boolean
  }, false);
};

// Get specific user profile information
export const getUserProfile = async () => {
  return handleStorageOperation(async () => {
    const userData = await getUserData();
    return userData?.profile || {};
  }, {});
};

// Update nested user data properties with deep merge
export const updateNestedUserData = async (path, value) => {
  return handleStorageOperation(async () => {
    const userData = await getUserData() || {};
    
    // Create a deep copy of the user data
    const updatedData = JSON.parse(JSON.stringify(userData));
    
    // Handle path as array or string
    const pathArray = Array.isArray(path) ? path : path.split('.');
    let current = updatedData;
    
    // Navigate to the nested property
    for (let i = 0; i < pathArray.length - 1; i++) {
      const key = pathArray[i];
      current[key] = current[key] || {};
      current = current[key];
    }
    
    // Set the value at the final path
    current[pathArray[pathArray.length - 1]] = value;
    
    // Save the updated data
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(updatedData));
    return true;
  }, false);
};

// Clear only user-related data (for logout)
export const clearUserData = async () => {
  return handleStorageOperation(async () => {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(KEYS.USER_DATA),
      AsyncStorage.removeItem(KEYS.PROVIDER_ONBOARDING)
    ]);
    return true;
  }, false);
};

// App settings
export const saveSettings = async (settings) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  }, false);
};

export const getSettings = async () => {
  return handleStorageOperation(async () => {
    const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  }, {});
};

// Recent searches
export const addRecentSearch = async (search) => {
  return handleStorageOperation(async () => {
    const searches = await getRecentSearches();
    const updatedSearches = [search, ...searches.filter(s => s !== search)].slice(0, 10);
    await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updatedSearches));
    return true;
  }, false);
};

export const getRecentSearches = async () => {
  return handleStorageOperation(async () => {
    const searches = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
    return searches ? JSON.parse(searches) : [];
  }, []);
};

export const clearRecentSearches = async () => {
  return handleStorageOperation(async () => {
    await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
    return true;
  }, false);
};

// Favorites
export const toggleFavorite = async (itemId) => {
  return handleStorageOperation(async () => {
    const favorites = await getFavorites();
    const itemIndex = favorites.indexOf(itemId);
    
    if (itemIndex >= 0) {
      favorites.splice(itemIndex, 1);
    } else {
      favorites.push(itemId);
    }
    
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return favorites;
  }, []);
};

export const getFavorites = async () => {
  return handleStorageOperation(async () => {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  }, []);
};

// Role management
export const setActiveRole = async (role) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.ACTIVE_ROLE, role);
    return true;
  }, false);
};

export const getActiveRole = async () => {
  return handleStorageOperation(async () => {
    const role = await AsyncStorage.getItem(KEYS.ACTIVE_ROLE);
    return role || 'user'; // Default to user if not set
  }, 'user');
};

// Provider onboarding status
export const setProviderOnboardingComplete = async (status) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.PROVIDER_ONBOARDING, JSON.stringify(status));
    return true;
  }, false);
};

export const getProviderOnboardingStatus = async () => {
  return handleStorageOperation(async () => {
    const status = await AsyncStorage.getItem(KEYS.PROVIDER_ONBOARDING);
    return status ? JSON.parse(status) : false;
  }, false);
};

// Location management
export const saveUserLocation = async (locationData) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.USER_LOCATION, JSON.stringify(locationData));
    return true;
  }, false);
};

export const getUserLocation = async () => {
  return handleStorageOperation(async () => {
    const location = await AsyncStorage.getItem(KEYS.USER_LOCATION);
    return location ? JSON.parse(location) : null;
  });
};

// App language preference
export const setAppLanguage = async (languageCode) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.LANGUAGE, languageCode);
    return true;
  }, false);
};

export const getAppLanguage = async () => {
  return handleStorageOperation(async () => {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language || 'en'; // Default to English
  }, 'en');
};

// Notification settings
export const saveNotificationSettings = async (settings) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
    return true;
  }, false);
};

export const getNotificationSettings = async () => {
  return handleStorageOperation(async () => {
    const settings = await AsyncStorage.getItem(KEYS.NOTIFICATION_SETTINGS);
    // Default notification settings if none exist
    const defaultSettings = {
      pushEnabled: true,
      emailEnabled: true,
      bookingReminders: true,
      promotions: true,
      serviceUpdates: true,
    };
    return settings ? JSON.parse(settings) : defaultSettings;
  }, {
    pushEnabled: true,
    emailEnabled: true,
    bookingReminders: true,
    promotions: true,
    serviceUpdates: true,
  });
};

// Provider-specific data management
export const saveProviderServices = async (services) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.PROVIDER_SERVICES, JSON.stringify(services));
    return true;
  }, false);
};

export const getProviderServices = async () => {
  return handleStorageOperation(async () => {
    const services = await AsyncStorage.getItem(KEYS.PROVIDER_SERVICES);
    return services ? JSON.parse(services) : [];
  }, []);
};

export const saveProviderAvailability = async (availability) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.PROVIDER_AVAILABILITY, JSON.stringify(availability));
    return true;
  }, false);
};

export const getProviderAvailability = async () => {
  return handleStorageOperation(async () => {
    const availability = await AsyncStorage.getItem(KEYS.PROVIDER_AVAILABILITY);
    return availability ? JSON.parse(availability) : null;
  });
};

// Cache management for categories and frequently accessed data
export const cacheCategories = async (categories) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.CACHED_CATEGORIES, JSON.stringify({
      timestamp: Date.now(),
      data: categories
    }));
    return true;
  }, false);
};

export const getCachedCategories = async (maxAgeMs = 3600000) => { // Default 1 hour
  return handleStorageOperation(async () => {
    const cached = await AsyncStorage.getItem(KEYS.CACHED_CATEGORIES);
    if (!cached) return null;
    
    const { timestamp, data } = JSON.parse(cached);
    const isCacheValid = Date.now() - timestamp < maxAgeMs;
    
    return isCacheValid ? data : null;
  });
};

// Dark mode preference
export const setDarkMode = async (enabled) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.DARK_MODE, JSON.stringify(enabled));
    return true;
  }, false);
};

export const getDarkMode = async () => {
  return handleStorageOperation(async () => {
    const darkMode = await AsyncStorage.getItem(KEYS.DARK_MODE);
    return darkMode ? JSON.parse(darkMode) : null;
  });
};

// Clear all app data
export const clearAllData = async () => {
  return handleStorageOperation(async () => {
    const keys = Object.values(KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  }, false);
};

export default {
  setToken,
  saveToken,
  getToken,
  removeToken,
  saveUserData,
  getUserData,
  updateUserData,
  saveSettings,
  getSettings,
  addRecentSearch,
  getRecentSearches,
  clearRecentSearches,
  toggleFavorite,
  getFavorites,
  setActiveRole,
  getActiveRole,
  setProviderOnboardingComplete,
  getProviderOnboardingStatus,
  clearAllData,
  isLoggedIn,
  getUserProfile,
  updateNestedUserData,
  clearUserData,
  saveUserLocation,
  getUserLocation,
  setAppLanguage,
  getAppLanguage,
  saveNotificationSettings,
  getNotificationSettings,
  saveProviderServices,
  getProviderServices,
  saveProviderAvailability,
  getProviderAvailability,
  cacheCategories,
  getCachedCategories,
  setDarkMode,
  getDarkMode,
};
