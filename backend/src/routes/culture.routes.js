import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { chat } from '../controllers/culture.controller.js';

const router = Router();

router.use(protect);
router.post('/chat', asyncHandler(chat));

export default router;
