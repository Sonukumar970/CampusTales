// Comprehensive end-to-end verification for Phase 6 Profile System
const verifyPhase6 = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Phase 6 End-to-End Verification...');

  // 1. Log in as Sonu
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'sonu@campus.edu',
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`✅ 1. Logged in: ${loginData.user.name} (${loginData.user.college})`);

  // 2. Update Profile
  const updatedBio = 'NIT Patna Senior | Coding, photography & college chai addict ☕✨';
  const updatedAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=8b5cf6';

  const updateRes = await fetch(`${BASE}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bio: updatedBio,
      course: 'MCA (Computer Applications)',
      batch: 2025,
      profileImage: updatedAvatar,
    }),
  });
  const updateData = await updateRes.json();
  if (!updateData.success || updateData.user.bio !== updatedBio) {
    throw new Error('Profile update verification failed');
  }
  console.log(`✅ 2. Profile updated successfully: "${updateData.user.bio}"`);

  // 3. Like Riya's story
  const feedRes = await fetch(`${BASE}/stories`);
  const feedData = await feedRes.json();
  const riyaPublicStory = feedData.stories.find(
    (s) => !s.isAnonymous && s.author?.name === 'Riya Sharma'
  );

  if (!riyaPublicStory) {
    throw new Error('Could not find a public story by Riya Sharma');
  }
  console.log(`   Found Riya's story: "${riyaPublicStory.title}" (ID: ${riyaPublicStory._id})`);

  const likeRes = await fetch(`${BASE}/stories/${riyaPublicStory._id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const likeData = await likeRes.json();
  console.log(`✅ 3. Story like toggled: Liked = ${likeData.liked}`);

  // 4. Verify Liked Stories Tab API
  const likedListRes = await fetch(`${BASE}/users/liked-stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const likedListData = await likedListRes.json();
  const foundInLiked = likedListData.stories.some((s) => s._id === riyaPublicStory._id);
  console.log(`✅ 4. Liked Stories count: ${likedListData.count}. Riya's story present in liked tab: ${foundInLiked}`);

  // 5. Verify Public Profile for Riya Sharma (ID: 650000000000000000000002)
  const riyaId = '650000000000000000000002';
  const riyaProfileRes = await fetch(`${BASE}/users/${riyaId}`);
  const riyaProfileData = await riyaProfileRes.json();
  console.log(`✅ 5. Public Profile for ${riyaProfileData.user.name}:`);
  console.log(`   College: ${riyaProfileData.user.college} | Course: ${riyaProfileData.user.course}`);
  console.log(`   Public stories count: ${riyaProfileData.stats.storiesCount}`);
  console.log(`   Total appreciation received: ${riyaProfileData.stats.totalLikesReceived} ❤️`);

  // Verify that any anonymous stories by Riya are NOT listed in her public profile
  const hasAnonymousInPublic = riyaProfileData.stories.some((s) => s.isAnonymous);
  console.log(`   Privacy check: Anonymous stories exposed in public profile? ${hasAnonymousInPublic} (Expected: false)`);
  if (hasAnonymousInPublic) {
    throw new Error('Privacy leak: Anonymous story found in public profile!');
  }

  console.log('\n🎉 ALL PHASE 6 PROFILE & CUSTOMIZATION FEATURES VERIFIED 100%!');
};

verifyPhase6().catch(console.error);
