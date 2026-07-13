import { Router } from 'express';
import {
  getCities,
  getCityById,
  compareCities,
  searchCities,
} from '../controllers/city.controller.js';

const router = Router();

router.get('/compare', compareCities);
router.get('/search', searchCities);
router.get('/', getCities);
router.get('/:id', getCityById);

export default router;
