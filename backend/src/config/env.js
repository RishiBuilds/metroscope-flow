import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const required = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CLIENT_URL'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const parsedPort = Number(process.env.PORT);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error('Environment variable PORT must be an integer between 1 and 65535.');
}

const parsedDbTimeout = Number(process.env.DB_SERVER_SELECTION_TIMEOUT_MS || 5000);
if (!Number.isInteger(parsedDbTimeout) || parsedDbTimeout < 1000) {
  throw new Error('DB_SERVER_SELECTION_TIMEOUT_MS must be an integer of at least 1000.');
}

export const PORT = parsedPort;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const CLIENT_URL = process.env.CLIENT_URL;
export const DB_SERVER_SELECTION_TIMEOUT_MS = parsedDbTimeout;
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
