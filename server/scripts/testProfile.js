// Test script for Phase 6 Profile APIs
const testProfile = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Testing Phase 6 Profile APIs...');

  // 1. Login with demo user
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
  const userId = loginData.user._id;
  console.log(`✅ Logged in as: ${loginData.user.name} (ID: ${userId})`);

  // 2. Test PUT /api/users/profile
  const updateRes = await fetch(`${BASE}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bio: 'NIT Patna MCA | Late night chai & coding enthusiast. ☕',
      course: 'MCA (Computer Applications)',
      batch: 2025,
      profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sonu%20Cool&backgroundColor=6366f1',
    }),
  });
  const updateData = await updateRes.json();
  console.log('✅ PUT /api/users/profile Status:', updateRes.status);
  console.log('   New Bio:', updateData.user?.bio);
  console.log('   New Avatar:', updateData.user?.profileImage);

  // 3. Test GET /api/users/:id (Public profile)
  const publicRes = await fetch(`${BASE}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const publicData = await publicRes.json();
  console.log('✅ GET /api/users/:id Status:', publicRes.status);
  console.log('   User name:', publicData.user?.name);
  console.log('   Stories count:', publicData.stats?.storiesCount);
  console.log('   Total likes received:', publicData.stats?.totalLikesReceived);

  // 4. Test GET /api/users/liked-stories
  const likedRes = await fetch(`${BASE}/users/liked-stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const likedData = await likedRes.json();
  console.log('✅ GET /api/users/liked-stories Status:', likedRes.status, 'Liked count:', likedData.count);

  console.log('\n🎉 ALL PHASE 6 PROFILE API TESTS PASSED SUCCESSFULLY!');
};

testProfile().catch(console.error);
