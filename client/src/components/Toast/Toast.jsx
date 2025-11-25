import { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
};

export default Toast;

