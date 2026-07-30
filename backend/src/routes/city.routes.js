import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getCities,
  getCityById,
  compareCities,
  searchCities,
} from '../controllers/city.controller.js';

const router = Router();

router.get('/compare', asyncHandler(compareCities));
router.get('/search', asyncHandler(searchCities));
router.get('/', asyncHandler(getCities));
router.get('/:id', asyncHandler(getCityById));

export default router;
