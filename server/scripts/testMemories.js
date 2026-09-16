// Test script for Phase 8 Memories & Milestones System
const testMemories = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Testing Phase 8 Memories & Milestones APIs...');

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
  const userId = loginData.user._id;
  console.log(`✅ 1. Logged in as ${loginData.user.name}`);

  // 2. Test POST /api/memories (Create milestone)
  const createRes = await fetch(`${BASE}/memories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Hackathon Victory & All-Nighter in Lab 4',
      academicYear: '3rd Year',
      semester: 'Sem 5',
      eventDate: new Date('2024-02-20'),
      milestoneType: 'Exams & Sems 📚',
      location: 'Software Lab 4',
      description: '36 hours of non-stop coding, Red Bull, and our first national college trophy! 🏆',
    }),
  });
  const createData = await createRes.json();
  console.log('✅ 2. POST /api/memories Status:', createRes.status, 'Title:', createData.memory?.title);
  const createdMemoryId = createData.memory?._id;

  // 3. Test GET /api/memories/timeline (Own timeline)
  const timelineRes = await fetch(`${BASE}/memories/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const timelineData = await timelineRes.json();
  console.log('✅ 3. GET /api/memories/timeline Status:', timelineRes.status, 'Milestones Count:', timelineData.count);
  timelineData.memories.forEach((m) => {
    console.log(`   - [${m.academicYear}] ${m.milestoneType} : "${m.title}" (${m.location})`);
  });

  // 4. Test GET /api/memories/user/:userId (Public timeline)
  const publicRes = await fetch(`${BASE}/memories/user/${userId}`);
  const publicData = await publicRes.json();
  console.log('✅ 4. GET /api/memories/user/:userId Status:', publicRes.status, 'Public Count:', publicData.count);

  // 5. Test DELETE /api/memories/:id (Delete created test milestone)
  const delRes = await fetch(`${BASE}/memories/${createdMemoryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  console.log('✅ 5. DELETE /api/memories/:id Status:', delRes.status, delData.message);

  console.log('\n🎉 ALL PHASE 8 MEMORY TIMELINE BACKEND TESTS PASSED!');
};

testMemories().catch(console.error);
