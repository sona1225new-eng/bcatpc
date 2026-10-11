const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Page = require('../models/Page');
const { cleanHtml } = require('../utils/sanitizeHtml');
const { recordAuditLog } = require('../utils/auditLogger');

/** Helper to generate a URL-friendly slug */
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
 * GET /api/pages — Public: List all published pages
 */
const getPublicPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({ status: 'published' })
    .select('title slug description featuredImage publishedAt createdAt')
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return sendSuccess(res, pages, `${pages.length} published dynamic pages retrieved.`);
});

/**
 * GET /api/pages/:slug — Public: Get a single published page by its slug
 */
const getPublicPageBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const page = await Page.findOne({ slug: slug.toLowerCase() });

  if (!page) {
    return sendNotFound(res, `Page '/pages/${slug}' not found.`);
  }

  // If the page is in draft status, only permit access if an authenticated admin is requesting it
  if (page.status !== 'published') {
    if (!req.admin) {
      return sendNotFound(res, `Page '/pages/${slug}' is not published or access is restricted.`);
    }
  }

  return sendSuccess(res, page, 'Page content retrieved successfully.');
});

/**
 * GET /api/pages/admin/all — Admin: Paginated, searchable list of all pages
 */
const getAllPagesAdmin = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    const cleanSearch = String(search).trim();
    query.$or = [
      { title: { $regex: cleanSearch, $options: 'i' } },
      { slug: { $regex: cleanSearch, $options: 'i' } },
      { description: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  if (status && ['draft', 'published'].includes(status)) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [pages, total] = await Promise.all([
    Page.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Page.countDocuments(query),
  ]);

  return sendSuccess(
    res,
    {
      pages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
    `${total} pages found.`
  );
});

/**
 * GET /api/pages/admin/:id — Admin: Get page details by ID
 */
const getPageByIdAdmin = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) {
    return sendNotFound(res, `Page with ID '${req.params.id}' not found.`);
  }
  return sendSuccess(res, page, 'Page details retrieved.');
});

/**
 * POST /api/pages — Admin: Create a new custom page
 */
const createPage = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    content = '',
    description = '',
    featuredImage = '',
    seoTitle = '',
    seoDescription = '',
    keywords = [],
    status = 'draft',
  } = req.body;

  if (!title || !title.trim()) {
    return sendBadRequest(res, 'Page title is required.');
  }

  const targetSlug = slug ? slugify(slug) : slugify(title);
  if (!targetSlug) {
    return sendBadRequest(res, 'Unable to generate a valid slug from the title.');
  }

  // Prevent duplicate slug
  const existing = await Page.findOne({ slug: targetSlug });
  if (existing) {
    return sendBadRequest(
      res,
      `A page with slug '/pages/${targetSlug}' already exists. Please choose a unique slug.`
    );
  }

  const sanitizedContent = cleanHtml(content);

  const newPage = await Page.create({
    title: title.trim(),
    slug: targetSlug,
    content: sanitizedContent,
    description: description.trim(),
    featuredImage: featuredImage.trim(),
    seoTitle: (seoTitle || title).trim(),
    seoDescription: (seoDescription || description).trim(),
    keywords: Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [],
    status: status === 'published' ? 'published' : 'draft',
    author: req.admin?._id || null,
    authorName: req.admin?.name || 'Administrator',
    publishedAt: status === 'published' ? new Date() : null,
  });

  await recordAuditLog(req, {
    action: 'PAGE_CREATE',
    module: 'pages',
    targetId: newPage._id,
    targetTitle: newPage.title,
    details: { slug: newPage.slug, status: newPage.status },
  });

  return sendCreated(res, newPage, `Page "${newPage.title}" created successfully.`);
});

/**
 * PUT /api/pages/:id — Admin: Update a page
 */
const updatePage = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    content,
    description,
    featuredImage,
    seoTitle,
    seoDescription,
    keywords,
    status,
  } = req.body;

  const page = await Page.findById(req.params.id);
  if (!page) {
    return sendNotFound(res, `Page with ID '${req.params.id}' not found.`);
  }

  if (slug) {
    const formattedSlug = slugify(slug);
    if (formattedSlug !== page.slug) {
      const existing = await Page.findOne({ slug: formattedSlug });
      if (existing && existing._id.toString() !== page._id.toString()) {
        return sendBadRequest(
          res,
          `A page with slug '/pages/${formattedSlug}' already exists. Slugs must be unique.`
        );
      }
      page.slug = formattedSlug;
    }
  }

  if (title) page.title = title.trim();
  if (content !== undefined) page.content = cleanHtml(content);
  if (description !== undefined) page.description = description.trim();
  if (featuredImage !== undefined) page.featuredImage = featuredImage.trim();
  if (seoTitle !== undefined) page.seoTitle = seoTitle.trim();
  if (seoDescription !== undefined) page.seoDescription = seoDescription.trim();

  if (keywords !== undefined) {
    page.keywords = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];
  }

  if (status && ['draft', 'published'].includes(status)) {
    if (status === 'published' && page.status !== 'published') {
      page.publishedAt = new Date();
    }
    page.status = status;
  }

  await page.save();

  await recordAuditLog(req, {
    action: 'PAGE_UPDATE',
    module: 'pages',
    targetId: page._id,
    targetTitle: page.title,
    details: { slug: page.slug, status: page.status },
  });

  return sendSuccess(res, page, `Page "${page.title}" updated successfully.`);
});

/**
 * PATCH /api/pages/:id/publish — Admin: Toggle publish / unpublish
 */
const togglePublishPage = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);
  if (!page) {
    return sendNotFound(res, `Page with ID '${req.params.id}' not found.`);
  }

  const nextStatus = page.status === 'published' ? 'draft' : 'published';
  page.status = nextStatus;
  if (nextStatus === 'published' && !page.publishedAt) {
    page.publishedAt = new Date();
  }

  await page.save();

  await recordAuditLog(req, {
    action: nextStatus === 'published' ? 'PAGE_PUBLISH' : 'PAGE_UNPUBLISH',
    module: 'pages',
    targetId: page._id,
    targetTitle: page.title,
    details: { slug: page.slug, status: page.status },
  });

  return sendSuccess(
    res,
    page,
    `Page "${page.title}" is now ${nextStatus === 'published' ? 'Published' : 'in Draft mode'}.`
  );
});

/**
 * DELETE /api/pages/:id — Admin: Delete a page
 */
const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) {
    return sendNotFound(res, `Page with ID '${req.params.id}' not found.`);
  }

  await recordAuditLog(req, {
    action: 'PAGE_DELETE',
    module: 'pages',
    targetId: page._id,
    targetTitle: page.title,
    details: { slug: page.slug },
  });

  return sendSuccess(res, null, `Page "${page.title}" deleted successfully.`);
});

module.exports = {
  getPublicPages,
  getPublicPageBySlug,
  getAllPagesAdmin,
  getPageByIdAdmin,
  createPage,
  updatePage,
  togglePublishPage,
  deletePage,
};
