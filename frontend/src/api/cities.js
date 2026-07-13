import client from './client.js';

export const searchCities  = (q)        => client.get('/cities/search', { params: { q } });
export const compareCities = (ids)      => client.get('/cities/compare', { params: { ids: ids.join(',') } });
export const getCityById   = (id)       => client.get(`/cities/${id}`);
