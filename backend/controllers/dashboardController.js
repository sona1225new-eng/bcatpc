const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Faculty = require('../models/Faculty');
const PYQ = require('../models/PYQ');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');
const CampusUpdate = require('../models/CampusUpdate');
const Academic = require('../models/Academic');

/**
 * GET /api/dashboard/stats
 * Protected (Admin only)
 * Returns counts of notices, events, faculty, PYQs, gallery items, blogs, campus updates, academics,
 * along with recent entries for overview lists.
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    noticesCount,
    eventsCount,
    facultyCount,
    pyqsCount,
    galleryCount,
    blogsCount,
    campusUpdatesCount,
    academicsCount,
    recentNotices,
    recentBlogs,
    recentCampusUpdates,
    recentFaculty,
    recentPYQs,
  ] = await Promise.all([
    Notice.countDocuments(),
    Event.countDocuments(),
    Faculty.countDocuments(),
    PYQ.countDocuments(),
    Gallery.countDocuments(),
    Blog.countDocuments(),
    CampusUpdate.countDocuments(),
    Academic.countDocuments(),
    Notice.find().sort({ createdAt: -1 }).limit(5),
    Blog.find().sort({ createdAt: -1 }).limit(5),
    CampusUpdate.find().sort({ createdAt: -1 }).limit(5),
    Faculty.find().sort({ createdAt: -1 }).limit(5),
    PYQ.find().sort({ createdAt: -1 }).limit(5),
  ]);

  return sendSuccess(
    res,
    {
      counts: {
        notices: noticesCount,
        events: eventsCount,
        faculty: facultyCount,
        pyqs: pyqsCount,
        gallery: galleryCount,
        blogs: blogsCount,
        campusUpdates: campusUpdatesCount,
        academics: academicsCount,
      },
      // Keep legacy keys directly on object for backward compatibility
      notices: noticesCount,
      events: eventsCount,
      faculty: facultyCount,
      pyqs: pyqsCount,
      gallery: galleryCount,
      blogs: blogsCount,
      campusUpdates: campusUpdatesCount,
      academics: academicsCount,
      recent: {
        notices: recentNotices,
        blogs: recentBlogs,
        campusUpdates: recentCampusUpdates,
        faculty: recentFaculty,
        pyqs: recentPYQs,
      },
    },
    'Dashboard statistics retrieved successfully.'
  );
});

module.exports = { getDashboardStats };
