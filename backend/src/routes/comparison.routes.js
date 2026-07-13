import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  saveComparison,
  listComparisons,
  getComparison,
  deleteComparison,
} from '../controllers/comparison.controller.js';

const router = Router();

router.use(protect);

router.post('/', saveComparison);
router.get('/', listComparisons);
router.get('/:id', getComparison);
router.delete('/:id', deleteComparison);

export default router;
