import React from 'react';
import { categories } from '../data/dishes';
import '../styles/CategoryList.css';

/**
 * CategoryList component - Horizontal scrollable category buttons
 * Allows filtering dishes by category with Italian-inspired design
 */
const CategoryList = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="category-list">
      {/* Horizontal Scrollable Container */}
      <div className="category-list__container">
        {/* All Categories Button */}
        <button
          onClick={() => onCategorySelect('')}
          className={`category-list__button ${
            selectedCategory === '' ? 'category-list__button--active' : ''
          }`}
        >
          <i className="fas fa-th-large category-list__icon"></i>
          <span className="category-list__text">All Items</span>
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`category-list__button ${
              selectedCategory === category.id ? 'category-list__button--active' : ''
            }`}
          >
            <i className={`${category.icon} category-list__icon`}></i>
            <span className="category-list__text">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
