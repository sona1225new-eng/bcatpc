const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} = require('../utils/apiResponse');
const Event = require('../models/Event');

/** GET /api/events — List events (Public) */
const getAllEvents = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};

  // For non-admin public requests, usually only published
  if (req.query.all !== 'true') {
    filter.isPublished = true;
  }

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const events = await Event.find(filter).sort({ date: -1 });
  return sendSuccess(res, events, `${events.length} events retrieved.`);
});

/** GET /api/events/:id — Get a single event by ID (Public) */
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return sendNotFound(res, `Event with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, event, 'Event retrieved.');
});

/** POST /api/events — Create a new event (Admin only) */
const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  return sendCreated(res, event, 'Event created successfully.');
});

/** PUT /api/events/:id — Update an event (Admin only) */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!event) {
    return sendNotFound(res, `Event with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, event, 'Event updated successfully.');
});

/** DELETE /api/events/:id — Delete an event (Admin only) */
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return sendNotFound(res, `Event with id '${req.params.id}' not found.`);
  }
  return sendSuccess(res, null, 'Event deleted successfully.');
});

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
