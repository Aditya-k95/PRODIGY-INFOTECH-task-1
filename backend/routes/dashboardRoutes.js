const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getAdminUserList
} = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Protected route for any authenticated user
router.get('/summary', protect, getDashboardSummary);

// Protected route strictly for Admins (RBAC demonstration)
router.get('/admin/users', protect, requireRole('admin'), getAdminUserList);

module.exports = router;
