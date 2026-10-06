const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllNotices)
  .post(protect, createNotice);

router.route('/:id')
  .get(validateObjectId('id'), getNoticeById)
  .put(protect, validateObjectId('id'), updateNotice)
  .delete(protect, validateObjectId('id'), deleteNotice);

module.exports = router;
