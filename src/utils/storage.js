// Local Storage utility functions for the Italian Restaurant App

/**
 * Save user profile data to localStorage
 * @param {Object} profile - User profile object containing name, email, phone
 */
export const saveProfile = (profile) => {
  try {
    localStorage.setItem('italian-restaurant-profile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
  }
};

/**
 * Get user profile data from localStorage
 * @returns {Object|null} User profile object or null if not found
 */
export const getProfile = () => {
  try {
    const profile = localStorage.getItem('italian-restaurant-profile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting profile from localStorage:', error);
    return null;
  }
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = () => {
  try {
    localStorage.setItem('italian-restaurant-onboarding-completed', 'true');
  } catch (error) {
    console.error('Error setting onboarding completion:', error);
  }
};

/**
 * Check if onboarding is completed
 * @returns {boolean} True if onboarding is completed
 */
export const isOnboardingCompleted = () => {
  try {
    return localStorage.getItem('italian-restaurant-onboarding-completed') === 'true';
  } catch (error) {
    console.error('Error checking onboarding completion:', error);
    return false;
  }
};

/**
 * Clear all user data (for logout)
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem('italian-restaurant-profile');
    localStorage.removeItem('italian-restaurant-onboarding-completed');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
