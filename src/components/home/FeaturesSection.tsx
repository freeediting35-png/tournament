import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, Bell, Gift, Ticket, Zap } from 'lucide-react';

const FEATURES = [
    {
        icon: ShieldCheck,
        color: '#00C853',
        title: 'Google Verified Sign-In',
        desc: 'Your account is 100% secured with Google Authentication. No fake accounts allowed.',
    },
    {
        icon: Trophy,
        color: '#FFD700',
        title: 'Real Cash Prizes',
        desc: 'Win real money directly to your Fampay account. Payouts within 48 hours guaranteed.',
    },
    {
        icon: Bell,
        color: '#00E5FF',
        title: 'Instant Notifications',
        desc: 'Never miss a tournament. Get push alerts for new matches, room IDs, and results.',
    },
    {
        icon: Gift,
        color: '#FF4500',
        title: 'Free Tournaments',
        desc: 'Join free events and win prizes without spending a single rupee. For everyone.',
    },
    {
        icon: Ticket,
        color: '#FF8C00',
        title: 'Gift Cards & Redeem Codes',
        desc: 'Use exclusive gift cards and admin-generated codes for discounts and free entries.',
    },
    {
        icon: Zap,
        color: '#FFD700',
        title: 'Instant Room ID',
        desc: 'Get room credentials automatically pushed to you — right on time, every time.',
    },
];

const FeaturesSection: React.FC = () => (
    <section className="py-20" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
        <div className="container">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-primary font-mono text-sm tracking-widest uppercase mb-2">Why Choose Us</p>
                <h2 className="section-title text-white mb-4">
                    Why <span className="gradient-text">BlazeFire Arena?</span>
                </h2>
                <p className="body-text text-text-secondary max-w-xl mx-auto">
                    Built for Indian gamers, by gamers. Every feature is designed to make your tournament experience seamless and trustworthy.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-5">
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        className="card-glass p-6 flex gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
                        >
                            <f.icon size={22} style={{ color: f.color }} />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-lg mb-1">{f.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default FeaturesSection;
