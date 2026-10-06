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
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllGallery)
  .post(protect, createGalleryItem);

router.route('/:id')
  .get(validateObjectId('id'), getGalleryById)
  .put(protect, validateObjectId('id'), updateGalleryItem)
  .delete(protect, validateObjectId('id'), deleteGalleryItem);

module.exports = router;
