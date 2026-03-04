import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Toast from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Eager load primary pages
import HomePage from './pages/HomePage';
import TournamentsPage from './pages/TournamentsPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load secondary pages for performance
const EventsPage = lazy(() => import('./pages/EventsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const PageLoader = () => (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <LoadingSpinner size={48} message="Loading..." />
    </div>
);

function AppRoutes() {
    // Initialize auth listener
    useAuth();

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
            <Toast />
        </BrowserRouter>
    );
}

export default App;
