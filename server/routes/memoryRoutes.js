const express = require('express');
const router = express.Router();
const {
  createMemory,
  getMyTimeline,
  getUserTimeline,
  updateMemory,
  deleteMemory,
} = require('../controllers/memoryController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Timeline endpoints
router.route('/').post(protect, createMemory);
router.route('/timeline').get(protect, getMyTimeline);
router.route('/user/:userId').get(optionalAuth, getUserTimeline);

router
  .route('/:id')
  .put(protect, updateMemory)
  .delete(protect, deleteMemory);

module.exports = router;
