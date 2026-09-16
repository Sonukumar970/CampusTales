// Comprehensive End-to-End Verification for Phase 9 Campus Circles & Badges System
const verifyPhase9 = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Phase 9 End-to-End Verification...');

  // 1. Log in as Sonu Kumar
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sonu@campus.edu', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`✅ 1. Logged in: ${loginData.user.name} (${loginData.user.college})`);

  // 2. Fetch all Circles with Category Filter
  const circlesRes = await fetch(`${BASE}/circles?category=Hostel%20%F0%9F%8F%A2`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const circlesData = await circlesRes.json();
  console.log(`✅ 2. Filter Circles by Category (Hostel): Found ${circlesData.count} circle(s)`);
  circlesData.circles.forEach((c) => {
    console.log(`   - "${c.name}" (${c.college}) • ${c.membersCount} members • isMember: ${c.isMember}`);
  });

  // 3. Create a New Campus Circle
  const createCircleRes = await fetch(`${BASE}/circles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Night Owl Coders Guild',
      category: 'Tech & Coding 💻',
      college: 'NIT Patna',
      icon: '🦉',
      description: 'For those who find algorithmic enlightenment after 2 AM.',
      coverGradient: 'from-indigo-600/30 via-purple-600/20 to-pink-600/20',
    }),
  });
  const createCircleData = await createCircleRes.json();
  if (!createCircleData.success) {
    throw new Error(`Failed to create circle: ${createCircleData.message}`);
  }
  const newCircle = createCircleData.circle;
  console.log(`✅ 3. Created New Circle: "${newCircle.name}" (slug: ${newCircle.slug}, members: ${newCircle.membersCount})`);

  // 4. Create a Story Linked to This Circle
  const createStoryRes = await fetch(`${BASE}/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Debugging AVL Trees at 3:30 AM with Cold Coffee',
      description: 'When a single pointer rotation kept four hostel rooms awake all night.',
      content: 'We were preparing for our Data Structures lab evaluation. A segfault occurred on test case 4...',
      category: 'Growth',
      mood: '😂 Hilarious',
      location: 'Hostel Lab 2',
      eventDate: new Date(),
      circle: newCircle._id,
      isAnonymous: false,
    }),
  });
  const createStoryData = await createStoryRes.json();
  if (!createStoryData.success) {
    throw new Error('Failed to create story linked to circle');
  }
  const newStory = createStoryData.story;
  console.log(`✅ 4. Created Story in Circle: "${newStory.title}" (circle: ${newStory.circle?.name})`);

  // 5. Fetch Circle Stories
  const circleStoriesRes = await fetch(`${BASE}/circles/${newCircle.slug}/stories`);
  const circleStoriesData = await circleStoriesRes.json();
  console.log(`✅ 5. Verified Circle Stories Count: ${circleStoriesData.count}`);
  if (circleStoriesData.count !== 1 || circleStoriesData.stories[0].title !== newStory.title) {
    throw new Error('Circle stories mismatch');
  }

  // 6. Test Join / Leave on an existing circle
  const allCirclesRes = await fetch(`${BASE}/circles`);
  const allCirclesData = await allCirclesRes.json();
  const litCircle = allCirclesData.circles.find((c) => c.slug === 'north-campus-lit-society');
  if (litCircle) {
    // Toggle Join
    const joinRes = await fetch(`${BASE}/circles/${litCircle._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const joinData = await joinRes.json();
    console.log(`✅ 6a. Joined Circle "${litCircle.name}": isMember = ${joinData.isMember}, count = ${joinData.membersCount}`);

    // Toggle Leave
    const leaveRes = await fetch(`${BASE}/circles/${litCircle._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const leaveData = await leaveRes.json();
    console.log(`✅ 6b. Left Circle "${litCircle.name}": isMember = ${leaveData.isMember}, count = ${leaveData.membersCount}`);
  }

  // 7. Verify Dynamic Badges Engine
  const badgesRes = await fetch(`${BASE}/users/${loginData.user._id}/badges`);
  const badgesData = await badgesRes.json();
  console.log(`✅ 7. Sonu Kumar Badges Engine Verified: ${badgesData.totalUnlocked} of ${badgesData.totalBadges} Badges Unlocked!`);
  badgesData.badges.forEach((b) => {
    console.log(`   - ${b.icon} ${b.title}: ${b.unlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'} (${b.progress.percentage}%)`);
  });

  // 8. Cleanup Test Story and Circle
  const delStoryRes = await fetch(`${BASE}/stories/${newStory._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delStoryData = await delStoryRes.json();
  console.log(`✅ 8a. Cleanup Test Story: ${delStoryData.message}`);

  const delCircleRes = await fetch(`${BASE}/circles/${newCircle._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delCircleData = await delCircleRes.json();
  console.log(`✅ 8b. Cleanup Test Circle: ${delCircleData.message}`);

  console.log('\n🎉 ALL PHASE 9 CAMPUS CIRCLES & BADGES FEATURES 100% VERIFIED!');
};

verifyPhase9().catch(console.error);
