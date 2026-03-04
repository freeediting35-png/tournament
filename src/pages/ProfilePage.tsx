import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trophy, Wallet, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FreefireIDModal from '../components/auth/FreefireIDModal';
import { useAuth } from '../hooks/useAuth';
import { getUserRegistrations } from '../services/tournamentService';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Registration } from '../types';

const ProfilePage: React.FC = () => {
    const { user, needsFreefireId, login, logout } = useAuth();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingFF, setEditingFF] = useState(false);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getUserRegistrations(user.uid).then(regs => {
                setRegistrations(regs);
                setLoading(false);
            });
        }
    }, [user?.uid]);

    if (!user) {
        return (
            <Layout>
                <div className="container py-20 text-center">
                    <p className="text-6xl mb-6">👤</p>
                    <h2 className="font-display font-bold text-white text-2xl mb-3">Sign in to view your profile</h2>
                    <p className="text-text-secondary mb-6 text-sm">Connect with Google to access your tournaments, wallet, and history</p>
                    <Button variant="primary" size="lg" onClick={login} icon={<img src="https://www.google.com/favicon.ico" className="w-5 h-5" />}>
                        Sign In with Google
                    </Button>
                </div>
            </Layout>
        );
    }

    const upcoming = registrations.filter(r => r.paymentStatus === 'CONFIRMED');
    const totalSpent = registrations.reduce((acc, r) => acc + r.amountPaid, 0);

    return (
        <Layout>
            <FreefireIDModal isOpen={needsFreefireId} />
            <div className="container py-8 xl:py-12">
                {/* Profile Header */}
                <motion.div
                    className="card-glass p-6 mb-6 flex flex-col xl:flex-row items-start xl:items-center gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <img
                        src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'U')}&background=FF4500&color=fff&size=128`}
                        alt="Profile"
                        className="w-20 h-20 rounded-2xl border-2 border-primary/50"
                    />
                    <div className="flex-1">
                        <h1 className="font-display font-bold text-white text-2xl">{user.displayName}</h1>
                        <p className="text-text-secondary text-sm">{user.email}</p>
                        {user.freefireId ? (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-primary/20 border border-primary/30 text-primary rounded-full px-3 py-1 font-mono">
                                    🎮 FF UID: {user.freefireId}
                                </span>
                                <span className="text-xs bg-secondary/20 border border-secondary/30 text-secondary rounded-full px-3 py-1">
                                    {user.freefireName}
                                </span>
                                <button onClick={() => setEditingFF(true)} className="text-text-secondary hover:text-primary transition-colors">
                                    <Edit2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditingFF(true)} className="mt-2 text-primary text-sm hover:underline">
                                + Link Free Fire ID
                            </button>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Tournaments Joined', value: registrations.length, icon: Trophy, color: '#FF4500' },
                        { label: 'Total Spent', value: formatCurrency(totalSpent), icon: Wallet, color: '#FFD700' },
                        { label: 'Wallet Balance', value: formatCurrency(user.wallet ?? 0), icon: Wallet, color: '#00C853' },
                        { label: 'Upcoming', value: upcoming.length, icon: Clock, color: '#00E5FF' },
                    ].map(s => (
                        <div key={s.label} className="card-glass p-4 text-center">
                            <s.icon size={20} style={{ color: s.color }} className="mx-auto mb-2" />
                            <p className="font-display font-bold text-white text-xl">{s.value}</p>
                            <p className="text-text-secondary text-xs">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Registrations */}
                <h2 className="font-display font-bold text-white text-xl mb-4">My Registrations</h2>
                {loading ? (
                    <div className="flex justify-center py-12"><LoadingSpinner /></div>
                ) : registrations.length === 0 ? (
                    <div className="card-glass p-10 text-center">
                        <p className="text-4xl mb-3">🏆</p>
                        <p className="text-white font-bold mb-2">No tournaments joined yet</p>
                        <p className="text-text-secondary text-sm">Browse tournaments and register to see them here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto card-glass">
                        <table className="w-full text-sm min-w-[500px]">
                            <thead>
                                <tr className="text-text-secondary text-xs border-b border-white/10">
                                    <th className="text-left p-4">Tournament</th>
                                    <th className="text-left p-4">Slot</th>
                                    <th className="text-left p-4">Paid</th>
                                    <th className="text-left p-4">Method</th>
                                    <th className="text-left p-4">Date</th>
                                    <th className="text-left p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(r => (
                                    <tr key={r.id} className="border-b border-white/5">
                                        <td className="p-4 text-white font-semibold">{r.tournamentTitle}</td>
                                        <td className="p-4 text-primary font-mono font-bold">#{r.slotNumber}</td>
                                        <td className="p-4 text-secondary font-bold">{formatCurrency(r.amountPaid)}</td>
                                        <td className="p-4"><span className="badge-upcoming text-[10px]">{r.paymentMethod}</span></td>
                                        <td className="p-4 text-text-secondary text-xs">{formatDate(r.registeredAt)}</td>
                                        <td className="p-4">
                                            <span className={r.paymentStatus === 'CONFIRMED' ? 'badge-completed' : 'badge-live'}>{r.paymentStatus}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProfilePage;
