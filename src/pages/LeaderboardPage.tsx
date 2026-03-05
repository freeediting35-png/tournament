import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Search, TrendingUp, Zap, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Mock leaderboard data for display
const MOCK_LEADERS = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    name: ['Arjun SK', 'RahulFF', 'PriyaGamer', 'Vikram23', 'SunilKing', 'AnkitPro', 'DevFF', 'ManishG', 'SohamFire', 'RohitChamp'][i % 10],
    ffId: String(10000000 + Math.floor(Math.random() * 90000000)),
    winnings: Math.floor((20 - i) * 1500 + Math.random() * 500),
    tournaments: Math.floor(5 + Math.random() * 20),
    wins: Math.floor(1 + Math.random() * 8),
    // Additive fields for enhanced UI
    form: Array.from({ length: 5 }, () => Math.random() > 0.35 ? 'W' : 'L') as ('W' | 'L')[],
    badge: i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i < 5 ? '🔥' : i < 10 ? '⚡' : '🎮',
}));

const RANK_STYLES = [
    { icon: Trophy, color: '#FFD700', bg: 'rgba(255,215,0,0.1)', label: 'Champion', podiumClass: 'podium-gold' },
    { icon: Medal, color: '#C0C0C0', bg: 'rgba(192,192,192,0.1)', label: 'Runner Up', podiumClass: 'podium-silver' },
    { icon: Award, color: '#CD7F32', bg: 'rgba(205,127,50,0.1)', label: '3rd Place', podiumClass: 'podium-bronze' },
];

const SEASONS = ['Season 12', 'Season 11', 'Season 10', 'All Time'];

const LeaderboardPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeSeason, setActiveSeason] = useState('Season 12');

    const filtered = useMemo(() =>
        MOCK_LEADERS.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.ffId.includes(search)
        ),
        [search]
    );

    return (
        <Layout>
            <div className="container py-8 xl:py-12">
                {/* Hero header */}
                <motion.div
                    className="mb-10 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Hall of Fame</p>
                    <h1 className="section-title text-white mb-2">
                        <span className="gradient-text">Leaderboard</span>
                    </h1>
                    <p className="text-text-secondary text-sm">Top players ranked by total prize winnings on BlazeFire Arena.</p>
                </motion.div>

                {/* Season selector & search (additive controls) */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 flex-wrap">
                        {SEASONS.map(season => (
                            <motion.button
                                key={season}
                                onClick={() => setActiveSeason(season)}
                                className={`filter-pill ${activeSeason === season ? 'active' : ''}`}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {season}
                            </motion.button>
                        ))}
                    </div>

                    {/* Search (additive) */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search player or FF UID..."
                            className="input-field pl-9 py-2.5 text-sm max-w-xs"
                        />
                    </div>
                </div>

                {/* Top 3 Podium — Upgraded */}
                <motion.div
                    className="grid grid-cols-3 gap-3 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {[MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]].map((p, i) => {
                        const styleIdx = i === 1 ? 0 : i === 0 ? 1 : 2;
                        const s = RANK_STYLES[styleIdx];
                        const heightClass = i === 1 ? 'mt-0' : i === 0 ? 'mt-6' : 'mt-8';
                        const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
                        return (
                            <motion.div
                                key={p.rank}
                                className={`card-glass p-4 text-center ${s.podiumClass} ${heightClass}`}
                                style={{ border: `1px solid ${s.color}40` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: styleIdx * 0.12 }}
                                whileHover={{ y: -4 }}
                            >
                                {rank === 1 && (
                                    <div className="text-2xl mb-1 animate-float text-glow-gold">👑</div>
                                )}
                                <div
                                    className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold font-display relative"
                                    style={{ background: s.bg, border: `2px solid ${s.color}`, color: s.color }}
                                >
                                    #{rank}
                                </div>
                                <p className="text-white font-bold text-xs truncate">{p.name}</p>
                                <p className="text-text-secondary text-[10px] font-mono">{p.ffId}</p>
                                <p className="font-display font-bold mt-1" style={{ color: s.color, fontSize: '14px' }}>
                                    ₹{p.winnings.toLocaleString('en-IN')}
                                </p>
                                <p className="text-text-secondary text-[10px] mt-1">{p.wins} Wins</p>
                                <div className="form-bar justify-center mt-2">
                                    {p.form.map((f, fi) => (
                                        <div key={fi} className={`form-bar-item ${f === 'W' ? 'form-win' : 'form-loss'}`} />
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Full List */}
                <div className="card-glass overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                        <thead>
                            <tr className="text-text-secondary text-xs border-b border-white/10 bg-white/2">
                                <th className="text-left p-4">Rank</th>
                                <th className="text-left p-4">Player</th>
                                <th className="text-left p-4">FF UID</th>
                                <th className="text-right p-4">Tournaments</th>
                                <th className="text-right p-4">Wins</th>
                                <th className="text-right p-4">Win Rate</th>
                                <th className="text-right p-4">Form</th>
                                <th className="text-right p-4">Total Winnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((p, i) => {
                                    const winRate = Math.round((p.wins / p.tournaments) * 100);
                                    return (
                                        <motion.tr
                                            key={p.rank}
                                            className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer group"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            layout
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{p.badge}</span>
                                                    {p.rank <= 3
                                                        ? <span style={{ color: RANK_STYLES[p.rank - 1].color }} className="font-bold font-display text-base">#{p.rank}</span>
                                                        : <span className="text-text-secondary font-mono">#{p.rank}</span>
                                                    }
                                                </div>
                                            </td>
                                            <td className="p-4 text-white font-semibold group-hover:text-primary transition-colors">{p.name}</td>
                                            <td className="p-4 text-text-secondary font-mono text-xs">{p.ffId}</td>
                                            <td className="p-4 text-right text-text-secondary">{p.tournaments}</td>
                                            <td className="p-4 text-right text-success font-bold">{p.wins}</td>
                                            <td className="p-4 text-right">
                                                <span className="font-bold font-mono text-xs" style={{ color: winRate >= 50 ? '#00C853' : winRate >= 30 ? '#FFD600' : '#FF1744' }}>
                                                    {winRate}%
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="form-bar justify-end">
                                                    {p.form.map((f, fi) => (
                                                        <div key={fi} className={`form-bar-item ${f === 'W' ? 'form-win' : 'form-loss'}`} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-secondary font-bold font-display">₹{p.winnings.toLocaleString('en-IN')}</td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-text-secondary">
                                        <p className="text-3xl mb-2">🔍</p>
                                        <p>No players found for "{search}"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Fun stats (additive) */}
                <motion.div
                    className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {[
                        { icon: Trophy, label: 'Total Prize Distributed', value: '₹10L+', color: '#FFD700' },
                        { icon: Zap, label: 'Tournaments Hosted', value: '1,200+', color: '#FF4500' },
                        { icon: TrendingUp, label: 'Active Players', value: '50K+', color: '#00C853' },
                        { icon: Star, label: 'Avg Satisfaction', value: '4.9/5', color: '#00E5FF' },
                    ].map(s => (
                        <div key={s.label} className="glass-surface border border-white/8 rounded-2xl p-4 text-center">
                            <s.icon size={20} style={{ color: s.color }} className="mx-auto mb-2" />
                            <p className="font-display font-bold text-white text-xl">{s.value}</p>
                            <p className="text-text-secondary text-xs">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </Layout>
    );
};

export default LeaderboardPage;
