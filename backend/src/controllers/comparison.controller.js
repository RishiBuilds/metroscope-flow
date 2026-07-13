import * as comparisonService from '../services/comparison.service.js';
import { parsePagination } from '../utils/pagination.js';

export async function saveComparison(req, res) {
  const comparison = await comparisonService.createComparison({ userId: req.user.id, ...req.body });
  res.status(201).json({ data: comparison });
}

export async function listComparisons(req, res) {
  const result = await comparisonService.listComparisons({
    userId: req.user.id,
    ...parsePagination(req.query),
  });
  res.json({ data: result.comparisons, meta: result.meta });
}

export async function getComparison(req, res) {
  const comparison = await comparisonService.getComparison({ id: req.params.id, userId: req.user.id });
  res.json({ data: comparison });
}

export async function deleteComparison(req, res) {
  await comparisonService.removeComparison({ id: req.params.id, userId: req.user.id });
  res.json({ data: { message: 'Comparison deleted successfully.' } });
}
