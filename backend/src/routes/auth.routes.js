import { Router } from 'express';
import { signup, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
