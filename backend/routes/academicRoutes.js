const express = require('express');
const router = express.Router();
const {
  getAcademic,
  getAcademicById,
  createAcademic,
  updateAcademic,
  deleteAcademic,
} = require('../controllers/academicController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAcademic)
  .post(protect, requirePermission('academics', 'create'), createAcademic);

router.route('/:id')
  .get(validateObjectId('id'), getAcademicById)
  .put(protect, requirePermission('academics', 'edit'), validateObjectId('id'), updateAcademic)
  .delete(protect, requirePermission('academics', 'delete'), validateObjectId('id'), deleteAcademic);

module.exports = router;
