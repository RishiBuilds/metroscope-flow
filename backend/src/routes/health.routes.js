import { Router } from 'express';

const router = Router();

export function healthCheck(_req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
}

router.get('/', healthCheck);

export default router;
