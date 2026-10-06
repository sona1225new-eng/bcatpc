const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/apiResponse');
const Blog = require('../models/Blog');

const PUBLISHED = { status: 'published' };

/** GET /api/blogs — List blogs (Public: published only; Admin: supports ?all=true, ?status=, ?search=) */
const getAllBlogs = asyncHandler(async (req, res) => {
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
      { author: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }

  const limit = parseInt(req.query.limit) || 0;
  const blogs = await Blog.find(filter).sort({ createdAt: -1 }).limit(limit);
  return sendSuccess(res, blogs, `${blogs.length} blogs retrieved.`);
});

/** GET /api/blogs/:id — Public: get a blog by ObjectId or slug */
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Try by ObjectId first, then fall back to slug
  const blog = await Blog.findById(id).catch(async () => Blog.findOne({ slug: id }));
  if (!blog) return sendNotFound(res, `Blog '${id}' not found.`);

  // Increment view counter
  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
  return sendSuccess(res, blog, 'Blog retrieved.');
});

/** POST /api/blogs — Admin: create a blog */
const createBlog = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const blog = await Blog.create(req.body);
  return sendCreated(res, blog, 'Blog created successfully.');
});

/** PUT /api/blogs/:id — Admin: update a blog */
const updateBlog = asyncHandler(async (req, res) => {
  if (req.body.status === 'published' && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!blog) return sendNotFound(res, `Blog with id '${req.params.id}' not found.`);
  return sendSuccess(res, blog, 'Blog updated successfully.');
});

/** DELETE /api/blogs/:id — Admin: hard delete */
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return sendNotFound(res, `Blog with id '${req.params.id}' not found.`);
  return sendSuccess(res, null, 'Blog deleted successfully.');
});

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
