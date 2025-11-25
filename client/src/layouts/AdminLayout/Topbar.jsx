import { useLocation } from 'react-router-dom';
import styles from './Topbar.module.css';

const Topbar = ({ darkMode, onToggleTheme }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/create') return 'Create User';
    if (path.startsWith('/user/') && path.endsWith('/edit')) return 'Edit User';
    if (path.startsWith('/user/')) return 'User Details';
    if (path === '/settings') return 'Settings';
    return 'User List';
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
          <div className={styles.userAvatar}>
            <span className={styles.avatarText}>A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

