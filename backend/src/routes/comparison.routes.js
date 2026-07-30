import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  saveComparison,
  listComparisons,
  getComparison,
  deleteComparison,
  updateNotes,
  shareComparison,
  getSharedComparison,
} from '../controllers/comparison.controller.js';

const router = Router();

router.get('/share/:token', asyncHandler(getSharedComparison));
router.use(protect);
router.post('/', asyncHandler(saveComparison));
router.get('/', asyncHandler(listComparisons));
router.get('/:id', asyncHandler(getComparison));
router.delete('/:id', asyncHandler(deleteComparison));
router.patch('/:id/notes', asyncHandler(updateNotes));
router.post('/:id/share', asyncHandler(shareComparison));

export default router;
