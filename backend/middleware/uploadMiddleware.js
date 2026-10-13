const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const allowedFiles = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

const getFileFilter = (pdfOnly = false) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const expectedMimeType = allowedFiles[ext];
  const validFile = expectedMimeType === file.mimetype && (!pdfOnly || ext === '.pdf');

  if (validFile) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error(
          pdfOnly
            ? 'Invalid resume file. Select a PDF file.'
            : 'Invalid file type. Use JPG, PNG, WEBP, GIF, SVG, or PDF files with a matching extension.'
        ),
        { statusCode: 400 }
      ),
      false
    );
  }
};

const maxFileSizeMb = Number.parseInt(process.env.MAX_UPLOAD_SIZE_MB || '5', 10);
const maxFileSize = (Number.isFinite(maxFileSizeMb) && maxFileSizeMb > 0 ? maxFileSizeMb : 5) * 1024 * 1024;

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: getFileFilter(),
});

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: getFileFilter(true),
});

upload.resumeUpload = resumeUpload;

module.exports = upload;
