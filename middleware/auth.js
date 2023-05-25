import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  // Make sure token exists
  if (!token) {
    return next( ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next( ErrorResponse('Not authorized to access this route', 401));
  }
};

// middleware for admin
export const isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next( ErrorResponse('Access denied, you must be an admin', 401));
  }
  next();
};
