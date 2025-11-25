import styles from './FormInput.module.css';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options = null,
}) => {
  const inputId = `input-${name}`;

  if (type === 'select') {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${styles.select} ${error ? styles.error : ''}`}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ''}`}
        required={required}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default FormInput;

