const User = require('../models/User');
const Story = require('../models/Story');
const Memory = require('../models/Memory');
const Circle = require('../models/Circle');

const seedStoriesData = async () => {
  try {
    console.log('--- SEEDING DATABASE WITH AUTHENTIC STORIES ---');

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ Database not ready. Skipping seed.');
      return;
    }

    // 1. Ensure seed users exist with deterministic IDs
    let sonu = await User.findOne({ email: 'sonu@campus.edu' });
    if (!sonu) {
      sonu = await User.create({
        _id: new mongoose.Types.ObjectId('650000000000000000000001'),
        name: 'Sonu Kumar',
        email: 'sonu@campus.edu',
        password: 'password123',
        college: 'NIT Patna',
        course: 'MCA',
        batch: 2025,
        bio: 'College taught me that late nights make the longest memories.',
        profileImage:
          'https://api.dicebear.com/7.x/initials/svg?seed=Sonu%20Kumar&backgroundColor=6366f1',
      });
    }

    let riya = await User.findOne({ email: 'riya@campus.edu' });
    if (!riya) {
      riya = await User.create({
        _id: new mongoose.Types.ObjectId('650000000000000000000002'),
        name: 'Riya Sharma',
        email: 'riya@campus.edu',
        password: 'password123',
        college: 'Delhi University',
        course: 'B.A. Literature',
        batch: 2024,
        bio: 'Finding poetry in every corner of North Campus.',
        profileImage:
          'https://api.dicebear.com/7.x/initials/svg?seed=Riya%20Sharma&backgroundColor=ec4899',
      });
    }

    let arjun = await User.findOne({ email: 'arjun@campus.edu' });
    if (!arjun) {
      arjun = await User.create({
        _id: new mongoose.Types.ObjectId('650000000000000000000003'),
        name: 'Arjun Verma',
        email: 'arjun@campus.edu',
        password: 'password123',
        college: 'IIT Delhi',
        course: 'B.Tech CSE',
        batch: 2026,
        bio: 'Coding by day, playing guitar by night.',
        profileImage:
          'https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Verma&backgroundColor=10b981',
      });
    }

    // 2. Check if stories already seeded
    const existingCount = await Story.countDocuments();
    if (existingCount >= 6) {
      console.log(`Database already has ${existingCount} stories. Skipping duplicate seeding.`);
      return;
    }

    // 3. Sample Stories
    const storiesToInsert = [
      {
        author: sonu._id,
        title: 'How I Met My Best Friend on Orientation Day',
        description:
          'We both got hopelessly lost searching for Lab 3 and ended up sharing cold samosas at the canteen stairs.',
        content: `It was my very first hour on campus. The place felt gigantic, intimidating, and loud. Everyone seemed to know each other or look confident, while I was clutching a damp orientation map looking for Computer Lab 3.

Suddenly, a guy bumped into me with three heavy bags. We both apologized at the same time, glanced at each other's schedules, and realized neither of us had a clue where we were going.

Instead of panicking, we gave up and sat on the canteen stairs. That day, over two samosas and lukewarm chai, we shared our fears of hostel life, leaving home, and surviving engineering mathematics. 

Four years later, he is still the first person I call whenever something good or bad happens. College ends soon, but that canteen staircase will forever hold the beginning of our brotherhood.`,
        category: 'Friendship',
        mood: '😊 Nostalgic',
        location: 'Central Canteen Stairs',
        eventDate: new Date('2021-08-15'),
        isAnonymous: false,
        likesCount: 184,
        commentsCount: 28,
        status: 'published',
      },
      {
        author: sonu._id,
        title: 'The 3 AM Maggi That Saved My Semester',
        description:
          'Five hours before the Digital Electronics end-sem, four of us were staring at blank notes around an illegal kettle.',
        content: `It was 2:45 AM. The hostel was eerily quiet except for the periodic murmurs coming from room 208. We had the toughest end-sem exam at 9:00 AM, and none of us understood Karnaugh maps or flip-flop counters.

Morale was below zero. Then Aman whispered: "Wait, I have two packets of Maggi and a clandestine heating rod."

We locked the door, pulled the curtains so the hostel warden wouldn't spot the glow, and cooked the noodles in an old steel mug. That warm steam and aromatic masala instantly broke the tension. We laughed so hard our ribs hurt, took a 20-minute breather, and suddenly concepts started clicking.

We all cleared that paper with respectable marks. Whenever I smell Maggi late at night now, I am instantly teleported back to room 208 with three sleep-deprived engineers who refused to give up.`,
        category: 'Memories',
        mood: '😂 Hilarious',
        location: 'Hostel Block B, Room 208',
        eventDate: new Date('2023-11-20'),
        isAnonymous: false,
        likesCount: 312,
        commentsCount: 47,
        status: 'published',
      },
      {
        author: riya._id,
        title: 'The Library Girl at Window Table 7',
        description:
          'Every Tuesday afternoon, she sat by the corner reading philosophy. I never spoke a word, but she inspired my best semester.',
        content: `I don't think she ever knew my name. Every Tuesday and Thursday at 3:15 PM, she would sit at the wooden table by the window in the second-floor library, right where the afternoon sunlight painted golden patterns on the oak floor.

She was always reading deeply — Sartre, Camus, or thick history volumes — with pencil notes in the margins. I started arriving early just to sit two desks away, pretending to solve calculus problems.

Her quiet focus made me focus. In a way, having a silent study partner kept me anchored during my loneliest semester after moving cities. I never gathered the courage to ask her out or say more than a polite nod. 

Last week, I saw her pick up her degree at convocation. Some stories don't need a happily-ever-after; their beauty lies in how they gently touched your life in passing.`,
        category: 'Love',
        mood: '❤️ In Love',
        location: 'Central Library, 2nd Floor',
        eventDate: new Date('2024-03-10'),
        isAnonymous: true,
        likesCount: 420,
        commentsCount: 65,
        status: 'published',
      },
      {
        author: arjun._id,
        title: 'Manali Trek With Zero Budget and Five Idiots',
        description:
          'A spontaneous weekend decision that started on a state transport bus and gave us the greatest memories of our youth.',
        content: `It started on a Thursday evening after a cancelled Friday lab. Someone said: "What if we just board the night bus to Himachal right now?" 

Within 45 minutes, five of us pooled whatever cash was left in our wallets — around 3,200 rupees each. We had zero reservations, one borrowed backpack, and jackets that barely kept out a breeze.

We shivered through the mountain night, survived on Maggi and momos, slept in a cramped homestay attic, and trekked up to a secluded waterfall singing 90s Bollywood songs at the top of our lungs.

Looking back, we had no money, but we felt richer than we ever have since. You can travel later with salary and luxury hotels, but nothing ever replaces the wild freedom of an unplanned college trip with your boys.`,
        category: 'Trips',
        mood: '🥳 Excited',
        location: 'Old Manali, Himachal Pradesh',
        eventDate: new Date('2023-04-14'),
        isAnonymous: false,
        likesCount: 265,
        commentsCount: 33,
        status: 'published',
      },
      {
        author: riya._id,
        title: 'Saying Goodbye to Room 304',
        description:
          'Packing the cardboard boxes for the last time felt heavier than all 4 years combined.',
        content: `The walls still had marks where our festival fairy lights used to hang. The door had our height measurements scratched in pencil from second year. The balcony where we spent countless nights discussing future dreams was now empty and echoing.

Handing the room key back to the warden felt like handing over a piece of our souls. We promised each other that we would stay in touch every week, that nothing would change.

We all knew things would change. Careers, new cities, different time zones were waiting outside the gate. But standing there in the empty room with our suitcases, we held onto that final hug a little longer, knowing we had truly lived.`,
        category: 'Heartbreak',
        mood: '🥺 Emotional',
        location: 'Girls Hostel 2, Room 304',
        eventDate: new Date('2024-05-30'),
        isAnonymous: false,
        likesCount: 389,
        commentsCount: 52,
        status: 'published',
      },
      {
        author: arjun._id,
        title: 'From 4 Backlogs to My Dream Tech Offer',
        description:
          'When everyone wrote me off in 3rd semester, late nights and a mentor friend turned my entire life around.',
        content: `Second year hit me like a freight train. In December 2022, my grade sheet had four red crosses. I was terrified of facing my parents, embarrassed to look my batchmates in the eye, and on the verge of giving up.

One evening, our senior hostel brother came into my room, saw my tear-stained face, tore up my self-pity, and made a daily 4-hour timetable for me. He sat with me through Data Structures from scratch.

For the next 14 months, I lived in the computer lab. I coded through weekends and sacrificed festivals. When the placement season arrived in 7th sem, I cleared all 4 rounds and received an offer letter from a top tech firm.

To anyone feeling stuck right now in college: one bad semester does not define your life. Keep your head down and keep pushing.`,
        category: 'Growth',
        mood: '🌱 Inspired',
        location: 'Department of Computer Science',
        eventDate: new Date('2024-09-05'),
        isAnonymous: false,
        likesCount: 512,
        commentsCount: 89,
        status: 'published',
      },
      {
        author: sonu._id,
        title: 'When Our Proxy Roll Call Backfired Epically',
        description:
          'Professor Sharma knew our voices better than our mothers did. What happened next became college legend.',
        content: `Attendance was at 68% and the debarment cutoff was 75%. Rohit was fast asleep in the hostel, so naturally, I volunteered to take his proxy roll call in Environmental Science.

The lecture hall was packed with 120 students. When Professor Sharma called out "Roll 42 — Rohit Verma", I pitched my voice down and shouted a confident "Present, Sir!"

Two seconds later, he called "Roll 43 — Sonu Kumar". Without thinking, I immediately shouted "Present, Sir!" in the exact same voice.

The entire hall went dead silent. The professor slowly lowered his spectacles, stared straight into my soul, and said: "Sonu, I didn't know you had a twin brother in the exact same seat." The whole class erupted into a roar of laughter that was heard across the academic block.`,
        category: 'Funny',
        mood: '😂 Hilarious',
        location: 'Lecture Hall Complex 4',
        eventDate: new Date('2023-02-18'),
        isAnonymous: true,
        likesCount: 298,
        commentsCount: 41,
        status: 'published',
      },
    ];

    await Story.insertMany(storiesToInsert);
    console.log(`✅ Successfully seeded ${storiesToInsert.length} stories!`);

    // 4. Seed Memory Milestones
    const memoryCount = await Memory.countDocuments();
    if (memoryCount === 0) {
      const allStories = await Story.find();
      const storyByTitle = (title) => allStories.find((s) => s.title.includes(title))?._id;

      const milestonesToInsert = [
        {
          user: sonu._id,
          title: 'First Day on Campus & Lost Map',
          academicYear: '1st Year',
          semester: 'Sem 1',
          eventDate: new Date('2021-08-15'),
          milestoneType: 'Orientation 🎓',
          location: 'Central Canteen Stairs',
          description: 'Bumped into my best friend while searching for Computer Lab 3. Shared samosas and fears of engineering math.',
          linkedStory: storyByTitle('Orientation Day'),
        },
        {
          user: sonu._id,
          title: 'The 3 AM Maggi That Saved End-Sems',
          academicYear: '2nd Year',
          semester: 'Sem 3',
          eventDate: new Date('2023-11-20'),
          milestoneType: 'Hostel Life 🏢',
          location: 'Hostel Block B, Room 208',
          description: 'Five hours before Digital Electronics, four of us cooked contraband Maggi around a heating rod.',
          linkedStory: storyByTitle('3 AM Maggi'),
        },
        {
          user: sonu._id,
          title: 'The Legendary Proxy Roll Call',
          academicYear: '2nd Year',
          semester: 'Sem 4',
          eventDate: new Date('2023-02-18'),
          milestoneType: 'Exams & Sems 📚',
          location: 'Lecture Hall Complex 4',
          description: 'Gave proxy for my roommate in the exact same voice right after my own roll call. Whole hall erupted.',
          linkedStory: storyByTitle('Proxy Roll Call'),
        },
        {
          user: riya._id,
          title: 'Quiet Study Sessions by Window Table 7',
          academicYear: '2nd Year',
          semester: 'Sem 3',
          eventDate: new Date('2024-03-10'),
          milestoneType: 'Orientation 🎓',
          location: 'Central Library, 2nd Floor',
          description: 'Sunny afternoons reading Sartre while sunlight lit up the oak desks.',
          linkedStory: storyByTitle('Window Table 7'),
        },
        {
          user: riya._id,
          title: 'Final Hug & Handing Over Room 304 Keys',
          academicYear: 'Final Year',
          semester: 'Sem 8',
          eventDate: new Date('2024-05-30'),
          milestoneType: 'Farewell 🌅',
          location: 'Girls Hostel 2, Room 304',
          description: 'Packing boxes with teary eyes after 4 incredible years of shared laughter.',
          linkedStory: storyByTitle('Goodbye to Room 304'),
        },
        {
          user: arjun._id,
          title: 'Spontaneous Manali Trip With College Gang',
          academicYear: '2nd Year',
          semester: 'Sem 4',
          eventDate: new Date('2023-04-14'),
          milestoneType: 'Road Trip ✈️',
          location: 'Old Manali, Himachal Pradesh',
          description: '3,200 rupees each, zero hotel bookings, singing 90s songs under Himachal stars.',
          linkedStory: storyByTitle('Manali Trek'),
        },
        {
          user: arjun._id,
          title: 'Clearing 4 Rounds & Getting My Dream Tech Offer',
          academicYear: 'Final Year',
          semester: 'Sem 7',
          eventDate: new Date('2024-09-05'),
          milestoneType: 'Placements 💼',
          location: 'Department of Computer Science',
          description: 'After struggling in 3rd semester, 14 months of hard work turned everything around.',
          linkedStory: storyByTitle('Backlogs to My Dream Tech Offer'),
        },
      ];

      await Memory.insertMany(milestonesToInsert);
      console.log(`✅ Successfully seeded ${milestonesToInsert.length} college milestones!`);
    }

    // 5. Seed Campus Circles / Micro-Communities
    const existingCircles = await Circle.countDocuments();
    if (existingCircles === 0) {
      console.log('Seeding initial Campus Circles...');
      const circlesToInsert = [
        {
          name: 'Hostel Block B Legends',
          slug: 'hostel-block-b-legends',
          description:
            'The late-night chai, ungodly exam cramming, room 208 Maggi club, and terrace gossips of Block B.',
          category: 'Hostel 🏢',
          college: 'NIT Patna',
          icon: '🏢',
          coverGradient: 'from-amber-500/20 via-orange-500/20 to-rose-500/20',
          creator: sonu._id,
          members: [sonu._id, arjun._id],
          storyCount: 1,
          isPublic: true,
        },
        {
          name: 'Code & Coffee Club',
          slug: 'code-and-coffee-club',
          description:
            'From debugging segmentation faults at 3 AM to landing dream tech internships. All campus coders welcome.',
          category: 'Tech & Coding 💻',
          college: 'All Campuses',
          icon: '💻',
          coverGradient: 'from-indigo-600/20 via-sky-600/20 to-cyan-600/20',
          creator: arjun._id,
          members: [arjun._id, sonu._id],
          storyCount: 1,
          isPublic: true,
        },
        {
          name: 'North Campus Lit & Chai Society',
          slug: 'north-campus-lit-society',
          description:
            'Window Table 7 reflections, poetry by the lawns, library silence, and deep conversations over masala chai.',
          category: 'Arts & Lit 🎭',
          college: 'Delhi University',
          icon: '📖',
          coverGradient: 'from-rose-500/20 via-pink-500/20 to-purple-500/20',
          creator: riya._id,
          members: [riya._id, sonu._id],
          storyCount: 1,
          isPublic: true,
        },
        {
          name: 'Late Night Canteen Adda',
          slug: 'late-night-canteen-adda',
          description:
            'Cold samosas, endless discussions on life after college, proxy planning, and bunking lectures.',
          category: 'Canteen & Chill ☕',
          college: 'All Campuses',
          icon: '☕',
          coverGradient: 'from-yellow-500/20 via-amber-500/20 to-orange-500/20',
          creator: sonu._id,
          members: [sonu._id, riya._id, arjun._id],
          storyCount: 1,
          isPublic: true,
        },
        {
          name: 'Placement & Career Warriors',
          slug: 'placement-career-warriors',
          description:
            'Aptitude prep, resume reviews, interview horror stories, and celebrating every single offer letter.',
          category: 'Placements & Career 💼',
          college: 'All Campuses',
          icon: '💼',
          coverGradient: 'from-emerald-500/20 via-teal-500/20 to-sky-500/20',
          creator: arjun._id,
          members: [arjun._id, sonu._id],
          storyCount: 0,
          isPublic: true,
        },
        {
          name: 'Unplugged Jamming & Music Guild',
          slug: 'unplugged-jamming-guild',
          description:
            'Acoustic guitar chords echoing across hostel lawns, fest rehearsals, and midnight singing circles.',
          category: 'Music & Jam 🎸',
          college: 'IIT Delhi',
          icon: '🎸',
          coverGradient: 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
          creator: arjun._id,
          members: [arjun._id, riya._id],
          storyCount: 0,
          isPublic: true,
        },
      ];

      const insertedCircles = await Circle.insertMany(circlesToInsert);
      console.log(`✅ Seeded ${insertedCircles.length} Campus Circles!`);

      // Associate stories with circles
      const hostelCircle = insertedCircles.find((c) => c.slug === 'hostel-block-b-legends');
      const codingCircle = insertedCircles.find((c) => c.slug === 'code-and-coffee-club');
      const litCircle = insertedCircles.find((c) => c.slug === 'north-campus-lit-society');
      const canteenCircle = insertedCircles.find((c) => c.slug === 'late-night-canteen-adda');

      if (hostelCircle) {
        await Story.updateOne({ title: { $regex: '3 AM Maggi', $options: 'i' } }, { circle: hostelCircle._id });
      }
      if (codingCircle) {
        await Story.updateOne({ title: { $regex: 'Dream Tech Offer', $options: 'i' } }, { circle: codingCircle._id });
      }
      if (litCircle) {
        await Story.updateOne({ title: { $regex: 'Window Table 7', $options: 'i' } }, { circle: litCircle._id });
      }
      if (canteenCircle) {
        await Story.updateOne({ title: { $regex: 'Proxy Roll Call', $options: 'i' } }, { circle: canteenCircle._id });
      }
      console.log('✅ Associated stories with campus circles!');
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

module.exports = seedStoriesData;
