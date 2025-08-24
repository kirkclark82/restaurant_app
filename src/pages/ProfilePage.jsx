import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, clearUserData, removeAllUserData } from '../utils/sqliteStorage';
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
    const loadProfile = async () => {
      try {
        const savedProfile = await getProfile();
        if (savedProfile) {
          setProfile(savedProfile);
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/onboarding');
      }
    };
    
    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    clearUserData();
    navigate('/');
    setShowLogoutModal(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        
        <div className="profile-page__header">
          <h1 className="profile-page__title">
            Your Profile
          </h1>
        </div>

        <div className="profile-page__card">
          
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

          <div className="profile-page__content">
            
            <div className="profile-page__section">
              <div className="profile-page__section-title">
                <i className="fas fa-user profile-page__section-icon"></i>
                Personal Information
              </div>
            </div>

            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2 text-olive"></i>
                  Full Name
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {profile.name || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2 text-olive"></i>
                  Email Address
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {profile.email || 'Not provided'}
                </p>
              </div>

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

            <div className="profile-page__logout-section">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="profile-page__logout-button"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
              
                                            <button
                 onClick={async () => {
                   if (window.confirm('This will remove all your data and you\'ll need to go through onboarding again. Continue?')) {
                     await removeAllUserData();
                     navigate('/onboarding');
                   }
                 }}
                 className="profile-page__logout-button profile-page__logout-button--secondary"
                 style={{ marginTop: '10px' }}
               >
                 <i className="fas fa-database"></i>
                 Remove my data
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
