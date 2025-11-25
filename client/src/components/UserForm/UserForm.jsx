import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import styles from './UserForm.module.css';

const UserForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    gender: initialData?.gender || '',
    phone: initialData?.phone || '',
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim() || formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim() || formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormInput
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        error={errors.first_name}
        placeholder="Enter first name"
        required
      />

      <FormInput
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        error={errors.last_name}
        placeholder="Enter last name"
        required
      />

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter email address"
        required
      />

      <FormInput
        label="Gender"
        type="select"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        error={errors.gender}
        options={genderOptions}
        required
      />

      <FormInput
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="Enter phone number"
        required
      />

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update User' : 'Create User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

