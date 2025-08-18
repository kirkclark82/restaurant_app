import React from 'react';
import '../styles/SearchBar.css';

/**
 * SearchBar component for filtering dishes
 * Integrated search functionality with Italian styling
 */
const SearchBar = ({ searchQuery, setSearchQuery, onSearch, placeholder = "Search dishes..." }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <form onSubmit={handleSubmit}>
          <div className="search-bar__input-wrapper">
            <i className="fas fa-search search-bar__icon"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="search-bar__input"
            />
            
            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="search-bar__clear-button"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </form>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="search-bar__results">
            <i className="fas fa-info-circle"></i>
            Searching for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
