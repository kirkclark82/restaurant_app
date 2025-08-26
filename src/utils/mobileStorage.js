import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_FAVORITES: 'user_favorites',
  CURRENT_USER_EMAIL: 'current_user_email', // NEW: Track current logged-in user
  USER_PROFILES: 'user_profiles' // NEW: Store multiple user profiles
};

// DEBUG: Function to check all stored data
export const debugStorage = async () => {
  try {
    console.log('🔍 DEBUG: Checking all AsyncStorage data...');
    
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('🔍 DEBUG: All storage keys:', allKeys);
    
    for (const key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`🔍 DEBUG: Key "${key}":`, value);
    }
    
    // Check specific keys
    const profiles = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    const currentUser = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    const onboarding = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    
    console.log('🔍 DEBUG: User profiles:', profiles);
    console.log('🔍 DEBUG: Current user:', currentUser);
    console.log('🔍 DEBUG: Onboarding completed:', onboarding);
    
    return { allKeys, profiles, currentUser, onboarding };
  } catch (error) {
    console.error('❌ DEBUG: Error checking storage:', error);
    return null;
  }
};

// Initialize database with user profiles structure
export const initDatabase = async () => {
  try {
    console.log('Initializing mobile database...');
    
    // Check if user profiles structure exists
    const profilesExist = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!profilesExist) {
      // Initialize with empty user profiles object
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify({}));
      console.log('User profiles structure initialized');
    }
    
    // Check if current user tracking exists
    const currentUser = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    if (!currentUser) {
      console.log('No current user set');
    } else {
      console.log('Current user found:', currentUser);
    }
    
    console.log('Mobile database initialized successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error initializing mobile database:', error);
    throw error;
  }
};

// Save profile for a specific user
export const saveProfile = async (profileData) => {
  try {
    console.log('saveProfile: Saving profile for email:', profileData.email);
    
    // Get existing profiles
    const profilesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    const profiles = profilesData ? JSON.parse(profilesData) : {};
    
    // Add/update this user's profile
    profiles[profileData.email] = profileData;
    
    // Save updated profiles
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
    
    // Set as current user
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, profileData.email);
    
    console.log('Profile saved successfully for:', profileData.email);
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Get profile for the current logged-in user
export const getProfile = async () => {
  try {
    // Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    if (!currentUserEmail) {
      console.log('getProfile: No current user logged in');
      return null;
    }
    
    console.log('getProfile: Getting profile for current user:', currentUserEmail);
    
    // Get profiles and return current user's profile
    const profilesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (profilesData) {
      const profiles = JSON.parse(profilesData);
      const profile = profiles[currentUserEmail];
      
      if (profile) {
        console.log('getProfile: Profile found for:', currentUserEmail);
        return profile;
      } else {
        console.log('getProfile: No profile found for current user:', currentUserEmail);
        return null;
      }
    }
    
    console.log('getProfile: No profiles found');
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

// Check if a specific email exists in the database
export const checkEmailExists = async (email) => {
  try {
    console.log('checkEmailExists: Checking for email:', email);
    
    // Get all user profiles
    const profilesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    console.log('checkEmailExists: Raw profiles data:', profilesData);
    
    if (profilesData) {
      const profiles = JSON.parse(profilesData);
      console.log('checkEmailExists: Parsed profiles:', profiles);
      
      // Check if the email exists in any profile
      const emailExists = profiles.hasOwnProperty(email);
      console.log('checkEmailExists: Email exists:', emailExists);
      return emailExists;
    }
    
    console.log('checkEmailExists: No profiles found');
    return false;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};

// Set current user (for login)
export const setCurrentUser = async (email) => {
  try {
    console.log('setCurrentUser: Setting current user to:', email);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, email);
    console.log('Current user set successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error setting current user:', error);
    throw error;
  }
};

// Clear current user (for logout)
export const clearCurrentUser = async () => {
  try {
    console.log('clearCurrentUser: Clearing current user');
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    console.log('Current user cleared successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing current user:', error);
    throw error;
  }
};

// Onboarding management
export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    console.log('Onboarding marked as completed');
    return Promise.resolve();
  } catch (error) {
    console.error('Error setting onboarding completed:', error);
    throw error;
  }
};

export const isOnboardingCompleted = async () => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

// Clear onboarding status without removing user data
export const clearOnboardingStatus = async () => {
  try {
    console.log('clearOnboardingStatus: Starting to clear onboarding status');
    
    // Check what's currently stored
    const currentStatus = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    console.log('clearOnboardingStatus: Current status before clearing:', currentStatus);
    
    // Remove the item
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    console.log('clearOnboardingStatus: AsyncStorage.removeItem completed');
    
    // Verify it was removed
    const afterRemoval = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    console.log('clearOnboardingStatus: Status after removal:', afterRemoval);
    
    console.log('clearOnboardingStatus: Onboarding status cleared successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error clearing onboarding status:', error);
    throw error;
  }
};

// User data management
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      STORAGE_KEYS.USER_FAVORITES
    ]);
    console.log('User data cleared successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

export const removeAllUserData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All user data removed successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error removing all user data:', error);
    throw error;
  }
};

// Favorites management - now user-specific
export const addToFavorites = async (dishId) => {
  try {
    // Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    if (!currentUserEmail) {
      console.log('addToFavorites: No current user logged in');
      return Promise.resolve();
    }
    
    console.log('addToFavorites: Adding dish', dishId, 'to favorites for user:', currentUserEmail);
    
    const favorites = await getFavorites();
    if (!favorites.includes(dishId)) {
      favorites.push(dishId);
      // Store favorites with user-specific key
      const userFavoritesKey = `${STORAGE_KEYS.USER_FAVORITES}_${currentUserEmail}`;
      await AsyncStorage.setItem(userFavoritesKey, JSON.stringify(favorites));
    }
    console.log('Added to favorites successfully for user:', currentUserEmail);
    return Promise.resolve();
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (dishId) => {
  try {
    // Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    if (!currentUserEmail) {
      console.log('removeFromFavorites: No current user logged in');
      return Promise.resolve();
    }
    
    console.log('removeFromFavorites: Removing dish', dishId, 'from favorites for user:', currentUserEmail);
    
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== dishId);
    // Store favorites with user-specific key
    const userFavoritesKey = `${STORAGE_KEYS.USER_FAVORITES}_${currentUserEmail}`;
    await AsyncStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
    console.log('Removed from favorites successfully for user:', currentUserEmail);
    return Promise.resolve();
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const isFavorite = async (dishId) => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(dishId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export const getFavorites = async () => {
  try {
    // Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    if (!currentUserEmail) {
      console.log('getFavorites: No current user logged in');
      return [];
    }
    
    // Get favorites for current user
    const userFavoritesKey = `${STORAGE_KEYS.USER_FAVORITES}_${currentUserEmail}`;
    const favoritesData = await AsyncStorage.getItem(userFavoritesKey);
    
    if (favoritesData) {
      const favorites = JSON.parse(favoritesData);
      console.log('getFavorites: Found', favorites.length, 'favorites for user:', currentUserEmail);
      return favorites;
    }
    
    console.log('getFavorites: No favorites found for user:', currentUserEmail);
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// DEBUG: Function to restore sample data for testing
export const restoreSampleData = async () => {
  try {
    console.log('🔧 DEBUG: Restoring sample data...');
    
    // Create sample user profile
    const sampleProfile = {
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      preferences: {
        dietaryRestrictions: [],
        favoriteCuisines: ['Italian', 'Mexican']
      },
      createdAt: new Date().toISOString()
    };
    
    // Save sample profile
    await saveProfile(sampleProfile);
    
    // Add some sample favorites
    await addToFavorites('dish_1');
    await addToFavorites('dish_2');
    
    // Mark onboarding as completed
    await setOnboardingCompleted();
    
    console.log('🔧 DEBUG: Sample data restored successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ DEBUG: Error restoring sample data:', error);
    throw error;
  }
};
