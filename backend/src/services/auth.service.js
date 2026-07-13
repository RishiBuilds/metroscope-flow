import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function createUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400, 'VALIDATION_ERROR');
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters.', 400, 'VALIDATION_ERROR');
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).lean();
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409, 'DUPLICATE_EMAIL');
  }

  return User.create({ name, email: normalizedEmail, passwordHash: password });
}

export async function authenticateUser({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email and password are required.', 400, 'VALIDATION_ERROR');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
  }

  return user;
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404, 'NOT_FOUND');
  }
  return user;
}
