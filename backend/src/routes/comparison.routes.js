import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
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

router.get('/share/:token', getSharedComparison);
router.use(protect);
router.post('/', saveComparison);
router.get('/', listComparisons);
router.get('/:id', getComparison);
router.delete('/:id', deleteComparison);
router.patch('/:id/notes', updateNotes);
router.post('/:id/share', shareComparison);

export default router;
