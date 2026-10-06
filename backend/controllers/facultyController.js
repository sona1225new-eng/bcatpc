const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/apiResponse');
const Faculty = require('../models/Faculty');

/** GET /api/faculties — List faculties (Public: active only; Admin: supports ?all=true & ?search=) */
const getAllFaculties = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.all !== 'true') {
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    } else {
      filter.isActive = true;
    }
  }

  if (req.query.search) {
    const q = req.query.search;
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { designation: { $regex: q, $options: 'i' } },
      { specialization: { $regex: q, $options: 'i' } },
      { qualification: { $regex: q, $options: 'i' } },
    ];
  }

  const faculties = await Faculty.find(filter).sort({ order: 1, name: 1 });
  return sendSuccess(res, faculties, `${faculties.length} faculties retrieved.`);
});

/** GET /api/faculties/:id — Get a single faculty by MongoDB ObjectId */
const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) return sendNotFound(res, `Faculty with id '${req.params.id}' not found.`);
  return sendSuccess(res, faculty, 'Faculty retrieved.');
});

/** POST /api/faculties — Create a new faculty (Admin only) */
const createFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.create(req.body);
  return sendCreated(res, faculty, 'Faculty created successfully.');
});

/** PUT /api/faculties/:id — Update a faculty (Admin only) */
const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!faculty) return sendNotFound(res, `Faculty with id '${req.params.id}' not found.`);
  return sendSuccess(res, faculty, 'Faculty updated successfully.');
});

/** DELETE /api/faculties/:id — Delete faculty (Permanent if ?permanent=true, else soft delete) */
const deleteFaculty = asyncHandler(async (req, res) => {
  if (req.query.permanent === 'true') {
    const deleted = await Faculty.findByIdAndDelete(req.params.id);
    if (!deleted) return sendNotFound(res, `Faculty with id '${req.params.id}' not found.`);
    return sendSuccess(res, null, 'Faculty permanently deleted.');
  }

  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!faculty) return sendNotFound(res, `Faculty with id '${req.params.id}' not found.`);
  return sendSuccess(res, null, 'Faculty removed from public listing.');
});

module.exports = { getAllFaculties, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
