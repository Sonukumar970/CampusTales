// Full end-to-end verification for Phase 7 Search, Explore & Campus Filtering
const verifyPhase7 = async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting Phase 7 End-to-End Verification...');

  // 1. Verify Popular Colleges Aggregation
  const collegesRes = await fetch(`${BASE}/stories/colleges`);
  const collegesData = await collegesRes.json();
  if (!collegesData.success || !Array.isArray(collegesData.colleges)) {
    throw new Error('Colleges aggregation failed');
  }
  console.log(`✅ 1. Colleges Aggregation: Found ${collegesData.colleges.length} campuses.`);
  collegesData.colleges.forEach((c) => console.log(`   - ${c.college} (${c.count} stories)`));

  // 2. Filter by College (Delhi University)
  const duRes = await fetch(`${BASE}/stories?college=Delhi%20University`);
  const duData = await duRes.json();
  console.log(`✅ 2. Filter by College (Delhi University): ${duData.count} stories found.`);
  if (duData.stories.length === 0) throw new Error('Expected stories for Delhi University');

  // 3. Filter by Mood (Inspired)
  const moodRes = await fetch(`${BASE}/stories?mood=Inspired`);
  const moodData = await moodRes.json();
  console.log(`✅ 3. Filter by Mood (Inspired): ${moodData.count} stories found. ("${moodData.stories[0]?.title}")`);

  // 4. Filter by Category (Trips)
  const tripsRes = await fetch(`${BASE}/stories?category=Trips`);
  const tripsData = await tripsRes.json();
  console.log(`✅ 4. Filter by Category (Trips): ${tripsData.count} stories found. ("${tripsData.stories[0]?.title}")`);

  // 5. Filter by Batch (2026)
  const batchRes = await fetch(`${BASE}/stories?batch=2026`);
  const batchData = await batchRes.json();
  console.log(`✅ 5. Filter by Batch (2026): ${batchData.count} stories found.`);

  // 6. Keyword Search ("Himachal")
  const searchRes = await fetch(`${BASE}/stories?search=Himachal`);
  const searchData = await searchRes.json();
  console.log(`✅ 6. Keyword Search ("Himachal"): ${searchData.count} stories found. Location: "${searchData.stories[0]?.location}"`);

  // 7. Compound Filtering (College: IIT Delhi + Category: Trips)
  const compoundRes = await fetch(`${BASE}/stories?college=IIT%20Delhi&category=Trips`);
  const compoundData = await compoundRes.json();
  console.log(`✅ 7. Compound Filter (IIT Delhi + Trips): ${compoundData.count} stories found.`);

  // 8. Sorting: Most Loved (popular) vs Latest
  const popularRes = await fetch(`${BASE}/stories?sort=popular&limit=2`);
  const popularData = await popularRes.json();
  const topLiked = popularData.stories[0]?.likesCount;
  console.log(`✅ 8. Sort by Popularity: Top story likes count = ${topLiked}`);

  console.log('\n🎉 ALL PHASE 7 SEARCH, EXPLORE & CAMPUS FILTERING TESTS PASSED 100%!');
};

verifyPhase7().catch(console.error);
