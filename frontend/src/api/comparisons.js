import client from './client.js';

export const saveComparison   = (data) => client.post('/comparisons', data);
export const listComparisons  = (params) => client.get('/comparisons', { params });
export const deleteComparison = (id)   => client.delete(`/comparisons/${id}`);
