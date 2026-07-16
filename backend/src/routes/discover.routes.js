import { Router } from 'express';
import { discoverCities } from '../controllers/discover.controller.js';

const router = Router();

router.post('/', discoverCities);

export default router;
