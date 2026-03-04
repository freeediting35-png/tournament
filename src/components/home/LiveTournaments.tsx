import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTournaments } from '../../hooks/useTournaments';
import TournamentCard from '../tournament/TournamentCard';
import CountdownTimer from '../ui/CountdownTimer';
import { formatCurrency } from '../../utils/formatters';
import type { Tournament } from '../../types';

// Mini card for the scrolling strip
const MiniCard: React.FC<{ t: Tournament }> = ({ t }) => (
    <Link
        to={`/tournaments/${t.id}`}
        className="shrink-0 w-64 card-glass overflow-hidden rounded-xl border border-white/10 hover:border-primary/40 transition-all"
    >
        <div className="h-24 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-3xl">
            🏆
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

const LiveTournaments: React.FC<{ onRegister: (t: Tournament) => void }> = ({ onRegister }) => {
    const { tournaments } = useTournaments();
    const upcoming = tournaments.filter(t => t.status === 'UPCOMING' || t.status === 'LIVE').slice(0, 6);

    if (upcoming.length === 0) return null;

    return (
        <section className="py-16 overflow-hidden">
            <div className="container mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Live & Upcoming</p>
                        <h2 className="section-title text-white">
                            Active <span className="gradient-text">Tournaments</span>
                        </h2>
                    </div>
                    <Link to="/tournaments">
                        <button className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                            VIEW ALL <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Auto-scrolling strip */}
            <div className="overflow-hidden">
                <div className="scroll-strip flex gap-4 px-4" style={{ width: 'max-content' }}>
                    {[...upcoming, ...upcoming].map((t, i) => <MiniCard key={`${t.id}-${i}`} t={t} />)}
                </div>
            </div>

            {/* Grid below */}
            <div className="container mt-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-5">
                    {upcoming.slice(0, 3).map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <TournamentCard tournament={t} onRegister={onRegister} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LiveTournaments;
