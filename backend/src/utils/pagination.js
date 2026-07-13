import { AppError } from './AppError.js';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function parsePagination(query, { defaultLimit = DEFAULT_PAGE_SIZE, maxLimit = MAX_PAGE_SIZE } = {}) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? defaultLimit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    throw new AppError(
      `Pagination must use a positive integer page and a limit between 1 and ${maxLimit}.`,
      400,
      'VALIDATION_ERROR'
    );
  }

  return { page, limit, skip: (page - 1) * limit };
}

export function paginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
