const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate likes per user per story
likeSchema.index({ user: 1, story: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
