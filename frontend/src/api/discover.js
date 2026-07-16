import client from './client.js';

export const discoverCities = (answers) => client.post('/discover', answers);
