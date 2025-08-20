import React from 'react';
import { categories } from '../data/dishes';
import '../styles/CategoryList.css';

const CategoryList = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="category-list">
      <div className="category-list__container">
        <button
          onClick={() => onCategorySelect('')}
          className={`category-list__button ${
            selectedCategory === '' ? 'category-list__button--active' : ''
          }`}
        >
          <i className="fas fa-th-large category-list__icon"></i>
          <span className="category-list__text">All Items</span>
        </button>

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
