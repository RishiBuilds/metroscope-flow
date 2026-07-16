import { Router } from 'express';
import { exchangeRates, currencySymbols } from '../data/exchangeRates.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    data: {
      rates: exchangeRates,
      symbols: currencySymbols,
    },
  });
});

export default router;
