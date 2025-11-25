import { useEffect, useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './ChartCard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper to get current theme
const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

const GenderChart = ({ data, loading, error, onRetry }) => {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#f1f5f9' : '#1e293b';

  const chartData = useMemo(() => ({
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Users',
        data: [data?.male || 0, data?.female || 0, data?.other || 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '600',
          },
          usePointStyle: true,
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  }), [isDarkMode, textColor]);

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Gender Distribution</h3>
          <p className={styles.cardSubtitle}>User gender breakdown</p>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Gender Distribution</h3>
          <p className={styles.cardSubtitle}>User gender breakdown</p>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>Unable to load analytics data</p>
          <button className={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Gender Distribution</h3>
        <p className={styles.cardSubtitle}>User gender breakdown</p>
      </div>
      <div className={styles.chartContainer}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GenderChart;

