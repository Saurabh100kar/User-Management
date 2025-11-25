import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Apply dark mode class to root element
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar isCollapsed={isCollapsed} onToggle={handleToggleSidebar} />
      <div className={`${styles.contentArea} ${isCollapsed ? styles.contentExpanded : ''}`}>
        <Topbar darkMode={darkMode} onToggleTheme={handleToggleTheme} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

