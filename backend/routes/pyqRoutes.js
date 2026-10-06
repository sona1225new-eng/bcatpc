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
const validateObjectId = require('../middleware/validateObjectId');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getAllPYQs)
  .post(protect, upload.single('file'), createPYQ);

router.post('/:id/download', validateObjectId('id'), trackPYQDownload);

router.route('/:id')
  .get(validateObjectId('id'), getPYQById)
  .put(protect, validateObjectId('id'), upload.single('file'), updatePYQ)
  .delete(protect, validateObjectId('id'), deletePYQ);

module.exports = router;
