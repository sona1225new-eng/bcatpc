const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllBlogs)
  .post(protect, requirePermission('blogs', 'create'), createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(protect, requirePermission('blogs', 'edit'), validateObjectId('id'), updateBlog)
  .delete(protect, requirePermission('blogs', 'delete'), validateObjectId('id'), deleteBlog);

module.exports = router;
