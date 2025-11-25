import styles from './UserInfoRow.module.css';

const UserInfoRow = ({ label, value, icon = null, index = 0 }) => {
  return (
    <div 
      className={styles.infoRow}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.labelSection}>
        {icon && <span className={styles.labelIcon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.valueSection}>
        <span className={styles.value}>{value || 'N/A'}</span>
      </div>
    </div>
  );
};

export default UserInfoRow;

