import React, { useEffect, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { waitForDatabase } from './utils/sqliteStorage';

function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await waitForDatabase();
        setIsDatabaseReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsDatabaseReady(true);
      }
    };

    initializeApp();
  }, []);

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
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
