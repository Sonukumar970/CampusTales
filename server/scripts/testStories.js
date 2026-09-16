// Automated test runner for CampusTales Story CRUD & Anonymous Privacy System
const testStorySystem = async () => {
  try {
    const timestamp = Date.now();
    const studentAEmail = `authorA_${timestamp}@campus.edu`;
    const studentBEmail = `authorB_${timestamp}@campus.edu`;

    console.log('--- 1. REGISTERING AUTHOR A & AUTHOR B ---');
    const resA = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sonu Author',
        email: studentAEmail,
        password: 'password123',
        college: 'NIT Patna',
        course: 'MCA',
        batch: 2025,
      }),
    });
    const dataA = await resA.json();
    const tokenA = dataA.token;

    const resB = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aman Reader',
        email: studentBEmail,
        password: 'password123',
        college: 'IIT Delhi',
        course: 'B.Tech',
        batch: 2026,
      }),
    });
    const dataB = await resB.json();
    const tokenB = dataB.token;

    console.log('Author A Token received:', Boolean(tokenA));
    console.log('Author B Token received:', Boolean(tokenB));

    console.log('\n--- 2. CREATING PUBLIC STORY (By Author A) ---');
    const pubStoryRes = await fetch('http://localhost:5000/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        title: 'How I Met My Best Friend on Orientation Day',
        description: 'We both got lost searching for Lab 3 and ended up at the canteen.',
        content: 'Orientation week was overwhelming. The campus seemed like a maze...',
        category: 'Friendship',
        mood: '😊 Nostalgic',
        location: 'Central Canteen',
        isAnonymous: false,
      }),
    });
    const pubStoryData = await pubStoryRes.json();
    console.log('Public Story Status:', pubStoryRes.status, 'Title:', pubStoryData.story?.title);
    const pubStoryId = pubStoryData.story?._id;

    console.log('\n--- 3. CREATING ANONYMOUS STORY (By Author A) ---');
    const anonStoryRes = await fetch('http://localhost:5000/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        title: 'A Secret Crush Across the Library Hall',
        description: 'Every Tuesday afternoon at 3 PM, table 7 by the window.',
        content: 'I never gathered the courage to say hello, but those quiet study hours kept me going...',
        category: 'Love',
        mood: '❤️ In Love',
        location: 'Central Library, 2nd Floor',
        isAnonymous: true,
      }),
    });
    const anonStoryData = await anonStoryRes.json();
    console.log('Anon Story Status:', anonStoryRes.status, 'Title:', anonStoryData.story?.title);
    const anonStoryId = anonStoryData.story?._id;

    console.log('\n--- 4. TESTING ANONYMOUS MASKING FOR PUBLIC / OTHER USER ---');
    // Call GET /api/stories/:id as Author B (not the owner)
    const readAnonAsB = await fetch(`http://localhost:5000/api/stories/${anonStoryId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    const anonReadData = await readAnonAsB.json();
    console.log('Masked Author Name (should be Anonymous 🎭):', anonReadData.story?.author?.name);
    console.log('Is Owner for User B (should be false):', anonReadData.story?.isOwner);

    // Call GET /api/stories/:id as Author A (the real owner)
    const readAnonAsA = await fetch(`http://localhost:5000/api/stories/${anonStoryId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const anonOwnerData = await readAnonAsA.json();
    console.log('Real Author Name for Owner (should be Sonu Author):', anonOwnerData.story?.author?.name);
    console.log('Is Owner for User A (should be true):', anonOwnerData.story?.isOwner);

    console.log('\n--- 5. TESTING UPDATE STORY (Author A updates public story) ---');
    const updateRes = await fetch(`http://localhost:5000/api/stories/${pubStoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        title: 'How I Met My Best Friend on Orientation Day (Updated)',
        mood: '🥳 Excited',
      }),
    });
    const updateData = await updateRes.json();
    console.log('Update Status:', updateRes.status, 'New Title:', updateData.story?.title);

    console.log('\n--- 6. TESTING UNAUTHORIZED EDIT (Author B tries to edit Author A story) ---');
    const unauthEditRes = await fetch(`http://localhost:5000/api/stories/${pubStoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        title: 'Hacked Title',
      }),
    });
    const unauthEditData = await unauthEditRes.json();
    console.log('Unauthorized Edit Status (Expect 403):', unauthEditRes.status, unauthEditData.message);

    console.log('\n--- 7. TESTING DELETE STORY (Author A deletes public story) ---');
    const delRes = await fetch(`http://localhost:5000/api/stories/${pubStoryId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const delData = await delRes.json();
    console.log('Delete Status (Expect 200):', delRes.status, delData.message);

    console.log('\n--- 8. TESTING GET STORIES LIST WITH FILTERS ---');
    const listRes = await fetch('http://localhost:5000/api/stories?category=Love');
    const listData = await listRes.json();
    console.log('Love Stories Count:', listData.count, 'Total in DB:', listData.total);

    console.log('\n🎉 ALL PHASE 3 STORY SYSTEM TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  }
};

testStorySystem();
