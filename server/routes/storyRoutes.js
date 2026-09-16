const express = require('express');
const router = express.Router();
const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  getPopularColleges,
} = require('../controllers/storyController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(optionalAuth, getStories)
  .post(protect, createStory);

// Popular colleges aggregation endpoint (Must be placed before /:id)
router.get('/colleges', getPopularColleges);

router
  .route('/:id')
  .get(optionalAuth, getStoryById)
  .put(protect, updateStory)
  .delete(protect, deleteStory);

module.exports = router;
