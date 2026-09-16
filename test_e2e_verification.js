const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting CampusTales E2E Verification & Bug Audit...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('1. Checking Health Endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.success, 'Health endpoint responds 200 OK');

    // 2. Auth: Register a test user
    console.log('\n2. Testing Authentication...');
    const rand = Math.floor(Math.random() * 1000000);
    const testEmail = `qa_student_${rand}@campustales.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Tester ${rand}`,
        email: testEmail,
        password: 'Password123!',
        college: 'IIT Delhi',
        course: 'Computer Science',
        batch: 2024,
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token, 'User registration succeeds with JWT');
    const token = regData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 3. Circles
    console.log('\n3. Testing Circles Integration...');
    const circlesRes = await fetch(`${BASE_URL}/circles`);
    const circlesData = await circlesRes.json();
    assert(circlesRes.status === 200 && circlesData.circles?.length > 0, 'Fetched circles list successfully');
    const firstCircle = circlesData.circles[0];
    const secondCircle = circlesData.circles[1] || circlesData.circles[0];
    const initialFirstCount = firstCircle.storyCount || 0;

    // 4. Create Story with Circle
    console.log('\n4. Testing Story Creation with Circle...');
    const createStoryRes = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: `Night Canteen Chronicles #${rand}`,
        description: 'Testing tea discussions and night vibes',
        content: 'Long night in hostel canteen solving algorithms and discussing startup ideas with roomies.',
        category: 'Memories',
        mood: '😊 Nostalgic',
        location: 'Kailash Hostel Canteen',
        eventDate: '2024-03-15',
        isAnonymous: false,
        circle: firstCircle._id,
      }),
    });
    const createStoryData = await createStoryRes.json();
    assert(createStoryRes.status === 201 && createStoryData.story?._id, 'Story created with circle');
    const storyId = createStoryData.story._id;
    assert(createStoryData.story.circle?.name === firstCircle.name, 'Story response has circle populated');

    // 5. Get Story by ID
    console.log('\n5. Testing Story Retrieval & Circle Badge Data...');
    const getStoryRes = await fetch(`${BASE_URL}/stories/${storyId}`);
    const getStoryData = await getStoryRes.json();
    assert(getStoryRes.status === 200 && getStoryData.story.circle?._id === firstCircle._id, 'Get story populates circle details');

    // 6. Update Story (Change Circle)
    console.log('\n6. Testing Story Editing with Circle Reassignment...');
    const updateStoryRes = await fetch(`${BASE_URL}/stories/${storyId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: `Night Canteen Chronicles #${rand} (Updated)`,
        circle: secondCircle._id,
      }),
    });
    const updateStoryData = await updateStoryRes.json();
    assert(updateStoryRes.status === 200 && updateStoryData.story.title.includes('(Updated)'), 'Story updated title');
    assert(updateStoryData.story.circle?._id === secondCircle._id, 'Story circle successfully updated in database');

    // 7. Social: Like Toggle
    console.log('\n7. Testing Social Reactions (Likes)...');
    const likeRes = await fetch(`${BASE_URL}/stories/${storyId}/like`, {
      method: 'POST',
      headers: authHeaders,
    });
    const likeData = await likeRes.json();
    assert(likeRes.status === 200 && likeData.liked === true && likeData.likesCount === 1, 'Story liked successfully (count = 1)');

    // Unlike
    const unlikeRes = await fetch(`${BASE_URL}/stories/${storyId}/like`, {
      method: 'POST',
      headers: authHeaders,
    });
    const unlikeData = await unlikeRes.json();
    assert(unlikeRes.status === 200 && unlikeData.liked === false && unlikeData.likesCount === 0, 'Story unliked successfully (count = 0)');

    // 8. Social: Bookmark Toggle & Saved Stories
    console.log('\n8. Testing Bookmarks / Saved Stories...');
    const saveRes = await fetch(`${BASE_URL}/stories/${storyId}/save`, {
      method: 'POST',
      headers: authHeaders,
    });
    const saveData = await saveRes.json();
    assert(saveRes.status === 200 && saveData.saved === true, 'Story bookmarked');

    const savedStoriesRes = await fetch(`${BASE_URL}/users/saved-stories`, {
      headers: authHeaders,
    });
    const savedStoriesData = await savedStoriesRes.json();
    assert(savedStoriesData.stories.some((s) => s._id === storyId), 'Story appears in user bookmarks list');

    // 9. Comments & Deletion
    console.log('\n9. Testing Comments Discussion...');
    const commentRes = await fetch(`${BASE_URL}/stories/${storyId}/comments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ content: 'Best memory ever! IIT canteen chai rocks.' }),
    });
    const commentData = await commentRes.json();
    assert(commentRes.status === 201 && commentData.comment?._id, 'Comment posted successfully');
    const commentId = commentData.comment._id;

    // Delete comment
    const delCommentRes = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const delCommentData = await delCommentRes.json();
    assert(delCommentRes.status === 200 && delCommentData.success, 'Comment deleted successfully');

    // 10. Anonymous Story Identity Masking
    console.log('\n10. Testing Anonymous Identity Masking...');
    const anonStoryRes = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: `Secret Campus Crush #${rand}`,
        description: 'Anonymous confession from library 3rd floor',
        content: 'To the person wearing blue hoodie in reading room...',
        category: 'Love',
        isAnonymous: true,
      }),
    });
    const anonStoryData = await anonStoryRes.json();
    const anonStoryId = anonStoryData.story._id;

    // Fetch as anonymous / unauthenticated viewer
    const publicStoryRes = await fetch(`${BASE_URL}/stories/${anonStoryId}`);
    const publicStoryData = await publicStoryRes.json();
    assert(
      publicStoryData.story.author.name === 'Anonymous 🎭' && publicStoryData.story.author._id === null,
      'Unauthenticated user sees masked author name "Anonymous 🎭" and null ID'
    );

    // 11. 4-Year Journey Memories
    console.log('\n11. Testing 4-Year Journey Memories Roadmap...');
    const memoryRes = await fetch(`${BASE_URL}/memories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        yearOfStudy: '1st Year',
        semester: 'Semester 1',
        title: 'First Day at IIT Campus',
        description: 'Orientation, luggage unpacking, and finding the lecture hall',
        date: '2020-08-10',
        tags: ['Orientation', 'Fresher'],
      }),
    });
    const memoryData = await memoryRes.json();
    assert(memoryRes.status === 201 && memoryData.memory?._id, 'Created 4-Year Journey memory entry');
    const memoryId = memoryData.memory._id;

    const listMemoriesRes = await fetch(`${BASE_URL}/memories`, {
      headers: authHeaders,
    });
    const listMemoriesData = await listMemoriesRes.json();
    assert(
      listMemoriesRes.status === 200 && listMemoriesData.memories?.some((m) => m._id === memoryId),
      'Retrieved 4-year journey memories list'
    );

    // 12. Gamified Badges
    console.log('\n12. Testing Badges Engine...');
    const badgesRes = await fetch(`${BASE_URL}/users/me/badges`, {
      headers: authHeaders,
    });
    const badgesData = await badgesRes.json();
    assert(badgesRes.status === 200 && Array.isArray(badgesData.badges), 'Badges engine calculates user tier & badges');

    // 13. Cleanup
    console.log('\n13. Cleaning Up Test Data...');
    await fetch(`${BASE_URL}/stories/${storyId}`, { method: 'DELETE', headers: authHeaders });
    await fetch(`${BASE_URL}/stories/${anonStoryId}`, { method: 'DELETE', headers: authHeaders });
    await fetch(`${BASE_URL}/memories/${memoryId}`, { method: 'DELETE', headers: authHeaders });
    console.log('  ✅ Cleaned up temporary test stories and memory.');

    console.log(`\n========================================`);
    console.log(`Audit Summary: ${passed} passed, ${failed} failed.`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
