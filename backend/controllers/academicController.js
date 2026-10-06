const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Academic = require('../models/Academic');

/** GET /api/academics — Get academic program info (Public: single object; Admin: array when ?all=true or ?list=true) */
const getAcademic = asyncHandler(async (req, res) => {
  if (req.query.all === 'true' || req.query.list === 'true') {
    const list = await Academic.find().sort({ createdAt: -1 });
    return sendSuccess(res, list, `${list.length} academic programs retrieved.`);
  }

  let academic = await Academic.findOne({ isPublished: true });
  if (!academic) {
    academic = await Academic.findOne();
  }
  if (!academic) {
    return sendSuccess(res, null, 'No academic program data found.');
  }
  return sendSuccess(res, academic, 'Academic data retrieved.');
});

/** GET /api/academics/:id — Get academic document by ID */
const getAcademicById = asyncHandler(async (req, res) => {
  const academic = await Academic.findById(req.params.id);
  if (!academic) {
    return sendNotFound(res, `Academic record with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, academic, 'Academic record retrieved.');
});

/** POST /api/academics — Create academic details (Admin only) */
const createAcademic = asyncHandler(async (req, res) => {
  const academic = await Academic.create(req.body);
  return sendCreated(res, academic, 'Academic details created successfully.');
});

/** PUT /api/academics/:id — Update academic details (Admin only) */
const updateAcademic = asyncHandler(async (req, res) => {
  const academic = await Academic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!academic) {
    return sendNotFound(res, `Academic record with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, academic, 'Academic details updated successfully.');
});

/** DELETE /api/academics/:id — Delete academic details (Admin only) */
const deleteAcademic = asyncHandler(async (req, res) => {
  const academic = await Academic.findByIdAndDelete(req.params.id);
  if (!academic) {
    return sendNotFound(res, `Academic record with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, null, 'Academic record deleted successfully.');
});

module.exports = {
  getAcademic,
  getAcademicById,
  createAcademic,
  updateAcademic,
  deleteAcademic,
};
