import React from 'react';
import './SearchBar.css';

const SearchBar = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  onClear,
  unescoOnly,
  onUnescoOnlyChange
}) => {
  return (
    <div className="searchbar glass-card fade-in">
      <div className="searchbar-row">
        <div className="searchbar-field">
          <label className="searchbar-label" htmlFor="search-monuments">
            Search
          </label>
          <input
            id="search-monuments"
            className="searchbar-input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by monument name or location…"
            type="text"
          />
        </div>

        <div className="searchbar-field">
          <label className="searchbar-label" htmlFor="search-category">
            Category
          </label>
          <select
            id="search-category"
            className="searchbar-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {typeof unescoOnly === 'boolean' && typeof onUnescoOnlyChange === 'function' ? (
          <div className="searchbar-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={unescoOnly}
                onChange={(e) => onUnescoOnlyChange(e.target.checked)}
              />
              UNESCO only
            </label>
          </div>
        ) : null}
      </div>

      <div className="searchbar-actions">
        <button type="button" className="btn btn-light" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

