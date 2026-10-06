const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Coordinator = require('../models/Coordinator');

/** GET /api/coordinators — Get coordinator desk info (Public) */
const getCoordinator = asyncHandler(async (req, res) => {
  let coordinator = await Coordinator.findOne({ isPublished: true });
  if (!coordinator) {
    coordinator = await Coordinator.findOne();
  }
  if (!coordinator) {
    return sendSuccess(res, null, 'No coordinator data found.');
  }
  return sendSuccess(res, coordinator, 'Coordinator data retrieved.');
});

/** GET /api/coordinators/:id — Get coordinator by ID */
const getCoordinatorById = asyncHandler(async (req, res) => {
  const coordinator = await Coordinator.findById(req.params.id);
  if (!coordinator) {
    return sendNotFound(res, `Coordinator with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, coordinator, 'Coordinator retrieved.');
});

/** POST /api/coordinators — Create coordinator entry (Admin only) */
const createCoordinator = asyncHandler(async (req, res) => {
  const coordinator = await Coordinator.create(req.body);
  return sendCreated(res, coordinator, 'Coordinator record created successfully.');
});

/** PUT /api/coordinators/:id — Update coordinator entry (Admin only) */
const updateCoordinator = asyncHandler(async (req, res) => {
  const coordinator = await Coordinator.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!coordinator) {
    return sendNotFound(res, `Coordinator with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, coordinator, 'Coordinator record updated successfully.');
});

/** DELETE /api/coordinators/:id — Delete coordinator entry (Admin only) */
const deleteCoordinator = asyncHandler(async (req, res) => {
  const coordinator = await Coordinator.findByIdAndDelete(req.params.id);
  if (!coordinator) {
    return sendNotFound(res, `Coordinator with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, null, 'Coordinator record deleted successfully.');
});

module.exports = {
  getCoordinator,
  getCoordinatorById,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
};
