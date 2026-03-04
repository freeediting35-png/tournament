import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Mock leaderboard data for display
const MOCK_LEADERS = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    name: ['Arjun SK', 'RahulFF', 'PriyaGamer', 'Vikram23', 'SunilKing', 'AnkitPro', 'DevFF', 'ManishG', 'SohamFire', 'RohitChamp'][i % 10],
    ffId: String(10000000 + Math.floor(Math.random() * 90000000)),
    winnings: Math.floor((20 - i) * 1500 + Math.random() * 500),
    tournaments: Math.floor(5 + Math.random() * 20),
    wins: Math.floor(1 + Math.random() * 8),
}));

const RANK_STYLES = [
    { icon: Trophy, color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
    { icon: Medal, color: '#C0C0C0', bg: 'rgba(192,192,192,0.1)' },
    { icon: Award, color: '#CD7F32', bg: 'rgba(205,127,50,0.1)' },
];

const LeaderboardPage: React.FC = () => (
    <Layout>
        <div className="container py-8 xl:py-12">
            <div className="mb-8">
                <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Hall of Fame</p>
                <h1 className="section-title text-white mb-2">
                    <span className="gradient-text">Leaderboard</span>
                </h1>
                <p className="text-text-secondary text-sm">Top players ranked by total prize winnings on BlazeFire Arena.</p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-xl mx-auto">
                {[MOCK_LEADERS[1], MOCK_LEADERS[0], MOCK_LEADERS[2]].map((p, i) => {
                    const styleIdx = i === 1 ? 0 : i === 0 ? 1 : 2;
                    const s = RANK_STYLES[styleIdx];
                    return (
                        <motion.div
                            key={p.rank}
                            className="card-glass p-4 text-center"
                            style={{ border: `1px solid ${s.color}40` }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: styleIdx * 0.1 }}
                        >
                            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold font-display" style={{ background: s.bg, border: `2px solid ${s.color}`, color: s.color }}>
                                #{i === 1 ? '1' : i === 0 ? '2' : '3'}
                            </div>
                            <p className="text-white font-bold text-xs truncate">{p.name}</p>
                            <p className="text-text-secondary text-[10px] font-mono">{p.ffId}</p>
                            <p className="font-display font-bold mt-1" style={{ color: s.color, fontSize: '14px' }}>
                                ₹{p.winnings.toLocaleString('en-IN')}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Full List */}
            <div className="card-glass overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                    <thead>
                        <tr className="text-text-secondary text-xs border-b border-white/10">
                            <th className="text-left p-4">Rank</th>
                            <th className="text-left p-4">Player</th>
                            <th className="text-left p-4">FF UID</th>
                            <th className="text-right p-4">Tournaments</th>
                            <th className="text-right p-4">Wins</th>
                            <th className="text-right p-4">Total Winnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_LEADERS.map((p, i) => (
                            <motion.tr
                                key={p.rank}
                                className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <td className="p-4">
                                    {p.rank <= 3
                                        ? <span style={{ color: RANK_STYLES[p.rank - 1].color }} className="font-bold font-display text-base">#{p.rank}</span>
                                        : <span className="text-text-secondary font-mono">#{p.rank}</span>
                                    }
                                </td>
                                <td className="p-4 text-white font-semibold">{p.name}</td>
                                <td className="p-4 text-text-secondary font-mono text-xs">{p.ffId}</td>
                                <td className="p-4 text-right text-text-secondary">{p.tournaments}</td>
                                <td className="p-4 text-right text-success font-bold">{p.wins}</td>
                                <td className="p-4 text-right text-secondary font-bold font-display">₹{p.winnings.toLocaleString('en-IN')}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </Layout>
);

export default LeaderboardPage;
