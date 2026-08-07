import assert from 'node:assert/strict';
import test from 'node:test';
import { healthCheck } from '../src/routes/health.routes.js';

test('healthCheck returns status and operational diagnostics', () => {
  let body;
  const response = { json: (payload) => { body = payload; } };

  healthCheck({}, response);

  assert.equal(body.status, 'ok');
  assert.ok(Number.isInteger(body.uptimeSeconds));
  assert.ok(Number.isFinite(Date.parse(body.timestamp)));
});
