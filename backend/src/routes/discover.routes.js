import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { discoverCities } from '../controllers/discover.controller.js';

const router = Router();

router.post('/', asyncHandler(discoverCities));

export default router;
