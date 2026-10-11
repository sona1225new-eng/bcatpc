const express = require('express');
const router = express.Router();
const {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllFaculties)
  .post(protect, requirePermission('faculty', 'create'), createFaculty);

router.route('/:id')
  .get(getFacultyById)
  .put(protect, requirePermission('faculty', 'edit'), validateObjectId('id'), updateFaculty)
  .delete(protect, requirePermission('faculty', 'delete'), validateObjectId('id'), deleteFaculty);

module.exports = router;
