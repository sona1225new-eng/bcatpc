const express = require('express');
const router = express.Router();
const {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllGallery)
  .post(protect, requirePermission('gallery', 'create'), createGalleryItem);

router.route('/:id')
  .get(validateObjectId('id'), getGalleryById)
  .put(protect, requirePermission('gallery', 'edit'), validateObjectId('id'), updateGalleryItem)
  .delete(protect, requirePermission('gallery', 'delete'), validateObjectId('id'), deleteGalleryItem);

module.exports = router;
