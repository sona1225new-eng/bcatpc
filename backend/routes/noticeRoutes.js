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
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllNotices)
  .post(protect, requirePermission('notices', 'create'), createNotice);

router.route('/:id')
  .get(validateObjectId('id'), getNoticeById)
  .put(protect, requirePermission('notices', 'edit'), validateObjectId('id'), updateNotice)
  .delete(protect, requirePermission('notices', 'delete'), validateObjectId('id'), deleteNotice);

module.exports = router;
