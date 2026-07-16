import client from './client.js';

export const saveComparison         = (data)         => client.post('/comparisons', data);
export const listComparisons        = (params)       => client.get('/comparisons', { params });
export const getComparison          = (id)           => client.get(`/comparisons/${id}`);
export const deleteComparison       = (id)           => client.delete(`/comparisons/${id}`);
export const updateComparisonNotes  = (id, notes)    => client.patch(`/comparisons/${id}/notes`, { notes });
export const shareComparison        = (id)           => client.post(`/comparisons/${id}/share`);
export const getSharedComparison    = (token)        => client.get(`/comparisons/share/${token}`);
