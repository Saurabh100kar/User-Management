import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';

const Topbar = ({ darkMode, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/create') return 'Create User';
    if (path.startsWith('/user/') && path.endsWith('/edit')) return 'Edit User';
    if (path.startsWith('/user/')) return 'User Details';
    if (path === '/settings') return 'Settings';
    if (path === '/login') return 'Login';
    if (path === '/signup') return 'Sign Up';
    return 'User List';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarContent}>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        <div className={styles.topbarActions}>
          <button
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              className={styles.userAvatar}
              onClick={toggleDropdown}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              <span className={styles.avatarText}>A</span>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <span className={styles.avatarText}>A</span>
                  </div>
                  <div className={styles.dropdownInfo}>
                    <p className={styles.dropdownName}>Guest User</p>
                    <p className={styles.dropdownEmail}>Not logged in</p>
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownMenu}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleMenuClick('/login')}
                  >
                    <span className={styles.dropdownIcon}>🔐</span>
                    <span>Login</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleMenuClick('/signup')}
                  >
                    <span className={styles.dropdownIcon}>👤</span>
                    <span>Sign Up</span>
                  </button>
                  <div className={styles.dropdownDivider}></div>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleMenuClick('/settings')}
                  >
                    <span className={styles.dropdownIcon}>⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

