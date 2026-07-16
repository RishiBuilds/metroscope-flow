import { findMatchingCities } from '../services/discover.service.js';
import { AppError } from '../utils/AppError.js';

const VALID_BUDGETS   = ['low', 'medium', 'high'];
const VALID_CLIMATES  = ['warm', 'moderate', 'cold'];
const VALID_PACES     = ['fast', 'balanced', 'relaxed'];
const VALID_PRIORITIES = ['affordability', 'safety', 'quality', 'healthcare', 'nature'];
const VALID_WORK      = ['remote', 'office', 'flexible'];

export async function discoverCities(req, res) {
  const { budget, climate, pace, priority, work } = req.body;

  if (!VALID_BUDGETS.includes(budget)) throw new AppError('Invalid budget value.', 400, 'VALIDATION_ERROR');
  if (!VALID_CLIMATES.includes(climate)) throw new AppError('Invalid climate value.', 400, 'VALIDATION_ERROR');
  if (!VALID_PACES.includes(pace)) throw new AppError('Invalid pace value.', 400, 'VALIDATION_ERROR');
  if (!VALID_PRIORITIES.includes(priority)) throw new AppError('Invalid priority value.', 400, 'VALIDATION_ERROR');
  if (!VALID_WORK.includes(work)) throw new AppError('Invalid work value.', 400, 'VALIDATION_ERROR');

  const matches = await findMatchingCities({ budget, climate, pace, priority, work });
  res.json({ data: matches });
}
