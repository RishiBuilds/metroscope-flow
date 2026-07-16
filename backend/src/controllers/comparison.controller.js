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

export async function updateNotes(req, res) {
  const comparison = await comparisonService.updateNotes({
    id: req.params.id,
    userId: req.user.id,
    notes: req.body.notes,
  });
  res.json({ data: comparison });
}

export async function shareComparison(req, res) {
  const token = await comparisonService.createShareToken({
    id: req.params.id,
    userId: req.user.id,
  });
  res.json({ data: { token, url: `${process.env.CLIENT_URL}/share/${token}` } });
}

export async function getSharedComparison(req, res) {
  const comparison = await comparisonService.getByShareToken(req.params.token);
  res.json({ data: comparison });
}
