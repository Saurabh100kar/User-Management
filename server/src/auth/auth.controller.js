const authService = require('./auth.service');
const { validateSignupData, validateLoginData } = require('./auth.validators');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Handle user signup
 * POST /auth/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    const validation = validateSignupData({ name, email, password });
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Validate role if provided
    if (role && !['admin', 'user'].includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid role. Must be "admin" or "user"',
      });
    }

    // Create user
    const user = await authService.signup({
      name,
      email,
      password,
      role: role || 'user',
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate email error
    if (error.message.includes('already exists')) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Handle user login
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLoginData({ email, password });
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Authenticate user
    const { user, token } = await authService.login({ email, password });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    // Handle authentication errors
    if (error.message.includes('Invalid email or password')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get current user profile
 * GET /auth/me
 * Requires authentication middleware
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    const user = await authService.getUserById(userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};

