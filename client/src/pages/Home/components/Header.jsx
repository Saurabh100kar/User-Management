import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ totalUsers, onCreateClick }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>
          <span className={styles.icon}>👥</span>
          User List
        </h1>
        <div className={styles.headerActions}>
          <div className={styles.badge}>{totalUsers} users</div>
          <button
            className={styles.dashboardButton}
            onClick={() => navigate('/dashboard')}
            aria-label="View dashboard"
          >
            <span className={styles.dashboardIcon}>📊</span>
            Dashboard
          </button>
          {onCreateClick && (
            <button className={styles.createButton} onClick={onCreateClick}>
              <span className={styles.createIcon}>➕</span>
              Create User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

