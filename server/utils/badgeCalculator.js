const Story = require('../models/Story');
const Memory = require('../models/Memory');
const Circle = require('../models/Circle');

/**
 * Calculates gamified badges dynamically for a given user.
 * @param {string|ObjectId} userId
 * @returns {Promise<{ badges: Array, totalUnlocked: number, totalBadges: number }>}
 */
const calculateUserBadges = async (userId) => {
  // Fetch user's published stories
  const stories = await Story.find({ author: userId, status: 'published' }).select('likesCount category description content location');
  
  // Fetch user's milestones
  const milestonesCount = await Memory.countDocuments({ user: userId });
  
  // Fetch user's joined circles
  const joinedCircles = await Circle.find({ members: userId }).select('name category');
  const joinedCirclesCount = joinedCircles.length;

  const storiesCount = stories.length;
  const totalLikes = stories.reduce((sum, s) => sum + (s.likesCount || 0), 0);

  const hasHostelContent = stories.some(
    (s) =>
      s.category === 'Memories' &&
      (s.location?.toLowerCase().includes('hostel') ||
        s.description?.toLowerCase().includes('hostel') ||
        s.content?.toLowerCase().includes('hostel'))
  );
  const hasHostelCircle = joinedCircles.some((c) => c.category === 'Hostel 🏢' || c.name.toLowerCase().includes('hostel'));

  const badges = [
    {
      id: 'fresher',
      title: 'Campus Fresher',
      icon: '🥉',
      category: 'Milestones',
      description: 'Took your first step into campus storytelling by publishing a story or marking a milestone.',
      unlocked: storiesCount >= 1 || milestonesCount >= 1,
      progress: {
        current: Math.min(1, storiesCount + milestonesCount),
        target: 1,
        percentage: Math.min(100, Math.round(((storiesCount + milestonesCount) / 1) * 100)),
      },
    },
    {
      id: 'storyteller',
      title: 'Campus Storyteller',
      icon: '📖',
      category: 'Storytelling',
      description: 'Shared 3 or more heartfelt college stories with your peers.',
      unlocked: storiesCount >= 3,
      progress: {
        current: Math.min(3, storiesCount),
        target: 3,
        percentage: Math.min(100, Math.round((storiesCount / 3) * 100)),
      },
    },
    {
      id: 'legend',
      title: 'Campus Legend',
      icon: '👑',
      category: 'Prestige',
      description: 'Authored 5+ stories or earned 50+ campus reactions across your posts.',
      unlocked: storiesCount >= 5 || totalLikes >= 50,
      progress: {
        current: Math.min(50, Math.max(storiesCount * 10, totalLikes)),
        target: 50,
        percentage: Math.min(100, Math.round((Math.max(storiesCount * 10, totalLikes) / 50) * 100)),
      },
    },
    {
      id: 'heartfelt',
      title: 'Heartfelt Soul',
      icon: '❤️',
      category: 'Popularity',
      description: 'Touched hearts across campus, earning 20+ total likes on your stories.',
      unlocked: totalLikes >= 20,
      progress: {
        current: Math.min(20, totalLikes),
        target: 20,
        percentage: Math.min(100, Math.round((totalLikes / 20) * 100)),
      },
    },
    {
      id: 'hostel',
      title: 'Hostel Chronicler',
      icon: '🏢',
      category: 'Community',
      description: 'Shared memories from hostel life or joined a hostel micro-community.',
      unlocked: hasHostelContent || hasHostelCircle,
      progress: {
        current: hasHostelContent || hasHostelCircle ? 1 : 0,
        target: 1,
        percentage: hasHostelContent || hasHostelCircle ? 100 : 0,
      },
    },
    {
      id: 'pioneer',
      title: 'Milestone Pioneer',
      icon: '🌟',
      category: 'Milestones',
      description: 'Documented 3+ landmark milestones on your college journey roadmap.',
      unlocked: milestonesCount >= 3,
      progress: {
        current: Math.min(3, milestonesCount),
        target: 3,
        percentage: Math.min(100, Math.round((milestonesCount / 3) * 100)),
      },
    },
    {
      id: 'insider',
      title: 'Circle Insider',
      icon: '🤝',
      category: 'Community',
      description: 'Active member of 2 or more campus micro-communities.',
      unlocked: joinedCirclesCount >= 2,
      progress: {
        current: Math.min(2, joinedCirclesCount),
        target: 2,
        percentage: Math.min(100, Math.round((joinedCirclesCount / 2) * 100)),
      },
    },
  ];

  const totalUnlocked = badges.filter((b) => b.unlocked).length;

  return {
    badges,
    totalUnlocked,
    totalBadges: badges.length,
    stats: {
      storiesCount,
      totalLikes,
      milestonesCount,
      joinedCirclesCount,
    },
  };
};

module.exports = { calculateUserBadges };
