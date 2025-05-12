import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  AUTH_TOKEN: 'handyman_auth_token',
  USER_DATA: 'handyman_user_data',
  SETTINGS: 'handyman_settings',
  RECENT_SEARCHES: 'handyman_recent_searches',
  FAVORITES: 'handyman_favorites',
  DARK_MODE: 'handyman_dark_mode',
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
  clearAllData,
};
