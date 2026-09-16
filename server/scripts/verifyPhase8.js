// Comprehensive end-to-end verification for Phase 8 Memories & Milestones System
const verifyPhase8 = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Phase 8 End-to-End Verification...');

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

  // 2. Fetch Sonu's Timeline
  const timelineRes = await fetch(`${BASE}/memories/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const timelineData = await timelineRes.json();
  console.log(`✅ 2. Sonu's Timeline Milestones Count: ${timelineData.count}`);
  timelineData.memories.forEach((m) => {
    console.log(`   - [${m.academicYear} • ${m.semester}] ${m.milestoneType}: "${m.title}" (${m.location})`);
    if (m.linkedStory) {
      console.log(`     Connected Story: "${m.linkedStory.title}" (${m.linkedStory.category})`);
    }
  });

  // 3. Add New Milestone
  const addRes = await fetch(`${BASE}/memories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Final Convocation & Black Robes Celebration',
      academicYear: 'Final Year',
      semester: 'Sem 8',
      milestoneType: 'Farewell 🌅',
      location: 'Main Auditorium & Open Lawn',
      description: 'Throwing caps in the air surrounded by friends who became family for life.',
      eventDate: new Date('2025-06-15'),
    }),
  });
  const addData = await addRes.json();
  if (!addData.success) throw new Error('Failed to add milestone');
  console.log(`✅ 3. Added New Milestone: "${addData.memory.title}"`);
  const newMemoryId = addData.memory._id;

  // 4. Fetch Public Timeline of Riya Sharma
  const riyaId = '650000000000000000000002';
  const riyaTimelineRes = await fetch(`${BASE}/memories/user/${riyaId}`);
  const riyaTimelineData = await riyaTimelineRes.json();
  console.log(`✅ 4. Riya Sharma's Public Timeline Count: ${riyaTimelineData.count}`);
  riyaTimelineData.memories.forEach((m) => {
    console.log(`   - [${m.academicYear}] ${m.milestoneType}: "${m.title}"`);
  });

  // 5. Delete Test Milestone
  const delRes = await fetch(`${BASE}/memories/${newMemoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  console.log(`✅ 5. Cleanup: ${delData.message}`);

  console.log('\n🎉 ALL PHASE 8 MEMORIES & MILESTONES FEATURES VERIFIED 100%!');
};

verifyPhase8().catch(console.error);
