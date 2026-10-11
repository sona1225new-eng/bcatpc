const express = require('express');
const router = express.Router();
const {
  getAllPYQs,
  getPYQById,
  createPYQ,
  updatePYQ,
  deletePYQ,
  trackPYQDownload,
} = require('../controllers/pyqController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getAllPYQs)
  .post(protect, requirePermission('pyqs', 'create'), upload.single('file'), createPYQ);

router.post('/:id/download', validateObjectId('id'), trackPYQDownload);

router.route('/:id')
  .get(validateObjectId('id'), getPYQById)
  .put(protect, requirePermission('pyqs', 'edit'), validateObjectId('id'), upload.single('file'), updatePYQ)
  .delete(protect, requirePermission('pyqs', 'delete'), validateObjectId('id'), deletePYQ);

module.exports = router;
