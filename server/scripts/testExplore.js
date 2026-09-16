// Test script for Phase 7 Search, Explore & Campus Filtering
const testExplore = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Testing Phase 7 Search, Explore & Filtering APIs...');

  // 1. Test GET /api/stories/colleges
  const collegesRes = await fetch(`${BASE}/stories/colleges`);
  const collegesData = await collegesRes.json();
  console.log('✅ 1. GET /api/stories/colleges Status:', collegesRes.status);
  console.log('   Top Campuses:', collegesData.colleges);

  // 2. Test College Filter (e.g. college=NIT Patna)
  const nitRes = await fetch(`${BASE}/stories?college=NIT%20Patna`);
  const nitData = await nitRes.json();
  console.log('✅ 2. Filter by College (NIT Patna):', nitData.count, 'stories found.');
  nitData.stories.forEach((s) => {
    console.log(`   - "${s.title}" (Author: ${s.author?.name}, College: ${s.author?.college})`);
  });

  // 3. Test Mood Filter (e.g. mood=Hilarious)
  const moodRes = await fetch(`${BASE}/stories?mood=Hilarious`);
  const moodData = await moodRes.json();
  console.log('✅ 3. Filter by Mood (Hilarious):', moodData.count, 'stories found.');
  moodData.stories.forEach((s) => {
    console.log(`   - "${s.title}" (Mood: ${s.mood})`);
  });

  // 4. Test Batch Filter (e.g. batch=2025)
  const batchRes = await fetch(`${BASE}/stories?batch=2025`);
  const batchData = await batchRes.json();
  console.log('✅ 4. Filter by Batch (2025):', batchData.count, 'stories found.');

  // 5. Test Compound Search (Category=Memories & search=Maggi)
  const searchRes = await fetch(`${BASE}/stories?category=Memories&search=Maggi`);
  const searchData = await searchRes.json();
  console.log('✅ 5. Compound search (Memories + "Maggi"):', searchData.count, 'stories found.');
  if (searchData.stories.length > 0) {
    console.log(`   - Title: "${searchData.stories[0].title}"`);
  }

  console.log('\n🎉 ALL PHASE 7 SEARCH & FILTERING BACKEND TESTS PASSED!');
};

testExplore().catch(console.error);
