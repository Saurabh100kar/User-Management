/**
 * Validation utilities for authentication
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  return { valid: true, message: 'Password is valid' };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} { valid: boolean, message: string }
 */
const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return {
      valid: false,
      message: 'Name must be at least 2 characters long',
    };
  }

  if (name.trim().length > 100) {
    return {
      valid: false,
      message: 'Name must be less than 100 characters',
    };
  }

  return { valid: true, message: 'Name is valid' };
};

/**
 * Validate signup data
 * @param {Object} data - Signup data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Object} { valid: boolean, errors: string[] }
 */
const validateSignupData = (data) => {
  const errors = [];

  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    errors.push(nameValidation.message);
  }

  // Validate email
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push(passwordValidation.message);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate login data
 * @param {Object} data - Login data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Object} { valid: boolean, errors: string[] }
 */
const validateLoginData = (data) => {
  const errors = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || data.password.length === 0) {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateSignupData,
  validateLoginData,
};

