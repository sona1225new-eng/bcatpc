const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/apiResponse');
const Faculty = require('../models/Faculty');

const editableFields = [
  'name',
  'designation',
  'shortDesignation',
  'qualification',
  'specialization',
  'experience',
  'email',
  'phone',
  'photo',
  'resumeUrl',
  'resumeFileName',
  'bio',
  'teachingAreas',
  'academicInterests',
  'publications',
  'awards',
  'officeRoom',
  'officeHours',
  'order',
  'isActive',
];

const getFacultyPayload = (body, isCreate = false) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Faculty data must be an object.' };
  }

  const payload = {};
  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }

  if (isCreate && (typeof payload.name !== 'string' || !payload.name.trim())) {
    return { error: 'Faculty name is required.' };
  }
  if (payload.name !== undefined && (typeof payload.name !== 'string' || !payload.name.trim())) {
    return { error: 'Faculty name is required.' };
  }
  if (payload.resumeUrl !== undefined) {
    if (typeof payload.resumeUrl !== 'string') {
      return { error: 'Resume URL must be a string.' };
    }
    payload.resumeUrl = payload.resumeUrl.trim();
    if (payload.resumeUrl) {
      try {
        const url = new URL(payload.resumeUrl);
        if (
          url.protocol !== 'https:' ||
          !url.pathname.toLowerCase().endsWith('.pdf') ||
          ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
        ) {
          return { error: 'Resume URL must be a public HTTPS URL to a PDF file.' };
        }
      } catch {
        return { error: 'Resume URL must be a valid public HTTPS URL to a PDF file.' };
      }
    }
  }
  if (payload.resumeFileName !== undefined && typeof payload.resumeFileName !== 'string') {
    return { error: 'Resume filename must be a string.' };
  }
  if (payload.order !== undefined) {
    const order = Number(payload.order);
    if (!Number.isFinite(order)) return { error: 'Display order must be a valid number.' };
    payload.order = order;
  }
  if (payload.isActive !== undefined && typeof payload.isActive !== 'boolean') {
    return { error: 'Active status must be true or false.' };
  }
  for (const field of ['teachingAreas', 'academicInterests', 'publications', 'awards']) {
    if (payload[field] !== undefined && !Array.isArray(payload[field])) {
      return { error: `${field} must be an array.` };
    }
  }

  return { payload };
};

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
  const { id } = req.params;

  let faculty;

  if (mongoose.Types.ObjectId.isValid(id)) {
    faculty = await Faculty.findById(id);
  } else {
    faculty = await Faculty.findOne({ slug: id });
  }

  if (!faculty) {
    return sendNotFound(res, `Faculty with id or slug '${id}' not found.`);
  }

  return sendSuccess(res, faculty, 'Faculty retrieved.');
});

/** POST /api/faculties — Create a new faculty (Admin only) */
const createFaculty = asyncHandler(async (req, res) => {
  const { payload, error } = getFacultyPayload(req.body, true);
  if (error) return sendBadRequest(res, error);
  const faculty = await Faculty.create(payload);
  return sendCreated(res, faculty, 'Faculty created successfully.');
});

/** PUT /api/faculties/:id — Update a faculty (Admin only) */
const updateFaculty = asyncHandler(async (req, res) => {
  const { payload, error } = getFacultyPayload(req.body);
  if (error) return sendBadRequest(res, error);
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    payload,
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
