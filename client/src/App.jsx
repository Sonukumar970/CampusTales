import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import { GraduationCap } from 'lucide-react';

// Code-splitting via React.lazy for optimized performance & fast initial load
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Circles = lazy(() => import('./pages/Circles'));
const CircleDetails = lazy(() => import('./pages/CircleDetails'));
const StoryDetails = lazy(() => import('./pages/StoryDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const CreateStory = lazy(() => import('./pages/CreateStory'));
const EditStory = lazy(() => import('./pages/EditStory'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '13px',
                },
              }}
            />

            {/* Navigation Bar */}
            <Navbar />

            {/* Main View Routes with Suspense Fallback */}
            <main className="flex-1 pb-16 md:pb-0">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/circles" element={<Circles />} />
                  <Route path="/circles/:slug" element={<CircleDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-story"
                    element={
                      <ProtectedRoute>
                        <CreateStory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-story/:id"
                    element={
                      <ProtectedRoute>
                        <EditStory />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/stories/:id" element={<StoryDetails />} />
                  <Route path="/users/:id" element={<PublicProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav />

            {/* Global Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 hidden md:block">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-slate-400">CampusTales</span>
                  <span>— College ends. Stories stay.</span>
                </div>
                <div>MERN Stack Architecture • Resume-Ready Master Project</div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
