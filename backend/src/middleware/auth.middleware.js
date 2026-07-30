import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { COOKIE_NAME } from '../config/cookie.js';
import { AppError } from '../utils/AppError.js';

export const protect = async (req, _res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHENTICATED');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401, 'TOKEN_EXPIRED'));
    }
    next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
  }
};
