import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Trophy, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../ui/ParticleBackground';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const STATS = [
    { icon: Users, value: '50,000+', label: 'Players' },
    { icon: Trophy, value: '₹10L+', label: 'Prizes' },
    { icon: Play, value: '1,200+', label: 'Tournaments' },
    { icon: Star, value: '4.9★', label: 'Rating' },
];

const HeroSection: React.FC = () => {
    const { user, login } = useAuth();

    return (
        <section
            className="relative overflow-hidden flex items-center justify-center min-h-screen"
            style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(255,69,0,0.12) 0%, transparent 70%), var(--bg-dark)' }}
        >
            <ParticleBackground />

            {/* Glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

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
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
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
                        className="body-text text-text-secondary mb-8 max-w-xl mx-auto xl:mx-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                    >
                        <span className="text-primary font-bold">Compete. Win. Dominate.</span> Join 50,000+ Indian gamers competing for real cash prizes in Free Fire tournaments every week.
                    </motion.p>

                    {/* Stats row */}
                    <motion.div
                        className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8 max-w-lg mx-auto xl:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {STATS.map(stat => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center xl:items-start p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                                <stat.icon size={16} className="text-primary mb-1" />
                                <span className="font-display font-bold text-lg text-white leading-none">{stat.value}</span>
                                <span className="text-text-secondary text-xs">{stat.label}</span>
                            </div>
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
                </div>

                {/* Right side illustration */}
                <motion.div
                    className="hidden xl:flex flex-1 items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-gradient-hero rounded-full blur-3xl opacity-20 animate-pulse-glow" />
                        <div className="absolute inset-4 bg-bg-surface rounded-full border border-primary/30 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-8xl mb-2 animate-float">🏆</div>
                                <p className="font-display font-bold text-3xl gradient-text">WIN BIG</p>
                                <p className="text-text-secondary text-sm">Real Cash Prizes</p>
                            </div>
                        </div>
                        {/* Orbiting badges */}
                        {[
                            { emoji: '🎮', top: '5%', left: '10%', delay: 0 },
                            { emoji: '💰', top: '5%', right: '10%', delay: 0.5 },
                            { emoji: '⚡', bottom: '10%', left: '5%', delay: 1 },
                            { emoji: '🔥', bottom: '10%', right: '5%', delay: 1.5 },
                        ].map((b, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-12 h-12 bg-bg-card border border-primary/30 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                                style={{ top: b.top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom }}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: b.delay }}
                            >
                                {b.emoji}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
