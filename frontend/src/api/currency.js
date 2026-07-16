import client from './client.js';

export const getExchangeRates = () => client.get('/exchange-rates');
