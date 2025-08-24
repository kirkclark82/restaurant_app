import initSqlJs from 'sql.js';

// Database setup
let db;
let SQL;

const initializeDatabase = async () => {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    // Try to load existing database from localStorage
    const existingDb = localStorage.getItem('restaurant_app_sqlite_db');
    
    if (existingDb) {
      try {
        // Convert base64 string back to Uint8Array
        const uint8Array = new Uint8Array(existingDb.split(',').map(Number));
        db = new SQL.Database(uint8Array);
        
        // Verify the database is working by running a simple query
        try {
          const tables = db.exec('SELECT name FROM sqlite_master WHERE type="table"');
          
          // Check if our required tables exist
          const requiredTables = ['user_profiles', 'onboarding_status'];
          const existingTables = tables[0]?.values?.map(row => row[0]) || [];
          const missingTables = requiredTables.filter(table => !existingTables.includes(table));
          
          if (missingTables.length > 0) {
            // Create missing tables
            createTables();
          }
        } catch (validationError) {
          db = new SQL.Database();
          createTables();
        }
      } catch (loadError) {
        db = new SQL.Database();
        createTables();
      }
    } else {
      // Create new database
      db = new SQL.Database();
      createTables();
    }
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
  }
};

const createTables = () => {
  if (!db) return;
  
  try {
    // User profiles table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if phone column exists, if not add it (for existing databases)
    try {
      db.run('ALTER TABLE user_profiles ADD COLUMN phone TEXT');
    } catch (error) {
      // Column already exists, which is fine
    }

    // Onboarding status table
    db.run(`
      CREATE TABLE IF NOT EXISTS onboarding_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        step TEXT,
        completed BOOLEAN DEFAULT 0,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES user_profiles (id)
      )
    `);

    // User sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_token TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES user_profiles (id)
      )
    `);

    // Favorites table for storing user's favorite dishes
    db.run(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        dish_id TEXT,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user_profiles (id)
      )
    `);

    // Order history table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        order_data TEXT,
        total_amount REAL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES user_profiles (id)
      )
    `);
    
    saveDatabaseToStorage();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const saveDatabaseToStorage = () => {
  if (!db) return;
  
  try {
    // Export database to Uint8Array
    const data = db.export();
    // Convert to base64 string for localStorage
    const base64 = Array.from(data).join(',');
    localStorage.setItem('restaurant_app_sqlite_db', base64);
  } catch (error) {
    console.error('Error saving database to localStorage:', error);
  }
};

// Initialize database when module is imported
// Note: This is async but we call it synchronously
// The database will be ready when the first function is called
let dbInitialized = false;

const initPromise = initializeDatabase().then(() => {
  dbInitialized = true;
  console.log('Database initialization promise resolved');
}).catch(error => {
  console.error('Database initialization promise failed:', error);
});

// Export the initialization promise so other modules can wait for it
export const waitForDatabase = () => initPromise;



/**
 * Save user profile data to SQLite
 * @param {Object} profile - User profile object
 * @returns {Object} - Saved profile with ID
 */
export const saveProfile = async (profile) => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    // Check if profile exists
    const existingProfile = db.exec('SELECT id FROM user_profiles LIMIT 1');
    
    if (existingProfile.length > 0 && existingProfile[0].values.length > 0) {
      // Update existing profile
      db.run(`
        UPDATE user_profiles 
        SET name = ?, email = ?, phone = ?, preferences = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [profile.name || '', profile.email || '', profile.phone || '', JSON.stringify(profile.preferences || {}), existingProfile[0].values[0][0]]);
      
      const updatedProfile = {
        id: existingProfile[0].values[0][0],
        ...profile,
        updated_at: new Date().toISOString()
      };
      
      saveDatabaseToStorage();
      
      // Add a small delay to ensure the database is properly saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return updatedProfile;
    } else {
      // Insert new profile
      db.run(`
        INSERT INTO user_profiles (name, email, phone, preferences, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [profile.name || '', profile.email || '', profile.phone || '', JSON.stringify(profile.preferences || {})]);
      
      const newProfile = {
        id: db.exec('SELECT last_insert_rowid()')[0].values[0][0],
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      saveDatabaseToStorage();
      
      // Add a small delay to ensure the database is properly saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return newProfile;
    }
  } catch (error) {
    console.error('Error saving profile to SQLite:', error);
    // Fallback to localStorage
    localStorage.setItem('italian-restaurant-profile', JSON.stringify(profile));
    return profile;
  }
};

/**
 * Get user profile data from SQLite
 * @returns {Object|null} - User profile or null if not found
 */
export const getProfile = async () => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    const result = db.exec('SELECT * FROM user_profiles LIMIT 1');
    
    if (result.length > 0 && result[0].values.length > 0) {
      const row = result[0].values[0];
      const columns = result[0].columns;
      
      const profile = {};
      columns.forEach((col, index) => {
        profile[col] = row[index];
      });
      
      const finalProfile = {
        ...profile,
        preferences: profile.preferences ? JSON.parse(profile.preferences) : {}
      };
      
      return finalProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile from SQLite:', error);
    // Fallback to localStorage
    const profile = localStorage.getItem('italian-restaurant-profile');
    return profile ? JSON.parse(profile) : null;
  }
};

/**
 * Get user profile by email address
 * @param {string} email - Email address to search for
 * @returns {Object|null} - User profile or null if not found
 */
export const getProfileByEmail = async (email) => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    const result = db.exec(`
      SELECT * FROM user_profiles 
      WHERE email = ?
    `, [email]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const row = result[0].values[0];
      const columns = result[0].columns;
      
      const profile = {};
      columns.forEach((col, index) => {
        profile[col] = row[index];
      });
      
      const finalProfile = {
        ...profile,
        preferences: profile.preferences ? JSON.parse(profile.preferences) : {}
      };
      
      return finalProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile by email:', error);
    return null;
  }
};

/**
 * Send password verification email (simulated)
 * @param {string} email - Email address to send verification to
 * @returns {Promise} - Promise that resolves when email is "sent"
 */
export const sendPasswordEmail = async (email) => {
  try {
    // Generate a simple verification code for testing
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, this would send an actual email with the verification code
    // For now, we'll simulate the email sending process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return the verification code so the UI can display it
    return { code: verificationCode };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Set onboarding completion status
 * @param {string} step - The onboarding step completed
 */
export const setOnboardingCompleted = async (step = 'main') => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    // Get the current profile (should exist after saveProfile was called)
    const profile = await getProfile();
    if (!profile) {
      console.error('No profile found when trying to mark onboarding as completed');
      throw new Error('Profile not found');
    }
    
    // Insert or update onboarding status
    db.run(`
      INSERT OR REPLACE INTO onboarding_status (user_id, step, completed, completed_at)
      VALUES (?, ?, 1, CURRENT_TIMESTAMP)
    `, [profile.id, step]);
    
    // Verify the insertion was successful
    const verifyResult = db.exec(`
      SELECT completed FROM onboarding_status 
      WHERE user_id = ? AND step = ?
    `, [profile.id, step]);
    
    if (verifyResult.length > 0 && verifyResult[0].values.length > 0) {
      // Onboarding step marked as completed successfully
    } else {
      console.error(`Failed to verify onboarding completion for step '${step}'`);
    }
    
    saveDatabaseToStorage();
    
    // Add a small delay to ensure the database is properly saved
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Error setting onboarding completion:', error);
    // Fallback to localStorage
    localStorage.setItem('italian-restaurant-onboarding-completed', 'true');
  }
};

/**
 * Check if onboarding is completed
 * @param {string} step - The onboarding step to check
 * @returns {boolean} - True if completed, false otherwise
 */
export const isOnboardingCompleted = async (step = 'main') => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    const profile = await getProfile();
    if (!profile) {
      console.log('No profile found when checking onboarding completion');
      return false;
    }
    
    console.log(`Checking onboarding completion for user ${profile.id}, step: ${step}`);
    
    const result = db.exec(`
      SELECT completed FROM onboarding_status 
      WHERE user_id = ? AND step = ? AND completed = 1
    `, [profile.id, step]);
    
    console.log(`Onboarding completion check result:`, result);
    
    const isCompleted = result.length > 0 && result[0].values.length > 0;
    console.log(`Onboarding step '${step}' completed: ${isCompleted}`);
    
    return isCompleted;
  } catch (error) {
    console.error('Error checking onboarding completion:', error);
    // Fallback to localStorage
    return localStorage.getItem('italian-restaurant-onboarding-completed') === 'true';
  }
};

/**
 * Force reset the database
 */
export const resetDatabase = async () => {
  try {
    // Clear the database instance
    if (db) {
      db.close();
      db = null;
    }
    
    // Remove all localStorage data
    localStorage.removeItem('restaurant_app_sqlite_db');
    localStorage.removeItem('italian-restaurant-profile');
    localStorage.removeItem('italian-restaurant-onboarding-completed');
    
    // Reinitialize the database with new schema
    await initializeDatabase();
    
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

/**
 * Completely remove all user data including profile
 */
export const removeAllUserData = async () => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    const profile = await getProfile();
    if (profile) {
      // Delete all related data including the profile
      db.run('DELETE FROM user_favorites WHERE user_id = ?', [profile.id]);
      db.run('DELETE FROM order_history WHERE user_id = ?', [profile.id]);
      db.run('DELETE FROM user_sessions WHERE user_id = ?', [profile.id]);
      db.run('DELETE FROM onboarding_status WHERE user_id = ?', [profile.id]);
      db.run('DELETE FROM user_profiles WHERE id = ?', [profile.id]);
      
      saveDatabaseToStorage();
      console.log('All user data completely removed from SQLite');
    }
  } catch (error) {
    console.error('Error removing all user data:', error);
    // Fallback to localStorage - clear everything
    localStorage.removeItem('italian-restaurant-profile');
    localStorage.removeItem('italian-restaurant-onboarding-completed');
    localStorage.removeItem('restaurant_app_sqlite_db');
  }
};

/**
 * Clear user session/authentication data but keep profile
 */
export const clearUserData = async () => {
  try {
    // Wait for database to be ready
    if (!db) {
      await new Promise(resolve => {
        const checkDb = () => {
          if (db) {
            resolve();
          } else {
            setTimeout(checkDb, 100);
          }
        };
        checkDb();
      });
    }
    
    const profile = await getProfile();
    if (profile) {
      // Only clear session and authentication data, keep the user profile
      db.run('DELETE FROM user_sessions WHERE user_id = ?', [profile.id]);
      db.run('DELETE FROM onboarding_status WHERE user_id = ?', [profile.id]);
      
      saveDatabaseToStorage();
      console.log('User session cleared, profile kept');
    }
  } catch (error) {
    console.error('Error clearing user session:', error);
    // Fallback to localStorage - only clear session data
    localStorage.removeItem('italian-restaurant-onboarding-completed');
  }
};

/**
 * Add a dish to user favorites
 * @param {string} dishId - The ID of the dish to favorite
 * @returns {boolean} - True if successful, false otherwise
 */
export const addToFavorites = (dishId) => {
  try {
    if (!db) return false;
    
    const profile = getProfile();
    if (!profile) return false;
    
    db.run(`
      INSERT OR IGNORE INTO user_favorites (user_id, dish_id)
      VALUES (?, ?)
    `, [profile.id, dishId]);
    
    saveDatabaseToStorage();
    return true;
  } catch (error) {
    console.error('Error adding dish to favorites:', error);
    return false;
  }
};

/**
 * Remove a dish from user favorites
 * @param {string} dishId - The ID of the dish to remove
 * @returns {boolean} - True if successful, false otherwise
 */
export const removeFromFavorites = (dishId) => {
  try {
    if (!db) return false;
    
    const profile = getProfile();
    if (!profile) return false;
    
    db.run(`
      DELETE FROM user_favorites 
      WHERE user_id = ? AND dish_id = ?
    `, [profile.id, dishId]);
    
    saveDatabaseToStorage();
    return true;
  } catch (error) {
    console.error('Error removing dish from favorites:', error);
    return false;
  }
};

/**
 * Get user's favorite dishes
 * @returns {Array} - Array of favorite dish IDs
 */
export const getFavorites = () => {
  try {
    if (!db) return [];
    
    const profile = getProfile();
    if (!profile) return [];
    
    const result = db.exec(`
      SELECT dish_id FROM user_favorites 
      WHERE user_id = ?
      ORDER BY added_at DESC
    `, [profile.id]);
    
    if (result.length > 0) {
      return result[0].values.map(row => row[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Check if a dish is in user's favorites
 * @param {string} dishId - The ID of the dish to check
 * @returns {boolean} - True if favorited, false otherwise
 */
export const isFavorite = (dishId) => {
  try {
    if (!db) return false;
    
    const profile = getProfile();
    if (!profile) return false;
    
    const result = db.exec(`
      SELECT COUNT(*) as count FROM user_favorites 
      WHERE user_id = ? AND dish_id = ?
    `, [profile.id, dishId]);
    
    return result.length > 0 && result[0].values[0][0] > 0;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Save order to history
 * @param {Object} orderData - Order information
 * @param {number} totalAmount - Total order amount
 * @returns {Object} - Saved order with ID
 */
export const saveOrder = (orderData, totalAmount) => {
  try {
    if (!db) {
      throw new Error('SQLite database not available');
    }
    
    const profile = getProfile();
    if (!profile) {
      throw new Error('No user profile found');
    }
    
    db.run(`
      INSERT INTO order_history (user_id, order_data, total_amount, status)
      VALUES (?, ?, ?, 'pending')
    `, [profile.id, JSON.stringify(orderData), totalAmount]);
    
    const orderId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    
    const savedOrder = {
      id: orderId,
      user_id: profile.id,
      order_data: orderData,
      total_amount: totalAmount,
      order_date: new Date().toISOString(),
      status: 'pending'
    };
    
    saveDatabaseToStorage();
    console.log('Order saved to SQLite:', savedOrder);
    return savedOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

/**
 * Get user's order history
 * @returns {Array} - Array of order objects
 */
export const getOrderHistory = () => {
  try {
    if (!db) return [];
    
    const profile = getProfile();
    if (!profile) return [];
    
    const result = db.exec(`
      SELECT * FROM order_history 
      WHERE user_id = ?
      ORDER BY order_date DESC
    `, [profile.id]);
    
    if (result.length > 0) {
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const order = {};
        columns.forEach((col, index) => {
          order[col] = row[index];
        });
        
        return {
          ...order,
          order_data: order.order_data ? JSON.parse(order.order_data) : {}
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
};

/**
 * Close database connection
 */
export const closeDatabase = () => {
  if (db) {
    saveDatabaseToStorage();
    db.close();
    console.log('SQLite database connection closed');
  }
};

// Handle page unload to save database
window.addEventListener('beforeunload', saveDatabaseToStorage);
