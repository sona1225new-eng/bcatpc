const express = require('express');
const router = express.Router();
const {
  getPublicAlbums,
  getPublicAlbumBySlug,
  getAllAlbumsAdmin,
  getAlbumByIdAdmin,
  createAlbum,
  updateAlbum,
  togglePublishAlbum,
  deleteAlbum,
} = require('../controllers/albumController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// Admin collection routes
router.get('/admin/all', protect, requirePermission('gallery', 'view'), getAllAlbumsAdmin);
router.get('/admin/:id', protect, validateObjectId('id'), requirePermission('gallery', 'view'), getAlbumByIdAdmin);

// Public albums list
router.get('/', getPublicAlbums);

// Admin actions
router.post('/', protect, requirePermission('gallery', 'create'), createAlbum);
router.put('/:id', protect, validateObjectId('id'), requirePermission('gallery', 'edit'), updateAlbum);
router.patch('/:id/publish', protect, validateObjectId('id'), requirePermission('gallery', 'publish'), togglePublishAlbum);
router.delete('/:id', protect, validateObjectId('id'), requirePermission('gallery', 'delete'), deleteAlbum);

// Public dynamic slug route
router.get('/:slug', getPublicAlbumBySlug);

module.exports = router;
