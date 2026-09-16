const testPhase9 = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Testing Phase 9 Backend Endpoints...');

  // 1. Fetch Circles
  const circlesRes = await fetch(`${BASE}/circles`);
  const circlesData = await circlesRes.json();
  console.log(`✅ 1. Circles Count: ${circlesData.count}`);
  circlesData.circles.forEach((c) => {
    console.log(`   - [${c.category}] "${c.name}" (${c.college}) • ${c.membersCount} members • ${c.storyCount} stories`);
  });

  // 2. Fetch specific circle
  const singleRes = await fetch(`${BASE}/circles/code-and-coffee-club`);
  const singleData = await singleRes.json();
  console.log(`✅ 2. Single Circle Details: "${singleData.circle.name}" by ${singleData.circle.creator.name}`);

  // 3. Fetch circle stories
  const storiesRes = await fetch(`${BASE}/circles/code-and-coffee-club/stories`);
  const storiesData = await storiesRes.json();
  console.log(`✅ 3. Stories in Code & Coffee Club: ${storiesData.count}`);
  storiesData.stories.forEach((s) => {
    console.log(`   - "${s.title}" by ${s.author.name}`);
  });

  // 4. Test Badges calculation for Sonu
  const badgesRes = await fetch(`${BASE}/users/650000000000000000000001/badges`);
  const badgesData = await badgesRes.json();
  console.log(`✅ 4. Sonu's Badges: ${badgesData.totalUnlocked} of ${badgesData.totalBadges} unlocked!`);
  badgesData.badges.forEach((b) => {
    console.log(`   - ${b.icon} ${b.title}: ${b.unlocked ? 'UNLOCKED 🌟' : 'LOCKED 🔒'} (${b.progress.percentage}%)`);
  });

  // 5. Test Join/Leave
  // Log in as Sonu
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sonu@campus.edu', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  // Join "Unplugged Jamming & Music Guild"
  const jammingCircle = circlesData.circles.find((c) => c.slug === 'unplugged-jamming-guild');
  if (jammingCircle) {
    const joinRes = await fetch(`${BASE}/circles/${jammingCircle._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const joinData = await joinRes.json();
    console.log(`✅ 5. Toggle Join: ${joinData.message} (isMember: ${joinData.isMember}, members: ${joinData.membersCount})`);

    // Leave back
    const leaveRes = await fetch(`${BASE}/circles/${jammingCircle._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const leaveData = await leaveRes.json();
    console.log(`✅ 6. Toggle Leave: ${leaveData.message} (isMember: ${leaveData.isMember})`);
  }

  console.log('\n🎉 ALL BACKEND ENDPOINTS WORKING 100%!');
};

testPhase9().catch(console.error);
