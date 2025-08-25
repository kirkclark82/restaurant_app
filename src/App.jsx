import React, { useEffect, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { waitForDatabase } from './utils/simpleStorage';

function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');
        await waitForDatabase();
        console.log('Database ready!');
        setIsDatabaseReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error.message);
        setIsDatabaseReady(true); // Still set to true to show the app
      }
    };

    initializeApp();
  }, []);

  // Add console utilities for development
  useEffect(() => {
    if (isDatabaseReady) {
      // Add console commands for easy reset during development
      window.resetOnboarding = async () => {
        const { clearUserData } = await import('./utils/simpleStorage');
        await clearUserData();
        window.location.href = '/onboarding';
      };
      
      window.resetAllData = async () => {
        const { removeAllUserData } = await import('./utils/simpleStorage');
        await removeAllUserData();
        window.location.href = '/onboarding';
      };
      
      window.resetDatabase = async () => {
        const { resetDatabase } = await import('./utils/simpleStorage');
        await resetDatabase();
        window.location.href = '/onboarding';
      };
      
      window.getAllUsers = async () => {
        const { getAllUsers } = await import('./utils/simpleStorage');
        const users = getAllUsers();
        console.log('All registered users:', users);
        return users;
      };
      
      window.switchUser = async (email) => {
        const { switchUser } = await import('./utils/simpleStorage');
        await switchUser(email);
        window.location.href = '/home';
      };
      
      console.log('🚀 Restaurant App Development Utilities:');
      console.log('• resetOnboarding() - Clear session and go to onboarding');
      console.log('• resetAllData() - Remove all user data and go to onboarding');
      console.log('• resetDatabase() - Complete database reset and go to onboarding');
      console.log('• getAllUsers() - Show all registered users');
      console.log('• switchUser(email) - Switch to a different user');
    }
  }, [isDatabaseReady]);

  if (!isDatabaseReady) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '24px', color: '#666' }}>Initializing...</div>
          <div style={{ fontSize: '16px', color: '#999' }}>Setting up your database...</div>
          {initError && (
            <div style={{ fontSize: '14px', color: '#ff6b6b', maxWidth: '400px', textAlign: 'center' }}>
              Error: {initError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppRouter />
      {initError && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          background: '#ff6b6b',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          maxWidth: '300px'
        }}>
          ⚠️ Database Error: {initError}
        </div>
      )}
    </div>
  );
}

export default App;
