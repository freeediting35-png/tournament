import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Send } from 'lucide-react';

const Footer: React.FC = () => (
    <footer className="bg-bg-card border-t border-white/5 mt-20">
        <div className="container py-12">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="xl:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl">🔥</span>
                        <div>
                            <span className="font-display font-bold text-xl gradient-text">BLAZEFIRE</span>
                            <span className="font-display font-bold text-xl text-white"> ARENA</span>
                        </div>
                    </div>
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
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <s.icon size={18} style={{ color: s.color }} />
                            </a>
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
                                <Link to={href} className="text-text-secondary hover:text-primary text-sm transition-colors">
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
                                <a href="#" className="text-text-secondary hover:text-primary text-sm transition-colors">
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
                </div>
            </div>

            <div className="border-t border-white/5 mt-10 pt-6 flex flex-col xl:flex-row items-center justify-between gap-4">
                <p className="text-text-secondary text-xs text-center xl:text-left">
                    © 2025 BlazeFire Arena. All Rights Reserved.
                </p>
                <p className="text-text-secondary text-xs text-center opacity-60">
                    ⚠️ Not affiliated with Garena Free Fire or its subsidiaries. This is an independent esports platform.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
