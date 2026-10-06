const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { sendSuccess, sendBadRequest } = require('../utils/apiResponse');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return sendBadRequest(res, 'Please upload a file.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(
    res,
    {
      fileUrl,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimetype: req.file.mimetype,
    },
    'File uploaded successfully.'
  );
});

module.exports = router;
