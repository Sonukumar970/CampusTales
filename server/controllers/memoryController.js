const Memory = require('../models/Memory');

/**
 * @desc   Create a college memory milestone
 * @route  POST /api/memories
 * @access Private
 */
const createMemory = async (req, res, next) => {
  try {
    const {
      title,
      academicYear,
      semester,
      eventDate,
      milestoneType,
      description,
      linkedStory,
      location,
      isPublic,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the college milestone.',
      });
    }

    const memory = await Memory.create({
      user: req.user._id,
      title: title.trim(),
      academicYear: academicYear || '1st Year',
      semester: semester || 'Sem 1',
      eventDate: eventDate || Date.now(),
      milestoneType: milestoneType || 'Other ✨',
      description: description ? description.trim() : '',
      linkedStory: linkedStory || null,
      location: location ? location.trim() : '',
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
    });

    await memory.populate('linkedStory', 'title category likesCount');

    res.status(201).json({
      success: true,
      message: 'College milestone added to your timeline! 🎓',
      memory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get logged-in user's chronological college timeline
 * @route  GET /api/memories/timeline
 * @access Private
 */
const getMyTimeline = async (req, res, next) => {
  try {
    const memories = await Memory.find({ user: req.user._id })
      .populate('linkedStory', 'title category likesCount')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get public college timeline of any student by user ID
 * @route  GET /api/memories/user/:userId
 * @access Public (Optional Auth)
 */
const getUserTimeline = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const isOwner =
      req.user && req.user._id.toString() === targetUserId.toString();

    const query = { user: targetUserId };
    if (!isOwner) {
      query.isPublic = true;
    }

    const memories = await Memory.find(query)
      .populate('linkedStory', 'title category likesCount isAnonymous')
      .sort({ eventDate: 1 });

    // Format memories to omit linkedStory if the linked story is anonymous and viewed by non-author
    const formatted = memories.map((m) => {
      const obj = m.toObject();
      if (obj.linkedStory && obj.linkedStory.isAnonymous && !isOwner) {
        obj.linkedStory = null;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      memories: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a memory milestone
 * @route  PUT /api/memories/:id
 * @access Private (Owner only)
 */
const updateMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found.',
      });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own college milestones.',
      });
    }

    const {
      title,
      academicYear,
      semester,
      eventDate,
      milestoneType,
      description,
      linkedStory,
      location,
      isPublic,
    } = req.body;

    if (title) memory.title = title.trim();
    if (academicYear) memory.academicYear = academicYear;
    if (semester) memory.semester = semester;
    if (eventDate) memory.eventDate = eventDate;
    if (milestoneType) memory.milestoneType = milestoneType;
    if (description !== undefined) memory.description = description.trim();
    if (linkedStory !== undefined) memory.linkedStory = linkedStory || null;
    if (location !== undefined) memory.location = location.trim();
    if (isPublic !== undefined) memory.isPublic = Boolean(isPublic);

    await memory.save();
    await memory.populate('linkedStory', 'title category likesCount');

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully! ✨',
      memory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a memory milestone
 * @route  DELETE /api/memories/:id
 * @access Private (Owner only)
 */
const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found.',
      });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own milestones.',
      });
    }

    await Memory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Milestone removed from your timeline.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMemory,
  getMyTimeline,
  getUserTimeline,
  updateMemory,
  deleteMemory,
};
