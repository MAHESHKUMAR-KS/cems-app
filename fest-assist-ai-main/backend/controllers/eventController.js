const Event = require('../models/Event');
const User = require('../models/User');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching events',
    });
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('registeredUsers.user', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event',
    });
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private (Event Member, Admin)
 */
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      college,
      organizer,
      capacity,
      image,
    } = req.body;

    // Validation
    if (!title || !description || !category || !date || !time || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      college: college || 'Unknown College',
      organizer: organizer || req.user.name,
      capacity: capacity || 100,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      createdBy: req.user._id,
    });

    // Add to user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdEvents: event._id },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating event',
    });
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (Owner or Admin)
 */
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating event',
    });
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin only)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Remove event from all registered users
    await User.updateMany(
      { registeredEvents: event._id },
      { $pull: { registeredEvents: event._id } }
    );

    // Remove from creator's created events
    await User.findByIdAndUpdate(event.createdBy, {
      $pull: { createdEvents: event._id },
    });

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting event',
    });
  }
};

/**
 * @desc    Register for an event
 * @route   POST /api/events/:id/register
 * @access  Private (Student)
 */
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredUsers.some(
      (registration) => registration.user.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Check capacity
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    // Add user to event
    event.registeredUsers.push({
      user: req.user._id,
      registeredAt: new Date(),
    });

    await event.save();

    // Add event to user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { registeredEvents: event._id },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering for event',
    });
  }
};

/**
 * @desc    Unregister from an event
 * @route   POST /api/events/:id/unregister
 * @access  Private (Student)
 */
const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if registered
    const registrationIndex = event.registeredUsers.findIndex(
      (registration) => registration.user.toString() === req.user._id.toString()
    );

    if (registrationIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event',
      });
    }

    // Remove user from event
    event.registeredUsers.splice(registrationIndex, 1);
    await event.save();

    // Remove event from user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredEvents: event._id },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
    });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error unregistering from event',
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
};
