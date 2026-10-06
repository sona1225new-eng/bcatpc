const express = require('express');
const router = express.Router();
const {
  getCoordinator,
  getCoordinatorById,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
} = require('../controllers/coordinatorController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getCoordinator)
  .post(protect, createCoordinator);

router.route('/:id')
  .get(validateObjectId('id'), getCoordinatorById)
  .put(protect, validateObjectId('id'), updateCoordinator)
  .delete(protect, validateObjectId('id'), deleteCoordinator);

module.exports = router;
