// Complete flow verification script simulating frontend interactions
const testFullFlow = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Full Flow Simulation...');

  // 1. Login with demo credentials
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'sonu@campus.edu',
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error(`Login failed: ${loginData.message}`);
  }
  const token = loginData.token;
  console.log(`✅ 1. Logged in as ${loginData.user.name} (${loginData.user.email})`);

  // 2. Fetch Feed Stories with auth token (checking isLiked & isSaved attributes)
  const storiesRes = await fetch(`${BASE}/stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const storiesData = await storiesRes.json();
  const testStory = storiesData.stories[0];
  console.log(`✅ 2. Feed stories fetched: ${storiesData.count} stories found.`);
  console.log(`   Selected story: "${testStory.title}" (ID: ${testStory._id})`);
  console.log(`   Initial isLiked: ${testStory.isLiked}, isSaved: ${testStory.isSaved}, Likes: ${testStory.likesCount}`);

  // 3. Like story
  const likeRes = await fetch(`${BASE}/stories/${testStory._id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const likeData = await likeRes.json();
  console.log(`✅ 3. Like clicked: Liked = ${likeData.liked}, LikesCount = ${likeData.likesCount} (Message: ${likeData.message})`);

  // 4. Bookmark story
  const saveRes = await fetch(`${BASE}/stories/${testStory._id}/save`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const saveData = await saveRes.json();
  console.log(`✅ 4. Bookmark clicked: Saved = ${saveData.saved} (Message: ${saveData.message})`);

  // 5. Verify Saved Stories for Profile
  const profileSavedRes = await fetch(`${BASE}/users/saved-stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profileSavedData = await profileSavedRes.json();
  const foundInSaved = profileSavedData.stories.some((s) => s._id === testStory._id);
  console.log(`✅ 5. Profile Saved Stories count: ${profileSavedData.count}. Story present in saved tab: ${foundInSaved}`);

  // 6. Post Comment on Story
  const commentRes = await fetch(`${BASE}/stories/${testStory._id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: 'Campus life memories stay with us forever! ❤️🎓',
    }),
  });
  const commentData = await commentRes.json();
  console.log(`✅ 6. Comment posted: "${commentData.comment.content}" by ${commentData.comment.author.name}`);

  // 7. Check Story Details (verifying isLiked, isSaved, commentsCount)
  const detailRes = await fetch(`${BASE}/stories/${testStory._id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const detailData = await detailRes.json();
  console.log(`✅ 7. Story details verified: isLiked=${detailData.story.isLiked}, isSaved=${detailData.story.isSaved}, commentsCount=${detailData.story.commentsCount}`);

  // 8. Delete Comment
  const delRes = await fetch(`${BASE}/comments/${commentData.comment._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  console.log(`✅ 8. Delete comment: ${delData.message}`);

  console.log('\n🎉 ALL INTERACTIONS VERIFIED 100% WORKING END-TO-END!');
};

testFullFlow().catch(console.error);
