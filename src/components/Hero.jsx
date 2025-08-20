import React from 'react';
import heroImage from '../assets/images/hero-banner.jpg';
import '../styles/Hero.css';

const Hero = ({ onSearch, searchQuery, setSearchQuery }) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <section className="hero">
      <div className="hero__container">
        <img 
          src={heroImage} 
          alt="Italian restaurant ambiance" 
          className="hero__image"
        />
        
        <div className="hero__overlay">
          <div className="hero__content">
            <h1 className="hero__title">
              Amore e Pasta
            </h1>
            <p className="hero__subtitle">
              Authentic Italian flavors in every bite
            </p>
            <p className="hero__description">
              Experience the warmth of Italy with our traditional recipes, fresh ingredients, 
              and passionate culinary craftsmanship.
            </p>

            <form onSubmit={handleSearchSubmit} className="hero__search-form">
              <div className="hero__search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pizza, pasta, drinks..."
                  className="hero__search-input"
                />
                <button
                  type="submit"
                  className="hero__search-button"
                >
                  <i className="fas fa-search hero__search-icon"></i>
                  
                </button>
              </div>
            </form>

            <div className="hero__features">
              <div className="hero__feature">
                <i className="fas fa-pizza-slice hero__feature-icon"></i>
                <p className="hero__feature-text">Fresh Pizza</p>
              </div>
              <div className="hero__feature">
                <i className="fas fa-utensils hero__feature-icon"></i>
                <p className="hero__feature-text">Handmade Pasta</p>
              </div>
              <div className="hero__feature">
                <i className="fas fa-wine-glass hero__feature-icon"></i>
                <p className="hero__feature-text">Fine Wines</p>
              </div>
              <div className="hero__feature">
                <i className="fas fa-ice-cream hero__feature-icon"></i>
                <p className="hero__feature-text">Sweet Desserts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
