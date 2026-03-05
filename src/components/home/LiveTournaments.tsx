import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTournaments } from '../../hooks/useTournaments';
import TournamentCard from '../tournament/TournamentCard';
import CountdownTimer from '../ui/CountdownTimer';
import { formatCurrency } from '../../utils/formatters';
import type { Tournament } from '../../types';

type ModeFilter = 'ALL' | 'SOLO' | 'DUO' | 'SQUAD';

// Mini card for the scrolling strip
const MiniCard: React.FC<{ t: Tournament }> = ({ t }) => (
    <Link
        to={`/tournaments/${t.id}`}
        className="shrink-0 w-64 glass-surface overflow-hidden rounded-2xl border border-white/10 hover:border-primary/40 transition-all holo-card"
    >
        <div className="h-24 flex items-center justify-center text-3xl relative overflow-hidden scanlines"
            style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.2), rgba(255,215,0,0.1))' }}>
            <span className="animate-trophy-shine">🏆</span>
            {t.status === 'LIVE' && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-danger/20 border border-danger/40 rounded-full px-2 py-0.5">
                    <span className="live-dot" style={{ width: 5, height: 5 }} />
                    <span className="text-danger text-[10px] font-bold">LIVE</span>
                </div>
            )}
        </div>
        <div className="p-3">
            <p className="text-white font-display font-bold text-sm truncate">{t.title}</p>
            <div className="flex justify-between items-center mt-1">
                <span className={`badge-${t.mode.toLowerCase()} text-[10px]`}>{t.mode}</span>
                <span className="text-secondary font-bold text-xs">{formatCurrency(t.prizePool)}</span>
            </div>
            <div className="mt-2">
                <CountdownTimer targetDate={t.startDateTime} compact />
            </div>
        </div>
    </Link>
);

const FILTER_OPTIONS: { label: string; value: ModeFilter }[] = [
    { label: '🔥 ALL', value: 'ALL' },
    { label: '🎯 SOLO', value: 'SOLO' },
    { label: '👥 DUO', value: 'DUO' },
    { label: '⚔️ SQUAD', value: 'SQUAD' },
];

const LiveTournaments: React.FC<{ onRegister: (t: Tournament) => void }> = ({ onRegister }) => {
    const { tournaments } = useTournaments();
    const [activeFilter, setActiveFilter] = useState<ModeFilter>('ALL');

    const upcoming = tournaments.filter(t => t.status === 'UPCOMING' || t.status === 'LIVE');
    const liveCount = upcoming.filter(t => t.status === 'LIVE').length;

    // Filter by mode (additive — same data as before, just additionally filterable)
    const filtered = activeFilter === 'ALL'
        ? upcoming.slice(0, 6)
        : upcoming.filter(t => t.mode.toUpperCase() === activeFilter).slice(0, 6);

    if (upcoming.length === 0) return null;

    return (
        <section className="py-16 overflow-hidden">
            <div className="container mb-8">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-primary font-mono text-xs tracking-widest uppercase">Live & Upcoming</p>
                            {liveCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1.5 bg-danger/15 border border-danger/30 rounded-full px-2.5 py-0.5"
                                >
                                    <span className="live-dot" style={{ width: 6, height: 6 }} />
                                    <span className="text-danger text-[11px] font-bold font-mono">{liveCount} LIVE</span>
                                </motion.div>
                            )}
                        </div>
                        <h2 className="section-title text-white">
                            Active <span className="gradient-text">Tournaments</span>
                        </h2>
                    </div>
                    <Link to="/tournaments">
                        <button className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 self-start xl:self-auto">
                            VIEW ALL <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

                {/* Filter pills (additive — does not change data source) */}
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                    {FILTER_OPTIONS.map(opt => (
                        <motion.button
                            key={opt.value}
                            className={`filter-pill ${activeFilter === opt.value ? 'active' : ''}`}
                            onClick={() => setActiveFilter(opt.value)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {opt.label}
                        </motion.button>
                    ))}
                    <span className="text-text-secondary text-xs font-mono ml-2">
                        {activeFilter === 'ALL' ? upcoming.length : upcoming.filter(t => t.mode.toUpperCase() === activeFilter).length} tournaments
                    </span>
                </div>
            </div>

            {/* Auto-scrolling strip */}
            <div className="overflow-hidden mb-10">
                <div className="scroll-strip flex gap-4 px-4" style={{ width: 'max-content' }}>
                    {[...upcoming.slice(0, 6), ...upcoming.slice(0, 6)].map((t, i) => <MiniCard key={`${t.id}-${i}`} t={t} />)}
                </div>
            </div>

            {/* Grid below with filter animation */}
            <div className="container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        {filtered.length === 0 ? (
                            <motion.div
                                className="col-span-3 glass-surface rounded-2xl p-12 text-center border border-white/8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-4xl mb-3">🎮</p>
                                <p className="text-white font-display font-bold text-xl mb-1">No {activeFilter} Tournaments</p>
                                <p className="text-text-secondary text-sm">Check back later or try a different filter</p>
                            </motion.div>
                        ) : (
                            filtered.slice(0, 3).map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <TournamentCard tournament={t} onRegister={onRegister} />
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Section divider */}
                <div className="section-divider mt-10" />
            </div>
        </section>
    );
};

export default LiveTournaments;
