const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Story author is required'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a story title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description or hook'],
      trim: true,
      maxlength: [350, 'Description cannot exceed 350 characters'],
    },
    content: {
      type: String,
      required: [true, 'Story content cannot be empty'],
    },
    category: {
      type: String,
      required: [true, 'Please select a story category'],
      enum: {
        values: [
          'Love',
          'Friendship',
          'Heartbreak',
          'Trips',
          'Funny',
          'Struggles',
          'Growth',
          'Memories',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    mood: {
      type: String,
      default: '😊 Nostalgic',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    images: [
      {
        type: String,
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    circle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circle',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize indexes for feed searching and category sorting
storySchema.index({ category: 1, createdAt: -1 });
storySchema.index({ likesCount: -1 });
storySchema.index({ circle: 1 });
storySchema.index({ title: 'text', description: 'text', content: 'text' });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
