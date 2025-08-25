import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isOnboardingCompleted, getProfile } from '../utils/simpleStorage';

const DebugInfo = () => {
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState({
    currentPath: '',
    onboardingCompleted: null,
    hasProfile: null,
    loading: true
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const onboardingCompleted = await isOnboardingCompleted();
        const profile = await getProfile();
        
        setDebugInfo({
          currentPath: location.pathname,
          onboardingCompleted,
          hasProfile: !!profile,
          loading: false
        });
      } catch (error) {
        console.error('Debug info error:', error);
        setDebugInfo(prev => ({ ...prev, loading: false }));
      }
    };

    checkStatus();
  }, [location.pathname]);

  if (debugInfo.loading) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        background: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Debug Info:</div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 9999,
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Debug Info:</div>
      <div>Path: {debugInfo.currentPath}</div>
      <div>Onboarding: {debugInfo.onboardingCompleted ? '✅' : '❌'}</div>
      <div>Profile: {debugInfo.hasProfile ? '✅' : '❌'}</div>
      <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
        {debugInfo.currentPath === '/' && !debugInfo.onboardingCompleted && 'Should show LandingPage'}
        {debugInfo.currentPath === '/' && debugInfo.onboardingCompleted && 'Should redirect to /home'}
        {debugInfo.currentPath === '/onboarding' && debugInfo.onboardingCompleted && 'Should redirect to /home'}
        {debugInfo.currentPath === '/onboarding' && !debugInfo.onboardingCompleted && 'Should show OnboardingPage'}
      </div>
    </div>
  );
};

export default DebugInfo;
