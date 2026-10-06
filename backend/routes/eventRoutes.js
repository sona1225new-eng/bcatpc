const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllEvents)
  .post(protect, createEvent);

router.route('/:id')
  .get(validateObjectId('id'), getEventById)
  .put(protect, validateObjectId('id'), updateEvent)
  .delete(protect, validateObjectId('id'), deleteEvent);

module.exports = router;
