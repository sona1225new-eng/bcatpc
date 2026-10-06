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
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAcademic)
  .post(protect, createAcademic);

router.route('/:id')
  .get(validateObjectId('id'), getAcademicById)
  .put(protect, validateObjectId('id'), updateAcademic)
  .delete(protect, validateObjectId('id'), deleteAcademic);

module.exports = router;
