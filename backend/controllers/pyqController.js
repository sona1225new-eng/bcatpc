const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const PYQ = require('../models/PYQ');

/**
 * GET /api/pyqs — List previous year question papers with filters and search
 * Query filters: semester, subject, year, search, status, paperType
 */
const getAllPYQs = asyncHandler(async (req, res) => {
  const { semester, semesterNumber, subject, year, search, status, paperType } = req.query;
  const filter = {};

  // Default to published papers unless admin requests all
  if (status) {
    filter.status = status;
  } else if (req.query.all !== 'true') {
    filter.status = 'published';
  }

  // Filter by semester slug ('semester-1') or semesterNumber
  if (semester) {
    if (semester.startsWith('semester-')) {
      filter.semester = semester;
    } else if (!isNaN(Number(semester))) {
      filter.semesterNumber = Number(semester);
    } else {
      filter.semester = semester;
    }
  }

  if (semesterNumber) {
    filter.semesterNumber = Number(semesterNumber);
  }

  // Filter by subject
  if (subject) {
    filter.subject = { $regex: subject, $options: 'i' };
  }

  // Filter by year
  if (year && !isNaN(Number(year))) {
    filter.year = Number(year);
  }

  // Filter by paperType
  if (paperType) {
    filter.paperType = paperType;
  }

  // Search keyword across title, subject, subjectCode, and description
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { subjectCode: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pyqs = await PYQ.find(filter).sort({ year: -1, semesterNumber: 1, subject: 1 });
  return sendSuccess(res, pyqs, `${pyqs.length} question papers retrieved.`);
});

/** GET /api/pyqs/:id — Get a single PYQ by ID */
const getPYQById = asyncHandler(async (req, res) => {
  const pyq = await PYQ.findById(req.params.id);
  if (!pyq) {
    return sendNotFound(res, `PYQ with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, pyq, 'Question paper retrieved.');
});

/** POST /api/pyqs — Create a new PYQ entry (Admin only) */
const createPYQ = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  // If a file was uploaded via multer, populate PDF file fields
  if (req.file) {
    data.fileUrl = `/uploads/${req.file.filename}`;
    data.fileName = req.file.originalname;
    data.fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
  }

  // Auto-fill semesterNumber and semesterLabel if semester slug is provided
  if (data.semester && !data.semesterNumber) {
    const match = data.semester.match(/semester-(\d+)/);
    if (match) {
      data.semesterNumber = parseInt(match[1], 10);
    }
  }

  if (data.semesterNumber && !data.semesterLabel) {
    data.semesterLabel = `Semester ${data.semesterNumber}`;
  }

  const pyq = await PYQ.create(data);
  return sendCreated(res, pyq, 'Question paper created successfully.');
});

/** PUT /api/pyqs/:id — Update a PYQ entry (Admin only) */
const updatePYQ = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.fileUrl = `/uploads/${req.file.filename}`;
    data.fileName = req.file.originalname;
    data.fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (data.semester && !data.semesterNumber) {
    const match = data.semester.match(/semester-(\d+)/);
    if (match) {
      data.semesterNumber = parseInt(match[1], 10);
    }
  }

  const pyq = await PYQ.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true, runValidators: true }
  );

  if (!pyq) {
    return sendNotFound(res, `PYQ with id '${req.params.id}' not found.`);
  }

  return sendSuccess(res, pyq, 'Question paper updated successfully.');
});

/** DELETE /api/pyqs/:id — Delete a PYQ entry (Admin only) */
const deletePYQ = asyncHandler(async (req, res) => {
  const pyq = await PYQ.findByIdAndDelete(req.params.id);
  if (!pyq) {
    return sendNotFound(res, `PYQ with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, null, 'Question paper deleted successfully.');
});

/** POST /api/pyqs/:id/download — Increment download counter */
const trackPYQDownload = asyncHandler(async (req, res) => {
  const pyq = await PYQ.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloadsCount: 1 } },
    { new: true }
  );

  if (!pyq) {
    return sendNotFound(res, `PYQ with id '${req.params.id}' not found.`);
  }

  return sendSuccess(res, { downloadsCount: pyq.downloadsCount }, 'Download count incremented.');
});

module.exports = {
  getAllPYQs,
  getPYQById,
  createPYQ,
  updatePYQ,
  deletePYQ,
  trackPYQDownload,
};
