const express = require('express');
const router = express.Router();
const {
  getCircles,
  getCircleBySlug,
  createCircle,
  toggleJoinCircle,
  getCircleStories,
  getMyCircles,
  deleteCircle,
} = require('../controllers/circleController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Get all circles (optional auth for isMember status) & Create new circle (protected)
router.route('/')
  .get(optionalAuth, getCircles)
  .post(protect, createCircle);

// Get circles joined by authenticated user
router.get('/my/joined', protect, getMyCircles);

// Get single circle by slug
router.get('/:slug', optionalAuth, getCircleBySlug);

// Toggle Join/Leave circle
router.post('/:id/join', protect, toggleJoinCircle);

// Delete circle (creator only)
router.delete('/:id', protect, deleteCircle);

// Get stories belonging to a circle
router.get('/:slug/stories', getCircleStories);

module.exports = router;
