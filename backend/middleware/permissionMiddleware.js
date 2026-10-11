const { hasPermission } = require('../utils/permissions');
const { sendForbidden } = require('../utils/apiResponse');

/**
 * Middleware: Enforces module-level RBAC permission for the authenticated admin.
 *
 * Example usage:
 * router.post('/', protect, requirePermission('faculty', 'create'), createFaculty);
 * router.delete('/:id', protect, requirePermission('faculty', 'delete'), deleteFaculty);
 */
const requirePermission = (moduleName, action) => {
  return (req, res, next) => {
    if (!req.admin) {
      return sendForbidden(res, 'Authentication required to access this resource.');
    }

    if (!req.admin.isActive) {
      return sendForbidden(res, 'Your account is deactivated. Contact an administrator.');
    }

    if (!hasPermission(req.admin, moduleName, action)) {
      return sendForbidden(
        res,
        `Access denied. You do not have '${action}' permission for the '${moduleName}' module.`
      );
    }

    next();
  };
};

module.exports = { requirePermission };
