import City from '../models/City.js';

export function findSummaries({ filter = {}, skip = 0, limit = 20 }) {
  return City.find(filter, '_id city country')
    .sort({ city: 1, country: 1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

export function countCities(filter = {}) {
  return City.countDocuments(filter);
}

export function findCitiesByIds(ids) {
  return City.find({ _id: { $in: ids } }).lean();
}

export function findCityById(id) {
  return City.findById(id).lean();
}
