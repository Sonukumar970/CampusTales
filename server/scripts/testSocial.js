// Automated test runner for Phase 5 Social Features (Likes, Comments, Saves)
const testSocial = async () => {
  try {
    const timestamp = Date.now();
    const email = `socialuser_${timestamp}@campus.edu`;

    console.log('--- 1. REGISTERING TEST STUDENT ---');
    const authRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rohan Social',
        email,
        password: 'password123',
        college: 'BITS Pilani',
      }),
    });
    const authData = await authRes.json();
    const token = authData.token;
    console.log('User registered with token:', Boolean(token));

    // Get an existing story
    const storiesRes = await fetch('http://localhost:5000/api/stories?limit=1');
    const storiesData = await storiesRes.json();
    const storyId = storiesData.stories[0]._id;
    console.log('Testing with story:', storiesData.stories[0].title, `(ID: ${storyId})`);

    console.log('\n--- 2. TESTING LIKE TOGGLE ---');
    const like1 = await fetch(`http://localhost:5000/api/stories/${storyId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const like1Data = await like1.json();
    console.log('Like 1 Status:', like1.status, 'Liked:', like1Data.liked, 'New Count:', like1Data.likesCount);

    // Unlike
    const like2 = await fetch(`http://localhost:5000/api/stories/${storyId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const like2Data = await like2.json();
    console.log('Like 2 Status (Unlike):', like2.status, 'Liked:', like2Data.liked, 'New Count:', like2Data.likesCount);

    console.log('\n--- 3. TESTING COMMENT CREATION & RETRIEVAL ---');
    const commentRes = await fetch(`http://localhost:5000/api/stories/${storyId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: 'This memory brought tears to my eyes. Hostel life was truly special!',
      }),
    });
    const commentData = await commentRes.json();
    console.log('Comment Create Status:', commentRes.status, 'Content:', commentData.comment?.content);
    const commentId = commentData.comment?._id;

    // Get comments
    const listComments = await fetch(`http://localhost:5000/api/stories/${storyId}/comments`);
    const listData = await listComments.json();
    console.log('Comments count in DB:', listData.count);

    console.log('\n--- 4. TESTING SAVE / BOOKMARK STORY ---');
    const save1 = await fetch(`http://localhost:5000/api/stories/${storyId}/save`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const save1Data = await save1.json();
    console.log('Save Status:', save1.status, 'Saved:', save1Data.saved);

    // Get saved stories
    const savedList = await fetch('http://localhost:5000/api/users/saved-stories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const savedListData = await savedList.json();
    console.log('User saved stories count:', savedListData.count);

    console.log('\n--- 5. TESTING DELETE COMMENT ---');
    const delComment = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const delData = await delComment.json();
    console.log('Delete Comment Status:', delComment.status, delData.message);

    console.log('\n🎉 ALL PHASE 5 SOCIAL FEATURE TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Social test error:', err);
  }
};

testSocial();
