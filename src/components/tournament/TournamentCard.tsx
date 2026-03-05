import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Clock, ChevronRight, Flame, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tournament } from '../../types';
import CountdownTimer from '../ui/CountdownTimer';
import { formatCurrency, getSlotsColor, getSlotsLabel } from '../../utils/formatters';

// Placeholder banners for demo
const BANNER_COLORS = [
    'linear-gradient(135deg, #FF4500, #FF8C00)',
    'linear-gradient(135deg, #FFD700, #FF8C00)',
    'linear-gradient(135deg, #00E5FF, #0A0A0F)',
    'linear-gradient(135deg, #FF1744, #FF4500)',
];

interface TournamentCardProps {
    tournament: Tournament;
    onRegister?: (t: Tournament) => void;
    compact?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament: t, onRegister, compact }) => {
    const slotsColor = getSlotsColor(t.filledSlots, t.maxSlots);
    const slotsLabel = getSlotsLabel(t.filledSlots, t.maxSlots);
    const isFull = t.filledSlots >= t.maxSlots;
    const fillPct = Math.min((t.filledSlots / t.maxSlots) * 100, 100);
    const bannerGradient = BANNER_COLORS[t.id.charCodeAt(0) % BANNER_COLORS.length] ?? BANNER_COLORS[0];

    // HOT badge: slots > 70% filled and not yet full (additive logic)
    const isHot = !isFull && fillPct >= 70;

    const StatusBadge = () => {
        const cls =
            t.status === 'LIVE' ? 'badge-live' :
                t.status === 'UPCOMING' ? 'badge-upcoming' :
                    t.status === 'COMPLETED' ? 'badge-completed' : 'badge-upcoming';
        return (
            <span className={cls}>
                {t.status === 'LIVE' && <span className="live-dot mr-1" style={{ width: 6, height: 6 }} />}
                {t.status}
            </span>
        );
    };

    return (
        <motion.div
            className="card-glass holo-card overflow-hidden flex flex-col"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
        >
            {/* Banner */}
            <div className="relative h-36 xl:h-40 overflow-hidden scanlines">
                {t.banner ? (
                    <img src={t.banner} alt={t.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: bannerGradient }}>
                        <span className="text-5xl animate-trophy-shine">🏆</span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card/95 via-bg-card/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <StatusBadge />
                    <span className={`badge-${t.mode.toLowerCase()}`}>{t.mode}</span>
                </div>

                {/* Top right badges */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    {t.isFeatured && (
                        <span className="bg-secondary/20 border border-secondary/50 text-secondary text-[10px] font-bold rounded-full px-2 py-1">
                            ⭐ FEATURED
                        </span>
                    )}
                    {/* HOT badge — additive */}
                    {isHot && (
                        <span className="badge-hot flex items-center gap-1">
                            <Flame size={10} /> HOT
                        </span>
                    )}
                </div>

                {/* View count (decorative, additive) */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/60 text-[11px] font-mono">
                    <Eye size={11} />
                    <span>{Math.floor(Math.random() * 400 + 100)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="card-title text-white font-display font-bold leading-tight line-clamp-2">{t.title}</h3>

                <div className="flex items-center gap-4 text-text-secondary text-xs">
                    <span className="flex items-center gap-1"><MapPin size={12} />{t.map}</span>
                    <span className="flex items-center gap-1"><Users size={12} />{t.mode}</span>
                </div>

                {/* Prize & Entry */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div
                        className="bg-secondary/10 rounded-xl p-2.5 text-center border border-secondary/20"
                        whileHover={{ borderColor: 'rgba(255,215,0,0.5)', boxShadow: '0 0 16px rgba(255,215,0,0.15)' }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="text-secondary font-bold font-display" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
                            {formatCurrency(t.prizePool)}
                        </p>
                        <p className="text-text-secondary text-[10px] tracking-wide">PRIZE POOL</p>
                    </motion.div>
                    <motion.div
                        className="bg-primary/10 rounded-xl p-2.5 text-center border border-primary/20"
                        whileHover={{ borderColor: 'rgba(255,69,0,0.5)', boxShadow: '0 0 16px rgba(255,69,0,0.15)' }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="text-primary font-bold font-display" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
                            {t.entryFee === 0 ? 'FREE' : formatCurrency(t.entryFee)}
                        </p>
                        <p className="text-text-secondary text-[10px] tracking-wide">ENTRY FEE</p>
                    </motion.div>
                </div>

                {/* Slots with animated fill */}
                <div>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-text-secondary">Slots</span>
                        <span style={{ color: slotsColor }} className="font-bold font-mono">{slotsLabel}</span>
                    </div>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPct}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-right text-[10px] text-text-secondary mt-0.5 font-mono">{t.filledSlots}/{t.maxSlots}</p>
                </div>

                {/* Countdown */}
                {!compact && t.status === 'UPCOMING' && (
                    <div className="glass-surface rounded-xl p-2.5 border border-white/8">
                        <p className="text-text-secondary text-[10px] tracking-widest mb-1">STARTS IN</p>
                        <CountdownTimer targetDate={t.startDateTime} compact />
                    </div>
                )}

                {/* CTA */}
                <div className="mt-auto flex gap-2">
                    <Link to={`/tournaments/${t.id}`} className="flex-1">
                        <button className="btn-secondary w-full text-sm py-2.5">DETAILS</button>
                    </Link>
                    {t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                        <motion.button
                            className={`flex-1 btn-primary btn-glow-sweep text-sm py-2.5 ${isFull ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            onClick={() => !isFull && onRegister?.(t)}
                            whileHover={!isFull ? { scale: 1.03 } : {}}
                            whileTap={!isFull ? { scale: 0.97 } : {}}
                        >
                            {isFull ? 'FULL' : t.status === 'LIVE' ? '⚡ JOIN NOW' : 'REGISTER'}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TournamentCard;
