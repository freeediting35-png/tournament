import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Arjun Sharma',
        ffId: '12345678',
        avatar: 'AS',
        rating: 5,
        color: '#FF4500',
        quote: 'BlazeFire Arena is legit! Won ₹2000 in my first squad tournament. Payment came in 24 hours via Fampay. Highly recommended!',
        detail: 'Squad Champion, March 2025',
    },
    {
        name: 'Rahul Verma',
        ffId: '98765432',
        avatar: 'RV',
        rating: 5,
        color: '#FFD700',
        quote: 'Maine free tournament join kiya aur ₹500 jeeta. Website pe koi bhi cheez complicated nahi hai. Bahut easy registration!',
        detail: 'Solo Winner, Feb 2025',
    },
    {
        name: 'Priya Singh',
        ffId: '55544433',
        avatar: 'PS',
        rating: 5,
        color: '#00E5FF',
        quote: 'As a girl gamer, I was skeptical at first. But BlazeFire Arena is 100% transparent. Room ID was sent exactly on time. Love it!',
        detail: 'Duo Finalist, Jan 2025',
    },
];

const TestimonialsSection: React.FC = () => (
    <section className="py-20">
        <div className="container">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <p className="text-primary font-mono text-sm tracking-widest uppercase mb-2">Community</p>
                <h2 className="section-title text-white">
                    What Players <span className="gradient-text">Say</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        className="card-glass p-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                            {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} size={16} fill="#FFD700" className="text-secondary" />
                            ))}
                        </div>
                        {/* Quote */}
                        <p className="text-text-secondary text-sm leading-relaxed mb-5 italic">
                            "{t.quote}"
                        </p>
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white"
                                style={{ background: `${t.color}40`, border: `2px solid ${t.color}` }}
                            >
                                {t.avatar}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{t.name}</p>
                                <p className="text-text-secondary text-xs font-mono">FF UID: {t.ffId}</p>
                                <p className="text-text-secondary text-xs">{t.detail}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default TestimonialsSection;
