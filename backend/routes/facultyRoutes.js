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
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllFaculties)
  .post(protect, createFaculty);

router.route('/:id')
  .get(validateObjectId('id'), getFacultyById)
  .put(protect, validateObjectId('id'), updateFaculty)
  .delete(protect, validateObjectId('id'), deleteFaculty);

module.exports = router;
