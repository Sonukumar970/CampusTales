const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for this college milestone'],
      trim: true,
      maxlength: [100, 'Milestone title cannot exceed 100 characters'],
    },
    academicYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Alumni'],
      default: '1st Year',
    },
    semester: {
      type: String,
      default: 'Sem 1',
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    milestoneType: {
      type: String,
      enum: [
        'Orientation 🎓',
        'Exams & Sems 📚',
        'College Fest 🎸',
        'Hostel Life 🏢',
        'Road Trip ✈️',
        'Placements 💼',
        'Farewell 🌅',
        'Other ✨',
      ],
      default: 'Other ✨',
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    linkedStory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for chronological timeline retrieval
memorySchema.index({ user: 1, eventDate: 1 });

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
