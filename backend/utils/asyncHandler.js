/**
 * asyncHandler — wraps async route handlers so they don't need try/catch blocks.
 * Any rejected promise is forwarded to Express's next(error) middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
