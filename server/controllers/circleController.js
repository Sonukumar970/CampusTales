const Circle = require('../models/Circle');
const Story = require('../models/Story');

// Helper to generate a slug from a circle name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @desc    Get all campus circles with optional filters
 * @route   GET /api/circles
 * @access  Public / Optional Auth
 */
exports.getCircles = async (req, res, next) => {
  try {
    const { category, college, search } = req.query;
    const filter = { isPublic: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (college && college !== 'All Campuses') {
      filter.$or = [{ college: new RegExp(college, 'i') }, { college: 'All Campuses' }];
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const circles = await Circle.find(filter)
      .populate('creator', 'name college profileImage')
      .sort({ storyCount: -1, createdAt: -1 });

    const currentUserId = req.user ? req.user._id.toString() : null;

    const formattedCircles = circles.map((circle) => {
      const cObj = circle.toObject();
      cObj.membersCount = circle.members ? circle.members.length : 0;
      cObj.isMember = currentUserId
        ? circle.members.some((m) => m.toString() === currentUserId)
        : false;
      return cObj;
    });

    res.status(200).json({
      success: true,
      count: formattedCircles.length,
      circles: formattedCircles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single circle by slug
 * @route   GET /api/circles/:slug
 * @access  Public / Optional Auth
 */
exports.getCircleBySlug = async (req, res, next) => {
  try {
    const circle = await Circle.findOne({ slug: req.params.slug.toLowerCase() })
      .populate('creator', 'name college profileImage')
      .populate('members', 'name profileImage college');

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'Campus circle not found.',
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const cObj = circle.toObject();
    cObj.membersCount = circle.members ? circle.members.length : 0;
    cObj.isMember = currentUserId
      ? circle.members.some((m) => m._id?.toString() === currentUserId || m.toString() === currentUserId)
      : false;

    res.status(200).json({
      success: true,
      circle: cObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new campus circle
 * @route   POST /api/circles
 * @access  Private (Students only)
 */
exports.createCircle = async (req, res, next) => {
  try {
    const { name, description, category, college, icon, coverGradient } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Circle name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Circle description is required.' });
    }

    let slug = createSlug(name);
    if (!slug) {
      slug = `circle-${Date.now()}`;
    }

    // Check if name or slug already exists
    const existing = await Circle.findOne({
      $or: [{ name: new RegExp(`^${name.trim()}$`, 'i') }, { slug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A campus circle with this name already exists. Please choose a unique name.',
      });
    }

    const circle = await Circle.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      category: category || 'General 🌟',
      college: college?.trim() || req.user.college || 'All Campuses',
      icon: icon || '🌟',
      coverGradient: coverGradient || 'from-indigo-600/30 via-purple-600/20 to-pink-600/20',
      creator: req.user._id,
      members: [req.user._id], // Creator is automatically first member
      storyCount: 0,
      isPublic: true,
    });

    const cObj = circle.toObject();
    cObj.membersCount = 1;
    cObj.isMember = true;

    res.status(201).json({
      success: true,
      message: `🎉 Created "${circle.name}" circle successfully!`,
      circle: cObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Join / Leave campus circle
 * @route   POST /api/circles/:id/join
 * @access  Private
 */
exports.toggleJoinCircle = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Campus circle not found.' });
    }

    const userId = req.user._id;
    const isAlreadyMember = circle.members.some((m) => m.toString() === userId.toString());

    if (isAlreadyMember) {
      // Leave circle
      circle.members = circle.members.filter((m) => m.toString() !== userId.toString());
      await circle.save();

      return res.status(200).json({
        success: true,
        isMember: false,
        membersCount: circle.members.length,
        message: `Left "${circle.name}".`,
      });
    } else {
      // Join circle
      circle.members.push(userId);
      await circle.save();

      return res.status(200).json({
        success: true,
        isMember: true,
        membersCount: circle.members.length,
        message: `🎉 Welcome to ${circle.name}!`,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stories published in a circle
 * @route   GET /api/circles/:slug/stories
 * @access  Public
 */
exports.getCircleStories = async (req, res, next) => {
  try {
    const circle = await Circle.findOne({ slug: req.params.slug.toLowerCase() });
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Campus circle not found.' });
    }

    const stories = await Story.find({ circle: circle._id, status: 'published' })
      .populate('author', 'name college profileImage')
      .populate('circle', 'name slug icon')
      .sort({ createdAt: -1 });

    // Enforce Anonymous Privacy Masking
    const sanitizedStories = stories.map((story) => {
      const sObj = story.toObject();
      if (sObj.isAnonymous) {
        sObj.author = {
          _id: null,
          name: 'Anonymous 🎭',
          college: 'CampusTales Student',
          profileImage: '',
        };
      }
      return sObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedStories.length,
      circle: {
        _id: circle._id,
        name: circle.name,
        slug: circle.slug,
        icon: circle.icon,
      },
      stories: sanitizedStories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get circles joined by the authenticated user
 * @route   GET /api/circles/my/joined
 * @access  Private
 */
exports.getMyCircles = async (req, res, next) => {
  try {
    const circles = await Circle.find({ members: req.user._id })
      .populate('creator', 'name college profileImage')
      .sort({ updatedAt: -1 });

    const formatted = circles.map((c) => {
      const obj = c.toObject();
      obj.membersCount = c.members ? c.members.length : 0;
      obj.isMember = true;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      circles: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a campus circle
 * @route   DELETE /api/circles/:id
 * @access  Private (Creator or Admin)
 */
exports.deleteCircle = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Campus circle not found.' });
    }

    const isOwner =
      circle.creator.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete circles you created.',
      });
    }

    // Unlink stories that belonged to this circle
    await Story.updateMany({ circle: circle._id }, { $set: { circle: null } });

    await Circle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Circle "${circle.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
