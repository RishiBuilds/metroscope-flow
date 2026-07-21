import { IS_PRODUCTION } from './env.js';

const COOKIE_NAME = 'token';

function parseDuration(str) {
  const match = str.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const val = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return val * multipliers[unit];
}

function cookieOptions(expiresIn) {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'None' : 'Lax',
    maxAge: parseDuration(expiresIn),
    path: '/',
  };
}

export { COOKIE_NAME, cookieOptions };
