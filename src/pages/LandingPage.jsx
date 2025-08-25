import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileByEmail, sendPasswordEmail, setOnboardingCompleted, setActiveUser } from '../utils/simpleStorage';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleEmailCheck = async () => {
    if (!email.trim()) return;
    
    setIsChecking(true);
    try {
      const profile = await getProfileByEmail(email);
      if (profile) {
        setUserExists(true);
        setShowVerification(false);
        setVerificationCode('');
      } else {
        setUserExists(false);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setUserExists(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSendVerification = async () => {
    if (!email.trim()) return;
    
    setIsVerifying(true);
    try {
      const result = await sendPasswordEmail(email);
      if (result && result.code) {
        setGeneratedCode(result.code);
        setShowVerification(true);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) return;
    
    try {
      if (verificationCode === generatedCode) {
        
        const profile = await getProfileByEmail(email);
        if (profile) {
          try {
            // Set this user as the active user
            await setActiveUser(email);
            await setOnboardingCompleted();
          } catch (error) {
            console.error('Error marking onboarding as completed:', error);
          }
          
          navigate('/home');
        }
      } else {
        console.error('Invalid verification code. Expected:', generatedCode, 'Got:', verificationCode);
        alert(`Invalid verification code. The correct code is: ${generatedCode}`);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleNewUser = () => {
    navigate('/onboarding');
  };

  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <div className="landing-page__header">
          <div className="landing-page__logo">
            <i className="fas fa-utensils"></i>
          </div>
          <h1 className="landing-page__title">
            Welcome to Amore e Pasta!
          </h1>
          <p className="landing-page__subtitle">
            Sign in to continue to your personalized Italian dining experience
          </p>
        </div>

        <div className="landing-page__email-section">
          <div className="landing-page__input-group">
            <label htmlFor="email" className="landing-page__label">
              Email Address
            </label>
            <div className="landing-page__input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="landing-page__input"
                disabled={isChecking || userExists}
              />
              <button
                onClick={handleEmailCheck}
                disabled={!email.trim() || isChecking}
                className="landing-page__check-button"
              >
                {isChecking ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {userExists && (
            <div className="landing-page__welcome-message">
              <div className="landing-page__welcome-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="landing-page__welcome-title">
                Welcome Back!
              </h3>
              <p className="landing-page__welcome-text">
                We've sent a verification code to your email address.
              </p>
              
              {!showVerification ? (
                <button
                  onClick={handleSendVerification}
                  disabled={isVerifying}
                  className="landing-page__verify-button"
                >
                  {isVerifying ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              ) : (
                <div className="landing-page__verification-section">
                  <div className="landing-page__code-display">
                    <p className="landing-page__code-text">
                      Your verification code is: <strong>{generatedCode}</strong>
                    </p>
                    <p className="landing-page__code-note">
                      (This is a demo - in a real app, this would be sent to your email)
                    </p>
                  </div>
                  
                  <label htmlFor="verificationCode" className="landing-page__label">
                    Verification Code
                  </label>
                  <div className="landing-page__verification-input-wrapper">
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter verification code"
                      className="landing-page__verification-input"
                    />
                    <button
                      onClick={handleVerificationSubmit}
                      disabled={!verificationCode.trim()}
                      className="landing-page__submit-button"
                    >
                      Verify & Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!userExists && !isChecking && (
            <div className="landing-page__new-user-section">
              <p className="landing-page__new-user-text">
                Don't have an account?
              </p>
              <button
                onClick={handleNewUser}
                className="landing-page__new-user-button"
              >
                Create New Account
              </button>
            </div>
          )}
        </div>

        <div className="landing-page__footer">
          <p className="landing-page__footer-text">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
