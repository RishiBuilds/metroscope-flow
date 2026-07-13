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

const app = express();

app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api', apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/visa', visaRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/culture', cultureRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
