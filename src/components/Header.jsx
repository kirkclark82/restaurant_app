import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

/**
 * Header component with restaurant name/logo and navigation
 * Responsive design with Italian-inspired styling
 */
const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Don't show header on onboarding page
  if (location.pathname === '/onboarding') {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          {/* Logo/Restaurant Name */}
          <Link 
            to="/" 
            className="header__logo"
            onClick={closeMobileMenu}
          >
            <i className="fas fa-utensils header__logo-icon"></i>
            <span>Amore e Pasta</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="header__nav">
            <Link 
              to="/" 
              className={`header__nav-link ${
                location.pathname === '/' ? 'header__nav-link--active' : ''
              }`}
            >
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link 
              to="/profile" 
              className={`header__nav-link ${
                location.pathname === '/profile' ? 'header__nav-link--active' : ''
              }`}
            >
              <i className="fas fa-user"></i>
              Profile
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="header__mobile-menu">
            <button 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`header__mobile-nav ${isMobileMenuOpen ? 'header__mobile-nav--open' : ''}`}>
          <ul className="header__mobile-nav-list">
            <li>
              <Link 
                to="/" 
                className={`header__mobile-nav-link ${
                  location.pathname === '/' ? 'header__mobile-nav-link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-home"></i>
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`header__mobile-nav-link ${
                  location.pathname === '/profile' ? 'header__mobile-nav-link--active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-user"></i>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
