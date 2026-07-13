import mongoose from 'mongoose';
import SavedComparison from '../models/SavedComparison.js';
import City from '../models/City.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

async function populateCitiesInSavedOrder(comparison, projection = '') {
  if (!comparison?.cityIds?.length) return comparison;
  const ids = comparison.cityIds.map((id) => id.toString());
  const cities = await City.find({ _id: { $in: ids } }, projection).lean();
  const citiesById = new Map(cities.map((city) => [city._id.toString(), city]));
  return { ...comparison, cityIds: ids.map((id) => citiesById.get(id)).filter(Boolean) };
}

function validateCityIds(cityIds) {
  if (!Array.isArray(cityIds) || cityIds.length < 2 || cityIds.length > 10) {
    throw new AppError('cityIds must contain between 2 and 10 city IDs.', 400, 'VALIDATION_ERROR');
  }
  if (new Set(cityIds).size !== cityIds.length || cityIds.some((id) => !isValidObjectId(id))) {
    throw new AppError('cityIds must contain unique valid city IDs.', 400, 'VALIDATION_ERROR');
  }
}

export async function createComparison({ userId, cityIds, name }) {
  validateCityIds(cityIds);
  const cities = await City.find({ _id: { $in: cityIds } }, 'city').lean();
  if (cities.length !== cityIds.length) {
    throw new AppError('One or more city IDs were not found. Ensure all IDs refer to existing cities.', 404, 'NOT_FOUND');
  }

  const cityById = new Map(cities.map((city) => [city._id.toString(), city]));
  const defaultName = cityIds.map((id) => cityById.get(id.toString()).city).join(' vs ');
  return SavedComparison.create({
    userId,
    cityIds,
    name: typeof name === 'string' && name.trim() ? name.trim() : defaultName,
  });
}

export async function listComparisons({ userId, page, limit, skip }) {
  const filter = { userId };
  const [comparisons, total] = await Promise.all([
    SavedComparison.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SavedComparison.countDocuments(filter),
  ]);
  const orderedComparisons = await Promise.all(comparisons.map((comparison) => populateCitiesInSavedOrder(comparison, 'city country')));
  return { comparisons: orderedComparisons, meta: paginationMeta({ page, limit, total }) };
}

export async function getComparison({ id, userId }) {
  if (!isValidObjectId(id)) {
    throw new AppError(`Invalid comparison ID: ${id}`, 400, 'VALIDATION_ERROR');
  }
  const comparison = await SavedComparison.findOne({ _id: id, userId }).lean();
  if (!comparison) {
    throw new AppError('Comparison not found.', 404, 'NOT_FOUND');
  }
  return populateCitiesInSavedOrder(comparison);
}

export async function removeComparison({ id, userId }) {
  if (!isValidObjectId(id)) {
    throw new AppError(`Invalid comparison ID: ${id}`, 400, 'VALIDATION_ERROR');
  }
  const comparison = await SavedComparison.findOneAndDelete({ _id: id, userId });
  if (!comparison) {
    throw new AppError('Comparison not found.', 404, 'NOT_FOUND');
  }
}
