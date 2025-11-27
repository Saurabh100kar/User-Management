const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to req.user
 * 
 * Usage:
 * router.get('/protected-route', authMiddleware, handler);
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user data to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    let statusCode = HTTP_STATUS.UNAUTHORIZED;
    let message = 'Invalid or expired token';

    if (error.message.includes('expired')) {
      message = 'Token has expired. Please login again.';
    } else if (error.message.includes('Invalid')) {
      message = 'Invalid token. Please provide a valid token.';
    }

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

module.exports = authMiddleware;

