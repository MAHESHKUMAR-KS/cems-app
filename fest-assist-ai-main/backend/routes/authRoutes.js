const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  getAllUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
