import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Trophy, Star, Flame, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../ui/ParticleBackground';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTournaments } from '../../hooks/useTournaments';
import { formatCurrency } from '../../utils/formatters';

const STATS = [
    { icon: Users, value: '50,000+', label: 'Players' },
    { icon: Trophy, value: '₹10L+', label: 'Prizes' },
    { icon: Play, value: '1,200+', label: 'Tournaments' },
    { icon: Star, value: '4.9★', label: 'Rating' },
];

// Floating badge component (purely additive visual)
const FloatingBadge: React.FC<{ emoji: string; top?: string; left?: string; right?: string; bottom?: string; delay: number; label: string }> = ({ emoji, top, left, right, bottom, delay, label }) => (
    <motion.div
        className="absolute glass-surface border border-white/10 rounded-2xl flex flex-col items-center justify-center p-3 shadow-2xl min-w-[72px]"
        style={{ top, left, right, bottom }}
        animate={{ y: [0, -10, 0], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
    >
        <span className="text-2xl">{emoji}</span>
        <span className="text-[10px] text-text-secondary font-mono mt-1 whitespace-nowrap">{label}</span>
    </motion.div>
);

const HeroSection: React.FC = () => {
    const { user, login } = useAuth();
    const { tournaments } = useTournaments();

    // Get the featured / upcoming tournament for the mini card (additive)
    const featuredTournament = tournaments.find(t => t.isFeatured && t.status === 'UPCOMING') ?? tournaments.find(t => t.status === 'UPCOMING' || t.status === 'LIVE');

    return (
        <section
            className="relative overflow-hidden flex items-center justify-center min-h-screen"
            style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(255,69,0,0.12) 0%, transparent 70%), var(--bg-dark)' }}
        >
            <ParticleBackground />

            {/* Enhanced decorative blobs (additive) */}
            <div className="hero-blob-1" />
            <div className="hero-blob-2" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Scanline decoration (purely aesthetic overlay) */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,69,0,0.005) 3px, rgba(255,69,0,0.005) 4px)'
            }} />

            <div className="container relative z-10 py-16 xl:py-0 flex flex-col xl:flex-row items-center gap-12 xl:gap-16">
                {/* Text side */}
                <div className="flex-1 text-center xl:text-left">
                    {/* Live badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-full px-4 py-1.5 mb-6"
                    >
                        <span className="live-dot" />
                        <span className="text-danger text-sm font-bold tracking-wide">🔴 LIVE TOURNAMENT NOW</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        className="hero-title text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        INDIA'S MOST{' '}
                        <span className="gradient-text text-glow-orange">TRUSTED</span>
                        <br className="hidden xl:block" /> FREE FIRE
                        <br /> TOURNAMENT{' '}
                        <span className="gradient-text">PLATFORM</span>
                    </motion.h1>

                    <motion.p
                        className="body-text text-text-secondary mb-6 max-w-xl mx-auto xl:mx-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                    >
                        <span className="text-primary font-bold">Compete. Win. Dominate.</span> Join 50,000+ Indian gamers competing for real cash prizes in Free Fire tournaments every week.
                    </motion.p>

                    {/* Trust indicators (additive) */}
                    <motion.div
                        className="flex flex-wrap items-center gap-3 justify-center xl:justify-start mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.38 }}
                    >
                        {[
                            { icon: Shield, text: 'Verified Platform', color: '#00C853' },
                            { icon: Zap, text: 'Instant Payouts', color: '#FFD700' },
                            { icon: TrendingUp, text: 'Daily Tournaments', color: '#00E5FF' },
                        ].map(({ icon: Icon, text, color }) => (
                            <div key={text} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                                <Icon size={14} />
                                {text}
                            </div>
                        ))}
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8 max-w-lg mx-auto xl:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="flex flex-col items-center xl:items-start p-3 rounded-xl glass-surface border border-white/10 holo-card"
                                whileHover={{ borderColor: 'rgba(255,69,0,0.4)' }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <stat.icon size={16} className="text-primary mb-1" />
                                <span className="font-display font-bold text-lg text-white leading-none">{stat.value}</span>
                                <span className="text-text-secondary text-xs">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {user ? (
                            <Link to="/tournaments">
                                <Button variant="primary" size="lg" icon={<Flame size={20} />}>
                                    VIEW TOURNAMENTS
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="primary" size="lg" onClick={login} icon={<img src="https://www.google.com/favicon.ico" className="w-5 h-5" />}>
                                JOIN NOW — FREE
                            </Button>
                        )}
                        <Link to="/tournaments">
                            <Button variant="secondary" size="lg" icon={<ArrowRight size={20} />}>
                                VIEW TOURNAMENTS
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Featured tournament quick-join mini-card (additive) */}
                    {featuredTournament && (
                        <motion.div
                            className="mt-8 max-w-sm mx-auto xl:mx-0 glass-surface border border-primary/20 rounded-2xl p-4 flex items-center gap-4"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65 }}
                            whileHover={{ borderColor: 'rgba(255,69,0,0.5)', boxShadow: '0 0 24px rgba(255,69,0,0.15)' }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl shrink-0 animate-trophy-shine">🏆</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-primary font-mono font-bold tracking-widest uppercase">Next Tournament</p>
                                <p className="text-white font-display font-bold text-sm leading-tight truncate">{featuredTournament.title}</p>
                                <p className="text-secondary text-xs font-bold">{formatCurrency(featuredTournament.prizePool)} Prize Pool</p>
                            </div>
                            <Link to="/tournaments">
                                <motion.button
                                    className="btn-primary text-xs px-4 py-2 shrink-0"
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    JOIN
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Right side illustration */}
                <motion.div
                    className="hidden xl:flex flex-1 items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="relative w-80 h-80">
                        {/* Outer rotating ring (additive) */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: '1px solid transparent', backgroundImage: 'linear-gradient(135deg, rgba(255,69,0,0.3), rgba(255,215,0,0.3), rgba(255,69,0,0.1))', backgroundOrigin: 'border-box', backgroundClip: 'border-box' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 bg-gradient-hero rounded-full blur-3xl opacity-20 animate-pulse-glow" />
                        <div className="absolute inset-4 bg-bg-surface rounded-full border border-primary/30 flex items-center justify-center glass-ultra">
                            <div className="text-center">
                                <div className="text-8xl mb-2 animate-float animate-trophy-shine">🏆</div>
                                <p className="font-display font-bold text-3xl gradient-text">WIN BIG</p>
                                <p className="text-text-secondary text-sm">Real Cash Prizes</p>
                            </div>
                        </div>
                        {/* Orbiting badges */}
                        <FloatingBadge emoji="🎮" label="Gaming" top="5%" left="10%" delay={0} />
                        <FloatingBadge emoji="💰" label="Cash" top="5%" right="10%" delay={0.5} />
                        <FloatingBadge emoji="⚡" label="Fast" bottom="10%" left="5%" delay={1} />
                        <FloatingBadge emoji="🔥" label="Hot" bottom="10%" right="5%" delay={1.5} />
                    </div>
                </motion.div>
            </div>

            {/* Bottom scroll indicator (additive) */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-secondary hidden xl:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <p className="text-xs font-mono tracking-widest">SCROLL</p>
                <motion.div
                    className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
                    animate={{ scaleY: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.div>
        </section>
    );
};

export default HeroSection;