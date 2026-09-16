const Story = require('../models/Story');
const Like = require('../models/Like');
const Save = require('../models/Save');
const User = require('../models/User');
const Circle = require('../models/Circle');

// Helper to mask author identity for anonymous stories
const formatStoryForResponse = (story, currentUserId) => {
  const isOwner =
    Boolean(currentUserId) &&
    story.author &&
    (story.author._id
      ? story.author._id.toString() === currentUserId.toString()
      : story.author.toString() === currentUserId.toString());

  const storyObj = story.toObject ? story.toObject() : { ...story };

  if (storyObj.isAnonymous && !isOwner) {
    storyObj.author = {
      _id: null,
      name: 'Anonymous 🎭',
      college: storyObj.author?.college || 'Campus',
      profileImage:
        'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=6366f1',
    };
  }

  storyObj.isOwner = isOwner;
  return storyObj;
};

/**
 * @desc   Create a new story
 * @route  POST /api/stories
 * @access Private
 */
const createStory = async (req, res, next) => {
  try {
    const {
      title,
      description,
      content,
      category,
      mood,
      location,
      eventDate,
      images,
      isAnonymous,
      status,
      circle,
    } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, content, and category.',
      });
    }

    // Capitalize first letter of category to match enum
    const normalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    let circleId = null;
    if (circle) {
      const circleDoc = await Circle.findById(circle);
      if (circleDoc) {
        circleId = circleDoc._id;
      }
    }

    const story = await Story.create({
      author: req.user._id,
      title: title.trim(),
      description: description.trim(),
      content,
      category: normalizedCategory,
      mood: mood || '😊 Nostalgic',
      location: location ? location.trim() : '',
      eventDate: eventDate || Date.now(),
      images: Array.isArray(images) ? images : [],
      isAnonymous: Boolean(isAnonymous),
      status: status || 'published',
      circle: circleId,
    });

    if (circleId && story.status === 'published') {
      await Circle.findByIdAndUpdate(circleId, { $inc: { storyCount: 1 } });
    }

    await story.populate('author', 'name college course batch profileImage');
    if (circleId) {
      await story.populate('circle', 'name slug icon category');
    }

    res.status(201).json({
      success: true,
      message: 'Story created successfully! 📖',
      story: formatStoryForResponse(story, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all stories with filters, search, sort, and pagination
 * @route  GET /api/stories
 * @access Public (Optional auth token)
 */
const getStories = async (req, res, next) => {
  try {
    const {
      category,
      search,
      author,
      mood,
      college,
      batch,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      query.category = formattedCategory;
    }

    // Filter by mood
    if (mood && mood.toLowerCase() !== 'all') {
      query.mood = { $regex: mood.trim(), $options: 'i' };
    }

    // Filter by author (e.g. for user profile)
    if (author) {
      query.author = author;
    }

    // Filter by author's College and/or Graduation Batch
    if (
      (college && college.trim() && college.toLowerCase() !== 'all') ||
      (batch && batch.toString().toLowerCase() !== 'all')
    ) {
      const userFilter = {};
      if (college && college.trim() && college.toLowerCase() !== 'all') {
        userFilter.college = { $regex: college.trim(), $options: 'i' };
      }
      if (batch && batch.toString().toLowerCase() !== 'all') {
        userFilter.batch = parseInt(batch, 10);
      }

      const matchingUsers = await User.find(userFilter).select('_id');
      const userIds = matchingUsers.map((u) => u._id);

      if (query.author) {
        query.author = {
          $in: userIds.filter((id) => id.toString() === query.author.toString()),
        };
      } else {
        query.author = { $in: userIds };
      }
    }

    // Default to published stories only, unless author specifically queries own drafts
    const isRequestingOwnStories =
      author && req.user && req.user._id.toString() === author.toString();

    if (!isRequestingOwnStories) {
      query.status = 'published';
    }

    // Search in title, description, content, or location
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { likesCount: -1, createdAt: -1 };
    } else if (sort === 'trending') {
      sortOptions = { likesCount: -1, commentsCount: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalStories = await Story.countDocuments(query);

    const stories = await Story.find(query)
      .populate('author', 'name college course batch profileImage')
      .populate('circle', 'name slug icon category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const currentUserId = req.user ? req.user._id : null;

    let likedStoryIds = new Set();
    let savedStoryIds = new Set();

    if (currentUserId && stories.length > 0) {
      const storyIds = stories.map((s) => s._id);
      const [likes, saves] = await Promise.all([
        Like.find({ user: currentUserId, story: { $in: storyIds } }).select('story'),
        Save.find({ user: currentUserId, story: { $in: storyIds } }).select('story'),
      ]);
      likedStoryIds = new Set(likes.map((l) => l.story.toString()));
      savedStoryIds = new Set(saves.map((s) => s.story.toString()));
    }

    const formattedStories = stories.map((s) => {
      const formatted = formatStoryForResponse(s, currentUserId);
      formatted.isLiked = likedStoryIds.has(s._id.toString());
      formatted.isSaved = savedStoryIds.has(s._id.toString());
      return formatted;
    });

    res.status(200).json({
      success: true,
      count: formattedStories.length,
      total: totalStories,
      page: pageNum,
      pages: Math.ceil(totalStories / limitNum),
      stories: formattedStories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single story by ID
 * @route  GET /api/stories/:id
 * @access Public (Optional auth token)
 */
const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'name college course batch bio profileImage')
      .populate('circle', 'name slug icon category');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found.',
      });
    }

    const currentUserId = req.user ? req.user._id : null;

    // If draft, only author can view it
    if (
      story.status === 'draft' &&
      (!currentUserId || story.author._id.toString() !== currentUserId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'This story draft is private.',
      });
    }

    let isLiked = false;
    let isSaved = false;

    if (currentUserId) {
      const [likeDoc, saveDoc] = await Promise.all([
        Like.exists({ user: currentUserId, story: story._id }),
        Save.exists({ user: currentUserId, story: story._id }),
      ]);
      isLiked = Boolean(likeDoc);
      isSaved = Boolean(saveDoc);
    }

    const formattedStory = formatStoryForResponse(story, currentUserId);
    formattedStory.isLiked = isLiked;
    formattedStory.isSaved = isSaved;

    res.status(200).json({
      success: true,
      story: formattedStory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update story
 * @route  PUT /api/stories/:id
 * @access Private (Owner only)
 */
const updateStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found.',
      });
    }

    // Check ownership
    const isOwner =
      story.author.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own stories.',
      });
    }

    const {
      title,
      description,
      content,
      category,
      mood,
      location,
      eventDate,
      images,
      isAnonymous,
      status,
    } = req.body;

    if (title) story.title = title.trim();
    if (description) story.description = description.trim();
    if (content) story.content = content;
    if (category) {
      story.category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    if (mood !== undefined) story.mood = mood;
    if (location !== undefined) story.location = location.trim();
    if (eventDate) story.eventDate = eventDate;
    if (images && Array.isArray(images)) story.images = images;
    if (isAnonymous !== undefined) story.isAnonymous = Boolean(isAnonymous);
    if (status) story.status = status;

    await story.save();
    await story.populate('author', 'name college course batch profileImage');

    res.status(200).json({
      success: true,
      message: 'Story updated successfully!',
      story: formatStoryForResponse(story, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete story
 * @route  DELETE /api/stories/:id
 * @access Private (Owner or Admin)
 */
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found.',
      });
    }

    // Check ownership
    const isOwner =
      story.author.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own stories.',
      });
    }

    if (story.circle && story.status === 'published') {
      await Circle.findByIdAndUpdate(story.circle, { $inc: { storyCount: -1 } });
    }

    await Story.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get top colleges with story counts
 * @route  GET /api/stories/colleges
 * @access Public
 */
const getPopularColleges = async (req, res, next) => {
  try {
    const colleges = await Story.aggregate([
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDoc',
        },
      },
      { $unwind: '$authorDoc' },
      {
        $group: {
          _id: '$authorDoc.college',
          storiesCount: { $sum: 1 },
        },
      },
      { $sort: { storiesCount: -1 } },
      { $limit: 12 },
    ]);

    const formatted = colleges
      .filter((c) => Boolean(c._id && c._id.trim()))
      .map((c) => ({
        college: c._id,
        count: c.storiesCount,
      }));

    res.status(200).json({
      success: true,
      colleges: formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  getPopularColleges,
};
