import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import GenderChart from './components/GenderChart';
import MonthlyUsersChart from './components/MonthlyUsersChart';
import EmailDomainChart from './components/EmailDomainChart';
import {
  fetchGenderAnalytics,
  fetchMonthlyUsersAnalytics,
  fetchEmailDomainsAnalytics,
} from '../../api/analytics';
import styles from './index.module.css';

const Dashboard = () => {
  const [genderData, setGenderData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [emailDomainData, setEmailDomainData] = useState(null);
  
  const [genderLoading, setGenderLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [emailDomainLoading, setEmailDomainLoading] = useState(true);
  
  const [genderError, setGenderError] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);
  const [emailDomainError, setEmailDomainError] = useState(null);

  const loadGenderData = async () => {
    try {
      setGenderLoading(true);
      setGenderError(null);
      const response = await fetchGenderAnalytics();
      if (response.success) {
        setGenderData(response.data);
      }
    } catch (error) {
      console.error('Error loading gender analytics:', error);
      setGenderError(error.message || 'Failed to load gender analytics');
    } finally {
      setGenderLoading(false);
    }
  };

  const loadMonthlyData = async () => {
    try {
      setMonthlyLoading(true);
      setMonthlyError(null);
      const response = await fetchMonthlyUsersAnalytics();
      if (response.success) {
        setMonthlyData(response.data);
      }
    } catch (error) {
      console.error('Error loading monthly analytics:', error);
      setMonthlyError(error.message || 'Failed to load monthly analytics');
    } finally {
      setMonthlyLoading(false);
    }
  };

  const loadEmailDomainData = async () => {
    try {
      setEmailDomainLoading(true);
      setEmailDomainError(null);
      const response = await fetchEmailDomainsAnalytics();
      if (response.success) {
        setEmailDomainData(response.data);
      }
    } catch (error) {
      console.error('Error loading email domain analytics:', error);
      setEmailDomainError(error.message || 'Failed to load email domain analytics');
    } finally {
      setEmailDomainLoading(false);
    }
  };

  useEffect(() => {
    loadGenderData();
    loadMonthlyData();
    loadEmailDomainData();
  }, []);

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.header}>
            <p className={styles.subtitle}>
              Comprehensive insights into your user base
            </p>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartItem}>
              <GenderChart
                data={genderData}
                loading={genderLoading}
                error={genderError}
                onRetry={loadGenderData}
              />
            </div>

            <div className={styles.chartItem}>
              <MonthlyUsersChart
                data={monthlyData}
                loading={monthlyLoading}
                error={monthlyError}
                onRetry={loadMonthlyData}
              />
            </div>

            <div className={styles.chartItem}>
              <EmailDomainChart
                data={emailDomainData}
                loading={emailDomainLoading}
                error={emailDomainError}
                onRetry={loadEmailDomainData}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

