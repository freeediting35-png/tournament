import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Trophy, Plus, Gift, Ticket,
    CreditCard, Bell, Users, LogOut, Menu, X,
    TrendingUp, Eye, Download, Send, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTournaments } from '../../hooks/useTournaments';
import { getTournamentRegistrations, createTournament, releaseRoomId } from '../../services/tournamentService';
import { useUIStore } from '../../store/uiStore';
import Button from '../ui/Button';
import type { Tournament, Registration } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { GAME_MAPS, TOURNAMENT_MODES } from '../../constants/gameRules';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── Sidebar Navigation ────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'create', label: 'Create Tournament', icon: Plus },
    { id: 'giftcards', label: 'Gift Cards', icon: Gift },
    { id: 'redeem', label: 'Redeem Codes', icon: Ticket },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'Users', icon: Users },
];

// ── Overview Tab ──────────────────────────────────────────
const OverviewTab: React.FC<{ tournaments: Tournament[] }> = ({ tournaments }) => {
    const stats = [
        { label: 'Total Users', value: '—', icon: Users, color: '#FF4500' },
        { label: 'Active Tournaments', value: tournaments.filter(t => t.status !== 'COMPLETED').length, icon: Trophy, color: '#FFD700' },
        { label: 'Total Registrations', value: '—', icon: CheckCircle, color: '#00C853' },
        { label: 'Total Revenue', value: '—', icon: TrendingUp, color: '#00E5FF' },
    ];
    const pieData = [
        { name: 'Fampay', value: 60, color: '#FF4500' },
        { name: 'Gift Card', value: 20, color: '#FFD700' },
        { name: 'Redeem', value: 10, color: '#00E5FF' },
        { name: 'Wallet', value: 10, color: '#00C853' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="card-glass p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-text-secondary text-xs mb-1">{s.label}</p>
                                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                                <s.icon size={20} style={{ color: s.color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="card-glass p-5">
                    <h3 className="font-display font-bold text-white mb-4">Payment Methods Breakdown</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {pieData.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                                <span className="text-text-secondary text-xs">{d.name}: {d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-glass p-5">
                    <h3 className="font-display font-bold text-white mb-4">Recent Tournaments</h3>
                    <div className="space-y-2 overflow-x-auto">
                        <table className="w-full text-sm min-w-[400px]">
                            <thead>
                                <tr className="text-text-secondary text-xs">
                                    <th className="text-left pb-2">Tournament</th>
                                    <th className="text-left pb-2">Mode</th>
                                    <th className="text-left pb-2">Status</th>
                                    <th className="text-right pb-2">Prize</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournaments.slice(0, 5).map(t => (
                                    <tr key={t.id} className="border-t border-white/5">
                                        <td className="py-2 text-white truncate max-w-[150px]">{t.title}</td>
                                        <td className="py-2"><span className={`badge-${t.mode.toLowerCase()}`}>{t.mode}</span></td>
                                        <td className="py-2"><span className={`badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                                        <td className="py-2 text-right text-secondary font-bold">{formatCurrency(t.prizePool)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Tournaments Tab ───────────────────────────────────────
const TournamentsTab: React.FC<{ tournaments: Tournament[] }> = ({ tournaments }) => {
    const [selected, setSelected] = useState<Tournament | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [roomId, setRoomId] = useState('');
    const [roomPass, setRoomPass] = useState('');
    const addToast = useUIStore(s => s.addToast);
    const adminToken = useAuthStore(s => s.adminToken);

    const loadRegistrations = async (t: Tournament) => {
        setSelected(t);
        const regs = await getTournamentRegistrations(t.id);
        setRegistrations(regs);
    };

    const handleReleaseRoom = async () => {
        if (!selected || !roomId || !roomPass) return;
        await releaseRoomId(selected.id, roomId, roomPass);
        addToast({ type: 'success', message: 'Room ID released! Participants notified.' });
    };

    const exportCSV = () => {
        if (!registrations.length) return;
        const headers = ['Slot', 'Name', 'FF ID', 'FF Name', 'Team', 'Payment', 'Amount', 'Date'];
        const rows = registrations.map(r => [r.slotNumber, r.userDisplayName, r.freefireId, r.freefireName, r.teamName ?? '-', r.paymentMethod, r.amountPaid, r.registeredAt]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${selected?.title ?? 'tournament'}_participants.csv`; a.click();
    };

    if (selected) return (
        <div>
            <button onClick={() => setSelected(null)} className="btn-secondary mb-4 text-sm px-4 py-2">← Back to List</button>
            <div className="card-glass p-6 mb-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-display font-bold text-white text-xl">{selected.title}</h2>
                        <p className="text-text-secondary text-sm">{selected.mode} · {selected.map} · {formatDate(selected.startDateTime)}</p>
                    </div>
                    <Button onClick={exportCSV} variant="secondary" size="sm" icon={<Download size={16} />}>Export CSV</Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-primary font-bold text-xl font-display">{selected.filledSlots}</p>
                        <p className="text-text-secondary text-xs">Registered</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-secondary font-bold text-xl font-display">{selected.maxSlots - selected.filledSlots}</p>
                        <p className="text-text-secondary text-xs">Slots Left</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-success font-bold text-xl font-display">{formatCurrency(selected.prizePool)}</p>
                        <p className="text-text-secondary text-xs">Prize Pool</p>
                    </div>
                </div>

                {/* Release Room ID */}
                {!selected.roomId && (
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-4">
                        <h3 className="font-display font-bold text-warning mb-3 text-sm">Release Room ID</h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Room ID" className="input-field text-sm" />
                            <input type="text" value={roomPass} onChange={e => setRoomPass(e.target.value)} placeholder="Password" className="input-field text-sm" />
                        </div>
                        <Button variant="primary" size="sm" onClick={handleReleaseRoom} disabled={!roomId || !roomPass}>
                            🚪 Release Room ID & Notify Players
                        </Button>
                    </div>
                )}
                {selected.roomId && (
                    <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
                        <p className="text-success font-bold text-sm">✅ Room ID Released</p>
                        <p className="text-white font-mono text-sm mt-1">ID: {selected.roomId} | Pass: {selected.roomPassword}</p>
                    </div>
                )}
            </div>

            {/* Participants list */}
            <div className="card-glass p-5">
                <h3 className="font-display font-bold text-white mb-4">Participants ({registrations.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            <tr className="text-text-secondary text-xs border-b border-white/10">
                                <th className="text-left pb-3">Slot</th>
                                <th className="text-left pb-3">Name</th>
                                <th className="text-left pb-3">FF UID</th>
                                <th className="text-left pb-3">Team</th>
                                <th className="text-left pb-3">Payment</th>
                                <th className="text-left pb-3">Amount</th>
                                <th className="text-left pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(r => (
                                <tr key={r.id} className="border-b border-white/5">
                                    <td className="py-2.5 text-primary font-bold font-mono">#{r.slotNumber}</td>
                                    <td className="py-2.5 text-white">{r.userDisplayName}</td>
                                    <td className="py-2.5 text-text-secondary font-mono">{r.freefireId}</td>
                                    <td className="py-2.5 text-text-secondary">{r.teamName ?? '—'}</td>
                                    <td className="py-2.5"><span className="badge-upcoming text-[10px]">{r.paymentMethod}</span></td>
                                    <td className="py-2.5 text-secondary font-bold">{formatCurrency(r.amountPaid)}</td>
                                    <td className="py-2.5">
                                        {r.paymentStatus === 'CONFIRMED'
                                            ? <CheckCircle size={16} className="text-success" />
                                            : <XCircle size={16} className="text-danger" />
                                        }
                                    </td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr><td colSpan={7} className="py-8 text-center text-text-secondary">No participants yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="font-display font-bold text-white text-xl mb-4">All Tournaments</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead>
                        <tr className="text-text-secondary text-xs border-b border-white/10">
                            <th className="text-left pb-3">Title</th>
                            <th className="text-left pb-3">Mode</th>
                            <th className="text-left pb-3">Status</th>
                            <th className="text-left pb-3">Slots</th>
                            <th className="text-left pb-3">Prize</th>
                            <th className="text-left pb-3">Entry</th>
                            <th className="text-left pb-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tournaments.map(t => (
                            <tr key={t.id} className="border-b border-white/5">
                                <td className="py-3 text-white font-semibold max-w-[200px] truncate">{t.title}</td>
                                <td className="py-3"><span className={`badge-${t.mode.toLowerCase()}`}>{t.mode}</span></td>
                                <td className="py-3"><span className={`badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                                <td className="py-3 text-text-secondary">{t.filledSlots}/{t.maxSlots}</td>
                                <td className="py-3 text-secondary font-bold">{formatCurrency(t.prizePool)}</td>
                                <td className="py-3 text-primary font-bold">{t.entryFee === 0 ? 'FREE' : formatCurrency(t.entryFee)}</td>
                                <td className="py-3"><button onClick={() => loadRegistrations(t)} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"><Eye size={12} />View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ── Create Tournament Form ────────────────────────────────
const CreateTournamentTab: React.FC = () => {
    const addToast = useUIStore(s => s.addToast);
    const adminToken = useAuthStore(s => s.adminToken);
    const [loading, setLoading] = useState(false);
    const [prizes, setPrizes] = useState([{ rank: 1, prize: '' }, { rank: 2, prize: '' }, { rank: 3, prize: '' }]);
    const [rules, setRules] = useState(['Players must join within 5 minutes of room ID release.']);
    const [form, setForm] = useState({
        title: '', mode: 'SQUAD', map: 'Bermuda', entryFee: 0, prizePool: 0,
        maxSlots: 100, startDateTime: '', registrationDeadline: '',
        roomIdReleaseTime: '', isFeatured: false, type: 'TOURNAMENT' as 'TOURNAMENT' | 'EVENT',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.startDateTime || !form.registrationDeadline) {
            addToast({ type: 'error', message: 'Please fill all required fields' });
            return;
        }
        setLoading(true);
        try {
            await createTournament({
                ...form,
                game: 'FREE_FIRE',
                prizeDistribution: prizes.filter(p => p.prize),
                rules: rules.filter(r => r.trim()),
                filledSlots: 0,
                registeredPlayers: [],
                status: 'UPCOMING',
                banner: '',
                createdBy: 'ADMIN',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any);
            addToast({ type: 'success', message: 'Tournament created! Players notified 🔥' });
            setForm({ title: '', mode: 'SQUAD', map: 'Bermuda', entryFee: 0, prizePool: 0, maxSlots: 100, startDateTime: '', registrationDeadline: '', roomIdReleaseTime: '', isFeatured: false, type: 'TOURNAMENT' });
        } catch {
            addToast({ type: 'error', message: 'Failed to create tournament' });
        }
        setLoading(false);
    };

    const F = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
        <div>
            <label className="block text-text-secondary text-sm font-semibold mb-2">{label}{required && <span className="text-primary ml-1">*</span>}</label>
            {children}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
            <h2 className="font-display font-bold text-white text-xl mb-2">Create New Tournament</h2>

            <F label="Tournament Title" required>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. BlazeFire Grand Slam #15" className="input-field" />
            </F>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <F label="Mode" required>
                    <select value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value as any }))} className="input-field">
                        {TOURNAMENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </F>
                <F label="Map" required>
                    <select value={form.map} onChange={e => setForm(f => ({ ...f, map: e.target.value as any }))} className="input-field">
                        {GAME_MAPS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </F>
                <F label="Type">
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="input-field">
                        <option value="TOURNAMENT">Tournament</option>
                        <option value="EVENT">Event</option>
                    </select>
                </F>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <F label="Entry Fee (₹)" required>
                    <input type="number" min={0} value={form.entryFee} onChange={e => setForm(f => ({ ...f, entryFee: Number(e.target.value) }))} className="input-field" />
                </F>
                <F label="Prize Pool (₹)" required>
                    <input type="number" min={0} value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: Number(e.target.value) }))} className="input-field" />
                </F>
                <F label="Max Slots" required>
                    <input type="number" min={2} max={1000} value={form.maxSlots} onChange={e => setForm(f => ({ ...f, maxSlots: Number(e.target.value) }))} className="input-field" />
                </F>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <F label="Start Date & Time" required>
                    <input type="datetime-local" value={form.startDateTime} onChange={e => setForm(f => ({ ...f, startDateTime: new Date(e.target.value).toISOString() }))} className="input-field" style={{ colorScheme: 'dark' }} />
                </F>
                <F label="Registration Deadline" required>
                    <input type="datetime-local" value={form.registrationDeadline} onChange={e => setForm(f => ({ ...f, registrationDeadline: new Date(e.target.value).toISOString() }))} className="input-field" style={{ colorScheme: 'dark' }} />
                </F>
                <F label="Room ID Release Time">
                    <input type="datetime-local" value={form.roomIdReleaseTime} onChange={e => setForm(f => ({ ...f, roomIdReleaseTime: new Date(e.target.value).toISOString() }))} className="input-field" style={{ colorScheme: 'dark' }} />
                </F>
            </div>

            {/* Prize Distribution */}
            <F label="Prize Distribution">
                <div className="space-y-2">
                    {prizes.map((p, i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <span className="text-text-secondary text-sm w-16 shrink-0">Rank #{p.rank}</span>
                            <input type="text" value={p.prize} onChange={e => setPrizes(ps => ps.map((pp, j) => j === i ? { ...pp, prize: e.target.value } : pp))} placeholder="e.g. ₹5000 or 3000 Diamonds" className="input-field flex-1 text-sm" />
                        </div>
                    ))}
                    <button type="button" onClick={() => setPrizes(ps => [...ps, { rank: ps.length + 1, prize: '' }])} className="text-primary text-sm hover:underline">+ Add Rank</button>
                </div>
            </F>

            {/* Rules */}
            <F label="Tournament Rules">
                <div className="space-y-2">
                    {rules.map((r, i) => (
                        <div key={i} className="flex gap-2">
                            <input type="text" value={r} onChange={e => setRules(rs => rs.map((rr, j) => j === i ? e.target.value : rr))} className="input-field flex-1 text-sm" />
                            <button type="button" onClick={() => setRules(rs => rs.filter((_, j) => j !== i))} className="text-danger hover:opacity-70"><X size={16} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setRules(rs => [...rs, ''])} className="text-primary text-sm hover:underline">+ Add Rule</button>
                </div>
            </F>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))} className={`w-12 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-primary' : 'bg-white/20'}`}>
                    <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${form.isFeatured ? 'translate-x-6' : ''}`} />
                </button>
                <span className="text-text-secondary text-sm">Mark as Featured (shown prominently)</span>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading}>
                🔥 CREATE TOURNAMENT & NOTIFY PLAYERS
            </Button>
        </form>
    );
};

// ── Notifications Tab ─────────────────────────────────────
const NotificationsTab: React.FC = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const addToast = useUIStore(s => s.addToast);
    const adminToken = useAuthStore(s => s.adminToken);

    const sendNotification = async () => {
        if (!title || !body) { addToast({ type: 'error', message: 'Fill in title and message' }); return; }
        setLoading(true);
        try {
            await fetch('/api/admin/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
                body: JSON.stringify({ title, body, target: 'ALL' }),
            });
            addToast({ type: 'success', message: 'Notification sent to all users!' });
            setTitle(''); setBody('');
        } catch {
            addToast({ type: 'error', message: 'Failed to send notification' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl space-y-5">
            <h2 className="font-display font-bold text-white text-xl">Send Notification</h2>
            <div>
                <label className="block text-text-secondary text-sm font-semibold mb-2">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="🔥 New Tournament!" className="input-field" />
            </div>
            <div>
                <label className="block text-text-secondary text-sm font-semibold mb-2">Message</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Notification body..." className="input-field min-h-[100px] resize-none" rows={4} />
            </div>
            <Button variant="primary" fullWidth onClick={sendNotification} loading={loading} icon={<Send size={18} />}>
                SEND TO ALL USERS
            </Button>
        </div>
    );
};

// ── Main Dashboard ────────────────────────────────────────
const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { tournaments } = useTournaments();
    const clearAuth = useAuthStore(s => s.clearAuth);
    const setAdminToken = useAuthStore(s => s.setAdminToken);

    const handleLogout = () => { setAdminToken(null); clearAuth(); };

    const renderTab = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab tournaments={tournaments} />;
            case 'tournaments': return <TournamentsTab tournaments={tournaments} />;
            case 'create': return <CreateTournamentTab />;
            case 'notifications': return <NotificationsTab />;
            default: return (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🚧</p>
                    <p className="text-text-secondary">This section coming soon</p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex">
            {/* Mobile overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 xl:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`fixed xl:relative top-0 left-0 h-full z-50 w-64 bg-bg-card border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}`}>
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                        <p className="font-display font-bold text-white text-lg leading-tight">BlazeFire</p>
                        <p className="text-primary text-xs font-mono tracking-wider">ADMIN PANEL</p>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-primary/15 text-primary border border-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                {/* Top bar (mobile) */}
                <div className="xl:hidden flex items-center gap-3 p-4 border-b border-white/5 bg-bg-card">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5"><Menu size={20} /></button>
                    <div>
                        <p className="font-display font-bold text-white">BlazeFire Admin</p>
                        <p className="text-primary text-xs font-mono">{TABS.find(t => t.id === activeTab)?.label}</p>
                    </div>
                </div>

                <div className="p-5 xl:p-8">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {renderTab()}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
