import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import TournamentCard from '../components/tournament/TournamentCard';
import RegistrationModal from '../components/tournament/RegistrationModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FreefireIDModal from '../components/auth/FreefireIDModal';
import { useTournaments } from '../hooks/useTournaments';
import { useAuth } from '../hooks/useAuth';
import type { Tournament, TournamentMode, TournamentStatus } from '../types';

const TournamentsPage: React.FC = () => {
    const { tournaments, loading } = useTournaments();
    const { user, needsFreefireId } = useAuth();
    const [modeFilter, setModeFilter] = useState<TournamentMode | 'ALL'>('ALL');
    const [entryFilter, setEntryFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
    const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Tournament | null>(null);

    const filtered = tournaments.filter(t => {
        if (modeFilter !== 'ALL' && t.mode !== modeFilter) return false;
        if (entryFilter === 'FREE' && t.entryFee !== 0) return false;
        if (entryFilter === 'PAID' && t.entryFee === 0) return false;
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const pill = (label: string, active: boolean, onClick: () => void) => (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );

    return (
        <Layout>
            <FreefireIDModal isOpen={!!user && needsFreefireId} />
            <div className="container py-8 xl:py-12">
                <div className="mb-8">
                    <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">All Competitions</p>
                    <h1 className="section-title text-white mb-2">
                        Free Fire <span className="gradient-text">Tournaments</span>
                    </h1>
                    <p className="text-text-secondary text-sm">Browse and register for upcoming Free Fire tournaments and events.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                        <Filter size={14} className="text-text-secondary" />
                        <span className="text-text-secondary text-xs font-semibold">MODE:</span>
                    </div>
                    {(['ALL', 'SOLO', 'DUO', 'SQUAD'] as const).map(m =>
                        pill(m, modeFilter === m, () => setModeFilter(m))
                    )}
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="flex items-center text-text-secondary text-xs font-semibold bg-white/5 rounded-full px-3 py-1.5">ENTRY:</span>
                    {(['ALL', 'FREE', 'PAID'] as const).map(e =>
                        pill(e, entryFilter === e, () => setEntryFilter(e))
                    )}
                    <span className="flex items-center text-text-secondary text-xs font-semibold bg-white/5 rounded-full px-3 py-1.5 ml-2">STATUS:</span>
                    {(['ALL', 'UPCOMING', 'LIVE', 'COMPLETED'] as const).map(s =>
                        pill(s, statusFilter === s, () => setStatusFilter(s as any))
                    )}
                </div>

                {/* Search */}
                <div className="relative mb-8 max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search tournaments..."
                        className="input-field pl-11"
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size={48} message="Loading tournaments..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🏆</p>
                        <p className="text-white font-display font-bold text-xl mb-2">No tournaments found</p>
                        <p className="text-text-secondary text-sm">Try adjusting your filters or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-5">
                        {filtered.map(t => (
                            <TournamentCard key={t.id} tournament={t} onRegister={t2 => { if (user) setSelected(t2); }} />
                        ))}
                    </div>
                )}
            </div>

            {selected && (
                <RegistrationModal isOpen={true} onClose={() => setSelected(null)} tournament={selected} />
            )}
        </Layout>
    );
};

export default TournamentsPage;
