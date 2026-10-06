/**
 * Standardised API response helpers.
 * All controllers use these to guarantee a consistent JSON shape.
 *
 * Success:  { success: true,  data: ...,  message: ... }
 * Error:    { success: false, message: ..., errors: ... }
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Server error', statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return sendError(res, message, 400, errors);
};

const sendUnauthorized = (res, message = 'Unauthorized. Please log in.') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Forbidden. Insufficient permissions.') => {
  return sendError(res, message, 403);
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
};
