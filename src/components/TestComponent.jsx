import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: 9999,
      background: '#4CAF50',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      ✅ App is rendering!
    </div>
  );
};

export default TestComponent;
