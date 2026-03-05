import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Send, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => (
    <footer className="bg-bg-card border-t border-white/5 mt-20 relative overflow-hidden">
        {/* Decorative blob (additive) */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container py-12 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="xl:col-span-1">
                    <motion.div
                        className="flex items-center gap-2 mb-4"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-3xl animate-float-slow">🔥</span>
                        <div>
                            <span className="font-display font-bold text-xl gradient-text">BLAZEFIRE</span>
                            <span className="font-display font-bold text-xl text-white"> ARENA</span>
                        </div>
                    </motion.div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        India's most trusted Free Fire tournament platform. Compete, win, and dominate.
                    </p>
                    <div className="flex gap-3">
                        {[
                            { icon: Instagram, href: '#', color: '#E1306C', label: 'Instagram' },
                            { icon: Youtube, href: '#', color: '#FF0000', label: 'YouTube' },
                            { icon: MessageCircle, href: '#', color: '#5865F2', label: 'Discord' },
                            { icon: Send, href: '#', color: '#0088cc', label: 'Telegram' },
                        ].map(s => (
                            <motion.a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/8"
                                whileHover={{ scale: 1.15, borderColor: `${s.color}60`, boxShadow: `0 0 12px ${s.color}40` }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <s.icon size={18} style={{ color: s.color }} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Platform */}
                <div>
                    <h3 className="font-display font-bold text-white mb-4 tracking-wide">Platform</h3>
                    <ul className="space-y-2">
                        {[
                            ['Tournaments', '/tournaments'],
                            ['Events', '/events'],
                            ['Leaderboard', '/leaderboard'],
                            ['My Profile', '/profile'],
                        ].map(([label, href]) => (
                            <li key={label}>
                                <Link to={href} className="text-text-secondary hover:text-primary text-sm transition-colors flex items-center gap-1.5 group">
                                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="font-display font-bold text-white mb-4 tracking-wide">Legal</h3>
                    <ul className="space-y-2">
                        {[
                            'Privacy Policy',
                            'Terms & Conditions',
                            'Refund Policy',
                            'Contact Us',
                        ].map(label => (
                            <li key={label}>
                                <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors flex items-center gap-1.5 group">
                                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-display font-bold text-white mb-4 tracking-wide">Contact</h3>
                    <ul className="space-y-2 text-text-secondary text-sm">
                        <li>📧 support@blazefire.in</li>
                        <li>💬 Telegram: @BlazeFire_Arena</li>
                        <li>⏰ Support: 10 AM – 10 PM IST</li>
                    </ul>

                    {/* Live status indicator (additive) */}
                    <div className="mt-4 flex items-center gap-2 glass-surface border border-success/20 rounded-xl px-3 py-2 w-fit">
                        <span className="live-dot" style={{ width: 6, height: 6, background: '#00C853' }} />
                        <span className="text-success text-xs font-bold font-mono">ALL SYSTEMS OPERATIONAL</span>
                    </div>
                </div>
            </div>

            {/* Section divider */}
            <div className="section-divider my-8" />

            <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                <p className="text-text-secondary text-xs text-center xl:text-left">
                    © 2026 BlazeFire Arena. All Rights Reserved. Made with <Heart size={10} className="inline text-danger" fill="currentColor" /> in India.
                </p>
                <p className="text-text-secondary text-xs text-center opacity-60">
                    ⚠️ Not affiliated with Garena Free Fire or its subsidiaries. This is an independent esports platform.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
