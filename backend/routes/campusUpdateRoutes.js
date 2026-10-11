const express = require('express');
const router = express.Router();
const {
  getAllCampusUpdates,
  getCampusUpdateById,
  createCampusUpdate,
  updateCampusUpdate,
  deleteCampusUpdate,
} = require('../controllers/campusUpdateController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllCampusUpdates)
  .post(protect, requirePermission('campusUpdates', 'create'), createCampusUpdate);

router.route('/:id')
  .get(validateObjectId('id'), getCampusUpdateById)
  .put(protect, requirePermission('campusUpdates', 'edit'), validateObjectId('id'), updateCampusUpdate)
  .delete(protect, requirePermission('campusUpdates', 'delete'), validateObjectId('id'), deleteCampusUpdate);

module.exports = router;
