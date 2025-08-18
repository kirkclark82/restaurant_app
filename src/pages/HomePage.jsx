import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import DishCard from '../components/DishCard';
import { dishes, getDishesByCategory, searchDishes } from '../data/dishes';
import '../styles/main.css';
import '../styles/HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredDishes, setFilteredDishes] = useState(dishes);
  const [isLoading, setIsLoading] = useState(false);

  // Filter dishes based on search query and selected category
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let result = dishes;

      // category filter
      if (selectedCategory) {
        result = getDishesByCategory(selectedCategory);
      }

      // search filter
      if (searchQuery) {
        result = searchDishes(searchQuery).filter(dish => 
          !selectedCategory || dish.category === selectedCategory
        );
      }

      setFilteredDishes(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <Hero 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="homepage__main">

        {/* Filter */}
        <CategoryList 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Filter */}
        {(searchQuery || selectedCategory) && (
          <div className="filter-summary">
            <div className="filter-summary__container">
              <span className="filter-summary__count">
                <i className="fas fa-filter mr-2"></i>
                {filteredDishes.length} dishes found
              </span>
              
              {searchQuery && (
                <span className="filter-summary__tag filter-summary__tag--search">
                  "{searchQuery}"
                </span>
              )}
              
              {selectedCategory && (
                <span className="filter-summary__tag filter-summary__tag--category">
                  {selectedCategory}
                </span>
              )}
              
              <button
                onClick={handleClearFilters}
                className="filter-summary__clear"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {/* Dishes list*/}
        <section className="dishes-section">
          <h2 className="dishes-section__title">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Menu` : 'Our Complete Menu'}
          </h2>

          {isLoading && (
            <div className="loading">
              <div className="loading__spinner"></div>
              <p className="loading__text">Loading delicious dishes...</p>
            </div>
          )}

          {/* Dishes list */}
          {!isLoading && filteredDishes.length > 0 && (
            <div className="dishes-grid">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}

          {!isLoading && filteredDishes.length === 0 && (
            <div className="no-results">
              <div className="no-results__icon">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="no-results__title">
                No dishes found
              </h3>
              <p className="no-results__description">
                We couldn't find any dishes matching your criteria. Try adjusting your search or browse our categories.
              </p>
              <button
                onClick={handleClearFilters}
                className="no-results__button"
              >
                <i className="fas fa-refresh mr-2"></i>
                Show All Dishes
              </button>
            </div>
          )}
        </section>

        {/* Restaurant Info Section */}
        <section className="restaurant-info">
          <div className="restaurant-info__header">
            <h2 className="restaurant-info__title">
              About Amore e Pasta
            </h2>
            <p className="restaurant-info__description">
              For over three generations, our family has been bringing the authentic tastes of Italy to your table. 
              Every dish is prepared with love, using traditional recipes passed down through our family and the 
              freshest ingredients imported directly from Italy.
            </p>
          </div>

          <div className="restaurant-info__features">
            <div className="restaurant-info__feature">
              <div className="restaurant-info__feature-icon restaurant-info__feature-icon--award">
                <i className="fas fa-award"></i>
              </div>
              <h3 className="restaurant-info__feature-title">
                Award Winning
              </h3>
              <p className="restaurant-info__feature-description">
                Recognized for authentic Italian cuisine and exceptional service
              </p>
            </div>

            <div className="restaurant-info__feature">
              <div className="restaurant-info__feature-icon restaurant-info__feature-icon--fresh">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="restaurant-info__feature-title">
                Fresh Ingredients
              </h3>
              <p className="restaurant-info__feature-description">
                Sourced daily from local farms and imported Italian specialties
              </p>
            </div>

            <div className="restaurant-info__feature">
              <div className="restaurant-info__feature-icon restaurant-info__feature-icon--tradition">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="restaurant-info__feature-title">
                Family Tradition
              </h3>
              <p className="restaurant-info__feature-description">
                Three generations of culinary passion and Italian hospitality
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="contact-section">
          <div className="contact-section__container">
            <h2 className="contact-section__title">
              Visit Us Today
            </h2>
            <p className="contact-section__subtitle">
              Experience authentic Italian cuisine in the heart of the city
            </p>
            
            <div className="contact-section__grid">
             
              <div className="contact-section__item">
                <div className="contact-section__icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="contact-section__item-title">Location</h3>
                <p className="contact-section__item-info">
                  123 Sunflower Street<br />
                  Downtown District<br />
                  New York
                </p>
              </div>

              <div className="contact-section__item">
                <div className="contact-section__icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3 className="contact-section__item-title">Phone</h3>
                <p className="contact-section__item-info">
                  <a href="tel:+1-555-AMORE-1" className="contact-section__link">
                    (555) AMORE-1
                  </a><br />
                  <span className="contact-section__secondary">
                    Call for reservations
                  </span>
                </p>
              </div>

    
              <div className="contact-section__item">
                <div className="contact-section__icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="contact-section__item-title">Hours</h3>
                <p className="contact-section__item-info">
                  Mon - Thu: 11:00 AM - 10:00 PM<br />
                  Fri - Sat: 11:00 AM - 11:00 PM<br />
                  Sunday: 12:00 PM - 9:00 PM
                </p>
              </div>

        
              <div className="contact-section__item">
                <div className="contact-section__icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3 className="contact-section__item-title">Email</h3>
                <p className="contact-section__item-info">
                  <a href="mailto:info@amorepasta.com" className="contact-section__link">
                    info@amorepasta.com
                  </a><br />
                  <span className="contact-section__secondary">
                    For inquiries & events
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
