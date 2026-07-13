import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import { COOKIE_NAME, cookieOptions } from '../config/cookie.js';
import * as authService from '../services/auth.service.js';

const signToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export async function signup(req, res) {
  const user = await authService.createUser(req.body);
  res.status(201).json({ data: { message: 'Account created successfully. Please log in.', user: user.toJSON() } });
}

export async function login(req, res) {
  const user = await authService.authenticateUser(req.body);
  res.cookie(COOKIE_NAME, signToken(user._id), cookieOptions(JWT_EXPIRES_IN));
  res.json({ data: { message: 'Logged in successfully.', user: user.toJSON() } });
}

export async function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions(JWT_EXPIRES_IN));
  res.json({ data: { message: 'Logged out successfully.' } });
}

export async function getMe(req, res) {
  const user = await authService.getUserById(req.user.id);
  res.json({ data: { user: user.toJSON() } });
}
