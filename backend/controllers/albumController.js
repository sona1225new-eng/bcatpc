const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Album = require('../models/Album');
const { recordAuditLog } = require('../utils/auditLogger');

const slugify = (text) => {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * GET /api/albums — Public: List all published albums
 */
const getPublicAlbums = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const query = { isPublished: true };
  if (category && category !== 'All') {
    query.category = category;
  }

  const albums = await Album.find(query)
    .sort({ order: 1, eventDate: -1, createdAt: -1 })
    .lean();

  const formatted = albums.map((album) => ({
    _id: album._id,
    title: album.title,
    slug: album.slug,
    description: album.description,
    coverImage: album.coverImage || (album.images[0] ? album.images[0].url : ''),
    eventDate: album.eventDate,
    category: album.category,
    order: album.order,
    imageCount: album.images.length,
    previewImages: album.images.slice(0, 4),
  }));

  return sendSuccess(res, formatted, `${formatted.length} albums retrieved.`);
});

/**
 * GET /api/albums/:slug — Public: Get a single album with images by slug
 */
const getPublicAlbumBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const album = await Album.findOne({ slug: slug.toLowerCase() });
  if (!album) {
    return sendNotFound(res, `Album '${slug}' not found.`);
  }

  if (!album.isPublished && !req.admin) {
    return sendNotFound(res, `Album '${slug}' is currently unpublished.`);
  }

  // Sort images by order
  album.images.sort((a, b) => (a.order || 0) - (b.order || 0));

  return sendSuccess(res, album, 'Album retrieved successfully.');
});

/**
 * GET /api/albums/admin/all — Admin: Paginated, searchable albums
 */
const getAllAlbumsAdmin = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 20 } = req.query;

  const query = {};

  if (search) {
    const cleanSearch = String(search).trim();
    query.$or = [
      { title: { $regex: cleanSearch, $options: 'i' } },
      { description: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (status !== undefined && status !== '' && status !== 'All') {
    if (status === 'published' || status === 'true') query.isPublished = true;
    if (status === 'draft' || status === 'false') query.isPublished = false;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [albums, total] = await Promise.all([
    Album.find(query)
      .sort({ order: 1, eventDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Album.countDocuments(query),
  ]);

  return sendSuccess(
    res,
    {
      albums,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
    `${total} albums found.`
  );
});

/**
 * GET /api/albums/admin/:id — Admin: Get album by ID
 */
const getAlbumByIdAdmin = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    return sendNotFound(res, `Album with ID '${req.params.id}' not found.`);
  }
  return sendSuccess(res, album, 'Album details retrieved.');
});

/**
 * POST /api/albums — Admin: Create a new album
 */
const createAlbum = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description = '',
    coverImage = '',
    eventDate,
    category = 'General',
    order = 0,
    isPublished = true,
    images = [],
  } = req.body;

  if (!title || !title.trim()) {
    return sendBadRequest(res, 'Album title is required.');
  }

  const targetSlug = slug ? slugify(slug) : slugify(title);
  if (!targetSlug) {
    return sendBadRequest(res, 'A valid album slug is required.');
  }

  const existing = await Album.findOne({ slug: targetSlug });
  if (existing) {
    return sendBadRequest(res, `An album with slug '${targetSlug}' already exists.`);
  }

  const initialCover =
    coverImage.trim() || (images.length > 0 && images[0].url ? images[0].url : '');

  const newAlbum = await Album.create({
    title: title.trim(),
    slug: targetSlug,
    description: description.trim(),
    coverImage: initialCover,
    eventDate: eventDate ? new Date(eventDate) : new Date(),
    category,
    order: Number(order) || 0,
    isPublished: Boolean(isPublished),
    images: Array.isArray(images) ? images : [],
    createdBy: req.admin?._id || null,
  });

  await recordAuditLog(req, {
    action: 'ALBUM_CREATE',
    module: 'gallery',
    targetId: newAlbum._id,
    targetTitle: newAlbum.title,
    details: { slug: newAlbum.slug, totalImages: newAlbum.images.length },
  });

  return sendCreated(res, newAlbum, `Album "${newAlbum.title}" created successfully.`);
});

/**
 * PUT /api/albums/:id — Admin: Update an album
 */
const updateAlbum = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    coverImage,
    eventDate,
    category,
    order,
    isPublished,
    images,
  } = req.body;

  const album = await Album.findById(req.params.id);
  if (!album) {
    return sendNotFound(res, `Album with ID '${req.params.id}' not found.`);
  }

  if (slug) {
    const formattedSlug = slugify(slug);
    if (formattedSlug !== album.slug) {
      const existing = await Album.findOne({ slug: formattedSlug });
      if (existing && existing._id.toString() !== album._id.toString()) {
        return sendBadRequest(
          res,
          `An album with slug '${formattedSlug}' already exists. Slugs must be unique.`
        );
      }
      album.slug = formattedSlug;
    }
  }

  if (title) album.title = title.trim();
  if (description !== undefined) album.description = description.trim();
  if (coverImage !== undefined) album.coverImage = coverImage.trim();
  if (eventDate !== undefined) album.eventDate = new Date(eventDate);
  if (category) album.category = category;
  if (order !== undefined) album.order = Number(order) || 0;
  if (isPublished !== undefined) album.isPublished = Boolean(isPublished);
  if (images !== undefined && Array.isArray(images)) album.images = images;

  // Auto-set cover image from first image if empty
  if (!album.coverImage && album.images.length > 0) {
    album.coverImage = album.images[0].url;
  }

  await album.save();

  await recordAuditLog(req, {
    action: 'ALBUM_UPDATE',
    module: 'gallery',
    targetId: album._id,
    targetTitle: album.title,
    details: { slug: album.slug, totalImages: album.images.length },
  });

  return sendSuccess(res, album, `Album "${album.title}" updated successfully.`);
});

/**
 * PATCH /api/albums/:id/publish — Admin: Toggle album publication status
 */
const togglePublishAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    return sendNotFound(res, `Album with ID '${req.params.id}' not found.`);
  }

  album.isPublished = !album.isPublished;
  await album.save();

  await recordAuditLog(req, {
    action: album.isPublished ? 'ALBUM_PUBLISH' : 'ALBUM_UNPUBLISH',
    module: 'gallery',
    targetId: album._id,
    targetTitle: album.title,
    details: { isPublished: album.isPublished },
  });

  return sendSuccess(
    res,
    album,
    `Album "${album.title}" is now ${album.isPublished ? 'Published' : 'Hidden'}.`
  );
});

/**
 * DELETE /api/albums/:id — Admin: Delete an album
 */
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  if (!album) {
    return sendNotFound(res, `Album with ID '${req.params.id}' not found.`);
  }

  await recordAuditLog(req, {
    action: 'ALBUM_DELETE',
    module: 'gallery',
    targetId: album._id,
    targetTitle: album.title,
    details: { slug: album.slug },
  });

  return sendSuccess(res, null, `Album "${album.title}" deleted successfully.`);
});

module.exports = {
  getPublicAlbums,
  getPublicAlbumBySlug,
  getAllAlbumsAdmin,
  getAlbumByIdAdmin,
  createAlbum,
  updateAlbum,
  togglePublishAlbum,
  deleteAlbum,
};
