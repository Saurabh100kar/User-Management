import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, value = '' }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debouncing (300ms)
    debounceTimer.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearch('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleChange}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

