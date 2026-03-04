import { useEffect, useState } from 'react';
import { subscribeTournaments } from '../services/tournamentService';
import { useTournamentStore } from '../store/tournamentStore';

export const useTournaments = () => {
    const { tournaments, loading, setTournaments, setLoading } = useTournamentStore();

    useEffect(() => {
        setLoading(true);
        const unsub = subscribeTournaments(ts => setTournaments(ts));
        return unsub;
    }, []);

    return { tournaments, loading };
};
