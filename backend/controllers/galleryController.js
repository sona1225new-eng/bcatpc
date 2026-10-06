const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Gallery = require('../models/Gallery');

/** GET /api/galleries — List gallery items (Public) */
const getAllGallery = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (req.query.all !== 'true') {
    filter.isPublished = true;
  }

  if (category) filter.category = category;
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const items = await Gallery.find(filter).sort({ order: 1, date: -1 });
  return sendSuccess(res, items, `${items.length} gallery items retrieved.`);
});

/** GET /api/galleries/:id — Get a single gallery item by ID */
const getGalleryById = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) {
    return sendNotFound(res, `Gallery item with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, item, 'Gallery item retrieved.');
});

/** POST /api/galleries — Create gallery item (Admin only) */
const createGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.create(req.body);
  return sendCreated(res, item, 'Gallery item created successfully.');
});

/** PUT /api/galleries/:id — Update gallery item (Admin only) */
const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) {
    return sendNotFound(res, `Gallery item with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, item, 'Gallery item updated successfully.');
});

/** DELETE /api/galleries/:id — Delete gallery item (Admin only) */
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    return sendNotFound(res, `Gallery item with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, null, 'Gallery item deleted successfully.');
});

module.exports = {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
