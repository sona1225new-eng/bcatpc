const mongoose = require('mongoose');

/**
 * Centralized error-handling middleware.
 * Must be registered LAST in server.js (after all routes).
 *
 * Handles:
 *  - Mongoose ValidationError      → 400
 *  - Mongoose CastError (bad ID)   → 400
 *  - Mongoose duplicate key        → 409
 *  - JWT errors                    → 401
 *  - Generic / unknown             → 500
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // ── Mongoose: invalid ObjectId ──────────────────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID: '${err.value}' is not a valid MongoDB ObjectId.`;
  }

  // ── Mongoose: validation errors ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── Mongoose: duplicate key (unique constraint) ──────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value: a record with this ${field} already exists.`;
  }

  // ── JWT errors ───────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // ── Response ─────────────────────────────────────────────────────────────────
  const response = { success: false, message };
  if (errors) response.errors = errors;

  // Show stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 handler — catches requests to undefined routes.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFoundHandler };
