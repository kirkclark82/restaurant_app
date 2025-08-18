import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isOnboardingCompleted } from '../utils/storage';
import Header from '../components/Header';
import OnboardingPage from '../pages/OnboardingPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import DishDetailsPage from '../pages/DishDetailsPage';

/**
 * AppRouter component - Main routing configuration
 * Handles navigation between pages and onboarding flow
 */
const AppRouter = () => {
  
  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const hasCompletedOnboarding = isOnboardingCompleted();
    
    if (!hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    
    return children;
  };

  // Public Route component (redirects to home if already onboarded)
  const PublicRoute = ({ children }) => {
    const hasCompletedOnboarding = isOnboardingCompleted();
    
    if (hasCompletedOnboarding) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-cream">
        {/* Header component (hidden on onboarding page) */}
        <Header />
        
        {/* Main Routes */}
        <Routes>
          {/* Onboarding Route - Only accessible if not completed */}
          <Route 
            path="/onboarding" 
            element={
              <PublicRoute>
                <OnboardingPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Require onboarding completion */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dish/:id" 
            element={
              <ProtectedRoute>
                <DishDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-cream flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-8xl text-olive mb-6">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-deep-red mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    The page you're looking for doesn't exist.
                  </p>
                  <Navigate to="/" replace />
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
