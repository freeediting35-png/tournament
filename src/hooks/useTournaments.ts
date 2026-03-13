import { useEffect, useState, useRef } from 'react';
import { subscribeTournaments } from '../services/tournamentService';
import { useTournamentStore } from '../store/tournamentStore';

export const useTournaments = () => {
    const { tournaments, loading, setTournaments, setLoading } = useTournamentStore();
    const [error, setError] = useState<string | null>(null);
    const resolvedRef = useRef(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        resolvedRef.current = false;

        // Timeout fallback — if Firestore doesn't respond within 5s, stop loading
        const timeout = setTimeout(() => {
            if (!resolvedRef.current) {
                console.warn('[useTournaments] Firestore did not respond in 5s, showing empty state');
                resolvedRef.current = true;
                setTournaments([]);
            }
        }, 5000);

        const unsub = subscribeTournaments(
            ts => {
                resolvedRef.current = true;
                clearTimeout(timeout);
                setTournaments(ts);
            },
            err => {
                resolvedRef.current = true;
                clearTimeout(timeout);
                console.error('[useTournaments] Firestore error:', err.message);
                setError(err.message);
                setTournaments([]);
            }
        );

        return () => {
            clearTimeout(timeout);
            unsub();
        };
    }, []);

    return { tournaments, loading, error };
};
