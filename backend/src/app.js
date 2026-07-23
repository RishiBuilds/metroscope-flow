import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CLIENT_URL } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import cityRoutes from './routes/city.routes.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import comparisonRoutes from './routes/comparison.routes.js';
import visaRoutes from './routes/visa.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import cultureRoutes from './routes/culture.routes.js';
import exchangeRatesRoutes from './routes/exchangeRates.routes.js';
import discoverRoutes from './routes/discover.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use(apiLimiter);
apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/comparisons', comparisonRoutes);
apiRouter.use('/cities', cityRoutes);
apiRouter.use('/visa', visaRoutes);
apiRouter.use('/checklist', checklistRoutes);
apiRouter.use('/culture', cultureRoutes);
apiRouter.use('/exchange-rates', exchangeRatesRoutes);
apiRouter.use('/discover', discoverRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
