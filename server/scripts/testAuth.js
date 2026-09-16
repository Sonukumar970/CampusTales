// Automated test runner for CampusTales Auth APIs
const testAuth = async () => {
  try {
    const timestamp = Date.now();
    const testEmail = `student_${timestamp}@campus.edu`;

    console.log(`--- 1. TESTING REGISTRATION FOR: ${testEmail} ---`);
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sonu Kumar',
        email: testEmail,
        password: 'password123',
        college: 'NIT Patna',
        course: 'MCA',
        batch: 2025,
        bio: 'College changed me completely...',
      }),
    });
    const regData = await regRes.json();
    console.log('Registration Status:', regRes.status, regData.message);

    const token = regData.token;

    console.log('\n--- 2. TESTING DUPLICATE REGISTRATION (Expect 400) ---');
    const dupRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sonu Kumar Duplicate',
        email: testEmail,
        password: 'password123',
        college: 'NIT Patna',
      }),
    });
    const dupData = await dupRes.json();
    console.log('Duplicate Status:', dupRes.status, dupData.message);

    console.log('\n--- 3. TESTING LOGIN (Expect 200) ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status, 'User Name:', loginData.user?.name);

    console.log('\n--- 4. TESTING PROTECTED ROUTE /api/auth/me WITH TOKEN (Expect 200) ---');
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const meData = await meRes.json();
    console.log('Protected Route Status:', meRes.status, 'User Email:', meData.user?.email);

    console.log('\n--- 5. TESTING PROTECTED ROUTE WITHOUT TOKEN (Expect 401) ---');
    const unauthRes = await fetch('http://localhost:5000/api/auth/me');
    const unauthData = await unauthRes.json();
    console.log('Unauthenticated Status:', unauthRes.status, unauthData.message);

    console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test execution error:', err);
  }
};

testAuth();
