import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, clearUserData } from '../utils/storage';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      // If no profile found, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleLogout = () => {
    clearUserData();
    navigate('/onboarding');
    setShowLogoutModal(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        
        {/* Page Header */}
        <div className="profile-page__header">
          <h1 className="profile-page__title">
            Your Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="profile-page__card">
          
          {/* Profile Header */}
          <div className="profile-page__card-header">
            <div className="profile-page__avatar">
              <i className="fas fa-user"></i>
            </div>
            <h2 className="profile-page__name">
              {profile.name || 'User Profile'}
            </h2>
            <p className="profile-page__email">
              Member since {new Date().getFullYear()}
            </p>
          </div>

          {/* Profile Content */}
          <div className="profile-page__content">
            
            {/* Personal Information Section */}
            <div className="profile-page__section">
              <div className="profile-page__section-title">
                <i className="fas fa-user profile-page__section-icon"></i>
                Personal Information
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-olive"></i>
                  Full Name
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {profile.name || 'Not provided'}
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2 text-olive"></i>
                  Email Address
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {profile.email || 'Not provided'}
                </p>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-phone mr-2 text-olive"></i>
                  Phone Number
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {profile.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Logout Section */}
            <div className="profile-page__logout-section">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="profile-page__logout-button"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div 
            className="logout-modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowLogoutModal(false);
              }
            }}
          >
            <div className="logout-modal__content">
              <div className="logout-modal__icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="logout-modal__title">
                Confirm Logout
              </h3>
              <p className="logout-modal__message">
                Are you sure you want to logout? This will clear all your data and you'll need to go through onboarding again.
              </p>
              <div className="logout-modal__actions">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="logout-modal__button logout-modal__button--cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="logout-modal__button logout-modal__button--confirm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
