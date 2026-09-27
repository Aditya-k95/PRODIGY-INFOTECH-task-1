const UserModel = require('../models/userModel');

// @desc    Get dashboard metrics & summary data (Protected for all authenticated users)
// @route   GET /api/dashboard/summary
// @access  Protected
const getDashboardSummary = async (req, res) => {
  try {
    const stats = await UserModel.getStats();

    return res.status(200).json({
      success: true,
      message: 'Protected dashboard data retrieved successfully.',
      data: {
        serverTime: new Date().toISOString(),
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        },
        stats: {
          totalUsers: stats.totalUsers,
          activeSessions: 1, // Current active connection
          systemStatus: 'Operational',
          securityLevel: 'AES-256 / JWT-HS256'
        },
        protectedQuote: 'Security is not a product, but a process. — Bruce Schneier'
      }
    });
  } catch (error) {
    console.error('getDashboardSummary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data.'
    });
  }
};

// @desc    Get all users list (Protected for Admin role only)
// @route   GET /api/dashboard/admin/users
// @access  Protected (Admin only)
const getAdminUserList = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    const stats = await UserModel.getStats();

    return res.status(200).json({
      success: true,
      message: 'Admin user registry retrieved successfully.',
      users,
      stats
    });
  } catch (error) {
    console.error('getAdminUserList error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user registry.'
    });
  }
};

module.exports = {
  getDashboardSummary,
  getAdminUserList
};
