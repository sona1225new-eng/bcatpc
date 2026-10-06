const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/apiResponse');
const Notice = require('../models/Notice');

const PUBLISHED = { status: 'published' };

/** GET /api/notices — List notices (Public: published only; Admin: supports ?all=true, ?status=, ?search=) */
const getAllNotices = asyncHandler(async (req, res) => {
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
      { description: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tag: { $regex: q, $options: 'i' } },
      { referenceNo: { $regex: q, $options: 'i' } },
    ];
  }

  const limit = parseInt(req.query.limit) || 0;
  const notices = await Notice.find(filter).sort({ date: -1, createdAt: -1 }).limit(limit);
  return sendSuccess(res, notices, `${notices.length} notices retrieved.`);
});

/** GET /api/notices/:id — Public: get a single published notice */
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return sendNotFound(res, `Notice with id '${req.params.id}' not found.`);
  return sendSuccess(res, notice, 'Notice retrieved.');
});

/** POST /api/notices — Admin: create a notice */
const createNotice = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const notice = await Notice.create(req.body);
  return sendCreated(res, notice, 'Notice created successfully.');
});

/** PUT /api/notices/:id — Admin: update a notice */
const updateNotice = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!notice) return sendNotFound(res, `Notice with id '${req.params.id}' not found.`);
  return sendSuccess(res, notice, 'Notice updated successfully.');
});

/** DELETE /api/notices/:id — Admin: hard delete */
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) return sendNotFound(res, `Notice with id '${req.params.id}' not found.`);
  return sendSuccess(res, null, 'Notice deleted successfully.');
});

module.exports = { getAllNotices, getNoticeById, createNotice, updateNotice, deleteNotice };
