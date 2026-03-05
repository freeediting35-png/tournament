/**
 * AiPredictor — Additive gamification feature (new)
 * A "Predict & Win" module where spectators can guess tournament winners
 * using a fun point system. Purely additive — no existing features touched.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Trophy, TrendingUp, CheckCircle2, Star } from 'lucide-react';
import { useTournaments } from '../../hooks/useTournaments';

// Mock players for prediction (in production, these come from tournament registrations)
const MOCK_PLAYER_POOLS = [
    ['Team Alpha', 'Team Blaze', 'Squad Kings', 'Fire Wolves'],
    ['ArjunSK', 'RahulFF', 'PriyaGamer', 'Vikram23'],
    ['NightOwls', 'DayBreakers', 'Storm Squad', 'Iron Clad'],
];

interface Prediction {
    tournamentId: string;
    pick: string;
    points: number;
    timestamp: number;
}

const POINTS_OPTIONS = [10, 25, 50, 100];

const AiPredictor: React.FC = () => {
    const { tournaments } = useTournaments();
    const liveOrUpcoming = tournaments.filter(t => t.status === 'LIVE' || t.status === 'UPCOMING').slice(0, 3);

    const [selectedTournamentIdx, setSelectedTournamentIdx] = useState(0);
    const [selectedPick, setSelectedPick] = useState<string | null>(null);
    const [selectedPoints, setSelectedPoints] = useState(25);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [justPredicted, setJustPredicted] = useState(false);
    const [totalPoints, setTotalPoints] = useState(500); // starting balance

    const selectedTournament = liveOrUpcoming[selectedTournamentIdx];
    const playerPool = MOCK_PLAYER_POOLS[selectedTournamentIdx % MOCK_PLAYER_POOLS.length];

    // Mock AI confidence scores (additive visual element)
    const confidenceScores = React.useMemo(() => {
        const scores = playerPool.map(() => Math.floor(Math.random() * 60 + 20));
        const total = scores.reduce((a, b) => a + b, 0);
        return scores.map(s => Math.round((s / total) * 100));
    }, [selectedTournamentIdx]);

    const handlePredict = () => {
        if (!selectedPick || !selectedTournament || selectedPoints > totalPoints) return;
        setIsAnalyzing(true);

        // Simulate AI analysis delay
        setTimeout(() => {
            const newPrediction: Prediction = {
                tournamentId: selectedTournament.id,
                pick: selectedPick,
                points: selectedPoints,
                timestamp: Date.now(),
            };
            setPredictions(prev => [newPrediction, ...prev.slice(0, 4)]);
            setTotalPoints(prev => prev - selectedPoints);
            setIsAnalyzing(false);
            setJustPredicted(true);
            setSelectedPick(null);
            setTimeout(() => setJustPredicted(false), 3000);
        }, 1800);
    };

    if (liveOrUpcoming.length === 0) return null;

    return (
        <section className="py-16 overflow-hidden">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-4 py-1.5 mb-4">
                        <Brain size={14} className="text-accent" />
                        <span className="text-accent text-xs font-bold tracking-wide font-mono">AI POWERED</span>
                    </div>
                    <h2 className="section-title text-white mb-3">
                        Predict <span className="gradient-text">& Win</span>
                    </h2>
                    <p className="body-text text-text-secondary max-w-lg mx-auto">
                        Use your prediction points to guess tournament winners. Earn bonus points when you're right!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Predictor Panel */}
                    <motion.div
                        className="xl:col-span-2 glass-ultra border border-white/10 rounded-2xl p-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Tournament selector */}
                        <div className="mb-6">
                            <p className="text-text-secondary text-xs font-mono tracking-widest uppercase mb-3">Select Tournament</p>
                            <div className="flex gap-2 flex-wrap">
                                {liveOrUpcoming.map((t, i) => (
                                    <motion.button
                                        key={t.id}
                                        onClick={() => { setSelectedTournamentIdx(i); setSelectedPick(null); }}
                                        className={`filter-pill ${selectedTournamentIdx === i ? 'active' : ''}`}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {t.status === 'LIVE' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger mr-1 animate-pulse" />}
                                        {t.title.slice(0, 20)}{t.title.length > 20 ? '...' : ''}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Pick your winner */}
                        <div className="mb-6">
                            <p className="text-text-secondary text-xs font-mono tracking-widest uppercase mb-3">
                                Pick the Winner
                                <span className="ml-2 text-accent normal-case">— AI Confidence Scores</span>
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {playerPool.map((player, i) => {
                                    const conf = confidenceScores[i];
                                    const isSelected = selectedPick === player;
                                    return (
                                        <motion.button
                                            key={player}
                                            onClick={() => setSelectedPick(player)}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/15 neon-border-orange'
                                                    : 'border-white/10 bg-white/3 hover:border-white/25'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-display font-bold text-white text-sm">{player}</span>
                                                {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                                            </div>
                                            {/* AI confidence bar */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: isSelected ? '#FF4500' : '#6B7280' }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${conf}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-mono" style={{ color: isSelected ? '#FF4500' : '#6B7280' }}>
                                                    {conf}%
                                                </span>
                                            </div>
                                            <p className="text-text-secondary text-[10px] mt-1">AI confidence</p>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Points wagering */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-text-secondary text-xs font-mono tracking-widest uppercase">Wager Points</p>
                                <span className="text-accent text-xs font-mono font-bold flex items-center gap-1">
                                    <Star size={12} /> {totalPoints} pts available
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {POINTS_OPTIONS.map(pts => (
                                    <motion.button
                                        key={pts}
                                        onClick={() => setSelectedPoints(pts)}
                                        disabled={pts > totalPoints}
                                        className={`flex-1 py-2 rounded-xl border font-display font-bold text-sm transition-all ${
                                            selectedPoints === pts
                                                ? 'border-secondary bg-secondary/15 text-secondary'
                                                : pts > totalPoints
                                                    ? 'border-white/5 text-white/20 cursor-not-allowed'
                                                    : 'border-white/15 text-text-secondary hover:border-white/30'
                                        }`}
                                        whileHover={pts <= totalPoints ? { scale: 1.04 } : {}}
                                        whileTap={pts <= totalPoints ? { scale: 0.97 } : {}}
                                    >
                                        {pts}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <AnimatePresence mode="wait">
                            {justPredicted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-3 py-3 rounded-xl bg-success/15 border border-success/30"
                                >
                                    <CheckCircle2 size={20} className="text-success" />
                                    <span className="text-success font-display font-bold">Prediction Locked In! 🎯</span>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="submit"
                                    onClick={handlePredict}
                                    disabled={!selectedPick || isAnalyzing || selectedPoints > totalPoints}
                                    className={`btn-primary btn-glow-sweep w-full py-3 flex items-center justify-center gap-2 ${
                                        (!selectedPick || isAnalyzing || selectedPoints > totalPoints)
                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                            : ''
                                    }`}
                                    whileHover={selectedPick && !isAnalyzing ? { scale: 1.02 } : {}}
                                    whileTap={selectedPick && !isAnalyzing ? { scale: 0.98 } : {}}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Brain size={18} className="animate-pulse" />
                                            <span>AI Analyzing...</span>
                                            <div className="flex gap-1">
                                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
                                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
                                                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={18} />
                                            LOCK IN PREDICTION ({selectedPoints} pts)
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Leaderboard & Stats sidebar */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        {/* Points balance */}
                        <div className="glass-ultra border border-accent/20 rounded-2xl p-5 text-center neon-border-cyan">
                            <Star size={24} className="text-accent mx-auto mb-2" />
                            <p className="text-accent font-accent text-4xl">{totalPoints}</p>
                            <p className="text-text-secondary text-xs font-mono mt-1">PREDICTION POINTS</p>
                            <p className="text-text-secondary text-[11px] mt-2 leading-relaxed">
                                Earn 500 pts daily. Win 3× your wager when correct!
                            </p>
                        </div>

                        {/* Recent predictions */}
                        {predictions.length > 0 && (
                            <div className="glass-ultra border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp size={16} className="text-primary" />
                                    <p className="font-display font-bold text-white text-sm">My Predictions</p>
                                </div>
                                <div className="space-y-3">
                                    {predictions.map((pred, i) => (
                                        <motion.div
                                            key={`${pred.tournamentId}-${pred.timestamp}`}
                                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                        >
                                            <div>
                                                <p className="text-white text-xs font-bold">{pred.pick}</p>
                                                <p className="text-text-secondary text-[10px]">Wagered {pred.points} pts</p>
                                            </div>
                                            <span className="badge-upcoming text-[10px]">PENDING</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* How it works */}
                        <div className="glass-surface border border-white/8 rounded-2xl p-5">
                            <p className="font-display font-bold text-white text-sm mb-3 flex items-center gap-2">
                                <Trophy size={14} className="text-secondary" /> How It Works
                            </p>
                            <ul className="space-y-2 text-text-secondary text-xs leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">①</span>
                                    Pick a team/player you think will win
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-secondary mt-0.5">②</span>
                                    Wager your prediction points
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-0.5">③</span>
                                    Win 3× points if correct! 🎉
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                <div className="section-divider mt-12" />
            </div>
        </section>
    );
};

export default AiPredictor;
