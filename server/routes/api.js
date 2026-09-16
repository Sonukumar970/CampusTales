const express = require('express');
const router = express.Router();

// Mount individual feature routes
router.use('/', require('./healthRoutes'));
router.use('/auth', require('./authRoutes'));

router.use('/stories', require('./storyRoutes'));
router.use('/', require('./socialRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/memories', require('./memoryRoutes'));
router.use('/circles', require('./circleRoutes'));

module.exports = router;
