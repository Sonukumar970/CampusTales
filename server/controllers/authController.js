const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc   Register a new student/user
 * @route  POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, course, batch, bio } = req.body;

    // 1. Validation checks
    if (!name || !email || !password || !college) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and college.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists.',
      });
    }

    // Default avatar based on name initials
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=6366f1,8b5cf6,ec4899`;

    // 3. Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college.trim(),
      course: course ? course.trim() : 'General',
      batch: batch ? Number(batch) : new Date().getFullYear(),
      bio: bio ? bio.trim() : '',
      profileImage: defaultAvatar,
      role: 'student',
    });

    // 4. Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to CampusTales.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        batch: user.batch,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Authenticate user & obtain JWT token
 * @route  POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Check for user (explicitly selecting password)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        batch: user.batch,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current authenticated user profile
 * @route  GET /api/auth/me
 * @access Private (Protected)
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Log out user (informational endpoint)
 * @route  POST /api/auth/logout
 * @access Public
 */
const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
