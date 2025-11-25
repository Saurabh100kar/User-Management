import { useEffect, useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
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

const EmailDomainChart = ({ data, loading, error, onRetry }) => {
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

  // Limit to top 10 domains for better visualization
  const topDomains = useMemo(() => data?.slice(0, 10) || [], [data]);
  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(249, 115, 22, 0.8)',
  ];

  const chartData = useMemo(() => ({
    labels: topDomains.map((item) => item.domain),
    datasets: [
      {
        label: 'Users',
        data: topDomains.map((item) => item.count),
        backgroundColor: colors.slice(0, topDomains.length),
        borderColor: colors.slice(0, topDomains.length).map((color) => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  }), [topDomains]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 12,
          font: {
            size: 11,
            weight: '600',
          },
          usePointStyle: true,
          boxWidth: 12,
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
          <h3 className={styles.cardTitle}>Email Domain Breakdown</h3>
          <p className={styles.cardSubtitle}>User email domain distribution</p>
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
          <h3 className={styles.cardTitle}>Email Domain Breakdown</h3>
          <p className={styles.cardSubtitle}>User email domain distribution</p>
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
        <h3 className={styles.cardTitle}>Email Domain Breakdown</h3>
        <p className={styles.cardSubtitle}>Top email domains used by users</p>
      </div>
      <div className={styles.chartContainer}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EmailDomainChart;

