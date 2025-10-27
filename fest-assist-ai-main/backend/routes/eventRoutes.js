const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Private routes - Create event (Event Member or Admin)
router.post('/', protect, authorize('event-member', 'admin'), createEvent);

// Private routes - Update event (Owner or Admin)
router.put('/:id', protect, authorize('event-member', 'admin'), updateEvent);

// Private routes - Delete event (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteEvent);

// Private routes - Register/Unregister (Students)
router.post('/:id/register', protect, authorize('student'), registerForEvent);
router.post('/:id/unregister', protect, authorize('student'), unregisterFromEvent);

module.exports = router;
