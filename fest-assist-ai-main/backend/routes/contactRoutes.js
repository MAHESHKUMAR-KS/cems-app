const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');


router.post('/', submitContact);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.get('/stats', protect, authorize('admin'), getContactStats);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id', protect, authorize('admin'), updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
