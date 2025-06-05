import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PROVIDER_ONBOARDING: 'provider_onboarding_complete',
  ACTIVE_ROLE: 'active_role',
  APP_SETTINGS: 'app_settings'
};

// Generic error handler for storage operations
const handleStorageOperation = async (operation, defaultValue = null) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Storage operation error:', error);
    return defaultValue;
  }
};

// Token management
export const saveToken = async (token) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    return true;
  }, false);
};

export const getToken = async () => {
  return handleStorageOperation(async () => {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  }, null);
};

export const removeToken = async () => {
  return handleStorageOperation(async () => {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    return true;
  }, false);
};

// User data management
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
  }, null);
};

export const updateUserData = async (userData) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  }, false);
};

// Role management
export const getActiveRole = async () => {
  return handleStorageOperation(async () => {
    const role = await AsyncStorage.getItem(KEYS.ACTIVE_ROLE);
    return role || 'user';
  }, 'user');
};

export const setActiveRole = async (role) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.ACTIVE_ROLE, role);
    return true;
  }, false);
};

// Provider onboarding
export const setProviderOnboardingComplete = async () => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.PROVIDER_ONBOARDING, 'true');
    return true;
  }, false);
};

export const isProviderOnboardingComplete = async () => {
  return handleStorageOperation(async () => {
    const isComplete = await AsyncStorage.getItem(KEYS.PROVIDER_ONBOARDING);
    return isComplete === 'true';
  }, false);
};

// Provider availability management
export const saveProviderAvailability = async (availabilityData) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem('provider_availability', JSON.stringify(availabilityData));
    return true;
  }, false);
};

export const getProviderAvailability = async () => {
  return handleStorageOperation(async () => {
    const availability = await AsyncStorage.getItem('provider_availability');
    return availability ? JSON.parse(availability) : null;
  }, null);
};

// Clear data functions
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

export const clearAllData = async () => {
  return handleStorageOperation(async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  }, false);
};

// App settings
export const saveSettings = async (settings) => {
  return handleStorageOperation(async () => {
    await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
    return true;
  }, false);
};

export const getSettings = async () => {
  return handleStorageOperation(async () => {
    const settings = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : {};
  }, {});
};
