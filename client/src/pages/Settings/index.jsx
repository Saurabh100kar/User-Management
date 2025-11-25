import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import styles from './index.module.css';

const Settings = () => {
  return (
    <AdminLayout>
      <div className={styles.settings}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.icon}>⚙️</span>
              Settings
            </h1>
            <p className={styles.subtitle}>
              Manage your application settings and preferences
            </p>
          </div>

          <div className={styles.settingsContent}>
            <div className={styles.settingsCard}>
              <h2 className={styles.cardTitle}>General Settings</h2>
              <p className={styles.cardDescription}>
                Configure general application preferences
              </p>
            </div>

            <div className={styles.settingsCard}>
              <h2 className={styles.cardTitle}>User Management</h2>
              <p className={styles.cardDescription}>
                Manage user-related settings and permissions
              </p>
            </div>

            <div className={styles.settingsCard}>
              <h2 className={styles.cardTitle}>Notifications</h2>
              <p className={styles.cardDescription}>
                Configure notification preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;

