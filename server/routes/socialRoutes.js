const express = require('express');
const router = express.Router();
const {
  toggleLikeStory,
  toggleSaveStory,
  getSavedStories,
  getStoryComments,
  createComment,
  deleteComment,
  checkUserStoryInteractions,
} = require('../controllers/socialController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Story like & save endpoints
router.post('/stories/:id/like', protect, toggleLikeStory);
router.post('/stories/:id/save', protect, toggleSaveStory);
router.get('/stories/:id/interactions', optionalAuth, checkUserStoryInteractions);

// Comments endpoints
router
  .route('/stories/:id/comments')
  .get(optionalAuth, getStoryComments)
  .post(protect, createComment);

router.delete('/comments/:id', protect, deleteComment);

// User saved stories
router.get('/users/saved-stories', protect, getSavedStories);

module.exports = router;
