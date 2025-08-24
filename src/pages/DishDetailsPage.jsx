import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDishById } from '../data/dishes';
import '../styles/DishDetailsPage.css';

//testing 
const DishDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dish = getDishById(id);

  if (!dish) {
    return (
      <div className="dish-not-found">
        <div className="dish-not-found__content">
          <div className="dish-not-found__icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="dish-not-found__title">
            Dish Not Found
          </h1>
          <p className="dish-not-found__description">
            The dish you're looking for doesn't exist or may have been removed from our menu.
          </p>
          <button
            onClick={() => navigate('/')}
            className="dish-not-found__button"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      pizza: 'fas fa-pizza-slice',
      pasta: 'fas fa-utensils',
      drinks: 'fas fa-wine-glass',
      dessert: 'fas fa-ice-cream'
    };
    return icons[category] || 'fas fa-utensils';
  };

  return (
    <div className="dish-details">
      <div className="dish-details__container">
        
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          <i className="fas fa-arrow-left back-button__icon"></i>
          Back to Menu
        </button>

        {/* Dish Details */}
        <main className="dish-details__main">
          <div className="dish-details__grid">
            
            {/* Image Section */}
            <div className="dish-details__image-container">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="dish-details__image"
              />
            </div>

            {/* Content Section */}
            <div className="dish-details__content">
              <h1 className="dish-details__title">
                {dish.name}
              </h1>
              
              <div className="dish-details__price">
                ${dish.price}
              </div>
              
              <p className="dish-details__description">
                {dish.description}
              </p>

              {/* Nutrition Information */}
              <div className="nutrition-info">
                <h3 className="nutrition-info__title">
                  Nutrition Information
                </h3>
                <div className="nutrition-info__grid">
                  <div className="nutrition-info__item">
                    <div className="nutrition-info__value">450</div>
                    <div className="nutrition-info__label">Calories</div>
                  </div>
                  <div className="nutrition-info__item">
                    <div className="nutrition-info__value">25g</div>
                    <div className="nutrition-info__label">Protein</div>
                  </div>
                  <div className="nutrition-info__item">
                    <div className="nutrition-info__value">15g</div>
                    <div className="nutrition-info__label">Fat</div>
                  </div>
                  <div className="nutrition-info__item">
                    <div className="nutrition-info__value">45g</div>
                    <div className="nutrition-info__label">Carbs</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-buttons__primary">
                  <i className="fas fa-shopping-cart action-buttons__primary-icon"></i>
                  Add to Order - ${dish.price}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DishDetailsPage;
