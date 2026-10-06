const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  logoutAdmin,
  getMe,
  changePassword,
  registerAdmin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/register', protect, authorize('superadmin'), registerAdmin);

module.exports = router;
