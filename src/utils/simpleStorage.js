// Simple localStorage-based storage as fallback
export const waitForDatabase = async () => {
  console.log('Using simple storage fallback');
  return Promise.resolve();
};

// Helper function to get all profiles
const getAllProfiles = () => {
  try {
    const profiles = localStorage.getItem('italian-restaurant-profiles');
    return profiles ? JSON.parse(profiles) : {};
  } catch (error) {
    console.error('Error getting all profiles:', error);
    return {};
  }
};

// Helper function to save all profiles
const saveAllProfiles = (profiles) => {
  try {
    localStorage.setItem('italian-restaurant-profiles', JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving all profiles:', error);
  }
};

export const saveProfile = async (profile) => {
  try {
    const allProfiles = getAllProfiles();
    
    // Add or update the profile for this email
    allProfiles[profile.email] = {
      ...profile,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    saveAllProfiles(allProfiles);
    return allProfiles[profile.email];
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    // Get the current active user email
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (!activeEmail) return null;
    
    const allProfiles = getAllProfiles();
    return allProfiles[activeEmail] || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const getProfileByEmail = async (email) => {
  try {
    const allProfiles = getAllProfiles();
    return allProfiles[email] || null;
  } catch (error) {
    console.error('Error getting profile by email:', error);
    return null;
  }
};

export const setActiveUser = async (email) => {
  try {
    localStorage.setItem('italian-restaurant-active-email', email);
  } catch (error) {
    console.error('Error setting active user:', error);
  }
};

export const setOnboardingCompleted = async (step = 'main') => {
  try {
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (!activeEmail) return;
    
    const allProfiles = getAllProfiles();
    if (allProfiles[activeEmail]) {
      allProfiles[activeEmail].onboardingCompleted = true;
      allProfiles[activeEmail].onboardingCompletedAt = new Date().toISOString();
      saveAllProfiles(allProfiles);
    }
  } catch (error) {
    console.error('Error setting onboarding completion:', error);
  }
};

export const isOnboardingCompleted = async (step = 'main') => {
  try {
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (!activeEmail) return false;
    
    const allProfiles = getAllProfiles();
    const profile = allProfiles[activeEmail];
    return profile ? profile.onboardingCompleted === true : false;
  } catch (error) {
    console.error('Error checking onboarding completion:', error);
    return false;
  }
};

export const clearUserData = async () => {
  try {
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (!activeEmail) return;
    
    const allProfiles = getAllProfiles();
    if (allProfiles[activeEmail]) {
      allProfiles[activeEmail].onboardingCompleted = false;
      allProfiles[activeEmail].onboardingCompletedAt = null;
      saveAllProfiles(allProfiles);
    }
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const removeAllUserData = async () => {
  try {
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (!activeEmail) return;
    
    const allProfiles = getAllProfiles();
    delete allProfiles[activeEmail];
    saveAllProfiles(allProfiles);
    
    localStorage.removeItem('italian-restaurant-active-email');
  } catch (error) {
    console.error('Error removing all user data:', error);
  }
};

export const resetDatabase = async () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

export const sendPasswordEmail = async (email) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { code: verificationCode };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Additional utility functions for managing multiple users
export const getAllUsers = () => {
  return getAllProfiles();
};

export const switchUser = async (email) => {
  await setActiveUser(email);
};

export const removeUser = async (email) => {
  try {
    const allProfiles = getAllProfiles();
    delete allProfiles[email];
    saveAllProfiles(allProfiles);
    
    // If this was the active user, clear the active email
    const activeEmail = localStorage.getItem('italian-restaurant-active-email');
    if (activeEmail === email) {
      localStorage.removeItem('italian-restaurant-active-email');
    }
  } catch (error) {
    console.error('Error removing user:', error);
  }
};
