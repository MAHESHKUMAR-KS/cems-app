const mongoose = require('mongoose');

/**
 * Event Schema
 * Stores college event information
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify event category'],
      enum: ['technical', 'cultural', 'sports', 'workshop'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'Please provide college name'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Please provide organizer name'],
      trim: true,
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, 'Capacity must be at least 1'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registeredUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        // Additional registration details
        phone: {
          type: String,
          default: '',
        },
        college: {
          type: String,
          default: '',
        },
        yearOfStudy: {
          type: String,
          default: '',
        },
        department: {
          type: String,
          default: '',
        },
        specialRequirements: {
          type: String,
          default: '',
        },
      },
    ],
    registrationCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// Update registration count before saving
eventSchema.pre('save', function (next) {
  this.registrationCount = this.registeredUsers.length;
  next();
});

module.exports = mongoose.model('Event', eventSchema);
