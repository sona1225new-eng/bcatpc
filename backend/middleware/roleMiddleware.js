const { sendForbidden } = require('../utils/apiResponse');

/**
 * authorize — restricts access to specific roles (e.g. 'superadmin').
 * Usage: router.use(protect, authorize('superadmin'));
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return sendForbidden(res, 'Authentication required.');
    }

    if (!roles.includes(req.admin.role)) {
      return sendForbidden(
        res,
        `Access denied. Role '${req.admin.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

module.exports = { authorize };
