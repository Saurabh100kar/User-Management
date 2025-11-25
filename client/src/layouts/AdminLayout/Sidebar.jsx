import { NavLink, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/', label: 'Users', icon: '👥' },
    { path: '/create', label: 'Add User', icon: '➕' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/user/');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>
            {!isCollapsed && <span className={styles.logoIcon}>🚀</span>}
            {!isCollapsed && <span className={styles.logoText}>Admin</span>}
            {isCollapsed && <span className={styles.logoIcon}>🚀</span>}
          </h2>
          <button
            className={styles.toggleButton}
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) =>
                `${styles.navItem} ${active || isActive(item.path) ? styles.active : ''}`
              }
              end={item.path === '/'}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) =>
              `${styles.mobileNavItem} ${active || isActive(item.path) ? styles.active : ''}`
            }
            end={item.path === '/'}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;

