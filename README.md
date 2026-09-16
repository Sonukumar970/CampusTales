# 🎓 CampusTales

> **"College ends. Stories stay."**  
> A high-performance, social storytelling & 4-year memory preservation platform built with the **MERN Stack** (MongoDB, Express.js, React 19, Node.js) and styled with modern dark-mode glassmorphism.

---

## 🌟 Overview

**CampusTales** is a centralized social platform where students and alumni preserve, explore, and cherish their college memories—from late-night hostel Maggi and canteen bunks, to orientation jitters, heartbreaks, placements, and convocation tears.

### 💡 Core Highlights
- **🎭 Anonymous vs. Public Publishing**: Full privacy protection for vulnerable stories with anonymous masking.
- **📚 4-Year Journey Roadmap**: Vertical interactive timeline where students plot milestones across semesters (Sem 1 to Sem 8).
- **🏢 Campus Circles (Micro-Communities)**: Dedicated sub-communities for hostel wings, coding clubs, literary societies, and canteen gangs.
- **🏆 Gamified Badges System**: Dynamic achievement calculation (*Campus Fresher*, *Storyteller*, *Campus Legend*, *Hostel Chronicler*, *Milestone Pioneer*).
- **⚡ Performance & Code-Splitting**: Routes lazy-loaded with React Suspense, responsive sticky bottom navigation for mobile phones, and Error Boundary safeguards.

---

## 🏗️ Technical Architecture

```
CampusTales/
├── package.json              # Root script runner (concurrently backend & frontend)
├── README.md
├── client/                   # Frontend SPA (Vite + React 19 + Tailwind CSS + Lucide Icons)
│   ├── public/
│   ├── src/
│   │   ├── components/       # StoryCard, MemoryTimeline, BadgesShowcase, MobileBottomNav, Navbar, Modals
│   │   ├── context/          # AuthContext (JWT state, persistent sessions)
│   │   ├── pages/            # Home, Explore, Circles, CircleDetails, StoryDetails, Profile, PublicProfile, CreateStory, EditStory, NotFound
│   │   ├── services/         # Axios API Client with Bearer token interceptor
│   │   ├── App.jsx           # Lazy-loaded code-split routes with ErrorBoundary
│   │   └── main.jsx
│   ├── index.html            # Rich OpenGraph & Twitter Card SEO metadata
│   └── vite.config.js
└── server/                   # Backend REST API (Node.js + Express + Mongoose)
    ├── config/               # Database connection with MongoMemoryServer fallback
    ├── controllers/          # Business logic handlers (story, auth, circle, memory, user)
    ├── middleware/           # JWT protect, optionalAuth, errorHandler, notFound
    ├── models/               # User, Story, Memory, Circle, Like, Comment, Save
    ├── routes/               # Modular route definitions mounted at /api/*
    ├── scripts/              # Seeders & Automated Verification scripts (verifyMasterProject.js)
    ├── utils/                # badgeCalculator.js
    └── server.js             # Express entry point
```

---

## 🚀 10 Phases of Development

| Phase | Milestone | Key Deliverables |
|:---|:---|:---|
| **Phase 1** | **Foundation & Setup** | Express server, Vite React client, `/api/health`, in-memory MongoDB fallback. |
| **Phase 2** | **Authentication System** | User model, bcrypt hashing, JWT auth, Register/Login/Me APIs, AuthContext. |
| **Phase 3** | **Story Engine** | Story model, multi-step `CreateStory.jsx`, anonymous privacy masking (`Anonymous 🎭`). |
| **Phase 4** | **Feed & Discovery** | Filter chips, search with debounce, `StoryCard.jsx`, seed data. |
| **Phase 5** | **Social Features** | Like, Comment, Save models, real-time counters, discussion threads. |
| **Phase 6** | **Profile Customization** | EditProfileModal (DiceBear avatars, bio), Public Profile (`/users/:id`). |
| **Phase 7** | **Campus Filtering Engine** | `/api/stories/colleges` aggregation, compound filters (Campus + Mood + Batch). |
| **Phase 8** | **Memories & Milestones** | `Memory.js`, chronological vertical roadmap, linked stories. |
| **Phase 9** | **Campus Circles & Badges** | `Circle.js`, micro-community feeds, 7 gamified badges with progress bars. |
| **Phase 10** | **Polish & Production** | Route code-splitting (Vite chunks < 40kB), mobile bottom nav, 404 page, ErrorBoundary. |

---

## 🔑 Demo Seed Accounts

To test the application immediately, the database is pre-seeded with authentic student profiles:

| Name | College | Email | Password | Role |
|:---|:---|:---|:---|:---|
| **Sonu Kumar** | NIT Patna (MCA '25) | `sonu@campus.edu` | `password123` | Student / Storyteller |
| **Riya Sharma** | Delhi University (Literature '24) | `riya@campus.edu` | `password123` | Student / Poet |
| **Arjun Verma** | IIT Delhi (CSE '26) | `arjun@campus.edu` | `password123` | Student / Coder |

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **MongoDB**: Local MongoDB instance OR automatic in-memory MongoDB fallback (zero-configuration required).

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Start Development Server
```bash
# Concurrently launch Backend (port 5000) and Frontend (port 5173):
npm run dev
```

### 4. Build for Production
```bash
cd client && npm run build
```

---

## 🧪 Master Verification

Run the comprehensive end-to-end verification script testing all 10 phases simultaneously:
```bash
node server/scripts/verifyMasterProject.js
```

---

## 📄 License
MIT License. Built with passion for college memories that never fade.
