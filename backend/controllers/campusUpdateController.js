const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/apiResponse');
const CampusUpdate = require('../models/CampusUpdate');

const PUBLISHED = { status: 'published' };

/** GET /api/campus-updates — List updates (Public: published only; Admin: supports ?all=true, ?status=, ?search=) */
const getAllCampusUpdates = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  } else if (req.query.all !== 'true') {
    filter.status = 'published';
  }

  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    const q = req.query.search;
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { shortDescription: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ];
  }

  const limit = parseInt(req.query.limit) || 0;
  const updates = await CampusUpdate.find(filter).sort({ date: -1, createdAt: -1 }).limit(limit);
  return sendSuccess(res, updates, `${updates.length} campus updates retrieved.`);
});

/** GET /api/campus-updates/:id — Public */
const getCampusUpdateById = asyncHandler(async (req, res) => {
  const update = await CampusUpdate.findById(req.params.id);
  if (!update) return sendNotFound(res, `Campus update '${req.params.id}' not found.`);
  return sendSuccess(res, update, 'Campus update retrieved.');
});

/** POST /api/campus-updates — Admin */
const createCampusUpdate = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const update = await CampusUpdate.create(req.body);
  return sendCreated(res, update, 'Campus update created successfully.');
});

/** PUT /api/campus-updates/:id — Admin */
const updateCampusUpdate = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const update = await CampusUpdate.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!update) return sendNotFound(res, `Campus update '${req.params.id}' not found.`);
  return sendSuccess(res, update, 'Campus update updated successfully.');
});

/** DELETE /api/campus-updates/:id — Admin */
const deleteCampusUpdate = asyncHandler(async (req, res) => {
  const update = await CampusUpdate.findByIdAndDelete(req.params.id);
  if (!update) return sendNotFound(res, `Campus update '${req.params.id}' not found.`);
  return sendSuccess(res, null, 'Campus update deleted successfully.');
});

module.exports = {
  getAllCampusUpdates,
  getCampusUpdateById,
  createCampusUpdate,
  updateCampusUpdate,
  deleteCampusUpdate,
};
