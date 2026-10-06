const express = require('express');
const router = express.Router();
const {
  getAllCampusUpdates,
  getCampusUpdateById,
  createCampusUpdate,
  updateCampusUpdate,
  deleteCampusUpdate,
} = require('../controllers/campusUpdateController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllCampusUpdates)
  .post(protect, createCampusUpdate);

router.route('/:id')
  .get(validateObjectId('id'), getCampusUpdateById)
  .put(protect, validateObjectId('id'), updateCampusUpdate)
  .delete(protect, validateObjectId('id'), deleteCampusUpdate);

module.exports = router;
