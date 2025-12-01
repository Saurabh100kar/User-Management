import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import styles from './index.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual signup API call
      // const response = await signupUser({
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      // });
      // if (response.success) {
      //   navigate('/');
      // }
      
      // Temporary: Just navigate to home for now
      console.log('Signup attempt:', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      setLoading(false);
      setErrors({ submit: error.message || 'Signup failed. Please try again.' });
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            {errors.submit && (
              <div className={styles.errorBanner}>
                {errors.submit}
              </div>
            )}

            <FormInput
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password"
              required
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />

            <div className={styles.terms}>
              <label className={styles.termsLabel}>
                <input type="checkbox" required />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className={styles.termsLink}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.loginPrompt}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles.loginLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


