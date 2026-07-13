import mongoose from 'mongoose';
import * as cityRepository from '../repositories/city.repository.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listCities({ page, limit, skip }) {
  const [cities, total] = await Promise.all([
    cityRepository.findSummaries({ skip, limit }),
    cityRepository.countCities(),
  ]);
  return { cities, meta: paginationMeta({ page, limit, total }) };
}

export async function searchCities({ query, page, limit, skip }) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new AppError('Query parameter "q" is required and must be non-empty.', 400, 'VALIDATION_ERROR');
  }

  const escaped = escapeRegex(query.trim());
  const filter = { $or: [{ city: new RegExp(escaped, 'i') }, { country: new RegExp(escaped, 'i') }] };
  const [cities, total] = await Promise.all([
    cityRepository.findSummaries({ filter, skip, limit }),
    cityRepository.countCities(filter),
  ]);
  return { cities, meta: paginationMeta({ page, limit, total }) };
}

export async function compareCities(ids) {
  if (!ids || typeof ids !== 'string' || ids.trim().length === 0) {
    throw new AppError('Query parameter "ids" is required (comma-separated ObjectIds).', 400, 'VALIDATION_ERROR');
  }

  const idList = ids.split(',').map((id) => id.trim()).filter(Boolean);
  if (idList.length < 2 || idList.length > 10) {
    throw new AppError('Between 2 and 10 city IDs are required for comparison.', 400, 'VALIDATION_ERROR');
  }
  if (new Set(idList).size !== idList.length || idList.some((id) => !isValidObjectId(id))) {
    throw new AppError('City IDs must be unique valid ObjectIds.', 400, 'VALIDATION_ERROR');
  }

  const cities = await cityRepository.findCitiesByIds(idList);
  if (cities.length !== idList.length) {
    throw new AppError('One or more city IDs were not found.', 404, 'NOT_FOUND');
  }

  const cityById = new Map(cities.map((city) => [city._id.toString(), city]));
  return idList.map((id) => cityById.get(id));
}

export async function getCityById(id) {
  if (!isValidObjectId(id)) {
    throw new AppError(`Invalid city ID: ${id}`, 400, 'VALIDATION_ERROR');
  }

  const city = await cityRepository.findCityById(id);
  if (!city) {
    throw new AppError('City not found.', 404, 'NOT_FOUND');
  }
  return city;
}
