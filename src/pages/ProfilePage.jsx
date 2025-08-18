import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile, clearUserData } from '../utils/storage';
import '../styles/ProfilePage.css';

/**
 * ProfilePage component - User profile management
 * Shows profile info from onboarding with edit and logout functionality
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setOriginalProfile(savedProfile);
    } else {
      // If no profile found, redirect to onboarding
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (isFormValid()) {
      saveProfile(profile);
      setOriginalProfile(profile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    clearUserData();
    navigate('/onboarding');
    setShowLogoutModal(false);
  };

  const isFormValid = () => {
    return profile.name.trim() && profile.email.trim() && profile.phone.trim();
  };

  const hasChanges = () => {
    return JSON.stringify(profile) !== JSON.stringify(originalProfile);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        
        {/* Page Header */}
        <div className="profile-page__header">
          <h1 className="profile-page__title">
            Your Profile
          </h1>
          <p className="profile-page__subtitle">
            Manage your personal information and preferences
          </p>
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
            
            {/* Edit Toggle */}
            <div className="profile-page__section">
              <div className="profile-page__section-title">
                <i className="fas fa-user profile-page__section-icon"></i>
                Personal Information
              </div>
              
              {!isEditing ? (
                <div className="profile-page__actions">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="profile-page__button profile-page__button--primary"
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="profile-page__actions">
                  <button
                    onClick={handleCancel}
                    className="profile-page__button profile-page__button--secondary"
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!isFormValid() || !hasChanges()}
                    className={`profile-page__button profile-page__button--primary ${
                      !isFormValid() || !hasChanges() ? 'profile-page__button--disabled' : ''
                    }`}
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-olive"></i>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-olive/20 rounded-lg focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                    {profile.name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2 text-olive"></i>
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-olive/20 rounded-lg focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/20 transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                    {profile.email || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-phone mr-2 text-olive"></i>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-olive/20 rounded-lg focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/20 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                    {profile.phone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Stats */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-serif font-bold text-deep-red mb-4">
                Account Activity
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-terracotta/10 to-deep-red/10 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-calendar text-terracotta text-xl mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-deep-red">{new Date().getFullYear()}</p>
                    </div>
                  </div>
                </div>
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
