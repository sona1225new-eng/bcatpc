const express = require('express');
const router = express.Router();
const {
  getPublicPages,
  getPublicPageBySlug,
  getAllPagesAdmin,
  getPageByIdAdmin,
  createPage,
  updatePage,
  togglePublishPage,
  deletePage,
} = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Admin collection routes
router.get('/admin/all', protect, requirePermission('pages', 'view'), getAllPagesAdmin);
router.get('/admin/:id', protect, validateObjectId('id'), requirePermission('pages', 'view'), getPageByIdAdmin);

// Public pages list
router.get('/', getPublicPages);

// Admin create page
router.post('/', protect, requirePermission('pages', 'create'), createPage);

// Admin update / delete / toggle publish
router.put('/:id', protect, validateObjectId('id'), requirePermission('pages', 'edit'), updatePage);
router.patch('/:id/publish', protect, validateObjectId('id'), requirePermission('pages', 'publish'), togglePublishPage);
router.delete('/:id', protect, validateObjectId('id'), requirePermission('pages', 'delete'), deletePage);

// Public dynamic slug route (must be last to avoid catching specific paths)
router.get('/:slug', getPublicPageBySlug);

module.exports = router;
