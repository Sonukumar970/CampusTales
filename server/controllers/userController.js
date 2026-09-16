const User = require('../models/User');
const Story = require('../models/Story');
const Like = require('../models/Like');
const { calculateUserBadges } = require('../utils/badgeCalculator');

/**
 * @desc   Update authenticated user's profile
 * @route  PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { name, bio, college, course, batch, profileImage } = req.body;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (college) user.college = college.trim();
    if (course) user.course = course.trim();
    if (batch) user.batch = parseInt(batch, 10) || user.batch;
    if (profileImage !== undefined) user.profileImage = profileImage.trim();

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully! ✨',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get public profile of any student by ID
 * @route  GET /api/users/:id
 * @access Public (Optional Auth)
 */
const getUserPublicProfile = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    const user = await User.findById(targetUserId).select(
      'name college course batch bio profileImage role createdAt'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    // Fetch author's public published stories
    // Exclude anonymous stories to preserve privacy when someone views their public profile
    const stories = await Story.find({
      author: targetUserId,
      status: 'published',
      isAnonymous: false,
    })
      .sort({ createdAt: -1 })
      .populate('author', 'name college course batch profileImage')
      .populate('circle', 'name slug icon');

    // Calculate total appreciation (likes) across all public stories
    const totalLikesReceived = stories.reduce(
      (sum, story) => sum + (story.likesCount || 0),
      0
    );

    const currentUserId = req.user ? req.user._id : null;
    let likedStoryIds = new Set();
    let savedStoryIds = new Set();

    if (currentUserId && stories.length > 0) {
      const storyIds = stories.map((s) => s._id);
      const [likes, saves] = await Promise.all([
        Like.find({ user: currentUserId, story: { $in: storyIds } }).select('story'),
        require('../models/Save')
          .find({ user: currentUserId, story: { $in: storyIds } })
          .select('story'),
      ]);
      likedStoryIds = new Set(likes.map((l) => l.story.toString()));
      savedStoryIds = new Set(saves.map((s) => s.story.toString()));
    }

    const formattedStories = stories.map((s) => {
      const obj = s.toObject();
      obj.isLiked = likedStoryIds.has(s._id.toString());
      obj.isSaved = savedStoryIds.has(s._id.toString());
      obj.isOwner = currentUserId && currentUserId.toString() === targetUserId.toString();
      return obj;
    });

    // Compute student badges
    const badgeData = await calculateUserBadges(targetUserId);

    res.status(200).json({
      success: true,
      user,
      stats: {
        storiesCount: stories.length,
        totalLikesReceived,
        totalBadgesUnlocked: badgeData.totalUnlocked,
      },
      badges: badgeData.badges,
      stories: formattedStories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all stories liked by the authenticated user
 * @route  GET /api/users/liked-stories
 * @access Private
 */
const getUserLikedStories = async (req, res, next) => {
  try {
    const likes = await Like.find({ user: req.user._id })
      .populate({
        path: 'story',
        populate: {
          path: 'author',
          select: 'name college course batch profileImage',
        },
      })
      .sort({ createdAt: -1 });

    const Save = require('../models/Save');
    const validStories = likes
      .filter((l) => l.story !== null && l.story.status === 'published')
      .map((l) => l.story);

    const storyIds = validStories.map((s) => s._id);
    const userSaves = await Save.find({
      user: req.user._id,
      story: { $in: storyIds },
    }).select('story');
    const savedSet = new Set(userSaves.map((s) => s.story.toString()));

    const formatted = validStories.map((s) => {
      const obj = s.toObject();
      obj.isLiked = true;
      obj.isSaved = savedSet.has(s._id.toString());

      // Mask if anonymous and not owned by current user
      if (
        obj.isAnonymous &&
        (!obj.author || obj.author._id.toString() !== req.user._id.toString())
      ) {
        obj.author = {
          _id: null,
          name: 'Anonymous 🎭',
          college: obj.author?.college || 'Campus',
          profileImage:
            'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=6366f1',
        };
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      stories: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get gamified storytelling badges for any student by ID
 * @route  GET /api/users/:id/badges
 * @access Public
 */
const getUserBadges = async (req, res, next) => {
  try {
    let targetUserId = req.params.id;
    if ((targetUserId === 'me' || !targetUserId) && req.user) {
      targetUserId = req.user._id;
    }

    if (!targetUserId || targetUserId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID specified for badges.',
      });
    }

    const badgeData = await calculateUserBadges(targetUserId);
    res.status(200).json({
      success: true,
      ...badgeData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserProfile,
  getUserPublicProfile,
  getUserLikedStories,
  getUserBadges,
};
