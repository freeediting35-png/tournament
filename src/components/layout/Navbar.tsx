import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Trophy, CalendarDays, User, BarChart3, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

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
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <>
            {/* Desktop / Tablet Top Navbar */}
            <header
                className={`hidden xl:flex fixed top-0 left-0 right-0 z-50 h-16 items-center transition-all duration-300 safe-top ${scrolled ? 'bg-bg-dark/95 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'
                    }`}
            >
                <div className="container flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-3xl">🔥</span>
                        <div>
                            <span className="font-display font-bold text-xl gradient-text">BLAZEFIRE</span>
                            <span className="font-display font-bold text-xl text-white"> ARENA</span>
                            <p className="text-text-secondary text-[10px] font-mono tracking-widest -mt-1">WHERE LEGENDS ARE MADE</p>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex items-center gap-1">
                        {NAV_ITEMS.map(item => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-4 py-2 font-display font-semibold text-sm tracking-wide transition-colors duration-150 rounded-lg ${active ? 'text-primary' : 'text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                                        />
                                    )}
                                    <span className="relative">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to="/profile" className="flex items-center gap-2 group">
                                <img
                                    src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'U')}&background=FF4500&color=fff`}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full border-2 border-primary/50 group-hover:border-primary transition-colors"
                                />
                                <div className="hidden 3xl:block">
                                    <p className="text-white text-sm font-semibold leading-tight">{user.displayName}</p>
                                    <p className="text-text-secondary text-xs font-mono">
                                        {user.freefireId ? `UID: ${user.freefireId}` : 'Link FF ID'}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <button
                                onClick={login}
                                className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                                Sign In
                            </button>
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
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ${active ? 'text-primary' : 'text-text-secondary'
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
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default Navbar;
