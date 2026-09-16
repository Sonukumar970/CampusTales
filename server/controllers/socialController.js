const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Save = require('../models/Save');
const Story = require('../models/Story');

/**
 * @desc   Toggle Like on a story (Like / Unlike)
 * @route  POST /api/stories/:id/like
 * @access Private
 */
const toggleLikeStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const existingLike = await Like.findOne({ user: userId, story: storyId });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      story.likesCount = Math.max(0, (story.likesCount || 1) - 1);
      await story.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: story.likesCount,
        message: 'Like removed.',
      });
    } else {
      // Like
      await Like.create({ user: userId, story: storyId });
      story.likesCount = (story.likesCount || 0) + 1;
      await story.save();

      return res.status(200).json({
        success: true,
        liked: true,
        likesCount: story.likesCount,
        message: 'Story liked! ❤️',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Toggle Bookmark / Save on a story
 * @route  POST /api/stories/:id/save
 * @access Private
 */
const toggleSaveStory = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const existingSave = await Save.findOne({ user: userId, story: storyId });

    if (existingSave) {
      // Unsave
      await Save.deleteOne({ _id: existingSave._id });
      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Story removed from bookmarks.',
      });
    } else {
      // Save
      await Save.create({ user: userId, story: storyId });
      return res.status(200).json({
        success: true,
        saved: true,
        message: 'Story saved to your profile! 🔖',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all saved stories of current user
 * @route  GET /api/users/saved-stories
 * @access Private
 */
const getSavedStories = async (req, res, next) => {
  try {
    const saves = await Save.find({ user: req.user._id })
      .populate({
        path: 'story',
        populate: { path: 'author', select: 'name college course batch profileImage' },
      })
      .sort({ createdAt: -1 });

    const validStories = saves
      .filter((s) => s.story !== null)
      .map((s) => {
        const storyObj = s.story.toObject();
        storyObj.isSaved = true;
        if (
          storyObj.isAnonymous &&
          (!storyObj.author ||
            storyObj.author._id.toString() !== req.user._id.toString())
        ) {
          storyObj.author = {
            _id: null,
            name: 'Anonymous 🎭',
            college: storyObj.author?.college || 'Campus',
            profileImage:
              'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=6366f1',
          };
        }
        return storyObj;
      });

    res.status(200).json({
      success: true,
      count: validStories.length,
      stories: validStories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get comments for a story
 * @route  GET /api/stories/:id/comments
 * @access Public (Optional Auth)
 */
const getStoryComments = async (req, res, next) => {
  try {
    const storyId = req.params.id;

    const comments = await Comment.find({ story: storyId })
      .populate('author', 'name college course batch profileImage')
      .sort({ createdAt: -1 });

    const currentUserId = req.user ? req.user._id.toString() : null;

    const formatted = comments.map((c) => {
      const obj = c.toObject();
      obj.isOwner = currentUserId && c.author && c.author._id.toString() === currentUserId;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      comments: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Post a comment on a story
 * @route  POST /api/stories/:id/comments
 * @access Private
 */
const createComment = async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty.',
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const comment = await Comment.create({
      story: storyId,
      author: req.user._id,
      content: content.trim(),
    });

    // Increment story comments count
    story.commentsCount = (story.commentsCount || 0) + 1;
    await story.save();

    await comment.populate('author', 'name college course batch profileImage');

    const commentObj = comment.toObject();
    commentObj.isOwner = true;

    res.status(201).json({
      success: true,
      message: 'Comment posted! 💬',
      comment: commentObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a comment
 * @route  DELETE /api/comments/:id
 * @access Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    const isOwner =
      comment.author.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own comments.',
      });
    }

    const storyId = comment.story;
    await Comment.findByIdAndDelete(req.params.id);

    // Decrement story comments count
    const story = await Story.findById(storyId);
    if (story) {
      story.commentsCount = Math.max(0, (story.commentsCount || 1) - 1);
      await story.save();
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Check if current user has liked and/or saved story
 * @route  GET /api/stories/:id/interactions
 * @access Public (Optional Auth)
 */
const checkUserStoryInteractions = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        liked: false,
        saved: false,
      });
    }

    const storyId = req.params.id;
    const userId = req.user._id;

    const [liked, saved] = await Promise.all([
      Like.exists({ user: userId, story: storyId }),
      Save.exists({ user: userId, story: storyId }),
    ]);

    res.status(200).json({
      success: true,
      liked: Boolean(liked),
      saved: Boolean(saved),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleLikeStory,
  toggleSaveStory,
  getSavedStories,
  getStoryComments,
  createComment,
  deleteComment,
  checkUserStoryInteractions,
};
