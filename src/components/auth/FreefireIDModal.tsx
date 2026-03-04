import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { getFreefireIdError, isValidFreefireName } from '../../utils/validators';

interface FreefireIDModalProps {
    isOpen: boolean;
}

const FreefireIDModal: React.FC<FreefireIDModalProps> = ({ isOpen }) => {
    const { saveFreefireId } = useAuth();
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [uidError, setUidError] = useState('');
    const [nameError, setNameError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const uidErr = getFreefireIdError(uid);
        const nameErr = !isValidFreefireName(name) ? 'Name must be 2–20 characters' : '';
        setUidError(uidErr ?? '');
        setNameError(nameErr);
        if (uidErr || nameErr) return;

        setSaving(true);
        try {
            await saveFreefireId(uid.trim(), name.trim());
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[2000] flex items-end xl:items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-full max-w-md mx-4 xl:mx-0 rounded-3xl xl:rounded-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #1A1A2E, #12121A)',
                            border: '1px solid rgba(255,69,0,0.3)',
                            boxShadow: '0 0 60px rgba(255,69,0,0.2), 0 0 120px rgba(255,69,0,0.05)',
                        }}
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div
                            className="relative p-6 text-center overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.15), rgba(255,215,0,0.05))' }}
                        >
                            <div className="flex justify-center mb-3">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                    <span className="text-4xl">🎮</span>
                                </div>
                            </div>
                            <h2 className="font-display font-bold text-2xl text-white mb-1">
                                Link Your Free Fire Account
                            </h2>
                            <p className="text-text-secondary text-sm">
                                Enter your game details to access tournaments
                            </p>
                            {/* Flame decorations */}
                            <Flame className="absolute top-4 left-4 text-primary/20" size={32} />
                            <Flame className="absolute top-4 right-4 text-primary/20" size={32} />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-text-secondary text-sm font-semibold mb-2">
                                    Free Fire UID
                                </label>
                                <input
                                    type="number"
                                    value={uid}
                                    onChange={e => { setUid(e.target.value); setUidError(''); }}
                                    placeholder="e.g. 123456789"
                                    className="input-field"
                                    inputMode="numeric"
                                />
                                {uidError && (
                                    <p className="text-danger text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {uidError}
                                    </p>
                                )}
                                <p className="text-text-secondary text-xs mt-1">
                                    8–12 digit numeric UID from your game profile
                                </p>
                            </div>

                            <div>
                                <label className="block text-text-secondary text-sm font-semibold mb-2">
                                    In-Game Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => { setName(e.target.value); setNameError(''); }}
                                    placeholder="Your Free Fire username"
                                    className="input-field"
                                    maxLength={20}
                                />
                                {nameError && (
                                    <p className="text-danger text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {nameError}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl p-3">
                                <Shield size={16} className="text-accent shrink-0 mt-0.5" />
                                <p className="text-text-secondary text-xs leading-relaxed">
                                    Your Free Fire UID is used to verify your identity in tournaments. We never access your game account.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={saving}
                                size="lg"
                            >
                                🔥 VERIFY & CONTINUE
                            </Button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FreefireIDModal;
