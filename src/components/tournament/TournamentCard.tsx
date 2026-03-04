import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Clock, ChevronRight } from 'lucide-react';
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

    const StatusBadge = () => {
        const cls =
            t.status === 'LIVE' ? 'badge-live' :
                t.status === 'UPCOMING' ? 'badge-upcoming' :
                    t.status === 'COMPLETED' ? 'badge-completed' : 'badge-upcoming';
        return (
            <span className={cls}>
                {t.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />}
                {t.status}
            </span>
        );
    };

    return (
        <motion.div
            className="card-glass overflow-hidden flex flex-col"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            {/* Banner */}
            <div className="relative h-36 xl:h-40 overflow-hidden">
                {t.banner ? (
                    <img src={t.banner} alt={t.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: bannerGradient }}>
                        <span className="text-5xl">🏆</span>
                    </div>
                )}
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge />
                    <span className={`badge-${t.mode.toLowerCase()}`}>{t.mode}</span>
                </div>
                {t.isFeatured && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-secondary/20 border border-secondary/50 text-secondary text-[10px] font-bold rounded-full px-2 py-1">
                            ⭐ FEATURED
                        </span>
                    </div>
                )}
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
                    <div className="bg-secondary/10 rounded-lg p-2 text-center border border-secondary/20">
                        <p className="text-secondary font-bold font-display" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
                            {formatCurrency(t.prizePool)}
                        </p>
                        <p className="text-text-secondary text-[10px] tracking-wide">PRIZE POOL</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-2 text-center border border-primary/20">
                        <p className="text-primary font-bold font-display" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
                            {t.entryFee === 0 ? 'FREE' : formatCurrency(t.entryFee)}
                        </p>
                        <p className="text-text-secondary text-[10px] tracking-wide">ENTRY FEE</p>
                    </div>
                </div>

                {/* Slots */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">Slots</span>
                        <span style={{ color: slotsColor }} className="font-bold">{slotsLabel}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${fillPct}%` }} />
                    </div>
                </div>

                {/* Countdown */}
                {!compact && t.status === 'UPCOMING' && (
                    <div className="bg-white/5 rounded-lg p-2">
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
                        <button
                            className={`flex-1 btn-primary text-sm py-2.5 ${isFull ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            onClick={() => !isFull && onRegister?.(t)}
                        >
                            {isFull ? 'FULL' : 'REGISTER'}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TournamentCard;
