import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, BadgeIndianRupee, Star } from 'lucide-react';

const STATS = [
    { icon: Users, value: 50000, suffix: '+', label: 'Registered Players', color: '#FF4500' },
    { icon: Trophy, value: 1200, suffix: '+', label: 'Tournaments Hosted', color: '#FFD700' },
    { icon: BadgeIndianRupee, value: 1000000, suffix: '+', label: 'Prizes Distributed (₹)', color: '#00C853' },
    { icon: Star, value: 4.9, suffix: '/5', label: 'Player Satisfaction', color: '#00E5FF' },
];

const useCountUp = (target: number, duration = 2000, started: boolean) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!started) return;
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [started, target, duration]);
    return count;
};

const StatCard: React.FC<{ stat: typeof STATS[0]; started: boolean; delay: number }> = ({ stat, started, delay }) => {
    const count = useCountUp(stat.value, 2000, started);
    const display =
        stat.value >= 1000000
            ? `₹${(count / 100000).toFixed(0)}L`
            : stat.value > 1000
                ? `${(count / 1000).toFixed(0)}K`
                : stat.value < 10
                    ? count.toFixed(1)
                    : count.toLocaleString('en-IN');

    return (
        <motion.div
            className="card-glass p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
        >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}
            >
                <stat.icon size={26} style={{ color: stat.color }} />
            </div>
            <div
                className="font-accent text-4xl xl:text-5xl mb-1"
                style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}80` }}
            >
                {display}{stat.suffix}
            </div>
            <p className="text-text-secondary text-sm font-semibold tracking-wide">{stat.label}</p>
        </motion.div>
    );
};

const StatsSection: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            className="py-20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.05) 0%, transparent 50%, rgba(255,215,0,0.03) 100%)' }}
        >
            <div className="container">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-primary font-mono text-sm tracking-widest uppercase mb-2">Our Numbers</p>
                    <h2 className="section-title text-white">
                        Trusted by <span className="gradient-text">Thousands</span>
                    </h2>
                </motion.div>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                    {STATS.map((s, i) => (
                        <StatCard key={s.label} stat={s} started={started} delay={i * 0.08} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
