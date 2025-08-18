import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, setOnboardingCompleted } from '../utils/storage';
import '../styles/OnboardingPage.css';

/**
 * OnboardingPage component - Multi-step onboarding flow
 * Shows Italian-themed intro slides and profile setup
 */
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Onboarding slides data
  const slides = [
    {
      icon: 'fas fa-pizza-slice',
      title: 'Benvenuti alla Famiglia!',
      subtitle: 'Welcome to our Italian family!',
      description: 'Experience authentic Italian cuisine crafted with love, tradition, and the finest ingredients from the heart of Italy.',
      colorClass: 'pizza'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Handcrafted Perfection',
      subtitle: 'Every dish tells a story',
      description: 'Our chefs bring generations of Italian culinary expertise to create unforgettable dining experiences.',
      colorClass: 'pasta'
    },
    {
      icon: 'fas fa-wine-glass',
      title: 'La Dolce Vita',
      subtitle: 'The sweet life awaits',
      description: 'Indulge in the Italian way of life with our carefully curated selection of wines, desserts, and specialty drinks.',
      colorClass: 'drinks'
    },
    {
      icon: 'fas fa-user-circle',
      title: 'Join Our Community',
      subtitle: 'Create your profile',
      description: 'Let us personalize your dining experience and keep you updated with our latest offerings.',
      colorClass: 'profile',
      isProfileSetup: true
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    if (isProfileComplete()) {
      saveProfile(profile);
      setOnboardingCompleted();
      navigate('/');
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isProfileComplete = () => {
    return profile.name.trim() && profile.email.trim() && profile.phone.trim();
  };

  const isNextDisabled = () => {
    if (slides[currentSlide].isProfileSetup) {
      return !isProfileComplete();
    }
    return false;
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="onboarding">
      <div className="onboarding__container">
        {/* Progress Indicator */}
        <div className="onboarding__progress">
          <div className="onboarding__progress-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`onboarding__progress-dot ${
                  index <= currentSlide ? 'onboarding__progress-dot--active' : 'onboarding__progress-dot--inactive'
                }`}
              />
            ))}
          </div>
          <p className="onboarding__progress-text">
            Step {currentSlide + 1} of {slides.length}
          </p>
        </div>

        {/* Slide Content */}
        <div className="onboarding__slide">
          {/* Icon */}
          <div className={`onboarding__slide-icon onboarding__slide-icon--${currentSlideData.colorClass}`}>
            <i className={currentSlideData.icon}></i>
          </div>

          {/* Title */}
          <h1 className={`onboarding__slide-title onboarding__slide-title--${currentSlideData.colorClass}`}>
            {currentSlideData.title}
          </h1>

          {/* Subtitle */}
          <h2 className="onboarding__slide-subtitle">
            {currentSlideData.subtitle}
          </h2>

          {/* Description */}
          <p className="onboarding__slide-description">
            {currentSlideData.description}
          </p>

          {/* Profile Setup Form */}
          {currentSlideData.isProfileSetup && (
            <div className="profile-form">
              <div className="profile-form__group">
                <label className="profile-form__label">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="profile-form__input"
                  required
                />
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="profile-form__input"
                  required
                />
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="profile-form__input"
                  required
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="onboarding__navigation">
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className={`onboarding__nav-button onboarding__nav-button--secondary ${
                currentSlide === 0 ? 'onboarding__nav-button--primary' : ''
              }`}
            >
              <i className="fas fa-arrow-left"></i>
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="onboarding__nav-button onboarding__nav-button--primary"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  <i className="fas fa-check"></i>
                  Sign In
                </>
              ) : (
                <>
                  Next
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        {!currentSlideData.isProfileSetup && (
          <div className="text-center mt-6">
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
