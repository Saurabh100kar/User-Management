import styles from './GenderFilter.module.css';

const GenderFilter = ({ selectedGender, onGenderChange }) => {
  const genders = [
    { value: '', label: 'All', icon: '👥' },
    { value: 'MALE', label: 'Male', icon: '♂️' },
    { value: 'FEMALE', label: 'Female', icon: '♀️' },
  ];

  return (
    <div className={styles.filterContainer}>
      <span className={styles.filterLabel}>Filter by Gender:</span>
      <div className={styles.filterPills}>
        {genders.map((gender) => (
          <button
            key={gender.value}
            className={`${styles.filterPill} ${
              selectedGender === gender.value ? styles.active : ''
            }`}
            onClick={() => onGenderChange(gender.value)}
            aria-label={`Filter by ${gender.label}`}
            aria-pressed={selectedGender === gender.value}
          >
            <span className={styles.pillIcon}>{gender.icon}</span>
            <span className={styles.pillLabel}>{gender.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenderFilter;

