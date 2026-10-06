const express = require('express');
const router = express.Router();
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// All admin management routes require superadmin role
router.use(protect, authorize('superadmin'));

router.route('/')
  .get(getAllAdmins)
  .post(createAdmin);

router.route('/:id')
  .get(validateObjectId('id'), getAdminById)
  .put(validateObjectId('id'), updateAdmin)
  .delete(validateObjectId('id'), deleteAdmin);

module.exports = router;
