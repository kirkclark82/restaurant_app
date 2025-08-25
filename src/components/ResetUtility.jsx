import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetDatabase, clearUserData, removeAllUserData } from '../utils/simpleStorage';

const ResetUtility = () => {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetOnboarding = async () => {
    if (window.confirm('This will clear your session and redirect you to onboarding. Continue?')) {
      setIsResetting(true);
      try {
        await clearUserData();
        navigate('/onboarding');
      } catch (error) {
        console.error('Error resetting onboarding:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleResetAllData = async () => {
    if (window.confirm('This will remove ALL your data including profile and redirect you to onboarding. Continue?')) {
      setIsResetting(true);
      try {
        await removeAllUserData();
        navigate('/onboarding');
      } catch (error) {
        console.error('Error resetting all data:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleResetDatabase = async () => {
    if (window.confirm('This will completely reset the database. Continue?')) {
      setIsResetting(true);
      try {
        await resetDatabase();
        navigate('/onboarding');
      } catch (error) {
        console.error('Error resetting database:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Dev Reset:</div>
      <button
        onClick={handleResetOnboarding}
        disabled={isResetting}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '5px',
          padding: '3px 6px',
          fontSize: '10px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        {isResetting ? 'Resetting...' : 'Reset Onboarding'}
      </button>
      <button
        onClick={handleResetAllData}
        disabled={isResetting}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '5px',
          padding: '3px 6px',
          fontSize: '10px',
          background: '#ff8e53',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        {isResetting ? 'Resetting...' : 'Reset All Data'}
      </button>
      <button
        onClick={handleResetDatabase}
        disabled={isResetting}
        style={{
          display: 'block',
          width: '100%',
          padding: '3px 6px',
          fontSize: '10px',
          background: '#ff4757',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        {isResetting ? 'Resetting...' : 'Reset Database'}
      </button>
    </div>
  );
};

export default ResetUtility;
