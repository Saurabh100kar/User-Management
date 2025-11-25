import { useNavigate } from 'react-router-dom';
import styles from './UserActionBar.module.css';

const UserActionBar = ({ userId, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/user/${userId}/edit`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.actionBar}>
      <button
        className={`${styles.actionButton} ${styles.editButton}`}
        onClick={handleEdit}
        aria-label="Edit user"
      >
        <span className={styles.buttonIcon}>✏️</span>
        <span className={styles.buttonText}>Edit User</span>
      </button>
      <button
        className={`${styles.actionButton} ${styles.deleteButton}`}
        onClick={handleDelete}
        aria-label="Delete user"
      >
        <span className={styles.buttonIcon}>🗑️</span>
        <span className={styles.buttonText}>Delete User</span>
      </button>
      <button
        className={`${styles.actionButton} ${styles.backButton}`}
        onClick={handleGoBack}
        aria-label="Go back to user list"
      >
        <span className={styles.buttonIcon}>←</span>
        <span className={styles.buttonText}>Go Back</span>
      </button>
    </div>
  );
};

export default UserActionBar;

