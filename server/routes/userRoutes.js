const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  getUserPublicProfile,
  getUserLikedStories,
  getUserBadges,
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Update profile of logged in user
router.put('/profile', protect, updateUserProfile);

// Get liked stories of logged in user
router.get('/liked-stories', protect, getUserLikedStories);

// Get badges of authenticated user
router.get('/me/badges', protect, getUserBadges);

// Get badges of any student
router.get('/:id/badges', optionalAuth, getUserBadges);

// Get public profile of any student by ID
router.get('/:id', optionalAuth, getUserPublicProfile);

module.exports = router;
