import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Gamepad2, Trophy, CreditCard, DoorOpen, Medal } from 'lucide-react';

const STEPS = [
    { icon: LogIn, color: '#FF4500', title: 'Sign In with Google', desc: 'Secure one-click login. No passwords needed.' },
    { icon: Gamepad2, color: '#FFD700', title: 'Enter Free Fire UID', desc: 'Link your game account to verify identity.' },
    { icon: Trophy, color: '#00E5FF', title: 'Choose a Tournament', desc: 'Browse upcoming, live, and free tournaments.' },
    { icon: CreditCard, color: '#00C853', title: 'Pay Entry Fee', desc: 'Pay via Fampay, gift card, or redeem code.' },
    { icon: DoorOpen, color: '#FF8C00', title: 'Get Room ID', desc: 'Room credentials pushed 1 hour before match.' },
    { icon: Medal, color: '#FFD700', title: 'Play & Win Prizes!', desc: 'Win real cash paid to your Fampay account.' },
];

const HowItWorks: React.FC = () => (
    <section className="py-20 bg-bg-surface/30">
        <div className="container">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <p className="text-primary font-mono text-sm tracking-widest uppercase mb-2">Simple Process</p>
                <h2 className="section-title text-white">
                    How It <span className="gradient-text">Works</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-6 relative">
                {STEPS.map((step, i) => (
                    <motion.div
                        key={step.title}
                        className="flex gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-accent text-lg"
                                style={{ background: `${step.color}20`, border: `2px solid ${step.color}60`, color: step.color }}
                            >
                                {i + 1}
                            </div>
                            {i < STEPS.length - 1 && <div className="w-0.5 flex-1 mt-2 bg-gradient-to-b from-white/10 to-transparent hidden 3xl:block" />}
                        </div>
                        <div className="pb-6">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                                style={{ background: `${step.color}15` }}
                            >
                                <step.icon size={20} style={{ color: step.color }} />
                            </div>
                            <h3 className="font-display font-bold text-white text-lg mb-1">{step.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;
