const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Gallery = require('../models/Gallery');
const Album = require('../models/Album');

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

  const galleryItems = await Gallery.find(filter).sort({ order: 1, date: -1 });
  const albumItems = [];

  if (req.query.all !== 'true') {
    const albumFilter = { isPublished: true };
    if (category) albumFilter.category = category;

    const albums = await Album.find(albumFilter).lean();
    const searchPattern = search ? new RegExp(search, 'i') : null;

    for (const album of albums) {
      for (const image of album.images || []) {
        const item = {
          _id: image._id,
          id: image._id?.toString(),
          title: image.title || album.title,
          imageUrl: image.url,
          category: album.category,
          description: image.caption || image.altText || album.description || '',
          date: album.eventDate,
          order: image.order ?? album.order ?? 0,
          isPublished: true,
          albumId: album._id,
          albumTitle: album.title,
        };

        if (
          searchPattern &&
          !searchPattern.test(item.title) &&
          !searchPattern.test(item.description) &&
          !searchPattern.test(album.title)
        ) {
          continue;
        }
        albumItems.push(item);
      }
    }
  }

  const items = [...galleryItems, ...albumItems].sort(
    (a, b) => (a.order || 0) - (b.order || 0) ||
      new Date(b.date || 0) - new Date(a.date || 0)
  );
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
