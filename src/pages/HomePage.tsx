import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import LiveTournaments from '../components/home/LiveTournaments';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import TestimonialsSection from '../components/home/TestimonialsSection';
import RegistrationModal from '../components/tournament/RegistrationModal';
import FreefireIDModal from '../components/auth/FreefireIDModal';
import { useAuth } from '../hooks/useAuth';
import type { Tournament } from '../types';

const HomePage: React.FC = () => {
    const { user, needsFreefireId } = useAuth();
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

    const handleRegister = (t: Tournament) => {
        if (!user) return;
        setSelectedTournament(t);
    };

    return (
        <Layout>
            <FreefireIDModal isOpen={!!user && needsFreefireId} />
            <HeroSection />
            <LiveTournaments onRegister={handleRegister} />
            <FeaturesSection />
            <HowItWorks />
            <StatsSection />
            <TestimonialsSection />
            {selectedTournament && (
                <RegistrationModal
                    isOpen={true}
                    onClose={() => setSelectedTournament(null)}
                    tournament={selectedTournament}
                />
            )}
        </Layout>
    );
};

export default HomePage;
