import * as cityService from '../services/city.service.js';
import { parsePagination } from '../utils/pagination.js';

export async function getCities(req, res) {
  const result = await cityService.listCities(parsePagination(req.query, { defaultLimit: 50 }));
  res.json({ data: result.cities, meta: result.meta });
}

export async function searchCities(req, res) {
  const result = await cityService.searchCities({
    query: req.query.q,
    ...parsePagination(req.query, { defaultLimit: 20 }),
  });
  res.json({ data: result.cities, meta: result.meta });
}

export async function compareCities(req, res) {
  const cities = await cityService.compareCities(req.query.ids);
  res.json({ data: cities });
}

export async function getCityById(req, res) {
  const city = await cityService.getCityById(req.params.id);
  res.json({ data: city });
}
