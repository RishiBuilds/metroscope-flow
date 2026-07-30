import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/visa.controller.js';

const router = Router();

router.use(protect);
router.post('/predict', asyncHandler(controller.predict));
router.post('/results', asyncHandler(controller.saveResult));
router.get('/results', asyncHandler(controller.listResults));
router.get('/timeline', asyncHandler(controller.getTimeline));
router.patch('/timeline/:userId', asyncHandler(controller.updateTimeline));

export default router;
