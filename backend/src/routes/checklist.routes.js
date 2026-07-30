import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/checklist.controller.js';

const router = Router();

router.use(protect);
router.post('/generate', asyncHandler(controller.generate));
router.get('/', asyncHandler(controller.getActive));
router.patch('/:id', asyncHandler(controller.toggle));

export default router;
