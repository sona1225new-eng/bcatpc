const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { sendUnauthorized, sendForbidden } = require('../utils/apiResponse');
const Admin = require('../models/Admin');

/**
 * protect — verifies a Bearer JWT and attaches `req.admin` to the request.
 * Used to protect write routes (POST / PUT / DELETE) for the Admin Dashboard.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendUnauthorized(res, 'No token provided. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return sendUnauthorized(res, 'Admin account not found. Token invalid.');
    }

    if (!admin.isActive) {
      return sendForbidden(res, 'This admin account has been deactivated.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendUnauthorized(res, 'Token verification failed. Please log in again.');
  }
});

/**
 * authorizeRoles — restricts access to one or more admin roles.
 * Usage: router.delete('/:id', protect, authorizeRoles('superadmin'), handler)
 */
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin?.role)) {
    return sendForbidden(
      res,
      `Role '${req.admin?.role}' is not authorized for this action.`
    );
  }
  next();
};

module.exports = { protect, authorizeRoles };
