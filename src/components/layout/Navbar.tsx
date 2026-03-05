import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, CalendarDays, User, BarChart3, Bell, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTournaments } from '../../hooks/useTournaments';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tournaments', label: 'Tournaments', icon: Trophy },
    { path: '/events', label: 'Events', icon: CalendarDays },
    { path: '/leaderboard', label: 'Leaders', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
];

const Navbar: React.FC = () => {
    const location = useLocation();
    const { user, login } = useAuth();
    const { tournaments } = useTournaments();
    const [scrolled, setScrolled] = React.useState(false);
    const [notifOpen, setNotifOpen] = React.useState(false);

    const liveCount = tournaments.filter(t => t.status === 'LIVE').length;
    const upcomingCount = tournaments.filter(t => t.status === 'UPCOMING').length;

    React.useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    // Close notif dropdown on outside click
    React.useEffect(() => {
        if (!notifOpen) return;
        const handler = () => setNotifOpen(false);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [notifOpen]);

    return (
        <>
            {/* Desktop / Tablet Top Navbar */}
            <header
                className={`hidden xl:flex fixed top-0 left-0 right-0 z-50 h-16 items-center transition-all duration-500 safe-top ${
                    scrolled ? 'glass-nav' : 'bg-transparent'
                }`}
            >
                <div className="container flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.span
                            className="text-3xl"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                        >
                            🔥
                        </motion.span>
                        <div>
                            <span className="font-display font-bold text-xl gradient-text">BLAZEFIRE</span>
                            <span className="font-display font-bold text-xl text-white"> ARENA</span>
                            <p className="text-text-secondary text-[10px] font-mono tracking-widest -mt-1">WHERE LEGENDS ARE MADE</p>
                        </div>
                    </Link>

                    {/* Live Tournament Banner (additive) */}
                    {liveCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-full px-3 py-1"
                        >
                            <span className="live-dot" />
                            <span className="text-danger text-xs font-bold tracking-wide font-mono">
                                {liveCount} LIVE NOW
                            </span>
                        </motion.div>
                    )}

                    {/* Nav Links */}
                    <nav className="flex items-center gap-1">
                        {NAV_ITEMS.map(item => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-4 py-2 font-display font-semibold text-sm tracking-wide transition-colors duration-150 rounded-lg ${
                                        active ? 'text-primary' : 'text-text-secondary hover:text-white'
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                                        />
                                    )}
                                    <span className="relative">{item.label}</span>
                                    {/* Tournament count badge (additive) */}
                                    {item.path === '/tournaments' && upcomingCount > 0 && (
                                        <span className="absolute -top-1 -right-1 notif-badge" style={{ fontSize: '9px', minWidth: '14px', height: '14px' }}>
                                            {upcomingCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {/* Notification Bell (additive) */}
                        {user && (
                            <div className="relative" onClick={e => { e.stopPropagation(); setNotifOpen(v => !v); }}>
                                <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10">
                                    <Bell size={18} className="text-text-secondary" />
                                </button>
                                {liveCount > 0 && <span className="notif-badge">{liveCount}</span>}
                                <AnimatePresence>
                                    {notifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-11 w-72 glass-ultra border border-white/10 rounded-2xl p-4 shadow-2xl"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <p className="font-display font-bold text-white text-sm mb-3 flex items-center gap-2">
                                                <Zap size={14} className="text-primary" /> Notifications
                                            </p>
                                            {liveCount > 0 ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-danger/10 border border-danger/20">
                                                        <span className="live-dot mt-1" />
                                                        <div>
                                                            <p className="text-white text-xs font-bold">{liveCount} Tournament{liveCount > 1 ? 's' : ''} LIVE!</p>
                                                            <p className="text-text-secondary text-[11px]">Join now before slots fill up</p>
                                                        </div>
                                                    </div>
                                                    {upcomingCount > 0 && (
                                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20">
                                                            <span className="text-warning text-sm">⏰</span>
                                                            <div>
                                                                <p className="text-white text-xs font-bold">{upcomingCount} Upcoming Tournaments</p>
                                                                <p className="text-text-secondary text-[11px]">Register before slots run out</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-text-secondary text-xs text-center py-4">No new notifications</p>
                                            )}
                                            <Link to="/tournaments" className="block mt-3">
                                                <button className="btn-primary w-full text-xs py-2">View All Tournaments</button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {user ? (
                            <Link to="/profile" className="flex items-center gap-2 group">
                                <div className="avatar-gradient-border">
                                    <img
                                        src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'U')}&background=FF4500&color=fff`}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                                <div className="hidden 3xl:block">
                                    <p className="text-white text-sm font-semibold leading-tight">{user.displayName}</p>
                                    <p className="text-text-secondary text-xs font-mono">
                                        {user.freefireId ? `UID: ${user.freefireId}` : 'Link FF ID'}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <motion.button
                                onClick={login}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-primary btn-glow-sweep px-5 py-2.5 text-sm flex items-center gap-2"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                                Sign In
                            </motion.button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Tab Bar */}
            <nav
                className="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-bg-card/95 backdrop-blur-md border-t border-white/10 safe-bottom"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)', height: '64px' }}
            >
                {NAV_ITEMS.map(item => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all relative ${
                                active ? 'text-primary' : 'text-text-secondary'
                            }`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="mobile-nav-active"
                                    className="absolute w-10 h-0.5 bg-primary rounded-full -top-px"
                                />
                            )}
                            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                            {/* Live badge for tournaments tab on mobile */}
                            {item.path === '/tournaments' && liveCount > 0 && (
                                <span className="absolute top-0 right-0 notif-badge" style={{ fontSize: '8px', minWidth: '12px', height: '12px' }}>
                                    {liveCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default Navbar;
