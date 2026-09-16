const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema(
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

// Prevent duplicate saves per user per story
saveSchema.index({ user: 1, story: 1 }, { unique: true });

const Save = mongoose.model('Save', saveSchema);

module.exports = Save;
