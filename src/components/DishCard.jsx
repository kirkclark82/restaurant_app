import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DishCard.css';

/**
 * DishCard component - Individual dish display card
 * Shows dish image, name, description, and price with Italian styling
 */
const DishCard = ({ dish }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dish/${dish.id}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      pizza: 'fas fa-pizza-slice',
      pasta: 'fas fa-utensils',
      drinks: 'fas fa-wine-glass',
      dessert: 'fas fa-ice-cream'
    };
    return icons[category] || 'fas fa-utensils';
  };

  const getCategoryColor = (category) => {
    const colors = {
      pizza: 'dish-card__category-icon--pizza',
      pasta: 'dish-card__category-icon--pasta',
      drinks: 'dish-card__category-icon--drinks',
      dessert: 'dish-card__category-icon--dessert'
    };
    return colors[category] || 'dish-card__category-icon--pasta';
  };

  return (
    <div 
      onClick={handleClick}
      className="dish-card"
    >
      {/* Dish Image */}
      <div className="dish-card__image-container">
        <img 
          src={dish.image} 
          alt={dish.name}
          className="dish-card__image"
        />
        
        {/* Category Badge */}
        <div className="dish-card__category-badge">
          <i className={`${getCategoryIcon(dish.category)} ${getCategoryColor(dish.category)} dish-card__category-icon`}></i>
          <span className="dish-card__category-text">
            {dish.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="dish-card__price-badge">
          <span>${dish.price}</span>
        </div>
      </div>

      {/* Dish Info */}
      <div className="dish-card__content">
        <h3 className="dish-card__title">
          {dish.name}
        </h3>
        
        <p className="dish-card__description">
          {dish.description}
        </p>

        {/* Action Button */}
        <div className="dish-card__footer">
          <span className="dish-card__price">
            ${dish.price}
          </span>
          
          <button className="dish-card__button">
            <i className="fas fa-eye dish-card__button-icon"></i>
            View Details
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="dish-card__overlay"></div>
    </div>
  );
};

export default DishCard;
