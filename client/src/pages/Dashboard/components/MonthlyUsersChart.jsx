import { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './ChartCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper to get current theme
const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

const MonthlyUsersChart = ({ data, loading, error, onRetry }) => {
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
  const secondaryTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.5)';

  const chartData = useMemo(() => ({
    labels: data?.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Users Added',
        data: data?.map((item) => item.count) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            weight: '600',
          },
          color: secondaryTextColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
            weight: '600',
          },
          color: secondaryTextColor,
        },
        grid: {
          display: false,
        },
      },
    },
  }), [isDarkMode, textColor, secondaryTextColor, gridColor]);

  if (loading) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Users Added Per Month</h3>
          <p className={styles.cardSubtitle}>Monthly user registration trends</p>
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
          <h3 className={styles.cardTitle}>Users Added Per Month</h3>
          <p className={styles.cardSubtitle}>Monthly user registration trends</p>
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
        <h3 className={styles.cardTitle}>Users Added Per Month</h3>
        <p className={styles.cardSubtitle}>Monthly user registration trends</p>
      </div>
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyUsersChart;

