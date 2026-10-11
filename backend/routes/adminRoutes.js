const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Protect all admin endpoints
router.use(protect);

// Audit logs route (must precede /:id)
router.get('/audit-logs', requirePermission('users', 'view'), getAuditLogs);

// Admin collection routes
router.route('/')
  .get(requirePermission('users', 'view'), getAllAdmins)
  .post(requirePermission('users', 'create'), createAdmin);

// Admin document routes
router.route('/:id')
  .get(validateObjectId('id'), requirePermission('users', 'view'), getAdminById)
  .put(validateObjectId('id'), requirePermission('users', 'edit'), updateAdmin)
  .delete(validateObjectId('id'), requirePermission('users', 'delete'), deleteAdmin);

module.exports = router;
