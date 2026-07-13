export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    error: {
      message: `Not found: ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
  });
};

export const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: { message: messages.join('; '), code: 'VALIDATION_ERROR' },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: { message: `Invalid ${err.path}: ${err.value}`, code: 'CAST_ERROR' },
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      error: { message: `Duplicate value for ${field}.`, code: 'DUPLICATE_KEY' },
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';
  const code = err.code || 'SERVER_ERROR';

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({ error: { message, code } });
};
