import assert from 'node:assert/strict';
import test from 'node:test';
import { AppError } from '../src/utils/AppError.js';
import { paginationMeta, parsePagination } from '../src/utils/pagination.js';

test('parsePagination supplies the default page and limit', () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 20, skip: 0 });
});

test('parsePagination calculates an offset for a requested page', () => {
  assert.deepEqual(parsePagination({ page: '3', limit: '15' }), {
    page: 3,
    limit: 15,
    skip: 30,
  });
});

test('parsePagination rejects invalid and oversized input', () => {
  for (const query of [{ page: '0' }, { page: 'first' }, { limit: '101' }]) {
    assert.throws(() => parsePagination(query), (error) => (
      error instanceof AppError && error.statusCode === 400 && error.code === 'VALIDATION_ERROR'
    ));
  }
});

test('paginationMeta reports a rounded-up page total', () => {
  assert.deepEqual(paginationMeta({ page: 2, limit: 20, total: 41 }), {
    page: 2,
    limit: 20,
    total: 41,
    totalPages: 3,
  });
});
