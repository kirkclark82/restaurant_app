import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DishCard.css';

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
      </div>

      {/* Dish Info */}
      <div className="dish-card__content">
        <h3 className="dish-card__title">
          {dish.name}
        </h3>
        
        <p className="dish-card__description">
          {dish.description}
        </p>

        {/* Price Display */}
        <div className="dish-card__footer">
          <span className="dish-card__price">
            ${dish.price}
          </span>
        </div>
      </div>

      <div className="dish-card__overlay"></div>
    </div>
  );
};

export default DishCard;
