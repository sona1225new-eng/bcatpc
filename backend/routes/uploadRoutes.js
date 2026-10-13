const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { uploadResume } = require('../services/cloudinaryStorage');
const { sendSuccess, sendBadRequest } = require('../utils/apiResponse');

const parseSingleUpload = (req, res, next) => {
  const middleware = req.query.type === 'resume'
    ? upload.resumeUpload.single('file')
    : upload.single('file');
  middleware(req, res, next);
};

router.post('/', protect, parseSingleUpload, asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendBadRequest(res, 'Please upload a file.');
  }

  if (req.query.type === 'resume') {
    if (req.file.buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      return sendBadRequest(res, 'The selected file is not a valid PDF document.');
    }

    const fileUrl = await uploadResume(req.file);
    return sendSuccess(
      res,
      {
        fileUrl,
        fileName: req.file.originalname,
        fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimetype: req.file.mimetype,
      },
      'Resume uploaded successfully.'
    );
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
}));

router.post('/multiple', protect, upload.array('files', 25), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendBadRequest(res, 'Please select at least one file to upload.');
  }

  const uploadedFiles = req.files.map((file) => ({
    fileUrl: `/uploads/${file.filename}`,
    fileName: file.originalname,
    storedName: file.filename,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    mimetype: file.mimetype,
  }));

  return sendSuccess(
    res,
    uploadedFiles,
    `${uploadedFiles.length} files uploaded successfully.`
  );
});

module.exports = router;
