const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a circle name'],
      trim: true,
      unique: true,
      maxlength: [60, 'Circle name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description for this community'],
      trim: true,
      maxlength: [400, 'Description cannot exceed 400 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a circle category'],
      enum: [
        'Hostel 🏢',
        'Tech & Coding 💻',
        'Arts & Lit 🎭',
        'Sports & Fitness ⚽',
        'Music & Jam 🎸',
        'Canteen & Chill ☕',
        'Placements & Career 💼',
        'General 🌟',
      ],
      default: 'General 🌟',
    },
    college: {
      type: String,
      default: 'All Campuses',
      trim: true,
    },
    icon: {
      type: String,
      default: '🌟',
      trim: true,
    },
    coverGradient: {
      type: String,
      default: 'from-indigo-600/30 via-purple-600/20 to-pink-600/20',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    storyCount: {
      type: Number,
      default: 0,
      min: 0,
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

circleSchema.index({ slug: 1 });
circleSchema.index({ category: 1 });
circleSchema.index({ college: 1 });
circleSchema.index({ name: 'text', description: 'text' });

const Circle = mongoose.model('Circle', circleSchema);

module.exports = Circle;
