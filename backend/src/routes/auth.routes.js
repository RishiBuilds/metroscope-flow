import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/signup', authLimiter, asyncHandler(signup));
router.post('/login', authLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getMe));

export default router;
