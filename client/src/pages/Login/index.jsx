import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import styles from './index.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // TODO: Implement actual login API call
      // const response = await loginUser(formData);
      // if (response.success) {
      //   navigate('/');
      // }
      
      // Temporary: Just navigate to home for now
      console.log('Login attempt:', formData);
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      setLoading(false);
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {errors.submit && (
              <div className={styles.errorBanner}>
                {errors.submit}
              </div>
            )}

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
              placeholder="Enter your password"
              required
            />

            <div className={styles.formFooter}>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.signupPrompt}>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className={styles.signupLink}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


