import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import TournamentCard from '../components/tournament/TournamentCard';
import RegistrationModal from '../components/tournament/RegistrationModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FreefireIDModal from '../components/auth/FreefireIDModal';
import { useTournaments } from '../hooks/useTournaments';
import { useAuth } from '../hooks/useAuth';
import type { Tournament } from '../types';

const EventsPage: React.FC = () => {
    const { tournaments, loading } = useTournaments();
    const { user, needsFreefireId } = useAuth();
    const [selected, setSelected] = useState<Tournament | null>(null);

    const events = tournaments.filter(t => t.type === 'EVENT');

    return (
        <Layout>
            <FreefireIDModal isOpen={!!user && needsFreefireId} />
            <div className="container py-8 xl:py-12">
                <div className="mb-8">
                    <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Special Events</p>
                    <h1 className="section-title text-white mb-2">
                        Free Fire <span className="gradient-text">Events</span>
                    </h1>
                    <p className="text-text-secondary text-sm">Special events with unique rules, free entries, and exclusive prizes.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size={48} message="Loading events..." /></div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🎮</p>
                        <p className="text-white font-display font-bold text-xl mb-2">No events at the moment</p>
                        <p className="text-text-secondary text-sm">Check back soon — new events are added weekly!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-5">
                        {events.map(t => (
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

export default EventsPage;
